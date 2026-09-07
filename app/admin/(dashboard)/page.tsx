import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SERVICE_LABELS } from "@/lib/types";
import type { Booking } from "@/lib/types";
import StatusBadge from "@/components/admin/StatusBadge";

export default async function AdminDashboard() {
  const supabase = createClient();
  const todayStr = new Date().toISOString().split("T")[0];

  const [{ count: pendingCount }, { count: confirmedCount }, { count: quoteCount }, { data: todayBookings }] =
    await Promise.all([
      supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "confirmed"),
      supabase.from("quote_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase
        .from("bookings")
        .select("*")
        .eq("date", todayStr)
        .order("time", { ascending: true }),
    ]);

  const stats = [
    { label: "Nouvelles demandes", value: pendingCount ?? 0, href: "/admin/reservations?status=pending" },
    { label: "Réservations confirmées", value: confirmedCount ?? 0, href: "/admin/reservations?status=confirmed" },
    { label: "Devis en attente", value: quoteCount ?? 0, href: "/admin/devis" },
    { label: "Trajets aujourd'hui", value: (todayBookings as Booking[])?.length ?? 0, href: "/admin/reservations" },
  ];

  return (
    <div>
      <h1 className="heading-md mb-8">Tableau de bord</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="card p-6 hover:-translate-y-0.5 transition-transform">
            <p className="text-3xl font-display text-anthracite mb-1">{stat.value}</p>
            <p className="text-sm text-anthracite/50">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="card p-6 sm:p-8">
        <h2 className="font-display text-xl mb-6">Trajets du jour</h2>
        {!todayBookings || todayBookings.length === 0 ? (
          <p className="text-sm text-anthracite/50">Aucun trajet prévu aujourd&apos;hui.</p>
        ) : (
          <div className="divide-y divide-anthracite/10">
            {(todayBookings as Booking[]).map((b) => (
              <Link
                key={b.id}
                href={`/admin/reservations/${b.id}`}
                className="flex items-center justify-between py-4 hover:bg-anthracite/[0.02] -mx-2 px-2 rounded"
              >
                <div>
                  <p className="text-sm font-medium">
                    {b.time} — {b.pickup_address} → {b.dropoff_address}
                  </p>
                  <p className="text-xs text-anthracite/50">
                    {SERVICE_LABELS[b.service_type]} — {b.first_name} {b.last_name}
                  </p>
                </div>
                <StatusBadge status={b.status} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
