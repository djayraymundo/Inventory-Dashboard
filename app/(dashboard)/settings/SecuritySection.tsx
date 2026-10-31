"use client";

import { useState } from "react";
import { ChevronRight, KeyRound } from "lucide-react";
import ChangePasswordModal from "./ChangePasswordModal";

export default function SecuritySection() {
  const [open, setOpen] = useState(false);

  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-5 py-4">
        <h2 className="text-base font-semibold text-gray-900">Security</h2>
      </div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-3 rounded-b-xl px-5 py-4 text-left hover:bg-gray-50"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <KeyRound className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">Change Password</p>
          <p className="text-xs text-gray-500">Palitan ang password na ginagamit mo sa pag-login.</p>
        </div>
        <ChevronRight className="h-4 w-4 text-gray-400" />
      </button>

      {/* Mounted only while open so each opening starts with a fresh form. */}
      {open && <ChangePasswordModal onClose={() => setOpen(false)} />}
    </section>
  );
}
