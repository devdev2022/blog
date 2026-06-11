/* 청크 로딩(라우트 진입) + 데이터 로딩 양쪽에서 쓰는 태그 페이지 스켈레톤
라우트 진입 fallback에서는 props가 없으므로 viewMode 기본값을 grid로 둔다.*/
const SKELETON_COUNT = 4;

function TagPageSkeleton({
  viewMode = "grid",
}: {
  viewMode?: "grid" | "thread";
}) {
  if (viewMode === "grid") {
    return (
      <div className="tag-page-main">
        <div className="skeleton skeleton-tag-heading" />
        <div className="posts-grid">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <div key={i} className="post-grid-card-skeleton">
              <div className="skeleton skeleton-thumbnail" />
              <div className="skeleton-body">
                <div className="skeleton skeleton-tag" />
                <div className="skeleton skeleton-title" />
                <div className="skeleton skeleton-excerpt" />
                <div className="skeleton skeleton-meta" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="tag-page-main">
      <div className="skeleton skeleton-tag-heading" />
      <div className="tag-post-list">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <div key={i} className="tag-post-item-skeleton">
            <div className="skeleton skeleton-tag-thumb" />
            <div className="tag-post-skeleton-body">
              <div className="skeleton skeleton-tag-title" />
              <div className="skeleton skeleton-tag-excerpt" />
              <div className="skeleton skeleton-tag-meta" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TagPageSkeleton;
