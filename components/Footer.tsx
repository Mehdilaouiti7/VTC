import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { CONTACT, FOOTER_LINKS, SITE_NAME } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-noir text-creme/70">
      <div className="container-site py-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="font-display text-2xl text-creme mb-4">
            {SITE_NAME}
            <span className="text-or">.</span>
          </div>
          <p className="text-sm leading-relaxed max-w-xs">
            Chauffeur privé indépendant. Réservation directe, sans intermédiaire, pour vos
            transferts et trajets sur-mesure.
          </p>
        </div>

        <div>
          <h4 className="text-creme text-sm uppercase tracking-widest mb-5">Navigation</h4>
          <ul className="space-y-3 text-sm">
            {FOOTER_LINKS.slice(0, 5).map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-or transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-creme text-sm uppercase tracking-widest mb-5">Informations</h4>
          <ul className="space-y-3 text-sm">
            {FOOTER_LINKS.slice(5).map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-or transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-creme text-sm uppercase tracking-widest mb-5">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Phone size={15} className="text-or" />
              <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} className="hover:text-or">
                {CONTACT.phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={15} className="text-or" />
              <a href={`mailto:${CONTACT.email}`} className="hover:text-or">
                {CONTACT.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={15} className="text-or" />
              <span>Disponible sur réservation</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site py-6 text-xs text-creme/40 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} {SITE_NAME}. Tous droits réservés.</span>
          <span>Chauffeur privé indépendant — service sur réservation directe.</span>
        </div>
      </div>
    </footer>
  );
}
