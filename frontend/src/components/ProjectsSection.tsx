import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Calendar, Users } from "lucide-react";

const ProjectsSection = () => {
  const projects = [
    {
      year: "2025",
      title: "SmartAgri – Smart Farming Management System",
      role: "Team Lead",
      description: "Digital agriculture platform using AI, IoT, and real-time data to support farmers with intelligent crop management and predictive analytics.",
      technologies: ["AI/ML", "IoT", "Real-time Data", "Agriculture Tech"],
      links: {
        live: "#",
        github: "#"
      },
      status: "Featured",
      category: "AI/IoT"
    },
    {
      year: "2025",
      title: "Financial Analyzer and Investment Prediction Platform",
      role: "Team Member",
      description: "Built ML-powered platform for market trend analysis and portfolio optimization with sophisticated algorithmic trading insights.",
      technologies: ["Machine Learning", "Financial Analytics", "Python", "Data Science"],
      links: {
        github: "#"
      },
      status: "Recent",
      category: "Machine Learning"
    },
    {
      year: "2025",
      title: "Educ8 Africa Website",
      role: "Team Lead",
      description: "Comprehensive digital learning platform with interactive courseware, progress tracking, and community features for African education.",
      technologies: ["React", "Node.js", "MongoDB", "Educational Tech"],
      links: {
        github: "#"
      },
      status: "Active",
      category: "Education"
    },
    {
      year: "2024",
      title: "Real Estate Management WebApp",
      role: "Team Lead",
      description: "Full-featured real estate solution with CRM integration, automated valuation models, and comprehensive reporting dashboards.",
      technologies: ["Full-stack", "CRM", "Valuation Models", "Analytics"],
      links: {
        github: "#"
      },
      status: "Completed",
      category: "Business"
    },
    {
      year: "2023",
      title: "Agri-IoT Mobile App",
      role: "Team Lead",
      description: "IoT-driven mobile application with predictive analytics for smart farming, sensor integration, and crop monitoring.",
      technologies: ["Mobile Dev", "IoT", "Predictive Analytics", "Agriculture"],
      links: {
        github: "#"
      },
      status: "Completed",
      category: "Mobile/IoT"
    },
    {
      year: "2023",
      title: "Blog Web Application",
      role: "Team Lead",
      description: "Feature-rich blogging platform with SEO optimization, social media integration, and advanced content management.",
      technologies: ["Web Development", "SEO", "Social Integration", "CMS"],
      links: {
        github: "#"
      },
      status: "Completed",
      category: "Web Platform"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Featured": return "bg-primary text-primary-foreground";
      case "Recent": return "bg-secondary text-secondary-foreground";
      case "Active": return "bg-success text-success-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium">
              Featured Projects
            </Badge>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Innovative Solutions & Impact
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A showcase of projects spanning AI/ML, IoT, web development, and mobile applications, 
              each designed to solve real-world challenges and drive meaningful impact.
            </p>
          </div>

          {/* Projects grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {projects.map((project, index) => (
              <Card key={index} className="p-8 border border-border hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-card">
                {/* Project header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs font-mono">
                      {project.year}
                    </Badge>
                    <Badge className={`text-xs ${getStatusColor(project.status)}`}>
                      {project.status}
                    </Badge>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {project.category}
                  </Badge>
                </div>

                {/* Project content */}
                <div className="mb-6">
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2 leading-tight">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span className="font-medium text-primary">{project.role}</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {project.description}
                  </p>
                </div>

                {/* Technologies */}
                <div className="mb-6">
                  <h4 className="font-semibold text-foreground mb-3 text-sm">Technologies Used:</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Project links */}
                <div className="flex gap-3">
                  {project.links.live && (
                    <Button size="sm" className="flex-1">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Live Demo
                    </Button>
                  )}
                  {project.links.github && (
                    <Button size="sm" variant="outline" className="flex-1">
                      <Github className="w-4 h-4 mr-2" />
                      View Code
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* GitHub profile link */}
          <div className="text-center">
            <Card className="p-8 bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 max-w-2xl mx-auto">
              <h3 className="font-display text-2xl font-semibold text-foreground mb-4">
                Explore More Projects
              </h3>
              <p className="text-muted-foreground mb-6">
                Visit my GitHub profile to see additional projects, contributions, and code samples 
                demonstrating my technical expertise across various domains.
              </p>
              <Button size="lg" className="px-8">
                <Github className="w-5 h-5 mr-2" />
                View GitHub Profile
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;