import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { portfolioProjects } from "@/data/portfolio";

const ProjectsSection = () => (
  <section id="projects" className="print-section project-archive">
    <div className="section-inner">
      <div className="section-heading">
        <h2>Work, indexed.</h2>
        <p>Projects across agriculture, finance, education, and the web.</p>
      </div>

      <ol className="project-archive__list">
        {portfolioProjects.map((project, index) => (
          <li className="project-archive__record" key={project.slug}>
            <span className="project-archive__number" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="project-archive__body">
              <h3>{project.title}</h3>
              <p className="print-label">
                {project.year} · {project.category}
              </p>
              <p className="project-archive__description">{project.description}</p>
              <p className="project-archive__role">Role · {project.role}</p>
              <ul className="technology-line" aria-label="Technologies used">
                {project.technologies.map((technology) => (
                  <li key={technology}>{technology}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>

      <p className="project-archive__github">
        <span>More code and contributions</span>
        <a
          href="https://github.com/abdul-moominis-haq"
          target="_blank"
          rel="noreferrer"
        >
          Explore GitHub <ArrowUpRight aria-hidden="true" size={16} />
        </a>
      </p>
      <Link className="section-more-link" to="/contact">
        Discuss a project <ArrowUpRight aria-hidden="true" size={16} />
      </Link>
    </div>
  </section>
);

export default ProjectsSection;
