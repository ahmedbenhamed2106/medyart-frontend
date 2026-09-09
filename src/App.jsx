import React, { useState, useEffect } from 'react';

// Multilingual Dictionary
const TRANSLATIONS = {
  en: { dir: "ltr", title: "MedyArt", login: "Email Sign In", register: "Register", email: "Email Address", password: "Password", upload: "Upload Artwork", settings: "Account Settings", logout: "Logout", opacity: "Card Transparency", enable2FA: "Enable 2FA", disable2FA: "Disable 2FA", protected: "Protected Content • MedyArt", publish: "Publish Artwork", artTitle: "Artwork Title", imageUrl: "Image URL / Link" },
  fr: { dir: "ltr", title: "MedyArt", login: "Connexion par Email", register: "S'inscrire", email: "Adresse Email", password: "Mot de passe", upload: "Publier une œuvre", settings: "Paramètres du compte", logout: "Déconnexion", opacity: "Opacité des cartes", enable2FA: "Activer 2FA", disable2FA: "Désactiver 2FA", protected: "Contenu Protégé • MedyArt", publish: "Publier l'œuvre", artTitle: "Titre de l'œuvre", imageUrl: "URL / Lien de l'image" },
  ar: { dir: "rtl", title: "ميدي آرت", login: "تسجيل الدخول بالبريد", register: "إنشاء حساب", email: "البريد الإلكتروني", password: "كلمة المرور", upload: "رفع عمل فني", settings: "إعدادات الحساب", logout: "تسجيل الخروج", opacity: "شفافية الخلفية", enable2FA: "تفعيل 2FA", disable2FA: "إلغاء 2FA", protected: "محتوى محمي • MedyArt", publish: "نشر العمل", artTitle: "عنوان العمل", imageUrl: "رابط الصورة" },
  es: { dir: "ltr", title: "MedyArt", login: "Iniciar Sesión con Email", register: "Registrarse", email: "Correo Electrónico", password: "Contraseña", upload: "Subir Obra", settings: "Ajustes de Cuenta", logout: "Cerrar Sesión", opacity: "Transparencia", enable2FA: "Habilitar 2FA", disable2FA: "Deshabilitar 2FA", protected: "Contenido Protegido • MedyArt", publish: "Publicar", artTitle: "Título", imageUrl: "URL de la Imagen" },
  it: { dir: "ltr", title: "MedyArt", login: "Accedi con Email", register: "Registrati", email: "Indirizzo Email", password: "Password", upload: "Carica Opera", settings: "Impostazioni", logout: "Esci", opacity: "Trasparenza", enable2FA: "Attiva 2FA", disable2FA: "Disattiva 2FA", protected: "Contenuto Protetto • MedyArt", publish: "Pubblica", artTitle: "Titolo", imageUrl: "URL Immagine" },
  de: { dir: "ltr", title: "MedyArt", login: "Anmelden mit E-Mail", register: "Registrieren", email: "E-Mail-Adresse", password: "Passwort", upload: "Kunstwerk Hochladen", settings: "Konto-Einstellungen", logout: "Abmelden", opacity: "Transparenz", enable2FA: "2FA Aktivieren", disable2FA: "2FA Deaktivieren", protected: "Geschützter Inhalt • MedyArt", publish: "Veröffentlichen", artTitle: "Titel", imageUrl: "Bild-URL" },
  fa: { dir: "rtl", title: "مدی‌آرت", login: "ورود با ایمیل", register: "ثبت‌نام", email: "آدرس ایمیل", password: "رمز عبور", upload: "بارگذاری اثر", settings: "تنظیمات حساب", logout: "خروج", opacity: "شفافیت کارت", enable2FA: "فعالسازی 2FA", disable2FA: "غیرفعالسازی 2FA", protected: "محتوای محافظت‌شده • MedyArt", publish: "انتشار اثر", artTitle: "عنوان اثر", imageUrl: "لینک تصویر" },
  ru: { dir: "ltr", title: "MedyArt", login: "Вход по Email", register: "Регистрация", email: "Электронная почта", password: "Пароль", upload: "Загрузить арт", settings: "Настройки", logout: "Выйти", opacity: "Прозрачность", enable2FA: "Включить 2FA", disable2FA: "Выключить 2FA", protected: "Защищенный контент • MedyArt", publish: "Опубликовать", artTitle: "Название", imageUrl: "Ссылка на изображение" },
  tr: { dir: "ltr", title: "MedyArt", login: "E-posta ile Giriş", register: "Kayıt Ol", email: "E-posta Adresi", password: "Şifre", upload: "Eser Yükle", settings: "Hesap Ayarları", logout: "Çıkış Yap", opacity: "Şeffaflık", enable2FA: "2FA Etkinleştir", disable2FA: "2FA Devre Dışı Bırak", protected: "Korumalı İçerik • MedyArt", publish: "Yayınla", artTitle: "Eser Başlığı", imageUrl: "Görsel URL'si" }
};

