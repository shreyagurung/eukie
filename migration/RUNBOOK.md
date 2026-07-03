# Migration Runbook — Lovable Cloud → your own Supabase

Follow these steps in order. Estimated time: 30–60 minutes.

## 0. Prerequisites
- A new (empty) Supabase project you own. Note its **Project Ref**, **anon key**, **service role key**, and **DB connection string** (Project Settings → API / Database).
- `psql` installed locally, or use the Supabase SQL Editor in the dashboard.

## 1. Create the schema
Run [`schema.sql`](./schema.sql) once against your new project:

```bash
psql "<your SUPABASE_DB_URL>" -f migration/schema.sql
```
Or paste the file into Supabase Dashboard → SQL Editor → Run.

This creates all tables, indexes, functions, triggers, RLS policies, and the `media` storage bucket.

## 2. Enable Email auth + create your admin user
1. Dashboard → Authentication → Providers → enable **Email** (disable "Confirm email" if you want instant sign-in like the current setup).
2. Authentication → Users → **Add user** → email `shreyagurung07@gmail.com` (or sign up through your app once env vars are flipped — step 5).
3. Copy the new user's UUID — you'll need it in step 3.

The `handle_new_user` trigger automatically creates the matching `public.profiles` row.

## 3. Grant yourself admin
```sql
insert into public.user_roles (user_id, role)
values ('<NEW-USER-UUID>', 'admin');
```

## 4. Import existing content
See [`data/README.md`](./data/README.md). In short:

```bash
cd migration/data
psql "<your SUPABASE_DB_URL>" <<'SQL'
\copy public.topics   from 'topics.csv'   with (format csv, header true)
\copy public.tags     from 'tags.csv'     with (format csv, header true)
\copy public.places   from 'places.csv'   with (format csv, header true)
\copy public.posts    from 'posts.csv'    with (format csv, header true)
SQL
```

Skip `profiles.csv` and `user_roles.csv` — those rows reference the old user UUID and are replaced by steps 2–3.

## 5. Storage
The `media` bucket is empty in the current backend (0 objects), so nothing to copy. See [`storage/README.md`](./storage/README.md) for a transfer script in case you upload files before cutover.

## 6. Flip environment variables
See [`ENVIRONMENT.md`](./ENVIRONMENT.md). Update the 8 listed variables to point at your new project, then redeploy / restart.

## 7. Smoke test
- `/journal/live-connection-test` loads as a visitor.
- `/admin` lets you sign in with `shreyagurung07@gmail.com` and shows the posts list.
- Upload a test image in `/admin` → confirms storage works.
- Publish a new post → confirms write path + RLS.

Done — you now own the backend end-to-end.
