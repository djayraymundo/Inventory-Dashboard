// Temporary auth with hardcoded demo accounts (no database yet).
// Sessions are HMAC-signed cookies so they can't be forged from the browser.
// Uses Web Crypto so it works in both middleware (edge) and server actions.

export interface User {
  email: string;
  name: string;
  role: string;
  initials: string;
}

interface Account extends User {
  password: string;
}

// Demo accounts — replace with a real user table once a DB is added.
const ACCOUNTS: Account[] = [
  {
    email: "admin@stockpilot.local",
    password: "admin123",
    name: "Juan Dela Cruz",
    role: "Inventory Manager",
    initials: "JD",
  },
  {
    email: "staff@stockpilot.local",
    password: "staff123",
    name: "Maria Santos",
    role: "Warehouse Staff",
    initials: "MS",
  },
];

export const SESSION_COOKIE = "stockpilot_session";
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

// Set AUTH_SECRET in .env.local for anything beyond local testing.
const SECRET = process.env.AUTH_SECRET ?? "stockpilot-dev-secret-change-me";

export function findAccount(email: string, password: string): User | null {
  const account = ACCOUNTS.find(
    (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password
  );
  if (!account) return null;
  return { email: account.email, name: account.name, role: account.role, initials: account.initials };
}

const encoder = new TextEncoder();

function toBase64Url(bytes: Uint8Array) {
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string) {
  const binary = atob(value.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

async function sign(payload: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return toBase64Url(new Uint8Array(signature));
}

export async function createSessionToken(user: User) {
  const payload = toBase64Url(
    encoder.encode(JSON.stringify({ ...user, exp: Date.now() + SESSION_MAX_AGE * 1000 }))
  );
  return `${payload}.${await sign(payload)}`;
}

export async function verifySessionToken(token: string | undefined): Promise<User | null> {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature || (await sign(payload)) !== signature) return null;
  try {
    const { exp, ...user } = JSON.parse(new TextDecoder().decode(fromBase64Url(payload)));
    return typeof exp === "number" && exp > Date.now() ? (user as User) : null;
  } catch {
    return null;
  }
}
