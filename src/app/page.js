'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Super Admin');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if already logged in, redirect directly to dashboard
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (loggedIn === 'true') {
      router.push('/dashboard');
    }
  }, [router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Simulate small delay
    setTimeout(() => {
      if (isLogin) {
        // Mock Login logic
        const users = JSON.parse(localStorage.getItem('admin_users') || '[]');

        // Add a default user for convenience if none exists
        if (users.length === 0) {
          const defaultAdmin = {
            email: 'admin@shaadiexpert.com',
            password: 'password123',
            name: 'MedicalExpert Admin',
            role: 'Super Admin',
          };
          users.push(defaultAdmin);
          localStorage.setItem('admin_users', JSON.stringify(users));
        }

        const user = users.find((u) => u.email === email && u.password === password);
        if (user) {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('currentUser', JSON.stringify(user));
          setSuccess('Login successful! Redirecting...');
          setTimeout(() => {
            router.push('/dashboard');
          }, 1000);
        } else {
          setError('Invalid email or password. Use admin@shaadiexpert.com / password123 as default.');
          setLoading(false);
        }
      } else {
        // Mock Signup logic
        if (!name || !email || !password) {
          setError('All fields are required.');
          setLoading(false);
          return;
        }

        const users = JSON.parse(localStorage.getItem('admin_users') || '[]');
        if (users.some((u) => u.email === email)) {
          setError('Email is already registered.');
          setLoading(false);
          return;
        }

        const newUser = { name, email, password, role };
        users.push(newUser);
        localStorage.setItem('admin_users', JSON.stringify(users));

        setSuccess('Account created successfully! Switching to login...');
        setTimeout(() => {
          setIsLogin(true);
          setPassword('');
          setLoading(false);
        }, 1500);
      }
    }, 800);
  };

  const fillDemoCredentials = () => {
    setEmail('admin@shaadiexpert.com');
    setPassword('password123');
  };

  return (
    <main className="min-h-screen flex items-center justify-center relative bg-[#09090b] text-[#fafafa] font-sans px-4 overflow-hidden">
      {/* Decorative Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-pink-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Branding header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-pink-500/10 border border-pink-500/20 rounded-2xl mb-4 shadow-[0_0_20px_rgba(236,72,153,0.15)]">
            <svg
              className="w-8 h-8 text-pink-500 animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Medical<span className="text-pink-500">Expert</span>
          </h1>
          <p className="text-zinc-400 mt-2 text-sm">Matrimonial & Matchmaking Consultant Admin Panel</p>
        </div>

        {/* Auth Card */}
        <div className="glass rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden">
          {/* Top border highlight */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-pink-500/50 to-transparent" />

          {/* Form Tabs */}
          <div className="flex bg-zinc-900/60 p-1 rounded-xl mb-8 border border-zinc-800">
            <button
              onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${isLogin
                ? 'bg-pink-500 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
                }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${!isLogin
                ? 'bg-pink-500 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
                }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all text-white placeholder-zinc-600"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all text-white placeholder-zinc-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all text-white placeholder-zinc-600"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Assign Administration Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all text-white"
                >
                  <option value="Super Admin" className="bg-zinc-900 text-white">Super Admin</option>
                  <option value="Matchmaker" className="bg-zinc-900 text-white">Matchmaker Expert</option>
                  <option value="Support" className="bg-zinc-900 text-white">Support Admin</option>
                </select>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded-xl flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{success}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none shadow-[0_4px_20px_rgba(236,72,153,0.25)] flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isLogin ? (
                'Sign In'
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Demo Helper Box */}
          {isLogin && (
            <div className="mt-6 pt-6 border-t border-zinc-800/80 text-center">
              <button
                onClick={fillDemoCredentials}
                className="text-xs text-pink-400/80 hover:text-pink-400 font-semibold underline decoration-dotted transition-colors"
              >
                Click to Auto-fill Demo Credentials
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
