import { useQuery } from "@tanstack/react-query";
import { fetchMainRecentPosts, fetchMainTechStacks } from "@/api/main/main";
import { calcReadingTime } from "@/utils/calcReadingTime";
import type { Post } from "@/types/post";
import type { PostListItem } from "@/api/posts/posts";
import HomePageView from "./HomePageView";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function toPost(item: PostListItem): Post {
  const plainText = stripHtml(item.content);
  return {
    id: item.id,
    title: item.title,
    excerpt: plainText.slice(0, 200),
    tag: item.tags[0]?.name ?? item.mainCategory?.name ?? "",
    tags: item.tags.map((t) => t.name),
    date: item.createdAt.slice(0, 10),
    readingTime: calcReadingTime(plainText),
  };
}

function HomePage() {
  const { data: recentPostItems = [], isLoading: postsLoading } = useQuery({
    queryKey: ["main", "recent-posts"],
    queryFn: fetchMainRecentPosts,
  });

  const { data: techStacks = [], isLoading: techLoading } = useQuery({
    queryKey: ["main", "tech-stacks"],
    queryFn: fetchMainTechStacks,
  });

  const recentPosts: Post[] = recentPostItems.map(toPost);
  const isLoading = postsLoading || techLoading;

  return (
    <HomePageView
      recentPosts={recentPosts}
      techStacks={techStacks}
      isLoading={isLoading}
    />
  );
}

export default HomePage;
