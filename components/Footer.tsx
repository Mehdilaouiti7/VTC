import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { CONTACT, FOOTER_LINKS, SITE_NAME } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-ink text-neutral-300 overflow-hidden">
      <div className="container-site grid gap-12 pt-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="font-display text-[22px] font-extrabold text-bg mb-4">
            {SITE_NAME}
            <span className="text-accent">.</span>
          </div>
          <p className="text-sm leading-relaxed max-w-xs">
            Chauffeur privé indépendant. Réservation directe, sans intermédiaire, pour vos
            transferts et trajets sur-mesure.
          </p>
        </div>

        <div>
          <h4 className="text-bg text-[11px] font-semibold uppercase tracking-[0.1em] mb-5">
            Navigation
          </h4>
          <ul className="space-y-3 text-sm">
            {FOOTER_LINKS.slice(0, 5).map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-accent transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-bg text-[11px] font-semibold uppercase tracking-[0.1em] mb-5">
            Informations
          </h4>
          <ul className="space-y-3 text-sm">
            {FOOTER_LINKS.slice(5).map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-accent transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-bg text-[11px] font-semibold uppercase tracking-[0.1em] mb-5">
            Contact
          </h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Phone size={15} strokeWidth={2} className="text-accent" />
              <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} className="hover:text-accent">
                {CONTACT.phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={15} strokeWidth={2} className="text-accent" />
              <a href={`mailto:${CONTACT.email}`} className="hover:text-accent">
                {CONTACT.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={15} strokeWidth={2} className="text-accent" />
              <span>Disponible sur réservation</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t-2 border-neutral-700 mt-14">
        <div className="container-site py-6 text-xs flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} {SITE_NAME}. Tous droits réservés.</span>
          <span>Chauffeur privé indépendant — service sur réservation directe.</span>
        </div>
      </div>

      <div
        className="select-none font-display font-extrabold text-bg whitespace-nowrap overflow-hidden"
        style={{
          fontSize: "clamp(64px, 13vw, 200px)",
          letterSpacing: "-0.06em",
          lineHeight: 0.8,
          transform: "translateY(10%)",
        }}
        aria-hidden="true"
      >
        Chauffeur Privé<span className="text-accent">.</span>
      </div>
    </footer>
  );
}
