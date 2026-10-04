import type { ReactNode } from "react";

export default function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="bg-bg min-h-screen py-16 sm:pt-24">
      <div className="container-site max-w-3xl mx-auto">
        <span className="eyebrow">Informations légales</span>
        <h1 className="heading-lg mt-3 mb-10">{title}</h1>
        <div className="prose prose-neutral max-w-none text-ink/70 leading-relaxed space-y-6 border-t-2 border-divider pt-10 [&_h2]:font-display [&_h2]:font-extrabold [&_h2]:text-xl [&_h2]:text-ink [&_h2]:mt-8 [&_h2]:mb-3">
          {children}
        </div>
      </div>
    </section>
  );
}
