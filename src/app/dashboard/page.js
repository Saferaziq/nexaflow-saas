'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useDashboard } from './hooks/useDashboard';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import Toast from './components/Toast';
import ConfirmDialog from './components/ConfirmDialog';
import TabContent from './components/TabContent';
import MenuModal from './components/MenuModal';
import KitchenModal from './components/KitchenModal';

const WA_ADMIN = '6281389744957';

function DashboardContent() {
  const d = useDashboard();
  const [activeTab, setActiveTab] = useState('queue');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [menuModal, setMenuModal] = useState({ open: false, mode: 'add', data: null });
  const [kitchenModal, setKitchenModal] = useState({ open: false, url: '', pin: '' });
  const [newTableNum, setNewTableNum] = useState('');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  const handleOpenAddMenu = () => setMenuModal({ open: true, mode: 'add', data: null });
  const handleOpenEditMenu = (menu) => setMenuModal({ open: true, mode: 'edit', data: menu });

  const handleAddTable = (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    d.handleAddTable(newTableNum, setNewTableNum);
  };

  const handleUploadImage = (e, type) => {
    const setUploading = type === 'logo' ? setUploadingLogo : setUploadingBanner;
    d.handleImageUpload(e, type, setUploading, null);
  };

  // 🔥 OPTIMASI 3: useMemo untuk Stats agar tidak re-render berat saat ganti tab
  const { stats, activeOrdersCount } = useMemo(() => {
    const todayOrders = d.orders ? d.orders.filter(o => new Date(o.created_at).toDateString() === new Date().toDateString()) : [];
    const s = {
      total: todayOrders.length,
      ready: todayOrders.filter(o => o.status === 'ready').length,
      cooking: todayOrders.filter(o => o.status === 'cooking').length,
      revenue: todayOrders.filter(o => o.status === 'completed').reduce((sum, o) => sum + Number(o.total_price || 0), 0)
    };
    const count = todayOrders.filter(o => ['pending', 'cooking', 'ready'].includes(o.status)).length;
    return { stats: s, activeOrdersCount: count };
  }, [d.orders]);

  if (d.isSuspended) {
    const waMessage = `Halo Admin NexaFlow, akun kafe "${d.cafeName || '-'}" (email: ${d.userEmail || '-'}) sedang disuspend. Mohon bantu aktifkan kembali. Terima kasih.`;
    return (
      <div className="min-h-screen bg-[#2A1F17] flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center border-4 border-rose-500">
          <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-rose-200">
            <span className="text-5xl">🔒</span>
          </div>
          
          <h1 className="text-3xl font-black text-[#1A1512] mb-2">Akun Disuspend</h1>
          <p className="text-sm font-bold text-[#8C7A6B] mb-1">Kafe: <span className="font-black text-[#1A1512]">{d.cafeName || '-'}</span></p>
          <p className="text-xs font-semibold text-[#A69B91] mb-6">{d.userEmail || '-'}</p>
          
          <div className="bg-rose-50 border-2 border-rose-200 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm font-bold text-rose-900 leading-relaxed">
              Akun kafe Anda telah <strong>dinonaktifkan oleh Admin NexaFlow</strong>. 
              Silakan hubungi admin untuk informasi lebih lanjut dan mengaktifkan kembali akun Anda.
            </p>
          </div>

          <div className="space-y-3">
            <a
              href={`https://wa.me/${WA_ADMIN}?text=${encodeURIComponent(waMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-xl text-base shadow-lg active:scale-95 transition-transform border-2 border-emerald-700"
            >
              💬 Hubungi Admin
            </a>
            <button
              onClick={d.handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-[#F4EFE9] hover:bg-[#E8DFD3] text-[#2A1F17] font-black py-3 rounded-xl text-sm active:scale-95 transition-transform border-2 border-[#D3C8BB]"
            >
              🚪 Logout
            </button>
          </div>

          <p className="text-[10px] font-bold text-[#A69B91] mt-6">
            NexaFlow SaaS · Sistem dalam mode terbatas
          </p>
        </div>
      </div>
    );
  }

  if (d.isExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4EFE9] p-6">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border-2 border-rose-200">
          <div className="text-6xl mb-4">⏳</div>
          <h1 className="text-2xl font-black text-[#1A1512] mb-2">Masa Trial Habis</h1>
          <p className="text-[#8C7A6B] mb-6 font-medium">Silakan hubungi admin untuk memperpanjang langganan kafe Anda.</p>
          <button onClick={d.handleLogout} className="bg-[#2A1F17] hover:bg-[#1A1512] text-white font-black py-3 px-6 rounded-xl w-full transition-colors border-2 border-[#1A1512]">Logout</button>
        </div>
      </div>
    );
  }

  return (
    <div onClick={d.unlockAudio} className={`min-h-screen font-sans ${d.theme === 'light' ? 'bg-[#F4EFE9] text-[#1A1512]' : 'bg-[#0a192f] text-white'}`}>
      
      {/* 
        CATATAN UNTUK ANDA:
        Komponen <Header /> di bawah ini memegang peran Sidebar & Top Nav.
        Agar tampilannya 100% seperti mockup "Tegas & Jelas" (sidebar coklat gelap),
        kita perlu memperbarui file Header.js dan StatsCards.js terpisah.
        Untuk saat ini, wrapper utama sudah diatur ke warna Cream & Teks Tegas.
      */}
      <Header 
        theme={d.theme} cafeName={d.cafeName} activeTab={activeTab} setActiveTab={setActiveTab} 
        activeOrdersCount={activeOrdersCount} realtimeStatus={d.realtimeStatus} isFullscreen={d.isFullscreen}
        isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen}
        onToggleTheme={d.toggleTheme} onToggleFullscreen={d.toggleFullscreen}
        onLogout={d.handleLogout} onOpenKitchen={() => d.openKitchenLink(setKitchenModal)}
        isOpen={d.isOpen} onToggleCafeStatus={d.handleToggleCafeStatus}
      />

      {!d.audioUnlocked && (
        <div className="w-full bg-amber-500 text-[#1A1512] text-center py-3 px-4 text-sm font-black shadow-md animate-pulse cursor-pointer border-b-2 border-amber-700" onClick={d.unlockAudio}>
          🔔 Klik di sini untuk mengaktifkan suara notifikasi pesanan
        </div>
      )}

      <main className="max-w-7xl mx-auto p-4 md:p-6 pb-24">
        
        {/* Memanggil komponen StatsCards. 
            Untuk teks yang super tebal dan kartu bergaris tegas, file StatsCards.js juga perlu disesuaikan. 
        */}
        <StatsCards theme={d.theme} stats={stats} rp={d.rp} />

        <div className="mt-6">
          <TabContent 
            activeTab={activeTab} theme={d.theme} d={d} rp={d.rp} 
            displayOrders={d.displayOrders || []} queueFilter={d.queueFilter} setQueueFilter={d.setQueueFilter}
            menuSearch={d.menuSearch} setMenuSearch={d.setMenuSearch} menuCategoryFilter={d.menuCategoryFilter} setMenuCategoryFilter={d.setMenuCategoryFilter}
            newTableNum={newTableNum} setNewTableNum={setNewTableNum} onOpenAddMenu={handleOpenAddMenu} onOpenEditMenu={handleOpenEditMenu} onAddTable={handleAddTable}
            onDownloadQR={d.handleDownloadQR} onPrintBill={d.handlePrintBill}
            reportMode={d.reportMode || 'daily'} setReportMode={d.setReportMode} reportDateStr={d.reportDateStr || ''} setReportDateStr={d.setReportDateStr}
            reportMonth={d.reportMonth || 0} setReportMonth={d.setReportMonth} reportYear={d.reportYear || new Date().getFullYear()} setReportYear={d.setReportYear}
            reportStartDateStr={d.reportStartDateStr || ''} setReportStartDateStr={d.setReportStartDateStr} reportEndDateStr={d.reportEndDateStr || ''} setReportEndDateStr={d.setReportEndDateStr}
            reportLabel={d.reportLabel || ''} reportStats={d.reportStats || { totalOrders: 0, revenue: 0, avgOrder: 0, totalItems: 0 }}
            topMenus={d.topMenus || []} chartData={d.chartData || []} maxChartRev={d.maxChartRev || 1} totalChartRev={d.totalChartRev || 0} activeDays={d.activeDays || []}
            handleExportCSV={d.onExportCSV} handlePrintReport={d.onPrintReport}
            handleUploadImage={handleUploadImage} uploadingLogo={uploadingLogo} uploadingBanner={uploadingBanner} onSaveSettings={d.handleSaveSettings}
            isOpen={d.isOpen} onToggleCafeStatus={d.handleToggleCafeStatus}
          />
        </div>
      </main>

      {menuModal.open && (
        <MenuModal theme={d.theme} mode={menuModal.mode} initialData={menuModal.data} 
          onClose={() => setMenuModal({ open: false, mode: 'add', data: null })} 
          onSave={d.handleSaveMenu} onUploadImage={d.handleImageUpload} 
        />
      )}

      {kitchenModal.open && (
        <KitchenModal theme={d.theme} url={kitchenModal.url} pin={kitchenModal.pin} 
          onClose={() => setKitchenModal({ open: false, url: '', pin: '' })} showToast={d.showToast} 
        />
      )}

      {/* MODAL CANCEL ORDER (Tegas & Jelas) */}
      {d.cancelModal?.open && (
        <div className="fixed inset-0 bg-[#1A1512]/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
          <div className={`w-full max-w-md rounded-2xl shadow-2xl border-2 overflow-hidden animate-in zoom-in-95 duration-200 ${d.theme === 'light' ? 'bg-white border-[#E0D6CC]' : 'bg-slate-900 border-slate-700'}`}>
            <div className="p-6">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto border-2 ${d.theme === 'light' ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-rose-900/30 text-rose-400 border-rose-700'}`}>
                <span className="text-2xl font-black">!</span>
              </div>
              <h3 className={`text-xl font-black text-center mb-2 ${d.theme === 'light' ? 'text-[#1A1512]' : 'text-white'}`}>Tolak Pesanan</h3>
              <p className={`text-sm font-bold text-center mb-6 ${d.theme === 'light' ? 'text-[#8C7A6B]' : 'text-slate-400'}`}>Pesanan akan dibatalkan permanen. Harap masukkan alasan penolakan.</p>
              
              <div className="mb-6">
                <label className={`block text-xs font-black uppercase tracking-widest mb-2 ${d.theme === 'light' ? 'text-[#2A1F17]' : 'text-slate-400'}`}>Alasan Penolakan</label>
                <input 
                  type="text" 
                  value={d.cancelModal.reason} 
                  onChange={(e) => d.setCancelModal({ ...d.cancelModal, reason: e.target.value })}
                  placeholder="Contoh: Stok habis, Pembeli batal"
                  className={`w-full border-2 rounded-xl px-4 py-3 text-sm font-bold outline-none transition-all focus:border-[var(--primary-color)] ${d.theme === 'light' ? 'border-[#E0D6CC] bg-[#FAF6F2] text-[#1A1512] focus:bg-white' : 'border-slate-600 bg-slate-800 text-white'}`}
                />
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => d.setCancelModal({ open: false, orderId: null, reason: '' })} 
                  className={`flex-1 font-black py-3 rounded-xl border-2 transition-all text-sm uppercase tracking-wide ${d.theme === 'light' ? 'bg-[#FAF6F2] border-[#E0D6CC] text-[#2A1F17] hover:bg-[#F4EFE9]' : 'bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700'}`}
                >
                  Batal
                </button>
                <button 
                  onClick={d.executeCancelOrder}
                  className="flex-1 bg-rose-600 text-white font-black py-3 rounded-xl border-2 border-rose-700 hover:bg-rose-700 transition-all shadow-md text-sm uppercase tracking-wide"
                >
                  Tolak Pesanan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Toast toasts={d.toasts || []} />
      <ConfirmDialog theme={d.theme} dialog={d.confirmDialog || { open: false }} onClose={() => d.setConfirmDialog({ ...d.confirmDialog, open: false })} />
    </div>
  );
}

export default dynamic(() => Promise.resolve(DashboardContent), { ssr: false });