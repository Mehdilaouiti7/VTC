import { createClient } from "@/lib/supabase/server";
import { estimatePrice } from "@/lib/pricing";
import { sendBookingEmails } from "@/lib/email";
import { sendBookingReceivedWhatsApp, sendBookingReceivedDriverWhatsApp } from "@/lib/whatsapp";
import type { Booking, PricingRule } from "@/lib/types";
import type { BookingInput } from "@/lib/validation";

// Shared by the public booking form (app/api/bookings/route.ts) and the
// WhatsApp booking bot (app/api/whatsapp/webhook/route.ts) so both paths
// insert, price and notify identically instead of drifting apart.
export async function createBooking(
  input: BookingInput
): Promise<{ booking: Booking } | { error: string }> {
  const supabase = createClient();

  let estimated_price = input.estimated_price ?? null;
  if (estimated_price == null) {
    const { data: rules } = await supabase.from("pricing_rules").select("*");
    estimated_price = estimatePrice((rules as PricingRule[]) || [], {
      serviceType: input.service_type,
      tripType: input.trip_type,
      durationHours: input.duration_hours ?? null,
      passengers: input.passengers,
      stopsCount: input.stops.length,
    });
  }

  const { data, error } = await supabase
    .from("bookings")
    .insert({
      ...input,
      estimated_price,
      return_date: input.return_date || null,
      return_time: input.return_time || null,
      duration_hours: input.duration_hours || null,
      special_request: input.special_request || null,
      comment: input.comment || null,
    })
    .select()
    .single();

  if (error || !data) {
    console.error("Erreur création réservation", error);
    return { error: "Impossible de créer la réservation" };
  }

  const booking = data as Booking;
  sendBookingEmails(booking).catch((err) => console.error("Erreur envoi email réservation", err));
  sendBookingReceivedWhatsApp(booking).catch((err) =>
    console.error("Erreur envoi WhatsApp réservation (client)", err)
  );
  sendBookingReceivedDriverWhatsApp(booking).catch((err) =>
    console.error("Erreur envoi WhatsApp réservation (chauffeur)", err)
  );

  return { booking };
}
