import Link from "next/link";
import Reveal from "@/components/Reveal";

export default function CustomRequest() {
  return (
    <section className="section-padding bg-creme2">
      <div className="container-site">
        <Reveal>
          <div className="card bg-gradient-to-br from-anthracite to-noir text-creme p-10 sm:p-16 text-center max-w-4xl mx-auto">
            <span className="eyebrow justify-center">Trajet sur-mesure</span>
            <h2 className="heading-lg mt-4 mb-6">
              Un trajet particulier ? <span className="text-or">Nous nous adaptons.</span>
            </h2>
            <p className="text-creme/65 leading-relaxed max-w-2xl mx-auto mb-10">
              Plusieurs arrêts, attente sur place, trajet professionnel, transfert aller-retour,
              mise à disposition pour plusieurs heures ou journée complète : indiquez-nous
              simplement vos besoins.
            </p>
            <Link href="/devis" className="btn-primary">
              Créer une demande personnalisée
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
