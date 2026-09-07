import { createClient } from "@/lib/supabase/server";
import type { QuoteRequest } from "@/lib/types";
import QuoteCard from "@/components/admin/QuoteCard";

export default async function DevisAdminPage() {
  const supabase = createClient();
  const { data: quotes } = await supabase
    .from("quote_requests")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="heading-md mb-8">Demandes de devis</h1>

      {!quotes || quotes.length === 0 ? (
        <div className="card p-10 text-center text-sm text-anthracite/50">
          Aucune demande de devis pour le moment.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {(quotes as QuoteRequest[]).map((q) => (
            <QuoteCard key={q.id} quote={q} />
          ))}
        </div>
      )}
    </div>
  );
}
