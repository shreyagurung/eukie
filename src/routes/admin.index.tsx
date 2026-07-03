import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  deletePost,
  deletePlace,
  deleteTag,
  deleteTopic,
  fetchAllPosts,
  fetchPlaces,
  fetchTags,
  fetchTopics,
  upsertPlace,
  upsertTag,
  upsertTopic,
  uploadImage,
} from "@/lib/cms/queries";
import type { Post, Topic } from "@/lib/cms/types";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

type Tab = "posts" | "topics" | "tags" | "places" | "media";

function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("posts");

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-rule pb-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-accent">[ Editor ]</div>
          <h1 className="font-display text-3xl italic">Content dashboard</h1>
        </div>
        <Link
          to="/admin/posts/$slug"
          params={{ slug: "new" }}
          className="text-[11px] font-mono uppercase tracking-widest bg-ink text-paper px-4 py-2 hover:bg-accent"
        >
          + New entry
        </Link>
      </header>

      <nav className="flex flex-wrap gap-2 border-b border-rule">
        {(["posts", "topics", "tags", "places", "media"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={
              "px-3 py-2 text-[10px] font-mono uppercase tracking-widest border-b-2 -mb-px transition-colors " +
              (tab === t ? "border-accent text-accent" : "border-transparent text-ink-soft hover:text-ink")
            }
          >
            {t}
          </button>
        ))}
      </nav>

      {tab === "posts" && <PostsPanel />}
      {tab === "topics" && <TopicsPanel />}
      {tab === "tags" && <TaxonomyPanel kind="tag" />}
      {tab === "places" && <TaxonomyPanel kind="place" />}
      {tab === "media" && <MediaPanel />}
    </div>
  );
}

// ---------- Posts list ----------

