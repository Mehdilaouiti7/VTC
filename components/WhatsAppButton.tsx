"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CONTACT } from "@/lib/constants";

export default function WhatsAppButton() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  // The homepage hero is tall enough that a fixed corner button always lands on
  // top of some part of it (buttons, tagline, or the booking card overlapping
  // above the fold). Simplest robust fix: only show the bubble once the user
  // has scrolled past the hero, instead of chasing its layout on every screen size.
  const [pastHero, setPastHero] = useState(!isHome);

  useEffect(() => {
    if (!isHome) {
      setPastHero(true);
      return;
    }
    setPastHero(false);
    const onScroll = () => setPastHero(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  if (!pastHero) return null;

  return (
    <a
      href={`https://wa.me/${CONTACT.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contacter sur WhatsApp"
      className="fixed bottom-5 left-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-soft transition-transform hover:scale-105 sm:hidden"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7 fill-white">
        <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.34.652 4.527 1.79 6.395L3 29l7.83-2.746A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm.005 21.727c-1.984 0-3.85-.55-5.442-1.5l-.39-.23-4.65 1.63 1.556-4.53-.254-.406A9.68 9.68 0 0 1 5.36 15c0-5.323 4.33-9.653 9.65-9.653 5.32 0 9.65 4.33 9.65 9.653 0 5.322-4.33 9.727-9.65 9.727Zm5.29-7.243c-.29-.145-1.716-.847-1.982-.943-.267-.096-.462-.145-.656.145-.194.29-.752.943-.922 1.137-.17.194-.34.218-.63.073-.29-.145-1.223-.451-2.33-1.44-.862-.768-1.444-1.716-1.613-2.006-.17-.29-.018-.447.127-.591.13-.13.29-.34.435-.51.145-.17.194-.29.29-.484.097-.194.048-.363-.024-.508-.073-.145-.656-1.583-.9-2.167-.237-.568-.478-.491-.656-.5l-.559-.01c-.194 0-.508.073-.774.363-.267.29-1.017.994-1.017 2.423s1.041 2.812 1.186 3.006c.145.194 2.05 3.13 4.966 4.39.694.3 1.235.478 1.657.612.696.221 1.33.19 1.83.115.558-.083 1.716-.702 1.958-1.38.242-.678.242-1.259.17-1.38-.073-.121-.267-.194-.557-.34Z" />
      </svg>
    </a>
  );
}
