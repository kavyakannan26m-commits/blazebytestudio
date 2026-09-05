"use client";

import Link from "next/link";

type CoursePricingCardProps = {
  courseTitle: string;
  courseSlug: string;
  price: number;
  originalPrice: number | null;
  thumbnailUrl: string | null;
};

export function CoursePricingCard({
  courseTitle,
  courseSlug,
  price,
  originalPrice,
  thumbnailUrl,
}: CoursePricingCardProps) {
  return (
    <aside className="h-fit overflow-hidden rounded-3xl border border-white/10 bg-white/[.04]">
      <div className="aspect-video bg-gradient-to-br from-cyan-300/20 to-indigo-500/10">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={courseTitle}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-6 text-center">
            <span className="text-xl font-bold text-white">{courseTitle}</span>
          </div>
        )}
      </div>

      <div className="p-6 space-y-4">
        <div>
          <p className="text-sm text-slate-400">Course price</p>
          <p className="mt-1 text-3xl font-bold">
            ₹{price.toLocaleString("en-IN")}
          </p>
          {originalPrice !== null && (
            <p className="mt-1 text-sm text-slate-500 line-through">
              ₹{originalPrice.toLocaleString("en-IN")}
            </p>
          )}
        </div>

        <div className="space-y-2 pt-2">
          {/* Enroll Now - Navigate to enrollment page */}
          <Link
            href={`/enroll/${courseSlug}`}
            className="block rounded-xl border border-cyan-500/50 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 px-6 py-3 text-center font-semibold text-cyan-300 transition hover:border-cyan-400 hover:from-cyan-500/20 hover:to-purple-500/20 hover:text-cyan-200"
          >
            Enroll Now
          </Link>

          {/* Or Sign In to Enroll */}
          <Link
            href={`/login?next=/enroll/${courseSlug}`}
            className="block rounded-xl border border-white/10 bg-[#0B0F19] px-5 py-3 text-center font-semibold text-white transition duration-200 hover:border-white/30 hover:bg-[#151B27] text-sm"
          >
            Or Sign In to Enroll
          </Link>
        </div>
      </div>
    </aside>
  );
}
