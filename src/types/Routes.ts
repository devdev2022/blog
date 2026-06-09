import type { ComponentType } from 'react';

export interface RouteMetaData {
  path: string;
  element?: ComponentType;
  id: string;
  linkName: string;
  protected?: boolean;
  bare?: boolean; // Header/Footer 없는 페이지(쓰기/수정/콜백). 없으면 Layout 적용
  childElements?: RouteMetaData[];
}
