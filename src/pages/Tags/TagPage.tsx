import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TagPageView from '@pages/Tags/TagPageView';
import Header from '@components/Header/Header';
import Footer from '@components/Footer/Footer';
import { usePostList } from '@/query/posts';
import { extractFirstImage } from '@/utils/extractFirstImage';
import type { Post } from '@/types/post';
import type { PostListItem } from '@/api/posts/posts';

const POSTS_PER_PAGE = 6;

function toReadingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, '');
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function toExcerpt(html: string): string {
  const text = html.replace(/<[^>]+>/g, '').trim();
  return text.length > 120 ? text.slice(0, 120) + '...' : text;
}

function toPost(item: PostListItem): Post {
  const mainName = item.subCategory?.mainCategory?.name ?? item.mainCategory?.name ?? '';
  const subName = item.subCategory?.name ?? '';
  const category = mainName && subName ? `${mainName}/${subName}` : mainName;
  const tags = item.tags.map((t) => t.name);
  const thumbnail =
    item.media.find((m) => m.type === 'image')?.url ?? extractFirstImage(item.content);

  return {
    id: item.id.replaceAll('-', ''),
    title: item.title,
    excerpt: toExcerpt(item.content),
    tag: tags[0] ?? '',
    tags,
    date: item.createdAt.slice(0, 10),
    readingTime: toReadingTime(item.content),
    thumbnail,
    category,
    content: item.content,
  };
}

function TagPage() {
  const { tag } = useParams<{ tag: string }>();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'thread'>('thread');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [tag]);

  if (!tag) {
    navigate('/posts');
    return null;
  }

  const decodedTag = decodeURIComponent(tag);

  const { data, isLoading } = usePostList({
    page: currentPage,
    limit: POSTS_PER_PAGE,
    tag: decodedTag,
  });

  const posts: Post[] = (data?.posts ?? []).map(toPost);
  const totalPosts = data?.total ?? 0;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  return (
    <>
      <Header />
      <TagPageView
        isLoading={isLoading}
        tag={decodedTag}
        posts={posts}
        viewMode={viewMode}
        currentPage={currentPage}
        totalPages={totalPages}
        totalPosts={totalPosts}
        onViewModeChange={setViewMode}
        onPageChange={setCurrentPage}
      />
      <Footer />
    </>
  );
}

export default TagPage;
