import type { RouteMetaData } from '@/types/Routes';
import HomePage from '@pages/Home/HomePage';
import PostsPage from '@pages/Posts/PostsPage';
import PostDetailPage from '@pages/PostDetail/PostDetailPage';

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
  {
    path: '/posts/:slug',
    element: PostDetailPage,
    id: '02',
    linkName: '',
  },
];
