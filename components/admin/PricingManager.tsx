"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import type { PricingRule } from "@/lib/types";

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

  return (
    <div className="card p-6">
      <h3 className="font-display text-lg mb-4">{rule.label}</h3>
      <div className="grid sm:grid-cols-3 gap-4 mb-4">
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
      </div>
      <div className="mb-4">
        <label className="label-field">Description</label>
        <textarea
          className="input-field min-h-[70px]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <button onClick={handleSave} disabled={saving} className="btn-dark !py-2.5 text-sm disabled:opacity-60">
        <Save size={15} /> {saving ? "Enregistrement..." : saved ? "Enregistré ✓" : "Enregistrer"}
      </button>
    </div>
  );
}

export default function PricingManager({ rules }: { rules: PricingRule[] }) {
  return (
    <div className="space-y-6">
      {rules.map((rule) => (
        <RuleForm key={rule.id} rule={rule} />
      ))}
    </div>
  );
}
