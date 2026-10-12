export type PortfolioProject = {
  id?: string;
  slug: string;
  year?: string;
  title: string;
  role?: string;
  description: string;
  technologies?: string[];
  category?: string;
  mediaUrl?: string | null;
  mediaPublicId?: string | null;
  mediaType?: "image" | "video" | null;
  githubUrl?: string | null;
  hostedUrl?: string | null;
};
