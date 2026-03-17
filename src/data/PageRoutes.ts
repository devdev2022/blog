import type { RouteMetaData } from '@/types/Routes';
import HomePage from '@pages/Home/HomePage';
import PostsPage from '@pages/Posts/PostsPage';
import PostDetailPage from '@pages/PostDetail/PostDetailPage';
import TagPage from '@pages/Tags/TagPage';
import AuthCallbackPage from '@pages/AuthCallback/AuthCallbackPage';
import WritePage from '@pages/Write/WritePage';
import AboutPage from '@pages/About/AboutPage';
import AccountManagementPage from '@pages/AccountManagement/AccountManagementPage';

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
    path: '/about',
    element: AboutPage,
    id: '06',
    linkName: '소개',
  },
  {
    path: '/posts/:id',
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
  {
    path: '/write',
    element: WritePage,
    id: '05',
    linkName: '',
    protected: true,
  },
  {
    path: '/account',
    element: AccountManagementPage,
    id: '07',
    linkName: '',
    protected: true,
  },
];
