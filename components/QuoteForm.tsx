"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { SERVICE_LABELS } from "@/lib/types";
import type { ServiceType } from "@/lib/types";
import { CONTACT } from "@/lib/constants";

export default function QuoteForm() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [firstName, setFirstName] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      first_name: String(data.get("first_name") || ""),
      last_name: String(data.get("last_name") || ""),
      phone: String(data.get("phone") || ""),
      email: String(data.get("email") || ""),
      service_type: (data.get("service_type") as ServiceType) || null,
      preferred_date: String(data.get("preferred_date") || "") || null,
      preferred_time: String(data.get("preferred_time") || "") || null,
      request_details: String(data.get("request_details") || ""),
    };

    setFirstName(payload.first_name);

    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Une erreur est survenue, merci de réessayer.");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="card p-10 sm:p-14 text-center">
        <CheckCircle2 size={52} className="text-or mx-auto mb-6" />
        <h2 className="heading-md mb-4">Votre demande a bien été envoyée</h2>
        <p className="text-anthracite/60 leading-relaxed mb-8">
          Merci {firstName}, votre chauffeur va étudier votre demande et reviendra vers vous
          rapidement avec une proposition adaptée.
        </p>
        <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} className="btn-dark">
          Appeler directement
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 sm:p-10 space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label-field">Prénom</label>
          <input required name="first_name" className="input-field" />
        </div>
        <div>
          <label className="label-field">Nom</label>
          <input required name="last_name" className="input-field" />
        </div>
        <div>
          <label className="label-field">Téléphone</label>
          <input required type="tel" name="phone" className="input-field" placeholder="+33 6 00 00 00 00" />
        </div>
        <div>
          <label className="label-field">Email</label>
          <input required type="email" name="email" className="input-field" placeholder="vous@email.com" />
        </div>
      </div>

      <div>
        <label className="label-field">Type de service concerné (optionnel)</label>
        <select name="service_type" className="input-field" defaultValue="">
          <option value="">Je ne sais pas encore</option>
          {Object.entries(SERVICE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label-field">Date souhaitée (optionnel)</label>
          <input type="date" name="preferred_date" className="input-field" min={new Date().toISOString().split("T")[0]} />
        </div>
        <div>
          <label className="label-field">Heure souhaitée (optionnel)</label>
          <input type="time" name="preferred_time" className="input-field" />
        </div>
      </div>

      <div>
        <label className="label-field">Détail de votre demande</label>
        <textarea
          required
          name="request_details"
          minLength={10}
          className="input-field min-h-[140px]"
          placeholder="Plusieurs arrêts, attente sur place, trajet professionnel, transfert aller-retour, mise à disposition pour plusieurs heures ou journée complète : indiquez-nous vos besoins..."
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto disabled:opacity-60">
        {submitting ? "Envoi en cours..." : "Envoyer ma demande"}
      </button>
    </form>
  );
}
