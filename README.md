
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0b1020,100:1b1035&height=220&section=header&text=GiftByte&fontSize=62&fontColor=ffffff&animation=fadeIn&fontAlignY=38" />
</p>

<p align="center">
  <b>Cyberpunk pixel-styled wishlist platform</b><br/>
  Create wishlists • share public celebration pages • reserve gifts secretly • fund group presents together
</p>

<p align="center">
  <a href="https://github.com/MetsukiDev/GiftByte">
    <img src="https://img.shields.io/badge/status-active-success?style=for-the-badge" />
  </a>
  <img src="https://img.shields.io/badge/frontend-Next.js-111827?style=for-the-badge" />
  <img src="https://img.shields.io/badge/backend-FastAPI-111827?style=for-the-badge" />
  <img src="https://img.shields.io/badge/database-PostgreSQL-111827?style=for-the-badge" />
  <img src="https://img.shields.io/badge/style-cyberpunk%20pixel-111827?style=for-the-badge" />
</p>

---

# 🎁 GiftByte

**GiftByte** is a celebration platform for people who want to organize gifts in a cleaner, smarter, and more beautiful way.

Instead of using chaotic group chats and awkward private messages, GiftByte gives users a shared space where they can:

- create a wishlist for a birthday or celebration
- publish it as a public page
- let friends reserve gifts **without spoilers**
- allow multiple friends to contribute to expensive presents
- follow other people’s celebrations
- track their own participation from one place

The project is built with a **cyberpunk pixel-art inspired interface** so the product feels like more than a plain form-based app.  
The goal was to make the product feel like a real digital world, not just another CRUD dashboard.

---

# ✨ Main Features

## 1. Wishlist creation

Users can create celebration wishlists with:
- title
- description
- event date
- gift list
- publish/share flow

## 2. Public share pages

Each published wishlist gets a public page that can be opened by other people through a shareable link.

## 3. Secret gift reservations

Friends can reserve gifts, while the wishlist owner **does not see who reserved what**.  
This keeps the surprise intact.

## 4. Group gift funding

For expensive items, multiple friends can contribute together.  
The public page shows:
- current amount collected
- target amount
- funding progress
- funded state

## 5. Participation tracking

Users can track their activity in one place:
- followed wishlists
- reserved gifts
- contributed gifts

## 6. Follow / save wishlist flow

A logged-in user can save/follow a public wishlist and return to it later from their participation area.

## 7. Cyberpunk pixel UI

The product uses:
- layered skyline scenes
- pixel-inspired vehicles and drones
- neon accents
- glass/holographic panels
- dark atmospheric styling

---

# 🌌 Why this project exists

Gift planning is often more chaotic than it should be.

People usually end up using:
- random chat messages
- screenshots
- private notes
- duplicated gifts
- no progress tracking for expensive presents

GiftByte solves this by combining:
- a product-focused wishlist flow
- spoiler-safe gift reservation
- contribution logic
- a memorable visual identity

The aim is to turn a common social problem into a polished, shareable product.

---

# 🧠 Product Logic

The product is designed around one important rule:

> The owner of the wishlist should not see who reserved or contributed to preserve the surprise.

That means GiftByte separates:
- what the owner can see
- what participants can see
- what gets tracked privately in a participant’s own account

This creates a much better celebration flow than typical wishlist tools.

---

# 🖥 Core User Flow

```text
Create Wishlist
      ↓
Add Gifts
      ↓
Publish Wishlist
      ↓
Share Public Link
      ↓
Friends Visit Public Page
      ↓
Reserve Gift / Contribute / Follow Wishlist
      ↓
Track Activity in Participation
````

---

# 🎬 Demo Flow

A typical product demo looks like this:

1. User creates a wishlist
2. User adds a few gifts
3. User publishes the wishlist
4. User copies the public link
5. Friend opens `/public/{slug}`
6. Friend reserves a single gift
7. Friend contributes to a group gift
8. Friend follows the wishlist
9. Friend sees activity in `/participation`

---

# 🧱 Tech Stack

## Frontend

* Next.js
* React
* TypeScript
* TailwindCSS
* custom cyberpunk/pixel UI styling

## Backend

* FastAPI
* Python
* SQLAlchemy
* Pydantic
* JWT-based authentication

## Database

* PostgreSQL

---

# 🏗 Architecture

```text
GiftByte
│
├── frontend
│   ├── auth pages
│   ├── dashboard
│   ├── wishlists
│   ├── public wishlist pages
│   ├── participation
│   ├── wallet
│   └── profile
│
├── backend
│   ├── api
│   ├── services
│   ├── models
│   ├── schemas
│   ├── auth
│   └── database
│
└── postgresql
```

---

# 🏗 System Diagram

```mermaid
flowchart TD

