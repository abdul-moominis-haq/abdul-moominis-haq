import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const highlights = [
  {
    title: "Solution-focused",
    description:
      "Dedicated to software solutions that enhance business efficiency and user experience.",
  },
  {
    title: "Collaborative leadership",
    description:
      "Led organizations of 1,000+ members and mentored teams in technical projects.",
  },
  {
    title: "Achievement-driven",
    description:
      "National Science and Mathematics Quiz contestant and academic excellence award recipient.",
  },
];

const AboutSection = () => (
  <section id="about" className="print-section about-section">
    <div className="section-inner">
      <div className="section-heading">
        <h2>Engineering, with context.</h2>
        <p>
          A computer science and engineering graduate drawn to useful software,
          intelligent systems, and the teams that make them work.
        </p>
      </div>

      <div className="about-section__study">
        <div className="about-section__narrative">
        <h3>Building from the problem outward.</h3>
          <p>
            My work spans full-stack development, AI and machine learning, IoT,
            and smart agriculture. I enjoy learning new technologies and
            collaborating on software that addresses real-world needs.
          </p>
          <Link className="text-link" to="/contact">
            Get in touch <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
        </div>

        <article className="study-record">
          <h3>BSc. Computer Science and Engineering</h3>
          <p className="print-label">Education · 2022–2025</p>
          <p className="study-record__school">
            University of Mines and Technology · Tarkwa, Ghana
          </p>
          <p className="study-record__grade">GPA: 3.00/4.00 · CWA: 65.4</p>
          <div className="study-record__details">
            <div>
              <h4>Concentrations</h4>
              <p>Software Engineering · Artificial Intelligence · IoT</p>
            </div>
            <div>
              <h4>Relevant coursework</h4>
              <p>
                Data Structures &amp; Algorithms, Machine Learning,
                Object-Oriented Programming, Statistics, Software Engineering
              </p>
            </div>
          </div>
        </article>
      </div>

      <ul className="about-highlights">
        {highlights.map((highlight) => (
          <li key={highlight.title}>
            <h3>{highlight.title}</h3>
            <p>{highlight.description}</p>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default AboutSection;
