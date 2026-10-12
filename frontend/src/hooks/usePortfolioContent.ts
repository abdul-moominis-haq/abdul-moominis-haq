import { useQuery } from "@tanstack/react-query";
import { apiUrl } from "@/lib/api";
import {
  defaultPortfolioContent,
  type PortfolioContent,
} from "@/data/portfolioContent";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasStringFields(value: unknown, fields: string[]): boolean {
  return (
    isRecord(value) &&
    fields.every((field) => typeof value[field] === "string")
  );
}

function isAssetList(value: unknown): boolean {
  return (
    Array.isArray(value) &&
    value.every(
      (asset) =>
        isRecord(asset) &&
        typeof asset.label === "string" &&
        typeof asset.mediaUrl === "string" &&
        typeof asset.mediaPublicId === "string" &&
        ["image", "video", "raw"].includes(String(asset.mediaType)),
    )
  );
}

function isHome(value: unknown): value is PortfolioContent["home"] {
  return (
    hasStringFields(value, ["name", "location", "discipline", "specialties", "cvUrl"]) &&
    isRecord(value) &&
    isAssetList(value.assets) &&
    (value.portraitUrl === undefined || typeof value.portraitUrl === "string")
  );
}

function isAbout(value: unknown): value is PortfolioContent["about"] {
  if (
    !hasStringFields(value, ["heading", "intro", "narrativeTitle", "narrative"]) ||
    !isRecord(value) ||
    !isRecord(value.education) ||
    !isAssetList(value.assets) ||
    !Array.isArray(value.highlights)
  ) return false;
  return (
    hasStringFields(value.education, [
      "degree",
      "period",
      "school",
      "grade",
      "concentrations",
      "coursework",
    ]) &&
    value.highlights.every(
      (highlight) =>
        hasStringFields(highlight, ["title", "description"]),
    )
  );
}

function isExperience(value: unknown): value is PortfolioContent["experience"] {
  if (
    !hasStringFields(value, ["heading", "intro"]) ||
    !isRecord(value) ||
    !isAssetList(value.assets) ||
    !Array.isArray(value.items)
  ) return false;
  return value.items.every(
    (item) =>
      hasStringFields(item, ["company", "role", "location", "period"]) &&
      isRecord(item) &&
      Array.isArray(item.achievements) &&
      item.achievements.every((achievement) => typeof achievement === "string") &&
      Array.isArray(item.tags) &&
      item.tags.every((tag) => typeof tag === "string"),
  );
}

function isSkills(value: unknown): value is PortfolioContent["skills"] {
  if (
    !hasStringFields(value, ["heading", "intro"]) ||
    !isRecord(value) ||
    !isAssetList(value.assets) ||
    !Array.isArray(value.categories) ||
    !Array.isArray(value.languages) ||
    !Array.isArray(value.certifications)
  ) return false;
  return (
    value.categories.every(
      (category) =>
        hasStringFields(category, ["category"]) &&
        isRecord(category) &&
        Array.isArray(category.skills) &&
        category.skills.every((skill) => typeof skill === "string"),
    ) &&
    value.languages.every((language) => hasStringFields(language, ["name", "level"])) &&
    value.certifications.every((certification) => typeof certification === "string")
  );
}

function normalizePortfolioContent(value: unknown): PortfolioContent {
  if (!isRecord(value)) {
    throw new Error("Portfolio content service returned invalid section data");
  }

  const content = { ...defaultPortfolioContent };
  for (const section of ["home", "about", "experience", "skills"] as const) {
    if (value[section] === undefined) continue;
    switch (section) {
      case "home":
        if (!isHome(value.home)) throw new Error("Portfolio home content is invalid");
        content.home = value.home;
        break;
      case "about":
        if (!isAbout(value.about)) throw new Error("Portfolio about content is invalid");
        content.about = value.about;
        break;
      case "experience":
        if (!isExperience(value.experience)) {
          throw new Error("Portfolio experience content is invalid");
        }
        content.experience = value.experience;
        break;
      case "skills":
        if (!isSkills(value.skills)) throw new Error("Portfolio skills content is invalid");
        content.skills = value.skills;
        break;
    }
  }
  return content;
}

async function fetchPortfolioContent(): Promise<PortfolioContent> {
  const response = await fetch(apiUrl("/api/content"));
  if (!response.ok) {
    throw new Error(`Portfolio content service returned ${response.status}`);
  }

  const content: unknown = await response.json();
  return normalizePortfolioContent(content);
}

export function usePortfolioContent() {
  const query = useQuery({
    queryKey: ["portfolio-content"],
    queryFn: fetchPortfolioContent,
    staleTime: 30_000,
    retry: false,
  });

  return {
    ...query,
    content: query.data ?? defaultPortfolioContent,
  };
}
