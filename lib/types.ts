export type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";

export type HistoryEventType = "Received" | "Moved" | "Adjusted" | "Restocked" | "Note";

export interface HistoryEvent {
  id: string;
  type: HistoryEventType;
  description: string;
  date: string;
  user: string;
}

export interface InventoryItem {
  id: string;
  itemNumber: string;
  name: string;
  sku: string;
  batchNumber: string;
  category: string;
  location: string;
  quantity: number;
  unit: string;
  minThreshold: number;
  status: StockStatus;
  supplier: string;
  lastUpdated: string;
  history: HistoryEvent[];
}
