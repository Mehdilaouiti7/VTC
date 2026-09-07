import { HOW_IT_WORKS } from "@/lib/constants";
import Reveal from "@/components/Reveal";

export default function HowItWorks() {
  return (
    <section className="section-padding bg-creme">
      <div className="container-site">
        <Reveal>
          <span className="eyebrow">Fonctionnement</span>
          <h2 className="heading-lg mt-3 mb-16 max-w-xl">
            Une réservation simple, en trois étapes
          </h2>
        </Reveal>

        <div className="grid sm:grid-cols-3 gap-10 relative">
          <div className="hidden sm:block absolute top-8 left-[16.5%] right-[16.5%] h-px bg-anthracite/10" />
          {HOW_IT_WORKS.map((step, i) => (
            <Reveal key={step.step} delay={i * 100}>
              <div className="relative text-center sm:text-left">
                <div className="mx-auto sm:mx-0 mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-noir font-display text-xl text-or relative z-10">
                  {step.step}
                </div>
                <h3 className="font-display text-xl mb-2">{step.title}</h3>
                <p className="text-sm text-anthracite/60 leading-relaxed">{step.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
