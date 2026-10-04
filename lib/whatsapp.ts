import type { Booking, QuoteRequest } from "@/lib/types";

// WhatsApp Business Platform (Meta Cloud API). Messages a business sends to a
// customer outside a 24h conversation window MUST use a pre-approved message
// template — free-form text is rejected by the API in that case. The four
// templates below must be created (and approved) in Meta Business Manager,
// in French, with the exact number of {{n}} body variables listed here. The
// names must match WHATSAPP_TEMPLATE_* or the defaults below:
//
//   reservation_recue    (4 vars) "Bonjour {{1}}, votre demande de réservation
//     pour le {{2}} à {{3}} a bien été reçue. Trajet : {{4}}. Votre chauffeur
//     vous confirmera rapidement."
//   reservation_confirmee (4 vars) "Bonjour {{1}}, votre réservation du {{2}}
//     à {{3}} est confirmée ! Trajet : {{4}}. À très bientôt."
//   reservation_refusee  (3 vars) "Bonjour {{1}}, nous sommes désolés, votre
//     demande de réservation du {{2}} à {{3}} n'a pas pu être acceptée.
//     Contactez-nous pour en discuter."
//   devis_recu            (1 var) "Bonjour {{1}}, votre demande de devis a
//     bien été reçue. Votre chauffeur reviendra vers vous rapidement avec une
//     proposition personnalisée."
//   devis_traite           (1 var) "Bonjour {{1}}, votre chauffeur a étudié
//     votre demande et revient vers vous directement avec une proposition
//     personnalisée."
//   devis_refuse            (1 var) "Bonjour {{1}}, nous ne sommes
//     malheureusement pas en mesure de répondre à votre demande de devis.
//     N'hésitez pas à nous contacter directement pour en discuter."
//
// Until WHATSAPP_API_TOKEN / WHATSAPP_PHONE_NUMBER_ID are set, every call
// here is a silent no-op — same graceful-degradation pattern as lib/email.ts.

const GRAPH_VERSION = "v21.0";
const LANGUAGE_CODE = "fr";

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

async function sendTemplate(to: string, templateName: string, params: string[]) {
  const token = process.env.WHATSAPP_API_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneNumberId) return;

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: toWhatsAppNumber(to),
          type: "template",
          template: {
            name: templateName,
            language: { code: LANGUAGE_CODE },
            components: [
              { type: "body", parameters: params.map((text) => ({ type: "text", text })) },
            ],
          },
        }),
      }
    );
    if (!res.ok) {
      console.error("Erreur envoi WhatsApp", templateName, await res.text());
    }
  } catch (error) {
    console.error("Erreur envoi WhatsApp", templateName, error);
  }
}

export async function sendBookingReceivedWhatsApp(booking: Booking) {
  await sendTemplate(
    booking.phone,
    process.env.WHATSAPP_TEMPLATE_BOOKING_RECEIVED || "reservation_recue",
    [
      booking.first_name,
      formatDate(booking.date),
      booking.time,
      `${booking.pickup_address} → ${booking.dropoff_address}`,
    ]
  );
}

export async function sendBookingStatusWhatsApp(booking: Booking) {
  if (booking.status === "confirmed") {
    await sendTemplate(
      booking.phone,
      process.env.WHATSAPP_TEMPLATE_BOOKING_CONFIRMED || "reservation_confirmee",
      [
        booking.first_name,
        formatDate(booking.date),
        booking.time,
        `${booking.pickup_address} → ${booking.dropoff_address}`,
      ]
    );
  } else if (booking.status === "refused") {
    await sendTemplate(
      booking.phone,
      process.env.WHATSAPP_TEMPLATE_BOOKING_REFUSED || "reservation_refusee",
      [booking.first_name, formatDate(booking.date), booking.time]
    );
  }
}

export async function sendQuoteReceivedWhatsApp(quote: QuoteRequest) {
  await sendTemplate(
    quote.phone,
    process.env.WHATSAPP_TEMPLATE_QUOTE_RECEIVED || "devis_recu",
    [quote.first_name]
  );
}

export async function sendQuoteStatusWhatsApp(quote: QuoteRequest) {
  if (quote.status === "confirmed") {
    await sendTemplate(
      quote.phone,
      process.env.WHATSAPP_TEMPLATE_QUOTE_PROCESSED || "devis_traite",
      [quote.first_name]
    );
  } else if (quote.status === "refused") {
    await sendTemplate(
      quote.phone,
      process.env.WHATSAPP_TEMPLATE_QUOTE_REFUSED || "devis_refuse",
      [quote.first_name]
    );
  }
}
