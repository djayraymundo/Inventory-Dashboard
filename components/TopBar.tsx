"use client";

import { useState } from "react";
import { Search, Bell, Menu } from "lucide-react";
import { useAppShell } from "./AppShell";
import UserMenu from "./UserMenu";

interface TopBarProps {
  onSearch?: (query: string) => void;
  notificationCount?: number;
}

export default function TopBar({ onSearch, notificationCount = 3 }: TopBarProps) {
  const [query, setQuery] = useState("");
  const { openNav, navTriggerRef, navOpen } = useAppShell();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    onSearch?.(e.target.value);
  }

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-line bg-surface/80 px-4 py-3 backdrop-blur-sm sm:px-6">
      <button
        ref={navTriggerRef}
        type="button"
        onClick={openNav}
        aria-label="Open navigation"
        aria-expanded={navOpen}
        className="rounded-lg p-2 text-ink-muted hover:bg-surface-muted hover:text-ink lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div role="search" className="relative w-full max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle" />
        <input
          value={query}
          onChange={handleChange}
          type="search"
          aria-label="Search inventory"
          autoComplete="off"
          spellCheck={false}
          placeholder="Search by SKU, item name, location, batch #"
          className="w-full rounded-lg border border-line bg-surface-muted/60 py-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink-subtle focus:border-brand focus:bg-surface focus:outline-hidden focus:ring-2 focus:ring-brand/20"
        />
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-4">
        <button
          type="button"
          aria-label={`Notifications (${notificationCount})`}
          className="relative rounded-full p-2 text-ink-muted hover:bg-surface-muted hover:text-ink"
        >
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <span
              aria-hidden="true"
              className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white ring-2 ring-surface"
            >
              {notificationCount}
            </span>
          )}
        </button>
        <UserMenu />
      </div>
    </header>
  );
}
