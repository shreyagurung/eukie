import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/Nav";
import { SiteFooter } from "@/components/site/Footer";
import { BlockRenderer } from "@/components/blocks/Blocks";
import { PostCardSmall } from "@/components/site/PostCard";
import {
  fetchPostBySlug,
  fetchPostsBySlugs,
  fetchPublishedPosts,
  fetchTopicBySlug,
} from "@/lib/cms/queries";
import type { Post, Topic } from "@/lib/cms/types";

export const Route = createFileRoute("/journal_/$slug")({
  loader: async ({
    params,
  }): Promise<{
    post: Post;
    related: Post[];
    prev?: { slug: string; title: string };
    next?: { slug: string; title: string };
    mainTopic: Topic | null;
  }> => {
    const post = await fetchPostBySlug(params.slug);
    if (!post || post.visibility !== "public") throw notFound();
    const [all, related, mainTopic] = await Promise.all([
      fetchPublishedPosts(),
      fetchPostsBySlugs(post.related ?? []),
      post.topic ? fetchTopicBySlug(post.topic) : Promise.resolve(null),
    ]);
    const sorted = [...all].sort((a, b) => +new Date(a.date) - +new Date(b.date));
    const idx = sorted.findIndex((p) => p.slug === post.slug);
    const prev = idx > 0 ? sorted[idx - 1] : undefined;
    const next = idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1] : undefined;
    return {
      post,
      related,
      prev: prev ? { slug: prev.slug, title: prev.title } : undefined,
      next: next ? { slug: next.slug, title: next.title } : undefined,
      mainTopic,
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Entry — Field of Possibility" }] };
    const p = loaderData.post;
    return {
      meta: [
        { title: `${p.title} — Field of Possibility` },
        { name: "description", content: p.excerpt },
        { property: "og:title", content: p.title },
        { property: "og:description", content: p.excerpt },
        { property: "og:image", content: p.cover.src },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: p.cover.src },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center px-6 text-center">
      <div>
        <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-2">Entry not found</div>
        <h1 className="font-display text-4xl italic mb-6">No record matches that slug.</h1>
        <Link to="/journal" className="text-[11px] font-mono uppercase tracking-widest border border-ink px-4 py-2 hover:bg-ink hover:text-paper">Return to index</Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen grid place-items-center px-6 text-center">
      <div>
        <h1 className="font-display text-3xl italic mb-4">This entry didn't open.</h1>
        <p className="text-sm font-mono text-ink-mute">{error.message}</p>
      </div>
    </div>
  ),
  component: PostPage,
});

function PostPage() {
  const { post, related, prev, next, mainTopic } = Route.useLoaderData() as {
    post: Post;
    related: Post[];
    prev?: { slug: string; title: string };
    next?: { slug: string; title: string };
    mainTopic: Topic | null;
  };

  return (
    <div className="min-h-screen bg-paper">
      <SiteNav />

      <header className="max-w-7xl mx-auto px-6 pt-12 md:pt-16">
        <div className="grid md:grid-cols-12 gap-8 items-end mb-8">
          <div className="md:col-span-7">
            <div className="text-[11px] font-mono uppercase tracking-widest text-accent mb-4">
              [ {post.format} · {post.place} ]
            </div>
            <h1 className="font-display text-4xl md:text-6xl leading-[0.95] text-balance">{post.title}</h1>
          </div>
          <div className="md:col-span-5 space-y-2 md:text-right">
            <div className="text-[11px] font-mono uppercase tracking-widest text-ink-mute">
              {new Date(post.date).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}
            </div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-ink-mute">
              {post.readingTime} min read · REF {post.slug.slice(0, 8).toUpperCase()}
            </div>
            {mainTopic && (
              <Link to="/topics/$slug" params={{ slug: mainTopic.slug }} className="inline-block text-[11px] font-mono uppercase tracking-widest text-accent hover:underline">
                Filed under {mainTopic.name}
              </Link>
            )}
          </div>
        </div>
        <div className="aspect-[16/9] bg-secondary overflow-hidden ring-1 ring-rule">
          <img src={post.cover.src} alt={post.cover.alt} className="w-full h-full object-cover" />
        </div>
        {post.cover.caption && (
          <p className="mt-3 text-[11px] font-mono uppercase tracking-widest text-ink-mute italic">{post.cover.caption}</p>
        )}
        <div className="mt-8 max-w-3xl">
          <p className="font-display text-2xl md:text-3xl italic leading-[1.3] text-ink/85">{post.excerpt}</p>
        </div>
      </header>

      <article className="px-6 py-16 md:py-24">
        <BlockRenderer blocks={post.body} />
      </article>

      <section className="max-w-3xl mx-auto px-6 mb-16">
        <div className="border-t border-b border-rule py-6 flex flex-wrap gap-4 items-center">
          <span className="text-[10px] font-mono uppercase tracking-widest text-ink-mute">Tagged</span>
          {post.tags.map((t) => (
            <span key={t} className="text-[11px] font-mono text-ink-soft">#{t}</span>
          ))}
        </div>
      </section>

      <nav className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8 mb-24 border-t border-rule pt-8">
        {prev ? (
          <Link to="/journal/$slug" params={{ slug: prev.slug }} className="group block">
            <div className="text-[10px] font-mono uppercase tracking-widest text-ink-mute mb-2">← Previous entry</div>
            <div className="font-display text-2xl group-hover:italic group-hover:text-accent transition-all">{prev.title}</div>
          </Link>
        ) : <div />}
        {next ? (
          <Link to="/journal/$slug" params={{ slug: next.slug }} className="group block md:text-right">
            <div className="text-[10px] font-mono uppercase tracking-widest text-ink-mute mb-2">Next entry →</div>
            <div className="font-display text-2xl group-hover:italic group-hover:text-accent transition-all">{next.title}</div>
          </Link>
        ) : <div />}
      </nav>

      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 mb-24">
          <div className="flex justify-between items-baseline border-b border-rule pb-4 mb-8">
            <h2 className="font-display text-2xl">Related entries</h2>
            <Link to="/journal" className="text-[10px] font-mono uppercase tracking-widest text-ink-mute hover:text-accent">All entries →</Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {related.map((p) => <PostCardSmall key={p.slug} post={p} />)}
          </div>
        </section>
      )}

      <SiteFooter />
    </div>
  );
}
