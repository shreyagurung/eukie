import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/Nav";
import { SiteFooter } from "@/components/site/Footer";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Eureka's Archive" },
      { name: "description", content: "Notes on the studio, the practice, and the rules of the archive." },
      { property: "og:title", content: "About — Eureka's Archive" },
      { property: "og:description", content: "Notes on the studio and the rules of the archive." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-paper">
      <SiteNav />
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <header className="max-w-3xl mb-16">
          <div className="text-[12px] font-mono text-accent mb-4 tracking-widest">[ COLOPHON ]</div>
          <h1 className="font-display text-5xl md:text-6xl leading-[0.95]">
            On the <i>practice</i>.
          </h1>
        </header>

        <div className="grid md:grid-cols-[1fr_2fr] gap-12 md:gap-20">
          <aside className="space-y-8">
            <Meta label="Studio" value="Eureka, est. 2021" />
            <Meta label="Editor" value="M. Halversen" />
            <Meta label="Based" value="India" />
            <Meta label="Working in" value="Photography, essay, vertical video" />
            <Meta label="Equipment" value="Leica Q3, Sony FX3, Field Notes" />
            <Meta label="Set in" value="Permaculture" />
          </aside>

          <article className="space-y-8 max-w-[68ch]">
            <p className="font-display text-2xl md:text-3xl italic leading-[1.3] text-ink/85">
              This website is a slow archive. It accumulates without urgency and
              publishes only when an entry has earned the air it occupies.
            </p>
            <p className="text-lg leading-[1.7] text-ink/90">
              The site is organised the way a well-kept notebook is organised:
              by date and by preoccupation. Each entry is a small case study —
              a place, a condition of weather, a question about material — and
              each is intended to stand alone while also fitting into longer
              threads. Topics group those threads. The visual archive holds
              the loose plates and contact sheets that did not need a paragraph
              around them.
            </p>
            <p className="text-lg leading-[1.7] text-ink/90">
              Editorial rules are deliberately few. Entries must include the
              date and place. Captions are written in the order they were felt.
              Video is treated as a still that has not yet settled. Nothing is
              backdated. Nothing is republished after the fact, although
              corrections are acknowledged in margin notes.
            </p>
            <blockquote className="border-l-2 border-accent pl-6 py-2">
              <p className="font-display text-2xl italic leading-[1.3] text-ink/85">
                “Slowness is not a style; it is what the material is asking for.”
              </p>
              <cite className="block mt-3 text-[10px] font-mono uppercase tracking-widest text-ink-mute">
                — Editor's preface, Vol. 01
              </cite>
            </blockquote>
            <p className="text-lg leading-[1.7] text-ink/90">
              If you would like to commission work, propose a journey, or
              respond to an entry, the contact page is the right way in.
            </p>
          </article>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-ink-mute mb-1">{label}</div>
      <div className="font-display text-xl">{value}</div>
    </div>
  );
}
