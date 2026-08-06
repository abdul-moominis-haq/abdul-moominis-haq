import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Github, Linkedin, ExternalLink, Download } from "lucide-react";

const ContactSection = () => {
  const contactMethods = [
    {
      icon: Mail,
      label: "Email",
      value: "abdulmoominishaq21@gmail.com",
      href: "mailto:abdulmoominishaq21@gmail.com",
      primary: true
    },
    {
      icon: Phone,
      label: "Phone",
      value: "(+233) 24981 9285",
      href: "tel:+233249819285",
      primary: true
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Ghana",
      href: null,
      primary: false
    }
  ];

  const socialLinks = [
    {
      icon: Github,
      label: "GitHub",
      username: "ishaqabdulmoomin",
      href: "#",
      description: "Explore my code repositories and contributions"
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      username: "abdul-moominis-haq",
      href: "#",
      description: "Connect with me professionally"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium">
              Let's Connect
            </Badge>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Ready to Collaborate
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              I'm always interested in discussing new opportunities, innovative projects, 
              and ways to leverage technology for meaningful impact. Let's start a conversation.
            </p>
          </div>

          {/* Contact grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Contact methods */}
            <Card className="p-8 border border-border">
              <h3 className="font-display text-xl font-semibold text-foreground mb-6">
                Get In Touch
              </h3>
              <div className="space-y-6">
                {contactMethods.map((method, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${method.primary ? 'bg-primary/10' : 'bg-muted'}`}>
                      <method.icon className={`w-5 h-5 ${method.primary ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm text-muted-foreground">{method.label}</p>
                      {method.href ? (
                        <a 
                          href={method.href}
                          className="font-medium text-foreground hover:text-primary transition-colors"
                        >
                          {method.value}
                        </a>
                      ) : (
                        <p className="font-medium text-foreground">{method.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <Button size="lg" className="w-full">
                  <Mail className="w-5 h-5 mr-2" />
                  Send Email
                </Button>
              </div>
            </Card>

            {/* Social links */}
            <Card className="p-8 border border-border">
              <h3 className="font-display text-xl font-semibold text-foreground mb-6">
                Connect Online
              </h3>
              <div className="space-y-6">
                {socialLinks.map((link, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="p-3 bg-secondary/10 rounded-lg">
                      <link.icon className="w-5 h-5 text-secondary" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-foreground">{link.label}</p>
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">@{link.username}</p>
                      <p className="text-xs text-muted-foreground">{link.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-border space-y-3">
                <Button variant="outline" size="lg" className="w-full">
                  <Github className="w-5 h-5 mr-2" />
                  View GitHub
                </Button>
                <Button variant="outline" size="lg" className="w-full">
                  <Linkedin className="w-5 h-5 mr-2" />
                  Connect on LinkedIn
                </Button>
              </div>
            </Card>
          </div>

          {/* Availability & Resume */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Availability */}
            <Card className="p-6 bg-success/5 border border-success/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
                <h3 className="font-semibold text-foreground">Available for Opportunities</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                I'm currently seeking new opportunities in software engineering, 
                particularly roles involving AI/ML, IoT, or full-stack development.
              </p>
            </Card>

            {/* Resume download */}
            <Card className="p-6 bg-primary/5 border border-primary/20">
              <h3 className="font-semibold text-foreground mb-4">Resume & References</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Download my complete resume or request professional references.
              </p>
              <Button size="sm" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download Resume
              </Button>
            </Card>
          </div>

          {/* Call to action */}
          <div className="text-center mt-16">
            <Card className="p-8 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border border-primary/20">
              <h3 className="font-display text-2xl font-semibold text-foreground mb-4">
                Let's Build Something Amazing Together
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Whether you have a project in mind, want to discuss opportunities, 
                or just want to chat about technology, I'd love to hear from you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="px-8">
                  <Mail className="w-5 h-5 mr-2" />
                  Start Conversation
                </Button>
                <Button size="lg" variant="outline" className="px-8">
                  <Phone className="w-5 h-5 mr-2" />
                  Schedule Call
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;