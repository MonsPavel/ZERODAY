# apps/api/Dockerfile

FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache openssl libc6-compat
ENV CI=1
RUN corepack enable

# ---------------- deps ----------------
FROM base AS deps
ENV HUSKY=0

# 1) Копируем манифесты ВСЕХ workspace пакетов (важно для pnpm)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# apps/*
COPY apps/api/package.json apps/api/package.json
# если есть другие apps (web и т.п.) — лучше тоже копировать package.json:
# COPY apps/web/package.json apps/web/package.json

# packages/*
# ВАЖНО: добавь сюда реальные пакеты, которые есть у тебя в repo
# (если папки нет — строку не добавляй)
COPY packages/*/package.json packages/*/package.json

# 2) install (workspace)
RUN pnpm -w install --no-frozen-lockfile --force

# ---------------- build ----------------
FROM base AS build
ENV HUSKY=0
ENV DATABASE_URL="postgresql://zeroday:zeroday@localhost:5432/zeroday?schema=public"

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Запускаем prisma из workspace root, но с schema из api
RUN pnpm --filter @zeroday/api install --no-frozen-lockfile --prod=false
RUN node /app/apps/api/node_modules/prisma/build/index.js generate --schema=apps/api/prisma/schema.prisma

# Build api
RUN pnpm --filter @zeroday/api build

# ---------------- runtime ----------------
FROM node:20-alpine AS runtime
WORKDIR /app
RUN apk add --no-cache openssl libc6-compat
RUN corepack enable
ENV NODE_ENV=production
ENV HUSKY=0

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api/package.json ./apps/api/package.json
COPY --from=build /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/api/prisma ./apps/api/prisma

EXPOSE 3000

# Миграции при старте (в контейнере api будет DATABASE_URL на db:5432)
CMD sh -c "node /app/apps/api/node_modules/prisma/build/index.js migrate deploy --schema=apps/api/prisma/schema.prisma && node apps/api/dist/main.js"
