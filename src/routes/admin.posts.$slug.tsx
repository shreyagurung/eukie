import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  deletePost,
  fetchAllPosts,
  fetchPlaces,
  fetchPostBySlug,
  fetchTags,
  fetchTopics,
  parseVideoUrl,
  upsertPost,
  uploadImage,
  type PostInput,
} from "@/lib/cms/queries";
import type {
  ContentBlock,
  MediaImage,
  MediaVideo,
  Post,
  Topic,
} from "@/lib/cms/types";
import { ImageUploadButton } from "./admin.index";

export const Route = createFileRoute("/admin/posts/$slug")({
  component: PostEditor,
});

const inputCls =
  "w-full border border-rule bg-transparent px-2 py-1.5 text-sm font-mono focus:outline-none focus:border-accent";

const empty: PostInput = {
  slug: "",
  title: "",
  date: new Date().toISOString().slice(0, 10),
  excerpt: "",
  cover: { type: "image", id: "cover", src: "", alt: "", orientation: "landscape", aspect: "3/2" },
  topic: "",
  topics: [],
  tags: [],
  place: "",
  format: "essay",
  featured: false,
  readingTime: 5,
  status: "draft",
  body: [],
  related: [],
};

function PostEditor() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const isNew = slug === "new";

  const [form, setForm] = useState<PostInput | null>(null);
  const [originalSlug, setOriginalSlug] = useState<string | undefined>(undefined);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [tags, setTags] = useState<{ slug: string; name: string }[]>([]);
  const [places, setPlaces] = useState<{ slug: string; name: string }[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const [t, g, p, posts] = await Promise.all([fetchTopics(), fetchTags(), fetchPlaces(), fetchAllPosts()]);
      setTopics(t); setTags(g); setPlaces(p); setAllPosts(posts);
      if (isNew) {
        setForm(empty);
      } else {
        const existing = await fetchPostBySlug(slug);
        if (existing) {
          setForm({
            slug: existing.slug,
            title: existing.title,
            date: existing.date.slice(0, 10),
            excerpt: existing.excerpt,
            cover: existing.cover,
            topic: existing.topic,
            topics: existing.topics,
            tags: existing.tags,
            place: existing.place,
            format: existing.format,
            featured: existing.featured,
            readingTime: existing.readingTime,
            status: existing.visibility === "public" ? "published" : "draft",
            body: existing.body,
            related: existing.related,
          });
          setOriginalSlug(existing.slug);
        } else {
          setErr(`No post with slug "${slug}"`);
        }
      }
    })().catch((e) => setErr(String(e)));
  }, [slug, isNew]);

  const update = (patch: Partial<PostInput>) => setForm((f) => (f ? { ...f, ...patch } : f));

  const save = async (publish?: boolean) => {
    if (!form) return;
    setBusy(true); setErr(null);
    try {
      const final: PostInput = {
        ...form,
        status: publish === undefined ? form.status : publish ? "published" : "draft",
      };
      await upsertPost(final, originalSlug);
      navigate({ to: "/admin/posts/$slug", params: { slug: final.slug } });
      setOriginalSlug(final.slug);
    } catch (e) { setErr(e instanceof Error ? e.message : String(e)); }
    finally { setBusy(false); }
  };

  const remove = async () => {
    if (!originalSlug) return;
    if (!confirm("Delete this entry? This cannot be undone.")) return;
    await deletePost(originalSlug);
    navigate({ to: "/admin" });
  };

  if (err && !form) return <p className="font-mono text-sm text-red-700">{err}</p>;
  if (!form) return <p className="font-mono text-[11px] text-ink-mute">Loading…</p>;

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-rule pb-4">
        <div>
          <Link to="/admin" className="text-[10px] font-mono uppercase tracking-widest text-ink-mute hover:text-accent">← Dashboard</Link>
          <h1 className="font-display text-3xl italic mt-1">{isNew ? "New entry" : form.title || "Untitled"}</h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {!isNew && (
            <Link to="/journal/$slug" params={{ slug: form.slug }} className="text-[10px] font-mono uppercase tracking-widest border border-rule px-3 py-2 hover:bg-ink hover:text-paper">
              View
            </Link>
          )}
          <button disabled={busy} onClick={() => save(false)} className="text-[10px] font-mono uppercase tracking-widest border border-rule px-3 py-2 hover:bg-ink hover:text-paper disabled:opacity-50">Save draft</button>
          <button disabled={busy} onClick={() => save(true)} className="text-[10px] font-mono uppercase tracking-widest bg-ink text-paper px-3 py-2 hover:bg-accent disabled:opacity-50">Publish</button>
          {!isNew && <button onClick={remove} className="text-[10px] font-mono uppercase tracking-widest text-red-700 px-2 py-2 hover:underline">Delete</button>}
        </div>
      </header>

      {err && <p className="font-mono text-[12px] text-red-700">{err}</p>}

      <div className="grid lg:grid-cols-[1fr_320px] gap-10">
        {/* Main column */}
        <div className="space-y-6 min-w-0">
          <Field label="Title"><input value={form.title} onChange={(e) => update({ title: e.target.value })} className={inputCls + " text-xl"} /></Field>
          <Field label="Slug"><input value={form.slug} onChange={(e) => update({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-") })} className={inputCls} /></Field>
          <Field label="Excerpt"><textarea value={form.excerpt} onChange={(e) => update({ excerpt: e.target.value })} className={inputCls + " min-h-[80px]"} /></Field>

          <fieldset className="border border-rule p-4 space-y-3">
            <legend className="font-mono text-[10px] uppercase tracking-widest text-accent px-1">Cover image</legend>
            <Field label="URL">
              <input value={form.cover.src} onChange={(e) => update({ cover: { ...form.cover, src: e.target.value } })} className={inputCls} />
              <ImageUploadButton onUploaded={(url) => update({ cover: { ...form.cover, src: url } })} />
            </Field>
            <Field label="Alt text"><input value={form.cover.alt} onChange={(e) => update({ cover: { ...form.cover, alt: e.target.value } })} className={inputCls} /></Field>
            <Field label="Caption"><input value={form.cover.caption ?? ""} onChange={(e) => update({ cover: { ...form.cover, caption: e.target.value } })} className={inputCls} /></Field>
            <Field label="Credit"><input value={form.cover.credit ?? ""} onChange={(e) => update({ cover: { ...form.cover, credit: e.target.value } })} className={inputCls} /></Field>
            {form.cover.src && <img src={form.cover.src} alt={form.cover.alt} className="max-h-48 ring-1 ring-rule" />}
          </fieldset>

          <BlocksEditor blocks={form.body} onChange={(body) => update({ body })} />
        </div>

        {/* Sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-24 self-start">
          <div className="border border-rule p-4 space-y-3">
            <div className="font-mono text-[10px] uppercase tracking-widest text-accent">Metadata</div>
            <Field label="Date"><input type="date" value={form.date.slice(0, 10)} onChange={(e) => update({ date: e.target.value })} className={inputCls} /></Field>
            <Field label="Place">
              <select value={form.place} onChange={(e) => update({ place: e.target.value })} className={inputCls}>
                <option value="">—</option>
                {places.map((p) => <option key={p.slug} value={p.name}>{p.name}</option>)}
              </select>
            </Field>
            <Field label="Format">
              <select value={form.format} onChange={(e) => update({ format: e.target.value as PostInput["format"] })} className={inputCls}>
                {(["essay", "field notes", "visual", "multimedia"] as const).map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </Field>
            <Field label="Reading time (min)"><input type="number" min={1} value={form.readingTime} onChange={(e) => update({ readingTime: Number(e.target.value) })} className={inputCls} /></Field>
            <label className="flex items-center gap-2 text-[11px] font-mono">
              <input type="checkbox" checked={form.featured} onChange={(e) => update({ featured: e.target.checked })} /> Featured
            </label>
            <div className="text-[11px] font-mono">Status: <span className={form.status === "published" ? "text-accent" : "text-ink-mute"}>{form.status}</span></div>
          </div>

          <div className="border border-rule p-4 space-y-3">
            <div className="font-mono text-[10px] uppercase tracking-widest text-accent">Primary topic</div>
            <select value={form.topic} onChange={(e) => update({ topic: e.target.value })} className={inputCls}>
              <option value="">—</option>
              {topics.map((t) => <option key={t.slug} value={t.slug}>{t.name}</option>)}
            </select>
            <div className="font-mono text-[10px] uppercase tracking-widest text-accent pt-2">Additional topics</div>
            <MultiPick options={topics.map((t) => ({ value: t.slug, label: t.name }))} value={form.topics} onChange={(v) => update({ topics: v })} />
          </div>

          <div className="border border-rule p-4 space-y-3">
            <div className="font-mono text-[10px] uppercase tracking-widest text-accent">Tags</div>
            <MultiPick options={tags.map((t) => ({ value: t.slug, label: t.name }))} value={form.tags} onChange={(v) => update({ tags: v })} />
            <p className="text-[10px] font-mono text-ink-mute">Manage tags from the dashboard.</p>
          </div>

          <div className="border border-rule p-4 space-y-3">
            <div className="font-mono text-[10px] uppercase tracking-widest text-accent">Related posts</div>
            <MultiPick
              options={allPosts.filter((p) => p.slug !== form.slug).map((p) => ({ value: p.slug, label: p.title }))}
              value={form.related}
              onChange={(v) => update({ related: v })}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="block text-[10px] font-mono uppercase tracking-widest text-ink-mute">{label}</span>
      {children}
    </label>
  );
}

function MultiPick({ options, value, onChange }: { options: { value: string; label: string }[]; value: string[]; onChange: (v: string[]) => void }) {
  const set = new Set(value);
  return (
    <div className="flex flex-wrap gap-1.5 max-h-48 overflow-auto">
      {options.map((o) => {
        const active = set.has(o.value);
        return (
          <button
            type="button"
            key={o.value}
            onClick={() => onChange(active ? value.filter((v) => v !== o.value) : [...value, o.value])}
            className={"text-[10px] font-mono uppercase tracking-widest border px-2 py-1 " + (active ? "bg-ink text-paper border-ink" : "border-rule text-ink-soft hover:border-ink")}
          >
            {o.label}
          </button>
        );
      })}
      {options.length === 0 && <span className="text-[10px] font-mono text-ink-mute">None available</span>}
    </div>
  );
}

// ============= Block editor =============

const BLOCK_TYPES: { type: ContentBlock["type"]; label: string }[] = [
  { type: "text", label: "Rich text" },
  { type: "highlight", label: "Highlight" },
  { type: "quote", label: "Quote" },
  { type: "image", label: "Single image" },
  { type: "image-grid", label: "Image gallery" },
  { type: "video-landscape", label: "Landscape video" },
  { type: "video-grid-portrait", label: "Portrait video gallery" },
  { type: "caption", label: "Caption" },
  { type: "divider", label: "Divider" },
  { type: "reflection", label: "Reflection / Callout" },
  { type: "link", label: "Link / Resource" },
];

function newBlock(type: ContentBlock["type"]): ContentBlock {
  const id = crypto.randomUUID();
  switch (type) {
    case "text": return { type, id, body: "" };
    case "highlight": return { type, id, body: "" };
    case "quote": return { type, id, body: "", cite: "" };
    case "image": return { type, id, image: { type: "image", id: crypto.randomUUID(), src: "", alt: "", orientation: "landscape", aspect: "3/2" } };
    case "image-grid": return { type, id, images: [], caption: "" };
    case "video-landscape": return { type, id, video: { type: "video", id: crypto.randomUUID(), source: "youtube", videoId: "", thumbnail: "", alt: "", orientation: "landscape" } };
    case "video-grid-portrait": return { type, id, videos: [], lightboxGroup: id, caption: "" };
    case "caption": return { type, id, body: "" };
    case "divider": return { type, id };
    case "reflection": return { type, id, label: "Reflection", body: "" };
    case "link": return { type, id, title: "", url: "", source: "" };
  }
}

function BlocksEditor({ blocks, onChange }: { blocks: ContentBlock[]; onChange: (b: ContentBlock[]) => void }) {
  const [adding, setAdding] = useState(false);

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= blocks.length) return;
    const next = [...blocks];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const remove = (i: number) => onChange(blocks.filter((_, k) => k !== i));
  const update = (i: number, b: ContentBlock) => onChange(blocks.map((x, k) => (k === i ? b : x)));
  const add = (t: ContentBlock["type"]) => { onChange([...blocks, newBlock(t)]); setAdding(false); };

  return (
    <fieldset className="border border-rule p-4 space-y-4">
      <legend className="font-mono text-[10px] uppercase tracking-widest text-accent px-1">Content blocks · {blocks.length}</legend>
      {blocks.length === 0 && <p className="text-[11px] font-mono text-ink-mute">No blocks yet.</p>}
      {blocks.map((b, i) => (
        <div key={b.id} className="border border-rule p-3 space-y-2 bg-paper/50">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-accent">{i + 1}. {b.type}</span>
            <div className="flex gap-1 text-[10px] font-mono">
              <button type="button" onClick={() => move(i, -1)} className="border border-rule px-2 py-0.5 hover:bg-ink hover:text-paper">↑</button>
              <button type="button" onClick={() => move(i, 1)} className="border border-rule px-2 py-0.5 hover:bg-ink hover:text-paper">↓</button>
              <button type="button" onClick={() => remove(i)} className="border border-rule px-2 py-0.5 text-red-700 hover:bg-red-700 hover:text-paper">✕</button>
            </div>
          </div>
          <BlockFields block={b} onChange={(nb) => update(i, nb)} />
        </div>
      ))}

      {adding ? (
        <div className="flex flex-wrap gap-2">
          {BLOCK_TYPES.map((b) => (
            <button key={b.type} type="button" onClick={() => add(b.type)} className="text-[10px] font-mono uppercase tracking-widest border border-rule px-2 py-1 hover:bg-ink hover:text-paper">
              + {b.label}
            </button>
          ))}
          <button type="button" onClick={() => setAdding(false)} className="text-[10px] font-mono uppercase tracking-widest text-ink-mute px-2 py-1">Cancel</button>
        </div>
      ) : (
        <button type="button" onClick={() => setAdding(true)} className="text-[10px] font-mono uppercase tracking-widest bg-ink text-paper px-3 py-1.5 hover:bg-accent">+ Add block</button>
      )}
    </fieldset>
  );
}

function BlockFields({ block, onChange }: { block: ContentBlock; onChange: (b: ContentBlock) => void }) {
  switch (block.type) {
    case "text":
    case "highlight":
    case "caption":
      return <Field label="Body"><textarea value={block.body} onChange={(e) => onChange({ ...block, body: e.target.value })} className={inputCls + " min-h-[100px]"} /></Field>;
    case "reflection":
      return (
        <>
          <Field label="Label"><input value={block.label ?? ""} onChange={(e) => onChange({ ...block, label: e.target.value })} className={inputCls} /></Field>
          <Field label="Body"><textarea value={block.body} onChange={(e) => onChange({ ...block, body: e.target.value })} className={inputCls + " min-h-[100px]"} /></Field>
        </>
      );
    case "quote":
      return (
        <>
          <Field label="Quote"><textarea value={block.body} onChange={(e) => onChange({ ...block, body: e.target.value })} className={inputCls + " min-h-[80px]"} /></Field>
          <Field label="Citation"><input value={block.cite ?? ""} onChange={(e) => onChange({ ...block, cite: e.target.value })} className={inputCls} /></Field>
        </>
      );
    case "divider":
      return <p className="text-[10px] font-mono text-ink-mute">A horizontal divider.</p>;
    case "link":
      return (
        <>
          <Field label="Title"><input value={block.title} onChange={(e) => onChange({ ...block, title: e.target.value })} className={inputCls} /></Field>
          <Field label="URL"><input value={block.url} onChange={(e) => onChange({ ...block, url: e.target.value })} className={inputCls} /></Field>
          <Field label="Source / publisher"><input value={block.source ?? ""} onChange={(e) => onChange({ ...block, source: e.target.value })} className={inputCls} /></Field>
        </>
      );
    case "image":
      return <ImageFields image={block.image} onChange={(image) => onChange({ ...block, image })} />;
    case "image-grid":
      return (
        <>
          <Field label="Caption"><input value={block.caption ?? ""} onChange={(e) => onChange({ ...block, caption: e.target.value })} className={inputCls} /></Field>
          <MediaListEditor
            items={block.images}
            onChange={(images) => onChange({ ...block, images: images as MediaImage[] })}
            kind="image"
          />
        </>
      );
    case "video-landscape":
      return <VideoFields video={block.video} orientation="landscape" onChange={(video) => onChange({ ...block, video })} />;
    case "video-grid-portrait":
      return (
        <>
          <Field label="Caption"><input value={block.caption ?? ""} onChange={(e) => onChange({ ...block, caption: e.target.value })} className={inputCls} /></Field>
          <MediaListEditor
            items={block.videos}
            onChange={(videos) => onChange({ ...block, videos: videos as MediaVideo[] })}
            kind="video-portrait"
          />
        </>
      );
  }
}

function ImageFields({ image, onChange }: { image: MediaImage; onChange: (i: MediaImage) => void }) {
  return (
    <div className="space-y-2">
      <Field label="Image URL">
        <input value={image.src} onChange={(e) => onChange({ ...image, src: e.target.value })} className={inputCls} />
        <ImageUploadButton onUploaded={(url) => onChange({ ...image, src: url })} />
      </Field>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Alt text"><input value={image.alt} onChange={(e) => onChange({ ...image, alt: e.target.value })} className={inputCls} /></Field>
        <Field label="Orientation">
          <select value={image.orientation} onChange={(e) => onChange({ ...image, orientation: e.target.value as MediaImage["orientation"] })} className={inputCls}>
            <option value="landscape">landscape</option>
            <option value="portrait">portrait</option>
            <option value="square">square</option>
          </select>
        </Field>
        <Field label="Caption"><input value={image.caption ?? ""} onChange={(e) => onChange({ ...image, caption: e.target.value })} className={inputCls} /></Field>
        <Field label="Credit"><input value={image.credit ?? ""} onChange={(e) => onChange({ ...image, credit: e.target.value })} className={inputCls} /></Field>
      </div>
      {image.src && <img src={image.src} alt={image.alt} className="max-h-32 ring-1 ring-rule" />}
    </div>
  );
}

function VideoFields({ video, orientation, onChange }: { video: MediaVideo; orientation: "landscape" | "portrait"; onChange: (v: MediaVideo) => void }) {
  const [url, setUrl] = useState("");
  return (
    <div className="space-y-2">
      <Field label="Paste YouTube / YouTube Shorts / Vimeo URL">
        <div className="flex gap-2">
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" className={inputCls} />
          <button
            type="button"
            onClick={() => {
              const parsed = parseVideoUrl(url);
              if (parsed) onChange({ ...video, source: parsed.source, videoId: parsed.videoId, orientation });
              setUrl("");
            }}
            className="text-[10px] font-mono uppercase tracking-widest bg-ink text-paper px-3 py-1.5 hover:bg-accent"
          >
            Parse
          </button>
        </div>
      </Field>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Source">
          <select value={video.source} onChange={(e) => onChange({ ...video, source: e.target.value as MediaVideo["source"] })} className={inputCls}>
            <option value="youtube">youtube</option>
            <option value="youtube-shorts">youtube-shorts</option>
            <option value="vimeo">vimeo</option>
          </select>
        </Field>
        <Field label="Video ID"><input value={video.videoId} onChange={(e) => onChange({ ...video, videoId: e.target.value })} className={inputCls} /></Field>
        <Field label="Alt text"><input value={video.alt} onChange={(e) => onChange({ ...video, alt: e.target.value })} className={inputCls} /></Field>
        <Field label="Duration (e.g. 1:23)"><input value={video.duration ?? ""} onChange={(e) => onChange({ ...video, duration: e.target.value })} className={inputCls} /></Field>
      </div>
      <Field label="Custom thumbnail URL">
        <input value={video.thumbnail} onChange={(e) => onChange({ ...video, thumbnail: e.target.value })} className={inputCls} />
        <ImageUploadButton onUploaded={(u) => onChange({ ...video, thumbnail: u })} />
      </Field>
      <Field label="Caption"><input value={video.caption ?? ""} onChange={(e) => onChange({ ...video, caption: e.target.value })} className={inputCls} /></Field>
      {video.thumbnail && <img src={video.thumbnail} alt={video.alt} className="max-h-32 ring-1 ring-rule" />}
    </div>
  );
}

function MediaListEditor({
  items, onChange, kind,
}: {
  items: (MediaImage | MediaVideo)[];
  onChange: (i: (MediaImage | MediaVideo)[]) => void;
  kind: "image" | "video-portrait";
}) {
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const remove = (i: number) => onChange(items.filter((_, k) => k !== i));
  const addImage = () => onChange([...items, { type: "image", id: crypto.randomUUID(), src: "", alt: "", orientation: "landscape", aspect: "3/2" }] as MediaImage[]);
  const addVideo = () => onChange([...items, { type: "video", id: crypto.randomUUID(), source: "youtube-shorts", videoId: "", thumbnail: "", alt: "", orientation: "portrait" }] as MediaVideo[]);

  return (
    <div className="space-y-2">
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={it.id} className="border border-rule p-2 space-y-2 bg-paper">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono uppercase tracking-widest text-ink-mute">#{i + 1}</span>
              <div className="flex gap-1 text-[10px] font-mono">
                <button type="button" onClick={() => move(i, -1)} className="border border-rule px-2 py-0.5 hover:bg-ink hover:text-paper">↑</button>
                <button type="button" onClick={() => move(i, 1)} className="border border-rule px-2 py-0.5 hover:bg-ink hover:text-paper">↓</button>
                <button type="button" onClick={() => remove(i)} className="border border-rule px-2 py-0.5 text-red-700">✕</button>
              </div>
            </div>
            {it.type === "image" ? (
              <ImageFields image={it} onChange={(img) => onChange(items.map((x, k) => (k === i ? img : x)))} />
            ) : (
              <VideoFields video={it} orientation="portrait" onChange={(v) => onChange(items.map((x, k) => (k === i ? v : x)))} />
            )}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={kind === "image" ? addImage : addVideo}
        className="text-[10px] font-mono uppercase tracking-widest border border-rule px-2 py-1 hover:bg-ink hover:text-paper"
      >
        + Add {kind === "image" ? "image" : "video"}
      </button>
    </div>
  );
}
