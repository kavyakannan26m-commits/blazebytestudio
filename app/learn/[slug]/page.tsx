import { notFound, redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCourseBySlug } from "@/services/courses";
import { getVerifiedEnrollment } from "@/services/enrollments";

type LearningPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function LearningPage({ params }: LearningPageProps) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    redirect(`/login?next=/learn/${encodeURIComponent(slug)}`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/learn/${encodeURIComponent(slug)}`);
  }

  const courseData = await getCourseBySlug(supabase, slug);
  if (!courseData) {
    notFound();
  }

  const enrollment = await getVerifiedEnrollment(
    supabase,
    user.id,
    courseData.course.id
  );

  if (!enrollment) {
    redirect(`/courses/${encodeURIComponent(slug)}`);
  }

  return (
    <main className="min-h-screen bg-[#0B0F19] px-6 py-14 text-white">
      <div className="mx-auto max-w-5xl">
        <p className="eyebrow">Your learning page</p>
        <h1 className="section-title mt-3">{courseData.course.title}</h1>

        <div className="mt-10 space-y-4">
          {courseData.modules.map((module) => (
            <section
              key={module.id}
              className="rounded-2xl border border-white/10 bg-white/[.04] p-6"
            >
              <h2 className="text-xl font-semibold">
                {module.position}. {module.title}
              </h2>
              {module.description && (
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {module.description}
                </p>
              )}
              <ul className="mt-5 space-y-2">
                {courseData.lessons
                  .filter((lesson) => lesson.module_id === module.id)
                  .map((lesson) => (
                    <li
                      key={lesson.id}
                      className="rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300"
                    >
                      {lesson.position}. {lesson.title}
                    </li>
                  ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
