import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-rule px-6 py-16 mt-24">
      <div className="max-w-7xl mx-auto grid gap-12 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <div className="space-y-3">
          <div className="font-display text-2xl italic">Eureka's Archive</div>
          <p className="text-xs font-mono text-ink-mute max-w-[260px] leading-relaxed">
            A catalog of moments — long-form reflections, archival photography,
            and rhythmic media. Established 2021.
          </p>
        </div>
        <FooterCol title="Browse">
          <Link to="/journal" className="hover:text-accent">All entries</Link>
          <Link to="/visuals" className="hover:text-accent">Visual archive</Link>
          <Link to="/topics" className="hover:text-accent">Topics</Link>
        </FooterCol>
        <FooterCol title="Studio">
          <Link to="/about" className="hover:text-accent">About</Link>
          <Link to="/contact" className="hover:text-accent">Contact</Link>
        </FooterCol>
        <FooterCol title="Connect">
          <a href="#" className="hover:text-accent">Newsletter</a>
          <a href="#" className="hover:text-accent">Instagram</a>
          <a href="#" className="hover:text-accent">RSS</a>
        </FooterCol>
      </div>
      <div className="max-w-7xl mx-auto mt-16 pt-6 border-t border-rule flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-ink-mute">
        <span>© 2026 Eureka Studio</span>
        <span>Curated observations</span>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <span className="text-[10px] font-mono uppercase tracking-widest text-ink-mute">
        {title}
      </span>
      <div className="flex flex-col gap-2 text-sm">{children}</div>
    </div>
  );
}
