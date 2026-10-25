'use client';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const Icons = {
  Shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Users: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Store: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Clock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Activity: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  Logout: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Alert: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Plus: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Search: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Copy: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  WhatsApp: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg>,
};

const ADMIN_EMAIL = 'dinamis.id.shop@gmail.com'; 

export default function AdminDashboard() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [stats, setStats] = useState({ total: 0, online: 0, warning: 0 });
  const [now, setNow] = useState(null); 
  const [toasts, setToasts] = useState([]);
  const [extendingId, setExtendingId] = useState(null);
  
  // State untuk Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const router = useRouter();

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
        alert(`Akses Ditolak!\n\nEmail Anda: ${currentEmail || '(Belum Login)'}\nHanya email Developer yang diizinkan.`);
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
    const currentTime = Date.now();

    tenantData.forEach(t => {
      if (onlineData[t.id]) onlineCount++;
      if (t.subscription_end_date) {
        const daysLeft = Math.max(0, Math.ceil((new Date(t.subscription_end_date).getTime() - currentTime) / (1000 * 60 * 60 * 24)));
        if (daysLeft <= 3) warningCount++;
      }
    });

    setStats({ total: tenantData.length, online: onlineCount, warning: warningCount });
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

  const handleExtend = async (tenant) => {
    if (!confirm(`Perpanjang langganan ${tenant.name} selama 30 hari?`)) return;
    setExtendingId(tenant.id);

    const currentEnd = new Date(tenant.subscription_end_date || Date.now()).getTime();
    const baseDate = Math.max(Date.now(), currentEnd); 
    const newEndDate = new Date(baseDate + (30 * 24 * 60 * 60 * 1000)).toISOString();

    const { error } = await supabase.from('tenants').update({ subscription_end_date: newEndDate, is_active: true }).eq('id', tenant.id);
    
    setExtendingId(null);
    if (error) {
      showToast('Gagal: ' + error.message, 'error');
    } else {
      showToast(`✅ ${tenant.name} +30 Hari!`, 'success');
      fetchTenants();
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast('ID disalin', 'success');
  };

  const openWa = (tenant) => {
    const phone = tenant.wa_number ? tenant.wa_number.replace(/^0/, '62') : '';
    if (!phone) return showToast('Nomor WA belum diatur oleh kafe ini', 'warning');
    const msg = `Halo Owner ${tenant.name}, ini Admin NexaFlow. Kami ingin mengingatkan mengenai perpanjangan langganan sistem kasir Anda.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Logika Filter & Search
  const filteredTenants = tenants.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
    const daysLeft = calculateDaysLeft(t.subscription_end_date);
    
    let matchStatus = true;
    if (filterStatus === 'online') matchStatus = onlineUsers[t.id] === true;
    if (filterStatus === 'expired') matchStatus = daysLeft === 0;
    if (filterStatus === 'warning') matchStatus = daysLeft > 0 && daysLeft <= 3;

    return matchSearch && matchStatus;
  });

  if (loading || !now) {
    return (
      <div className="min-h-screen bg-[#050b14] flex flex-col items-center justify-center text-cyan-400">
        <div className="animate-spin w-12 h-12 border-4 border-current border-t-transparent rounded-full mb-4"></div>
        <p className="text-sm font-bold tracking-widest uppercase text-slate-500">Memverifikasi Hak Akses...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050b14] text-slate-200 font-sans selection:bg-cyan-500/30">
      
      <header className="border-b border-white/10 bg-[#0a192f]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
              <span className="text-cyan-400"><Icons.Shield /></span> Control Center
            </h1>
            <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">Developer & Billing Monitor</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-5 py-2.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 rounded-xl font-bold text-sm transition-all">
            <Icons.Logout /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        
        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-[#0a192f] border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 text-white group-hover:scale-110 transition-transform"><Icons.Store /></div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Klien</p>
            <h3 className="text-5xl font-black text-white">{stats.total}</h3>
          </div>
          <div className="bg-[#0d3b66] border border-cyan-500/30 rounded-3xl p-6 shadow-[0_0_30px_rgba(0,168,204,0.15)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-20 text-cyan-400 group-hover:scale-110 transition-transform"><Icons.Activity /></div>
            <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2">Kafe Online</p>
            <h3 className="text-5xl font-black text-cyan-400">{stats.online} <span className="text-xl text-slate-500 font-bold">/ {stats.total}</span></h3>
          </div>
          <div className="bg-gradient-to-br from-amber-900/40 to-[#050b14] border border-amber-500/30 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-20 text-amber-500 group-hover:scale-110 transition-transform"><Icons.Alert /></div>
            <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-2">Butuh Perhatian</p>
            <h3 className="text-5xl font-black text-amber-400">{stats.warning}</h3>
          </div>
        </div>

        {/* TOOLBAR PENCARIAN & FILTER */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#0a192f]/50 p-4 rounded-2xl border border-white/10">
          <div className="relative w-full sm:w-96">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"><Icons.Search /></span>
            <input 
              type="text" 
              placeholder="Cari nama kafe..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#050b14] border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>
          <div className="flex bg-[#050b14] p-1 rounded-xl border border-white/10 w-full sm:w-auto overflow-x-auto">
            {[
              { id: 'all', label: 'Semua' },
              { id: 'online', label: 'Online' },
              { id: 'expired', label: 'Expired' },
              { id: 'warning', label: 'Warning' }
            ].map(f => (
              <button 
                key={f.id} 
                onClick={() => setFilterStatus(f.id)}
                className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${filterStatus === f.id ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-500 hover:text-white'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* TABEL KLIEN */}
        <div className="bg-[#0a192f]/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-[#050b14] text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-white/10">
                  <th className="p-5">Nama Kafe</th>
                  <th className="p-5">Status Jaringan</th>
                  <th className="p-5">Tgl Bergabung</th>
                  <th className="p-5">Sisa Waktu Tagihan</th>
                  <th className="p-5 text-right">Aksi Cepat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTenants.length === 0 ? (
                  <tr><td colSpan="5" className="p-10 text-center text-slate-500 font-bold">Tidak ada data yang cocok.</td></tr>
                ) : filteredTenants.map((tenant) => {
                  const daysLeft = calculateDaysLeft(tenant.subscription_end_date);
                  const isOnline = onlineUsers[tenant.id];
                  const isExpired = daysLeft <= 0;
                  const isWarning = daysLeft > 0 && daysLeft <= 3;
                  const isExtending = extendingId === tenant.id;
                  
                  return (
                    <tr key={tenant.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-5">
                        <div className="flex items-center gap-4">
                          {tenant.logo_url ? (
                            <img src={tenant.logo_url} className="w-12 h-12 rounded-xl object-cover border border-white/10 shadow-sm" />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center text-lg font-black text-cyan-400 border border-white/10">
                              {tenant.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-white text-base">{tenant.name}</p>
                            <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-500 font-mono">
                              <span>ID: {tenant.id.slice(0, 8)}...</span>
                              <button onClick={() => copyToClipboard(tenant.id)} className="hover:text-cyan-400 transition-colors" title="Copy Full ID"><Icons.Copy /></button>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                          isOnline ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-500'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`}></span>
                          {isOnline ? 'Online' : 'Offline'}
                        </span>
                      </td>
                      <td className="p-5 text-sm font-semibold text-slate-400">
                        {new Date(tenant.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="p-5">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-2xl font-black ${
                              isExpired ? 'text-rose-500' : isWarning ? 'text-amber-400 animate-pulse' : 'text-cyan-400'
                            }`}>
                              {daysLeft} <span className="text-xs font-bold text-slate-500">Hari</span>
                            </span>
                          </div>
                          <p className={`text-[10px] font-bold uppercase tracking-wider ${isExpired ? 'text-rose-500' : isWarning ? 'text-amber-500' : 'text-slate-500'}`}>
                            {isExpired ? 'Telah Berakhir' : `Jatuh Tempo: ${new Date(tenant.subscription_end_date).toLocaleDateString('id-ID')}`}
                          </p>
                        </div>
                      </td>
                      <td className="p-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => openWa(tenant)}
                            className="p-2.5 bg-white/5 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 border border-white/10 rounded-xl transition-all"
                            title="Hubungi via WA"
                          >
                            <Icons.WhatsApp />
                          </button>
                          <button 
                            onClick={() => handleExtend(tenant)}
                            disabled={isExtending}
                            className="inline-flex items-center justify-center min-w-[110px] gap-1.5 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-500/50 text-[#050b14] font-black text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
                          >
                            {isExtending ? (
                              <div className="w-4 h-4 border-2 border-[#050b14] border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <><Icons.Plus /> 30 Hari</>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* TOASTS */}
      <div className="fixed bottom-6 right-6 z-[100] space-y-3 w-80 pointer-events-none">
        {toasts.map(t => {
          const isErr = t.type === 'error';
          const isWarn = t.type === 'warning';
          const c = isErr ? 'border-rose-500 bg-rose-500/10 text-rose-400' : isWarn ? 'border-amber-500 bg-amber-500/10 text-amber-400' : 'border-emerald-500 bg-emerald-500/10 text-emerald-400';
          return (
            <div key={t.id} className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl animate-in slide-in-from-right-8 ${c}`}>
              <span className="text-xl">{isErr ? '❌' : isWarn ? '⚠️' : <Icons.Check />}</span>
              <p className="text-sm font-bold text-white flex-1">{t.message}</p>
            </div>
          );
        })}
      </div>

    </div>
  );
}