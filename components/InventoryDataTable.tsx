"use client";

import { useMemo, useState } from "react";
import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_equalsString,
  filterFn_includesString,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_text,
  tableFeatures,
  useTable,
  type Column,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown, PackageSearch, Search } from "lucide-react";
import { InventoryItem } from "@/lib/types";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StatusBadge from "./StatusBadge";

const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { includesString: filterFn_includesString, equalsString: filterFn_equalsString },
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text, basic: sortFn_basic },
});

const col = createColumnHelper<typeof features, InventoryItem>();

const STATUS_ORDER = { "Out of Stock": 0, "Low Stock": 1, "In Stock": 2 };

function SortHeader({
  label,
  column,
  alignEnd,
}: {
  label: string;
  column: Pick<Column<typeof features, InventoryItem>, "getIsSorted" | "getToggleSortingHandler">;
  alignEnd?: boolean;
}) {
  const sorted = column.getIsSorted();
  const Icon = sorted === "asc" ? ArrowUp : sorted === "desc" ? ArrowDown : ArrowUpDown;
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={column.getToggleSortingHandler()}
      className={alignEnd ? "-mr-2.5 ml-auto flex" : "-ml-2.5"}
    >
      {label}
      <Icon className={sorted ? "text-foreground" : "text-muted-foreground"} />
    </Button>
  );
}

const columns = col.columns([
  col.accessor("itemNumber", {
    header: ({ column }) => <SortHeader label="Item #" column={column} />,
    cell: ({ getValue }) => <span className="font-mono text-xs text-muted-foreground">{getValue()}</span>,
    sortFn: "alphanumeric",
  }),
  col.accessor("name", {
    header: ({ column }) => <SortHeader label="Name" column={column} />,
    cell: ({ getValue }) => <span className="font-medium">{getValue()}</span>,
    sortFn: "text",
  }),
  // Both values in one accessor so the global search matches SKU and batch numbers.
  col.accessor((item) => `${item.sku} ${item.batchNumber}`, {
    id: "sku",
    header: "SKU / Batch #",
    cell: ({ row }) => (
      <div className="font-mono text-xs">
        <div className="text-muted-foreground">{row.original.sku}</div>
        <div className="text-muted-foreground/80">{row.original.batchNumber}</div>
      </div>
    ),
    enableSorting: false,
  }),
  col.accessor("category", {
    header: ({ column }) => <SortHeader label="Category" column={column} />,
    filterFn: "equalsString",
    sortFn: "text",
  }),
  col.accessor("location", {
    header: ({ column }) => <SortHeader label="Location" column={column} />,
    sortFn: "text",
  }),
  col.accessor("quantity", {
    header: ({ column }) => <SortHeader label="Quantity" column={column} alignEnd />,
    cell: ({ row }) => (
      <div className="text-right tabular-nums">
        {row.original.quantity} <span className="text-muted-foreground">{row.original.unit}</span>
      </div>
    ),
    sortFn: "basic",
  }),
  col.accessor("status", {
    header: ({ column }) => <SortHeader label="Status" column={column} />,
    cell: ({ getValue }) => <StatusBadge status={getValue()} />,
    sortFn: (a, b) => STATUS_ORDER[a.original.status] - STATUS_ORDER[b.original.status],
  }),
  col.accessor("lastUpdated", {
    header: ({ column }) => <SortHeader label="Last Updated" column={column} />,
    cell: ({ getValue }) => <span className="tabular-nums text-muted-foreground">{getValue()}</span>,
    sortFn: "text",
  }),
]);

interface InventoryDataTableProps {
  items: InventoryItem[];
  selectedItemId: string | null;
  onSelectItem: (item: InventoryItem) => void;
  pageSize?: number;
}

export default function InventoryDataTable({
  items,
  selectedItemId,
  onSelectItem,
  pageSize = 10,
}: InventoryDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize });

  const categories = useMemo(
    () => Array.from(new Set(items.map((item) => item.category))).sort(),
    [items]
  );

  const table = useTable({
    features,
    data: items,
    columns,
    getRowId: (item) => item.id,
    globalFilterFn: "includesString",
    // Edits from the detail panel replace `items`; keep the user on their current page.
    autoResetPageIndex: false,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
    },
  });

  const category = (table.getColumn("category")?.getFilterValue() as string | undefined) ?? "";
  const filteredCount = table.getFilteredRowModel().rows.length;
  const { pageIndex } = pagination;
  const rows = table.getRowModel().rows;
  const firstRow = filteredCount === 0 ? 0 : pageIndex * pageSize + 1;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <div role="search" className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={globalFilter}
            onChange={(e) => {
              setGlobalFilter(e.target.value);
              table.setPageIndex(0);
            }}
            placeholder="Search name, SKU, batch, location…"
            aria-label="Filter inventory table"
            className="pl-8"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className={buttonVariants({ variant: "outline" })}>
            {category || "All categories"}
            <ChevronDown />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuRadioGroup
              value={category}
              onValueChange={(value) => {
                table.getColumn("category")?.setFilterValue(value || undefined);
                table.setPageIndex(0);
              }}
            >
              <DropdownMenuRadioItem value="">All categories</DropdownMenuRadioItem>
              <DropdownMenuSeparator />
              {categories.map((name) => (
                <DropdownMenuRadioItem key={name} value={name}>
                  {name}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader className="bg-muted/60">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    aria-sort={
                      header.column.getIsSorted() === "asc"
                        ? "ascending"
                        : header.column.getIsSorted() === "desc"
                          ? "descending"
                          : undefined
                    }
                  >
                    {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.id === selectedItemId ? "selected" : undefined}
                  onClick={() => onSelectItem(row.original)}
                  // Rows open the detail panel from the keyboard too.
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelectItem(row.original);
                    }
                  }}
                  className="cursor-pointer focus-visible:bg-muted/50 focus-visible:outline-hidden"
                >
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="py-16 text-center">
                  <PackageSearch className="mx-auto size-10 text-muted-foreground" aria-hidden="true" />
                  <p className="mt-3 text-sm font-medium">No items match your filters</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Try clearing the category or changing your search.
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
        <p aria-live="polite">
          Showing <span className="font-medium text-foreground">{firstRow}</span>–
          <span className="font-medium text-foreground">{firstRow ? firstRow + rows.length - 1 : 0}</span> of{" "}
          <span className="font-medium text-foreground">{filteredCount}</span>
        </p>
        <div className="flex items-center gap-2">
          <span className="tabular-nums">
            Page {pageIndex + 1} of {Math.max(1, table.getPageCount())}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
