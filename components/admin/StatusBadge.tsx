const STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-emerald-100 text-emerald-700",
  refused: "bg-red-100 text-red-700",
  completed: "bg-blue-100 text-blue-700",
  cancelled: "bg-gray-100 text-gray-500",
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
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${STYLES[status] || ""}`}>
      {LABELS[status] || status}
    </span>
  );
}
