import { Resend } from "resend";
import type { Booking, QuoteRequest } from "@/lib/types";
import { SERVICE_LABELS } from "@/lib/types";

const FROM = process.env.NOTIFY_FROM_EMAIL || "Réservations <onboarding@resend.dev>";
const ADMIN_EMAIL = process.env.NOTIFY_ADMIN_EMAIL;

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

function formatDate(date: string) {
  return new Date(date + "T00:00:00").toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function sendBookingEmails(booking: Booking) {
  const resend = getResend();
  if (!resend) return;

  const tripSummary = `${booking.pickup_address} → ${booking.dropoff_address}`;
  const priceText = booking.estimated_price
    ? `${booking.estimated_price} € (estimation)`
    : "Sur devis";

  try {
    if (ADMIN_EMAIL) {
      await resend.emails.send({
        from: FROM,
        to: ADMIN_EMAIL,
        subject: `Nouvelle demande de réservation — ${booking.first_name} ${booking.last_name}`,
        html: `
          <h2>Nouvelle demande de réservation</h2>
          <p><strong>Service :</strong> ${SERVICE_LABELS[booking.service_type]}</p>
          <p><strong>Trajet :</strong> ${tripSummary}</p>
          <p><strong>Date :</strong> ${formatDate(booking.date)} à ${booking.time}</p>
          <p><strong>Passagers :</strong> ${booking.passengers} — <strong>Bagages :</strong> ${booking.luggage}</p>
          <p><strong>Client :</strong> ${booking.first_name} ${booking.last_name} — ${booking.phone} — ${booking.email}</p>
          <p><strong>Prix estimé :</strong> ${priceText}</p>
          ${booking.comment ? `<p><strong>Commentaire :</strong> ${booking.comment}</p>` : ""}
          <p>Connectez-vous à votre espace administrateur pour confirmer ou refuser cette demande.</p>
        `,
      });
    }

    await resend.emails.send({
      from: FROM,
      to: booking.email,
      subject: "Votre demande de réservation a bien été reçue",
      html: `
        <h2>Merci ${booking.first_name}, votre demande a bien été reçue.</h2>
        <p>Voici le récapitulatif de votre trajet :</p>
        <ul>
          <li><strong>Trajet :</strong> ${tripSummary}</li>
          <li><strong>Date :</strong> ${formatDate(booking.date)} à ${booking.time}</li>
          <li><strong>Passagers :</strong> ${booking.passengers}</li>
          <li><strong>Prix estimé :</strong> ${priceText}</li>
        </ul>
        <p>Votre chauffeur va confirmer votre réservation très prochainement. Vous recevrez un email de confirmation dès validation.</p>
        <p>Pour toute question, vous pouvez nous contacter directement par téléphone ou WhatsApp.</p>
      `,
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi des emails de réservation", error);
  }
}

export async function sendBookingStatusEmail(booking: Booking) {
  const resend = getResend();
  if (!resend) return;

  const statusText =
    booking.status === "confirmed"
      ? "confirmée"
      : booking.status === "refused"
      ? "refusée"
      : booking.status;

  try {
    await resend.emails.send({
      from: FROM,
      to: booking.email,
      subject: `Votre réservation est ${statusText}`,
      html: `
        <h2>Votre réservation est ${statusText}</h2>
        <p>Bonjour ${booking.first_name},</p>
        <p>Votre trajet du ${formatDate(booking.date)} à ${booking.time} (${booking.pickup_address} → ${booking.dropoff_address}) est désormais <strong>${statusText}</strong>.</p>
        ${
          booking.status === "confirmed"
            ? `<p>Votre chauffeur vous contactera avant le trajet. Prix : ${
                booking.final_price ?? booking.estimated_price ?? "à confirmer"
              } €.</p>`
            : ""
        }
        <p>Pour toute question, contactez-nous directement.</p>
      `,
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de statut", error);
  }
}

export async function sendQuoteEmails(quote: QuoteRequest) {
  const resend = getResend();
  if (!resend) return;

  try {
    if (ADMIN_EMAIL) {
      await resend.emails.send({
        from: FROM,
        to: ADMIN_EMAIL,
        subject: `Nouvelle demande de devis — ${quote.first_name} ${quote.last_name}`,
        html: `
          <h2>Nouvelle demande de devis personnalisée</h2>
          <p><strong>Client :</strong> ${quote.first_name} ${quote.last_name} — ${quote.phone} — ${quote.email}</p>
          ${quote.preferred_date ? `<p><strong>Date souhaitée :</strong> ${quote.preferred_date} ${quote.preferred_time ?? ""}</p>` : ""}
          <p><strong>Détails :</strong></p>
          <p>${quote.request_details.replace(/\n/g, "<br/>")}</p>
        `,
      });
    }

    await resend.emails.send({
      from: FROM,
      to: quote.email,
      subject: "Votre demande de devis a bien été reçue",
      html: `
        <h2>Merci ${quote.first_name}, votre demande a bien été reçue.</h2>
        <p>Votre chauffeur va étudier votre demande personnalisée et reviendra vers vous rapidement avec une proposition adaptée.</p>
      `,
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi des emails de devis", error);
  }
}
