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
  blue: "bg-blue-50 text-blue-600",
  red: "bg-red-50 text-red-600",
  amber: "bg-amber-50 text-amber-600",
  emerald: "bg-emerald-50 text-emerald-600",
};

export default function StatCard({ title, value, icon: Icon, context, accent }: StatCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${accentStyles[accent]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-3 text-2xl font-semibold text-gray-900">{value}</p>
      <p className="mt-1 text-xs text-gray-500">{context}</p>
    </div>
  );
}
