import { redirect } from "next/navigation";
import { UsersRound } from "lucide-react";
import TopBar from "@/components/TopBar";
import { createAdminClient, getAdminUser } from "@/lib/supabase/admin";
import UsersTable, { UserRow } from "./UsersTable";

export const metadata = {
  title: "Users | StockPilot",
};

export default async function UsersPage() {
  const currentAdmin = await getAdminUser();
  if (!currentAdmin) redirect("/");

  let users: UserRow[] = [];
  let loadError: string | null = null;

  try {
    const admin = createAdminClient();
    const [{ data: authData, error: authError }, { data: profiles, error: profileError }] =
      await Promise.all([
        admin.auth.admin.listUsers({ perPage: 1000 }),
        admin.from("profiles").select("id, full_name, role, is_admin"),
      ]);
    if (authError) throw authError;
    if (profileError) throw profileError;

    const profileById = new Map(profiles.map((p) => [p.id, p]));
    users = authData.users
      .map((user) => {
        const profile = profileById.get(user.id);
        return {
          id: user.id,
          email: user.email ?? "",
          name: profile?.full_name ?? user.email ?? "",
          role: profile?.role ?? "Staff",
          isAdmin: profile?.is_admin ?? false,
          createdAt: user.created_at,
          lastSignInAt: user.last_sign_in_at ?? null,
        };
      })
      .sort((a, b) => Number(b.isAdmin) - Number(a.isAdmin) || a.name.localeCompare(b.name));
  } catch (error) {
    console.error("Failed to load users", error);
    loadError =
      error instanceof Error && error.message.includes("SUPABASE_SERVICE_ROLE_KEY")
        ? "Kulang ang SUPABASE_SERVICE_ROLE_KEY sa .env.local. Idagdag ito at i-restart ang dev server."
        : "Hindi ma-load ang listahan ng users. Paki-refresh ang page.";
  }

  return (
    <>
      <TopBar />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <UsersRound className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
            <p className="text-sm text-gray-500">
              Gumawa at mag-manage ng mga account na pwedeng mag-login sa system.
            </p>
          </div>
        </div>

        {loadError ? (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {loadError}
          </p>
        ) : (
          <UsersTable users={users} currentUserId={currentAdmin.id} />
        )}
      </main>
    </>
  );
}
