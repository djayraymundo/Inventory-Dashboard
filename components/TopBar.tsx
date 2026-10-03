"use client";

import { useState } from "react";
import { Search, Bell } from "lucide-react";

interface TopBarProps {
  onSearch?: (query: string) => void;
  notificationCount?: number;
}

export default function TopBar({ onSearch, notificationCount = 3 }: TopBarProps) {
  const [query, setQuery] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    onSearch?.(e.target.value);
  }

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-gray-200 bg-white px-6 py-3">
      <div className="relative w-full max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          value={query}
          onChange={handleChange}
          type="text"
          placeholder="Search by SKU, item name, location, batch #"
          className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
              {notificationCount}
            </span>
          )}
        </button>
        <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
            JD
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold text-gray-800">Juan Dela Cruz</p>
            <p className="text-xs text-gray-500">Inventory Manager</p>
          </div>
        </div>
      </div>
    </header>
  );
}
