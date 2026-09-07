import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

  return NextResponse.json({ quote: data });
}
