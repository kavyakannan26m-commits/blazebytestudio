import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_TTL_SECONDS,
  createAdminSessionToken,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  const { username, password } = await request.json().catch(() => ({}));
  const configuredUsername = process.env.ADMIN_USERNAME;
  const configuredPassword = process.env.ADMIN_PASSWORD;

  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    !configuredUsername ||
    !configuredPassword ||
    username.trim() !== configuredUsername ||
    password !== configuredPassword
  ) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, await createAdminSessionToken(configuredUsername), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_TTL_SECONDS,
  });
  return response;
}