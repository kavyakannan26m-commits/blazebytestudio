import Link from "next/link";

import type { Course } from "@/types/database";

export function CourseCard({ course }: { course: Course }) {
  const price = course.discount_price ?? course.price;

  return (
    <article
      className="
        group
        overflow-hidden
        rounded-3xl
        border border-white/10
        bg-[#0D121D]
        transition-all duration-300
        hover:-translate-y-1
        hover:border-cyan-300/30
      "
    >
      {/* =====================================================
          COURSE IMAGE / VISUAL
      ===================================================== */}

      <div className="aspect-[16/9] overflow-hidden bg-gradient-to-br from-cyan-300/20 via-slate-800 to-indigo-500/20">
        {course.thumbnail_url ? (
          <img
            src={course.thumbnail_url}
            alt={course.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="grid h-full place-items-center bg-gradient-to-br from-cyan-300/10 via-[#0D121D] to-indigo-500/10">
            <span className="text-4xl font-black tracking-wider text-white/20">
              BLAZEBYTE
            </span>
          </div>
        )}
      </div>

      {/* =====================================================
          COURSE CONTENT
      ===================================================== */}

      <div className="p-6">

        {/* Level + Duration */}

        <div className="flex items-center justify-between gap-3">

          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
            {course.level ?? "All levels"}
          </span>

          <span className="text-xs text-slate-500">
            {course.duration ?? "Self-paced"}
          </span>

        </div>

        {/* Course Title */}

        <h3 className="mt-4 text-xl font-semibold leading-7 text-white">
          {course.title}
        </h3>

        {/* Description */}

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">
          {course.short_description}
        </p>

        {/* =====================================================
            PRICE + ACTIONS
        ===================================================== */}

        <div className="mt-6 border-t border-white/[0.07] pt-5 space-y-3">

          {/* PRICE */}

          <div>

            <p className="text-xs text-slate-500">
              Course price
            </p>

            <p className="mt-1 text-2xl font-bold text-cyan-300">
              ₹{price.toLocaleString("en-IN")}
            </p>

            {course.discount_price !== null &&
              course.discount_price !== undefined &&
              course.discount_price < course.price && (
                <p className="mt-1 text-xs text-slate-600 line-through">
                  ₹{course.price.toLocaleString("en-IN")}
                </p>
              )}

          </div>

          {/* ACTION BUTTONS */}

          <div className="pt-2">

            {/* Enroll Now - Navigate to enrollment page */}
            <Link
              href={`/enroll/${course.slug}`}
              className="
                block
                w-full
                !inline-flex
                !items-center
                !justify-center
                !rounded-xl
                !border
                !border-cyan-500/50
                !bg-gradient-to-r
                !from-cyan-500/10
                !to-purple-500/10
                !px-3
                !py-2.5
                !text-sm
                !font-semibold
                !text-cyan-300
                !no-underline
                transition-all
                duration-200
                hover:!-translate-y-0.5
                hover:!border-cyan-400
                hover:!from-cyan-500/20
                hover:!to-purple-500/20
                hover:!text-cyan-200
                focus:!outline-none
              "
            >
              Enroll Now
            </Link>

          </div>

        </div>

      </div>
    </article>
  );
}