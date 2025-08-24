import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ExperienceSection from "@/components/ExperienceSection";
import ProjectsSection from "@/components/ProjectsSection";
import SkillsSection from "@/components/SkillsSection";
import ContactSection from "@/components/ContactSection";

const Index = () => {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <ExperienceSection />
      <ProjectsSection />
      <SkillsSection />
      <ContactSection />
      
      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm">
            © 2025 IS-HAQ ABDUL-MOOMIN. All rights reserved.
          </p>
          <p className="text-xs text-primary-foreground/70 mt-2">
            Built with React, TypeScript, and Tailwind CSS
          </p>
        </div>
      </footer>
    </main>
  );
};

export default Index;