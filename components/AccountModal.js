import React, { useState } from 'react';

export default function AccountModal({ onClose }) {
  const [field, setField] = useState('username'); // 'username', 'email', 'password', 'card'
  const [val, setVal] = useState('');
  const [msg, setMsg] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : '';

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMsg('');

    const payload = { action: field };
    if (field === 'username') payload.username = val;
    if (field === 'email') payload.email = val;
    if (field === 'password') payload.password = val;
    if (field === 'card') {
      payload.card_last4 = val.slice(-4);
      payload.card_brand = 'Visa/MasterCard';
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://medyart-backend.onrender.com'}/api/account/update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setMsg('Successfully updated!');
        if (field === 'username') localStorage.setItem('username', val);
      } else {
        setMsg('Update failed.');
      }
    } catch {
      setMsg('Server error.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 max-w-md w-full relative text-white">
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-white">✕</button>
        <h3 className="text-xl font-bold mb-4">Modify Account</h3>

        {/* 4 Dedicated Buttons */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button onClick={() => setField('username')} className={`p-2 rounded-xl text-xs font-bold border ${field === 'username' ? 'border-purple-500 bg-purple-500/10' : 'border-neutral-800'}`}>Change Username</button>
          <button onClick={() => setField('email')} className={`p-2 rounded-xl text-xs font-bold border ${field === 'email' ? 'border-purple-500 bg-purple-500/10' : 'border-neutral-800'}`}>Change Email</button>
          <button onClick={() => setField('password')} className={`p-2 rounded-xl text-xs font-bold border ${field === 'password' ? 'border-purple-500 bg-purple-500/10' : 'border-neutral-800'}`}>Change Password</button>
          <button onClick={() => setField('card')} className={`p-2 rounded-xl text-xs font-bold border ${field === 'card' ? 'border-purple-500 bg-purple-500/10' : 'border-neutral-800'}`}>Manage Credit Card</button>
        </div>

        {msg && <p className="text-xs text-pink-400 mb-3 font-semibold">{msg}</p>}

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="text-xs text-neutral-400 block mb-1 uppercase font-bold">{field}</label>
            <input 
              type={field === 'password' ? 'password' : 'text'} 
              required 
              value={val} 
              onChange={(e) => setVal(e.target.value)} 
              placeholder={field === 'card' ? 'Enter 16-digit Card Number' : `New ${field}`}
              className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white" 
            />
          </div>

          <button type="submit" className="w-full bg-purple-600 font-bold py-2.5 rounded-xl text-sm">Update {field}</button>
        </form>
      </div>
    </div>
  );
}
