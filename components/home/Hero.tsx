import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section id="accueil" className="relative min-h-[92vh] flex items-end overflow-hidden bg-noir">
      <Image
        src="https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=2400&auto=format&fit=crop"
        alt="Véhicule de chauffeur privé haut de gamme"
        fill
        priority
        className="object-cover object-center opacity-80"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/70 to-noir/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-noir/60 via-transparent to-transparent" />

      <div className="container-site relative z-10 pb-24 pt-48 sm:pb-32">
        <div className="max-w-3xl animate-fadeUp">
          <span className="eyebrow mb-6">Chauffeur privé indépendant</span>
          <h1 className="heading-xl text-creme mb-6">
            Votre chauffeur privé, <br className="hidden sm:block" />
            directement avec vous.
          </h1>
          <p className="text-creme/75 text-base sm:text-lg max-w-xl mb-10 leading-relaxed">
            Déplacements professionnels, transferts aéroport, trajets privés et mise à
            disposition. Réservez votre chauffeur selon vos horaires et vos besoins.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/reserver" className="btn-primary">
              Réserver un trajet
            </Link>
            <Link href="/devis" className="btn-secondary">
              Demander un devis
            </Link>
          </div>
          <p className="mt-8 text-xs sm:text-sm uppercase tracking-[0.2em] text-creme/50">
            Réservation directe • Chauffeur professionnel • Service personnalisé • Sans intermédiaire
          </p>
        </div>
      </div>
    </section>
  );
}
