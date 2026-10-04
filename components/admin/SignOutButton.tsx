"use client";

import { useRouter } from "next/navigation";
import { SignOut as LogOut } from "@phosphor-icons/react/dist/ssr";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-2 text-sm text-creme/60 hover:text-or transition-colors"
    >
      <LogOut weight="light" size={16} />
      Déconnexion
    </button>
  );
}
