# Blur (Racing Game) - Frontend

This is the Next.js frontend for the Blur racing party game.

## Requirements
- Node.js 18+
- pnpm recommended

## Environment variables
Create `.env.local` (quickest: copy the template):

```bash
cp env.template .env.local
```

Then run:

```bash
pnpm install
pnpm dev
```

Or create `blur/.env.local` manually:

```bash
# Backend base URL (Spring Boot)
NEXT_PUBLIC_API_URL=http://localhost:8080

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace-with-a-long-random-secret
```

## Install & Run

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000

## Authentication
The frontend uses NextAuth Credentials provider.

- Login UI: `/sign-in`
- Backend endpoint: `POST {NEXT_PUBLIC_API_URL}/api/auth/login`
- The returned JWT is stored in the NextAuth session (`session.user.accessToken`).

All Next.js API routes under `blur/app/api/*` proxy to the backend and automatically attach:

`Authorization: Bearer <accessToken>`

## Game Flow (matches backend logic)

### 1) Party (one party per day)
- When the first user clicks "Create Party" (or accesses the party screen), the frontend calls:
  - `POST /api/party` (Next.js) → `GET /api/v1/parties/today` (backend)
- If a party already exists today, it returns the existing one.

### 2) Race
- Create a race inside a party:
  - `POST /api/race?partyId=...&attributionType=PER_USER|ALL_USERS`
- Users join/leave race participants before start.

### 3) Start Race
- Party manager starts the race:
  - `POST /api/v1/races/{raceId}/start`
- Backend assigns:
  - Random map (card)
  - Random car attribution (per attribution type)
  - Random score collector

### 4) Scores
- Only the assigned score collector can submit scores for participants:
  - `POST /api/score`

## Admin / Roles
The backend is role-based:
- `GREAT_ADMIN`: manage users (create users, assign roles)
- `PARTY_MANAGER`: create/start races, manage party
- `RACER`: join parties/races and play

The UI determines admin capabilities based on:
- `session.user.role === 'GREAT_ADMIN'`
- or `session.user.permissions` containing `VIEW_ALL_USERS`
