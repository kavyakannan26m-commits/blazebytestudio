import { NextResponse } from "next/server";
import { Resend } from "resend";

const enquiryRecipient = process.env.ENQUIRY_TO_EMAIL?.trim();

const resendApiKey = process.env.RESEND_API_KEY?.trim();
const resendFromEmail = process.env.RESEND_FROM_EMAIL?.trim() || "onboarding@resend.dev";

const hasPlaceholderValue = (value?: string) => {
  if (!value) return true;
  return /your_|replace|example|placeholder/i.test(value);
};

const isEmailConfigValid =
  !!resendApiKey &&
  !hasPlaceholderValue(resendApiKey) &&
  !!enquiryRecipient;

const resend = isEmailConfigValid ? new Resend(resendApiKey) : null;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, phone, company, courseName, courseFee, message } = body;

    if (!isEmailConfigValid || !resend) {
      return NextResponse.json(
        {
          error:
            "Email service is not configured. Add a valid RESEND_API_KEY and ENQUIRY_TO_EMAIL in .env.local.",
        },
        { status: 500 }
      );
    }

    // Validate required fields
    if (!fullName || !email || !phone || !company || !courseName || courseFee === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const courseFeeValue = Number(courseFee);
    const safeMessage = (message || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px; border-radius: 8px;">
        <h2 style="color: #0B0F19; margin-bottom: 20px;">New Course Enquiry</h2>

        <div style="background: white; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
          <div style="margin-bottom: 15px;">
            <strong style="color: #0B0F19;">Full Name:</strong>
            <p style="margin: 5px 0 0 0; color: #555;">${fullName}</p>
          </div>

          <div style="margin-bottom: 15px;">
            <strong style="color: #0B0F19;">Email:</strong>
            <p style="margin: 5px 0 0 0; color: #555;">${email}</p>
          </div>

          <div style="margin-bottom: 15px;">
            <strong style="color: #0B0F19;">Phone Number:</strong>
            <p style="margin: 5px 0 0 0; color: #555;">${phone}</p>
          </div>

          <div style="margin-bottom: 15px;">
            <strong style="color: #0B0F19;">College / Company:</strong>
            <p style="margin: 5px 0 0 0; color: #555;">${company}</p>
          </div>

          <div style="margin-bottom: 15px;">
            <strong style="color: #0B0F19;">Selected Course:</strong>
            <p style="margin: 5px 0 0 0; color: #555;">${courseName}</p>
          </div>

          <div style="margin-bottom: 15px;">
            <strong style="color: #0B0F19;">Course Fee:</strong>
            <p style="margin: 5px 0 0 0; color: #06B6D4; font-size: 18px; font-weight: bold;">₹${courseFeeValue}</p>
          </div>

          ${safeMessage ? `
          <div style="margin-bottom: 15px;">
            <strong style="color: #0B0F19;">Message / Requirements:</strong>
            <p style="margin: 5px 0 0 0; color: #555; white-space: pre-wrap;">${safeMessage}</p>
          </div>
          ` : ""}
        </div>

        <p style="color: #999; font-size: 12px; margin-top: 20px;">
          Submitted on ${new Date().toLocaleString()}
        </p>
      </div>
    `;

    const emailResponse = await resend.emails.send({
      from: `BlazeByte Studio <${resendFromEmail}>`,
      to: [enquiryRecipient],
      replyTo: email,
      subject: `New Course Enquiry — ${courseName}`,
      html: emailHtml,
    });

    if (emailResponse.error) {
      console.error("Resend API error:", {
        name: emailResponse.error.name,
        message: emailResponse.error.message,
        statusCode: emailResponse.error.statusCode,
      });
      throw new Error(emailResponse.error.message || "Failed to send email");
    }

    return NextResponse.json(
      { message: "Enrollment submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Enrollment submission error:", error);

    const errorMessage = error instanceof Error ? error.message : "";
    const normalizedErrorMessage = errorMessage.toLowerCase();
    const message = normalizedErrorMessage.includes("only send testing emails")
      ? "Your Resend sender address is still in test mode. Verify a custom domain in Resend and set RESEND_FROM_EMAIL to a verified sender address."
      : process.env.NODE_ENV !== "production" && errorMessage
        ? errorMessage
        : "Unable to send enquiry. Please try again.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
