import type { Booking, QuoteRequest } from "@/lib/types";
import { SERVICE_LABELS } from "@/lib/types";

// WaSenderAPI (wasenderapi.com) — le chauffeur a déjà un abonnement chez eux.
// Contrairement à l'API officielle Meta (templates pré-approuvés requis pour
// tout message business-initiated), WaSenderAPI envoie du texte libre à
// n'importe quel numéro à tout moment : pas de validation à faire, le
// numéro WhatsApp est simplement relié à leur service (comme WhatsApp Web).
//
// Tant que WASENDER_API_TOKEN n'est pas défini, tout envoi est silencieusement
// ignoré (le site continue de fonctionner normalement) — même principe que
// lib/email.ts.

const WASENDER_ENDPOINT = "https://www.wasenderapi.com/api/send-message";

function formatDate(date: string) {
  return new Date(date + "T00:00:00").toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function toWhatsAppNumber(phone: string) {
  return phone.replace(/[^\d]/g, "");
}

export async function sendWhatsAppText(to: string, text: string) {
  const token = process.env.WASENDER_API_TOKEN;
  if (!token) return;

  try {
    const res = await fetch(WASENDER_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to: toWhatsAppNumber(to), text }),
    });
    if (!res.ok) {
      console.error("Erreur envoi WhatsApp (WaSenderAPI)", await res.text());
    }
  } catch (error) {
    console.error("Erreur envoi WhatsApp (WaSenderAPI)", error);
  }
}

export async function sendBookingReceivedWhatsApp(booking: Booking) {
  await sendWhatsAppText(
    booking.phone,
    `Bonjour ${booking.first_name}, votre demande de réservation a bien été reçue !\n\n` +
      `Trajet : ${booking.pickup_address} → ${booking.dropoff_address}\n` +
      `Date : ${formatDate(booking.date)} à ${booking.time}\n` +
      `Passagers : ${booking.passengers}\n\n` +
      "Votre chauffeur va confirmer votre réservation très prochainement."
  );
}

// Recap envoyé au chauffeur (NOTIFY_ADMIN_WHATSAPP) à chaque nouvelle
// demande — mirrors sendBookingEmails côté email.
export async function sendBookingReceivedDriverWhatsApp(booking: Booking) {
  const driverNumber = process.env.NOTIFY_ADMIN_WHATSAPP;
  if (!driverNumber) return;

  await sendWhatsAppText(
    driverNumber,
    "Nouvelle demande de réservation\n\n" +
      `Client : ${booking.first_name} ${booking.last_name} — ${booking.phone}\n` +
      `Service : ${SERVICE_LABELS[booking.service_type]}\n` +
      `Trajet : ${booking.pickup_address} → ${booking.dropoff_address}\n` +
      `Date : ${formatDate(booking.date)} à ${booking.time}\n` +
      `Passagers : ${booking.passengers}`
  );
}

export async function sendBookingStatusWhatsApp(booking: Booking) {
  if (booking.status === "confirmed") {
    await sendWhatsAppText(
      booking.phone,
      `Bonjour ${booking.first_name}, votre réservation du ${formatDate(booking.date)} à ${booking.time} est confirmée !\n` +
        `Trajet : ${booking.pickup_address} → ${booking.dropoff_address}\n\n` +
        "À très bientôt."
    );
  } else if (booking.status === "refused") {
    await sendWhatsAppText(
      booking.phone,
      `Bonjour ${booking.first_name}, nous sommes désolés, votre demande de réservation du ${formatDate(booking.date)} à ${booking.time} n'a pas pu être acceptée. Contactez-nous pour en discuter.`
    );
  }
}

export async function sendQuoteReceivedWhatsApp(quote: QuoteRequest) {
  await sendWhatsAppText(
    quote.phone,
    `Bonjour ${quote.first_name}, votre demande de devis a bien été reçue. Votre chauffeur reviendra vers vous rapidement avec une proposition personnalisée.`
  );
}

export async function sendQuoteStatusWhatsApp(quote: QuoteRequest) {
  if (quote.status === "confirmed") {
    await sendWhatsAppText(
      quote.phone,
      `Bonjour ${quote.first_name}, votre chauffeur a étudié votre demande et revient vers vous directement avec une proposition personnalisée.`
    );
  } else if (quote.status === "refused") {
    await sendWhatsAppText(
      quote.phone,
      `Bonjour ${quote.first_name}, nous ne sommes malheureusement pas en mesure de répondre à votre demande de devis. N'hésitez pas à nous contacter directement pour en discuter.`
    );
  }
}
