import type { Comment } from '@/types/comment';

// key: post slug
export const dummyComments: Record<string, Comment[]> = {
  'react-query-server-state': [
    {
      id: 1,
      parentId: null,
      author: '김민준',
      content: '정말 유익한 글이에요! staleTime이랑 gcTime 차이가 항상 헷갈렸는데 이 글 덕분에 드디어 정리됐습니다.',
      date: '2026-02-21',
    },
    {
      id: 2,
      parentId: 1,
      author: '이서연',
      content: '저도 같은 부분에서 막혔었는데 공감돼요. 특히 gcTime이 구 cacheTime이라는 게 버전업 되면서 헷갈렸어요.',
      date: '2026-02-21',
    },
    {
      id: 3,
      parentId: 2,
      author: '김민준',
      content: '맞아요! v5에서 이름이 바뀌어서 공식 문서 보다가 혼란스러웠어요. 이제 확실히 기억할 것 같아요 😄',
      date: '2026-02-22',
    },
    {
      id: 4,
      parentId: 3,
      author: '박도현',
      content: '저도 방금 마이그레이션 하면서 이 문제를 겪었어요. 글 타이밍 딱 좋네요.',
      date: '2026-02-22',
    },
    {
      id: 5,
      parentId: null,
      author: '최유진',
      content: 'useInfiniteQuery 부분이 특히 도움이 됐어요. getNextPageParam 설정이 헷갈렸는데 예제 코드가 명쾌하네요.',
      date: '2026-02-23',
    },
    {
      id: 6,
      parentId: 5,
      author: 'KHS',
      content: '감사합니다! 추후에 useInfiniteQuery 실전 예제로 별도 포스팅도 작성할 예정이에요.',
      date: '2026-02-23',
    },
    {
      id: 7,
      parentId: null,
      author: '정승호',
      content: 'useMutation onSuccess에서 invalidateQueries 호출하는 패턴이 정말 많이 쓰이는데, 잘 정리해주셨네요. 북마크하고 갑니다.',
      date: '2026-02-25',
    },
  ],
};
