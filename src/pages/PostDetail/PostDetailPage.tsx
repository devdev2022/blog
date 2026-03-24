import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { usePostDetail, usePostCategories, useDeletePost } from "@/query/posts";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import PostDetailPageView from "./PostDetailPageView";
import { extractFirstImage } from "@/utils/extractFirstImage";
import type { Post, PostListItem } from "@/types/post";
import { toExcerpt, toReadingTime, toPostCategories } from "@/utils/postMapper";

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

function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hash } = useLocation();
  const { accessToken } = useAuth();

  const { data, isLoading } = usePostDetail(id ?? "");
  const { data: categoryData } = usePostCategories();
  const { mutateAsync: doDeletePost } = useDeletePost();

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
        isLoggedIn={!!accessToken}
        onEdit={() => navigate(`/posts/${id}/edit`)}
        onDelete={async () => {
          await doDeletePost(id!);
          navigate("/posts");
        }}
      />
      <Footer />
    </>
  );
}

export default PostDetailPage;
