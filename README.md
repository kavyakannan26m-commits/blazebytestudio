# BlazeByte Studio

Next.js App Router + TypeScript + Tailwind CSS + Supabase/PostgreSQL.

## Stage 1 / Stage 2 / Stage 3 included
- Supabase schema + RLS
- Public website and database-backed course catalog/details
- Clearly labelled demo seed data
- Student registration/login
- Protected student dashboard
- Middleware session gate

## Environment
- `NEXT_PUBLIC_SUPABASE_URL` — browser/server public project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — public anon/publishable key
- `SUPABASE_SERVICE_ROLE_KEY` — server-only; do not expose to client

## Supabase setup
Run `supabase/schema.sql`, then `supabase/rls.sql`, then `supabase/seed.sql` in the Supabase SQL editor.
Enable email/password authentication in Supabase Auth.

## Verification
`npm install` → `npm run typecheck` → `npm run build`.
The project is configured for Node 20+ and Next.js 15.
