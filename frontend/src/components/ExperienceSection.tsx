import PortfolioAssets from "@/components/PortfolioAssets";
import { usePortfolioContent } from "@/hooks/usePortfolioContent";

const ExperienceSection = () => {
  const { content } = usePortfolioContent();
  const experience = content.experience;

  return (
    <section id="experience" className="print-section experience-section">
      <div className="section-inner">
        <div className="section-heading">
          <h2>{experience.heading}</h2>
          <p>{experience.intro}</p>
        </div>

        {experience.items.length > 0 ? (
          <ol className="experience-list">
            {experience.items.map((item, index) => (
              <li className="experience-record" key={`${item.company}-${index}`}>
                <div className="experience-record__date">
                  <span className="print-label">Period</span>
                  <time>{item.period}</time>
                </div>
                <div className="experience-record__body">
                  <h3>{item.company}</h3>
                  {item.location && <p className="print-label">{item.location}</p>}
                  <p className="experience-record__role">{item.role}</p>
                  {!!item.achievements.length && (
                    <ul className="experience-record__achievements">
                      {item.achievements.map((achievement) => (
                        <li key={achievement}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                  {!!item.tags.length && (
                    <ul className="technology-line" aria-label="Technologies and areas">
                      {item.tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="portfolio-section-empty">Experience records will appear here.</p>
        )}
        <PortfolioAssets assets={experience.assets} section="Experience" />
      </div>
    </section>
  );
};

export default ExperienceSection;
