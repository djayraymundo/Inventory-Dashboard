"use client";

import { useEffect, useState } from "react";
import {
  X,
  Package,
  MapPin,
  Building2,
  Boxes,
  StickyNote,
  History as HistoryIcon,
} from "lucide-react";
import { HistoryEventType, InventoryItem } from "@/lib/types";
import StatusBadge from "./StatusBadge";

interface DetailPanelProps {
  item: InventoryItem | null;
  onClose: () => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onAddNote: (id: string, note: string) => void;
}

const historyDotStyles: Record<HistoryEventType, string> = {
  Received: "bg-emerald-500",
  Moved: "bg-blue-500",
  Adjusted: "bg-amber-500",
  Restocked: "bg-purple-500",
  Note: "bg-gray-400",
};

export default function DetailPanel({ item, onClose, onUpdateQuantity, onAddNote }: DetailPanelProps) {
  const [editingQty, setEditingQty] = useState(false);
  const [qtyInput, setQtyInput] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [noteInput, setNoteInput] = useState("");
  const [showFullHistory, setShowFullHistory] = useState(false);

  useEffect(() => {
    setEditingQty(false);
    setAddingNote(false);
    setShowFullHistory(false);
    setNoteInput("");
    setQtyInput(item ? String(item.quantity) : "");
  }, [item?.id]);

  if (!item) return null;

  const maxScale = Math.max(item.quantity, item.minThreshold * 2, 1);
  const qtyPercent = Math.min(100, (item.quantity / maxScale) * 100);
  const thresholdPercent = Math.min(100, (item.minThreshold / maxScale) * 100);
  const barColor =
    item.status === "In Stock"
      ? "bg-emerald-500"
      : item.status === "Low Stock"
      ? "bg-amber-500"
      : "bg-red-500";

  const visibleHistory = showFullHistory ? item.history : item.history.slice(0, 3);

  return (
    <>
      <div className="fixed inset-0 z-20 bg-black/20 lg:hidden" onClick={onClose} />
      <aside className="fixed inset-y-0 right-0 z-30 flex w-full max-w-sm flex-col border-l border-gray-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="text-base font-semibold text-gray-900">Item Details</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="mb-4 flex h-40 items-center justify-center rounded-xl bg-gray-100">
            <Package className="h-12 w-12 text-gray-300" />
          </div>

          <div className="mb-1 flex items-start justify-between gap-2">
            <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
            <StatusBadge status={item.status} />
          </div>
          <p className="mb-4 text-sm text-gray-400">{item.itemNumber}</p>

          <dl className="mb-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-xs uppercase text-gray-400">SKU</dt>
              <dd className="font-medium text-gray-700">{item.sku}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-gray-400">Batch #</dt>
              <dd className="font-medium text-gray-700">{item.batchNumber}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-gray-400">Category</dt>
              <dd className="font-medium text-gray-700">{item.category}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-gray-400">Location</dt>
              <dd className="flex items-center gap-1 font-medium text-gray-700">
                <MapPin className="h-3.5 w-3.5 text-gray-400" />
                {item.location}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-gray-400">Supplier</dt>
              <dd className="flex items-center gap-1 font-medium text-gray-700">
                <Building2 className="h-3.5 w-3.5 text-gray-400" />
                {item.supplier}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-gray-400">Quantity</dt>
              <dd className="font-medium text-gray-700">
                {item.quantity} {item.unit}
              </dd>
            </div>
          </dl>

          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">Stock Level</span>
              <span className="text-gray-500">
                {item.quantity} / min {item.minThreshold} {item.unit}
              </span>
            </div>
            <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full ${barColor} transition-all`}
                style={{ width: `${qtyPercent}%` }}
              />
              <div
                className="absolute top-0 h-full w-0.5 bg-gray-500"
                style={{ left: `${thresholdPercent}%` }}
                title="Minimum threshold"
              />
            </div>
            <div className="mt-1 flex justify-between text-[11px] text-gray-400">
              <span>0</span>
              <span>Threshold: {item.minThreshold}</span>
            </div>
          </div>

          <div className="mb-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">Activity History</span>
              {item.history.length > 3 && (
                <button
                  type="button"
                  onClick={() => setShowFullHistory((prev) => !prev)}
                  className="text-xs font-medium text-blue-600 hover:underline"
                >
                  {showFullHistory ? "Show less" : "Show all"}
                </button>
              )}
            </div>
            <ol className="space-y-4 border-l border-gray-200 pl-4">
              {visibleHistory.map((event) => (
                <li key={event.id} className="relative">
                  <span
                    className={`absolute -left-[21px] top-1 h-3 w-3 rounded-full ring-4 ring-white ${historyDotStyles[event.type]}`}
                  />
                  <p className="text-sm font-medium text-gray-700">{event.type}</p>
                  <p className="text-xs text-gray-500">{event.description}</p>
                  <p className="mt-0.5 text-[11px] text-gray-400">
                    {event.date} • {event.user}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          {editingQty && (
            <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
              <label className="mb-1 block text-xs font-medium text-gray-500">New Quantity</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={0}
                  value={qtyInput}
                  onChange={(e) => setQtyInput(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={() => {
                    const value = Number(qtyInput);
                    if (!Number.isNaN(value) && value >= 0) {
                      onUpdateQuantity(item.id, value);
                      setEditingQty(false);
                    }
                  }}
                  className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {addingNote && (
            <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
              <label className="mb-1 block text-xs font-medium text-gray-500">Note</label>
              <textarea
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              <button
                type="button"
                onClick={() => {
                  if (noteInput.trim()) {
                    onAddNote(item.id, noteInput.trim());
                    setNoteInput("");
                    setAddingNote(false);
                  }
                }}
                className="mt-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                Save Note
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 border-t border-gray-200 p-4">
          <button
            type="button"
            onClick={() => {
              setEditingQty((prev) => !prev);
              setAddingNote(false);
            }}
            className="flex flex-col items-center gap-1 rounded-lg border border-gray-200 px-2 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50"
          >
            <Boxes className="h-4 w-4" /> Update Qty
          </button>
          <button
            type="button"
            onClick={() => {
              setAddingNote((prev) => !prev);
              setEditingQty(false);
            }}
            className="flex flex-col items-center gap-1 rounded-lg border border-gray-200 px-2 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50"
          >
            <StickyNote className="h-4 w-4" /> Add Note
          </button>
          <button
            type="button"
            onClick={() => setShowFullHistory(true)}
            className="flex flex-col items-center gap-1 rounded-lg border border-gray-200 px-2 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50"
          >
            <HistoryIcon className="h-4 w-4" /> View History
          </button>
        </div>
      </aside>
    </>
  );
}
