import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SERVICE_LABELS } from "@/lib/types";
import type { Booking, BookingStatus } from "@/lib/types";
import StatusBadge from "@/components/admin/StatusBadge";
import BookingsCalendar from "@/components/admin/BookingsCalendar";

const TABS: { value: BookingStatus | "all"; label: string }[] = [
  { value: "pending", label: "Nouvelles demandes" },
  { value: "confirmed", label: "Confirmées" },
  { value: "completed", label: "Terminées" },
  { value: "all", label: "Toutes" },
];

export default async function ReservationsPage({
  searchParams,
}: {
  searchParams: { status?: string; date?: string };
}) {
  const supabase = createClient();
  const activeStatus = (searchParams.status as BookingStatus | "all") || "pending";

  let query = supabase.from("bookings").select("*").order("date", { ascending: true }).order("time", { ascending: true });
  if (activeStatus !== "all") query = query.eq("status", activeStatus);
  if (searchParams.date) query = query.eq("date", searchParams.date);

  const [{ data: bookings }, { data: allDates }] = await Promise.all([
    query,
    supabase.from("bookings").select("date"),
  ]);

  return (
    <div>
      <h1 className="heading-md mb-8">Réservations</h1>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        <BookingsCalendar bookingDates={(allDates || []).map((b) => b.date as string)} />

        <div>
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {TABS.map((tab) => (
              <Link
                key={tab.value}
                href={`/admin/reservations?status=${tab.value}${searchParams.date ? `&date=${searchParams.date}` : ""}`}
                className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition ${
                  activeStatus === tab.value
                    ? "bg-noir text-creme"
                    : "bg-white text-anthracite/60 hover:text-anthracite"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          <div className="card divide-y divide-anthracite/10">
            {!bookings || bookings.length === 0 ? (
              <p className="p-8 text-sm text-anthracite/50 text-center">Aucune réservation pour ce filtre.</p>
            ) : (
              (bookings as Booking[]).map((b) => (
                <Link
                  key={b.id}
                  href={`/admin/reservations/${b.id}`}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-5 hover:bg-anthracite/[0.02] transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {new Date(b.date + "T00:00:00").toLocaleDateString("fr-FR")} à {b.time} —{" "}
                      {b.pickup_address} → {b.dropoff_address}
                    </p>
                    <p className="text-xs text-anthracite/50 mt-1">
                      {SERVICE_LABELS[b.service_type]} — {b.first_name} {b.last_name} — {b.phone}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-medium text-or">
                      {b.final_price ?? b.estimated_price ? `${b.final_price ?? b.estimated_price} €` : "Sur devis"}
                    </span>
                    <StatusBadge status={b.status} />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
