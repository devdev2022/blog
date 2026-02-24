import { dummyPosts, techCategories } from '@/dummydata/dummyPosts';
import HomePageView from './HomePageView';

function HomePage() {
  const recentPosts = dummyPosts.slice(0, 3);

  return (
    <HomePageView
      recentPosts={recentPosts}
      techCategories={techCategories}
    />
  );
}

export default HomePage;
