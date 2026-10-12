import PortfolioAssets from "@/components/PortfolioAssets";
import { usePortfolioContent } from "@/hooks/usePortfolioContent";

const SkillsSection = () => {
  const { content } = usePortfolioContent();
  const skills = content.skills;

  return (
    <section id="skills" className="print-section skills-section">
      <div className="section-inner">
        <div className="section-heading">
          <h2>{skills.heading}</h2>
          <p>{skills.intro}</p>
        </div>

        <dl className="skills-register">
          {skills.categories.map((group) => (
            <div className="skills-register__row" key={group.category}>
              <dt>{group.category}</dt>
              <dd>
                {group.skills.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </dd>
            </div>
          ))}
        </dl>

        <div className="skills-addenda">
          <div>
            <h3>Languages</h3>
            <dl className="language-list">
              {skills.languages.map((language) => (
                <div key={language.name}>
                  <dt>{language.name}</dt>
                  <dd>{language.level}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h3>Certifications</h3>
            <ul className="certification-list">
              {skills.certifications.map((certification) => (
                <li key={certification}>{certification}</li>
              ))}
            </ul>
          </div>
        </div>
        <PortfolioAssets assets={skills.assets} section="Skills" />
      </div>
    </section>
  );
};

export default SkillsSection;
