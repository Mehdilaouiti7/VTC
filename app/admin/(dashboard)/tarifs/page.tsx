import { createClient } from "@/lib/supabase/server";
import type { PricingRule } from "@/lib/types";
import PricingManager from "@/components/admin/PricingManager";

export default async function TarifsPage() {
  const supabase = createClient();
  const { data: rules } = await supabase.from("pricing_rules").select("*").order("label");

  return (
    <div>
      <h1 className="heading-md mb-2">Tarifs</h1>
      <p className="text-sm text-anthracite/50 mb-8">
        Ces tarifs servent à calculer l&apos;estimation de prix affichée aux clients lors de la
        réservation en ligne.
      </p>
      <PricingManager rules={(rules as PricingRule[]) || []} />
    </div>
  );
}
