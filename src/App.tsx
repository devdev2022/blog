import "./App.css";
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

//utils
import { LayoutRouters, BareRouters } from "@/data/PageRoutes";
import createChildRoutes from "@/utils/createRoutes";
import type { RouteMetaData } from "@/types/Routes";

function renderRoute(paramObj: RouteMetaData) {
  const { element: PathElement, path } = paramObj;
  if (!PathElement) return null;
  const pageElement = paramObj.protected ? (
    <ProtectedRoute>
      <PathElement />
    </ProtectedRoute>
  ) : (
    <PathElement />
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
