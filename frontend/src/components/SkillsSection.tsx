const skillCategories = [
  {
    category: "Programming languages",
    skills: ["JavaScript", "Python", "TypeScript", "C++", "SQL"],
  },
  {
    category: "Frontend",
    skills: ["React.js", "Next.js", "HTML/CSS", "Tailwind CSS", "Bootstrap"],
  },
  {
    category: "Backend and data",
    skills: ["Node.js", "MongoDB", "REST APIs", "SQL Server", "Redis"],
  },
  {
    category: "AI, ML, and systems",
    skills: [
      "Machine Learning",
      "TensorFlow",
      "Data Analysis",
      "IoT Systems",
      "Predictive Analytics",
    ],
  },
  {
    category: "Cloud and delivery",
    skills: ["AWS", "Docker", "Git", "CI/CD", "Cloud Integration"],
  },
  {
    category: "Mobile and tools",
    skills: [
      "Android Studio",
      "Mobile Development",
      "Jupyter Notebooks",
      "IntelliJ IDEA",
      "Agile Methodology",
    ],
  },
];

const certifications = [
  "Masterclass on Digital Product Development – UnternehmerTUM Ghana Hubs Network (2025)",
  "Digital Product Development: From Zero to Hero – Technical University of Munich (2024)",
  "Machine Learning – Simplilearn (2024)",
  "WordPress (CMS) – Udemy (2023)",
  "Microsoft SQL Server – Udemy (2023)",
];

const SkillsSection = () => (
  <section id="skills" className="print-section skills-section">
    <div className="section-inner">
      <div className="section-heading">
        <h2>Tools in the work.</h2>
        <p>
          Technologies and methods used across development, data, and connected
          systems.
        </p>
      </div>

      <dl className="skills-register">
        {skillCategories.map((group) => (
          <div className="skills-register__row" key={group.category}>
            <dt>
              {group.category}
            </dt>
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
            <div><dt>English</dt><dd>Native</dd></div>
            <div><dt>Twi</dt><dd>Native</dd></div>
            <div><dt>Hausa</dt><dd>Conversational</dd></div>
          </dl>
        </div>
        <div>
          <h3>Certifications</h3>
          <ul className="certification-list">
            {certifications.map((certification) => (
              <li key={certification}>{certification}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);

export default SkillsSection;
