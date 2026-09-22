import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/Nav";
import { SiteFooter } from "@/components/site/Footer";
import { PostCardSmall, PostListItem } from "@/components/site/PostCard";
import { fetchPublishedPosts, fetchTopics, allPlacesFrom, allYearsFrom } from "@/lib/cms/queries";

export const Route = createFileRoute("/")({
  loader: async (): Promise<{
    posts: import("@/lib/cms/types").Post[];
    topics: import("@/lib/cms/types").Topic[];
  }> => {
    const [posts, topics] = await Promise.all([fetchPublishedPosts(), fetchTopics()]);

    return { posts, topics };
  },

  head: () => ({
    meta: [
      {
        title: "Eureka Khong — Regenerative Ecological Design & Field Notes",
      },
      {
        name: "description",
        content:
          "Eureka Khong explores regenerative ecological design, social and ecological systems, architecture, community, art and the everyday work of making life more meaningful.",
      },
      {
        property: "og:title",
        content: "Eureka Khong — Regenerative Ecological Design & Field Notes",
      },
      {
        property: "og:description",
        content:
          "Projects, reflections and observations exploring ecology, design, place, community and lived experience.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
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

  const places = allPlacesFrom(posts);
  const years = allYearsFrom(posts);

  return (
    <div className="min-h-screen bg-home-ash font-home-body text-home-ink">
      <SiteNav />

      <main>
        {/* HERO */}
        <header className="mx-auto grid min-h-[70vh] max-w-7xl grid-cols-1 content-between gap-14 px-6 pb-12 pt-14 md:grid-cols-12 md:gap-8 md:pb-18 md:pt-20">
          <div className="animate-reveal md:col-span-8">
            <p className="mb-10 font-home-display text-[10px] uppercase tracking-normal">
              Eureka Khong · Design · Ecology · Inquiry
            </p>

            <h1 className="font-home-display text-2xl font-bold uppercase leading-none md:text-3xl">
              Eureka Khong
            </h1>

            <p className="mt-10 max-w-4xl font-home-display text-4xl leading-[1.15] md:text-6xl lg:text-7xl">
              Exploring more
              <br />
              <span className="italic font-normal">regenerative</span> ways
              <br />
              of living.
            </p>
          </div>

          <div className="flex flex-col justify-end border-t border-home-ink pt-5 md:col-span-3 md:col-start-10 md:border-t-0 md:pt-0">
            <p className="max-w-sm text-base font-light leading-relaxed">
              A collection of projects, reflections and observations at the intersection of ecology,
              design, architecture, community and lived experience.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/journal"
                className="bg-home-orange px-5 py-3 font-home-display text-[10px] uppercase transition-transform hover:-translate-y-0.5"
              >
                Enter journal
              </Link>

              <Link
                to="/about"
                className="border border-home-ink px-5 py-3 font-home-display text-[10px] uppercase transition-colors hover:bg-home-ink hover:text-home-ash"
              >
                About Eureka
              </Link>
            </div>
          </div>
        </header>

        {/* FEATURED FIELD NOTE */}
        {heroPost && (
          <section className="bg-home-blue px-6 py-12 md:py-20">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-12 md:items-stretch">
              <Link
                to="/journal/$slug"
                params={{ slug: heroPost.slug }}
                className="group relative block md:col-span-8"
              >
                <div className="aspect-[4/3] overflow-hidden bg-home-ash-soft md:aspect-[16/11]">
                  <img
                    src={heroPost.cover.src}
                    alt={heroPost.cover.alt}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                </div>

                <span className="absolute left-0 top-0 bg-home-orange px-4 py-3 font-home-display text-[10px] uppercase">
                  Featured reflection
                </span>
              </Link>

              <div className="md:col-span-4 md:flex md:items-end">
                <div className="flex h-full flex-col bg-home-ash p-6 md:p-8">
                  <p className="mb-5 font-home-display text-[10px] uppercase">
                    Ref. {heroPost.slug.slice(0, 12)} · {heroPost.place}
                  </p>

                  <h2 className="font-home-display text-2xl leading-tight md:text-3xl">
                    {heroPost.title}
                  </h2>

                  <p className="mt-5 flex-1 text-sm font-light leading-relaxed">
                    {heroPost.excerpt}
                  </p>

                  <div className="mt-6 flex items-end justify-between gap-4 border-t border-home-ink pt-4">
                    <span className="font-home-display text-[10px] uppercase">
                      {new Date(heroPost.date).toLocaleDateString("en-GB", {
                        month: "short",
                        year: "numeric",
                      })}
                    </span>

                    <Link
                      to="/journal/$slug"
                      params={{ slug: heroPost.slug }}
                      className="font-home-display text-xs uppercase underline decoration-home-orange decoration-2 underline-offset-4"
                    >
                      Read reflection ↗
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ALSO FEATURED */}
        {otherFeatured.length > 0 && (
          <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
            <SectionHead title="Selected work" sub="Projects, ideas and ongoing inquiries" />

            <div className="grid gap-12 md:grid-cols-3 md:gap-8">
              {otherFeatured.map((p, index) => (
                <div key={p.slug} className={index === 1 ? "md:mt-16" : ""}>
                  <PostCardSmall post={p} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* THEMATIC THREADS */}
        {topics.length > 0 && (
          <section className="bg-home-ink px-6 py-20 text-home-ash md:py-28">
            <div className="mx-auto max-w-7xl">
              <SectionHead
                title="Fields of inquiry"
                sub="Different threads of the same exploration"
                link={{
                  to: "/topics",
                  label: "Explore all",
                }}
                inverse
              />

              <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-6">
                {topics.map((t, index) => (
                  <Link
                    key={t.slug}
                    to="/topics/$slug"
                    params={{ slug: t.slug }}
                    className="group block"
                  >
                    <div className="aspect-[4/5] overflow-hidden">
                      <img
                        src={t.cover}
                        alt={t.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    </div>

                    <div className="mt-3 flex items-start justify-between gap-3 border-t border-home-ash/40 pt-3">
                      <span className="font-home-display text-sm md:text-base">{t.name}</span>

                      <span className="font-home-display text-[9px] text-home-blue">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </Link>
                ))}

                <Link to="/topics" className="group hidden md:block">
                  <div className="flex aspect-[4/5] items-end bg-home-orange p-4">
                    <span className="font-home-display text-[10px] uppercase text-home-ink">
                      Follow an inquiry →
                    </span>
                  </div>

                  <div className="mt-3 flex items-start justify-between gap-3 border-t border-home-ash/40 pt-3">
                    <span className="font-home-display text-sm text-home-ash md:text-base">
                      All fields
                    </span>

                    <span className="font-home-display text-[9px] text-home-blue">→</span>
                  </div>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* FEATURED VIDEOS */}
        <FeaturedVideos />

        {/* LATEST ENTRIES */}
        <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <SectionHead
            title="Recent thoughts"
            sub="Notes from an ongoing inquiry"
            link={{
              to: "/journal",
              label: "Enter journal",
            }}
          />

          <div className="grid gap-10 md:grid-cols-12">
            {latest[0] && (
              <Link
                to="/journal/$slug"
                params={{ slug: latest[0].slug }}
                className="group md:col-span-5"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-home-blue">
                  <img
                    src={latest[0].cover.src}
                    alt={latest[0].cover.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />

                  <span className="absolute bottom-0 left-0 bg-home-orange px-4 py-3 font-home-display text-[10px] uppercase">
                    Latest note
                  </span>
                </div>

                <h3 className="mt-5 font-home-display text-2xl leading-tight">{latest[0].title}</h3>
              </Link>
            )}

            <div className="md:col-span-7 md:border-l md:border-home-ink md:pl-8">
              {latest.slice(1).map((p, i) => (
                <PostListItem key={p.slug} post={p} index={i + 1} />
              ))}
            </div>
          </div>
        </section>

        {/* ARCHIVE */}
        <section className="bg-home-blue px-6 py-16">
          <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-3">
            <ArchiveCol title="By place">
              {places.slice(0, 6).map((p) => (
                <li key={p} className="font-home-display text-lg">
                  {p}
                </li>
              ))}
            </ArchiveCol>

            <ArchiveCol title="By year">
              {years.map((y) => (
                <li
                  key={y}
                  className="flex justify-between border-b border-home-ink/30 pb-2 font-home-display text-xs"
                >
                  <span>{y}</span>

                  <span>
                    {posts.filter((p) => new Date(p.date).getFullYear() === y).length} entries
                  </span>
                </li>
              ))}
            </ArchiveCol>

            <ArchiveCol title="Entry points">
              <li>
                <Link
                  to="/journal"
                  className="font-home-display text-lg underline decoration-home-orange decoration-2 underline-offset-4"
                >
                  Journal
                </Link>
              </li>

              <li>
                <Link to="/visuals" className="font-home-display text-lg">
                  Visual archive
                </Link>
              </li>

              <li>
                <Link to="/topics" className="font-home-display text-lg">
                  Fields of inquiry
                </Link>
              </li>

              <li>
                <Link to="/about" className="font-home-display text-lg">
                  About Eureka
                </Link>
              </li>
            </ArchiveCol>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* FEATURED VIDEOS                                                            */
/* -------------------------------------------------------------------------- */

function FeaturedVideos() {
  const videos = [
    {
      id: "jx9j-trdK0U",
      number: "01",
    },
    {
      id: "cv-GBxD157s",
      number: "02",
    },
  ];

  return (
    <section className="bg-home-ash-soft px-6 py-16 md:py-20">
      <div className="mx-auto max-w-7xl">
        {/* SECTION HEADER */}
        <div className="mb-8 flex items-end justify-between gap-6 border-b border-home-ink pb-4">
          <div>
            <h2 className="font-home-display text-xl md:text-2xl">On video</h2>

            <p className="mt-2 font-home-display text-[9px] uppercase">
              A couple of things worth watching
            </p>
          </div>

          <Link
            to="/visuals"
            className="shrink-0 font-home-display text-[10px] uppercase underline decoration-home-orange decoration-2 underline-offset-4"
          >
            Visual archive →
          </Link>
        </div>

        {/* VIDEO GRID */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-8">
          {videos.map((video) => (
            <article key={video.id} className="group">
              {/* VIDEO */}
              <div className="relative aspect-video overflow-hidden bg-home-ink">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${video.id}?rel=0&playsinline=1`}
                  title={`Eureka Khong video ${video.number}`}
                  className="absolute inset-0 h-full w-full"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              {/* VIDEO META */}
              <div className="mt-3 flex items-center justify-between gap-4 border-t border-home-ink pt-3">
                <div className="flex items-center gap-3">
                  <span className="font-home-display text-[10px] text-home-orange">
                    {video.number}
                  </span>

                  <span className="font-home-display text-[10px] uppercase">Video</span>
                </div>

                <a
                  href={`https://youtu.be/${video.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-home-display text-[10px] uppercase underline decoration-home-orange decoration-2 underline-offset-4"
                >
                  YouTube ↗
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* SECTION HEADER                                                             */
/* -------------------------------------------------------------------------- */

function SectionHead({
  title,
  sub,
  link,
  inverse = false,
}: {
  title: string;
  sub?: string;
  link?: {
    to: string;
    label: string;
  };
  inverse?: boolean;
}) {
  return (
    <div
      className={`mb-10 flex items-end justify-between gap-4 border-b pb-4 ${
        inverse ? "border-home-ash/40" : "border-home-ink"
      }`}
    >
      <div className="min-w-0">
        <h2 className="font-home-display text-xl md:text-2xl">{title}</h2>

        {sub && (
          <div
            className={`mt-2 font-home-display text-[9px] uppercase ${
              inverse ? "text-home-blue" : ""
            }`}
          >
            {sub}
          </div>
        )}
      </div>

      {link && (
        <Link
          to={link.to}
          className="shrink-0 font-home-display text-[10px] uppercase underline decoration-home-orange decoration-2 underline-offset-4"
        >
          {link.label} →
        </Link>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* ARCHIVE COLUMN                                                             */
/* -------------------------------------------------------------------------- */

function ArchiveCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-6 border-b border-home-ink pb-3 font-home-display text-[10px] uppercase">
        {title}
      </h4>

      <ul className="space-y-3">{children}</ul>
    </div>
  );
}
