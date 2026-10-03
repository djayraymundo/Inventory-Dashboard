"use client";

import { useMemo, useState } from "react";
import { Boxes, AlertTriangle, PackageSearch, Truck } from "lucide-react";
import TopBar from "@/components/TopBar";
import StatCard from "@/components/StatCard";
import FilterBar, { Filters, emptyFilters } from "@/components/FilterBar";
import InventoryTable from "@/components/InventoryTable";
import Pagination from "@/components/Pagination";
import DetailPanel from "@/components/DetailPanel";
import { useInventory } from "@/lib/inventory-context";

const PAGE_SIZE = 8;
const STATUSES = ["In Stock", "Low Stock", "Out of Stock"];

export default function DashboardPage() {
  const { items, updateQuantity, addNote } = useInventory();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [page, setPage] = useState(1);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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
    return items.filter((item) => {
      const matchesSearch =
        query === "" ||
        item.sku.toLowerCase().includes(query) ||
        item.name.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.batchNumber.toLowerCase().includes(query);

      const matchesLocation = filters.location === "All" || item.location === filters.location;
      const matchesCategory = filters.category === "All" || item.category === filters.category;
      const matchesStatus = filters.status === "All" || item.status === filters.status;

      const updatedDate = new Date(item.lastUpdated);
      const matchesFrom = !filters.dateFrom || updatedDate >= new Date(filters.dateFrom);
      const matchesTo = !filters.dateTo || updatedDate <= new Date(filters.dateTo);

      return (
        matchesSearch && matchesLocation && matchesCategory && matchesStatus && matchesFrom && matchesTo
      );
    });
  }, [items, search, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const selectedItem = items.find((item) => item.id === selectedItemId) ?? null;

  const totalItemsCount = items.length;
  const lowStockCount = items.filter((item) => item.status === "Low Stock").length;
  const outOfStockCount = items.filter((item) => item.status === "Out of Stock").length;
  const pendingRestockCount = items.filter(
    (item) => item.status === "Low Stock" || item.status === "Out of Stock"
  ).length;
  const inTransitCount = items.filter((item) => item.history[0]?.type === "Restocked").length;

  function handleApplyFilters(next: Filters) {
    setFilters(next);
    setPage(1);
  }

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

  return (
    <>
      <TopBar onSearch={handleSearch} />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Overview ng kalagayan ng imbentaryo sa lahat ng warehouse at store location.
          </p>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Items"
            value={totalItemsCount}
            icon={Boxes}
            context="Across all locations"
            accent="blue"
          />
          <StatCard
            title="Low Stock Items"
            value={lowStockCount}
            icon={AlertTriangle}
            context={`${outOfStockCount} out of stock`}
            accent="amber"
          />
          <StatCard
            title="Pending Restock"
            value={pendingRestockCount}
            icon={PackageSearch}
            context="Needs purchase order"
            accent="red"
          />
          <StatCard
            title="In Transit"
            value={inTransitCount}
            icon={Truck}
            context="Expected this week"
            accent="emerald"
          />
        </div>

        <div className="mb-6">
          <FilterBar
            locations={locations}
            categories={categories}
            statuses={STATUSES}
            onApply={handleApplyFilters}
          />
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
    </>
  );
}
