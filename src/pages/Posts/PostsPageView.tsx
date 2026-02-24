import type { Post, PostCategory } from "@/types/post";
import { getPaginationItems } from "@/utils/getPaginationItems";

interface PostsPageViewProps {
  posts: Post[];
  categories: PostCategory[];
  allTags: string[];
  viewMode: "grid" | "thread";
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  selectedCategory: string;
  activeTab: "posts" | "tags";
  onViewModeChange: (mode: "grid" | "thread") => void;
  onPageChange: (page: number) => void;
  onCategoryChange: (slug: string) => void;
  onTabChange: (tab: "posts" | "tags") => void;
}


function CategoryTree({
  categories,
  selectedCategory,
  onCategoryChange,
}: {
  categories: PostCategory[];
  selectedCategory: string;
  onCategoryChange: (slug: string) => void;
}) {
  return (
    <ul className="category-tree">
      {categories.map((cat) => (
        <li key={cat.slug} className="category-tree-item">
          <button
            className={`category-tree-btn${selectedCategory === cat.slug ? " active" : ""}`}
            onClick={() => onCategoryChange(cat.slug)}
          >
            {cat.name}
            {cat.count !== undefined && (
              <span className="category-tree-count">{cat.count}</span>
            )}
          </button>
          {cat.children && cat.children.length > 0 && (
            <ul className="category-tree-children">
              {cat.children.map((child) => (
                <li key={child.slug} className="category-tree-item">
                  <button
                    className={`category-tree-btn child${selectedCategory === child.slug ? " active" : ""}`}
                    onClick={() => onCategoryChange(child.slug)}
                  >
                    {child.name}
                    {child.count !== undefined && (
                      <span className="category-tree-count">{child.count}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}

function PostsPageView({
  posts,
  categories,
  allTags,
  viewMode,
  currentPage,
  totalPages,
  totalPosts,
  selectedCategory,
  activeTab,
  onViewModeChange,
  onPageChange,
  onCategoryChange,
  onTabChange,
}: PostsPageViewProps) {
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
          </div>

          {activeTab === "tags" ? (
            /* 태그 탭 */
            <div className="tags-cloud">
              {allTags.map((tag) => (
                <button key={tag} className="tag-pill">
                  {tag}
                </button>
              ))}
            </div>
          ) : (
            <>
              {/* 헤더: 전체보기 + 뷰 전환 */}
              <div className="posts-header">
                <span className="posts-count-label">
                  {selectedCategoryName} <strong>{totalPosts}</strong>
                </span>
                <div className="posts-view-toggle">
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
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
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
                <div className="posts-empty">포스트가 없습니다.</div>
              ) : viewMode === "grid" ? (
                <div className="posts-grid">
                  {posts.map((post) => (
                    <article key={post.id} className="post-grid-card">
                      <div className="post-grid-thumbnail">
                        {post.thumbnail ? (
                          <img src={post.thumbnail} alt={post.title} />
                        ) : (
                          <div className="post-grid-thumbnail-placeholder" />
                        )}
                      </div>
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
                <div className="posts-thread">
                  {posts.map((post) => (
                    <article key={post.id} className="post-thread-item">
                      <div className="post-thread-thumbnail">
                        {post.thumbnail ? (
                          <img src={post.thumbnail} alt={post.title} />
                        ) : (
                          <div className="post-thread-thumbnail-placeholder" />
                        )}
                      </div>
                      <div className="post-thread-body">
                        <span className="post-thread-tag">{post.tag}</span>
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
                      <path
                        d="M6 1L1 6L6 11"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {paginationItems.map((item, idx) =>
                    item === "..." ? (
                      <span
                        key={`ellipsis-${idx}`}
                        className="pagination-ellipsis"
                      >
                        …
                      </span>
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
                    onClick={() =>
                      onPageChange(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    aria-label="다음 페이지"
                  >
                    <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                      <path
                        d="M1 1L6 6L1 11"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
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
            onCategoryChange={onCategoryChange}
          />
        </aside>
      </div>
    </main>
  );
}

export default PostsPageView;
