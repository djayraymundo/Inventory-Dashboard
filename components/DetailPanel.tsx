"use client";

import { useEffect, useId, useState } from "react";
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
  onUpdateUnitCost: (id: string, unitCost: number) => void;
  onAddNote: (id: string, note: string) => void;
}

const historyDotStyles: Record<HistoryEventType, string> = {
  Received: "bg-emerald-500",
  Moved: "bg-blue-500",
  Adjusted: "bg-amber-500",
  Restocked: "bg-purple-500",
  Note: "bg-slate-400",
};

const inputClass =
  "w-full rounded-lg border border-line bg-surface px-3 py-1.5 text-sm text-ink shadow-xs focus:border-brand focus:outline-hidden focus:ring-2 focus:ring-brand/20";
const saveButtonClass =
  "rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white shadow-xs hover:bg-brand-strong";
const actionButtonClass =
  "flex flex-col items-center gap-1 rounded-lg border border-line px-2 py-2 text-xs font-medium text-ink-muted transition-colors hover:bg-surface-muted aria-expanded:border-brand aria-expanded:bg-brand-soft aria-expanded:text-brand";

const peso = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" });

export default function DetailPanel({
  item,
  onClose,
  onUpdateQuantity,
  onUpdateUnitCost,
  onAddNote,
}: DetailPanelProps) {
  const [editingQty, setEditingQty] = useState(false);
  const [qtyInput, setQtyInput] = useState("");
  const [editingCost, setEditingCost] = useState(false);
  const [costInput, setCostInput] = useState("");
  const costId = useId();
  const [addingNote, setAddingNote] = useState(false);
  const [noteInput, setNoteInput] = useState("");
  const [showFullHistory, setShowFullHistory] = useState(false);
  const qtyId = useId();
  const noteId = useId();

  useEffect(() => {
    setEditingQty(false);
    setEditingCost(false);
    setAddingNote(false);
    setShowFullHistory(false);
    setNoteInput("");
    setQtyInput(item ? String(item.quantity) : "");
    setCostInput(item ? String(item.unitCost) : "");
  }, [item?.id]);

  // Non-modal panel: Esc closes it, unless Esc is meant for an open menu or dialog on top.
  const isOpen = !!item;
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key !== "Escape" || document.querySelector(":popover-open, dialog[open]")) return;
      onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

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
      <div aria-hidden="true" className="fixed inset-0 z-20 bg-slate-950/30 lg:hidden" onClick={onClose} />
      <aside
        aria-label="Item details"
        className="fixed inset-y-0 right-0 z-30 flex w-full flex-col border-l border-line bg-surface shadow-2xl sm:max-w-md"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-base font-semibold text-ink">Item Details</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close item details"
            className="-m-1 rounded-lg p-1.5 text-ink-subtle hover:bg-surface-muted hover:text-ink"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="mb-5 flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-surface-muted ring-1 ring-inset ring-line">
              <Package className="h-7 w-7 text-ink-subtle" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold leading-snug text-ink">{item.name}</h3>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-ink-subtle">{item.itemNumber}</span>
                <StatusBadge status={item.status} />
              </div>
            </div>
          </div>

          <dl className="mb-6 grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl border border-line p-4 text-sm">
            <div>
              <dt className="text-xs text-ink-subtle">SKU</dt>
              <dd className="font-mono text-xs font-medium text-ink">{item.sku}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-subtle">Batch #</dt>
              <dd className="font-mono text-xs font-medium text-ink">{item.batchNumber}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-subtle">Category</dt>
              <dd className="font-medium text-ink">{item.category}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-subtle">Quantity</dt>
              <dd className="font-medium tabular-nums text-ink">
                {item.quantity} {item.unit}
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="text-xs text-ink-subtle">Location</dt>
              <dd className="flex items-center gap-1 font-medium text-ink">
                <MapPin className="h-3.5 w-3.5 text-ink-subtle" aria-hidden="true" />
                {item.location}
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="text-xs text-ink-subtle">Supplier</dt>
              <dd className="flex items-center gap-1 font-medium text-ink">
                <Building2 className="h-3.5 w-3.5 text-ink-subtle" aria-hidden="true" />
                {item.supplier}
              </dd>
            </div>
            <div className="col-span-2 flex items-end justify-between gap-2">
              <div>
                <dt className="text-xs text-ink-subtle">Unit Cost</dt>
                <dd className="font-medium tabular-nums text-ink">
                  {peso.format(item.unitCost)}
                  <span className="ml-2 text-xs font-normal text-ink-subtle">
                    Value {peso.format(item.unitCost * item.quantity)}
                  </span>
                </dd>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingCost((prev) => !prev);
                  setCostInput(String(item.unitCost));
                }}
                aria-expanded={editingCost}
                className="text-xs font-medium text-brand hover:underline"
              >
                Edit cost
              </button>
            </div>
          </dl>

          {editingCost && (
            <div className="mb-6 rounded-xl border border-line bg-surface-muted/50 p-3">
              <label htmlFor={costId} className="mb-1 block text-xs font-medium text-ink-muted">
                Unit Cost (₱)
              </label>
              <div className="flex gap-2">
                <input
                  id={costId}
                  type="number"
                  min={0}
                  step="0.01"
                  value={costInput}
                  onChange={(e) => setCostInput(e.target.value)}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => {
                    const value = Number(costInput);
                    if (costInput !== "" && Number.isFinite(value) && value >= 0) {
                      onUpdateUnitCost(item.id, value);
                      setEditingCost(false);
                    }
                  }}
                  className={saveButtonClass}
                >
                  Save
                </button>
              </div>
            </div>
          )}

          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-ink">Stock Level</span>
              <span className="tabular-nums text-ink-muted">
                {item.quantity} / min {item.minThreshold} {item.unit}
              </span>
            </div>
            <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-surface-muted">
              <div
                className={`h-full rounded-full ${barColor} transition-all motion-reduce:transition-none`}
                style={{ width: `${qtyPercent}%` }}
              />
              <div
                className="absolute top-0 h-full w-0.5 bg-ink-muted"
                style={{ left: `${thresholdPercent}%` }}
                title="Minimum threshold"
              />
            </div>
            <div className="mt-1 flex justify-between text-[11px] tabular-nums text-ink-subtle">
              <span>0</span>
              <span>Threshold: {item.minThreshold}</span>
            </div>
          </div>

          {editingQty && (
            <div className="mb-6 rounded-xl border border-line bg-surface-muted/50 p-3">
              <label htmlFor={qtyId} className="mb-1 block text-xs font-medium text-ink-muted">
                New Quantity
              </label>
              <div className="flex gap-2">
                <input
                  id={qtyId}
                  type="number"
                  min={0}
                  value={qtyInput}
                  onChange={(e) => setQtyInput(e.target.value)}
                  className={inputClass}
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
                  className={saveButtonClass}
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {addingNote && (
            <div className="mb-6 rounded-xl border border-line bg-surface-muted/50 p-3">
              <label htmlFor={noteId} className="mb-1 block text-xs font-medium text-ink-muted">
                Note
              </label>
              <textarea
                id={noteId}
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                rows={2}
                className={inputClass}
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
                className={`mt-2 ${saveButtonClass}`}
              >
                Save Note
              </button>
            </div>
          )}

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-ink">Activity History</h4>
              {item.history.length > 3 && (
                <button
                  type="button"
                  onClick={() => setShowFullHistory((prev) => !prev)}
                  aria-expanded={showFullHistory}
                  className="text-xs font-medium text-brand hover:underline"
                >
                  {showFullHistory ? "Show less" : "Show all"}
                </button>
              )}
            </div>
            <ol className="space-y-4 border-l border-line pl-4">
              {visibleHistory.map((event) => (
                <li key={event.id} className="relative">
                  <span
                    aria-hidden="true"
                    className={`absolute -left-[21px] top-1 h-3 w-3 rounded-full ring-4 ring-surface ${historyDotStyles[event.type]}`}
                  />
                  <p className="text-sm font-medium text-ink">{event.type}</p>
                  <p className="text-xs text-ink-muted">{event.description}</p>
                  <p className="mt-0.5 text-[11px] text-ink-subtle">
                    {event.date} • {event.user}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 border-t border-line bg-surface-muted/40 p-4">
          <button
            type="button"
            onClick={() => {
              setEditingQty((prev) => !prev);
              setAddingNote(false);
            }}
            aria-expanded={editingQty}
            className={actionButtonClass}
          >
            <Boxes className="h-4 w-4" aria-hidden="true" /> Update Qty
          </button>
          <button
            type="button"
            onClick={() => {
              setAddingNote((prev) => !prev);
              setEditingQty(false);
            }}
            aria-expanded={addingNote}
            className={actionButtonClass}
          >
            <StickyNote className="h-4 w-4" aria-hidden="true" /> Add Note
          </button>
          <button
            type="button"
            onClick={() => setShowFullHistory(true)}
            className={actionButtonClass}
          >
            <HistoryIcon className="h-4 w-4" aria-hidden="true" /> View History
          </button>
        </div>
      </aside>
    </>
  );
}
