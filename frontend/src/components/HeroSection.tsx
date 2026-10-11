import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { portfolioProjects } from "@/data/portfolio";

const HeroSection = () => {
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);
  const selectedProject = portfolioProjects[selectedProjectIndex];

  return (
    <section className="portfolio-opening" aria-labelledby="opening-title">
      <div className="portfolio-opening__inner">
        <div className="portfolio-opening__masthead">
          <div>
            <h1 id="opening-title">IS-HAQ ABDUL-MOOMIN</h1>
            <p className="portfolio-opening__location">Tarkwa, Ghana</p>
          </div>
          <p className="portfolio-opening__discipline">
            Software engineer
            <span>Full-stack · AI · IoT</span>
          </p>
        </div>

        <div className="contact-sheet">
          <article
            className="featured-record"
            aria-live="polite"
            aria-atomic="true"
            key={selectedProject.slug}
          >
            <div className="featured-record__registration">
              <span>Selected work</span>
              <span>{selectedProject.year} / {selectedProject.category}</span>
            </div>
            <h2>{selectedProject.title}</h2>
            <p className="featured-record__role">Role · {selectedProject.role}</p>
            <p className="featured-record__description">
              {selectedProject.description}
            </p>
            <div className="technology-line" aria-label="Project technologies">
              {selectedProject.technologies.map((technology) => (
                <span key={technology}>{technology}</span>
              ))}
            </div>
            <Link className="text-link" to="/projects">
              Read the project index <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </article>

          <nav className="project-index" aria-label="Select a featured project">
            <div className="project-index__heading">
              <span className="print-label">Contact sheet</span>
              <span className="print-label">
                {String(portfolioProjects.length).padStart(2, "0")} records
              </span>
            </div>
            <ol>
              {portfolioProjects.map((project, index) => (
                <li key={project.slug}>
                  <button
                    type="button"
                    className={`project-index__item${index === selectedProjectIndex ? " is-selected" : ""}`}
                    aria-pressed={index === selectedProjectIndex}
                    aria-label={`Show ${project.title}`}
                    onClick={() => setSelectedProjectIndex(index)}
                  >
                    <span className="project-index__number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="project-index__title">{project.title}</span>
                    <span className="project-index__year">{project.year}</span>
                  </button>
                </li>
              ))}
            </ol>
            <Link className="text-link project-index__all" to="/projects">
              Open all records <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </nav>
        </div>

        <div className="opening-actions">
          <a
            className="action-link action-link--primary"
            href="/IS_HAQ_ABDUL_MOOMIN_S_CV.pdf"
            download
          >
            Download CV <ArrowDown aria-hidden="true" size={16} />
          </a>
          <Link className="action-link" to="/contact">
            Start a conversation <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
          <span className="opening-actions__note">
            A portfolio of applied software work
          </span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
