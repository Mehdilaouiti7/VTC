import { createClient } from "@/lib/supabase/server";
import type { BlockedSlot } from "@/lib/types";
import AvailabilityManager from "@/components/admin/AvailabilityManager";

function PageHeader({ title }: { title: string }) {
  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <header className="px-8 pt-7 pb-5 border-b-2 border-divider">
      <p className="eyebrow mb-2">{today}</p>
      <h1 className="font-display font-extrabold text-[40px] leading-none tracking-[-0.03em]">{title}</h1>
    </header>
  );
}

export default async function DisponibilitesPage() {
  const supabase = createClient();
  const { data: blockedSlots } = await supabase
    .from("blocked_slots")
    .select("*")
    .order("start_at", { ascending: true });

  return (
    <div>
      <PageHeader title="Disponibilités" />
      <AvailabilityManager blockedSlots={(blockedSlots as BlockedSlot[]) || []} />
    </div>
  );
}
