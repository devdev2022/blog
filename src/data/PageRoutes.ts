import type { RouteMetaData } from '@/types/Routes';
import HomePage from '@pages/Home/HomePage';
import PostsPage from '@pages/Posts/PostsPage';
import PostDetailPage from '@pages/PostDetail/PostDetailPage';
import TagPage from '@pages/Tags/TagPage';
import AuthCallbackPage from '@pages/AuthCallback/AuthCallbackPage';

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
  {
    path: '/tags/:tag',
    element: TagPage,
    id: '03',
    linkName: '',
  },
  {
    path: '/auth/callback',
    element: AuthCallbackPage,
    id: '04',
    linkName: '',
  },
];
