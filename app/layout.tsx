import type { Metadata } from "next";
import { Space_Grotesk, Outfit } from "next/font/google";
import "./globals.css";

// "Midnight Galaxy" theme (Anthropic theme-factory skill) pairs a single
// modern sans-serif family across headers and body — Space Grotesk stands in
// for the theme's system "FreeSans Bold" spec with a more distinctive,
// web-native display weight for headings.
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Chauffeur Privé — Transferts et trajets privés sur réservation",
    template: "%s | Chauffeur Privé",
  },
  description:
    "Chauffeur privé indépendant : transferts aéroport, déplacements professionnels, trajets privés et mise à disposition. Réservation directe, sans intermédiaire.",
  keywords: [
    "chauffeur privé",
    "VTC indépendant",
    "transfert aéroport",
    "mise à disposition chauffeur",
    "chauffeur professionnel",
    "réservation chauffeur",
  ],
  openGraph: {
    title: "Chauffeur Privé — Votre chauffeur, directement avec vous",
    description:
      "Transferts aéroport, déplacements professionnels, trajets privés et mise à disposition sur réservation directe.",
    type: "website",
    locale: "fr_FR",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${spaceGrotesk.variable} ${outfit.variable}`}>
      <body>{children}</body>
    </html>
  );
}
