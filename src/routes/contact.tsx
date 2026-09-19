import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav } from "@/components/site/Nav";
import { SiteFooter } from "@/components/site/Footer";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Field of Possibility" },
      { name: "description", content: "Get in touch with the studio. Commissions, journeys, and reader responses." },
      { property: "og:title", content: "Contact — Field of Possibility" },
      { property: "og:description", content: "Get in touch with the studio." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen bg-paper">
      <SiteNav />
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <header className="max-w-3xl mb-16">
          <div className="text-[12px] font-mono text-accent mb-4 tracking-widest">[ CORRESPONDENCE ]</div>
          <h1 className="font-display text-5xl md:text-6xl leading-[0.95] mb-6">
            Write to the <i>studio</i>.
          </h1>
          <p className="text-lg text-ink-soft leading-relaxed">
            Replies arrive within a fortnight, usually on a Sunday.
          </p>
        </header>

        <div className="grid md:grid-cols-[1fr_2fr] gap-12 md:gap-20">
          <aside className="space-y-8">
            <Field label="Direct" value="hello@eureka.archive" />
            <Field label="Commissions" value="studio@eureka.archive" />
            <Field label="Press" value="press@eureka.archive" />
            <Field label="Post" value={`Strandgade 38\n1401 Copenhagen K\nDenmark`} />
            <Field label="Hours" value="Tue–Fri · 10:00 – 17:00 CET" />
          </aside>

          <form
            onSubmit={(e) => { e.preventDefault(); setSent(true); }}
            className="space-y-8 max-w-xl"
          >
            {sent ? (
              <div className="border border-rule p-8">
                <div className="text-[10px] font-mono uppercase tracking-widest text-accent mb-2">Received</div>
                <p className="font-display text-2xl italic leading-[1.3]">
                  Your note has been filed. You will hear back, possibly on a Sunday.
                </p>
              </div>
            ) : (
              <>
                <Input label="Your name" name="name" />
                <Input label="Email" name="email" type="email" />
                <Input label="Subject" name="subject" />
                <Textarea label="Message" name="message" />
                <button
                  type="submit"
                  className="px-6 py-3 bg-ink text-paper text-[11px] font-mono uppercase tracking-widest hover:bg-accent transition-colors"
                >
                  Send correspondence
                </button>
              </>
            )}
          </form>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-ink-mute mb-1">{label}</div>
      <div className="font-display text-xl whitespace-pre-line">{value}</div>
    </div>
  );
}

function Input({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <label className="block">
      <span className="block text-[10px] font-mono uppercase tracking-widest text-ink-mute mb-2">{label}</span>
      <input
        name={name}
        type={type}
        required
        className="w-full border-b border-ink bg-transparent py-2 text-lg font-display focus:outline-none focus:border-accent"
      />
    </label>
  );
}

function Textarea({ label, name }: { label: string; name: string }) {
  return (
    <label className="block">
      <span className="block text-[10px] font-mono uppercase tracking-widest text-ink-mute mb-2">{label}</span>
      <textarea
        name={name}
        rows={5}
        required
        className="w-full border-b border-ink bg-transparent py-2 text-lg font-display resize-none focus:outline-none focus:border-accent"
      />
    </label>
  );
}
