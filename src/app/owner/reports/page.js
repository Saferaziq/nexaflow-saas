'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const Icons = {
  Sun: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  Moon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  Logout: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Download: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Printer: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  Settings: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Wallet: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>,
  TrendUp: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  TrendDown: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>,
  Users: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Coffee: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
  Building: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
};

export default function OwnerReports() {
  const [userEmail, setUserEmail] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [period, setPeriod] = useState('monthly');
  const [dateStr, setDateStr] = useState(new Date().toISOString().slice(0, 7));

  const [reports, setReports] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State untuk Laba Rugi
  const [plData, setPlData] = useState({
    revenue: 0,
    dailyExpense: 0,
    monthlyExpense: 0,
    salaryExpense: 0,
    actualSalaryTx: 0,
    pendingBaseSalary: 0,
    totalExpense: 0,
    netProfit: 0
  });

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const fetchReports = async (email, currentPeriod, currentDate) => {
    setIsLoading(true);
    try {
      // 1. Ambil Data Cabang
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
          netProfit: 0
        });
        setIsLoading(false);
        return;
      }
      setTenants(t);

      const tenantIds = t.map(x => x.id);

      // 2. Tentukan Rentang Tanggal
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

      // 3. Fetch Data (Orders, Expenses, Employee Transactions, Employees)
      const [ordersRes, expensesRes, empTxRes, empRes] = await Promise.all([
        supabase.from('orders').select('id, tenant_id, customer_name, total_price, created_at, status, payment_status').in('tenant_id', tenantIds).gte('created_at', startStr).lte('created_at', endStr).order('created_at', { ascending: false }),
        supabase.from('expenses').select('id, tenant_id, category, amount, expense_date').in('tenant_id', tenantIds).gte('expense_date', startStr).lte('expense_date', endStr),
        supabase.from('employee_transactions').select('id, employee_id, tenant_id, type, amount, transaction_date').in('tenant_id', tenantIds).gte('transaction_date', startStr).lte('transaction_date', endStr),
        supabase.from('employees').select('id, tenant_id, name, base_salary, is_active').in('tenant_id', tenantIds)
      ]);

      // 4. Proses Data Pesanan
      const rawOrders = ordersRes.data || [];
      const validOrders = rawOrders.filter(o => o.status !== 'cancelled');
      const mappedOrders = validOrders.map(o => ({
        ...o,
        branchName: t.find(x => x.id === o.tenant_id)?.name || 'Cabang'
      }));
      setReports(mappedOrders);

      // 5. Proses Kalkulasi Laba Rugi (P&L)
      const exps = expensesRes.data || [];
      const empTx = empTxRes.data || [];
      const empList = empRes.data || [];

      const totalRevenue = validOrders.filter(o => o.payment_status === 'PAID' || o.status === 'completed').reduce((sum, o) => sum + Number(o.total_price), 0);

      const dailyExpense = exps.filter(e => e.category === 'Harian').reduce((sum, e) => sum + Number(e.amount), 0);
      const monthlyExpense = exps.filter(e => e.category === 'Bulanan' || e.category === 'Operasional').reduce((sum, e) => sum + Number(e.amount), 0);

      // Transaksi Gaji/Kasbon/Bonus Aktual
      const actualSalaryTx = empTx.reduce((sum, e) => sum + Number(e.amount), 0);

      // Opsi 2: Untuk mode bulanan, hitung gaji pokok karyawan aktif yang belum menerima transaksi 'Gaji' bulan ini (anti double-counting)
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
        netProfit
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
      fetchReports(session.user.email, period, dateStr);
    };
    getSession();
  }, []);

  const handlePeriodChange = (newPeriod) => {
    let newDate = dateStr;
    if (newPeriod === 'monthly') newDate = new Date().toISOString().slice(0, 7);
    if (newPeriod === 'daily') newDate = new Date().toLocaleDateString('en-CA');

    setPeriod(newPeriod);
    setDateStr(newDate);
    fetchReports(userEmail, newPeriod, newDate);
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
    let csv = `Laporan Laba Rugi (P&L) NexaFlow\nManager: ${userEmail}\nPeriode: ${period} (${dateStr})\nTanggal Unduh: ${new Date().toLocaleDateString('id-ID')}\n\n`;

    csv += `RINGKASAN KEUANGAN\n`;
    csv += `Pendapatan Kotor,"${plData.revenue}"\n`;
    csv += `Pengeluaran Harian,"${plData.dailyExpense}"\n`;
    csv += `Biaya Bulanan,"${plData.monthlyExpense}"\n`;
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
    a.download = `Laporan_PL_${dateStr}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatRp = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num || 0);

  return (
    <div className="bg-[#F8FAFC] text-slate-800 dark:bg-[#04060B] dark:text-slate-200 min-h-screen overflow-hidden font-sans transition-colors duration-300">
      <style>{`
        .owner-3d { box-shadow: 0 1px 2px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.04), 0 8px 20px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.7); }
        .dark .owner-3d { box-shadow: 0 1px 2px rgba(0,0,0,0.30), 0 2px 6px rgba(0,0,0,0.20), 0 8px 20px rgba(0,0,0,0.25), 0 20px 40px -12px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.30); }
        .owner-3d-hover { transition: transform 220ms cubic-bezier(.2,.8,.2,1), box-shadow 220ms ease; }
        .owner-3d-hover:hover { transform: translateY(-2px); }
        .owner-num { font-variant-numeric: tabular-nums; letter-spacing: -0.02em; }
        .owner-row { transition: background-color 150ms ease; }
        .owner-row:hover { background-color: rgba(17, 28, 51, 0.04); }
        .dark .owner-row:hover { background-color: rgba(17, 28, 51, 0.55); }

        /* Print Styles */
        @media print {
          @page { margin: 1cm; size: A4 portrait; }
          body { background: white !important; color: black !important; }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          .owner-3d { box-shadow: none !important; border: 1px solid #ccc !important; background: white !important; }
          .h-screen { height: auto !important; overflow: visible !important; }
          main { overflow: visible !important; height: auto !important; padding: 0 !important; }
          .flex-1.overflow-y-auto { overflow: visible !important; }
          .text-white { color: black !important; }
        }
      `}</style>

      <div className="fixed top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-[#2563EB]/10 dark:bg-[#2563EB]/15 blur-[150px] pointer-events-none z-0 no-print"></div>

      <div className="flex h-screen relative z-10">

        {/* SIDEBAR (Hidden on Print) */}
        <aside className="no-print group w-[80px] hover:w-64 transition-all duration-300 ease-in-out bg-white/70 dark:bg-[#060911]/80 backdrop-blur-2xl border-r border-slate-200 dark:border-slate-800/80 flex flex-col z-50 h-full shrink-0">
          <div className="h-20 flex items-center px-6 border-b border-slate-200 dark:border-slate-800/80 overflow-hidden shrink-0">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-lg overflow-hidden p-1">
              <img src="/logo-nexaflow-3d.png" alt="NexaFlow Logo" className="w-full h-full object-contain drop-shadow-md" />
            </div>
            <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              <div className="flex items-center gap-1">
                <span className="text-lg font-black tracking-tight font-display text-slate-900 dark:text-white">NEXAFLOW</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#EA8B42]"></span>
              </div>
              <p className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase">Owner Space</p>
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
            <Link href="/owner/settings" className="flex items-center gap-3 px-3 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#111C33] hover:text-slate-900 dark:hover:text-white rounded-xl font-bold transition-all whitespace-nowrap">
              <Icons.Settings />
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">Pengaturan</span>
            </Link>
          </nav>
          <div className="p-4 border-t border-slate-200 dark:border-slate-800/80">
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20 rounded-xl font-bold transition-all whitespace-nowrap">
              <Icons.Logout /> <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">Logout</span>
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 flex flex-col h-full overflow-hidden relative">

          {/* HEADER */}
          <header className="no-print h-20 bg-white/60 dark:bg-[#04060B]/60 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between px-6 lg:px-10 z-40 transition-colors">
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight">Laporan Laba Rugi</h1>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">Analisis pendapatan dan pengeluaran bisnis Anda</p>
            </div>
            <div className="flex items-center gap-3 md:gap-4">

              <div className="flex items-center gap-2">
                {period === 'daily' && (
                  <input type="date" value={dateStr} onChange={handleDateChange} className="bg-slate-100 dark:bg-[#111C33] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 outline-none" />
                )}
                {period === 'weekly' && (
                  <input type="week" value={dateStr} onChange={handleDateChange} className="bg-slate-100 dark:bg-[#111C33] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 outline-none" />
                )}
                {period === 'monthly' && (
                  <input type="month" value={dateStr} onChange={handleDateChange} className="bg-slate-100 dark:bg-[#111C33] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 outline-none" />
                )}

                <div className="hidden md:flex bg-slate-100 dark:bg-[#111C33] rounded-xl p-1 border border-slate-200 dark:border-slate-800">
                  <button onClick={() => handlePeriodChange('daily')} className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${period === 'daily' ? 'bg-white dark:bg-[#1E293B] text-[#2563EB] dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>Harian</button>
                  <button onClick={() => handlePeriodChange('weekly')} className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${period === 'weekly' ? 'bg-white dark:bg-[#1E293B] text-[#2563EB] dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>Mingguan</button>
                  <button onClick={() => handlePeriodChange('monthly')} className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${period === 'monthly' ? 'bg-white dark:bg-[#1E293B] text-[#2563EB] dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>Bulanan</button>
                </div>
              </div>

              <button onClick={handleExportCSV} className="bg-slate-100 hover:bg-slate-200 dark:bg-[#111C33] dark:hover:bg-[#1E293B] text-slate-700 dark:text-slate-300 font-bold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 shadow-sm border border-slate-200 dark:border-slate-800 transition-all">
                <Icons.Download /> CSV
              </button>
              <button onClick={() => window.print()} className="bg-[#2563EB] hover:bg-[#1E4E8C] text-white font-bold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 shadow-md transition-all">
                <Icons.Printer /> Cetak PDF
              </button>

              <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2.5 rounded-xl bg-slate-100 dark:bg-[#0F172A] text-slate-600 dark:text-amber-400 border border-slate-200 dark:border-slate-800 shadow-sm">
                {isDarkMode ? <Icons.Sun /> : <Icons.Moon />}
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-6 lg:p-10 z-10 scroll-smooth print-container">

            {/* PRINT HEADER (Only visible on print) */}
            <div className="hidden print-only mb-8 text-center border-b-2 border-black pb-4">
              <h1 className="text-2xl font-black text-black">LAPORAN LABA RUGI</h1>
              <p className="text-sm font-bold text-black mt-1">Periode: {period.toUpperCase()} ({dateStr})</p>
              <p className="text-xs text-black mt-1">Dicetak pada: {new Date().toLocaleString('id-ID')}</p>
            </div>

            {/* KPI CARDS (P&L SUMMARY) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

              {/* Pendapatan */}
              <div className="owner-3d bg-white dark:bg-[#0A0F1C] border border-slate-200 dark:border-slate-800/60 p-6 rounded-3xl">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pendapatan Kotor</p>
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <Icons.TrendUp />
                  </div>
                </div>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white owner-num">{formatRp(plData.revenue)}</h3>
                <p className="text-sm font-bold text-emerald-600 mt-2">Dari {reports.length} transaksi lunas</p>
              </div>

              {/* Pengeluaran */}
              <div className="owner-3d bg-white dark:bg-[#0A0F1C] border border-slate-200 dark:border-slate-800/60 p-6 rounded-3xl">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Pengeluaran</p>
                  <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
                    <Icons.TrendDown />
                  </div>
                </div>
                <h3 className="text-3xl font-black text-rose-500 owner-num">{formatRp(plData.totalExpense)}</h3>
                <p className="text-sm font-bold text-slate-500 mt-2">Harian + Bulanan + Gaji</p>
              </div>

              {/* Laba Bersih */}
              <div className="owner-3d bg-gradient-to-br from-[#0F172A] to-[#04060B] border border-slate-800 p-6 rounded-3xl text-white">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-black text-slate-400 uppercase tracking-wider">Laba Bersih</p>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${plData.netProfit >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                    <Icons.Wallet />
                  </div>
                </div>
                <h3 className={`text-3xl font-black owner-num ${plData.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {formatRp(plData.netProfit)}
                </h3>
                <p className="text-sm font-bold text-slate-400 mt-2">Margin: {plData.revenue > 0 ? ((plData.netProfit / plData.revenue) * 100).toFixed(1) : 0}%</p>
              </div>
            </div>

            {/* BREAKDOWN PENGELUARAN */}
            <div className="mb-8">
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">Rincian Pengeluaran</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="owner-3d bg-white dark:bg-[#0A0F1C] border border-slate-200 dark:border-slate-800/60 p-5 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-500 shrink-0">
                    <Icons.Coffee />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-500">Operasional Harian</p>
                    <p className="text-lg font-black text-slate-900 dark:text-white owner-num mt-1">{formatRp(plData.dailyExpense)}</p>
                  </div>
                </div>
                <div className="owner-3d bg-white dark:bg-[#0A0F1C] border border-slate-200 dark:border-slate-800/60 p-5 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                    <Icons.Building />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-500">Biaya Wajib Bulanan</p>
                    <p className="text-lg font-black text-slate-900 dark:text-white owner-num mt-1">{formatRp(plData.monthlyExpense)}</p>
                  </div>
                </div>
                <div className="owner-3d bg-white dark:bg-[#0A0F1C] border border-slate-200 dark:border-slate-800/60 p-5 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0">
                    <Icons.Users />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-500">Gaji Karyawan</p>
                    <p className="text-lg font-black text-slate-900 dark:text-white owner-num mt-1">{formatRp(plData.salaryExpense)}</p>
                    {period === 'monthly' && plData.pendingBaseSalary > 0 && (
                      <p className="text-[11px] font-semibold text-slate-400 mt-1 owner-num">
                        Aktual: {formatRp(plData.actualSalaryTx)} + Est. Pokok: {formatRp(plData.pendingBaseSalary)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* TABLE RIWAYAT TRANSAKSI */}
            <div className="mb-8">
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">Riwayat Transaksi Pendapatan</h3>
              <div className="owner-3d bg-white dark:bg-[#0A0F1C] border border-slate-200 dark:border-slate-800/60 rounded-3xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800/80 text-xs uppercase tracking-wider text-slate-500 bg-slate-50 dark:bg-[#060911]/50">
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
                        <tr key={r.id} className="owner-row">
                          <td className="p-4 pl-6 text-sm font-medium text-slate-600 dark:text-slate-400">
                            {new Date(r.created_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="p-4 font-bold text-sm text-slate-900 dark:text-white">{r.branchName}</td>
                          <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{r.customer_name || 'Walk-in'}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${r.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600' : r.status === 'cancelled' ? 'bg-rose-500/10 text-rose-600' : 'bg-amber-500/10 text-amber-600'}`}>
                              {r.status}
                            </span>
                          </td>
                          <td className="p-4 pr-6 text-right font-black text-base text-emerald-600 dark:text-emerald-400 owner-num">
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

          </div>
        </main>
      </div>
    </div>
  );
}