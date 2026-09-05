import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID?.trim();
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET?.trim();

const RESEND_API_KEY = process.env.RESEND_API_KEY?.trim();
const ENQUIRY_TO_EMAIL = process.env.ENQUIRY_TO_EMAIL?.trim();
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL?.trim();

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  "http://localhost:3000";

function clean(value: unknown, max = 500) {
  return String(value ?? "").trim().slice(0, max);
}

export async function POST(request: Request) {
  let stage = "start";

  try {
    // --------------------------------------------------
    // 1. CHECK RAZORPAY CONFIG
    // --------------------------------------------------
    stage = "check-razorpay-config";

    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      console.error(
        "PAYMENT ERROR: Razorpay environment variables missing",
        {
          keyIdExists: Boolean(RAZORPAY_KEY_ID),
          keySecretExists: Boolean(RAZORPAY_KEY_SECRET),
        }
      );

      return NextResponse.json(
        { error: "Razorpay is not configured." },
        { status: 500 }
      );
    }

    // --------------------------------------------------
    // 2. PARSE REQUEST
    // --------------------------------------------------
    stage = "parse-request";

    const body = await request.json();

    const fullName = clean(body.fullName, 120);
    const email = clean(body.email, 180);
    const phone = clean(body.phone, 40);
    const message = clean(body.message, 2000);
    const courseSlug = clean(body.courseSlug, 120);

    if (!fullName || !email || !phone || !courseSlug) {
      return NextResponse.json(
        {
          error:
            "Required enrollment details are missing.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // 3. CREATE SUPABASE ADMIN CLIENT
    // --------------------------------------------------
    stage = "create-supabase-client";

    const supabase = createSupabaseAdminClient();

    if (!supabase) {
      console.error(
        "PAYMENT ERROR: Supabase admin client unavailable"
      );

      return NextResponse.json(
        {
          error:
            "Database access is not configured.",
        },
        { status: 503 }
      );
    }

    // --------------------------------------------------
    // 4. LOAD COURSE
    // --------------------------------------------------
    stage = "load-course";

    const { data: course, error: courseError } =
      await supabase
        .from("courses")
        .select(
          "id,title,slug,price,discount_price,status,razorpay_payment_link"
        )
        .eq("slug", courseSlug)
        .eq("status", "published")
        .maybeSingle();

    if (courseError) {
      throw new Error(
        `Course lookup failed: ${courseError.message}`
      );
    }

    if (!course) {
      return NextResponse.json(
        {
          error: "Course not found.",
        },
        { status: 404 }
      );
    }

    // --------------------------------------------------
    // 5. CALCULATE COURSE AMOUNT
    // --------------------------------------------------
    const amount = Number(
      course.discount_price ?? course.price
    );

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        {
          error: "Course price is invalid.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // 6. CREATE UNIQUE REFERENCE NUMBER
    // --------------------------------------------------
    stage = "create-enquiry";

    const referenceNumber = `BB-${crypto
      .randomUUID()
      .replace(/-/g, "")
      .slice(0, 16)
      .toUpperCase()}`;

    // --------------------------------------------------
    // 7. SAVE ENQUIRY TO SUPABASE
    // --------------------------------------------------
    const { data: enquiry, error: enquiryError } =
      await supabase
        .from("customer_requests")
        .insert({
          name: fullName,
          email,
          phone,
          subject: course.title,
          message:
            message ||
            `Course enquiry for ${course.title}`,
          privacy_consent: true,
          reference_number: referenceNumber,
          request_type: "enquiry",
          quoted_price: `₹${amount}`,
          payment_status: "pending",
          payment_amount: Math.round(amount * 100),
          payment_currency: "INR",
        })
        .select("id,reference_number")
        .single();

    if (enquiryError) {
      throw new Error(
        `Enquiry creation failed: ${enquiryError.message}`
      );
    }

    // --------------------------------------------------
    // 8. SEND ENQUIRY EMAIL USING RESEND
    // --------------------------------------------------
    stage = "send-enquiry-email";

    if (
      RESEND_API_KEY &&
      ENQUIRY_TO_EMAIL &&
      RESEND_FROM_EMAIL
    ) {
      try {
        const emailResponse = await fetch(
          "https://api.resend.com/emails",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
              from: RESEND_FROM_EMAIL,
              to: [ENQUIRY_TO_EMAIL],
              subject: `New Course Enquiry - ${course.title}`,
              html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                  <h2>New BlazeByte Studio Course Enquiry</h2>

                  <p>
                    <strong>Reference Number:</strong>
                    ${referenceNumber}
                  </p>

                  <p>
                    <strong>Name:</strong>
                    ${fullName}
                  </p>

                  <p>
                    <strong>Email:</strong>
                    ${email}
                  </p>

                  <p>
                    <strong>Phone:</strong>
                    ${phone}
                  </p>

                  <p>
                    <strong>Course:</strong>
                    ${course.title}
                  </p>

                  <p>
                    <strong>Amount:</strong>
                    ₹${amount}
                  </p>

                  <p>
                    <strong>Message:</strong>
                    ${message || "No message provided"}
                  </p>

                  <p>
                    <strong>Payment Status:</strong>
                    Pending
                  </p>
                </div>
              `,
            }),
          }
        );

        if (!emailResponse.ok) {
          const emailError =
            await emailResponse.json().catch(() => null);

          console.error(
            "RESEND EMAIL ERROR:",
            {
              status: emailResponse.status,
              error: emailError,
            }
          );
        }
      } catch (emailError) {
        // Email failure should NOT stop payment flow.
        console.error(
          "RESEND REQUEST FAILED:",
          emailError instanceof Error
            ? emailError.message
            : String(emailError)
        );
      }
    } else {
      console.warn(
        "RESEND CONFIG MISSING: enquiry email was skipped."
      );
    }

    // --------------------------------------------------
    // 9. CREATE RAZORPAY PAYMENT LINK
    // --------------------------------------------------
    stage = "create-razorpay-payment-link";

    const razorpayResponse = await fetch(
      "https://api.razorpay.com/v1/payment_links",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization:
            "Basic " +
            Buffer.from(
              `${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`
            ).toString("base64"),
        },

        body: JSON.stringify({
          amount: Math.round(amount * 100),

          currency: "INR",

          accept_partial: false,

          reference_id: referenceNumber,

          description:
            `BlazeByte Studio - ${course.title}`,

          customer: {
            name: fullName,
            contact: phone,
            email,
          },

          notify: {
            sms: false,
            email: false,
          },

          reminder_enable: false,

          notes: {
            enquiry_id: enquiry.id,
            course_id: course.id,
            course_slug: course.slug,
            reference_number: referenceNumber,
          },

          callback_url:
            `${SITE_URL}/api/payments/razorpay/callback`,

          callback_method: "get",
        }),
      }
    );

    const razorpayData =
      await razorpayResponse.json();

    if (!razorpayResponse.ok) {
      console.error(
        "RAZORPAY ERROR:",
        {
          status: razorpayResponse.status,
          error: razorpayData?.error?.code,
          description:
            razorpayData?.error?.description,
        }
      );

      throw new Error(
        razorpayData?.error?.description ||
          "Unable to create Razorpay Payment Link."
      );
    }

    // --------------------------------------------------
    // 10. VALIDATE RAZORPAY RESPONSE
    // --------------------------------------------------
    const paymentLinkId = razorpayData.id;
    const shortUrl = razorpayData.short_url;

    if (!paymentLinkId || !shortUrl) {
      throw new Error(
        "Razorpay did not return a valid Payment Link."
      );
    }

    // --------------------------------------------------
    // 11. UPDATE ENQUIRY WITH PAYMENT LINK ID
    // --------------------------------------------------
    stage = "update-enquiry";

    const { error: updateError } =
      await supabase
        .from("customer_requests")
        .update({
          razorpay_payment_link_id:
            paymentLinkId,
        })
        .eq("id", enquiry.id);

    if (updateError) {
      throw new Error(
        `Enquiry update failed: ${updateError.message}`
      );
    }

    // --------------------------------------------------
    // 12. SUCCESS
    // --------------------------------------------------
    stage = "success";

    return NextResponse.json({
      success: true,

      paymentUrl: shortUrl,

      paymentLinkId,

      referenceNumber,

      amount,

      courseName: course.title,
    });
  } catch (error) {
    console.error(
      "PAYMENT LINK CREATION ERROR:",
      {
        stage,

        message:
          error instanceof Error
            ? error.message
            : String(error),
      }
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create payment link.",
      },
      { status: 500 }
    );
  }
}