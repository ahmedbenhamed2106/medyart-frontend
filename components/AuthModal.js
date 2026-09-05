import { useState } from 'react';

export default function AuthModal({ onClose, onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const endpoint = isLogin ? '/api/token/' : '/api/register/';
    const payload = isLogin 
      ? { username, password } 
      : { username, email, password };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.detail || JSON.stringify(data));
        setLoading(false);
        return;
      }

      if (isLogin) {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        onLoginSuccess(username);
        onClose();
      } else {
        setMessage('Account created successfully! Switching to login...');
        setTimeout(() => {
          setIsLogin(true);
          setMessage('');
        }, 1500);
      }
    } catch (err) {
      setMessage('Failed to connect to backend.');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl max-w-sm w-full shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-white text-xl">&times;</button>
        
        <div className="flex gap-4 mb-6 border-b border-neutral-200 dark:border-neutral-800 pb-2">
          <button 
            onClick={() => setIsLogin(true)} 
            className={`font-bold text-lg ${isLogin ? 'text-indigo-600 dark:text-indigo-400' : 'text-neutral-400'}`}
          >
            Log In
          </button>
          <button 
            onClick={() => setIsLogin(false)} 
            className={`font-bold text-lg ${!isLogin ? 'text-indigo-600 dark:text-indigo-400' : 'text-neutral-400'}`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-neutral-400 block mb-1">Username</label>
            <input 
              type="text" 
              required 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Email</label>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          <div>
            <label className="text-xs text-neutral-400 block mb-1">Password</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {message && <p className="text-xs font-medium text-indigo-400 text-center">{message}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl transition-all shadow-md disabled:opacity-50"
          >
            {loading ? 'Please wait...' : (isLogin ? 'Log In' : 'Create Account')}
          </button>
        </form>
      </div>
    </div>
  );
}
