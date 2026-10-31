import type { SupabaseClient } from "@supabase/supabase-js";
import { HistoryEvent, InventoryItem, StockStatus } from "./types";

export function computeStatus(quantity: number, minThreshold: number): StockStatus {
  if (quantity <= 0) return "Out of Stock";
  if (quantity <= minThreshold) return "Low Stock";
  return "In Stock";
}

// Column names as stored in Supabase (see supabase/schema.sql).
export interface HistoryRow {
  id: string;
  type: HistoryEvent["type"];
  description: string;
  date: string;
  user_name: string;
  created_at: string;
}

export interface ItemRow {
  id: string;
  item_number: string;
  name: string;
  sku: string;
  batch_number: string;
  category: string;
  location: string;
  quantity: number;
  unit: string;
  min_threshold: number;
  supplier: string;
  last_updated: string;
  item_history?: HistoryRow[];
}

export const ITEM_SELECT = "*, item_history(id, type, description, date, user_name, created_at)";

export function toHistoryEvent(row: HistoryRow): HistoryEvent {
  return {
    id: row.id,
    type: row.type,
    description: row.description,
    date: row.date,
    user: row.user_name,
  };
}

export function toInventoryItem(row: ItemRow): InventoryItem {
  const history = [...(row.item_history ?? [])]
    .sort((a, b) => b.date.localeCompare(a.date) || b.created_at.localeCompare(a.created_at))
    .map(toHistoryEvent);

  return {
    id: row.id,
    itemNumber: row.item_number,
    name: row.name,
    sku: row.sku,
    batchNumber: row.batch_number,
    category: row.category,
    location: row.location,
    quantity: row.quantity,
    unit: row.unit,
    minThreshold: row.min_threshold,
    status: computeStatus(row.quantity, row.min_threshold),
    supplier: row.supplier,
    lastUpdated: row.last_updated,
    history,
  };
}

export async function fetchInventory(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("inventory_items")
    .select(ITEM_SELECT)
    .order("item_number");
  if (error) throw error;
  return (data as ItemRow[]).map(toInventoryItem);
}
