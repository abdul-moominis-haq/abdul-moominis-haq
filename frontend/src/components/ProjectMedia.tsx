type ProjectMediaProps = {
  mediaUrl?: string | null;
  mediaType?: "image" | "video" | null;
  title: string;
  className?: string;
};

export default function ProjectMedia({
  mediaUrl,
  mediaType,
  title,
  className,
}: ProjectMediaProps) {
  if (!mediaUrl || !mediaType) return null;

  return (
    <div className={`project-media${className ? ` ${className}` : ""}`}>
      {mediaType === "video" ? (
        <video controls preload="metadata" aria-label={`${title} project video`}>
          <source src={mediaUrl} />
          Your browser does not support embedded video.
        </video>
      ) : (
        <img src={mediaUrl} alt={`${title} project`} loading="lazy" />
      )}
    </div>
  );
}
