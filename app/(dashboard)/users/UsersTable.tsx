"use client";

import { useState, useTransition } from "react";
import { KeyRound, Trash2, UserPlus } from "lucide-react";
import { deleteUser } from "./actions";
import AddUserModal from "./AddUserModal";
import ResetPasswordModal from "./ResetPasswordModal";

export interface UserRow {
  id: string;
  email: string;
  name: string;
  role: string;
  isAdmin: boolean;
  createdAt: string;
  lastSignInAt: string | null;
}

function formatDate(value: string | null) {
  if (!value) return "Hindi pa nakaka-login";
  return new Date(value).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function UsersTable({
  users,
  currentUserId,
}: {
  users: UserRow[];
  currentUserId: string;
}) {
  const [addOpen, setAddOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [resetUser, setResetUser] = useState<UserRow | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete(user: UserRow) {
    if (!confirm(`Tanggalin ang account ni ${user.name} (${user.email})? Hindi na siya makakapag-login.`)) {
      return;
    }
    setDeletingId(user.id);
    startTransition(async () => {
      const result = await deleteUser(user.id);
      setDeletingId(null);
      if (result.error) alert(result.error);
    });
  }

  return (
    <>
      <section className="overflow-hidden rounded-xl border border-line bg-surface shadow-xs">
        <div className="flex items-center justify-between gap-4 border-b border-line bg-surface-muted/40 px-4 py-3">
          <p className="text-sm text-ink-muted">
            <span className="font-medium tabular-nums text-ink">{users.length}</span> account(s)
          </p>
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="flex h-9 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-medium text-white shadow-xs hover:bg-brand-strong"
          >
            <UserPlus className="h-4 w-4" aria-hidden="true" />
            Add User
          </button>
        </div>

        <div
          role="region"
          aria-label="User accounts"
          tabIndex={0}
          className="data-table-wrap max-h-[70vh] overflow-auto focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand/40"
        >
        <table className="data-table w-full min-w-[700px] border-separate border-spacing-0 text-left text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="bg-surface-muted text-xs font-medium uppercase tracking-wide text-ink-subtle">
              <th className="border-b border-line px-4 py-3">Name</th>
              <th className="border-b border-line px-4 py-3">Email</th>
              <th className="border-b border-line px-4 py-3">Role</th>
              <th className="border-b border-line px-4 py-3">Created</th>
              <th className="border-b border-line px-4 py-3">Last Sign-in</th>
              <th className="border-b border-line px-4 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-surface-muted/60">
                <td className="cell-name border-b border-line px-4 py-3">
                  <span className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-semibold text-brand-strong"
                    >
                      {user.name.slice(0, 1).toUpperCase()}
                    </span>
                    <span className="font-medium text-ink">
                      {user.name}
                      {user.id === currentUserId && <span className="ml-2 text-xs text-ink-subtle">(ikaw)</span>}
                    </span>
                  </span>
                </td>
                <td data-label="Email" className="border-b border-line px-4 py-3 text-ink-muted">
                  {user.email}
                </td>
                <td data-label="Role" className="border-b border-line px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                      user.isAdmin
                        ? "bg-brand-soft text-brand-strong ring-brand/20"
                        : "bg-surface-muted text-ink-muted ring-line"
                    }`}
                  >
                    {user.isAdmin ? "Administrator" : user.role}
                  </span>
                </td>
                <td data-label="Created" className="border-b border-line px-4 py-3 text-ink-muted">
                  {formatDate(user.createdAt)}
                </td>
                <td data-label="Last Sign-in" className="border-b border-line px-4 py-3 text-ink-muted">
                  {formatDate(user.lastSignInAt)}
                </td>
                <td className="cell-actions border-b border-line px-4 py-3 text-right">
                  {user.id !== currentUserId && (
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => setResetUser(user)}
                        title="Reset password"
                        aria-label={`Reset password for ${user.name}`}
                        className="rounded-sm p-1.5 text-ink-subtle hover:bg-brand-soft hover:text-brand"
                      >
                        <KeyRound className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(user)}
                        disabled={isPending && deletingId === user.id}
                        title="Remove user"
                        aria-label={`Remove ${user.name}`}
                        className="rounded-sm p-1.5 text-ink-subtle hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </section>

      {/* Mounted only while open so each opening starts with a fresh form. */}
      {addOpen && <AddUserModal open onClose={() => setAddOpen(false)} />}
      {resetUser && <ResetPasswordModal user={resetUser} onClose={() => setResetUser(null)} />}
    </>
  );
}
