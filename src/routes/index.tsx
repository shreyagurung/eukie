import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/Nav";
import { SiteFooter } from "@/components/site/Footer";
import { PostCardSmall, PostListItem } from "@/components/site/PostCard";
import { PortraitVideoGrid } from "@/components/media/VideoGrid";
import {
  fetchPublishedPosts,
  fetchTopics,
  allPlacesFrom,
  allYearsFrom,
} from "@/lib/cms/queries";

export const Route = createFileRoute("/")({
  loader: async (): Promise<{
    posts: import("@/lib/cms/types").Post[];
    topics: import("@/lib/cms/types").Topic[];
  }> => {
    const [posts, topics] = await Promise.all([
      fetchPublishedPosts(),
      fetchTopics(),
    ]);
    return { posts, topics };
  },
  head: () => ({
    meta: [
      { title: "Eureka's Archive Archive — A visual field-notes journal" },
      { name: "description", content: "Long-form reflections, archival photography, and rhythmic motion studies from transit and transition." },
      { property: "og:title", content: "Eureka's Archive Archive" },
      { property: "og:description", content: "A visual field-notes journal and storytelling archive." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { posts, topics } = Route.useLoaderData() as {
    posts: import("@/lib/cms/types").Post[];
    topics: import("@/lib/cms/types").Topic[];
  };
  const featured = posts.filter((p) => p.featured);
  const heroPost = featured[0] ?? posts[0];
  const otherFeatured = featured.slice(1, 4);
  const latest = posts.slice(0, 8);

  const motionVideos = posts
    .flatMap((p) => p.body.filter((b) => b.type === "video-grid-portrait"))
    .flatMap((b) => (b.type === "video-grid-portrait" ? b.videos : []))
    .slice(0, 5);

  const places = allPlacesFrom(posts);
  const years = allYearsFrom(posts);

  return (
    <div className="min-h-screen bg-paper">
      <SiteNav />

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <header className="max-w-3xl mb-20 md:mb-32 animate-reveal">
          <div className="text-[12px] font-mono text-accent mb-4 tracking-widest">
            [ FIELD NOTES · EST. 2021 ]
          </div>
          <h1 className="font-display text-5xl md:text-7xl leading-[0.95] text-balance mb-8">
            Observations on the <i>quiet permanence</i> of neglected spaces.
          </h1>
          <p className="text-lg md:text-xl text-ink-soft leading-relaxed max-w-xl">
            A living repository of long-form reflections, archival photography,
            and rhythmic media gathered from transit and transition.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/journal" className="px-5 py-2.5 bg-ink text-paper text-[11px] font-mono uppercase tracking-widest hover:bg-accent transition-colors">
              Enter the journal
            </Link>
            <Link to="/visuals" className="px-5 py-2.5 border border-ink text-ink text-[11px] font-mono uppercase tracking-widest hover:bg-ink hover:text-paper transition-colors">
              Browse visuals
            </Link>
          </div>
        </header>

        {heroPost && (
          <section className="mb-32 animate-reveal">
            <div className="grid md:grid-cols-12 gap-8 items-start">
              <Link to="/journal/$slug" params={{ slug: heroPost.slug }} className="md:col-span-8 group block">
                <div className="aspect-[3/2] bg-secondary overflow-hidden ring-1 ring-rule">
                  <img src={heroPost.cover.src} alt={heroPost.cover.alt} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.02]" />
                </div>
                <div className="mt-6 grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4 md:gap-12">
                  <div className="font-display text-3xl md:text-4xl group-hover:italic transition-all truncate">{heroPost.title}</div>
                  <div className="hidden md:block flex-1 border-b border-rule h-px" />
                  <div className="text-[11px] font-mono uppercase tracking-widest text-ink-mute shrink-0">
                    {new Date(heroPost.date).toLocaleDateString("en-GB", { month: "short", year: "numeric" })} · {heroPost.place}
                  </div>
                </div>
              </Link>

              <div className="md:col-span-4 space-y-6 md:pt-4">
                <div className="text-[11px] font-mono text-accent tracking-widest">REF · {heroPost.slug.slice(0, 12).toUpperCase()}</div>
                <p className="text-sm leading-relaxed text-ink/80">{heroPost.excerpt}</p>
                <Link to="/journal/$slug" params={{ slug: heroPost.slug }} className="inline-block px-5 py-2 border border-ink text-[11px] font-mono uppercase tracking-widest hover:bg-ink hover:text-paper transition-colors">
                  Read essay
                </Link>
              </div>
            </div>
          </section>
        )}

        {otherFeatured.length > 0 && (
          <section className="mb-32">
            <SectionHead title="Also featured" sub="Selections from the editor" />
            <div className="grid md:grid-cols-3 gap-8 md:gap-10">
              {otherFeatured.map((p) => <PostCardSmall key={p.slug} post={p} />)}
            </div>
          </section>
        )}

        {topics.length > 0 && (
          <section className="mb-32">
            <SectionHead title="Thematic threads" sub="Topics & ongoing journeys" link={{ to: "/topics", label: "All topics" }} />
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
              {topics.map((t) => (
                <Link key={t.slug} to="/topics/$slug" params={{ slug: t.slug }} className="group block">
                  <div className="aspect-square bg-secondary overflow-hidden ring-1 ring-rule">
                    <img src={t.cover} alt={t.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                  </div>
                  <div className="mt-3">
                    <div className="font-display text-lg group-hover:italic group-hover:text-accent transition-all">{t.name}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {motionVideos.length > 0 && (
          <section className="mb-32">
            <div className="flex justify-between items-baseline border-b border-rule pb-4 mb-8">
              <h2 className="font-display text-2xl md:text-3xl">Contact sheet: motion</h2>
              <Link to="/visuals" className="font-mono text-[10px] uppercase tracking-widest text-ink-mute hover:text-accent">9:16 · view all →</Link>
            </div>
            <PortraitVideoGrid videos={motionVideos} />
          </section>
        )}

        <section className="mb-32">
          <SectionHead title="Latest entries" sub="The reverse chronological log" link={{ to: "/journal", label: "Full archive" }} />
          <div>
            {latest.map((p, i) => <PostListItem key={p.slug} post={p} index={i} />)}
          </div>
        </section>

        <section className="mb-12 border-t border-rule pt-12">
          <div className="grid md:grid-cols-3 gap-12">
            <ArchiveCol title="By place">
              {places.slice(0, 6).map((p) => <li key={p} className="font-display text-xl">{p}</li>)}
            </ArchiveCol>
            <ArchiveCol title="By year">
              {years.map((y) => (
                <li key={y} className="font-mono text-sm flex justify-between border-b border-rule pb-2">
                  <span>{y}</span>
                  <span className="text-ink-mute">{posts.filter((p) => new Date(p.date).getFullYear() === y).length} entries</span>
                </li>
              ))}
            </ArchiveCol>
            <ArchiveCol title="Entry points">
              <li><Link to="/journal" className="font-display text-xl hover:text-accent">All entries</Link></li>
              <li><Link to="/visuals" className="font-display text-xl hover:text-accent italic">Visual archive</Link></li>
              <li><Link to="/topics" className="font-display text-xl hover:text-accent">Topics</Link></li>
              <li><Link to="/about" className="font-display text-xl hover:text-accent">About the studio</Link></li>
            </ArchiveCol>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function SectionHead({ title, sub, link }: { title: string; sub?: string; link?: { to: string; label: string } }) {
  return (
    <div className="flex justify-between items-end border-b border-rule pb-4 mb-8 gap-4">
      <div className="min-w-0">
        <h2 className="font-display text-2xl md:text-3xl">{title}</h2>
        {sub && <div className="text-[10px] font-mono uppercase tracking-widest text-ink-mute mt-1">{sub}</div>}
      </div>
      {link && (
        <Link to={link.to} className="text-[10px] font-mono uppercase tracking-widest text-ink-mute hover:text-accent shrink-0">
          {link.label} →
        </Link>
      )}
    </div>
  );
}

function ArchiveCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-mute mb-6">{title}</h4>
      <ul className="space-y-3">{children}</ul>
    </div>
  );
}
