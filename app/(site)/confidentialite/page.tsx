import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { CONTACT } from "@/lib/constants";

export const metadata: Metadata = { title: "Politique de confidentialité" };

export default function Confidentialite() {
  return (
    <LegalPage title="Politique de confidentialité">
      <p>
        Cette politique explique comment vos données personnelles sont collectées et utilisées
        lorsque vous utilisez ce site pour réserver un trajet ou demander un devis.
      </p>

      <h2>Données collectées</h2>
      <p>
        Lors d&apos;une réservation ou d&apos;une demande de devis, nous collectons : votre nom,
        prénom, numéro de téléphone, adresse email, adresses de prise en charge et de destination,
        ainsi que les informations relatives à votre trajet (date, heure, nombre de passagers,
        demandes particulières).
      </p>

      <h2>Finalité du traitement</h2>
      <p>
        Ces données sont utilisées exclusivement pour traiter votre demande de réservation, vous
        contacter, organiser votre trajet et vous envoyer les confirmations et rappels associés.
      </p>

      <h2>Conservation des données</h2>
      <p>
        Vos données sont conservées pendant la durée nécessaire au traitement de votre demande et
        à des fins de facturation, conformément aux obligations légales en vigueur.
      </p>

      <h2>Hébergement et sécurité</h2>
      <p>
        Vos données sont stockées de manière sécurisée sur l&apos;infrastructure Supabase, avec
        accès restreint au chauffeur exploitant ce service.
      </p>

      <h2>Vos droits</h2>
      <p>
        Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d&apos;un
        droit d&apos;accès, de rectification et de suppression de vos données. Pour exercer ce droit,
        contactez-nous à l&apos;adresse {CONTACT.email}.
      </p>
    </LegalPage>
  );
}
