import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Target, Users, Award } from "lucide-react";

const AboutSection = () => {
  const highlights = [
    {
      icon: Target,
      title: "Solution-Focused",
      description: "Dedicated to providing software solutions that enhance business efficiency and user experience"
    },
    {
      icon: Users,
      title: "Collaborative Leader",
      description: "Led organizations of 1000+ members and mentored teams in various technical projects"
    },
    {
      icon: Award,
      title: "Achievement-Driven",
      description: "National Science and Mathematics Quiz contestant and academic excellence award recipient"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium">
              About Me
            </Badge>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Passionate About Technology & Innovation
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              I am a passionate software engineer with strong skills in developing and implementing 
              innovative software solutions, committed to leveraging technology to solve real-world problems.
            </p>
          </div>

          {/* Main content grid */}
          <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
            {/* About text */}
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-2xl font-semibold text-foreground mb-4">
                  My Journey
                </h3>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    • <strong className="text-foreground">Full-stack expertise:</strong> Skilled in developing 
                    scalable and user-centric applications with modern technologies like React, Next.js, Node.js, and MongoDB.
                  </p>
                  <p>
                    • <strong className="text-foreground">AI & IoT focus:</strong> Specialized in machine learning, 
                    IoT systems, and smart agriculture solutions that make real-world impact.
                  </p>
                  <p>
                    • <strong className="text-foreground">Leadership experience:</strong> Proven track record of 
                    leading technical teams and managing large-scale community organizations.
                  </p>
                  <p>
                    • <strong className="text-foreground">Continuous learner:</strong> Eager to learn, grow, and 
                    contribute within forward-thinking organizations that value innovation and collaboration.
                  </p>
                </div>
              </div>
            </div>

            {/* Education card */}
            <Card className="p-8 bg-card-elevated border border-border shadow-lg">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    Current Education
                  </h3>
                  <p className="text-muted-foreground">BSc. Computer Science and Engineering</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-foreground">University of Mines and Technology</p>
                  <p className="text-sm text-muted-foreground">Tarkwa, Ghana • 2022–2025</p>
                  <p className="text-sm text-muted-foreground mt-1">GPA: 3.00/4.00 (Equivalent to CWA 65.4)</p>
                </div>
                
                <div>
                  <p className="font-medium text-foreground mb-2">Concentrations:</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Software Engineering</Badge>
                    <Badge variant="outline">Artificial Intelligence</Badge>
                    <Badge variant="outline">IoT</Badge>
                  </div>
                </div>

                <div>
                  <p className="font-medium text-foreground mb-2">Relevant Coursework:</p>
                  <p className="text-sm text-muted-foreground">
                    Data Structures & Algorithms, Machine Learning, Object-Oriented Programming, 
                    Statistics, Software Engineering
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Highlights grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {highlights.map((highlight, index) => (
              <Card key={index} className="p-6 text-center bg-card border border-border hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="inline-flex p-3 bg-primary/10 rounded-full mb-4">
                  <highlight.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-3">
                  {highlight.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {highlight.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;