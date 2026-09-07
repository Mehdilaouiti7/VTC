import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { quoteSchema } from "@/lib/validation";
import { sendQuoteEmails } from "@/lib/email";
import type { QuoteRequest } from "@/lib/types";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = quoteSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const supabase = createClient();

  const { data, error } = await supabase
    .from("quote_requests")
    .insert({
      ...parsed.data,
      preferred_date: parsed.data.preferred_date || null,
      preferred_time: parsed.data.preferred_time || null,
      service_type: parsed.data.service_type || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Erreur création devis", error);
    return NextResponse.json({ error: "Impossible d'envoyer la demande" }, { status: 500 });
  }

  sendQuoteEmails(data as QuoteRequest).catch((err) =>
    console.error("Erreur envoi email devis", err)
  );

  return NextResponse.json({ quote: data }, { status: 201 });
}
