import type { Post } from "@/types/post";
import type { TechStackItem } from "@/api/about/about";
import Header from "@components/Header/Header";
import Footer from "@components/Footer/Footer";
import RecentPostsSection from "@components/RecentPostsSection/RecentPostsSection";
import GithubContributionSection from "@components/GithubContribution/GithubContributionSection";

interface HomePageViewProps {
  recentPosts: Post[];
  techStacks: TechStackItem[];
  isLoading: boolean;
}

function RecentPostsSkeleton() {
  return (
    <section className="recent-posts-section">
      <div className="section-header">
        <h2 className="section-title">최근 포스트</h2>
      </div>
      <div className="recent-posts-grid">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={`skeleton-card-${i}`} className="post-card-skeleton">
            <div className="skeleton skeleton-tag" />
            <div className="skeleton skeleton-title" />
            <div className="skeleton skeleton-excerpt" />
            <div className="skeleton skeleton-meta" />
          </div>
        ))}
      </div>
    </section>
  );
}

function HomePageView({
  recentPosts,
  techStacks,
  isLoading,
}: HomePageViewProps) {
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
          <GithubContributionSection />
        </section>

        {/* 최근 포스트 섹션 */}
        {isLoading ? (
          <RecentPostsSkeleton />
        ) : (
          <RecentPostsSection posts={recentPosts} />
        )}
        {/* 기술 스택 섹션 */}
        <section className="tech-stack-section">
          <div className="section-header">
            <h2 className="section-title">기술 스택</h2>
          </div>
          {techStacks.length === 0 ? (
            <p className="tech-stack-empty">등록된 데이터가 없습니다.</p>
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
                      {items.map((ts) => (
                        <span key={ts.id} className="tech-badge">
                          {ts.name}
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
      <Footer />
    </>
  );
}

export default HomePageView;
