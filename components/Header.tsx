"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  // Only the homepage has a dark hero directly under the header, so only there
  // can the header start transparent. Every other page has a light background
  // at the top, so the solid dark bar is shown immediately for readability.
  // The mobile menu also forces it solid: otherwise its links would render
  // on top of the transparent hero with no backdrop, illegible against it.
  const solid = !isHome || scrolled || open;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* backdrop-blur lives on this inner bar, not on <header> itself: a filter/
          backdrop-filter on an ancestor becomes the containing block for its
          position:fixed descendants, which would collapse the full-screen mobile
          overlay below down to this bar's own height instead of the viewport. */}
      <div
        className={`transition-all duration-300 ease-premium ${
          solid ? "bg-noir/95 backdrop-blur border-b border-white/5 py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="container-site flex items-center justify-between">
          <Link href="/" className="font-display text-xl tracking-wide text-creme">
            {SITE_NAME}
            <span className="text-or">.</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-9">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-creme/80 tracking-wide hover:text-or transition-colors duration-300 ease-premium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link href="/devis" className="btn-secondary !py-2.5 !px-5 text-xs">
              Demander un devis
            </Link>
            <Link href="/reserver" className="btn-primary !py-2.5 !px-5 text-xs">
              Réserver un trajet
            </Link>
          </div>

          <button
            className="lg:hidden text-creme"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden fixed inset-0 top-[57px] bg-noir overflow-y-auto">
          <div className="container-site mt-5 flex flex-col gap-5 pb-6 step-enter">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-base text-creme/90 tracking-wide"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-2">
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
