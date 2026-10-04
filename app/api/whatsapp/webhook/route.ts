import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createBooking } from "@/lib/bookings";
import { sendWhatsAppText } from "@/lib/whatsapp";
import { bookingSchema } from "@/lib/validation";
import { SERVICE_LABELS } from "@/lib/types";
import type { ServiceType } from "@/lib/types";

// WhatsApp booking bot: a plain-text conversation that walks a customer
// through the same fields as the website's booking form, then calls the
// same createBooking() used by /api/bookings. Conversation progress is kept
// in public.whatsapp_sessions, keyed by the customer's WhatsApp number.
//
// Meta setup needed before this does anything (see .env.example) — note
// that the booking/driver notifications in lib/whatsapp.ts no longer need
// this, they use WaSenderAPI (WASENDER_API_TOKEN) instead:
//   - WHATSAPP_VERIFY_TOKEN: any string you choose, entered in Meta's
//     webhook configuration screen alongside this route's URL
//   - In Meta's app dashboard, point the webhook at
//     https://<your-domain>/api/whatsapp/webhook and subscribe to the
//     "messages" field.

const SERVICE_MENU: { key: ServiceType; label: string }[] = [
  { key: "transfert_aeroport", label: SERVICE_LABELS.transfert_aeroport },
  { key: "transfert_gare", label: SERVICE_LABELS.transfert_gare },
  { key: "professionnel", label: SERVICE_LABELS.professionnel },
  { key: "prive", label: SERVICE_LABELS.prive },
  { key: "mise_a_disposition", label: SERVICE_LABELS.mise_a_disposition },
  { key: "evenement", label: SERVICE_LABELS.evenement },
];

function serviceMenuText() {
  return (
    "Quel type de trajet souhaitez-vous ?\n\n" +
    SERVICE_MENU.map((s, i) => `${i + 1}. ${s.label}`).join("\n") +
    "\n\nRépondez avec le numéro correspondant."
  );
}

function parseDate(text: string): string | null {
  const m = text.trim().match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})$/);
  if (!m) return null;
  const day = Number(m[1]);
  const month = Number(m[2]);
  const year = Number(m[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const date = new Date(year, month - 1, day);
  if (date.getMonth() !== month - 1) return null;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function parseTime(text: string): string | null {
  const m = text.trim().match(/^(\d{1,2})[h:](\d{2})?$/i);
  if (!m) return null;
  const hour = Number(m[1]);
  const minute = m[2] ? Number(m[2]) : 0;
  if (hour > 23 || minute > 59) return null;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

const RESET_WORDS = ["annuler", "stop", "recommencer"];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }
  return NextResponse.json({ error: "Verification failed" }, { status: 403 });
}

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const message = body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!message) {
      // Delivery/read status callbacks also land here — nothing to do.
      return NextResponse.json({ ok: true });
    }

    const from: string = message.from;
    const text: string = message.text?.body?.trim() || "";
    if (!text) {
      await sendWhatsAppText(from, "Je ne gère que les messages texte pour le moment. Écrivez-moi votre demande.");
      return NextResponse.json({ ok: true });
    }

    await handleMessage(from, text);
  } catch (error) {
    console.error("Erreur webhook WhatsApp", error);
  }

  return NextResponse.json({ ok: true });
}

