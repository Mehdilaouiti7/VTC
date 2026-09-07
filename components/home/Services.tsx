import Image from "next/image";
import { Plane, Briefcase, Car, Clock, Sparkles, ArrowUpRight } from "lucide-react";
import { SERVICES } from "@/lib/constants";
import Reveal from "@/components/Reveal";
import clsx from "clsx";

const ICONS = { Plane, Briefcase, Car, Clock, Sparkles };

// Asymmetric bento layout instead of a uniform 3-column grid: the two primary
// services get a wide featured treatment, the rest sit in a tighter row.
const SPANS = ["lg:col-span-3", "lg:col-span-3", "lg:col-span-2", "lg:col-span-2", "lg:col-span-2"];

export default function Services() {
  return (
    <section id="services" className="section-padding bg-creme">
      <div className="container-site">
        <Reveal className="max-w-xl">
          <span className="eyebrow">Nos services</span>
          <h2 className="heading-lg mt-3 mb-4">
            Un service de chauffeur pensé pour chaque besoin
          </h2>
          <p className="text-anthracite/55 mb-16">
            Que ce soit pour un rendez-vous, un vol, un événement ou une journée entière, votre
            chauffeur s&apos;adapte à votre emploi du temps.
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-6 gap-5">
          {SERVICES.map((service, i) => {
            const Icon = ICONS[service.icon as keyof typeof ICONS];
            const featured = i === 0;

            return (
              <Reveal key={service.key} delay={i * 90} className={SPANS[i]}>
                <div
                  className={clsx(
                    "card group relative h-full overflow-hidden p-8 hover:-translate-y-1",
                    featured ? "min-h-[19rem] text-creme" : "min-h-[16rem]"
                  )}
                >
                  {featured && (
                    <>
                      <Image
                        src="https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1600&auto=format&fit=crop"
                        alt=""
                        fill
                        className="object-cover transition-transform duration-[1.2s] ease-premium group-hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 60vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/75 to-noir/20" />
                    </>
                  )}

                  <div className="relative z-10 flex h-full flex-col">
                    <div
                      className={clsx(
                        "mb-6 flex h-12 w-12 items-center justify-center rounded-full",
                        featured ? "bg-or/20 border border-or/30" : "bg-noir"
                      )}
                    >
                      <Icon size={20} className="text-or" />
                    </div>
                    <h3 className={clsx("font-display mb-3", featured ? "text-2xl" : "text-xl")}>
                      {service.title}
                    </h3>
                    <p
                      className={clsx(
                        "text-sm leading-relaxed",
                        featured ? "text-creme/70 max-w-sm" : "text-anthracite/55"
                      )}
                    >
                      {service.description}
                    </p>
                    <ArrowUpRight
                      size={16}
                      className={clsx(
                        "mt-auto pt-6 opacity-0 -translate-x-1 transition-all duration-300 ease-premium group-hover:opacity-100 group-hover:translate-x-0",
                        featured ? "text-or" : "text-anthracite/40"
                      )}
                    />
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
