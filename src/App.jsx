import React, { useState, useEffect } from 'react';

const TRANSLATIONS = {
  en: { title: "MedyArt", login: "Email Sign In", email: "Email Address", password: "Password", upload: "Publish Artwork", settings: "Security & 2FA", logout: "Logout", opacity: "Background Opacity", theme: "Theme", enable2FA: "Enable 2FA", disable2FA: "Disable 2FA", protected: "Protected • MedyArt", publish: "Publish Artwork", artTitle: "Artwork Title", imageUrl: "Image Link", dragDrop: "Upload File" },
  fr: { title: "MedyArt", login: "Connexion", email: "Email", password: "Mot de passe", upload: "Publier", settings: "Sécurité & 2FA", logout: "Déconnexion", opacity: "Opacité Fond", theme: "Thème", enable2FA: "Activer 2FA", disable2FA: "Désactiver 2FA", protected: "Protégé • MedyArt", publish: "Publier", artTitle: "Titre", imageUrl: "Lien Image", dragDrop: "Choisir un fichier" },
  ar: { title: "ميدي آرت", login: "تسجيل الدخول", email: "البريد الإلكتروني", password: "كلمة المرور", upload: "نشر عمل", settings: "الأمان و 2FA", logout: "خروج", opacity: "شفافية الخلفية", theme: "المظهر", enable2FA: "تفعيل 2FA", disable2FA: "إلغاء 2FA", protected: "محمي • MedyArt", publish: "نشر", artTitle: "العنوان", imageUrl: "رابط الصورة", dragDrop: "اختر ملف" }
};

