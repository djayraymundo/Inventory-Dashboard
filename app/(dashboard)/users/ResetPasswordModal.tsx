"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Loader2, X } from "lucide-react";
import { resetUserPassword } from "./actions";
import type { UserRow } from "./UsersTable";

const fieldClass =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-70"
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {pending ? "Saving..." : "Reset Password"}
    </button>
  );
}

export default function ResetPasswordModal({ user, onClose }: { user: UserRow; onClose: () => void }) {
  const [state, formAction] = useFormState(resetUserPassword, {});

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={onClose}>
      <form
        action={formAction}
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-md flex-col rounded-xl bg-white shadow-xl"
      >
        <input type="hidden" name="userId" value={user.id} />

        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Reset Password</h2>
            <p className="text-xs text-gray-500">
              {user.name} · {user.email}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-gray-500">New Temporary Password</span>
            <input
              name="password"
              type="text"
              required
              autoFocus
              minLength={8}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              disabled={!!state.success}
              className={fieldClass}
            />
            <span className="mt-1 block text-xs text-gray-400">
              Ibigay ito sa user at sabihan siyang palitan ito sa Settings.
            </span>
          </label>

          {state.error && (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {state.error}
            </p>
          )}
          {state.success && (
            <p role="status" className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
              {state.success}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-gray-200 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            {state.success ? "Done" : "Cancel"}
          </button>
          {!state.success && <SubmitButton />}
        </div>
      </form>
    </div>
  );
}
