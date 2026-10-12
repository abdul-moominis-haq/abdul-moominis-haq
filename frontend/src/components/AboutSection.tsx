import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import PortfolioAssets from "@/components/PortfolioAssets";
import { usePortfolioContent } from "@/hooks/usePortfolioContent";

const AboutSection = () => {
  const { content } = usePortfolioContent();
  const about = content.about;

  return (
    <section id="about" className="print-section about-section">
      <div className="section-inner">
        <div className="section-heading">
          <h2>{about.heading}</h2>
          <p>{about.intro}</p>
        </div>

        <div className="about-section__study">
          <div className="about-section__narrative">
            <h3>{about.narrativeTitle}</h3>
            <p>{about.narrative}</p>
            <Link className="text-link" to="/contact">
              Get in touch <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </div>

          <article className="study-record">
            <h3>{about.education.degree}</h3>
            <p className="print-label">Education · {about.education.period}</p>
            <p className="study-record__school">{about.education.school}</p>
            <p className="study-record__grade">{about.education.grade}</p>
            <div className="study-record__details">
              <div>
                <h4>Concentrations</h4>
                <p>{about.education.concentrations}</p>
              </div>
              <div>
                <h4>Relevant coursework</h4>
                <p>{about.education.coursework}</p>
              </div>
            </div>
          </article>
        </div>

        {about.highlights.length > 0 && (
          <ul className="about-highlights">
            {about.highlights.map((highlight) => (
              <li key={highlight.title}>
                <h3>{highlight.title}</h3>
                <p>{highlight.description}</p>
              </li>
            ))}
          </ul>
        )}
        <PortfolioAssets assets={about.assets} section="About" />
      </div>
    </section>
  );
};

export default AboutSection;
