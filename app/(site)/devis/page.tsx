import type { Metadata } from "next";
import QuoteForm from "@/components/QuoteForm";

export const metadata: Metadata = {
  title: "Demander un devis",
  description:
    "Trajet complexe, mise à disposition longue ou événement : demandez un devis personnalisé à votre chauffeur privé.",
};

export default function DevisPage() {
  return (
    <section className="section-padding bg-creme min-h-screen pt-32">
      <div className="container-site max-w-2xl mx-auto">
        <div className="text-center mb-14">
          <span className="eyebrow justify-center">Demande personnalisée</span>
          <h1 className="heading-lg mt-3 mb-4">Créer une demande de devis</h1>
          <p className="text-anthracite/60">
            Plusieurs arrêts, attente sur place, trajet professionnel, transfert aller-retour,
            mise à disposition pour plusieurs heures ou journée complète : indiquez-nous
            simplement vos besoins.
          </p>
        </div>
        <QuoteForm />
      </div>
    </section>
  );
}
