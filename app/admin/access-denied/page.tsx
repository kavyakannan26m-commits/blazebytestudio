import Link from "next/link";

export default function AccessDeniedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F6F8FC] px-6 text-[#101828]">
      <section className="w-full max-w-lg rounded-2xl border border-[#E5E7EB] bg-white p-8 text-center shadow-sm sm:p-12">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#2563EB]">BlazeByte Studio</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">Access Denied</h1>
        <p className="mt-4 text-sm leading-6 text-[#667085]">
          You do not have permission to access the BlazeByte Studio Admin Dashboard.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="rounded-lg bg-[#0F2A5F] px-5 py-3 text-sm font-semibold text-white hover:bg-[#173B7A]">
            Return to Website
          </Link>
          <Link href="/admin/login" className="rounded-lg border border-[#E5E7EB] px-5 py-3 text-sm font-semibold text-[#344054] hover:bg-[#F9FAFB]">
            Admin Login
          </Link>
        </div>
      </section>
    </main>
  );
}
