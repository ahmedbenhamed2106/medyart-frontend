import React, { useState, useEffect, useRef } from 'react';

const TRANSLATIONS = {
  en: { 
    title: "MedyArt", login: "Sign In to Gallery", email: "Email Address", password: "Password", 
    upload: "Publish Artwork", settings: "Security & 2FA", logout: "Logout", opacity: "Bg Opacity", 
    theme: "Theme", enable2FA: "Enable 2FA", disable2FA: "Disable 2FA", protected: "Protected • MedyArt", 
    publish: "Publish Artwork", artTitle: "Artwork Title", imageUrl: "Image Direct Link (Optional)", 
    dragDrop: "Drag & drop artwork here, or click to browse", autoSession: "Persistent Session Active"
  },
  fr: { 
    title: "MedyArt", login: "Connexion Galerie", email: "Adresse Email", password: "Mot de passe", 
    upload: "Publier une Œuvre", settings: "Sécurité & 2FA", logout: "Déconnexion", opacity: "Opacité Fond", 
    theme: "Thème", enable2FA: "Activer 2FA", disable2FA: "Désactiver 2FA", protected: "Protégé • MedyArt", 
    publish: "Publier L'Œuvre", artTitle: "Titre de L'Œuvre", imageUrl: "Lien Direct Image (Optionnel)", 
    dragDrop: "Glissez-déposez l'image ici, ou cliquez pour parcourir", autoSession: "Session Persistante Active"
  },
  ar: { 
    title: "ميدي آرت", login: "تسجيل الدخول للمعرض", email: "البريد الإلكتروني", password: "كلمة المرور", 
    upload: "نشر عمل فني", settings: "الأمان و 2FA", logout: "تسجيل الخروج", opacity: "شفافية الخلفية", 
    theme: "المظهر", enable2FA: "تفعيل 2FA", disable2FA: "إلغاء 2FA", protected: "محمي • MedyArt", 
    publish: "نشر الآن", artTitle: "عنوان العمل الفني", imageUrl: "رابط الصورة المباشر (اختياري)", 
    dragDrop: "اسحب وأسقط الصورة هنا، أو انقر للاختيار", autoSession: "الجلسة المحفوظة نشطة"
  }
};

