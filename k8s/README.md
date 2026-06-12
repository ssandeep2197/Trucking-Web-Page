# Kubernetes deployment

Three ways to ship this app to your cluster:

1. **Local script** — fastest, doesn't need any CI setup
2. **GitHub Actions** — push to `main` → auto-build → auto-deploy
3. **Manual kubectl** — apply the YAMLs by hand

All three use the same manifests in this folder. The image is pushed to **GitHub Container Registry** (`ghcr.io`) by default.

---

## What you have to swap before the first deploy

There are only **two values** in the manifests that are placeholders. Open `k8s/ingress.yaml` and replace `templates.example.com` (two occurrences) with your real hostname:

```yaml
tls:
  - hosts:
      - your-domain.com         # ← swap me
    secretName: templates-showcase-tls
rules:
  - host: your-domain.com       # ← swap me
```

That's it for required edits. Optional tweaks you may want:

| File | Setting | Default | When to change |
|---|---|---|---|
| `ingress.yaml` | `ingressClassName` | `nginx` | If you use Traefik / Contour / etc. |
| `ingress.yaml` | `cert-manager.io/cluster-issuer` annotation | `letsencrypt-prod` | If your cert-manager issuer is named something else, or remove the annotation + `tls:` block if no TLS |
| `kustomization.yaml` | `namespace:` | `default` | If you want a dedicated namespace (also `kubectl create namespace …` first) |
| `deployment.yaml` | `replicas:` | `2` | Up for HA, down to `1` for tiny clusters |

---

## Path 1 — local one-shot deploy (recommended for first time)

Prereqs on your machine:
- `docker` + login to GHCR: `docker login ghcr.io` (use your GitHub username + a PAT with `write:packages`)
- `kubectl` + working kubeconfig pointing at the right cluster (verify with `kubectl get nodes`)
- `kustomize` binary (`brew install kustomize` on macOS, or download from the kustomize GitHub releases)

Then:

```bash
# from the project root
./scripts/deploy.sh
```

The script:
1. Derives your owner+repo from `git remote`, lowercased
2. Builds the Docker image, tags it `sha-<commit>` + `latest`, pushes both
3. Patches `k8s/kustomization.yaml` with the freshly-pushed image tag
4. `kubectl apply -k k8s/`
5. Waits for the rollout to be healthy
6. Prints final pods / service / ingress

Pass a custom tag if you like: `./scripts/deploy.sh v0.2.0`.

### Make the GHCR package public

The very first time you push the image, **the package is private**. Two options:

- **Easy:** GitHub → your repo → Packages tab → click the package → **Package settings** → **Change visibility** → Public.
- **Tighter:** create an `imagePullSecret` and reference it in the Deployment. Run:
  ```bash
  kubectl create secret docker-registry ghcr-pull \
    --docker-server=ghcr.io \
    --docker-username=<github-user> \
    --docker-password=<pat-with-read:packages> \
    --docker-email=you@example.com
  ```
  Then add to `deployment.yaml` under `spec.template.spec`:
  ```yaml
  imagePullSecrets:
    - name: ghcr-pull
  ```

---

## Path 2 — GitHub Actions auto-deploy on push

After Path 1 works once, switch to push-to-deploy. The workflow `.github/workflows/deploy.yml` is already in the repo.

### One secret to add

In **GitHub → Settings → Secrets and variables → Actions → New repository secret**:

| Name | Value |
|---|---|
| **`KUBECONFIG`** | Your cluster's kubeconfig, **base64-encoded** |

Encode it:
```bash
# macOS
cat ~/.kube/config | base64 | pbcopy

# Linux
cat ~/.kube/config | base64 -w 0
```

Paste the encoded blob into the secret value.

### (Optional but strongly recommended) Scope the kubeconfig

Don't ship your admin kubeconfig as a CI secret. Mint a ServiceAccount with only the permissions to apply this app's resources:

```bash
NS=templates-showcase   # or `default` if you'd rather stay there
kubectl create namespace "$NS" --dry-run=client -o yaml | kubectl apply -f -
kubectl -n "$NS" create serviceaccount deployer
kubectl -n "$NS" create rolebinding deployer-edit \
  --clusterrole=edit \
  --serviceaccount="$NS:deployer"

# Long-lived token (one year)
TOKEN=$(kubectl -n "$NS" create token deployer --duration=8760h)

# Bake a minimal kubeconfig
SERVER=$(kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}')
CA=$(kubectl config view --minify --raw -o jsonpath='{.clusters[0].cluster.certificate-authority-data}')

cat >/tmp/sa-kubeconfig <<EOF
apiVersion: v1
kind: Config
clusters:
- name: cluster
  cluster:
    server: ${SERVER}
    certificate-authority-data: ${CA}
contexts:
- name: deployer
  context:
    cluster: cluster
    namespace: ${NS}
    user: deployer
current-context: deployer
users:
- name: deployer
  user:
    token: ${TOKEN}
EOF

# Encode this one, not your admin config
cat /tmp/sa-kubeconfig | base64 | pbcopy
# Now paste into the KUBECONFIG secret
```

Don't forget to set the same namespace in `k8s/kustomization.yaml` if you didn't pick `default`.

### Trigger it

Push to `main`, or open **Actions → Build & Deploy → Run workflow**. The job:
1. Builds the image with Buildx + GHA layer cache
2. Pushes `sha-<commit>` and `latest` to GHCR
3. Decodes the kubeconfig
4. Patches the image tag and `kubectl apply -k k8s/`
5. Waits on `kubectl rollout status`

---

## Path 3 — manual kubectl

If you'd rather just paste the YAML:

```bash
# build + push (one-time per change)
docker build -t ghcr.io/<owner>/templates-showcase:dev .
docker push ghcr.io/<owner>/templates-showcase:dev

# edit the placeholder image once
cd k8s
kustomize edit set image ghcr.io/OWNER/templates-showcase=ghcr.io/<owner>/templates-showcase:dev

# apply
kubectl apply -k .
kubectl get pods,svc,ingress -l app.kubernetes.io/name=templates-showcase -w
```

---

## Verify

```bash
# is the deployment healthy?
kubectl rollout status deployment/templates-showcase

# the pods?
kubectl get pods -l app.kubernetes.io/name=templates-showcase

# the service?
kubectl get svc templates-showcase

# is the ingress wired up?
kubectl describe ingress templates-showcase

# tail logs
kubectl logs -l app.kubernetes.io/name=templates-showcase -f
```

If your ingress is healthy and TLS is provisioned, `https://your-domain.com/healthz` should return `ok`.

---

## Rollback

`kubectl rollout undo` to the last working revision:

```bash
kubectl rollout undo deployment/templates-showcase
```

Or pin to a specific previous image tag:

```bash
kubectl set image deployment/templates-showcase web=ghcr.io/<owner>/templates-showcase:sha-<old-commit>
```

---

## Teardown

```bash
kubectl delete -k k8s/
```

Drops the Deployment / Service / Ingress. The PVCs (none in this stack) and the namespace (if you created one) remain — clean those manually if you want.
