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
    e.preventDefault();
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