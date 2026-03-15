import type { Post } from "@/types/post";
import PostCard from "@components/PostCard/PostCard";

interface RecentPostsSectionProps {
  posts: Post[];
}

function RecentPostsSection({ posts }: RecentPostsSectionProps) {
  return (
    <section className="recent-posts-section">
      <div className="section-header">
        <h2 className="section-title">최근 포스트</h2>
        {posts.length > 0 && (
          <a href="/posts" className="section-link">
            전체 보기 →
          </a>
        )}
      </div>
      {posts.length === 0 ? (
        <div className="recent-posts-empty">
          <div className="recent-posts-empty-icon">
            <svg
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="8"
                y="10"
                width="32"
                height="28"
                rx="3"
                stroke="currentColor"
                strokeWidth="2.5"
              />
              <path
                d="M16 20h16M16 26h10"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <p className="recent-posts-empty-title">
            아직 작성된 포스트가 없습니다
          </p>
          <a href="/posts" className="recent-posts-empty-link">
            포스트 페이지로 이동
          </a>
        </div>
      ) : (
        <>
          <div className="recent-posts-grid">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          <div className="posts-more-btn-wrap">
            <a href="/posts" className="posts-more-btn">
              모든 포스트 보기
            </a>
          </div>
        </>
      )}
    </section>
  );
}

export default RecentPostsSection;
