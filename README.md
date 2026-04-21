# Spent

> See your life in hours, not dollars.

Spent is a full-stack personal finance tool that reframes how you think about money. Instead of tracking expenses in dollars, it converts every cost into hours of work at your **true net hourly rate** — what you actually take home per hour after taxes, divided across the hours you really work.

Live at **[jordanposthauer.com](https://jordanposthauer.com)**

---

## What it does

You enter your income and recurring monthly expenses. Spent calculates:

- **True hourly rate** — net income ÷ hours actually worked
- **Break-even hour** — how far into each workday you're working for expenses vs. yourself
- **Weeks for expenses** — how many weeks of the year your fixed costs consume
- **AI audit narrative** — Claude reads your numbers and writes a plain-English summary of what they mean

The goal is to make the real cost of your lifestyle visceral rather than abstract.

---

## Tech stack

**Backend**
- Java 25 / Spring Boot 4
- Spring Security — session-based auth, BCrypt, role-based access control (MEMBER / ADMIN)
- Spring Data JPA / Hibernate — ORM with PostgreSQL in production, H2 in development
- REST API

**Frontend**
- React 18 + TypeScript
- Vite
- React Router
- Axios

**Infrastructure**
- Raspberry Pi 3 (ARM64) — self-hosted on a home network
- Nginx — reverse proxy to Spring Boot, static file server for the React SPA
- Cloudflare Tunnel — public HTTPS without port forwarding or a static IP
- systemd — service management and auto-restart
- PostgreSQL

**CI/CD**
- GitHub Actions with a self-hosted ARM64 runner on the Pi
- Merging to `main` automatically builds and deploys — no manual steps

**AI**
- Anthropic Claude API — personalized financial narrative generation

---

## Architecture
Browser → Cloudflare Edge (HTTPS) → Cloudflare Tunnel → Raspberry Pi
↓
Nginx :80
↙        ↘
React (static)  Spring Boot :8080
↓
PostgreSQL

---

## Running locally

**Prerequisites:** Java 21+, Node 18+, Maven

```bash
# Clone
git clone https://github.com/jposthau/spent.git && cd spent

# Start the backend (runs against an in-memory H2 database)
./mvnw spring-boot:run

# In a second terminal, start the frontend
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). A dev admin account is seeded automatically — check `DataInitializer.java` for credentials.

---

## Environment variables (production)

The following must be set in the environment where the JAR runs:

| Variable | Description |
|---|---|
| `DB_PASSWORD` | PostgreSQL password |
| `ADMIN_PASSWORD` | Password for the auto-created admin account |
| `ANTHROPIC_API_KEY` | Key for AI audit narrative generation |
| `APP_FRONTEND_URL` | Public URL of the frontend (for CORS) |

---

## Deployment

Merging a pull request to `main` triggers the GitHub Actions workflow (`.github/workflows/deploy.yml`), which:

1. Builds the Spring Boot JAR on the Pi via a self-hosted runner
2. Builds the React frontend
3. Stops the service, swaps artifacts, restarts

No SSH access to the Pi is required — the runner connects outbound to GitHub.

---

## Architecture

```
Browser → Cloudflare Edge (HTTPS) → Cloudflare Tunnel → Raspberry Pi
                                                              │
                                                          Nginx :80
                                                         ╱        ╲
                                                 React (static)  Spring Boot :8080
                                                                       │
                                                                  PostgreSQL

```

---

## Running locally

**Prerequisites:** Java 21+, Node 18+, Maven

```bash
# Clone
git clone https://github.com/jposthau/spent.git && cd spent

# Start the backend (runs against an in-memory H2 database)
./mvnw spring-boot:run

# In a second terminal, start the frontend
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). A dev admin account is seeded automatically — check `DataInitializer.java` for credentials.

---

## Environment variables (production)

The following must be set in the environment where the JAR runs:

| Variable | Description |
|---|---|
| `DB_PASSWORD` | PostgreSQL password |
| `ADMIN_PASSWORD` | Password for the auto-created admin account |
| `ANTHROPIC_API_KEY` | Key for AI audit narrative generation |
| `APP_FRONTEND_URL` | Public URL of the frontend (for CORS) |

---

## Deployment

Merging a pull request to `main` triggers the GitHub Actions workflow (`.github/workflows/deploy.yml`), which:

1. Builds the Spring Boot JAR on the Pi via a self-hosted runner
2. Builds the React frontend
3. Stops the service, swaps artifacts, restarts

No SSH access to the Pi is required — the runner connects outbound to GitHub.

---

## Access model

New accounts are **pending by default** and require admin approval before they can log in. This is intentional — the app is live but not open registration.
