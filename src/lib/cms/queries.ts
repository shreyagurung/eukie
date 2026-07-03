// Supabase-backed CMS query layer.
// All reads return the same shapes the existing frontend already expects
// (see ./types.ts). Mutations are admin-only and protected by RLS.
import { supabase } from "@/integrations/supabase/client";
import type {
  ContentBlock,
  MediaImage,
  MediaItem,
  MediaVideo,
  Post,
  Topic,
} from "./types";

type DbPost = {
  slug: string;
  title: string;
  date: string;
  excerpt: string | null;
  cover: unknown;
  topic: string | null;
  topics: string[] | null;
  tags: string[] | null;
  place: string | null;
  format: string;
  featured: boolean;
  reading_time: number;
  status: string;
  body: unknown;
  related: string[] | null;
  published_at: string | null;
};

function mapCover(cover: unknown, fallbackAlt: string): MediaImage {
  const c = (cover ?? {}) as Partial<MediaImage> & { src?: string };
  return {
    type: "image",
    id: c.id ?? "cover",
    src: c.src ?? "",
    alt: c.alt ?? fallbackAlt,
    caption: c.caption,
    credit: c.credit,
    orientation: (c.orientation as MediaImage["orientation"]) ?? "landscape",
    aspect: c.aspect ?? "3/2",
  };
}

function mapPost(row: DbPost): Post {
  return {
    slug: row.slug,
    title: row.title,
    date: row.date,
    excerpt: row.excerpt ?? "",
    cover: mapCover(row.cover, row.title),
    topic: row.topic ?? "",
    topics: row.topics ?? [],
    tags: row.tags ?? [],
    place: row.place ?? "",
    format: (row.format as Post["format"]) ?? "essay",
    featured: !!row.featured,
    readingTime: row.reading_time ?? 0,
    visibility: row.status === "published" ? "public" : "draft",
    body: Array.isArray(row.body) ? (row.body as ContentBlock[]) : [],
    related: row.related ?? [],
  };
}

const POST_COLUMNS =
  "slug,title,date,excerpt,cover,topic,topics,tags,place,format,featured,reading_time,status,body,related,published_at";

export async function fetchPublishedPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select(POST_COLUMNS)
    .eq("status", "published")
    .order("date", { ascending: false });
  if (error) throw error;
  return (data as DbPost[]).map(mapPost);
}

export async function fetchAllPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select(POST_COLUMNS)
    .order("date", { ascending: false });
  if (error) throw error;
  return (data as DbPost[]).map(mapPost);
}

export async function fetchPostBySlug(slug: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from("posts")
    .select(POST_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? mapPost(data as DbPost) : null;
}

export async function fetchPostsBySlugs(slugs: string[]): Promise<Post[]> {
  if (!slugs.length) return [];
  const { data, error } = await supabase
    .from("posts")
    .select(POST_COLUMNS)
    .in("slug", slugs)
    .eq("status", "published");
  if (error) throw error;
  return (data as DbPost[]).map(mapPost);
}

export async function fetchTopics(): Promise<Topic[]> {
  const { data, error } = await supabase
    .from("topics")
    .select("slug,name,description,cover")
    .order("name");
  if (error) throw error;
  return (data ?? []).map((t) => ({
    slug: t.slug,
    name: t.name,
    description: t.description ?? "",
    cover: t.cover ?? "",
  }));
}

export async function fetchTopicBySlug(slug: string): Promise<Topic | null> {
  const { data, error } = await supabase
    .from("topics")
    .select("slug,name,description,cover")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    slug: data.slug,
    name: data.name,
    description: data.description ?? "",
    cover: data.cover ?? "",
  };
}

export async function fetchPostsByTopic(slug: string): Promise<Post[]> {
  const all = await fetchPublishedPosts();
  return all.filter((p) => p.topic === slug || p.topics.includes(slug));
}

// ---------- Derivations ----------

export function allYearsFrom(posts: Post[]): number[] {
  return Array.from(
    new Set(posts.map((p) => new Date(p.date).getFullYear())),
  ).sort((a, b) => b - a);
}
export function allPlacesFrom(posts: Post[]): string[] {
  return Array.from(new Set(posts.map((p) => p.place).filter(Boolean))).sort();
}
export function allTagsFrom(posts: Post[]): string[] {
  return Array.from(new Set(posts.flatMap((p) => p.tags))).sort();
}
export function allFormatsFrom(posts: Post[]): string[] {
  return Array.from(new Set(posts.map((p) => p.format))).sort();
}

