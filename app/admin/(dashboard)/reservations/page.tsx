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

function PageHeader({ title }: { title: string }) {
  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <header className="px-8 pt-7 pb-5 border-b-2 border-divider">
      <p className="eyebrow mb-2">{today}</p>
      <h1 className="font-display font-extrabold text-[40px] leading-none tracking-[-0.03em]">{title}</h1>
    </header>
  );
}

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

  const [{ data: bookings }, { data: allDates }, ...tabCountResults] = await Promise.all([
    query,
    supabase.from("bookings").select("date"),
    ...TABS.map((tab) =>
      tab.value === "all"
        ? supabase.from("bookings").select("*", { count: "exact", head: true })
        : supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", tab.value)
    ),
  ]);

  const countsByTab: Record<string, number> = {};
  TABS.forEach((tab, i) => {
    countsByTab[tab.value] = (tabCountResults[i] as { count: number | null }).count ?? 0;
  });

  return (
    <div>
      <PageHeader title="Réservations" />

      <div className="flex flex-wrap">
        <div className="flex-[1_1_280px] max-w-[340px] border-r-2 border-b-2 border-divider p-6 min-w-0">
          <BookingsCalendar bookingDates={(allDates || []).map((b) => b.date as string)} />
        </div>

        <div className="flex-[999_1_480px] min-w-0">
          <div className="flex flex-wrap border-b-2 border-divider">
            {TABS.map((tab) => (
              <Link
                key={tab.value}
                href={`/admin/reservations?status=${tab.value}${searchParams.date ? `&date=${searchParams.date}` : ""}`}
                className={`px-5 py-[14px] text-sm font-semibold border-r border-divider last:border-r-0 transition-colors ${
                  activeStatus === tab.value ? "bg-ink text-bg" : "hover:bg-accent-100"
                }`}
              >
                {tab.label} <span className="font-normal">{countsByTab[tab.value]}</span>
              </Link>
            ))}
          </div>

          {!bookings || bookings.length === 0 ? (
            <p className="px-8 py-10 text-sm text-ink/50 text-center">Aucune réservation pour ce filtre.</p>
          ) : (
            <div>
              {(bookings as Booking[]).map((b) => (
                <Link
                  key={b.id}
                  href={`/admin/reservations/${b.id}`}
                  className="grid grid-cols-[96px_1fr_auto] items-center gap-4 px-6 py-[14px] border-b border-divider hover:bg-accent-100 transition-colors"
                >
                  <span className="min-w-0">
                    <span className="block text-[13px] font-semibold">
                      {new Date(b.date + "T00:00:00").toLocaleDateString("fr-FR")}
                    </span>
                    <span className="block font-display font-extrabold text-xl">{b.time}</span>
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold truncate">
                      {b.pickup_address} → {b.dropoff_address}
                    </span>
                    <span className="block text-xs text-ink/50 truncate">
                      {SERVICE_LABELS[b.service_type]} — {b.first_name} {b.last_name} — {b.phone}
                    </span>
                  </span>
                  <span className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-sm font-semibold text-accent-700">
                      {b.final_price ?? b.estimated_price ? `${b.final_price ?? b.estimated_price} €` : "Sur devis"}
                    </span>
                    <StatusBadge status={b.status} />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
