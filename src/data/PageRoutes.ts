import type { RouteMetaData } from '@/types/Routes';
import HomePage from '@pages/Home/HomePage';

export const PageRouters: RouteMetaData[] = [
  {
    path: '/',
    element: HomePage,
    id: '00',
    linkName: '홈',
  },
];
