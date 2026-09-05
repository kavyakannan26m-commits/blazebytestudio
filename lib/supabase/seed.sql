-- ============================================
-- BlazeByte Studio - Course Seed Data
-- ============================================

INSERT INTO public.courses (
  title, slug, short_description, description, thumbnail_url,
  price, discount_price, level, duration, status, featured,
  what_you_learn, requirements, projects, faq
)
VALUES

(
  'AI Mastery for Work & Business',
  'ai-mastery-for-work-business',
  'Master AI tools and strategies to transform your career and business growth.',
  'Learn how to leverage artificial intelligence for professional advancement and business success. Understand AI applications, tools, and strategies designed for modern workplaces.',
  NULL, 499, NULL, 'Beginner', '4 weeks', 'published', true,
  ARRAY['AI fundamentals and business applications','Using ChatGPT and AI assistants effectively','AI for productivity and automation','Decision making with AI insights','AI-powered business strategies','Career advancement with AI skills'],
  ARRAY['Basic computer literacy','No AI experience needed'],
  ARRAY['AI Implementation Strategy','Business Process Automation','Career Growth Plan'],
  '[{"question":"Do I need technical skills?","answer":"No. This course is designed for professionals from all backgrounds."},{"question":"Will I get certificates?","answer":"Yes. You will receive a course completion certificate."}]'::jsonb
),

(
  'AI-Powered Digital Marketing',
  'ai-powered-digital-marketing',
  'Revolutionize your marketing strategy with cutting-edge AI technologies.',
  'Master AI-driven marketing techniques including content creation, audience targeting, campaign optimization, and analytics. Learn how to use AI tools to maximize marketing ROI.',
  NULL, 599, NULL, 'Intermediate', '5 weeks', 'published', true,
  ARRAY['AI in content creation and copywriting','AI-powered audience analysis','Marketing automation with AI','Personalization at scale','Predictive analytics for campaigns','AI tools for social media and SEO','Conversion optimization'],
  ARRAY['Basic marketing knowledge','Familiarity with digital platforms'],
  ARRAY['AI Marketing Campaign','Content Strategy Optimization','Analytics Dashboard'],
  '[{"question":"Is prior marketing experience required?","answer":"Basic understanding of marketing helps, but the course covers fundamentals."},{"question":"Which AI tools will I learn?","answer":"You will learn industry-leading AI marketing tools including ChatGPT, Jasper, and analytics platforms."}]'::jsonb
),

(
  'Data Analytics + AI',
  'data-analytics-ai',
  'Transform raw data into actionable insights using data analytics and AI.',
  'Comprehensive course on data analysis, visualization, and AI-driven decision making. Learn to extract patterns, create reports, and leverage machine learning for predictive analytics.',
  NULL, 999, NULL, 'Intermediate', '6 weeks', 'published', true,
  ARRAY['Data analytics fundamentals','Data cleaning and preparation','Statistical analysis','Data visualization techniques','Business intelligence tools','Introduction to machine learning','Predictive modeling','Decision making with data'],
  ARRAY['Basic mathematics knowledge','Interest in data and business insights'],
  ARRAY['Sales Analytics Dashboard','Customer Segmentation Model','Predictive Analytics Project'],
  '[{"question":"Do I need programming experience?","answer":"No. We cover tools and concepts without requiring coding."},{"question":"What tools will I use?","answer":"You will learn Excel, Tableau, Python basics, and modern analytics platforms."}]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  thumbnail_url = EXCLUDED.thumbnail_url,
  price = EXCLUDED.price,
  discount_price = EXCLUDED.discount_price,
  level = EXCLUDED.level,
  duration = EXCLUDED.duration,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured,
  what_you_learn = EXCLUDED.what_you_learn,
  requirements = EXCLUDED.requirements,
  projects = EXCLUDED.projects,
  faq = EXCLUDED.faq,
  updated_at = now();

SELECT id, title, slug, price, discount_price, status, featured
FROM public.courses
ORDER BY created_at DESC;