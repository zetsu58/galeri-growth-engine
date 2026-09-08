# Database
`supabase/migrations/202609080001_initial.sql` creates the complete core relationship graph, constraints, indexes, membership helper and RLS. Apply with Supabase CLI (`supabase db reset` locally). Production code must derive dealership access from authenticated membership, never a request header. Demo APIs are intentionally ephemeral and must not be exposed as production persistence.
