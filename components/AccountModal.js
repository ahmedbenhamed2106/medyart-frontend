import React, { useState } from 'react';

export default function AccountModal({ onClose }) {
  const [tab, setTab] = useState('username');
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState('');

  const token = localStorage.getItem('access_token');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://medyart-backend.onrender.com'}/api/account/update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action: tab, ...form })
      });
      const data = await res.json();
      if (res.ok) {
        setMsg(data.message);
      } else {
        setMsg(data.detail || 'Action failed.');
      }
    } catch {
      setMsg('Connection error.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 max-w-md w-full relative text-white">
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400">✕</button>
        <h3 className="text-xl font-bold mb-4">Modify Account</h3>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <button onClick={() => setTab('username')} className={`p-2 rounded-xl text-xs font-bold border ${tab === 'username' ? 'border-purple-500 bg-purple-500/10' : 'border-neutral-800'}`}>Username</button>
          <button onClick={() => setTab('password')} className={`p-2 rounded-xl text-xs font-bold border ${tab === 'password' ? 'border-purple-500 bg-purple-500/10' : 'border-neutral-800'}`}>Password</button>
          <button onClick={() => setTab('card')} className={`p-2 rounded-xl text-xs font-bold border ${tab === 'card' ? 'border-purple-500 bg-purple-500/10' : 'border-neutral-800'}`}>Credit Card</button>
        </div>

        {msg && <p className="text-xs text-pink-400 mb-3 font-semibold">{msg}</p>}

        <form onSubmit={handleSubmit} className="space-y-3">
          {tab === 'username' && (
            <>
              <input type="text" name="old_username" required placeholder="Past Username" onChange={handleChange} className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs" />
              <input type="text" name="new_username" required placeholder="New Username" onChange={handleChange} className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs" />
              <input type="text" name="confirm_username" required placeholder="Confirm New Username" onChange={handleChange} className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs" />
            </>
          )}

          {tab === 'password' && (
            <>
              <input type="password" name="old_password" required placeholder="Past Password" onChange={handleChange} className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs" />
              <input type="password" name="new_password" required placeholder="New Password" onChange={handleChange} className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs" />
              <input type="password" name="confirm_password" required placeholder="Confirm New Password" onChange={handleChange} className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs" />
            </>
          )}

          {tab === 'card' && (
            <>
              <input type="text" name="card_number" required placeholder="Card Number" onChange={handleChange} className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs" />
              <div className="grid grid-cols-2 gap-2">
                <input type="text" name="exp_date" required placeholder="MM/YY" onChange={handleChange} className="p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs" />
                <input type="text" name="cvc" required placeholder="CVC" onChange={handleChange} className="p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs" />
              </div>
            </>
          )}

          <button type="submit" className="w-full bg-purple-600 font-bold py-2.5 rounded-xl text-sm capitalize">Update Information</button>
        </form>
      </div>
    </div>
  );
}
