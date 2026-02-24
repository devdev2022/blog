import type { RouteMetaData } from '@/types/Routes';
import HomePage from '@pages/Home/HomePage';
import PostsPage from '@pages/Posts/PostsPage';

export const PageRouters: RouteMetaData[] = [
  {
    path: '/',
    element: HomePage,
    id: '00',
    linkName: '홈',
  },
  {
    path: '/posts',
    element: PostsPage,
    id: '01',
    linkName: '포스트',
  },
];
