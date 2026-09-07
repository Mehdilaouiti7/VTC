import type { ReactNode } from "react";

export default function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="section-padding bg-creme min-h-screen pt-32">
      <div className="container-site max-w-3xl mx-auto">
        <h1 className="heading-lg mb-10">{title}</h1>
        <div className="prose prose-neutral max-w-none text-anthracite/70 leading-relaxed space-y-6 [&_h2]:font-display [&_h2]:text-xl [&_h2]:text-anthracite [&_h2]:mt-8 [&_h2]:mb-3">
          {children}
        </div>
      </div>
    </section>
  );
}
