'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Chart from 'chart.js/auto';
import { supabase } from '@/lib/supabase';

export default function OwnerDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // State Data
  const [branches, setBranches] = useState([]);
  const [stats, setStats] = useState({ totalRevenue: 0, totalTransactions: 0, activeBranches: 0, chartData: [0,0,0,0,0,0,0] });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchEmail, setNewBranchEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Efek Tema
  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  // 2. Ambil Data Cabang & Statistik
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Ambil data cabang
      const { data: tenants } = await supabase.from('tenants').select('*').order('created_at', { ascending: false });
      if (tenants) setBranches(tenants);

      // Ambil data statistik dari API kita
      const res = await fetch('/api/owner/stats');
      const statData = await res.json();
      if (res.ok) {
        setStats({
          totalRevenue: statData.totalRevenue,
          totalTransactions: statData.totalTransactions,
          activeBranches: statData.activeBranches,
          chartData: statData.chartData
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 3. Efek Chart.js
  useEffect(() => {
    if (!chartRef.current || isLoading) return;
    const ctx = chartRef.current.getContext('2d');
    
    let gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, isDarkMode ? 'rgba(37, 99, 235, 0.4)' : 'rgba(37, 99, 235, 0.2)');
    gradient.addColorStop(1, 'rgba(37, 99, 235, 0)');

    if (chartInstance.current) chartInstance.current.destroy();

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
        datasets: [{
          label: 'Pendapatan (Juta)',
          data: stats.chartData,
          borderColor: '#2563EB',
          backgroundColor: gradient,
          borderWidth: 3,
          pointBackgroundColor: isDarkMode ? '#0A0F1C' : '#FFFFFF',
          pointBorderColor: '#2563EB',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false, drawBorder: false }, ticks: { color: isDarkMode ? '#64748B' : '#94A3B8', font: { family: 'Inter', size: 11, weight: 'bold' } } },
          y: { grid: { color: isDarkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(226, 232, 240, 0.5)', drawBorder: false, borderDash: [5, 5] }, ticks: { color: isDarkMode ? '#64748B' : '#94A3B8', font: { family: 'Inter', size: 11, weight: 'bold' }, stepSize: 10, callback: function(value) { return value + 'jt'; } } }
        }
      }
    });
    return () => { if (chartInstance.current) chartInstance.current.destroy(); };
  }, [isDarkMode, stats.chartData, isLoading]);

  // 4. Submit Tambah Cabang
  const handleCreateBranch = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/owner/create-branch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newBranchName, email: newBranchEmail })
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Gagal membuat cabang');
      
      alert('Cabang berhasil ditambahkan!');
      setIsModalOpen(false);
      setNewBranchName('');
      setNewBranchEmail('');
      fetchData(); // Refresh tabel dan statistik

    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fungsi Format Rupiah
  const formatRp = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  return (
    <div className="bg-slate-50 text-slate-800 dark:bg-[#04060B] dark:text-slate-200 min-h-screen overflow-hidden font-sans transition-colors duration-300">
      <div className="fixed top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-[#2563EB]/10 dark:bg-[#2563EB]/15 blur-[150px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-[#D97736]/10 dark:bg-[#D97736]/10 blur-[150px] pointer-events-none z-0"></div>

      <div className="flex h-screen relative z-10">
        {/* SIDEBAR */}
        <aside className="group w-[80px] hover:w-64 transition-all duration-300 ease-in-out bg-white/70 dark:bg-[#060911]/80 backdrop-blur-2xl border-r border-slate-200 dark:border-slate-800/80 flex flex-col z-50 h-full shrink-0">
          <div className="h-20 flex items-center px-6 border-b border-slate-200 dark:border-slate-800/80 overflow-hidden shrink-0">
            <div className="w-8 h-8 bg-gradient-to-tr from-[#2563EB] to-[#EA8B42] rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-4 h-4"><path d="M12 2L2 7l10 5 10-5-10-5z"/></svg>
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
            <Link href="/owner" className="flex items-center gap-3 px-3 py-3 bg-blue-50 dark:bg-[#111C33] text-[#2563EB] dark:text-sky-400 rounded-xl font-bold transition-all border border-blue-100 dark:border-sky-500/20 shadow-sm whitespace-nowrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5 shrink-0"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">Overview</span>
            </Link>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 flex flex-col h-full overflow-hidden relative">
          <header className="h-20 bg-white/60 dark:bg-[#04060B]/60 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between px-6 lg:px-10 z-40 transition-colors">
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight">Command Center</h1>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">Pantau seluruh ekosistem NexaFlow Anda</p>
            </div>
            <div className="flex items-center gap-3 md:gap-4">
              <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2.5 rounded-xl bg-slate-100 dark:bg-[#0F172A] text-slate-600 dark:text-amber-400 hover:bg-slate-200 transition-colors border border-slate-200 dark:border-slate-800 shadow-sm">
                {isDarkMode ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                )}
              </button>
              <button onClick={() => setIsModalOpen(true)} className="bg-gradient-to-r from-[#1E4E8C] to-[#2563EB] hover:from-[#2563EB] hover:to-[#3B82F6] text-white font-bold px-4 py-2.5 rounded-xl text-xs md:text-sm flex items-center gap-2 shadow-[0_8px_24px_-6px_rgba(37,99,235,0.5)] transition-all transform hover:-translate-y-0.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5 text-amber-300"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                <span className="hidden sm:inline">Tambah Cabang</span>
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-6 lg:p-10 z-10 scroll-smooth">
            {/* STATS ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white dark:bg-[#0A0F1C] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm transition-all relative">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">Total Pendapatan</p>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white font-display">
                  {isLoading ? '...' : formatRp(stats.totalRevenue)}
                </h3>
              </div>
              <div className="bg-white dark:bg-[#0A0F1C] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm transition-all">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">Total Transaksi</p>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white font-display">
                  {isLoading ? '...' : stats.totalTransactions}
                </h3>
              </div>
              <div className="bg-white dark:bg-[#0A0F1C] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm transition-all">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">Cabang Aktif</p>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white font-display">
                  {isLoading ? '...' : `${stats.activeBranches} / ${branches.length}`}
                </h3>
              </div>
              <div className="bg-gradient-to-br from-[#0F172A] to-[#04060B] border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
                <div className="flex justify-between items-start mb-2 relative z-10">
                  <p className="text-xs font-bold text-slate-400">Status Sistem</p>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mt-1"></span>
                </div>
                <h3 className="text-2xl font-black text-white font-display relative z-10">Normal</h3>
              </div>
            </div>

            {/* Chart Area */}
            <div className="bg-white dark:bg-[#0A0F1C] border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-sm mb-6">
              <h2 className="text-lg font-black text-slate-900 dark:text-white font-display tracking-tight mb-4">Tren Pendapatan (7 Hari Terakhir)</h2>
              <div className="w-full h-[280px] relative z-10">
                <canvas ref={chartRef}></canvas>
              </div>
            </div>

            {/* TABEL CABANG */}
            <div className="bg-white dark:bg-[#0A0F1C] border border-slate-200 dark:border-slate-800/80 rounded-3xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-slate-800/80 flex justify-between items-center bg-slate-50/50 dark:bg-[#0A0F1C]">
                <h3 className="text-lg font-black text-slate-900 dark:text-white font-display">Daftar Cabang Anda</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800/80 text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-[#060911]/50">
                      <th className="p-4 pl-6 font-black">Nama Cabang</th>
                      <th className="p-4 font-black">Status</th>
                      <th className="p-4 font-black text-right pr-6">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {isLoading ? (
                      <tr><td colSpan="3" className="p-6 text-center text-slate-500 font-bold">Memuat data cabang...</td></tr>
                    ) : branches.length === 0 ? (
                      <tr><td colSpan="3" className="p-6 text-center text-slate-500 font-bold">Belum ada cabang. Silakan tambah cabang baru.</td></tr>
                    ) : branches.map((branch) => (
                      <tr key={branch.id} className="hover:bg-slate-50 dark:hover:bg-[#111C33]/50 transition-colors group">
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 font-black text-xs">
                              {branch.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-sm text-slate-900 dark:text-white">{branch.name}</p>
                              <p className="text-[10px] text-slate-500">ID: {branch.id.split('-')[0]}...</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black border ${branch.is_active ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-500/20'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${branch.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                            {branch.is_active ? 'Aktif' : 'Nonaktif'}
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <button 
                            onClick={() => {
                              // Simpan tenant ID ke localStorage lalu arahkan ke dashboard kasir
                              localStorage.setItem('nexaflow_owner_active_tenant', branch.id);
                              window.location.href = '/dashboard';
                            }} 
                            className="bg-slate-100 dark:bg-[#111C33] hover:bg-[#2563EB] dark:hover:bg-[#2563EB] text-slate-700 dark:text-slate-300 hover:text-white px-4 py-2 rounded-lg text-xs font-bold transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
                          >
                            Buka Kasir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* MODAL TAMBAH CABANG */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-3xl shadow-2xl p-8 relative overflow-hidden">
            <div className="flex justify-between items-center mb-6 relative z-10">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white font-display">Tambah Cabang Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 dark:bg-slate-800 p-2 rounded-xl transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold rounded-xl">{errorMsg}</div>
            )}

            <form onSubmit={handleCreateBranch} className="space-y-5 relative z-10">
              <div>
                <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Nama Cabang</label>
                <input type="text" value={newBranchName} onChange={(e) => setNewBranchName(e.target.value)} required placeholder="Contoh: NexaFlow Surabaya" className="w-full bg-slate-50 dark:bg-[#04060B] border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all" />
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Email Login Cabang</label>
                <input type="email" value={newBranchEmail} onChange={(e) => setNewBranchEmail(e.target.value)} required placeholder="kasir.surabaya@gmail.com" className="w-full bg-slate-50 dark:bg-[#04060B] border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold py-3.5 rounded-xl hover:bg-slate-200 transition-colors">Batal</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-gradient-to-r from-[#1E4E8C] to-[#2563EB] text-white font-black py-3.5 rounded-xl transition-all shadow-lg disabled:opacity-50">
                  {isSubmitting ? 'Memproses...' : 'Buat Cabang'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}