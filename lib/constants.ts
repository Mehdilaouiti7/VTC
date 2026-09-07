export const SITE_NAME = "Chauffeur Privé";

export const CONTACT = {
  phone: process.env.NEXT_PUBLIC_PHONE_NUMBER || "+33 6 00 00 00 00",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "33600000000",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@votredomaine.com",
};

export const NAV_LINKS = [
  { href: "/#accueil", label: "Accueil" },
  { href: "/#services", label: "Services" },
  { href: "/reserver", label: "Réserver" },
  { href: "/devis", label: "Demander un devis" },
  { href: "/#contact", label: "Contact" },
];

export const FOOTER_LINKS = [
  { href: "/#accueil", label: "Accueil" },
  { href: "/#services", label: "Services" },
  { href: "/reserver", label: "Réserver" },
  { href: "/devis", label: "Demander un devis" },
  { href: "/#contact", label: "Contact" },
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/confidentialite", label: "Politique de confidentialité" },
  { href: "/cgv", label: "CGV" },
];

export const SERVICES = [
  {
    key: "transfert_aeroport",
    title: "Transferts aéroport & gare",
    description:
      "Un chauffeur vous attend à l'heure prévue et vous accompagne jusqu'à votre destination.",
    icon: "Plane",
  },
  {
    key: "professionnel",
    title: "Déplacements professionnels",
    description:
      "Une solution confortable et ponctuelle pour vos rendez-vous et déplacements professionnels.",
    icon: "Briefcase",
  },
  {
    key: "prive",
    title: "Trajets privés",
    description:
      "Déplacez-vous librement avec un chauffeur réservé spécialement pour vous.",
    icon: "Car",
  },
  {
    key: "mise_a_disposition",
    title: "Mise à disposition",
    description:
      "Réservez votre chauffeur pendant plusieurs heures ou pour toute une journée.",
    icon: "Clock",
  },
  {
    key: "evenement",
    title: "Événements & occasions spéciales",
    description:
      "Mariages, soirées, événements professionnels et déplacements de groupe.",
    icon: "Sparkles",
  },
] as const;

export const ADVANTAGES = [
  {
    title: "Ponctualité",
    description: "Votre chauffeur est présent avant l'heure prévue, en toutes circonstances.",
    icon: "Clock3",
  },
  {
    title: "Confort",
    description: "Des véhicules haut de gamme, entretenus et pensés pour votre bien-être.",
    icon: "Armchair",
  },
  {
    title: "Confidentialité",
    description: "Une discrétion totale pour vos trajets personnels et professionnels.",
    icon: "ShieldCheck",
  },
  {
    title: "Service personnalisé",
    description: "Un échange direct avec votre chauffeur pour organiser votre trajet sur-mesure.",
    icon: "UserCheck",
  },
];

export const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Vous indiquez votre trajet",
    description: "Départ, destination, date, heure et besoins particuliers.",
  },
  {
    step: "2",
    title: "Nous confirmons votre réservation",
    description: "Le chauffeur vous contacte ou vous recevez la confirmation de votre demande.",
  },
  {
    step: "3",
    title: "Votre chauffeur vient vous chercher",
    description: "À l'heure prévue, avec un service professionnel et personnalisé.",
  },
];
