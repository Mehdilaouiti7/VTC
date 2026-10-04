import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Lightning } from "@phosphor-icons/react/dist/ssr";

export default function Hero() {
  return (
    <section id="accueil" className="relative min-h-[92dvh] flex items-end overflow-hidden bg-noir">
      <div className="absolute inset-0 animate-kenburns">
        <Image
          src="https://images.unsplash.com/photo-1536700503339-1e4b06520771?q=80&w=2400&auto=format&fit=crop"
          alt="Tesla Model S du chauffeur, à l'arrêt de nuit"
          fill
          priority
          className="object-cover object-center opacity-80"
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/70 to-noir/15" />
      <div className="absolute inset-0 bg-gradient-to-r from-noir/65 via-transparent to-transparent" />

      <div className="container-site relative z-10 pb-24 pt-24 sm:pb-32 sm:pt-48">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-3 mb-4 sm:mb-6 reveal in-view">
            <span className="eyebrow !mb-0">Chauffeur privé indépendant</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-or/15 border border-or/25 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-or font-medium">
              <Lightning weight="fill" size={11} />
              Tesla Model S
            </span>
          </div>
          <h1 className="heading-xl text-creme mb-4 sm:mb-6 reveal in-view" style={{ animationDelay: "80ms" }}>
            Votre chauffeur privé, <br className="hidden sm:block" />
            directement avec vous.
          </h1>
          <p
            className="text-creme/75 text-base sm:text-lg max-w-xl mb-6 sm:mb-10 leading-relaxed reveal in-view"
            style={{ animationDelay: "160ms" }}
          >
            Déplacements professionnels, transferts aéroport, trajets privés et mise à
            disposition — à bord d&apos;une Tesla Model S silencieuse et toujours impeccable.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 reveal in-view" style={{ animationDelay: "240ms" }}>
            <Link href="/reserver" className="group flex items-center justify-center gap-3 rounded-full bg-or py-3.5 pl-7 pr-2.5 text-sm font-medium tracking-wide text-noir transition-all duration-300 ease-premium hover:-translate-y-0.5 active:scale-[0.98]">
              Réserver un trajet
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-noir/10 transition-transform duration-300 ease-premium group-hover:translate-x-0.5">
                <ArrowRight weight="bold" size={15} />
              </span>
            </Link>
            <Link href="/devis" className="btn-secondary">
              Demander un devis
            </Link>
          </div>
          <p
            className="mt-6 sm:mt-8 text-[10px] sm:text-sm uppercase tracking-[0.1em] sm:tracking-[0.2em] text-creme/45 reveal in-view"
            style={{ animationDelay: "320ms" }}
          >
            Réservation directe • Chauffeur professionnel • Service personnalisé • Sans intermédiaire
          </p>
        </div>
      </div>
    </section>
  );
}
