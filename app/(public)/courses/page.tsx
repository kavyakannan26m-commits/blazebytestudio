import type { Course } from "@/types/database";

import { CourseCard } from "@/components/courses/course-card";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCourses } from "@/services/courses";
import { ACTIVE_COURSE_SLUGS } from "@/lib/active-courses";

const fallbackCourses: Course[] = [
  {
    id: "fallback-ai-mastery",
    title: "AI Mastery for Work & Business",
    slug: "ai-mastery-for-work-business",
    short_description: "Master AI tools and strategies for work and business growth.",
    description: "Learn practical AI applications, tools, and strategies for modern workplaces.",
    thumbnail_url: null,
    price: 499,
    discount_price: null,
    level: "Beginner",
    duration: "4 weeks",
    status: "published",
    featured: true,
    what_you_learn: [],
    requirements: [],
    projects: [],
    faq: [],
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-digital-marketing",
    title: "AI-Powered Digital Marketing",
    slug: "ai-powered-digital-marketing",
    short_description: "Build smarter marketing campaigns with practical AI tools.",
    description: "Master AI-driven content creation, audience targeting, campaign optimization, and analytics.",
    thumbnail_url: null,
    price: 599,
    discount_price: null,
    level: "Intermediate",
    duration: "5 weeks",
    status: "published",
    featured: true,
    what_you_learn: [],
    requirements: [],
    projects: [],
    faq: [],
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-data-analytics",
    title: "Data Analytics + AI",
    slug: "data-analytics-ai",
    short_description: "Turn raw data into useful business insights with AI.",
    description: "Learn data analysis, visualization, and AI-driven decision making for modern business.",
    thumbnail_url: null,
    price: 999,
    discount_price: null,
    level: "Intermediate",
    duration: "6 weeks",
    status: "published",
    featured: true,
    what_you_learn: [],
    requirements: [],
    projects: [],
    faq: [],
    created_at: "",
    updated_at: "",
  },
];

export default async function CoursesPage() {
  const supabase = await createSupabaseServerClient();
  const publishedCourses = supabase ? await getCourses(supabase) : [];
  
  // Keep the public catalogue limited to the active course set.
  const filteredPublishedCourses = publishedCourses.filter((course) =>
    ACTIVE_COURSE_SLUGS.includes(course.slug as typeof ACTIVE_COURSE_SLUGS[number])
  );
  const courses = filteredPublishedCourses.length > 0 ? filteredPublishedCourses : fallbackCourses;

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      <main className="section">
        <div className="container">
          <div className="mb-10">
            <p className="eyebrow">Courses</p>
            <h1 className="section-title">Explore our courses</h1>
          </div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
