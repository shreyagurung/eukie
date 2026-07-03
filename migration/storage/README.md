# Storage inventory

Snapshot at migration time.

| Bucket | Public? | Objects |
|---|---|---|
| `media` | private | 0 |

Nothing to copy. The bucket is recreated by `schema.sql` along with its RLS policies (public read, admin write).

## If you upload files before cutover

Re-run the inventory:

```bash
psql -c "SELECT bucket_id, count(*) FROM storage.objects GROUP BY 1;"
```

Then copy files with `supabase-js` (run locally with both projects' service-role keys):

```ts
import { createClient } from "@supabase/supabase-js";

const SRC = createClient(SRC_URL, SRC_SERVICE_ROLE);
const DST = createClient(DST_URL, DST_SERVICE_ROLE);

const { data: files } = await SRC.storage.from("media").list("", { limit: 1000 });
for (const f of files ?? []) {
  const { data: blob } = await SRC.storage.from("media").download(f.name);
  if (blob) await DST.storage.from("media").upload(f.name, blob, { upsert: true });
}
```

For nested folders, recurse with `list(folderPath)` for each subdirectory.
