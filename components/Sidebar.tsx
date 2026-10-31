"use client";

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
} from "lucide-react";
import { logout } from "@/app/login/actions";
import { useInventory } from "@/lib/inventory-context";
import { useSession } from "@/lib/session-context";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Inventory", href: "/inventory", icon: Boxes },
  { name: "Low Stock", href: "/low-stock", icon: AlertTriangle, badge: "lowStock" as const },
  { name: "Incoming/Outgoing", href: "/incoming-outgoing", icon: ArrowLeftRight },
  { name: "Reports", href: "/reports", icon: FileBarChart2 },
  { name: "Users", href: "/users", icon: UsersRound, adminOnly: true },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { items } = useInventory();
  const { isAdmin } = useSession();
  const visibleNavItems = navItems.filter((item) => !item.adminOnly || isAdmin);
  const lowStockCount = items.filter(
    (item) => item.status === "Low Stock" || item.status === "Out of Stock"
  ).length;

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-slate-900 lg:flex">
      <div className="flex items-center gap-2 border-b border-slate-800 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
          <Warehouse className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">StockPilot</p>
          <p className="text-xs text-slate-400">Inventory System</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {visibleNavItems.map((item) => {
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          const badge = item.badge === "lowStock" ? lowStockCount : 0;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon className="h-4 w-4" />
                {item.name}
              </span>
              {!!badge && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-semibold text-white">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 px-3 py-3">
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </form>
        <p className="px-3 pt-2 text-xs text-slate-500">v1.0.0 · Static Demo</p>
      </div>
    </aside>
  );
}
