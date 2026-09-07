import Link from "next/link";
import { Calculator, FileText, ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";

export default function PricingSection() {
  return (
    <section className="section-padding bg-noir text-creme grain overflow-hidden">
      <div className="container-site">
        <Reveal className="text-center">
          <span className="eyebrow justify-center">Tarification</span>
          <h2 className="heading-lg mt-3 mb-6">Un prix adapté à votre trajet</h2>
          <p className="text-creme/55 max-w-xl mx-auto mb-16 leading-relaxed">
            Chaque trajet est différent. Selon votre demande, obtenez une estimation immédiate ou
            un devis personnalisé pour les besoins plus complexes.
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-6 max-w-4xl mx-auto items-start">
          <Reveal>
            <div className="card-dark relative p-10 sm:p-12 text-left border-t-2 !border-t-or overflow-hidden">
              <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-or/10 blur-3xl" />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-or/15 mb-7">
                <Calculator size={22} className="text-or" />
              </div>
              <h3 className="font-display text-2xl mb-3">Estimation automatique</h3>
              <p className="text-sm text-creme/55 leading-relaxed mb-9 max-w-sm">
                Pour les trajets simples, obtenez immédiatement une estimation de prix pendant
                votre réservation en ligne.
              </p>
              <Link
                href="/reserver"
                className="inline-flex items-center gap-2 text-or text-sm font-medium tracking-wide group"
              >
                Réserver un trajet
                <ArrowRight size={15} className="transition-transform duration-300 ease-premium group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={120} className="lg:mt-10">
            <div className="rounded-xl2 border border-white/[0.08] p-10 sm:p-12 text-left h-full">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 mb-7">
                <FileText size={20} className="text-creme/70" />
              </div>
              <h3 className="font-display text-xl mb-3">Devis personnalisé</h3>
              <p className="text-sm text-creme/50 leading-relaxed mb-9">
                Trajets complexes, mises à disposition longues ou événements : demandez un devis
                sur-mesure.
              </p>
              <Link
                href="/devis"
                className="inline-flex items-center gap-2 text-creme/70 text-sm font-medium tracking-wide hover:text-or transition-colors"
              >
                Demander un devis
                <ArrowRight size={15} />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
