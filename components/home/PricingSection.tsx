import Link from "next/link";
import { Calculator, FileText, ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";

export default function PricingSection() {
  return (
    <section className="border-b-2 border-divider">
      <div
        className="grid"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 420px), 1fr))" }}
      >
        <Reveal className="border-divider px-6 py-16 lg:border-r-2">
          <span className="eyebrow">05 — Tarification</span>
          <h2 className="heading-lg mt-3 mb-6">Un prix adapté à votre trajet</h2>
          <p className="text-ink/70 max-w-xl leading-relaxed">
            Chaque trajet est différent. Selon votre demande, obtenez une estimation immédiate ou
            un devis personnalisé pour les besoins plus complexes.
          </p>
        </Reveal>

        <div className="flex flex-col">
          <Reveal>
            <Link
              href="/reserver"
              className="group flex items-center gap-5 px-6 py-8 border-b border-divider transition-colors hover:bg-accent-100"
            >
              <Calculator size={28} strokeWidth={2} className="text-accent shrink-0" />
              <div className="flex-1">
                <h3 className="font-display font-extrabold text-[22px] mb-1">Estimation automatique</h3>
                <p className="text-sm text-ink/60 leading-relaxed">
                  Pour les trajets simples, obtenez immédiatement une estimation de prix pendant
                  votre réservation en ligne.
                </p>
              </div>
              <ArrowUpRight size={22} strokeWidth={2} className="text-ink shrink-0" />
            </Link>
          </Reveal>

          <Reveal delay={100}>
            <Link
              href="/devis"
              className="group flex items-center gap-5 px-6 py-8 transition-colors hover:bg-accent-100"
            >
              <FileText size={28} strokeWidth={2} className="text-accent shrink-0" />
              <div className="flex-1">
                <h3 className="font-display font-extrabold text-[22px] mb-1">Devis personnalisé</h3>
                <p className="text-sm text-ink/60 leading-relaxed">
                  Trajets complexes, mises à disposition longues ou événements : demandez un devis
                  sur-mesure.
                </p>
              </div>
              <ArrowUpRight size={22} strokeWidth={2} className="text-ink shrink-0" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
