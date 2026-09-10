# Testing
Vitest is restricted to `tests/**` and resolves `@/`; Playwright is separate. Units cover scoring bounds/canonical HOT intent, structured providers, hostile prompt text and upload spoofing/limits. A behavioral tenant projection test and browser flow exist. Run `npm ci`, then lint/typecheck/test/build/E2E. E2E uses persistent demo state, so clear `.data` first. Full HTTP cross-tenant tests await the production auth/repository implementation.

The pre-revenue project intentionally has no GitHub Actions workflow because the repository owner cannot use paid Actions billing. Validation is performed in Codex and locally before pull requests. Removing hosted CI does not relax lint, typecheck, test, build, E2E, or security requirements.
