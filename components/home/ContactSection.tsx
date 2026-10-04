import { Phone, EnvelopeSimple as Mail, ChatCircle as MessageCircle, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { CONTACT } from "@/lib/constants";
import Reveal from "@/components/Reveal";

export default function ContactSection() {
  return (
    <section id="contact" className="section-padding bg-creme2">
      <div className="container-site">
        <Reveal className="max-w-xl mb-14">
          <span className="eyebrow">Contact</span>
          <h2 className="heading-lg mt-3 mb-4">Besoin d&apos;une information avant de réserver ?</h2>
          <p className="text-anthracite/60 leading-relaxed">
            Notre équipe est disponible pour répondre à vos questions et organiser votre trajet
            sur-mesure.
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6">
          <Reveal>
            <div className="bezel-dark h-full">
              <a
                href={`https://wa.me/${CONTACT.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bezel-inner group flex h-full flex-col justify-between bg-anthracite p-8 sm:p-10"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-or/15">
                    <MessageCircle weight="light" size={22} className="text-or" />
                  </div>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 transition-all duration-300 ease-premium group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:bg-or/15">
                    <ArrowUpRight
                      weight="light"
                      size={17}
                      className="text-creme/60 transition-colors duration-300 ease-premium group-hover:text-or"
                    />
                  </span>
                </div>
                <div className="mt-10">
                  <h3 className="font-display text-2xl text-creme mb-2">Discuter sur WhatsApp</h3>
                  <p className="text-sm text-creme/55 leading-relaxed max-w-xs">
                    La réponse la plus rapide — on vous répond directement, sans détour.
                  </p>
                </div>
              </a>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="h-full rounded-xl2 bg-white divide-y divide-anthracite/8 overflow-hidden">
              <a
                href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                className="group flex items-center gap-4 p-6 sm:p-7 transition-colors duration-300 ease-premium hover:bg-creme/60"
              >
                <Phone weight="light" size={18} className="text-or shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wider text-anthracite/45 mb-0.5">
                    Téléphone
                  </p>
                  <p className="text-sm font-medium text-anthracite truncate">{CONTACT.phone}</p>
                </div>
              </a>
              <a
                href={`mailto:${CONTACT.email}`}
                className="group flex items-center gap-4 p-6 sm:p-7 transition-colors duration-300 ease-premium hover:bg-creme/60"
              >
                <Mail weight="light" size={18} className="text-or shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wider text-anthracite/45 mb-0.5">Email</p>
                  <p className="text-sm font-medium text-anthracite truncate">{CONTACT.email}</p>
                </div>
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
