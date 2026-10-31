"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export interface ChangePasswordState {
  error?: string;
  success?: string;
}

export type UpdateProfileState = ChangePasswordState;

const MIN_PASSWORD_LENGTH = 8;

export async function updateProfile(
  _prev: UpdateProfileState,
  formData: FormData
): Promise<UpdateProfileState> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();

  if (!fullName) return { error: "Hindi pwedeng walang pangalan." };
  if (fullName.length > 100) return { error: "Masyadong mahaba ang pangalan." };
  if (phone && !/^[0-9+()\-\s]{7,20}$/.test(phone)) {
    return { error: "Hindi valid ang contact number." };
  }
  if (address.length > 300) return { error: "Masyadong mahaba ang address." };

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Naka-logout ka na. Mag-login ulit." };

  // Users have no RLS update policy on profiles (so they can't change their own role),
  // so write through the service role, limited to these columns and their own row.
  const { error } = await createAdminClient()
    .from("profiles")
    .update({ full_name: fullName, phone, address })
    .eq("id", user.id);
  if (error) {
    console.error("Failed to update profile", error);
    return { error: "Hindi na-save ang profile. Subukan ulit." };
  }

  // Name shows in the TopBar, which comes from the dashboard layout.
  revalidatePath("/", "layout");
  return { success: "Na-save na ang profile mo." };
}

export async function changePassword(
  _prev: ChangePasswordState,
  formData: FormData
): Promise<ChangePasswordState> {
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "Please fill in all fields." };
  }
  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    return { error: `New password must be at least ${MIN_PASSWORD_LENGTH} characters.` };
  }
  if (newPassword !== confirmPassword) return { error: "Hindi magkapareho ang bagong password." };
  if (newPassword === currentPassword) {
    return { error: "Dapat iba ang bagong password sa kasalukuyan." };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return { error: "Naka-logout ka na. Mag-login ulit." };

  // Confirm the current password before allowing the change.
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });
  if (verifyError) return { error: "Mali ang kasalukuyang password." };

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) {
    if (error.code === "weak_password") return { error: "Masyadong mahina ang bagong password." };
    console.error("Failed to change password", error);
    return { error: "Hindi napalitan ang password. Subukan ulit." };
  }

  return { success: "Napalitan na ang password mo." };
}
