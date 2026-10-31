import { redirect } from "next/navigation";
import { Settings } from "lucide-react";
import TopBar from "@/components/TopBar";
import { createClient } from "@/lib/supabase/server";
import ProfileCard from "./ProfileCard";
import ProfileForm from "./ProfileForm";
import SecuritySection from "./SecuritySection";

export const metadata = {
  title: "Settings | StockPilot",
};

export default async function SettingsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, is_admin, phone, address")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <>
      <TopBar />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
            <Settings className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
            <p className="text-sm text-gray-500">I-manage ang account at personal details mo.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          <div className="space-y-6">
            <ProfileCard createdAt={user.created_at} />
            <SecuritySection />
          </div>
          <div className="lg:col-span-2">
            <ProfileForm
              email={user.email ?? ""}
              role={profile?.is_admin ? "Administrator" : profile?.role ?? "Staff"}
              fullName={profile?.full_name ?? ""}
              phone={profile?.phone ?? ""}
              address={profile?.address ?? ""}
            />
          </div>
        </div>
      </main>
    </>
  );
}
