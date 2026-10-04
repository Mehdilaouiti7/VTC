import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminNav from "@/components/admin/AdminNav";
import SignOutButton from "@/components/admin/SignOutButton";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = { title: "Espace administrateur", robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Pending counters shown as badges in the nav (Réservations / Demandes de devis).
  const [{ count: pendingBookings }, { count: pendingQuotes }] = await Promise.all([
    supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("quote_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
  ]);

  const counts = { reservations: pendingBookings ?? 0, devis: pendingQuotes ?? 0 };

  return (
    <div className="min-h-screen bg-bg flex">
      <aside className="hidden lg:flex lg:w-[248px] lg:shrink-0 lg:flex-col lg:sticky lg:top-0 lg:h-screen border-r-2 border-divider">
        <div className="p-5 border-b-2 border-divider">
          <div className="font-display font-extrabold text-xl">
            {SITE_NAME}
            <span className="text-accent">.</span>
          </div>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink/50">
            Espace administrateur
          </p>
        </div>
        <div className="flex-1 overflow-y-auto">
          <AdminNav counts={counts} />
        </div>
        <div className="p-5 border-t-2 border-divider">
          <p className="text-xs text-ink/40 mb-3 truncate">{user.email}</p>
          <SignOutButton />
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="lg:hidden flex items-center justify-between px-5 py-4 border-b-2 border-divider bg-bg">
          <span className="font-display font-extrabold text-lg">
            {SITE_NAME}
            <span className="text-accent">.</span>
          </span>
          <SignOutButton />
        </header>
        <div className="lg:hidden border-b-2 border-divider bg-bg">
          <AdminNav horizontal />
        </div>
        <main>{children}</main>
      </div>
    </div>
  );
}
