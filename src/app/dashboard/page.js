'use client';

import { useState } from 'react';
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

  const todayOrders = d.orders ? d.orders.filter(o => new Date(o.created_at).toDateString() === new Date().toDateString()) : [];
  const stats = {
    total: todayOrders.length,
    ready: todayOrders.filter(o => o.status === 'ready').length,
    cooking: todayOrders.filter(o => o.status === 'cooking').length,
    revenue: todayOrders.filter(o => o.status === 'completed').reduce((sum, o) => sum + Number(o.total_price || 0), 0)
  };
  
  const activeOrdersCount = todayOrders.filter(o => ['pending', 'cooking', 'ready'].includes(o.status)).length;

  // 🔥 SUSPEND OVERLAY — Blokir total, hanya tombol Hubungi Admin & Logout yang bisa diklik
  if (d.isSuspended) {
    const waMessage = `Halo Admin NexaFlow, akun kafe "${d.cafeName || '-'}" (email: ${d.userEmail || '-'}) sedang disuspend. Mohon bantu aktifkan kembali. Terima kasih.`;
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center border-4 border-rose-500 animate-in zoom-in-95 duration-300">
          <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-rose-300">
            <span className="text-5xl">🔒</span>
          </div>
          
          <h1 className="text-3xl font-black text-slate-900 mb-2">Akun Disuspend</h1>
          <p className="text-sm font-semibold text-slate-600 mb-1">Kafe: <span className="font-black text-slate-900">{d.cafeName || '-'}</span></p>
          <p className="text-xs font-semibold text-slate-500 mb-6">{d.userEmail || '-'}</p>
          
          <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 mb-6 text-left">
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
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-2xl text-base shadow-lg active:scale-95 transition-transform border-2 border-emerald-700"
            >
              💬 Hubungi Admin
            </a>
            <button
              onClick={d.handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-black py-3 rounded-2xl text-sm active:scale-95 transition-transform border-2 border-slate-300"
            >
              🚪 Logout
            </button>
          </div>

          <p className="text-[10px] font-bold text-slate-400 mt-6">
            NexaFlow SaaS · Sistem dalam mode terbatas
          </p>
        </div>
      </div>
    );
  }

  if (d.isExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border-2 border-red-200">
          <div className="text-6xl mb-4">⏳</div>
          <h1 className="text-2xl font-black text-slate-900 mb-2">Masa Trial Habis</h1>
          <p className="text-slate-600 mb-6 font-medium">Silakan hubungi admin untuk memperpanjang langganan kafe Anda.</p>
          <button onClick={d.handleLogout} className="bg-slate-800 text-white font-bold py-3 px-6 rounded-xl w-full">Logout</button>
        </div>
      </div>
    );
  }

  return (
    <div onClick={d.unlockAudio} className={`min-h-screen font-sans ${d.theme === 'light' ? 'bg-[#F4EFE9] text-[#2A1F17]' : 'bg-slate-950 text-white'}`}>
      <Header 
        theme={d.theme} cafeName={d.cafeName} activeTab={activeTab} setActiveTab={setActiveTab} 
        activeOrdersCount={activeOrdersCount} realtimeStatus={d.realtimeStatus} isFullscreen={d.isFullscreen}
        isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen}
        onToggleTheme={d.toggleTheme} onToggleFullscreen={d.toggleFullscreen}
        onLogout={d.handleLogout} onOpenKitchen={() => d.openKitchenLink(setKitchenModal)}
        isOpen={d.isOpen} onToggleCafeStatus={d.handleToggleCafeStatus}
      />

      <main className="max-w-7xl mx-auto p-4 md:p-6 pb-24">
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
      
      <Toast toasts={d.toasts || []} />
      <ConfirmDialog theme={d.theme} dialog={d.confirmDialog || { open: false }} onClose={() => d.setConfirmDialog({ ...d.confirmDialog, open: false })} />
    </div>
  );
}

export default dynamic(() => Promise.resolve(DashboardContent), { ssr: false });