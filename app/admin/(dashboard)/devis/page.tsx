import { createClient } from "@/lib/supabase/server";
import type { QuoteRequest } from "@/lib/types";
import QuoteCard from "@/components/admin/QuoteCard";

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

export default async function DevisAdminPage() {
  const supabase = createClient();
  const { data: quotes } = await supabase
    .from("quote_requests")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader title="Demandes de devis" />

      <div className="px-8 py-8">
        {!quotes || quotes.length === 0 ? (
          <p className="py-10 text-center text-sm text-ink/50">Aucune demande de devis pour le moment.</p>
        ) : (
          <div className="grid-gutters grid-cols-[repeat(auto-fill,minmax(min(100%,360px),1fr))]">
            {(quotes as QuoteRequest[]).map((q) => (
              <QuoteCard key={q.id} quote={q} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