export default function App() {
  const [lang, setLang] = useState('en');
  const [cardOpacity, setCardOpacity] = useState(0.85);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [artTitle, setArtTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [photos, setPhotos] = useState([]);
  
  // 2FA States
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [secret, setSecret] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  // Auto Login Check
  useEffect(() => {
    if (token) {
      const savedEmail = localStorage.getItem('userEmail');
      if (savedEmail) setUser({ email: savedEmail });
      fetchPhotos();
      fetch2FADetails();
    }
  }, [token]);

  // Prevent right click globally on images
  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  const fetchPhotos = async () => {
    try {
      const res = await fetch('https://medyart-backend.onrender.com/api/photos/');
      const data = await res.json();
      if (Array.isArray(data)) setPhotos(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setUser({ email });
    setToken('authenticated_dummy_token');
    localStorage.setItem('token', 'authenticated_dummy_token');
    localStorage.setItem('userEmail', email);
  };

  const handleLogout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
  };

  const fetch2FADetails = async () => {
    try {
      const res = await fetch('https://medyart-backend.onrender.com/api/2fa/setup/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setQrCode(data.qr_code);
        setSecret(data.secret);
        setIs2FAEnabled(data.is_2fa_enabled);
      }
    } catch (err) {
      console.error("2FA Load Failed", err);
    }
  };

  const handleToggle2FA = async (enableState) => {
    try {
      const res = await fetch('https://medyart-backend.onrender.com/api/2fa/verify/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ otp_code: otpCode, secret, enable: enableState })
      });
      const data = await res.json();
      if (res.ok) {
        setIs2FAEnabled(data.is_2fa_enabled);
        alert(data.message);
      } else {
        alert(data.detail || "Verification failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePublishPhoto = async (e) => {
    e.preventDefault();
    if (!artTitle || !imageUrl) return alert("Fill all fields");

    try {
      const res = await fetch('https://medyart-backend.onrender.com/api/photos/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: artTitle, image_url: imageUrl })
      });
      if (res.ok) {
        setArtTitle('');
        setImageUrl('');
        fetchPhotos();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div dir={t.dir} style={{
      minHeight: '100vh',
      backgroundImage: `linear-gradient(rgba(11, 12, 16, 0.75), rgba(11, 12, 16, 0.85)), url('/bg.jpeg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      color: '#ffffff',
      paddingBottom: '3rem'
    }}>
      {/* Top Glass Navbar */}
      <nav style={{
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: `rgba(20, 20, 30, ${cardOpacity})`,
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        sticky: 'top'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/icon.jpeg" alt="Logo" style={{ width: 42, height: 42, borderRadius: '50%', border: '2px solid #8a2be2' }} />
          <span style={{ fontSize: '1.6rem', fontWeight: '800', background: 'linear-gradient(45deg, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {t.title}
          </span>
        </div>

        {/* Controls: Opacity & Multilingual Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
            <span>{t.opacity}</span>
            <input 
              type="range" 
              min="0.2" 
              max="0.95" 
              step="0.05" 
              value={cardOpacity} 
              onChange={(e) => setCardOpacity(parseFloat(e.target.value))}
              style={{ accentColor: '#a855f7', cursor: 'pointer' }}
            />
          </div>

          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value)}
            style={{
              backgroundColor: '#1f1f2e',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              padding: '6px 12px',
              cursor: 'pointer'
            }}
          >
            <option value="en">English 🇬🇧</option>
            <option value="fr">Français 🇫🇷</option>
            <option value="ar">العربية 🇹🇳</option>
            <option value="es">Español 🇪🇸</option>
            <option value="it">Italiano 🇮🇹</option>
            <option value="de">Deutsch 🇩🇪</option>
            <option value="fa">فارسی 🇮🇷</option>
            <option value="ru">Русский 🇷🇺</option>
            <option value="tr">Türkçe 🇹🇷</option>
          </select>

          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button 
                onClick={() => setShowSettings(!showSettings)}
                style={{ background: '#2d2d42', border: 'none', color: '#fff', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer' }}
              >
                ⚙️ {t.settings}
              </button>
              <button 
                onClick={handleLogout}
                style={{ background: '#ef4444', border: 'none', color: '#fff', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer' }}
              >
                {t.logout}
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Container */}
      <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem' }}>

        {/* Auth Box (if not logged in) */}
        {!user ? (
          <div style={{
            backgroundColor: `rgba(22, 22, 34, ${cardOpacity})`,
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '2.5rem',
            maxWidth: '420px',
            margin: '4rem auto',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
          }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>{t.login}</h2>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input 
                type="email" 
                placeholder={t.email} 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ padding: '12px', borderRadius: '10px', border: '1px solid #333', backgroundColor: '#12121c', color: '#fff' }}
              />
              <input 
                type="password" 
                placeholder={t.password} 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ padding: '12px', borderRadius: '10px', border: '1px solid #333', backgroundColor: '#12121c', color: '#fff' }}
              />
              <button type="submit" style={{ padding: '12px', borderRadius: '10px', border: 'none', background: 'linear-gradient(45deg, #a855f7, #ec4899)', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
                {t.login}
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Account Settings / 2FA Modal */}
            {showSettings && (
              <div style={{
                backgroundColor: `rgba(22, 22, 34, ${cardOpacity})`,
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '2rem',
                marginBottom: '2rem',
                border: '1px solid rgba(168, 85, 247, 0.4)'
              }}>
                <h3>⚙️ {t.settings} - 2FA Security</h3>
                <p>Status: <strong>{is2FAEnabled ? "Enabled 🟢" : "Disabled 🔴"}</strong></p>

                {!is2FAEnabled && qrCode && (
                  <div style={{ margin: '1rem 0' }}>
                    <p style={{ fontSize: '0.9rem', color: '#aaa' }}>Scan QR Code in Google Authenticator or Authy:</p>
                    <img src={qrCode} alt="2FA QR Code" style={{ width: 160, height: 160, borderRadius: 12, border: '4px solid #fff' }} />
                    <input 
                      type="text" 
                      placeholder="Enter 6-digit Code" 
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      style={{ display: 'block', margin: '12px 0', padding: '10px', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#111', color: '#fff' }}
                    />
                  </div>
                )}

                <button 
                  onClick={() => is2FAEnabled ? handleToggle2FA(false) : handleToggle2FA(true)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: is2FAEnabled ? '#ef4444' : '#10b981',
                    color: '#fff',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  {is2FAEnabled ? t.disable2FA : t.enable2FA}
                </button>
              </div>
            )}

            {/* Upload Section */}
            <div style={{
              backgroundColor: `rgba(22, 22, 34, ${cardOpacity})`,
              backdropFilter: 'blur(16px)',
              borderRadius: '20px',
              padding: '1.5rem',
              marginBottom: '2.5rem',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h3 style={{ marginTop: 0 }}>🎨 {t.upload}</h3>
              <form onSubmit={handlePublishPhoto} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <input 
                  type="text" 
                  placeholder={t.artTitle} 
                  value={artTitle} 
                  onChange={(e) => setArtTitle(e.target.value)}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#12121c', color: '#fff' }}
                />
                <input 
                  type="text" 
                  placeholder={t.imageUrl} 
                  value={imageUrl} 
                  onChange={(e) => setImageUrl(e.target.value)}
                  style={{ flex: 2, padding: '10px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#12121c', color: '#fff' }}
                />
                <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'linear-gradient(45deg, #a855f7, #ec4899)', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
                  {t.publish}
                </button>
              </form>
            </div>

            {/* Protected Digital Gallery Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.5rem'
            }}>
              {photos.map((photo) => (
                <div key={photo.id} style={{
                  backgroundColor: `rgba(22, 22, 34, ${cardOpacity})`,
                  backdropFilter: 'blur(12px)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  position: 'relative'
                }}>
                  {/* Protected Image Container with MedyArt Watermark Overlay */}
                  <div 
                    onContextMenu={handleContextMenu} 
                    style={{ position: 'relative', overflow: 'hidden', userSelect: 'none' }}
                  >
                    <img 
                      src={photo.image_url} 
                      alt={photo.title} 
                      draggable="false"
                      style={{
                        width: '100%',
                        height: '240px',
                        objectFit: 'cover',
                        display: 'block',
                        pointerEvents: 'none' // Disables image drag-and-drop
                      }} 
                    />
                    
                    {/* Protection Overlay */}
                    <div style={{
                      position: 'absolute',
                      top: 0, left: 0, right: 0, bottom: 0,
                      background: 'radial-gradient(circle, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      pointerEvents: 'none'
                    }}>
                      <span style={{
                        color: 'rgba(255, 255, 255, 0.35)',
                        fontWeight: '800',
                        fontSize: '1rem',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        transform: 'rotate(-25deg)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        padding: '4px 12px',
                        borderRadius: '6px'
                      }}>
                        {t.protected}
                      </span>
                    </div>
                  </div>

                  <div style={{ padding: '1rem' }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem' }}>{photo.title}</h4>
                    <span style={{ fontSize: '0.8rem', color: '#a855f7' }}>❤️ {photo.likes_count || 0} Likes</span>
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
