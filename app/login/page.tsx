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
    <main className="flex min-h-screen items-center justify-center bg-slate-950 bg-[radial-gradient(ellipse_at_top,rgb(37_99_235/0.25),transparent_60%)] px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand shadow-lg shadow-brand/40">
            <Warehouse className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">StockPilot</h1>
            <p className="mt-1 text-sm text-slate-400">Sign in to the inventory system</p>
          </div>
        </div>

        <div className="rounded-2xl bg-surface p-6 shadow-2xl ring-1 ring-white/10 sm:p-8">
          <LoginForm from={searchParams.from ?? "/"} />
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">v1.0.0</p>
      </div>
    </main>
  );
}
