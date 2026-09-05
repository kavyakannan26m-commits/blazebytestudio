# Course Enrollment Forms Setup Guide

## Overview
Your BlazeByte Studio now has professional, modern course enrollment forms with email integration. The forms capture student information and send it to the admin inbox using Resend, a server-side email API.

## Features
✅ Modal-based enrollment forms on every course page  
✅ Dark navy/indigo UI with cyan-purple gradient accents  
✅ Responsive design (mobile & desktop)  
✅ Automatic email sending to Blazebytestudio7@gmail.com via Resend  
✅ Server-side email handling with no client-secret exposure  
✅ Form validation  

## Environment Setup

### 1. Create a Resend API key
Create a Resend account and generate an API key from the Resend dashboard.

### 2. Update `.env.local`
```bash
RESEND_API_KEY=re_bh1jY4Ah_3gALHw3g2K6R3B93DyNA33An
ENQUIRY_TO_EMAIL=Blazebytestudio7@gmail.com
```

Keep these values on the server only. Do not expose the API key in browser/client code.

### 3. Install Dependencies
```bash
npm install
```

## How It Works

### Form Components
- **`/components/courses/enrollment-form.tsx`** - The form itself with validation
- **`/components/courses/enrollment-modal.tsx`** - Modal container and button
- **`/components/courses/course-pricing-card.tsx`** - Pricing card with "Enroll Now" button
- **`/app/api/enrollments/submit/route.ts`** - API endpoint that handles submissions and sends emails

### Form Fields
- Full Name (required)
- Email Address (required)
- Phone Number (required)
- College / Company (required)
- Course Name (auto-filled, read-only)
- Message / Requirements (optional)

### Email Recipients
- **Admin:** Blazebytestudio7@gmail.com (receives enrollment details)
- **Student:** The email entered in the form (receives confirmation)

## Course Enrollment Workflow

### For Users
1. Browse to any course page (e.g., `/courses/ai-mastery-for-work-business`)
2. Click the **"Enroll Now"** button in the pricing card
3. Fill out the enrollment form
4. Click **"Submit Enrollment"**
5. Receive success confirmation and an email receipt

### For You (Admin)
1. Receive detailed enrollment emails at Blazebytestudio7@gmail.com
2. Review student information (name, contact, company, requirements)
3. Reach out to students via their provided email/phone
4. Manage enrollments manually or integrate with CRM

## Courses with Enrollment Forms

The following courses now have working enrollment forms:

1. **AI Mastery for Work & Business**
   - Route: `/courses/ai-mastery-for-work-business`
   
2. **AI-Powered Digital Marketing**
   - Route: `/courses/ai-powered-digital-marketing`
   
3. **Data Analytics + AI**
   - Route: `/courses/data-analytics-ai`

*Note: Course slugs in your database may differ. Update the course `slug` field in Supabase if needed.*

## Styling Details

### Color Scheme
- **Background:** Dark navy (#0B0F19)
- **Primary Accent:** Cyan (#06B6D4)
- **Secondary Accent:** Purple (#A855F7)
- **Borders:** White/10% opacity

### UI Components
- Rounded input fields (`.rounded-lg`)
- Gradient buttons (cyan to purple)
- Glass-morphism effects (white/10% backgrounds)
- Smooth transitions and hover states
- Responsive padding and spacing

## Email Templates

### Admin Email
Includes:
- Formatted student information
- All form fields
- Submission timestamp
- Professional formatting

### Student Confirmation Email
Includes:
- Thank you message
- Enrollment details summary
- Next steps information
- Contact information

## Troubleshooting

### Emails Not Sending?
1. Verify `RESEND_API_KEY` and `ENQUIRY_TO_EMAIL` in `.env.local`
2. Confirm the Resend domain is verified in your Resend dashboard
3. Check the API key is valid and server-side only
4. Check network logs in browser DevTools for API errors

### Form Not Appearing?
1. Ensure component imports are correct
2. Check that the course page imports `CoursePricingCard`
3. Verify no TypeScript errors: `npm run typecheck`

### Styling Issues?
1. Clear build cache: `rm -rf .next`
2. Rebuild: `npm run build`
3. Check Tailwind CSS configuration in `tailwind.config.js`

## API Reference

### POST `/api/enrollments/submit`

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+1 (555) 123-4567",
  "company": "Tech Corp",
  "courseName": "AI Mastery for Work & Business",
  "message": "Optional requirements or message"
}
```

**Success Response (200):**
```json
{
  "message": "Enrollment submitted successfully"
}
```

**Error Response (400/500):**
```json
{
  "error": "Error message describing the issue"
}
```

## Next Steps

1. Update course data in Supabase with correct course names and slugs
2. Configure Resend credentials in `.env.local`
3. Test enrollment form on a course page
4. Customize email templates if needed
5. Set up CRM integration or automation

## Support

For issues or customizations:
- Check the component files for detailed comments
- Review API route error logs
- Test email configuration with simple SMTP tools
