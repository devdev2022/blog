import { useQuery } from "@tanstack/react-query";
import { fetchMainRecentPosts, fetchMainTechStacks } from "@/api/main/main";
import { toPost } from "@/utils/postMapper";
import HomePageView from "./HomePageView";

function HomePage() {
  const { data: recentPostItems = [], isLoading: postsLoading } = useQuery({
    queryKey: ["main", "recent-posts"],
    queryFn: fetchMainRecentPosts,
  });

  const { data: techStacks = [], isLoading: techLoading } = useQuery({
    queryKey: ["main", "tech-stacks"],
    queryFn: fetchMainTechStacks,
  });

  const recentPosts = recentPostItems.map(toPost);
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
