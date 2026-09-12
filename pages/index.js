import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AuthModal from '../components/AuthModal';
import UploadModal from '../components/UploadModal';
import AccountModal from '../components/AccountModal';

const TRANSLATIONS = {
  en: { upload: '+ Upload', modify: 'Modify Account', opacity: 'Opacity', signin: 'Sign In', signout: 'Sign Out' },
  fr: { upload: '+ Publier', modify: 'Modifier le Compte', opacity: 'Opacité', signin: 'Se Connecter', signout: 'Se Déconnecter' },
  es: { upload: '+ Subir', modify: 'Modificar Cuenta', opacity: 'Opacidad', signin: 'Iniciar Sesión', signout: 'Cerrar Sesión' },
  ar: { upload: '+ رفع صورة', modify: 'تعديل الحساب', opacity: 'الشفافية', signin: 'تسجيل الدخول', signout: 'تسجيل الخروج' }
};

export default function Home() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('media');
  const [lang, setLang] = useState('en');
  const [theme, setTheme] = useState('dark');
  const [bgOpacity, setBgOpacity] = useState(100);

  const [showAuth, setShowAuth] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showAccount, setShowAccount] = useState(false);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  useEffect(() => {
    const activeUser = localStorage.getItem('username');
    if (activeUser) setUser(activeUser);
  }, []);

  const handleSignOut = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <div className={`min-h-screen relative font-sans ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <Head>
        <title>MedyArt</title>
        <link rel="icon" href="/icon.jpeg" />
      </Head>

      <div 
        className="fixed inset-0 bg-cover bg-center pointer-events-none z-0 transition-opacity"
        style={{ 
          backgroundImage: "url('/bg.jpeg')", 
          opacity: bgOpacity / 100 
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        <header className="flex justify-between items-center pb-6 border-b border-neutral-800">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-purple-500">MedyArt</h1>
            
            <select value={lang} onChange={(e) => setLang(e.target.value)} className="bg-neutral-900 border border-neutral-800 text-xs font-bold p-2 rounded-xl text-white">
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="es">Español</option>
              <option value="ar">العربية</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-neutral-900/90 border border-neutral-800 px-3 py-1.5 rounded-xl text-xs text-white">
            <span>{t.opacity}:</span>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={bgOpacity} 
              onChange={(e) => setBgOpacity(e.target.value)} 
              className="w-24 accent-purple-500 cursor-pointer" 
            />
            <span>{bgOpacity}%</span>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                {role === 'media' && (
                  <button onClick={() => setShowUpload(true)} className="bg-purple-600 font-bold text-sm px-4 py-2 rounded-xl text-white">
                    {t.upload}
                  </button>
                )}
                <button onClick={() => setShowAccount(true)} className="bg-neutral-900 border border-neutral-800 font-bold text-sm px-4 py-2 rounded-xl text-white">
                  ⚙️ {t.modify}
                </button>
                <button onClick={handleSignOut} className="bg-red-600/80 hover:bg-red-600 font-bold text-sm px-4 py-2 rounded-xl text-white">
                  {t.signout}
                </button>
              </>
            ) : (
              <button onClick={() => setShowAuth(true)} className="bg-purple-600 hover:bg-purple-500 font-bold text-sm px-6 py-2 rounded-xl text-white">
                {t.signin}
              </button>
            )}
          </div>
        </header>

        {showAuth && <AuthModal onClose={() => setShowAuth(false)} onSuccess={(u) => { setUser(u); setShowAuth(false); }} />}
        {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
        {showAccount && <AccountModal onClose={() => setShowAccount(false)} />}
      </div>
    </div>
  );
}
