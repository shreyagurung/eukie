import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteNav } from "@/components/site/Nav";
import { SiteFooter } from "@/components/site/Footer";
import { PostListItem } from "@/components/site/PostCard";
import {
  fetchPublishedPosts,
  fetchTopics,
  allPlacesFrom,
  allTagsFrom,
  allFormatsFrom,
  allYearsFrom,
} from "@/lib/cms/queries";
import type { Post, Topic } from "@/lib/cms/types";

export const Route = createFileRoute("/journal")({
  loader: async (): Promise<{ posts: Post[]; topics: Topic[] }> => {
    const [posts, topics] = await Promise.all([
      fetchPublishedPosts(),
      fetchTopics(),
    ]);
    return { posts, topics };
  },
  head: () => ({
    meta: [
      { title: "Journal — Eureka's Archive" },
      { name: "description", content: "Every entry in the journal. Filter by topic, format, place, tag, or year." },
      { property: "og:title", content: "Journal — Eureka's Archive" },
      { property: "og:description", content: "Every entry in the journal." },
    ],
  }),
  component: JournalPage,
});

type Filter = { topic?: string; format?: string; place?: string; tag?: string; year?: number };

function JournalPage() {
  const { posts, topics } = Route.useLoaderData() as { posts: Post[]; topics: Topic[] };
  const [filter, setFilter] = useState<Filter>({});
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return posts
      .filter((p) => {
        if (filter.topic && p.topic !== filter.topic && !p.topics.includes(filter.topic)) return false;
        if (filter.format && p.format !== filter.format) return false;
        if (filter.place && p.place !== filter.place) return false;
        if (filter.tag && !p.tags.includes(filter.tag)) return false;
        if (filter.year && new Date(p.date).getFullYear() !== filter.year) return false;
        if (query) {
          const q = query.toLowerCase();
          if (
            !p.title.toLowerCase().includes(q) &&
            !p.excerpt.toLowerCase().includes(q) &&
            !p.place.toLowerCase().includes(q) &&
            !p.tags.some((t) => t.toLowerCase().includes(q))
          )
            return false;
        }
        return true;
      })
      .sort((a, b) => +new Date(b.date) - +new Date(a.date));
  }, [filter, query, posts]);

  const formats = useMemo(() => allFormatsFrom(posts), [posts]);
  const places = useMemo(() => allPlacesFrom(posts), [posts]);
  const tags = useMemo(() => allTagsFrom(posts), [posts]);
  const years = useMemo(() => allYearsFrom(posts), [posts]);

  const activeCount = Object.values(filter).filter(Boolean).length + (query ? 1 : 0);

  return (
    <div className="min-h-screen bg-paper">
      <SiteNav />

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <header className="max-w-3xl mb-12">
          <div className="text-[12px] font-mono text-accent mb-4 tracking-widest">[ JOURNAL · INDEX ]</div>
          <h1 className="font-display text-5xl md:text-6xl leading-[0.95] mb-6">
            The complete <i>index</i>.
          </h1>
          <p className="text-lg text-ink-soft leading-relaxed">
            Every entry, filterable by topic, format, place, tag, and year. {posts.length} records on file.
          </p>
        </header>

        <div className="grid md:grid-cols-[260px_1fr] gap-12">
          <aside className="space-y-8 md:sticky md:top-24 md:self-start">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-ink-mute mb-2">Search</label>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Title, place, tag…"
                className="w-full border border-rule bg-transparent px-3 py-2 text-sm font-mono focus:outline-none focus:border-accent"
              />
            </div>

            <FilterGroup
              label="Topic"
              options={topics.map((t) => ({ value: t.slug, label: t.name }))}
              value={filter.topic}
              onChange={(v) => setFilter((f) => ({ ...f, topic: v }))}
            />
            <FilterGroup
              label="Format"
              options={formats.map((v) => ({ value: v, label: v }))}
              value={filter.format}
              onChange={(v) => setFilter((f) => ({ ...f, format: v }))}
            />
            <FilterGroup
              label="Place"
              options={places.map((v) => ({ value: v, label: v }))}
              value={filter.place}
              onChange={(v) => setFilter((f) => ({ ...f, place: v }))}
            />
            <FilterGroup
              label="Tag"
              options={tags.map((v) => ({ value: v, label: v }))}
              value={filter.tag}
              onChange={(v) => setFilter((f) => ({ ...f, tag: v }))}
            />
            <FilterGroup
              label="Year"
              options={years.map((y) => ({ value: String(y), label: String(y) }))}
              value={filter.year ? String(filter.year) : undefined}
              onChange={(v) => setFilter((f) => ({ ...f, year: v ? Number(v) : undefined }))}
            />

            {activeCount > 0 && (
              <button
                onClick={() => { setFilter({}); setQuery(""); }}
                className="w-full text-[10px] font-mono uppercase tracking-widest border border-ink px-3 py-2 hover:bg-ink hover:text-paper transition-colors"
              >
                Clear all ({activeCount})
              </button>
            )}
          </aside>

          <section>
            <div className="flex justify-between items-baseline mb-4 pb-4 border-b border-rule">
              <h2 className="font-display text-2xl">Entries</h2>
              <span className="text-[10px] font-mono uppercase tracking-widest text-ink-mute">
                {filtered.length} of {posts.length}
              </span>
            </div>
            {filtered.length === 0 ? (
              <p className="py-12 text-center text-ink-mute font-mono text-sm">
                No entries match those filters.
              </p>
            ) : (
              <div>
                {filtered.map((p, i) => (
                  <PostListItem key={p.slug} post={p} index={i} />
                ))}
              </div>
            )}

            {/* By year archive */}
            <div className="mt-16 pt-12 border-t border-rule">
              <h3 className="font-display text-xl mb-6">Year archives</h3>
              <div className="flex flex-wrap gap-3">
                {years.map((y) => (
                  <button
                    key={y}
                    onClick={() => setFilter((f) => ({ ...f, year: f.year === y ? undefined : y }))}
                    className={
                      "px-4 py-1.5 text-[11px] font-mono uppercase tracking-widest border transition-colors " +
                      (filter.year === y
                        ? "bg-ink text-paper border-ink"
                        : "border-rule text-ink-soft hover:border-ink")
                    }
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function FilterGroup({
  label, options, value, onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  value?: string;
  onChange: (v: string | undefined) => void;
}) {
  return (
    <div>
      <div className="text-[10px] font-mono uppercase tracking-widest text-ink-mute mb-3">{label}</div>
      <ul className="space-y-1.5">
        {options.map((o) => {
          const active = value === o.value;
          return (
            <li key={o.value}>
              <button
                onClick={() => onChange(active ? undefined : o.value)}
                className={
                  "text-left text-sm transition-colors " +
                  (active ? "text-accent italic font-medium" : "text-ink-soft hover:text-ink")
                }
              >
                {o.label}
                {active && <span className="ml-2 font-mono text-[10px]">✕</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
