"use client";

import { useState } from "react";
import { ChevronRight, KeyRound } from "lucide-react";
import ChangePasswordModal from "./ChangePasswordModal";

export default function SecuritySection() {
  const [open, setOpen] = useState(false);

  return (
    <section className="rounded-xl border border-line bg-surface shadow-sm">
      <div className="border-b border-line px-5 py-4">
        <h2 className="text-base font-semibold text-ink">Security</h2>
      </div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-3 rounded-b-xl px-5 py-4 text-left hover:bg-surface-muted"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-soft text-brand">
          <KeyRound className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-ink">Change Password</p>
          <p className="text-xs text-ink-muted">Palitan ang password na ginagamit mo sa pag-login.</p>
        </div>
        <ChevronRight className="h-4 w-4 text-ink-subtle" />
      </button>

      {/* Mounted only while open so each opening starts with a fresh form. */}
      {open && <ChangePasswordModal onClose={() => setOpen(false)} />}
    </section>
  );
}
