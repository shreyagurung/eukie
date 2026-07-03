import { Link } from "@tanstack/react-router";
import { useState } from "react";

const links = [
  { to: "/", label: "Index" },
  { to: "/journal", label: "Journal" },
  { to: "/visuals", label: "Visuals" },
  { to: "/topics", label: "Topics" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-40 bg-paper/80 backdrop-blur-md border-b border-rule">
      <div className="max-w-7xl mx-auto px-6 py-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="flex min-w-0 items-center gap-8">
          <Link
            to="/"
            className="font-display text-2xl font-semibold tracking-tight italic truncate"
          >
            Eureka's Archive
          </Link>
          <div className="hidden md:flex gap-6 text-[11px] font-mono uppercase tracking-widest text-ink-soft">
            {links.slice(1).map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="hover:text-accent transition-colors"
                activeProps={{ className: "text-accent" }}
                activeOptions={{ exact: false }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <span className="hidden md:inline text-[11px] font-mono text-ink-mute">
            VOL. 04 / 2026
          </span>
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden text-[11px] font-mono uppercase tracking-widest border border-rule px-3 py-1.5"
            aria-label="Toggle menu"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-rule px-6 py-4 flex flex-col gap-3 bg-paper">
          {links.slice(1).map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="text-[12px] font-mono uppercase tracking-widest text-ink-soft"
              activeProps={{ className: "text-accent" }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