async function handleMessage(phone: string, text: string) {
  const supabase = createClient();
  const lower = text.trim().toLowerCase();

  if (RESET_WORDS.includes(lower)) {
    await supabase.from("whatsapp_sessions").delete().eq("phone", phone);
    await sendWhatsAppText(phone, "Demande annulée. Écrivez-moi à nouveau quand vous voulez réserver un trajet.");
    return;
  }

  const { data: existing, error: readError } = await supabase
    .from("whatsapp_sessions")
    .select("*")
    .eq("phone", phone)
    .maybeSingle();

  if (readError) {
    console.error("Erreur lecture session WhatsApp", readError);
    await sendWhatsAppText(phone, "Désolé, un problème technique est survenu. Réessayez dans quelques instants.");
    return;
  }

  const step: string = existing?.step ?? "start";
  const data: Record<string, string | number> = existing?.data ?? {};

  async function save(nextStep: string) {
    const { error } = await supabase
      .from("whatsapp_sessions")
      .upsert({ phone, step: nextStep, data, updated_at: new Date().toISOString() });
    if (error) console.error("Erreur sauvegarde session WhatsApp", error);
  }

  switch (step) {
    case "start": {
      await sendWhatsAppText(phone, "Bonjour ! Je suis l'assistant de réservation.\n\n" + serviceMenuText());
      await save("service");
      return;
    }

    case "service": {
      const chosen = SERVICE_MENU[Number(text.trim()) - 1];
      if (!chosen) {
        await sendWhatsAppText(phone, "Merci de répondre avec un numéro entre 1 et 6.\n\n" + serviceMenuText());
        return;
      }
      data.service_type = chosen.key;
      await sendWhatsAppText(phone, "Quelle est l'adresse de départ ?");
      await save("pickup");
      return;
    }

    case "pickup": {
      data.pickup_address = text;
      await sendWhatsAppText(phone, "Quelle est l'adresse de destination ?");
      await save("dropoff");
      return;
    }

    case "dropoff": {
      data.dropoff_address = text;
      await sendWhatsAppText(phone, "Quelle date ? (format JJ/MM/AAAA)");
      await save("date");
      return;
    }

    case "date": {
      const date = parseDate(text);
      if (!date) {
        await sendWhatsAppText(phone, "Format non reconnu. Merci d'indiquer la date au format JJ/MM/AAAA (ex: 25/12/2026).");
        return;
      }
      data.date = date;
      await sendWhatsAppText(phone, "À quelle heure ? (format HH:MM, ex: 14:30)");
      await save("time");
      return;
    }

    case "time": {
      const time = parseTime(text);
      if (!time) {
        await sendWhatsAppText(phone, "Format non reconnu. Merci d'indiquer l'heure au format HH:MM (ex: 14:30).");
        return;
      }
      data.time = time;
      await sendWhatsAppText(phone, "Combien de passagers ?");
      await save("passengers");
      return;
    }

    case "passengers": {
      const n = Number(text.trim());
      if (!Number.isInteger(n) || n < 1 || n > 50) {
        await sendWhatsAppText(phone, "Merci d'indiquer un nombre de passagers valide (entre 1 et 50).");
        return;
      }
      data.passengers = n;
      await sendWhatsAppText(phone, "Quel est votre prénom ?");
      await save("first_name");
      return;
    }

    case "first_name": {
      data.first_name = text;
      await sendWhatsAppText(phone, "Et votre nom de famille ?");
      await save("last_name");
      return;
    }

    case "last_name": {
      data.last_name = text;
      await sendWhatsAppText(phone, "Quel est votre email ? (pour la confirmation)");
      await save("email");
      return;
    }

    case "email": {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text.trim())) {
        await sendWhatsAppText(phone, "Cet email ne semble pas valide. Merci de le réécrire.");
        return;
      }
      data.email = text.trim();

      await sendWhatsAppText(
        phone,
        "Voici le récapitulatif de votre demande :\n\n" +
          `Service : ${SERVICE_LABELS[data.service_type as ServiceType]}\n` +
          `Départ : ${data.pickup_address}\n` +
          `Destination : ${data.dropoff_address}\n` +
          `Date : ${data.date} à ${data.time}\n` +
          `Passagers : ${data.passengers}\n` +
          `Nom : ${data.first_name} ${data.last_name}\n` +
          `Email : ${data.email}\n\n` +
          "Répondez OUI pour confirmer, ou ANNULER pour tout arrêter."
      );
      await save("confirm");
      return;
    }

    case "confirm": {
      if (lower !== "oui" && lower !== "1") {
        await sendWhatsAppText(phone, "Répondez OUI pour confirmer la réservation, ou ANNULER pour arrêter.");
        return;
      }

      const parsed = bookingSchema.safeParse({
        service_type: data.service_type,
        trip_type: "aller_simple",
        pickup_address: data.pickup_address,
        dropoff_address: data.dropoff_address,
        stops: [],
        date: data.date,
        time: data.time,
        passengers: data.passengers,
        luggage: 1,
        child_seat: false,
        first_name: data.first_name,
        last_name: data.last_name,
        phone,
        email: data.email,
      });

      if (!parsed.success) {
        console.error("Bot WhatsApp: données invalides", parsed.error.flatten());
        await sendWhatsAppText(phone, "Une information est invalide, désolé. Écrivez ANNULER puis recommencez votre demande.");
        return;
      }

      const result = await createBooking(parsed.data);
      await supabase.from("whatsapp_sessions").delete().eq("phone", phone);

      if ("error" in result) {
        await sendWhatsAppText(phone, "Désolé, une erreur est survenue. Réessayez dans quelques minutes ou contactez-nous directement.");
        return;
      }

      await sendWhatsAppText(
        phone,
        `Votre demande de réservation est enregistrée, ${data.first_name} ! Votre chauffeur va la confirmer très prochainement. Vous recevrez un message de confirmation.`
      );
      return;
    }

    default: {
      await supabase.from("whatsapp_sessions").delete().eq("phone", phone);
      await sendWhatsAppText(phone, "Bonjour !\n\n" + serviceMenuText());
      await save("service");
    }
  }
}
