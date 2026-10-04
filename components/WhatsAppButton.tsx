"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
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
      className="fixed bottom-5 left-5 z-50 flex h-14 w-14 items-center justify-center bg-ink transition-colors hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:hidden"
    >
      <MessageCircle size={26} strokeWidth={2} className="text-bg" />
    </a>
  );
}
