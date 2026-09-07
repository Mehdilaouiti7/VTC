import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { bookingSchema } from "@/lib/validation";
import { sendBookingEmails } from "@/lib/email";
import type { Booking } from "@/lib/types";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = bookingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const supabase = createClient();

  const { data, error } = await supabase
    .from("bookings")
    .insert({
      ...parsed.data,
      return_date: parsed.data.return_date || null,
      return_time: parsed.data.return_time || null,
      duration_hours: parsed.data.duration_hours || null,
      special_request: parsed.data.special_request || null,
      comment: parsed.data.comment || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Erreur création réservation", error);
    return NextResponse.json({ error: "Impossible de créer la réservation" }, { status: 500 });
  }

  sendBookingEmails(data as Booking).catch((err) =>
    console.error("Erreur envoi email réservation", err)
  );

  return NextResponse.json({ booking: data }, { status: 201 });
}
