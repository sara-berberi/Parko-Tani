# ParkoTani

Full-stack parking finder/reservation app built with NestJS + PostgreSQL (Prisma) and React Native (Expo).

## Prerequisites
- Node.js 18+
- npm
- Expo Go app (for device testing) or iOS/Android simulator
- Docker + Docker Compose (for Postgres/Redis)

## Backend
Location: `backend/`

Env (`backend/.env`):
```
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/parko_tani
JWT_SECRET=dev-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=dev-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d
```

Setup & run:
```bash
cd backend
npm install
npm run prisma:generate
npm run dev      # watch mode
# or
npm run build && npm start
```

DB/Redis via Docker:
```bash
docker-compose up -d
```

Prisma migrations (optional):
```bash
npm run prisma:migrate
```

## Frontend (Expo)
Location: `frontend/`

Env (`frontend/.env`):
```
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
```

Setup & run:
```bash
cd frontend
npm install
npm start            # opens Expo dev tools
npm run android      # or ios/web
```

Screens:
- Splash (refresh tokens)
- Auth (login/signup)
- Map (nearby parking list + websocket updates)
- Parking Detail (reserve 30 min)
- Reservation (active countdown + cancel)
- Profile (history, push token status, logout)

Hooks:
- `useAuth` (zustand + JWT headers)
- `useNearbyParkings` (location + React Query)
- `useReservation` (create/cancel/me + socket invalidation)
- `useNotifications` (Expo push token registration)

Realtime: Socket.IO client (`src/utils/socket.ts`) listens for `parking.update` and `reservation.update`.

## Notes
- Prisma `relationMode = "prisma"` (no DB FKs by default).
- Reservation expiry cron runs every minute on backend (`TasksService`).
- WebSocket events emitted on parking/reservation changes.

## Testing (future)
- Backend: Jest + Supertest
- Frontend: Jest + React Native Testing Library
