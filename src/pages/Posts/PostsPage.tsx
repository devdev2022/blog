import { useState } from "react";
import PostsPageView from "@pages/Posts/PostsPageView";
import Header from "@components/Header/Header";
import Footer from "@components/Footer/Footer";
import { extractFirstImage } from "@/utils/extractFirstImage";
import { usePostList, usePostCategories, usePostTags } from "@/query/posts";
import type { Post, PostCategory } from "@/types/post";
import type { PostListItem, CategoryItem } from "@/api/posts/posts";

const POSTS_PER_PAGE = 6;

function toReadingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, "");
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function toExcerpt(html: string): string {
  const text = html.replace(/<[^>]+>/g, "").trim();
  return text.length > 120 ? text.slice(0, 120) + "..." : text;
}

function toPost(item: PostListItem): Post {
  const mainName = item.subCategory?.mainCategory?.name ?? item.mainCategory?.name ?? "";
  const subName = item.subCategory?.name ?? "";
  const category = mainName && subName ? `${mainName}/${subName}` : mainName;
  const tags = item.tags.map((t) => t.name);
  const thumbnail =
    item.media.find((m) => m.type === "image")?.url ??
    extractFirstImage(item.content);

  return {
    id: item.id.replaceAll("-", ""),
    title: item.title,
    excerpt: toExcerpt(item.content),
    tag: tags[0] ?? "",
    tags,
    date: item.createdAt.slice(0, 10),
    readingTime: toReadingTime(item.content),
    thumbnail,
    category,
    content: item.content,
  };
}

function toPostCategories(categories: CategoryItem[]): PostCategory[] {
  const all: PostCategory = {
    name: "전체 보기",
    slug: "all",
    count: categories.reduce(
      (sum, c) =>
        sum + c.postCount + c.subCategories.reduce((s, sc) => s + sc.postCount, 0),
      0,
    ),
  };

  const children = categories.map((c) => ({
    name: c.name,
    slug: c.slug,
    count: c.postCount + c.subCategories.reduce((s, sc) => s + sc.postCount, 0),
    children: c.subCategories.map((sc) => ({
      name: sc.name,
      slug: sc.slug,
      count: sc.postCount,
    })),
  }));

  return [all, ...children];
}

function PostsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "thread">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTag, setSelectedTag] = useState("");
  const [activeTab, setActiveTab] = useState<"posts" | "tags">("posts");

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
