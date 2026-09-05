import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0B0F19] text-white">

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full border border-blue-400/[0.06]" />

        <div className="pointer-events-none absolute -bottom-64 -left-48 h-[600px] w-[600px] rounded-full border border-purple-400/[0.04]" />

        <div className="relative mx-auto flex min-h-[680px] max-w-7xl items-center px-6 py-24 lg:px-8">
          <div className="max-w-4xl">

            {/* Brand */}
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-400">
              BlazeByte Studio
            </p>

            {/* Hero */}
            <h1 className="mt-7 max-w-4xl text-5xl font-semibold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
              Learn with purpose.
              <br />
              Build your future.
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Practical technology learning designed to help you
              understand better, build useful skills, and grow with
              confidence.
            </p>

            {/* Trust */}
            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-slate-400">
              <span>Practical learning</span>

              <span className="h-1 w-1 rounded-full bg-blue-400" />

              <span>Real-world skills</span>

              <span className="h-1 w-1 rounded-full bg-blue-400" />

              <span>Learn at your pace</span>
            </div>

            {/* Login is intentionally NOT here */}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="border-t border-white/[0.07]">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">
                About Us
              </p>
            </div>

            <div>
              <h2 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                A learning experience built around understanding,
                practice, and progress.
              </h2>

              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-400">
                BlazeByte Studio brings together structured learning,
                practical experience, and a focused digital environment
                to help learners develop useful skills and move forward
                with confidence.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* LEARNING EXPERIENCE */}
      <section className="border-t border-white/[0.07]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">

          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">
              The Learning Experience
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Learn something useful.
              <br />
              Then put it into practice.
            </h2>
          </div>

          <div className="mt-14 border-t border-white/[0.08]">

            {/* 01 */}
            <div className="grid gap-5 border-b border-white/[0.08] py-8 sm:grid-cols-[80px_1fr_1.2fr]">
              <span className="text-sm font-semibold text-blue-400">
                01
              </span>

              <h3 className="text-xl font-semibold">
                Understand
              </h3>

              <p className="max-w-xl text-base leading-7 text-slate-400">
                Learn concepts through clear and structured
                explanations that make difficult ideas easier
                to understand.
              </p>
            </div>

            {/* 02 */}
            <div className="grid gap-5 border-b border-white/[0.08] py-8 sm:grid-cols-[80px_1fr_1.2fr]">
              <span className="text-sm font-semibold text-blue-400">
                02
              </span>

              <h3 className="text-xl font-semibold">
                Practise
              </h3>

              <p className="max-w-xl text-base leading-7 text-slate-400">
                Apply what you learn through practical activities,
                projects, and meaningful hands-on experience.
              </p>
            </div>

            {/* 03 */}
            <div className="grid gap-5 py-8 sm:grid-cols-[80px_1fr_1.2fr]">
              <span className="text-sm font-semibold text-blue-400">
                03
              </span>

              <h3 className="text-xl font-semibold">
                Progress
              </h3>

              <p className="max-w-xl text-base leading-7 text-slate-400">
                Keep building your knowledge and develop skills
                that support your academic and professional journey.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* BRAND STATEMENT */}
      <section className="border-t border-white/[0.07]">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">
              BlazeByte Studio
            </p>

            <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Building skills today for the opportunities of tomorrow.
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-400">
              We believe good learning should be clear, practical,
              accessible, and focused on helping people make meaningful
              progress.
            </p>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.07]">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <p className="text-center text-sm text-slate-500">
            © 2026 All rights reserved.
          </p>
        </div>
      </footer>

    </main>
  );
}