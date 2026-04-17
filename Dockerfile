# Multi-stage build:
#  1. deps     — install pnpm deps from a frozen lockfile
#  2. build    — run astro build to produce /app/dist
#  3. runtime  — minimal layer that serves the built site via astro preview
#
# Target Node is pinned to 22 LTS (also enforced by .nvmrc and engines.node).

ARG NODE_VERSION=22-alpine

# ----- 1. deps -----
FROM node:${NODE_VERSION} AS deps
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ----- 2. build -----
FROM node:${NODE_VERSION} AS build
RUN corepack enable
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# ----- 3. runtime -----
FROM node:${NODE_VERSION} AS runtime
RUN corepack enable
WORKDIR /app
ENV NODE_ENV=production

# Copy the exact deps the build resolved against, the compiled output,
# and the config files astro preview reads at boot.
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/astro.config.mjs ./astro.config.mjs
COPY --from=build /app/tsconfig.json ./tsconfig.json

EXPOSE 4321

# --host 0.0.0.0 so the container is reachable from outside.
CMD ["pnpm", "exec", "astro", "preview", "--host", "0.0.0.0", "--port", "4321"]
