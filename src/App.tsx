import "./App.css";
import { Suspense } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

//redux
import { Provider } from "react-redux";
import { store } from "@/store/store";

//context
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";

//components
import GlobalModal from "@/components/GlobalModal/GlobalModal";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import Layout from "@/components/Layout/Layout";
import RouteErrorBoundary from "@/components/RouteErrorBoundary/RouteErrorBoundary";

//utils
import { LayoutRouters, BareRouters } from "@/data/PageRoutes";
import createChildRoutes from "@/utils/createRoutes";
import type { RouteMetaData } from "@/types/Routes";

function renderRoute(paramObj: RouteMetaData) {
  const { element: PathElement, path, skeleton: Skeleton } = paramObj;
  if (!PathElement) return null;
  const content = paramObj.protected ? (
    <ProtectedRoute>
      <PathElement />
    </ProtectedRoute>
  ) : (
    <PathElement />
  );
  /* 라우트별 Suspense: 진입 시 청크 로딩 동안 페이지 전용 스켈레톤을 띄운다.
   라우트 전환은 React Router v7이 startTransition으로 처리하므로 이전 화면이 유지된다.
  ErrorBoundary로 한 겹 더 감싸 stale chunk 로딩 실패 시 자동 새로고침으로 복구한다.*/
  const pageElement = (
    <RouteErrorBoundary>
      <Suspense fallback={Skeleton ? <Skeleton /> : null}>{content}</Suspense>
    </RouteErrorBoundary>
  );
  return (
    <Route key={path} path={path} element={pageElement}>
      {createChildRoutes(paramObj)}
    </Route>
  );
}

function AppInner() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Header/Footer 공통 셸*/}
        <Route element={<Layout />}>{LayoutRouters.map(renderRoute)}</Route>
        {/* Layout 없이 단독 렌더 */}
        {BareRouters.map(renderRoute)}
      </Routes>
      <GlobalModal />
    </BrowserRouter>
  );
}

const queryClient = new QueryClient();

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NotificationProvider>
            <AppInner />
          </NotificationProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
