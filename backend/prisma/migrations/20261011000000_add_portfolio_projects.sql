CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.portfolio_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text NOT NULL,
  media_url text,
  media_public_id text,
  media_type text CHECK (media_type IN ('image', 'video')),
  github_url text,
  hosted_url text,
  year text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  technologies text[] NOT NULL DEFAULT '{}',
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT portfolio_projects_media_fields_check CHECK (
    (media_url IS NULL AND media_public_id IS NULL AND media_type IS NULL)
    OR
    (media_url IS NOT NULL AND media_public_id IS NOT NULL AND media_type IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS idx_portfolio_projects_position
  ON public.portfolio_projects (position, created_at);

CREATE OR REPLACE FUNCTION public.update_portfolio_project_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_portfolio_project_updated_at ON public.portfolio_projects;

CREATE TRIGGER update_portfolio_project_updated_at
  BEFORE UPDATE ON public.portfolio_projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_portfolio_project_updated_at();

INSERT INTO public.portfolio_projects
  (slug, title, description, year, role, category, technologies, position)
VALUES
  (
    'smartagri',
    'SmartAgri – Smart Farming Management System',
    'Digital agriculture platform using AI, IoT, and real-time data to support farmers with intelligent crop management and predictive analytics.',
    '2025',
    'Team Lead',
    'AI / IoT',
    ARRAY['AI/ML', 'IoT', 'Real-time Data', 'Agriculture Tech'],
    0
  ),
  (
    'financial-analyzer',
    'Financial Analyzer and Investment Prediction Platform',
    'Built an ML-powered platform for market trend analysis and portfolio optimization with algorithmic trading insights.',
    '2025',
    'Team Member',
    'Machine Learning',
    ARRAY['Machine Learning', 'Financial Analytics', 'Python', 'Data Science'],
    1
  ),
  (
    'educ8-africa',
    'Educ8 Africa Website',
    'Digital learning platform with interactive courseware, progress tracking, and community features for African education.',
    '2025',
    'Team Lead',
    'Education',
    ARRAY['React', 'Node.js', 'MongoDB', 'Educational Tech'],
    2
  ),
  (
    'real-estate-management',
    'Real Estate Management WebApp',
    'Real estate solution with CRM integration, automated valuation models, and reporting dashboards.',
    '2024',
    'Team Lead',
    'Business',
    ARRAY['Full-stack', 'CRM', 'Valuation Models', 'Analytics'],
    3
  ),
  (
    'agri-iot',
    'Agri-IoT Mobile App',
    'IoT-driven mobile application with predictive analytics for smart farming, sensor integration, and crop monitoring.',
    '2023',
    'Team Lead',
    'Mobile / IoT',
    ARRAY['Mobile Development', 'IoT', 'Predictive Analytics', 'Agriculture'],
    4
  ),
  (
    'blog-web-app',
    'Blog Web Application',
    'Blogging platform with SEO optimization, social media integration, and content management.',
    '2023',
    'Team Lead',
    'Web Platform',
    ARRAY['Web Development', 'SEO', 'Social Integration', 'CMS'],
    5
  )
ON CONFLICT (slug) DO NOTHING;
