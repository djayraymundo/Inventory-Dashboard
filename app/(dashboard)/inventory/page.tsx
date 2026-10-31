"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import TopBar from "@/components/TopBar";
import InventoryTable from "@/components/InventoryTable";
import Pagination from "@/components/Pagination";
import DetailPanel from "@/components/DetailPanel";
import AddItemModal from "@/components/AddItemModal";
import { NewInventoryItem, useInventory } from "@/lib/inventory-context";

const PAGE_SIZE = 10;

export default function InventoryPage() {
  const { items, addItem, updateQuantity, addNote } = useInventory();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [addOpen, setAddOpen] = useState(false);

  const locations = useMemo(
    () => Array.from(new Set(items.map((item) => item.location))).sort(),
    [items]
  );
  const categories = useMemo(
    () => Array.from(new Set(items.map((item) => item.category))).sort(),
    [items]
  );

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;
    return items.filter(
      (item) =>
        item.sku.toLowerCase().includes(query) ||
        item.name.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.batchNumber.toLowerCase().includes(query)
    );
  }, [items, search]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const selectedItem = items.find((item) => item.id === selectedItemId) ?? null;

  function handleSearch(query: string) {
    setSearch(query);
    setPage(1);
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function toggleSelectAll() {
    const idsOnPage = paginatedItems.map((item) => item.id);
    const allSelected = idsOnPage.every((id) => selectedIds.includes(id));
    setSelectedIds((prev) =>
      allSelected
        ? prev.filter((id) => !idsOnPage.includes(id))
        : Array.from(new Set([...prev, ...idsOnPage]))
    );
  }

  async function handleAddItem(data: NewInventoryItem) {
    try {
      const item = await addItem(data);
      setAddOpen(false);
      setPage(1);
      setSelectedItemId(item.id);
    } catch (error) {
      console.error("Failed to add item", error);
      alert("Hindi na-save ang bagong item. Subukan ulit.");
    }
  }

  return (
    <>
      <TopBar onSearch={handleSearch} />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
            <p className="mt-1 text-sm text-gray-500">
              Kumpletong listahan ng lahat ng items ({items.length} total).
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="flex h-9 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Item
          </button>
        </div>

        <InventoryTable
          items={paginatedItems}
          selectedItemId={selectedItemId}
          onSelectItem={(item) => setSelectedItemId(item.id)}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onToggleSelectAll={toggleSelectAll}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredItems.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </main>

      <DetailPanel
        item={selectedItem}
        onClose={() => setSelectedItemId(null)}
        onUpdateQuantity={updateQuantity}
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
