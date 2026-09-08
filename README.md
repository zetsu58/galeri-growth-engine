# Galeri Growth Engine
**Aracı ekle. AI müşterisini bulsun.** Turkish-first multi-tenant automotive growth MVP.

## Credential-free demo
Node 22+: `cp .env.example .env.local && npm ci && npm run dev`, then open http://localhost:3000 and click **Demo hesaba gir** (`demo@galeri.local`, no password). Create Growth Motors and a vehicle, then use **AI ile Sat**, **Video oluştur**, and **Demo WhatsApp mesajı**. State persists in `.data/demo.json` (mode `0600`). Reset with `rm -rf .data public/uploads`.

The demo implements server-managed signed HttpOnly/SameSite sessions, onboarding, tenant-scoped local persistence, validated vehicle creation, image upload API, generated-content history, a truthfully labelled non-MP4 storyboard job, persisted inbound messages/leads/scores/follow-ups and handoff. Supabase production repositories and real FFmpeg/Meta adapters are not implemented.

## Validate
`npm run lint && npm run typecheck && npm test && npm run build && npm run test:e2e`. Supabase migrations define production schema/RLS; configure secrets from `.env.example`, never in Git.
