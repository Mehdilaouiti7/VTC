import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendQuoteStatusEmail } from "@/lib/email";
import { sendQuoteStatusWhatsApp } from "@/lib/whatsapp";
import type { QuoteRequest } from "@/lib/types";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await request.json();
  const allowedFields = ["status", "admin_notes"] as const;

  const update: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (field in body) update[field] = body[field];
  }

  const { data, error } = await supabase
    .from("quote_requests")
    .update(update)
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    console.error("Erreur mise à jour devis", error);
    return NextResponse.json({ error: "Mise à jour impossible" }, { status: 500 });
  }

  if (body.status === "confirmed" || body.status === "refused") {
    sendQuoteStatusEmail(data as QuoteRequest).catch((err) =>
      console.error("Erreur envoi email statut devis", err)
    );
    sendQuoteStatusWhatsApp(data as QuoteRequest).catch((err) =>
      console.error("Erreur envoi WhatsApp statut devis", err)
    );
  }

  return NextResponse.json({ quote: data });
}
