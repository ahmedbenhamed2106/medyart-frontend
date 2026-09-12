import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AuthModal from '../components/AuthModal';
import UploadModal from '../components/UploadModal';
import AccountModal from '../components/AccountModal';

export default function Home() {
  const [photos, setPhotos] = useState([]);
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('dark'); // 'dark' or 'light'
  const [bgOpacity, setBgOpacity] = useState(90);
  const [activeCommentModal, setActiveCommentModal] = useState(null);
  const [commentText, setCommentText] = useState('');
  
  const [showAuth, setShowAuth] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showAccount, setShowAccount] = useState(false);

  const fetchPhotos = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://medyart-backend.onrender.com'}/api/photos/`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      const data = await res.json();
      if (Array.isArray(data)) setPhotos(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchPhotos();
    // Real-time polling every 3 seconds for instant feed updates without page reloads
    const interval = setInterval(fetchPhotos, 3000);
    const savedUser = localStorage.getItem('username');
    if (savedUser) setUser(savedUser);

    // Screenshot Protection Logic
    const preventCapture = (e) => {
      if (e.key === 'PrintScreen') {
        navigator.clipboard.writeText('');
        alert('Screenshots are disabled on MedyArt.');
      }
    };
    window.addEventListener('keyup', preventCapture);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keyup', preventCapture);
    };
  }, []);

  const handleVote = async (photoId, voteType) => {
    const token = localStorage.getItem('access_token');
    if (!token) return setShowAuth(true);

    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://medyart-backend.onrender.com'}/api/photos/${photoId}/vote/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ vote: voteType })
    });
    fetchPhotos();
  };

  const handleSendComment = async (photoId) => {
    const token = localStorage.getItem('access_token');
    if (!token) return setShowAuth(true);

    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://medyart-backend.onrender.com'}/api/photos/${photoId}/comment/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ text: commentText })
    });
    setCommentText('');
    fetchPhotos();
  };

  return (
    <div 
      className={`min-h-screen transition-all select-none ${theme === 'dark' ? 'bg-black text-white' : 'bg-gray-100 text-black'}`}
      style={{ backgroundColor: theme === 'dark' ? `rgba(0,0,0, ${bgOpacity / 100})` : `rgba(243,244,246, ${bgOpacity / 100})` }}
    >
      <Head>
        <title>MedyArt | Gallery</title>
      </Head>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Top Navbar */}
        <header className="flex flex-wrap justify-between items-center pb-6 mb-6 border-b border-neutral-800 gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-purple-500">MedyArt</h1>
            
            {/* Theme Toggle Button */}
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 bg-neutral-800 text-xs rounded-xl font-bold"
            >
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>

          {/* Background Transparency Slider */}
          <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 p-2 rounded-xl text-xs">
            <span>Opacity:</span>
            <input 
              type="range" 
              min="20" 
              max="100" 
              value={bgOpacity} 
              onChange={(e) => setBgOpacity(e.target.value)} 
              className="w-24 accent-purple-500 cursor-pointer"
            />
            <span>{bgOpacity}%</span>
          </div>

          {/* User Options */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <button onClick={() => setShowUpload(true)} className="bg-purple-600 px-4 py-2 rounded-xl font-bold text-sm">+ Upload</button>
                <button onClick={() => setShowAccount(true)} className="bg-neutral-800 px-4 py-2 rounded-xl font-bold text-sm">⚙️ Modify Account</button>
              </>
            ) : (
              <button onClick={() => setShowAuth(true)} className="bg-indigo-600 px-6 py-2 rounded-xl font-bold text-sm">Sign In</button>
            )}
          </div>
        </header>

        {/* Artwork Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <div key={photo.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-lg relative group">
              
              {/* Image Preview Container with Repetitive Protection Watermark */}
              <div className="relative aspect-square bg-black overflow-hidden pointer-events-none">
                <img src={photo.image_url} alt={photo.title} className="w-full h-full object-cover" />
                
                {/* Embedded MedyArt Watermark Matrix */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-25 font-black text-xs text-white uppercase tracking-widest pointer-events-none select-none">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="flex items-center justify-center -rotate-45">MedyArt Protected</div>
                  ))}
                </div>
              </div>

              {/* Interaction Details & Free Download */}
              <div className="p-4 space-y-3">
                <h3 className="font-bold text-lg">{photo.title}</h3>
                
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleVote(photo.id, 'like')} 
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold ${photo.user_vote === 'like' ? 'bg-green-600 text-white' : 'bg-neutral-800 text-neutral-300'}`}
                    >
                      👍 {photo.likes}
                    </button>
                    <button 
                      onClick={() => handleVote(photo.id, 'dislike')} 
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold ${photo.user_vote === 'dislike' ? 'bg-red-600 text-white' : 'bg-neutral-800 text-neutral-300'}`}
                    >
                      👎 {photo.dislikes}
                    </button>
                  </div>

                  <a 
                    href={photo.image_url} 
                    download 
                    className="bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs px-3 py-1.5 rounded-lg font-bold"
                  >
                    Free 480p Download
                  </a>
                </div>

                {/* Comment Drawer Trigger */}
                <button 
                  onClick={() => { setActiveCommentModal(photo.id); setCommentText(photo.comments.find(c => c.username === user)?.text || ''); }}
                  className="w-full bg-neutral-800 hover:bg-neutral-700 text-xs py-2 rounded-xl font-bold"
                >
                  💬 Comments ({photo.comments.length})
                </button>

                {/* Comment Interface */}
                {activeCommentModal === photo.id && (
                  <div className="mt-3 p-3 bg-neutral-950 border border-neutral-800 rounded-xl space-y-3">
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Write or edit your single comment..." 
                        value={commentText} 
                        onChange={(e) => setCommentText(e.target.value)} 
                        className="flex-1 bg-neutral-900 border border-neutral-800 p-2 text-xs rounded-lg text-white"
                      />
                      <button onClick={() => handleSendComment(photo.id)} className="bg-purple-600 text-xs px-3 py-2 rounded-lg font-bold">Post</button>
                    </div>

                    <div className="max-h-36 overflow-y-auto space-y-2">
                      {photo.comments.map((c) => (
                        <div key={c.id} className="text-xs bg-neutral-900 p-2 rounded-lg">
                          <span className="font-bold text-purple-400">{c.username}: </span>
                          <span>{c.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {showAuth && <AuthModal onClose={() => setShowAuth(false)} onSuccess={(u) => { setUser(u); setShowAuth(false); }} />}
        {showUpload && <UploadModal onClose={() => setShowUpload(false)} onUploadSuccess={() => { fetchPhotos(); setShowUpload(false); }} />}
        {showAccount && <AccountModal onClose={() => setShowAccount(false)} />}
      </main>
    </div>
  );
}
