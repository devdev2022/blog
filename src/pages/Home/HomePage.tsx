import { useState, useEffect } from "react";
import { dummyPosts, techCategories } from "@/dummydata/dummyPosts";
import HomePageView from "./HomePageView";

function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const recentPosts = dummyPosts.slice(0, 3);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <HomePageView
      recentPosts={recentPosts}
      techCategories={techCategories}
      isLoading={isLoading}
    />
  );
}

export default HomePage;
