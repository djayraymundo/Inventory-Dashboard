"use client";

import { useState } from "react";
import { AlertTriangle, Boxes, PackageX, Wallet } from "lucide-react";
import TopBar from "@/components/TopBar";
import PageHeader from "@/components/PageHeader";
import InventoryDataTable from "@/components/InventoryDataTable";
import DetailPanel from "@/components/DetailPanel";
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useInventory } from "@/lib/inventory-context";

const peso = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" });

export default function DashboardPage() {
  const { items, updateQuantity, updateUnitCost, addNote } = useInventory();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const selectedItem = items.find((item) => item.id === selectedItemId) ?? null;

  const lowStockCount = items.filter((item) => item.status === "Low Stock").length;
  const outOfStockCount = items.filter((item) => item.status === "Out of Stock").length;
  const totalValue = items.reduce((sum, item) => sum + item.quantity * item.unitCost, 0);

  const kpis = [
    { title: "Total SKUs", value: items.length.toLocaleString(), icon: Boxes, note: "Across all locations" },
    { title: "Low stock", value: lowStockCount.toLocaleString(), icon: AlertTriangle, note: "At or below min. threshold" },
    { title: "Out of stock", value: outOfStockCount.toLocaleString(), icon: PackageX, note: "Zero on hand" },
    { title: "Total inventory value", value: peso.format(totalValue), icon: Wallet, note: "Quantity × unit cost" },
  ];

  return (
    <>
      <TopBar />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <PageHeader
          title="Dashboard"
          description="Overview ng kalagayan ng imbentaryo sa lahat ng warehouse at store location."
        />

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map(({ title, value, icon: Icon, note }) => (
            <Card key={title}>
              <CardHeader>
                <CardDescription>{title}</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums sm:text-3xl">{value}</CardTitle>
                <CardAction>
                  <Icon className="size-5 text-muted-foreground" aria-hidden="true" />
                </CardAction>
                <p className="text-xs text-muted-foreground">{note}</p>
              </CardHeader>
            </Card>
          ))}
        </div>

        <InventoryDataTable
          items={items}
          selectedItemId={selectedItemId}
          onSelectItem={(item) => setSelectedItemId(item.id)}
          pageSize={8}
        />
      </main>

      <DetailPanel
        item={selectedItem}
        onClose={() => setSelectedItemId(null)}
        onUpdateQuantity={updateQuantity}
        onUpdateUnitCost={updateUnitCost}
        onAddNote={addNote}
      />
    </>
  );
}
