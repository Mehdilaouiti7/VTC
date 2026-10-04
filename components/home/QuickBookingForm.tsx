"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { MapPin, Calendar, Clock, Users, Flag, ArrowRight } from "lucide-react";
import clsx from "clsx";
import AddressAutocomplete from "@/components/AddressAutocomplete";

export default function QuickBookingForm() {
  const router = useRouter();
  const [tripType, setTripType] = useState<"aller_simple" | "aller_retour">("aller_simple");
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [passengers, setPassengers] = useState(1);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams({
      pickup,
      dropoff,
      date,
      time,
      passengers: String(passengers),
      tripType,
    });
    router.push(`/reserver?${params.toString()}`);
  }

  return (
    <section className="bg-surface border-b-2 border-divider">
      <div className="container-site py-10">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="heading-md text-ink">Organisez votre trajet</h2>
            <div className="inline-flex border border-divider self-start">
              <button
                type="button"
                onClick={() => setTripType("aller_simple")}
                className={clsx(
                  "px-4 py-2 text-xs font-semibold tracking-wide",
                  tripType === "aller_simple" ? "bg-accent text-bg" : "text-ink"
                )}
              >
                Aller simple
              </button>
              <button
                type="button"
                onClick={() => setTripType("aller_retour")}
                className={clsx(
                  "px-4 py-2 text-xs font-semibold tracking-wide border-l border-divider",
                  tripType === "aller_retour" ? "bg-accent text-bg" : "text-ink"
                )}
              >
                Aller-retour
              </button>
            </div>
          </div>

          <div
            className="grid-gutters"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))" }}
          >
            <div className="bg-bg p-4" style={{ gridColumn: "span 2" }}>
              <label className="label-field">Départ</label>
              <AddressAutocomplete
                required
                value={pickup}
                onChange={setPickup}
                placeholder="Adresse, aéroport, gare..."
                className="input-field pl-10"
                icon={<MapPin size={16} strokeWidth={2} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-accent pointer-events-none" />}
              />
            </div>

            <div className="bg-bg p-4" style={{ gridColumn: "span 2" }}>
              <label className="label-field">Destination</label>
              <AddressAutocomplete
                required
                value={dropoff}
                onChange={setDropoff}
                placeholder="Adresse d'arrivée"
                className="input-field pl-10"
                icon={<Flag size={16} strokeWidth={2} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-accent pointer-events-none" />}
              />
            </div>

            <div className="bg-bg p-4">
              <label className="label-field">Date</label>
              <div className="relative">
                <Calendar size={16} strokeWidth={2} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-accent pointer-events-none" />
                <input
                  required
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div className="bg-bg p-4">
              <label className="label-field">Heure</label>
              <div className="relative">
                <Clock size={16} strokeWidth={2} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-accent pointer-events-none" />
                <input
                  required
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div className="bg-bg p-4">
              <label className="label-field">Passagers</label>
              <div className="relative">
                <Users size={16} strokeWidth={2} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-accent pointer-events-none" />
                <input
                  required
                  type="number"
                  min={1}
                  max={50}
                  value={passengers}
                  onChange={(e) => setPassengers(Number(e.target.value))}
                  className="input-field pl-10"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-accent text-bg flex items-center justify-between gap-3 p-4 text-base font-extrabold font-display"
              style={{ gridColumn: "span 2" }}
            >
              Continuer la réservation
              <ArrowRight size={18} strokeWidth={2} />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
