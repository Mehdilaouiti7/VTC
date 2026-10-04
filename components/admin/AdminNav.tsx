"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SquaresFour as LayoutDashboard, CalendarCheck as CalendarClock, FileText, CalendarX, Wallet } from "@phosphor-icons/react/dist/ssr";
import clsx from "clsx";

const LINKS = [
  { href: "/admin", label: "Tableau de bord", shortLabel: "Accueil", icon: LayoutDashboard },
  { href: "/admin/reservations", label: "Réservations", shortLabel: "Résas", icon: CalendarClock },
  { href: "/admin/devis", label: "Demandes de devis", shortLabel: "Devis", icon: FileText },
  { href: "/admin/disponibilites", label: "Disponibilités", shortLabel: "Dispos", icon: CalendarX },
  { href: "/admin/tarifs", label: "Tarifs", shortLabel: "Tarifs", icon: Wallet },
];

export default function AdminNav({ horizontal = false }: { horizontal?: boolean }) {
  const pathname = usePathname();

  if (horizontal) {
    // Mobile tab bar: a wrapping grid so every item is always fully visible —
    // no horizontal scroll, no risk of a label getting cut off mid-word.
    return (
      <nav className="grid grid-cols-5 gap-1">
        {LINKS.map((link) => {
          const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "flex flex-col items-center gap-1 rounded-lg py-2 text-[10px] text-center transition-colors",
                active ? "bg-or/15 text-or" : "text-creme/55 hover:bg-white/5 hover:text-creme"
              )}
            >
              <link.icon weight="light" size={18} />
              {link.shortLabel}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="space-y-1">
      {LINKS.map((link) => {
        const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={clsx(
              "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm whitespace-nowrap transition-colors",
              active ? "bg-or/15 text-or" : "text-creme/60 hover:bg-white/5 hover:text-creme"
            )}
          >
            <link.icon weight="light" size={16} />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
