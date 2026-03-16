import { useState } from "react";

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  link: string;
  period: string;
}

function ProjectCard({ title, description, tags, link, period }: ProjectCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const previewUrl = `https://api.microlink.io/?url=${encodeURIComponent(link)}&screenshot=true&meta=false&embed=screenshot.url`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="about-project-card"
    >
      {/* 사이트 미리보기 이미지 */}
      <div className="about-project-preview">
        {!imgError ? (
          <>
            {!imgLoaded && <div className="about-project-preview-skeleton" />}
            <img
              src={previewUrl}
              alt={`${title} 미리보기`}
              className={`about-project-preview-img ${imgLoaded ? "about-project-preview-img--loaded" : ""}`}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
            />
          </>
        ) : (
          <div className="about-project-preview-fallback">
            <span className="about-project-preview-fallback-icon">🔗</span>
            <span className="about-project-preview-fallback-text">미리보기 없음</span>
          </div>
        )}
      </div>

      {/* 카드 본문 */}
      <div className="about-project-card-body">
        <div className="about-project-card-header">
          <span className="about-project-period">{period}</span>
          <span className="about-project-arrow">→</span>
        </div>
        <h3 className="about-project-title">{title}</h3>
        <p className="about-project-desc">{description}</p>
        <div className="about-tag-list">
          {tags.map((tag) => (
            <span key={tag} className="about-tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}

export default ProjectCard;
