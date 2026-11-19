"use client";

import { useEffect, useState } from "react";
import { NewInventoryItem } from "@/lib/inventory-context";
import Modal, { ModalBody, ModalFooter, modalButton, modalField } from "./Modal";

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

const fieldClass = modalField;

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
    <Modal open={open} onClose={onClose} title="Add Inventory Item">
      <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
        <ModalBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Item Name" required className="sm:col-span-2">
            <input
              data-autofocus
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
        </ModalBody>

        <ModalFooter>
          <p role="alert" className="mr-auto text-sm text-red-700">
            {error}
          </p>
          <button type="button" onClick={onClose} className={modalButton.secondary}>
            Cancel
          </button>
          <button type="submit" className={modalButton.primary}>
            Add Item
          </button>
        </ModalFooter>
      </form>
    </Modal>
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
      <span className="mb-1 block text-xs font-medium text-ink-muted">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      {children}
    </label>
  );
}
