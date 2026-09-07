import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { error } = await supabase.from("blocked_slots").delete().eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: "Suppression impossible" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
