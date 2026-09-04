import { useState, useEffect } from 'react';

export default function Home() {
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedTier, setSelectedTier] = useState('1080P');

  const PRICING = {
    'HD': '$3',
    '1080P': '$5',
    '1440P': '$7',
    '4K': '$9',
    '8K': '$12'
  };

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/photos/`)
      .then((res) => res.json())
      .then((data) => setPhotos(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-8 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center mb-12 border-b border-neutral-800 pb-4">
        <h1 className="text-3xl font-extrabold tracking-wider text-indigo-500">MedyArt</h1>
        <span className="text-sm text-neutral-400">Exclusive Digital Gallery</span>
      </header>

      {/* Gallery Grid */}
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {photos.length === 0 ? (
          <p className="text-neutral-500 col-span-full text-center py-12">No artwork available yet.</p>
        ) : (
          photos.map((photo) => (
            <div 
              key={photo.id} 
              className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-lg hover:border-indigo-500 transition-all cursor-pointer"
              onClick={() => setSelectedPhoto(photo)}
            >
              <div className="relative select-none">
                <img 
                  src={photo.image_url} 
                  alt={photo.title} 
                  className="w-full h-64 object-cover" 
                  onContextMenu={(e) => e.preventDefault()}
                />
                <div className="absolute inset-0 bg-transparent" />
              </div>
              <div className="p-4 flex justify-between items-center">
                <h3 className="font-semibold text-lg">{photo.title}</h3>
                <button className="bg-indigo-600 hover:bg-indigo-500 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors">
                  Purchase
                </button>
              </div>
            </div>
          ))
        )}
      </main>

      {/* Purchase / Tier Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl max-w-md w-full shadow-2xl relative">
            <button 
              onClick={() => setSelectedPhoto(null)} 
              className="absolute top-4 right-4 text-neutral-400 hover:text-white text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-2">{selectedPhoto.title}</h2>
            <p className="text-xs text-neutral-400 mb-6">Select resolution tier to proceed with secure Stripe checkout.</p>
            
            <div className="space-y-2 mb-6">
              {Object.entries(PRICING).map(([tier, price]) => (
                <button
                  key={tier}
                  onClick={() => setSelectedTier(tier)}
                  className={`w-full flex justify-between items-center p-3 rounded-lg border transition-all ${
                    selectedTier === tier 
                      ? 'border-indigo-500 bg-indigo-500/10 text-white font-semibold' 
                      : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <span>{tier} Resolution</span>
                  <span className="text-indigo-400">{price} USD</span>
                </button>
              ))}
            </div>

            <button 
              className="w-full bg-indigo-600 hover:bg-indigo-500 font-semibold py-3 rounded-xl transition-all shadow-md"
              onClick={() => alert(`Initiating payment for ${selectedTier} at ${PRICING[selectedTier]}`)}
            >
              Checkout with Stripe ({PRICING[selectedTier]})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
