import { useQuery } from "@tanstack/react-query";
import { apiUrl } from "@/lib/api";
import { portfolioProjects, type PortfolioProject } from "@/data/portfolio";

async function fetchPortfolioProjects(): Promise<PortfolioProject[]> {
  const response = await fetch(apiUrl("/api/projects"));
  if (!response.ok) {
    throw new Error(`Project service returned ${response.status}`);
  }

  const projects: unknown = await response.json();
  if (
    !Array.isArray(projects) ||
    projects.some(
      (project) =>
        !project ||
        typeof project.id !== "string" ||
        typeof project.title !== "string" ||
        typeof project.description !== "string",
    )
  ) {
    throw new Error("Project service returned invalid project data");
  }

  return projects as PortfolioProject[];
}

export function usePortfolioProjects() {
  const query = useQuery({
    queryKey: ["portfolio-projects"],
    queryFn: fetchPortfolioProjects,
    staleTime: 30_000,
    retry: false,
  });

  return {
    ...query,
    projects: query.data ?? portfolioProjects,
    usingSavedProjects: query.isError,
  };
}
