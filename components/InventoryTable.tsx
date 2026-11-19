"use client";

import { MoreVertical, Pencil, History, Trash2, PackageSearch } from "lucide-react";
import { InventoryItem } from "@/lib/types";
import StatusBadge from "./StatusBadge";

interface InventoryTableProps {
  items: InventoryItem[];
  selectedItemId: string | null;
  onSelectItem: (item: InventoryItem) => void;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
}

const supportsAnchor = typeof CSS !== "undefined" && CSS.supports("anchor-name: --a");

// shortcut: without CSS anchor positioning, place the menu once on open; it won't follow scroll. Drop when anchor positioning is Baseline.
function placeMenuFallback(trigger: HTMLElement, menuId: string) {
  if (supportsAnchor) return;
  const menu = document.getElementById(menuId);
  if (!menu) return;
  const rect = trigger.getBoundingClientRect();
  menu.style.top = `${rect.bottom + 4}px`;
  menu.style.left = `${Math.max(8, rect.right - 176)}px`;
}

function closeMenu(menuId: string) {
  document.getElementById(menuId)?.hidePopover();
}

const menuItemClass =
  "flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm text-ink hover:bg-surface-muted focus-visible:bg-surface-muted focus-visible:outline-none";

export default function InventoryTable({
  items,
  selectedItemId,
  onSelectItem,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
}: InventoryTableProps) {
  const allSelected = items.length > 0 && items.every((item) => selectedIds.includes(item.id));

  return (
    <div
      role="region"
      aria-label="Inventory items"
      tabIndex={0}
      className="data-table-wrap max-h-[70vh] overflow-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand/40"
    >
      <table className="data-table w-full min-w-[900px] border-separate border-spacing-0 text-left text-sm">
        <thead className="sticky top-0 z-10">
          <tr className="bg-surface-muted text-xs font-medium uppercase tracking-wide text-ink-subtle">
            <th className="w-10 border-b border-line px-4 py-3">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onToggleSelectAll}
                aria-label="Select all items on this page"
                className="h-4 w-4 rounded border-line"
              />
            </th>
            <th className="border-b border-line px-4 py-3">Item #</th>
            <th className="border-b border-line px-4 py-3">Name</th>
            <th className="border-b border-line px-4 py-3">SKU / Batch #</th>
            <th className="border-b border-line px-4 py-3">Category</th>
            <th className="border-b border-line px-4 py-3">Location</th>
            <th className="border-b border-line px-4 py-3 text-right">Quantity</th>
            <th className="border-b border-line px-4 py-3">Status</th>
            <th className="border-b border-line px-4 py-3">Last Updated</th>
            <th className="w-12 border-b border-line px-4 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const isSelected = selectedItemId === item.id;
            const menuId = `row-menu-${item.id}`;
            const anchor = `--row-${item.id}`;
            return (
              <tr
                key={item.id}
                onClick={() => onSelectItem(item)}
                className={`group cursor-pointer transition-colors ${
                  isSelected ? "bg-brand-soft" : "hover:bg-surface-muted/60"
                }`}
              >
                <td className="cell-check border-b border-line px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => onToggleSelect(item.id)}
                    aria-label={`Select ${item.name}`}
                    className="h-4 w-4 rounded border-line"
                  />
                </td>
                <td data-label="Item #" className="border-b border-line px-4 py-3 font-mono text-xs text-ink-muted">
                  {item.itemNumber}
                </td>
                <td className="cell-name border-b border-line px-4 py-3">
                  {/* Real button so rows open from the keyboard; the row click stays for mouse users. */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectItem(item);
                    }}
                    aria-current={isSelected ? "true" : undefined}
                    className="text-left font-medium text-ink hover:text-brand focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                  >
                    {item.name}
                  </button>
                </td>
                <td data-label="SKU / Batch #" className="border-b border-line px-4 py-3">
                  <div className="font-mono text-xs text-ink-muted">{item.sku}</div>
                  <div className="font-mono text-xs text-ink-subtle">{item.batchNumber}</div>
                </td>
                <td data-label="Category" className="border-b border-line px-4 py-3 text-ink-muted">
                  {item.category}
                </td>
                <td data-label="Location" className="border-b border-line px-4 py-3 text-ink-muted">
                  {item.location}
                </td>
                <td data-label="Quantity" className="border-b border-line px-4 py-3 text-right tabular-nums text-ink">
                  {item.quantity} <span className="text-ink-subtle">{item.unit}</span>
                </td>
                <td data-label="Status" className="border-b border-line px-4 py-3">
                  <StatusBadge status={item.status} />
                </td>
                <td data-label="Last Updated" className="border-b border-line px-4 py-3 tabular-nums text-ink-muted">
                  {item.lastUpdated}
                </td>
                <td className="cell-actions border-b border-line px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    aria-label={`Actions for ${item.name}`}
                    onClick={(e) => placeMenuFallback(e.currentTarget, menuId)}
                    {...({ popovertarget: menuId } as object)}
                    style={{ anchorName: anchor } as React.CSSProperties}
                    className="rounded-md p-1.5 text-ink-subtle hover:bg-surface-muted hover:text-ink"
                  >
                    <MoreVertical className="h-4 w-4" aria-hidden="true" />
                  </button>
                  {/* Top-layer popover: never clipped by the table's scroll container; Esc and outside click close it natively. */}
                  <div
                    id={menuId}
                    {...({ popover: "auto" } as object)}
                    style={{ positionAnchor: anchor } as React.CSSProperties}
                    className="row-menu m-0 w-44 rounded-lg border border-line bg-surface p-1 text-ink shadow-lg"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        onSelectItem(item);
                        closeMenu(menuId);
                      }}
                      className={menuItemClass}
                    >
                      <Pencil className="h-4 w-4 text-ink-subtle" aria-hidden="true" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectItem(item);
                        closeMenu(menuId);
                      }}
                      className={menuItemClass}
                    >
                      <History className="h-4 w-4 text-ink-subtle" aria-hidden="true" /> View History
                    </button>
                    <hr className="my-1 border-line" />
                    <button
                      type="button"
                      onClick={() => closeMenu(menuId)}
                      className={`${menuItemClass} text-red-600 hover:bg-red-50 focus-visible:bg-red-50`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" /> Remove
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
          {items.length === 0 && (
            <tr>
              <td colSpan={10} className="px-4 py-16 text-center">
                <PackageSearch className="mx-auto h-10 w-10 text-ink-subtle" aria-hidden="true" />
                <p className="mt-3 text-sm font-medium text-ink">No items match your filters</p>
                <p className="mt-1 text-xs text-ink-subtle">Try clearing a filter or changing your search.</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
