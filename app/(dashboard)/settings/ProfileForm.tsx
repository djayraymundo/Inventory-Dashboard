"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Loader2, UserRound } from "lucide-react";
import { updateProfile } from "./actions";

const fieldClass =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100";
const readOnlyClass = "w-full rounded-lg border border-gray-100 bg-gray-100 px-3 py-2 text-sm text-gray-500";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-70"
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {pending ? "Saving..." : "Save Changes"}
    </button>
  );
}

interface ProfileFormProps {
  email: string;
  role: string;
  fullName: string;
  phone: string;
  address: string;
}

export default function ProfileForm({ email, role, fullName, phone, address }: ProfileFormProps) {
  const [state, formAction] = useFormState(updateProfile, {});

  return (
    <form action={formAction} className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-gray-200 px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <UserRound className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-900">Profile</h2>
          <p className="text-xs text-gray-500">Ang pangalan mo ang lalabas sa itaas at sa item history.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 px-5 py-5 sm:grid-cols-2">
        <Field label="Full Name" required className="sm:col-span-2">
          <input name="fullName" required maxLength={100} defaultValue={fullName} className={fieldClass} />
        </Field>
        <Field label="Email">
          <input value={email} readOnly className={readOnlyClass} />
        </Field>
        <Field label="Role">
          <input value={role} readOnly className={readOnlyClass} />
        </Field>
        <Field label="Contact Number">
          <input
            name="phone"
            type="tel"
            maxLength={20}
            defaultValue={phone}
            placeholder="e.g. 0917 123 4567"
            className={fieldClass}
          />
        </Field>
        <Field label="Address" className="sm:col-span-2">
          <textarea
            name="address"
            rows={2}
            maxLength={300}
            defaultValue={address}
            placeholder="e.g. 123 Rizal St., Quezon City"
            className={`${fieldClass} resize-none`}
          />
        </Field>

        {state.error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 sm:col-span-2">
            {state.error}
          </p>
        )}
        {state.success && (
          <p role="status" className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 sm:col-span-2">
            {state.success}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-gray-200 px-5 py-4">
        <p className="text-xs text-gray-400">Ang email at role ay pinapalitan lang ng admin.</p>
        <SubmitButton />
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  className = "",
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-xs font-medium text-gray-500">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      {children}
    </label>
  );
}
