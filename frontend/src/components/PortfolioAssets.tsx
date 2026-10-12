import { ArrowDownToLine, ArrowUpRight } from "lucide-react";
import type { PortfolioAsset } from "@/data/portfolioContent";

type PortfolioAssetsProps = {
  assets: PortfolioAsset[];
  section: string;
};

export default function PortfolioAssets({ assets, section }: PortfolioAssetsProps) {
  if (!assets.length) return null;

  return (
    <div className="portfolio-assets" aria-label={`${section} media`}>
      {assets.map((asset) => (
        <figure className="portfolio-assets__item" key={asset.mediaPublicId}>
          {asset.mediaType === "image" ? (
            <img src={asset.mediaUrl} alt={asset.label} loading="lazy" />
          ) : asset.mediaType === "video" ? (
            <video controls preload="metadata" aria-label={asset.label}>
              <source src={asset.mediaUrl} />
              Your browser does not support this video.
            </video>
          ) : (
            <a href={asset.mediaUrl} target="_blank" rel="noreferrer">
              {asset.label} <ArrowDownToLine aria-hidden="true" size={17} />
              <span className="print-label">Open document</span>
              <ArrowUpRight aria-hidden="true" size={14} />
            </a>
          )}
          {(asset.mediaType === "image" || asset.mediaType === "video") && (
            <figcaption>{asset.label}</figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
