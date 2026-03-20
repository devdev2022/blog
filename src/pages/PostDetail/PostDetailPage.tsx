import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { usePostDetail, usePostCategories } from "@/query/posts";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import PostDetailPageView from "./PostDetailPageView";
import { extractFirstImage } from "@/utils/extractFirstImage";
import type { Post, PostCategory, CategoryItem } from "@/types/post";
import type { PostListItem } from "@/api/posts/posts";

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
  const mainName =
    item.subCategory?.mainCategory?.name ?? item.mainCategory?.name ?? "";
  const subName = item.subCategory?.name ?? "";
  const category = mainName && subName ? `${mainName}/${subName}` : mainName;
  const tags = item.tags.map((t) => t.name);
  const thumbnail =
    item.media.find((m) => m.type === "image")?.url ??
    extractFirstImage(item.content);

  return {
    id: item.id,
    title: item.title,
    excerpt: toExcerpt(item.content),
    tag: tags[0] ?? "",
    tags,
    date: item.createdAt.toString().slice(0, 10),
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
        sum +
        c.postCount +
        c.subCategories.reduce((s, sc) => s + sc.postCount, 0),
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

function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hash } = useLocation();

  const { data, isLoading } = usePostDetail(id ?? "");
  const { data: categoryData } = usePostCategories();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (isLoading || !hash || !data) return;
    const el = document.querySelector(hash);
    if (el) {
      setTimeout(
        () => el.scrollIntoView({ behavior: "instant", block: "center" }),
        100,
      );
    }
  }, [isLoading, hash, data]);

  useEffect(() => {
    if (!isLoading && !data) {
      navigate("/posts");
    }
  }, [data, isLoading, navigate]);

  const post = data ? toPost(data.post) : null;
  const prevPost = data?.prevPost ? toPost(data.prevPost) : null;
  const nextPost = data?.nextPost ? toPost(data.nextPost) : null;
  const recentPosts = data?.recentPosts.map(toPost) ?? [];
  const categories = categoryData ? toPostCategories(categoryData) : [];

  return (
    <>
      <Header />
      <PostDetailPageView
        isLoading={isLoading}
        post={post}
        prevPost={prevPost}
        nextPost={nextPost}
        recentPosts={recentPosts}
        categories={categories}
        onEdit={() => navigate(`/posts/${id}/edit`)}
        onDelete={() => {}}
      />
      <Footer />
    </>
  );
}

export default PostDetailPage;
