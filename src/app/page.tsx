"use client";

import React, { useState, useEffect } from 'react';

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

  // Sync token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setToken(null);
    window.location.reload();
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError('');
    setUploadSuccess('');

    if (!file) {
      setUploadError('Please select an image file to upload.');
      return;
    }

    const currentToken = token || localStorage.getItem('token');
    if (!currentToken) {
      setUploadError('You must be signed in to upload artwork.');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('title', title || 'Untitled');
      formData.append('image', file); // Matches 'image' expected by Django view

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://medyart-backend.onrender.com';

      const response = await fetch(`${backendUrl}/api/photos/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          // DO NOT set Content-Type header manually for FormData!
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Upload failed.');
      }

      const data = await response.json();
      setUploadSuccess('Artwork published successfully!');
      setTitle('');
      setFile(null);
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen text-white bg-slate-900">
      {/* Navbar Section */}
      <nav className="flex justify-between items-center p-6 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
          MedyArt
        </h1>

        <div className="flex items-center gap-4">
          {token ? (
            <>
              <button 
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold transition"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <a 
                href="/login" 
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-semibold transition"
              >
                Sign In
              </a>
              <a 
                href="/register" 
                className="px-4 py-2 border border-purple-500 text-purple-300 hover:bg-purple-500/20 rounded-lg text-sm font-semibold transition"
              >
                Sign Up
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* Upload Modal Form Component */}
      <div className="max-w-lg mx-auto mt-12 p-6 bg-slate-800/90 rounded-2xl border border-white/10 shadow-xl">
        <h2 className="text-xl font-bold mb-4">Publish New Artwork</h2>

        {uploadError && (
          <div className="p-3 mb-4 text-sm bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
            {uploadError}
          </div>
        )}

        {uploadSuccess && (
          <div className="p-3 mb-4 text-sm bg-green-500/20 border border-green-500/50 rounded-lg text-green-300">
            {uploadSuccess}
          </div>
        )}

        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Artwork title..."
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">Image File</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
            />
          </div>

          <button
            type="submit"
            disabled={isUploading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold hover:opacity-90 disabled:opacity-50 transition"
          >
            {isUploading ? 'Processing...' : 'Publish Artwork'}
          </button>
        </form>
      </div>
    </div>
  );
}