export default function App() {
  const [lang, setLang] = useState('en');
  const [theme, setTheme] = useState('dark');
  const [glassOpacity, setGlassOpacity] = useState(0.85);

  // Auto-Login Session Management
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('medyart_user_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 2FA Security State
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(() => {
    return localStorage.getItem('medyart_2fa') === 'true';
  });
  const [otpInput, setOtpInput] = useState('');

  // Drag & Drop & Upload State
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [artTitle, setArtTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = useRef(null);

  // Gallery Storage Persistence
  const [photos, setPhotos] = useState(() => {
    const saved = localStorage.getItem('medyart_gallery_items');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: "Neon Cybernetic Art", image_url: "/bg.jpeg", likes: 42 }
    ];
  });

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const isDark = theme === 'dark';

  useEffect(() => {
    localStorage.setItem('medyart_gallery_items', JSON.stringify(photos));
  }, [photos]);

  useEffect(() => {
    localStorage.setItem('medyart_2fa', is2FAEnabled);
  }, [is2FAEnabled]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email.includes('@')) return alert("Please enter a valid email address.");
    const userData = { email, loggedInAt: new Date().toISOString() };
    setUser(userData);
    localStorage.setItem('medyart_user_session', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('medyart_user_session');
  };

  // Drag and Drop File Handlers
  const processFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedFile(reader.result);
      reader.readAsDataURL(file);
    } else {
      alert("Invalid file type. Please upload an image (PNG, JPG, WEBP).");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handlePublish = (e) => {
    e.preventDefault();
    const finalImage = selectedFile || imageUrl;
    if (!artTitle.trim() || !finalImage) {
      return alert("Title and image source are required!");
    }

    const newItem = {
      id: Date.now(),
      title: artTitle,
      image_url: finalImage,
      likes: 0
    };

    setPhotos([newItem, ...photos]);
    setArtTitle('');
    setImageUrl('');
    setSelectedFile(null);
  };

  const toggleLike = (id) => {
    setPhotos(photos.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: isDark ? '#0a0a12' : '#f3f4f6',
      backgroundImage: `linear-gradient(${isDark ? `rgba(10,10,18,${glassOpacity})` : `rgba(243,244,246,${glassOpacity})`}, ${isDark ? `rgba(10,10,18,${glassOpacity})` : `rgba(243,244,246,${glassOpacity})`}), url('/bg.jpeg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      color: isDark ? '#ffffff' : '#111827',
      transition: 'all 0.3s ease'
    }}>
      {/* Top Navbar */}
      <nav style={{
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: isDark ? 'rgba(18, 18, 30, 0.85)' : 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img 
            src="/icon.jpeg" 
            alt="MedyArt Icon" 
            onError={(e) => { e.target.style.display = 'none'; }}
            style={{ width: 42, height: 42, borderRadius: '12px', border: '2px solid #a855f7', objectFit: 'cover' }} 
          />
          <span style={{ fontSize: '1.6rem', fontWeight: '800', background: 'linear-gradient(135deg, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {t.title}
          </span>
        </div>

        {/* Global Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Light / Dark Mode Switcher */}
          <button 
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid #a855f7', background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', color: isDark ? '#fff' : '#000', cursor: 'pointer', fontWeight: '600' }}
          >
            {isDark ? '☀️ Light' : '🌙 Dark'}
          </button>

          {/* Background Opacity Slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)', padding: '6px 14px', borderRadius: '20px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>{t.opacity}</span>
            <input 
              type="range" 
              min="0.1" 
              max="0.95" 
              step="0.05" 
              value={glassOpacity} 
              onChange={(e) => setGlassOpacity(parseFloat(e.target.value))}
              style={{ accentColor: '#a855f7', width: '80px', cursor: 'pointer' }}
            />
          </div>

          {/* Language Picker */}
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '14px', border: '1px solid #a855f7', background: isDark ? '#12121c' : '#fff', color: isDark ? '#fff' : '#000', fontWeight: '600' }}
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="ar">العربية</option>
          </select>

          {user && (
            <>
              <button 
                onClick={() => setShow2FAModal(!show2FAModal)} 
                style={{ background: is2FAEnabled ? 'rgba(16,185,129,0.2)' : 'rgba(168,85,247,0.2)', border: `1px solid ${is2FAEnabled ? '#10b981' : '#a855f7'}`, color: isDark ? '#fff' : '#000', padding: '8px 14px', borderRadius: '14px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                🔒 2FA {is2FAEnabled ? "ON" : "OFF"}
              </button>
              <button 
                onClick={handleLogout} 
                style={{ background: '#ef4444', border: 'none', color: '#fff', padding: '8px 14px', borderRadius: '14px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                {t.logout}
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Main Container */}
      <div style={{ maxWidth: '960px', margin: '2rem auto', padding: '0 1rem' }}>

        {/* 2FA Configuration Panel */}
        {show2FAModal && user && (
          <div className={`glass-panel ${isDark ? 'glass-panel-dark' : 'glass-panel-light'}`} style={{ padding: '2rem', marginBottom: '2rem', border: '2px solid #a855f7' }}>
            <h3 style={{ margin: 0 }}>🔐 2-Factor Authentication (2FA)</h3>
            <p style={{ margin: '0.5rem 0 1rem' }}>Account: <strong>{user.email}</strong></p>
            <p>Security Status: <strong style={{ color: is2FAEnabled ? '#10b981' : '#ef4444' }}>{is2FAEnabled ? "PROTECTED (2FA ACTIVE)" : "UNPROTECTED"}</strong></p>

            {!is2FAEnabled && (
              <div style={{ margin: '1rem 0', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input 
                  type="text" 
                  placeholder="Enter Authenticator Code (e.g. 123456)" 
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  style={{ padding: '10px 14px', borderRadius: '12px', border: '1px solid #a855f7', background: isDark ? '#0d0d16' : '#fff', color: isDark ? '#fff' : '#000' }}
                />
              </div>
            )}

            <button 
              onClick={() => {
                setIs2FAEnabled(!is2FAEnabled);
                setOtpInput('');
              }}
              style={{ padding: '10px 20px', borderRadius: '12px', border: 'none', background: is2FAEnabled ? '#ef4444' : '#10b981', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {is2FAEnabled ? t.disable2FA : t.enable2FA}
            </button>
          </div>
        )}

        {/* Login Form (Displayed if no auto-login session exists) */}
        {!user ? (
          <div className={`glass-panel ${isDark ? 'glass-panel-dark' : 'glass-panel-light'}`} style={{ padding: '3rem 2rem', maxWidth: '420px', margin: '4rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <img src="/icon.jpeg" alt="Logo" onError={(e) => { e.target.style.display = 'none'; }} style={{ width: 64, height: 64, borderRadius: '20px', border: '2px solid #a855f7', marginBottom: '0.75rem' }} />
              <h2 style={{ margin: 0, fontWeight: '800' }}>{t.login}</h2>
            </div>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>{t.email}</label>
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1px solid #a855f7', background: isDark ? '#0d0d16' : '#fff', color: isDark ? '#fff' : '#000', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>{t.password}</label>
                <input 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1px solid #a855f7', background: isDark ? '#0d0d16' : '#fff', color: isDark ? '#fff' : '#000', outline: 'none' }}
                />
              </div>

              <button type="submit" style={{ width: '100%', padding: '14px', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg, #a855f7, #ec4899)', color: '#fff', fontWeight: '800', cursor: 'pointer', fontSize: '1rem', marginTop: '0.5rem' }}>
                {t.login}
              </button>
            </form>
          </div>
        ) : (
          /* Main Dashboard & Gallery */
          <>
            {/* Interactive Upload Panel with Drag & Drop */}
            <div className={`glass-panel ${isDark ? 'glass-panel-dark' : 'glass-panel-light'}`} style={{ padding: '2rem', marginBottom: '2.5rem' }}>
              <h2 style={{ marginTop: 0, marginBottom: '1.5rem', fontWeight: '800' }}>✨ {t.upload}</h2>
              <form onSubmit={handlePublish} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <input 
                  type="text" 
                  placeholder={t.artTitle} 
                  value={artTitle} 
                  onChange={(e) => setArtTitle(e.target.value)}
                  style={{ width: '100%', padding: '14px 18px', borderRadius: '16px', border: '1px solid #a855f7', background: isDark ? '#0d0d16' : '#fff', color: isDark ? '#fff' : '#000', fontSize: '1rem', outline: 'none' }}
                />

                {/* Drag and Drop Container */}
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  className={isDragging ? 'drag-active' : ''}
                  style={{
                    padding: '3rem 2rem',
                    borderRadius: '20px',
                    border: `2px dashed ${isDragging ? '#ec4899' : '#a855f7'}`,
                    backgroundColor: isDragging ? 'rgba(236,72,153,0.1)' : 'rgba(168,85,247,0.05)',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: isDark ? '#e9d5ff' : '#6b21a8' }}>
                    {selectedFile ? "✅ Image File Loaded! Click or Drag to Replace" : `📁 ${t.dragDrop}`}
                  </p>
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => e.target.files[0] && processFile(e.target.files[0])} 
                    style={{ display: 'none' }} 
                  />
                </div>

                {/* Optional Direct URL Fallback */}
                <input 
                  type="text" 
                  placeholder={t.imageUrl} 
                  value={imageUrl} 
                  onChange={(e) => { setImageUrl(e.target.value); setSelectedFile(null); }}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1px solid rgba(168,85,247,0.5)', background: isDark ? '#0d0d16' : '#fff', color: isDark ? '#fff' : '#000', fontSize: '0.9rem', outline: 'none' }}
                />

                {/* Local Preview */}
                {selectedFile && (
                  <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                    <img src={selectedFile} alt="Preview" style={{ maxHeight: '180px', borderRadius: '16px', border: '2px solid #a855f7', objectFit: 'contain' }} />
                  </div>
                )}

                <button type="submit" style={{ padding: '16px', borderRadius: '16px', border: 'none', background: 'linear-gradient(135deg, #a855f7, #ec4899)', color: '#fff', fontWeight: '800', cursor: 'pointer', fontSize: '1.05rem' }}>
                  {t.publish}
                </button>
              </form>
            </div>

            {/* Gallery Grid Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '1.75rem' }}>
              {photos.map((photo) => (
                <div key={photo.id} className={`glass-panel ${isDark ? 'glass-panel-dark' : 'glass-panel-light'}`} style={{ overflow: 'hidden' }}>
                  {/* Protected Artwork Image Frame */}
                  <div style={{ position: 'relative', height: '240px', backgroundColor: '#000' }}>
                    <img src={photo.image_url} alt={photo.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div className="watermark-overlay">
                      <span className="watermark-text">{t.protected}</span>
                    </div>
                  </div>

                  <div style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontWeight: '700', fontSize: '1.1rem' }}>{photo.title}</h4>
                    <button 
                      onClick={() => toggleLike(photo.id)}
                      style={{ background: 'rgba(236,72,153,0.15)', border: '1px solid #ec4899', color: '#ec4899', padding: '6px 12px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      ❤️ {photo.likes}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
