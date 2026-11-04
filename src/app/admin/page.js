'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const Icons = {
  Shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Store: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Activity: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  Logout: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Alert: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Plus: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Search: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Copy: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  WhatsApp: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg>,
  Trash: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  BarChart: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>,
  Dollar: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  X: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Sun: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  Moon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
};

const ADMIN_EMAIL = 'dinamis.id.shop@gmail.com'; 
const PRICE_PER_MONTH = 150000;

export default function AdminDashboard() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [stats, setStats] = useState({ total: 0, online: 0, warning: 0, revenue: 0 });
  const [now, setNow] = useState(null); 
  const [toasts, setToasts] = useState([]);
  
  const [theme, setTheme] = useState('dark');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const [extendModal, setExtendModal] = useState({ open: false, tenant: null, loading: false });
  const [statsModal, setStatsModal] = useState({ open: false, tenant: null, data: null, loading: false });
  
  const router = useRouter();

  useEffect(() => {
    const savedTheme = localStorage.getItem('nexaflow_admin_theme') || 'dark';
    setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('nexaflow_admin_theme', newTheme);
  };

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  useEffect(() => {
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 60000); 
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentEmail = session?.user?.email ? session.user.email.trim().toLowerCase() : '';
      
      if (currentEmail !== ADMIN_EMAIL.toLowerCase()) {
        alert(`Akses Ditolak!`);
        return router.push('/login');
      }

      await fetchTenants();
      setLoading(false);
    };
    checkAuthAndFetch();
  }, [router]);

  const fetchTenants = async () => {
    const { data } = await supabase.from('tenants').select('*').order('created_at', { ascending: false });
    if (data) {
      setTenants(data);
      calculateStats(data, onlineUsers);
    }
  };

  const calculateStats = (tenantData, onlineData) => {
    let onlineCount = 0;
    let warningCount = 0;
    let activeTenants = 0;
    const currentTime = Date.now();

    tenantData.forEach(t => {
      if (onlineData[t.id]) onlineCount++;
      if (t.subscription_end_date) {
        const daysLeft = Math.max(0, Math.ceil((new Date(t.subscription_end_date).getTime() - currentTime) / (1000 * 60 * 60 * 24)));
        if (daysLeft <= 3) warningCount++;
        if (daysLeft > 0 && t.is_active !== false) activeTenants++;
      }
    });

    setStats({ 
      total: tenantData.length, 
      online: onlineCount, 
      warning: warningCount,
      revenue: activeTenants * PRICE_PER_MONTH 
    });
  };

  useEffect(() => {
    const channel = supabase.channel('online-rooms', { config: { presence: { key: 'user_id' } } });
    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      const onlineMap = {};
      Object.keys(state).forEach((key) => {
        state[key].forEach((presence) => { onlineMap[presence.tenant_id] = true; });
      });
      setOnlineUsers(onlineMap);
      calculateStats(tenants, onlineMap);
    });
    channel.subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [tenants]);

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/login'); };

  const calculateDaysLeft = (endDate) => {
    if (!endDate || !now) return 0;
    return Math.max(0, Math.ceil((new Date(endDate).getTime() - now) / (1000 * 60 * 60 * 24)));
  };

  const submitExtend = async (days) => {
    const { tenant } = extendModal;
    setExtendModal(prev => ({ ...prev, loading: true }));

    const currentEnd = new Date(tenant.subscription_end_date || Date.now()).getTime();
    const baseDate = Math.max(Date.now(), currentEnd); 
    const newEndDate = new Date(baseDate + (days * 24 * 60 * 60 * 1000)).toISOString();

    const { error } = await supabase.from('tenants').update({ 
      subscription_end_date: newEndDate, 
      is_active: true 
    }).eq('id', tenant.id);
    
    setExtendModal({ open: false, tenant: null, loading: false });
    if (error) {
      showToast('Gagal: ' + error.message, 'error');
    } else {
      showToast(`✅ ${tenant.name} diperpanjang ${days} Hari!`, 'success');
      fetchTenants();
    }
  };

  const toggleStatus = async (tenant) => {
    const newStatus = !(tenant.is_active !== false);
    if (!confirm(`${newStatus ? 'Suspend' : 'Aktifkan'} akun ${tenant.name}?`)) return;
    
    const { error } = await supabase.from('tenants').update({ is_active: newStatus }).eq('id', tenant.id);
    if (error) return showToast('Gagal: ' + error.message, 'error');
    
    showToast(`Akun ${tenant.name} ${newStatus ? 'diaktifkan' : 'disuspend'}`, 'success');
    fetchTenants();
  };

  const openStats = async (tenant) => {
    setStatsModal({ open: true, tenant, data: null, loading: true });
    
    const [menusRes, ordersRes] = await Promise.all([
      supabase.from('menus').select('*', { count: 'exact', head: true }).eq('tenant_id', tenant.id),
      supabase.from('orders').select('*', { count: 'exact', head: true }).eq('tenant_id', tenant.id)
    ]);

    setStatsModal(prev => ({
      ...prev,
      loading: false,
      data: { menus: menusRes.count || 0, orders: ordersRes.count || 0 }
    }));
  };

  const handleDelete = async (tenant) => {
    const confirmText = prompt(`PERINGATAN KERAS!\n\nSemua menu, pesanan, dan akun dari "${tenant.name}" akan dihapus permanen.\n\nKetik nama kafe (${tenant.name}) untuk konfirmasi:`);
    
    if (confirmText !== tenant.name) {
      return showToast('Konfirmasi gagal. Nama tidak cocok.', 'error');
    }

    const { error } = await supabase.from('tenants').delete().eq('id', tenant.id);
    if (error) return showToast('Gagal hapus: ' + error.message, 'error');
    
    showToast(`Kafe ${tenant.name} berhasil dihapus.`, 'success');
    fetchTenants();
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast('ID disalin', 'success');
  };

  const openWa = (tenant) => {
    if (!tenant.wa_number) return showToast('Nomor WA belum diatur', 'warning');
    let phone = tenant.wa_number.replace(/[^0-9]/g, '');
    if (phone.startsWith('0')) phone = '62' + phone.slice(1);
    else if (phone.startsWith('8')) phone = '62' + phone;
    else if (phone.startsWith('620')) phone = '62' + phone.slice(3);
    if (phone.length < 10) return showToast('Format nomor WA tidak valid', 'error');

    const msg = `Halo Owner ${tenant.name}, ini Admin NexaFlow.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const filteredTenants = tenants.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
    const daysLeft = calculateDaysLeft(t.subscription_end_date);
    
    let matchStatus = true;
    if (filterStatus === 'online') matchStatus = onlineUsers[t.id] === true;
    if (filterStatus === 'expired') matchStatus = daysLeft === 0 || t.is_active === false;
    if (filterStatus === 'warning') matchStatus = daysLeft > 0 && daysLeft <= 3;

    return matchSearch && matchStatus;
  });

  if (loading || !now) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${theme === 'dark' ? 'bg-[#050b14] text-cyan-400' : 'bg-slate-50 text-cyan-600'}`}>
        <div className="animate-spin w-12 h-12 border-4 border-current border-t-transparent rounded-full mb-4"></div>
        <p className={`text-sm font-bold tracking-widest uppercase ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Memverifikasi Hak Akses...</p>
      </div>
    );
  }

  // --- THEME HELPER CLASSES ---
  const bgMain = theme === 'dark' ? 'bg-[#050b14]' : 'bg-slate-50';
  const textMain = theme === 'dark' ? 'text-slate-200' : 'text-slate-800';
  const bgHeader = theme === 'dark' ? 'bg-[#0a192f]/80 border-white/10' : 'bg-white/80 border-slate-200';
  const textTitle = theme === 'dark' ? 'text-white' : 'text-slate-900';
  
  const bgCard = theme === 'dark' ? 'bg-[#0a192f] border-white/10' : 'bg-white border-slate-200 shadow-sm';
  const bgCardHover = theme === 'dark' ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50';
  
  const bgSearch = theme === 'dark' ? 'bg-[#050b14] border-white/10 text-white' : 'bg-slate-100 border-slate-300 text-slate-900';
  const bgFilter = theme === 'dark' ? 'bg-[#050b14] border-white/10' : 'bg-slate-100 border-slate-300';
  
  const textSlate = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';
  const textSlateLight = theme === 'dark' ? 'text-slate-500' : 'text-slate-400';

  return (
    <div className={`min-h-screen ${bgMain} ${textMain} font-sans transition-colors duration-300`}>
      
      {/* HEADER */}
      <header className={`border-b ${bgHeader} backdrop-blur-xl sticky top-0 z-40 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <h1 className={`text-2xl font-black ${textTitle} tracking-tight flex items-center gap-3`}>
              <span className={theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}><Icons.Shield /></span> Control Center
            </h1>
            <p className={`text-xs font-bold ${textSlate} mt-1 uppercase tracking-widest`}>Developer & Billing Monitor</p>
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <button onClick={toggleTheme} className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm border transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 shadow-sm'}`}>
              {theme === 'dark' ? <Icons.Sun /> : <Icons.Moon />}
            </button>
            <button onClick={handleLogout} className={`flex items-center justify-center flex-1 sm:flex-none gap-2 px-5 py-2.5 bg-rose-500/10 border border-rose-500/30 text-rose-500 hover:bg-rose-500/20 rounded-xl font-bold text-sm transition-all active:scale-95`}>
              <Icons.Logout /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">
        
        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <div className={`${bgCard} rounded-3xl p-6 shadow-xl relative overflow-hidden group transition-colors duration-300`}>
            <div className={`absolute top-0 right-0 p-6 opacity-10 ${theme === 'dark' ? 'text-white' : 'text-slate-900'} group-hover:scale-110 transition-transform`}><Icons.Store /></div>
            <p className={`text-xs font-bold ${textSlate} uppercase tracking-widest mb-2`}>Total Klien</p>
            <h3 className={`text-4xl sm:text-5xl font-black ${textTitle}`}>{stats.total}</h3>
          </div>
          
          <div className={`${theme === 'dark' ? 'bg-[#0d3b66] border-cyan-500/30 shadow-[0_0_30px_rgba(0,168,204,0.15)]' : 'bg-blue-50 border-blue-200 shadow-sm'} border rounded-3xl p-6 relative overflow-hidden group transition-colors duration-300`}>
            <div className={`absolute top-0 right-0 p-6 opacity-20 ${theme === 'dark' ? 'text-cyan-400' : 'text-blue-500'} group-hover:scale-110 transition-transform`}><Icons.Activity /></div>
            <p className={`text-xs font-bold ${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'} uppercase tracking-widest mb-2`}>Kafe Online</p>
            <h3 className={`text-4xl sm:text-5xl font-black ${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'}`}>{stats.online} <span className={`text-xl font-bold ${theme === 'dark' ? 'text-slate-500' : 'text-blue-400/50'}`}>/ {stats.total}</span></h3>
          </div>

          <div className={`${theme === 'dark' ? 'bg-gradient-to-br from-emerald-900/40 to-[#050b14] border-emerald-500/30 shadow-xl' : 'bg-emerald-50 border-emerald-200 shadow-sm'} border rounded-3xl p-6 relative overflow-hidden group transition-colors duration-300`}>
            <div className={`absolute top-0 right-0 p-6 opacity-20 ${theme === 'dark' ? 'text-emerald-500' : 'text-emerald-600'} group-hover:scale-110 transition-transform`}><Icons.Dollar /></div>
            <p className={`text-xs font-bold ${theme === 'dark' ? 'text-emerald-500' : 'text-emerald-700'} uppercase tracking-widest mb-2`}>Est. Omset / Bulan</p>
            <h3 className={`text-2xl sm:text-3xl font-black ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>Rp {stats.revenue.toLocaleString('id-ID')}</h3>
          </div>

          <div className={`${theme === 'dark' ? 'bg-gradient-to-br from-amber-900/40 to-[#050b14] border-amber-500/30 shadow-xl' : 'bg-amber-50 border-amber-200 shadow-sm'} border rounded-3xl p-6 relative overflow-hidden group transition-colors duration-300`}>
            <div className={`absolute top-0 right-0 p-6 opacity-20 ${theme === 'dark' ? 'text-amber-500' : 'text-amber-600'} group-hover:scale-110 transition-transform`}><Icons.Alert /></div>
            <p className={`text-xs font-bold ${theme === 'dark' ? 'text-amber-500' : 'text-amber-700'} uppercase tracking-widest mb-2`}>Butuh Perhatian</p>
            <h3 className={`text-4xl sm:text-5xl font-black ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`}>{stats.warning}</h3>
          </div>
        </div>

        {/* SEARCH & FILTER */}
        <div className={`flex flex-col lg:flex-row gap-4 justify-between items-center p-4 rounded-2xl border ${bgSearch} shadow-sm transition-colors duration-300`}>
          <div className="relative w-full lg:w-96">
            <span className={`absolute left-4 top-1/2 -translate-y-1/2 ${textSlate}`}><Icons.Search /></span>
            <input 
              type="text" 
              placeholder="Cari nama kafe..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={`w-full bg-transparent border-none outline-none pl-11 pr-4 py-3 text-sm ${theme === 'dark' ? 'text-white placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-400'}`}
            />
          </div>
          <div className={`flex p-1 rounded-xl border w-full lg:w-auto overflow-x-auto scrollbar-hide ${bgFilter}`}>
            {[
              { id: 'all', label: 'Semua' },
              { id: 'online', label: 'Online' },
              { id: 'expired', label: 'Non-Aktif' },
              { id: 'warning', label: 'Warning' }
            ].map(f => (
              <button 
                key={f.id} 
                onClick={() => setFilterStatus(f.id)}
                className={`flex-1 lg:flex-none px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${filterStatus === f.id ? (theme === 'dark' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-700 shadow-sm') : `${theme === 'dark' ? 'text-slate-500 hover:text-white' : 'text-slate-500 hover:text-slate-800'}`}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* --- TAMPILAN DESKTOP (TABEL) --- */}
        <div className={`hidden lg:block ${bgCard} backdrop-blur-xl border rounded-3xl overflow-hidden transition-colors duration-300`}>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'bg-[#050b14] text-slate-500 border-b border-white/10' : 'bg-slate-100 text-slate-500 border-b border-slate-200'}`}>
                <th className="p-5">Nama Kafe</th>
                <th className="p-5">Status</th>
                <th className="p-5">Sisa Waktu</th>
                <th className="p-5 text-right">Aksi Cepat</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${theme === 'dark' ? 'divide-white/5' : 'divide-slate-100'}`}>
              {filteredTenants.length === 0 ? (
                <tr><td colSpan="4" className={`p-10 text-center font-bold ${textSlate}`}>Tidak ada data yang cocok.</td></tr>
              ) : filteredTenants.map((tenant) => {
                const daysLeft = calculateDaysLeft(tenant.subscription_end_date);
                const isOnline = onlineUsers[tenant.id];
                const isExpired = daysLeft <= 0 || tenant.is_active === false;
                const isWarning = daysLeft > 0 && daysLeft <= 3 && tenant.is_active !== false;
                
                return (
                  <tr key={tenant.id} className={`transition-colors group ${tenant.is_active === false ? 'opacity-50 grayscale' : bgCardHover}`}>
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        {tenant.logo_url ? (
                          <img src={tenant.logo_url} className={`w-12 h-12 rounded-xl object-cover border ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`} />
                        ) : (
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black border ${theme === 'dark' ? 'bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-cyan-400 border-white/10' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                            {tenant.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className={`font-bold text-base ${textTitle}`}>{tenant.name}</p>
                          <div className={`flex items-center gap-1.5 mt-1 text-[10px] font-mono ${textSlateLight}`}>
                            <span>ID: {tenant.id.slice(0, 8)}...</span>
                            <button onClick={() => copyToClipboard(tenant.id)} className={`transition-colors ${theme === 'dark' ? 'hover:text-cyan-400' : 'hover:text-cyan-600'}`}><Icons.Copy /></button>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                        isOnline && tenant.is_active !== false 
                          ? (theme === 'dark' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-600')
                          : (theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-500')
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${isOnline && tenant.is_active !== false ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`}></span>
                        {tenant.is_active === false ? 'Suspended' : isOnline ? 'Online' : 'Offline'}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="flex flex-col gap-1">
                        <span className={`text-2xl font-black ${
                          isExpired ? 'text-rose-500' : isWarning ? 'text-amber-500' : (theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')
                        }`}>
                          {tenant.is_active === false ? 'Beku' : `${daysLeft} Hari`}
                        </span>
                        <p className={`text-[10px] font-bold uppercase tracking-wider ${textSlateLight}`}>
                          {tenant.is_active === false ? 'Akun Disuspend' : `Tempo: ${new Date(tenant.subscription_end_date).toLocaleDateString('id-ID')}`}
                        </p>
                      </div>
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleDelete(tenant)} className={`p-2.5 rounded-xl border transition-all ${theme === 'dark' ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/20' : 'bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200'}`} title="Hapus Permanen"><Icons.Trash /></button>
                        <button onClick={() => openWa(tenant)} className={`p-2.5 rounded-xl border transition-all ${theme === 'dark' ? 'bg-white/5 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 border-white/10' : 'bg-white hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 border-slate-200'}`} title="Chat WA"><Icons.WhatsApp /></button>
                        <button onClick={() => openStats(tenant)} className={`p-2.5 rounded-xl border transition-all ${theme === 'dark' ? 'bg-white/5 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-400 border-white/10' : 'bg-white hover:bg-cyan-50 text-slate-500 hover:text-cyan-600 border-slate-200'}`} title="Lihat Statistik"><Icons.BarChart /></button>
                        <button onClick={() => toggleStatus(tenant)} className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${tenant.is_active === false ? (theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30' : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100') : (theme === 'dark' ? 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50')}`}>
                          {tenant.is_active === false ? 'Aktifkan' : 'Suspend'}
                        </button>
                        <button onClick={() => setExtendModal({ open: true, tenant, loading: false })} className="inline-flex items-center justify-center min-w-[110px] gap-1.5 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-white font-black text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all active:scale-95">
                          <Icons.Plus /> Perpanjang
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* --- TAMPILAN MOBILE/TABLET (CARDS) --- */}
        <div className="lg:hidden space-y-4">
          {filteredTenants.length === 0 ? (
            <div className={`${bgCard} border rounded-2xl p-8 text-center font-bold ${textSlate}`}>Tidak ada data.</div>
          ) : filteredTenants.map((tenant) => {
            const daysLeft = calculateDaysLeft(tenant.subscription_end_date);
            const isOnline = onlineUsers[tenant.id];
            const isExpired = daysLeft <= 0 || tenant.is_active === false;
            const isWarning = daysLeft > 0 && daysLeft <= 3 && tenant.is_active !== false;

            return (
              <div key={tenant.id} className={`${bgCard} border rounded-2xl p-5 shadow-lg flex flex-col gap-4 relative overflow-hidden ${tenant.is_active === false ? 'opacity-60' : ''}`}>
                <div className={`absolute top-0 left-0 w-1.5 h-full ${isExpired ? 'bg-rose-500' : isWarning ? 'bg-amber-400' : 'bg-cyan-500'}`}></div>
                
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    {tenant.logo_url ? (
                      <img src={tenant.logo_url} className={`w-12 h-12 rounded-xl object-cover border ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`} />
                    ) : (
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black border ${theme === 'dark' ? 'bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-cyan-400 border-white/10' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                        {tenant.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className={`font-bold text-base leading-tight ${textTitle}`}>{tenant.name}</h3>
                      <div className={`flex items-center gap-1 mt-1 text-[10px] font-mono ${textSlateLight}`}>
                        <span>ID: {tenant.id.slice(0, 8)}...</span>
                        <button onClick={() => copyToClipboard(tenant.id)} className="p-1"><Icons.Copy /></button>
                      </div>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                    isOnline && tenant.is_active !== false 
                      ? (theme === 'dark' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-600') 
                      : (theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-500')
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isOnline && tenant.is_active !== false ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`}></span>
                    {tenant.is_active === false ? 'Suspended' : isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>

                <div className={`rounded-xl p-3 border flex justify-between items-center ${theme === 'dark' ? 'bg-[#050b14] border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                  <div>
                    <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${textSlateLight}`}>Sisa Waktu</p>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-2xl font-black ${isExpired ? 'text-rose-500' : isWarning ? 'text-amber-500' : (theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')}`}>
                        {tenant.is_active === false ? '-' : daysLeft}
                      </span>
                      <span className={`text-xs font-bold ${textSlateLight}`}>{tenant.is_active === false ? 'Suspended' : 'Hari'}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${textSlateLight}`}>Jatuh Tempo</p>
                    <p className={`text-xs font-bold ${isExpired ? 'text-rose-500' : isWarning ? 'text-amber-500' : textMain}`}>
                      {isExpired ? 'Telah Berakhir' : new Date(tenant.subscription_end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setExtendModal({ open: true, tenant, loading: false })} className="col-span-2 py-3 bg-cyan-500 text-white font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-1.5 active:scale-95"><Icons.Plus /> Perpanjang Langganan</button>
                  <button onClick={() => openStats(tenant)} className={`py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 border ${theme === 'dark' ? 'bg-white/5 text-slate-300 border-white/10' : 'bg-white text-slate-600 border-slate-200'}`}><Icons.BarChart /> Statistik</button>
                  <button onClick={() => toggleStatus(tenant)} className={`py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 border ${tenant.is_active === false ? (theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-emerald-50 text-emerald-600 border-emerald-200') : (theme === 'dark' ? 'bg-white/5 text-slate-300 border-white/10' : 'bg-white text-slate-600 border-slate-200')}`}>
                    {tenant.is_active === false ? 'Aktifkan' : 'Suspend'}
                  </button>
                  <button onClick={() => openWa(tenant)} className={`py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 border ${theme === 'dark' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}><Icons.WhatsApp /> Hubungi</button>
                  <button onClick={() => handleDelete(tenant)} className={`py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 border ${theme === 'dark' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-rose-50 text-rose-600 border-rose-200'}`}><Icons.Trash /> Hapus</button>
                </div>
              </div>
            );
          })}
        </div>

      </main>

      {/* --- MODAL PERPANJANG KUSTOM --- */}
      {extendModal.open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 ${theme === 'dark' ? 'bg-[#0a192f] border-white/10' : 'bg-white border-slate-200'}`}>
            <div className={`p-6 border-b flex justify-between items-center ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`}>
              <h3 className={`font-black text-lg ${textTitle}`}>Perpanjang Langganan</h3>
              <button onClick={() => setExtendModal({ open: false, tenant: null, loading: false })} className={textSlate}><Icons.X /></button>
            </div>
            <div className="p-6 space-y-4">
              <p className={`text-sm ${textSlate}`}>Pilih durasi perpanjangan untuk <strong className={textTitle}>{extendModal.tenant.name}</strong>:</p>
              
              <div className="grid grid-cols-2 gap-3">
                {[7, 30, 90, 365].map(days => (
                  <button 
                    key={days} 
                    disabled={extendModal.loading}
                    onClick={() => submitExtend(days)}
                    className={`py-4 rounded-xl flex flex-col items-center justify-center transition-all group border ${theme === 'dark' ? 'bg-white/5 hover:bg-cyan-500/20 border-white/10 hover:border-cyan-500/50' : 'bg-slate-50 hover:bg-cyan-50 border-slate-200 hover:border-cyan-300'}`}
                  >
                    <span className={`text-2xl font-black ${theme === 'dark' ? 'text-white group-hover:text-cyan-400' : 'text-slate-800 group-hover:text-cyan-600'}`}>{days}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${textSlate} group-hover:text-cyan-400`}>Hari</span>
                  </button>
                ))}
              </div>

              {extendModal.loading && (
                <div className={`flex items-center justify-center gap-3 pt-4 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs font-bold">Memproses...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL STATISTIK KLIEN --- */}
      {statsModal.open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 ${theme === 'dark' ? 'bg-[#0a192f] border-white/10' : 'bg-white border-slate-200'}`}>
            <div className={`p-6 border-b flex justify-between items-center ${theme === 'dark' ? 'border-white/10 bg-gradient-to-r from-cyan-900/20 to-transparent' : 'border-slate-200 bg-gradient-to-r from-cyan-50 to-transparent'}`}>
              <h3 className={`font-black text-lg flex items-center gap-2 ${textTitle}`}><Icons.BarChart /> Statistik Kafe</h3>
              <button onClick={() => setStatsModal({ open: false, tenant: null, data: null, loading: false })} className={textSlate}><Icons.X /></button>
            </div>
            <div className="p-6">
              <h4 className={`text-xl font-black mb-6 text-center ${textTitle}`}>{statsModal.tenant.name}</h4>
              
              {statsModal.loading ? (
                <div className="flex justify-center py-8"><div className={`w-8 h-8 border-4 border-t-transparent rounded-full animate-spin ${theme === 'dark' ? 'border-cyan-400' : 'border-cyan-600'}`}></div></div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className={`border rounded-2xl p-4 text-center ${theme === 'dark' ? 'bg-[#050b14] border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${textSlateLight}`}>Total Menu</p>
                    <p className={`text-3xl font-black ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>{statsModal.data?.menus}</p>
                  </div>
                  <div className={`border rounded-2xl p-4 text-center ${theme === 'dark' ? 'bg-[#050b14] border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${textSlateLight}`}>Pesanan Masuk</p>
                    <p className={`text-3xl font-black ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>{statsModal.data?.orders}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TOASTS */}
      <div className="fixed bottom-6 right-6 z-[100] space-y-3 w-[calc(100%-3rem)] sm:w-80 pointer-events-none">
        {toasts.map(t => {
          const isErr = t.type === 'error';
          const isWarn = t.type === 'warning';
          const c = isErr 
            ? (theme === 'dark' ? 'border-rose-500 bg-rose-500/10 text-rose-400' : 'border-rose-300 bg-rose-50 text-rose-600 shadow-lg') 
            : isWarn 
            ? (theme === 'dark' ? 'border-amber-500 bg-amber-500/10 text-amber-400' : 'border-amber-300 bg-amber-50 text-amber-600 shadow-lg') 
            : (theme === 'dark' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-emerald-300 bg-emerald-50 text-emerald-600 shadow-lg');
          
          return (
            <div key={t.id} className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl animate-in slide-in-from-right-8 ${c}`}>
              <span className="text-xl">{isErr ? '❌' : isWarn ? '⚠️' : <Icons.Check />}</span>
              <p className={`text-sm font-bold flex-1 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{t.message}</p>
            </div>
          );
        })}
      </div>

    </div>
  );
}