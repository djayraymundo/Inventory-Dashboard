"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { ITEM_SELECT, HistoryRow, ItemRow, toHistoryEvent, toInventoryItem } from "./inventory-db";
import { useSession } from "./session-context";
import { createClient } from "./supabase/client";
import { HistoryEvent, InventoryItem } from "./types";

export type NewInventoryItem = Omit<
  InventoryItem,
  "id" | "itemNumber" | "status" | "lastUpdated" | "history"
>;

interface InventoryContextValue {
  items: InventoryItem[];
  addItem: (item: NewInventoryItem) => Promise<InventoryItem>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  addNote: (id: string, note: string) => Promise<void>;
}

const InventoryContext = createContext<InventoryContextValue | null>(null);

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function InventoryProvider({
  initialItems,
  children,
}: {
  initialItems: InventoryItem[];
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<InventoryItem[]>(initialItems);
  const supabase = useMemo(() => createClient(), []);
  const user = useSession();

  async function insertHistory(itemId: string, type: HistoryEvent["type"], description: string) {
    const { data, error } = await supabase
      .from("item_history")
      .insert({ item_id: itemId, type, description, date: today(), user_name: user.name })
      .select("id, type, description, date, user_name, created_at")
      .single();
    if (error) throw error;
    return toHistoryEvent(data as HistoryRow);
  }

  async function addItem(data: NewInventoryItem) {
    const { data: row, error } = await supabase
      .from("inventory_items")
      .insert({
        name: data.name,
        sku: data.sku,
        batch_number: data.batchNumber,
        category: data.category,
        location: data.location,
        quantity: data.quantity,
        unit: data.unit,
        min_threshold: data.minThreshold,
        supplier: data.supplier,
        last_updated: today(),
      })
      .select(ITEM_SELECT)
      .single();
    if (error) throw error;

    const event = await insertHistory(
      (row as ItemRow).id,
      "Received",
      `Item added with initial stock of ${data.quantity} ${data.unit}`
    );
    const item = { ...toInventoryItem(row as ItemRow), history: [event] };
    setItems((prev) => [item, ...prev]);
    return item;
  }

  async function updateQuantity(id: string, quantity: number) {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    try {
      const { data: row, error } = await supabase
        .from("inventory_items")
        .update({ quantity, last_updated: today() })
        .eq("id", id)
        .select(ITEM_SELECT)
        .single();
      if (error) throw error;
      const event = await insertHistory(id, "Adjusted", `Quantity updated to ${quantity} ${item.unit}`);

      const updated = toInventoryItem(row as ItemRow);
      updated.history = [event, ...updated.history];
      setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
    } catch (error) {
      console.error("Failed to update quantity", error);
      alert("Hindi na-save ang bagong quantity. Subukan ulit.");
    }
  }

  async function addNote(id: string, note: string) {
    try {
      const event = await insertHistory(id, "Note", note);
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, history: [event, ...item.history] } : item))
      );
    } catch (error) {
      console.error("Failed to add note", error);
      alert("Hindi na-save ang note. Subukan ulit.");
    }
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
