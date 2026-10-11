import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import ProjectDataNotice from "@/components/ProjectDataNotice";
import ProjectMedia from "@/components/ProjectMedia";
import { usePortfolioProjects } from "@/hooks/usePortfolioProjects";

const ProjectsSection = () => {
  const { projects, usingSavedProjects } = usePortfolioProjects();

  return (
    <section id="projects" className="print-section project-archive">
    <div className="section-inner">
      <div className="section-heading">
        <h2>Work, indexed.</h2>
        <p>Projects across agriculture, finance, education, and the web.</p>
      </div>

      {usingSavedProjects && <ProjectDataNotice />}
      <ol className="project-archive__list">
        {projects.map((project, index) => (
          <li className="project-archive__record" key={project.id ?? project.slug}>
            <span className="project-archive__number" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="project-archive__body">
              <h3>{project.title}</h3>
              {(project.year || project.category) && (
                <p className="print-label">
                  {[project.year, project.category].filter(Boolean).join(" · ")}
                </p>
              )}
              <p className="project-archive__description">{project.description}</p>
              {project.role && <p className="project-archive__role">Role · {project.role}</p>}
              <ProjectMedia mediaUrl={project.mediaUrl} mediaType={project.mediaType} title={project.title} />
              {!!project.technologies?.length && (
                <ul className="technology-line" aria-label="Technologies used">
                  {project.technologies.map((technology) => (
                    <li key={technology}>{technology}</li>
                  ))}
                </ul>
              )}
              <div className="project-archive__links">
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noreferrer">
                    GitHub repository <ArrowUpRight aria-hidden="true" size={16} />
                  </a>
                )}
                {project.hostedUrl && (
                  <a href={project.hostedUrl} target="_blank" rel="noreferrer">
                    Open live project <ArrowUpRight aria-hidden="true" size={16} />
                  </a>
                )}
              </div>
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
};

export default ProjectsSection;
