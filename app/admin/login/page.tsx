"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      if (!response.ok) {
        setError("Invalid username or password");
        setLoading(false);
        return;
      }

      window.location.assign("/admin");
    } catch {
      setError("Invalid username or password");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-88px)] bg-[#0B0F19] px-6 py-14 text-white">
      <div className="mx-auto max-w-md rounded-2xl border border-white/[0.09] bg-white/[0.035] p-7 shadow-2xl sm:p-9">

          {/* HEADER */}
          <div>

            <h1 className="text-3xl font-semibold tracking-tight">Admin Login</h1>
          </div>

          <form
            onSubmit={handleLogin}
            className="mt-8 space-y-5"
          >

            <div>
              <label
                htmlFor="username"
                className="text-sm font-medium text-slate-300"
              >
                Username
              </label>

              <input
                id="username"
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="mt-2 w-full rounded-xl border border-white/[0.1] bg-black/20 px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-purple-400/50 focus:bg-black/30 focus:ring-2 focus:ring-purple-400/10"
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
                className="mt-2 w-full rounded-xl border border-white/[0.1] bg-black/20 px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-purple-400/50 focus:bg-black/30 focus:ring-2 focus:ring-purple-400/10"
              />
            </div>

            {/* ERROR */}
            {error && (
              <div className="rounded-xl border border-red-400/15 bg-red-400/[0.06] px-4 py-3 text-sm leading-6 text-red-300">
                {error}
              </div>
            )}

            {/* SIGN IN */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-[#0B0F19] transition duration-200 hover:-translate-y-0.5 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

      </div>
    </main>
  );
}