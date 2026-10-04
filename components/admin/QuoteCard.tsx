"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Phone, WhatsappLogo, EnvelopeSimple, UserCircle } from "@phosphor-icons/react/dist/ssr";
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
    <div className="card p-6">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-noir/[0.06]">
            <UserCircle weight="light" size={19} className="text-anthracite/60" />
          </div>
          <div className="min-w-0">
            <p className="font-medium truncate">
              {quote.first_name} {quote.last_name}
            </p>
            <p className="text-xs text-anthracite/50 truncate">
              {quote.phone} — {quote.email}
            </p>
          </div>
        </div>
        <StatusBadge status={quote.status} />
      </div>

      <div className="flex gap-2 mb-4">
        <a
          href={`tel:${quote.phone.replace(/\s/g, "")}`}
          className="flex items-center gap-1.5 rounded-full border border-anthracite/10 px-3 py-1.5 text-xs text-anthracite/70 hover:border-or hover:text-or transition-colors"
        >
          <Phone weight="light" size={14} /> Appeler
        </a>
        <a
          href={`https://wa.me/${waNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-full border border-anthracite/10 px-3 py-1.5 text-xs text-anthracite/70 hover:border-or hover:text-or transition-colors"
        >
          <WhatsappLogo weight="light" size={14} /> WhatsApp
        </a>
        <a
          href={`mailto:${quote.email}`}
          className="flex items-center gap-1.5 rounded-full border border-anthracite/10 px-3 py-1.5 text-xs text-anthracite/70 hover:border-or hover:text-or transition-colors"
        >
          <EnvelopeSimple weight="light" size={14} /> Email
        </a>
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
            <Check weight="light" size={14} /> Traité / Devis envoyé
          </button>
          <button
            disabled={saving}
            onClick={() => updateStatus("refused")}
            className="btn-secondary !text-anthracite !border-anthracite/20 !py-2 !px-4 text-xs disabled:opacity-40"
          >
            <X weight="light" size={14} /> Refuser
          </button>
        </div>
      )}
    </div>
  );
}
