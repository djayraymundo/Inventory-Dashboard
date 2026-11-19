import { LucideIcon } from "lucide-react";

type Accent = "blue" | "red" | "amber" | "emerald";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  context: string;
  accent: Accent;
}

const accentStyles: Record<Accent, string> = {
  blue: "bg-blue-50 text-blue-600 ring-blue-600/10",
  red: "bg-red-50 text-red-600 ring-red-600/10",
  amber: "bg-amber-50 text-amber-600 ring-amber-600/10",
  emerald: "bg-emerald-50 text-emerald-600 ring-emerald-600/10",
};

export default function StatCard({ title, value, icon: Icon, context, accent }: StatCardProps) {
  return (
    <div className="rounded-xl border border-line bg-surface p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-ink-muted">{title}</p>
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ${accentStyles[accent]}`}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
      <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums text-ink">{value}</p>
      <p className="mt-1 text-xs text-ink-subtle">{context}</p>
    </div>
  );
}
