"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import Modal, { ModalBody, ModalFooter, modalButton, modalField } from "@/components/Modal";
import { changePassword } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={modalButton.primary}>
      {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {pending ? "Saving..." : "Update Password"}
    </button>
  );
}

export default function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [state, formAction] = useFormState(changePassword, {});

  return (
    <Modal open onClose={onClose} title="Change Password" size="md">
      <form action={formAction} className="flex min-h-0 flex-1 flex-col">
        {state.success ? (
          <ModalBody>
            <p role="status" className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              {state.success}
            </p>
          </ModalBody>
        ) : (
          <ModalBody className="space-y-4">
            <Field label="Current Password">
              <input
                name="currentPassword"
                type="password"
                required
                data-autofocus
                autoComplete="current-password"
                className={modalField}
              />
            </Field>
            <Field label="New Password">
              <input
                name="newPassword"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                className={modalField}
              />
            </Field>
            <Field label="Confirm New Password">
              <input
                name="confirmPassword"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className={modalField}
              />
            </Field>

            {state.error && (
              <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {state.error}
              </p>
            )}
          </ModalBody>
        )}

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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-ink-muted">{label}</span>
      {children}
    </label>
  );
}
