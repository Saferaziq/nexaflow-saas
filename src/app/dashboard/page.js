'use client';

import { useState } from 'react';
import { Icons } from './helpers/icons';
import { generateDynamicQRIS } from './helpers/qris';
import { printDailyReport, printBillWithQRIS, printTableQR, exportCSV, printReport } from './helpers/print';
import { useDashboard } from './hooks/useDashboard';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import Toast from './components/Toast';
import ConfirmDialog from './components/ConfirmDialog';
import TabContent from './components/TabContent';
import MenuModal from './components/MenuModal';
import KitchenModal from './components/KitchenModal';

const WA_NUMBER = '6281389744957';

export default function DashboardPage() {
  const d = useDashboard();

  const [activeTab, setActiveTab] = useState('queue');
  const [queueFilter, setQueueFilter] = useState('active');
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [currentMenu, setCurrentMenu] = useState({ id: null, name: '', category: 'makanan', price: '', desc: '', status: 'available', image_url: '' });
  const [newTableNum, setNewTableNum] = useState('');
  const [menuSearch, setMenuSearch] = useState('');
  const [menuCategoryFilter, setMenuCategoryFilter] = useState('all');
  const [uploading, setUploading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [kitchenModal, setKitchenModal] = useState({ open: false, url: '', pin: '' });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [reportMode, setReportMode] = useState('daily');
  const [reportDateStr, setReportDateStr] = useState('');
  const [reportMonth, setReportMonth] = useState(0);
  const [reportYear, setReportYear] = useState(2026);
  const [reportStartDateStr, setReportStartDateStr] = useState('');
  const [reportEndDateStr, setReportEndDateStr] = useState('');

  const activeOrders = d.orders.filter(o => ['pending', 'cooking', 'ready'].includes(o.status));
  const filteredOrders = queueFilter === 'active' ? activeOrders
    : queueFilter === 'done' ? d.orders.filter(o => ['completed', 'cancelled'].includes(o.status))
      : d.orders;
  const displayOrders = (() => {
    const a = [...filteredOrders];
    if (queueFilter === 'active') a.sort((x, y) => new Date(x.created_at) - new Date(y.created_at));
    else a.sort((x, y) => new Date(y.created_at) - new Date(x.created_at));
    return a;
  })();

  const todayOrders = d.todayStr ? d.orders.filter(o => new Date(o.created_at).toDateString() === d.todayStr) : [];
  const stats = {
    total: todayOrders.length,
    cooking: todayOrders.filter(o => o.status === 'cooking').length,
    ready: todayOrders.filter(o => o.status === 'ready').length,
    revenue: todayOrders.filter(o => o.payment_status === 'paid').reduce((s, o) => s + Number(o.total_price), 0),
  };

  let reportOrders = [];
  let reportStats = { totalOrders: 0, revenue: 0, paidCount: 0, totalItems: 0, avgOrder: 0, statusCount: { pending: 0, cooking: 0, ready: 0, completed: 0, cancelled: 0 } };
  let topMenus = [];
  let activeDays = [];
  let reportLabel = 'Memuat...';

  if (d.baseUrl) {
    const now = new Date();
    let startD, endD;
    if (reportMode === 'daily') {
      const b = reportDateStr ? new Date(reportDateStr + 'T00:00:00') : now;
      startD = new Date(b.getFullYear(), b.getMonth(), b.getDate());
      endD = new Date(startD.getTime() + 86400000);
    } else if (reportMode === 'monthly') {
      startD = new Date(reportYear, reportMonth, 1);
      endD = new Date(reportYear, reportMonth + 1, 1);
    } else {
      const s = reportStartDateStr ? new Date(reportStartDateStr + 'T00:00:00') : new Date(now.getFullYear(), now.getMonth(), 1);
      const e = reportEndDateStr ? new Date(reportEndDateStr + 'T00:00:00') : now;
      startD = new Date(s.getFullYear(), s.getMonth(), s.getDate());
      endD = new Date(e.getFullYear(), e.getMonth(), e.getDate() + 1);
    }
    reportOrders = d.orders.filter(o => { const dt = new Date(o.created_at); return dt >= startD && dt < endD; });
    reportStats = {
      totalOrders: reportOrders.length,
      revenue: reportOrders.filter(o => o.payment_status === 'paid').reduce((s, o) => s + Number(o.total_price || 0), 0),
      paidCount: reportOrders.filter(o => o.payment_status === 'paid').length,
      totalItems: reportOrders.reduce((s, o) => s + (o.items || []).reduce((si, i) => si + (i.qty || 0), 0), 0),
      statusCount: {
        pending: reportOrders.filter(o => o.status === 'pending').length,
        cooking: reportOrders.filter(o => o.status === 'cooking').length,
        ready: reportOrders.filter(o => o.status === 'ready').length,
        completed: reportOrders.filter(o => o.status === 'completed').length,
        cancelled: reportOrders.filter(o => o.status === 'cancelled').length,
      },
    };
    reportStats.avgOrder = reportStats.paidCount > 0 ? reportStats.revenue / reportStats.paidCount : 0;
    const ms = {};
    reportOrders.forEach(o => (o.items || []).forEach(it => {
      const k = it.name || 'Unknown';
      if (!ms[k]) ms[k] = { qty: 0, revenue: 0 };
      ms[k].qty += it.qty || 0;
      ms[k].revenue += (it.price || 0) * (it.qty || 0);
    }));
    topMenus = Object.entries(ms).sort((a, b) => b[1].qty - a[1].qty).slice(0, 5);
    const dm = {};
    reportOrders.forEach(o => {
      const dt = new Date(o.created_at);
      const k = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
      if (!dm[k]) dm[k] = { date: dt, orders: 0, revenue: 0 };
      dm[k].orders += 1;
      if (o.payment_status === 'paid') dm[k].revenue += Number(o.total_price || 0);
    });
    activeDays = Object.values(dm).sort((a, b) => a.date - b.date);
    if (reportMode === 'daily') reportLabel = startD.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    else if (reportMode === 'monthly') reportLabel = new Date(reportYear, reportMonth, 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    else {
      const s = startD.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
      const e = new Date(endD.getTime() - 86400000).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
      reportLabel = `${s} - ${e}`;
    }
  }

  const chartData = [];
  if (d.baseUrl) {
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const ds = new Date(day.getFullYear(), day.getMonth(), day.getDate());
      const de = new Date(ds.getTime() + 86400000);
      const dOrd = d.orders.filter(o => { const dt = new Date(o.created_at); return dt >= ds && dt < de; });
      const dRev = dOrd.filter(o => o.payment_status === 'paid').reduce((s, o) => s + Number(o.total_price || 0), 0);
      chartData.push({ label: day.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }), revenue: dRev, orders: dOrd.length });
    }
  }
  const maxChartRev = Math.max(...chartData.map(c => c.revenue), 1);
  const totalChartRev = chartData.reduce((s, c) => s + c.revenue, 0);

  const openAddMenu = () => { setCurrentMenu({ id: null, name: '', category: 'makanan', price: '', desc: '', status: 'available', image_url: '' }); setIsMenuModalOpen(true); };
  const openEditMenu = (m) => { setCurrentMenu({ id: m.id, name: m.name, category: m.category, price: m.price, desc: m.description || '', status: m.status, image_url: m.image_url || '' }); setIsMenuModalOpen(true); };
  const handleSaveMenu = (e) => { e.preventDefault(); d.handleSaveMenu(currentMenu, setCurrentMenu); setIsMenuModalOpen(false); };
  const handleAddTable = (e) => { e.preventDefault(); d.handleAddTable(newTableNum, setNewTableNum); };
  const handleUploadMenuImg = (e) => d.handleImageUpload(e, 'menu', setUploading, setCurrentMenu);
  const handleUploadLogo = (e) => d.handleImageUpload(e, 'logo', setUploadingLogo);
  const handleUploadBanner = (e) => d.handleImageUpload(e, 'banner', setUploadingBanner);
  const handleSaveSettings = (e) => d.handleSaveSettings(e);

  const handlePrintDaily = () => printDailyReport({ orders: d.orders, settings: d.settings, userEmail: d.userEmail });
  const handlePrintBill = (o) => printBillWithQRIS({ order: o, settings: d.settings, generateDynamicQRIS, showToast: d.showToast });
  const handlePrintQRTable = (t) => printTableQR({ table: t, baseUrl: d.baseUrl, tenantId: d.tenantId, settings: d.settings, showToast: d.showToast });
  const handleExportCSV = () => exportCSV({ reportOrders, reportLabelForFile: reportLabel, showToast: d.showToast });
  const handlePrintReport = () => printReport({ reportStats, topMenus, reportLabel, settings: d.settings, reportNow: new Date() });

  const handleOpenKitchen = () => d.openKitchenLink(setKitchenModal);
  const handleCopyKdsUrl = () => { if (navigator.clipboard) { navigator.clipboard.writeText(kitchenModal.url); d.showToast('URL disalin', 'success'); } };

  if (d.isExpired) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 font-sans ${d.theme === 'light' ? 'bg-[#F4EFE9]' : 'bg-slate-950'}`}>
        <div className={`rounded-[2rem] p-8 max-w-lg w-full text-center shadow-2xl border-2 ${d.theme === 'light' ? 'bg-white border-[#D4C5B8]' : 'bg-slate-900 border-slate-700'}`}>
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${d.theme === 'light' ? 'bg-rose-100 text-rose-500' : 'bg-rose-500/20 text-rose-400'}`}><Icons.Lock /></div>
          <h1 className={`text-3xl font-black mb-2 ${d.theme === 'light' ? 'text-[#2A1F17]' : 'text-white'}`}>Masa Trial Berakhir</h1>
          <p className={`font-semibold mb-8 ${d.theme === 'light' ? 'text-[#5C4B3E]' : 'text-slate-300'}`}>Silakan perpanjang langganan Anda.</p>
          <a href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Halo Admin NexaFlow, saya ingin memperpanjang langganan: ' + d.cafeName)}`} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-[var(--primary-color)] text-white font-bold py-4 rounded-xl shadow-lg text-lg">
            <Icons.WhatsApp /> Perpanjang Sekarang
          </a>
          <button onClick={d.handleLogout} className={`mt-8 text-xs font-bold underline ${d.theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Keluar Akun</button>
        </div>
      </div>
    );
  }

  if (!d.tenantId) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${d.theme === 'light' ? 'bg-[#F4EFE9]' : 'bg-slate-950'}`}>
        <div className="text-center">
          <div className={`w-16 h-16 border-4 border-t-[var(--primary-color)] rounded-full animate-spin mx-auto mb-4 ${d.theme === 'light' ? 'border-[#D4C5B8]' : 'border-slate-700'}`}></div>
          <h2 className={`text-xl font-black ${d.theme === 'light' ? 'text-[#2A1F17]' : 'text-white'}`}>Memuat Dashboard...</h2>
        </div>
      </div>
    );
  }

  const bgClass = d.theme === 'light' ? 'bg-[#F4EFE9]' : 'bg-slate-950';
  const textMainClass = d.theme === 'light' ? 'text-[#2A1F17]' : 'text-white';

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${bgClass} ${textMainClass}`}>
      <Header
        theme={d.theme} cafeName={d.cafeName}
        activeTab={activeTab} setActiveTab={setActiveTab}
        activeOrdersCount={activeOrders.length}
        realtimeStatus={d.realtimeStatus} isFullscreen={d.isFullscreen}
        isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen}
        audioUnlocked={d.audioUnlocked} soundEnabled={d.soundEnabled}
        onToggleTheme={d.toggleTheme} onToggleSound={d.handleSoundToggle}
        onToggleFullscreen={d.toggleFullscreen} onLogout={d.handleLogout}
        onOpenKitchen={handleOpenKitchen} onPrintDaily={handlePrintDaily}
      />

      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        <StatsCards theme={d.theme} stats={stats} rp={d.rp} />

        <div className="mt-6">
          <TabContent
            activeTab={activeTab} theme={d.theme} d={d} rp={d.rp}
            displayOrders={displayOrders}
            queueFilter={queueFilter} setQueueFilter={setQueueFilter}
            menuSearch={menuSearch} setMenuSearch={setMenuSearch}
            menuCategoryFilter={menuCategoryFilter} setMenuCategoryFilter={setMenuCategoryFilter}
            newTableNum={newTableNum} setNewTableNum={setNewTableNum}
            openAddMenu={openAddMenu} openEditMenu={openEditMenu}
            onAddTable={handleAddTable} onPrintQRTable={handlePrintQRTable}
            onPrintBill={handlePrintBill}
            reportMode={reportMode} setReportMode={setReportMode}
            reportDateStr={reportDateStr} setReportDateStr={setReportDateStr}
            reportMonth={reportMonth} setReportMonth={setReportMonth}
            reportYear={reportYear} setReportYear={setReportYear}
            reportStartDateStr={reportStartDateStr} setReportStartDateStr={setReportStartDateStr}
            reportEndDateStr={reportEndDateStr} setReportEndDateStr={setReportEndDateStr}
            reportLabel={reportLabel} reportStats={reportStats}
            topMenus={topMenus} chartData={chartData}
            maxChartRev={maxChartRev} totalChartRev={totalChartRev}
            activeDays={activeDays}
            handleExportCSV={handleExportCSV} handlePrintReport={handlePrintReport}
            handleUploadImage={(e, type) => { if (type === 'logo') handleUploadLogo(e); else if (type === 'banner') handleUploadBanner(e); }}
            uploadingLogo={uploadingLogo} uploadingBanner={uploadingBanner}
            onSaveSettings={handleSaveSettings}
          />
        </div>
      </main>

      <MenuModal
        theme={d.theme} open={isMenuModalOpen} currentMenu={currentMenu}
        setCurrentMenu={setCurrentMenu} onClose={() => setIsMenuModalOpen(false)}
        onSave={handleSaveMenu} onUploadImage={handleUploadMenuImg} uploading={uploading}
      />

      <KitchenModal
        theme={d.theme} kitchenModal={kitchenModal}
        onClose={() => setKitchenModal({ open: false, url: '', pin: '' })}
        onCopyUrl={handleCopyKdsUrl}
      />

      <Toast toasts={d.toasts} />

      <ConfirmDialog
        theme={d.theme} dialog={d.confirmDialog}
        onClose={() => d.setConfirmDialog({ open: false, title: '', message: '', onConfirm: null, danger: false })}
      />
    </div>
  );
}