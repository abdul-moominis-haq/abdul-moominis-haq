import { Helmet } from "react-helmet";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ExperienceSection from "@/components/ExperienceSection";
import ProjectsSection from "@/components/ProjectsSection";
import SkillsSection from "@/components/SkillsSection";
import ContactSection from "@/components/ContactSection";

const Index = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "IS-HAQ ABDUL-MOOMIN",
    jobTitle: "Software Engineer",
    description:
      "Software engineer focused on full-stack development, AI, and IoT.",
    url: window.location.origin,
    sameAs: [
      "https://www.linkedin.com/in/ishaqabdulmoomin/",
      "https://github.com/abdul-moominis-haq",
    ],
    knowsAbout: [
      "Software Engineering",
      "Artificial Intelligence",
      "Full-Stack Development",
      "React",
      "Node.js",
      "SQL",
      "AgriTech",
      "IoT",
    ],
  };

  return (
    <>
      <Helmet>
        <title>IS-HAQ ABDUL-MOOMIN — Software Engineer</title>
        <meta
          name="description"
          content="Portfolio of IS-HAQ ABDUL-MOOMIN: applied software engineering across full-stack development, AI, and IoT."
        />
        <meta name="author" content="IS-HAQ ABDUL-MOOMIN" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="IS-HAQ ABDUL-MOOMIN — Software Engineer"
        />
        <meta
          property="og:description"
          content="Projects, experience, and skills in full-stack software engineering, AI, and IoT."
        />
        <meta property="og:url" content={window.location.origin} />
        <meta property="og:site_name" content="IS-HAQ ABDUL-MOOMIN" />
        <meta name="twitter:card" content="summary" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <main id="main" className="portfolio-home">
        <HeroSection />
        <ProjectsSection />
        <ExperienceSection />
        <AboutSection />
        <SkillsSection />
        <ContactSection />
      </main>
    </>
  );
};

export default Index;
