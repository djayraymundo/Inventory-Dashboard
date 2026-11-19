import { StockStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

const styles: Record<StockStatus, { label: string; badge: string; dot: string }> = {
  "In Stock": { label: "In stock", badge: "bg-emerald-50 text-emerald-700 border-emerald-600/20", dot: "bg-emerald-500" },
  "Low Stock": { label: "Low", badge: "bg-amber-50 text-amber-800 border-amber-600/20", dot: "bg-amber-500" },
  "Out of Stock": { label: "Out", badge: "bg-red-50 text-red-700 border-red-600/20", dot: "bg-red-500" },
};

export default function StatusBadge({ status }: { status: StockStatus }) {
  const { label, badge, dot } = styles[status];
  return (
    <Badge variant="outline" className={badge}>
      <span aria-hidden="true" className={`size-1.5 rounded-full ${dot}`} />
      {label}
    </Badge>
  );
}
