"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, X, Save, Phone, MessageCircle, Mail } from "lucide-react";
import type { Booking, BookingStatus, PaymentStatus } from "@/lib/types";
import { SERVICE_LABELS } from "@/lib/types";
import StatusBadge from "@/components/admin/StatusBadge";

const PAYMENT_LABELS: Record<PaymentStatus, string> = {
  unpaid: "Non payé",
  deposit_paid: "Acompte versé",
  paid: "Payé",
};

export default function BookingDetail({ booking }: { booking: Booking }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [finalPrice, setFinalPrice] = useState(booking.final_price ?? booking.estimated_price ?? 0);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(booking.payment_status);
  const [adminNotes, setAdminNotes] = useState(booking.admin_notes ?? "");

  async function updateStatus(status: BookingStatus) {
    setSaving(true);
    await fetch(`/api/admin/bookings/${booking.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setSaving(false);
    router.refresh();
  }

  async function saveDetails() {
    setSaving(true);
    setSaved(false);
    await fetch(`/api/admin/bookings/${booking.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ final_price: finalPrice, payment_status: paymentStatus, admin_notes: adminNotes }),
    });
    setSaving(false);
    setSaved(true);
    router.refresh();
  }

  const waNumber = booking.phone.replace(/[^\d]/g, "");

  return (
    <div>
      {/* Header */}
      <div className="px-8 pt-7 pb-5 border-b-2 border-divider">
        <div className="flex items-center justify-between mb-4">
          <StatusBadge status={booking.status} />
          <Link href="/admin/reservations" className="btn-icon btn-secondary" aria-label="Retour aux réservations">
            <X size={18} strokeWidth={1.75} />
          </Link>
        </div>
        <h2 className="font-display font-extrabold text-[28px] leading-tight">
          {new Date(booking.date + "T00:00:00").toLocaleDateString("fr-FR")} à {booking.time}
        </h2>
        <p className="text-[13px] text-ink/60 mt-1">
          {SERVICE_LABELS[booking.service_type]} · {booking.trip_type.replace(/_/g, " ")}
        </p>
      </div>

      {/* Détails du trajet */}
      <div className="px-8 py-7 border-b-2 border-divider">
        <h3 className="text-base font-display font-extrabold mb-4">Détails du trajet</h3>
        <dl className="grid grid-cols-2 gap-x-6 border-t border-divider">
          <Info label="Service" value={SERVICE_LABELS[booking.service_type]} />
          <Info label="Type de trajet" value={booking.trip_type.replace(/_/g, " ")} />
          <Info label="Départ" value={booking.pickup_address} />
          <Info label="Destination" value={booking.dropoff_address} />
          {booking.stops?.length > 0 && <Info label="Étapes" value={booking.stops.join(", ")} />}
          <Info label="Date" value={new Date(booking.date + "T00:00:00").toLocaleDateString("fr-FR")} />
          <Info label="Heure" value={booking.time} />
          {booking.return_date && (
            <Info
              label="Retour"
              value={`${new Date(booking.return_date + "T00:00:00").toLocaleDateString("fr-FR")} à ${booking.return_time}`}
            />
          )}
          {booking.duration_hours && <Info label="Durée" value={`${booking.duration_hours} heure(s)`} />}
          <Info label="Passagers" value={String(booking.passengers)} />
          <Info label="Bagages" value={String(booking.luggage)} />
          <Info label="Siège enfant" value={booking.child_seat ? "Oui" : "Non"} />
          <Info label="Paiement" value={PAYMENT_LABELS[booking.payment_status]} />
          {booking.special_request && <Info label="Besoin particulier" value={booking.special_request} />}
        </dl>

        {booking.comment && (
          <div className="mt-5">
            <p className="text-[10px] uppercase tracking-wide text-ink/50 mb-2">Commentaire du client</p>
            <p className="text-sm leading-relaxed">{booking.comment}</p>
          </div>
        )}
      </div>

      {/* Client */}
      <div className="px-8 py-7 border-b-2 border-divider">
        <h3 className="text-[18px] font-semibold">
          {booking.first_name} {booking.last_name}
        </h3>
        <p className="text-sm text-ink/60 mt-1">
          {booking.phone} · {booking.email}
        </p>
        <p className="text-xs text-ink/40 mt-1">Reçue le {new Date(booking.created_at).toLocaleString("fr-FR")}</p>

        <div className="grid grid-cols-3 gap-3 mt-5">
          <a
            href={`tel:${booking.phone.replace(/\s/g, "")}`}
            className="btn-secondary !flex-col !justify-center !gap-1.5 !py-3 text-xs"
          >
            <Phone size={18} strokeWidth={1.75} /> Appeler
          </a>
          <a
            href={`https://wa.me/${waNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary !flex-col !justify-center !gap-1.5 !py-3 text-xs"
          >
            <MessageCircle size={18} strokeWidth={1.75} /> WhatsApp
          </a>
          <a
            href={`mailto:${booking.email}`}
            className="btn-secondary !flex-col !justify-center !gap-1.5 !py-3 text-xs"
          >
            <Mail size={18} strokeWidth={1.75} /> Email
          </a>
        </div>
      </div>

      {/* Tarification */}
      <div className="px-8 py-7 border-b-2 border-divider">
        <h3 className="text-base font-display font-extrabold mb-4">Tarification</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="label-field">Prix final (€)</label>
            <input
              type="number"
              className="input-field"
              value={finalPrice}
              onChange={(e) => setFinalPrice(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="label-field">Statut du paiement</label>
            <select
              className="input-field"
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
            >
              <option value="unpaid">Non payé</option>
              <option value="deposit_paid">Acompte versé</option>
              <option value="paid">Payé</option>
            </select>
          </div>
        </div>
        <div className="mb-4">
          <label className="label-field">Notes internes</label>
          <textarea
            className="input-field min-h-[90px]"
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Notes visibles uniquement par vous..."
          />
        </div>
        <button onClick={saveDetails} disabled={saving} className="btn-secondary disabled:opacity-60">
          <Save size={16} strokeWidth={1.75} /> {saving ? "Enregistrement..." : saved ? "Enregistré ✓" : "Enregistrer"}
        </button>
      </div>

      {/* Barre d'action */}
      <div className="sticky bottom-0 bg-bg border-t-2 border-divider px-8 py-5">
        <div className="grid grid-cols-3 gap-3">
          <button
            disabled={saving || booking.status === "confirmed"}
            onClick={() => updateStatus("confirmed")}
            className="btn-primary !justify-center"
          >
            <Check size={16} strokeWidth={1.75} /> Confirmer
          </button>
          <button
            disabled={saving || booking.status === "refused"}
            onClick={() => updateStatus("refused")}
            className="btn-secondary !justify-center"
          >
            <X size={16} strokeWidth={1.75} /> Refuser
          </button>
          <button
            disabled={saving || booking.status === "completed"}
            onClick={() => updateStatus("completed")}
            className="btn-secondary !justify-center"
          >
            Marquer terminée
          </button>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-divider py-3">
      <dt className="text-[10px] uppercase tracking-wide text-ink/50 mb-1">{label}</dt>
      <dd className="text-sm font-semibold">{value}</dd>
    </div>
  );
}
