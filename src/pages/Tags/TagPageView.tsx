import { useNavigate } from "react-router-dom";
import type { Post } from "@/types/post";
import TagPageSkeleton from "@/pages/Tags/component/TagPageSkeleton";
import PostThumbnail from "@/components/PostThumbnail/PostThumbnail";
import Pagination from "@/components/Pagination/Pagination";

interface TagPageViewProps {
  isLoading: boolean;
  tag: string;
  posts: Post[];
  viewMode: "grid" | "thread";
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  onViewModeChange: (mode: "grid" | "thread") => void;
  onPageChange: (page: number) => void;
}

function TagPageView({
  isLoading,
  tag,
  posts,
  viewMode,
  currentPage,
  totalPages,
  totalPosts,
  onViewModeChange,
  onPageChange,
}: TagPageViewProps) {
  const navigate = useNavigate();

  if (isLoading) return <TagPageSkeleton viewMode={viewMode} />;

  return (
    <main className="tag-page-main">
      {/* 헤딩 + 뷰 전환 */}
      <div className="tag-page-header">
        <h2 className="tag-page-heading">
          <span className="tag-page-heading-hash">#</span>
          <span className="tag-page-heading-name">{tag}</span>
          <span className="tag-page-heading-count">{totalPosts}</span>
        </h2>
        <div className="posts-view-toggle">
          <button
            className={`view-toggle-btn${viewMode === "grid" ? " active" : ""}`}
            onClick={() => onViewModeChange("grid")}
            title="그리드 뷰"
            aria-label="그리드 뷰"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect
                x="2"
                y="2"
                width="8"
                height="8"
                rx="1.5"
                fill="currentColor"
              />
              <rect
                x="12"
                y="2"
                width="8"
                height="8"
                rx="1.5"
                fill="currentColor"
              />
              <rect
                x="2"
                y="12"
                width="8"
                height="8"
                rx="1.5"
                fill="currentColor"
              />
              <rect
                x="12"
                y="12"
                width="8"
                height="8"
                rx="1.5"
                fill="currentColor"
              />
            </svg>
          </button>
          <button
            className={`view-toggle-btn${viewMode === "thread" ? " active" : ""}`}
            onClick={() => onViewModeChange("thread")}
            title="스레드 뷰"
            aria-label="스레드 뷰"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect
                x="2"
                y="2"
                width="5"
                height="5"
                rx="1"
                fill="currentColor"
              />
              <rect
                x="9"
                y="3.5"
                width="11"
                height="2"
                rx="1"
                fill="currentColor"
              />
              <rect
                x="2"
                y="8.5"
                width="5"
                height="5"
                rx="1"
                fill="currentColor"
              />
              <rect
                x="9"
                y="10"
                width="11"
                height="2"
                rx="1"
                fill="currentColor"
              />
              <rect
                x="2"
                y="15"
                width="5"
                height="5"
                rx="1"
                fill="currentColor"
              />
              <rect
                x="9"
                y="16.5"
                width="11"
                height="2"
                rx="1"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* 포스트 목록 */}
      {posts.length === 0 ? (
        <p className="tag-posts-empty">포스트가 없습니다.</p>
      ) : viewMode === "grid" ? (
        <div className="posts-grid">
          {posts.map((post) => (
            <article
              key={post.id}
              className="post-grid-card"
              onClick={() => navigate(`/posts/${post.id}`)}
              style={{ cursor: "pointer" }}
            >
              <PostThumbnail
                thumbnail={post.thumbnail}
                title={post.title}
                className="post-grid-thumbnail"
                placeholderClassName="post-grid-thumbnail-placeholder"
              />
              <div className="post-grid-body">
                <span className="post-grid-tag">{post.tag}</span>
                <h3 className="post-grid-title">{post.title}</h3>
                <p className="post-grid-excerpt">{post.excerpt}</p>
                <div className="post-grid-meta">
                  <span>{post.date}</span>
                  <span>읽기 {post.readingTime}분</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="tag-post-list">
          {posts.map((post) => (
            <article
              key={post.id}
              className="tag-post-item"
              onClick={() => navigate(`/posts/${post.id}`)}
            >
              <PostThumbnail
                thumbnail={post.thumbnail}
                title={post.title}
                className="tag-post-thumb"
                placeholderClassName="tag-post-thumb-placeholder"
              />
              <div className="tag-post-body">
                <h3 className="tag-post-title">{post.title}</h3>
                <p className="tag-post-excerpt">{post.excerpt}</p>
                <span className="tag-post-date">{post.date}</span>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* 페이지네이션 */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </main>
  );
}

export default TagPageView;
