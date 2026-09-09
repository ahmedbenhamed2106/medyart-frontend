import React, { useState, useEffect } from 'react';

// Multilingual Dictionary without flags
const TRANSLATIONS = {
  en: { dir: "ltr", title: "MedyArt", login: "Sign In", register: "Register", email: "Email Address", password: "Password", upload: "Publish Artwork", settings: "Security & 2FA", logout: "Logout", opacity: "Card Opacity", enable2FA: "Enable 2FA", disable2FA: "Disable 2FA", protected: "Protected Content • MedyArt", publish: "Publish", artTitle: "Artwork Title", imageUrl: "Image Direct URL", noPhotos: "No artworks published yet. Add one above!" },
  fr: { dir: "ltr", title: "MedyArt", login: "Connexion", register: "S'inscrire", email: "Adresse Email", password: "Mot de passe", upload: "Publier une œuvre", settings: "Sécurité & 2FA", logout: "Déconnexion", opacity: "Opacité", enable2FA: "Activer 2FA", disable2FA: "Désactiver 2FA", protected: "Contenu Protégé • MedyArt", publish: "Publier", artTitle: "Titre de l'œuvre", imageUrl: "URL de l'image", noPhotos: "Aucune œuvre publiée pour le moment." },
  ar: { dir: "rtl", title: "ميدي آرت", login: "تسجيل الدخول", register: "إنشاء حساب", email: "البريد الإلكتروني", password: "كلمة المرور", upload: "نشر عمل فني", settings: "الأمان و 2FA", logout: "تسجيل الخروج", opacity: "شفافية البطاقات", enable2FA: "تفعيل 2FA", disable2FA: "إلغاء 2FA", protected: "محتوى محمي • MedyArt", publish: "نشر", artTitle: "عنوان العمل", imageUrl: "رابط الصورة Direct", noPhotos: "لا توجد أعمال منشورة حتى الآن." },
  es: { dir: "ltr", title: "MedyArt", login: "Iniciar Sesión", register: "Registrarse", email: "Correo Electrónico", password: "Contraseña", upload: "Publicar Obra", settings: "Seguridad y 2FA", logout: "Cerrar Sesión", opacity: "Opacidad", enable2FA: "Habilitar 2FA", disable2FA: "Deshabilitar 2FA", protected: "Contenido Protegido • MedyArt", publish: "Publicar", artTitle: "Título", imageUrl: "URL de la Imagen", noPhotos: "No hay obras publicadas." },
  it: { dir: "ltr", title: "MedyArt", login: "Accedi", register: "Registrati", email: "Indirizzo Email", password: "Password", upload: "Pubblica Opera", settings: "Sicurezza & 2FA", logout: "Esci", opacity: "Trasparenza", enable2FA: "Attiva 2FA", disable2FA: "Disattiva 2FA", protected: "Contenuto Protetto • MedyArt", publish: "Pubblica", artTitle: "Titolo", imageUrl: "URL Immagine", noPhotos: "Nessuna opera pubblicata." },
  de: { dir: "ltr", title: "MedyArt", login: "Anmelden", register: "Registrieren", email: "E-Mail-Adresse", password: "Passwort", upload: "Kunstwerk Veröffentlichen", settings: "Sicherheit & 2FA", logout: "Abmelden", opacity: "Transparenz", enable2FA: "2FA Aktivieren", disable2FA: "2FA Deaktivieren", protected: "Geschützter Inhalt • MedyArt", publish: "Veröffentlichen", artTitle: "Titel", imageUrl: "Bild-URL", noPhotos: "Noch keine Kunstwerke veröffentlicht." },
  fa: { dir: "rtl", title: "مدی‌آرت", login: "ورود", register: "ثبت‌نام", email: "آدرس ایمیل", password: "رمز عبور", upload: "انتشار اثر", settings: "امنیت و 2FA", logout: "خروج", opacity: "شفافیت", enable2FA: "فعالسازی 2FA", disable2FA: "غیرفعالسازی 2FA", protected: "محتوای محافظت‌شده • MedyArt", publish: "انتشار", artTitle: "عنوان اثر", imageUrl: "لینک مستقیم تصویر", noPhotos: "هیچ اثری منتشر نشده است." },
  ru: { dir: "ltr", title: "MedyArt", login: "Вход", register: "Регистрация", email: "Электронная почта", password: "Пароль", upload: "Опубликовать арт", settings: "Безопасность и 2FA", logout: "Выйти", opacity: "Прозрачность", enable2FA: "Включить 2FA", disable2FA: "Выключить 2FA", protected: "Защищенный контент • MedyArt", publish: "Опубликовать", artTitle: "Название", imageUrl: "Ссылка на изображение", noPhotos: "Работы еще не опубликованы." },
  tr: { dir: "ltr", title: "MedyArt", login: "Giriş Yap", register: "Kayıt Ol", email: "E-posta Adresi", password: "Şifre", upload: "Eser Yayınla", settings: "Güvenlik & 2FA", logout: "Çıkış Yap", opacity: "Şeffaflık", enable2FA: "2FA Etkinleştir", disable2FA: "2FA Devre Dışı Bırak", protected: "Korumalı İçerik • MedyArt", publish: "Yayınla", artTitle: "Eser Başlığı", imageUrl: "Görsel Linki", noPhotos: "Henüz yayınlanmış bir eser yok." }
};

