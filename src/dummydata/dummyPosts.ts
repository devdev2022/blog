import type { Post, TechCategory } from '@/types/post';

export const dummyPosts: Post[] = [
  {
    id: 1,
    title: 'React Query로 서버 상태 관리하기',
    excerpt:
      'React Query를 활용해 복잡한 서버 상태를 간결하게 관리하는 방법을 알아봅니다. 캐싱, 동기화, 무한 스크롤까지 실전 예제로 정리했습니다.',
    tag: 'React',
    tags: ['React', 'TypeScript', 'React Query'],
    date: '2026-02-20',
    readingTime: 8,
    slug: 'react-query-server-state',
  },
  {
    id: 2,
    title: 'Vite + TypeScript 개발 환경 세팅',
    excerpt:
      '빠른 빌드 도구 Vite로 TypeScript 프로젝트를 처음부터 구성하는 방법을 정리했습니다. ESLint, 경로 별칭 설정까지 한 번에 다룹니다.',
    tag: 'DevOps',
    tags: ['Vite', 'TypeScript', '환경설정'],
    date: '2026-02-10',
    readingTime: 5,
    slug: 'vite-typescript-setup',
  },
  {
    id: 3,
    title: 'MySQL 인덱스 최적화 전략',
    excerpt:
      '쿼리 성능을 극적으로 개선하는 인덱스 설계 원칙과 실전 예제를 다룹니다. 복합 인덱스, 커버링 인덱스 등 핵심 개념을 정리했습니다.',
    tag: 'Database',
    tags: ['MySQL', 'Database', '최적화'],
    date: '2026-01-28',
    readingTime: 12,
    slug: 'mysql-index-optimization',
  },
];

export const techCategories: TechCategory[] = [
  {
    category: 'Frontend',
    items: [
      { name: 'React' },
      { name: 'TypeScript' },
      { name: 'Vite' },
      { name: 'CSS3' },
    ],
  },
  {
    category: 'Backend',
    items: [
      { name: 'Node.js' },
      { name: 'Express' },
      { name: 'MySQL' },
    ],
  },
  {
    category: 'Tools',
    items: [
      { name: 'Git' },
      { name: 'GitHub' },
      { name: 'ESLint' },
    ],
  },
];
