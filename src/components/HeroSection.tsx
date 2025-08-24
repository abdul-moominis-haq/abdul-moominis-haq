import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Github, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-light to-secondary opacity-95" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary-light/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Main heading */}
          <div className="mb-8">
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-4 leading-tight">
              IS-HAQ ABDUL-MOOMIN
            </h1>
            <div className="text-xl md:text-2xl text-accent-light font-medium mb-2">
              Full-Stack Software Engineer
            </div>
            <div className="text-lg text-white/80 mb-6 flex items-center justify-center gap-2">
              <MapPin className="w-5 h-5" />
              Ghanaian Citizen
            </div>
          </div>

          {/* Value proposition */}
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Passionate software engineer specializing in AI, IoT, and scalable web applications. 
            Committed to leveraging technology to solve real-world problems and enhance user experiences.
          </p>

          {/* Contact info cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-4">
              <div className="flex items-center gap-3 text-white">
                <Phone className="w-5 h-5 text-accent-light" />
                <span className="font-medium">(+233) 24981 9285</span>
              </div>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-4">
              <div className="flex items-center gap-3 text-white">
                <Mail className="w-5 h-5 text-accent-light" />
                <span className="font-medium">abdulmoominishaq21@gmail.com</span>
              </div>
            </Card>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-3 text-lg transition-all duration-300 transform hover:scale-105"
            >
              <Mail className="w-5 h-5 mr-2" />
              Contact Me
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-3 text-lg transition-all duration-300 transform hover:scale-105"
            >
              View Portfolio
            </Button>
          </div>

          {/* Social links */}
          <div className="flex gap-6 justify-center">
            <a 
              href="#" 
              className="p-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-110"
              aria-label="GitHub Profile"
            >
              <Github className="w-6 h-6" />
            </a>
            <a 
              href="#" 
              className="p-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-110"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70">
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm font-medium">Scroll to explore</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/70 to-transparent animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;