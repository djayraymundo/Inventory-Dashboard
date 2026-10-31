import { FileBarChart2 } from "lucide-react";
import TopBar from "@/components/TopBar";

export default function ReportsPage() {
  return (
    <>
      <TopBar />
      <main className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <FileBarChart2 className="h-7 w-7" />
        </div>
        <h1 className="text-xl font-semibold text-gray-900">Reports</h1>
        <p className="max-w-sm text-sm text-gray-500">
          Stock movement at valuation reports ay ilalagay dito sa susunod na phase.
        </p>
      </main>
    </>
  );
}
