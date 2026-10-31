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
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-sm text-gray-500">{users.length} account(s)</p>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <UserPlus className="h-4 w-4" />
          Add User
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Last Sign-in</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-3 font-medium text-gray-900">
                  {user.name}
                  {user.id === currentUserId && <span className="ml-2 text-xs text-gray-400">(ikaw)</span>}
                </td>
                <td className="px-4 py-3 text-gray-500">{user.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      user.isAdmin ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {user.isAdmin ? "Administrator" : user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">{formatDate(user.createdAt)}</td>
                <td className="px-4 py-3 text-gray-500">{formatDate(user.lastSignInAt)}</td>
                <td className="px-4 py-3 text-right">
                  {user.id !== currentUserId && (
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => setResetUser(user)}
                        title="Reset password"
                        aria-label={`Reset password for ${user.name}`}
                        className="rounded p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <KeyRound className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(user)}
                        disabled={isPending && deletingId === user.id}
                        title="Remove user"
                        aria-label={`Remove ${user.name}`}
                        className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
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

      {/* Mounted only while open so each opening starts with a fresh form. */}
      {addOpen && <AddUserModal open onClose={() => setAddOpen(false)} />}
      {resetUser && <ResetPasswordModal user={resetUser} onClose={() => setResetUser(null)} />}
    </>
  );
}
