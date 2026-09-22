import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/Nav";
import { SiteFooter } from "@/components/site/Footer";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      {
        title: "About — Eureka Khong",
      },
      {
        name: "description",
        content:
          "Learn more about Eureka Khong, her personal and professional inquiries, and her interest in social and ecological systems.",
      },
      {
        property: "og:title",
        content: "About — Eureka Khong",
      },
      {
        property: "og:description",
        content:
          "A little about Eureka Khong, her interests, experiences and ongoing inquiry into social and ecological systems.",
      },
    ],
  }),

  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-home-ash text-home-ink">
      <SiteNav />

      <main className="mx-auto max-w-7xl px-6 py-12 md:py-20">
        {/* HEADER */}
        <header className="mb-16 max-w-4xl md:mb-24">
          <div className="mb-4 font-home-display text-[10px] uppercase tracking-[0.2em] text-home-orange">
            [ ABOUT EUREKA ]
          </div>

          <h1 className="font-home-display text-5xl leading-[0.95] md:text-7xl">
            A life in
            <br />
            <i>progress.</i>
          </h1>

          <p className="mt-8 max-w-2xl font-home-display text-xl leading-tight md:text-3xl">
            An ongoing exploration of how to live, work, create and relate with
            greater congruity.
          </p>
        </header>

        {/* MAIN CONTENT */}
        <div className="grid gap-12 md:grid-cols-[1fr_2fr] md:gap-20">
          {/* SIDEBAR */}
          <aside className="space-y-8">
            <Meta
              label="Name"
              value="Eureka Khong"
            />

            <Meta
              label="Based"
              value="India"
            />

            <Meta
              label="Interested in"
              value="Social and ecological systems"
            />

            <Meta
              label="Working across"
              value="Design, ecology, community, research and creative practice"
            />

            <Meta
              label="Current engagement"
              value="Project Potential"
              href="https://www.projectpotential.org"
            />

            <div className="pt-2">
              <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-home-ink/50">
                Connect
              </div>

              <div className="space-y-2 font-home-display text-lg">
                <a
                  href="mailto:eurekakhong@gmail.com"
                  className="block underline decoration-home-orange decoration-2 underline-offset-4"
                >
                  Email
                </a>

                <a
                  href="https://www.linkedin.com/in/eurekakhong/"
                  target="_blank"
                  rel="noreferrer"
                  className="block hover:text-home-orange"
                >
                  LinkedIn ↗
                </a>

                <a
                  href="https://www.instagram.com/eurekakhong/"
                  target="_blank"
                  rel="noreferrer"
                  className="block hover:text-home-orange"
                >
                  Instagram ↗
                </a>
              </div>
            </div>
          </aside>

          {/* ARTICLE */}
          <article className="max-w-[68ch] space-y-8">
            <p className="font-home-display text-2xl italic leading-[1.3] text-home-ink/85 md:text-3xl">
              I’ve been named Eureka (!) and I’m on a possibly lifelong mission
              to de-condition myself from all the noise around.
            </p>

            <p className="text-lg leading-[1.7] text-home-ink/90">
              In this quest of sieving my beliefs, opinions and expectations,
              I’ve gradually increased my access to tailor-made experiences,
              observations and joy.
            </p>

            <p className="text-lg leading-[1.7] text-home-ink/90">
              I enjoy designing my life experiences, both the well-hatched-out
              ones and the impromptu; those in exploratory company and in
              solitude; those that help me dive deeper into the unknown or swim
              out of the unknown, usually into another.
            </p>

            <p className="text-lg leading-[1.7] text-home-ink/90">
              I find it emotionally exhausting to manage perpendicular personal
              and professional interests. After all, they are both part of the
              same life.
            </p>

            <blockquote className="border-l-2 border-home-orange py-2 pl-6">
              <p className="font-home-display text-2xl italic leading-[1.3] text-home-ink/85 md:text-3xl">
                “What else is there?”
              </p>

              <cite className="mt-3 block font-mono text-[10px] uppercase tracking-widest text-home-ink/50">
                On social and ecological systems
              </cite>
            </blockquote>

            <p className="text-lg leading-[1.7] text-home-ink/90">
              Recognising this need was perhaps my most sincere Eureka moment,
              thus far. Since then, I’ve tried to maintain congruity between
              the personal and professional parts of my life, allowing them to
              inform and enrich one another.
            </p>

            <p className="text-lg leading-[1.7] text-home-ink/90">
              My work and interests continue to move across ecology, design,
              architecture, community, research, art and the everyday
              experiences through which we understand the world.
            </p>

            <p className="text-lg leading-[1.7] text-home-ink/90">
              This website is a space for those explorations: a collection of
              projects, observations, reflections, questions and things I am
              still learning how to articulate.
            </p>

            {/* CURRENT WORK */}
            <div className="border-t border-home-ink pt-8">
              <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-home-ink/50">
                Current engagement
              </p>

              <p className="text-lg leading-[1.7] text-home-ink/90">
                For more on my current engagement, visit{" "}
                <a
                  href="https://www.projectpotential.org"
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-home-orange decoration-2 underline-offset-4"
                >
                  Project Potential ↗
                </a>
                .
              </p>
            </div>

            {/* CONTACT */}
            <div className="border-t border-home-ink pt-8">
              <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-home-ink/50">
                Say hello
              </p>

              <p className="text-lg leading-[1.7] text-home-ink/90">
                Happy to connect.
              </p>

              <a
                href="mailto:eurekakhong@gmail.com"
                className="mt-3 inline-block font-home-display text-xl underline decoration-home-orange decoration-2 underline-offset-4 md:text-2xl"
              >
                eurekakhong@gmail.com
              </a>
            </div>
          </article>
        </div>

        {/* RETURN TO JOURNAL */}
        <div className="mt-20 border-t border-home-ink pt-6 md:mt-28">
          <Link
            to="/journal"
            className="font-home-display text-[10px] uppercase underline decoration-home-orange decoration-2 underline-offset-4"
          >
            Explore the journal →
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function Meta({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div>
      <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-home-ink/50">
        {label}
      </div>

      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="font-home-display text-xl underline decoration-home-orange decoration-2 underline-offset-4"
        >
          {value} ↗
        </a>
      ) : (
        <div className="font-home-display text-xl">
          {value}
        </div>
      )}
    </div>
  );
}
