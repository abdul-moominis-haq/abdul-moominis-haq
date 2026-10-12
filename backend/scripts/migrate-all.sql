-- One-shot, repeatable setup for the portfolio backend.
-- Run against the intended PostgreSQL/Neon database (for example, in Neon SQL Editor).
-- This mirrors the checked-in migrations while intentionally omitting demo project seeds.

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.contact_inquiries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  company text,
  project text,
  budget text,
  timeline text,
  message text,
  status text DEFAULT 'new' CHECK (status IN ('new', 'responded', 'closed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  responded_at timestamptz,
  response_message text
);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS public.meeting_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  company text,
  meeting_type text NOT NULL,
  proposed_date timestamptz NOT NULL,
  duration integer DEFAULT 30,
  agenda text,
  message text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  admin_notes text,
  approved_date timestamptz,
  meeting_link text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_email text NOT NULL,
  type text NOT NULL CHECK (type IN ('inquiry_received', 'inquiry_response', 'meeting_request', 'meeting_approved', 'meeting_rejected')),
  subject text NOT NULL,
  content text NOT NULL,
  sent_at timestamptz NOT NULL DEFAULT now(),
  related_inquiry_id uuid REFERENCES public.contact_inquiries(id),
  related_meeting_id uuid REFERENCES public.meeting_requests(id)
);

ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert contact inquiries" ON public.contact_inquiries;
CREATE POLICY "Anyone can insert contact inquiries"
  ON public.contact_inquiries FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Anyone can insert meeting requests" ON public.meeting_requests;
CREATE POLICY "Anyone can insert meeting requests"
  ON public.meeting_requests FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Anyone can insert notifications" ON public.notifications;
CREATE POLICY "Anyone can insert notifications"
  ON public.notifications FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admin can view all inquiries" ON public.contact_inquiries;
CREATE POLICY "Admin can view all inquiries"
  ON public.contact_inquiries FOR SELECT USING (false);
DROP POLICY IF EXISTS "Admin can view all meeting requests" ON public.meeting_requests;
CREATE POLICY "Admin can view all meeting requests"
  ON public.meeting_requests FOR SELECT USING (false);
DROP POLICY IF EXISTS "Admin can update inquiries" ON public.contact_inquiries;
CREATE POLICY "Admin can update inquiries"
  ON public.contact_inquiries FOR UPDATE USING (false);
DROP POLICY IF EXISTS "Admin can update meeting requests" ON public.meeting_requests;
CREATE POLICY "Admin can update meeting requests"
  ON public.meeting_requests FOR UPDATE USING (false);

DROP TRIGGER IF EXISTS update_contact_inquiries_updated_at ON public.contact_inquiries;
CREATE TRIGGER update_contact_inquiries_updated_at
  BEFORE UPDATE ON public.contact_inquiries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_meeting_requests_updated_at ON public.meeting_requests;
CREATE TRIGGER update_meeting_requests_updated_at
  BEFORE UPDATE ON public.meeting_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_contact_inquiries_status ON public.contact_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_created_at ON public.contact_inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_meeting_requests_status ON public.meeting_requests(status);
CREATE INDEX IF NOT EXISTS idx_meeting_requests_proposed_date ON public.meeting_requests(proposed_date);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_sent_at ON public.notifications(sent_at DESC);

CREATE TABLE IF NOT EXISTS public.newsletter_subscriptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  confirmed boolean DEFAULT false NOT NULL,
  confirmation_token text,
  confirmed_at timestamptz,
  unsubscribed boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_newsletter_email
  ON public.newsletter_subscriptions(email);

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
  ON public.portfolio_projects(position, created_at);

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
  FOR EACH ROW EXECUTE FUNCTION public.update_portfolio_project_updated_at();

