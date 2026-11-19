import { StockStatus } from "@/lib/types";

const styles: Record<StockStatus, { badge: string; dot: string }> = {
  "In Stock": { badge: "bg-emerald-50 text-emerald-700 ring-emerald-600/20", dot: "bg-emerald-500" },
  "Low Stock": { badge: "bg-amber-50 text-amber-800 ring-amber-600/20", dot: "bg-amber-500" },
  "Out of Stock": { badge: "bg-red-50 text-red-700 ring-red-600/20", dot: "bg-red-500" },
};

export default function StatusBadge({ status }: { status: StockStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${styles[status].badge}`}
    >
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${styles[status].dot}`} />
      {status}
    </span>
  );
}
