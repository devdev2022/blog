import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TagPageView from '@pages/Tags/TagPageView';
import Header from '@components/Header/Header';
import Footer from '@components/Footer/Footer';
import { usePostList } from '@/query/posts';
import type { Post } from '@/types/post';
import { toPost } from '@/utils/postMapper';

const POSTS_PER_PAGE = 6;

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
