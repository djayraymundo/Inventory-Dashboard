import { FileBarChart2 } from "lucide-react";
import TopBar from "@/components/TopBar";
import PageHeader from "@/components/PageHeader";

export default function ReportsPage() {
  return (
    <>
      <TopBar />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <PageHeader title="Reports" description="Stock movement at valuation reports." />
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-line bg-surface px-6 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-inset ring-indigo-600/10">
            <FileBarChart2 className="h-6 w-6" aria-hidden="true" />
          </div>
          <p className="text-sm font-medium text-ink">Coming soon</p>
          <p className="max-w-sm text-sm text-ink-muted">
            Stock movement at valuation reports ay ilalagay dito sa susunod na phase.
          </p>
        </div>
      </main>
    </>
  );
}
