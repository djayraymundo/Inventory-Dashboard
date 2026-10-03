"use client";

import { useEffect, useState } from "react";
import { MoreVertical, Pencil, History, Trash2 } from "lucide-react";
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

export default function InventoryTable({
  items,
  selectedItemId,
  onSelectItem,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
}: InventoryTableProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const allSelected = items.length > 0 && items.every((item) => selectedIds.includes(item.id));

  useEffect(() => {
    if (!openMenuId) return;
    function closeMenu() {
      setOpenMenuId(null);
    }
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, [openMenuId]);

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <th className="w-10 px-4 py-3">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onToggleSelectAll}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </th>
            <th className="px-4 py-3">Item #</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">SKU / Batch #</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Location</th>
            <th className="px-4 py-3">Quantity</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Last Updated</th>
            <th className="w-10 px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.map((item) => (
            <tr
              key={item.id}
              onClick={() => onSelectItem(item)}
              className={`cursor-pointer transition-colors hover:bg-blue-50/50 ${
                selectedItemId === item.id ? "bg-blue-50" : ""
              }`}
            >
              <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item.id)}
                  onChange={() => onToggleSelect(item.id)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </td>
              <td className="px-4 py-3 font-medium text-gray-700">{item.itemNumber}</td>
              <td className="px-4 py-3 text-gray-900">{item.name}</td>
              <td className="px-4 py-3 text-gray-500">
                <div>{item.sku}</div>
                <div className="text-xs text-gray-400">{item.batchNumber}</div>
              </td>
              <td className="px-4 py-3 text-gray-500">{item.category}</td>
              <td className="px-4 py-3 text-gray-500">{item.location}</td>
              <td className="px-4 py-3 text-gray-700">
                {item.quantity} {item.unit}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={item.status} />
              </td>
              <td className="px-4 py-3 text-gray-500">{item.lastUpdated}</td>
              <td className="relative px-4 py-3" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}
                  className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
                {openMenuId === item.id && (
                  <div className="absolute right-4 top-10 z-10 w-40 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectItem(item);
                        setOpenMenuId(null);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-50"
                    >
                      <Pencil className="h-4 w-4" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectItem(item);
                        setOpenMenuId(null);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-50"
                    >
                      <History className="h-4 w-4" /> View History
                    </button>
                    <button
                      type="button"
                      onClick={() => setOpenMenuId(null)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
                    >
                      <Trash2 className="h-4 w-4" /> Remove
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={10} className="px-4 py-10 text-center text-sm text-gray-400">
                No items match your filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
