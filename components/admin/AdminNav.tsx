"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarClock, FileText, CalendarX, Wallet } from "lucide-react";
import clsx from "clsx";

const LINKS = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/reservations", label: "Réservations", icon: CalendarClock },
  { href: "/admin/devis", label: "Demandes de devis", icon: FileText },
  { href: "/admin/disponibilites", label: "Disponibilités", icon: CalendarX },
  { href: "/admin/tarifs", label: "Tarifs", icon: Wallet },
];

export default function AdminNav({ horizontal = false }: { horizontal?: boolean }) {
  const pathname = usePathname();

  return (
    <nav className={horizontal ? "flex gap-1 min-w-max" : "space-y-1"}>
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
            <link.icon size={16} />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
