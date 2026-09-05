import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const RAZORPAY_WEBHOOK_SECRET =
  process.env.RAZORPAY_WEBHOOK_SECRET?.trim();

export async function POST(request: Request) {
  try {
    if (!RAZORPAY_WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: "Razorpay webhook is not configured." },
        { status: 500 }
      );
    }

    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing webhook signature." },
        { status: 400 }
      );
    }

    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest("hex");

    if (
      expectedSignature.length !== signature.length ||
      !crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(signature)
      )
    ) {
      return NextResponse.json(
        { error: "Invalid webhook signature." },
        { status: 400 }
      );
    }

    const eventId =
      request.headers.get("x-razorpay-event-id") || "";

    const payload = JSON.parse(rawBody);

    if (payload.event !== "payment_link.paid") {
      return NextResponse.json({
        success: true,
        ignored: true,
      });
    }

    const paymentLink =
      payload?.payload?.payment_link?.entity;

    if (!paymentLink) {
      return NextResponse.json(
        { error: "Payment Link data missing." },
        { status: 400 }
      );
    }

    const paymentLinkId = paymentLink.id;
    const referenceId = paymentLink.reference_id;

    const capturedPayment =
      paymentLink?.payments?.find(
        (payment: any) =>
          payment?.status === "captured"
      ) ||
      paymentLink?.payments?.[0];

    const paymentId =
      capturedPayment?.payment_id || null;

    const amountPaid =
      Number(paymentLink?.amount_paid || 0);

    if (!paymentLinkId || !referenceId) {
      return NextResponse.json(
        { error: "Invalid Payment Link data." },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdminClient();

    if (!supabase) {
      return NextResponse.json(
        { error: "Database access is not configured." },
        { status: 503 }
      );
    }

    const updateData: Record<string, unknown> = {
      payment_status: "paid",
      payment_amount: amountPaid,
      payment_currency:
        paymentLink?.currency || "INR",
      paid_at: new Date().toISOString(),
    };

    if (paymentId) {
      updateData.razorpay_payment_id = paymentId;
    }

    const { error } = await supabase
      .from("customer_requests")
      .update(updateData)
      .eq(
        "razorpay_payment_link_id",
        paymentLinkId
      )
      .eq(
        "reference_number",
        referenceId
      );

    if (error) {
      console.error(
        "WEBHOOK DATABASE UPDATE ERROR:",
        error
      );

      return NextResponse.json(
        { error: "Unable to update payment status." },
        { status: 500 }
      );
    }

    console.log(
      "RAZORPAY PAYMENT LINK PAID:",
      {
        eventId,
        paymentLinkId,
        referenceId,
        paymentId,
        amountPaid,
      }
    );

    return NextResponse.json({
      success: true,
      processed: true,
    });
  } catch (error) {
    console.error(
      "RAZORPAY WEBHOOK ERROR:",
      error
    );

    return NextResponse.json(
      { error: "Webhook processing failed." },
      { status: 500 }
    );
  }
}
