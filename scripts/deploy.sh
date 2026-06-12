#!/usr/bin/env bash
# Local end-to-end deploy.
# Builds the image, pushes it to GHCR, patches the kustomize image tag,
# applies the manifests, and waits for the rollout. Works as long as:
#   - you can `docker login ghcr.io`
#   - your current kubectl context points at the right cluster
#
# Usage:
#   ./scripts/deploy.sh              # deploys using current git short-sha as tag
#   ./scripts/deploy.sh v0.2.0       # uses a custom tag
set -euo pipefail

# ── Config ──────────────────────────────────────────────────────────────────
REGISTRY="${REGISTRY:-ghcr.io}"
# Derive owner/repo from `git remote` if not provided
if [[ -z "${IMAGE_OWNER:-}" ]]; then
  url=$(git config --get remote.origin.url 2>/dev/null || true)
  # Handles both ssh (git@github.com:owner/repo.git) and https (https://github.com/owner/repo.git)
  IMAGE_OWNER=$(printf '%s' "$url" | sed -E 's#.*[:/]([^/]+)/[^/]+(\.git)?$#\1#' | tr '[:upper:]' '[:lower:]')
fi
IMAGE_NAME="${IMAGE_NAME:-templates-showcase}"
IMAGE="${REGISTRY}/${IMAGE_OWNER}/${IMAGE_NAME}"

TAG="${1:-sha-$(git rev-parse --short=12 HEAD)}"
FULL_IMAGE="${IMAGE}:${TAG}"

NAMESPACE="${NAMESPACE:-default}"

# ── Pretty printing ─────────────────────────────────────────────────────────
b() { printf '\n\033[1;36m▸ %s\033[0m\n' "$*"; }
ok() { printf '\033[1;32m✓\033[0m %s\n' "$*"; }
fail() { printf '\033[1;31m✗\033[0m %s\n' "$*" >&2; exit 1; }

# ── Sanity checks ───────────────────────────────────────────────────────────
# Kustomize isn't required as a separate binary — kubectl has it built in
# as `kubectl apply -k`. Image substitution below is done with plain sed.
command -v docker  >/dev/null || fail "docker not on PATH"
command -v kubectl >/dev/null || fail "kubectl not on PATH"

current_ctx=$(kubectl config current-context)
echo
echo "  Image:     ${FULL_IMAGE}"
echo "  Namespace: ${NAMESPACE}"
echo "  Context:   ${current_ctx}"
echo
read -r -p "Proceed? [y/N] " ans
[[ "${ans,,}" == "y" ]] || fail "Aborted."

# ── Build & push ────────────────────────────────────────────────────────────
b "Building image"
docker build -t "${FULL_IMAGE}" -t "${IMAGE}:latest" .
ok "Built"

b "Pushing to ${REGISTRY}"
docker push "${FULL_IMAGE}"
docker push "${IMAGE}:latest"
ok "Pushed"

# ── Patch kustomization.yaml with the fresh image (plain sed) ───────────────
# Updates the `newName:` and `newTag:` lines under the images list so the
# deployment we apply below references the image we just pushed. -i.bak +
# rm keeps the command portable across GNU sed (Linux) and BSD sed (macOS).
b "Patching image tag in kustomization.yaml"
sed -i.bak \
  -e "s|^\([[:space:]]*\)newName:.*|\1newName: ${IMAGE}|" \
  -e "s|^\([[:space:]]*\)newTag:.*|\1newTag: ${TAG}|" \
  k8s/kustomization.yaml
rm -f k8s/kustomization.yaml.bak
ok "Patched (newName=${IMAGE}, newTag=${TAG})"

# ── Apply ───────────────────────────────────────────────────────────────────
b "Applying manifests to ${NAMESPACE}"
kubectl apply -k k8s/ --namespace "${NAMESPACE}"
ok "Applied"

b "Waiting for rollout"
kubectl -n "${NAMESPACE}" rollout status deployment/templates-showcase --timeout=180s
ok "Rolled out"

# ── Report ──────────────────────────────────────────────────────────────────
echo
ok "Deploy complete"
kubectl -n "${NAMESPACE}" get pods,svc,ingress -l app.kubernetes.io/name=templates-showcase
