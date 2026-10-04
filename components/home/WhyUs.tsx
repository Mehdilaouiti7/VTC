import Image from "next/image";
import { Clock as Clock3, Armchair, ShieldCheck, UserCheck } from "@phosphor-icons/react/dist/ssr";
import { ADVANTAGES } from "@/lib/constants";
import Reveal from "@/components/Reveal";

const ICONS = { Clock3, Armchair, ShieldCheck, UserCheck };

export default function WhyUs() {
  return (
    <section className="section-padding bg-noir text-creme overflow-hidden grain">
      <div className="container-site grid lg:grid-cols-2 gap-16 items-center">
        <Reveal className="relative">
          <div className="bezel-dark relative">
            <div className="bezel-inner relative aspect-[4/5] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1617704548623-340376564e68?q=80&w=1600&auto=format&fit=crop"
                alt="Intérieur de la Tesla Model S du chauffeur"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
          <div className="bezel-dark absolute -bottom-6 -right-4 sm:right-6 max-w-[220px]">
            <div className="bezel-inner bg-anthracite px-6 py-5" style={{ boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.05)" }}>
              <p className="font-display text-3xl text-or leading-none mb-1">99%</p>
              <p className="text-xs text-creme/55 leading-snug">
                de trajets assurés à l&apos;heure exacte convenue
              </p>
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <span className="eyebrow">Pourquoi choisir un chauffeur privé ?</span>
            <h2 className="heading-lg mt-3 mb-6">
              Ici, vous ne montez pas dans n&apos;importe quelle voiture.
              <span className="text-or"> Vous réservez un service, à bord d&apos;une Tesla Model S.</span>
            </h2>
            <p className="text-creme/60 mb-12 leading-relaxed max-w-lg">
              Vous échangez directement avec votre chauffeur pour organiser votre trajet selon vos
              besoins réels : horaires, étapes, attente sur place ou demandes particulières.
            </p>
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-8">
            {ADVANTAGES.map((adv, i) => {
              const Icon = ICONS[adv.icon as keyof typeof ICONS];
              return (
                <Reveal key={adv.title} delay={i * 80}>
                  <div className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-or/30">
                      <Icon weight="light" size={18} className="text-or" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg mb-1.5">{adv.title}</h3>
                      <p className="text-sm text-creme/55 leading-relaxed">{adv.description}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
