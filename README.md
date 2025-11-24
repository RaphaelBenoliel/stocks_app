# Signalist — Market OS for Human Investors 🚀
Realtime dashboards, AI briefings, and automated alerts that keep you ahead of the tape.

---

## ✨ Highlights
- **Live market cockpit**: TradingView embeds for overview, heatmaps, timelines, and quotes in one grid.
- **Actionable watchlist**: Inline edits, filters, sorting, and instant add/remove with Mongo-backed persistence.
- **Price alerts**: Create upper/lower triggers per symbol; stored server-side and tied to your account.
- **News with AI digest**: Pulls headlines via Finnhub and condenses them with Gemini into a 90-second brief.
- **Personalized onboarding**: Better Auth flows with optional AI-powered welcome email copy.

---

## 🖼️ Screenshots
_Replace with your captures:_
- Dashboard: `docs/screenshots/dashboard.png`
- Watchlist: `docs/screenshots/watchlist.png`
- Alerts: `docs/screenshots/alerts.png`
- News + AI summary: `docs/screenshots/news.png`

---

## 🧰 Stack
- **App**: Next.js 15 (App Router, Turbopack), React 19, Tailwind CSS 4.
- **Auth**: better-auth with MongoDB adapter + secure cookies.
- **Data**: MongoDB for watchlists & alerts; Finnhub for quotes/news.
- **AI**: Gemini (Google Generative Language API) for summaries; Inngest for background email workflows.
- **Email**: Nodemailer + HTML templates for welcome and news-summary emails.

---

## 🚀 Quickstart
1) Install deps  
```bash
npm install
```
2) Copy env and fill values  
```bash
cp .env.example .env   # if you don't have one yet
```
3) Run MongoDB locally (or point `MONGODB_URI` to your cluster).  
4) Start dev server  
```bash
npm run dev
```
5) Open `http://localhost:3000` and sign up.

---

## 🔐 Environment
**Required**
- `MONGODB_URI` – Mongo connection string.
- `BETTER_AUTH_SECRET` – random secret for session signing.
- `BETTER_AUTH_URL` – typically `http://localhost:3000` in dev.

**Recommended (full experience)**
- `FINNHUB_API_KEY` and/or `NEXT_PUBLIC_FINNHUB_API_KEY` – live quotes + news.
- `GEMINI_API_KEY` – AI summaries for watchlist and news.
- `NODEMAILER_EMAIL`, `NODEMAILER_PASSWORD` – SMTP creds for transactional mail.
- `INNGEST_API_KEY` (or `INNGEST_EVENT_KEY`/`INNGEST_SIGNING_KEY`) – enable Inngest-powered welcome/news emails.

---

## 🛠️ Scripts
- `npm run dev` – start Next.js with Turbopack.
- `npm run build` – production build.
- `npm run start` – start production server.
- `npm run lint` – lint the codebase.

---

## 📦 Features in Detail
- **Watchlist**: Add/remove symbols, edit categories inline, sort/filter, and click rows for detail. Backed by `/api/watchlist`.
- **Alerts**: CRUD via `/api/alerts`; modal to create price-above/below triggers; stored in Mongo.
- **News**: `/news` pulls Finnhub headlines; AI card summarizes via Gemini with graceful fallback.
- **AI Insights**: `/api/ai/watchlist-insight` condenses your symbols (price, move, market cap) into a short brief.
- **Emails**: HTML templates in `lib/nodemailer/templates.ts`; helpers in `lib/nodemailer/index.ts`; optional Inngest functions in `lib/inngest/functions.ts`.

---

## ☁️ Deployment
- Set required env vars in your hosting platform.
- Ensure MongoDB is reachable.
- Configure a production SMTP provider for Nodemailer.
- If using Inngest, set the signing/event key and deploy `/api/inngest`.

---

## 🛰️ Roadmap
- Webhooks/push for alerts.
- Portfolio and P/L tracking.
- More AI signals (volatility scans, sector rotation notes).
- Multi-tenant org workspaces.

---

## 📄 License
MIT. Build boldly.
