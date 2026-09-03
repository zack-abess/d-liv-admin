# =============================================================================
#  D-Livz — Dashboard admin (Nuxt 3, SPA) — production / Coolify
# =============================================================================
#  L'app est en `ssr: false` : Nitro sert le SPA et gère le routage client.
#  L'output Nitro (.output) est autonome → l'image finale ne contient ni
#  node_modules ni sources. Domaine cible : admin.d-livz.com
# =============================================================================

# ---- Stage 1 : build ----
FROM node:20-alpine AS builder

RUN npm install -g pnpm@9

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
# NODE_ENV=development force l'installation des devDependencies (necessaires au
# build). Coolify injecte NODE_ENV=production comme ARG dans toutes les etapes.
RUN NODE_ENV=development pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

# ---- Stage 2 : runtime ----
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000

# .output est autonome (Nitro embarque ses dépendances)
COPY --from=builder /app/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
