'use client';

import { useDashboard } from './hooks/useDashboard';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import Toast from './components/Toast';
import ConfirmDialog from './components/ConfirmDialog';
import TabContent from './components/TabContent';
import MenuModal from './components/MenuModal';
import KitchenModal from './components/KitchenModal';
import { useState } from 'react';

export default function DashboardPage() {
  const d = useDashboard();
  const [activeTab, setActiveTab] = useState('queue');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [menuModal, setMenuModal] = useState({ open: false, menu: null });
  const [uploading, setUploading] = useState(false);
  const [kitchenModal, setKitchenModal] = useState({ open: false, url: '', pin: '' });
  const [newTableNum, setNewTableNum] = useState('');

  const [reportMode, setReportMode] = useState('daily');
  const [reportDateStr, setReportDateStr] = useState('');
  const [reportMonth, setReportMonth] = useState(new Date().toISOString().slice(0, 7).split('-')[1]);
  const [reportYear, setReportYear] = useState(new Date().getFullYear());
  const [reportStartDateStr, setReportStartDateStr] = useState('');
  const [reportEndDateStr, setReportEndDateStr] = useState('');

  const openAddMenu = () => {
    setMenuModal({
      open: true,
      menu: { id: null, name: '', category: 'makanan', price: '', desc: '', status: 'available', image_url: '' }
    });
  };

  const openEditMenu = (menu) => {
    setMenuModal({ open: true, menu });
  };

  if (d.isExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4EFE9] text-[#3A2A20] p-6">
        <div className="bg-white p-10 rounded-3xl shadow-xl border-2 border-[#D4C5B8] text-center max-w-md w-full">
          <h2 className="text-2xl font-black mb-4">Masa Aktif Habis</h2>
          <p className="text-sm font-semibold mb-6">Silakan hubungi admin untuk perpanjangan langganan.</p>
          <button onClick={d.handleLogout} className="bg-[#3A2A20] text-white font-bold py-3 px-6 rounded-xl w-full">Logout</button>
        </div>
      </div>
    );
  }

  const bgClass = d.theme === 'light' ? 'bg-[#F4EFE9]' : 'bg-slate-950';
  const textMainClass = d.theme === 'light' ? 'text-[#2A1F17]' : 'text-white';

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${bgClass} ${textMainClass}`}>
      <Header
        theme={d.theme}
        cafeName={d.cafeName}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeOrdersCount={d.orders.filter(o => ['pending', 'cooking'].includes(o.status)).length}
        realtimeStatus={d.realtimeStatus}
        isFullscreen={d.isFullscreen}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        audioUnlocked={d.audioUnlocked}
        soundEnabled={d.soundEnabled}
        onToggleTheme={d.toggleTheme}
        onToggleSound={d.handleSoundToggle}
        onToggleFullscreen={d.toggleFullscreen}
        onLogout={d.handleLogout}
        onOpenKitchen={() => d.openKitchenLink(setKitchenModal)}
        onPrintDaily={d.handlePrintDaily}
      />

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <StatsCards
          theme={d.theme}
          stats={{
            total: d.orders.filter(o => new Date(o.created_at).toDateString() === new Date().toDateString()).length,
            cooking: d.orders.filter(o => new Date(o.created_at).toDateString() === new Date().toDateString() && o.status === 'cooking').length,
            ready: d.orders.filter(o => new Date(o.created_at).toDateString() === new Date().toDateString() && o.status === 'ready').length,
            revenue: d.orders
              .filter(o => new Date(o.created_at).toDateString() === new Date().toDateString() && o.status === 'completed')
              .reduce((sum, o) => sum + (o.total_price || 0), 0)
          }}
          rp={d.rp}
        />

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
          openAddMenu={openAddMenu}
          openEditMenu={openEditMenu}
          onAddTable={d.handleAddTable}
          onDownloadQR={d.handleDownloadQR}
          onPrintBill={d.handlePrintBill}
          reportMode={reportMode} setReportMode={setReportMode}
          reportDateStr={reportDateStr} setReportDateStr={setReportDateStr}
          reportMonth={reportMonth} setReportMonth={setReportMonth}
          reportYear={reportYear} setReportYear={setReportYear}
          reportStartDateStr={reportStartDateStr} setReportStartDateStr={setReportStartDateStr}
          reportEndDateStr={reportEndDateStr} setReportEndDateStr={setReportEndDateStr}
          reportLabel="Laporan"
          reportStats={{ total: 0, count: 0, avg: 0 }}
          topMenus={[]}
          chartData={[]}
          maxChartRev={0}
          totalChartRev={0}
          activeDays={[]}
          handleExportCSV={() => {}}
          handlePrintReport={() => {}}
          handleUploadImage={d.handleImageUpload}
          uploadingLogo={false}
          uploadingBanner={false}
          onSaveSettings={d.handleSaveSettings}
        />
      </div>

      <MenuModal
        theme={d.theme}
        open={menuModal.open}
        currentMenu={menuModal.menu || {}}
        setCurrentMenu={(m) => setMenuModal({ ...menuModal, menu: m })}
        onClose={() => setMenuModal({ open: false, menu: null })}
        onSave={() => {
          d.handleSaveMenu(menuModal.menu, () => setMenuModal({ open: false, menu: null }));
        }}
        onUploadImage={(e, type, setFn) => d.handleImageUpload(e, type, setUploading, (updater) => {
          const updated = updater(menuModal.menu);
          setMenuModal({ ...menuModal, menu: updated });
        })}
        uploading={uploading}
      />

      <KitchenModal
        theme={d.theme}
        kitchenModal={kitchenModal}
        onClose={() => setKitchenModal({ open: false, url: '', pin: '' })}
        onCopyUrl={() => navigator.clipboard.writeText(kitchenModal.url)}
      />

      <Toast toasts={d.toasts} />
      <ConfirmDialog theme={d.theme} dialog={d.confirmDialog} onClose={() => d.setConfirmDialog({ open: false })} />
    </div>
  );
}