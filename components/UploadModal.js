import { useState } from 'react';

export default function UploadModal({ onClose, onUploadSuccess }) {
  const [title, setTitle] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setMessage('Please select a valid image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImageBase64(reader.result);
      setMessage('');
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!imageBase64) {
      setMessage('Please choose or drop an image first.');
      return;
    }
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/photos/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, image_url: imageBase64 })
      });

      if (res.ok) {
        setMessage('Artwork published!');
        onUploadSuccess();
        setTimeout(() => onClose(), 1200);
      } else {
        const errData = await res.json();
        setMessage(`Upload failed: ${JSON.stringify(errData)}`);
      }
    } catch (err) {
      setMessage('Failed to publish photo.');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl max-w-md w-full shadow-2xl relative text-white">
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-white text-xl">&times;</button>
        <h2 className="text-xl font-extrabold mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
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
              placeholder="e.g., Cyberpunk Sunset"
              className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-sm focus:outline-none focus:border-indigo-500 text-white"
            />
          </div>

          <div>
            <label className="text-xs text-neutral-400 block mb-1 font-medium">Upload Image (Drag & Drop or Browse)</label>
            <div 
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                dragActive ? 'border-cyan-400 bg-cyan-500/10' : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'
              }`}
            >
              {imageBase64 ? (
                <div className="space-y-2">
                  <img src={imageBase64} alt="Preview" className="h-32 mx-auto rounded-lg object-cover" />
                  <p className="text-xs text-cyan-400 font-semibold">Image Loaded Ready!</p>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <span className="text-3xl block mb-2">📁</span>
                  <span className="text-xs text-neutral-400 block">Drag & Drop your image file here, or <span className="text-cyan-400 underline font-semibold">Browse</span></span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
                    className="hidden" 
                  />
                </label>
              )}
            </div>
          </div>

          {message && <p className="text-xs font-medium text-pink-400 text-center">{message}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-90 text-white font-bold py-3 rounded-xl transition-all shadow-lg disabled:opacity-50"
          >
            {loading ? 'Publishing...' : 'Publish Artwork'}
          </button>
        </form>
      </div>
    </div>
  );
}
