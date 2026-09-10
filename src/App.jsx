import React, { useState, useEffect } from 'react';

const TRANSLATIONS = {
  en: { dir: "ltr", title: "MedyArt", login: "Email Sign In", email: "Email Address", password: "Password", upload: "Publish Artwork", settings: "Security & 2FA", logout: "Logout", opacity: "Background Glass Opacity", enable2FA: "Enable 2FA", disable2FA: "Disable 2FA", protected: "Protected Content • MedyArt", publish: "Publish Artwork", artTitle: "Artwork Title", imageUrl: "Image Direct Link", dragDrop: "Click or Select Local File" },
  fr: { dir: "ltr", title: "MedyArt", login: "Connexion par Email", email: "Adresse Email", password: "Mot de passe", upload: "Publier une œuvre", settings: "Sécurité & 2FA", logout: "Déconnexion", opacity: "Opacité du verre", enable2FA: "Activer 2FA", disable2FA: "Désactiver 2FA", protected: "Contenu Protégé • MedyArt", publish: "Publier", artTitle: "Titre de l'œuvre", imageUrl: "Lien Direct de l'Image", dragDrop: "Cliquez pour choisir un fichier" },
  ar: { dir: "rtl", title: "ميدي آرت", login: "تسجيل الدخول بالبريد", email: "البريد الإلكتروني", password: "كلمة المرور", upload: "نشر عمل فني", settings: "الأمان و 2FA", logout: "تسجيل الخروج", opacity: "شفافية الخلفية الزجاجية", enable2FA: "تفعيل 2FA", disable2FA: "إلغاء 2FA", protected: "محتوى محمي • MedyArt", publish: "نشر العمل", artTitle: "عنوان العمل الفني", imageUrl: "رابط الصورة المباشر", dragDrop: "اضغط لاختيار ملف من جهازك" },
  es: { dir: "ltr", title: "MedyArt", login: "Iniciar con Email", email: "Correo Electrónico", password: "Contraseña", upload: "Publicar Obra", settings: "Seguridad y 2FA", logout: "Cerrar Sesión", opacity: "Opacidad del Cristal", enable2FA: "Habilitar 2FA", disable2FA: "Deshabilitar 2FA", protected: "Contenido Protegido • MedyArt", publish: "Publicar Obra", artTitle: "Título", imageUrl: "Enlace de Imagen", dragDrop: "Seleccionar Archivo Local" }
};

