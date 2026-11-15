'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const Icons = {
  Sun: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  Moon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  Logout: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Download: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
};

export default function OwnerReports() {
  const [userEmail, setUserEmail] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [period, setPeriod] = useState('daily'); 
  const [dateStr, setDateStr] = useState(new Date().toLocaleDateString('en-CA'));
  
  const [reports, setReports] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const fetchReports = async (email, currentPeriod, currentDate) => {
    setIsLoading(true);
    try {
      const { data: t } = await supabase.from('tenants').select('id, name').eq('manager_email', email);
      if (!t) { setIsLoading(false); return; }
      setTenants(t);

      const tenantIds = t.map(x => x.id);

      // Hitung Start & End Date
      let startDate = new Date();
      let endDate = new Date();
      
      if (currentPeriod === 'daily') {
        startDate = new Date(currentDate); startDate.setHours(0,0,0,0);
        endDate = new Date(currentDate); endDate.setHours(23,59,59,999);
      } else if (currentPeriod === 'monthly') {
        const [year, month] = currentDate.split('-');
        startDate = new Date(year, month - 1, 1);
        endDate = new Date(year, month, 0, 23, 59, 59);
      } else if (currentPeriod === 'weekly') {
        const [year, week] = currentDate.split('-W');
        const simple = new Date(year, 0, 1 + (week - 1) * 7);
        const dow = simple.getDay();
        startDate = new Date(simple);
        if (dow <= 4) startDate.setDate(simple.getDate() - simple.getDay() + 1);
        else startDate.setDate(simple.getDate() + 8 - simple.getDay());
        startDate.setHours(0,0,0,0);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23,59,59,999);
      }

      const { data: orders } = await supabase
        .from('orders')
        .select('id, tenant_id, customer_name, total_price, created_at, status')
        .in('tenant_id', tenantIds)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: false });

      if (orders) {
        const mapped = orders.map(o => ({
          ...o,
          branchName: t.find(x => x.id === o.tenant_id)?.name || 'Cabang'
        }));
        setReports(mapped);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { window.location.href = '/login'; return; }
      setUserEmail(session.user.email);
      fetchReports(session.user.email, period, dateStr);
    };
    getSession();
  }, []);

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    fetchReports(userEmail, newPeriod, dateStr);
  };

  const handleDateChange = (e) => {
    setDateStr(e.target.value);
    fetchReports(userEmail, period, e.target.value);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const handleExportCSV = () => {
    let csv = `Laporan Global Transaksi\nEmail Manager: ${userEmail}\nPeriode: ${period} (${dateStr})\nTanggal Unduh: ${new Date().toLocaleDateString('id-ID')}\n\n`;
    csv += `Waktu,Cabang,Pelanggan,Status,Total\n`;
    reports.forEach(r => {
      csv += `"${new Date(r.created_at).toLocaleString('id-ID')}","${r.branchName}","${r.customer_name || '-'}","${r.status}","${r.total_price}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Laporan_Global_${dateStr}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatRp = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  return (
    <div className="bg-[#F8FAFC] text-slate-800 dark:bg-[#04060B] dark:text-slate-200 min-h-screen overflow-hidden font-sans transition-colors duration-300">
      <div className="flex h-screen relative z-10">
        <aside className="group w-[80px] hover:w-64 transition-all duration-300 ease-in-out bg-white/70 dark:bg-[#060911]/80 backdrop-blur-2xl border-r border-slate-200 dark:border-slate-800/80 flex flex-col z-50 h-full shrink-0">
          <div className="h-20 flex items-center px-6 border-b border-slate-200 dark:border-slate-800/80 overflow-hidden shrink-0">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-lg overflow-hidden p-1">
              <img src="/logo-nexaflow-3d.png" alt="NexaFlow Logo" className="w-full h-full object-contain drop-shadow-md" />
            </div>
            <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              <div className="flex items-center gap-1">
                <span className="text-lg font-black tracking-tight font-display text-slate-900 dark:text-white">NEXAFLOW</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#EA8B42]"></span>
              </div>
              <p className="text-[9px] font-bold text-slate-500 tracking-[0.2em] uppercase">Owner Space</p>
            </div>
          </div>
          <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto overflow-x-hidden">
            <Link href="/owner" className="flex items-center gap-3 px-3 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#111C33] hover:text-slate-900 dark:hover:text-white rounded-xl font-bold transition-all whitespace-nowrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5 shrink-0"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">Overview</span>
            </Link>
            <Link href="/owner/finance" className="flex items-center gap-3 px-3 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#111C33] hover:text-slate-900 dark:hover:text-white rounded-xl font-bold transition-all whitespace-nowrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5 shrink-0"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">Keuangan</span>
            </Link>
            <Link href="/owner/reports" className="flex items-center gap-3 px-3 py-3 bg-blue-50 dark:bg-[#111C33] text-[#2563EB] dark:text-sky-400 rounded-xl font-bold transition-all border border-blue-100 dark:border-sky-500/20 shadow-sm whitespace-nowrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5 shrink-0"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">Laporan Global</span>
            </Link>
          </nav>
          <div className="p-4 border-t border-slate-200 dark:border-slate-800/80">
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20 rounded-xl font-bold transition-all whitespace-nowrap">
              <Icons.Logout /> <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">Logout</span>
            </button>
          </div>
        </aside>

        <main className="flex-1 flex flex-col h-full overflow-hidden relative">
          <header className="h-20 bg-white/60 dark:bg-[#04060B]/60 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between px-6 lg:px-10 z-40 transition-colors">
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight">Laporan Global</h1>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">Riwayat transaksi dari seluruh cabang Anda</p>
            </div>
            <div className="flex items-center gap-3 md:gap-4">
              
              <div className="flex items-center gap-2">
                {period === 'daily' && (
                  <input type="date" value={dateStr} onChange={handleDateChange} className="bg-slate-100 dark:bg-[#111C33] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none" />
                )}
                {period === 'weekly' && (
                  <input type="week" value={dateStr} onChange={handleDateChange} className="bg-slate-100 dark:bg-[#111C33] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none" />
                )}
                {period === 'monthly' && (
                  <input type="month" value={dateStr} onChange={handleDateChange} className="bg-slate-100 dark:bg-[#111C33] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none" />
                )}
                
                <div className="hidden md:flex bg-slate-100 dark:bg-[#111C33] rounded-xl p-1 border border-slate-200 dark:border-slate-800">
                  <button onClick={() => { setPeriod('daily'); setDateStr(new Date().toLocaleDateString('en-CA')); fetchReports(userEmail, 'daily', new Date().toLocaleDateString('en-CA')); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${period === 'daily' ? 'bg-white dark:bg-[#1E293B] text-[#2563EB] dark:text-white shadow-sm' : 'text-slate-500'}`}>Harian</button>
                  <button onClick={() => { setPeriod('weekly'); setDateStr(new Date().toISOString().slice(0, 7)); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${period === 'weekly' ? 'bg-white dark:bg-[#1E293B] text-[#2563EB] dark:text-white shadow-sm' : 'text-slate-500'}`}>Mingguan</button>
                  <button onClick={() => { setPeriod('monthly'); setDateStr(new Date().toISOString().slice(0, 7)); fetchReports(userEmail, 'monthly', new Date().toISOString().slice(0, 7)); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${period === 'monthly' ? 'bg-white dark:bg-[#1E293B] text-[#2563EB] dark:text-white shadow-sm' : 'text-slate-500'}`}>Bulanan</button>
                </div>
              </div>

              <button onClick={handleExportCSV} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs md:text-sm flex items-center gap-2 shadow-lg transition-all">
                <Icons.Download /> Export CSV
              </button>
              <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2.5 rounded-xl bg-slate-100 dark:bg-[#0F172A] text-slate-600 dark:text-amber-400 border border-slate-200 dark:border-slate-800 shadow-sm">
                {isDarkMode ? <Icons.Sun /> : <Icons.Moon />}
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-6 lg:p-10 z-10 scroll-smooth">
            <div className="bg-white dark:bg-[#0A0F1C] border border-slate-200 dark:border-slate-800/80 rounded-3xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800/80 text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-[#060911]/50">
                      <th className="p-4 pl-6 font-black">Waktu</th>
                      <th className="p-4 font-black">Cabang</th>
                      <th className="p-4 font-black">Pelanggan</th>
                      <th className="p-4 font-black">Status</th>
                      <th className="p-4 pr-6 font-black text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {isLoading ? (
                      <tr><td colSpan="5" className="p-6 text-center text-slate-500 font-bold">Memuat laporan...</td></tr>
                    ) : reports.length === 0 ? (
                      <tr><td colSpan="5" className="p-6 text-center text-slate-500 font-bold">Tidak ada transaksi pada periode ini.</td></tr>
                    ) : reports.map(r => (
                      <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-[#111C33]/50 transition-colors">
                        <td className="p-4 pl-6 text-sm text-slate-500">{new Date(r.created_at).toLocaleString('id-ID')}</td>
                        <td className="p-4 font-bold text-sm text-slate-900 dark:text-white">{r.branchName}</td>
                        <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{r.customer_name || 'Walk-in'}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${r.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : r.status === 'cancelled' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>{r.status}</span>
                        </td>
                        <td className="p-4 pr-6 text-right font-black text-sm text-emerald-600 dark:text-emerald-400">{formatRp(r.total_price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}