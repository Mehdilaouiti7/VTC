import Link from "next/link";
import { Bell, CircleCheck, FileText, Car } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { SERVICE_LABELS } from "@/lib/types";
import type { Booking, QuoteRequest } from "@/lib/types";
import StatusBadge from "@/components/admin/StatusBadge";

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

export default async function AdminDashboard() {
  const supabase = createClient();
  const todayStr = new Date().toISOString().split("T")[0];

  const [
    { count: pendingCount },
    { count: confirmedCount },
    { count: quoteCount },
    { data: todayBookings },
    { data: pendingBookings },
    { data: pendingQuotes },
  ] = await Promise.all([
    supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "confirmed"),
    supabase.from("quote_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("bookings").select("*").eq("date", todayStr).order("time", { ascending: true }),
    supabase
      .from("bookings")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("quote_requests")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(2),
  ]);

  const stats = [
    { label: "Nouvelles demandes", value: pendingCount ?? 0, href: "/admin/reservations?status=pending", icon: Bell },
    { label: "Réservations confirmées", value: confirmedCount ?? 0, href: "/admin/reservations?status=confirmed", icon: CircleCheck },
    { label: "Devis en attente", value: quoteCount ?? 0, href: "/admin/devis", icon: FileText },
    { label: "Trajets aujourd'hui", value: (todayBookings as Booking[])?.length ?? 0, href: "/admin/reservations", icon: Car },
  ];

  const todayList = (todayBookings as Booking[]) ?? [];

  type ToTreatItem = { key: string; kicker: string; name: string; detail: string; when: string; href: string };

  const toTreatItems: ToTreatItem[] = [
    ...((pendingBookings as Booking[]) ?? []).map((b) => ({
      key: `booking-${b.id}`,
      kicker: `Réservation · ${SERVICE_LABELS[b.service_type]}`,
      name: `${b.first_name} ${b.last_name}`,
      detail: `${b.pickup_address} → ${b.dropoff_address}`,
      when: `${new Date(b.date + "T00:00:00").toLocaleDateString("fr-FR")} à ${b.time}`,
      href: `/admin/reservations/${b.id}`,
    })),
    ...((pendingQuotes as QuoteRequest[]) ?? []).map((q) => ({
      key: `quote-${q.id}`,
      kicker: `Devis${q.service_type ? ` · ${SERVICE_LABELS[q.service_type]}` : ""}`,
      name: `${q.first_name} ${q.last_name}`,
      detail: q.request_details,
      when: `Reçue le ${new Date(q.created_at).toLocaleDateString("fr-FR")}`,
      href: "/admin/devis",
    })),
  ];

  return (
    <div>
      <PageHeader title="Tableau de bord" />

      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] border-b-2 border-divider">
        {stats.map((stat, i) => (
          <Link
            key={stat.label}
            href={stat.href}
            className={`px-8 py-6 border-r border-divider last:border-r-0 transition-colors ${
              i === 0 ? "bg-accent text-bg hover:bg-accent-600" : "hover:bg-accent-100"
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <p className="text-[13px] font-semibold">{stat.label}</p>
              <stat.icon size={18} strokeWidth={1.75} />
            </div>
            <p className="font-display font-extrabold text-[64px] leading-none">{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(420px,1fr))]">
        <div className="border-r-2 border-divider px-8 py-7">
          <div className="flex items-center justify-between">
            <h2 className="text-[22px] font-display font-extrabold">Trajets du jour</h2>
            <span className="text-sm text-ink/50">{todayList.length} trajet(s)</span>
          </div>
          {todayList.length === 0 ? (
            <p className="mt-6 text-sm text-ink/50">Aucun trajet prévu aujourd&apos;hui.</p>
          ) : (
            <div className="border-t-2 border-divider mt-4">
              {todayList.map((b) => (
                <Link
                  key={b.id}
                  href={`/admin/reservations/${b.id}`}
                  className="grid grid-cols-[72px_1fr_auto] items-center gap-4 py-4 border-b border-divider hover:bg-accent-100 transition-colors"
                >
                  <span className="font-display font-extrabold text-2xl">{b.time}</span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold truncate">
                      {b.pickup_address} → {b.dropoff_address}
                    </span>
                    <span className="block text-xs text-ink/50 truncate">
                      {SERVICE_LABELS[b.service_type]} — {b.first_name} {b.last_name}
                    </span>
                  </span>
                  <StatusBadge status={b.status} />
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="px-8 py-7">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[22px] font-display font-extrabold">À traiter</h2>
            <Link href="/admin/devis" className="btn-ghost text-xs">
              Tous les devis
            </Link>
          </div>
          {toTreatItems.length === 0 ? (
            <p className="text-sm text-ink/50">Rien à traiter pour le moment.</p>
          ) : (
            <ul className="divide-y divide-divider border-t-2 border-divider">
              {toTreatItems.map((item) => (
                <li key={item.key} className="py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="eyebrow mb-1">{item.kicker}</p>
                      <Link href={item.href} className="block text-sm font-semibold hover:text-accent truncate">
                        {item.name}
                      </Link>
                      <p className="text-[13px] text-ink/60 truncate mt-0.5">{item.detail}</p>
                    </div>
                    <span className="shrink-0 text-xs text-ink/50 whitespace-nowrap">{item.when}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
