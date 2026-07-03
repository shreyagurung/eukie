
# Migration plan: Lovable Cloud → your own Supabase project

Goal: hand you everything needed to recreate this app's backend in a Supabase project you own, with zero data loss. Nothing destructive runs on the current backend.

## What I'll generate (deliverables)

All files written under `migration/` in the repo so you can download them with the project export.

### 1. `migration/schema.sql` — one consolidated migration

Single idempotent SQL file you run once against your new Supabase project (SQL Editor or `psql`). It will contain, in order:

1. Extensions: `pgcrypto`.
2. Schemas: `private` (not exposed to PostgREST).
3. Enum: `public.app_role` (`admin`, `editor`).
4. Tables (with current columns, defaults, PKs, indexes):
   - `public.profiles` (id uuid PK → auth.users, email, display_name, timestamps)
   - `public.user_roles` (user_id, role, PK(user_id, role))
   - `public.topics` (slug PK, name, description, cover, timestamps)
   - `public.tags` (slug PK, name, created_at)
   - `public.places` (slug PK, name, created_at)
   - `public.posts` (slug PK, title, date, excerpt, cover jsonb, topic, topics[], tags[], place, format, featured, reading_time, status, published_at, related[], body jsonb, timestamps) + indexes on `date DESC`, `topic`, partial `featured`.
5. Functions:
   - `public.touch_updated_at()` trigger fn
   - `public.handle_new_user()` SECURITY DEFINER trigger fn (auto-creates profile row)
   - `private.has_role(uuid, app_role)` SECURITY DEFINER, EXECUTE granted only to `authenticated` (kept in `private` to satisfy the prior security finding)
6. Triggers:
   - `profiles_touch`, `topics_touch`, `posts_touch` on UPDATE
   - `on_auth_user_created` AFTER INSERT on `auth.users` → `handle_new_user()`
7. GRANTs for every public table (`anon` SELECT where policies allow public reads; `authenticated` full CRUD; `service_role` ALL).
8. `ALTER TABLE … ENABLE ROW LEVEL SECURITY` + the exact RLS policies currently in place (public read on `topics/tags/places/posts where status='published'`, admin-only writes via `private.has_role`, profile self-read/update, etc.).
9. Storage: `INSERT INTO storage.buckets (id, name, public) VALUES ('media','media', false)` + RLS policies on `storage.objects` for the `media` bucket (public read, admin write).

### 2. `migration/data/` — CSV exports of all current data

I'll dump each table to CSV with `\copy` via `psql` and commit them:

- `profiles.csv` (1 row)
- `user_roles.csv` (1 row — your admin grant)
- `topics.csv` (5)
- `tags.csv` (20)
- `places.csv` (6)
- `posts.csv` (7) — `body`/`cover` exported as JSON text; reimport preserves jsonb.

Plus `migration/data/README.md` with the exact `\copy ... FROM 'file.csv' WITH (FORMAT csv, HEADER true)` commands to load each, in dependency order.

Note: `auth.users` cannot be dumped from here (no permission, and Supabase doesn't allow restoring auth rows by SQL anyway). See section 4 below.

### 3. `migration/storage/README.md` — storage inventory + transfer steps

Current state (verified just now):
- Buckets: 1 — `media` (private)
- Objects: 0

So nothing to copy. The README will still document: bucket config to recreate (already in `schema.sql`), and a `supabase-js` snippet for future bulk transfer if you upload files before cutover.

### 4. `migration/auth/README.md` — auth inventory + recreation steps

Current state (verified):
- Providers enabled: **email/password** only. No Google/Apple/SAML configured.
- Users: **1** — `shreyagurung07@gmail.com` (you), with `admin` role in `user_roles`.

Recreation steps:
1. In your new Supabase project → Authentication → Providers, enable Email.
2. Sign up `shreyagurung07@gmail.com` (or invite via Auth → Users). The `handle_new_user` trigger will create the matching `profiles` row.
3. Insert one row into `public.user_roles` with the new `user_id` + `'admin'`.
4. CSV-loading the old `profiles.csv` / `user_roles.csv` will fail unless the new user IDs match — instructions will say to either (a) reuse the new user's id when inserting the admin row, or (b) edit the CSVs to use the new id before import.

### 5. `migration/ENVIRONMENT.md` — cutover checklist

Variables to update (in Lovable: Project Settings → Environment; or your own host's env):

| Variable | New value |
|---|---|
| `VITE_SUPABASE_URL` | `https://<your-ref>.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | new project's anon key |
| `VITE_SUPABASE_PROJECT_ID` | `<your-ref>` |
| `SUPABASE_URL` | same as above |
| `SUPABASE_PUBLISHABLE_KEY` | same anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | new project's service role key |
| `SUPABASE_PROJECT_ID` | `<your-ref>` |
| `SUPABASE_DB_URL` | new project's pooled connection string |

Plus: update `supabase/config.toml` `project_id`, redeploy/restart, and verify `/admin` + `/journal/live-connection-test` load against the new backend.

The doc will also note: Lovable Cloud cannot be disconnected from this project (per the cloud-connection FAQ), so the practical path is to either (a) export the project and host it elsewhere using your Supabase, or (b) keep using Lovable Cloud as the deployment but point env vars at your project — only viable in self-hosted/exported environments since Lovable-managed deploys re-inject Cloud's env vars.

### 6. `migration/RUNBOOK.md` — top-level order of operations

Single page that walks through: create Supabase project → run `schema.sql` → enable Email auth → create your user → grant admin → import CSVs → recreate storage objects (none today) → flip env vars → smoke test.

## Out of scope (and why)

- No changes to the running app or current backend — read-only export.
- I won't run anything against your new Supabase project; you do that step (I don't have credentials for it).
- `auth.users` rows can't be migrated as SQL (Supabase blocks it and passwords are hashed differently per project). Re-signup or Admin API invite is the only supported path; the runbook covers both.

## After you approve

I'll switch to build mode and create all files under `migration/` in one pass, including the CSV exports generated via `\copy`.
