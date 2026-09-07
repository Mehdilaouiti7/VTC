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

  return (
    <div className="min-h-screen bg-creme2 flex">
      <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-noir text-creme p-6">
        <div className="font-display text-xl mb-10">
          {SITE_NAME}
          <span className="text-or">.</span>
        </div>
        <AdminNav />
        <div className="mt-auto pt-6 border-t border-white/10">
          <p className="text-xs text-creme/40 mb-3 truncate">{user.email}</p>
          <SignOutButton />
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="lg:hidden flex items-center justify-between bg-noir text-creme px-5 py-4">
          <span className="font-display text-lg">{SITE_NAME}</span>
          <SignOutButton />
        </header>
        <div className="lg:hidden overflow-x-auto bg-noir/95 border-b border-white/10 px-3 py-2">
          <AdminNav horizontal />
        </div>
        <main className="p-5 sm:p-8 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
