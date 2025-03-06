import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import routes from './routes';
import { RouteGuard } from './components/RouteGuard';
import { withSuspense } from './utils/withSuspense';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ErrorBoundary } from './components/UI/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <Router>
            <div className="min-h-screen flex flex-col dark:bg-gray-900 dark:text-white">
              <Header />
              <main className="flex-grow container mx-auto px-4 py-8">
                <Routes>
                  {routes.map(({ path, element: Element, title, auth, admin }) => (
                    <Route 
                      key={path} 
                      path={path} 
                      element={
                        <RouteGuard requireAuth={auth} requireAdmin={admin}>
                          {withSuspense(Element, title)}
                        </RouteGuard>
                      } 
                    />
                  ))}
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App; 