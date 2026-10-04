"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Phone, MessageCircle, Mail } from "lucide-react";
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

  const waNumber = quote.phone.replace(/[^\d]/g, "");

  return (
    <div className="bg-bg px-8 py-6 flex flex-col gap-3.5 min-w-0">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-xl font-semibold truncate">
            {quote.first_name} {quote.last_name}
          </h3>
          <p className="text-xs text-ink/50 truncate mt-0.5">
            {quote.phone} — {quote.email}
          </p>
        </div>
        <StatusBadge status={quote.status} />
      </div>

      <div className="grid grid-cols-2 border-t border-b border-divider divide-x divide-divider">
        <div className="py-2.5 px-3 min-w-0">
          <p className="text-[10px] uppercase tracking-wide text-ink/50 mb-0.5">Service</p>
          <p className="text-sm font-semibold truncate">
            {quote.service_type ? SERVICE_LABELS[quote.service_type] : "Non précisé"}
          </p>
        </div>
        <div className="py-2.5 px-3 min-w-0">
          <p className="text-[10px] uppercase tracking-wide text-ink/50 mb-0.5">Date souhaitée</p>
          <p className="text-sm font-semibold truncate">
            {quote.preferred_date
              ? `${new Date(quote.preferred_date + "T00:00:00").toLocaleDateString("fr-FR")}${
                  quote.preferred_time ? ` à ${quote.preferred_time}` : ""
                }`
              : "Non précisée"}
          </p>
        </div>
      </div>

      <p className="text-sm leading-relaxed whitespace-pre-wrap">{quote.request_details}</p>

      <div className="flex gap-2">
        <a href={`tel:${quote.phone.replace(/\s/g, "")}`} className="btn-secondary text-xs !py-2">
          <Phone size={14} strokeWidth={1.75} /> Appeler
        </a>
        <a
          href={`https://wa.me/${waNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary text-xs !py-2"
        >
          <MessageCircle size={14} strokeWidth={1.75} /> WhatsApp
        </a>
        <a href={`mailto:${quote.email}`} className="btn-secondary text-xs !py-2">
          <Mail size={14} strokeWidth={1.75} /> Email
        </a>
      </div>

      {quote.status === "pending" && (
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <button
            disabled={saving}
            onClick={() => updateStatus("confirmed")}
            className="btn-primary text-xs !py-2.5 !justify-between disabled:opacity-40"
          >
            Traité / Devis envoyé <Check size={14} strokeWidth={1.75} />
          </button>
          <button
            disabled={saving}
            onClick={() => updateStatus("refused")}
            className="btn-secondary text-xs !py-2.5 disabled:opacity-40"
          >
            <X size={14} strokeWidth={1.75} /> Refuser
          </button>
        </div>
      )}

      <p className="text-[11px] text-ink/40">Reçue le {new Date(quote.created_at).toLocaleString("fr-FR")}</p>
    </div>
  );
}
