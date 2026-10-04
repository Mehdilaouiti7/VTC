"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import type { PricingRule } from "@/lib/types";
import { estimatePrice } from "@/lib/pricing";

function RuleForm({ rule }: { rule: PricingRule }) {
  const router = useRouter();
  const [basePrice, setBasePrice] = useState(rule.base_price);
  const [pricePerHour, setPricePerHour] = useState(rule.price_per_hour ?? 0);
  const [pricePerKm, setPricePerKm] = useState(rule.price_per_km ?? 0);
  const [description, setDescription] = useState(rule.description ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await fetch(`/api/admin/pricing/${rule.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        base_price: basePrice,
        price_per_hour: pricePerHour || null,
        price_per_km: pricePerKm || null,
        description,
      }),
    });
    setSaving(false);
    setSaved(true);
    router.refresh();
  }

  // Display-only example, computed from the rule as currently saved in the DB
  // (not from the live form state) via the existing estimation helper.
  const exampleLabel = rule.price_per_hour ? "Ex. 3 h" : "Ex. aller-retour";
  const examplePrice = rule.price_per_hour
    ? estimatePrice([rule], {
        serviceType: rule.service_type,
        tripType: "mise_a_disposition",
        durationHours: 3,
        passengers: 2,
        stopsCount: 0,
      })
    : estimatePrice([rule], {
        serviceType: rule.service_type,
        tripType: "aller_retour",
        durationHours: null,
        passengers: 2,
        stopsCount: 0,
      });

  return (
    <div className="px-8 py-5 border-b border-divider">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="eyebrow mb-1">{rule.service_type}</p>
          <h3 className="text-lg font-semibold">{rule.label}</h3>
        </div>
        {examplePrice !== null && (
          <p className="text-[13px] text-ink/50 shrink-0 whitespace-nowrap">
            {exampleLabel} : {examplePrice} €
          </p>
        )}
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-4 mb-4">
        <div>
          <label className="label-field">Prix de base (€)</label>
          <input
            type="number"
            className="input-field"
            value={basePrice}
            onChange={(e) => setBasePrice(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="label-field">Prix / heure (€)</label>
          <input
            type="number"
            className="input-field"
            value={pricePerHour}
            onChange={(e) => setPricePerHour(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="label-field">Prix / km (€)</label>
          <input
            type="number"
            step="0.1"
            className="input-field"
            value={pricePerKm}
            onChange={(e) => setPricePerKm(Number(e.target.value))}
          />
        </div>
        <div className="col-span-2">
          <label className="label-field">Description</label>
          <textarea
            className="input-field min-h-[42px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>
      <button onClick={handleSave} disabled={saving} className="btn-secondary text-sm disabled:opacity-60">
        <Save size={15} strokeWidth={1.75} /> {saving ? "Enregistrement..." : saved ? "Enregistré ✓" : "Enregistrer"}
      </button>
    </div>
  );
}

export default function PricingManager({ rules }: { rules: PricingRule[] }) {
  return (
    <div>
      {rules.map((rule) => (
        <RuleForm key={rule.id} rule={rule} />
      ))}
    </div>
  );
}
