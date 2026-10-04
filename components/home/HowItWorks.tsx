import { HOW_IT_WORKS } from "@/lib/constants";
import Reveal from "@/components/Reveal";

const OFFSETS = ["sm:ml-0", "sm:ml-16 lg:ml-28", "sm:ml-32 lg:ml-56"];

export default function HowItWorks() {
  return (
    <section className="section-padding bg-creme overflow-hidden">
      <div className="container-site">
        <Reveal>
          <span className="eyebrow">Fonctionnement</span>
          <h2 className="heading-lg mt-3 mb-16 sm:mb-20 max-w-xl">
            Une réservation simple, en trois étapes
          </h2>
        </Reveal>

        <div className="relative">
          <div className="flex flex-col gap-10 sm:gap-14">
            {HOW_IT_WORKS.map((step, i) => (
              <Reveal key={step.step} delay={i * 110} className={OFFSETS[i] ?? ""}>
                <div className="flex items-start gap-6 max-w-lg">
                  <div className="shrink-0 flex h-14 w-14 items-center justify-center rounded-full bg-noir font-display text-lg text-or relative z-10">
                    {step.step}
                  </div>
                  <div className="pt-2">
                    <h3 className="font-display text-xl mb-2">{step.title}</h3>
                    <p className="text-sm text-anthracite/60 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
