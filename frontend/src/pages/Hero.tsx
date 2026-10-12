import HeroSection from "@/components/HeroSection";
import PortfolioContentNotice from "@/components/PortfolioContentNotice";

export default function HeroPage() {
  return (
    <main id="main" className="portfolio-home">
      <PortfolioContentNotice />
      <HeroSection />
    </main>
  );
}
