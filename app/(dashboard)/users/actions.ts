"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient, getAdminUser } from "@/lib/supabase/admin";

export interface CreateUserState {
  error?: string;
  success?: string;
}

const MIN_PASSWORD_LENGTH = 8;

export async function createUser(
  _prev: CreateUserState,
  formData: FormData
): Promise<CreateUserState> {
  if (!(await getAdminUser())) return { error: "Admins lang ang pwedeng gumawa ng account." };

  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const isAdmin = formData.get("role") === "Administrator";

  if (!fullName || !email || !password) return { error: "Please fill in all fields." };
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` };
  }

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });
  if (error || !data.user) {
    if (error?.code === "email_exists") return { error: "May account na ang email na ito." };
    if (error?.code === "weak_password") return { error: "Masyadong mahina ang password." };
    console.error("Failed to create user", error);
    return { error: "Hindi nagawa ang account. Subukan ulit." };
  }

  // The signup trigger creates the profile; set the chosen role on it.
  const { error: profileError } = await admin
    .from("profiles")
    .upsert({
      id: data.user.id,
      full_name: fullName,
      role: isAdmin ? "Administrator" : "Staff",
      is_admin: isAdmin,
    });
  if (profileError) {
    console.error("Failed to set profile", profileError);
    await admin.auth.admin.deleteUser(data.user.id);
    return { error: "Hindi nagawa ang account. Subukan ulit." };
  }

  revalidatePath("/users");
  return { success: `Nagawa na ang account ni ${fullName}. Pwede na siyang mag-login gamit ang ${email}.` };
}

export async function resetUserPassword(
  _prev: CreateUserState,
  formData: FormData
): Promise<CreateUserState> {
  const currentAdmin = await getAdminUser();
  if (!currentAdmin) return { error: "Admins lang ang pwedeng mag-reset ng password." };

  const userId = String(formData.get("userId") ?? "");
  const password = String(formData.get("password") ?? "");
  if (userId === currentAdmin.id) {
    return { error: "Gamitin ang Settings para palitan ang sarili mong password." };
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` };
  }

  const { error } = await createAdminClient().auth.admin.updateUserById(userId, { password });
  if (error) {
    if (error.code === "weak_password") return { error: "Masyadong mahina ang password." };
    console.error("Failed to reset password", error);
    return { error: "Hindi na-reset ang password. Subukan ulit." };
  }

  return { success: "Na-reset na ang password. Ibigay ito nang personal sa user." };
}

export async function deleteUser(userId: string): Promise<{ error?: string }> {
  const currentAdmin = await getAdminUser();
  if (!currentAdmin) return { error: "Admins lang ang pwedeng magtanggal ng account." };
  if (currentAdmin.id === userId) return { error: "Hindi mo pwedeng tanggalin ang sarili mong account." };

  const { error } = await createAdminClient().auth.admin.deleteUser(userId);
  if (error) {
    console.error("Failed to delete user", error);
    return { error: "Hindi natanggal ang account. Subukan ulit." };
  }

  revalidatePath("/users");
  return {};
}
