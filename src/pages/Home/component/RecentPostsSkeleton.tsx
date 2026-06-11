/* 홈 최근 포스트 영역 스켈레톤. 데이터 로딩(HomePageView)과
청크 로딩 fallback(HomeSkeleton) 양쪽에서 재사용*/
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

export default RecentPostsSkeleton;
