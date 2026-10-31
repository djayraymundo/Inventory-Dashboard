import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { InventoryProvider } from "@/lib/inventory-context";
import { SessionProvider } from "@/lib/session-context";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Middleware already guards these routes; this also gives us the user to display.
  const user = await verifySessionToken(cookies().get(SESSION_COOKIE)?.value);
  if (!user) redirect("/login");

  return (
    <SessionProvider user={user}>
      <InventoryProvider>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex min-h-screen flex-1 flex-col lg:ml-64">{children}</div>
        </div>
      </InventoryProvider>
    </SessionProvider>
  );
}
