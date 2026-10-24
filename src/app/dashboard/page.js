'use client';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const Icons = {
  Clipboard: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 14l2 2 4-4"/></svg>,
  Utensils: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>,
  Grid: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
  Settings: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>,
  Logout: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Print: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  Plus: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Chart: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>,
  X: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Clock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
};

export default function DashboardPage() {
  const [cafeName, setCafeName] = useState('Memuat...');
  const [userEmail, setUserEmail] = useState('');
  const [tenantId, setTenantId] = useState(null);
  const [activeTab, setActiveTab] = useState('queue');
  const [menus, setMenus] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [queueFilter, setQueueFilter] = useState('active');
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [currentMenu, setCurrentMenu] = useState({ id: null, name: '', category: 'makanan', price: '', desc: '', status: 'available', image_url: '' });
  const [settings, setSettings] = useState({ name: '', wa: '', address: '', logo_url: '' });
  const [newTableNum, setNewTableNum] = useState('');
  const [todayStr, setTodayStr] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [reportPeriod, setReportPeriod] = useState('daily');
  const [reportNow, setReportNow] = useState(null);
  const [nowTick, setNowTick] = useState(0);
  const fileInputRef = useRef(null);
  const logoInputRef = useRef(null);
  const router = useRouter();

  const rp = (num) => 'Rp ' + Number(num || 0).toLocaleString('id-ID');

  // Tick waktu untuk badge "menunggu X menit" — update tiap 60 detik
  useEffect(() => {
    const update = () => setNowTick(Date.now());
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setTodayStr(new Date().toDateString());
    setReportNow(new Date());
    setBaseUrl(window.location.origin);
    let channel, isMounted = true;

    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return router.push('/login');
      if (!isMounted) return;
      setUserEmail(session.user.email);

      const { data: userData } = await supabase.from('users').select('tenant_id, tenants(*)').eq('id', session.user.id).single();
      if (userData && userData.tenants && isMounted) {
        const tId = userData.tenant_id;
        setTenantId(tId);
        setCafeName(userData.tenants.name);
        setSettings({ name: userData.tenants.name, wa: userData.tenants.wa_number || '', address: userData.tenants.address || '', logo_url: userData.tenants.logo_url || '' });
        fetchMenus(tId); fetchTables(tId); fetchOrders(tId);
        channel = supabase.channel('realtime-orders-' + Date.now())
          .on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: `tenant_id=eq.${tId}` }, () => fetchOrders(tId))
          .subscribe();
      }
    };
    fetchData();
    return () => { isMounted = false; if (channel) supabase.removeChannel(channel); };
  }, [router]);

  const fetchMenus = async (tId) => { const { data } = await supabase.from('menus').select('*').eq('tenant_id', tId).order('created_at', { ascending: false }); if (data) setMenus(data); };
  const fetchTables = async (tId) => { const { data } = await supabase.from('tables').select('*').eq('tenant_id', tId).order('table_number', { ascending: true }); if (data) setTables(data); };
  const fetchOrders = async (tId) => { const { data } = await supabase.from('orders').select('*').eq('tenant_id', tId).order('created_at', { ascending: false }); if (data) setOrders(data); };
  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/login'); };

  const handleImageUpload = async (e, isLogo = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (isLogo) setUploadingLogo(true); else setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${tenantId}-${Date.now()}.${fileExt}`;
      const bucket = isLogo ? 'cafe-logos' : 'menu-images';
      const { error: uploadError } = await supabase.storage.from(bucket).upload(fileName, file, { cacheControl: '3600', upsert: false });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
      if (isLogo) setSettings(prev => ({ ...prev, logo_url: urlData.publicUrl }));
      else setCurrentMenu(prev => ({ ...prev, image_url: urlData.publicUrl }));
    } catch (err) { alert('Gagal upload: ' + err.message); }
    if (isLogo) setUploadingLogo(false); else setUploading(false);
  };

  const handleSaveMenu = async (e) => {
    e.preventDefault();
    const payload = { tenant_id: tenantId, name: currentMenu.name, category: currentMenu.category, price: parseFloat(currentMenu.price), description: currentMenu.desc, status: currentMenu.status, image_url: currentMenu.image_url };
    if (currentMenu.id) await supabase.from('menus').update(payload).eq('id', currentMenu.id);
    else await supabase.from('menus').insert([payload]);
    setIsMenuModalOpen(false); fetchMenus(tenantId);
  };

  const handleDeleteMenu = async (id) => { if (confirm('Hapus menu ini?')) { await supabase.from('menus').delete().eq('id', id); fetchMenus(tenantId); } };
  const handleUpdateOrderStatus = async (id, status) => { const updates = { status }; if (status === 'completed') updates.payment_status = 'paid'; await supabase.from('orders').update(updates).eq('id', id); fetchOrders(tenantId); };
  const handleCancelOrder = async (id) => {
    if (!confirm('Tolak pesanan ini?\n\nPesanan akan dibatalkan dan tidak diproses ke dapur.')) return;
    await supabase.from('orders').update({ status: 'cancelled' }).eq('id', id);
    fetchOrders(tenantId);
  };
  const handleAddTable = async (e) => { e.preventDefault(); if (!newTableNum) return; await supabase.from('tables').insert([{ tenant_id: tenantId, table_number: newTableNum }]); setNewTableNum(''); fetchTables(tenantId); };
  const handleDeleteTable = async (id) => { if (confirm('Hapus meja ini?')) { await supabase.from('tables').delete().eq('id', id); fetchTables(tenantId); } };
  const handleSaveSettings = async (e) => { e.preventDefault(); await supabase.from('tenants').update({ name: settings.name, wa_number: settings.wa, address: settings.address, logo_url: settings.logo_url }).eq('id', tenantId); setCafeName(settings.name); alert('Pengaturan disimpan!'); };

  const printBill = (order) => {
    const win = window.open('', '', 'width=400,height=600');
    win.document.write(`
      <html><head><title>Struk</title><style>body{font-family:monospace;font-size:12px;padding:10px;} .center{text-align:center;} table{width:100%;} td{padding:2px 0;}</style></head><body>
      <div class="center"><h3>${settings.name}</h3><p>${settings.address}</p><p>WA: ${settings.wa}</p></div>
      <hr><p>Meja: ${order.table_number}<br>Order: ${order.id.slice(0,8)}<br>Tanggal: ${new Date(order.created_at).toLocaleString('id-ID')}</p><hr>
      <table>${order.items.map(i => `<tr><td>${i.name} x${i.qty} ${i.note ? '('+i.note+')' : ''}</td><td style="text-align:right">${rp(i.price*i.qty)}</td></tr>`).join('')}</table>
      <hr><table><tr><td><b>TOTAL</b></td><td style="text-align:right"><b>${rp(order.total_price)}</b></td></tr></table>
      <hr><div class="center"><p>${order.payment_status === 'paid' ? 'LUNAS' : 'BELUM LUNAS'}</p><p>Terima Kasih!</p></div></body></html>
    `);
    win.document.close();
    win.print();
  };

  const printTableQR = (table) => {
    if (!baseUrl) { alert('Halaman belum siap. Tunggu sebentar lalu coba lagi.'); return; }
    const orderUrl = `${baseUrl}/order?tenant=${tenantId}&table=${table.table_number}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(orderUrl)}`;
    const win = window.open('', '', 'width=600,height=800');
    if (!win) { alert('Popup diblokir browser. Izinkan popup untuk mencetak QR.'); return; }
    win.document.write(`
      <html><head><title>QR Meja ${table.table_number}</title><style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, system-ui, sans-serif; text-align: center; padding: 30px; }
        .logo { width: 80px; height: 80px; object-fit: cover; border-radius: 16px; margin: 0 auto 16px; display: block; border: 2px solid #ea580c; }
        .badge { display: inline-block; background: #ea580c; color: white; font-size: 11px; font-weight: bold; padding: 4px 14px; border-radius: 99px; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 12px; }
        h1 { font-size: 22px; color: #0f172a; margin-bottom: 4px; font-weight: 900; }
        h2 { font-size: 48px; color: #ea580c; margin: 8px 0 20px; font-weight: 900; letter-spacing: -1px; }
        .qr-wrapper { display: inline-block; padding: 16px; background: white; border: 3px dashed #ea580c; border-radius: 16px; margin: 10px 0; }
        .qr-wrapper img { width: 320px; height: 320px; display: block; }
        .hint { font-size: 14px; color: #475569; font-weight: 600; margin-top: 16px; }
        .url { font-size: 10px; color: #94a3b8; margin-top: 8px; word-break: break-all; padding: 0 20px; }
        @media print { body { padding: 10px; } }
      </style></head><body>
        ${settings.logo_url ? `<img src="${settings.logo_url}" class="logo" alt="Logo" />` : ''}
        <span class="badge">Scan untuk Pesan</span>
        <h1>${settings.name || 'Kafe'}</h1>
        <h2>Meja ${table.table_number}</h2>
        <div class="qr-wrapper"><img src="${qrUrl}" alt="QR" /></div>
        <p class="hint">📱 Buka kamera HP, arahkan ke QR code</p>
        <p class="url">${orderUrl}</p>
      </body></html>
    `);
    win.document.close();
    setTimeout(() => { win.focus(); win.print(); }, 1000);
  };

  const activeOrders = orders.filter(o => ['pending', 'cooking', 'ready'].includes(o.status));
  const filteredOrders = queueFilter === 'active' ? activeOrders : queueFilter === 'done' ? orders.filter(o => ['completed', 'cancelled'].includes(o.status)) : orders;

  // Sort: Aktif = FIFO (terlama atas), Selesai/Semua = LIFO (terbaru atas)
  const displayOrders = (() => {
    const arr = [...filteredOrders];
    if (queueFilter === 'active') arr.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    else arr.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return arr;
  })();

  const todayOrders = todayStr ? orders.filter(o => new Date(o.created_at).toDateString() === todayStr) : [];
  const stats = {
    total: todayOrders.length,
    cooking: todayOrders.filter(o => o.status === 'cooking').length,
    ready: todayOrders.filter(o => o.status === 'ready').length,
    revenue: todayOrders.filter(o => o.payment_status === 'paid').reduce((sum, o) => sum + Number(o.total_price), 0)
  };

  // ===== REPORT DATA =====
  let reportOrders = [];
  let reportStats = { totalOrders: 0, revenue: 0, paidCount: 0, totalItems: 0, avgOrder: 0, statusCount: { pending: 0, cooking: 0, ready: 0, completed: 0, cancelled: 0 } };
  let topMenus = [];
  let activeDays = [];
  let reportLabel = 'Memuat...';
  let monthName = '';

  if (reportNow) {
    const todayStart = new Date(reportNow.getFullYear(), reportNow.getMonth(), reportNow.getDate());
    const tomorrowStart = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
    const monthStart = new Date(reportNow.getFullYear(), reportNow.getMonth(), 1);
    const monthEnd = new Date(reportNow.getFullYear(), reportNow.getMonth() + 1, 1);

    reportOrders = orders.filter(o => {
      const d = new Date(o.created_at);
      if (reportPeriod === 'daily') return d >= todayStart && d < tomorrowStart;
      return d >= monthStart && d < monthEnd;
    });

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

    const menuSales = {};
    reportOrders.forEach(o => {
      (o.items || []).forEach(item => {
        const key = item.name || 'Unknown';
        if (!menuSales[key]) menuSales[key] = { qty: 0, revenue: 0 };
        menuSales[key].qty += item.qty || 0;
        menuSales[key].revenue += (item.price || 0) * (item.qty || 0);
      });
    });
    topMenus = Object.entries(menuSales).sort((a, b) => b[1].qty - a[1].qty).slice(0, 5);

    const daysInMonth = new Date(reportNow.getFullYear(), reportNow.getMonth() + 1, 0).getDate();
    const dailyBreakdown = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const dayOrders = reportOrders.filter(o => new Date(o.created_at).getDate() === day);
      const dayRevenue = dayOrders.filter(o => o.payment_status === 'paid').reduce((s, o) => s + Number(o.total_price || 0), 0);
      return { day, orders: dayOrders.length, revenue: dayRevenue };
    });
    activeDays = dailyBreakdown.filter(d => d.orders > 0);

    reportLabel = reportPeriod === 'daily'
      ? reportNow.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
      : reportNow.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    monthName = reportNow.toLocaleDateString('id-ID', { month: 'short' });
  }

  const statusColors = {
    pending: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
    cooking: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' },
    ready: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
    completed: { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700' },
    cancelled: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700' },
  };

  const pageTitle = { queue: 'Antrian Pesanan', menu: 'Kelola Menu', tables: 'Meja & QR Code', reports: 'Laporan Penjualan', settings: 'Pengaturan Toko' }[activeTab];
  const pageSubtitle = { queue: 'Kelola dan proses pesanan masuk secara real-time', menu: 'Atur daftar menu, harga, dan ketersediaan', tables: 'Generate dan kelola QR code per meja', reports: 'Ringkasan omset harian dan bulanan', settings: 'Konfigurasi profil dan identitas kafe' }[activeTab];

  const getStatusPill = (status) => {
    const map = { pending: 'status-pending', cooking: 'status-cooking', ready: 'status-ready', completed: 'status-completed', cancelled: 'status-cancelled' };
    return map[status] || 'status-completed';
  };
  const getStatusLabel = (status) => ({ pending: 'Baru', cooking: 'Dimasak', ready: 'Siap', completed: 'Selesai', cancelled: 'Batal' }[status] || status);

  // Badge waktu tunggu: abu (0-5m), kuning (5-15m), merah+kedip (15m+)
  const getTimeBadge = (createdAt) => {
    if (!nowTick) return null;
    const mins = Math.floor((nowTick - new Date(createdAt).getTime()) / 60000);
    if (mins < 0) return null;
    if (mins < 5) return { mins, cls: 'bg-slate-100 border-slate-200 text-slate-600', pulse: false };
    if (mins < 15) return { mins, cls: 'bg-amber-50 border-amber-300 text-amber-700', pulse: false };
    return { mins, cls: 'bg-rose-50 border-rose-300 text-rose-700', pulse: true };
  };

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">

      <aside className="w-64 bg-gradient-to-b from-slate-950 to-slate-900 flex-col justify-between hidden md:flex h-screen sticky top-0 print:hidden border-r border-slate-800">
        <div className="flex flex-col h-full">
          <div className="px-5 py-6 border-b border-slate-800/60">
            <div className="flex items-center gap-3">
              {settings.logo_url ? (
                <img src={settings.logo_url} className="w-10 h-10 rounded-xl object-cover ring-2 ring-orange-500/30" alt="Logo" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-orange-500/30">N</div>
              )}
              <div>
                <h1 className="text-base font-black text-white tracking-tight leading-none">NexaFlow</h1>
                <p className="text-[10px] font-semibold text-orange-400 mt-1 tracking-widest uppercase">SaaS Resto</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Menu Utama</p>
            {[
              { key: 'queue', label: 'Antrian Pesanan', Icon: Icons.Clipboard, badge: activeOrders.length },
              { key: 'menu', label: 'Kelola Menu', Icon: Icons.Utensils },
              { key: 'tables', label: 'Meja & QR', Icon: Icons.Grid },
              { key: 'reports', label: 'Laporan', Icon: Icons.Chart },
              { key: 'settings', label: 'Pengaturan', Icon: Icons.Settings },
            ].map(({ key, label, Icon, badge }) => (
              <button key={key} onClick={() => setActiveTab(key)} className={`group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${activeTab === key ? 'bg-white/[0.08] text-white' : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'}`}>
                {activeTab === key && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-orange-500 rounded-r-full"></span>}
                <span className={activeTab === key ? 'text-orange-400' : ''}><Icon /></span>
                <span className="flex-1 text-left">{label}</span>
                {badge > 0 && <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{badge}</span>}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-800/60">
            <div className="bg-white/[0.04] rounded-xl p-3 border border-white/[0.06]">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-black text-xs">{cafeName.charAt(0).toUpperCase()}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">{cafeName}</p>
                  <p className="text-[10px] text-slate-500 truncate">{userEmail}</p>
                </div>
              </div>
              <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-white/[0.04] hover:bg-rose-500/10 border border-white/[0.06] hover:border-rose-500/30 text-slate-400 hover:text-rose-400 font-bold py-2 rounded-lg text-xs transition-all">
                <Icons.Logout /> <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 py-4 flex justify-between items-center shrink-0 z-10 print:hidden">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight leading-tight">{pageTitle}</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{pageSubtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] font-bold text-emerald-700">Sistem Online</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 print:p-0">
          <div className="max-w-6xl mx-auto space-y-6 print:space-y-0">

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
              <div className="card-elevated rounded-2xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Pesanan</p>
                  <div className="icon-box w-8 h-8 bg-slate-100 border-slate-200 text-slate-600"><Icons.Clipboard /></div>
                </div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stats.total}</h3>
                <p className="text-[11px] text-slate-500 font-semibold mt-1">Hari ini</p>
              </div>

              <div className="card-elevated rounded-2xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Dimasak</p>
                  <div className="icon-box w-8 h-8 bg-amber-50 border-amber-200 text-amber-600">👨‍🍳</div>
                </div>
                <h3 className="text-3xl font-black text-amber-600 tracking-tight">{stats.cooking}</h3>
                <p className="text-[11px] text-slate-500 font-semibold mt-1">Sedang diproses</p>
              </div>

              <div className="card-elevated rounded-2xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Siap Saji</p>
                  <div className="icon-box w-8 h-8 bg-emerald-50 border-emerald-200 text-emerald-600">🍽️</div>
                </div>
                <h3 className="text-3xl font-black text-emerald-600 tracking-tight">{stats.ready}</h3>
                <p className="text-[11px] text-slate-500 font-semibold mt-1">Menunggu diantar</p>
              </div>

              <div className="rounded-2xl p-5 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-800 shadow-[0_4px_12px_-2px_rgba(15,23,42,0.3),0_12px_32px_-8px_rgba(15,23,42,0.4)]">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Omset Hari Ini</p>
                  <div className="icon-box w-8 h-8 bg-orange-500/20 border-orange-500/30 text-orange-400">💰</div>
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight">{rp(stats.revenue)}</h3>
                <p className="text-[11px] text-slate-400 font-semibold mt-1">Total pendapatan</p>
              </div>
            </div>

            {activeTab === 'queue' && (
              <div className="space-y-4 print:hidden">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 bg-white rounded-xl p-1 w-fit border border-slate-200 shadow-sm">
                    {[{k:'active',l:'Aktif'},{k:'done',l:'Selesai'},{k:'all',l:'Semua'}].map(({k,l}) => (
                      <button key={k} onClick={() => setQueueFilter(k)} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${queueFilter === k ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>{l}</button>
                    ))}
                  </div>
                  {queueFilter === 'active' && (
                    <p className="text-[11px] text-slate-500 font-semibold flex items-center gap-1.5">
                      <Icons.Clock /> Urut dari yang paling lama menunggu
                    </p>
                  )}
                </div>

                {displayOrders.length === 0 ? (
                  <div className="card-subtle rounded-2xl p-16 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl">📋</div>
                    <p className="font-bold text-slate-900">Tidak ada antrian pesanan</p>
                    <p className="text-sm text-slate-500 mt-1">Pesanan baru akan muncul di sini secara otomatis</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayOrders.map(order => {
                      const badge = ['pending', 'cooking', 'ready'].includes(order.status) ? getTimeBadge(order.created_at) : null;
                      return (
                        <div key={order.id} className="card-elevated rounded-2xl overflow-hidden">
                          <div className="px-5 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 flex justify-between items-center">
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Meja</p>
                              <p className="text-2xl font-black text-slate-900 leading-tight">{order.table_number}</p>
                            </div>
                            <span className={`status-pill ${getStatusPill(order.status)}`}>{getStatusLabel(order.status)}</span>
                          </div>

                          <div className="px-5 py-4 space-y-3">
                            <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 font-semibold">
                              <span>#{order.id.slice(0, 8).toUpperCase()}</span>
                              <div className="flex items-center gap-1.5">
                                {badge && (
                                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-black ${badge.cls} ${badge.pulse ? 'animate-pulse' : ''}`}>
                                    <Icons.Clock /> {badge.mins}m
                                  </span>
                                )}
                                <span>{new Date(order.created_at).toLocaleTimeString('id-ID', {hour:'2-digit',minute:'2-digit'})}</span>
                              </div>
                            </div>

                            <div className="space-y-2 pt-1">
                              {order.items.map((item, idx) => (
                                <div key={idx}>
                                  <div className="flex justify-between text-sm">
                                    <span className="font-bold text-slate-700">{item.qty}× {item.name}</span>
                                    <span className="font-bold text-slate-900">{rp(item.price * item.qty)}</span>
                                  </div>
                                  {item.note && (
                                    <p className="text-[11px] text-orange-600 font-bold mt-0.5 italic">↳ "{item.note}"</p>
                                  )}
                                </div>
                              ))}
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                              <span className="text-xs font-bold text-slate-500">Total</span>
                              <span className="text-lg font-black text-orange-600">{rp(order.total_price)}</span>
                            </div>

                            {order.status !== 'completed' && order.status !== 'cancelled' && (
                              <div className="space-y-2 pt-1">
                                <div className="grid grid-cols-2 gap-2">
                                  <button onClick={() => handleUpdateOrderStatus(order.id, 'cooking')} className="bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 font-bold py-2 rounded-lg text-xs transition-all">Masak</button>
                                  <button onClick={() => handleUpdateOrderStatus(order.id, 'ready')} className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-bold py-2 rounded-lg text-xs transition-all">Sajikan</button>
                                </div>
                                <button onClick={() => handleUpdateOrderStatus(order.id, 'completed')} className="w-full btn-dark py-2 rounded-lg text-xs flex items-center justify-center gap-1.5">Selesai / Lunas</button>
                                <button onClick={() => handleCancelOrder(order.id)} className="w-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all">
                                  <Icons.X /> Tolak Pesanan
                                </button>
                              </div>
                            )}
                            <button onClick={() => printBill(order)} className="w-full btn-ghost py-2 rounded-lg text-xs flex items-center justify-center gap-1.5">
                              <Icons.Print /> Cetak Struk
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'menu' && (
              <div className="space-y-4 print:hidden">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-black text-slate-900">Daftar Menu</h3>
                    <p className="text-xs text-slate-500">{menus.length} menu terdaftar</p>
                  </div>
                  <button onClick={() => { setCurrentMenu({ id: null, name: '', category: 'makanan', price: '', desc: '', status: 'available', image_url: '' }); setIsMenuModalOpen(true); }} className="btn-primary px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5">
                    <Icons.Plus /> Tambah Menu
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {menus.map(menu => (
                    <div key={menu.id} className="card-elevated rounded-2xl overflow-hidden flex flex-col">
                      <div className="h-44 bg-slate-100 relative overflow-hidden">
                        {menu.image_url ? (
                          <img src={menu.image_url} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-5xl">🍽️</div>
                        )}
                        <div className="absolute top-3 right-3">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${menu.status === 'available' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'}`}>
                            {menu.status === 'available' ? 'Tersedia' : 'Habis'}
                          </span>
                        </div>
                        <div className="absolute bottom-3 left-3">
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white uppercase tracking-wider">{menu.category}</span>
                        </div>
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-black text-slate-900">{menu.name}</h4>
                          <p className="text-xs text-slate-500 font-medium line-clamp-2 mt-1 min-h-[2rem]">{menu.description || 'Tidak ada deskripsi'}</p>
                          <p className="font-black text-orange-600 text-lg mt-2">{rp(menu.price)}</p>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <button onClick={() => { setCurrentMenu({ ...menu, desc: menu.description || '' }); setIsMenuModalOpen(true); }} className="flex-1 btn-ghost py-2 rounded-lg text-xs">Edit</button>
                          <button onClick={() => handleDeleteMenu(menu.id)} className="flex-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 font-bold py-2 rounded-lg text-xs transition-all">Hapus</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'tables' && (
              <div className="card-elevated rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                  <div>
                    <h3 className="font-black text-slate-900">QR Code Meja</h3>
                    <p className="text-xs text-slate-500">{tables.length} meja terdaftar · Klik "Cetak QR" untuk cetak per meja</p>
                  </div>
                  <form onSubmit={handleAddTable} className="flex gap-2 w-full sm:w-auto">
                    <input type="number" required value={newTableNum} onChange={e => setNewTableNum(e.target.value)} placeholder="No Meja" className="border border-slate-200 rounded-xl px-3 py-2 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-semibold" />
                    <button type="submit" className="btn-primary px-4 py-2 rounded-xl text-xs">Tambah</button>
                  </form>
                </div>

                {tables.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl">🪑</div>
                    <p className="font-bold text-slate-900">Belum ada meja</p>
                    <p className="text-sm text-slate-500 mt-1">Tambahkan meja untuk generate QR code</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {tables.map(t => (
                      <div key={t.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center group hover:bg-white hover:border-slate-300 hover:shadow-md transition-all">
                        <p className="font-black text-slate-900 text-sm mb-3">Meja {t.table_number}</p>
                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${baseUrl}/order?tenant=${tenantId}&table=${t.table_number}`)}`} className="w-full rounded-lg mb-3" alt="QR" />
                        <div className="flex gap-1.5">
                          <button onClick={() => printTableQR(t)} className="flex-1 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all">
                            <Icons.Print /> Cetak QR
                          </button>
                          <button onClick={() => handleDeleteTable(t.id)} className="text-[10px] text-rose-500 hover:text-rose-700 font-bold hover:underline px-2">Hapus</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex items-center gap-2 bg-white rounded-xl p-1 border border-slate-200 shadow-sm">
                    <button onClick={() => setReportPeriod('daily')} className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${reportPeriod === 'daily' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
                      📅 Harian
                    </button>
                    <button onClick={() => setReportPeriod('monthly')} className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${reportPeriod === 'monthly' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
                      📊 Bulanan
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Periode</p>
                    <p className="text-sm font-black text-slate-900">{reportLabel}</p>
                  </div>
                </div>

                {!reportNow ? (
                  <div className="card-subtle rounded-2xl p-16 text-center">
                    <p className="font-bold text-slate-900">Memuat laporan...</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="card-elevated rounded-2xl p-5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Total Pesanan</p>
                        <h3 className="text-3xl font-black text-slate-900">{reportStats.totalOrders}</h3>
                        <p className="text-[11px] text-slate-500 font-semibold mt-1">{reportStats.paidCount} lunas</p>
                      </div>
                      <div className="rounded-2xl p-5 bg-gradient-to-br from-slate-900 to-slate-800 shadow-lg">
                        <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-2">Total Omset</p>
                        <h3 className="text-2xl font-black text-white">{rp(reportStats.revenue)}</h3>
                        <p className="text-[11px] text-slate-400 font-semibold mt-1">Dari pesanan lunas</p>
                      </div>
                      <div className="card-elevated rounded-2xl p-5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Rata-rata / Order</p>
                        <h3 className="text-2xl font-black text-slate-900">{rp(reportStats.avgOrder)}</h3>
                        <p className="text-[11px] text-slate-500 font-semibold mt-1">Per transaksi lunas</p>
                      </div>
                      <div className="card-elevated rounded-2xl p-5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Item Terjual</p>
                        <h3 className="text-3xl font-black text-slate-900">{reportStats.totalItems}</h3>
                        <p className="text-[11px] text-slate-500 font-semibold mt-1">Total porsi</p>
                      </div>
                    </div>

                    <div className="card-elevated rounded-2xl p-6">
                      <h3 className="font-black text-slate-900 mb-4">Status Pesanan</h3>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {[
                          { key: 'pending', label: 'Baru' },
                          { key: 'cooking', label: 'Dimasak' },
                          { key: 'ready', label: 'Siap' },
                          { key: 'completed', label: 'Selesai' },
                          { key: 'cancelled', label: 'Batal' },
                        ].map(({ key, label }) => {
                          const c = statusColors[key];
                          return (
                            <div key={key} className={`p-4 rounded-xl border ${c.bg} ${c.border}`}>
                              <p className={`text-[10px] font-bold uppercase tracking-widest ${c.text}`}>{label}</p>
                              <p className={`text-2xl font-black ${c.text}`}>{reportStats.statusCount[key] || 0}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="card-elevated rounded-2xl p-6">
                      <h3 className="font-black text-slate-900 mb-4">🔥 Menu Terlaris</h3>
                      {topMenus.length === 0 ? (
                        <div className="text-center py-10">
                          <p className="text-4xl mb-2">📊</p>
                          <p className="text-sm font-bold text-slate-900">Belum ada penjualan</p>
                          <p className="text-xs text-slate-500 mt-1">Data akan muncul setelah ada pesanan</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {topMenus.map(([name, data], idx) => {
                            const maxQty = topMenus[0][1].qty;
                            const pct = maxQty > 0 ? (data.qty / maxQty) * 100 : 0;
                            const rankBg = idx === 0 ? 'bg-amber-400 text-white' : idx === 1 ? 'bg-slate-300 text-slate-700' : idx === 2 ? 'bg-orange-300 text-white' : 'bg-slate-100 text-slate-600';
                            return (
                              <div key={name}>
                                <div className="flex justify-between items-center mb-1.5">
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${rankBg}`}>{idx + 1}</span>
                                    <span className="font-bold text-sm text-slate-900 truncate">{name}</span>
                                  </div>
                                  <span className="text-xs font-bold text-slate-600 whitespace-nowrap ml-2">{data.qty}× · {rp(data.revenue)}</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all" style={{ width: `${pct}%` }}></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {reportPeriod === 'monthly' && (
                      <div className="card-elevated rounded-2xl p-6">
                        <h3 className="font-black text-slate-900 mb-4">📅 Rincian Per Hari</h3>
                        {activeDays.length === 0 ? (
                          <div className="text-center py-10">
                            <p className="text-4xl mb-2">🗓️</p>
                            <p className="text-sm font-bold text-slate-900">Belum ada pesanan bulan ini</p>
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b-2 border-slate-200">
                                  <th className="text-left py-2 px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tanggal</th>
                                  <th className="text-right py-2 px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pesanan</th>
                                  <th className="text-right py-2 px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Omset</th>
                                </tr>
                              </thead>
                              <tbody>
                                {activeDays.map(d => (
                                  <tr key={d.day} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="py-2 px-2 font-bold text-slate-700">{d.day} {monthName}</td>
                                    <td className="text-right py-2 px-2 font-semibold text-slate-600">{d.orders}</td>
                                    <td className="text-right py-2 px-2 font-black text-orange-600">{rp(d.revenue)}</td>
                                  </tr>
                                ))}
                              </tbody>
                              <tfoot>
                                <tr className="border-t-2 border-slate-900">
                                  <td className="py-3 px-2 font-black text-slate-900">TOTAL</td>
                                  <td className="text-right py-3 px-2 font-black text-slate-900">{reportStats.totalOrders}</td>
                                  <td className="text-right py-3 px-2 font-black text-orange-600">{rp(reportStats.revenue)}</td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="card-elevated rounded-2xl p-6 md:p-8 max-w-xl mx-auto print:hidden">
                <div className="border-b border-slate-100 pb-4 mb-6">
                  <h3 className="font-black text-slate-900">Profil Toko</h3>
                  <p className="text-xs text-slate-500">Ubah identitas dan kontak kafe Anda</p>
                </div>
                <form onSubmit={handleSaveSettings} className="space-y-5">

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">Logo Kafe</label>
                    <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      {settings.logo_url ? (
                        <img src={settings.logo_url} className="w-16 h-16 rounded-xl object-cover shadow-sm bg-white border border-slate-200" />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-slate-200 flex items-center justify-center text-2xl">🏪</div>
                      )}
                      <div className="flex-1">
                        <input type="file" accept="image/*" ref={logoInputRef} onChange={(e) => handleImageUpload(e, true)} className="hidden" />
                        <button type="button" onClick={() => logoInputRef.current?.click()} className="btn-ghost w-full py-2 rounded-lg text-xs">
                          {uploadingLogo ? 'Mengupload...' : '📷 Ganti Logo'}
                        </button>
                        <p className="text-[10px] text-slate-500 mt-1.5">PNG/JPG, maksimal 2MB</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Kafe</label>
                    <input type="text" value={settings.name} onChange={e => setSettings({...settings, name: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-semibold text-slate-900" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Nomor WhatsApp</label>
                    <input type="text" value={settings.wa} onChange={e => setSettings({...settings, wa: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-semibold text-slate-900" placeholder="08xxxxxxxxxx" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Alamat</label>
                    <input type="text" value={settings.address} onChange={e => setSettings({...settings, address: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-semibold text-slate-900" placeholder="Jl. Contoh No. 123" />
                  </div>

                  <button type="submit" className="btn-dark w-full py-3 rounded-xl text-sm">Simpan Pengaturan</button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>

      {isMenuModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 print:hidden">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="flex justify-between items-start mb-5">
              <div>
                <h3 className="font-black text-lg text-slate-900">{currentMenu.id ? 'Edit Menu' : 'Tambah Menu'}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Isi informasi menu baru</p>
              </div>
              <button onClick={() => setIsMenuModalOpen(false)} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-lg flex items-center justify-center">×</button>
            </div>

            <form onSubmit={handleSaveMenu} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Foto Menu</label>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-24 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center text-3xl border border-slate-200">
                    {currentMenu.image_url ? <img src={currentMenu.image_url} className="w-full h-full object-cover" /> : '🍽️'}
                  </div>
                  <div className="flex-1">
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="btn-ghost w-full py-2 rounded-lg text-xs">
                      {uploading ? 'Mengupload...' : '📷 Pilih Foto'}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Menu</label>
                <input required type="text" value={currentMenu.name} onChange={e => setCurrentMenu({...currentMenu, name: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-semibold text-slate-900" placeholder="Contoh: Nasi Goreng Spesial" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Harga (Rp)</label>
                <input required type="number" value={currentMenu.price} onChange={e => setCurrentMenu({...currentMenu, price: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-semibold text-slate-900" placeholder="25000" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Kategori</label>
                <select value={currentMenu.category} onChange={e => setCurrentMenu({...currentMenu, category: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-semibold text-slate-900">
                  <option value="makanan">Makanan</option>
                  <option value="minuman">Minuman</option>
                  <option value="cemilan">Cemilan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Deskripsi</label>
                <textarea value={currentMenu.desc} onChange={e => setCurrentMenu({...currentMenu, desc: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-semibold text-slate-900" rows="2" placeholder="Deskripsi singkat menu"></textarea>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 btn-primary py-2.5 rounded-xl text-sm">Simpan</button>
                <button type="button" onClick={() => setIsMenuModalOpen(false)} className="btn-ghost px-6 py-2.5 rounded-xl text-sm">Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}