export function allMediaFrom(
  posts: Post[],
): (MediaItem & { postSlug: string })[] {
  const out: (MediaItem & { postSlug: string })[] = [];
  for (const p of posts) {
    if (p.cover?.src) out.push({ ...p.cover, postSlug: p.slug });
    for (const b of p.body) {
      if (b.type === "image") out.push({ ...b.image, postSlug: p.slug });
      if (b.type === "image-grid")
        b.images.forEach((i) => out.push({ ...i, postSlug: p.slug }));
      if (b.type === "video-landscape")
        out.push({ ...b.video, postSlug: p.slug });
      if (b.type === "video-grid-portrait")
        b.videos.forEach((v) => out.push({ ...v, postSlug: p.slug }));
    }
  }
  return out;
}

// ---------- Admin mutations ----------

export type PostInput = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  cover: MediaImage;
  topic: string;
  topics: string[];
  tags: string[];
  place: string;
  format: Post["format"];
  featured: boolean;
  readingTime: number;
  status: "draft" | "published";
  body: ContentBlock[];
  related: string[];
};

function toRow(input: PostInput) {
  return {
    slug: input.slug,
    title: input.title,
    date: input.date,
    excerpt: input.excerpt,
    cover: input.cover as unknown as import("@/integrations/supabase/types").Json,
    topic: input.topic || null,
    topics: input.topics,
    tags: input.tags,
    place: input.place || null,
    format: input.format,
    featured: input.featured,
    reading_time: input.readingTime,
    status: input.status,
    body: input.body as unknown as import("@/integrations/supabase/types").Json,
    related: input.related,
    published_at:
      input.status === "published" ? new Date().toISOString() : null,
  };
}

export async function upsertPost(input: PostInput, originalSlug?: string) {
  const row = toRow(input);
  if (originalSlug && originalSlug !== input.slug) {
    const { error } = await supabase
      .from("posts")
      .update(row)
      .eq("slug", originalSlug);
    if (error) throw error;
    return;
  }
  const { error } = await supabase.from("posts").upsert(row, { onConflict: "slug" });
  if (error) throw error;
}

export async function deletePost(slug: string) {
  const { error } = await supabase.from("posts").delete().eq("slug", slug);
  if (error) throw error;
}

export async function upsertTopic(t: Topic) {
  const { error } = await supabase
    .from("topics")
    .upsert(
      { slug: t.slug, name: t.name, description: t.description, cover: t.cover },
      { onConflict: "slug" },
    );
  if (error) throw error;
}
export async function deleteTopic(slug: string) {
  const { error } = await supabase.from("topics").delete().eq("slug", slug);
  if (error) throw error;
}

export async function fetchTags(): Promise<{ slug: string; name: string }[]> {
  const { data, error } = await supabase.from("tags").select("slug,name").order("name");
  if (error) throw error;
  return data ?? [];
}
export async function upsertTag(t: { slug: string; name: string }) {
  const { error } = await supabase.from("tags").upsert(t, { onConflict: "slug" });
  if (error) throw error;
}
export async function deleteTag(slug: string) {
  const { error } = await supabase.from("tags").delete().eq("slug", slug);
  if (error) throw error;
}

export async function fetchPlaces(): Promise<{ slug: string; name: string }[]> {
  const { data, error } = await supabase.from("places").select("slug,name").order("name");
  if (error) throw error;
  return data ?? [];
}
export async function upsertPlace(p: { slug: string; name: string }) {
  const { error } = await supabase.from("places").upsert(p, { onConflict: "slug" });
  if (error) throw error;
}
export async function deletePlace(slug: string) {
  const { error } = await supabase.from("places").delete().eq("slug", slug);
  if (error) throw error;
}

// ---------- Media upload ----------

export async function uploadImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return data.publicUrl;
}

// ---------- Video URL parsing ----------

export function parseVideoUrl(
  url: string,
): { source: MediaVideo["source"]; videoId: string } | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname.startsWith("/shorts/")) {
        return { source: "youtube-shorts", videoId: u.pathname.split("/")[2] };
      }
      const v = u.searchParams.get("v");
      if (v) return { source: "youtube", videoId: v };
    }
    if (u.hostname === "youtu.be") {
      return { source: "youtube", videoId: u.pathname.slice(1) };
    }
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      if (id) return { source: "vimeo", videoId: id };
    }
  } catch {
    /* ignore */
  }
  return null;
}
