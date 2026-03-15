## GiftByte — Cyber celebration wishlists

GiftByte is a fullstack celebration wishlist platform. Users create wishlists for birthdays and events, add gifts, publish a public link, and let friends reserve or contribute to gifts. Owners never see who reserved or contributed — they only see safe statuses and funding progress.

### Tech stack

- **Backend**: FastAPI, SQLAlchemy, PostgreSQL, JWT auth
- **Frontend**: Next.js App Router, TypeScript, Tailwind CSS
- **Auth**: Email + password, JWT in backend, access token in `localStorage` on frontend
- **Realtime (MVP)**: WebSocket rooms per wishlist, server broadcasts gift/wishlist events

---

## 1. Local development setup

Clone the repo and make sure you have:

- Python 3.11+
- Node.js 20+
- PostgreSQL running locally (or a compatible connection string)

### Backend (FastAPI)

From the `backend/` directory:

```bash
cd backend

# 1) Create and activate virtualenv (Git Bash on Windows)
python -m venv .venv
source .venv/Scripts/activate

# 2) Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# 3) Configure environment
cp .env.example .env
# then edit .env to point DATABASE_URL to your Postgres

# 4) Run API
uvicorn app.main:app --reload
```

Backend will be available at:

- `http://localhost:8000/`
- `http://localhost:8000/docs` (Swagger UI)

### Frontend (Next.js)

From the `frontend/` directory:

```bash
cd frontend

# 1) Install dependencies
npm install

# 2) Configure env
# Make sure NEXT_PUBLIC_API_URL points at your backend, e.g.:
# NEXT_PUBLIC_API_URL=http://localhost:8000

# 3) Run dev server
npm run dev
```

Frontend will be available at `http://localhost:3000`.

---

## 2. Core flows & key routes

### Auth

- `/login` — sign in with email + password
- `/register` — create a new account

### Owner dashboard & wishlists

- `/dashboard` — quick overview + entry point into wishlists and wallet
- `/wishlists` — list of your wishlists
- `/wishlists/create` — create a new wishlist (title, description, event date, cover image)
- `/wishlists/[id]` — owner view of a wishlist
  - add gifts (single or group)
  - see gift statuses (available, reserved, funding, funded, archived)
  - see high‑level funding information; no contributor identities

### Public sharing

- `/public/[slug]` — public friend view of a wishlist by share slug
  - read‑only: shows wishlist info + gifts + statuses
  - safe: no owner data; no contributor / reserver identities

### Profile & wallet

- `/profile` — current user info (email, nickname, avatar URL, payout method) with a minimal edit form
- `/wallet` — wallet overview and transaction list (+ mock top‑up for local testing)
- `/participation` — gifts you have reserved or contributed to across all wishlists

---

## 3. Environment variables

### Backend (`backend/.env`)

See `backend/.env.example` for defaults. Common keys:

- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET_KEY`, `JWT_ALGORITHM`, `ACCESS_TOKEN_EXPIRES_MINUTES`
- `CORS_ORIGINS` — usually includes `http://localhost:3000`

### Frontend (`frontend/.env.local`)

- `NEXT_PUBLIC_API_URL` — base URL for the FastAPI backend, e.g.
  - `NEXT_PUBLIC_API_URL=http://localhost:8000`

---

## 4. Demo flow (owner + friend)

**Owner side**

1. Register and login.
2. Go to `/wishlists/create` and create a wishlist.
3. Open it from `/wishlists` and add gifts (single and group).
4. Click **Publish & Share** on the wishlist detail page to get a public share link.
5. Copy the share link and open it in a private/incognito window to simulate a friend.

**Friend side**

1. Open `/public/{public_slug}` — no login required.
2. Browse gifts; see which are available, reserved, or funded.
3. Reserve a single gift (optionally enter your name).
4. Contribute to a group gift by entering an amount.

**Participation**

- After reserving or contributing, go to `/participation` to see your activity across all wishlists.

**Wallet**

- Go to `/wallet` to see your balance and transaction history.
- Use the mock top-up form to add funds for local testing.

**Delete wishlist**

- On any wishlist detail page, click **Delete wishlist** and confirm.
- The wishlist is archived and removed from your active list.
- The public share link becomes inaccessible.

---

## 5. Project structure (high level)

- `backend/`
  - `app/api/` — FastAPI routers (`auth`, `users`, `wishlists`, `gifts`, `wallet`, `public`, `ws`)
  - `app/schemas/` — Pydantic models (owner‑safe and public‑safe views)
  - `app/services/` — business logic (wishlists, gifts, wallet, funding)
  - `app/models/` — SQLAlchemy models
- `frontend/`
  - `src/app/` — Next.js App Router pages (`login`, `register`, `dashboard`, `wishlists`, `public`, `profile`, `wallet`)
  - `src/lib/` — small API helpers (`auth`, `wishlists`, `gifts`, `public`, `user`, `wallet`)

This repository is meant to be easy to read and extend — use existing modules as patterns when adding new features.

