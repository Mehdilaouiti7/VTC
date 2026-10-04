import { Suspense } from "react";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import BookingWizard from "@/components/booking/BookingWizard";
import type { BlockedSlot, PricingRule } from "@/lib/types";

export const metadata: Metadata = {
  title: "Réserver un trajet",
  description: "Réservez votre chauffeur privé en quelques étapes simples.",
};

export const dynamic = "force-dynamic";

export default async function ReserverPage() {
  const supabase = createClient();
  const [{ data: pricingRules }, { data: blockedSlots }] = await Promise.all([
    supabase.from("pricing_rules").select("*"),
    supabase.from("blocked_slots").select("*"),
  ]);

  return (
    <section className="bg-bg min-h-screen py-16 sm:pt-24">
      <div className="container-site">
        <div className="max-w-2xl mb-14">
          <span className="eyebrow">Réservation</span>
          <h1 className="heading-lg mt-3 mb-4">Organisez votre trajet en 5 étapes</h1>
          <p className="text-ink/60">
            Renseignez les informations ci-dessous, votre chauffeur confirmera votre demande
            rapidement.
          </p>
        </div>

        <Suspense fallback={null}>
          <BookingWizard
            pricingRules={(pricingRules as PricingRule[]) || []}
            blockedSlots={(blockedSlots as BlockedSlot[]) || []}
          />
        </Suspense>
      </div>
    </section>
  );
}
