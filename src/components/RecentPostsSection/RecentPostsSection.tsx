import type { Post } from '@/types/post';
import PostCard from '@components/PostCard/PostCard';

interface RecentPostsSectionProps {
  posts: Post[];
}

function RecentPostsSection({ posts }: RecentPostsSectionProps) {
  return (
    <section className="recent-posts-section">
      <div className="section-header">
        <h2 className="section-title">최근 포스트</h2>
        <a href="/posts" className="section-link">
          전체 보기 →
        </a>
      </div>
      <div className="posts-grid">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      <div className="posts-more-btn-wrap">
        <a href="/posts" className="posts-more-btn">
          모든 포스트 보기
        </a>
      </div>
    </section>
  );
}

export default RecentPostsSection;
