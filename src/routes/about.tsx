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

      <main className="mx-auto max-w-7xl px-6 py-12 md:px-8 md:py-20">
        {/* HERO */}
        <section className="grid gap-12 md:grid-cols-12 md:gap-8 md:items-end">
          {/* HERO TEXT */}
          <header className="md:col-span-7 md:pb-10">
            <div className="mb-5 font-home-display text-[10px] uppercase tracking-[0.2em] text-home-orange">
              [ ABOUT EUREKA ]
            </div>

            <h1 className="font-home-display text-6xl leading-[0.9] md:text-8xl">
              A life in
              <br />
              <i>progress.</i>
            </h1>

            <p className="mt-8 max-w-2xl font-home-display text-xl leading-tight md:text-3xl">
              An ongoing exploration of how to live, work, create and relate with greater congruity.
            </p>
          </header>

          {/* EUREKA PHOTO */}
          <div className="relative md:col-span-5 md:col-start-8">
            <div className="relative aspect-[4/5] overflow-hidden md:aspect-[4/5]">
              <img
                src="/images/eureka-about.jpg"
                alt="Eureka Khong"
                className="h-full w-full object-cover object-top"
              />
            </div>

            <div className="mt-3 flex items-start justify-between gap-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-home-ink/50">
                Eureka Khong
              </span>

              <span className="text-right font-mono text-[10px] uppercase tracking-[0.18em] text-home-ink/50">
                A life in progress
              </span>
            </div>
          </div>
        </section>

        {/* INTRODUCTION */}
        <section className="mt-24 border-t border-home-ink pt-12 md:mt-32 md:pt-16">
          <div className="grid gap-12 md:grid-cols-12 md:gap-8">
            {/* SIDEBAR / FIELD NOTES */}
            <aside className="md:col-span-4">
              <div className="sticky top-8 space-y-7">
                <Meta label="Name" value="Eureka Khong" />

                <Meta label="Based" value="India" />

                <Meta label="Interested in" value="Social and ecological systems" />

                <Meta
                  label="Working across"
                  value="Design, ecology, community, research and creative practice"
                />

                <Meta
                  label="Current engagement"
                  value="Project Potential"
                  href="https://www.projectpotential.org"
                />

                <div className="pt-4">
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
              </div>
            </aside>

            {/* ARTICLE */}
            <article className="md:col-span-7 md:col-start-6">
              {/* OPENING THOUGHT */}
              <p className="max-w-[30ch] font-home-display text-2xl italic leading-[1.3] text-home-ink/85 md:text-4xl">
                I’ve been named Eureka (!) and I’m on a possibly lifelong mission to de-condition
                myself from all the noise around.
              </p>

              <div className="mt-12 max-w-[68ch] space-y-8">
                <p className="text-lg leading-[1.7] text-home-ink/90">
                  In this quest of sieving my beliefs, opinions and expectations, I’ve gradually
                  increased my access to tailor-made experiences, observations and joy.
                </p>

                <p className="text-lg leading-[1.7] text-home-ink/90">
                  I enjoy designing my life experiences, both the well-hatched-out ones and the
                  impromptu; those in exploratory company and in solitude; those that help me dive
                  deeper into the unknown or swim out of the unknown, usually into another.
                </p>

                <p className="text-lg leading-[1.7] text-home-ink/90">
                  I find it emotionally exhausting to manage perpendicular personal and professional
                  interests. After all, they are both part of the same life.
                </p>
              </div>

              {/* LARGE QUOTE */}
              <div className="my-20 border-y border-home-ink py-12 md:my-28 md:py-16">
                <blockquote className="relative">
                  <p className="max-w-[15ch] font-home-display text-4xl italic leading-[1.05] text-home-ink/85 md:text-6xl">
                    “What else is there?”
                  </p>

                  <cite className="mt-6 block font-mono text-[10px] uppercase tracking-widest text-home-ink/50">
                    On social and ecological systems
                  </cite>
                </blockquote>
              </div>

              {/* CONTINUING THOUGHT */}
              <div className="max-w-[68ch] space-y-8">
                <p className="text-lg leading-[1.7] text-home-ink/90">
                  Recognising this need was perhaps my most sincere Eureka moment, thus far. Since
                  then, I’ve tried to maintain congruity between the personal and professional parts
                  of my life, allowing them to inform and enrich one another.
                </p>

                <p className="text-lg leading-[1.7] text-home-ink/90">
                  My work and interests continue to move across ecology, design, architecture,
                  community, research, art and the everyday experiences through which we understand
                  the world.
                </p>

                <p className="text-lg leading-[1.7] text-home-ink/90">
                  This website is a space for those explorations: a collection of projects,
                  observations, reflections, questions and things I am still learning how to
                  articulate.
                </p>
              </div>

              {/* CURRENT WORK */}
              <div className="mt-20 border-t border-home-ink pt-8 md:mt-28">
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
              <div className="mt-16 border-t border-home-ink pt-8 md:mt-20">
                <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-home-ink/50">
                  Say hello
                </p>

                <p className="text-lg leading-[1.7] text-home-ink/90">Happy to connect.</p>

                <a
                  href="mailto:eurekakhong@gmail.com"
                  className="mt-3 inline-block font-home-display text-xl underline decoration-home-orange decoration-2 underline-offset-4 md:text-2xl"
                >
                  eurekakhong@gmail.com
                </a>
              </div>
            </article>
          </div>
        </section>

        {/* JOURNAL TRANSITION */}
        <section className="mt-24 border-t border-home-ink pt-8 md:mt-36 md:pt-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-home-ink/50">
                Continue exploring
              </p>

              <p className="font-home-display text-2xl md:text-3xl">
                There&apos;s more to explore.
              </p>
            </div>

            <Link
              to="/journal"
              className="font-home-display text-lg underline decoration-home-orange decoration-2 underline-offset-4 hover:text-home-orange md:text-xl"
            >
              Explore the journal →
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function Meta({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div className="border-b border-home-ink/20 pb-5">
      <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-home-ink/50">
        {label}
      </div>

      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="font-home-display text-xl underline decoration-home-orange decoration-2 underline-offset-4 hover:text-home-orange"
        >
          {value} ↗
        </a>
      ) : (
        <div className="font-home-display text-xl">{value}</div>
      )}
    </div>
  );
}
