const SKELETON_COUNT = 6;

function GridSkeleton() {
  return (
    <div className="posts-grid">
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <div key={`skeleton-grid-${i}`} className="post-grid-card-skeleton">
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
  );
}

export default GridSkeleton;
