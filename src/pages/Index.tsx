import { Toaster } from "react-hot-toast";
import { Helmet } from "react-helmet";
import EnhancedHeroSection from "@/components/EnhancedHeroSection";
import AboutSection from "@/components/AboutSection";
import ExperienceSection from "@/components/ExperienceSection";
import InteractiveProjectShowcase from "@/components/InteractiveProjectShowcase";
import SkillsSection from "@/components/SkillsSection";
import NewsletterSubscription from "@/components/NewsletterSubscription";
import InteractiveContactForm from "@/components/InteractiveContactForm";
import MeetingScheduler from "@/components/MeetingScheduler";

const Index = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "IS-HAQ ABDUL-MOOMIN",
    "jobTitle": "Full-Stack Developer & AI Engineer",
    "description": "Experienced software engineer specializing in AI, full-stack development, and innovative solutions for AgriTech, Health AI, and Finance.",
    "url": window.location.origin,
    "sameAs": [
      "https://linkedin.com/in/yourprofile",
      "https://github.com/yourprofile"
    ],
    "knowsAbout": [
      "Software Engineering",
      "Artificial Intelligence",
      "Full-Stack Development",
      "React",
      "Node.js",
      "Supabase",
      "SQL",
      "AgriTech",
      "Health AI",
      "Finance Technology"
    ],
    "offers": {
      "@type": "Service",
      "name": "Software Development Consultation",
      "description": "Professional software development and AI consultation services"
    }
  };

  return (
    <>
      <Helmet>
        <title>IS-HAQ ABDUL-MOOMIN - Full-Stack Developer & AI Engineer | Portfolio</title>
        <meta name="description" content="Experienced software engineer specializing in AI, full-stack development, and innovative solutions. Expert in React, Supabase, AgriTech, Health AI, and Finance technology." />
        <meta name="keywords" content="software engineer, full-stack developer, AI engineer, React, Supabase, SQL, AgriTech, Health AI, Finance technology, web development" />
        <meta name="author" content="IS-HAQ ABDUL-MOOMIN" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="IS-HAQ ABDUL-MOOMIN - Full-Stack Developer & AI Engineer" />
        <meta property="og:description" content="Experienced software engineer specializing in AI, full-stack development, and innovative solutions for AgriTech, Health AI, and Finance." />
        <meta property="og:url" content={window.location.origin} />
        <meta property="og:site_name" content="IS-HAQ ABDUL-MOOMIN Portfolio" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="IS-HAQ ABDUL-MOOMIN - Full-Stack Developer & AI Engineer" />
        <meta name="twitter:description" content="Experienced software engineer specializing in AI, full-stack development, and innovative solutions." />
        
        {/* Canonical URL */}
        <link rel="canonical" href={window.location.origin} />
        
        {/* Performance optimizations */}
        <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://mkhsnxxfvtilercbeaez.supabase.co" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

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
      
      <div className="min-h-screen">
        <header>
          <EnhancedHeroSection />
        </header>
        
        <main>
          <AboutSection />
          <ExperienceSection />
          <InteractiveProjectShowcase />
          <SkillsSection />
          
          <section id="meeting" className="py-20 bg-gradient-to-br from-muted/30 to-background">
            <div className="container mx-auto px-6">
              <MeetingScheduler />
            </div>
          </section>
          
          <NewsletterSubscription />
          <InteractiveContactForm />
        </main>
        
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
      </div>
    </>
  );
};

export default Index;