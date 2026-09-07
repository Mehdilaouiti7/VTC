import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-noir text-creme flex items-center justify-center px-5">
      <div className="text-center max-w-md">
        <div className="font-display text-2xl mb-10">
          {SITE_NAME}
          <span className="text-or">.</span>
        </div>
        <p className="eyebrow justify-center mb-4">Erreur 404</p>
        <h1 className="heading-lg mb-5">Cette route n&apos;existe pas.</h1>
        <p className="text-creme/55 mb-10 leading-relaxed">
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
