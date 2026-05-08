# syntax=docker/dockerfile:1.6

# ---------------------------------------------------------------------------
# Stage 1 — build the Vite SPA.
# Reads VITE_FIREBASE_* env vars from .env.local at build time (Vite inlines
# them into the bundle).
# ---------------------------------------------------------------------------
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---------------------------------------------------------------------------
# Stage 2 — serve the built static assets with nginx.
# Cloud Run injects $PORT; envsubst rewrites the listen directive at start.
# ---------------------------------------------------------------------------
FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf.template
ENV PORT=8080
EXPOSE 8080
CMD ["/bin/sh", "-c", "envsubst '${PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]
