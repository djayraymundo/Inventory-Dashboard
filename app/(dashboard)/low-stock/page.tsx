"use client";

import TopBar from "@/components/TopBar";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import { useInventory } from "@/lib/inventory-context";

export default function LowStockPage() {
  const { items } = useInventory();
  const lowStockItems = items.filter(
    (item) => item.status === "Low Stock" || item.status === "Out of Stock"
  );

  return (
    <>
      <TopBar />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <PageHeader
          title="Low Stock"
          description={`${lowStockItems.length} items ang nangangailangan ng restock ngayon.`}
        />

        <section className="overflow-hidden rounded-xl border border-line bg-surface shadow-sm">
          <div
            role="region"
            aria-label="Low stock items"
            tabIndex={0}
            className="data-table-wrap max-h-[70vh] overflow-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand/40"
          >
            <table className="data-table w-full min-w-[700px] border-separate border-spacing-0 text-left text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="bg-surface-muted text-xs font-medium uppercase tracking-wide text-ink-subtle">
                  <th className="border-b border-line px-4 py-3">Item #</th>
                  <th className="border-b border-line px-4 py-3">Name</th>
                  <th className="border-b border-line px-4 py-3">Location</th>
                  <th className="border-b border-line px-4 py-3 text-right">Quantity</th>
                  <th className="border-b border-line px-4 py-3 text-right">Min. Threshold</th>
                  <th className="border-b border-line px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {lowStockItems.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-muted/60">
                    <td data-label="Item #" className="border-b border-line px-4 py-3 font-mono text-xs text-ink-muted">
                      {item.itemNumber}
                    </td>
                    <td className="cell-name border-b border-line px-4 py-3 font-medium text-ink">{item.name}</td>
                    <td data-label="Location" className="border-b border-line px-4 py-3 text-ink-muted">
                      {item.location}
                    </td>
                    <td data-label="Quantity" className="border-b border-line px-4 py-3 text-right tabular-nums text-ink">
                      {item.quantity} <span className="text-ink-subtle">{item.unit}</span>
                    </td>
                    <td
                      data-label="Min. Threshold"
                      className="border-b border-line px-4 py-3 text-right tabular-nums text-ink-muted"
                    >
                      {item.minThreshold} {item.unit}
                    </td>
                    <td data-label="Status" className="border-b border-line px-4 py-3">
                      <StatusBadge status={item.status} />
                    </td>
                  </tr>
                ))}
                {lowStockItems.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-16 text-center text-sm text-ink-subtle">
                      Walang item na kailangang i-restock ngayon.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </>
  );
}
