# Galeri Growth Engine

**Aracı ekle. AI müşterisini bulsun.** Turkish-first, multi-tenant vehicle sales growth SaaS.

## Demo (no paid services)

Prerequisites: Node 22+. Copy config and start:

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000. The UI contains Growth Motors, its BMW 320i, generated-content entry point, and a HOT lead. Offline APIs: `POST /api/demo/generate`, `POST /api/demo/video`, and `POST /api/demo/message`; `GET /api/health`. Mock video creates a queued job—it does not claim to render media. Production persistence/auth requires a Supabase project and applying `supabase/migrations`.

## Validation
`npm run lint && npm run typecheck && npm test && npm run build`. See `docs/TESTING.md`.

## Status
This foundation demonstrates deterministic content, lead scoring, message idempotency, responsive dashboard, provider boundaries, and tenant-RLS schema. Real authentication screens, storage upload UI, FFmpeg worker, Meta/OpenAI adapters, appointments and production queue are roadmap work—not represented as complete.
