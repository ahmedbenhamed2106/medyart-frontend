import React, { useState } from 'react';

export default function UploadModal({ onClose }) {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please select an image file.');

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('image', file);

    const token = localStorage.getItem('access_token');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://medyart-backend.onrender.com'}/api/photos/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        onClose();
      } else {
        const data = await res.json();
        setError(data.detail || 'Upload failed.');
      }
    } catch {
      setError('Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 max-w-md w-full relative text-white">
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400">✕</button>
        <h3 className="text-xl font-bold mb-4">Publish New Artwork</h3>

        <form onSubmit={handleUpload} className="space-y-4">
          <input 
            type="text" 
            placeholder="Artwork Title" 
            required 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs" 
          />

          <div 
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-6 text-center ${isDragging ? 'border-purple-500 bg-purple-500/10' : 'border-neutral-800 bg-neutral-950'}`}
          >
            <div className="text-2xl mb-1">📁</div>
            <p className="text-xs text-neutral-400 mb-2">Drag & drop your image here</p>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="text-xs text-neutral-400" />
            {file && <p className="text-xs text-purple-400 mt-2 font-bold">{file.name}</p>}
          </div>

          {error && <p className="text-xs text-pink-400">{error}</p>}

          <button type="submit" disabled={loading} className="w-full bg-purple-600 font-bold py-2.5 rounded-xl text-sm">
            {loading ? 'Processing...' : 'Publish Artwork'}
          </button>
        </form>
      </div>
    </div>
  );
}
