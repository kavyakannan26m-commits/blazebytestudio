import Link from "next/link";

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams;
  const nextPath = next?.startsWith("/") ? next : "/courses";

  return (
    <main className="min-h-[calc(100vh-88px)] bg-[#0B0F19] px-6 py-16 text-white">
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}
        <div className="max-w-2xl">
          <p className="text-sm font-medium tracking-[0.18em] text-blue-400">
            BLAZEBYTE STUDIO
          </p>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
            Welcome back.
          </h1>

          <p className="mt-4 max-w-xl text-base leading-7 text-slate-400">
            Choose how you would like to continue and access your
            BlazeByte Studio account.
          </p>
        </div>

        {/* LOGIN OPTIONS */}
        <div className="mt-14 grid gap-6 md:grid-cols-2">

          {/* STUDENT LOGIN */}
          <Link
            href={`/login/student?next=${encodeURIComponent(nextPath)}`}
            className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.035] p-8 backdrop-blur-xl transition duration-200 hover:-translate-y-1 hover:border-blue-400/30 hover:bg-white/[0.055]"
          >
            {/* subtle highlight */}
            <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-500/[0.06] blur-3xl" />

            <div className="relative">

              {/* HUMAN-STYLE ICON */}
              <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-400/[0.08]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-7 w-7 text-blue-400"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"
                  />
                  <circle cx="9.5" cy="7" r="4" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 8v6M22 11h-6"
                  />
                </svg>
              </div>

              <p className="mt-8 text-xs font-medium uppercase tracking-[0.18em] text-blue-400">
                Learning
              </p>

              <h2 className="mt-2 text-3xl font-semibold">
                Student Login
              </h2>

              <p className="mt-4 max-w-md text-base leading-7 text-slate-400">
                Sign in to explore courses, continue your learning,
                and access your enrolled content.
              </p>

              <div className="mt-8 flex items-center text-sm font-semibold text-white">
                Continue as Student
                <span className="ml-3 text-blue-400 transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </div>
            </div>
          </Link>

          {/* ADMIN LOGIN */}
          <Link
            href="/admin/login"
            className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.035] p-8 backdrop-blur-xl transition duration-200 hover:-translate-y-1 hover:border-purple-400/30 hover:bg-white/[0.055]"
          >
            {/* subtle highlight */}
            <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-purple-500/[0.06] blur-3xl" />

            <div className="relative">

              {/* HUMAN-STYLE ADMIN ICON */}
              <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-400/[0.08]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-7 w-7 text-purple-400"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <circle cx="12" cy="8" r="3.5" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 21v-1.5a5.5 5.5 0 0 1 11 0V21"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 9h3M19.5 7.5v3"
                  />
                </svg>
              </div>

              <p className="mt-8 text-xs font-medium uppercase tracking-[0.18em] text-purple-400">
                Management
              </p>

              <h2 className="mt-2 text-3xl font-semibold">
                Admin Login
              </h2>

              <p className="mt-4 max-w-md text-base leading-7 text-slate-400">
                Manage courses, pricing, lessons, modules, images,
                and student access.
              </p>

              <div className="mt-8 flex items-center text-sm font-semibold text-white">
                Continue as Admin
                <span className="ml-3 text-purple-400 transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </div>
            </div>
          </Link>

        </div>

        {/* SMALL FOOT NOTE */}
        <div className="mt-12 border-t border-white/[0.07] pt-6">
          <p className="text-sm text-slate-500">
            Select an account type to continue.
          </p>
        </div>

      </div>
    </main>
  );
}