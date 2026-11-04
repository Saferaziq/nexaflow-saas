'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const Icons = {
  Shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Store: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Activity: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  Logout: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Alert: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Plus: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Search: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Copy: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  WhatsApp: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg>,
  Trash: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  BarChart: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>,
  Dollar: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  X: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Sun: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  Moon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  Settings: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>,
};

const ADMIN_EMAIL = 'dinamis.id.shop@gmail.com'; 

export default function AdminDashboard() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [stats, setStats] = useState({ total: 0, online: 0, warning: 0, revenue: 0, commission: 0 });
  const [now, setNow] = useState(null); 
  const [toasts, setToasts] = useState([]);
  
  const [theme, setTheme] = useState('dark');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Modal States
  const [extendModal, setExtendModal] = useState({ open: false, tenant: null, loading: false });
  const [statsModal, setStatsModal] = useState({ open: false, tenant: null, data: null, loading: false });
  const [financeModal, setFinanceModal] = useState({ open: false, tenant: null, loading: false, price: '', referral: '', commission: '' });
  
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
    let totalRevenue = 0;
    let totalCommission = 0;
    const currentTime = Date.now();

    tenantData.forEach(t => {
      if (onlineData[t.id]) onlineCount++;
      if (t.subscription_end_date) {
        const daysLeft = Math.max(0, Math.ceil((new Date(t.subscription_end_date).getTime() - currentTime) / (1000 * 60 * 60 * 24)));
        if (daysLeft <= 3) warningCount++;
        
        if (daysLeft > 0 && t.is_active !== false) {
          totalRevenue += (Number(t.rental_price) || 150000);
          totalCommission += (Number(t.sales_commission) || 0);
        }
      }
    });

    setStats({ 
      total: tenantData.length, 
      online: onlineCount, 
      warning: warningCount,
      revenue: totalRevenue,
      commission: totalCommission
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

  const openFinance = (tenant) => {
    setFinanceModal({
      open: true,
      tenant,
      loading: false,
      price: tenant.rental_price || 150000,
      referral: tenant.referral_name || '',
      commission: tenant.sales_commission || 0
    });
  };

  const saveFinance = async (e) => {
    e.preventDefault();
    setFinanceModal(prev => ({ ...prev, loading: true }));
    
    // Pastikan data dikirim sebagai angka
    const payload = {
      rental_price: Number(financeModal.price) || 0,
      referral_name: financeModal.referral.trim(),
      sales_commission: Number(financeModal.commission) || 0
    };

    const { error } = await supabase.from('tenants').update(payload).eq('id', financeModal.tenant.id);

    setFinanceModal(prev => ({ ...prev, loading: false }));
    if (error) {
      console.error("Supabase Error:", error);
      return showToast('Gagal simpan: ' + error.message, 'error');
    }
    
    showToast('Data finansial disimpan', 'success');
    setFinanceModal({ open: false, tenant: null, loading: false, price: '', referral: '', commission: '' });
    fetchTenants();
  };

  const handleDelete = async (tenant) => {
    const confirmText = prompt(`PERINGATAN KERAS!\n\nSemua menu, pesanan, dan akun dari "${tenant.name}" akan dihapus permanen.\n\nKetik nama kafe (${tenant.name}) untuk konfirmasi:`);
    
    if (confirmText !== tenant.name) {
      return showToast('Konfirmasi gagal. Nama tidak cocok.', 'error');
    }

    setTenants(prev => prev.filter(t => t.id !== tenant.id));

    const { error } = await supabase.from('tenants').delete().eq('id', tenant.id);
    if (error) {
      showToast('Gagal hapus: ' + error.message, 'error');
      fetchTenants();
    } else {
      showToast(`Kafe ${tenant.name} berhasil dihapus.`, 'success');
    }
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
      <div className={`min-h-screen flex flex-col items-center justify-center font-sans ${theme === 'dark' ? 'bg-[#050b14] text-cyan-400' : 'bg-slate-50 text-cyan-600'}`}>
        <div className="animate-spin w-12 h-12 border-4 border-current border-t-transparent rounded-full mb-4"></div>
        <p className="text-sm font-black tracking-widest uppercase">Memverifikasi Hak Akses...</p>
      </div>
    );
  }

  // --- UI CLASSES (LEBIH TIPIS & ELEGAN) ---
  const bgMain = theme === 'dark' ? 'bg-[#050b14]' : 'bg-[#f0f4f8]';
  const textMain = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const textSub = theme === 'dark' ? 'text-slate-400' : 'text-slate-600';
  
  // Border 2px, Shadow 4px
  const cardClass = theme === 'dark' 
    ? 'bg-[#0a192f] border-2 border-slate-700 shadow-[4px_4px_0px_0px_#06b6d4]' 
    : 'bg-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_#000000]';
    
  const btnBase = 'border-2 font-black uppercase tracking-wider transition-all duration-150 flex items-center justify-center gap-2';
  const btnDark = 'bg-slate-800 text-white border-slate-900 shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none hover:bg-slate-700';
  const btnLight = 'bg-white text-slate-900 border-slate-900 shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none hover:bg-slate-100';

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${bgMain} ${textMain}`}>
      
      {/* HEADER */}
      <header className={`border-b-2 ${theme === 'dark' ? 'border-slate-800 bg-[#0a192f]' : 'border-slate-900 bg-white'} sticky top-0 z-40`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <h1 className={`text-2xl font-black tracking-tighter uppercase flex items-center gap-3`}>
              <span className={`p-2 border-2 rounded-lg ${theme === 'dark' ? 'border-cyan-400 text-cyan-400 bg-cyan-400/10' : 'border-cyan-600 text-cyan-600 bg-cyan-50'}`}><Icons.Shield /></span> 
              Control Center
            </h1>
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <button onClick={toggleTheme} className={`${btnBase} ${theme === 'dark' ? btnDark : btnLight} px-4 py-2 rounded-lg`}>
              {theme === 'dark' ? <Icons.Sun /> : <Icons.Moon />}
            </button>
            <button onClick={handleLogout} className={`${btnBase} bg-rose-500 text-white border-rose-900 shadow-[2px_2px_0px_0px_#881337] hover:bg-rose-600 flex-1 sm:flex-none px-4 py-2 rounded-lg`}>
              <Icons.Logout /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className={`${cardClass} rounded-xl p-5 relative overflow-hidden`}>
            <div className={`absolute top-0 right-0 p-3 opacity-10 ${theme === 'dark' ? 'text-white' : 'text-black'}`}><Icons.Store /></div>
            <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${textSub}`}>Total Klien</p>
            <h3 className="text-4xl font-black">{stats.total}</h3>
          </div>
          
          <div className={`${cardClass} rounded-xl p-5 relative overflow-hidden`}>
            <div className={`absolute top-0 right-0 p-3 opacity-10 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}><Icons.Activity /></div>
            <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>Kafe Online</p>
            <h3 className={`text-4xl font-black ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>{stats.online} <span className={`text-lg ${textSub}`}>/ {stats.total}</span></h3>
          </div>

          <div className={`${cardClass} rounded-xl p-5 relative overflow-hidden`}>
            <div className={`absolute top-0 right-0 p-3 opacity-10 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}><Icons.Dollar /></div>
            <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>Total Omset / Bln</p>
            <h3 className={`text-xl font-black ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>Rp {stats.revenue.toLocaleString('id-ID')}</h3>
          </div>

          <div className={`${cardClass} rounded-xl p-5 relative overflow-hidden`}>
            <div className={`absolute top-0 right-0 p-3 opacity-10 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-500'}`}><Icons.BarChart /></div>
            <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-500'}`}>Bagi Hasil Sales</p>
            <h3 className={`text-xl font-black ${theme === 'dark' ? 'text-amber-400' : 'text-amber-500'}`}>Rp {stats.commission.toLocaleString('id-ID')}</h3>
          </div>
        </div>

        {/* SEARCH & FILTER */}
        <div className={`flex flex-col lg:flex-row gap-4 justify-between items-center p-3 rounded-xl border-2 ${theme === 'dark' ? 'bg-[#0a192f] border-slate-700 shadow-[4px_4px_0px_0px_#06b6d4]' : 'bg-white border-slate-900 shadow-[4px_4px_0px_0px_#000]'}`}>
          <div className="relative w-full lg:w-96">
            <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${textSub}`}><Icons.Search /></span>
            <input 
              type="text" 
              placeholder="Cari nama kafe..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={`w-full bg-transparent border-none outline-none pl-10 pr-4 py-2 text-sm font-bold ${theme === 'dark' ? 'text-white placeholder:text-slate-600' : 'text-slate-900 placeholder:text-slate-400'}`}
            />
          </div>
          <div className={`flex p-1 rounded-lg border-2 ${theme === 'dark' ? 'bg-[#050b14] border-slate-700' : 'bg-slate-100 border-slate-300'} w-full lg:w-auto overflow-x-auto`}>
            {[
              { id: 'all', label: 'Semua' },
              { id: 'online', label: 'Online' },
              { id: 'expired', label: 'Non-Aktif' },
              { id: 'warning', label: 'Warning' }
            ].map(f => (
              <button 
                key={f.id} 
                onClick={() => setFilterStatus(f.id)}
                className={`flex-1 lg:flex-none px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider transition-all ${filterStatus === f.id ? (theme === 'dark' ? 'bg-cyan-500 text-black' : 'bg-cyan-600 text-white') : `${textSub} hover:${textMain}`}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* --- TAMPILAN DESKTOP (TABEL) --- */}
        <div className={`hidden lg:block rounded-xl border-2 overflow-hidden ${theme === 'dark' ? 'border-slate-700 shadow-[6px_6px_0px_0px_#06b6d4]' : 'border-slate-900 shadow-[6px_6px_0px_0px_#000]'}`}>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`text-[10px] font-black uppercase tracking-widest border-b-2 ${theme === 'dark' ? 'bg-[#050b14] text-cyan-400 border-slate-700' : 'bg-slate-200 text-slate-900 border-slate-900'}`}>
                <th className="p-4">Nama Kafe</th>
                <th className="p-4">Status</th>
                <th className="p-4">Sisa Waktu</th>
                <th className="p-4">Finansial</th>
                <th className="p-4 text-right">Aksi Cepat</th>
              </tr>
            </thead>
            <tbody className={`divide-y-2 ${theme === 'dark' ? 'divide-slate-800 bg-[#0a192f]' : 'divide-slate-200 bg-white'}`}>
              {filteredTenants.length === 0 ? (
                <tr><td colSpan="5" className={`p-8 text-center font-black text-lg ${textSub}`}>Tidak ada data.</td></tr>
              ) : filteredTenants.map((tenant) => {
                const daysLeft = calculateDaysLeft(tenant.subscription_end_date);
                const isOnline = onlineUsers[tenant.id];
                const isExpired = daysLeft <= 0 || tenant.is_active === false;
                const isWarning = daysLeft > 0 && daysLeft <= 3 && tenant.is_active !== false;
                
                return (
                  <tr key={tenant.id} className={`transition-colors ${tenant.is_active === false ? 'opacity-50 grayscale' : (theme === 'dark' ? 'hover:bg-[#0d2137]' : 'hover:bg-slate-50')}`}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {tenant.logo_url ? (
                          <img src={tenant.logo_url} className={`w-10 h-10 rounded-lg object-cover border-2 ${theme === 'dark' ? 'border-slate-600' : 'border-slate-900'}`} />
                        ) : (
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-black border-2 ${theme === 'dark' ? 'bg-slate-800 text-cyan-400 border-slate-600' : 'bg-slate-200 text-slate-900 border-slate-900'}`}>
                            {tenant.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-black text-base">{tenant.name}</p>
                          <p className={`text-[9px] font-bold font-mono ${textSub}`}>ID: {tenant.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider border-2 ${
                        isOnline && tenant.is_active !== false 
                          ? (theme === 'dark' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-emerald-100 border-emerald-600 text-emerald-700')
                          : (theme === 'dark' ? 'bg-slate-800 border-slate-600 text-slate-400' : 'bg-slate-100 border-slate-400 text-slate-600')
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isOnline && tenant.is_active !== false ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></span>
                        {tenant.is_active === false ? 'Suspended' : isOnline ? 'Online' : 'Offline'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-0.5">
                        <span className={`text-xl font-black ${
                          isExpired ? 'text-rose-500' : isWarning ? 'text-amber-500' : (theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')
                        }`}>
                          {tenant.is_active === false ? 'BEKU' : `${daysLeft} HARI`}
                        </span>
                        <p className={`text-[9px] font-bold uppercase tracking-wider ${textSub}`}>
                          {tenant.is_active === false ? 'Disuspend' : `${new Date(tenant.subscription_end_date).toLocaleDateString('id-ID')}`}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-0.5">
                        <p className={`text-xs font-black ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                          Rp {(tenant.rental_price || 150000).toLocaleString('id-ID')}
                        </p>
                        <p className={`text-[9px] font-bold ${textSub}`}>
                          Ref: <span className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>{tenant.referral_name || '-'}</span>
                        </p>
                        <p className={`text-[9px] font-bold ${textSub}`}>
                          Komisi: <span className={theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}>Rp {(tenant.sales_commission || 0).toLocaleString('id-ID')}</span>
                        </p>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => handleDelete(tenant)} className={`${btnBase} ${theme === 'dark' ? 'bg-rose-500/20 text-rose-400 border-rose-500 hover:bg-rose-500/30' : 'bg-rose-100 text-rose-600 border-rose-600 hover:bg-rose-200'} p-2 rounded-lg`} title="Hapus Permanen"><Icons.Trash /></button>
                        
                        <button onClick={() => openWa(tenant)} className={`${btnBase} ${theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500 hover:bg-emerald-500/30' : 'bg-emerald-100 text-emerald-600 border-emerald-600 hover:bg-emerald-200'} p-2 rounded-lg`} title="Chat WA"><Icons.WhatsApp /></button>
                        
                        <button onClick={() => openStats(tenant)} className={`${btnBase} ${theme === 'dark' ? 'bg-white/10 text-white border-white hover:bg-white/20' : 'bg-slate-200 text-slate-900 border-slate-900 hover:bg-slate-300'} p-2 rounded-lg`} title="Lihat Statistik"><Icons.BarChart /></button>

                        <button onClick={() => openFinance(tenant)} className={`${btnBase} ${theme === 'dark' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500 hover:bg-cyan-500/30' : 'bg-cyan-100 text-cyan-700 border-cyan-700 hover:bg-cyan-200'} p-2 rounded-lg`} title="Atur Finansial"><Icons.Settings /></button>

                        <button onClick={() => toggleStatus(tenant)} className={`${btnBase} ${tenant.is_active === false ? (theme === 'dark' ? 'bg-emerald-500 text-black border-emerald-600' : 'bg-emerald-500 text-white border-emerald-700') : (theme === 'dark' ? 'bg-slate-800 text-white border-slate-600' : 'bg-slate-200 text-slate-900 border-slate-400')} px-3 py-2 rounded-lg text-[10px]`}>
                          {tenant.is_active === false ? 'Aktifkan' : 'Suspend'}
                        </button>

                        <button onClick={() => setExtendModal({ open: true, tenant, loading: false })} className={`${btnBase} bg-blue-600 text-white border-blue-900 shadow-[2px_2px_0px_0px_#1e3a8a] hover:bg-blue-500 px-3 py-2 rounded-lg text-[10px]`}>
                          <Icons.Plus /> Extend
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
        <div className="lg:hidden space-y-5">
          {filteredTenants.length === 0 ? (
            <div className={`${cardClass} rounded-xl p-6 text-center font-black text-lg ${textSub}`}>Tidak ada data.</div>
          ) : filteredTenants.map((tenant) => {
            const daysLeft = calculateDaysLeft(tenant.subscription_end_date);
            const isOnline = onlineUsers[tenant.id];
            const isExpired = daysLeft <= 0 || tenant.is_active === false;
            const isWarning = daysLeft > 0 && daysLeft <= 3 && tenant.is_active !== false;

            return (
              <div key={tenant.id} className={`${cardClass} rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden ${tenant.is_active === false ? 'opacity-60 grayscale' : ''}`}>
                
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2.5">
                    {tenant.logo_url ? (
                      <img src={tenant.logo_url} className={`w-10 h-10 rounded-lg object-cover border-2 ${theme === 'dark' ? 'border-slate-600' : 'border-slate-900'}`} />
                    ) : (
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-black border-2 ${theme === 'dark' ? 'bg-slate-800 text-cyan-400 border-slate-600' : 'bg-slate-200 text-slate-900 border-slate-900'}`}>
                        {tenant.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-black text-base leading-tight">{tenant.name}</h3>
                      <p className={`text-[9px] font-bold font-mono ${textSub}`}>ID: {tenant.id.slice(0, 8)}...</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider border-2 ${
                    isOnline && tenant.is_active !== false 
                      ? (theme === 'dark' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-emerald-100 border-emerald-600 text-emerald-700')
                      : (theme === 'dark' ? 'bg-slate-800 border-slate-600 text-slate-400' : 'bg-slate-100 border-slate-400 text-slate-600')
                  }`}>
                    {tenant.is_active === false ? 'Suspended' : isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>

                <div className={`rounded-lg p-2.5 border-2 flex flex-col gap-1.5 ${theme === 'dark' ? 'bg-[#050b14] border-slate-700' : 'bg-slate-50 border-slate-300'}`}>
                  <div className="flex justify-between items-center">
                    <p className={`text-[10px] font-bold uppercase ${textSub}`}>Sisa Waktu</p>
                    <span className={`text-lg font-black ${isExpired ? 'text-rose-500' : isWarning ? 'text-amber-500' : (theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')}`}>
                      {tenant.is_active === false ? 'BEKU' : `${daysLeft} HARI`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className={`text-[10px] font-bold uppercase ${textSub}`}>Harga Sewa</p>
                    <span className={`text-xs font-black ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>Rp {(tenant.rental_price || 150000).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className={`text-[10px] font-bold uppercase ${textSub}`}>Referral</p>
                    <span className={`text-xs font-black ${textMain}`}>{tenant.referral_name || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className={`text-[10px] font-bold uppercase ${textSub}`}>Komisi</p>
                    <span className={`text-xs font-black ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`}>Rp {(tenant.sales_commission || 0).toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5 mt-1">
                  <button onClick={() => setExtendModal({ open: true, tenant, loading: false })} className={`${btnBase} bg-blue-600 text-white border-blue-900 shadow-[2px_2px_0px_0px_#1e3a8a] col-span-2 py-2.5 rounded-lg text-xs`}>
                    <Icons.Plus /> Perpanjang
                  </button>
                  <button onClick={() => openFinance(tenant)} className={`${btnBase} ${theme === 'dark' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500' : 'bg-cyan-100 text-cyan-700 border-cyan-700'} py-2 rounded-lg text-[10px]`}><Icons.Settings /> Finansial</button>
                  <button onClick={() => openStats(tenant)} className={`${btnBase} ${theme === 'dark' ? 'bg-slate-800 text-white border-slate-600' : 'bg-slate-200 text-slate-900 border-slate-900'} py-2 rounded-lg text-[10px]`}><Icons.BarChart /> Statistik</button>
                  <button onClick={() => toggleStatus(tenant)} className={`${btnBase} ${tenant.is_active === false ? 'bg-emerald-500 text-black border-emerald-700' : 'bg-amber-500 text-black border-amber-700'} py-2 rounded-lg text-[10px]`}>
                    {tenant.is_active === false ? 'Aktifkan' : 'Suspend'}
                  </button>
                  <button onClick={() => handleDelete(tenant)} className={`${btnBase} bg-rose-500 text-white border-rose-900 shadow-[2px_2px_0px_0px_#881337] py-2 rounded-lg text-[10px]`}><Icons.Trash /> Hapus</button>
                </div>
              </div>
            );
          })}
        </div>

      </main>

      {/* --- MODAL PERPANJANG KUSTOM --- */}
      {extendModal.open && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className={`border-2 rounded-xl w-full max-w-sm overflow-hidden ${theme === 'dark' ? 'bg-[#0a192f] border-slate-700 shadow-[6px_6px_0px_0px_#06b6d4]' : 'bg-white border-slate-900 shadow-[6px_6px_0px_0px_#000]'}`}>
            <div className={`p-4 border-b-2 flex justify-between items-center ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-slate-900 bg-slate-100'}`}>
              <h3 className="font-black text-base uppercase tracking-wider">Perpanjang Waktu</h3>
              <button onClick={() => setExtendModal({ open: false, tenant: null, loading: false })} className={`p-1 border-2 rounded ${theme === 'dark' ? 'border-slate-500 hover:bg-slate-700' : 'border-slate-400 hover:bg-slate-200'}`}><Icons.X /></button>
            </div>
            <div className="p-5 space-y-3">
              <p className={`text-xs font-bold text-center ${textSub}`}>Pilih durasi untuk <span className={textMain}>{extendModal.tenant.name}</span>:</p>
              
              <div className="grid grid-cols-2 gap-2">
                {[7, 30, 90, 365].map(days => (
                  <button 
                    key={days} 
                    disabled={extendModal.loading}
                    onClick={() => submitExtend(days)}
                    className={`py-3 rounded-lg flex flex-col items-center justify-center transition-all border-2 ${theme === 'dark' ? 'bg-[#050b14] border-slate-600 hover:border-cyan-500 hover:bg-slate-800 shadow-[2px_2px_0px_0px_#000]' : 'bg-slate-50 border-slate-300 hover:border-cyan-600 hover:bg-white shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none'}`}
                  >
                    <span className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{days}</span>
                    <span className={`text-[9px] font-black uppercase tracking-wider ${textSub}`}>Hari</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL FINANSIAL --- */}
      {financeModal.open && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className={`border-2 rounded-xl w-full max-w-sm overflow-hidden ${theme === 'dark' ? 'bg-[#0a192f] border-slate-700 shadow-[6px_6px_0px_0px_#06b6d4]' : 'bg-white border-slate-900 shadow-[6px_6px_0px_0px_#000]'}`}>
            <div className={`p-4 border-b-2 flex justify-between items-center ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-slate-900 bg-slate-100'}`}>
              <h3 className="font-black text-base uppercase tracking-wider">Data Finansial</h3>
              <button onClick={() => setFinanceModal({ open: false, tenant: null, loading: false, price: '', referral: '', commission: '' })} className={`p-1 border-2 rounded ${theme === 'dark' ? 'border-slate-500 hover:bg-slate-700' : 'border-slate-400 hover:bg-slate-200'}`}><Icons.X /></button>
            </div>
            <form onSubmit={saveFinance} className="p-5 space-y-3">
              <h4 className={`font-black text-center text-base ${textMain}`}>{financeModal.tenant.name}</h4>
              
              <div>
                <label className={`block text-[10px] font-black uppercase tracking-wider mb-1 ${textSub}`}>Harga Sewa / Bulan (Rp)</label>
                <input type="number" required value={financeModal.price} onChange={e => setFinanceModal({...financeModal, price: e.target.value})} className={`w-full border-2 rounded-lg px-3 py-2 text-sm font-bold ${theme === 'dark' ? 'bg-[#050b14] border-slate-600 text-white focus:border-cyan-400' : 'bg-slate-50 border-slate-400 text-slate-900 focus:border-cyan-600'} outline-none`} />
              </div>

              <div>
                <label className={`block text-[10px] font-black uppercase tracking-wider mb-1 ${textSub}`}>Nama Sales / Referral</label>
                <input type="text" placeholder="Nama Kafe Rekomendasi" value={financeModal.referral} onChange={e => setFinanceModal({...financeModal, referral: e.target.value})} className={`w-full border-2 rounded-lg px-3 py-2 text-sm font-bold ${theme === 'dark' ? 'bg-[#050b14] border-slate-600 text-white focus:border-cyan-400' : 'bg-slate-50 border-slate-400 text-slate-900 focus:border-cyan-600'} outline-none`} />
              </div>

              <div>
                <label className={`block text-[10px] font-black uppercase tracking-wider mb-1 ${textSub}`}>Bagi Hasil / Komisi Sales (Rp)</label>
                <input type="number" value={financeModal.commission} onChange={e => setFinanceModal({...financeModal, commission: e.target.value})} className={`w-full border-2 rounded-lg px-3 py-2 text-sm font-bold ${theme === 'dark' ? 'bg-[#050b14] border-slate-600 text-white focus:border-cyan-400' : 'bg-slate-50 border-slate-400 text-slate-900 focus:border-cyan-600'} outline-none`} />
              </div>

              <button type="submit" disabled={financeModal.loading} className={`${btnBase} w-full py-2.5 bg-cyan-600 text-white border-cyan-900 shadow-[2px_2px_0px_0px_#164e63] hover:bg-cyan-500 mt-2 rounded-lg text-sm`}>
                {financeModal.loading ? 'Menyimpan...' : 'Simpan Finansial'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL STATISTIK KLIEN --- */}
      {statsModal.open && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className={`border-2 rounded-xl w-full max-w-sm overflow-hidden ${theme === 'dark' ? 'bg-[#0a192f] border-slate-700 shadow-[6px_6px_0px_0px_#06b6d4]' : 'bg-white border-slate-900 shadow-[6px_6px_0px_0px_#000]'}`}>
            <div className={`p-4 border-b-2 flex justify-between items-center ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-slate-900 bg-slate-100'}`}>
              <h3 className="font-black text-base uppercase tracking-wider flex items-center gap-2"><Icons.BarChart /> Statistik</h3>
              <button onClick={() => setStatsModal({ open: false, tenant: null, data: null, loading: false })} className={`p-1 border-2 rounded ${theme === 'dark' ? 'border-slate-500 hover:bg-slate-700' : 'border-slate-400 hover:bg-slate-200'}`}><Icons.X /></button>
            </div>
            <div className="p-5">
              <h4 className={`text-lg font-black mb-5 text-center uppercase ${textMain}`}>{statsModal.tenant.name}</h4>
              
              {statsModal.loading ? (
                <div className="flex justify-center py-6"><div className={`w-8 h-8 border-4 border-t-transparent rounded-full animate-spin ${theme === 'dark' ? 'border-cyan-400' : 'border-cyan-600'}`}></div></div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div className={`border-2 rounded-lg p-3 text-center ${theme === 'dark' ? 'bg-[#050b14] border-slate-700' : 'bg-slate-50 border-slate-300'}`}>
                    <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${textSub}`}>Total Menu</p>
                    <p className={`text-3xl font-black ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>{statsModal.data?.menus}</p>
                  </div>
                  <div className={`border-2 rounded-lg p-3 text-center ${theme === 'dark' ? 'bg-[#050b14] border-slate-700' : 'bg-slate-50 border-slate-300'}`}>
                    <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${textSub}`}>Pesanan</p>
                    <p className={`text-3xl font-black ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>{statsModal.data?.orders}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TOASTS */}
      <div className="fixed bottom-6 right-6 z-[100] space-y-2 w-[calc(100%-3rem)] sm:w-80 pointer-events-none">
        {toasts.map(t => {
          const isErr = t.type === 'error';
          const isWarn = t.type === 'warning';
          const c = isErr 
            ? 'bg-rose-500 text-white border-rose-900 shadow-[2px_2px_0px_0px_#881337]' 
            : isWarn 
            ? 'bg-amber-400 text-black border-amber-700 shadow-[2px_2px_0px_0px_#78350f]' 
            : 'bg-emerald-500 text-white border-emerald-900 shadow-[2px_2px_0px_0px_#064e3b]';
          
          return (
            <div key={t.id} className={`pointer-events-auto flex items-center gap-2 px-3 py-2 border-2 rounded-lg animate-in slide-in-from-right-8 ${c}`}>
              <span className="text-lg">{isErr ? '❌' : isWarn ? '⚠️' : <Icons.Check />}</span>
              <p className="text-xs font-black uppercase tracking-wider flex-1">{t.message}</p>
            </div>
          );
        })}
      </div>

    </div>
  );
}