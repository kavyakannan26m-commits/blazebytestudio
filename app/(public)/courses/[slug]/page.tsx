import Link from "next/link";
import { notFound } from "next/navigation";

import { CoursePricingCard } from "@/components/courses/course-pricing-card";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCourseBySlug } from "@/services/courses";

function cleanListItem(value: string) {
  return value
    .replace(/^(?:[ÃÂâ€‚¬™¢]|[^\p{L}\p{N}])+\s*/u, "")
    .trim();
}

type CourseDetailsProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CourseDetails({
  params,
}: CourseDetailsProps) {
  const { slug } = await params;

  const supabase = await createSupabaseServerClient();

  const data = await getCourseBySlug(supabase, slug);

  if (!data) {
    notFound();
  }

  const {
    course,
    modules,
    lessons,
    reviews,
  } = data;

  const price =
    course.discount_price ?? course.price;

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      <main className="section">
        <div className="container">

          {/* Back to Courses */}
          <Link
            href="/courses"
            className="text-sm text-slate-500 hover:text-white"
          >
            ← Courses
          </Link>

          {/* =====================================================
              COURSE INTRO + PRICE
          ===================================================== */}

          <div className="mt-7 grid gap-12 lg:grid-cols-[1.1fr_.9fr]">

            {/* Course intro */}
            <div>
              <p className="eyebrow">
                {course.level ?? "Course"}
              </p>

              <h1 className="section-title">
                {course.title}
              </h1>

              <p className="mt-5 text-lg leading-8 text-slate-300">
                {course.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-400">

                <span className="rounded-full border border-white/10 px-3 py-1">
                  {course.duration ?? "Self-paced"}
                </span>

                <span className="rounded-full border border-white/10 px-3 py-1">
                  {modules.length} modules
                </span>

                <span className="rounded-full border border-white/10 px-3 py-1">
                  {lessons.length} lessons
                </span>

              </div>
            </div>

            {/* Pricing card with enrollment modal */}
            <CoursePricingCard
              courseTitle={course.title}
              courseSlug={course.slug}
              price={price}
              originalPrice={course.discount_price ? course.price : null}
              thumbnailUrl={course.thumbnail_url}
            />

          </div>

          {/* =====================================================
              MAIN CONTENT
          ===================================================== */}

          <div className="mt-20 grid gap-16 lg:grid-cols-[1fr_360px]">

            <div className="space-y-16">

              {/* =================================================
                  WHAT YOU'LL LEARN
              ================================================= */}

              <section>

                <h2 className="text-2xl font-bold">
                  What you'll learn
                </h2>

                {course.what_you_learn.length > 0 ? (
                  <ul className="mt-6 grid gap-3 md:grid-cols-2">

                    {course.what_you_learn.map(
                      (item, index) => (
                        <li
                          key={index}
                          className="rounded-2xl border border-white/10 p-4 text-sm text-slate-300"
                        >
                          {cleanListItem(item)}
                        </li>
                      )
                    )}

                  </ul>
                ) : (
                  <p className="mt-5 text-sm text-slate-500">
                    Course learning outcomes will be added soon.
                  </p>
                )}

              </section>

              {/* =================================================
                  REQUIREMENTS
              ================================================= */}

              <section>

                <h2 className="text-2xl font-bold">
                  Requirements
                </h2>

                {course.requirements.length > 0 ? (
                  <ul className="mt-5 grid gap-3">

                    {course.requirements.map(
                      (item, index) => (
                        <li
                          key={index}
                          className="text-sm text-slate-400"
                        >
                          {cleanListItem(item)}
                        </li>
                      )
                    )}

                  </ul>
                ) : (
                  <p className="mt-5 text-sm text-slate-500">
                    No specific requirements.
                  </p>
                )}

              </section>

              {/* =================================================
                  PROJECTS
              ================================================= */}

              <section>

                <h2 className="text-2xl font-bold">
                  Projects
                </h2>

                {course.projects.length > 0 ? (
                  <div className="mt-6 grid gap-4 md:grid-cols-2">

                    {course.projects.map(
                      (project, index) => (
                        <div
                          key={index}
                          className="rounded-2xl border border-white/10 bg-white/[.03] p-5 text-sm text-slate-300"
                        >
                          {project}
                        </div>
                      )
                    )}

                  </div>
                ) : (
                  <p className="mt-5 text-sm text-slate-500">
                    Projects will be announced soon.
                  </p>
                )}

              </section>

              {/* =================================================
                  CURRICULUM
              ================================================= */}

              <section>

                <h2 className="text-2xl font-bold">
                  Curriculum
                </h2>

                {modules.length > 0 ? (
                  <div className="mt-6 space-y-3">

                    {modules.map((module) => (
                      <details
                        key={module.id}
                        className="rounded-2xl border border-white/10 bg-white/[.03] p-5"
                      >

                        <summary className="cursor-pointer font-semibold">
                          {module.position}.{" "}
                          {module.title}
                        </summary>

                        {module.description && (
                          <p className="mt-2 text-sm text-slate-400">
                            {module.description}
                          </p>
                        )}

                        <ul className="mt-4 grid gap-2">

                          {lessons
                            .filter(
                              (lesson) =>
                                lesson.module_id ===
                                module.id
                            )
                            .map((lesson) => (
                              <li
                                key={lesson.id}
                                className="flex justify-between gap-4 rounded-xl bg-black/20 p-3 text-sm text-slate-400"
                              >

                                <span>
                                  {lesson.title}

                                  {lesson.is_preview && (
                                    <span className="ml-2 text-cyan-300">
                                      · Preview
                                    </span>
                                  )}
                                </span>

                                <span>
                                  {lesson.duration
                                    ? `${lesson.duration} min`
                                    : ""}
                                </span>

                              </li>
                            ))}

                        </ul>

                      </details>
                    ))}

                  </div>
                ) : (
                  <p className="mt-5 text-sm text-slate-500">
                    Curriculum will be available soon.
                  </p>
                )}

              </section>

              {/* =================================================
                  REVIEWS
              ================================================= */}

              <section>

                <h2 className="text-2xl font-bold">
                  Reviews
                </h2>

                {reviews.length === 0 ? (
                  <p className="mt-5 text-sm text-slate-500">
                    No approved reviews yet.
                  </p>
                ) : (
                  <div className="mt-6 grid gap-4">

                    {reviews.map((review) => (
                      <blockquote
                        key={review.id}
                        className="rounded-2xl border border-white/10 p-5"
                      >

                        <p className="text-cyan-300">
                          {"★".repeat(
                            Math.max(
                              0,
                              Math.min(
                                5,
                                review.rating
                              )
                            )
                          )}

                          {"☆".repeat(
                            Math.max(
                              0,
                              5 -
                                Math.max(
                                  0,
                                  Math.min(
                                    5,
                                    review.rating
                                  )
                                )
                            )
                          )}
                        </p>

                        {review.review && (
                          <p className="mt-3 text-sm leading-6 text-slate-300">
                            {review.review}
                          </p>
                        )}

                        <footer className="mt-3 text-xs text-slate-500">
                          {review.profiles?.full_name ??
                            "Learner"}
                        </footer>

                      </blockquote>
                    ))}

                  </div>
                )}

              </section>

              {/* =================================================
                  FAQ
              ================================================= */}

              <section>

                <h2 className="text-2xl font-bold">
                  FAQ
                </h2>

                {course.faq.length > 0 ? (
                  <div className="mt-6 divide-y divide-white/10 rounded-2xl border border-white/10">

                    {course.faq.map((faq, index) => (
                      <details
                        key={index}
                        className="p-5"
                      >

                        <summary className="cursor-pointer font-semibold">
                          {faq.question}
                        </summary>

                        <p className="mt-3 text-sm leading-6 text-slate-400">
                          {faq.answer}
                        </p>

                      </details>
                    ))}

                  </div>
                ) : (
                  <p className="mt-5 text-sm text-slate-500">
                    FAQ will be added soon.
                  </p>
                )}

              </section>

            </div>

            {/* =================================================
                CTA
            ================================================= */}

            <aside>

              <div className="sticky top-24 rounded-3xl border border-cyan-300/20 bg-cyan-300/5 p-6">

                <p className="text-sm text-cyan-200">
                  Ready to learn?
                </p>

                <h3 className="mt-2 text-xl font-bold">
                  Start this course
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  Create an account or sign in to continue
                  to enrollment.
                </p>

                <Link
                  href={`/login?next=/courses/${course.slug}`}
                  className="mt-5 block rounded-xl border border-white/10 bg-[#0B0F19] px-5 py-3 text-center font-semibold text-white transition duration-200 hover:border-white/30 hover:bg-[#151B27]"
                >
                  Continue
                </Link>

              </div>

            </aside>

          </div>

        </div>
      </main>
    </div>
  );
}