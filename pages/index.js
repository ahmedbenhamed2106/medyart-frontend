import { useState, useEffect } from 'react';

export default function Home() {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/photos/`)
      .then((res) => res.json())
      .then((data) => setPhotos(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>MedyArt Gallery</h1>
      <p>Welcome to MedyArt SaaS platform.</p>
      <div>
        {photos.map((photo) => (
          <div key={photo.id} style={{ border: '1px solid #ccc', margin: '1rem 0', padding: '1rem' }}>
            <h3>{photo.title}</h3>
            <img src={photo.image_url} alt={photo.title} style={{ maxWidth: '300px' }} />
          </div>
        ))}
      </div>
    </div>
  );
}
