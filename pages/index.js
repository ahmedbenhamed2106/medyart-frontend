import { useState, useEffect } from 'react';
import CheckoutForm from '../components/CheckoutForm';
import AuthModal from '../components/AuthModal';
import UploadModal from '../components/UploadModal';

export default function Home() {
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedTier, setSelectedTier] = useState('1080P');
  const [showCheckout, setShowCheckout] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

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

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 p-8 font-sans transition-colors duration-300">
        
        {/* Header */}
        <header className="flex flex-wrap justify-between items-center mb-12 border-b border-neutral-200 dark:border-neutral-800 pb-4 gap-4">
          <h1 className="text-3xl font-extrabold tracking-wider text-indigo-600 dark:text-indigo-500">MedyArt</h1>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-neutral-200 dark:bg-neutral-800 text-xs font-semibold hover:opacity-80 transition-opacity"
            >
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowUpload(true)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all"
                >
                  + Upload Artwork
                </button>
                <button 
                  onClick={handleLogout}
                  className="bg-neutral-200 dark:bg-neutral-800 text-xs font-semibold px-3 py-2 rounded-lg transition-all"
                >
                  Logout ({user})
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowAuth(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all"
              >
                Account / Sign In
              </button>
            )}
          </div>
        </header>

        {/* Gallery Grid */}
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {photos.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl">
              <p className="text-neutral-500 mb-4">No artwork available in the gallery yet.</p>
              {user ? (
                <button 
                  onClick={() => setShowUpload(true)}
                  className="bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-xl"
                >
                  Publish First Artwork
                </button>
              ) : (
                <button 
                  onClick={() => setShowAuth(true)}
                  className="bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-xl"
                >
                  Sign In to Upload Artwork
                </button>
              )}
            </div>
          ) : (
            photos.map((photo) => (
              <div 
                key={photo.id} 
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-md hover:border-indigo-500 dark:hover:border-indigo-500 transition-all cursor-pointer"
                onClick={() => { setSelectedPhoto(photo); setShowCheckout(false); }}
              >
                <div className="relative select-none">
                  <img 
                    src={photo.image_url} 
                    alt={photo.title} 
                    className="w-full h-64 object-cover" 
                    onContextMenu={(e) => e.preventDefault()}
                  />
                </div>
                <div className="p-4 flex justify-between items-center">
                  <h3 className="font-semibold text-lg">{photo.title}</h3>
                  <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition-colors">
                    Purchase
                  </button>
                </div>
              </div>
            ))
          )}
        </main>

        {/* Auth Modal */}
        {showAuth && (
          <AuthModal 
            onClose={() => setShowAuth(false)} 
            onLoginSuccess={(username) => setUser(username)} 
          />
        )}

        {/* Upload Modal */}
        {showUpload && (
          <UploadModal 
            onClose={() => setShowUpload(false)} 
            onUploadSuccess={fetchPhotos} 
          />
        )}

        {/* Purchase Modal */}
        {selectedPhoto && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl max-w-md w-full shadow-2xl relative">
              <button 
                onClick={() => { setSelectedPhoto(null); setShowCheckout(false); }} 
                className="absolute top-4 right-4 text-neutral-400 hover:text-white text-xl"
              >
                &times;
              </button>
              <h2 className="text-xl font-bold mb-1">{selectedPhoto.title}</h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6">Select resolution tier and proceed to secure checkout.</p>
              
              {!showCheckout ? (
                <>
                  <div className="space-y-2 mb-6">
                    {Object.entries(PRICING).map(([tier, price]) => (
                      <button
                        key={tier}
                        onClick={() => setSelectedTier(tier)}
                        className={`w-full flex justify-between items-center p-3 rounded-lg border transition-all ${
                          selectedTier === tier 
                            ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-white font-semibold' 
                            : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400'
                        }`}
                      >
                        <span>{tier} Resolution</span>
                        <span className="text-indigo-600 dark:text-indigo-400">{price} USD</span>
                      </button>
                    ))}
                  </div>

                  <button 
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-all shadow-md"
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