function PostsPanel() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setPosts(await fetchAllPosts());
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (err) return <p className="font-mono text-sm text-red-700">{err}</p>;
  if (!posts) return <p className="font-mono text-[11px] text-ink-mute">Loading…</p>;

  return (
    <div>
      {posts.length === 0 && (
        <p className="font-mono text-sm text-ink-mute py-8">No entries yet. Create the first one.</p>
      )}
      <ul className="divide-y divide-rule">
        {posts.map((p) => (
          <li key={p.slug} className="py-3 flex flex-wrap items-baseline justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-3 flex-wrap">
                <Link
                  to="/admin/posts/$slug"
                  params={{ slug: p.slug }}
                  className="font-display text-xl hover:italic hover:text-accent"
                >
                  {p.title}
                </Link>
                <span className={`text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 border ${p.visibility === "public" ? "border-accent text-accent" : "border-rule text-ink-mute"}`}>
                  {p.visibility === "public" ? "Published" : "Draft"}
                </span>
                {p.featured && <span className="text-[9px] font-mono uppercase tracking-widest text-accent">★ Featured</span>}
              </div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-ink-mute mt-1">
                {p.slug} · {new Date(p.date).toLocaleDateString()} · {p.place}
              </div>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-widest">
              <Link to="/journal/$slug" params={{ slug: p.slug }} className="text-ink-soft hover:text-accent">View</Link>
              <Link to="/admin/posts/$slug" params={{ slug: p.slug }} className="text-ink-soft hover:text-accent">Edit</Link>
              <button
                onClick={async () => {
                  if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
                  await deletePost(p.slug);
                  load();
                }}
                className="text-red-700 hover:underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------- Topics ----------

function TopicsPanel() {
  const [topics, setTopics] = useState<Topic[] | null>(null);
  const [editing, setEditing] = useState<Topic | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    try { setTopics(await fetchTopics()); } catch (e) { setErr(String(e)); }
  }, []);
  useEffect(() => { load(); }, [load]);

  return (
    <div className="grid md:grid-cols-[1fr_320px] gap-8">
      <div>
        {err && <p className="font-mono text-sm text-red-700">{err}</p>}
        {!topics ? <p className="font-mono text-[11px] text-ink-mute">Loading…</p> : (
          <ul className="divide-y divide-rule">
            {topics.map((t) => (
              <li key={t.slug} className="py-3 flex justify-between items-baseline gap-4">
                <div>
                  <div className="font-display text-xl">{t.name}</div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-ink-mute">{t.slug}</div>
                </div>
                <div className="flex gap-3 text-[10px] font-mono uppercase tracking-widest">
                  <button onClick={() => setEditing(t)} className="text-ink-soft hover:text-accent">Edit</button>
                  <button onClick={async () => { if (confirm(`Delete topic ${t.name}?`)) { await deleteTopic(t.slug); load(); } }} className="text-red-700 hover:underline">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <TopicEditor
        key={editing?.slug ?? "new"}
        initial={editing ?? { slug: "", name: "", description: "", cover: "" }}
        onSaved={() => { setEditing(null); load(); }}
        onCancel={() => setEditing(null)}
      />
    </div>
  );
}

function TopicEditor({ initial, onSaved, onCancel }: { initial: Topic; onSaved: () => void; onCancel: () => void }) {
  const [t, setT] = useState<Topic>(initial);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true); setErr(null);
        try { await upsertTopic(t); onSaved(); setT({ slug: "", name: "", description: "", cover: "" }); }
        catch (e) { setErr(String(e)); }
        finally { setBusy(false); }
      }}
      className="space-y-3 border border-rule p-4 h-fit"
    >
      <div className="font-mono text-[10px] uppercase tracking-widest text-accent">{initial.slug ? "Edit topic" : "New topic"}</div>
      <Field label="Slug"><input required value={t.slug} onChange={(e) => setT({ ...t, slug: e.target.value })} className={inputCls} /></Field>
      <Field label="Name"><input required value={t.name} onChange={(e) => setT({ ...t, name: e.target.value })} className={inputCls} /></Field>
      <Field label="Description"><textarea value={t.description} onChange={(e) => setT({ ...t, description: e.target.value })} className={inputCls + " min-h-[80px]"} /></Field>
      <Field label="Cover image URL">
        <input value={t.cover} onChange={(e) => setT({ ...t, cover: e.target.value })} className={inputCls} />
        <ImageUploadButton onUploaded={(url) => setT({ ...t, cover: url })} />
      </Field>
      {err && <p className="text-[11px] font-mono text-red-700">{err}</p>}
      <div className="flex gap-2">
        <button disabled={busy} className="text-[10px] font-mono uppercase tracking-widest bg-ink text-paper px-3 py-1.5 hover:bg-accent disabled:opacity-50">Save</button>
        {initial.slug && <button type="button" onClick={onCancel} className="text-[10px] font-mono uppercase tracking-widest border border-rule px-3 py-1.5">Cancel</button>}
      </div>
    </form>
  );
}

// ---------- Tags / Places ----------

function TaxonomyPanel({ kind }: { kind: "tag" | "place" }) {
  const [items, setItems] = useState<{ slug: string; name: string }[] | null>(null);
  const [form, setForm] = useState({ slug: "", name: "" });
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    try { setItems(kind === "tag" ? await fetchTags() : await fetchPlaces()); }
    catch (e) { setErr(String(e)); }
  }, [kind]);
  useEffect(() => { load(); }, [load]);

  return (
    <div className="grid md:grid-cols-[1fr_320px] gap-8">
      <div>
        {err && <p className="font-mono text-sm text-red-700">{err}</p>}
        {!items ? <p className="font-mono text-[11px] text-ink-mute">Loading…</p> : (
          <ul className="divide-y divide-rule">
            {items.map((i) => (
              <li key={i.slug} className="py-3 flex justify-between items-baseline">
                <div>
                  <div className="font-display text-lg">{i.name}</div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-ink-mute">{i.slug}</div>
                </div>
                <button onClick={async () => { if (confirm(`Delete ${i.name}?`)) { kind === "tag" ? await deleteTag(i.slug) : await deletePlace(i.slug); load(); } }} className="text-[10px] font-mono uppercase tracking-widest text-red-700 hover:underline">Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            kind === "tag" ? await upsertTag(form) : await upsertPlace(form);
            setForm({ slug: "", name: "" });
            load();
          } catch (e) { setErr(String(e)); }
        }}
        className="space-y-3 border border-rule p-4 h-fit"
      >
        <div className="font-mono text-[10px] uppercase tracking-widest text-accent">New {kind}</div>
        <Field label="Slug"><input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={inputCls} /></Field>
        <Field label="Name"><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} /></Field>
        <button className="text-[10px] font-mono uppercase tracking-widest bg-ink text-paper px-3 py-1.5 hover:bg-accent">Add</button>
      </form>
    </div>
  );
}

// ---------- Media panel ----------

function MediaPanel() {
  const [files, setFiles] = useState<{ name: string; url: string }[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data, error } = await supabase.storage.from("media").list("", { limit: 200, sortBy: { column: "created_at", order: "desc" } });
      if (error) throw error;
      const rows = (data ?? []).filter((f) => !f.name.endsWith("/")).map((f) => ({
        name: f.name,
        url: supabase.storage.from("media").getPublicUrl(f.name).data.publicUrl,
      }));
      setFiles(rows);
    } catch (e) { setErr(String(e)); }
  }, []);
  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border border-rule p-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-accent">Upload</div>
          <p className="text-sm text-ink-soft">Images stored in the <code>media</code> bucket. Public URLs are returned for use in posts.</p>
        </div>
        <label className="text-[11px] font-mono uppercase tracking-widest bg-ink text-paper px-4 py-2 hover:bg-accent cursor-pointer">
          {busy ? "Uploading…" : "Select file"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              setBusy(true); setErr(null);
              try { await uploadImage(f); await load(); }
              catch (e) { setErr(String(e)); }
              finally { setBusy(false); e.target.value = ""; }
            }}
          />
        </label>
      </div>
      {err && <p className="font-mono text-sm text-red-700">{err}</p>}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {files.map((f) => (
          <button
            key={f.name}
            onClick={() => { navigator.clipboard.writeText(f.url); }}
            className="block ring-1 ring-rule overflow-hidden bg-secondary text-left group"
            title="Click to copy URL"
          >
            <div className="aspect-square overflow-hidden">
              <img src={f.url} alt={f.name} className="w-full h-full object-cover" />
            </div>
            <div className="px-2 py-1 text-[9px] font-mono truncate text-ink-mute group-hover:text-accent">{f.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------- helpers ----------

const inputCls = "w-full border border-rule bg-transparent px-2 py-1.5 text-sm font-mono focus:outline-none focus:border-accent";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="block text-[10px] font-mono uppercase tracking-widest text-ink-mute">{label}</span>
      {children}
    </label>
  );
}

export function ImageUploadButton({ onUploaded }: { onUploaded: (url: string) => void }) {
  const [busy, setBusy] = useState(false);
  return (
    <label className="inline-block mt-1 text-[10px] font-mono uppercase tracking-widest border border-rule px-2 py-1 hover:bg-ink hover:text-paper cursor-pointer">
      {busy ? "…" : "Upload"}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          setBusy(true);
          try { const url = await uploadImage(f); onUploaded(url); }
          finally { setBusy(false); e.target.value = ""; }
        }}
      />
    </label>
  );
}
