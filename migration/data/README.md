# Data export

Snapshot exported at migration time.

| File | Table | Rows |
|---|---|---|
| `profiles.csv` | `public.profiles` | 1 |
| `user_roles.csv` | `public.user_roles` | 1 |
| `topics.csv` | `public.topics` | 5 |
| `tags.csv` | `public.tags` | 20 |
| `places.csv` | `public.places` | 6 |
| `posts.csv` | `public.posts` | 7 |

## Import order (respects FK / lookup dependencies)

```bash
cd migration/data
psql "<your SUPABASE_DB_URL>" <<'SQL'
\copy public.topics   from 'topics.csv'   with (format csv, header true)
\copy public.tags     from 'tags.csv'     with (format csv, header true)
\copy public.places   from 'places.csv'   with (format csv, header true)
\copy public.posts    from 'posts.csv'    with (format csv, header true)
SQL
```

`posts.body` and `posts.cover` are JSON-encoded strings in the CSV; Postgres parses them back to `jsonb` on import.

## Why `profiles.csv` and `user_roles.csv` are NOT imported as-is

Both reference the *old* `auth.users.id` (`84397c5b-c33b-4dd2-ba5c-6bdf620ae274`). That UUID does not exist in your new project, so the FK to `auth.users(id)` would fail. Instead:

1. Create your user in the new project (Runbook step 2). The `handle_new_user` trigger inserts the profile row for you.
2. Insert the admin role manually with the new UUID (Runbook step 3).

If you need to preserve `display_name` or other profile fields, edit `profiles.csv` to replace the old `id` with the new UUID, then `\copy ... ON CONFLICT (id) DO UPDATE`.

## Re-exporting later

If more data is added before cutover, re-run from the project root:

```bash
for t in profiles user_roles topics tags places posts; do
  psql -c "\copy (SELECT * FROM public.$t) TO STDOUT WITH (FORMAT csv, HEADER true)" \
    > migration/data/$t.csv
done
```