User["User Browser"] --> Frontend["Next.js Frontend"]

Frontend --> AuthPages["Auth Pages"]
Frontend --> Dashboard["Dashboard"]
Frontend --> PublicPage["Public Wishlist Page"]
Frontend --> Participation["Participation"]
Frontend --> Profile["Profile"]
Frontend --> Wallet["Wallet"]

Frontend --> API["FastAPI Backend"]

API --> Auth["Auth / JWT"]
API --> WishlistService["Wishlist Service"]
API --> GiftService["Gift Service"]
API --> FollowService["Follow Service"]
API --> ParticipationService["Participation Logic"]

WishlistService --> DB["PostgreSQL"]
GiftService --> DB
FollowService --> DB
ParticipationService --> DB
Auth --> DB
```

---

# 📦 Current Product Scope

At the current stage, GiftByte already supports:

* registration
* login
* dashboard
* wishlist creation
* gift creation
* publishing wishlists
* public share pages
* anonymous reservation
* group contributions
* participation tracking
* follow/save wishlist flow
* profile
* wallet UI
* legal/support shell pages
* stylized cyberpunk pixel presentation

This makes the project a strong **MVP / launch-ready demo**.

---

# ⚙️ Local Setup

## 1. Clone the repository

```bash
git clone https://github.com/MetsukiDev/GiftByte
cd GiftByte
```

## 2. Backend setup

```bash
cd backend
python -m venv .venv
```

### Activate virtual environment

#### Git Bash

```bash
source .venv/Scripts/activate
```

#### PowerShell

```powershell
.\.venv\Scripts\Activate.ps1
```

### Install dependencies

```bash
pip install -r requirements.txt
```

### Run backend

```bash
python -m uvicorn app.main:app --reload
```

Backend should run at:

```text
http://localhost:8000
```

## 3. Frontend setup

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend should run at:

```text
http://localhost:3000
```

---

# 🔑 Environment Variables

## Backend `.env`

Create a file:

```text
backend/.env
```

Example:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/giftbyte
SECRET_KEY=change-this-secret
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

## Frontend `.env.local`

Create a file:

```text
frontend/.env.local
```

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

# 📁 Suggested Repository Structure

```text
GiftByte/
├── backend/
│   ├── app/
│   ├── .env.example
│   └── requirements.txt
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
├── assets/
├── README.md
└── .gitignore
```

---

# 🧪 Manual QA Checklist

Before shipping or deploying, check the following:

## Auth

* register works
* login works
* authenticated pages load correctly

## Wishlist owner flow

* create wishlist
* add gifts
* publish wishlist
* copy share link
* delete wishlist

## Public flow

* open public page
* reserve single gift
* contribute to group gift
* follow wishlist
* guest login CTA works

## Participation

* followed wishlists appear
* reserved items appear
* contributed items appear

## Visual polish

* auth scene renders correctly
* sidebar collapse works
* no invisible text
* footer renders correctly
* no broken empty states

---

# 🚀 Roadmap

The current version is focused on a polished MVP / showcase release.

Planned next steps include:

* real-time updates
* email support and notifications
* payment integration
* stronger mobile experience
* production-grade infrastructure
* public creator pages
* real support/contact operations

---

# 🔐 Privacy / Product Rules

GiftByte is designed around spoiler-safe gifting.

Key rules:

* wishlist owner should not see who reserved a gift
* wishlist owner should not see who contributed money
* participant activity is visible to the participant in their own account
* public interactions are separated from owner visibility where needed

---

# 💡 Design Direction

GiftByte is intentionally not a generic dashboard app.

The visual direction combines:

* cyberpunk UI
* pixel world atmosphere
* dark futuristic surfaces
* glowing progress states
* layered animated scenes

The long-term goal is to create software that feels immersive, not purely utilitarian.

---

# 👾 Author

Created by **Metsuki**

GitHub profile:
[https://github.com/MetsukiDev](https://github.com/MetsukiDev)

Main repository:
[https://github.com/MetsukiDev/GiftByte](https://github.com/MetsukiDev/GiftByte)

---

# 🤝 Support the Project

GiftByte is an evolving independent project.

Support links can later be connected through:

* Boosty
* CloudTips

At the moment, the best support is:

* starring the repository
* following the project
* sharing feedback
* testing the app after launch

---

# ⭐ Star the Repository

If you like the idea behind GiftByte, consider leaving a star.

It helps the project get discovered and supports future improvements.

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:1b1035,100:0b1020&height=120&section=footer"/>
</p>
```