CREATE TABLE IF NOT EXISTS public.portfolio_content (
  section text PRIMARY KEY CHECK (section IN ('home', 'about', 'experience', 'skills')),
  document jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.portfolio_content (section, document) VALUES
  ('home', '{
    "name": "IS-HAQ ABDUL-MOOMIN",
    "location": "Accra, Ghana",
    "discipline": "Software engineer",
    "specialties": "Full-stack · AI · IoT",
    "cvUrl": "/IS_HAQ_ABDUL_MOOMIN_S_CV.pdf",
    "assets": []
  }'::jsonb),
  ('about', '{
    "heading": "Engineering, with context.",
    "intro": "A computer science and engineering graduate drawn to useful software, intelligent systems, and the teams that make them work.",
    "narrativeTitle": "Building from the problem outward.",
    "narrative": "My work spans full-stack development, AI and machine learning, IoT, and smart agriculture. I enjoy learning new technologies and collaborating on software that addresses real-world needs.",
    "education": {
      "degree": "BSc. Computer Science and Engineering",
      "period": "2022–2025",
      "school": "University of Mines and Technology · Tarkwa, Ghana",
      "grade": "GPA: 3.00/4.00 · CWA: 65.4",
      "concentrations": "Software Engineering · Artificial Intelligence · IoT",
      "coursework": "Data Structures & Algorithms, Machine Learning, Object-Oriented Programming, Statistics, Software Engineering"
    },
    "highlights": [
      {"title": "Solution-focused", "description": "Dedicated to software solutions that enhance business efficiency and user experience."},
      {"title": "Collaborative leadership", "description": "Led organizations of 1,000+ members and mentored teams in technical projects."},
      {"title": "Achievement-driven", "description": "National Science and Mathematics Quiz contestant and academic excellence award recipient."}
    ],
    "assets": []
  }'::jsonb),
  ('experience', '{
    "heading": "Where the work happened.",
    "intro": "Software, research, and design experience across teams and disciplines.",
    "items": [
      {
        "company": "Educ8 Africa", "role": "Volunteer Software Engineer", "location": "Remote, Accra",
        "period": "Jul 2024–Aug 2025",
        "achievements": [
          "Designed responsive and dynamic web apps with Next.js, React.js, and Node.js",
          "Integrated backend logic using Node.js and MongoDB for real-time feedback and form handling"
        ],
        "tags": ["Next.js", "React.js", "Node.js", "MongoDB"]
      },
      {
        "company": "KowordaTech", "role": "Volunteer Web Developer", "location": "Remote, Accra",
        "period": "Sep 2023–May 2025",
        "achievements": [
          "Contributed to agricultural product catalog platforms with authentication and analytics dashboards",
          "Developed RESTful APIs and MongoDB databases for content delivery systems"
        ],
        "tags": ["REST APIs", "MongoDB", "Authentication", "Analytics"]
      },
      {
        "company": "GAOTek Inc.", "role": "Graphic Design Intern", "location": "Remote, New York",
        "period": "Sep 2023–Dec 2023",
        "achievements": [
          "Designed digital assets and marketing materials using Adobe tools",
          "Supported BLE and RFID teams with technical infographics and visual dashboards"
        ],
        "tags": ["Adobe Creative Suite", "BLE", "RFID", "Visual Design"]
      },
      {
        "company": "UMaT IoT Lab", "role": "Research Intern", "location": "Tarkwa, Ghana",
        "period": "Oct 2023–Nov 2023",
        "achievements": [
          "Implemented sensor-based IoT for smart irrigation and soil monitoring",
          "Contributed to an Agri-IoT climate advisory system using ESP32, Python, and ThingSpeak"
        ],
        "tags": ["IoT", "ESP32", "Python", "ThingSpeak", "Agriculture"]
      }
    ],
    "assets": []
  }'::jsonb),
  ('skills', '{
    "heading": "Tools in the work.",
    "intro": "Technologies and methods used across development, data, and connected systems.",
    "categories": [
      {"category": "Programming languages", "skills": ["JavaScript", "Python", "TypeScript", "C++", "SQL"]},
      {"category": "Frontend", "skills": ["React.js", "Next.js", "HTML/CSS", "Tailwind CSS", "Bootstrap"]},
      {"category": "Backend and data", "skills": ["Node.js", "MongoDB", "REST APIs", "SQL Server", "Redis"]},
      {"category": "AI, ML, and systems", "skills": ["Machine Learning", "TensorFlow", "Data Analysis", "IoT Systems", "Predictive Analytics"]},
      {"category": "Cloud and delivery", "skills": ["AWS", "Docker", "Git", "CI/CD", "Cloud Integration"]},
      {"category": "Mobile and tools", "skills": ["Android Studio", "Mobile Development", "Jupyter Notebooks", "IntelliJ IDEA", "Agile Methodology"]}
    ],
    "languages": [
      {"name": "English", "level": "Native"},
      {"name": "Twi", "level": "Native"},
      {"name": "Hausa", "level": "Conversational"}
    ],
    "certifications": [
      "Masterclass on Digital Product Development – UnternehmerTUM Ghana Hubs Network (2025)",
      "Digital Product Development: From Zero to Hero – Technical University of Munich (2024)",
      "Machine Learning – Simplilearn (2024)",
      "WordPress (CMS) – Udemy (2023)",
      "Microsoft SQL Server – Udemy (2023)"
    ],
    "assets": []
  }'::jsonb)
ON CONFLICT (section) DO NOTHING;

-- Remove only the six demo projects inserted by the original project migration.
DELETE FROM public.portfolio_projects
WHERE slug IN (
  'smartagri',
  'financial-analyzer',
  'educ8-africa',
  'real-estate-management',
  'agri-iot',
  'blog-web-app'
);

CREATE TABLE IF NOT EXISTS public.applied_migrations (
  name text PRIMARY KEY,
  applied_at timestamptz DEFAULT now()
);

INSERT INTO public.applied_migrations (name) VALUES
  ('20250826004651_e3617401-23ea-4a14-9f02-62bfb941a3c3.sql'),
  ('20260806000000_add_newsletter_subscriptions.sql'),
  ('20261011000000_add_portfolio_projects.sql'),
  ('20261012000000_add_portfolio_content.sql')
ON CONFLICT (name) DO NOTHING;

COMMIT;
