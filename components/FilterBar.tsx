"use client";

import { useState } from "react";
import { Filter, RotateCcw } from "lucide-react";

export interface Filters {
  location: string;
  category: string;
  status: string;
  dateFrom: string;
  dateTo: string;
}

interface FilterBarProps {
  locations: string[];
  categories: string[];
  statuses: string[];
  onApply: (filters: Filters) => void;
}

export const emptyFilters: Filters = {
  location: "All",
  category: "All",
  status: "All",
  dateFrom: "",
  dateTo: "",
};

const fieldClass =
  "h-9 w-full rounded-lg border border-line bg-surface px-3 text-sm text-ink shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 sm:w-40";

const dateFieldClass = `${fieldClass} sm:w-36`;

const buttonClass =
  "flex h-9 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors";

export default function FilterBar({ locations, categories, statuses, onApply }: FilterBarProps) {
  const [filters, setFilters] = useState<Filters>(emptyFilters);

  function update<K extends keyof Filters>(key: K, value: Filters[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function handleClear() {
    setFilters(emptyFilters);
    onApply(emptyFilters);
  }

  return (
    <div
      role="search"
      aria-label="Filter inventory"
      className="flex flex-wrap items-center gap-2 border-b border-line bg-surface-muted/40 p-4"
    >
      <select
        aria-label="Filter by location"
        value={filters.location}
        onChange={(e) => update("location", e.target.value)}
        className={fieldClass}
      >
        <option value="All">All Locations</option>
        {locations.map((location) => (
          <option key={location} value={location}>
            {location}
          </option>
        ))}
      </select>

      <select
        aria-label="Filter by category"
        value={filters.category}
        onChange={(e) => update("category", e.target.value)}
        className={fieldClass}
      >
        <option value="All">All Categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <select
        aria-label="Filter by status"
        value={filters.status}
        onChange={(e) => update("status", e.target.value)}
        className={fieldClass}
      >
        <option value="All">All Statuses</option>
        {statuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>

      <fieldset className="flex w-full items-center gap-2 sm:w-auto">
        <legend className="sr-only">Last updated date range</legend>
        <input
          type="date"
          aria-label="Last updated from"
          value={filters.dateFrom}
          onChange={(e) => update("dateFrom", e.target.value)}
          className={dateFieldClass}
        />
        <span aria-hidden="true" className="text-xs text-ink-subtle">
          to
        </span>
        <input
          type="date"
          aria-label="Last updated to"
          value={filters.dateTo}
          onChange={(e) => update("dateTo", e.target.value)}
          className={dateFieldClass}
        />
      </fieldset>

      <div className="flex w-full items-center gap-2 sm:ml-auto sm:w-auto">
        <button
          type="button"
          onClick={handleClear}
          className={`${buttonClass} flex-1 border border-line bg-surface text-ink-muted hover:bg-surface-muted sm:flex-none`}
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Clear
        </button>
        <button
          type="button"
          onClick={() => onApply(filters)}
          className={`${buttonClass} flex-1 bg-brand text-white shadow-sm hover:bg-brand-strong sm:flex-none`}
        >
          <Filter className="h-4 w-4" aria-hidden="true" />
          Apply
        </button>
      </div>
    </div>
  );
}
