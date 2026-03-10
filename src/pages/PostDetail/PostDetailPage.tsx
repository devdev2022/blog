import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { allDummyPosts, postCategories } from '@/dummydata/dummyPosts';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import PostDetailPageView from './PostDetailPageView';

function PostDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const post = allDummyPosts.find((p) => p.slug === slug) ?? null;
  const postIndex = post ? allDummyPosts.findIndex((p) => p.slug === slug) : -1;
  const prevPost = postIndex > 0 ? allDummyPosts[postIndex - 1] : null;
  const nextPost = postIndex < allDummyPosts.length - 1 ? allDummyPosts[postIndex + 1] : null;
  const recentPosts = allDummyPosts.filter((p) => p.slug !== slug).slice(0, 5);

  useEffect(() => {
    setIsLoading(true);
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [slug]);

  useEffect(() => {
    if (!post && !isLoading) {
      navigate('/posts');
    }
  }, [post, isLoading, navigate]);

  if (!post && !isLoading) return null;

  return (
    <>
      <Header />
      <PostDetailPageView
        isLoading={isLoading}
        post={post}
        prevPost={prevPost}
        nextPost={nextPost}
        recentPosts={recentPosts}
        categories={postCategories}
      />
      <Footer />
    </>
  );
}

export default PostDetailPage;
