import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

//redux
import { Provider } from "react-redux";
import { store } from "@/store/store";

//context
import { AuthProvider } from "@/contexts/AuthContext";

//components
import GlobalModal from "@/components/GlobalModal/GlobalModal";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";

//utils
import { PageRouters } from "@/data/PageRoutes";
import createChildRoutes from "@/utils/createRoutes";

function AppInner() {
  return (
    <BrowserRouter>
      <Routes>
        <Route>
          {PageRouters.map((paramObj) => {
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
              <Route key={path}>
                <Route path={paramObj.path} element={pageElement}>
                  {createChildRoutes(paramObj)}
                </Route>
              </Route>
            );
          })}
        </Route>
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
          <AppInner />
        </AuthProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
