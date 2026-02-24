import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { PageRouters } from '@/data/PageRoutes';
import createChildRoutes from '@/utils/createRoutes';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route>
            {PageRouters.map((paramObj) => {
              const { element: PathElement, path } = paramObj;
              if (!PathElement) return null;
              return (
                <Route key={path}>
                  <Route path={paramObj.path} element={<PathElement />}>
                    {createChildRoutes(paramObj)}
                  </Route>
                </Route>
              );
            })}
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
