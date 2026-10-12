CREATE TABLE IF NOT EXISTS public.portfolio_content (
  section text PRIMARY KEY CHECK (section IN ('home', 'about', 'experience', 'skills')),
  document jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.portfolio_content (section, document) VALUES
  (
    'home',
    '{
      "name": "IS-HAQ ABDUL-MOOMIN",
      "location": "Accra, Ghana",
      "discipline": "Software engineer",
      "specialties": "Full-stack · AI · IoT",
      "cvUrl": "/IS_HAQ_ABDUL_MOOMIN_S_CV.pdf",
      "assets": []
    }'::jsonb
  ),
  (
    'about',
    '{
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
        {
          "title": "Solution-focused",
          "description": "Dedicated to software solutions that enhance business efficiency and user experience."
        },
        {
          "title": "Collaborative leadership",
          "description": "Led organizations of 1,000+ members and mentored teams in technical projects."
        },
        {
          "title": "Achievement-driven",
          "description": "National Science and Mathematics Quiz contestant and academic excellence award recipient."
        }
      ],
      "assets": []
    }'::jsonb
  ),
  (
    'experience',
    '{
      "heading": "Where the work happened.",
      "intro": "Software, research, and design experience across teams and disciplines.",
      "items": [
        {
          "company": "Educ8 Africa",
          "role": "Volunteer Software Engineer",
          "location": "Remote, Accra",
          "period": "Jul 2024–Aug 2025",
          "achievements": [
            "Designed responsive and dynamic web apps with Next.js, React.js, and Node.js",
            "Integrated backend logic using Node.js and MongoDB for real-time feedback and form handling"
          ],
          "tags": ["Next.js", "React.js", "Node.js", "MongoDB"]
        },
        {
          "company": "KowordaTech",
          "role": "Volunteer Web Developer",
          "location": "Remote, Accra",
          "period": "Sep 2023–May 2025",
          "achievements": [
            "Contributed to agricultural product catalog platforms with authentication and analytics dashboards",
            "Developed RESTful APIs and MongoDB databases for content delivery systems"
          ],
          "tags": ["REST APIs", "MongoDB", "Authentication", "Analytics"]
        },
        {
          "company": "GAOTek Inc.",
          "role": "Graphic Design Intern",
          "location": "Remote, New York",
          "period": "Sep 2023–Dec 2023",
          "achievements": [
            "Designed digital assets and marketing materials using Adobe tools",
            "Supported BLE and RFID teams with technical infographics and visual dashboards"
          ],
          "tags": ["Adobe Creative Suite", "BLE", "RFID", "Visual Design"]
        },
        {
          "company": "UMaT IoT Lab",
          "role": "Research Intern",
          "location": "Tarkwa, Ghana",
          "period": "Oct 2023–Nov 2023",
          "achievements": [
            "Implemented sensor-based IoT for smart irrigation and soil monitoring",
            "Contributed to an Agri-IoT climate advisory system using ESP32, Python, and ThingSpeak"
          ],
          "tags": ["IoT", "ESP32", "Python", "ThingSpeak", "Agriculture"]
        }
      ],
      "assets": []
    }'::jsonb
  ),
  (
    'skills',
    '{
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
    }'::jsonb
  )
ON CONFLICT (section) DO NOTHING;

DELETE FROM public.portfolio_projects
WHERE slug IN (
  'smartagri',
  'financial-analyzer',
  'educ8-africa',
  'real-estate-management',
  'agri-iot',
  'blog-web-app'
);
