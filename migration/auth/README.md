# Auth inventory

Snapshot at migration time.

## Providers enabled
- **Email / password** — only provider in use.
- No Google, Apple, SAML, or other social providers configured.

## Users (1)
| Email | Role | Notes |
|---|---|---|
| `shreyagurung07@gmail.com` | `admin` | You. Old UUID: `84397c5b-c33b-4dd2-ba5c-6bdf620ae274` |

## Why `auth.users` rows aren't exported as SQL

Supabase doesn't allow re-inserting rows into `auth.users` directly:
- Passwords are bcrypt-hashed with a server-side pepper that's project-specific, so hashes don't transfer.
- Internal columns (`encrypted_password`, `confirmation_token`, etc.) are managed by GoTrue.

Supported paths for recreating users:

### Option A — Re-signup (simplest, one user)
1. After flipping env vars to your new project, open the app's sign-in page.
2. Sign up with the same email; set a fresh password.
3. Grant admin:
   ```sql
   insert into public.user_roles (user_id, role)
   select id, 'admin' from auth.users where email = 'shreyagurung07@gmail.com';
   ```

### Option B — Admin API invite (recommended if you add more users later)
Run with the new project's service role key:
```ts
import { createClient } from "@supabase/supabase-js";
const admin = createClient(NEW_URL, NEW_SERVICE_ROLE_KEY);
await admin.auth.admin.inviteUserByEmail("shreyagurung07@gmail.com");
```
The user clicks the email link and sets a password. Then grant admin as in Option A.

### Option C — Bulk migration (for many users)
Supabase supports importing users with hashed passwords IF the source uses a compatible bcrypt format. Reference: https://supabase.com/docs/guides/auth/auth-helpers/migrate. Not needed for a single user.
