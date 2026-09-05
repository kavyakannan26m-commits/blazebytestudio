import { EnrollmentForm } from "@/components/courses/enrollment-form";
import { notFound } from "next/navigation";

type EnrollPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const courseData: Record<string, { name: string; fee: number }> = {
  "ai-mastery-for-work-business": {
    name: "AI Mastery for Work & Business",
    fee: 499,
  },
  "ai-powered-digital-marketing": {
    name: "AI-Powered Digital Marketing",
    fee: 599,
  },
  "data-analytics-ai": {
    name: "Data Analytics + AI",
    fee: 999,
  },
};

export default async function EnrollPage({ params }: EnrollPageProps) {
  const { slug } = await params;
  const course = courseData[slug];

  if (!course) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      <main className="section">
        <div className="container max-w-2xl">
          <a
            href="/courses"
            className="mb-8 inline-block text-sm text-slate-400 transition hover:text-white"
          >
            ← Back to Courses
          </a>

          <div className="rounded-3xl border border-white/10 bg-white/[.04] p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white">{course.name}</h1>
              <p className="mt-3 text-2xl font-bold text-cyan-300">₹{course.fee}</p>
            </div>

            <EnrollmentForm
              courseSlug={slug}
              courseName={course.name}
              courseFee={course.fee}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
