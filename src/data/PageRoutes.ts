import type { RouteMetaData } from "@/types/Routes";
import HomePage from "@pages/Home/HomePage";
import PostsPage from "@pages/Posts/PostsPage";
import PostDetailPage from "@pages/PostDetail/PostDetailPage";
import TagPage from "@pages/Tags/TagPage";
import AuthCallbackPage from "@pages/AuthCallback/AuthCallbackPage";
import WritePage from "@pages/Write/WritePage";
import EditPage from "@pages/Edit/EditPage";
import AboutPage from "@pages/About/AboutPage";
import AccountManagementPage from "@pages/AccountManagement/AccountManagementPage";

export const PageRouters: RouteMetaData[] = [
  {
    path: "/",
    element: HomePage,
    id: "00",
    linkName: "홈",
  },
  {
    path: "/posts",
    element: PostsPage,
    id: "01",
    linkName: "포스트",
  },
  {
    path: "/about",
    element: AboutPage,
    id: "06",
    linkName: "소개",
  },
  {
    path: "/posts/:id",
    element: PostDetailPage,
    id: "02",
    linkName: "",
  },
  {
    path: "/tags/:tag",
    element: TagPage,
    id: "03",
    linkName: "",
  },
  {
    path: "/auth/callback",
    element: AuthCallbackPage,
    id: "04",
    linkName: "",
    bare: true,
  },
  {
    path: "/write",
    element: WritePage,
    id: "05",
    linkName: "",
    protected: true,
    bare: true,
  },
  {
    path: "/posts/:id/edit",
    element: EditPage,
    id: "08",
    linkName: "",
    protected: true,
    bare: true,
  },
  {
    path: "/account",
    element: AccountManagementPage,
    id: "07",
    linkName: "",
    protected: true,
  },
];

// Header/Footer 공통 셸(Layout) 적용 라우트
export const LayoutRouters = PageRouters.filter((route) => !route.bare);
// Layout 없이 단독 렌더되는 라우트(쓰기/수정/콜백)
export const BareRouters = PageRouters.filter((route) => route.bare);
