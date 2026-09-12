import React, { useState, useEffect } from 'react';

export default function AccountModal({ onClose, onUpdateSuccess }) {
  const [tab, setTab] = useState('profile'); // 'profile' or '2fa'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // 2FA state
  const [qrCode, setQrCode] = useState(null);
  const [otpCode, setOtpCode] = useState('');
  const [msg, setMsg] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://medyart-backend.onrender.com'}/api/account/update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setMsg('Account details updated!');
        if (username) onUpdateSuccess(username);
      } else {
        setMsg(data.detail || 'Failed to update account.');
      }
    } catch {
      setMsg('Error updating account.');
    }
  };

  const load2FASetup = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://medyart-backend.onrender.com'}/api/2fa/setup/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setQrCode(data.qr_code);
    } catch {
      setMsg('Could not load 2FA setup.');
    }
  };

  useEffect(() => {
    if (tab === '2fa') load2FASetup();
  }, [tab]);

  const verify2FA = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://medyart-backend.onrender.com'}/api/2fa/verify/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ otp_code: otpCode })
      });
      const data = await res.json();
      if (res.ok) {
        setMsg('2FA successfully activated!');
      } else {
        setMsg(data.detail || 'Invalid 2FA code.');
      }
    } catch {
      setMsg('Error verifying code.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 max-w-md w-full relative text-white">
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-white">✕</button>

        <div className="flex gap-4 border-b border-neutral-800 pb-2 mb-6">
          <button onClick={() => setTab('profile')} className={`font-bold text-sm ${tab === 'profile' ? 'text-pink-500 border-b-2 border-pink-500' : 'text-neutral-400'}`}>Modify Account</button>
          <button onClick={() => setTab('2fa')} className={`font-bold text-sm ${tab === '2fa' ? 'text-pink-500 border-b-2 border-pink-500' : 'text-neutral-400'}`}>2FA Security</button>
        </div>

        {msg && <p className="text-xs text-pink-400 mb-3 font-semibold">{msg}</p>}

        {tab === 'profile' ? (
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="text-xs text-neutral-400 block mb-1">New Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white" />
            </div>
            <div>
              <label className="text-xs text-neutral-400 block mb-1">New Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white" />
            </div>
            <div>
              <label className="text-xs text-neutral-400 block mb-1">New Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white" />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-cyan-500 font-bold py-2.5 rounded-xl text-sm">Save Account Changes</button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-xs text-neutral-300">Scan this QR Code in Google Authenticator or Authy:</p>
            {qrCode ? (
              <img src={qrCode} alt="2FA QR Code" className="w-48 h-48 mx-auto rounded-xl border border-neutral-700" />
            ) : (
              <p className="text-xs text-neutral-500">Loading QR Code...</p>
            )}

            <form onSubmit={verify2FA} className="space-y-3">
              <input 
                type="text" 
                placeholder="6-digit Authenticator Code" 
                value={otpCode} 
                onChange={(e) => setOtpCode(e.target.value)} 
                className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-center tracking-widest font-mono text-white" 
              />
              <button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 font-bold py-2.5 rounded-xl text-sm">Enable 2FA</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
