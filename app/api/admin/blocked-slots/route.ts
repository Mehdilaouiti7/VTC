import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await request.json();
  const { start_at, end_at, reason } = body;

  if (!start_at || !end_at) {
    return NextResponse.json({ error: "Dates requises" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("blocked_slots")
    .insert({ start_at, end_at, reason: reason || null })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Impossible de bloquer ce créneau" }, { status: 500 });
  }

  return NextResponse.json({ blockedSlot: data }, { status: 201 });
}
