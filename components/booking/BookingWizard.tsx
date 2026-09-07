"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Plus, Trash2, CheckCircle2 } from "lucide-react";
import clsx from "clsx";
import StepIndicator from "./StepIndicator";
import { estimatePrice } from "@/lib/pricing";
import { SERVICE_LABELS } from "@/lib/types";
import type { BlockedSlot, PricingRule, ServiceType, TripType } from "@/lib/types";
import { CONTACT } from "@/lib/constants";

interface FormState {
  service_type: ServiceType;
  trip_type: TripType;
  pickup_address: string;
  dropoff_address: string;
  stops: string[];
  date: string;
  time: string;
  return_date: string;
  return_time: string;
  duration_hours: number;
  passengers: number;
  luggage: number;
  child_seat: boolean;
  special_request: string;
  comment: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
}

const SERVICE_OPTIONS: { value: ServiceType; label: string }[] = [
  { value: "transfert_aeroport", label: "Transfert aéroport" },
  { value: "transfert_gare", label: "Transfert gare" },
  { value: "professionnel", label: "Déplacement professionnel" },
  { value: "prive", label: "Trajet privé" },
  { value: "mise_a_disposition", label: "Mise à disposition" },
  { value: "evenement", label: "Événement" },
];

const SPECIAL_REQUESTS = [
  "Aucune demande particulière",
  "Accès fauteuil roulant",
  "Transport d'animal",
  "Pancarte avec nom",
  "Autre (précisez en commentaire)",
];

