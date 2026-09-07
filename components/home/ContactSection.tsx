import { Phone, Mail, MessageCircle } from "lucide-react";
import { CONTACT } from "@/lib/constants";
import Reveal from "@/components/Reveal";

export default function ContactSection() {
  return (
    <section id="contact" className="section-padding bg-creme2">
      <div className="container-site text-center">
        <Reveal>
          <span className="eyebrow justify-center">Contact</span>
          <h2 className="heading-lg mt-3 mb-4">Besoin d&apos;une information avant de réserver ?</h2>
          <p className="text-anthracite/60 max-w-lg mx-auto mb-14">
            Notre équipe est disponible pour répondre à vos questions et organiser votre trajet
            sur-mesure.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            {
              icon: Phone,
              title: "Téléphone",
              value: CONTACT.phone,
              href: `tel:${CONTACT.phone.replace(/\s/g, "")}`,
            },
            {
              icon: MessageCircle,
              title: "WhatsApp",
              value: "Discuter directement",
              href: `https://wa.me/${CONTACT.whatsapp}`,
            },
            {
              icon: Mail,
              title: "Email",
              value: CONTACT.email,
              href: `mailto:${CONTACT.email}`,
            },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 80}>
              <a
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="card group block p-8 hover:-translate-y-1"
              >
                <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-noir transition-colors duration-300 ease-premium group-hover:bg-or">
                  <item.icon size={18} className="text-or transition-colors duration-300 ease-premium group-hover:text-noir" />
                </div>
                <h3 className="font-display text-lg mb-1">{item.title}</h3>
                <p className="text-sm text-anthracite/55">{item.value}</p>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
