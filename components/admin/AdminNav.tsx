"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, CalendarCheck, FileText, CalendarX, Wallet } from "lucide-react";
import clsx from "clsx";

const LINKS = [
  { href: "/admin", label: "Tableau de bord", shortLabel: "Accueil", icon: LayoutGrid, countKey: null },
  { href: "/admin/reservations", label: "Réservations", shortLabel: "Résas", icon: CalendarCheck, countKey: "reservations" as const },
  { href: "/admin/devis", label: "Demandes de devis", shortLabel: "Devis", icon: FileText, countKey: "devis" as const },
  { href: "/admin/disponibilites", label: "Disponibilités", shortLabel: "Dispos", icon: CalendarX, countKey: null },
  { href: "/admin/tarifs", label: "Tarifs", shortLabel: "Tarifs", icon: Wallet, countKey: null },
];

export default function AdminNav({
  horizontal = false,
  counts = {},
}: {
  horizontal?: boolean;
  counts?: { reservations?: number; devis?: number };
}) {
  const pathname = usePathname();

  if (horizontal) {
    // Mobile tab bar: a wrapping grid so every item is always fully visible —
    // no horizontal scroll, no risk of a label getting cut off mid-word.
    return (
      <nav className="grid grid-cols-5 gap-[2px]">
        {LINKS.map((link) => {
          const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "flex flex-col items-center gap-1 py-2 text-[10px] font-semibold text-center transition-colors",
                active ? "bg-ink text-bg" : "text-ink/60 hover:bg-accent-100"
              )}
            >
              <link.icon size={18} strokeWidth={1.75} />
              {link.shortLabel}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav>
      {LINKS.map((link) => {
        const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
        const count = link.countKey ? counts[link.countKey] : undefined;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={clsx(
              "flex items-center gap-3 px-5 py-3 text-sm font-semibold whitespace-nowrap transition-colors",
              active ? "bg-ink text-bg" : "text-ink hover:bg-accent-100"
            )}
          >
            <link.icon size={18} strokeWidth={1.75} />
            <span className="flex-1">{link.label}</span>
            {!!count && <span className="font-normal">{count}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
