import { Toaster } from "react-hot-toast";
import EnhancedHeroSection from "@/components/EnhancedHeroSection";
import AboutSection from "@/components/AboutSection";
import ExperienceSection from "@/components/ExperienceSection";
import InteractiveProjectShowcase from "@/components/InteractiveProjectShowcase";
import SkillsSection from "@/components/SkillsSection";
import NewsletterSubscription from "@/components/NewsletterSubscription";
import InteractiveContactForm from "@/components/InteractiveContactForm";

const Index = () => {
  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'hsl(var(--card))',
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--border))',
          },
        }}
      />
      <main className="min-h-screen">
        <EnhancedHeroSection />
        <AboutSection />
        <ExperienceSection />
        <InteractiveProjectShowcase />
        <SkillsSection />
        <NewsletterSubscription />
        <InteractiveContactForm />
        
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
    </>
  );
};

export default Index;