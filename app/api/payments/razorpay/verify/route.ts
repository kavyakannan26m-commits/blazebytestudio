import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

export async function POST(request: Request) {
  try {
    if (!razorpayKeySecret) {
      return NextResponse.json({ error: "Razorpay is not configured." }, { status: 500 });
    }

    const body = await request.json();
    const {
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature,
      fullName,
      email,
      phone,
      message,
      courseName,
      courseFee,
    } = body;

    if (!orderId || !paymentId || !signature || !fullName || !email || !phone || !courseName) {
      return NextResponse.json({ error: "Incomplete payment details." }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", razorpayKeySecret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    if (
      expectedSignature.length !== String(signature).length ||
      !crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(String(signature)))
    ) {
      return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database access is not configured." }, { status: 503 });
    }

    const referenceNumber = `BB-PAY-${crypto.randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase()}`;
    const { error: insertError } = await supabase.from("customer_requests").insert({
      name: String(fullName).trim(),
      email: String(email).trim(),
      phone: String(phone).trim(),
      subject: String(courseName),
      message: String(message || "Payment completed through Razorpay."),
      privacy_consent: true,
      reference_number: referenceNumber,
      request_type: "enquiry",
      quoted_price: `₹${Number(courseFee) || 0}`,
    });

    if (insertError) throw new Error(insertError.message);

    return NextResponse.json({ success: true, referenceNumber, paymentId });
  } catch (error) {
    console.error("Razorpay verification error:", error);
    return NextResponse.json({ error: "Payment was received, but confirmation could not be saved." }, { status: 500 });
  }
}
