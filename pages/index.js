import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AuthModal from '../components/AuthModal';
import UploadModal from '../components/UploadModal';
import AccountModal from '../components/AccountModal';
import CheckoutForm from '../components/CheckoutForm';

const PRICING = {
  '4K': '$10',
  '1080P': '$5',
  '4K_PRINT': '$25',
  'ORIGINAL': '$100'
};

export default function Home() {
  const [photos, setPhotos] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedTier, setSelectedTier] = useState('1080P');
  const [showAuth, setShowAuth] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const fetchPhotos = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://medyart-backend.onrender.com'}/api/photos/`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPhotos(data);
      })
      .catch((err) => console.error("Error fetching photos:", err));
  };

  useEffect(() => {
    fetchPhotos();
    const token = localStorage.getItem('access_token');
    const savedUser = localStorage.getItem('username');
    if (token && savedUser) {
      setUser(savedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500 selection:text-white">
      <Head>
        <title>MedyArt | Exclusive Digital Gallery</title>
        <meta name="description" content="Digital Art Gallery" />
        <link rel="icon" href="/icon.jpeg" />
      </Head>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center pb-8 mb-8 border-b border-neutral-800">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <img src="/icon.jpeg" alt="Logo" className="w-12 h-12 rounded-xl border border-purple-500 object-cover" onError={(e) => e.target.style.display = 'none'} />
            <div>
              <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-indigo-500 to-pink-500 bg-clip-text text-transparent">
                MedyArt
              </h1>
              <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Exclusive Digital Gallery</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <button 
                  onClick={() => setShowUpload(true)}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-all shadow-lg"
                >
                  + Upload Artwork
                </button>
                <button 
                  onClick={() => setShowAccount(true)}
                  className="bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-all"
                >
                  ⚙️ Modify Account
                </button>
                <button 
                  onClick={handleLogout}
                  className="bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 font-bold text-sm px-4 py-2.5 rounded-xl transition-all"
                >
                  Logout ({user})
                </button>
              </>
            ) : (
              <button 
                onClick={() => setShowAuth(true)}
                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-90 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all shadow-lg"
              >
                Sign In
              </button>
            )}
          </div>
        </header>

        {/* Gallery Grid */}
        {photos.length === 0 ? (
          <div className="text-center py-20 bg-neutral-900/50 border border-neutral-800 rounded-3xl">
            <p className="text-neutral-400 font-medium mb-4">No artwork uploaded to MedyArt gallery yet.</p>
            {user && (
              <button onClick={() => setShowUpload(true)} className="bg-purple-600 text-white font-bold px-6 py-2.5 rounded-xl">
                Publish First Artwork
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo) => (
              <div key={photo.id} className="bg-neutral-900/80 border border-neutral-800 rounded-2xl overflow-hidden shadow-lg group hover:border-purple-500/50 transition-all">
                <div className="relative aspect-square bg-black overflow-hidden">
                  <img src={photo.image_url || photo.image} alt={photo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-xs text-cyan-300 font-bold">Click to view resolution options</span>
                  </div>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <h3 className="font-bold text-lg text-white truncate">{photo.title}</h3>
                  <button 
                    onClick={() => { setSelectedPhoto(photo); setShowCheckout(true); }}
                    className="bg-purple-600/20 border border-purple-500 text-purple-300 hover:bg-purple-600 hover:text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                  >
                    Buy Resolution
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modals */}
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} onSuccess={(username) => { setUser(username); setShowAuth(false); }} />}
        {showUpload && <UploadModal onClose={() => setShowUpload(false)} onUploadSuccess={() => { fetchPhotos(); setShowUpload(false); }} />}
        {showAccount && <AccountModal onClose={() => setShowAccount(false)} onUpdateSuccess={(newUsername) => { setUser(newUsername); localStorage.setItem('username', newUsername); }} />}

        {/* Resolution & Stripe Checkout Modal */}
        {showCheckout && selectedPhoto && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 max-w-md w-full relative">
              <button onClick={() => setShowCheckout(false)} className="absolute top-4 right-4 text-neutral-400 hover:text-white">✕</button>
              <h3 className="text-xl font-bold mb-2">{selectedPhoto.title}</h3>
              <p className="text-xs text-neutral-400 mb-6">Select resolution tier to proceed with Secure Stripe checkout.</p>
              
              <div className="space-y-3 mb-6">
                {Object.entries(PRICING).map(([tier, price]) => (
                  <button 
                    key={tier}
                    onClick={() => setSelectedTier(tier)}
                    className={`w-full flex justify-between items-center p-3.5 rounded-xl border transition-all ${selectedTier === tier ? 'border-purple-500 bg-purple-500/10 text-white' : 'border-neutral-800 text-neutral-400 hover:border-neutral-700'}`}
                  >
                    <span className="font-bold">{tier}</span>
                    <span className="text-pink-500 font-extrabold">{price} USD</span>
                  </button>
                ))}
              </div>

              <CheckoutForm photo={selectedPhoto} resolution={selectedTier} onClose={() => setShowCheckout(false)} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
