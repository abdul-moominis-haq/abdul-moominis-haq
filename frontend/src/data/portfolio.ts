export type PortfolioProject = {
  slug: string;
  year: string;
  title: string;
  role: string;
  description: string;
  technologies: string[];
  category: string;
};

export const portfolioProjects: PortfolioProject[] = [
  {
    slug: "smartagri",
    year: "2025",
    title: "SmartAgri – Smart Farming Management System",
    role: "Team Lead",
    description:
      "Digital agriculture platform using AI, IoT, and real-time data to support farmers with intelligent crop management and predictive analytics.",
    technologies: ["AI/ML", "IoT", "Real-time Data", "Agriculture Tech"],
    category: "AI / IoT",
  },
  {
    slug: "financial-analyzer",
    year: "2025",
    title: "Financial Analyzer and Investment Prediction Platform",
    role: "Team Member",
    description:
      "Built an ML-powered platform for market trend analysis and portfolio optimization with algorithmic trading insights.",
    technologies: ["Machine Learning", "Financial Analytics", "Python", "Data Science"],
    category: "Machine Learning",
  },
  {
    slug: "educ8-africa",
    year: "2025",
    title: "Educ8 Africa Website",
    role: "Team Lead",
    description:
      "Digital learning platform with interactive courseware, progress tracking, and community features for African education.",
    technologies: ["React", "Node.js", "MongoDB", "Educational Tech"],
    category: "Education",
  },
  {
    slug: "real-estate-management",
    year: "2024",
    title: "Real Estate Management WebApp",
    role: "Team Lead",
    description:
      "Real estate solution with CRM integration, automated valuation models, and reporting dashboards.",
    technologies: ["Full-stack", "CRM", "Valuation Models", "Analytics"],
    category: "Business",
  },
  {
    slug: "agri-iot",
    year: "2023",
    title: "Agri-IoT Mobile App",
    role: "Team Lead",
    description:
      "IoT-driven mobile application with predictive analytics for smart farming, sensor integration, and crop monitoring.",
    technologies: ["Mobile Development", "IoT", "Predictive Analytics", "Agriculture"],
    category: "Mobile / IoT",
  },
  {
    slug: "blog-web-app",
    year: "2023",
    title: "Blog Web Application",
    role: "Team Lead",
    description:
      "Blogging platform with SEO optimization, social media integration, and content management.",
    technologies: ["Web Development", "SEO", "Social Integration", "CMS"],
    category: "Web Platform",
  },
];
