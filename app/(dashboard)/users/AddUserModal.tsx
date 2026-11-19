"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import Modal, { ModalBody, ModalFooter, modalButton, modalField } from "@/components/Modal";
import { createUser } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={modalButton.primary}>
      {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
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

  return (
    <Modal open={open} onClose={onClose} title="Add User" size="md">
      <form ref={formRef} action={formAction} className="flex min-h-0 flex-1 flex-col">
        <ModalBody className="space-y-4">
          <Field label="Full Name">
            <input
              name="fullName"
              required
              data-autofocus
              autoComplete="off"
              placeholder="e.g. Maria Santos"
              className={modalField}
            />
          </Field>
          <Field label="Email">
            <input
              name="email"
              type="email"
              required
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="staff@company.com"
              className={modalField}
            />
          </Field>
          <Field label="Temporary Password" hint="Ibigay ito nang personal sa staff. Makikita mo ito habang tina-type.">
            <input
              name="password"
              type="text"
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              className={modalField}
            />
          </Field>
          <Field label="Role">
            <select name="role" defaultValue="Staff" className={modalField}>
              <option value="Staff">Staff: inventory lang</option>
              <option value="Administrator">Administrator: pati pag-manage ng users</option>
            </select>
          </Field>

          {state.error && (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {state.error}
            </p>
          )}
          {state.success && (
            <p role="status" className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              {state.success}
            </p>
          )}
        </ModalBody>

        <ModalFooter>
          <button type="button" onClick={onClose} className={modalButton.secondary}>
            Close
          </button>
          <SubmitButton />
        </ModalFooter>
      </form>
    </Modal>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-ink-muted">
        {label}
        <span className="text-red-600"> *</span>
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink-subtle">{hint}</span>}
    </label>
  );
}
