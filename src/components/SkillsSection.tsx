import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Code, Database, Cloud, Smartphone, Brain, Globe } from "lucide-react";

const SkillsSection = () => {
  const skillCategories = [
    {
      category: "Programming Languages",
      icon: Code,
      skills: [
        { name: "JavaScript", level: 90, color: "bg-yellow-500" },
        { name: "Python", level: 85, color: "bg-blue-500" },
        { name: "TypeScript", level: 80, color: "bg-blue-600" },
        { name: "C++", level: 75, color: "bg-purple-500" },
        { name: "SQL", level: 80, color: "bg-orange-500" }
      ]
    },
    {
      category: "Frontend Technologies",
      icon: Globe,
      skills: [
        { name: "React.js", level: 90, color: "bg-cyan-500" },
        { name: "Next.js", level: 85, color: "bg-gray-800" },
        { name: "HTML/CSS", level: 95, color: "bg-red-500" },
        { name: "Tailwind CSS", level: 90, color: "bg-teal-500" },
        { name: "Bootstrap", level: 80, color: "bg-purple-600" }
      ]
    },
    {
      category: "Backend & Database",
      icon: Database,
      skills: [
        { name: "Node.js", level: 85, color: "bg-green-500" },
        { name: "MongoDB", level: 80, color: "bg-green-600" },
        { name: "REST APIs", level: 90, color: "bg-blue-500" },
        { name: "SQL Server", level: 75, color: "bg-red-600" },
        { name: "Redis", level: 70, color: "bg-red-500" }
      ]
    },
    {
      category: "AI/ML & Data Science",
      icon: Brain,
      skills: [
        { name: "Machine Learning", level: 80, color: "bg-indigo-500" },
        { name: "TensorFlow", level: 75, color: "bg-orange-600" },
        { name: "Data Analysis", level: 85, color: "bg-purple-500" },
        { name: "IoT Systems", level: 80, color: "bg-cyan-600" },
        { name: "Predictive Analytics", level: 75, color: "bg-pink-500" }
      ]
    },
    {
      category: "Cloud & DevOps",
      icon: Cloud,
      skills: [
        { name: "AWS", level: 70, color: "bg-orange-500" },
        { name: "Docker", level: 75, color: "bg-blue-600" },
        { name: "Git", level: 90, color: "bg-gray-700" },
        { name: "CI/CD", level: 70, color: "bg-green-600" },
        { name: "Cloud Integration", level: 75, color: "bg-blue-500" }
      ]
    },
    {
      category: "Mobile & Tools",
      icon: Smartphone,
      skills: [
        { name: "Android Studio", level: 75, color: "bg-green-500" },
        { name: "Mobile Development", level: 70, color: "bg-purple-600" },
        { name: "Jupyter Notebooks", level: 80, color: "bg-orange-500" },
        { name: "IntelliJ IDEA", level: 85, color: "bg-red-600" },
        { name: "Agile Methodology", level: 80, color: "bg-teal-600" }
      ]
    }
  ];

  const languages = [
    { name: "English", level: "Native" },
    { name: "Twi", level: "Native" },
    { name: "Hausa", level: "Conversational" }
  ];

  const certifications = [
    "Masterclass on Digital Product Development – UnternehmerTUM Ghana Hubs Network (2025)",
    "Digital Product Development: From Zero to Hero – Technical University of Munich (2024)",
    "Machine Learning – Simplilearn (2024)",
    "WordPress (CMS) – Udemy (2023)",
    "Microsoft SQL Server – Udemy (2023)"
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium">
              Technical Expertise
            </Badge>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Skills & Technologies
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A comprehensive overview of my technical skills, from full-stack development 
              to AI/ML and cloud technologies, backed by hands-on project experience.
            </p>
          </div>

          {/* Skills grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {skillCategories.map((category, index) => (
              <Card key={index} className="p-8 border border-border hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <category.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground">
                    {category.category}
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {category.skills.map((skill, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-foreground">{skill.name}</span>
                        <span className="text-xs text-muted-foreground">{skill.level}%</span>
                      </div>
                      <Progress value={skill.level} className="h-2" />
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          {/* Additional info grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Languages */}
            <Card className="p-8 border border-border">
              <h3 className="font-display text-xl font-semibold text-foreground mb-6">
                Languages
              </h3>
              <div className="space-y-4">
                {languages.map((lang, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="font-medium text-foreground">{lang.name}</span>
                    <Badge variant="outline">{lang.level}</Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Certifications */}
            <Card className="p-8 border border-border">
              <h3 className="font-display text-xl font-semibold text-foreground mb-6">
                Recent Certifications
              </h3>
              <div className="space-y-3">
                {certifications.map((cert, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground leading-relaxed">{cert}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Skills summary */}
          <div className="mt-16 text-center">
            <Card className="p-8 bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 max-w-3xl mx-auto">
              <h3 className="font-display text-2xl font-semibold text-foreground mb-4">
                Continuous Learning & Growth
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                I believe in staying current with emerging technologies and best practices. 
                My skill set continues to evolve through hands-on project work, certifications, 
                and active participation in the developer community.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;