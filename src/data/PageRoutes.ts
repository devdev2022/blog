import { lazy } from "react";
import type { ComponentType } from "react";
import type { RouteMetaData } from "@/types/Routes";

// 스켈레톤은 lazy 청크와 분리해 eager import — 라우트 진입 즉시 fallback으로 표시
import HomeSkeleton from "@pages/Home/component/HomeSkeleton";
import PostsSkeleton from "@pages/Posts/component/PostsSkeleton";
import PostDetailSkeleton from "@pages/PostDetail/component/PostDetailSkeleton";
import TagPageSkeleton from "@pages/Tags/component/TagPageSkeleton";

// import thunk를 한 번만 정의해 element(lazy)와 load(prefetch)가 같은 함수를 공유
// → prefetch가 호출하는 import와 실제 lazy import가 동일해 브라우저/Vite가 자동 dedupe.
function lazyRoute(load: () => Promise<{ default: ComponentType }>) {
  return { load, element: lazy(load) };
}

export const PageRouters: RouteMetaData[] = [
  {
    path: "/",
    ...lazyRoute(() => import("@pages/Home/HomePage")),
    skeleton: HomeSkeleton,
    id: "00",
    linkName: "홈",
  },
  {
    path: "/posts",
    ...lazyRoute(() => import("@pages/Posts/PostsPage")),
    skeleton: PostsSkeleton,
    id: "01",
    linkName: "포스트",
  },
  {
    path: "/about",
    ...lazyRoute(() => import("@pages/About/AboutPage")),
    id: "06",
    linkName: "소개",
  },
  {
    path: "/posts/:id",
    ...lazyRoute(() => import("@pages/PostDetail/PostDetailPage")),
    skeleton: PostDetailSkeleton,
    id: "02",
    linkName: "",
  },
  {
    path: "/tags/:tag",
    ...lazyRoute(() => import("@pages/Tags/TagPage")),
    skeleton: TagPageSkeleton,
    id: "03",
    linkName: "",
  },
  {
    path: "/auth/callback",
    ...lazyRoute(() => import("@pages/AuthCallback/AuthCallbackPage")),
    id: "04",
    linkName: "",
    bare: true,
  },
  {
    path: "/write",
    ...lazyRoute(() => import("@pages/Write/WritePage")),
    id: "05",
    linkName: "",
    protected: true,
    bare: true,
  },
  {
    path: "/posts/:id/edit",
    ...lazyRoute(() => import("@pages/Edit/EditPage")),
    id: "08",
    linkName: "",
    protected: true,
    bare: true,
  },
  {
    path: "/account",
    ...lazyRoute(
      () => import("@pages/AccountManagement/AccountManagementPage"),
    ),
    id: "07",
    linkName: "",
    protected: true,
  },
];

// Header/Footer 공통 셸(Layout) 적용 라우트
export const LayoutRouters = PageRouters.filter((route) => !route.bare);
// Layout 없이 단독 렌더되는 라우트(쓰기/수정/콜백)
export const BareRouters = PageRouters.filter((route) => route.bare);
