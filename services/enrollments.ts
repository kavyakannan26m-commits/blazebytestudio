type SupabaseClientLike = any;

export async function getVerifiedEnrollment(
  supabase: SupabaseClientLike,
  userId: string,
  courseId: string
) {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("enrollments")
    .select("*")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .eq("payment_status", "paid")
    .eq("verification_status", "verified")
    .eq("active", true)
    .maybeSingle();

  if (error) {
    console.error("getVerifiedEnrollment error:", error.message);
    return null;
  }

  return data;
}

export async function getEnrollmentForCourse(
  supabase: SupabaseClientLike,
  userId: string,
  courseId: string
) {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("enrollments")
    .select("*")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .maybeSingle();

  if (error) {
    console.error("getEnrollmentForCourse error:", error.message);
    return null;
  }

  return data;
}

export async function createPendingEnrollment(
  supabase: SupabaseClientLike,
  userId: string,
  courseId: string
) {
  const existing = await getEnrollmentForCourse(supabase, userId, courseId);
  if (existing) {
    return existing;
  }

  const { data, error } = await supabase
    .from("enrollments")
    .insert({
      user_id: userId,
      course_id: courseId,
      payment_status: "pending",
      verification_status: "pending",
      active: false,
    })
    .select("*")
    .single();

  if (error) {
    console.error("createPendingEnrollment error:", error.message);
    return null;
  }

  return data;
}
