import Image from "next/image";
import { Plane, Briefcase, Car, Clock, Sparkles } from "lucide-react";
import { SERVICES } from "@/lib/constants";
import Reveal from "@/components/Reveal";
import clsx from "clsx";

const ICONS = { Plane, Briefcase, Car, Clock, Sparkles };

export default function Services() {
  return (
    <section id="services" className="border-b-2 border-divider py-16">
      <div className="container-site">
        <div
          className="grid gap-8 mb-12"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}
        >
          <Reveal>
            <span className="eyebrow">01 — Nos services</span>
            <h2 className="heading-lg mt-3">Un service de chauffeur pensé pour chaque besoin</h2>
          </Reveal>
          <Reveal delay={60} className="flex sm:justify-end">
            <p className="text-left text-[17px] max-w-[460px] text-ink/70 leading-relaxed">
              Que ce soit pour un rendez-vous, un vol, un événement ou une journée entière, votre
              chauffeur s&apos;adapte à votre emploi du temps.
            </p>
          </Reveal>
        </div>

        <div
          className="grid-gutters"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))" }}
        >
          {SERVICES.map((service, i) => {
            const Icon = ICONS[service.icon as keyof typeof ICONS];
            const featured = i === 0;

            return (
              <Reveal
                key={service.key}
                delay={i * 90}
                className="relative"
                style={featured ? { gridColumn: "span 2" } : undefined}
              >
                {featured ? (
                  <div className="relative min-h-[320px] h-full overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1536700503339-1e4b06520771?q=80&w=1600&auto=format&fit=crop"
                      alt="Tesla Model S, le véhicule du chauffeur"
                      fill
                      className="object-cover grayscale contrast-[1.08]"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: "linear-gradient(transparent, rgba(0,0,0,.6))" }}
                    />
                    <div className="relative z-10 flex h-full flex-col p-6">
                      <Icon size={28} strokeWidth={2} className="text-bg mb-6" />
                      <h3 className="font-display font-extrabold text-[28px] text-bg mt-auto">
                        {service.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-bg/80 max-w-sm mt-2">
                        {service.description}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="group flex h-full min-h-[280px] flex-col bg-bg p-6 transition-colors hover:bg-accent-100">
                    <div className="flex items-start justify-between">
                      <Icon size={28} strokeWidth={2} className="text-accent" />
                      <span className="text-[13px] font-semibold text-ink/50">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3
                      className={clsx("font-display font-extrabold text-xl text-ink")}
                      style={{ marginTop: "auto", paddingTop: "24px" }}
                    >
                      {service.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-ink/60 mt-2">{service.description}</p>
                  </div>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
