import { redirect } from "next/navigation";
import AppShell from "@/components/AppShell";
import { fetchInventory } from "@/lib/inventory-db";
import { InventoryProvider } from "@/lib/inventory-context";
import { SessionProvider, SessionUser } from "@/lib/session-context";
import { createClient } from "@/lib/supabase/server";
import { InventoryItem } from "@/lib/types";

function initialsOf(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]!.toUpperCase())
      .join("") || "?"
  );
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();

  // Middleware already guards these routes; this also gives us the user to display.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, is_admin")
    .eq("id", user.id)
    .maybeSingle();

  const name = profile?.full_name ?? user.email?.split("@")[0] ?? "User";
  const sessionUser: SessionUser = {
    id: user.id,
    email: user.email ?? "",
    name,
    role: profile?.role ?? "Staff",
    initials: initialsOf(name),
    isAdmin: profile?.is_admin ?? false,
  };

  let items: InventoryItem[] = [];
  let loadError: string | null = null;
  try {
    items = await fetchInventory(supabase);
  } catch (error) {
    console.error("Failed to load inventory", error);
    loadError = "Hindi ma-load ang inventory mula sa database. Paki-refresh ang page.";
  }

  return (
    <SessionProvider user={sessionUser}>
      <InventoryProvider initialItems={items}>
        <AppShell>
          {loadError && (
            <p role="alert" className="bg-red-50 px-6 py-2 text-sm text-red-700">
              {loadError}
            </p>
          )}
          {children}
        </AppShell>
      </InventoryProvider>
    </SessionProvider>
  );
}
