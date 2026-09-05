import type {
  Course,
  Module,
  Lesson,
  Review,
  Category,
} from "@/types/database";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ACTIVE_COURSE_SLUGS } from "@/lib/active-courses";

type SupabaseClientLike = any;

/* =========================================================
   GET ALL PUBLISHED COURSES
========================================================= */

export async function getCourses(
  supabase: SupabaseClientLike
): Promise<Course[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("status", "published")
    .in("slug", [...ACTIVE_COURSE_SLUGS])
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getCourses error:", error.message);
    return [];
  }

  return (data ?? []) as Course[];
}

/* =========================================================
   GET FEATURED COURSES
========================================================= */

export async function getFeaturedCourses(
  supabase: SupabaseClientLike
): Promise<Course[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("status", "published")
    .eq("featured", true)
    .in("slug", [...ACTIVE_COURSE_SLUGS])
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getFeaturedCourses error:", error.message);
    return [];
  }

  return (data ?? []) as Course[];
}

/* =========================================================
   GET CATEGORIES
========================================================= */

export async function getCategories(
  supabase: SupabaseClientLike
): Promise<Category[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("getCategories error:", error.message);
    return [];
  }

  return (data ?? []) as Category[];
}

/* =========================================================
   GET COURSE BY SLUG
========================================================= */

export async function getCourseBySlug(
  supabase: SupabaseClientLike,
  slug: string
): Promise<{
  course: Course;
  modules: Module[];
  lessons: Lesson[];
  reviews: Review[];
} | null> {
  if (!supabase) {
    return null;
  }

  /* -------------------------------------------------------
     COURSE
  ------------------------------------------------------- */

  const {
    data: course,
    error: courseError,
  } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .in("slug", [...ACTIVE_COURSE_SLUGS])
    .eq("status", "published")
    .maybeSingle();

  if (courseError) {
    console.error("getCourseBySlug course error:", courseError.message);
    return null;
  }

  if (!course) {
    return null;
  }

  /* -------------------------------------------------------
     MODULES
  ------------------------------------------------------- */

  const {
    data: modules,
    error: modulesError,
  } = await supabase
    .from("modules")
    .select("*")
    .eq("course_id", course.id)
    .order("position", { ascending: true });

  if (modulesError) {
    console.error(
      "getCourseBySlug modules error:",
      modulesError.message
    );
  }

  const moduleRows = (modules ?? []) as Module[];

  /* -------------------------------------------------------
     LESSONS
  ------------------------------------------------------- */

  const moduleIds = moduleRows.map(
    (module) => module.id
  );

  let lessonRows: Lesson[] = [];

  if (moduleIds.length > 0) {
    const {
      data: lessons,
      error: lessonsError,
    } = await supabase
      .from("lessons")
      .select("*")
      .in("module_id", moduleIds)
      .order("position", { ascending: true });

    if (lessonsError) {
      console.error(
        "getCourseBySlug lessons error:",
        lessonsError.message
      );
    }

    lessonRows = (lessons ?? []) as Lesson[];
  }

  /* -------------------------------------------------------
     REVIEWS
     
     IMPORTANT:
     Do NOT use profiles(full_name) here.
     That nested query requires a Supabase foreign-key
     relationship between reviews and profiles.
  ------------------------------------------------------- */

  const {
    data: reviews,
    error: reviewsError,
  } = await supabase
    .from("reviews")
    .select(
      "id,course_id,rating,review,status,created_at"
    )
    .eq("course_id", course.id)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  /*
     Reviews are optional for the course page.
     If reviews cannot be loaded, simply continue with
     an empty review list instead of breaking the page.
  */

  if (reviewsError) {
    // Don't throw and don't break the course page.
    // The course itself can still be displayed.
    return {
      course: course as Course,
      modules: moduleRows,
      lessons: lessonRows,
      reviews: [],
    };
  }

  /* -------------------------------------------------------
     NORMALIZE REVIEWS
  ------------------------------------------------------- */

  const normalizedReviews: Review[] = (
    reviews ?? []
  ).map((review: any) => {
    return {
      id: String(review.id),
      course_id: String(review.course_id),
      rating: Number(review.rating ?? 0),
      review: review.review ?? null,
      status: String(review.status ?? ""),
      created_at: String(review.created_at),

      /*
         We intentionally keep this null because we are
         no longer requesting profiles(full_name).
      */
      profiles: null,
    };
  });

  /* -------------------------------------------------------
     RETURN
  ------------------------------------------------------- */

  return {
    course: course as Course,
    modules: moduleRows,
    lessons: lessonRows,
    reviews: normalizedReviews,
  };
}

/* =========================================================
   GET PUBLISHED COURSES
========================================================= */

export async function getPublishedCourses(): Promise<{
  courses: Course[];
  configured: boolean;
}> {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error(
      "Supabase environment variables are missing."
    );

    return {
      courses: [],
      configured: false,
    };
  }

  const supabase =
    await createSupabaseServerClient();

  if (!supabase) {
    console.error(
      "Supabase server client could not be created."
    );

    return {
      courses: [],
      configured: false,
    };
  }

  const courses = await getCourses(supabase);

  return {
    courses,
    configured: true,
  };
}