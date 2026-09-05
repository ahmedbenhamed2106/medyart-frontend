import { useState } from 'react';

export default function UploadModal({ onClose, onUploadSuccess }) {
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/photos/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, image_url: imageUrl })
      });

      if (res.ok) {
        setMessage('Artwork published!');
        onUploadSuccess();
        setTimeout(() => onClose(), 1200);
      } else {
        const errData = await res.json();
        setMessage(`Error: ${JSON.stringify(errData)}`);
      }
    } catch (err) {
      setMessage('Failed to publish photo.');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl max-w-md w-full shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-white text-xl">&times;</button>
        <h2 className="text-xl font-bold mb-4">Upload New Artwork</h2>

        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="text-xs text-neutral-400 block mb-1">Artwork Title</label>
            <input 
              type="text" 
              required 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Cyberpunk Cityscape"
              className="w-full p-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs text-neutral-400 block mb-1">Image URL</label>
            <input 
              type="url" 
              required 
              value={imageUrl} 
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full p-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {message && <p className="text-xs font-medium text-indigo-400 text-center">{message}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl transition-all shadow-md disabled:opacity-50"
          >
            {loading ? 'Publishing...' : 'Publish Artwork'}
          </button>
        </form>
      </div>
    </div>
  );
}
