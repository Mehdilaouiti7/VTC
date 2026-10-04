import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

const STRIP = [
  { index: "01", label: "Réservation directe" },
  { index: "02", label: "Chauffeur professionnel" },
  { index: "03", label: "Service personnalisé" },
  { index: "04", label: "Sans intermédiaire" },
];

export default function Hero() {
  return (
    <section id="accueil" className="border-b-2 border-divider">
      <div
        className="grid"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 460px), 1fr))" }}
      >
        <div className="flex flex-col justify-between gap-12 border-divider px-6 py-16 pb-12 lg:border-r-2">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="eyebrow !mb-0">Chauffeur privé indépendant</span>
              <span className="inline-flex items-center gap-1.5 border border-accent px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
                <Zap size={11} strokeWidth={2} />
                Tesla Model S
              </span>
            </div>
            <h1 className="heading-xl text-ink mb-6">
              Votre chauffeur privé, <br className="hidden sm:block" />
              directement avec vous<span className="text-accent">.</span>
            </h1>
            <p className="text-ink/70 text-lg max-w-[520px] leading-relaxed">
              Déplacements professionnels, transferts aéroport, trajets privés et mise à
              disposition — à bord d&apos;une Tesla Model S silencieuse et toujours impeccable.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/reserver" className="btn-primary btn-lg justify-between">
              Réserver un trajet
              <ArrowRight size={18} strokeWidth={2} />
            </Link>
            <Link href="/devis" className="btn-secondary btn-lg">
              Demander un devis
            </Link>
          </div>
        </div>

        <div className="relative min-h-[560px]">
          <Image
            src="https://images.unsplash.com/photo-1536700503339-1e4b06520771?q=80&w=2400&auto=format&fit=crop"
            alt="Tesla Model S du chauffeur, à l'arrêt de nuit"
            fill
            priority
            className="object-cover object-center grayscale contrast-[1.08]"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>

      <div
        className="grid border-t-2 border-divider"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))" }}
      >
        {STRIP.map((item, i) => (
          <div
            key={item.index}
            className={`px-6 py-4 text-[13px] font-semibold text-ink ${
              i !== STRIP.length - 1 ? "sm:border-r border-divider" : ""
            }`}
          >
            <span className="text-accent">{item.index}</span> {item.label}
          </div>
        ))}
      </div>
    </section>
  );
}
