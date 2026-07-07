# Clearcut

A rigorous experiment sample-size & readout tool for PMs and growth teams.

> **Signal through noise.** σ is the noise, Δ is the signal, n is how loud you turn it up.

## Stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Hosting**: Vercel
- **Database**: Neon (serverless Postgres)
- **ORM**: Drizzle ORM (`@neondatabase/serverless` HTTP driver)
- **Auth**: Auth.js v5 — Google OAuth + Resend email magic link
- **Styling**: Tailwind CSS v4 + design tokens
- **Package manager**: pnpm

## Local setup

```bash
pnpm install
cp .env.example .env.local
# Fill in .env.local — see variable descriptions below
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon pooled connection string |
| `AUTH_SECRET` | Generate: `npx auth secret` |
| `AUTH_URL` | `http://localhost:3000` locally; your Vercel URL in prod |
| `AUTH_GOOGLE_ID` | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | Google OAuth client secret |
| `AUTH_RESEND_KEY` | Resend API key |
| `EMAIL_FROM` | From address for magic-link emails |

## What Carlos needs to provision

1. **Neon** — create a project at [neon.tech](https://neon.tech), copy the pooled `DATABASE_URL`
2. **Google OAuth** — create credentials at [console.cloud.google.com](https://console.cloud.google.com). Authorized redirect URI: `{AUTH_URL}/api/auth/callback/google`
3. **Resend** — create an API key at [resend.com](https://resend.com), verify your sending domain
4. **Vercel** — import the GitHub repo; add all env vars in project settings
5. **Auth secret** — run `npx auth secret` and paste the output into `AUTH_SECRET`

## Database migrations

```bash
# Push schema to Neon (first time or after schema changes)
pnpm db:push

# Or generate SQL migration files
pnpm db:generate
```

## Project structure

```
app/
  (marketing)/page.tsx      # public landing page
  (app)/app/page.tsx        # protected calculator placeholder
  api/auth/[...nextauth]/   # Auth.js route handler
  login/page.tsx            # sign-in page
components/
  NumberLineGauge.tsx       # SVG confidence-interval visualisation
lib/
  auth.ts                   # Auth.js config
  db/index.ts               # Drizzle + Neon client
  db/schema.ts              # database schema
drizzle/                    # SQL migrations
```

## Roadmap

- **Phase 1** (current): auth, database, landing page ✓
- **Phase 2**: context selector + stats engine + readout simulator
- **Phase 3**: saved scenarios, shareable links
- **Phase 4**: CUPED, cluster/switchback, sequential testing
