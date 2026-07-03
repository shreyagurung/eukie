import { Link } from "@tanstack/react-router";
import type { Post } from "@/lib/cms/types";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
  });
}

export function PostListItem({ post, index }: { post: Post; index?: number }) {
  return (
    <Link
      to="/journal/$slug"
      params={{ slug: post.slug }}
      className="block py-5 group border-b border-rule"
    >
      <div className="grid grid-cols-[auto_1fr] md:grid-cols-[80px_1fr_auto_auto] items-baseline gap-4 md:gap-8">
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-mute shrink-0">
          {index !== undefined ? `№ ${String(index + 1).padStart(3, "0")}` : ""}
        </span>
        <h3 className="font-display text-2xl md:text-3xl text-ink group-hover:italic group-hover:text-accent transition-all min-w-0">
          {post.title}
        </h3>
        <span className="hidden md:inline text-[11px] font-mono uppercase tracking-widest text-ink-mute">
          {post.place}
        </span>
        <span className="text-[11px] font-mono uppercase tracking-widest text-ink-mute shrink-0">
          {fmtDate(post.date)}
        </span>
      </div>
    </Link>
  );
}

export function PostCardLarge({ post }: { post: Post }) {
  return (
    <Link
      to="/journal/$slug"
      params={{ slug: post.slug }}
      className="group block"
    >
      <div className="aspect-[3/2] bg-secondary overflow-hidden ring-1 ring-rule">
        <img
          src={post.cover.src}
          alt={post.cover.alt}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
        />
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto] md:items-baseline">
        <div className="min-w-0">
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-accent mb-2">
            {post.format} · {post.place}
          </div>
          <h3 className="font-display text-2xl md:text-3xl group-hover:italic transition-all">
            {post.title}
          </h3>
        </div>
        <div className="text-[11px] font-mono uppercase tracking-widest text-ink-mute">
          {fmtDate(post.date)} · {post.readingTime} min
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft max-w-prose">
        {post.excerpt}
      </p>
    </Link>
  );
}

export function PostCardSmall({ post }: { post: Post }) {
  return (
    <Link
      to="/journal/$slug"
      params={{ slug: post.slug }}
      className="group block"
    >
      <div className="aspect-[4/5] bg-secondary overflow-hidden ring-1 ring-rule">
        <img
          src={post.cover.src}
          alt={post.cover.alt}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
        />
      </div>
      <div className="mt-3">
        <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-ink-mute">
          {post.place} · {fmtDate(post.date)}
        </div>
        <h4 className="mt-1 font-display text-xl group-hover:italic group-hover:text-accent transition-all">
          {post.title}
        </h4>
      </div>
    </Link>
  );
}
