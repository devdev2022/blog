import { useNavigate } from "react-router-dom";
import type { Post, PostCategory } from "@/types/post";
import { getPaginationItems } from "@/utils/getPaginationItems";
import GridSkeleton from "@/pages/Posts/component/GridSkeleton";
import ThreadSkeleton from "@/pages/Posts/component/ThreadSkeleton";
import CategoryTree from "@/pages/Posts/component/CategoryTree";

interface PostsPageViewProps {
  isLoading: boolean;
  posts: Post[];
  categories: PostCategory[];
  allTags: string[];
  viewMode: "grid" | "thread";
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  selectedCategory: string;
  selectedTag: string;
  activeTab: "posts" | "tags";
  categoryDrawerOpen: boolean;
  onViewModeChange: (mode: "grid" | "thread") => void;
  onPageChange: (page: number) => void;
  onCategoryChange: (slug: string) => void;
  onTagChange: (tag: string) => void;
  onTabChange: (tab: "posts" | "tags") => void;
  onCategoryDrawerToggle: () => void;
  onCategoryDrawerClose: () => void;
}


function PostsPageView({
  isLoading,
  posts,
  categories,
  allTags,
  viewMode,
  currentPage,
  totalPages,
  totalPosts,
  selectedCategory,
  selectedTag,
  activeTab,
  categoryDrawerOpen,
  onViewModeChange,
  onPageChange,
  onCategoryChange,
  onTagChange,
  onTabChange,
  onCategoryDrawerToggle,
  onCategoryDrawerClose,
}: PostsPageViewProps) {
  const navigate = useNavigate();
  const paginationItems = getPaginationItems(currentPage, totalPages);
  const selectedCategoryName =
    categories
      .flatMap((cat) => [cat, ...(cat.children ?? [])])
      .find((cat) => cat.slug === selectedCategory)?.name ?? "전체 보기";

  return (
    <main className="posts-main">

      <div className="posts-layout">
        {/* 콘텐츠 영역 */}
        <section className="posts-content">
          {/* 탭 */}
          <div className="posts-tabs">
            <button
              className={`posts-tab-btn${activeTab === "posts" ? " active" : ""}`}
              onClick={() => onTabChange("posts")}
            >
              글
            </button>
            <button
              className={`posts-tab-btn${activeTab === "tags" ? " active" : ""}`}
              onClick={() => onTabChange("tags")}
            >
              태그
            </button>
            {/* 모바일 카테고리 햄버거 버튼 */}
            <button
              className="posts-category-menu-btn"
              onClick={onCategoryDrawerToggle}
              aria-label="카테고리"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>

          {isLoading ? (
            <>
              <div className="posts-header">
                <div className="skeleton skeleton-posts-count" />
              </div>
              {viewMode === "grid" ? <GridSkeleton /> : <ThreadSkeleton />}
            </>
          ) : activeTab === "tags" ? (
            /* 태그 탭 */
            allTags.length === 0 ? (
              <div className="tags-empty">
                <div className="posts-empty-icon">
                  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 20a4 4 0 0 1 4-4h20l20 16-20 16H14a4 4 0 0 1-4-4V20z" stroke="currentColor" strokeWidth="2.5" />
                    <circle cx="20" cy="32" r="3" fill="currentColor" opacity="0.5" />
                  </svg>
                </div>
                <p className="posts-empty-title">태그가 없습니다</p>
                <p className="posts-empty-desc">아직 등록된 태그가 없어요.</p>
              </div>
            ) : (
              <div className="tags-cloud">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    className={`tag-pill${selectedTag === tag ? " active" : ""}`}
                    onClick={() => onTagChange(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )
          ) : (
            <>
              {/* 선택된 태그 필터 */}
              {selectedTag && (
                <div className="posts-tag-filter">
                  <span className="posts-tag-filter-chip">
                    #{selectedTag}
                    <button
                      className="posts-tag-filter-remove"
                      onClick={() => onTagChange(selectedTag)}
                      aria-label="태그 필터 해제"
                    >
                      ×
                    </button>
                  </span>
                </div>
              )}

              {/* 헤더: 전체보기 + 뷰 전환 */}
              <div className="posts-header">
                <span className="posts-count-label">
                  {selectedCategoryName} <strong>{totalPosts}</strong>
                </span>
                <div className="posts-view-toggle" style={{ visibility: totalPosts === 0 ? "hidden" : "visible" }}>
                  <button
                    className={`view-toggle-btn${viewMode === "grid" ? " active" : ""}`}
                    onClick={() => onViewModeChange("grid")}
                    title="그리드 뷰"
                    aria-label="그리드 뷰"
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect x="2" y="2" width="8" height="8" rx="1.5" fill="currentColor" />
                      <rect x="12" y="2" width="8" height="8" rx="1.5" fill="currentColor" />
                      <rect x="2" y="12" width="8" height="8" rx="1.5" fill="currentColor" />
                      <rect x="12" y="12" width="8" height="8" rx="1.5" fill="currentColor" />
                    </svg>
                  </button>
                  <button
                    className={`view-toggle-btn${viewMode === "thread" ? " active" : ""}`}
                    onClick={() => onViewModeChange("thread")}
                    title="스레드 뷰"
                    aria-label="스레드 뷰"
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect x="2" y="2" width="5" height="5" rx="1" fill="currentColor" />
                      <rect x="9" y="3.5" width="11" height="2" rx="1" fill="currentColor" />
                      <rect x="2" y="8.5" width="5" height="5" rx="1" fill="currentColor" />
                      <rect x="9" y="10" width="11" height="2" rx="1" fill="currentColor" />
                      <rect x="2" y="15" width="5" height="5" rx="1" fill="currentColor" />
                      <rect x="9" y="16.5" width="11" height="2" rx="1" fill="currentColor" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* 포스트 목록 */}
              {posts.length === 0 ? (
                <div className="posts-empty">
                  <div className="posts-empty-icon">
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="10" y="12" width="44" height="40" rx="4" stroke="currentColor" strokeWidth="2.5" />
                      <path d="M22 28h20M22 36h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                      <path d="M22 20h8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <p className="posts-empty-title">포스트가 없습니다</p>
                  <p className="posts-empty-desc">
                    이 카테고리에 아직 작성된 포스트가 없어요.
                  </p>
                </div>
              ) : viewMode === "grid" ? (
                <div className="posts-grid">
                  {posts.map((post) => (
                    <article
                      key={post.id}
                      className="post-grid-card"
                      onClick={() => navigate(`/posts/${post.id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="post-grid-thumbnail">
                        {post.thumbnail ? (
                          <img src={post.thumbnail} alt={post.title} />
                        ) : (
                          <div className="post-grid-thumbnail-placeholder" />
                        )}
                      </div>
                      <div className="post-grid-body">
                        {post.tag && <span className="post-grid-tag">{post.tag}</span>}
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
                <div className="posts-thread">
                  {posts.map((post) => (
                    <article
                      key={post.id}
                      className="post-thread-item"
                      onClick={() => navigate(`/posts/${post.id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="post-thread-thumbnail">
                        {post.thumbnail ? (
                          <img src={post.thumbnail} alt={post.title} />
                        ) : (
                          <div className="post-thread-thumbnail-placeholder" />
                        )}
                      </div>
                      <div className="post-thread-body">
                        {post.tag && <span className="post-thread-tag">{post.tag}</span>}
                        <h3 className="post-thread-title">{post.title}</h3>
                        <p className="post-thread-excerpt">{post.excerpt}</p>
                        <div className="post-thread-meta">
                          <span>{post.date}</span>
                          <span>읽기 {post.readingTime}분</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <nav className="posts-pagination">
                  <button
                    className="pagination-btn pagination-arrow"
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    aria-label="이전 페이지"
                  >
                    <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                      <path d="M6 1L1 6L6 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {paginationItems.map((item, idx) =>
                    item === "..." ? (
                      <span key={`ellipsis-${idx}`} className="pagination-ellipsis">…</span>
                    ) : (
                      <button
                        key={item}
                        className={`pagination-btn${currentPage === item ? " active" : ""}`}
                        onClick={() => onPageChange(item)}
                      >
                        {item}
                      </button>
                    ),
                  )}

                  <button
                    className="pagination-btn pagination-arrow"
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    aria-label="다음 페이지"
                  >
                    <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                      <path d="M1 1L6 6L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </nav>
              )}
            </>
          )}
        </section>

        {/* 사이드바 */}
        <aside className="posts-sidebar">
          <CategoryTree
            categories={categories}
            selectedCategory={selectedCategory}
            totalPosts={totalPosts}
            onCategoryChange={onCategoryChange}
          />
        </aside>
      </div>

      {/* 모바일 카테고리 드로어 */}
      {categoryDrawerOpen && (
        <div className="posts-drawer-overlay" onClick={onCategoryDrawerClose} />
      )}
      <div className={`posts-drawer${categoryDrawerOpen ? " open" : ""}`}>
        <div className="posts-drawer-header">
          <span className="posts-drawer-title">카테고리</span>
          <button
            className="posts-drawer-close"
            onClick={onCategoryDrawerClose}
            aria-label="닫기"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="posts-drawer-body">
          <CategoryTree
            categories={categories}
            selectedCategory={selectedCategory}
            totalPosts={totalPosts}
            onCategoryChange={onCategoryChange}
          />
        </div>
      </div>
    </main>
  );
}

export default PostsPageView;
