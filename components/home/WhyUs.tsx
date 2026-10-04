import Image from "next/image";
import { Clock3, Armchair, ShieldCheck, UserCheck } from "lucide-react";
import { ADVANTAGES } from "@/lib/constants";
import Reveal from "@/components/Reveal";
import clsx from "clsx";

const ICONS = { Clock3, Armchair, ShieldCheck, UserCheck };

export default function WhyUs() {
  return (
    <section className="border-b-2 border-divider">
      <div
        className="grid"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 460px), 1fr))" }}
      >
        <Reveal className="relative min-h-[560px] border-divider lg:border-r-2">
          <Image
            src="https://images.unsplash.com/photo-1617704548623-340376564e68?q=80&w=1600&auto=format&fit=crop"
            alt="Intérieur de la Tesla Model S du chauffeur"
            fill
            className="object-cover grayscale contrast-[1.08]"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute bottom-0 left-0 max-w-[260px] bg-accent px-7 py-6">
            <p className="font-display font-extrabold text-[64px] leading-none text-bg mb-1">99%</p>
            <p className="text-sm font-semibold leading-snug text-bg">
              de trajets assurés à l&apos;heure exacte convenue
            </p>
          </div>
        </Reveal>

        <div className="px-6 pt-20">
          <Reveal>
            <span className="eyebrow">02 — Pourquoi nous</span>
            <h2 className="heading-lg mt-3 mb-6">
              Ici, vous ne montez pas dans n&apos;importe quelle voiture.
              <span className="text-accent"> Vous réservez un service, à bord d&apos;une Tesla Model S.</span>
            </h2>
            <p className="text-ink/70 mb-12 leading-relaxed max-w-lg">
              Vous échangez directement avec votre chauffeur pour organiser votre trajet selon vos
              besoins réels : horaires, étapes, attente sur place ou demandes particulières.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 border-t-2 border-divider mx-[-24px]">
            {ADVANTAGES.map((adv, i) => {
              const Icon = ICONS[adv.icon as keyof typeof ICONS];
              return (
                <Reveal
                  key={adv.title}
                  delay={i * 80}
                  className={clsx(
                    "p-6",
                    i % 2 === 0 && "sm:border-r border-divider",
                    i < 2 && "border-b border-divider"
                  )}
                >
                  <Icon size={22} strokeWidth={2} className="text-accent mb-4" />
                  <h4 className="font-display font-extrabold text-lg mb-1.5">{adv.title}</h4>
                  <p className="text-sm text-ink/60 leading-relaxed">{adv.description}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
