import type { Post, TechCategory, PostCategory } from '@/types/post';
import { calcReadingTime } from '@/utils/calcReadingTime';

const p1excerpt = 'React Query를 활용해 복잡한 서버 상태를 간결하게 관리하는 방법을 알아봅니다. 캐싱, 동기화, 무한 스크롤까지 실전 예제로 정리했습니다.';
const p2excerpt = '빠른 빌드 도구 Vite로 TypeScript 프로젝트를 처음부터 구성하는 방법을 정리했습니다. ESLint, 경로 별칭 설정까지 한 번에 다룹니다.';
const p3excerpt = '쿼리 성능을 극적으로 개선하는 인덱스 설계 원칙과 실전 예제를 다룹니다. 복합 인덱스, 커버링 인덱스 등 핵심 개념을 정리했습니다.';
const p4excerpt = 'CSS Grid 레이아웃의 모든 속성을 실전 예제와 함께 정리했습니다. 복잡한 레이아웃도 Grid로 간결하게 구현하는 방법을 알아봅니다.';
const p5excerpt = '타입스크립트 제네릭의 개념부터 고급 활용법까지 정리했습니다. 재사용 가능한 타입 설계로 더 안전한 코드를 작성하세요.';
const p6excerpt = 'React Hook Form을 활용해 성능 최적화된 폼을 만드는 방법을 다룹니다. 유효성 검사, 에러 처리, 중첩 폼까지 실전 예제로 정리했습니다.';
const p7excerpt = '이진 탐색의 개념부터 변형 문제까지 체계적으로 정리했습니다. Lower/Upper Bound, 파라메트릭 서치 등 고급 기법도 다룹니다.';
const p8excerpt = 'HTTP 요청/응답 사이클, HTTPS의 TLS 핸드셰이크 과정을 단계별로 설명합니다. 웹 개발자라면 반드시 알아야 할 네트워크 지식을 정리했습니다.';
const p9excerpt = '운영체제의 핵심 개념인 프로세스와 스레드의 차이를 깊이 있게 다룹니다. 컨텍스트 스위칭, 동기화 문제까지 정리했습니다.';
const p10excerpt = 'React 최적화 훅인 useCallback과 useMemo의 올바른 사용 시점을 분석합니다. 남용의 함정과 실제 성능 측정 방법을 함께 다룹니다.';
const p11excerpt = '6개월간 Tailwind CSS를 실무에 도입하며 느낀 장단점을 솔직하게 정리했습니다. 컨벤션 설정, 유지보수 경험을 공유합니다.';
const p12excerpt = 'Node.js의 핵심인 이벤트 루프 동작 방식을 단계별로 해부합니다. libuv, 마이크로태스크, 매크로태스크의 실행 순서를 예제로 정리했습니다.';
const p13excerpt = '협업에서 자주 혼동되는 rebase와 merge의 차이를 실제 시나리오로 설명합니다. 각 방식의 장단점과 권장 사용 상황을 정리했습니다.';
const p14excerpt = '스택과 큐의 개념부터 실전 알고리즘 문제 적용까지 정리했습니다. 단조 스택, 원형 큐 등 고급 변형도 함께 다룹니다.';
const p15excerpt = 'TCP/IP 프로토콜 스택을 계층별로 깊이 있게 분석합니다. 각 계층의 역할과 주요 프로토콜, 실제 패킷 흐름을 함께 이해합니다.';
const p16excerpt = 'Redux, Zustand, Jotai, Recoil을 실제 프로젝트 기준으로 비교 분석했습니다. 각 라이브러리의 철학과 사용 시나리오를 정리했습니다.';
const p17excerpt = 'CSS 애니메이션에서 발생하는 리페인트와 리플로우를 줄이는 기법을 다룹니다. transform, will-change, GPU 가속을 활용하는 방법을 정리했습니다.';
const p18excerpt = 'INNER, LEFT, RIGHT, FULL OUTER JOIN의 차이를 명확하게 설명합니다. 실전 쿼리 예제와 성능 비교까지 함께 다룹니다.';
const p19excerpt = '실무에서 바로 적용할 수 있는 REST API 설계 원칙을 정리했습니다. 리소스 네이밍, 상태 코드, 버전 관리까지 포괄적으로 다룹니다.';
const p20excerpt = 'Compound, Render Props, HOC, Custom Hook 등 React에서 자주 쓰이는 컴포넌트 패턴을 예제 코드와 함께 정리했습니다.';

