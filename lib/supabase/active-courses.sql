-- Replace the existing three catalogue rows with the required BlazeByte courses.
-- Run once in the Supabase SQL Editor.

UPDATE public.courses
SET
  title = CASE slug
    WHEN 'full-stack-web-development' THEN 'AI Mastery for Work & Business'
    WHEN 'python-programming' THEN 'AI-Powered Digital Marketing'
    WHEN 'artificial-intelligence-machine-learning' THEN 'Data Analytics + AI'
  END,
  slug = CASE slug
    WHEN 'full-stack-web-development' THEN 'ai-mastery-for-work-business'
    WHEN 'python-programming' THEN 'ai-powered-digital-marketing'
    WHEN 'artificial-intelligence-machine-learning' THEN 'data-analytics-ai'
  END,
  short_description = CASE slug
    WHEN 'full-stack-web-development' THEN 'Master AI tools and strategies to transform your career and business growth.'
    WHEN 'python-programming' THEN 'Revolutionize your marketing strategy with practical AI tools.'
    WHEN 'artificial-intelligence-machine-learning' THEN 'Transform raw data into actionable insights using data analytics and AI.'
  END,
  description = CASE slug
    WHEN 'full-stack-web-development' THEN 'Learn how to leverage artificial intelligence for professional advancement and business success.'
    WHEN 'python-programming' THEN 'Master AI-driven marketing techniques including content creation, audience targeting, campaign optimization, and analytics.'
    WHEN 'artificial-intelligence-machine-learning' THEN 'Learn data analysis, visualization, and AI-driven decision making for modern business.'
  END,
  price = CASE slug
    WHEN 'full-stack-web-development' THEN 499
    WHEN 'python-programming' THEN 599
    WHEN 'artificial-intelligence-machine-learning' THEN 999
  END,
  discount_price = NULL,
  level = CASE slug
    WHEN 'full-stack-web-development' THEN 'Beginner'
    ELSE 'Intermediate'
  END,
  duration = CASE slug
    WHEN 'full-stack-web-development' THEN '4 weeks'
    WHEN 'python-programming' THEN '5 weeks'
    WHEN 'artificial-intelligence-machine-learning' THEN '6 weeks'
  END,
  status = 'published',
  featured = true,
  updated_at = now()
WHERE slug IN (
  'full-stack-web-development',
  'python-programming',
  'artificial-intelligence-machine-learning'
);

SELECT slug, title, price, status
FROM public.courses
WHERE slug IN (
  'ai-mastery-for-work-business',
  'ai-powered-digital-marketing',
  'data-analytics-ai'
)
ORDER BY created_at DESC;
