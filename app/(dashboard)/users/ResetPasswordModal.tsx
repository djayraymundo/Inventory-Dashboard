"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import Modal, { ModalBody, ModalFooter, modalButton, modalField } from "@/components/Modal";
import { resetUserPassword } from "./actions";
import type { UserRow } from "./UsersTable";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={modalButton.primary}>
      {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {pending ? "Saving..." : "Reset Password"}
    </button>
  );
}

export default function ResetPasswordModal({ user, onClose }: { user: UserRow; onClose: () => void }) {
  const [state, formAction] = useFormState(resetUserPassword, {});

  return (
    <Modal open onClose={onClose} title="Reset Password" description={`${user.name} · ${user.email}`} size="md">
      <form action={formAction} className="flex min-h-0 flex-1 flex-col">
        <input type="hidden" name="userId" value={user.id} />

        <ModalBody className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">New Temporary Password</span>
            <input
              name="password"
              type="text"
              required
              data-autofocus
              minLength={8}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              disabled={!!state.success}
              className={modalField}
            />
            <span className="mt-1 block text-xs text-ink-subtle">
              Ibigay ito sa user at sabihan siyang palitan ito sa Settings.
            </span>
          </label>

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
            {state.success ? "Done" : "Cancel"}
          </button>
          {!state.success && <SubmitButton />}
        </ModalFooter>
      </form>
    </Modal>
  );
}
