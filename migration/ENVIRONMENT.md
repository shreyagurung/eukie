# Environment / configuration cutover

Update these values to point the app at your new Supabase project.

## Environment variables

| Variable | Where it's read | New value |
|---|---|---|
| `VITE_SUPABASE_URL` | browser (Vite build-time inlined) | `https://<your-ref>.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | browser | new project's **anon** key |
| `VITE_SUPABASE_PROJECT_ID` | browser (optional, used by tooling) | `<your-ref>` |
| `SUPABASE_URL` | server functions / SSR | same as `VITE_SUPABASE_URL` |
| `SUPABASE_PUBLISHABLE_KEY` | server functions (auth middleware) | same as `VITE_SUPABASE_PUBLISHABLE_KEY` |
| `SUPABASE_SERVICE_ROLE_KEY` | server admin client (webhooks, admin ops) | new project's **service role** key |
| `SUPABASE_PROJECT_ID` | server-side helpers | `<your-ref>` |
| `SUPABASE_DB_URL` | psql / migrations (optional) | new project's pooled connection string |

Grab the anon and service-role keys from Dashboard → Project Settings → API.

## Files to edit in the repo

- `.env` — replace all `VITE_SUPABASE_*` and `SUPABASE_*` values listed above.
- `supabase/config.toml` — change `project_id = "wjyjmxpszmdwxcpjhjxx"` to your new project ref.

That's it for code — `src/integrations/supabase/*` reads env vars at runtime, no per-file edits needed.

## Deployment notes

- **If you stay on Lovable**: Lovable Cloud re-injects its managed `SUPABASE_*` env vars on every deploy, so you cannot override them in a Cloud-managed deploy. To use your own Supabase here you must export the project (Lovable → Export) and deploy elsewhere (Vercel, Cloudflare Pages, Netlify, your own VM). Set the env vars in that host's project settings.
- **If you self-host**: set the env vars in your host's dashboard, redeploy, and you're done.

## Verification

After flipping env vars and redeploying:

1. Open the site — homepage loads with content from CSV import.
2. Visit `/journal/live-connection-test` — the test post renders.
3. Sign in at `/admin` — dashboard loads (proves auth + `private.has_role` works).
4. Open browser DevTools → Network → check that XHR requests hit `https://<your-ref>.supabase.co`, not `wjyjmxpszmdwxcpjhjxx.supabase.co`.
5. Upload an image in the admin media tab — confirms storage RLS works.
