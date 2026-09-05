export type Course = {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  description: string;

  thumbnail_url: string | null;

  price: number;
  discount_price: number | null;

  level: string | null;
  duration: string | null;

  status:
    | "draft"
    | "published"
    | "archived";

  featured: boolean;

  what_you_learn: string[];
  requirements: string[];
  projects: string[];

  faq: {
    question: string;
    answer: string;
  }[];

  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

export type Module = {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  position: number;
};

export type Lesson = {
  id: string;
  module_id: string;
  title: string;
  description: string | null;
  duration: number | null;
  position: number;
  is_preview: boolean;
};

export type Review = {
  id: string;
  course_id: string;
  rating: number;
  review: string | null;
  status: string;
  created_at: string;

  profiles: {
    full_name: string;
  } | null;
};