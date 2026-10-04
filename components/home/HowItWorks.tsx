import { HOW_IT_WORKS } from "@/lib/constants";
import Reveal from "@/components/Reveal";

export default function HowItWorks() {
  return (
    <section id="fonctionnement" className="border-b-2 border-divider py-16">
      <div className="container-site">
        <Reveal>
          <span className="eyebrow">04 — Fonctionnement</span>
          <h2 className="heading-lg mt-3 mb-16 max-w-xl">Une réservation simple, en trois étapes</h2>
        </Reveal>

        <div
          className="grid border-t-2 border-divider"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))" }}
        >
          {HOW_IT_WORKS.map((step, i) => (
            <Reveal
              key={step.step}
              delay={i * 110}
              className={i !== 0 ? "sm:border-l border-divider" : ""}
            >
              <div className="pt-10 px-6 pb-10">
                <p
                  className="font-display font-extrabold text-accent leading-none mb-6"
                  style={{ fontSize: "96px" }}
                >
                  {step.step}
                </p>
                <h3 className="font-display font-extrabold text-[22px] mb-2">{step.title}</h3>
                <p className="text-[15px] text-ink/60 leading-relaxed">{step.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
