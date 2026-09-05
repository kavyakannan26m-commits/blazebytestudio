import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import AdminCourses from "../AdminCourses";

export default async function AdminCoursesPage() {
  await requireAdmin();

  return (
    <main className="min-h-screen bg-[#0B0F19] text-white">
      <header className="border-b border-white/10 bg-[#101827]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <Link href="/" className="text-lg font-bold tracking-tight text-white">
              BlazeByte
            </Link>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-400">
              Studio · Admin
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-sm text-slate-300 hover:text-white">Dashboard</Link>
            <Link href="/admin/courses" className="text-sm text-slate-300 hover:text-white">Courses</Link>
            <Link href="/admin/courses" className="text-sm text-slate-300 hover:text-white">Pricing</Link>
            <Link href="/admin/courses" className="text-sm text-slate-300 hover:text-white">Content</Link>
            <Link href="/admin/enquiries" className="text-sm text-slate-300 hover:text-white">Enquiries</Link>
            <form action="/signout" method="POST">
              <button
                type="submit"
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-400">
            Course editor
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">
            Manage Courses
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Create, edit, publish and manage your student programs.
          </p>
        </div>

        <AdminCourses />
      </div>
    </main>
  );
}
