'use client';

import { useState } from 'react';
import { useDashboard } from './hooks/useDashboard';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import Toast from './components/Toast';
import ConfirmDialog from './components/ConfirmDialog';
import TabContent from './components/TabContent';
import MenuModal from './components/MenuModal';
import KitchenModal from './components/KitchenModal';

export default function DashboardPage() {
  const d = useDashboard();
  const [activeTab, setActiveTab] = useState('queue');
  
  // State modal
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
    <div className={`min-h-screen font-sans ${d.theme === 'light' ? 'bg-[#F4EFE9] text-[#2A1F17]' : 'bg-slate-950 text-white'}`}>
      
      {/* HEADER */}
      <Header 
        theme={d.theme} 
        toggleTheme={d.toggleTheme} 
        soundEnabled={d.soundEnabled} 
        handleSoundToggle={d.handleSoundToggle} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        handleLogout={d.handleLogout}
        toggleFullscreen={d.toggleFullscreen}
        isFullscreen={d.isFullscreen}
        cafeName={d.cafeName}
        realtimeStatus={d.realtimeStatus}
        onOpenKitchen={() => d.openKitchenLink(setKitchenModal)}
        onPrintDaily={d.handlePrintDaily}
      />

      <main className="max-w-7xl mx-auto p-4 md:p-6 pb-24">
        
        {/* STATS CARDS */}
        <StatsCards 
          theme={d.theme} 
          orders={d.orders} 
          rp={d.rp} 
          todayStr={d.todayStr} 
        />

        {/* TAB CONTENT */}
        <div className="mt-6">
          <TabContent 
            activeTab={activeTab} 
            theme={d.theme} 
            d={d} 
            rp={d.rp} 
            displayOrders={d.displayOrders}
            queueFilter={d.queueFilter}
            setQueueFilter={d.setQueueFilter}
            menuSearch={d.menuSearch}
            setMenuSearch={d.setMenuSearch}
            menuCategoryFilter={d.menuCategoryFilter}
            setMenuCategoryFilter={d.setMenuCategoryFilter}
            newTableNum={newTableNum}
            setNewTableNum={setNewTableNum}
            openAddMenu={handleOpenAddMenu}
            openEditMenu={handleOpenEditMenu}
            onAddTable={handleAddTable}
            onDownloadQR={d.handleDownloadQR}
            onPrintBill={d.handlePrintBill}
            
            {/* PROPS LAPORAN (INI YANG SEBELUMNYA HILANG/BERBEDA) */}
            reportMode={d.reportMode}
            setReportMode={d.setReportMode}
            reportDateStr={d.reportDateStr}
            setReportDateStr={d.setReportDateStr}
            reportMonth={d.reportMonth}
            setReportMonth={d.setReportMonth}
            reportYear={d.reportYear}
            setReportYear={d.setReportYear}
            reportStartDateStr={d.reportStartDateStr}
            setReportStartDateStr={d.setReportStartDateStr}
            reportEndDateStr={d.reportEndDateStr}
            setReportEndDateStr={d.setReportEndDateStr}
            reportLabel={d.reportLabel}
            reportStats={d.reportStats}
            topMenus={d.topMenus}
            chartData={d.chartData}
            maxChartRev={d.maxChartRev}
            totalChartRev={d.totalChartRev}
            activeDays={d.activeDays}
            handleExportCSV={d.onExportCSV}
            handlePrintReport={d.onPrintReport}
            
            handleUploadImage={handleUploadImage}
            uploadingLogo={uploadingLogo}
            uploadingBanner={uploadingBanner}
            onSaveSettings={d.handleSaveSettings}
          />
        </div>
      </main>

      {/* MODALS */}
      {menuModal.open && (
        <MenuModal 
          theme={d.theme}
          mode={menuModal.mode}
          initialData={menuModal.data}
          onClose={() => setMenuModal({ open: false, mode: 'add', data: null })}
          onSave={d.handleSaveMenu}
          onUploadImage={d.handleImageUpload}
        />
      )}

      {kitchenModal.open && (
        <KitchenModal 
          theme={d.theme}
          url={kitchenModal.url}
          pin={kitchenModal.pin}
          onClose={() => setKitchenModal({ open: false, url: '', pin: '' })}
          showToast={d.showToast}
        />
      )}

      {/* NOTIFIKASI & DIALOG */}
      <Toast toasts={d.toasts} />
      <ConfirmDialog 
        theme={d.theme} 
        dialog={d.confirmDialog} 
        onClose={() => d.setConfirmDialog({ ...d.confirmDialog, open: false })} 
      />
    </div>
  );
}