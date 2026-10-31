"use client";

import { createContext, useContext } from "react";
import type { User } from "./auth";

const SessionContext = createContext<User | null>(null);

export function SessionProvider({ user, children }: { user: User; children: React.ReactNode }) {
  return <SessionContext.Provider value={user}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const user = useContext(SessionContext);
  if (!user) throw new Error("useSession must be used within a SessionProvider");
  return user;
}
