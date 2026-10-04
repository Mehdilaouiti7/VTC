import { createClient } from "@/lib/supabase/server";
import type { PricingRule } from "@/lib/types";
import PricingManager from "@/components/admin/PricingManager";

function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
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
      {subtitle && <p className="mt-2 text-sm text-ink/60 max-w-2xl">{subtitle}</p>}
    </header>
  );
}

export default async function TarifsPage() {
  const supabase = createClient();
  const { data: rules } = await supabase.from("pricing_rules").select("*").order("label");

  return (
    <div>
      <PageHeader
        title="Tarifs"
        subtitle="Ces tarifs servent à calculer l'estimation de prix affichée aux clients lors de la réservation en ligne."
      />
      <PricingManager rules={(rules as PricingRule[]) || []} />
    </div>
  );
}
