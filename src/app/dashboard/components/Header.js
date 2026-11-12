'use client';

import { Icons } from '../helpers/icons';

export default function Header({
  theme,
  cafeName,
  activeTab,
  setActiveTab,
  activeOrdersCount,
  realtimeStatus,
  isFullscreen,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  onToggleTheme,
  onToggleFullscreen,
  onLogout,
  onOpenKitchen,
  isOpen,
  onToggleCafeStatus,
}) {
  const textMainClass = theme === 'light' ? 'text-[#1A1512]' : 'text-white';
  
  // HEADER TEGAS: Background Cream dengan border bawah tebal
  const headerClass = theme === 'light'
    ? 'bg-[#F4EFE9]/95 border-b-4 border-[#D4C5B8] shadow-sm'
    : 'bg-[#0a192f]/95 border-b-4 border-slate-700 shadow-sm';

  // TOMBOL NAVIGASI TEGAS: Font super tebal, border tegas saat aktif
  const navBtnClass = (isActive) =>
    `relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black transition-all duration-200 border-2 ${
      isActive
        ? 'bg-[#2A1F17] text-white border-[#1A1512] shadow-md'
        : theme === 'light'
          ? 'text-[#8C7A6B] hover:text-[#1A1512] hover:bg-white border-transparent'
          : 'text-slate-300 hover:text-white hover:bg-slate-800 border-transparent'
    }`;

  const navItems = [
    { key: 'queue', label: 'Antrian', Icon: Icons.Clipboard, badge: activeOrdersCount },
    { key: 'menu', label: 'Menu', Icon: Icons.Utensils },
    { key: 'tables', label: 'Meja', Icon: Icons.Grid },
    { key: 'reports', label: 'Laporan', Icon: Icons.Chart },
    { key: 'settings', label: 'Pengaturan', Icon: Icons.Settings },
  ];

  return (
    <header className={`backdrop-blur-xl sticky top-0 z-50 print:hidden transition-colors duration-300 ${headerClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-20">

          {/* LOGO & BRAND */}
          <div className="flex items-center gap-3 shrink-0">
            <img 
              src="/logo-nexaflow.png" 
              alt="NexaFlow Logo" 
              className={`w-11 h-11 object-contain rounded-lg ${theme === 'light' ? 'mix-blend-multiply' : 'mix-blend-screen'}`} 
            />
            <div>
              <h1 className={`text-xl font-black tracking-tight leading-none ${textMainClass}`}>NexaFlow</h1>
              <p className="text-[10px] font-black text-[#06b6d4] tracking-widest uppercase mt-1">Kasir</p>
            </div>
          </div>

          {/* NAVIGASI DESKTOP */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map(({ key, label, Icon, badge }) => (
              <button key={key} onClick={() => setActiveTab(key)} className={navBtnClass(activeTab === key)}>
                <Icon />
                <span>{label}</span>
                {badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-sm border-2 border-white">
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* TOMBOL AKSI KANAN */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2.5 rounded-xl transition-colors border-2 ${theme === 'light' ? 'text-[#1A1512] hover:bg-white border-[#D4C5B8]' : 'text-slate-300 hover:bg-slate-800 border-slate-600'}`}
            >
              <Icons.Menu />
            </button>

            {/* TOMBOL BUKA/TUTUP KAFE (Sangat Tegas) */}
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); onToggleCafeStatus(); }}
              title={isOpen ? 'Klik untuk menutup kafe' : 'Klik untuk membuka kafe'}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs shadow-md border-2 transition-all active:scale-95 ${
                isOpen
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-700'
                  : 'bg-rose-500 hover:bg-rose-600 text-white border-rose-700 animate-pulse'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full bg-white ${isOpen ? 'animate-pulse' : ''}`}></span>
              <span className="hidden sm:inline">{isOpen ? 'BUKA' : 'TUTUP'}</span>
            </button>

            {/* TOMBOL LAYAR DAPUR */}
            <button
              onClick={onOpenKitchen}
              title="Layar Dapur (KDS)"
              className={`flex items-center justify-center px-3 py-2.5 rounded-xl shadow-sm transition-all text-xs font-black border-2 ${theme === 'light' ? 'bg-white hover:bg-[#FAF6F2] text-[#1A1512] border-[#D4C5B8]' : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-600'}`}
            >
              <Icons.Utensils />
              <span className="hidden xl:inline ml-1.5">Layar Dapur</span>
            </button>

            {/* STATUS REALTIME */}
            <div className={`hidden lg:flex items-center justify-center px-3 py-2.5 rounded-xl border-2 ${realtimeStatus === 'online' ? 'bg-emerald-50 border-emerald-500' : realtimeStatus === 'offline' ? 'bg-rose-50 border-rose-500' : 'bg-amber-50 border-amber-500'}`}>
              <span className={`w-2.5 h-2.5 rounded-full ${realtimeStatus === 'online' ? 'bg-emerald-500 animate-pulse' : realtimeStatus === 'offline' ? 'bg-rose-500' : 'bg-amber-500 animate-pulse'}`}></span>
            </div>

            <div className={`w-0.5 h-6 mx-1 ${theme === 'light' ? 'bg-[#D4C5B8]' : 'bg-slate-700'}`}></div>

            {/* TOMBOL TEMA & FULLSCREEN */}
            <button
              onClick={onToggleTheme}
              title="Ganti Tema"
              className={`p-2.5 rounded-xl border-2 transition-all shadow-sm ${theme === 'light' ? 'bg-white border-[#D4C5B8] text-[#1A1512] hover:bg-[#FAF6F2]' : 'bg-slate-800 border-slate-600 text-amber-400 hover:bg-slate-700'}`}
            >
              {theme === 'light' ? <Icons.Moon /> : <Icons.Sun />}
            </button>

            <button
              onClick={onToggleFullscreen}
              title="Layar Penuh"
              className={`hidden sm:block p-2.5 rounded-xl border-2 transition-all shadow-sm ${theme === 'light' ? 'bg-white border-[#D4C5B8] text-[#1A1512] hover:bg-[#FAF6F2]' : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700'}`}
            >
              {isFullscreen ? <Icons.Shrink /> : <Icons.Expand />}
            </button>

            {/* TOMBOL LOGOUT */}
            <button
              onClick={onLogout}
              title="Logout"
              className={`p-2.5 rounded-xl border-2 transition-all shadow-sm ${theme === 'light' ? 'bg-white border-[#D4C5B8] text-[#8C7A6B] hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300' : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/50'}`}
            >
              <Icons.Logout />
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className={`md:hidden border-t-2 p-4 space-y-2 absolute w-full shadow-xl z-50 ${theme === 'light' ? 'bg-white border-[#D4C5B8]' : 'bg-slate-900 border-slate-700'}`}>
          {navItems.map(({ key, label, Icon, badge }) => (
            <button
              key={key}
              onClick={() => { setActiveTab(key); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-black transition-all border-2 ${
                activeTab === key
                  ? 'bg-[#2A1F17] text-white border-[#1A1512]'
                  : theme === 'light'
                    ? 'text-[#8C7A6B] hover:bg-[#FAF6F2] border-transparent'
                    : 'text-slate-300 hover:bg-slate-800 border-transparent'
              }`}
            >
              <Icon /> {label}
              {badge > 0 && <span className="ml-auto bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-md">{badge}</span>}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}