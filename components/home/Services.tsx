import { Plane, Briefcase, Car, Clock, Sparkles } from "lucide-react";
import { SERVICES } from "@/lib/constants";
import Reveal from "@/components/Reveal";

const ICONS = { Plane, Briefcase, Car, Clock, Sparkles };

export default function Services() {
  return (
    <section id="services" className="section-padding bg-creme">
      <div className="container-site">
        <Reveal>
          <span className="eyebrow">Nos services</span>
          <h2 className="heading-lg mt-3 mb-4 max-w-xl">
            Un service de chauffeur pensé pour chaque besoin
          </h2>
          <p className="text-anthracite/60 max-w-xl mb-14">
            Que ce soit pour un rendez-vous, un vol, un événement ou une journée entière, votre
            chauffeur s&apos;adapte à votre emploi du temps.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service, i) => {
            const Icon = ICONS[service.icon as keyof typeof ICONS];
            return (
              <Reveal key={service.key} delay={i * 80}>
                <div className="card h-full p-8 hover:-translate-y-1 transition-transform duration-300">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-noir">
                    <Icon size={20} className="text-or" />
                  </div>
                  <h3 className="font-display text-xl mb-3">{service.title}</h3>
                  <p className="text-sm text-anthracite/60 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
