'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const Icons = {
  Sun: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  Moon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  Logout: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Download: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Printer: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  Overview: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="w-4 h-4 shrink-0"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
  Finance: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="w-4 h-4 shrink-0"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  Reports: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="w-4 h-4 shrink-0"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  Settings: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="w-4 h-4 shrink-0"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9"/></svg>,
  Wallet: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>,
  TrendUp: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  TrendDown: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>,
  Users: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Coffee: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
  Building: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>,
};

export default function OwnerReports() {
  const [userEmail, setUserEmail] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [period, setPeriod] = useState('monthly');
  const [dateStr, setDateStr] = useState(new Date().toISOString().slice(0, 7));
  const [selectedBranchId, setSelectedBranchId] = useState('all');

  const [reports, setReports] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [plData, setPlData] = useState({
    revenue: 0,
    dailyExpense: 0,
    monthlyExpense: 0,
    salaryExpense: 0,
    actualSalaryTx: 0,
    pendingBaseSalary: 0,
    totalExpense: 0,
    netProfit: 0,
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem('nexaflow_theme');
    if (savedTheme === 'dark') setIsDarkMode(true);
    else setIsDarkMode(false);
  }, []);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('nexaflow_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const fetchReports = async (email, currentPeriod, currentDate, branchId = selectedBranchId) => {
    setIsLoading(true);
    try {
      const { data: t } = await supabase.from('tenants').select('id, name').eq('manager_email', email);
      if (!t || t.length === 0) {
        setTenants([]);
        setReports([]);
        setPlData({
          revenue: 0,
          dailyExpense: 0,
          monthlyExpense: 0,
          salaryExpense: 0,
          actualSalaryTx: 0,
          pendingBaseSalary: 0,
          totalExpense: 0,
          netProfit: 0,
        });
        setIsLoading(false);
        return;
      }
      setTenants(t);

      const allTenantIds = t.map(x => x.id);
      const targetTenantIds = branchId && branchId !== 'all'
        ? allTenantIds.filter(id => id === branchId)
        : allTenantIds;

      let startDate = new Date();
      let endDate = new Date();

      if (currentPeriod === 'daily') {
        startDate = new Date(currentDate); startDate.setHours(0, 0, 0, 0);
        endDate = new Date(currentDate); endDate.setHours(23, 59, 59, 999);
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
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
      }

      const startStr = startDate.toISOString();
      const endStr = endDate.toISOString();
      const safeTargetIds = targetTenantIds.length > 0 ? targetTenantIds : ['00000000-0000-0000-0000-000000000000'];

      const [ordersRes, expensesRes, empTxRes, empRes] = await Promise.all([
        supabase.from('orders').select('id, tenant_id, customer_name, total_price, created_at, status, payment_status').in('tenant_id', safeTargetIds).gte('created_at', startStr).lte('created_at', endStr).order('created_at', { ascending: false }),
        supabase.from('expenses').select('id, tenant_id, category, amount, expense_date').in('tenant_id', safeTargetIds).gte('expense_date', startStr).lte('expense_date', endStr),
        supabase.from('employee_transactions').select('id, employee_id, tenant_id, type, amount, transaction_date').in('tenant_id', safeTargetIds).gte('transaction_date', startStr).lte('transaction_date', endStr),
        supabase.from('employees').select('id, tenant_id, name, base_salary, is_active').in('tenant_id', safeTargetIds),
      ]);

      const rawOrders = ordersRes.data || [];
      const validOrders = rawOrders.filter(o => o.status !== 'cancelled');
      const mappedOrders = validOrders.map(o => ({
        ...o,
        branchName: t.find(x => x.id === o.tenant_id)?.name || 'Cabang',
      }));
      setReports(mappedOrders);

      const exps = expensesRes.data || [];
      const empTx = empTxRes.data || [];
      const empList = empRes.data || [];

      const totalRevenue = validOrders.filter(o => o.payment_status === 'PAID' || o.status === 'completed').reduce((sum, o) => sum + Number(o.total_price), 0);

      const dailyExpense = exps
        .filter(e => e.category === 'Harian')
        .reduce((sum, e) => sum + Number(e.amount), 0);
      const monthlyExpense = exps
        .filter(e => e.category !== 'Harian')
        .reduce((sum, e) => sum + Number(e.amount), 0);

      const actualSalaryTx = empTx.reduce((sum, e) => sum + Number(e.amount), 0);

      let pendingBaseSalary = 0;
      if (currentPeriod === 'monthly') {
        const paidEmployeeIds = new Set(
          empTx.filter(tx => tx.type === 'Gaji').map(tx => tx.employee_id)
        );
        pendingBaseSalary = empList
          .filter(emp => emp.is_active && !paidEmployeeIds.has(emp.id))
          .reduce((sum, emp) => sum + Number(emp.base_salary || 0), 0);
      }

      const salaryExpense = actualSalaryTx + pendingBaseSalary;
      const totalExpense = dailyExpense + monthlyExpense + salaryExpense;
      const netProfit = totalRevenue - totalExpense;

      setPlData({
        revenue: totalRevenue,
        dailyExpense,
        monthlyExpense,
        salaryExpense,
        actualSalaryTx,
        pendingBaseSalary,
        totalExpense,
        netProfit,
      });
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
      fetchReports(session.user.email, period, dateStr, selectedBranchId);
    };
    getSession();
  }, []);

  const handlePeriodChange = (newPeriod) => {
    let newDate = dateStr;
    if (newPeriod === 'monthly') newDate = new Date().toISOString().slice(0, 7);
    if (newPeriod === 'daily') newDate = new Date().toLocaleDateString('en-CA');
    if (newPeriod === 'weekly') {
      const now = new Date();
      const onejan = new Date(now.getFullYear(), 0, 1);
      const week = Math.ceil((((now - onejan) / 86400000) + onejan.getDay() + 1) / 7);
      newDate = `${now.getFullYear()}-W${week.toString().padStart(2, '0')}`;
    }

    setPeriod(newPeriod);
    setDateStr(newDate);
    fetchReports(userEmail, newPeriod, newDate, selectedBranchId);
  };

  const handleDateChange = (e) => {
    setDateStr(e.target.value);
    fetchReports(userEmail, period, e.target.value, selectedBranchId);
  };

  const handleBranchChange = (e) => {
    const nextBranch = e.target.value;
    setSelectedBranchId(nextBranch);
    fetchReports(userEmail, period, dateStr, nextBranch);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const selectedBranchLabel = useMemo(() => {
    if (selectedBranchId === 'all') return 'Semua Cabang';
    return tenants.find(t => t.id === selectedBranchId)?.name || 'Cabang';
  }, [tenants, selectedBranchId]);

  const handleExportCSV = () => {
    let csv = `\uFEFFLaporan Laba Rugi (P&L) NexaFlow\nManager: ${userEmail}\nCabang: ${selectedBranchLabel}\nPeriode: ${period} (${dateStr})\nTanggal Unduh: ${new Date().toLocaleDateString('id-ID')}\n\n`;

    csv += `RINGKASAN KEUANGAN\n`;
    csv += `Pendapatan Kotor,"${plData.revenue}"\n`;
    csv += `Pengeluaran Harian,"${plData.dailyExpense}"\n`;
    csv += `Biaya Bulanan & Operasional,"${plData.monthlyExpense}"\n`;
    csv += `Gaji Karyawan (Total),"${plData.salaryExpense}"\n`;
    if (period === 'monthly' && plData.pendingBaseSalary > 0) {
      csv += `Gaji Aktual Tercatat,"${plData.actualSalaryTx}"\n`;
      csv += `Estimasi Gaji Pokok Belum Dibayar,"${plData.pendingBaseSalary}"\n`;
    }
    csv += `Total Pengeluaran,"${plData.totalExpense}"\n`;
    csv += `Laba Bersih,"${plData.netProfit}"\n\n`;

    csv += `RIWAYAT TRANSAKSI\n`;
    csv += `Waktu,Cabang,Pelanggan,Status,Total\n`;
    reports.forEach(r => {
      csv += `"${new Date(r.created_at).toLocaleString('id-ID')}","${r.branchName}","${r.customer_name || 'Walk-in'}","${r.status}","${r.total_price}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const slugBranch = selectedBranchLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    a.download = `Laporan_PL_${slugBranch}_${dateStr}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatRp = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num || 0);

  return (
    <div className="bg-[#F4EFE9] text-[#1A1512] dark:bg-[#0a192f] dark:text-white min-h-screen font-sans">
      <style>{`
        .owner-card { box-shadow: 0 2px 8px rgba(26, 21, 18, 0.06); }
        .dark .owner-card { box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35); }
        .owner-num { font-variant-numeric: tabular-nums; letter-spacing: -0.02em; }

        @media print {
          @page { margin: 1cm; size: A4 portrait; }
          body { background: white !important; color: black !important; }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          .owner-card { box-shadow: none !important; border: 1px solid #ccc !important; background: white !important; }
          .text-white { color: black !important; }
        }
      `}</style>

      <div className="flex min-h-screen">
        {/* SIDEBAR SELARAS KASIR */}
        <aside className="no-print hidden lg:flex lg:w-60 bg-[#2A1F17] text-white dark:bg-slate-900 border-r-2 border-[#1A1512] dark:border-slate-700 flex-col justify-between p-5 shrink-0 h-screen sticky top-0">
          <div className="space-y-8">
            <div className="flex items-center gap-3 px-1">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0 p-1 shadow-sm">
                <img src="/logo-nexaflow-3d.png" alt="NF" className="w-full h-full object-contain" />
              </div>
              <div>
                <p className="text-base font-black tracking-tight text-white leading-none">NEXAFLOW</p>
                <p className="text-[11px] font-extrabold text-amber-400 tracking-wider uppercase mt-1">Owner Panel</p>
              </div>
            </div>

            <nav className="space-y-1.5">
              <Link href="/owner" className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[#D3C8BB] dark:text-slate-300 hover:bg-white/10 hover:text-white text-xs font-bold transition-colors">
                <Icons.Overview />
                <span>Command Center AI</span>
              </Link>
              <Link href="/owner/finance" className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[#D3C8BB] dark:text-slate-300 hover:bg-white/10 hover:text-white text-xs font-bold transition-colors">
                <Icons.Finance />
                <span>Keuangan & Stok</span>
              </Link>
              <Link href="/owner/reports" className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-black border border-blue-400/40">
                <Icons.Reports />
                <span>Laporan Global P&L</span>
              </Link>
              <Link href="/owner/settings" className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[#D3C8BB] dark:text-slate-300 hover:bg-white/10 hover:text-white text-xs font-bold transition-colors">
                <Icons.Settings />
                <span>Pengaturan & AI Key</span>
              </Link>
            </nav>
          </div>

          <div className="pt-4 border-t border-white/15 space-y-3">
            <div className="px-1">
              <p className="text-xs font-black text-white truncate">{userEmail || 'Owner'}</p>
              <p className="text-[11px] font-bold text-[#D3C8BB] dark:text-slate-400 mt-0.5">{tenants.length} Cabang Terdaftar</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black transition-colors"
            >
              <Icons.Logout />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* AREA KONTEN UTAMA */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* NAVIGASI MOBILE */}
          <div className="no-print lg:hidden bg-[#2A1F17] dark:bg-slate-900 border-b-2 border-[#1A1512] dark:border-slate-700 px-4 py-2.5 flex items-center justify-between gap-2 overflow-x-auto">
            <div className="flex items-center gap-1.5">
              <Link href="/owner" className="px-3 py-1.5 rounded-lg text-[#D3C8BB] text-xs font-bold whitespace-nowrap">Overview</Link>
              <Link href="/owner/finance" className="px-3 py-1.5 rounded-lg text-[#D3C8BB] text-xs font-bold whitespace-nowrap">Keuangan</Link>
              <Link href="/owner/reports" className="px-3 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-black whitespace-nowrap">Laporan</Link>
              <Link href="/owner/settings" className="px-3 py-1.5 rounded-lg text-[#D3C8BB] text-xs font-bold whitespace-nowrap">Pengaturan</Link>
            </div>
            <button type="button" onClick={() => setIsDarkMode(!isDarkMode)} className="p-1.5 rounded-lg bg-white/10 text-amber-300 shrink-0">
              {isDarkMode ? <Icons.Sun /> : <Icons.Moon />}
            </button>
          </div>

          {/* HEADER */}
          <header className="no-print bg-white dark:bg-slate-900 border-b-2 border-[#E0D6CC] dark:border-slate-700 px-5 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-30">
            <div>
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-[#1A1512] dark:text-white">Laporan Laba Rugi (P&L)</h1>
              <p className="text-xs font-bold text-[#5C4B3E] dark:text-slate-300 mt-0.5">
                Analisis pendapatan dan pengeluaran · {selectedBranchLabel}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedBranchId}
                onChange={handleBranchChange}
                className="bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 rounded-xl px-3 py-2 text-xs font-extrabold text-[#1A1512] dark:text-white outline-none max-w-[200px]"
              >
                <option value="all">Semua Cabang</option>
                {tenants.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>

              <div className="flex items-center gap-2">
                {period === 'daily' && (
                  <input type="date" value={dateStr} onChange={handleDateChange} className="bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 rounded-xl px-3 py-2 text-xs font-extrabold text-[#1A1512] dark:text-white outline-none" />
                )}
                {period === 'weekly' && (
                  <input type="week" value={dateStr} onChange={handleDateChange} className="bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 rounded-xl px-3 py-2 text-xs font-extrabold text-[#1A1512] dark:text-white outline-none" />
                )}
                {period === 'monthly' && (
                  <input type="month" value={dateStr} onChange={handleDateChange} className="bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 rounded-xl px-3 py-2 text-xs font-extrabold text-[#1A1512] dark:text-white outline-none" />
                )}

                <div className="hidden md:flex bg-[#FAF6F2] dark:bg-slate-800 rounded-xl p-1 border-2 border-[#E0D6CC] dark:border-slate-600">
                  <button onClick={() => handlePeriodChange('daily')} className={`px-3 py-1 rounded-lg text-xs font-black ${period === 'daily' ? 'bg-[#2A1F17] text-white dark:bg-[#2563EB]' : 'text-[#5C4B3E] dark:text-slate-300'}`}>Harian</button>
                  <button onClick={() => handlePeriodChange('weekly')} className={`px-3 py-1 rounded-lg text-xs font-black ${period === 'weekly' ? 'bg-[#2A1F17] text-white dark:bg-[#2563EB]' : 'text-[#5C4B3E] dark:text-slate-300'}`}>Mingguan</button>
                  <button onClick={() => handlePeriodChange('monthly')} className={`px-3 py-1 rounded-lg text-xs font-black ${period === 'monthly' ? 'bg-[#2A1F17] text-white dark:bg-[#2563EB]' : 'text-[#5C4B3E] dark:text-slate-300'}`}>Bulanan</button>
                </div>
              </div>

              <button onClick={handleExportCSV} className="bg-[#FAF6F2] hover:bg-[#EFEAE2] dark:bg-slate-800 dark:hover:bg-slate-700 text-[#1A1512] dark:text-white font-black px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 border-2 border-[#E0D6CC] dark:border-slate-600">
                <Icons.Download /> CSV
              </button>
              <button onClick={() => window.print()} className="bg-[#2563EB] hover:bg-blue-700 text-white font-black px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 border-2 border-blue-700">
                <Icons.Printer /> Cetak PDF
              </button>

              <button onClick={() => setIsDarkMode(!isDarkMode)} className="hidden lg:inline-flex p-2 rounded-xl bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 text-[#1A1512] dark:text-amber-400">
                {isDarkMode ? <Icons.Sun /> : <Icons.Moon />}
              </button>
            </div>
          </header>

          <main className="p-5 sm:p-8 max-w-6xl w-full mx-auto space-y-6 print-container">
            {/* PRINT HEADER */}
            <div className="hidden print-only mb-8 text-center border-b-2 border-black pb-4">
              <h1 className="text-2xl font-black text-black">LAPORAN LABA RUGI</h1>
              <p className="text-sm font-bold text-black mt-1">Cabang: {selectedBranchLabel} · Periode: {period.toUpperCase()} ({dateStr})</p>
              <p className="text-xs text-black mt-1">Dicetak pada: {new Date().toLocaleString('id-ID')}</p>
            </div>

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="owner-card bg-white dark:bg-slate-900 border-2 border-[#E0D6CC] dark:border-slate-700 p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-black text-[#5C4B3E] dark:text-slate-300 uppercase tracking-wider">Pendapatan Kotor</p>
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                    <Icons.TrendUp />
                  </div>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#1A1512] dark:text-white owner-num">{formatRp(plData.revenue)}</h3>
                <p className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 mt-2">Dari {reports.length} transaksi lunas</p>
              </div>

              <div className="owner-card bg-white dark:bg-slate-900 border-2 border-[#E0D6CC] dark:border-slate-700 p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-black text-[#5C4B3E] dark:text-slate-300 uppercase tracking-wider">Total Pengeluaran</p>
                  <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center text-rose-700 dark:text-rose-400">
                    <Icons.TrendDown />
                  </div>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 owner-num">{formatRp(plData.totalExpense)}</h3>
                <p className="text-xs font-extrabold text-[#5C4B3E] dark:text-slate-300 mt-2">Harian + Bulanan + Gaji</p>
              </div>

              <div className="owner-card bg-[#2A1F17] dark:bg-slate-900 border-2 border-[#1A1512] dark:border-blue-500/60 p-6 rounded-2xl text-white">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-black text-[#D3C8BB] dark:text-slate-300 uppercase tracking-wider">Laba Bersih</p>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${plData.netProfit >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                    <Icons.Wallet />
                  </div>
                </div>
                <h3 className={`text-2xl sm:text-3xl font-black owner-num ${plData.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {formatRp(plData.netProfit)}
                </h3>
                <p className="text-xs font-extrabold text-[#D3C8BB] dark:text-slate-300 mt-2">
                  Margin: {plData.revenue > 0 ? ((plData.netProfit / plData.revenue) * 100).toFixed(1) : 0}%
                </p>
              </div>
            </div>

            {/* BREAKDOWN PENGELUARAN */}
            <div>
              <h3 className="text-base font-black text-[#1A1512] dark:text-white mb-4">Rincian Pengeluaran</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="owner-card bg-white dark:bg-slate-900 border-2 border-[#E0D6CC] dark:border-slate-700 p-5 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-sky-500/20 flex items-center justify-center text-blue-700 dark:text-sky-400 shrink-0">
                    <Icons.Coffee />
                  </div>
                  <div>
                    <p className="text-xs font-black text-[#5C4B3E] dark:text-slate-300">Operasional Harian</p>
                    <p className="text-lg font-black text-[#1A1512] dark:text-white owner-num mt-1">{formatRp(plData.dailyExpense)}</p>
                  </div>
                </div>

                <div className="owner-card bg-white dark:bg-slate-900 border-2 border-[#E0D6CC] dark:border-slate-700 p-5 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0">
                    <Icons.Building />
                  </div>
                  <div>
                    <p className="text-xs font-black text-[#5C4B3E] dark:text-slate-300">Biaya Bulanan & Lainnya</p>
                    <p className="text-lg font-black text-[#1A1512] dark:text-white owner-num mt-1">{formatRp(plData.monthlyExpense)}</p>
                  </div>
                </div>

                <div className="owner-card bg-white dark:bg-slate-900 border-2 border-[#E0D6CC] dark:border-slate-700 p-5 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center text-purple-700 dark:text-purple-400 shrink-0">
                    <Icons.Users />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-[#5C4B3E] dark:text-slate-300">Gaji Karyawan</p>
                    <p className="text-lg font-black text-[#1A1512] dark:text-white owner-num mt-1">{formatRp(plData.salaryExpense)}</p>
                    {period === 'monthly' && plData.pendingBaseSalary > 0 && (
                      <p className="text-[11px] font-bold text-[#5C4B3E] dark:text-slate-400 mt-1 owner-num">
                        Aktual: {formatRp(plData.actualSalaryTx)} + Est. Pokok: {formatRp(plData.pendingBaseSalary)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* TABLE RIWAYAT TRANSAKSI */}
            <div>
              <h3 className="text-base font-black text-[#1A1512] dark:text-white mb-4">Riwayat Transaksi Pendapatan</h3>
              <div className="owner-card bg-white dark:bg-slate-900 border-2 border-[#E0D6CC] dark:border-slate-700 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-[#E0D6CC] dark:border-slate-700 text-xs font-black uppercase tracking-wider text-[#5C4B3E] dark:text-slate-300 bg-[#FAF6F2] dark:bg-slate-800/50">
                        <th className="p-4 pl-6">Waktu</th>
                        <th className="p-4">Cabang</th>
                        <th className="p-4">Pelanggan</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 pr-6 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-[#F4EFE9] dark:divide-slate-800">
                      {isLoading ? (
                        <tr><td colSpan="5" className="p-6 text-center text-[#5C4B3E] dark:text-slate-300 font-black">Memuat laporan...</td></tr>
                      ) : reports.length === 0 ? (
                        <tr><td colSpan="5" className="p-6 text-center text-[#5C4B3E] dark:text-slate-300 font-black">Tidak ada transaksi pada periode ini.</td></tr>
                      ) : reports.map(r => (
                        <tr key={r.id} className="hover:bg-[#FAF6F2] dark:hover:bg-slate-800/50">
                          <td className="p-4 pl-6 text-xs font-bold text-[#5C4B3E] dark:text-slate-300">
                            {new Date(r.created_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="p-4 font-black text-xs text-[#1A1512] dark:text-white">{r.branchName}</td>
                          <td className="p-4 text-xs font-bold text-[#1A1512] dark:text-slate-200">{r.customer_name || 'Walk-in'}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider ${
                              r.status === 'completed'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300'
                                : r.status === 'cancelled'
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300'
                                : 'bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-300'
                            }`}>
                              {r.status}
                            </span>
                          </td>
                          <td className="p-4 pr-6 text-right font-black text-sm text-emerald-700 dark:text-emerald-400 owner-num">
                            {formatRp(r.total_price)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* PRINT FOOTER */}
            <div className="hidden print-only mt-12 pt-8 border-t border-gray-300 flex justify-between text-black">
              <div>
                <p className="text-sm">Dibuat oleh,</p>
                <div className="mt-16 border-t border-black w-48 text-center pt-2 text-sm">Owner / Manager</div>
              </div>
              <div className="text-right">
                <p className="text-sm">Total Laba Bersih:</p>
                <p className="text-xl font-black mt-1">{formatRp(plData.netProfit)}</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}