export default function App() {
  const [lang, setLang] = useState('en');
  const [cardOpacity, setCardOpacity] = useState(0.85);
  
  // Auth & Storage
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('medyart_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Photo State
  const [artTitle, setArtTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [photos, setPhotos] = useState(() => {
    const saved = localStorage.getItem('medyart_photos');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: "Abstract Digital Sphere", image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800", likes_count: 12 },
      { id: 2, title: "Cyberpunk Alley", image_url: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=800", likes_count: 24 }
    ];
  });

  // 2FA Security Modal
  const [show2FA, setShow2FA] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  // Persist photos in local storage
  useEffect(() => {
    localStorage.setItem('medyart_photos', JSON.stringify(photos));
  }, [photos]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email) return;
    const userData = { email };
    setUser(userData);
    localStorage.setItem('medyart_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('medyart_user');
  };

  const handlePublishPhoto = (e) => {
    e.preventDefault();
    if (!artTitle.trim() || !imageUrl.trim()) {
      alert("Please enter both a title and an image URL!");
      return;
    }

    const newPhoto = {
      id: Date.now(),
      title: artTitle,
      image_url: imageUrl,
      likes_count: 0
    };

    setPhotos([newPhoto, ...photos]);
    setArtTitle('');
    setImageUrl('');
  };

  const handleToggle2FA = () => {
    if (!is2FAEnabled && !otpCode) {
      alert("Please enter the 6-digit authenticator code.");
      return;
    }
    setIs2FAEnabled(!is2FAEnabled);
    setOtpCode('');
    alert(is2FAEnabled ? "2FA Security Disabled" : "2FA Security Enabled Successfully!");
  };

  return (
    <div dir={t.dir} style={{
      minHeight: '100vh',
      backgroundImage: `linear-gradient(rgba(11, 12, 16, 0.75), rgba(11, 12, 16, 0.88)), url('/bg.jpeg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      color: '#ffffff',
      paddingBottom: '3rem'
    }}>
      {/* Top Glass Navigation */}
      <nav style={{
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: `rgba(18, 18, 28, ${cardOpacity})`,
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        sticky: 'top',
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img 
            src="/icon.jpeg" 
            alt="MedyArt Logo" 
            onError={(e) => { e.target.style.display = 'none'; }}
            style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid #a855f7', objectFit: 'cover' }} 
          />
          <span style={{ fontSize: '1.6rem', fontWeight: '800', background: 'linear-gradient(45deg, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {t.title}
          </span>
        </div>

        {/* Global Controls: Opacity & Clean Multilingual Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '20px' }}>
            <span>{t.opacity}</span>
            <input 
              type="range" 
              min="0.2" 
              max="0.95" 
              step="0.05" 
              value={cardOpacity} 
              onChange={(e) => setCardOpacity(parseFloat(e.target.value))}
              style={{ accentColor: '#a855f7', cursor: 'pointer', width: '80px' }}
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
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="ar">العربية</option>
            <option value="es">Español</option>
            <option value="it">Italiano</option>
            <option value="de">Deutsch</option>
            <option value="fa">فارسی</option>
            <option value="ru">Русский</option>
            <option value="tr">Türkçe</option>
          </select>

          {user && (
            <>
              <button 
                onClick={() => setShow2FA(!show2FA)}
                style={{ background: 'rgba(168, 85, 247, 0.2)', border: '1px solid #a855f7', color: '#fff', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
              >
                🔒 {t.settings}
              </button>
              <button 
                onClick={handleLogout}
                style={{ background: '#ef4444', border: 'none', color: '#fff', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer' }}
              >
                {t.logout}
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Main App Container */}
      <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem' }}>

        {/* Global 2FA Modal Dialog */}
        {show2FA && user && (
          <div style={{
            backgroundColor: `rgba(22, 22, 34, 0.95)`,
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '2rem',
            marginBottom: '2rem',
            border: '1px solid #a855f7',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}>
            <h3 style={{ marginTop: 0 }}>🔒 2-Factor Authentication (2FA)</h3>
            <p>Status: <strong style={{ color: is2FAEnabled ? '#10b981' : '#ef4444' }}>{is2FAEnabled ? "Enabled" : "Disabled"}</strong></p>

            {!is2FAEnabled && (
              <div style={{ margin: '1rem 0' }}>
                <p style={{ fontSize: '0.85rem', color: '#aaa' }}>Enter code from Authenticator App to activate:</p>
                <input 
                  type="text" 
                  placeholder="6-digit Code" 
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#111', color: '#fff', width: '160px' }}
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
              <button 
                onClick={handleToggle2FA}
                style={{
                  padding: '8px 18px',
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
              <button 
                onClick={() => setShow2FA(false)}
                style={{ padding: '8px 18px', borderRadius: '8px', border: '1px solid #555', background: 'transparent', color: '#fff', cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Auth Interface */}
        {!user ? (
          <div style={{
            backgroundColor: `rgba(22, 22, 34, ${cardOpacity})`,
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '2.5rem',
            maxWidth: '400px',
            margin: '4rem auto',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
          }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>{t.login}</h2>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input 
                type="email" 
                placeholder={t.email} 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ padding: '12px', borderRadius: '10px', border: '1px solid #333', backgroundColor: '#12121c', color: '#fff', outline: 'none' }}
              />
              <input 
                type="password" 
                placeholder={t.password} 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ padding: '12px', borderRadius: '10px', border: '1px solid #333', backgroundColor: '#12121c', color: '#fff', outline: 'none' }}
              />
              <button type="submit" style={{ padding: '12px', borderRadius: '10px', border: 'none', background: 'linear-gradient(45deg, #a855f7, #ec4899)', color: '#fff', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' }}>
                {t.login}
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Direct Publishing Box */}
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
                  style={{ flex: '1 1 200px', padding: '10px 14px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#12121c', color: '#fff', outline: 'none' }}
                />
                <input 
                  type="text" 
                  placeholder={t.imageUrl} 
                  value={imageUrl} 
                  onChange={(e) => setImageUrl(e.target.value)}
                  style={{ flex: '2 1 300px', padding: '10px 14px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#12121c', color: '#fff', outline: 'none' }}
                />
                <button type="submit" style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', background: 'linear-gradient(45deg, #a855f7, #ec4899)', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
                  {t.publish}
                </button>
              </form>
            </div>

            {/* Protected Gallery Grid */}
            {photos.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#888' }}>{t.noPhotos}</p>
            ) : (
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
                    boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
                  }}>
                    {/* Watermark Protected Media View */}
                    <div 
                      onContextMenu={(e) => e.preventDefault()} 
                      style={{ position: 'relative', overflow: 'hidden', userSelect: 'none', backgroundColor: '#050508' }}
                    >
                      <img 
                        src={photo.image_url} 
                        alt={photo.title} 
                        draggable="false"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL'; }}
                        style={{
                          width: '100%',
                          height: '240px',
                          objectFit: 'cover',
                          display: 'block',
                          pointerEvents: 'none'
                        }} 
                      />
                      
                      {/* Watermark Overlay */}
                      <div style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: 'radial-gradient(circle, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.4) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        pointerEvents: 'none'
                      }}>
                        <span style={{
                          color: 'rgba(255, 255, 255, 0.4)',
                          fontWeight: '800',
                          fontSize: '0.9rem',
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

                    <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>{photo.title}</h4>
                      <span style={{ fontSize: '0.85rem', color: '#ec4899', fontWeight: 'bold' }}>❤️ {photo.likes_count || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
