import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { usePostDetail, usePostCategories, useDeletePost } from "@/query/posts";
import { useAuth } from "@/contexts/AuthContext";
import PostDetailPageView from "./PostDetailPageView";
import { toPost, toPostCategories } from "@/utils/postMapper";
import { applyCodeHighlight } from "@/utils/highlightCode";

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

  const rawPost = data ? toPost(data.post) : null;
  const post = rawPost
    ? { ...rawPost, content: rawPost.content ? applyCodeHighlight(rawPost.content) : rawPost.content }
    : null;
  const prevPost = data?.prevPost ? toPost(data.prevPost) : null;
  const nextPost = data?.nextPost ? toPost(data.nextPost) : null;
  const recentPosts = data?.recentPosts.map(toPost) ?? [];
  const categories = categoryData ? toPostCategories(categoryData) : [];

  return (
    <>
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
    </>
  );
}

export default PostDetailPage;
