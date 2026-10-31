import { Warehouse } from "lucide-react";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "Sign in | StockPilot",
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: { from?: string };
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
            <Warehouse className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">StockPilot</h1>
            <p className="text-sm text-slate-400">Sign in to the inventory system</p>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-xl">
          <LoginForm from={searchParams.from ?? "/"} />
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">v1.0.0 · Static Demo</p>
      </div>
    </main>
  );
}
