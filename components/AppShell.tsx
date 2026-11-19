"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

interface AppShellContextValue {
  openNav: () => void;
  navTriggerRef: React.RefObject<HTMLButtonElement>;
  navOpen: boolean;
}

const AppShellContext = createContext<AppShellContextValue | null>(null);

// Sidebar is always visible on lg+; below that it is a slide-in drawer opened from the TopBar.
export default function AppShell({ children }: { children: React.ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);
  const navTriggerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  const closeNav = useCallback(() => {
    setNavOpen(false);
    navTriggerRef.current?.focus();
  }, []);

  // Close after navigating, and when the viewport grows into the desktop layout.
  useEffect(() => setNavOpen(false), [pathname]);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onChange = () => desktop.matches && setNavOpen(false);
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, []);

  return (
    <AppShellContext.Provider value={{ openNav: () => setNavOpen(true), navTriggerRef, navOpen }}>
      <div className="flex min-h-screen">
        <Sidebar open={navOpen} onClose={closeNav} />
        {/* Page behind the open drawer is inert, like a modal dialog. React 18 needs inert as a string. */}
        <div
          className="flex min-h-screen min-w-0 flex-1 flex-col lg:ml-64"
          {...((navOpen ? { inert: "" } : {}) as object)}
        >
          {children}
        </div>
      </div>
    </AppShellContext.Provider>
  );
}

export function useAppShell() {
  const context = useContext(AppShellContext);
  if (!context) throw new Error("useAppShell must be used within AppShell");
  return context;
}