export default function App() {
  const [lang, setLang] = useState('en');
  const [theme, setTheme] = useState('dark'); // 'dark' or 'light'
  const [glassOpacity, setGlassOpacity] = useState(0.85);

  // Persistent Auto-Login State
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
  const [otpCode, setOtpCode] = useState('');

  // Art Gallery & Upload State
  const [artTitle, setArtTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [photos, setPhotos] = useState(() => {
    const saved = localStorage.getItem('medyart_gallery_items');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: "Cyber Canvas", image_url: "/bg.jpeg", likes: 12 }
    ];
  });

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const isDark = theme === 'dark';

  // Save persistent data
  useEffect(() => {
    localStorage.setItem('medyart_gallery_items', JSON.stringify(photos));
  }, [photos]);

  useEffect(() => {
    localStorage.setItem('medyart_2fa', is2FAEnabled);
  }, [is2FAEnabled]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email.includes('@')) return alert("Enter a valid email!");
    const userData = { email, loggedInAt: new Date().toISOString() };
    setUser(userData);
    localStorage.setItem('medyart_user_session', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('medyart_user_session');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedFile(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = (e) => {
    e.preventDefault();
    const finalImg = selectedFile || imageUrl;
    if (!artTitle || !finalImg) return alert("Title and image are required!");

    setPhotos([{ id: Date.now(), title: artTitle, image_url: finalImg, likes: 0 }, ...photos]);
    setArtTitle('');
    setImageUrl('');
    setSelectedFile(null);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: isDark ? '#0a0a12' : '#f3f4f6',
      backgroundImage: `linear-gradient(${isDark ? 'rgba(10,10,18,0.85), rgba(10,10,18,0.85)' : 'rgba(255,255,255,0.75), rgba(255,255,255,0.75)'}), url('/bg.jpeg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      color: isDark ? '#ffffff' : '#111827',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      transition: 'all 0.3s ease'
    }}>
      {/* Modern Curved Navigation Bar */}
      <nav style={{
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: isDark ? `rgba(18, 18, 30, ${glassOpacity})` : `rgba(255, 255, 255, ${glassOpacity})`,
        backdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        {/* Brand Icon & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img 
            src="/icon.jpeg" 
            alt="Logo" 
            onError={(e) => { e.target.style.display = 'none'; }}
            style={{ width: 40, height: 40, borderRadius: '12px', border: '2px solid #a855f7', objectFit: 'cover' }} 
          />
          <span style={{ fontSize: '1.5rem', fontWeight: '800', background: 'linear-gradient(135deg, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {t.title}
          </span>
        </div>

        {/* Dynamic Controls Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Light / Dark Mode Toggle */}
          <button 
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid rgba(168,85,247,0.4)',
              background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
              color: isDark ? '#fff' : '#000',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            {isDark ? '☀️ Light' : '🌙 Dark'}
          </button>

          {/* Background Opacity Slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)', padding: '4px 12px', borderRadius: '20px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>{t.opacity}</span>
            <input 
              type="range" 
              min="0.2" 
              max="0.95" 
              step="0.05" 
              value={glassOpacity} 
              onChange={(e) => setGlassOpacity(parseFloat(e.target.value))}
              style={{ accentColor: '#a855f7', width: '70px', cursor: 'pointer' }}
            />
          </div>

          {/* Language Selector */}
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value)}
            style={{ padding: '6px 10px', borderRadius: '12px', border: '1px solid rgba(168,85,247,0.4)', background: isDark ? '#12121c' : '#fff', color: isDark ? '#fff' : '#000', fontWeight: '600' }}
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="ar">العربية</option>
          </select>

          {user && (
            <>
              <button onClick={() => setShow2FAModal(!show2FAModal)} style={{ background: 'rgba(168,85,247,0.2)', border: '1px solid #a855f7', color: isDark ? '#fff' : '#000', padding: '6px 12px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600' }}>
                🔒 2FA
              </button>
              <button onClick={handleLogout} style={{ background: '#ef4444', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600' }}>
                {t.logout}
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Main Glass Container */}
      <div style={{ maxWidth: '950px', margin: '2rem auto', padding: '0 1rem' }}>

        {/* 2FA Modal */}
        {show2FAModal && user && (
          <div style={{
            backgroundColor: isDark ? 'rgba(20,20,32,0.95)' : 'rgba(255,255,255,0.95)',
            borderRadius: '24px',
            padding: '2rem',
            marginBottom: '2rem',
            border: '2px solid #a855f7',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ marginTop: 0 }}>🔐 2-Factor Authentication</h3>
            <p>User: <strong>{user.email}</strong></p>
            <p>2FA Status: <strong style={{ color: is2FAEnabled ? '#10b981' : '#ef4444' }}>{is2FAEnabled ? "ENABLED 🟢" : "DISABLED 🔴"}</strong></p>
            
            {!is2FAEnabled && (
              <div style={{ margin: '1rem 0' }}>
                <input 
                  type="text" 
                  placeholder="Enter 6-digit Auth Code" 
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  style={{ padding: '10px', borderRadius: '10px', border: '1px solid #ccc', marginRight: '10px' }}
                />
              </div>
            )}

            <button 
              onClick={() => { setIs2FAEnabled(!is2FAEnabled); alert(is2FAEnabled ? "2FA Disabled" : "2FA Activated!"); }}
              style={{ padding: '10px 20px', borderRadius: '12px', border: 'none', backgroundColor: is2FAEnabled ? '#ef4444' : '#10b981', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {is2FAEnabled ? t.disable2FA : t.enable2FA}
            </button>
          </div>
        )}

        {/* Login Form (If no saved session) */}
        {!user ? (
          <div style={{
            backgroundColor: isDark ? `rgba(20, 20, 32, ${glassOpacity})` : `rgba(255, 255, 255, ${glassOpacity})`,
            backdropFilter: 'blur(20px)',
            borderRadius: '28px',
            padding: '2.5rem',
            maxWidth: '380px',
            margin: '4rem auto',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'}`,
            boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <img src="/icon.jpeg" alt="Logo" style={{ width: 56, height: 56, borderRadius: '16px', border: '2px solid #a855f7', marginBottom: '0.5rem' }} />
              <h2 style={{ margin: 0 }}>{t.login}</h2>
            </div>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input 
                type="email" 
                placeholder={t.email} 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ padding: '12px', borderRadius: '14px', border: '1px solid #a855f7', background: isDark ? '#0d0d16' : '#fff', color: isDark ? '#fff' : '#000', outline: 'none' }}
              />
              <input 
                type="password" 
                placeholder={t.password} 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ padding: '12px', borderRadius: '14px', border: '1px solid #a855f7', background: isDark ? '#0d0d16' : '#fff', color: isDark ? '#fff' : '#000', outline: 'none' }}
              />
              <button type="submit" style={{ padding: '14px', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg, #a855f7, #ec4899)', color: '#fff', fontWeight: '800', cursor: 'pointer' }}>
                {t.login}
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Curved Upload Dashboard Panel */}
            <div style={{
              backgroundColor: isDark ? `rgba(20, 20, 32, ${glassOpacity})` : `rgba(255, 255, 255, ${glassOpacity})`,
              backdropFilter: 'blur(20px)',
              borderRadius: '28px',
              padding: '2rem',
              marginBottom: '2.5rem',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'}`
            }}>
              <h3 style={{ marginTop: 0 }}>✨ {t.upload}</h3>
              <form onSubmit={handlePublish} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input 
                  type="text" 
                  placeholder={t.artTitle} 
                  value={artTitle} 
                  onChange={(e) => setArtTitle(e.target.value)}
                  style={{ padding: '12px 16px', borderRadius: '14px', border: '1px solid #a855f7', background: isDark ? '#0d0d16' : '#fff', color: isDark ? '#fff' : '#000' }}
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <input 
                    type="text" 
                    placeholder={t.imageUrl} 
                    value={imageUrl} 
                    onChange={(e) => { setImageUrl(e.target.value); setSelectedFile(null); }}
                    style={{ padding: '12px 16px', borderRadius: '14px', border: '1px solid #a855f7', background: isDark ? '#0d0d16' : '#fff', color: isDark ? '#fff' : '#000' }}
                  />

                  <label style={{ padding: '12px', borderRadius: '14px', border: '2px dashed #a855f7', background: 'rgba(168,85,247,0.1)', color: '#a855f7', textAlign: 'center', cursor: 'pointer', fontWeight: '600' }}>
                    📁 {selectedFile ? "File Ready!" : t.dragDrop}
                    <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                  </label>
                </div>

                <button type="submit" style={{ padding: '14px', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg, #a855f7, #ec4899)', color: '#fff', fontWeight: '800', cursor: 'pointer' }}>
                  {t.publish}
                </button>
              </form>
            </div>

            {/* Gallery Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
              {photos.map((photo) => (
                <div key={photo.id} style={{
                  backgroundColor: isDark ? `rgba(20, 20, 32, ${glassOpacity})` : `rgba(255, 255, 255, ${glassOpacity})`,
                  borderRadius: '24px',
                  overflow: 'hidden',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`
                }}>
                  <div style={{ position: 'relative', height: '220px', backgroundColor: '#000' }}>
                    <img src={photo.image_url} alt={photo.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                      <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 'bold', fontSize: '0.75rem', border: '1px solid rgba(255,255,255,0.3)', padding: '4px 10px', borderRadius: '8px' }}>
                        {t.protected}
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0 }}>{photo.title}</h4>
                    <span style={{ color: '#ec4899', fontWeight: 'bold' }}>❤️ {photo.likes}</span>
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
