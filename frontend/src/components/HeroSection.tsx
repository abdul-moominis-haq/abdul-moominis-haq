import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import ProjectDataNotice from "@/components/ProjectDataNotice";
import ProjectMedia from "@/components/ProjectMedia";
import { usePortfolioProjects } from "@/hooks/usePortfolioProjects";

const HeroSection = () => {
  const { projects, usingSavedProjects } = usePortfolioProjects();
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);
  const selectedIndex = projects.length > 0 && selectedProjectIndex < projects.length
    ? selectedProjectIndex
    : 0;
  const selectedProject = projects[selectedIndex];

  return (
    <section className="portfolio-opening" aria-labelledby="opening-title">
      <div className="portfolio-opening__inner">
        <div className="portfolio-opening__masthead">
          <div>
            <h1 id="opening-title">IS-HAQ ABDUL-MOOMIN</h1>
            <p className="portfolio-opening__location">Accra, Ghana</p>
          </div>
          <p className="portfolio-opening__discipline">
            Software engineer
            <span>Full-stack · AI · IoT</span>
          </p>
        </div>

        {usingSavedProjects && <ProjectDataNotice />}
        <div className="contact-sheet">
          <nav className="project-index" aria-label="Select a featured project">
            <div className="project-index__heading">
              <span className="print-label">Contact sheet</span>
              <span className="print-label">
                {String(projects.length).padStart(2, "0")} records
              </span>
            </div>
            <ol>
              {projects.map((project, index) => (
                <li key={project.id ?? project.slug}>
                  <button
                    type="button"
                    className={`project-index__item${index === selectedIndex ? " is-selected" : ""}`}
                    aria-pressed={index === selectedIndex}
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

          {selectedProject ? (
            <article
              className="featured-record"
              aria-live="polite"
              aria-atomic="true"
              key={selectedProject.id ?? selectedProject.slug}
            >
              <div className="featured-record__registration">
                <span>Selected work</span>
                <span>
                  {[selectedProject.year, selectedProject.category].filter(Boolean).join(" / ")}
                </span>
              </div>
              <h2>{selectedProject.title}</h2>
              {selectedProject.role && (
                <p className="featured-record__role">Role · {selectedProject.role}</p>
              )}
              <p className="featured-record__description">{selectedProject.description}</p>
              <ProjectMedia
                className="project-media--featured"
                mediaUrl={selectedProject.mediaUrl}
                mediaType={selectedProject.mediaType}
                title={selectedProject.title}
              />
              {!!selectedProject.technologies?.length && (
                <div className="technology-line" aria-label="Project technologies">
                  {selectedProject.technologies.map((technology) => (
                    <span key={technology}>{technology}</span>
                  ))}
                </div>
              )}
              <div className="featured-record__links">
                {selectedProject.githubUrl && (
                  <a className="text-link" href={selectedProject.githubUrl} target="_blank" rel="noreferrer">
                    GitHub repository <ArrowUpRight aria-hidden="true" size={16} />
                  </a>
                )}
                {selectedProject.hostedUrl && (
                  <a className="text-link" href={selectedProject.hostedUrl} target="_blank" rel="noreferrer">
                    Open live project <ArrowUpRight aria-hidden="true" size={16} />
                  </a>
                )}
                <Link className="text-link" to="/projects">
                  Read the project index <ArrowUpRight aria-hidden="true" size={16} />
                </Link>
              </div>
            </article>
          ) : (
            <div className="featured-record featured-record--empty">
              <h2>No projects yet.</h2>
              <p>Add a project from the project manager to feature your work here.</p>
            </div>
          )}
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
