"use client";

import { AlertTriangle } from "lucide-react";
import TopBar from "@/components/TopBar";
import StatusBadge from "@/components/StatusBadge";
import { inventoryItems } from "@/lib/mock-data";

export default function LowStockPage() {
  const lowStockItems = inventoryItems.filter(
    (item) => item.status === "Low Stock" || item.status === "Out of Stock"
  );

  return (
    <>
      <TopBar />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Low Stock</h1>
            <p className="text-sm text-gray-500">
              {lowStockItems.length} items ang nangangailangan ng restock ngayon.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <th className="px-4 py-3">Item #</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Min. Threshold</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {lowStockItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 font-medium text-gray-700">{item.itemNumber}</td>
                  <td className="px-4 py-3 text-gray-900">{item.name}</td>
                  <td className="px-4 py-3 text-gray-500">{item.location}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {item.quantity} {item.unit}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {item.minThreshold} {item.unit}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={item.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
