import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export default async function AdminEnquiriesPage() {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  const { data: enquiries, error } = supabase
    ? await supabase.from("customer_requests").select("reference_number,name,email,phone,subject,message,created_at").order("created_at", { ascending: false })
    : { data: null, error: new Error("Admin database access is not configured.") };

  return (
    <main className="min-h-screen bg-[#F6F8FC] text-[#111827]">
      <header className="border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div><Link href="/" className="text-lg font-bold text-[#0F2A5F]">BlazeByte</Link><p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#667085]">Studio · Admin</p></div>
          <nav className="flex items-center gap-4 text-sm"><Link href="/admin" className="text-[#667085] hover:text-[#0F2A5F]">Dashboard</Link><Link href="/admin/courses" className="text-[#667085] hover:text-[#0F2A5F]">Courses</Link><Link href="/admin/courses" className="text-[#667085] hover:text-[#0F2A5F]">Pricing</Link><Link href="/admin/courses" className="text-[#667085] hover:text-[#0F2A5F]">Content</Link><Link href="/admin/enquiries" className="text-[#667085] hover:text-[#0F2A5F]">Enquiries</Link><form action="/signout" method="POST"><button className="rounded-lg border border-[#E5E7EB] px-4 py-2 font-semibold text-[#344054]">Sign out</button></form></nav>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-6 py-10">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#2563EB]">Customer communication</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">Enquiries</h1>
        <p className="mt-2 text-sm text-[#667085]">Newest customer requests appear first.</p>
        {error ? <p className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">Unable to load enquiries.</p> : !enquiries?.length ? <div className="mt-8 rounded-2xl border border-dashed border-[#CBD5E1] bg-white px-6 py-16 text-center"><h2 className="font-semibold">No enquiries yet</h2><p className="mt-2 text-sm text-[#667085]">New customer messages will appear here.</p></div> : <div className="mt-8 space-y-4">{enquiries.map((enquiry) => <article key={enquiry.reference_number} className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm"><div className="flex flex-col justify-between gap-2 sm:flex-row"><div><p className="text-xs font-semibold uppercase tracking-wider text-[#2563EB]">{enquiry.reference_number}</p><h2 className="mt-2 text-lg font-semibold">{enquiry.subject}</h2></div><time className="text-sm text-[#667085]">{new Date(enquiry.created_at).toLocaleString()}</time></div><div className="mt-4 grid gap-2 text-sm text-[#475467] sm:grid-cols-3"><p><strong>Name:</strong> {enquiry.name}</p><p><strong>Email:</strong> {enquiry.email}</p><p><strong>Phone:</strong> {enquiry.phone}</p></div><p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-[#344054]">{enquiry.message}</p></article>)}</div>}
      </div>
    </main>
  );
}
