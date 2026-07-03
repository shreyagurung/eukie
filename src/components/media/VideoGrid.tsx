import { useState } from "react";
import type { MediaVideo } from "@/lib/cms/types";
import { VideoLightbox } from "./VideoLightbox";

export function PortraitVideoGrid({
  videos,
  caption,
}: {
  videos: MediaVideo[];
  caption?: string;
}) {
  const [active, setActive] = useState<number | null>(null);
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
        {videos.map((v, i) => (
          <button
            key={v.id}
            onClick={() => setActive(i)}
            className="group text-left space-y-2 cursor-pointer"
          >
            <div className="relative aspect-[9/16] bg-secondary overflow-hidden ring-1 ring-rule">
              <img
                src={v.thumbnail}
                alt={v.alt}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/15 transition-colors" />
              <div className="absolute top-2 left-2 text-[9px] font-mono text-paper/90 bg-ink/40 px-1.5 py-0.5">
                {v.duration ?? "▶"}
              </div>
              <div className="absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="size-12 rounded-full bg-paper/90 grid place-items-center text-ink">
                  ▶
                </div>
              </div>
            </div>
            <div className="text-[10px] font-mono text-ink-mute uppercase tracking-widest truncate">
              {v.source === "vimeo" ? "VIM" : "YT"} · {v.id.toUpperCase()}
            </div>
          </button>
        ))}
      </div>
      {caption && (
        <p className="mt-3 text-[11px] font-mono uppercase tracking-widest text-ink-mute italic">
          {caption}
        </p>
      )}
      <VideoLightbox
        videos={videos}
        index={active}
        onClose={() => setActive(null)}
        onChange={setActive}
      />
    </div>
  );
}

export function LandscapeVideo({ video }: { video: MediaVideo }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div>
      <button
        onClick={() => setOpen(0)}
        className="group block w-full text-left"
      >
        <div className="relative aspect-video bg-secondary overflow-hidden ring-1 ring-rule">
          <img
            src={video.thumbnail}
            alt={video.alt}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-ink/10 group-hover:bg-ink/25 transition-colors" />
          <div className="absolute inset-0 grid place-items-center">
            <div className="size-16 rounded-full bg-paper/90 grid place-items-center text-ink text-xl">▶</div>
          </div>
          {video.duration && (
            <div className="absolute bottom-3 right-3 text-[10px] font-mono text-paper bg-ink/60 px-2 py-1">
              {video.duration}
            </div>
          )}
        </div>
      </button>
      {video.caption && (
        <p className="mt-3 text-[11px] font-mono uppercase tracking-widest text-ink-mute italic">
          {video.caption}
        </p>
      )}
      <VideoLightbox
        videos={[video]}
        index={open}
        onClose={() => setOpen(null)}
        onChange={() => {}}
      />
    </div>
  );
}
