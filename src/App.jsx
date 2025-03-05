import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import routes from './routes';
import { RouteGuard } from './components/RouteGuard';
import { withSuspense } from './utils/withSuspense';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            {routes.map(({ path, element: Element, title, auth, admin, public: isPublic }) => (
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
  );
}

export default App; 