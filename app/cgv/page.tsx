import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = { title: "Conditions générales de vente" };

export default function CGV() {
  return (
    <LegalPage title="Conditions générales de vente">
      <h2>Article 1 — Objet</h2>
      <p>
        Les présentes conditions régissent les prestations de transport de personnes avec chauffeur
        proposées via ce site, entre le chauffeur exploitant et le client ayant effectué une
        réservation.
      </p>

      <h2>Article 2 — Réservation</h2>
      <p>
        Toute réservation effectuée via le formulaire en ligne constitue une demande. Elle n&apos;est
        confirmée qu&apos;après validation explicite par le chauffeur, communiquée par email ou par
        téléphone.
      </p>

      <h2>Article 3 — Tarifs</h2>
      <p>
        Les prix affichés lors de la réservation sont des estimations indicatives. Le prix final
        est confirmé par le chauffeur en fonction des conditions réelles du trajet (distance,
        durée, éventuels arrêts supplémentaires). Pour les demandes complexes, un devis
        personnalisé est établi avant confirmation.
      </p>

      <h2>Article 4 — Annulation</h2>
      <p>
        Le client peut annuler sa réservation gratuitement jusqu&apos;à 24 heures avant l&apos;heure
        prévue du trajet. Passé ce délai, des frais d&apos;annulation peuvent s&apos;appliquer, sauf
        cas de force majeure.
      </p>

      <h2>Article 5 — Responsabilité</h2>
      <p>
        Le chauffeur s&apos;engage à assurer la prestation avec ponctualité et professionnalisme.
        Il ne saurait être tenu responsable des retards liés à des circonstances extérieures
        (conditions de circulation, intempéries, cas de force majeure).
      </p>

      <h2>Article 6 — Paiement</h2>
      <p>
        Le règlement s&apos;effectue selon les modalités convenues avec le chauffeur lors de la
        confirmation de la réservation.
      </p>

      <h2>Article 7 — Litiges</h2>
      <p>
        En cas de litige, une solution amiable sera recherchée en priorité. À défaut, les
        tribunaux compétents seront ceux du lieu d&apos;établissement du chauffeur.
      </p>
    </LegalPage>
  );
}
