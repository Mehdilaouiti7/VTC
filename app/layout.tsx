import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
    <html lang="fr" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
