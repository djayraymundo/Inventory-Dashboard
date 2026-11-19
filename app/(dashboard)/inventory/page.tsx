"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import TopBar from "@/components/TopBar";
import PageHeader from "@/components/PageHeader";
import InventoryDataTable from "@/components/InventoryDataTable";
import DetailPanel from "@/components/DetailPanel";
import AddItemModal from "@/components/AddItemModal";
import { NewInventoryItem, useInventory } from "@/lib/inventory-context";

export default function InventoryPage() {
  const { items, addItem, updateQuantity, updateUnitCost, addNote } = useInventory();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const locations = useMemo(
    () => Array.from(new Set(items.map((item) => item.location))).sort(),
    [items]
  );
  const categories = useMemo(
    () => Array.from(new Set(items.map((item) => item.category))).sort(),
    [items]
  );

  const selectedItem = items.find((item) => item.id === selectedItemId) ?? null;

  async function handleAddItem(data: NewInventoryItem) {
    try {
      const item = await addItem(data);
      setAddOpen(false);
      setSelectedItemId(item.id);
    } catch (error) {
      console.error("Failed to add item", error);
      alert("Hindi na-save ang bagong item. Subukan ulit.");
    }
  }

  return (
    <>
      <TopBar />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <PageHeader
          title="Inventory"
          description={`Kumpletong listahan ng lahat ng items (${items.length} total).`}
          actions={
            <button
              type="button"
              onClick={() => setAddOpen(true)}
              className="flex h-9 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-medium text-white shadow-xs transition-colors hover:bg-brand-strong"
            >
              <Plus className="h-4 w-4" />
              Add Item
            </button>
          }
        />

        <InventoryDataTable
          items={items}
          selectedItemId={selectedItemId}
          onSelectItem={(item) => setSelectedItemId(item.id)}
        />
      </main>

      <DetailPanel
        item={selectedItem}
        onClose={() => setSelectedItemId(null)}
        onUpdateQuantity={updateQuantity}
        onUpdateUnitCost={updateUnitCost}
        onAddNote={addNote}
      />

      <AddItemModal
        open={addOpen}
        categories={categories}
        locations={locations}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAddItem}
      />
    </>
  );
}
