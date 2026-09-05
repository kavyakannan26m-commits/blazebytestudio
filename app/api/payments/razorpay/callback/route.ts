import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET?.trim();
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  "http://localhost:3000";

export async function GET(request: Request) {
  try {
    if (!RAZORPAY_KEY_SECRET) {
      return NextResponse.redirect(
        `${SITE_URL}/payment/success?status=error`
      );
    }

    const { searchParams } = new URL(request.url);

    const paymentLinkId =
      searchParams.get("razorpay_payment_link_id") || "";

    const referenceId =
      searchParams.get("razorpay_payment_link_reference_id") || "";

    const status =
      searchParams.get("razorpay_payment_link_status") || "";

    const paymentId =
      searchParams.get("razorpay_payment_id") || "";

    const signature =
      searchParams.get("razorpay_signature") || "";

    if (
      !paymentLinkId ||
      !referenceId ||
      !status ||
      !paymentId ||
      !signature
    ) {
      return NextResponse.redirect(
        `${SITE_URL}/payment/success?status=failed`
      );
    }

    const payload =
      `${paymentLinkId}|${referenceId}|${status}|${paymentId}`;

    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(payload)
      .digest("hex");

    if (
      expectedSignature.length !== signature.length ||
      !crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(signature)
      )
    ) {
      return NextResponse.redirect(
        `${SITE_URL}/payment/success?status=failed`
      );
    }

    const supabase = createSupabaseAdminClient();

    if (!supabase) {
      return NextResponse.redirect(
        `${SITE_URL}/payment/success?status=error`
      );
    }

    if (status === "paid") {
      const { data: enquiry, error } = await supabase
        .from("customer_requests")
        .update({
          payment_status: "paid",
          razorpay_payment_id: paymentId,
          paid_at: new Date().toISOString(),
        })
        .eq("razorpay_payment_link_id", paymentLinkId)
        .eq("reference_number", referenceId)
        .select("reference_number")
        .maybeSingle();

      if (error) {
        console.error("PAYMENT CALLBACK UPDATE ERROR:", error);
      }

      const reference =
        enquiry?.reference_number || referenceId;

      return NextResponse.redirect(
        `${SITE_URL}/payment/success?status=paid&reference=${encodeURIComponent(
          reference
        )}`
      );
    }

    return NextResponse.redirect(
      `${SITE_URL}/payment/success?status=${encodeURIComponent(
        status
      )}&reference=${encodeURIComponent(referenceId)}`
    );
  } catch (error) {
    console.error("RAZORPAY CALLBACK ERROR:", error);

    return NextResponse.redirect(
      `${SITE_URL}/payment/success?status=error`
    );
  }
}
