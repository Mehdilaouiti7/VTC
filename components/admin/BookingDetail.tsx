"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, X, Save } from "lucide-react";
import type { Booking, BookingStatus, PaymentStatus } from "@/lib/types";
import { SERVICE_LABELS } from "@/lib/types";
import StatusBadge from "@/components/admin/StatusBadge";

export default function BookingDetail({ booking }: { booking: Booking }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
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
    await fetch(`/api/admin/bookings/${booking.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ final_price: finalPrice, payment_status: paymentStatus, admin_notes: adminNotes }),
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="card p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl">Détails du trajet</h2>
            <StatusBadge status={booking.status} />
          </div>

          <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <Info label="Service" value={SERVICE_LABELS[booking.service_type]} />
            <Info label="Type de trajet" value={booking.trip_type.replace(/_/g, " ")} />
            <Info label="Départ" value={booking.pickup_address} />
            <Info label="Destination" value={booking.dropoff_address} />
            {booking.stops?.length > 0 && (
              <Info label="Étapes" value={booking.stops.join(", ")} />
            )}
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
            {booking.special_request && <Info label="Besoin particulier" value={booking.special_request} />}
          </dl>

          {booking.comment && (
            <div className="mt-6 pt-6 border-t border-anthracite/10">
              <p className="text-xs uppercase tracking-wider text-anthracite/40 mb-2">Commentaire du client</p>
              <p className="text-sm leading-relaxed">{booking.comment}</p>
            </div>
          )}
        </div>

        <div className="card p-6 sm:p-8">
          <h2 className="font-display text-xl mb-6">Client</h2>
          <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <Info label="Nom" value={`${booking.first_name} ${booking.last_name}`} />
            <Info label="Téléphone" value={booking.phone} />
            <Info label="Email" value={booking.email} />
            <Info label="Reçue le" value={new Date(booking.created_at).toLocaleString("fr-FR")} />
          </dl>
        </div>
      </div>

      <div className="space-y-6">
        <div className="card p-6">
          <h3 className="font-display text-lg mb-4">Actions</h3>
          <div className="flex flex-col gap-2">
            <button
              disabled={saving || booking.status === "confirmed"}
              onClick={() => updateStatus("confirmed")}
              className="btn-primary !py-2.5 w-full disabled:opacity-40"
            >
              <Check size={16} /> Confirmer
            </button>
            <button
              disabled={saving || booking.status === "refused"}
              onClick={() => updateStatus("refused")}
              className="btn-dark !bg-red-600/90 hover:!bg-red-600 !border-red-600 !py-2.5 w-full disabled:opacity-40"
            >
              <X size={16} /> Refuser
            </button>
            <button
              disabled={saving || booking.status === "completed"}
              onClick={() => updateStatus("completed")}
              className="btn-secondary !text-anthracite !border-anthracite/20 !py-2.5 w-full disabled:opacity-40"
            >
              Marquer terminée
            </button>
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h3 className="font-display text-lg mb-2">Tarification</h3>
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
          <div>
            <label className="label-field">Notes internes</label>
            <textarea
              className="input-field min-h-[90px]"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Notes visibles uniquement par vous..."
            />
          </div>
          <button onClick={saveDetails} disabled={saving} className="btn-dark w-full !py-2.5 disabled:opacity-60">
            <Save size={16} /> Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-anthracite/40 mb-1">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
