import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { Post, PostCategory } from "@/types/post";
import CommentSection from "@/components/CommentSection/CommentSection";

const CATEGORY_LABEL: Record<string, string> = {
  "frontend/react": "React",
  "frontend/web": "웹",
  frontend: "프론트엔드",
  cs: "CS지식",
  database: "데이터베이스",
};

// 더미 방문자 통계
const VISITOR_STATS = { total: 12847, today: 243, yesterday: 891 };

/* ---- 스켈레톤 ---- */
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

/* ---- 사이드바 카테고리 트리 ---- */
function SidebarCategoryTree({
  categories,
  onNavigate,
}: {
  categories: PostCategory[];
  onNavigate: () => void;
}) {
  return (
    <ul className="sidebar-cat-list">
      {categories.map((cat) => (
        <li key={cat.slug}>
          <button className="sidebar-cat-btn" onClick={onNavigate}>
            <span className="sidebar-cat-name">{cat.name}</span>
            {cat.count !== undefined && (
              <span className="sidebar-cat-count">{cat.count}</span>
            )}
          </button>
          {cat.children && cat.children.length > 0 && (
            <ul className="sidebar-cat-children">
              {cat.children.map((child) => (
                <li key={child.slug}>
                  <button
                    className="sidebar-cat-btn child"
                    onClick={onNavigate}
                  >
                    <span className="sidebar-cat-name">{child.name}</span>
                    {child.count !== undefined && (
                      <span className="sidebar-cat-count">{child.count}</span>
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

/* ---- 수정/삭제 메뉴 ---- */
function PostActionMenu({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="post-action-menu" ref={menuRef}>
      <button
        className="post-action-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-label="게시글 관리"
      >
        <span className="post-action-dot" />
        <span className="post-action-dot" />
        <span className="post-action-dot" />
      </button>
      {open && (
        <div className="post-action-dropdown">
          <button
            className="post-action-item"
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
          >
            수정
          </button>
          <button
            className="post-action-item post-action-item--delete"
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
          >
            삭제
          </button>
        </div>
      )}
    </div>
  );
}

interface PostDetailPageViewProps {
  isLoading: boolean;
  post: Post | null;
  prevPost: Post | null;
  nextPost: Post | null;
  recentPosts: Post[];
  categories: PostCategory[];
  isLoggedIn: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

function PostDetailPageView({
  isLoading,
  post,
  prevPost,
  nextPost,
  recentPosts,
  categories,
  isLoggedIn,
  onEdit,
  onDelete,
}: PostDetailPageViewProps) {
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (isLoading) return <PostDetailSkeleton />;
  if (!post) return null;

  const handleDeleteClick = () => setShowDeleteConfirm(true);
  const handleDeleteCancel = () => setShowDeleteConfirm(false);
  const handleDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    onDelete?.();
  };

  const categoryLabel = post.category
    ? (CATEGORY_LABEL[post.category] ?? post.category)
    : null;

  return (
    <main className="post-detail-main">
      {showDeleteConfirm && (
        <div className="comment-modal-overlay" onClick={handleDeleteCancel}>
          <div className="comment-modal" onClick={(e) => e.stopPropagation()}>
            <p className="comment-modal-title">게시글 삭제</p>
            <p className="comment-modal-msg">삭제 하시겠습니까?</p>
            <div className="comment-form-actions">
              <button
                type="button"
                className="comment-btn-cancel"
                onClick={handleDeleteCancel}
              >
                취소
              </button>
              <button
                type="button"
                className="comment-btn-danger"
                onClick={handleDeleteConfirm}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ===== 히어로 (텍스트 전용) ===== */}
      <div className="post-detail-hero-text">
        <nav className="post-detail-breadcrumb">
          <button className="breadcrumb-btn" onClick={() => navigate("/")}>
            홈
          </button>
          <span className="breadcrumb-sep">›</span>
          <button className="breadcrumb-btn" onClick={() => navigate("/posts")}>
            포스트
          </button>
          {categoryLabel && (
            <>
              <span className="breadcrumb-sep">›</span>
              <span className="breadcrumb-current">{categoryLabel}</span>
            </>
          )}
        </nav>
        <h1 className="post-hero-title">{post.title}</h1>
      </div>

      {/* ===== 메타 바 ===== */}
      <div className="post-detail-meta-bar">
        <div className="post-detail-meta-right">
          <span className="post-detail-date">{post.date}</span>
          <span className="meta-dot" />
          <span className="post-detail-reading">{post.readingTime}분 읽기</span>
          {isLoggedIn && (
            <PostActionMenu
              onEdit={onEdit ?? (() => {})}
              onDelete={handleDeleteClick}
            />
          )}
        </div>
      </div>

      {/* ===== 바디: 본문 + 사이드바 ===== */}
      <div className="post-detail-layout">
        {/* 본문 */}
        <article className="post-detail-content">
          {post.content ? (
            <div
              className="post-content-renderer"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          ) : (
            <div className="post-content-empty">
              <p>본문 내용이 준비 중입니다.</p>
              <p className="post-content-excerpt">{post.excerpt}</p>
            </div>
          )}

          {/* 태그 섹션 */}
          <div className="post-content-tags-section">
            <p className="post-content-tags-title">태그</p>
            <div className="post-content-tags">
              {post.tags.map((tag) => (
                <button
                  key={tag}
                  className="post-content-tag-pill"
                  onClick={() => navigate(`/tags/${encodeURIComponent(tag)}`)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </article>

        {/* 사이드바 */}
        <aside className="post-detail-sidebar">
          <div className="sidebar-sticky">
            {/* 분류 */}
            <div className="sidebar-widget">
              <p className="sidebar-widget-title">분류</p>
              <SidebarCategoryTree
                categories={categories}
                onNavigate={() => navigate("/posts")}
              />
            </div>

            {/* 최근글 */}
            {recentPosts.length > 0 && (
              <div className="sidebar-widget">
                <p className="sidebar-widget-title">최근글</p>
                <ul className="sidebar-recent-list">
                  {recentPosts.map((rp) => (
                    <li key={rp.id}>
                      <button
                        className="sidebar-recent-item"
                        onClick={() => navigate(`/posts/${rp.id}`)}
                      >
                        <p className="sidebar-recent-title">{rp.title}</p>
                        <span className="sidebar-recent-date">{rp.date}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 방문자 통계 */}
            {/* <div className="sidebar-widget visitor-widget">
              <p className="sidebar-widget-title">전체 방문자</p>
              <div className="visitor-total">
                <span className="visitor-total-count">
                  {VISITOR_STATS.total.toLocaleString()}
                </span>
              </div>
              <div className="visitor-today-yesterday">
                <div className="visitor-stat">
                  <span className="visitor-stat-label">Today</span>
                  <span className="visitor-stat-value">
                    {VISITOR_STATS.today.toLocaleString()}
                  </span>
                </div>
                <div className="visitor-stat">
                  <span className="visitor-stat-label">Yesterday</span>
                  <span className="visitor-stat-value">
                    {VISITOR_STATS.yesterday.toLocaleString()}
                  </span>
                </div>
              </div>
            </div> */}
          </div>
        </aside>
      </div>

      {/* ===== 이전글 / 다음글 ===== */}
      {(prevPost || nextPost) && (
        <nav className="post-detail-nav">
          {prevPost ? (
            <button
              className="post-nav-card post-nav-prev"
              onClick={() => navigate(`/posts/${prevPost.id}`)}
            >
              <span className="post-nav-direction">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M9 2L4 7L9 12"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                이전 글
              </span>
              <span className="post-nav-title">{prevPost.title}</span>
            </button>
          ) : (
            <div />
          )}

          {nextPost ? (
            <button
              className="post-nav-card post-nav-next"
              onClick={() => navigate(`/posts/${nextPost.id}`)}
            >
              <span className="post-nav-direction">
                다음 글
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M5 2L10 7L5 12"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="post-nav-title">{nextPost.title}</span>
            </button>
          ) : (
            <div />
          )}
        </nav>
      )}

      {/* ===== 댓글 섹션 ===== */}
      <CommentSection postSlug={post.id} />
    </main>
  );
}

export default PostDetailPageView;
