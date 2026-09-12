import React, { useState } from 'react';

export default function AuthModal({ onClose, onSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://medyart-backend.onrender.com';
    const endpoint = isLogin ? '/api/token/' : '/api/register/';
    const payload = isLogin ? { username, password } : { username, email, password };

    try {
      const res = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        if (isLogin) {
          localStorage.setItem('access_token', data.access);
          localStorage.setItem('refresh_token', data.refresh);
          localStorage.setItem('username', username);
          onSuccess(username);
        } else {
          setMessage('Account created successfully! Switching to login...');
          setTimeout(() => setIsLogin(true), 1200);
        }
      } else {
        setMessage(data.detail || 'Authentication failed. Please check credentials.');
      }
    } catch (err) {
      setMessage('Network error connecting to backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 max-w-md w-full relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-white">✕</button>

        <div className="flex gap-4 border-b border-neutral-800 pb-2 mb-6">
          <button onClick={() => setIsLogin(true)} className={`font-bold text-lg ${isLogin ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-neutral-400'}`}>Log In</button>
          <button onClick={() => setIsLogin(false)} className={`font-bold text-lg ${!isLogin ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-neutral-400'}`}>Sign Up</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-neutral-400 block mb-1">Username</label>
            <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-indigo-500" />
          </div>

          {!isLogin && (
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-indigo-500" />
            </div>
          )}

          <div>
            <label className="text-xs text-neutral-400 block mb-1">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-indigo-500" />
          </div>

          {message && <p className="text-xs text-pink-400 font-medium">{message}</p>}

          <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl transition-all shadow-md disabled:opacity-50">
            {loading ? 'Please wait...' : (isLogin ? 'Log In' : 'Create Account')}
          </button>
        </form>
      </div>
    </div>
  );
}
