'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Chart from 'chart.js/auto';
import { supabase } from '@/lib/supabase';

export default function OwnerDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModal, setEditModal] = useState({ open: false, branch: null });
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // State Data
  const [userEmail, setUserEmail] = useState('');
  const [period, setPeriod] = useState('daily'); // Default Harian
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Default Hari Ini
  
  const [branches, setBranches] = useState([]);
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState({ 
    totalRevenue: 0, totalTransactions: 0, activeBranches: 0, 
    chartData: [], labels: [], branchStats: {}, totalExpense: 0, netProfit: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [linkBranchName, setLinkBranchName] = useState('');
  const [linkBranchEmail, setLinkBranchEmail] = useState('');
  const [editName, setEditName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // UI State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [confirmModal, setConfirmModal] = useState({ open: false, title: '', message: '', isDanger: false, onConfirm: null, loading: false });

  // 1. Efek Tema
  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  // 2. Fetch Data (Termasuk Tanggal)
  const fetchAllData = async (email, currentPeriod = period, currentDate = selectedDate) => {
    try {
      const [tenantsRes, statsRes, actRes] = await Promise.all([
        supabase.from('tenants').select('*').eq('manager_email', email).order('created_at', { ascending: false }),
        fetch(`/api/owner/stats?manager_email=${encodeURIComponent(email)}&period=${currentPeriod}&selected_date=${currentDate}`),
        fetch(`/api/owner/recent-activity?manager_email=${encodeURIComponent(email)}`)
      ]);

      if (tenantsRes.data) setBranches(tenantsRes.data);

      if (statsRes.ok) {
        const statData = await statsRes.json();
        setStats({
          totalRevenue: statData.totalRevenue,
          totalTransactions: statData.totalTransactions,
          activeBranches: statData.activeBranches,
          chartData: statData.chartData,
          labels: statData.labels,
          branchStats: statData.branchStats || {},
          totalExpense: statData.totalExpense || 0,
          netProfit: statData.netProfit || 0
        });
      }

      if (actRes.ok) {
        const actData = await actRes.json();
        setActivities(actData);
      }

    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    const getSessionAndFetch = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = '/login';
        return;
      }
      const email = session.user.email;
      setUserEmail(email);
      
      await fetchAllData(email, period, selectedDate);
      setIsLoading(false);

      // Auto-refresh aktivitas & statistik (HANYA jika tanggal yg dipilih adalah hari ini)
      const todayStr = new Date().toISOString().split('T')[0];
      const interval = setInterval(async () => {
        if (selectedDate === todayStr) {
          const [statsRes, actRes] = await Promise.all([
            fetch(`/api/owner/stats?manager_email=${encodeURIComponent(email)}&period=${period}&selected_date=${selectedDate}`),
            fetch(`/api/owner/recent-activity?manager_email=${encodeURIComponent(email)}`)
          ]);
          if (statsRes.ok) {
            const statData = await statsRes.json();
            setStats(prev => ({ ...prev, ...statData }));
          }
          if (actRes.ok) setActivities(await actRes.json());
        } else {
           // Jika melihat masa lalu, cukup update aktivitasnya saja (opsional)
           const actRes = await fetch(`/api/owner/recent-activity?manager_email=${encodeURIComponent(email)}`);
           if (actRes.ok) setActivities(await actRes.json());
        }
      }, 10000);

      return () => clearInterval(interval);
    };

    getSessionAndFetch();
  }, [period, selectedDate]);

  // 3. Chart.js
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
        labels: stats.labels,
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
          y: { grid: { color: isDarkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(226, 232, 240, 0.5)', drawBorder: false, borderDash: [5, 5] }, ticks: { color: isDarkMode ? '#64748B' : '#94A3B8', font: { family: 'Inter', size: 11, weight: 'bold' }, callback: function(value) { return value + 'jt'; } } }
        }
      }
    });
    return () => { if (chartInstance.current) chartInstance.current.destroy(); };
  }, [isDarkMode, stats.chartData, stats.labels, isLoading]);

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    setIsLoading(true);
    fetchAllData(userEmail, newPeriod, selectedDate).finally(() => setIsLoading(false));
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    setIsLoading(true);
    fetchAllData(userEmail, period, newDate).finally(() => setIsLoading(false));
  };

  // 4. Submit Tambah Cabang Baru
  const handleCreateBranch = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/owner/create-branch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: linkBranchName,
          email: linkBranchEmail, 
          manager_email: userEmail 
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal membuat cabang');
      
      showToast(data.message || 'Kafe berhasil ditambahkan!', 'success');
      setIsModalOpen(false);
      setLinkBranchName('');
      setLinkBranchEmail('');
      fetchAllData(userEmail, period, selectedDate);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. Submit Edit Cabang
  const handleEditBranch = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/owner/manage-branch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenant_id: editModal.branch.id, action: 'edit', name: editName })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      showToast('Cabang berhasil diperbarui!', 'success');
      setEditModal({ open: false, branch: null });
      fetchAllData(userEmail, period, selectedDate);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 6. Toggle Suspend
  const handleToggleActive = (branch) => {
    setConfirmModal({
      open: true,
      title: branch.is_active ? 'Nonaktifkan Cabang' : 'Aktifkan Cabang',
      message: `Apakah Anda yakin ingin ${branch.is_active ? 'menonaktifkan' : 'mengaktifkan'} cabang ${branch.name}?`,
      isDanger: branch.is_active,
      loading: false,
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, loading: true }));
        try {
          const res = await fetch('/api/owner/manage-branch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tenant_id: branch.id, action: 'toggle_active' })
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error);
          
          showToast(data.message, 'success');
          setConfirmModal({ open: false, title: '', message: '', isDanger: false, onConfirm: null, loading: false });
          fetchAllData(userEmail, period, selectedDate);
        } catch (err) {
          showToast(err.message, 'error');
          setConfirmModal({ open: false, title: '', message: '', isDanger: false, onConfirm: null, loading: false });
        }
      }
    });
  };

  const formatRp = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  const timeAgo = (dateStr) => {
    const diff = Math.floor((new Date() - new Date(dateStr)) / 60000);
    if (diff < 1) return 'Baru saja';
    if (diff < 60) return `${diff} menit lalu`;
    return `${Math.floor(diff/60)} jam lalu`;
  };

  return (
    <div className="bg-slate-50 text-slate-800 dark:bg-[#04060B] dark:text-slate-200 min-h-screen overflow-hidden font-sans transition-colors duration-300">
      <div className="fixed top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-[#2563EB]/10 dark:bg-[#2563EB]/15 blur-[150px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-[#D97736]/10 dark:bg-[#D97736]/10 blur-[150px] pointer-events-none z-0"></div>

      <div className="flex h-screen relative z-10">
        {/* SIDEBAR */}
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
            <Link href="/owner" className="flex items-center gap-3 px-3 py-3 bg-blue-50 dark:bg-[#111C33] text-[#2563EB] dark:text-sky-400 rounded-xl font-bold transition-all border border-blue-100 dark:border-sky-500/20 shadow-sm whitespace-nowrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5 shrink-0"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">Overview</span>
            </Link>
            
            {/* 🔥 MENU KEUANGAN DITAMBAHKAN DI SINI 🔥 */}
            <Link href="/owner/finance" className="flex items-center gap-3 px-3 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#111C33] hover:text-slate-900 dark:hover:text-white rounded-xl font-bold transition-all whitespace-nowrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5 shrink-0"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">Keuangan</span>
            </Link>

            <Link href="/owner/reports" className="flex items-center gap-3 px-3 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#111C33] hover:text-slate-900 dark:hover:text-white rounded-xl font-bold transition-all whitespace-nowrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5 shrink-0"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">Laporan Global</span>
            </Link>
            <Link href="/owner/settings" className="flex items-center gap-3 px-3 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#111C33] hover:text-slate-900 dark:hover:text-white rounded-xl font-bold transition-all whitespace-nowrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5 shrink-0"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">Pengaturan</span>
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
              
              {/* 🔥 DATE PICKER & FILTER DITAMBAHKAN DI SINI 🔥 */}
              <div className="flex items-center gap-2">
                <input 
                  type="date" 
                  value={selectedDate} 
                  onChange={handleDateChange}
                  className="bg-slate-100 dark:bg-[#111C33] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none"
                />
                <div className="hidden md:flex bg-slate-100 dark:bg-[#111C33] rounded-xl p-1 border border-slate-200 dark:border-slate-800">
                  <button onClick={() => handlePeriodChange('daily')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${period === 'daily' ? 'bg-white dark:bg-[#1E293B] text-[#2563EB] dark:text-white shadow-sm' : 'text-slate-500'}`}>Harian</button>
                  <button onClick={() => handlePeriodChange('weekly')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${period === 'weekly' ? 'bg-white dark:bg-[#1E293B] text-[#2563EB] dark:text-white shadow-sm' : 'text-slate-500'}`}>Mingguan</button>
                  <button onClick={() => handlePeriodChange('monthly')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${period === 'monthly' ? 'bg-white dark:bg-[#1E293B] text-[#2563EB] dark:text-white shadow-sm' : 'text-slate-500'}`}>Bulanan</button>
                </div>
              </div>

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
                <h3 className="text-2xl font-black text-slate-900 dark:text-white font-display">{isLoading ? '...' : formatRp(stats.totalRevenue)}</h3>
              </div>
              <div className="bg-white dark:bg-[#0A0F1C] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm transition-all">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">Total Pengeluaran</p>
                <h3 className="text-2xl font-black text-rose-500 font-display">{isLoading ? '...' : formatRp(stats.totalExpense)}</h3>
              </div>
              
              {/* 🔥 KARTU LABA BERSIH 🔥 */}
              <div className="bg-white dark:bg-[#0A0F1C] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm transition-all">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">Laba Bersih (Net Profit)</p>
                <h3 className={`text-2xl font-black font-display ${stats.netProfit >= 0 ? 'text-emerald-500' : 'text-rose-600'}`}>
                  {isLoading ? '...' : formatRp(stats.netProfit)}
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

            {/* BENTO GRID (Chart & Live Activity) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2 bg-white dark:bg-[#0A0F1C] border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-sm">
                <h2 className="text-lg font-black text-slate-900 dark:text-white font-display tracking-tight mb-4">Tren Pendapatan</h2>
                <div className="w-full h-[280px] relative z-10">
                  <canvas ref={chartRef}></canvas>
                </div>
              </div>

              {/* LIVE ACTIVITY */}
              <div className="bg-white dark:bg-[#0A0F1C] border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm flex flex-col">
                <h2 className="text-lg font-black text-slate-900 dark:text-white font-display mb-4">Aktivitas Terbaru</h2>
                <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                  {activities.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center mt-10">Belum ada aktivitas.</p>
                  ) : activities.map((act, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">Pesanan Masuk</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{act.tenants?.name || 'Cabang'} • {formatRp(act.total_price)}</p>
                        <p className="text-[9px] font-bold text-slate-400 mt-1">{timeAgo(act.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
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
                      <th className="p-4 font-black">Pendapatan</th>
                      <th className="p-4 font-black">Transaksi</th>
                      <th className="p-4 font-black text-right pr-6">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {isLoading ? (
                      <tr><td colSpan="5" className="p-6 text-center text-slate-500 font-bold">Memuat data...</td></tr>
                    ) : branches.length === 0 ? (
                      <tr><td colSpan="5" className="p-6 text-center text-slate-500 font-bold">Belum ada cabang. Silakan tambahkan cabang baru.</td></tr>
                    ) : branches.map((branch) => {
                      const bStat = stats.branchStats[branch.id] || { revenue: 0, transactions: 0 };
                      return (
                        <tr key={branch.id} className="hover:bg-slate-50 dark:hover:bg-[#111C33]/50 transition-colors group">
                          <td className="p-4 pl-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 font-black text-xs">
                                {branch.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-bold text-sm text-slate-900 dark:text-white">{branch.name}</p>
                                <p className="text-[10px] text-slate-500">ID: {branch.id.split('-')[0]}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black border ${branch.is_active ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-500/20'}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${branch.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                              {branch.is_active ? 'Aktif' : 'Suspend'}
                            </span>
                          </td>
                          <td className="p-4">
                            <p className="font-black text-sm text-slate-900 dark:text-white">{formatRp(bStat.revenue)}</p>
                          </td>
                          <td className="p-4">
                            <p className="font-bold text-sm text-slate-600 dark:text-slate-300">{bStat.transactions}</p>
                          </td>
                          <td className="p-4 pr-6 text-right flex justify-end gap-2">
                            <button onClick={() => handleToggleActive(branch)} title={branch.is_active ? 'Suspend' : 'Aktifkan'} className={`p-2 rounded-lg border transition-all ${branch.is_active ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400' : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400'}`}>
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>
                            </button>
                            <button onClick={() => { setEditModal({ open: true, branch }); setEditName(branch.name); }} title="Edit" className="p-2 rounded-lg bg-slate-100 dark:bg-[#111C33] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            </button>
                            <button onClick={() => window.location.href = `/dashboard?tenant_id=${branch.id}`} className="bg-slate-100 dark:bg-[#111C33] hover:bg-[#2563EB] text-slate-700 dark:text-slate-300 hover:text-white px-3 py-2 rounded-lg text-xs font-bold transition-all border border-slate-200 dark:border-slate-700">
                              Buka Kasir
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* MODAL TAMBAH CABANG BARU */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-3xl shadow-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#2563EB]/10 dark:bg-[#2563EB]/20 rounded-full blur-[60px] pointer-events-none"></div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white font-display mb-2 relative z-10">Tambah Cabang Baru</h3>
            <p className="text-xs text-slate-500 mb-6 relative z-10">Sistem akan membuat akun kasir baru dan menghubungkannya ke dashboard Anda.</p>
            
            {errorMsg && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold rounded-xl relative z-10">{errorMsg}</div>
            )}

            <form onSubmit={handleCreateBranch} className="space-y-5 relative z-10">
              <div>
                <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Nama Kafe / Resto</label>
                <input type="text" value={linkBranchName} onChange={(e) => setLinkBranchName(e.target.value)} required placeholder="Contoh: Kopi Senja Bandung" className="w-full bg-slate-50 dark:bg-[#04060B] border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB]" />
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Email Login Kasir Baru</label>
                <input type="email" value={linkBranchEmail} onChange={(e) => setLinkBranchEmail(e.target.value)} required placeholder="kasir.bandung@gmail.com" className="w-full bg-slate-50 dark:bg-[#04060B] border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB]" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold py-3.5 rounded-xl">Batal</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-gradient-to-r from-[#1E4E8C] to-[#2563EB] text-white font-black py-3.5 rounded-xl">{isSubmitting ? '...' : 'Buat Cabang'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT CABANG */}
      {editModal.open && (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-3xl shadow-2xl p-8 relative overflow-hidden">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white font-display mb-6">Edit Cabang</h3>
            <form onSubmit={handleEditBranch} className="space-y-5 relative z-10">
              <div>
                <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Nama Cabang</label>
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required className="w-full bg-slate-50 dark:bg-[#04060B] border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB]" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditModal({ open: false, branch: null })} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold py-3.5 rounded-xl">Batal</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-gradient-to-r from-[#1E4E8C] to-[#2563EB] text-white font-black py-3.5 rounded-xl">{isSubmitting ? '...' : 'Simpan'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOM CONFIRM MODAL */}
      {confirmModal.open && (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-md z-[150] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 w-full max-w-sm rounded-3xl shadow-2xl p-6 relative overflow-hidden animate-in zoom-in-95 duration-200">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto ${confirmModal.isDanger ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6">
                {confirmModal.isDanger ? (
                  <>
                    <path d="M18.36 6.64a9 9 0 1 1-12.73 0"/>
                    <line x1="12" y1="2" x2="12" y2="12"/>
                  </>
                ) : (
                  <>
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </>
                )}
              </svg>
            </div>
            <h3 className="text-lg font-black text-center text-slate-900 dark:text-white mb-2">{confirmModal.title}</h3>
            <p className="text-sm text-center text-slate-500 dark:text-slate-400 mb-6">{confirmModal.message}</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmModal({ open: false, title: '', message: '', isDanger: false, onConfirm: null, loading: false })} disabled={confirmModal.loading} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50">Batal</button>
              <button onClick={confirmModal.onConfirm} disabled={confirmModal.loading} className={`flex-1 text-white font-black py-3 rounded-xl transition-all disabled:opacity-50 ${confirmModal.isDanger ? 'bg-rose-600 hover:bg-rose-500 shadow-[0_0_15px_rgba(225,29,72,0.4)]' : 'bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]'}`}>{confirmModal.loading ? 'Memproses...' : 'Ya, Lanjutkan'}</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-[200] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl ${toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${toast.type === 'success' ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
              {toast.type === 'success' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              )}
            </div>
            <p className="text-sm font-bold pr-4">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}