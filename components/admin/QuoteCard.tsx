"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import type { QuoteRequest } from "@/lib/types";
import { SERVICE_LABELS } from "@/lib/types";
import StatusBadge from "@/components/admin/StatusBadge";

export default function QuoteCard({ quote }: { quote: QuoteRequest }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function updateStatus(status: "confirmed" | "refused") {
    setSaving(true);
    await fetch(`/api/admin/quotes/${quote.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <p className="font-medium">
            {quote.first_name} {quote.last_name}
          </p>
          <p className="text-xs text-anthracite/50">
            {quote.phone} — {quote.email}
          </p>
        </div>
        <StatusBadge status={quote.status} />
      </div>

      {quote.service_type && (
        <p className="text-xs text-anthracite/50 mb-2">Service : {SERVICE_LABELS[quote.service_type]}</p>
      )}
      {quote.preferred_date && (
        <p className="text-xs text-anthracite/50 mb-2">
          Date souhaitée : {new Date(quote.preferred_date + "T00:00:00").toLocaleDateString("fr-FR")}{" "}
          {quote.preferred_time}
        </p>
      )}

      <p className="text-sm leading-relaxed mb-4 whitespace-pre-wrap">{quote.request_details}</p>

      <p className="text-xs text-anthracite/40 mb-4">
        Reçue le {new Date(quote.created_at).toLocaleString("fr-FR")}
      </p>

      {quote.status === "pending" && (
        <div className="flex gap-2">
          <button
            disabled={saving}
            onClick={() => updateStatus("confirmed")}
            className="btn-primary !py-2 !px-4 text-xs disabled:opacity-40"
          >
            <Check size={14} /> Traité / Devis envoyé
          </button>
          <button
            disabled={saving}
            onClick={() => updateStatus("refused")}
            className="btn-secondary !text-anthracite !border-anthracite/20 !py-2 !px-4 text-xs disabled:opacity-40"
          >
            <X size={14} /> Refuser
          </button>
        </div>
      )}
    </div>
  );
}
