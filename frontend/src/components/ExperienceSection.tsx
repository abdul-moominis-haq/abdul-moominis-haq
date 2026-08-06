import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Building2 } from "lucide-react";

const ExperienceSection = () => {
  const experiences = [
    {
      company: "Educ8 Africa",
      role: "Volunteer Software Engineer",
      location: "Remote, Accra",
      period: "Jul 2024–Aug 2025",
      type: "Current",
      achievements: [
        "Designed responsive and dynamic web apps with Next.js, React.js, and Node.js",
        "Integrated backend logic using Node.js and MongoDB for real-time feedback and form handling"
      ],
      tags: ["Next.js", "React.js", "Node.js", "MongoDB"]
    },
    {
      company: "KowordaTech",
      role: "Volunteer Web Developer",
      location: "Remote, Accra",
      period: "Sep 2023–May 2025",
      type: "Current",
      achievements: [
        "Contributed to agricultural product catalog platforms with authentication and analytics dashboards",
        "Developed RESTful APIs and MongoDB databases for content delivery systems"
      ],
      tags: ["REST APIs", "MongoDB", "Authentication", "Analytics"]
    },
    {
      company: "GAOTek Inc.",
      role: "Graphic Design Intern",
      location: "Remote, New York",
      period: "Sep 2023–Dec 2023",
      type: "Past",
      achievements: [
        "Designed digital assets and marketing materials using Adobe tools",
        "Supported BLE and RFID teams with technical infographics and visual dashboards"
      ],
      tags: ["Adobe Creative Suite", "BLE", "RFID", "Visual Design"]
    },
    {
      company: "UMaT IoT Lab",
      role: "Research Intern",
      location: "Tarkwa, Ghana",
      period: "Oct 2023–Nov 2023",
      type: "Past",
      achievements: [
        "Implemented sensor-based IoT for smart irrigation and soil monitoring",
        "Contributed to an Agri-IoT climate advisory system using ESP32, Python, and ThingSpeak"
      ],
      tags: ["IoT", "ESP32", "Python", "ThingSpeak", "Agriculture"]
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium">
              Professional Experience
            </Badge>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Building Solutions Across Industries
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              From agricultural technology to educational platforms, I've contributed to diverse projects 
              that leverage cutting-edge technologies to solve real-world challenges.
            </p>
          </div>

          {/* Experience timeline */}
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <Card key={index} className="p-8 border border-border hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Company info */}
                  <div className="flex-shrink-0 lg:w-80">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-semibold text-foreground">
                          {exp.company}
                        </h3>
                        <p className="text-lg font-medium text-primary mb-2">
                          {exp.role}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{exp.period}</span>
                        <Badge 
                          variant={exp.type === "Current" ? "default" : "outline"} 
                          className="ml-2 text-xs"
                        >
                          {exp.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{exp.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Experience details */}
                  <div className="flex-grow">
                    <div className="mb-6">
                      <h4 className="font-semibold text-foreground mb-3">Key Achievements:</h4>
                      <ul className="space-y-2">
                        {exp.achievements.map((achievement, i) => (
                          <li key={i} className="flex items-start gap-3 text-muted-foreground">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2.5 flex-shrink-0" />
                            <span className="leading-relaxed">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Technologies:</h4>
                      <div className="flex flex-wrap gap-2">
                        {exp.tags.map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Call to action */}
          <div className="text-center mt-16">
            <Card className="p-8 bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20">
              <h3 className="font-display text-2xl font-semibold text-foreground mb-4">
                Ready to Collaborate?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                I'm always interested in discussing new opportunities and innovative projects.
              </p>
              <Badge variant="secondary" className="px-4 py-2">
                Available for new opportunities
              </Badge>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;