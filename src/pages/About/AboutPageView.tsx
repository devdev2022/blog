import Header from "@components/Header/Header";
import Footer from "@components/Footer/Footer";
import ProjectCard from "@pages/About/component/ProjectCard";

const CAREER_LIST = [
  {
    id: 1,
    period: "2024.03 – 2025.03",
    company: "지오소프트",
    role: "웹 개발자",
    description:
      "JavaScript, React를 활용한 관리자 대시보드 및 관제 서비스 개발. REST API 설계 및 백엔드 협업",
    tags: ["React", "JavaScript", "Node.js"],
    isCurrent: false,
  },
];

const PROJECT_LIST = [
  {
    id: 1,
    title: "개발자 블로그",
    description:
      "React + TypeScript로 제작한 개인 기술 블로그. 포스트 작성, 태그 분류, GitHub 잔디 시각화 등 기능 구현.",
    tags: ["React", "TypeScript", "MySQL"],
    link: "https://github.com",
    period: "2026.02 – 현재",
  },
  {
    id: 2,
    title: "화연당",
    description: "화연당 화훼 사업 서비스 및 포트폴리오 소개 사이트",
    tags: ["React", "Node.js", "PostgreSQL"],
    link: "https://hwayeondang.com",
    period: "2025.09 – 2025.11",
  },
];

const SKILL_LIST = [
  {
    category: "Frontend",
    items: ["React", "TypeScript", "JavaScript", "HTML/CSS", "Vue.js"],
  },
  { category: "Backend", items: ["Node.js", "Express", "MySQL", "REST API"] },
  {
    category: "DevOps / Tools",
    items: ["Git", "GitHub", "Docker", "Vite", "Figma"],
  },
];

function AboutPageView() {
  return (
    <>
      <Header />
      <main className="about-main">
        {/* 프로필 섹션 */}
        <section className="about-profile-section">
          <div className="about-profile-avatar">
            <span className="about-profile-avatar-initials">Dev</span>
          </div>
          <div className="about-profile-info">
            <span className="about-profile-badge">
              <span className="about-profile-badge-dot" />
              Available for work
            </span>
            <h1 className="about-profile-name">김한솔</h1>
            <p className="about-profile-role">프론트엔드 개발자</p>
            <p className="about-profile-bio">
              React와 TypeScript를 주로 사용하는 프론트엔드 개발자입니다.
              <br />
              코드로 문제를 해결하고, 배운 것들을 이 블로그에 기록하고 있습니다.
            </p>
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
          </div>
        </section>

        {/* 경력 섹션 */}
        <section className="about-section">
          <h2 className="about-section-title">경력 및 이력</h2>
          <div className="about-timeline">
            {CAREER_LIST.map((item) => (
              <div key={item.id} className="about-timeline-item">
                <div className="about-timeline-dot-wrap">
                  <span
                    className={`about-timeline-dot ${item.isCurrent ? "about-timeline-dot--active" : ""}`}
                  />
                  <span className="about-timeline-line" />
                </div>
                <div className="about-timeline-content">
                  <div className="about-timeline-header">
                    <span className="about-timeline-period">{item.period}</span>
                    {item.isCurrent && (
                      <span className="about-timeline-current-badge">
                        재직중
                      </span>
                    )}
                  </div>
                  <h3 className="about-timeline-company">{item.company}</h3>
                  <p className="about-timeline-role">{item.role}</p>
                  <p className="about-timeline-desc">{item.description}</p>
                  <div className="about-tag-list">
                    {item.tags.map((tag) => (
                      <span key={tag} className="about-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 프로젝트 섹션 */}
        <section className="about-section">
          <h2 className="about-section-title">사이드 프로젝트</h2>
          <div className="about-project-grid">
            {PROJECT_LIST.map((project) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                description={project.description}
                tags={project.tags}
                link={project.link}
                period={project.period}
              />
            ))}
          </div>
        </section>

        {/* 기술 스택 섹션 */}
        <section className="about-section about-skills-section">
          <h2 className="about-section-title">기술 스택</h2>
          <div className="about-skills-grid">
            {SKILL_LIST.map((group) => (
              <div key={group.category} className="about-skill-group">
                <p className="about-skill-category">{group.category}</p>
                <div className="about-skill-list">
                  {group.items.map((skill) => (
                    <span key={skill} className="tech-badge">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default AboutPageView;
