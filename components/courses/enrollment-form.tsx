"use client";

import { useState } from "react";

type EnrollmentFormProps = {
  courseSlug: string;
  courseName: string;
  courseFee: number;
  onClose?: () => void;
};

export function EnrollmentForm({
  courseSlug,
  courseName,
  courseFee,
  onClose,
}: EnrollmentFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
    privacyConsent: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [error, setError] = useState("");

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    const phoneRegex = /^[0-9\s\-+()]{7,}$/;

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 5) {
      newErrors.message = "Message must be at least 5 characters";
    }

    if (!formData.privacyConsent) {
      newErrors.privacyConsent =
        "Please accept the privacy consent to continue";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleConsentChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      privacyConsent: e.target.checked,
    }));

    if (errors.privacyConsent) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated.privacyConsent;
        return updated;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/payments/razorpay/payment-link",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseSlug,
            fullName: formData.fullName.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            message: formData.message.trim(),
            privacyConsent: formData.privacyConsent,
          }),
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        throw new Error(
          "Payment service returned an invalid response. Please try again."
        );
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to create payment link."
        );
      }

      if (!result.paymentUrl) {
        throw new Error("Payment link was not generated.");
      }

      /*
       * Redirect to Razorpay hosted payment page.
       *
       * Razorpay payment will happen on their secure
       * hosted payment page.
       */
      window.location.href = result.paymentUrl;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to start payment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 text-5xl">✓</div>

        <h3 className="text-xl font-semibold text-white">
          Enquiry submitted successfully!
        </h3>

        <p className="mt-2 text-slate-400">
          Your enquiry has been received. Our team will contact you soon.
        </p>

        {referenceNumber && (
          <p className="mt-4 text-sm text-cyan-300">
            Reference: {referenceNumber}
          </p>
        )}

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="mt-6 rounded-lg bg-white/10 px-5 py-2 text-sm font-medium text-white hover:bg-white/15"
          >
            Close
          </button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Full Name */}
      <div>
        <label
          htmlFor="fullName"
          className="mb-2 block text-sm font-medium text-white"
        >
          Full Name *
        </label>

        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          disabled={loading}
          placeholder="Enter your full name"
          className={`w-full rounded-lg border bg-white/[.08] px-4 py-2.5 text-white placeholder-slate-500 transition focus:outline-none focus:ring-1 ${
            errors.fullName
              ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
              : "border-white/15 focus:border-cyan-400 focus:ring-cyan-400/20"
          }`}
        />

        {errors.fullName && (
          <p className="mt-1 text-xs text-red-400">
            {errors.fullName}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-white"
        >
          Email Address *
        </label>

        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled={loading}
          placeholder="your@email.com"
          className={`w-full rounded-lg border bg-white/[.08] px-4 py-2.5 text-white placeholder-slate-500 transition focus:outline-none focus:ring-1 ${
            errors.email
              ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
              : "border-white/15 focus:border-cyan-400 focus:ring-cyan-400/20"
          }`}
        />

        {errors.email && (
          <p className="mt-1 text-xs text-red-400">
            {errors.email}
          </p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label
          htmlFor="phone"
          className="mb-2 block text-sm font-medium text-white"
        >
          Phone Number *
        </label>

        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          disabled={loading}
          placeholder="+91 98765 43210"
          className={`w-full rounded-lg border bg-white/[.08] px-4 py-2.5 text-white placeholder-slate-500 transition focus:outline-none focus:ring-1 ${
            errors.phone
              ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
              : "border-white/15 focus:border-cyan-400 focus:ring-cyan-400/20"
          }`}
        />

        {errors.phone && (
          <p className="mt-1 text-xs text-red-400">
            {errors.phone}
          </p>
        )}
      </div>

      {/* Selected Course */}
      <div>
        <label
          htmlFor="courseName"
          className="mb-2 block text-sm font-medium text-white"
        >
          Selected Course
        </label>

        <input
          type="text"
          id="courseName"
          value={courseName}
          readOnly
          className="w-full cursor-not-allowed rounded-lg border border-white/10 bg-white/[.05] px-4 py-2.5 text-sm text-white opacity-75"
        />
      </div>

      {/* Course Fee */}
      <div>
        <label
          htmlFor="courseFee"
          className="mb-2 block text-sm font-medium text-white"
        >
          Course Fee
        </label>

        <input
          type="text"
          id="courseFee"
          value={`₹${courseFee}`}
          readOnly
          className="w-full cursor-not-allowed rounded-lg border border-white/10 bg-white/[.05] px-4 py-2.5 text-sm font-semibold text-cyan-300 opacity-75"
        />
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className="mb-2 block text-sm font-medium text-white"
        >
          Message / Requirements *
        </label>

        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          disabled={loading}
          placeholder="Tell us about your requirements..."
          rows={4}
          className={`w-full resize-none rounded-lg border bg-white/[.08] px-4 py-2.5 text-white placeholder-slate-500 transition focus:outline-none focus:ring-1 ${
            errors.message
              ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
              : "border-white/15 focus:border-cyan-400 focus:ring-cyan-400/20"
          }`}
        />

        {errors.message && (
          <p className="mt-1 text-xs text-red-400">
            {errors.message}
          </p>
        )}
      </div>

      {/* Privacy Consent */}
      <div>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={formData.privacyConsent}
            onChange={handleConsentChange}
            disabled={loading}
            className="mt-1 h-4 w-4 rounded border-white/20 bg-white/10"
          />

          <span className="text-sm text-slate-300">
            I agree to the collection and use of my information for
            responding to this enquiry. *
          </span>
        </label>

        {errors.privacyConsent && (
          <p className="mt-1 text-xs text-red-400">
            {errors.privacyConsent}
          </p>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
          <p className="text-sm text-red-300">
            {error}
          </p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 px-6 py-3 font-semibold text-white transition hover:from-cyan-600 hover:to-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Opening Payment..." : "Enquire & Pay"}
      </button>
    </form>
  );
}