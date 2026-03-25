import { useState } from "react";
import PostsPageView from "@pages/Posts/PostsPageView";
import Header from "@components/Header/Header";
import Footer from "@components/Footer/Footer";
import { usePostList, usePostCategories, usePostTags } from "@/query/posts";
import { toPost, toPostCategories } from "@/utils/postMapper";

const POSTS_PER_PAGE = 6;

function PostsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "thread">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTag, setSelectedTag] = useState("");
  const [activeTab, setActiveTab] = useState<"posts" | "tags">("posts");
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false);

  const [mainCategory, subCategory] =
    selectedCategory === "all" ? [] : selectedCategory.split("/");

  const { data: postData, isLoading: postsLoading } = usePostList({
    page: currentPage,
    limit: POSTS_PER_PAGE,
    mainCategory: mainCategory || undefined,
    subCategory: subCategory || undefined,
    tag: selectedTag || undefined,
  });

  const { data: categoryData, isLoading: categoriesLoading } =
    usePostCategories();

  const { data: tagsData } = usePostTags();

  const isLoading = postsLoading || categoriesLoading;

  const posts = (postData?.posts ?? []).map(toPost);
  const totalPosts = postData?.total ?? 0;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  const categories = categoryData ? toPostCategories(categoryData) : [];

  const allTags = tagsData ?? [];

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    setActiveTab("posts");
    setCurrentPage(1);
    setCategoryDrawerOpen(false);
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
        posts={posts}
        categories={categories}
        allTags={allTags}
        viewMode={viewMode}
        currentPage={currentPage}
        totalPages={totalPages}
        totalPosts={totalPosts}
        selectedCategory={selectedCategory}
        selectedTag={selectedTag}
        activeTab={activeTab}
        categoryDrawerOpen={categoryDrawerOpen}
        onViewModeChange={setViewMode}
        onPageChange={setCurrentPage}
        onCategoryChange={handleCategoryChange}
        onTagChange={handleTagChange}
        onTabChange={setActiveTab}
        onCategoryDrawerToggle={() => setCategoryDrawerOpen((prev) => !prev)}
        onCategoryDrawerClose={() => setCategoryDrawerOpen(false)}
      />
      <Footer />
    </>
  );
}

export default PostsPage;
