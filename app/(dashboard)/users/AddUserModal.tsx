"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Loader2, X } from "lucide-react";
import { createUser } from "./actions";

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
      {pending ? "Creating..." : "Create Account"}
    </button>
  );
}

export default function AddUserModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [state, formAction] = useFormState(createUser, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state]);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={onClose}>
      <form
        ref={formRef}
        action={formAction}
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-md flex-col rounded-xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="text-base font-semibold text-gray-900">Add User</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          <Field label="Full Name">
            <input name="fullName" required autoFocus placeholder="e.g. Maria Santos" className={fieldClass} />
          </Field>
          <Field label="Email">
            <input
              name="email"
              type="email"
              required
              autoComplete="off"
              placeholder="staff@company.com"
              className={fieldClass}
            />
          </Field>
          <Field label="Temporary Password">
            <input
              name="password"
              type="text"
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              className={fieldClass}
            />
            <span className="mt-1 block text-xs text-gray-400">
              Ibigay ito nang personal sa staff. Makikita mo ito habang tina-type.
            </span>
          </Field>
          <Field label="Role">
            <select name="role" defaultValue="Staff" className={fieldClass}>
              <option value="Staff">Staff: inventory lang</option>
              <option value="Administrator">Administrator: pati pag-manage ng users</option>
            </select>
          </Field>

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
            Close
          </button>
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-gray-500">
        {label}
        <span className="text-red-500"> *</span>
      </span>
      {children}
    </label>
  );
}
