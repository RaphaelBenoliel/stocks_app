# Signalist — Market OS for Human Investors 🚀
Realtime dashboards, AI briefings, and automated alerts that keep you ahead of the tape.

## Highlights
- Live market cockpit: TradingView embeds for overview, heatmaps, timelines, and quotes in one grid (`app/(root)/page.tsx`).
- Command palette search (⌘/Ctrl + K) that queries Finnhub and deep-links to `/stocks/[symbol]`.
- Watchlist with Mongo persistence, inline edits, and AI “watchlist pulse” summaries.
- Price alerts per symbol (upper/lower triggers) with current price context from Finnhub.
- News board with company-aware headlines plus an AI digest.
- Auth flows (sign in/up/out) backed by better-auth middleware; gated app routes under `app/(root)`.
- Optional email + Inngest jobs for personalized welcomes and daily news briefings.
/Users/raphaelbenoliel/Documents/repos/WebDev/stocks_app/
## Screenshots
![Dashboard](stocks_app/public/assets/dashboard.png)


## Stack
- App: Next.js 15 (App Router, Turbopack), React 19, Tailwind CSS 4.
- Auth: better-auth with secure cookies and middleware guard (`middleware/index.ts`).
- Data: MongoDB via Mongoose models (`db/models/*.ts`) for watchlists and alerts.
- Market data: Finnhub (quotes, profiles, news) + TradingView embeds for charts.
- AI: Gemini (Google Generative Language API) for watchlist insights and news digests.
- Email & jobs: Nodemailer templates (`lib/nodemailer`) and Inngest functions (`lib/inngest/functions.ts`) for welcome/news emails.

## Quickstart
1) Install dependencies
```bash
npm install
```
2) Copy env and fill values (if you do not already have one)
```bash
cp .env.example .env
```
3) Run MongoDB locally or point `MONGODB_URI` to your cluster.
4) Start the dev server
```bash
npm run dev
```
5) Open `http://localhost:3000`, create an account, and start adding symbols.

## Environment
Set these in `.env` (or your host):

| Key | Required | Purpose |
| --- | --- | --- |
| `MONGODB_URI` | Yes | Connection string for watchlists/alerts. |
| `BETTER_AUTH_SECRET` | Yes | Session signing secret. |
| `BETTER_AUTH_URL` | Yes | App base URL (e.g., http://localhost:3000). |
| `FINNHUB_API_KEY` or `NEXT_PUBLIC_FINNHUB_API_KEY` | Recommended | Live quotes, search, and news; without it, search/news fall back or stay empty. |
| `GEMINI_API_KEY` | Optional | AI summaries for watchlist and news cards. |
| `NODEMAILER_EMAIL`, `NODEMAILER_PASSWORD` | Optional | SMTP creds for welcome/news emails. |
| `INNGEST_API_KEY` (or `INNGEST_EVENT_KEY`/`INNGEST_SIGNING_KEY`) | Optional | Enables Inngest functions served at `/api/inngest`. |

## Scripts
- `npm run dev` — start Next.js with Turbopack.
- `npm run build` — production build.
- `npm run start` — run the built app.
- `npm run lint` — lint the codebase.

## Feature Walkthrough
- **Dashboard**: TradingView widgets for market overview, heatmap, top stories, and quotes (`app/(root)/page.tsx`).
- **Search**: Command palette via `components/SearchCommand.tsx`; fetches `/api/stocks/search` with Finnhub and opens stock detail pages.
- **Stock detail**: `/stocks/[symbol]` renders TradingView symbol info, advanced charts, baseline comparisons, technicals, and company profile/financials.
- **Watchlist**: CRUD stored in Mongo via `app/api/watchlist`; table UI in `components/WatchlistTable.tsx`. AI pulse from `/api/ai/watchlist-insight`.
- **Alerts**: CRUD via `app/api/alerts`; displayed/edited through `components/alerts/AlertManager`. Uses live price context from Finnhub quotes.
- **News**: `app/(root)/news/page.tsx` shows Finnhub headlines, with an AI digest from `/api/ai/news-summary`.
- **Auth**: Sign-in/up pages under `app/(auth)`; middleware blocks unauthenticated access to app routes.
- **Email & jobs**: Nodemailer helpers in `lib/nodemailer`; Inngest functions (`lib/inngest/functions.ts`) generate AI-crafted welcome copy and daily news summaries.

## API Routes
- `POST /api/auth/sign-in`, `sign-up`, `sign-out` — better-auth backed session flows.
- `GET/POST/DELETE/PATCH /api/watchlist` — manage watchlist entries.
- `GET/POST/PATCH/DELETE /api/alerts` — manage price alerts.
- `GET /api/stocks/search?q=` — Finnhub-backed search used by the command palette.
- `GET /api/ai/watchlist-insight` — Gemini summary of tracked symbols.
- `GET /api/ai/news-summary` — Gemini digest of current headlines.
- `POST /api/inngest` — Inngest event receiver (for hosted cron/events).

## Deployment Notes
- Provide all required env vars in your host.
- Ensure MongoDB is reachable from the deployed region.
- Configure SMTP for production email delivery.
- If using Inngest, expose `/api/inngest` and set the signing/event key.

## License
MIT. Build boldly.
