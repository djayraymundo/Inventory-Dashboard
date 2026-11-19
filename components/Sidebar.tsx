"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Boxes,
  AlertTriangle,
  ArrowLeftRight,
  FileBarChart2,
  Settings,
  Warehouse,
  LogOut,
  UsersRound,
  X,
} from "lucide-react";
import { logout } from "@/app/login/actions";
import { useInventory } from "@/lib/inventory-context";
import { useSession } from "@/lib/session-context";

const navGroups = [
  {
    label: "Overview",
    items: [{ name: "Dashboard", href: "/", icon: LayoutDashboard }],
  },
  {
    label: "Inventory",
    items: [
      { name: "Inventory", href: "/inventory", icon: Boxes },
      { name: "Low Stock", href: "/low-stock", icon: AlertTriangle, badge: "lowStock" as const },
      { name: "Incoming/Outgoing", href: "/incoming-outgoing", icon: ArrowLeftRight },
    ],
  },
  {
    label: "Insights",
    items: [{ name: "Reports", href: "/reports", icon: FileBarChart2 }],
  },
  {
    label: "Manage",
    items: [
      { name: "Users", href: "/users", icon: UsersRound, adminOnly: true },
      { name: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { items } = useInventory();
  const { isAdmin } = useSession();
  const panelRef = useRef<HTMLElement>(null);
  const lowStockCount = items.filter(
    (item) => item.status === "Low Stock" || item.status === "Out of Stock"
  ).length;

  // Drawer mode only (below lg): move focus in on open, close on Escape.
  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  return (
    <>
      {open && (
        <div aria-hidden="true" className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden" onClick={onClose} />
      )}
      <aside
        ref={panelRef}
        {...(open ? { role: "dialog", "aria-modal": true, "aria-label": "Navigation" } : {})}
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-900 transition-[transform,visibility] duration-200 motion-reduce:transition-none lg:visible lg:translate-x-0 ${
          open ? "visible translate-x-0 shadow-2xl" : "invisible -translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-2 px-5 py-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand shadow-xs shadow-brand/40">
              <Warehouse className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">StockPilot</p>
              <p className="text-xs text-slate-400">Inventory System</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav aria-label="Main" className="flex-1 space-y-6 overflow-y-auto px-3 py-2">
          {navGroups.map((group) => {
            const visibleItems = group.items.filter((item) => !("adminOnly" in item) || isAdmin);
            if (visibleItems.length === 0) return null;
            return (
              <div key={group.label}>
                <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {group.label}
                </p>
                <ul className="space-y-0.5">
                  {visibleItems.map((item) => {
                    const isActive =
                      item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                    const Icon = item.icon;
                    const badge = "badge" in item && item.badge === "lowStock" ? lowStockCount : 0;
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          aria-current={isActive ? "page" : undefined}
                          className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                            isActive
                              ? "bg-white/10 text-white"
                              : "text-slate-300 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <Icon className={`h-4 w-4 ${isActive ? "text-blue-400" : ""}`} />
                            {item.name}
                          </span>
                          {!!badge && (
                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-semibold text-white">
                              {badge}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>

        <div className="border-t border-white/10 px-3 py-3">
          <form action={logout}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
          <p className="px-3 pt-2 text-xs text-slate-400">v1.0.0</p>
        </div>
      </aside>
    </>
  );
}
