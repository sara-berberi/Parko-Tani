# ParkoTani

Full-stack parking finder/reservation app built with NestJS, PostgreSQL (Prisma), and React Native (Expo).

## Stack
- Backend: NestJS, Prisma, PostgreSQL (PostGIS ready), Socket.IO, JWT auth, cron for reservation expiry.
- Frontend: Expo (React Native), React Navigation, React Query, NativeWind, React Native Paper, Socket.IO client.
- Infra: docker-compose for Postgres + Redis.

## Prerequisites
- Node.js 18+
- npm
- Expo CLI (optional for running on devices)
- Docker + Docker Compose (for Postgres/Redis)

## Backend setup
```bash
cd backend
npm install
npm run prisma:generate
# dev
npm run dev
# build
npm run build && npm start
```

Environment variables (`backend/.env`):
```
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/parko_tani
JWT_SECRET=dev-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=dev-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d
```

Run database + redis:
```bash
docker-compose up -d
```

Prisma migrate (optional):
```bash
npm run prisma:migrate
```

## Frontend setup
```bash
cd frontend
npm install
npm start        # opens Expo dev tools
npm run android  # or ios / web
```

Environment (`frontend/.env` or `app.config.js` extra):
```
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
```

## Code structure
- `backend/src` modules: auth, users, parkings, reservations, notifications, realtime (WS), tasks (cron), prisma.
- `frontend/src` folders: navigation, screens, api, state/hooks (to be added), components.

## Scripts
- Backend: `dev`, `build`, `start`, `prisma:*`.
- Frontend: `start`, `android`, `ios`, `web`, `lint`, `typecheck`.

## Notes
- Prisma `relationMode = "prisma"` (no DB FKs by default).
- Reservation expiry cron runs every minute; emits socket updates.
- WebSocket events: `parking.update`, `reservation.update`.

## Testing (future)
- Backend: Jest + Supertest (not yet added).
- Frontend: Jest + React Native Testing Library (not yet added).
