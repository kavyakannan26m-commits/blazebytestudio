import Link from "next/link";
import { ACTIVE_COURSE_SLUGS } from "@/lib/active-courses";
import { requireAdmin } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export default async function AdminPage() {
  const { username } = await requireAdmin();
  const supabase = createSupabaseAdminClient();

  // Get courses
  const { data: courses, error: coursesError } = supabase
    ? await supabase
        .from("courses")
        .select("id,title,slug,description,price,status,thumbnail_url,created_at")
        .in("slug", [...ACTIVE_COURSE_SLUGS])
        .order("created_at", { ascending: false })
    : { data: null, error: new Error("Admin database access is not configured.") };

  if (coursesError) {
    console.error("Admin courses error:", coursesError);
  }

  const totalCourses = courses?.length ?? 0;

  const publishedCourses =
    courses?.filter(
      (course) => course.status === "published"
    ).length ?? 0;

  const draftCourses =
    courses?.filter(
      (course) => course.status === "draft"
    ).length ?? 0;

  return (
    <main className="min-h-screen bg-[#0B0F19] text-white">
      {/* HEADER */}
      <header className="border-b border-white/10 bg-[#101827]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <Link
              href="/"
              className="text-lg font-bold tracking-tight text-white"
            >
              BlazeByte
            </Link>

            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-400">
              Studio · Admin
            </p>
          </div>

          <div className="flex items-center gap-4">
            <nav className="hidden items-center gap-4 text-sm lg:flex">
              <Link href="/admin" className="text-slate-300 hover:text-white">Dashboard</Link>
              <Link href="/admin/courses" className="text-slate-300 hover:text-white">Courses</Link>
              <Link href="/admin/courses" className="text-slate-300 hover:text-white">Pricing</Link>
              <Link href="/admin/courses" className="text-slate-300 hover:text-white">Content</Link>
              <Link href="/admin/enquiries" className="text-slate-300 hover:text-white">Enquiries</Link>
            </nav>
            <Link
              href="/"
              className="hidden text-sm font-medium text-slate-300 transition hover:text-white sm:block"
            >
              Website
            </Link>

            <form action="/signout" method="POST">
              <button
                type="submit"
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* INTRO */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-400">
            Administration
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Manage courses, pricing, content and publishing.
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Signed in as {username}
          </p>
        </div>

        {/* STATS */}
        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-400">
              Total Courses
            </p>

            <p className="mt-3 text-3xl font-bold text-white">
              {totalCourses}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-400">
              Published
            </p>

            <p className="mt-3 text-3xl font-bold text-green-600">
              {publishedCourses}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-400">
              Draft
            </p>

            <p className="mt-3 text-3xl font-bold text-amber-600">
              {draftCourses}
            </p>
          </div>
        </section>

        {/* COURSE MANAGEMENT */}
        <section className="mt-10 rounded-2xl border border-white/10 bg-white/[0.035] shadow-sm">
          <div className="border-b border-white/10 px-6 py-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Course Management
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  View and manage your courses.
                </p>
              </div>

              <Link
                href="/admin/courses"
                className="inline-flex items-center justify-center rounded-lg bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-gray-950 transition hover:bg-cyan-300"
              >
                Manage Courses →
              </Link>
            </div>
          </div>

          {/* COURSE LIST */}
          <div className="divide-y divide-white/10">
            {!courses?.length ? (
              <div className="px-6 py-12 text-center">
                  <p className="text-sm font-medium text-slate-200">
                  No courses found.
                </p>

                  <p className="mt-1 text-sm text-slate-500">
                  Create your first course from Course Management.
                </p>
              </div>
            ) : (
              courses.map((course) => (
                <div
                  key={course.id}
                  className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-white">
                      {course.title}
                    </h3>

                    <p className="mt-1 truncate text-sm text-slate-400">
                      {course.slug}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        course.status === "published"
                          ? "bg-green-50 text-green-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {course.status}
                    </span>

                    {course.price !== null &&
                      course.price !== undefined && (
                        <span className="text-sm font-semibold text-slate-200">
                          ₹{course.price}
                        </span>
                      )}

                    {course.slug && (
                      <Link
                        href={`/courses/${course.slug}`}
                        className="text-sm font-semibold text-cyan-400 hover:underline"
                      >
                        View
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* QUICK ACCESS */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Link
            href="/admin/courses"
            className="rounded-xl border border-white/10 bg-white/[0.035] p-5 shadow-sm transition hover:border-cyan-400/40 hover:shadow"
          >
            <p className="font-semibold text-white">
              Courses
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Add and edit courses.
            </p>
          </Link>

          <Link
            href="/admin/courses"
            className="rounded-xl border border-white/10 bg-white/[0.035] p-5 shadow-sm transition hover:border-cyan-400/40 hover:shadow"
          >
            <p className="font-semibold text-white">
              Pricing
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Manage course prices.
            </p>
          </Link>

          <Link
            href="/admin/courses"
            className="rounded-xl border border-white/10 bg-white/[0.035] p-5 shadow-sm transition hover:border-cyan-400/40 hover:shadow"
          >
            <p className="font-semibold text-white">
              Content
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Manage course information.
            </p>
          </Link>

          <Link
            href="/admin/courses"
            className="rounded-xl border border-white/10 bg-white/[0.035] p-5 shadow-sm transition hover:border-cyan-400/40 hover:shadow"
          >
            <p className="font-semibold text-white">
              Enquiries
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Review customer messages.
            </p>
          </Link>
        </section>
      </div>
    </main>
  );
}