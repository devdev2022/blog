import type { Post, TechCategory } from "@/types/post";
import Header from "@components/Header/Header";
import Footer from "@components/Footer/Footer";
import RecentPostsSection from "@components/RecentPostsSection/RecentPostsSection";
interface HomePageViewProps {
  recentPosts: Post[];
  techCategories: TechCategory[];
}

function HomePageView({ recentPosts, techCategories }: HomePageViewProps) {
  return (
    <>
      <Header />
      <main className="home-main">
        {/* Hero 섹션 */}
        <section className="hero-section">
          <span className="hero-badge">
            <span className="hero-badge-dot" />
            Developer Blog
          </span>
          <h1 className="hero-title">
            코드로 기록하는
            <br />
            <span className="hero-title-accent">개발자의 여정</span>
          </h1>
          <p className="hero-description">
            React, TypeScript, MySQL을 다루며 배운 것들을 정리합니다.
            <br />
            실전 경험과 삽질의 기록을 솔직하게 공유합니다.
          </p>
          <div className="hero-actions">
            <a href="/posts" className="hero-btn-primary">
              포스트 보기
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-btn-secondary"
            >
              GitHub
            </a>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-number">3</span>
              <span className="hero-stat-label">포스트</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-number">10+</span>
              <span className="hero-stat-label">기술 스택</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-number">2026</span>
              <span className="hero-stat-label">시작 연도</span>
            </div>
          </div>
        </section>

        {/* 최근 포스트 섹션 */}
        <RecentPostsSection posts={recentPosts} />
        {/* 기술 스택 섹션 */}
        <section className="tech-stack-section">
          <div className="section-header">
            <h2 className="section-title">기술 스택</h2>
          </div>
          <div className="tech-categories">
            {techCategories.map((cat) => (
              <div key={cat.category} className="tech-category">
                <p className="tech-category-title">{cat.category}</p>
                <div className="tech-list">
                  {cat.items.map((item) => (
                    <span key={item.name} className="tech-badge">
                      {item.name}
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

export default HomePageView;
