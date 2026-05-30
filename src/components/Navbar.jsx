import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onNavigate, currentPage }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    onNavigate('home');
    setMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-1/85 backdrop-blur-xl border-b border-white/10 py-4">
      <div className="container mx-auto px-4 md:px-6 max-w-[1180px]">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center gap-2 font-display text-2xl font-extrabold cursor-pointer tracking-tight"
            onClick={() => onNavigate('home')}
          >
            <span className="text-2xl">🔥</span>
            <span className="bg-gradient-to-br from-brand-red to-brand-red-bright bg-clip-text text-transparent">Resume Roaster</span>
          </div>

          {/* Nav Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2 text-sm text-gray-400 mr-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-red to-brand-red-dark flex items-center justify-center text-white font-bold text-sm">
                    {user.fullName?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || '?'}
                  </div>
                  <span className="hidden sm:inline">
                    {user.fullName || user.username}
                  </span>
                </div>
                <button
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all font-semibold text-sm"
                  onClick={handleLogout}
                  id="btn-logout"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all font-semibold text-sm"
                  onClick={() => onNavigate('login')}
                  id="btn-nav-login"
                >
                  Login
                </button>
                <button
                  className="px-5 py-2 rounded-lg bg-gradient-to-br from-brand-red to-brand-red-bright text-white shadow-[0_4px_20px_rgba(224,28,28,0.5)] hover:shadow-[0_8px_32px_rgba(224,28,28,0.6)] hover:-translate-y-0.5 transition-all font-semibold text-sm"
                  onClick={() => onNavigate('signup')}
                  id="btn-nav-signup"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
