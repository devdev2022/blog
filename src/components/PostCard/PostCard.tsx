import type { Post } from '@/types/post';

interface PostCardProps {
  post: Post;
}

function PostCard({ post }: PostCardProps) {
  return (
    <article className="post-card">
      <span className="post-card-tag">{post.tag}</span>
      <h3 className="post-card-title">{post.title}</h3>
      <p className="post-card-excerpt">{post.excerpt}</p>
      <div className="post-card-meta">
        <span>{post.date}</span>
        <span>읽기 {post.readingTime}분</span>
      </div>
    </article>
  );
}

export default PostCard;
