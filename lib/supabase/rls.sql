-- ============================================
-- BlazeByte Studio - Courses RLS Policies
-- ============================================

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published courses"
ON public.courses
FOR SELECT
TO anon, authenticated
USING (status = 'published');

CREATE POLICY "Service role full access"
ON public.courses
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own enrollments"
ON public.enrollments
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own pending enrollments"
ON public.enrollments
FOR INSERT
TO authenticated
WITH CHECK (
	auth.uid() = user_id
	AND payment_status = 'pending'
	AND verification_status = 'pending'
	AND active = false
);

CREATE POLICY "Service role manages enrollments"
ON public.enrollments
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

ALTER TABLE public.customer_requests ENABLE ROW LEVEL SECURITY;

REVOKE SELECT, UPDATE, DELETE ON public.customer_requests FROM anon;
GRANT INSERT ON public.customer_requests TO anon;

CREATE POLICY "Anonymous visitors can submit enquiries"
ON public.customer_requests
FOR INSERT
TO anon
WITH CHECK (
	request_type = 'enquiry'
	AND quoted_price = 'No pricing'
	AND privacy_consent = true
);