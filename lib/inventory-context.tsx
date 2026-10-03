"use client";

import { createContext, useContext, useState } from "react";
import { computeStatus, inventoryItems as initialItems } from "./mock-data";
import { HistoryEvent, InventoryItem } from "./types";

export type NewInventoryItem = Omit<
  InventoryItem,
  "id" | "itemNumber" | "status" | "lastUpdated" | "history"
>;

interface InventoryContextValue {
  items: InventoryItem[];
  addItem: (item: NewInventoryItem) => InventoryItem;
  updateQuantity: (id: string, quantity: number) => void;
  addNote: (id: string, note: string) => void;
}

const InventoryContext = createContext<InventoryContextValue | null>(null);

function today() {
  return new Date().toISOString().slice(0, 10);
}

function historyEvent(id: string, type: HistoryEvent["type"], description: string): HistoryEvent {
  return { id: `${id}-${Date.now()}`, type, description, date: today(), user: "You" };
}

function nextItemNumber(items: InventoryItem[]) {
  const max = items.reduce((highest, item) => {
    const num = Number(item.itemNumber.replace(/\D/g, ""));
    return Number.isNaN(num) ? highest : Math.max(highest, num);
  }, 1000);
  return `ITM-${max + 1}`;
}

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<InventoryItem[]>(initialItems);

  function addItem(data: NewInventoryItem) {
    const id = `inv-${Date.now()}`;
    const item: InventoryItem = {
      ...data,
      id,
      itemNumber: nextItemNumber(items),
      status: computeStatus(data.quantity, data.minThreshold),
      lastUpdated: today(),
      history: [
        historyEvent(id, "Received", `Item added with initial stock of ${data.quantity} ${data.unit}`),
      ],
    };
    setItems((prev) => [item, ...prev]);
    return item;
  }

  function updateQuantity(id: string, quantity: number) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity,
              status: computeStatus(quantity, item.minThreshold),
              lastUpdated: today(),
              history: [
                historyEvent(id, "Adjusted", `Quantity updated to ${quantity} ${item.unit}`),
                ...item.history,
              ],
            }
          : item
      )
    );
  }

  function addNote(id: string, note: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, history: [historyEvent(id, "Note", note), ...item.history] }
          : item
      )
    );
  }

  return (
    <InventoryContext.Provider value={{ items, addItem, updateQuantity, addNote }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) throw new Error("useInventory must be used within an InventoryProvider");
  return context;
}
