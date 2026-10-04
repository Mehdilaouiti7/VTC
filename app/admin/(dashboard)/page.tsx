import Link from "next/link";
import { Bell, CheckCircle, FileText, CarProfile } from "@phosphor-icons/react/dist/ssr";
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
    { label: "Nouvelles demandes", value: pendingCount ?? 0, href: "/admin/reservations?status=pending", icon: Bell },
    { label: "Réservations confirmées", value: confirmedCount ?? 0, href: "/admin/reservations?status=confirmed", icon: CheckCircle },
    { label: "Devis en attente", value: quoteCount ?? 0, href: "/admin/devis", icon: FileText },
    { label: "Trajets aujourd'hui", value: (todayBookings as Booking[])?.length ?? 0, href: "/admin/reservations", icon: CarProfile },
  ];

  return (
    <div>
      <h1 className="heading-md mb-8">Tableau de bord</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="card p-6 hover:-translate-y-0.5 transition-transform">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-or/15 mb-4">
              <stat.icon weight="light" size={19} className="text-or" />
            </div>
            <p className="text-3xl font-display text-anthracite mb-1">{stat.value}</p>
            <p className="text-sm text-anthracite/50">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="card p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-noir/[0.06]">
            <CarProfile weight="light" size={19} className="text-anthracite/60" />
          </div>
          <h2 className="font-display text-xl">Trajets du jour</h2>
        </div>
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
