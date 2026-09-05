import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { ACTIVE_COURSE_SLUGS } from "@/lib/active-courses";
import { getAdminSession } from "@/lib/admin-auth";

const editableFields = [
  "title",
  "slug",
  "short_description",
  "description",
  "thumbnail_url",
  "price",
  "discount_price",
  "level",
  "duration",
  "status",
  "featured",
  "what_you_learn",
  "requirements",
  "projects",
  "faq",
] as const;

async function getAuthorizedAdmin() {
  if (!await getAdminSession()) return { error: "Authentication required.", status: 401 as const };
  return { adminClient: createSupabaseAdminClient() };
}

export async function GET() {
  const auth = await getAuthorizedAdmin();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (!auth.adminClient) {
    return NextResponse.json(
      { error: "Admin database access is not configured. Add a valid SUPABASE_SERVICE_ROLE_KEY." },
      { status: 503 }
    );
  }

  const { data, error } = await auth.adminClient
    .from("courses")
    .select("*")
    .in("slug", [...ACTIVE_COURSE_SLUGS])
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ courses: data });
}

export async function PATCH(request: Request) {
  const auth = await getAuthorizedAdmin();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const body = await request.json();
  const id = typeof body.id === "string" ? body.id : "";
  const updates = Object.fromEntries(
    editableFields.filter((field) => field in body).map((field) => [field, body[field]])
  );

  if (!id || typeof updates.title !== "string" || !updates.title.trim()) {
    return NextResponse.json({ error: "A course title is required." }, { status: 400 });
  }
  if (typeof updates.price !== "number" || !Number.isFinite(updates.price) || updates.price < 0) {
    return NextResponse.json({ error: "Price must be a valid non-negative number." }, { status: 400 });
  }
  if (typeof updates.slug !== "string" || !ACTIVE_COURSE_SLUGS.includes(updates.slug as typeof ACTIVE_COURSE_SLUGS[number])) {
    return NextResponse.json({ error: "Only the three active courses can be edited." }, { status: 400 });
  }
  if (!["draft", "published", "archived"].includes(updates.status as string)) {
    return NextResponse.json({ error: "Invalid course status." }, { status: 400 });
  }

  const adminClient = auth.adminClient;
  if (!adminClient) {
    return NextResponse.json({ error: "Admin database access is not configured." }, { status: 503 });
  }

  const { data, error } = await adminClient
    .from("courses")
    .update(updates)
    .eq("id", id)
    .in("slug", [...ACTIVE_COURSE_SLUGS])
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ course: data });
}
