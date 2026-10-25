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
  Logout: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
};

// GANTI DENGAN EMAIL SUPABASE ANDA (Email Developer)
const ADMIN_EMAIL = 'dinamis.id.shop@gmail.com'; 

export default function AdminDashboard() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState({}); 
  const [stats, setStats] = useState({ totalTenants: 0, online: 0, totalRevenue: 0 });
  const [now, setNow] = useState(null); // State now dimulai null
  const channelRef = useRef(null);
  const router = useRouter();

  // 1. Timer untuk menghitung mundur (Countdown Billing)
  useEffect(() => {
    setNow(Date.now()); // Set waktu saat komponen ter-mount
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Ambil Data Klien & Cek Auth
  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session || session.user.email !== ADMIN_EMAIL) {
        alert('Akses Ditolak! Halaman ini hanya untuk Developer.');
        return router.push('/login');
      }

      const { data } = await supabase.from('tenants').select('*').order('created_at', { ascending: false });
      if (data) {
        setTenants(data);
        const revenue = data.reduce((acc, curr) => acc + (curr.is_active ? 150000 : 0), 0); 
        setStats({ totalTenants: data.length, online: 0, totalRevenue: revenue });
      }
      setLoading(false);
    };
    checkAuthAndFetch();
  }, [router]);

  // 3. SISTEM REALTIME ONLINE / OFFLINE
  useEffect(() => {
    const channel = supabase.channel('online-rooms', {
      config: { presence: { key: 'user_id' } },
    });

    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      const onlineMap = {};
      let count = 0;
      
      Object.keys(state).forEach((key) => {
        state[key].forEach((presence) => {
          onlineMap[presence.tenant_id] = true;
          count++;
        });
      });

      setOnlineUsers(onlineMap);
      setStats(prev => ({ ...prev, online: count }));
    });

    channel.subscribe();
    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  // Fungsi hitung mundur yang aman (jika now null, return 0)
  const calculateDaysLeft = (endDate) => {
    if (!endDate || !now) return 0;
    const diff = new Date(endDate).getTime() - now;
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  if (loading || !now) {
    return (
      <div className="min-h-screen bg-[#050b14] flex items-center justify-center text-[#00a8cc]">
        <div className="animate-spin w-12 h-12 border-4 border-current border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050b14] text-slate-200 font-sans selection:bg-[#00a8cc]/30 p-6 sm:p-10">
      
      <header className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span className="text-[#00a8cc]"><Icons.Shield /></span> NexaFlow Control Center
          </h1>
          <p className="text-sm font-medium text-slate-400 mt-1">Developer Dashboard & Billing Monitor</p>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 rounded-xl font-bold text-sm transition-all">
          <Icons.Logout /> Logout
        </button>
      </header>

      <main className="max-w-7xl mx-auto space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-[#0a192f] to-[#050b14] border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-white group-hover:scale-110 transition-transform"><Icons.Store /></div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Klien Kafe</p>
            <h3 className="text-4xl font-black text-white">{stats.totalTenants}</h3>
          </div>
          <div className="bg-gradient-to-br from-[#0d3b66] to-[#050b14] border border-[#00a8cc]/30 rounded-3xl p-6 shadow-[0_0_30px_rgba(0,168,204,0.15)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-20 text-[#00a8cc] group-hover:scale-110 transition-transform"><Icons.Activity /></div>
            <p className="text-xs font-bold text-[#00a8cc] uppercase tracking-widest mb-2">Kafe Sedang Online</p>
            <h3 className="text-4xl font-black text-[#00a8cc]">{stats.online} <span className="text-lg text-slate-400 font-medium">/ {stats.totalTenants}</span></h3>
          </div>
          <div className="bg-gradient-to-br from-emerald-900/40 to-[#050b14] border border-emerald-500/20 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-emerald-400 group-hover:scale-110 transition-transform"><Icons.Users /></div>
            <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2">Potensi Omzet Bulanan</p>
            <h3 className="text-3xl font-black text-emerald-400">Rp {stats.totalRevenue.toLocaleString('id-ID')}</h3>
          </div>
        </div>

        <div className="bg-[#0a192f]/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <h2 className="text-lg font-black text-white">Monitoring Klien & Penagihan</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <th className="p-5 rounded-tl-xl">Nama Kafe</th>
                  <th className="p-5">Status Jaringan</th>
                  <th className="p-5">Tgl Bergabung</th>
                  <th className="p-5">Sisa Waktu Tagihan</th>
                  <th className="p-5 rounded-tr-xl">Status Langganan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {tenants.map((tenant) => {
                  const daysLeft = calculateDaysLeft(tenant.subscription_end_date);
                  const isOnline = onlineUsers[tenant.id];
                  
                  return (
                    <tr key={tenant.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          {tenant.logo_url ? (
                            <img src={tenant.logo_url} className="w-10 h-10 rounded-xl object-cover border border-white/10" />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-sm font-black text-slate-400">
                              {tenant.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-white text-sm">{tenant.name}</p>
                            <p className="text-[10px] text-slate-500 font-mono mt-0.5">{tenant.id.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                          isOnline 
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                            : 'bg-slate-800 border-slate-700 text-slate-500'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></span>
                          {isOnline ? 'Online' : 'Offline'}
                        </span>
                      </td>
                      <td className="p-5 text-sm font-medium text-slate-400">
                        {new Date(tenant.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2">
                          <span className={`text-lg font-black ${
                            daysLeft <= 3 ? 'text-rose-500 animate-pulse' : 
                            daysLeft <= 7 ? 'text-amber-400' : 
                            'text-[#00a8cc]'
                          }`}>
                            {daysLeft} Hari
                          </span>
                          <Icons.Clock />
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">
                          Jatuh Tempo: {tenant.subscription_end_date ? new Date(tenant.subscription_end_date).toLocaleDateString('id-ID') : '-'}
                        </p>
                      </td>
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          daysLeft > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {daysLeft > 0 ? 'Aktif' : 'Menunggu Pembayaran'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}