"use client";

import { CalendarDays, Mail, ShieldCheck, UserRound } from "lucide-react";
import { useSession } from "@/lib/session-context";

export default function ProfileCard({ createdAt }: { createdAt: string }) {
  const user = useSession();
  const memberSince = new Date(createdAt).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="h-20 bg-gradient-to-r from-slate-900 to-blue-700" />
      <div className="-mt-10 flex flex-col items-center px-5 pb-5 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-blue-600 text-2xl font-semibold text-white shadow">
          {user.initials}
        </div>
        <h2 className="mt-3 text-lg font-semibold text-gray-900">{user.name}</h2>
        <span
          className={`mt-1 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
            user.isAdmin ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-600"
          }`}
        >
          {user.isAdmin ? <ShieldCheck className="h-3.5 w-3.5" /> : <UserRound className="h-3.5 w-3.5" />}
          {user.isAdmin ? "Administrator" : user.role}
        </span>
      </div>

      <dl className="space-y-3 border-t border-gray-100 px-5 py-4 text-sm">
        <div className="flex items-center gap-3">
          <Mail className="h-4 w-4 shrink-0 text-gray-400" />
          <dt className="sr-only">Email</dt>
          <dd className="truncate text-gray-600">{user.email}</dd>
        </div>
        <div className="flex items-center gap-3">
          <CalendarDays className="h-4 w-4 shrink-0 text-gray-400" />
          <dt className="sr-only">Member since</dt>
          <dd className="text-gray-600">Member since {memberSince}</dd>
        </div>
      </dl>
    </section>
  );
}
