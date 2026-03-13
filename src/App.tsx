import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { PageRouters } from '@/data/PageRoutes';
import createChildRoutes from '@/utils/createRoutes';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import LoginModal from '@/components/LoginModal/LoginModal';
import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';

function GlobalModals() {
  const { loginModalOpen, closeLoginModal } = useAuth();
  return loginModalOpen ? <LoginModal onClose={closeLoginModal} /> : null;
}

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
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
      </BrowserRouter>
      <GlobalModals />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
