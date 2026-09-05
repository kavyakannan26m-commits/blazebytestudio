"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type Course = {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  thumbnail_url: string | null;
  price: number;
  discount_price: number | null;
  level: string | null;
  duration: string | null;
  status: "draft" | "published" | "archived";
  featured: boolean;
  what_you_learn: string[];
  requirements: string[];
  projects: string[];
  category_id?: string | null;
};

const emptyForm: Omit<Course, "id"> = {
  title: "",
  slug: "",
  short_description: "",
  description: "",
  thumbnail_url: "",
  price: 0,
  discount_price: null,
  level: "Beginner",
  duration: "",
  status: "draft",
  featured: false,
  what_you_learn: [],
  requirements: [],
  projects: [],
  category_id: null,
};

export default function AdminCourses() {
  const supabase = createSupabaseBrowserClient();

  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Course, "id">>(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError("");

    const [coursesRes, categoriesRes] = await Promise.all([
      fetch("/api/admin/courses"),
      supabase.from("categories").select("*").order("name"),
    ]);

    const coursesResult = await coursesRes.json();
    if (!coursesRes.ok) {
      setError(coursesResult.error || "Unable to load courses.");
    } else {
      setCourses(coursesResult.courses as Course[]);
    }

    if (!categoriesRes.error) {
      setCategories(categoriesRes.data as Category[]);
    }

    setLoading(false);
  }

  function openEditForm(course: Course) {
    setForm({
      title: course.title,
      slug: course.slug,
      short_description: course.short_description || "",
      description: course.description || "",
      thumbnail_url: course.thumbnail_url || "",
      price: course.price,
      discount_price: course.discount_price,
      level: course.level,
      duration: course.duration,
      status: course.status,
      featured: course.featured,
      what_you_learn: course.what_you_learn || [],
      requirements: course.requirements || [],
      projects: course.projects || [],
      category_id: course.category_id || null,
    });
    setEditingId(course.id);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const payload = {
      id: editingId,
      ...form,
      slug: form.slug.trim().toLowerCase().replace(/\s+/g, "-"),
      price: Number(form.price),
      discount_price: form.discount_price ? Number(form.discount_price) : null,
    };

    if (!editingId) {
      setError("Only the three active courses can be edited.");
      setSaving(false);
      return;
    }

    const response = await fetch("/api/admin/courses", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    const error = response.ok ? null : new Error(result.error || "Unable to save course.");

    setSaving(false);

    if (error) {
      setError(error.message);
      return;
    }

    closeForm();
    setSuccess("Course changes saved successfully.");
    loadData();
  }

  if (loading) {
    return <p className="text-gray-400">Loading courses...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Course Management</h2>
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}
      {success && (
        <p className="mt-4 rounded-lg bg-green-500/10 px-4 py-3 text-sm text-green-400">
          {success}
        </p>
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
        {courses.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-gray-400">
            No active courses found. Run the course seed script in Supabase, then refresh this page.
          </div>
        ) : (
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-white/[0.05] text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="border-t border-white/5">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {course.thumbnail_url ? (
                      <img
                        src={course.thumbnail_url}
                        alt={course.title}
                        className="h-10 w-14 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-10 w-14 rounded-lg bg-white/10" />
                    )}
                    <div>
                      <p className="font-semibold text-white">{course.title}</p>
                      <p className="text-xs text-gray-500">{course.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {course.discount_price ? (
                    <>
                      <span className="text-white">₹{course.discount_price}</span>{" "}
                      <span className="text-xs text-gray-500 line-through">
                        ₹{course.price}
                      </span>
                    </>
                  ) : (
                    <span className="text-white">₹{course.price}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      course.status === "published"
                        ? "bg-green-400/10 text-green-400"
                        : course.status === "draft"
                        ? "bg-yellow-400/10 text-yellow-400"
                        : "bg-gray-400/10 text-gray-400"
                    }`}
                  >
                    {course.status}
                  </span>
                </td>
                <td className="px-4 py-3">{course.featured ? "⭐" : "—"}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => openEditForm(course)}
                    className="mr-3 text-cyan-400 hover:underline"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-10">
          <div className="max-h-full w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-gray-950 p-8">
            <h3 className="text-lg font-bold text-white">
              Edit Course
            </h3>

            <form onSubmit={handleSave} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  required
                  placeholder="Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-white outline-none focus:border-cyan-400"
                />
                <input
                  required
                  placeholder="Slug"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <textarea
                placeholder="Short description"
                value={form.short_description || ""}
                onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-white outline-none focus:border-cyan-400"
                rows={2}
              />

              <textarea
                placeholder="Full description"
                value={form.description || ""}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-white outline-none focus:border-cyan-400"
                rows={4}
              />

              <textarea
                placeholder="What students will learn (one item per line)"
                value={form.what_you_learn.join("\n")}
                onChange={(e) => setForm({ ...form, what_you_learn: e.target.value.split("\n").filter(Boolean) })}
                className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-white outline-none focus:border-cyan-400"
                rows={4}
              />

              <textarea
                placeholder="Requirements (one item per line)"
                value={form.requirements.join("\n")}
                onChange={(e) => setForm({ ...form, requirements: e.target.value.split("\n").filter(Boolean) })}
                className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-white outline-none focus:border-cyan-400"
                rows={3}
              />

              <textarea
                placeholder="Projects (one item per line)"
                value={form.projects.join("\n")}
                onChange={(e) => setForm({ ...form, projects: e.target.value.split("\n").filter(Boolean) })}
                className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-white outline-none focus:border-cyan-400"
                rows={3}
              />

              <input
                placeholder="Thumbnail URL"
                value={form.thumbnail_url || ""}
                onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-white outline-none focus:border-cyan-400"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  required
                  type="number"
                  placeholder="Price"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-white outline-none focus:border-cyan-400"
                />
                <input
                  type="number"
                  placeholder="Discount price"
                  value={form.discount_price ?? ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      discount_price: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                  className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <select
                  value={form.level || ""}
                  onChange={(e) => setForm({ ...form, level: e.target.value })}
                  className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-white outline-none focus:border-cyan-400"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>

                <input
                  placeholder="Duration (e.g. 8 weeks)"
                  value={form.duration || ""}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-white outline-none focus:border-cyan-400"
                />
              </div>

              {categories.length > 0 && (
                <select
                  value={form.category_id || ""}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value || null })}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-white outline-none focus:border-cyan-400"
                >
                  <option value="">No category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              )}

              <div className="flex items-center gap-6">
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value as Course["status"] })
                  }
                  className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-white outline-none focus:border-cyan-400"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>

                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  />
                  Featured
                </label>
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-xl border border-white/10 px-5 py-2.5 text-gray-300 hover:bg-white/[0.05]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-cyan-400 px-5 py-2.5 font-semibold text-gray-950 hover:bg-cyan-300 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}