export default function BookingWizard({
  pricingRules,
  blockedSlots,
}: {
  pricingRules: PricingRule[];
  blockedSlots: BlockedSlot[];
}) {
  const params = useSearchParams();
  const todayStr = new Date().toISOString().split("T")[0];

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const [form, setForm] = useState<FormState>({
    service_type: "transfert_aeroport",
    trip_type: (params.get("tripType") as TripType) || "aller_simple",
    pickup_address: params.get("pickup") || "",
    dropoff_address: params.get("dropoff") || "",
    stops: [],
    date: params.get("date") || "",
    time: params.get("time") || "",
    return_date: "",
    return_time: "",
    duration_hours: 2,
    passengers: Number(params.get("passengers")) || 1,
    luggage: 0,
    child_seat: false,
    special_request: SPECIAL_REQUESTS[0],
    comment: "",
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
  });

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const estimated = useMemo(
    () =>
      estimatePrice(pricingRules, {
        serviceType: form.service_type,
        tripType: form.trip_type,
        durationHours: form.duration_hours,
        passengers: form.passengers,
        stopsCount: form.stops.length,
      }),
    [pricingRules, form.service_type, form.trip_type, form.duration_hours, form.passengers, form.stops.length]
  );

  function isDateTimeBlocked(date: string, time: string) {
    if (!date || !time) return false;
    const target = new Date(`${date}T${time}`);
    return blockedSlots.some(
      (slot) => target >= new Date(slot.start_at) && target <= new Date(slot.end_at)
    );
  }

  const dateBlocked = isDateTimeBlocked(form.date, form.time);

  function canContinue() {
    if (step === 1) {
      return form.pickup_address.trim().length > 2 && form.dropoff_address.trim().length > 0;
    }
    if (step === 2) {
      if (!form.date || !form.time) return false;
      if (form.trip_type === "aller_retour" && (!form.return_date || !form.return_time)) return false;
      if (isDateTimeBlocked(form.date, form.time)) return false;
      return true;
    }
    if (step === 4) {
      return (
        form.first_name.trim().length > 0 &&
        form.last_name.trim().length > 0 &&
        form.phone.trim().length > 5 &&
        /\S+@\S+\.\S+/.test(form.email)
      );
    }
    return true;
  }

  function addStop() {
    if (form.stops.length >= 5) return;
    update("stops", [...form.stops, ""]);
  }

  function updateStop(i: number, value: string) {
    const next = [...form.stops];
    next[i] = value;
    update("stops", next);
  }

  function removeStop(i: number) {
    update(
      "stops",
      form.stops.filter((_, idx) => idx !== i)
    );
  }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const payload = {
        service_type: form.service_type,
        trip_type: form.trip_type,
        pickup_address: form.pickup_address,
        dropoff_address: form.dropoff_address,
        stops: form.stops.filter(Boolean),
        date: form.date,
        time: form.time,
        return_date: form.trip_type === "aller_retour" ? form.return_date : null,
        return_time: form.trip_type === "aller_retour" ? form.return_time : null,
        duration_hours: form.trip_type === "mise_a_disposition" ? form.duration_hours : null,
        passengers: form.passengers,
        luggage: form.luggage,
        child_seat: form.child_seat,
        special_request: form.special_request,
        comment: form.comment || null,
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone,
        email: form.email,
        estimated_price: estimated,
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Une erreur est survenue, merci de réessayer.");
      }

      setConfirmed(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmed) {
    return (
      <div className="card step-enter max-w-xl mx-auto p-10 sm:p-14 text-center">
        <CheckCircle2 size={52} className="text-or mx-auto mb-6" />
        <h2 className="heading-md mb-4">Votre demande a bien été envoyée</h2>
        <p className="text-anthracite/60 leading-relaxed mb-8">
          Merci {form.first_name}, nous avons bien reçu votre demande de réservation. Votre
          chauffeur va la confirmer très prochainement. Vous recevrez un email de confirmation
          dès validation.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} className="btn-dark">
            Appeler le chauffeur
          </a>
          <a href="/" className="btn-secondary !text-anthracite !border-anthracite/20">
            Retour à l&apos;accueil
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <StepIndicator current={step} />

      <div className="card p-6 sm:p-10 max-w-3xl mx-auto">
      <div key={step} className="step-enter">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="heading-md mb-2">Votre trajet</h2>

            <div>
              <label className="label-field">Type de service</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {SERVICE_OPTIONS.map((opt) => (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => update("service_type", opt.value)}
                    className={clsx(
                      "rounded-lg border px-4 py-3 text-sm text-left transition",
                      form.service_type === opt.value
                        ? "border-or bg-or/10 text-anthracite"
                        : "border-anthracite/10 text-anthracite/60 hover:border-anthracite/30"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label-field">Type de trajet</label>
              <div className="grid grid-cols-3 gap-3">
                {(
                  [
                    { value: "aller_simple", label: "Aller simple" },
                    { value: "aller_retour", label: "Aller-retour" },
                    { value: "mise_a_disposition", label: "Mise à disposition" },
                  ] as { value: TripType; label: string }[]
                ).map((opt) => (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => update("trip_type", opt.value)}
                    className={clsx(
                      "rounded-lg border px-3 py-3 text-xs sm:text-sm transition",
                      form.trip_type === opt.value
                        ? "border-or bg-or/10 text-anthracite"
                        : "border-anthracite/10 text-anthracite/60 hover:border-anthracite/30"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label-field">Adresse de départ</label>
                <input
                  className="input-field"
                  value={form.pickup_address}
                  onChange={(e) => update("pickup_address", e.target.value)}
                  placeholder="Adresse, aéroport, gare..."
                />
              </div>
              <div>
                <label className="label-field">
                  {form.trip_type === "mise_a_disposition" ? "Zone / destination principale" : "Destination"}
                </label>
                <input
                  className="input-field"
                  value={form.dropoff_address}
                  onChange={(e) => update("dropoff_address", e.target.value)}
                  placeholder="Adresse d'arrivée"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="label-field !mb-0">Étapes supplémentaires (optionnel)</label>
                {form.stops.length < 5 && (
                  <button
                    type="button"
                    onClick={addStop}
                    className="flex items-center gap-1 text-xs text-or hover:underline"
                  >
                    <Plus size={14} /> Ajouter une étape
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {form.stops.map((stop, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      className="input-field"
                      value={stop}
                      onChange={(e) => updateStop(i, e.target.value)}
                      placeholder={`Étape ${i + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeStop(i)}
                      className="shrink-0 text-anthracite/40 hover:text-red-500"
                      aria-label="Supprimer l'étape"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="heading-md mb-2">Date & horaires</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label-field">Date</label>
                <input
                  type="date"
                  min={todayStr}
                  className="input-field"
                  value={form.date}
                  onChange={(e) => update("date", e.target.value)}
                />
              </div>
              <div>
                <label className="label-field">Heure de départ</label>
                <input
                  type="time"
                  className="input-field"
                  value={form.time}
                  onChange={(e) => update("time", e.target.value)}
                />
              </div>
            </div>

            {form.trip_type === "aller_retour" && (
              <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-anthracite/10">
                <div>
                  <label className="label-field">Date de retour</label>
                  <input
                    type="date"
                    min={form.date || todayStr}
                    className="input-field"
                    value={form.return_date}
                    onChange={(e) => update("return_date", e.target.value)}
                  />
                </div>
                <div>
                  <label className="label-field">Heure de retour</label>
                  <input
                    type="time"
                    className="input-field"
                    value={form.return_time}
                    onChange={(e) => update("return_time", e.target.value)}
                  />
                </div>
              </div>
            )}

            {dateBlocked && (
              <p className="text-sm text-red-500">
                Le chauffeur n&apos;est pas disponible à cette date et heure. Merci de choisir un
                autre créneau.
              </p>
            )}

            {form.trip_type === "mise_a_disposition" && (
              <div className="pt-2 border-t border-anthracite/10">
                <label className="label-field">Durée souhaitée (heures)</label>
                <input
                  type="number"
                  min={2}
                  max={240}
                  className="input-field sm:w-48"
                  value={form.duration_hours}
                  onChange={(e) => update("duration_hours", Number(e.target.value))}
                />
                <p className="text-xs text-anthracite/45 mt-2">
                  Pour une mise à disposition sur plusieurs jours, indiquez le nombre d&apos;heures
                  total ou précisez en commentaire à l&apos;étape suivante.
                </p>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="heading-md mb-2">Vos besoins</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label-field">Nombre de passagers</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  className="input-field"
                  value={form.passengers}
                  onChange={(e) => update("passengers", Number(e.target.value))}
                />
              </div>
              <div>
                <label className="label-field">Nombre de bagages</label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  className="input-field"
                  value={form.luggage}
                  onChange={(e) => update("luggage", Number(e.target.value))}
                />
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.child_seat}
                onChange={(e) => update("child_seat", e.target.checked)}
                className="h-5 w-5 rounded border-anthracite/20 text-or focus:ring-or"
              />
              <span className="text-sm">J&apos;ai besoin d&apos;un siège enfant</span>
            </label>

            <div>
              <label className="label-field">Besoin particulier</label>
              <select
                className="input-field"
                value={form.special_request}
                onChange={(e) => update("special_request", e.target.value)}
              >
                {SPECIAL_REQUESTS.map((req) => (
                  <option key={req} value={req}>
                    {req}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label-field">Commentaire (optionnel)</label>
              <textarea
                className="input-field min-h-[100px]"
                value={form.comment}
                onChange={(e) => update("comment", e.target.value)}
                placeholder="Précisez toute information utile pour votre chauffeur..."
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h2 className="heading-md mb-2">Vos coordonnées</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label-field">Prénom</label>
                <input
                  className="input-field"
                  value={form.first_name}
                  onChange={(e) => update("first_name", e.target.value)}
                />
              </div>
              <div>
                <label className="label-field">Nom</label>
                <input
                  className="input-field"
                  value={form.last_name}
                  onChange={(e) => update("last_name", e.target.value)}
                />
              </div>
              <div>
                <label className="label-field">Téléphone</label>
                <input
                  type="tel"
                  className="input-field"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+33 6 00 00 00 00"
                />
              </div>
              <div>
                <label className="label-field">Email</label>
                <input
                  type="email"
                  className="input-field"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="vous@email.com"
                />
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <h2 className="heading-md mb-2">Récapitulatif</h2>
            <div className="rounded-lg border border-anthracite/10 divide-y divide-anthracite/10 text-sm">
              <RecapRow label="Service" value={SERVICE_LABELS[form.service_type]} />
              <RecapRow
                label="Trajet"
                value={`${form.pickup_address} → ${form.dropoff_address}${
                  form.stops.filter(Boolean).length
                    ? ` (+${form.stops.filter(Boolean).length} étape${form.stops.filter(Boolean).length > 1 ? "s" : ""})`
                    : ""
                }`}
              />
              <RecapRow
                label="Date & heure"
                value={`${form.date ? new Date(form.date + "T00:00:00").toLocaleDateString("fr-FR") : ""} à ${form.time}`}
              />
              {form.trip_type === "aller_retour" && (
                <RecapRow
                  label="Retour"
                  value={`${form.return_date ? new Date(form.return_date + "T00:00:00").toLocaleDateString("fr-FR") : ""} à ${form.return_time}`}
                />
              )}
              {form.trip_type === "mise_a_disposition" && (
                <RecapRow label="Durée" value={`${form.duration_hours} heure(s)`} />
              )}
              <RecapRow
                label="Passagers"
                value={`${form.passengers} passager(s), ${form.luggage} bagage(s)${form.child_seat ? ", siège enfant" : ""}`}
              />
              {form.special_request !== SPECIAL_REQUESTS[0] && (
                <RecapRow label="Besoin particulier" value={form.special_request} />
              )}
              <RecapRow label="Contact" value={`${form.first_name} ${form.last_name} — ${form.phone} — ${form.email}`} />
              <RecapRow
                label="Prix"
                value={estimated ? `${estimated} € (estimation indicative)` : "Sur devis"}
                highlight
              />
            </div>

            {submitError && <p className="text-sm text-red-500">{submitError}</p>}

            <p className="text-xs text-anthracite/45">
              En confirmant, vous acceptez d&apos;être contacté(e) par votre chauffeur pour finaliser
              votre réservation. Le prix final peut être ajusté selon les conditions réelles du
              trajet.
            </p>
          </div>
        )}
      </div>

        <div className="flex items-center justify-between mt-10 pt-6 border-t border-anthracite/10">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            className={clsx("text-sm text-anthracite/60 hover:text-anthracite", step === 1 && "invisible")}
          >
            ← Retour
          </button>

          {step < 5 ? (
            <button
              type="button"
              disabled={!canContinue()}
              onClick={() => setStep((s) => Math.min(5, s + 1))}
              className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continuer
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-primary disabled:opacity-60"
            >
              {submitting ? "Envoi en cours..." : "Confirmer ma demande"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function RecapRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between gap-4 px-4 py-3">
      <span className="text-anthracite/50">{label}</span>
      <span className={clsx("text-right font-medium", highlight && "text-or")}>{value}</span>
    </div>
  );
}
