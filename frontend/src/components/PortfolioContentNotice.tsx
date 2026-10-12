import { usePortfolioContent } from "@/hooks/usePortfolioContent";

export default function PortfolioContentNotice() {
  const { isError } = usePortfolioContent();
  if (!isError) return null;

  return (
    <p className="portfolio-content-notice" role="status">
      Saved portfolio content is temporarily unavailable. Showing the bundled starting content.
    </p>
  );
}
