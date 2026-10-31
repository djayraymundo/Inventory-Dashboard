"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  createSessionToken,
  findAccount,
} from "@/lib/auth";

export interface LoginState {
  error?: string;
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const from = String(formData.get("from") ?? "/");

  if (!email || !password) return { error: "Please enter your email and password." };

  const user = findAccount(email, password);
  if (!user) return { error: "Invalid email or password." };

  cookies().set(SESSION_COOKIE, await createSessionToken(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  // Only allow internal redirects.
  redirect(from.startsWith("/") && !from.startsWith("//") ? from : "/");
}

export async function logout() {
  cookies().delete(SESSION_COOKIE);
  redirect("/login");
}
