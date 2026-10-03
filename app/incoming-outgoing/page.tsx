import { ArrowLeftRight } from "lucide-react";
import TopBar from "@/components/TopBar";

export default function IncomingOutgoingPage() {
  return (
    <>
      <TopBar />
      <main className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
          <ArrowLeftRight className="h-7 w-7" />
        </div>
        <h1 className="text-xl font-semibold text-gray-900">Incoming / Outgoing</h1>
        <p className="max-w-sm text-sm text-gray-500">
          Track ng mga inbound shipment at outbound orders. Coming soon sa susunod na update.
        </p>
      </main>
    </>
  );
}
