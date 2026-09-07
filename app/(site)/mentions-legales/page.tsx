import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { CONTACT } from "@/lib/constants";

export const metadata: Metadata = { title: "Mentions légales" };

export default function MentionsLegales() {
  return (
    <LegalPage title="Mentions légales">
      <p>
        <em>
          Les informations ci-dessous sont fournies à titre indicatif et doivent être complétées
          avec les informations légales exactes de l&apos;entreprise (SIRET, forme juridique,
          numéro de licence VTC, assurance, etc.) avant la mise en ligne définitive du site.
        </em>
      </p>

      <h2>Éditeur du site</h2>
      <p>
        Le présent site est édité par un chauffeur privé indépendant exerçant une activité de
        transport de personnes avec chauffeur (VTC), immatriculé au registre des VTC.
        <br />
        Contact : {CONTACT.email} — {CONTACT.phone}
      </p>

      <h2>Activité</h2>
      <p>
        Transport particulier de personnes avec chauffeur, exercé conformément aux dispositions du
        code des transports relatives aux exploitants de VTC. Carte professionnelle et licence VTC
        en cours de validité, présentées sur simple demande.
      </p>

      <h2>Hébergement</h2>
      <p>
        Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.
        Les données sont stockées par Supabase Inc.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L&apos;ensemble des contenus présents sur ce site (textes, images, logo) est protégé par le
        droit de la propriété intellectuelle. Toute reproduction sans autorisation est interdite.
      </p>

      <h2>Responsabilité</h2>
      <p>
        Les informations diffusées sur ce site le sont à titre indicatif. Les estimations de prix
        n&apos;engagent pas contractuellement le chauffeur avant confirmation écrite de la
        réservation.
      </p>
    </LegalPage>
  );
}
