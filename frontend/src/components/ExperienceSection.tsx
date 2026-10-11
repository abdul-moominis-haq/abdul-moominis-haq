const experiences = [
  {
    company: "Educ8 Africa",
    role: "Volunteer Software Engineer",
    location: "Remote, Accra",
    period: "Jul 2024–Aug 2025",
    achievements: [
      "Designed responsive and dynamic web apps with Next.js, React.js, and Node.js",
      "Integrated backend logic using Node.js and MongoDB for real-time feedback and form handling",
    ],
    tags: ["Next.js", "React.js", "Node.js", "MongoDB"],
  },
  {
    company: "KowordaTech",
    role: "Volunteer Web Developer",
    location: "Remote, Accra",
    period: "Sep 2023–May 2025",
    achievements: [
      "Contributed to agricultural product catalog platforms with authentication and analytics dashboards",
      "Developed RESTful APIs and MongoDB databases for content delivery systems",
    ],
    tags: ["REST APIs", "MongoDB", "Authentication", "Analytics"],
  },
  {
    company: "GAOTek Inc.",
    role: "Graphic Design Intern",
    location: "Remote, New York",
    period: "Sep 2023–Dec 2023",
    achievements: [
      "Designed digital assets and marketing materials using Adobe tools",
      "Supported BLE and RFID teams with technical infographics and visual dashboards",
    ],
    tags: ["Adobe Creative Suite", "BLE", "RFID", "Visual Design"],
  },
  {
    company: "UMaT IoT Lab",
    role: "Research Intern",
    location: "Tarkwa, Ghana",
    period: "Oct 2023–Nov 2023",
    achievements: [
      "Implemented sensor-based IoT for smart irrigation and soil monitoring",
      "Contributed to an Agri-IoT climate advisory system using ESP32, Python, and ThingSpeak",
    ],
    tags: ["IoT", "ESP32", "Python", "ThingSpeak", "Agriculture"],
  },
];

const ExperienceSection = () => (
  <section id="experience" className="print-section experience-section">
    <div className="section-inner">
      <div className="section-heading">
        <h2>Where the work happened.</h2>
        <p>Software, research, and design experience across teams and disciplines.</p>
      </div>

      <ol className="experience-list">
        {experiences.map((experience) => (
          <li className="experience-record" key={experience.company}>
            <div className="experience-record__date">
              <span className="print-label">Period</span>
              <time>{experience.period}</time>
            </div>
            <div className="experience-record__body">
              <h3>{experience.company}</h3>
              <p className="print-label">{experience.location}</p>
              <p className="experience-record__role">{experience.role}</p>
              <ul className="experience-record__achievements">
                {experience.achievements.map((achievement) => (
                  <li key={achievement}>{achievement}</li>
                ))}
              </ul>
              <ul className="technology-line" aria-label="Technologies and areas">
                {experience.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

export default ExperienceSection;
