import Link from "next/link";
import { Calculator, FileText } from "lucide-react";
import Reveal from "@/components/Reveal";

export default function PricingSection() {
  return (
    <section className="section-padding bg-noir text-creme">
      <div className="container-site text-center">
        <Reveal>
          <span className="eyebrow justify-center">Tarification</span>
          <h2 className="heading-lg mt-3 mb-6">Un prix adapté à votre trajet</h2>
          <p className="text-creme/60 max-w-xl mx-auto mb-14 leading-relaxed">
            Chaque trajet est différent. Selon votre demande, obtenez une estimation immédiate ou
            un devis personnalisé pour les besoins plus complexes.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <Reveal>
            <div className="card bg-anthracite border border-white/5 p-10 h-full text-left">
              <Calculator size={28} className="text-or mb-6" />
              <h3 className="font-display text-xl mb-3">Estimation automatique</h3>
              <p className="text-sm text-creme/55 leading-relaxed mb-8">
                Pour les trajets simples, obtenez immédiatement une estimation de prix pendant
                votre réservation en ligne.
              </p>
              <Link href="/reserver" className="text-or text-sm font-medium tracking-wide hover:underline">
                Réserver un trajet →
              </Link>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="card bg-anthracite border border-white/5 p-10 h-full text-left">
              <FileText size={28} className="text-or mb-6" />
              <h3 className="font-display text-xl mb-3">Devis personnalisé</h3>
              <p className="text-sm text-creme/55 leading-relaxed mb-8">
                Pour les trajets complexes, mises à disposition longues ou événements, demandez un
                devis sur-mesure.
              </p>
              <Link href="/devis" className="text-or text-sm font-medium tracking-wide hover:underline">
                Demander un devis →
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
