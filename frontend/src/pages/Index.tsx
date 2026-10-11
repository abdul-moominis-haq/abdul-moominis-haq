import { Toaster } from "react-hot-toast";
import { Helmet } from "react-helmet";
import HeroSection from "@/components/HeroSection";
import NavBar from "@/components/NavBar";

const Index = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "IS-HAQ ABDUL-MOOMIN",
    "jobTitle": "Full-Stack Developer & AI Engineer",
    "description": "Experienced software engineer specializing in AI, full-stack development, and innovative solutions for AgriTech, Health AI, and Finance.",
    "url": window.location.origin,
    "sameAs": [
      "https://www.linkedin.com/in/ishaqabdulmoomin/",
      "https://github.com/abdul-moominis-haq/"
    ],
    "knowsAbout": [
      "Software Engineering",
      "Artificial Intelligence",
      "Full-Stack Development",
      "React",
      "Node.js",
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
        <title>IS-HAQ ABDUL-MOOMIN</title>
        <meta name="description" content="Experienced software engineer specializing in AI, full-stack development, and innovative solutions. Expert in React, Node.js, AgriTech, Health AI, and Finance technology." />
        <meta name="keywords" content="software engineer, full-stack developer, AI engineer, React, Node.js, SQL, AgriTech, Health AI, Finance technology, web development" />
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
          <NavBar />
          <HeroSection />
        </header>

        <main className="container mx-auto px-6 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-semibold mb-4">Explore</h2>
            <p className="text-muted-foreground mb-6">Browse the site's sections as separate pages:</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a href="/about" className="p-4 border rounded">About</a>
              <a href="/experience" className="p-4 border rounded">Experience</a>
              <a href="/projects" className="p-4 border rounded">Projects</a>
              <a href="/skills" className="p-4 border rounded">Skills</a>
              <a href="/meeting" className="p-4 border rounded">Schedule Meeting</a>
              <a href="/contact" className="p-4 border rounded">Contact</a>
              <a href="/newsletter" className="p-4 border rounded">Newsletter</a>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-primary text-primary-foreground py-8 mt-12">
          <div className="container mx-auto px-6 text-center">
            <p className="text-sm">© 2025 IS-HAQ ABDUL-MOOMIN. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;