"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { MapPin, Calendar, Clock, Users, ArrowLeftRight } from "lucide-react";

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
    <section className="relative z-20 -mt-16 sm:-mt-20">
      <div className="container-site">
        <form
          onSubmit={handleSubmit}
          className="card p-6 sm:p-8 lg:p-10 bg-white"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <h2 className="heading-md text-anthracite">Organisez votre trajet</h2>
            <div className="inline-flex rounded-lg border border-anthracite/10 p-1 self-start">
              <button
                type="button"
                onClick={() => setTripType("aller_simple")}
                className={`px-4 py-2 rounded-md text-xs font-medium tracking-wide transition-colors duration-300 ease-premium active:scale-95 ${
                  tripType === "aller_simple" ? "bg-noir text-creme" : "text-anthracite/60"
                }`}
              >
                Aller simple
              </button>
              <button
                type="button"
                onClick={() => setTripType("aller_retour")}
                className={`px-4 py-2 rounded-md text-xs font-medium tracking-wide transition-colors duration-300 ease-premium active:scale-95 ${
                  tripType === "aller_retour" ? "bg-noir text-creme" : "text-anthracite/60"
                }`}
              >
                Aller-retour
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2">
              <label className="label-field">Départ</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-or pointer-events-none" />
                <input
                  required
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  placeholder="Adresse, aéroport, gare..."
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div className="lg:col-span-2">
              <label className="label-field">Destination</label>
              <div className="relative">
                <ArrowLeftRight size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-or pointer-events-none" />
                <input
                  required
                  value={dropoff}
                  onChange={(e) => setDropoff(e.target.value)}
                  placeholder="Adresse d'arrivée"
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div>
              <label className="label-field">Date</label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-or pointer-events-none" />
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

            <div>
              <label className="label-field">Heure</label>
              <div className="relative">
                <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-or pointer-events-none" />
                <input
                  required
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-4 sm:items-end">
            <div className="w-full sm:w-48">
              <label className="label-field">Passagers</label>
              <div className="relative">
                <Users size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-or pointer-events-none" />
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

            <button type="submit" className="btn-primary w-full sm:w-auto sm:ml-auto">
              Continuer la réservation
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
