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
COPY --from=deps /app/apps/backend/node_modules ./apps/backend/node_modules
COPY . .
WORKDIR /app/apps/backend
RUN npm run build

# --- Production ---
FROM node:20-alpine AS runner
WORKDIR /app/apps/backend

ENV NODE_ENV=production

# Copy built server and admin
COPY --from=builder /app/apps/backend/.medusa/server ./.medusa/server
COPY --from=builder /app/apps/backend/.medusa/admin ./.medusa/admin
COPY --from=builder /app/apps/backend/node_modules ./node_modules/
COPY --from=builder /app/apps/backend/package.json ./
COPY --from=builder /app/apps/backend/medusa-config.ts ./
COPY --from=builder /app/apps/backend/instrumentation.ts ./
COPY --from=builder /app/apps/backend/static ./static/

EXPOSE 9000

# medusa start handles migrations + server startup
CMD ["npx", "medusa", "start"]
