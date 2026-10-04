const STYLES: Record<string, string> = {
  pending: "bg-accent-100 text-accent-700",
  confirmed: "bg-ink text-bg",
  refused: "bg-neutral-200 text-neutral-700",
  completed: "bg-neutral-800 text-bg",
  cancelled: "bg-transparent text-neutral-500 border border-divider",
};

const LABELS: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  refused: "Refusée",
  completed: "Terminée",
  cancelled: "Annulée",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center text-[11px] font-semibold uppercase tracking-wide px-2 py-1 whitespace-nowrap ${
        STYLES[status] || "bg-neutral-200 text-neutral-700"
      }`}
    >
      {LABELS[status] || status}
    </span>
  );
}
