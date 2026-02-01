# Zeroday Dev Guide

## Требования

- Node.js >= 18
- pnpm >= 9

## Установка

```bash
pnpm install
```

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

## Переменные окружения

На старте не требуются. При появлении можно добавлять в `.env` на уровне нужного приложения.
