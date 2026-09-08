# Deployment
Build the multi-stage Docker image with `docker build -t gge .`; inject secrets only at runtime. Apply migrations before traffic and deploy the future worker separately. Configure TLS, CSP, rate limiting, backups, monitoring and Supabase allowed origins. `/api/health` is the liveness endpoint; add dependency readiness before production.
