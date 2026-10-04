import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ink text-bg flex items-center px-6">
      <div className="max-w-md">
        <div className="font-display text-2xl font-extrabold mb-10">
          {SITE_NAME}
          <span className="text-accent">.</span>
        </div>
        <p className="eyebrow !text-accent mb-4">Erreur 404</p>
        <h1 className="heading-lg mb-5">Cette route n&apos;existe pas.</h1>
        <p className="text-bg/70 mb-10 leading-relaxed">
          La page que vous cherchez a été déplacée ou n&apos;a jamais existé. Retournez à
          l&apos;accueil pour organiser votre trajet.
        </p>
        <Link href="/" className="btn-primary">
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
