"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

function StudentLoginContent() {
  const router = useRouter();
  const search = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const next = search.get("next");
  const nextPath = next?.startsWith("/") ? next : "/courses";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleEmailLogin(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      router.replace(nextPath);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError("");
    setGoogleLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();

      const callbackUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: callbackUrl,
          queryParams: {
            prompt: "select_account",
          },
        },
      });

      if (error) {
        setError(error.message);
        setGoogleLoading(false);
      }
    } catch {
      setError("Unable to connect with Google. Please try again.");
      setGoogleLoading(false);
    }
  }

  return (
    <main className="relative min-h-[calc(100vh-88px)] overflow-hidden bg-[#0B0F19] px-6 py-14 text-white">

      {/* Subtle background detail */}
      <div className="pointer-events-none absolute right-[-180px] top-[-180px] h-[420px] w-[420px] rounded-full border border-blue-400/[0.05]" />

      <div className="relative mx-auto max-w-md">

        {/* BACK */}
        <Link
          href="/login"
          className="inline-flex items-center text-sm text-slate-500 transition hover:text-white"
        >
          ← Back
        </Link>

        {/* LOGIN CONTAINER */}
        <div className="mt-8 rounded-2xl border border-white/[0.09] bg-white/[0.035] p-7 shadow-2xl backdrop-blur-xl sm:p-9">

          {/* HEADER */}
          <div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-400/[0.08]">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6 text-blue-400"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <circle cx="9" cy="8" r="3.5" />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.5 20a5.5 5.5 0 0 1 11 0"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8.5v6M20 11.5h-6"
                />
              </svg>

            </div>

            <p className="mt-7 text-xs font-medium uppercase tracking-[0.2em] text-blue-400">
              Student access
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Student Login
            </h1>

            <p className="mt-3 text-base leading-6 text-slate-400">
              Sign in to continue learning and access your courses.
            </p>

          </div>

          {/* GOOGLE */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-white/[0.1] bg-white/[0.045] px-5 py-3.5 text-sm font-semibold text-white transition duration-200 hover:border-white/[0.18] hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-50"
          >

            {/* Google Logo */}
            <svg
              className="h-5 w-5 shrink-0"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fill="#4285F4"
                d="M21.35 12.27c0-.72-.06-1.41-.18-2.07H12v3.92h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.24Z"
              />

              <path
                fill="#34A853"
                d="M12 21.5c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.5Z"
              />

              <path
                fill="#FBBC05"
                d="M6.54 13.58A5.86 5.86 0 0 1 6.23 12c0-.55.11-1.08.31-1.58V7.89H3.3A9.74 9.74 0 0 0 2.25 12c0 1.57.38 3.06 1.05 4.11l3.24-2.53Z"
              />

              <path
                fill="#EA4335"
                d="M12 6.39c1.43 0 2.72.49 3.73 1.45l2.8-2.8C16.84 3.48 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.7 5.39l3.24 2.53C7.31 8.11 9.46 6.39 12 6.39Z"
              />
            </svg>

            <span>
              {googleLoading
                ? "Connecting..."
                : "Continue with Google"}
            </span>

          </button>

          {/* DIVIDER */}
          <div className="my-7 flex items-center gap-4">

            <div className="h-px flex-1 bg-white/[0.08]" />

            <span className="text-xs uppercase tracking-[0.15em] text-slate-600">
              or
            </span>

            <div className="h-px flex-1 bg-white/[0.08]" />

          </div>

          {/* EMAIL LOGIN */}
          <form
            onSubmit={handleEmailLogin}
            className="space-y-5"
          >

            {/* EMAIL */}
            <div>

              <label
                htmlFor="email"
                className="text-sm font-medium text-slate-300"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="mt-2 w-full rounded-xl border border-white/[0.1] bg-black/20 px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-blue-400/50 focus:bg-black/30 focus:ring-2 focus:ring-blue-400/10"
              />

            </div>

            {/* PASSWORD */}
            <div>

              <label
                htmlFor="password"
                className="text-sm font-medium text-slate-300"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className="mt-2 w-full rounded-xl border border-white/[0.1] bg-black/20 px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-blue-400/50 focus:bg-black/30 focus:ring-2 focus:ring-blue-400/10"
              />

            </div>

            {/* ERROR */}
            {error && (
              <div className="rounded-xl border border-red-400/15 bg-red-400/[0.06] px-4 py-3 text-sm leading-6 text-red-300">
                {error}
              </div>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-[#0B0F19] transition duration-200 hover:-translate-y-0.5 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

          </form>

          {/* SECURITY NOTE */}
          <p className="mt-7 text-center text-xs leading-5 text-slate-600">
            Your account is securely authenticated before accessing
            the learning platform.
          </p>

        </div>

      </div>
    </main>
  );
}

export default function StudentLoginPage() {
  return <StudentLoginContent />;
}