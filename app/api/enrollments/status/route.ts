import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCourseBySlug } from "@/services/courses";
import { getEnrollmentForCourse } from "@/services/enrollments";

export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get("course");
  const supabase = await createSupabaseServerClient();

  if (!slug || !supabase) {
    return NextResponse.json({ status: "failed" }, { status: 400 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ status: "failed" }, { status: 401 });
  }

  const courseData = await getCourseBySlug(supabase, slug);
  if (!courseData) {
    return NextResponse.json({ status: "failed" }, { status: 404 });
  }

  const enrollment = await getEnrollmentForCourse(
    supabase,
    user.id,
    courseData.course.id
  );

  return NextResponse.json({
    status: enrollment?.verification_status ?? "pending",
    paymentStatus: enrollment?.payment_status ?? "pending",
    active: enrollment?.active === true,
  });
}
