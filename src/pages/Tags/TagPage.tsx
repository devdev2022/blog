import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TagPageView from '@pages/Tags/TagPageView';
import Header from '@components/Header/Header';
import Footer from '@components/Footer/Footer';
import { allDummyPosts } from '@/dummydata/dummyPosts';
import { extractFirstImage } from '@/utils/extractFirstImage';

const POSTS_PER_PAGE = 6;

function TagPage() {
  const { tag } = useParams<{ tag: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'thread'>('thread');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [tag]);

  useEffect(() => {
    setCurrentPage(1);
  }, [tag]);

  if (!tag) {
    navigate('/posts');
    return null;
  }

  const decodedTag = decodeURIComponent(tag);

  const filteredPosts = allDummyPosts
    .filter((post) => post.tags.includes(decodedTag))
    .map((post) => ({
      ...post,
      thumbnail: post.thumbnail ?? extractFirstImage(post.content),
    }));

  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE,
  );

  return (
    <>
      <Header />
      <TagPageView
        isLoading={isLoading}
        tag={decodedTag}
        posts={paginatedPosts}
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
