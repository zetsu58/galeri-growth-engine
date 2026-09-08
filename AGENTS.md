# Galeri Growth Engine Agent Guide

## Mission
Build a Turkish-first, internationalization-ready, multi-tenant automotive growth SaaS: inventory → content/video → lead qualification → handoff → appointment/sale attribution. The primary action is **AI ile Sat**.

## Architecture and rules
- Next.js App Router + strict TypeScript; domain logic belongs in `src/lib`, HTTP concerns in route handlers, UI in components.
- PostgreSQL/Supabase is authoritative in production. Every business row carries `dealership_id`; enforce authorization in application code **and** RLS. Never accept tenant identity without deriving membership from the authenticated user.
- Validate all boundaries with Zod. Treat messages, AI output, uploads, and webhooks as hostile. Never render AI/customer HTML. Never leak prompts, policies, credentials, or cross-tenant data.
- AI, messaging, video/TTS, and jobs use provider interfaces. Offline deterministic providers must remain usable. WhatsApp production integration must use official Meta Cloud API—never scraping/session automation.
- AI may extract signals but deterministic code computes scores. It must not invent vehicle facts, prices, finance, warranties, discounts, or trade values. Escalate uncertainty.
- Expensive renders run as queued jobs. Uploads require magic-byte/MIME/extension/size checks and generated object names.
- No secrets or customer data in Git/logs. Keep `.env.example` placeholders only. Evaluate and record external code/licenses in `docs/OPEN_SOURCE_AUDIT.md`; do not copy copyleft code without approval.
- Turkish UI strings are centralized for future i18n. Maintain accessible, responsive states.
- Schema changes are timestamped migrations with constraints, indexes, and RLS. Add regression tests for tenant boundaries.

## Required validation
Before committing: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`. For user-visible flows also run `npm run test:e2e` and inspect desktop/mobile screenshots. Update documentation to match reality; never describe a stub as production-ready.
