"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Clock, PenLine } from "lucide-react";
import type { BlockedSlot } from "@/lib/types";
import AvailabilityCalendar from "@/components/booking/AvailabilityCalendar";

function todayStr() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = ["00", "15", "30", "45"];

// Native <input type="time"> renders wildly differently across mobile browsers
// (confirmed overflowing on iOS Safari, un-reproducible from this environment's
// Chromium-only toolchain). Two plain <select> elements with a hard-coded pixel
// width render identically everywhere — no more guessing.
function TimeSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [h, m] = value.split(":");
  return (
    <div className="flex items-center gap-2">
      <Clock size={16} strokeWidth={1.75} className="text-accent shrink-0" />
      <select
        className="input-field !w-[72px] !px-2 text-center"
        style={{ width: 72 }}
        value={h}
        onChange={(e) => onChange(`${e.target.value}:${m}`)}
      >
        {HOURS.map((hh) => (
          <option key={hh} value={hh}>
            {hh}
          </option>
        ))}
      </select>
      <span className="text-ink/40">:</span>
      <select
        className="input-field !w-[72px] !px-2 text-center"
        style={{ width: 72 }}
        value={m}
        onChange={(e) => onChange(`${h}:${e.target.value}`)}
      >
        {MINUTES.map((mm) => (
          <option key={mm} value={mm}>
            {mm}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function AvailabilityManager({ blockedSlots }: { blockedSlots: BlockedSlot[] }) {
  const router = useRouter();
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("00:00");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("23:59");
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
        start_at: new Date(`${startDate}T${startTime || "00:00"}`).toISOString(),
        end_at: new Date(`${endDate}T${endTime || "23:59"}`).toISOString(),
        reason: reason || null,
      }),
    });

    setSaving(false);
    if (!res.ok) {
      setError("Impossible d'ajouter ce créneau. Vérifiez les dates.");
      return;
    }
    setStartDate("");
    setStartTime("00:00");
    setEndDate("");
    setEndTime("23:59");
    setReason("");
    router.refresh();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/blocked-slots/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(360px,1fr))]">
      <div className="border-r-2 border-divider px-8 py-7 min-w-0">
        <h2 className="text-xl font-display font-extrabold mb-6">Bloquer un créneau</h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="space-y-2">
            <label className="label-field !mb-0">Indisponible du</label>
            <AvailabilityCalendar
              selectedDate={startDate}
              onSelect={(d) => {
                setStartDate(d);
                if (endDate && endDate < d) setEndDate(d);
              }}
              blockedSlots={blockedSlots}
              minDate={todayStr()}
            />
            <TimeSelect value={startTime} onChange={setStartTime} />
          </div>
          <div className="space-y-2">
            <label className="label-field !mb-0">Jusqu&apos;au</label>
            <AvailabilityCalendar
              selectedDate={endDate}
              onSelect={(d) => setEndDate(d)}
              blockedSlots={blockedSlots}
              minDate={startDate || todayStr()}
            />
            <TimeSelect value={endTime} onChange={setEndTime} />
          </div>
          <div>
            <label className="label-field">Motif (optionnel)</label>
            <div className="relative">
              <PenLine
                size={16}
                strokeWidth={1.75}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-accent pointer-events-none"
              />
              <input
                className="input-field pl-10"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Congés, maintenance véhicule..."
              />
            </div>
          </div>
          {error && <p className="text-sm font-semibold text-accent-700">{error}</p>}
          <button type="submit" disabled={saving} className="btn-primary w-full !justify-center disabled:opacity-60">
            <Plus size={16} strokeWidth={2} /> Ajouter ce blocage
          </button>
        </form>
      </div>

      <div className="px-8 py-7 min-w-0">
        <h2 className="text-xl font-display font-extrabold mb-6">Créneaux bloqués</h2>
        {blockedSlots.length === 0 ? (
          <p className="text-sm text-ink/50">Aucun créneau bloqué actuellement.</p>
        ) : (
          <div className="border-t-2 border-divider">
            {blockedSlots.map((slot) => (
              <div key={slot.id} className="flex items-center justify-between gap-3 py-4 border-b border-divider">
                <div className="text-sm min-w-0">
                  <p className="font-semibold">
                    {new Date(slot.start_at).toLocaleString("fr-FR")} → {new Date(slot.end_at).toLocaleString("fr-FR")}
                  </p>
                  {slot.reason && <p className="text-xs text-ink/50 mt-0.5">{slot.reason}</p>}
                </div>
                <button
                  onClick={() => handleDelete(slot.id)}
                  className="btn-icon btn-secondary shrink-0"
                  aria-label="Supprimer"
                >
                  <Trash2 size={17} strokeWidth={1.75} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
