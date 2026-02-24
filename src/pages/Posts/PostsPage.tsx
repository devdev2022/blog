import { useState } from 'react';
import PostsPageView from '@pages/Posts/PostsPageView';
import { allDummyPosts, postCategories } from '@/dummydata/dummyPosts';
import Header from '@components/Header/Header';
import Footer from '@components/Footer/Footer';

const POSTS_PER_PAGE = 6;

function PostsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'thread'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState<'posts' | 'tags'>('posts');

  const filteredPosts =
    selectedCategory === 'all'
      ? allDummyPosts
      : allDummyPosts.filter(
          (post) =>
            post.category === selectedCategory ||
            post.category?.startsWith(selectedCategory + '/'),
        );

  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE,
  );

  const allTags = Array.from(new Set(allDummyPosts.flatMap((post) => post.tags)));

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    setCurrentPage(1);
  };

  return (
    <>
      <Header />
      <PostsPageView
        posts={paginatedPosts}
        categories={postCategories}
        allTags={allTags}
        viewMode={viewMode}
        currentPage={currentPage}
        totalPages={totalPages}
        totalPosts={totalPosts}
        selectedCategory={selectedCategory}
        activeTab={activeTab}
        onViewModeChange={setViewMode}
        onPageChange={setCurrentPage}
        onCategoryChange={handleCategoryChange}
        onTabChange={setActiveTab}
      />
      <Footer />
    </>
  );
}

export default PostsPage;
