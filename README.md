# Illuminate ✨

**AI-powered career pathing for Per Scholas alumni, learners, and aspiring candidates.**

Built by **Team PathPair** for **CGI Hack Jam 2026** — _Tech Futures: Illuminate Your Path._

Illuminate turns a single sentence about where you are today into a personalized, tier-by-tier tech career roadmap — the skills to master, the courses that build them, and the real-world roles they lead to. It closes the gap between ambition and direction: users can _see_ the path from where they are to where they want to be, and check off progress as they go.


---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [AI Integration](#ai-integration)
- [Known Limitations & Future Work](#known-limitations--future-work)
- [Team](#team)
- [Credits & Resources](#credits--resources)

---

## Features

- **🧭 AI-Powered Career Pathing** — A user describes their background in one or two sentences (typed or spoken); a Mistral-backed engine infers the best-fit tech track and generates a structured **junior → middle → senior** roadmap with courses, skills, and target roles.
- **💼 Employer Possibilities Portal** — Surfaces the distinct real-world roles a roadmap prepares you for, aggregated across every tier, so the path always ties back to concrete career outcomes.
- **✅ Progress Tracking** — Logged-in users check off skills they've mastered. Progress persists to the database and re-hydrates on their next login, with per-tier completion percentages computed on the fly.
- **🎤 Voice Onboarding** — The onboarding chat accepts speech input via the browser's Web Speech API, so users can simply _talk_ about their goals.
- **🎨 Immersive UI** — A dark, futuristic interface with a perspective-grid hero, scroll-based parallax, and staggered fade-in animations that bring the roadmap to life.
- **🔐 Authentication** — JWT-based registration and login with bcrypt-hashed passwords, so returning users come straight back to their saved roadmap.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite 8, Tailwind CSS 4, Web Speech API |
| **Backend** | Node.js, Express 4, JWT (`jsonwebtoken`), `bcryptjs`, `express-rate-limit`, CORS |
| **Database** | MongoDB via Mongoose |
| **AI** | Mistral AI (`@mistralai/mistralai`) |

---

## Architecture

```text
┌────────────────────┐        REST / JSON        ┌────────────────────┐
│   React Client     │ ────────────────────────▶ │   Express API      │
│  (Vite + Tailwind) │                           │                    │
│                    │ ◀──────────────────────── │  /api/onboarding ──┼──▶ Mistral AI
│  Landing → Chat →  │        JWT-authed          │  /api/auth         │
│  Roadmap timeline  │                           │  /api/roadmap ─────┼──▶ MongoDB
└────────────────────┘                           └────────────────────┘
```

The roadmap endpoint runs a **merge engine**: it pulls the master track configuration from MongoDB and overlays the user's saved progress, returning a single UI-ready payload with per-skill mastery flags and per-tier completion percentages.

---

## Project Structure

```text
Hackjam-2026-team-07/
├── client/                     # React + Vite frontend
│   └── src/
│       ├── components/
│       │   ├── auth/           # LoginModal, RegisterModal
│       │   ├── onboarding/     # ChatWidget (with voice input)
│       │   ├── roadmap/        # Timeline, CourseCard, EmployerPortal
│       │   └── shared/         # LoadingSpinner
│       ├── pages/              # LandingPage, RoadmapPage
│       ├── services/api.js     # Central backend client (USE_MOCK toggle)
│       └── data/               # mockRoadmap fixtures
└── backend/                    # Express API
    ├── server.js               # App entry, route mounts, Mongo connection
    ├── routes/                 # auth, onboarding, roadmap
    ├── models/                 # User, Track (Mongoose schemas)
    ├── middleware/             # requireAuth (JWT verification)
    └── utils/, prompts/        # AI prompt templates & helpers
```

---

## API Reference

Base URL: `http://localhost:5000`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/onboarding` | — | Sends the user's free-text goal to the AI and returns a generated roadmap. |
| `POST` | `/api/auth/register` | — | Creates an account (bcrypt-hashed password) and attaches the guest roadmap. Returns a JWT. |
| `POST` | `/api/auth/login` | — | Authenticates an existing user and returns a JWT + `userId`. |
| `GET` | `/api/roadmap/:userId` | ✅ Bearer | Merge engine: returns the user's full roadmap (track summary, `junior`/`middle`/`senior` tiers, mastery flags). |
| `PATCH` | `/api/roadmap/toggle-skill` | ✅ Bearer | Toggles a single skill's mastered state and re-scores tier progress. |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A running MongoDB instance (local or Atlas free tier)
- A Mistral AI API key

### 1. Clone

```bash
git clone <https://github.com/Kriviears/Hackjam-2026-team-07.git>
cd Hackjam-2026-team-07
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env      # then fill in the values (see below)
npm run dev               # starts on http://localhost:5000 (nodemon)
```

### 3. Frontend

```bash
cd client
npm install
npm run dev               # starts on http://localhost:5173
```

> The frontend's data source is controlled by the `USE_MOCK` flag in `client/src/services/api.js`. Set it to `true` to run the UI against local mock data with no backend required, or `false` to hit the live API.

---

## Environment Variables

Create `backend/.env` with the following:

| Variable | Description |
|---|---|
| `PORT` | Backend port (default `5000`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign auth tokens |
| `MISTRAL_API_KEY` | Mistral AI API key |
| `FRONTEND_URL` | Allowed origin for CORS (e.g. `http://localhost:5173`) |

> ⚠️ **Never commit `.env` or share these values.** Keep `.env` in `.gitignore` and rotate any secret that has been exposed.

---

## AI Integration

**Runtime AI — Mistral AI.** Illuminate uses Mistral AI as its career pathing engine. When a user describes their background, the onboarding service prompts the model to infer a suitable tech track and produce a structured roadmap, including a match rationale, recommended soft skills, and growth areas. The AI's guidance renders as a summary above the interactive roadmap; all progress tracking and course data are handled deterministically by the backend, so the model _augments_ rather than replaces core functionality.

**Development AI — Claude Code.** The team used [Claude Code](https://claude.com/claude-code) (Anthropic) as an AI pair-programming assistant during development. In line with Hack Jam rules, AI assisted with the build while the team authored and reviewed the majority of the code.

---

## Known Limitations & Future Work

- **Track selection is always AI-generated.** Every signup flows through the AI chat; there is no "pick your known track" path yet. A guided track-selection flow for verified learners/alumni is a natural next step.
- **Persona is not verified.** New accounts register as aspiring candidates; distinguishing verified Per Scholas learners/alumni (e.g. via enrollment data) is intentionally out of scope for the MVP.
- **Self-reported progress.** Users check off their own completed skills rather than syncing from an authoritative record.
- **Future ideas:** mentor matching, an expanded employer/opportunities portal, and adaptive roadmap updates as progress changes.

---

## Team

**PathPair** — CGI Hack Jam 2026

| Name | Role |
|---|---|
| Quashean Armstrong | Frontend |
| Elvira Khuzina | Backend |
| Troy Davis | Mentor |

---

## Credits & Resources

- [React](https://react.dev/) · [Vite](https://vite.dev/) · [Tailwind CSS](https://tailwindcss.com/)
- [Express](https://expressjs.com/) · [Mongoose](https://mongoosejs.com/) · [MongoDB](https://www.mongodb.com/)
- [Mistral AI](https://mistral.ai/) — runtime career-pathing engine
- [Claude Code](https://claude.com/claude-code) (Anthropic) — AI coding assistant used during development
- [`jsonwebtoken`](https://github.com/auth0/node-jsonwebtoken) · [`bcryptjs`](https://github.com/dcodeIO/bcrypt.js) · [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

Built for CGI Hack Jam 2026 — _Tech Futures: Illuminate Your Path._
