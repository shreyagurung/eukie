import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/Nav";
import { SiteFooter } from "@/components/site/Footer";
import { PostCardSmall } from "@/components/site/PostCard";
import {
  fetchPostsByTopic,
  fetchTopicBySlug,
  fetchTopics,
} from "@/lib/cms/queries";
import type { Post, Topic } from "@/lib/cms/types";

export const Route = createFileRoute("/topics/$slug")({
  loader: async ({
    params,
  }): Promise<{ topic: Topic; items: Post[]; others: Topic[] }> => {
    const topic = await fetchTopicBySlug(params.slug);
    if (!topic) throw notFound();
    const [items, all] = await Promise.all([
      fetchPostsByTopic(params.slug),
      fetchTopics(),
    ]);
    return { topic, items, others: all.filter((t) => t.slug !== topic.slug) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Topic — Eureka's Archive" }] };
    const t = loaderData.topic;
    return {
      meta: [
        { title: `${t.name} — Topics — Eureka's Archive` },
        { name: "description", content: t.description },
        { property: "og:title", content: `${t.name} — Eureka's Archive` },
        { property: "og:description", content: t.description },
        { property: "og:image", content: t.cover },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center text-center px-6">
      <div>
        <h1 className="font-display text-4xl italic mb-4">No such topic.</h1>
        <Link to="/topics" className="text-[11px] font-mono uppercase tracking-widest border border-ink px-4 py-2 hover:bg-ink hover:text-paper">All topics</Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen grid place-items-center text-center px-6">
      <p className="font-mono text-sm">{error.message}</p>
    </div>
  ),
  component: TopicPage,
});

function TopicPage() {
  const { topic, items, others } = Route.useLoaderData() as {
    topic: Topic;
    items: Post[];
    others: Topic[];
  };

  return (
    <div className="min-h-screen bg-paper">
      <SiteNav />

      <header className="max-w-7xl mx-auto px-6 pt-12 md:pt-16">
        <div className="grid md:grid-cols-12 gap-8 items-end mb-8">
          <div className="md:col-span-7">
            <div className="text-[12px] font-mono uppercase tracking-widest text-accent mb-4">[ TOPIC ]</div>
            <h1 className="font-display text-5xl md:text-7xl leading-[0.95]">
              <i>{topic.name}</i>
            </h1>
          </div>
          <div className="md:col-span-5 md:text-right">
            <span className="text-[11px] font-mono uppercase tracking-widest text-ink-mute">
              {items.length} entries on file
            </span>
          </div>
        </div>
        <div className="aspect-[16/7] bg-secondary overflow-hidden ring-1 ring-rule">
          <img src={topic.cover} alt={topic.name} className="w-full h-full object-cover" />
        </div>
        <div className="max-w-3xl mt-10 mb-16">
          <p className="font-display text-2xl md:text-3xl italic leading-[1.3] text-ink/85">
            {topic.description}
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mb-24">
        <div className="border-b border-rule pb-4 mb-8">
          <h2 className="font-display text-2xl">Entries in this thread</h2>
        </div>
        {items.length === 0 ? (
          <p className="text-ink-mute font-mono text-sm py-12">No entries yet under this topic.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {items.map((p) => <PostCardSmall key={p.slug} post={p} />)}
          </div>
        )}

        <section className="mt-24 pt-12 border-t border-rule">
          <h3 className="font-display text-xl mb-6">Adjacent threads</h3>
          <div className="flex flex-wrap gap-3">
            {others.map((t) => (
              <Link key={t.slug} to="/topics/$slug" params={{ slug: t.slug }} className="px-4 py-1.5 text-[11px] font-mono uppercase tracking-widest border border-rule hover:border-ink hover:text-accent transition-colors">
                {t.name}
              </Link>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
