"use client";

import { createContext, useContext } from "react";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
  initials: string;
  isAdmin: boolean;
}

const SessionContext = createContext<SessionUser | null>(null);

export function SessionProvider({ user, children }: { user: SessionUser; children: React.ReactNode }) {
  return <SessionContext.Provider value={user}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const user = useContext(SessionContext);
  if (!user) throw new Error("useSession must be used within a SessionProvider");
  return user;
}
