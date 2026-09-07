"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Plus } from "lucide-react";
import type { BlockedSlot } from "@/lib/types";

export default function AvailabilityManager({ blockedSlots }: { blockedSlots: BlockedSlot[] }) {
  const router = useRouter();
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const res = await fetch("/api/admin/blocked-slots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        start_at: new Date(startAt).toISOString(),
        end_at: new Date(endAt).toISOString(),
        reason: reason || null,
      }),
    });

    setSaving(false);
    if (!res.ok) {
      setError("Impossible d'ajouter ce créneau. Vérifiez les dates.");
      return;
    }
    setStartAt("");
    setEndAt("");
    setReason("");
    router.refresh();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/blocked-slots/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="card p-6 sm:p-8">
        <h2 className="font-display text-xl mb-6">Bloquer un créneau</h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="label-field">Indisponible du</label>
            <input
              required
              type="datetime-local"
              className="input-field"
              value={startAt}
              onChange={(e) => setStartAt(e.target.value)}
            />
          </div>
          <div>
            <label className="label-field">Jusqu&apos;au</label>
            <input
              required
              type="datetime-local"
              className="input-field"
              value={endAt}
              onChange={(e) => setEndAt(e.target.value)}
            />
          </div>
          <div>
            <label className="label-field">Motif (optionnel)</label>
            <input
              className="input-field"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Congés, maintenance véhicule..."
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button type="submit" disabled={saving} className="btn-dark w-full disabled:opacity-60">
            <Plus size={16} /> Ajouter ce blocage
          </button>
        </form>
      </div>

      <div className="card p-6 sm:p-8">
        <h2 className="font-display text-xl mb-6">Créneaux bloqués</h2>
        {blockedSlots.length === 0 ? (
          <p className="text-sm text-anthracite/50">Aucun créneau bloqué actuellement.</p>
        ) : (
          <ul className="divide-y divide-anthracite/10">
            {blockedSlots.map((slot) => (
              <li key={slot.id} className="flex items-center justify-between py-3 gap-3">
                <div className="text-sm">
                  <p className="font-medium">
                    {new Date(slot.start_at).toLocaleString("fr-FR")} → {new Date(slot.end_at).toLocaleString("fr-FR")}
                  </p>
                  {slot.reason && <p className="text-xs text-anthracite/50">{slot.reason}</p>}
                </div>
                <button
                  onClick={() => handleDelete(slot.id)}
                  className="text-anthracite/40 hover:text-red-500 shrink-0"
                  aria-label="Supprimer"
                >
                  <Trash2 size={17} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
