"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:pt-6">
      <div
        className={`relative z-[60] w-full max-w-5xl rounded-full border border-white/10 bg-noir/80 backdrop-blur-xl transition-shadow duration-500 ease-premium ${
          scrolled ? "shadow-deep" : "shadow-soft"
        }`}
        style={{ boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center justify-between gap-4 pl-5 pr-2 py-2 sm:pl-6 sm:pr-2.5 sm:py-2.5">
          <Link href="/" className="font-display text-lg sm:text-xl tracking-wide text-creme shrink-0">
            {SITE_NAME}
            <span className="text-or">.</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-creme/75 tracking-wide hover:text-or transition-colors duration-300 ease-premium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <Link
              href="/devis"
              className="rounded-full px-4 py-2 text-xs font-medium tracking-wide text-creme/75 hover:text-creme hover:bg-white/5 transition-colors duration-300 ease-premium"
            >
              Demander un devis
            </Link>
            <Link
              href="/reserver"
              className="group flex items-center gap-2 rounded-full bg-or py-1.5 pl-4 pr-1.5 text-xs font-medium tracking-wide text-noir transition-transform duration-300 ease-premium hover:-translate-y-0.5 active:scale-[0.97]"
            >
              Réserver un trajet
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-noir/10 transition-transform duration-300 ease-premium group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowUpRight weight="bold" size={13} />
              </span>
            </Link>
          </div>

          {/* Custom morphing hamburger: two bars rotate into an X instead of swapping icons. */}
          <button
            className="lg:hidden relative flex h-9 w-9 shrink-0 items-center justify-center"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={open}
          >
            <span
              className={`absolute h-[1.5px] w-5 bg-creme transition-transform duration-500 ease-premium ${
                open ? "rotate-45" : "-translate-y-[5px]"
              }`}
            />
            <span
              className={`absolute h-[1.5px] w-5 bg-creme transition-transform duration-500 ease-premium ${
                open ? "-rotate-45" : "translate-y-[5px]"
              }`}
            />
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden fixed inset-0 z-40 bg-noir/95 backdrop-blur-2xl">
          <div className="container-site flex h-full flex-col justify-center gap-7 pb-16">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="step-enter font-display text-3xl text-creme/90"
                style={{ animationDelay: `${i * 70 + 80}ms` }}
              >
                {link.label}
              </Link>
            ))}
            <div
              className="step-enter flex flex-col gap-3 pt-4 max-w-xs"
              style={{ animationDelay: `${NAV_LINKS.length * 70 + 120}ms` }}
            >
              <Link href="/devis" className="btn-secondary" onClick={() => setOpen(false)}>
                Demander un devis
              </Link>
              <Link href="/reserver" className="btn-primary" onClick={() => setOpen(false)}>
                Réserver un trajet
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
