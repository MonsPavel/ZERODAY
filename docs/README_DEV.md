# Zeroday Dev Guide

## Требования

- Node.js >= 18
- pnpm >= 9

## Установка

```bash
pnpm install
```

## Postgres (Docker)

```bash
docker compose up -d
```

## Prisma

Перед запуском API укажи `DATABASE_URL` в `apps/api/.env` (см. `apps/api/.env.example`).

```bash
pnpm --filter @zeroday/api prisma:generate
pnpm --filter @zeroday/api db:migrate
pnpm --filter @zeroday/api db:seed
```

Примечание по legacy данным:
- Старые записи без владельца получают `userId` legacy-пользователя (`legacy@zeroday.local`).
- Будущий multi-user не делает автоматическую переразметку старых данных.

## Запуск

```bash
pnpm dev
```

По умолчанию:
- Web: http://localhost:5173
- API: http://localhost:3000

Проверка здоровья API:

```bash
curl http://localhost:3000/health
```

## Команды

- `pnpm dev` — поднять web + api
- `pnpm lint` — линт всего монорепо
- `pnpm format` — форматирование всего монорепо
- `pnpm typecheck` — проверка типов для web + shared
- `pnpm --filter @zeroday/api db:migrate` — миграции Prisma
- `pnpm --filter @zeroday/api db:seed` — сиды Prisma

## Переменные окружения

Для API требуется `DATABASE_URL`. Пример есть в `apps/api/.env.example`.
