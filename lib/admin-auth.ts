import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const ADMIN_SESSION_COOKIE = "blazebyte_admin_session";
const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 8;

function toBase64Url(value: string) {
  return btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string) {
  return atob(value.replace(/-/g, "+").replace(/_/g, "/"));
}

async function sign(value: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return toBase64Url(String.fromCharCode(...new Uint8Array(signature)));
}

export async function createAdminSessionToken(username: string) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not configured.");

  const payload = toBase64Url(JSON.stringify({
    username,
    expiresAt: Date.now() + ADMIN_SESSION_TTL_SECONDS * 1000,
  }));
  return `${payload}.${await sign(payload, secret)}`;
}

export async function verifyAdminSessionToken(token: string | undefined) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || !token) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature || (await sign(payload, secret)) !== signature) return null;

  try {
    const session = JSON.parse(fromBase64Url(payload)) as { username?: string; expiresAt?: number };
    if (!session.username || !session.expiresAt || session.expiresAt <= Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

export async function getAdminSession(token?: string) {
  if (token) return verifyAdminSessionToken(token);
  const { cookies } = await import("next/headers");
  return verifyAdminSessionToken((await cookies()).get(ADMIN_SESSION_COOKIE)?.value);
}

export { ADMIN_SESSION_COOKIE, ADMIN_SESSION_TTL_SECONDS };

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    redirect("/admin/login");
  }

  return { supabase, username: session.username };
}
