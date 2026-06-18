// 청크 로딩(라우트 진입) + 데이터 로딩 양쪽에서 쓰는 상세 페이지 스켈레톤
function PostDetailSkeleton() {
  return (
    <main className="post-detail-main">
      <div className="post-detail-hero-text">
        <div className="skeleton skeleton-hero-category" />
        <div className="skeleton skeleton-hero-title" />
        <div className="skeleton skeleton-hero-title-sm" />
      </div>
      <div className="post-detail-meta-bar">
        <div className="skeleton skeleton-meta-bar" />
      </div>
      <div className="post-detail-layout">
        <div className="post-detail-content">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="skeleton skeleton-paragraph"
              style={{ marginBottom: 20 }}
            />
          ))}
        </div>
        <aside className="post-detail-sidebar">
          <div className="sidebar-widget">
            <div className="skeleton skeleton-widget-title" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton skeleton-widget-item" />
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}

export default PostDetailSkeleton;
