import { useState, useEffect } from "react";
import PostsPageView from "@pages/Posts/PostsPageView";
import { allDummyPosts, postCategories } from "@/dummydata/dummyPosts";
import Header from "@components/Header/Header";
import Footer from "@components/Footer/Footer";
import { extractFirstImage } from "@/utils/extractFirstImage";

const POSTS_PER_PAGE = 6;

function PostsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "thread">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTag, setSelectedTag] = useState("");
  const [activeTab, setActiveTab] = useState<"posts" | "tags">("posts");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredPosts = allDummyPosts
    .filter(
      (post) =>
        selectedCategory === "all" ||
        post.category === selectedCategory ||
        post.category?.startsWith(selectedCategory + "/"),
    )
    .filter((post) => selectedTag === "" || post.tags.includes(selectedTag));

  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts
    .slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE)
    .map((post) => ({
      ...post,
      thumbnail: post.thumbnail ?? extractFirstImage(post.content),
    }));

  const allTags = Array.from(
    new Set(allDummyPosts.flatMap((post) => post.tags)),
  );

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    setActiveTab("posts");
    setCurrentPage(1);
  };

  const handleTagChange = (tag: string) => {
    setSelectedTag((prev) => (prev === tag ? "" : tag));
    setActiveTab("posts");
    setCurrentPage(1);
  };

  return (
    <>
      <Header />
      <PostsPageView
        isLoading={isLoading}
        posts={paginatedPosts}
        categories={postCategories}
        allTags={allTags}
        viewMode={viewMode}
        currentPage={currentPage}
        totalPages={totalPages}
        totalPosts={totalPosts}
        selectedCategory={selectedCategory}
        selectedTag={selectedTag}
        activeTab={activeTab}
        onViewModeChange={setViewMode}
        onPageChange={setCurrentPage}
        onCategoryChange={handleCategoryChange}
        onTagChange={handleTagChange}
        onTabChange={setActiveTab}
      />
      <Footer />
    </>
  );
}

export default PostsPage;