export const dummyPosts: Post[] = [
  {
    id: 1,
    title: 'React Query로 서버 상태 관리하기',
    excerpt: p1excerpt,
    tag: 'React',
    tags: ['React', 'TypeScript', 'React Query'],
    date: '2026-02-20',
    readingTime: calcReadingTime(p1excerpt),
    slug: 'react-query-server-state',
    category: 'frontend/react',
  },
  {
    id: 2,
    title: 'Vite + TypeScript 개발 환경 세팅',
    excerpt: p2excerpt,
    tag: 'DevOps',
    tags: ['Vite', 'TypeScript', '환경설정'],
    date: '2026-02-10',
    readingTime: calcReadingTime(p2excerpt),
    slug: 'vite-typescript-setup',
    category: 'frontend/web',
  },
  {
    id: 3,
    title: 'MySQL 인덱스 최적화 전략',
    excerpt: p3excerpt,
    tag: 'Database',
    tags: ['MySQL', 'Database', '최적화'],
    date: '2026-01-28',
    readingTime: calcReadingTime(p3excerpt),
    slug: 'mysql-index-optimization',
    category: 'database',
  },
];

export const allDummyPosts: Post[] = [
  {
    id: 1,
    title: 'React Query로 서버 상태 관리하기',
    excerpt: p1excerpt,
    tag: 'React',
    tags: ['React', 'TypeScript', 'React Query'],
    date: '2026-02-20',
    readingTime: calcReadingTime(p1excerpt),
    slug: 'react-query-server-state',
    category: 'frontend/react',
  },
  {
    id: 2,
    title: 'Vite + TypeScript 개발 환경 세팅',
    excerpt: p2excerpt,
    tag: '환경설정',
    tags: ['Vite', 'TypeScript', '환경설정'],
    date: '2026-02-10',
    readingTime: calcReadingTime(p2excerpt),
    slug: 'vite-typescript-setup',
    category: 'frontend/web',
  },
  {
    id: 3,
    title: 'MySQL 인덱스 최적화 전략',
    excerpt: p3excerpt,
    tag: 'Database',
    tags: ['MySQL', 'Database', '최적화'],
    date: '2026-01-28',
    readingTime: calcReadingTime(p3excerpt),
    slug: 'mysql-index-optimization',
    category: 'database',
  },
  {
    id: 4,
    title: 'CSS Grid 완벽 가이드',
    excerpt: p4excerpt,
    tag: 'CSS',
    tags: ['CSS', 'Grid', '레이아웃'],
    date: '2026-01-20',
    readingTime: calcReadingTime(p4excerpt),
    slug: 'css-grid-guide',
    category: 'frontend/web',
  },
  {
    id: 5,
    title: 'TypeScript 제네릭 완벽 정리',
    excerpt: p5excerpt,
    tag: 'TypeScript',
    tags: ['TypeScript', '제네릭', '타입'],
    date: '2026-01-15',
    readingTime: calcReadingTime(p5excerpt),
    slug: 'typescript-generics',
    category: 'frontend/web',
  },
  {
    id: 6,
    title: 'React Hook Form으로 폼 관리하기',
    excerpt: p6excerpt,
    tag: 'React',
    tags: ['React', 'Form', '유효성 검사'],
    date: '2026-01-10',
    readingTime: calcReadingTime(p6excerpt),
    slug: 'react-hook-form',
    category: 'frontend/react',
  },
  {
    id: 7,
    title: '이진 탐색 알고리즘 완벽 정리',
    excerpt: p7excerpt,
    tag: 'Algorithm',
    tags: ['Algorithm', '이진탐색', 'CS'],
    date: '2025-12-28',
    readingTime: calcReadingTime(p7excerpt),
    slug: 'binary-search',
    category: 'cs',
  },
  {
    id: 8,
    title: 'HTTP/HTTPS 동작 원리 깊게 이해하기',
    excerpt: p8excerpt,
    tag: 'Network',
    tags: ['HTTP', 'HTTPS', 'Network'],
    date: '2025-12-20',
    readingTime: calcReadingTime(p8excerpt),
    slug: 'http-https-deep-dive',
    category: 'cs',
  },
  {
    id: 9,
    title: '프로세스 vs 스레드, 완벽 정리',
    excerpt: p9excerpt,
    tag: 'OS',
    tags: ['OS', '프로세스', '스레드'],
    date: '2025-12-15',
    readingTime: calcReadingTime(p9excerpt),
    slug: 'process-vs-thread',
    category: 'cs',
  },
  {
    id: 10,
    title: 'useCallback, useMemo 언제 써야 할까',
    excerpt: p10excerpt,
    tag: 'React',
    tags: ['React', '최적화', 'Hooks'],
    date: '2025-12-10',
    readingTime: calcReadingTime(p10excerpt),
    slug: 'usecallback-usememo',
    category: 'frontend/react',
  },
  {
    id: 11,
    title: 'Tailwind CSS 실무 도입 후기',
    excerpt: p11excerpt,
    tag: 'CSS',
    tags: ['Tailwind', 'CSS', '실무'],
    date: '2025-12-05',
    readingTime: calcReadingTime(p11excerpt),
    slug: 'tailwind-css-review',
    category: 'frontend/web',
  },
  {
    id: 12,
    title: 'Node.js 이벤트 루프 완벽 이해',
    excerpt: p12excerpt,
    tag: 'Node.js',
    tags: ['Node.js', '이벤트루프', 'JavaScript'],
    date: '2025-11-28',
    readingTime: calcReadingTime(p12excerpt),
    slug: 'nodejs-event-loop',
    category: 'cs',
  },
  {
    id: 13,
    title: 'Git rebase vs merge, 언제 무엇을 써야 할까',
    excerpt: p13excerpt,
    tag: 'Git',
    tags: ['Git', 'rebase', 'merge'],
    date: '2025-11-20',
    readingTime: calcReadingTime(p13excerpt),
    slug: 'git-rebase-vs-merge',
    category: 'frontend/web',
  },
  {
    id: 14,
    title: '자료구조: 스택과 큐 활용 패턴',
    excerpt: p14excerpt,
    tag: 'Algorithm',
    tags: ['자료구조', '스택', '큐'],
    date: '2025-11-15',
    readingTime: calcReadingTime(p14excerpt),
    slug: 'stack-queue-patterns',
    category: 'cs',
  },
  {
    id: 15,
    title: 'TCP/IP 4계층 모델 완벽 정리',
    excerpt: p15excerpt,
    tag: 'Network',
    tags: ['TCP/IP', 'Network', 'CS'],
    date: '2025-11-08',
    readingTime: calcReadingTime(p15excerpt),
    slug: 'tcp-ip-layers',
    category: 'cs',
  },
  {
    id: 16,
    title: 'React 상태 관리 라이브러리 비교 분석',
    excerpt: p16excerpt,
    tag: 'React',
    tags: ['React', '상태관리', 'Redux', 'Zustand'],
    date: '2025-11-01',
    readingTime: calcReadingTime(p16excerpt),
    slug: 'react-state-management',
    category: 'frontend/react',
  },
  {
    id: 17,
    title: 'CSS 애니메이션 성능 최적화',
    excerpt: p17excerpt,
    tag: 'CSS',
    tags: ['CSS', '애니메이션', '성능'],
    date: '2025-10-25',
    readingTime: calcReadingTime(p17excerpt),
    slug: 'css-animation-performance',
    category: 'frontend/web',
  },
  {
    id: 18,
    title: 'MySQL JOIN 종류와 활용법 총정리',
    excerpt: p18excerpt,
    tag: 'Database',
    tags: ['MySQL', 'JOIN', 'SQL'],
    date: '2025-10-18',
    readingTime: calcReadingTime(p18excerpt),
    slug: 'mysql-joins',
    category: 'database',
  },
  {
    id: 19,
    title: 'RESTful API 설계 원칙과 Best Practice',
    excerpt: p19excerpt,
    tag: 'Backend',
    tags: ['REST', 'API', 'Backend'],
    date: '2025-10-10',
    readingTime: calcReadingTime(p19excerpt),
    slug: 'restful-api-design',
    category: 'database',
  },
  {
    id: 20,
    title: 'React 컴포넌트 설계 패턴 모음',
    excerpt: p20excerpt,
    tag: 'React',
    tags: ['React', '패턴', '컴포넌트'],
    date: '2025-10-05',
    readingTime: calcReadingTime(p20excerpt),
    slug: 'react-component-patterns',
    category: 'frontend/react',
  },
];

export const postCategories: PostCategory[] = [
  {
    name: '전체 보기',
    slug: 'all',
    count: 20,
  },
  {
    name: '프론트엔드',
    slug: 'frontend',
    count: 13,
    children: [
      { name: '웹', slug: 'frontend/web', count: 6 },
      { name: 'React', slug: 'frontend/react', count: 7 },
    ],
  },
  {
    name: 'CS지식',
    slug: 'cs',
    count: 5,
  },
  {
    name: '데이터베이스',
    slug: 'database',
    count: 3,
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
