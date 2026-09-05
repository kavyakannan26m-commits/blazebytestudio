"use client";

import { useState } from "react";
import { EnrollmentForm } from "./enrollment-form";

type EnrollmentModalProps = {
  courseSlug: string;
  courseName: string;
  courseFee: number;
};

export function EnrollmentModal({ courseSlug, courseName, courseFee }: EnrollmentModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Enroll Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex rounded-xl border border-white/10 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 px-6 py-3 font-semibold text-white transition hover:border-white/30 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-purple-500/20"
      >
        Enroll Now
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          {/* Modal Content */}
          <div
            className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0B0F19] p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white transition"
            >
              ✕
            </button>

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">Enroll Now</h2>
              <p className="mt-1 text-sm text-cyan-300 font-medium">{courseName}</p>
              <p className="mt-2 text-lg font-bold text-purple-300">₹{courseFee}</p>
            </div>

            {/* Form */}
            <EnrollmentForm
              courseSlug={courseSlug}
              courseName={courseName}
              courseFee={courseFee}
              onClose={() => setIsOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
