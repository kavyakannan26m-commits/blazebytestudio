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

  // Temporary diagnostic log.
  // IMPORTANT: Never log the actual password.
  console.log("Admin env check:", {
    usernameExists: Boolean(configuredUsername),
    passwordExists: Boolean(configuredPassword),
    receivedUsername:
      typeof username === "string" ? username : null,
  });

  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    !configuredUsername ||
    !configuredPassword ||
    username.trim() !== configuredUsername.trim() ||
    password !== configuredPassword
  ) {
    return NextResponse.json(
      { error: "Invalid username or password" },
      { status: 401 }
    );
  }

  const response = NextResponse.json({
    success: true,
  });

  const sessionToken =
    await createAdminSessionToken(configuredUsername);

  response.cookies.set(
    ADMIN_SESSION_COOKIE,
    sessionToken,
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: ADMIN_SESSION_TTL_SECONDS,
    }
  );

  return response;
}