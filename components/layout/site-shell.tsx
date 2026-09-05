import Link from "next/link";

type SiteShellProps = {
  children: React.ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-50">

      {/* ================= HEADER ================= */}
      <header className="border-b border-white/10 bg-[#0B0F19]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">

          {/* BRAND */}
          <Link
            href="/"
            className="whitespace-nowrap text-lg font-semibold tracking-tight text-white"
          >
            BlazeByte Studio
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden items-center gap-7 md:flex">

            <Link
              href="/"
              className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              Home
            </Link>

            <Link
              href="/about"
              className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              About
            </Link>

            <Link
              href="/why-us"
              className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              Why Us
            </Link>

            <Link
              href="/contact"
              className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              Contact
            </Link>

          </nav>

          {/* LOGIN - DARK OUTLINE */}
          <Link
            href="/login"
            className="
              rounded-xl
              border border-white/20
              bg-[#0B0F19]
              px-5 py-2.5
              text-sm font-semibold
              text-white
              transition-all duration-200
              hover:border-white/40
              hover:bg-white/[0.04]
            "
          >
            Login
          </Link>

        </div>
      </header>

      {/* ================= MOBILE NAV ================= */}
      <div className="border-b border-white/10 bg-[#0B0F19] md:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-6 overflow-x-auto px-6 py-3">

          <Link
            href="/"
            className="whitespace-nowrap text-xs font-medium text-slate-300 transition-colors hover:text-white"
          >
            Home
          </Link>

          <Link
            href="/about"
            className="whitespace-nowrap text-xs font-medium text-slate-300 transition-colors hover:text-white"
          >
            About
          </Link>

          <Link
            href="/why-us"
            className="whitespace-nowrap text-xs font-medium text-slate-300 transition-colors hover:text-white"
          >
            Why Us
          </Link>

          <Link
            href="/contact"
            className="whitespace-nowrap text-xs font-medium text-slate-300 transition-colors hover:text-white"
          >
            Contact
          </Link>

        </div>
      </div>

      {/* ================= PAGE CONTENT ================= */}
      <main>
        {children}
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-white/10 bg-[#0B0F19] text-white">

        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">

            {/* BRAND */}
            <div>

              <Link
                href="/"
                className="text-lg font-semibold tracking-tight text-white"
              >
                BlazeByte{" "}
                <span className="text-cyan-400">
                  Studio
                </span>
              </Link>

              <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
                Practical technology learning designed to help students
                build useful skills, gain confidence, and prepare for
                their future.
              </p>

            </div>

            {/* ================= EXPLORE ================= */}
            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
                Explore
              </p>

              {/* NORMAL LINKS - NO BOXES */}
              <div className="mt-5 space-y-3">

                <Link
                  href="/"
                  className="
                    block
                    text-sm font-medium
                    text-slate-300
                    transition-colors
                    hover:text-white
                  "
                >
                  Home
                </Link>

                <Link
                  href="/about"
                  className="
                    block
                    text-sm font-medium
                    text-slate-300
                    transition-colors
                    hover:text-white
                  "
                >
                  About
                </Link>

                <Link
                  href="/why-us"
                  className="
                    block
                    text-sm font-medium
                    text-slate-300
                    transition-colors
                    hover:text-white
                  "
                >
                  Why Us
                </Link>

                <Link
                  href="/courses"
                  className="
                    block
                    text-sm font-medium
                    text-slate-300
                    transition-colors
                    hover:text-white
                  "
                >
                  Courses
                </Link>

              </div>

            </div>

            {/* ================= SUPPORT ================= */}
            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
                Support
              </p>

              <div className="mt-5 space-y-3">

                <Link
                  href="/contact"
                  className="
                    block
                    text-sm font-medium
                    text-slate-300
                    transition-colors
                    hover:text-white
                  "
                >
                  Contact
                </Link>

                <Link
                  href="/login"
                  className="
                    block
                    text-sm font-medium
                    text-slate-300
                    transition-colors
                    hover:text-white
                  "
                >
                  Student login
                </Link>

              </div>

            </div>

          </div>

          {/* ================= COPYRIGHT ================= */}
          <div className="mt-12 border-t border-white/[0.08] pt-6">

            <p className="text-xs text-slate-400">
              © 2026 BlazeByte Studio. All rights reserved.
            </p>

          </div>

        </div>

      </footer>

    </div>
  );
}