import type { ContentBlock } from "@/lib/cms/types";
import { PortraitVideoGrid, LandscapeVideo } from "../media/VideoGrid";

export function BlockRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-12 md:space-y-16">
      {blocks.map((b) => (
        <Block key={b.id} block={b} />
      ))}
    </div>
  );
}

function Block({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "text":
      return (
        <div className="mx-auto max-w-[68ch]">
          <p className="text-lg leading-[1.7] text-ink/90 text-pretty whitespace-pre-line">
            {block.body}
          </p>
        </div>
      );

    case "highlight":
      return (
        <div className="mx-auto max-w-[72ch]">
          <p className="font-display text-3xl md:text-4xl leading-[1.2] italic text-ink text-pretty">
            {block.body}
          </p>
        </div>
      );

    case "quote":
      return (
        <figure className="mx-auto max-w-[68ch] border-l-2 border-accent pl-6 md:pl-8 py-2">
          <blockquote className="font-display text-2xl md:text-3xl italic leading-[1.3] text-ink/85">
            “{block.body}”
          </blockquote>
          {block.cite && (
            <figcaption className="mt-4 text-[10px] font-mono uppercase tracking-[0.2em] text-ink-mute">
              — {block.cite}
            </figcaption>
          )}
        </figure>
      );

    case "image": {
      const i = block.image;
      return (
        <figure className="mx-auto max-w-5xl">
          <div className="bg-secondary ring-1 ring-rule overflow-hidden">
            <img
              src={i.src}
              alt={i.alt}
              loading="lazy"
              className="w-full h-auto block"
            />
          </div>
          {i.caption && (
            <figcaption className="mt-3 text-[11px] font-mono uppercase tracking-widest text-ink-mute italic">
              {i.caption}
            </figcaption>
          )}
        </figure>
      );
    }

    case "image-grid":
      return (
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {block.images.map((i) => (
              <figure key={i.id} className="bg-secondary ring-1 ring-rule overflow-hidden">
                <img src={i.src} alt={i.alt} loading="lazy" className="w-full h-auto block" />
              </figure>
            ))}
          </div>
          {block.caption && (
            <p className="mt-3 text-[11px] font-mono uppercase tracking-widest text-ink-mute italic">
              {block.caption}
            </p>
          )}
        </div>
      );

    case "video-landscape":
      return (
        <div className="mx-auto max-w-5xl">
          <LandscapeVideo video={block.video} />
        </div>
      );

    case "video-grid-portrait":
      return (
        <div className="mx-auto max-w-6xl">
          <PortraitVideoGrid videos={block.videos} caption={block.caption} />
        </div>
      );

    case "caption":
      return (
        <p className="mx-auto max-w-[60ch] text-center text-[11px] font-mono uppercase tracking-widest text-ink-mute italic">
          {block.body}
        </p>
      );

    case "divider":
      return (
        <div className="mx-auto max-w-[68ch] flex items-center gap-4 text-ink-mute">
          <div className="flex-1 border-t border-rule" />
          <span className="font-mono text-[10px] uppercase tracking-widest">§</span>
          <div className="flex-1 border-t border-rule" />
        </div>
      );

    case "reflection":
      return (
        <aside className="mx-auto max-w-[68ch] border border-rule bg-secondary/40 px-6 py-5">
          {block.label && (
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-accent mb-2">
              {block.label}
            </div>
          )}
          <p className="font-display italic text-xl leading-[1.4] text-ink/85">
            {block.body}
          </p>
        </aside>
      );

    case "link":
      return (
        <div className="mx-auto max-w-[68ch] border-t border-b border-rule py-4">
          <a
            href={block.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-4 group"
          >
            <div className="min-w-0">
              <div className="text-[10px] font-mono uppercase tracking-widest text-ink-mute">
                {block.source ?? "External"}
              </div>
              <div className="font-display text-xl text-ink group-hover:text-accent transition-colors truncate">
                {block.title}
              </div>
            </div>
            <span className="font-mono text-xs text-ink-mute shrink-0">↗</span>
          </a>
        </div>
      );
  }
}
