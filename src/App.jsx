import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import RoasterPage from './pages/RoasterPage';

function AppContent() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState('home');

  // Auto-redirect logged-in users
  useEffect(() => {
    if (!loading && user && page === 'home') {
      setPage('roaster');
    }
  }, [user, loading]);

  const navigate = (target) => {
    // Guard protected pages
    if (target === 'roaster' && !user) {
      setPage('login');
      return;
    }
    setPage(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-5xl animate-pulse">🔥</div>
        <p className="text-gray-400 text-sm">Loading Resume Roaster...</p>
      </div>
    );
  }

  const showNavbar = page !== 'login' && page !== 'signup';

  return (
    <>
      {showNavbar && <Navbar onNavigate={navigate} currentPage={page} />}

      {page === 'home'    && <HomePage    onNavigate={navigate} />}
      {page === 'login'   && <LoginPage   onNavigate={navigate} />}
      {page === 'signup'  && <SignupPage  onNavigate={navigate} />}
      {page === 'roaster' && <RoasterPage onNavigate={navigate} />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
