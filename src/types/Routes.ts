import type { ComponentType } from 'react';

export interface RouteMetaData {
  path: string;
  element?: ComponentType;
  id: string;
  linkName: string;
  childElements?: RouteMetaData[];
}
