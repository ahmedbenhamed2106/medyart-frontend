import { useState } from 'react';

export default function UploadModal({ onClose, onUploadSuccess }) {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select an image file.');
      return;
    }

    setLoading(true);
    setMessage('Publishing artwork...');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('image', file);

    try {
      const token = localStorage.getItem('access_token');
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/photos/`, {
        method: 'POST',
        headers: headers,
        body: formData
      });

      if (res.ok) {
        setMessage('Artwork published successfully!');
        onUploadSuccess();
        setTimeout(() => onClose(), 800);
      } else {
        const errData = await res.json().catch(() => ({}));
        setMessage(`Error: ${errData.detail || 'Failed to post artwork'}`);
      }
    } catch {
      setMessage('Network error. Check backend deployment.');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl max-w-md w-full shadow-2xl relative text-white">
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-white text-xl">&times;</button>
        <h2 className="text-xl font-extrabold mb-4 bg-gradient-to-r from-pink-500 to-cyan-400 bg-clip-text text-transparent">
          Publish New Artwork
        </h2>

        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="text-xs text-neutral-400 block mb-1 font-medium">Artwork Title</label>
            <input 
              type="text" 
              required 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., MedyArt Studio"
              className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-sm focus:outline-none text-white"
            />
          </div>

          <div>
            <label className="text-xs text-neutral-400 block mb-1 font-medium">Image File</label>
            <input 
              type="file" 
              accept="image/*" 
              required
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full p-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-300"
            />
          </div>

          {message && <p className="text-xs font-medium text-pink-400 text-center">{message}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-90 text-white font-bold py-3 rounded-xl transition-all shadow-lg disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Publish Artwork'}
          </button>
        </form>
      </div>
    </div>
  );
}
