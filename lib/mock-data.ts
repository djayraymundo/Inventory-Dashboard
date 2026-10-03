import { InventoryItem, StockStatus } from "./types";

function computeStatus(quantity: number, minThreshold: number): StockStatus {
  if (quantity <= 0) return "Out of Stock";
  if (quantity <= minThreshold) return "Low Stock";
  return "In Stock";
}

interface RawItem {
  itemNumber: string;
  name: string;
  sku: string;
  batchNumber: string;
  category: string;
  location: string;
  quantity: number;
  unit: string;
  minThreshold: number;
  supplier: string;
  lastUpdated: string;
  history: InventoryItem["history"];
}

const rawItems: RawItem[] = [
  {
    itemNumber: "ITM-1001",
    name: "Wireless Barcode Scanner",
    sku: "ELEC-BCS-100",
    batchNumber: "BATCH-2024-A1",
    category: "Electronics",
    location: "Warehouse A - Aisle 1",
    quantity: 84,
    unit: "pcs",
    minThreshold: 20,
    supplier: "TechSource Manila",
    lastUpdated: "2026-09-10",
    history: [
      { id: "h1-1", type: "Received", description: "Restocked 40 units from supplier", date: "2026-09-10", user: "Mika Santos" },
      { id: "h1-2", type: "Moved", description: "Transferred from Warehouse B to Warehouse A", date: "2026-08-28", user: "Carlo Reyes" },
      { id: "h1-3", type: "Received", description: "Initial stock received", date: "2026-08-01", user: "Mika Santos" },
    ],
  },
  {
    itemNumber: "ITM-1002",
    name: "A4 Copy Paper (Ream)",
    sku: "OFF-PPR-210",
    batchNumber: "BATCH-2024-B7",
    category: "Office Supplies",
    location: "Warehouse A - Aisle 2",
    quantity: 12,
    unit: "reams",
    minThreshold: 25,
    supplier: "PaperWorks Trading",
    lastUpdated: "2026-09-12",
    history: [
      { id: "h2-1", type: "Adjusted", description: "Quantity adjusted after physical count", date: "2026-09-12", user: "Liza Torres" },
      { id: "h2-2", type: "Moved", description: "Moved 50 reams to Store Front", date: "2026-09-05", user: "Carlo Reyes" },
      { id: "h2-3", type: "Received", description: "Received 100 reams from supplier", date: "2026-08-15", user: "Mika Santos" },
    ],
  },
  {
    itemNumber: "ITM-1003",
    name: "Ergonomic Office Chair",
    sku: "FUR-CHR-330",
    batchNumber: "BATCH-2024-C3",
    category: "Furniture",
    location: "Warehouse B - Cold Storage",
    quantity: 0,
    unit: "pcs",
    minThreshold: 5,
    supplier: "OfficeFit Industries",
    lastUpdated: "2026-09-08",
    history: [
      { id: "h3-1", type: "Adjusted", description: "Marked as out of stock after fulfillment", date: "2026-09-08", user: "Liza Torres" },
      { id: "h3-2", type: "Moved", description: "Shipped 8 units to client site", date: "2026-09-01", user: "Carlo Reyes" },
      { id: "h3-3", type: "Received", description: "Initial batch received", date: "2026-07-20", user: "Mika Santos" },
    ],
  },
  {
    itemNumber: "ITM-1004",
    name: "Corrugated Shipping Boxes (M)",
    sku: "PKG-BOX-450",
    batchNumber: "BATCH-2024-D9",
    category: "Packaging",
    location: "Warehouse A - Aisle 3",
    quantity: 320,
    unit: "pcs",
    minThreshold: 100,
    supplier: "BoxPro Packaging",
    lastUpdated: "2026-09-14",
    history: [
      { id: "h4-1", type: "Restocked", description: "Restocked 200 units", date: "2026-09-14", user: "Mika Santos" },
      { id: "h4-2", type: "Moved", description: "Distributed to 3 outbound orders", date: "2026-09-09", user: "Carlo Reyes" },
    ],
  },
  {
    itemNumber: "ITM-1005",
    name: "Stainless Steel Bolts (M8)",
    sku: "RAW-BLT-088",
    batchNumber: "BATCH-2024-E2",
    category: "Raw Materials",
    location: "Warehouse C",
    quantity: 18,
    unit: "kg",
    minThreshold: 30,
    supplier: "Metal Alliance Corp",
    lastUpdated: "2026-09-11",
    history: [
      { id: "h5-1", type: "Adjusted", description: "Used 22kg for production run #114", date: "2026-09-11", user: "Liza Torres" },
      { id: "h5-2", type: "Received", description: "Received 40kg shipment", date: "2026-08-22", user: "Mika Santos" },
    ],
  },
  {
    itemNumber: "ITM-1006",
    name: "Bottled Water 500ml (Case)",
    sku: "FNB-WTR-500",
    batchNumber: "BATCH-2024-F4",
    category: "Food & Beverage",
    location: "Store Front",
    quantity: 56,
    unit: "cases",
    minThreshold: 15,
    supplier: "AquaPure Distribution",
    lastUpdated: "2026-09-13",
    history: [
      { id: "h6-1", type: "Received", description: "Weekly delivery received", date: "2026-09-13", user: "Mika Santos" },
      { id: "h6-2", type: "Moved", description: "Moved 10 cases to Store Front", date: "2026-09-06", user: "Carlo Reyes" },
    ],
  },
  {
    itemNumber: "ITM-1007",
    name: "USB-C Charging Cable 1m",
    sku: "ELEC-CBL-201",
    batchNumber: "BATCH-2024-G6",
    category: "Electronics",
    location: "Warehouse A - Aisle 1",
    quantity: 9,
    unit: "pcs",
    minThreshold: 25,
    supplier: "TechSource Manila",
    lastUpdated: "2026-09-15",
    history: [
      { id: "h7-1", type: "Adjusted", description: "Quantity adjusted after damage report", date: "2026-09-15", user: "Liza Torres" },
      { id: "h7-2", type: "Received", description: "Restocked 50 units", date: "2026-08-30", user: "Mika Santos" },
    ],
  },
  {
    itemNumber: "ITM-1008",
    name: "Whiteboard Markers (Set of 12)",
    sku: "OFF-MRK-112",
    batchNumber: "BATCH-2024-H8",
    category: "Office Supplies",
    location: "Warehouse A - Aisle 2",
    quantity: 47,
    unit: "sets",
    minThreshold: 10,
    supplier: "PaperWorks Trading",
    lastUpdated: "2026-09-07",
    history: [
      { id: "h8-1", type: "Received", description: "Received 30 sets from supplier", date: "2026-09-07", user: "Mika Santos" },
    ],
  },
  {
    itemNumber: "ITM-1009",
    name: "Stackable Storage Bin (Large)",
    sku: "FUR-BIN-500",
    batchNumber: "BATCH-2024-I1",
    category: "Furniture",
    location: "Warehouse B - Cold Storage",
    quantity: 3,
    unit: "pcs",
    minThreshold: 8,
    supplier: "OfficeFit Industries",
    lastUpdated: "2026-09-09",
    history: [
      { id: "h9-1", type: "Moved", description: "Moved 5 units to Warehouse C", date: "2026-09-09", user: "Carlo Reyes" },
      { id: "h9-2", type: "Received", description: "Initial stock received", date: "2026-08-05", user: "Mika Santos" },
    ],
  },
  {
    itemNumber: "ITM-1010",
    name: "Bubble Wrap Roll 100m",
    sku: "PKG-BWR-100",
    batchNumber: "BATCH-2024-J5",
    category: "Packaging",
    location: "Warehouse A - Aisle 3",
    quantity: 62,
    unit: "rolls",
    minThreshold: 20,
    supplier: "BoxPro Packaging",
    lastUpdated: "2026-09-06",
    history: [
      { id: "h10-1", type: "Received", description: "Restocked 40 rolls", date: "2026-09-06", user: "Mika Santos" },
    ],
  },
  {
    itemNumber: "ITM-1011",
    name: "Aluminum Sheet 2mm",
    sku: "RAW-ALU-200",
    batchNumber: "BATCH-2024-K7",
    category: "Raw Materials",
    location: "Warehouse C",
    quantity: 0,
    unit: "sheets",
    minThreshold: 10,
    supplier: "Metal Alliance Corp",
    lastUpdated: "2026-09-04",
    history: [
      { id: "h11-1", type: "Adjusted", description: "All remaining stock consumed", date: "2026-09-04", user: "Liza Torres" },
      { id: "h11-2", type: "Received", description: "Received 15 sheets", date: "2026-08-10", user: "Mika Santos" },
    ],
  },
  {
    itemNumber: "ITM-1012",
    name: "Instant Coffee Sachets (Box)",
    sku: "FNB-COF-024",
    batchNumber: "BATCH-2024-L9",
    category: "Food & Beverage",
    location: "Store Front",
    quantity: 21,
    unit: "boxes",
    minThreshold: 10,
    supplier: "AquaPure Distribution",
    lastUpdated: "2026-09-05",
    history: [
      { id: "h12-1", type: "Received", description: "Received 15 boxes", date: "2026-09-05", user: "Mika Santos" },
    ],
  },
  {
    itemNumber: "ITM-1013",
    name: "27-inch LED Monitor",
    sku: "ELEC-MON-270",
    batchNumber: "BATCH-2024-M2",
    category: "Electronics",
    location: "Warehouse A - Aisle 1",
    quantity: 14,
    unit: "pcs",
    minThreshold: 5,
    supplier: "TechSource Manila",
    lastUpdated: "2026-09-02",
    history: [
      { id: "h13-1", type: "Restocked", description: "Restocked 6 units", date: "2026-09-02", user: "Mika Santos" },
      { id: "h13-2", type: "Moved", description: "Shipped 4 units to branch office", date: "2026-08-25", user: "Carlo Reyes" },
    ],
  },
  {
    itemNumber: "ITM-1014",
    name: "Sticky Notes 3x3 (Pack of 12)",
    sku: "OFF-STN-303",
    batchNumber: "BATCH-2024-N4",
    category: "Office Supplies",
    location: "Store Front",
    quantity: 6,
    unit: "packs",
    minThreshold: 15,
    supplier: "PaperWorks Trading",
    lastUpdated: "2026-09-13",
    history: [
      { id: "h14-1", type: "Moved", description: "Moved 10 packs to Store Front", date: "2026-09-13", user: "Carlo Reyes" },
    ],
  },
  {
    itemNumber: "ITM-1015",
    name: "Adjustable Standing Desk",
    sku: "FUR-DSK-620",
    batchNumber: "BATCH-2024-O6",
    category: "Furniture",
    location: "Warehouse B - Cold Storage",
    quantity: 27,
    unit: "pcs",
    minThreshold: 6,
    supplier: "OfficeFit Industries",
    lastUpdated: "2026-08-30",
    history: [
      { id: "h15-1", type: "Received", description: "Received 12 units", date: "2026-08-30", user: "Mika Santos" },
    ],
  },
  {
    itemNumber: "ITM-1016",
    name: "Stretch Wrap Film 500mm",
    sku: "PKG-SWF-500",
    batchNumber: "BATCH-2024-P8",
    category: "Packaging",
    location: "Warehouse A - Aisle 3",
    quantity: 8,
    unit: "rolls",
    minThreshold: 15,
    supplier: "BoxPro Packaging",
    lastUpdated: "2026-09-15",
    history: [
      { id: "h16-1", type: "Adjusted", description: "Used 12 rolls for outbound shipments", date: "2026-09-15", user: "Liza Torres" },
      { id: "h16-2", type: "Received", description: "Received 10 rolls", date: "2026-08-18", user: "Mika Santos" },
    ],
  },
];

export const inventoryItems: InventoryItem[] = rawItems.map((item, index) => ({
  id: `inv-${index + 1}`,
  ...item,
  status: computeStatus(item.quantity, item.minThreshold),
}));
