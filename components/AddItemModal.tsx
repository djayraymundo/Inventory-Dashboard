"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { NewInventoryItem } from "@/lib/inventory-context";

interface AddItemModalProps {
  open: boolean;
  categories: string[];
  locations: string[];
  onClose: () => void;
  onSubmit: (item: NewInventoryItem) => void;
}

interface FormState {
  name: string;
  sku: string;
  batchNumber: string;
  category: string;
  location: string;
  quantity: string;
  unit: string;
  minThreshold: string;
  supplier: string;
}

const emptyForm: FormState = {
  name: "",
  sku: "",
  batchNumber: "",
  category: "",
  location: "",
  quantity: "",
  unit: "pcs",
  minThreshold: "",
  supplier: "",
};

const fieldClass =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100";

export default function AddItemModal({
  open,
  categories,
  locations,
  onClose,
  onSubmit,
}: AddItemModalProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm(emptyForm);
      setError("");
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const quantity = Number(form.quantity);
    const minThreshold = Number(form.minThreshold);
    const required = [form.name, form.sku, form.category, form.location, form.unit, form.supplier];

    if (required.some((value) => value.trim() === "")) {
      setError("Please fill in all required fields.");
      return;
    }
    if (form.quantity === "" || !Number.isInteger(quantity) || quantity < 0) {
      setError("Quantity must be a whole number of 0 or more.");
      return;
    }
    if (form.minThreshold === "" || !Number.isInteger(minThreshold) || minThreshold < 0) {
      setError("Min. threshold must be a whole number of 0 or more.");
      return;
    }

    onSubmit({
      name: form.name.trim(),
      sku: form.sku.trim().toUpperCase(),
      batchNumber: form.batchNumber.trim() || "—",
      category: form.category.trim(),
      location: form.location.trim(),
      quantity,
      unit: form.unit.trim(),
      minThreshold,
      supplier: form.supplier.trim(),
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="text-base font-semibold text-gray-900">Add Inventory Item</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-4 overflow-y-auto px-5 py-5 sm:grid-cols-2">
          <Field label="Item Name" required className="sm:col-span-2">
            <input
              autoFocus
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="e.g. Wireless Barcode Scanner"
              className={fieldClass}
            />
          </Field>
          <Field label="SKU" required>
            <input
              value={form.sku}
              onChange={(e) => update("sku", e.target.value)}
              placeholder="e.g. ELEC-BCS-100"
              className={fieldClass}
            />
          </Field>
          <Field label="Batch #">
            <input
              value={form.batchNumber}
              onChange={(e) => update("batchNumber", e.target.value)}
              placeholder="e.g. BATCH-2026-A1"
              className={fieldClass}
            />
          </Field>
          <Field label="Category" required>
            <input
              list="add-item-categories"
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
              placeholder="Select or type"
              className={fieldClass}
            />
            <datalist id="add-item-categories">
              {categories.map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>
          </Field>
          <Field label="Location" required>
            <input
              list="add-item-locations"
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="Select or type"
              className={fieldClass}
            />
            <datalist id="add-item-locations">
              {locations.map((location) => (
                <option key={location} value={location} />
              ))}
            </datalist>
          </Field>
          <Field label="Quantity" required>
            <input
              type="number"
              min={0}
              value={form.quantity}
              onChange={(e) => update("quantity", e.target.value)}
              className={fieldClass}
            />
          </Field>
          <Field label="Unit" required>
            <input
              value={form.unit}
              onChange={(e) => update("unit", e.target.value)}
              placeholder="pcs, boxes, reams…"
              className={fieldClass}
            />
          </Field>
          <Field label="Min. Threshold" required>
            <input
              type="number"
              min={0}
              value={form.minThreshold}
              onChange={(e) => update("minThreshold", e.target.value)}
              className={fieldClass}
            />
          </Field>
          <Field label="Supplier" required>
            <input
              value={form.supplier}
              onChange={(e) => update("supplier", e.target.value)}
              placeholder="e.g. TechSource Manila"
              className={fieldClass}
            />
          </Field>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-gray-200 px-5 py-4">
          <p className="text-sm text-red-600">{error}</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Add Item
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  required,
  className = "",
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-xs font-medium text-gray-500">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      {children}
    </label>
  );
}
