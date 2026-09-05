import { useState, useEffect } from 'react';
import CheckoutForm from '../components/CheckoutForm';
import AuthModal from '../components/AuthModal';
import UploadModal from '../components/UploadModal';
import AccountModal from '../components/AccountModal';

export default function Home() {
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedTier, setSelectedTier] = useState('1080P');
  const [showCheckout, setShowCheckout] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [user, setUser] = useState(null);

  const PRICING = {
    'HD': '$3',
    '1080P': '$5',
    '1440P': '$7',
    '4K': '$9',
    '8K': '$12'
  };

  const fetchPhotos = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/photos/`)
      .then((res) => res.json())
      .then((data) => setPhotos(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  const isOwner = user && user.toLowerCase() === 'mehdi';

  return (
    <div className="min-h-screen text-white relative font-sans overflow-x-hidden bg-neutral-950">
      {/* 1. Global Full-Screen Static Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center pointer-events-none z-0 opacity-25"
        style={{ backgroundImage: "url('/public/bg.jpg'), url('/bg.jpg')" }}
      />

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-12">
        
        {/* Header */}
        <header className="flex flex-wrap justify-between items-center mb-12 border-b border-neutral-800/80 pb-6 gap-4 bg-neutral-900/60 backdrop-blur-lg p-5 rounded-2xl border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-cyan-400 p-[2px]">
              <div className="w-full h-full bg-neutral-950 rounded-[10px] flex items-center justify-center">
                <span className="font-black text-2xl bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">M</span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-wider bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                MedyArt
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Exclusive Digital Gallery</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Upload feature available for owner */}
                {isOwner && (
                  <button 
                    onClick={() => setShowUpload(true)}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md hover:opacity-90 transition-all"
                  >
                    + Upload Artwork
                  </button>
                )}

                {/* Account Settings for ALL logged in users */}
                <button 
                  onClick={() => setShowAccount(true)}
                  className="bg-neutral-800 border border-neutral-700 text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-neutral-700 transition-all"
                >
                  ⚙️ Modify Account
                </button>

                <button 
                  onClick={handleLogout}
                  className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-red-500/20 transition-all"
                >
                  Logout ({user})
                </button>
              </>
            ) : (
              <button 
                onClick={() => setShowAuth(true)}
                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md hover:opacity-90 transition-all"
              >
                Sign In
              </button>
            )}
          </div>
        </header>

        {/* Gallery Grid */}
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {photos.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-neutral-900/80 border border-neutral-800 rounded-3xl backdrop-blur-md">
              <p className="text-neutral-400 mb-4 font-medium">No artwork uploaded to MedyArt gallery yet.</p>
              {isOwner && (
                <button 
                  onClick={() => setShowUpload(true)}
                  className="bg-gradient-to-r from-indigo-600 to-pink-600 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-lg"
                >
                  Publish First Artwork
                </button>
              )}
            </div>
          ) : (
            photos.map((photo) => (
              <div 
                key={photo.id} 
                className="bg-neutral-900/80 border border-neutral-800 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:border-pink-500/50 transition-all cursor-pointer group"
                onClick={() => { setSelectedPhoto(photo); setShowCheckout(false); }}
              >
                <div className="relative select-none overflow-hidden">
                  <img 
                    src={photo.image_url || photo.image} 
                    alt={photo.title} 
                    className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500" 
                    onContextMenu={(e) => e.preventDefault()}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-xs text-cyan-300 font-bold">Click to view resolution tiers</span>
                  </div>
                </div>
                <div className="p-5 flex justify-between items-center">
                  <h3 className="font-bold text-base">{photo.title}</h3>
                  <button className="bg-gradient-to-r from-indigo-600 to-pink-600 text-white text-xs px-4 py-2 rounded-xl font-bold">
                    Purchase
                  </button>
                </div>
              </div>
            ))
          )}
        </main>

        {/* Modals */}
        {showAuth && (
          <AuthModal 
            onClose={() => setShowAuth(false)} 
            onLoginSuccess={(username) => setUser(username)} 
          />
        )}

        {showUpload && (
          <UploadModal 
            onClose={() => setShowUpload(false)} 
            onUploadSuccess={fetchPhotos} 
          />
        )}

        {showAccount && (
          <AccountModal 
            onClose={() => setShowAccount(false)} 
            currentUser={user}
            onUpdateSuccess={(newUsername) => setUser(newUsername)}
          />
        )}

        {selectedPhoto && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl max-w-md w-full shadow-2xl relative">
              <button 
                onClick={() => { setSelectedPhoto(null); setShowCheckout(false); }} 
                className="absolute top-4 right-4 text-neutral-400 hover:text-white text-xl"
              >
                &times;
              </button>
              <h2 className="text-xl font-extrabold mb-1">{selectedPhoto.title}</h2>
              <p className="text-xs text-neutral-400 mb-6">Select resolution tier to proceed with secure Stripe checkout.</p>
              
              {!showCheckout ? (
                <>
                  <div className="space-y-2 mb-6">
                    {Object.entries(PRICING).map(([tier, price]) => (
                      <button
                        key={tier}
                        onClick={() => setSelectedTier(tier)}
                        className={`w-full flex justify-between items-center p-3.5 rounded-xl border transition-all ${
                          selectedTier === tier 
                            ? 'border-pink-500 bg-pink-500/10 text-pink-500 font-bold' 
                            : 'border-neutral-800 bg-neutral-950 text-neutral-400'
                        }`}
                      >
                        <span>{tier} Resolution</span>
                        <span className="text-pink-500 font-extrabold">{price} USD</span>
                      </button>
                    ))}
                  </div>

                  <button 
                    className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold py-3.5 rounded-xl shadow-lg hover:opacity-90 transition-all"
                    onClick={() => setShowCheckout(true)}
                  >
                    Proceed to Payment ({PRICING[selectedTier]})
                  </button>
                </>
              ) : (
                <CheckoutForm 
                  photo={selectedPhoto} 
                  resolution={selectedTier} 
                  onClose={() => { setSelectedPhoto(null); setShowCheckout(false); }} 
                />
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
