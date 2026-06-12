# =============================================================================
# Stage 1 — build the static bundle
# =============================================================================
FROM node:22-alpine AS builder
WORKDIR /app

# Install dependencies first (cached layer)
COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts

# Build
COPY . .
RUN npm run build

# =============================================================================
# Stage 2 — serve via nginx
# =============================================================================
FROM nginx:1.27-alpine

# Static bundle
COPY --from=builder /app/dist /usr/share/nginx/html

# Site config (gzip, caching, SPA fallback)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Drop root for runtime
RUN chown -R nginx:nginx /usr/share/nginx/html \
 && touch /var/run/nginx.pid \
 && chown -R nginx:nginx /var/run/nginx.pid /var/cache/nginx /var/log/nginx

USER nginx
EXPOSE 80

# Health check for orchestrators
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --spider http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