export default function App() {
  const [lang, setLang] = useState('en');
  const [glassOpacity, setGlassOpacity] = useState(0.75);
  
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('medyart_session');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [artTitle, setArtTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  
  const [photos, setPhotos] = useState(() => {
    const saved = localStorage.getItem('medyart_gallery');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: "Neon Cyber Matrix", image_url: "/bg.jpeg", likes: 32 }
    ];
  });

  const [show2FAModal, setShow2FAModal] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  useEffect(() => {
    localStorage.setItem('medyart_gallery', JSON.stringify(photos));
  }, [photos]);

  const handleEmailLogin = (e) => {
    e.preventDefault();
    if (!email.includes('@')) return alert("Please enter a valid email address!");
    const sessionData = { email };
    setUser(sessionData);
    localStorage.setItem('medyart_session', JSON.stringify(sessionData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('medyart_session');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublishPhoto = (e) => {
    e.preventDefault();
    const finalImage = selectedFile || imageUrl;
    if (!artTitle || !finalImage) return alert("Please specify a title and provide an image file or direct URL!");

    const newArtwork = {
      id: Date.now(),
      title: artTitle,
      image_url: finalImage,
      likes: 0
    };

    setPhotos([newArtwork, ...photos]);
    setArtTitle('');
    setImageUrl('');
    setSelectedFile(null);
  };

  return (
    <div dir={t.dir} style={{
      minHeight: '100vh',
      backgroundImage: `linear-gradient(135deg, rgba(10, 10, 18, 0.85), rgba(15, 10, 25, 0.95)), url('/bg.jpeg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      color: '#ffffff',
      fontFamily: "system-ui, -apple-system, sans-serif",
      paddingBottom: '4rem'
    }}>
      {/* Curved Header */}
      <nav style={{
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        padding: '1.2rem 2rem',
        backgroundColor: `rgba(18, 18, 30, ${glassOpacity})`,
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img 
            src="/icon.jpeg" 
            alt="MedyArt Logo" 
            onError={(e) => { e.target.style.display = 'none'; }}
            style={{ width: 42, height: 42, borderRadius: '14px', border: '2px solid rgba(168, 85, 247, 0.6)', objectFit: 'cover' }} 
          />
          <span style={{ fontSize: '1.6rem', fontWeight: '800', background: 'linear-gradient(135deg, #c084fc, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {t.title}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Opacity Control Slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.08)', padding: '6px 14px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>{t.opacity}</span>
            <input 
              type="range" 
              min="0.2" 
              max="0.95" 
              step="0.05" 
              value={glassOpacity} 
              onChange={(e) => setGlassOpacity(parseFloat(e.target.value))}
              style={{ accentColor: '#a855f7', cursor: 'pointer', width: '80px' }}
            />
          </div>

          {/* Language Selection */}
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value)}
            style={{ backgroundColor: '#181826', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', padding: '6px 12px', fontWeight: '600', cursor: 'pointer' }}
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="ar">العربية</option>
            <option value="es">Español</option>
          </select>

          {user && (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShow2FAModal(!show2FAModal)} style={{ background: 'rgba(168, 85, 247, 0.3)', border: '1px solid #c084fc', color: '#fff', padding: '6px 14px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600' }}>
                🔒 {t.settings}
              </button>
              <button onClick={handleLogout} style={{ background: '#ef4444', border: 'none', color: '#fff', padding: '6px 14px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600' }}>
                {t.logout}
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Container */}
      <div style={{ maxWidth: '1000px', margin: '2.5rem auto', padding: '0 1rem' }}>

        {/* 2FA Modal */}
        {show2FAModal && user && (
          <div style={{ backgroundColor: `rgba(24, 24, 38, 0.95)`, borderRadius: '24px', padding: '2rem', marginBottom: '2rem', border: '1px solid rgba(192, 132, 252, 0.4)' }}>
            <h3 style={{ marginTop: 0 }}>🔒 2FA Security Control</h3>
            <p style={{ color: '#aaa' }}>Account: <strong>{user.email}</strong></p>
            <p>Status: <strong style={{ color: is2FAEnabled ? '#10b981' : '#ef4444' }}>{is2FAEnabled ? "Active 🟢" : "Disabled 🔴"}</strong></p>
            {!is2FAEnabled && (
              <input 
                type="text" 
                placeholder="6-digit Auth Code" 
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                style={{ padding: '10px 14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: '#10101a', color: '#fff', marginRight: '10px' }}
              />
            )}
            <button 
              onClick={() => { setIs2FAEnabled(!is2FAEnabled); alert(is2FAEnabled ? "2FA Disabled" : "2FA Activated!"); }}
              style={{ padding: '10px 20px', borderRadius: '12px', border: 'none', backgroundColor: is2FAEnabled ? '#ef4444' : '#10b981', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {is2FAEnabled ? t.disable2FA : t.enable2FA}
            </button>
          </div>
        )}

        {/* Login Modal (Email Only) */}
        {!user ? (
          <div style={{
            backgroundColor: `rgba(20, 20, 32, ${glassOpacity})`,
            backdropFilter: 'blur(20px)',
            borderRadius: '28px',
            padding: '2.5rem',
            maxWidth: '400px',
            margin: '3rem auto',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <img src="/icon.jpeg" alt="Icon" style={{ width: 56, height: 56, borderRadius: '18px', border: '2px solid #c084fc', marginBottom: '0.8rem' }} />
              <h2 style={{ margin: 0, fontSize: '1.6rem' }}>{t.login}</h2>
            </div>

            <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#aaa', display: 'block', marginBottom: '4px' }}>{t.email}</label>
                <input 
                  type="email" 
                  placeholder="user@example.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: '#0d0d16', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#aaa', display: 'block', marginBottom: '4px' }}>{t.password}</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: '#0d0d16', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <button type="submit" style={{ padding: '14px', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg, #a855f7, #ec4899)', color: '#fff', fontWeight: '800', cursor: 'pointer', marginTop: '8px' }}>
                {t.login}
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Upload Area */}
            <div style={{
              backgroundColor: `rgba(20, 20, 32, ${glassOpacity})`,
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '1.8rem',
              marginBottom: '2.5rem',
              border: '1px solid rgba(255, 255, 255, 0.12)'
            }}>
              <h3 style={{ marginTop: 0, fontSize: '1.3rem' }}>✨ {t.upload}</h3>
              <form onSubmit={handlePublishPhoto} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input 
                  type="text" 
                  placeholder={t.artTitle} 
                  value={artTitle} 
                  onChange={(e) => setArtTitle(e.target.value)}
                  style={{ padding: '12px 16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: '#0d0d16', color: '#fff', outline: 'none' }}
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <input 
                    type="text" 
                    placeholder={t.imageUrl} 
                    value={imageUrl} 
                    onChange={(e) => { setImageUrl(e.target.value); setSelectedFile(null); }}
                    style={{ padding: '12px 16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: '#0d0d16', color: '#fff', outline: 'none' }}
                  />

                  <label style={{ padding: '12px', borderRadius: '14px', border: '2px dashed #a855f7', backgroundColor: 'rgba(168,85,247,0.1)', color: '#c084fc', textAlign: 'center', cursor: 'pointer', fontWeight: '600' }}>
                    📁 {selectedFile ? "File Selected!" : t.dragDrop}
                    <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                  </label>
                </div>

                <button type="submit" style={{ padding: '14px', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg, #a855f7, #ec4899)', color: '#fff', fontWeight: '800', cursor: 'pointer' }}>
                  {t.publish}
                </button>
              </form>
            </div>

            {/* Gallery Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {photos.map((photo) => (
                <div key={photo.id} style={{
                  backgroundColor: `rgba(20, 20, 32, ${glassOpacity})`,
                  borderRadius: '20px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div onContextMenu={(e) => e.preventDefault()} style={{ position: 'relative', height: '240px', backgroundColor: '#050508' }}>
                    <img src={photo.image_url} alt={photo.title} draggable="false" style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                      <span style={{ color: 'rgba(255, 255, 255, 0.4)', fontWeight: 'bold', fontSize: '0.8rem', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '4px 12px', borderRadius: '8px' }}>
                        {t.protected}
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: '1rem' }}>{photo.title}</h4>
                    <span style={{ color: '#f472b6', fontWeight: 'bold' }}>❤️ {photo.likes}</span>
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
