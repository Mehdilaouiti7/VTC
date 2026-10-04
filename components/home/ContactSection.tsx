import { Phone, Mail, MessageCircle, ArrowUpRight } from "lucide-react";
import { CONTACT } from "@/lib/constants";
import Reveal from "@/components/Reveal";

export default function ContactSection() {
  return (
    <section id="contact" className="py-16">
      <div className="container-site">
        <Reveal className="max-w-xl mb-14">
          <span className="eyebrow">06 — Contact</span>
          <h2 className="heading-lg mt-3 mb-4">Besoin d&apos;une information avant de réserver ?</h2>
          <p className="text-ink/60 leading-relaxed">
            Notre équipe est disponible pour répondre à vos questions et organiser votre trajet
            sur-mesure.
          </p>
        </Reveal>

        <div
          className="grid-gutters"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))" }}
        >
          <Reveal>
            <a
              href={`https://wa.me/${CONTACT.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col justify-between gap-10 bg-ink px-6 py-7 transition-colors hover:bg-accent"
            >
              <div className="flex items-start justify-between">
                <MessageCircle size={24} strokeWidth={2} className="text-bg" />
                <ArrowUpRight size={20} strokeWidth={2} className="text-bg" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-2xl text-bg mb-2">
                  Discuter sur WhatsApp
                </h3>
                <p className="text-sm text-bg/80 leading-relaxed max-w-xs">
                  La réponse la plus rapide — on vous répond directement, sans détour.
                </p>
              </div>
            </a>
          </Reveal>

          <Reveal delay={80}>
            <a
              href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
              className="flex h-full flex-col justify-between gap-10 bg-bg px-6 py-7 transition-colors hover:bg-accent-100"
            >
              <Phone size={24} strokeWidth={2} className="text-accent" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink/50 mb-2">
                  Téléphone
                </p>
                <p className="font-display font-extrabold text-2xl text-ink">{CONTACT.phone}</p>
              </div>
            </a>
          </Reveal>

          <Reveal delay={160}>
            <a
              href={`mailto:${CONTACT.email}`}
              className="flex h-full flex-col justify-between gap-10 bg-bg px-6 py-7 transition-colors hover:bg-accent-100"
            >
              <Mail size={24} strokeWidth={2} className="text-accent" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink/50 mb-2">
                  Email
                </p>
                <p
                  className="font-display font-extrabold text-xl text-ink"
                  style={{ overflowWrap: "anywhere" }}
                >
                  {CONTACT.email}
                </p>
              </div>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
