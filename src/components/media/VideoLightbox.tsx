import { useEffect, useCallback } from "react";
import type { MediaVideo } from "@/lib/cms/types";

export function embedUrl(v: MediaVideo): string {
  if (v.source === "vimeo") {
    return `https://player.vimeo.com/video/${v.videoId}?autoplay=1&title=0&byline=0`;
  }
  // youtube + youtube-shorts both use the same embed endpoint
  return `https://www.youtube.com/embed/${v.videoId}?autoplay=1&rel=0&modestbranding=1`;
}

type Props = {
  videos: MediaVideo[];
  index: number | null;
  onClose: () => void;
  onChange: (i: number) => void;
};

export function VideoLightbox({ videos, index, onClose, onChange }: Props) {
  const current = index !== null ? videos[index] : null;

  const next = useCallback(() => {
    if (index === null) return;
    onChange((index + 1) % videos.length);
  }, [index, videos.length, onChange]);

  const prev = useCallback(() => {
    if (index === null) return;
    onChange((index - 1 + videos.length) % videos.length);
  }, [index, videos.length, onChange]);

  useEffect(() => {
    if (current === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [current, next, prev, onClose]);

  if (!current) return null;

  const portrait = current.orientation === "portrait";

  return (
    <div
      className="fixed inset-0 z-[100] bg-ink/95 backdrop-blur-md flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label={current.alt}
    >
      <div className="flex items-center justify-between px-6 py-4 text-paper">
        <div className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-widest opacity-70 min-w-0">
          <span>{String(index! + 1).padStart(2, "0")} / {String(videos.length).padStart(2, "0")}</span>
          <span className="opacity-40">·</span>
          <span className="truncate">{current.alt}</span>
        </div>
        <button
          onClick={onClose}
          className="text-[11px] font-mono uppercase tracking-widest border border-paper/20 px-3 py-1.5 hover:bg-paper hover:text-ink transition-colors"
        >
          Close ✕
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-4 min-h-0">
        <button
          onClick={prev}
          className="hidden md:block text-paper/60 hover:text-paper text-[11px] font-mono uppercase tracking-widest px-4 py-2"
          aria-label="Previous video"
        >
          ← Prev
        </button>
        <div
          className={
            "relative bg-black ring-1 ring-paper/10 " +
            (portrait
              ? "h-full max-h-[80vh] aspect-[9/16]"
              : "w-full max-w-5xl aspect-video")
          }
        >
          <iframe
            key={current.id}
            src={embedUrl(current)}
            title={current.alt}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>
        <button
          onClick={next}
          className="hidden md:block text-paper/60 hover:text-paper text-[11px] font-mono uppercase tracking-widest px-4 py-2"
          aria-label="Next video"
        >
          Next →
        </button>
      </div>

      <div className="px-6 pb-6 pt-2 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-paper/70">
        <div className="text-xs font-mono">
          {current.caption ?? <span className="opacity-50">{current.source.toUpperCase()} · {current.duration ?? ""}</span>}
        </div>
        <div className="flex md:hidden gap-3 justify-center">
          <button onClick={prev} className="text-[11px] font-mono uppercase tracking-widest border border-paper/20 px-3 py-1.5">← Prev</button>
          <button onClick={next} className="text-[11px] font-mono uppercase tracking-widest border border-paper/20 px-3 py-1.5">Next →</button>
        </div>
      </div>
    </div>
  );
}
