FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# --- Install dependencies ---
FROM base AS deps
COPY package.json package-lock.json ./
COPY apps/backend/package.json ./apps/backend/package.json
RUN npm install --legacy-peer-deps

# --- Build ---
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
WORKDIR /app/apps/backend
RUN npm run build

# --- Production ---
FROM node:20-alpine AS runner
WORKDIR /app/apps/backend

ENV NODE_ENV=production

# Copy built server and admin
COPY --from=builder /app/apps/backend/.medusa/server ./.medusa/server
# npm workspaces hoist deps to root /app/node_modules
COPY --from=builder /app/node_modules ./node_modules/
COPY --from=builder /app/apps/backend/package.json ./
# Use compiled JS config (not .ts) so medusa start doesn't need ts-node
COPY --from=builder /app/apps/backend/.medusa/server/medusa-config.js ./medusa-config.js
COPY --from=builder /app/apps/backend/.medusa/server/instrumentation.js ./instrumentation.js
COPY --from=builder /app/apps/backend/static ./static/

# Ensure admin build is present (Medusa expects .medusa/server/public/admin/index.html)
RUN test -f ./.medusa/server/public/admin/index.html

EXPOSE 9000

# Run migrations then start the built server
CMD ["sh", "-c", "npx medusa db:migrate && node .medusa/server/index.js"]
