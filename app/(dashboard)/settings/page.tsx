import { Settings } from "lucide-react";
import TopBar from "@/components/TopBar";

export default function SettingsPage() {
  return (
    <>
      <TopBar />
      <main className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-600">
          <Settings className="h-7 w-7" />
        </div>
        <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
        <p className="max-w-sm text-sm text-gray-500">
          User preferences, warehouse configuration, at notification settings ay ilalagay dito.
        </p>
      </main>
    </>
  );
}
