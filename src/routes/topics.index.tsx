import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/Nav";
import { SiteFooter } from "@/components/site/Footer";
import { fetchTopics, fetchPublishedPosts } from "@/lib/cms/queries";
import type { Post, Topic } from "@/lib/cms/types";

export const Route = createFileRoute("/topics/")({
  loader: async (): Promise<{ topics: Topic[]; posts: Post[] }> => {
    const [topics, posts] = await Promise.all([fetchTopics(), fetchPublishedPosts()]);
    return { topics, posts };
  },
  head: () => ({
    meta: [
      { title: "Topics — Eureka's Archive" },
      { name: "description", content: "Thematic threads running through the archive." },
      { property: "og:title", content: "Topics — Eureka's Archive" },
      { property: "og:description", content: "Thematic threads running through the archive." },
    ],
  }),
  component: TopicsIndex,
});

function TopicsIndex() {
  const { topics, posts } = Route.useLoaderData() as { topics: Topic[]; posts: Post[] };
  return (
    <div className="min-h-screen bg-paper">
      <SiteNav />
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <header className="max-w-3xl mb-16">
          <div className="text-[12px] font-mono text-accent mb-4 tracking-widest">[ TOPICS · INDEX ]</div>
          <h1 className="font-display text-5xl md:text-6xl leading-[0.95] mb-6">
            Thematic <i>threads</i>.
          </h1>
          <p className="text-lg text-ink-soft leading-relaxed">
            Each topic gathers entries that return to a shared preoccupation —
            material, atmospheric, infrastructural.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          {topics.map((t) => {
            const count = posts.filter((p) => p.topic === t.slug || p.topics.includes(t.slug)).length;
            return (
              <Link key={t.slug} to="/topics/$slug" params={{ slug: t.slug }} className="group block">
                <div className="aspect-[4/3] bg-secondary overflow-hidden ring-1 ring-rule">
                  <img src={t.cover} alt={t.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]" />
                </div>
                <div className="mt-5 grid grid-cols-[1fr_auto] gap-4 items-baseline">
                  <h2 className="font-display text-3xl group-hover:italic group-hover:text-accent transition-all">{t.name}</h2>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-ink-mute">{count} entries</span>
                </div>
                <p className="mt-2 text-ink-soft leading-relaxed">{t.description}</p>
              </Link>
            );
          })}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
