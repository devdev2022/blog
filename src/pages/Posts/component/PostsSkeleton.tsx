import GridSkeleton from "@/pages/Posts/component/GridSkeleton";

// 포스트 목록 라우트 진입(청크 로딩) fallback. 페이지 셸 + 그리드 스켈레톤.
function PostsSkeleton() {
  return (
    <main className="posts-main">
      <div className="posts-layout">
        <section className="posts-content">
          <div className="posts-header">
            <div className="skeleton skeleton-posts-count" />
          </div>
          <GridSkeleton />
        </section>
      </div>
    </main>
  );
}

export default PostsSkeleton;
