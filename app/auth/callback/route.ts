import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next");
  const nextPath = next?.startsWith("/") ? next : "/courses";

  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=callback_failed", requestUrl.origin)
    );
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.redirect(
      new URL("/login?error=supabase_config", requestUrl.origin)
    );
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Supabase callback error:", error);

    return NextResponse.redirect(
      new URL("/login?error=callback_failed", requestUrl.origin)
    );
  }

  return NextResponse.redirect(new URL(nextPath, requestUrl.origin));
}
