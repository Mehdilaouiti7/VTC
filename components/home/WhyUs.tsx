import Image from "next/image";
import { Clock3, Armchair, ShieldCheck, UserCheck } from "lucide-react";
import { ADVANTAGES } from "@/lib/constants";
import Reveal from "@/components/Reveal";

const ICONS = { Clock3, Armchair, ShieldCheck, UserCheck };

export default function WhyUs() {
  return (
    <section className="section-padding bg-noir text-creme overflow-hidden">
      <div className="container-site grid lg:grid-cols-2 gap-16 items-center">
        <Reveal>
          <div className="relative aspect-[4/5] rounded-xl2 overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1600&auto=format&fit=crop"
              alt="Intérieur d'un véhicule de chauffeur privé"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </Reveal>

        <div>
          <Reveal>
            <span className="eyebrow">Pourquoi choisir un chauffeur privé ?</span>
            <h2 className="heading-lg mt-3 mb-6">
              Ici, vous ne commandez pas simplement une voiture.
              <span className="text-or"> Vous réservez un service.</span>
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
                      <Icon size={18} className="text-or" />
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
