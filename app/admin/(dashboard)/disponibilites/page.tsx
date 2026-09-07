import { createClient } from "@/lib/supabase/server";
import type { BlockedSlot } from "@/lib/types";
import AvailabilityManager from "@/components/admin/AvailabilityManager";

export default async function DisponibilitesPage() {
  const supabase = createClient();
  const { data: blockedSlots } = await supabase
    .from("blocked_slots")
    .select("*")
    .order("start_at", { ascending: true });

  return (
    <div>
      <h1 className="heading-md mb-8">Disponibilités</h1>
      <AvailabilityManager blockedSlots={(blockedSlots as BlockedSlot[]) || []} />
    </div>
  );
}
