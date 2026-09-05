import { useState, useEffect } from 'react';

export default function AccountModal({ onClose, currentUser, onUpdateSuccess }) {
  const [tab, setTab] = useState('profile'); // 'profile' or '2fa'
  const [username, setUsername] = useState(currentUser || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  // 2FA state
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [otpCode, setOtpCode] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/account/update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setMsg('Account updated successfully!');
        if (data.username) onUpdateSuccess(data.username);
      } else {
        setMsg(data.detail || 'Failed to update account.');
      }
    } catch {
      setMsg('Network error.');
    }
  };

  const load2FASetup = async () => {
    setTab('2fa');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/2fa/setup/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setQrCode(data.qr_code);
        setSecret(data.secret);
      }
    } catch {
      setMsg('Could not load 2FA setup.');
    }
  };

  const verify2FA = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/2fa/verify/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ secret, otp_code: otpCode })
      });
      if (res.ok) {
        setMsg('2FA successfully activated!');
      } else {
        setMsg('Invalid 2FA code.');
      }
    } catch {
      setMsg('Error verifying code.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl max-w-md w-full text-white relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-white text-xl">&times;</button>
        
        <div className="flex gap-4 border-b border-neutral-800 pb-3 mb-4">
          <button 
            onClick={() => setTab('profile')} 
            className={`font-bold text-sm ${tab === 'profile' ? 'text-pink-500 border-b-2 border-pink-500 pb-1' : 'text-neutral-400'}`}
          >
            Modify Account
          </button>
          <button 
            onClick={load2FASetup} 
            className={`font-bold text-sm ${tab === '2fa' ? 'text-cyan-400 border-b-2 border-cyan-400 pb-1' : 'text-neutral-400'}`}
          >
            2FA Security
          </button>
        </div>

        {msg && <p className="text-xs text-pink-400 mb-3 text-center font-semibold">{msg}</p>}

        {tab === 'profile' ? (
          <form onSubmit={handleProfileUpdate} className="space-y-3">
            <div>
              <label className="text-xs text-neutral-400 block mb-1">New Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-neutral-400 block mb-1">New Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-neutral-400 block mb-1">New Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Leave blank to keep current" className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm focus:outline-none" />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-purple-600 font-bold py-2.5 rounded-xl text-sm mt-2">
              Save Account Changes
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-xs text-neutral-300">Scan this QR Code in Google Authenticator or Authy:</p>
            {qrCode ? (
              <img src={qrCode} alt="2FA QR Code" className="w-40 h-40 mx-auto rounded-xl border border-neutral-700" />
            ) : (
              <p className="text-xs text-neutral-500">Loading QR Code...</p>
            )}
            <form onSubmit={verify2FA} className="space-y-3">
              <input 
                type="text" 
                placeholder="6-digit Authenticator Code" 
                value={otpCode} 
                onChange={e => setOtpCode(e.target.value)} 
                className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-center text-sm tracking-widest font-mono" 
              />
              <button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 font-bold py-2.5 rounded-xl text-sm">
                Enable 2FA
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
