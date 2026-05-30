import { useState } from 'react';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LoginPage({ onNavigate }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await authAPI.login(form);
      if (res.data.success) {
        login(res.data.data, res.data.token);
        onNavigate('roaster');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-grad-hero relative overflow-hidden">
      <div className="absolute w-[500px] h-[500px] rounded-full bg-brand-red blur-[80px] opacity-15 pointer-events-none -top-[150px] -left-[150px]" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-brand-red-dark blur-[80px] opacity-15 pointer-events-none -bottom-[100px] -right-[100px]" />

      <div className="w-full max-w-[420px] bg-dark-2 border border-brand-red/30 rounded-3xl p-10 relative z-10 shadow-[0_0_40px_rgba(224,28,28,0.3),0_8px_32px_rgba(0,0,0,0.6)] animate-fade-up">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <span className="text-3xl">🔥</span>
          <div className="font-display text-2xl font-extrabold bg-gradient-to-br from-brand-red to-brand-red-bright bg-clip-text text-transparent tracking-tight">Resume Roaster</div>
        </div>

        <h1 className="text-3xl font-extrabold text-white text-center mb-2">Welcome back</h1>
        <p className="text-sm text-gray-400 text-center mb-8">Sign in to roast your resume</p>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit} id="form-login">
          {error && (
            <div className="px-4 py-3 rounded-lg text-[13px] font-medium flex items-center gap-2 bg-red-500/10 border border-red-500/25 text-red-400" role="alert">
              <span>⚠️</span> {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest" htmlFor="login-username">Username</label>
            <input
              className="bg-dark-2 border-2 border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-red focus:shadow-[0_0_0_3px_rgba(224,28,28,0.15)] transition-all outline-none w-full placeholder:text-gray-600"
              id="login-username"
              name="username"
              type="text"
              placeholder="your_username"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest" htmlFor="login-password">Password</label>
            <div className="relative">
              <input
                className="bg-dark-2 border-2 border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-red focus:shadow-[0_0_0_3px_rgba(224,28,28,0.15)] transition-all outline-none w-full placeholder:text-gray-600"
                id="login-password"
                name="password"
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer text-base"
                id="btn-toggle-pass-login"
                onClick={() => setShowPass(!showPass)}
                aria-label="Toggle password visibility"
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button
            className="mt-2 w-full px-6 py-4 rounded-xl bg-gradient-to-br from-brand-red to-brand-red-bright text-white shadow-[0_4px_20px_rgba(224,28,28,0.5)] hover:shadow-[0_8px_32px_rgba(224,28,28,0.6)] hover:-translate-y-0.5 transition-all font-bold text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            type="submit"
            id="btn-login-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="inline-block animate-spin">🔥</span>
                Signing in...
              </>
            ) : (
              'Sign In 🔥'
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <button id="link-to-signup" className="text-brand-red font-bold hover:text-brand-red-bright cursor-pointer" onClick={() => onNavigate('signup')}>Create one free</button>
        </p>
      </div>
    </div>
  );
}
