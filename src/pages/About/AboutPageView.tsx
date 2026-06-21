import { useState } from "react";
import ProjectCard from "@pages/About/component/ProjectCard";
import { getInitials, getAvatarColor } from "@/utils/getInitials";
import type {
  ProfileResponse,
  WorkExperienceItem,
  SideProjectItem,
  TechStackItem,
} from "@/api/about/about";

interface Props {
  profile: ProfileResponse | null;
  workExperiences: WorkExperienceItem[];
  sideProjects: SideProjectItem[];
  techStacks: TechStackItem[];
  isProfileLoading: boolean;
  isWorkLoading: boolean;
  isProjectsLoading: boolean;
  isTechLoading: boolean;
}

function formatPeriod(
  startDate: string,
  endDate: string | null,
  isCurrent: boolean,
) {
  const fmt = (d: string) => d.replace("-", "."); // "2024-03" → "2024.03"
  return `${fmt(startDate)} – ${isCurrent ? "현재" : endDate ? fmt(endDate) : ""}`;
}


function AboutPageView({
  profile,
  workExperiences,
  sideProjects,
  techStacks,
  isProfileLoading,
  isWorkLoading,
  isProjectsLoading,
  isTechLoading,
}: Props) {
  const [isAvatarImageLoaded, setIsAvatarImageLoaded] = useState(false);

  return (
    <>
      <main className="about-main">
        {/* 프로필 섹션 */}
        <section className="about-profile-section">
          <div
            className="about-profile-avatar"
            style={!isProfileLoading && !profile?.profile_avatar ? { background: getAvatarColor(profile?.username ?? 'Dev') } : undefined}
          >
            {isProfileLoading || (profile?.profile_avatar && !isAvatarImageLoaded) ? (
              <span className="skeleton skeleton--circle" />
            ) : null}
            {!isProfileLoading && profile?.profile_avatar ? (
              <img
                src={profile.profile_avatar}
                alt="프로필"
                className="about-profile-avatar-img"
                style={isAvatarImageLoaded ? undefined : { display: "none" }}
                onLoad={() => setIsAvatarImageLoaded(true)}
              />
            ) : !isProfileLoading ? (
              <span className="about-profile-avatar-initials">
                {getInitials(profile?.username ?? 'Dev')}
              </span>
            ) : null}
          </div>
          <div className="about-profile-info">
            {isProfileLoading ? (
              <>
                <span className="skeleton skeleton--title" />
                <span className="skeleton skeleton--text" />
                <span className="skeleton skeleton--text" />
              </>
            ) : !profile ? (
              <p className="about-empty-text">데이터가 없습니다.</p>
            ) : (
              <>
                <span className="about-profile-badge">
                  <span className="about-profile-badge-dot" />
                  Available for work
                </span>
                <h1 className="about-profile-name">{profile.username}</h1>
                <p className="about-profile-role">{profile.role}</p>
                {profile.bio && (
                  <div className="about-bio-wrapper">
                    <p className="about-profile-bio">
                      {profile.bio.split("\n").map((line, i) => (
                        <span key={i}>
                          {line}
                          <br />
                        </span>
                      ))}
                    </p>
                  </div>
                )}
                <div className="about-profile-links">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="about-link-btn about-link-btn--primary"
                  >
                    GitHub
                  </a>
                  <a
                    href="mailto:devdev0226@gmail.com"
                    className="about-link-btn about-link-btn--secondary"
                  >
                    이메일 보내기
                  </a>
                </div>
              </>
            )}
          </div>
        </section>

        {/* 경력 섹션 */}
        <section className="about-section">
          <h2 className="about-section-title">경력 및 이력</h2>
          {isWorkLoading ? (
            <div className="about-timeline">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="about-timeline-item">
                  <div className="about-timeline-dot-wrap">
                    <span className="about-timeline-dot" />
                    <span className="about-timeline-line" />
                  </div>
                  <div className="about-timeline-content">
                    <span className="skeleton skeleton--text skeleton--short" />
                    <span className="skeleton skeleton--title" />
                    <span className="skeleton skeleton--text" />
                    <span className="skeleton skeleton--text" />
                  </div>
                </div>
              ))}
            </div>
          ) : workExperiences.length === 0 ? (
            <p className="about-empty-text">데이터가 없습니다.</p>
          ) : (
            <div className="about-timeline">
              {workExperiences.map((item) => (
                <div key={item.id} className="about-timeline-item">
                  <div className="about-timeline-dot-wrap">
                    <span
                      className={`about-timeline-dot ${item.isCurrent ? "about-timeline-dot--active" : ""}`}
                    />
                    <span className="about-timeline-line" />
                  </div>
                  <div className="about-timeline-content">
                    <div className="about-timeline-header">
                      <span className="about-timeline-period">
                        {formatPeriod(
                          item.startDate,
                          item.endDate,
                          item.isCurrent,
                        )}
                      </span>
                      {item.isCurrent && (
                        <span className="about-timeline-current-badge">
                          재직중
                        </span>
                      )}
                    </div>
                    <h3 className="about-timeline-company">{item.company}</h3>
                    <p className="about-timeline-role">{item.position}</p>
                    {item.description && (
                      <p className="about-timeline-desc">{item.description}</p>
                    )}
                    <div className="about-tag-list">
                      {item.techStacks.map((t) => (
                        <span key={t.id} className="about-tag">
                          {t.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 프로젝트 섹션 */}
        <section className="about-section">
          <h2 className="about-section-title">사이드 프로젝트</h2>
          {isProjectsLoading ? (
            <div className="about-project-grid">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="about-project-card">
                  <div className="about-project-preview skeleton" />
                  <div className="about-project-card-body">
                    <span className="skeleton skeleton--text skeleton--short" />
                    <span className="skeleton skeleton--title" />
                    <span className="skeleton skeleton--text" />
                  </div>
                </div>
              ))}
            </div>
          ) : sideProjects.length === 0 ? (
            <p className="about-empty-text">데이터가 없습니다.</p>
          ) : (
            <div className="about-project-grid">
              {sideProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  title={project.title}
                  description={project.description ?? ""}
                  tags={project.techStacks.map((t) => t.name)}
                  link={project.link ?? ""}
                  period={formatPeriod(
                    project.startDate,
                    project.endDate,
                    false,
                  )}
                />
              ))}
            </div>
          )}
        </section>

        {/* 기술 스택 섹션 */}
        <section className="about-section about-skills-section">
          <h2 className="about-section-title">기술 스택</h2>
          {isTechLoading ? (
            <div className="about-skills-grid">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="about-skill-group">
                  <span className="skeleton skeleton--text skeleton--short" />
                  <div className="about-skill-list">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <span key={j} className="skeleton skeleton--badge" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : techStacks.length === 0 ? (
            <p className="about-empty-text">데이터가 없습니다.</p>
          ) : (() => {
            const CATEGORY_ORDER = ["Frontend", "Backend", "DevOps", "Tools", "etc"];
            const grouped = techStacks.reduce<Record<string, typeof techStacks>>((acc, t) => {
              const key = t.category?.name ?? "etc";
              if (!acc[key]) acc[key] = [];
              acc[key].push(t);
              return acc;
            }, {});
            const sortedEntries = Object.entries(grouped).sort(([a], [b]) => {
              const ai = CATEGORY_ORDER.indexOf(a);
              const bi = CATEGORY_ORDER.indexOf(b);
              return (ai === -1 ? Infinity : ai) - (bi === -1 ? Infinity : bi);
            });
            return (
              <div className="tech-categories">
                {sortedEntries.map(([categoryName, items]) => (
                  <div key={categoryName}>
                    <p className="tech-category-title">{categoryName}</p>
                    <div className="tech-list">
                      {items.map((t) => (
                        <span key={t.id} className="tech-badge">
                          {t.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </section>
      </main>
    </>
  );
}

export default AboutPageView;
