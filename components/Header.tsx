"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full bg-bg border-b-2 border-divider">
      <div className="container-site flex flex-wrap items-center gap-8 py-3.5">
        <Link
          href="/"
          className="mr-auto shrink-0 font-display text-xl font-extrabold tracking-[0.02em] text-ink"
        >
          {SITE_NAME}
          <span className="text-accent">.</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-ink hover:text-accent transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link href="/devis" className="btn-secondary">
            Demander un devis
          </Link>
          <Link href="/reserver" className="btn-primary">
            Réserver un trajet
            <ArrowUpRight size={16} strokeWidth={2} />
          </Link>
        </div>

        {/* Square hamburger bars, no rounded corners. */}
        <button
          className="lg:hidden relative flex h-9 w-9 shrink-0 items-center justify-center"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
          aria-expanded={open}
        >
          <span
            className={`absolute h-0.5 w-5 bg-ink transition-transform duration-300 ${
              open ? "rotate-45" : "-translate-y-[5px]"
            }`}
          />
          <span
            className={`absolute h-0.5 w-5 bg-ink transition-transform duration-300 ${
              open ? "-rotate-45" : "translate-y-[5px]"
            }`}
          />
        </button>
      </div>

      {open && (
        <div className="lg:hidden fixed inset-0 top-[57px] z-40 bg-bg overflow-y-auto">
          <div className="container-site flex flex-col py-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-display text-2xl font-extrabold text-ink py-4 border-b border-divider"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-6">
              <Link href="/devis" className="btn-secondary" onClick={() => setOpen(false)}>
                Demander un devis
              </Link>
              <Link href="/reserver" className="btn-primary" onClick={() => setOpen(false)}>
                Réserver un trajet
                <ArrowUpRight size={16} strokeWidth={2} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
