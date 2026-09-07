import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendBookingStatusEmail } from "@/lib/email";
import type { Booking } from "@/lib/types";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await request.json();
  const allowedFields = [
    "status",
    "final_price",
    "payment_status",
    "admin_notes",
    "date",
    "time",
  ] as const;

  const update: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (field in body) update[field] = body[field];
  }

  const { data, error } = await supabase
    .from("bookings")
    .update(update)
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    console.error("Erreur mise à jour réservation", error);
    return NextResponse.json({ error: "Mise à jour impossible" }, { status: 500 });
  }

  if (body.status === "confirmed" || body.status === "refused") {
    sendBookingStatusEmail(data as Booking).catch((err) =>
      console.error("Erreur envoi email statut", err)
    );
  }

  return NextResponse.json({ booking: data });
}
