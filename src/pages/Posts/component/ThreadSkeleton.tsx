const SKELETON_COUNT = 6;

function ThreadSkeleton() {
  return (
    <div className="posts-thread">
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <div key={`skeleton-thread-${i}`} className="post-thread-item-skeleton">
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

export default ThreadSkeleton;
