import type { ComponentType } from 'react';

export interface RouteMetaData {
  path: string;
  element?: ComponentType;
  load?: () => Promise<unknown>; // lazy import thunk. prefetch가 lazy와 동일 import를 재사용
  id: string;
  linkName: string;
  protected?: boolean;
  bare?: boolean; // Header/Footer 없는 페이지(쓰기/수정/콜백). 없으면 Layout 적용
  skeleton?: ComponentType; // 라우트 진입(청크 로딩) 시 보여줄 Suspense fallback
  childElements?: RouteMetaData[];
}
