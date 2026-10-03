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
  "h-9 w-36 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100";

const dateFieldClass = `${fieldClass} text-center`;

const buttonClass =
  "flex h-9 items-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors";

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
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
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

      <span className="text-sm font-medium text-gray-500">Date Range</span>
      <div className="flex items-center gap-2">
        <input
          type="date"
          aria-label="Date from"
          value={filters.dateFrom}
          onChange={(e) => update("dateFrom", e.target.value)}
          className={dateFieldClass}
        />
        <span className="text-xs text-gray-400">to</span>
        <input
          type="date"
          aria-label="Date to"
          value={filters.dateTo}
          onChange={(e) => update("dateTo", e.target.value)}
          className={dateFieldClass}
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={handleClear}
          className={`${buttonClass} border border-gray-200 text-gray-600 hover:bg-gray-50`}
        >
          <RotateCcw className="h-4 w-4" />
          Clear
        </button>
        <button
          type="button"
          onClick={() => onApply(filters)}
          className={`${buttonClass} bg-blue-600 text-white hover:bg-blue-700`}
        >
          <Filter className="h-4 w-4" />
          Apply
        </button>
      </div>
    </div>
  );
}
