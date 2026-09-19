import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteNav } from "@/components/site/Nav";
import { SiteFooter } from "@/components/site/Footer";
import { PortraitVideoGrid, LandscapeVideo } from "@/components/media/VideoGrid";
import { allMediaFrom, fetchPublishedPosts } from "@/lib/cms/queries";
import type { MediaImage, MediaVideo, Post } from "@/lib/cms/types";

export const Route = createFileRoute("/visuals")({
  loader: async (): Promise<{ posts: Post[] }> => {
    const posts = await fetchPublishedPosts();
    return { posts };
  },
  head: () => ({
    meta: [
      { title: "Visual archive — Field of Possibility" },
      { name: "description", content: "Photographs and videos from the archive, browsable separately from the journal." },
      { property: "og:title", content: "Visual archive — Field of Possibility" },
      { property: "og:description", content: "A dedicated browse of photographs and moving image." },
    ],
  }),
  component: VisualsPage,
});

type Mode = "all" | "photo" | "video" | "vertical";

function VisualsPage() {
  const { posts } = Route.useLoaderData() as { posts: Post[] };
  const items = useMemo(() => allMediaFrom(posts), [posts]);
  const [mode, setMode] = useState<Mode>("all");

  const photos = items.filter((i): i is MediaImage & { postSlug: string } => i.type === "image");
  const videos = items.filter((i): i is MediaVideo & { postSlug: string } => i.type === "video");
  const portraitVideos = videos.filter((v) => v.orientation === "portrait");
  const landscapeVideos = videos.filter((v) => v.orientation === "landscape");

  return (
    <div className="min-h-screen bg-paper">
      <SiteNav />

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <header className="max-w-3xl mb-12">
          <div className="text-[12px] font-mono text-accent mb-4 tracking-widest">[ VISUAL · ARCHIVE ]</div>
          <h1 className="font-display text-5xl md:text-6xl leading-[0.95] mb-6">
            The <i>visual</i> archive.
          </h1>
          <p className="text-lg text-ink-soft leading-relaxed">
            Photographs and moving image, decoupled from their parent essays
            and presented as a contact-sheet browse.
          </p>
        </header>

        <div className="flex flex-wrap gap-3 mb-12 border-b border-rule pb-4">
          {(["all", "photo", "vertical", "video"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={
                "px-4 py-1.5 text-[11px] font-mono uppercase tracking-widest border transition-colors " +
                (mode === m
                  ? "bg-ink text-paper border-ink"
                  : "border-rule text-ink-soft hover:border-ink")
              }
            >
              {m === "all" ? "All media" : m === "photo" ? "Photographs" : m === "vertical" ? "Vertical motion" : "Landscape motion"}
            </button>
          ))}
          <span className="ml-auto text-[10px] font-mono uppercase tracking-widest text-ink-mute self-center">
            {items.length} items
          </span>
        </div>

        {(mode === "all" || mode === "photo") && photos.length > 0 && (
          <section className="mb-20">
            <SectionHeading title="Photographs" count={photos.length} />
            <PhotoGrid items={photos} />
          </section>
        )}

        {(mode === "all" || mode === "vertical") && portraitVideos.length > 0 && (
          <section className="mb-20">
            <SectionHeading title="Vertical motion · 9:16" count={portraitVideos.length} />
            <PortraitVideoGrid videos={portraitVideos} />
          </section>
        )}

        {(mode === "all" || mode === "video") && landscapeVideos.length > 0 && (
          <section className="mb-20">
            <SectionHeading title="Landscape motion · 16:9" count={landscapeVideos.length} />
            <div className="grid md:grid-cols-2 gap-6">
              {landscapeVideos.map((v) => (
                <LandscapeVideo key={v.id} video={v} />
              ))}
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}

function SectionHeading({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex justify-between items-baseline border-b border-rule pb-4 mb-8">
      <h2 className="font-display text-2xl md:text-3xl">{title}</h2>
      <span className="text-[10px] font-mono uppercase tracking-widest text-ink-mute">{count} items</span>
    </div>
  );
}

function PhotoGrid({ items }: { items: (MediaImage & { postSlug: string })[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
      {items.map((i) => (
        <Link
          key={i.id}
          to="/journal/$slug"
          params={{ slug: i.postSlug }}
          className="group block"
        >
          <figure className="bg-secondary ring-1 ring-rule overflow-hidden aspect-square">
            <img
              src={i.src}
              alt={i.alt}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
          </figure>
          <figcaption className="mt-2 text-[10px] font-mono uppercase tracking-widest text-ink-mute truncate">
            {i.alt}
          </figcaption>
        </Link>
      ))}
    </div>
  );
}
