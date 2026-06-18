import RecentPostsSkeleton from "@/pages/Home/component/RecentPostsSkeleton";

function HomeSkeleton() {
  return (
    <main className="home-main">
      <section className="hero-section">
        <div className="home-hero-skeleton">
          <span className="skeleton home-hero-skeleton-badge" />
          <div className="skeleton home-hero-skeleton-title" />
          <div className="skeleton home-hero-skeleton-text" />
        </div>
      </section>
      <RecentPostsSkeleton />
      <section className="tech-stack-section">
        <div className="section-header">
          <h2 className="section-title">기술 스택</h2>
        </div>
        <div className="tech-list">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="skeleton skeleton--badge" />
          ))}
        </div>
      </section>
    </main>
  );
}

export default HomeSkeleton;
