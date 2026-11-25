'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const Icons = {
  Menu: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  Sun: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  Moon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  ChevronDown: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><polyline points="6 9 12 15 18 9"/></svg>,
  Close: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5"><polyline points="20 6 9 17 4 12"/></svg>,
  Logout: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 shrink-0"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Download: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Printer: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  Overview: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" className="w-4 h-4 shrink-0"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
  Finance: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" className="w-4 h-4 shrink-0"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  Box: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" className="w-4 h-4 shrink-0"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  Reports: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" className="w-4 h-4 shrink-0"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  Settings: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-4 h-4 shrink-0"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Wallet: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="w-5 h-5"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>,
  TrendUp: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="w-5 h-5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  TrendDown: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="w-5 h-5"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>,
  Users: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="w-5 h-5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Coffee: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="w-5 h-5"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
  Building: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="w-5 h-5"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>,
};

export default function OwnerReports() {
  const [userEmail, setUserEmail] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const branchDropdownRef = useRef(null);

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
    try {
      const savedTheme = localStorage.getItem('nexaflow_theme');
      if (savedTheme === 'dark') setIsDarkMode(true);
      else setIsDarkMode(false);
    } catch (e) {
      // noop
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    try {
      localStorage.setItem('nexaflow_theme', isDarkMode ? 'dark' : 'light');
    } catch (e) {
      // noop
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleOutside = (e) => {
      if (branchDropdownRef.current && !branchDropdownRef.current.contains(e.target)) {
        setIsBranchDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleOutside);
    return () => document.removeEventListener('click', handleOutside);
  }, []);

  const fetchReports = async (email, currentPeriod, currentDate, branchId = selectedBranchId) => {
    if (!email) return;
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/owner/reports?manager_email=${encodeURIComponent(email)}&period=${encodeURIComponent(currentPeriod)}&date_str=${encodeURIComponent(currentDate)}&branch_id=${encodeURIComponent(branchId)}`
      );
      if (res.ok) {
        const data = await res.json();
        setTenants(data.tenants || []);
        setReports(data.reports || []);
        setPlData(
          data.plData || {
            revenue: 0,
            dailyExpense: 0,
            monthlyExpense: 0,
            salaryExpense: 0,
            actualSalaryTx: 0,
            pendingBaseSalary: 0,
            totalExpense: 0,
            netProfit: 0,
          }
        );
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

  const handleSelectBranch = (nextBranch) => {
    setSelectedBranchId(nextBranch);
    setIsBranchDropdownOpen(false);
    fetchReports(userEmail, period, dateStr, nextBranch);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const selectedBranchLabel = useMemo(() => {
    if (selectedBranchId === 'all') return `Semua Cabang (${tenants.length})`;
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
    <div className={`neu-owner-shell font-sans ${isDarkMode ? 'neu-dark' : ''}`}>
      <style>{`
        .neu-owner-shell {
          --bg-base: #E6E9EF;
          --surface: #E6E9EF;
          --surface-elevated: #EDF0F6;
          --shadow-light: #FFFFFF;
          --shadow-dark: #C2C8D4;
          --border-subtle: rgba(255, 255, 255, 0.65);
          --divider: rgba(148, 163, 184, 0.28);
          --text-primary: #1E2532;
          --text-secondary: #626E82;
          --sb-thumb: #C5CCD8;

          background-color: var(--bg-base);
          color: var(--text-primary);
          min-height: 100vh;
          min-height: -webkit-fill-available;
          transition: background-color 0.2s ease, color 0.18s ease;
        }
        .neu-owner-shell.neu-dark {
          --bg-base: #1B202C;
          --surface: #1B202C;
          --surface-elevated: #222838;
          --shadow-light: #252C3C;
          --shadow-dark: #11151D;
          --border-subtle: rgba(255, 255, 255, 0.06);
          --divider: rgba(148, 163, 184, 0.14);
          --text-primary: #F1F5F9;
          --text-secondary: #94A3B8;
          --sb-thumb: #2A3244;
        }

        .neu-owner-shell * {
          scrollbar-width: thin;
          scrollbar-color: var(--sb-thumb) var(--bg-base);
          -webkit-tap-highlight-color: transparent;
        }
        .neu-owner-shell ::-webkit-scrollbar { width: 8px; height: 8px; }
        .neu-owner-shell ::-webkit-scrollbar-track { background: var(--bg-base); }
        .neu-owner-shell ::-webkit-scrollbar-button { display: none; width: 0; height: 0; }
        .neu-owner-shell ::-webkit-scrollbar-thumb {
          background: var(--sb-thumb);
          border-radius: 9999px;
          border: 2px solid var(--bg-base);
        }
        .neu-owner-shell ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #2563EB, #10B981);
        }

        .neu-text { color: var(--text-primary); }
        .neu-sub { color: var(--text-secondary); }
        .neu-div { border-color: var(--divider); }
        .owner-num { font-variant-numeric: tabular-nums; letter-spacing: -0.02em; }

        .neu-card {
          background: var(--surface);
          border-radius: 26px;
          box-shadow: 9px 9px 18px var(--shadow-dark), -9px -9px 18px var(--shadow-light);
          border: 1px solid var(--border-subtle);
          transition: background-color 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, transform 0.16s ease;
        }
        .neu-card-hover:hover {
          background: var(--surface-elevated);
          border-color: rgba(37, 99, 235, 0.35);
          box-shadow: 11px 11px 22px var(--shadow-dark), -11px -11px 22px var(--shadow-light);
        }

        .neu-inset {
          background: var(--surface);
          border-radius: 16px;
          box-shadow: inset 5px 5px 10px var(--shadow-dark), inset -5px -5px 10px var(--shadow-light);
          border: 1px solid transparent;
        }

        .neu-inset-pill {
          background: var(--surface);
          border-radius: 9999px;
          box-shadow: inset 4px 4px 8px var(--shadow-dark), inset -4px -4px 8px var(--shadow-light);
        }

        .neu-item {
          background: var(--surface);
          border-radius: 18px;
          box-shadow: 5px 5px 10px var(--shadow-dark), -5px -5px 10px var(--shadow-light);
          border: 1px solid var(--border-subtle);
          transition: all 0.18s ease;
        }
        .neu-item:hover {
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(16, 185, 129, 0.07)), var(--surface-elevated);
          border-color: rgba(59, 130, 246, 0.45);
          transform: translateY(-1px);
        }

        .neu-btn {
          background: var(--surface);
          border-radius: 15px;
          box-shadow: 5px 5px 10px var(--shadow-dark), -5px -5px 10px var(--shadow-light);
          border: 1px solid var(--border-subtle);
          transition: all 0.18s ease;
          cursor: pointer;
        }
        .neu-btn:hover {
          background: linear-gradient(135deg, #2563EB, #1D4ED8);
          color: #FFFFFF !important;
          border-color: #60A5FA;
          box-shadow: 6px 6px 14px var(--shadow-dark), 0 0 14px rgba(37, 99, 235, 0.35);
          transform: translateY(-1px);
        }
        .neu-btn:hover * { color: #FFFFFF !important; }
        .neu-btn:active {
          box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.4);
          transform: scale(0.97);
        }
        .neu-btn.active {
          background: linear-gradient(135deg, #2563EB, #10B981);
          color: #FFFFFF !important;
          border-color: rgba(255, 255, 255, 0.3);
          box-shadow: inset 3px 3px 7px rgba(0, 0, 0, 0.28), 0 4px 12px rgba(37, 99, 235, 0.28);
        }
        .neu-btn.active * { color: #FFFFFF !important; }

        .neu-btn-green:hover {
          background: linear-gradient(135deg, #16A34A, #15803D);
          border-color: #4ADE80;
          box-shadow: 6px 6px 14px var(--shadow-dark), 0 0 14px rgba(22, 163, 74, 0.38);
        }
        .neu-btn-danger:hover {
          background: linear-gradient(135deg, #E11D48, #BE123C);
          border-color: #FDA4AF;
          box-shadow: 6px 6px 14px var(--shadow-dark), 0 0 14px rgba(225, 29, 72, 0.38);
        }

        .neu-orb {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: var(--surface);
          box-shadow: 5px 5px 10px var(--shadow-dark), -5px -5px 10px var(--shadow-light);
          border: 1px solid var(--border-subtle);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.18s ease;
          cursor: pointer;
        }
        .neu-orb:hover {
          background: linear-gradient(135deg, #2563EB, #0EA5E9);
          color: #FFFFFF !important;
          border-color: #7DD3FC;
          box-shadow: 0 0 14px rgba(14, 165, 233, 0.45);
          transform: scale(1.06);
        }
        .neu-orb:active {
          box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.4);
          transform: scale(0.94);
        }

        .neu-knob {
          background: var(--surface);
          border-radius: 50%;
          box-shadow: 6px 6px 12px var(--shadow-dark), -6px -6px 12px var(--shadow-light);
          border: 1px solid var(--border-subtle);
        }

        .neu-dropdown-menu {
          background: var(--surface-elevated);
          border-radius: 20px;
          box-shadow: 10px 12px 24px var(--shadow-dark), -6px -6px 16px var(--shadow-light);
          border: 1px solid var(--border-subtle);
        }
        .neu-dropdown-option {
          border-radius: 12px;
          color: var(--text-primary);
          transition: all 0.15s ease;
          cursor: pointer;
        }
        .neu-dropdown-option:hover {
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.14), rgba(16, 185, 129, 0.12));
          color: #3B82F6;
        }
        .neu-dropdown-option.selected {
          background: linear-gradient(135deg, #2563EB, #10B981);
          color: #FFFFFF !important;
        }
        .neu-dropdown-option.selected * { color: #FFFFFF !important; }

        .ios-blur-backdrop {
          background: rgba(15, 23, 42, 0.48);
          -webkit-backdrop-filter: blur(4px);
          backdrop-filter: blur(4px);
        }

        @media print {
          @page { margin: 1cm; size: A4 portrait; }
          body, .neu-owner-shell { background: white !important; color: black !important; }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          .neu-card, .neu-inset, .neu-item {
            box-shadow: none !important;
            border: 1px solid #cbd5e1 !important;
            background: white !important;
            color: black !important;
          }
          .neu-text, .neu-sub { color: black !important; }
        }
      `}</style>

      {/* BACKDROP SIDEBAR BUKA-TUTUP */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="no-print fixed inset-0 ios-blur-backdrop z-40"
        />
      )}

      {/* SIDEBAR BUKA-TUTUP OWNER */}
      <aside
        className={`no-print neu-card fixed top-3.5 left-3.5 bottom-3.5 z-50 w-64 p-5 flex flex-col justify-between transition-all duration-200 ${
          isSidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-[130%] opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex items-center justify-between gap-2.5 pb-4 border-b neu-div shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="neu-knob w-10 h-10 flex items-center justify-center shrink-0 p-1.5">
                <img src="/logo-nexaflow-3d.png" alt="NF" className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black tracking-tight neu-text leading-none truncate">NEXAFLOW</p>
                <p className="text-[10px] font-extrabold text-emerald-500 tracking-wider uppercase mt-1">Owner Panel</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Tutup Sidebar"
              className="neu-orb w-9 h-9 neu-sub shrink-0"
            >
              <Icons.Close />
            </button>
          </div>

          <nav className="flex-1 mt-5 space-y-2.5 overflow-y-auto overflow-x-hidden pr-0.5">
            <Link
              href="/owner"
              onClick={() => setIsSidebarOpen(false)}
              className="neu-btn flex items-center gap-3 px-3.5 py-3 neu-sub text-xs font-bold whitespace-nowrap"
            >
              <Icons.Overview />
              <span>Command Center AI</span>
            </Link>

            <Link
              href="/owner/finance?tab=expenses_daily"
              onClick={() => setIsSidebarOpen(false)}
              className="neu-btn flex items-center gap-3 px-3.5 py-3 neu-sub text-xs font-bold whitespace-nowrap"
            >
              <Icons.Finance />
              <span>Keuangan & Gaji</span>
            </Link>

            <Link
              href="/owner/finance?tab=stocks"
              onClick={() => setIsSidebarOpen(false)}
              className="neu-btn flex items-center gap-3 px-3.5 py-3 neu-sub text-xs font-bold whitespace-nowrap"
            >
              <Icons.Box />
              <span>Master Menu & Stok</span>
            </Link>

            <Link
              href="/owner/reports"
              onClick={() => setIsSidebarOpen(false)}
              className="neu-btn active flex items-center gap-3 px-3.5 py-3 text-xs font-extrabold whitespace-nowrap"
            >
              <Icons.Reports />
              <span>Laporan Global P&L</span>
            </Link>

            <Link
              href="/owner/settings"
              onClick={() => setIsSidebarOpen(false)}
              className="neu-btn flex items-center gap-3 px-3.5 py-3 neu-sub text-xs font-bold whitespace-nowrap"
            >
              <Icons.Settings />
              <span>Pengaturan & AI Key</span>
            </Link>
          </nav>
        </div>

        <div className="pt-4 mt-4 border-t neu-div space-y-3 shrink-0">
          <div className="neu-inset p-3.5 overflow-hidden">
            <p className="text-xs font-black neu-text truncate">{userEmail || 'Owner'}</p>
            <p className="text-[11px] font-bold text-emerald-500 mt-0.5">{tenants.length} Cabang Terdaftar</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="neu-btn neu-btn-danger w-full flex items-center justify-center gap-2 py-2.5 px-3 text-rose-500 text-xs font-black"
          >
            <Icons.Logout />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* AREA KONTEN UTAMA */}
      <div className="max-w-6xl w-full mx-auto p-3.5 sm:p-6 space-y-6 pb-20 print-container">
        {/* HEADER */}
        <header className="no-print neu-card px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3 sticky top-3 z-30">
          <div className="flex items-center gap-3.5 min-w-0">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label="Buka atau Tutup Sidebar"
              className="neu-orb neu-text shrink-0"
            >
              <Icons.Menu />
            </button>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-black tracking-tight neu-text truncate">Laporan Laba Rugi (P&L)</h1>
              <p className="text-xs font-bold neu-sub mt-0.5 truncate">
                Analisis pendapatan dan pengeluaran · {selectedBranchLabel}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 shrink-0">
            {/* CUSTOM DROPDOWN CABANG */}
            <div className="relative" ref={branchDropdownRef}>
              <button
                type="button"
                onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
                className="neu-inset-pill px-3.5 py-2 flex items-center gap-2 text-xs font-extrabold neu-text max-w-[195px] cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span className="truncate">{selectedBranchLabel}</span>
                <span className={`neu-sub shrink-0 transition-transform ${isBranchDropdownOpen ? 'rotate-180' : ''}`}>
                  <Icons.ChevronDown />
                </span>
              </button>

              {isBranchDropdownOpen && (
                <div className="neu-dropdown-menu absolute right-0 mt-2 w-60 p-1.5 z-50 space-y-1 max-h-60 overflow-y-auto">
                  <button
                    type="button"
                    onClick={() => handleSelectBranch('all')}
                    className={`neu-dropdown-option w-full px-3 py-2 text-left text-xs flex items-center justify-between ${
                      selectedBranchId === 'all' ? 'selected font-extrabold' : 'font-bold'
                    }`}
                  >
                    <span>Semua Cabang ({tenants.length})</span>
                    {selectedBranchId === 'all' && <Icons.Check />}
                  </button>
                  {tenants.map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleSelectBranch(t.id)}
                      className={`neu-dropdown-option w-full px-3 py-2 text-left text-xs flex items-center justify-between ${
                        selectedBranchId === t.id ? 'selected font-extrabold' : 'font-bold'
                      }`}
                    >
                      <span className="truncate">{t.name}</span>
                      {selectedBranchId === t.id && <Icons.Check />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="neu-inset-pill px-3.5 py-2">
                {period === 'daily' && (
                  <input type="date" value={dateStr} onChange={handleDateChange} className="bg-transparent text-xs font-extrabold neu-text outline-none" />
                )}
                {period === 'weekly' && (
                  <input type="week" value={dateStr} onChange={handleDateChange} className="bg-transparent text-xs font-extrabold neu-text outline-none" />
                )}
                {period === 'monthly' && (
                  <input type="month" value={dateStr} onChange={handleDateChange} className="bg-transparent text-xs font-extrabold neu-text outline-none" />
                )}
              </div>

              <div className="hidden md:flex neu-inset p-1 gap-1">
                <button type="button" onClick={() => handlePeriodChange('daily')} className={`neu-btn px-3 py-1.5 rounded-xl text-xs font-black ${period === 'daily' ? 'active' : 'neu-sub'}`}>Harian</button>
                <button type="button" onClick={() => handlePeriodChange('weekly')} className={`neu-btn px-3 py-1.5 rounded-xl text-xs font-black ${period === 'weekly' ? 'active' : 'neu-sub'}`}>Mingguan</button>
                <button type="button" onClick={() => handlePeriodChange('monthly')} className={`neu-btn px-3 py-1.5 rounded-xl text-xs font-black ${period === 'monthly' ? 'active' : 'neu-sub'}`}>Bulanan</button>
              </div>
            </div>

            <button type="button" onClick={handleExportCSV} className="neu-btn neu-text font-black px-3.5 py-2 text-xs flex items-center gap-1.5">
              <Icons.Download />
              <span>CSV</span>
            </button>
            <button type="button" onClick={() => window.print()} className="neu-btn neu-btn-green text-blue-500 font-black px-3.5 py-2 text-xs flex items-center gap-1.5">
              <Icons.Printer />
              <span>Cetak PDF</span>
            </button>

            <button
              type="button"
              onClick={() => setIsDarkMode(!isDarkMode)}
              aria-label="Ubah Tema"
              className={`neu-orb shrink-0 ${isDarkMode ? 'text-sky-400' : 'text-amber-500'}`}
            >
              {isDarkMode ? <Icons.Sun /> : <Icons.Moon />}
            </button>
          </div>
        </header>

        {/* FILTER PERIODE MOBILE */}
        <div className="no-print md:hidden neu-inset p-1.5 grid grid-cols-3 gap-1.5">
          <button type="button" onClick={() => handlePeriodChange('daily')} className={`neu-btn py-2 text-xs font-black ${period === 'daily' ? 'active' : 'neu-sub'}`}>Harian</button>
          <button type="button" onClick={() => handlePeriodChange('weekly')} className={`neu-btn py-2 text-xs font-black ${period === 'weekly' ? 'active' : 'neu-sub'}`}>Mingguan</button>
          <button type="button" onClick={() => handlePeriodChange('monthly')} className={`neu-btn py-2 text-xs font-black ${period === 'monthly' ? 'active' : 'neu-sub'}`}>Bulanan</button>
        </div>

        {/* PRINT HEADER */}
        <div className="hidden print-only mb-8 text-center border-b-2 border-black pb-4">
          <h1 className="text-2xl font-black text-black">LAPORAN LABA RUGI</h1>
          <p className="text-sm font-bold text-black mt-1">Cabang: {selectedBranchLabel} · Periode: {period.toUpperCase()} ({dateStr})</p>
          <p className="text-xs text-black mt-1">Dicetak pada: {new Date().toLocaleString('id-ID')}</p>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="neu-card neu-card-hover p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-black neu-sub uppercase tracking-wider">Pendapatan Kotor</p>
              <div className="neu-knob w-10 h-10 flex items-center justify-center text-emerald-500">
                <Icons.TrendUp />
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black neu-text owner-num">{formatRp(plData.revenue)}</h3>
            <p className="text-xs font-extrabold text-emerald-500 mt-2">Dari {reports.length} transaksi lunas</p>
          </div>

          <div className="neu-card neu-card-hover p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-black neu-sub uppercase tracking-wider">Total Pengeluaran</p>
              <div className="neu-knob w-10 h-10 flex items-center justify-center text-rose-500">
                <Icons.TrendDown />
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-rose-500 owner-num">{formatRp(plData.totalExpense)}</h3>
            <p className="text-xs font-extrabold neu-sub mt-2">Harian + Bulanan + Gaji</p>
          </div>

          <div className="neu-card neu-card-hover p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-black neu-sub uppercase tracking-wider">Laba Bersih</p>
              <div className={`neu-knob w-10 h-10 flex items-center justify-center ${plData.netProfit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                <Icons.Wallet />
              </div>
            </div>
            <h3 className={`text-2xl sm:text-3xl font-black owner-num ${plData.netProfit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {formatRp(plData.netProfit)}
            </h3>
            <p className="text-xs font-extrabold neu-sub mt-2">
              Margin: {plData.revenue > 0 ? ((plData.netProfit / plData.revenue) * 100).toFixed(1) : 0}%
            </p>
          </div>
        </div>

        {/* BREAKDOWN PENGELUARAN */}
        <div>
          <h3 className="text-base font-black neu-text mb-4">Rincian Pengeluaran</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="neu-card neu-card-hover p-5 flex items-center gap-4">
              <div className="neu-knob w-12 h-12 flex items-center justify-center text-blue-500 shrink-0">
                <Icons.Coffee />
              </div>
              <div>
                <p className="text-xs font-black neu-sub">Operasional Harian</p>
                <p className="text-lg font-black neu-text owner-num mt-1">{formatRp(plData.dailyExpense)}</p>
              </div>
            </div>

            <div className="neu-card neu-card-hover p-5 flex items-center gap-4">
              <div className="neu-knob w-12 h-12 flex items-center justify-center text-amber-500 shrink-0">
                <Icons.Building />
              </div>
              <div>
                <p className="text-xs font-black neu-sub">Biaya Bulanan & Lainnya</p>
                <p className="text-lg font-black neu-text owner-num mt-1">{formatRp(plData.monthlyExpense)}</p>
              </div>
            </div>

            <div className="neu-card neu-card-hover p-5 flex items-center gap-4">
              <div className="neu-knob w-12 h-12 flex items-center justify-center text-purple-500 shrink-0">
                <Icons.Users />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black neu-sub">Gaji Karyawan</p>
                <p className="text-lg font-black neu-text owner-num mt-1">{formatRp(plData.salaryExpense)}</p>
                {period === 'monthly' && plData.pendingBaseSalary > 0 && (
                  <p className="text-[11px] font-bold neu-sub mt-1 owner-num">
                    Aktual: {formatRp(plData.actualSalaryTx)} + Est. Pokok: {formatRp(plData.pendingBaseSalary)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* TABLE RIWAYAT TRANSAKSI */}
        <div>
          <h3 className="text-base font-black neu-text mb-4">Riwayat Transaksi Pendapatan</h3>
          <div className="neu-card overflow-hidden p-3 sm:p-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-xs font-black uppercase tracking-wider neu-sub">
                    <th className="p-3 pl-4">Waktu</th>
                    <th className="p-3">Cabang</th>
                    <th className="p-3">Pelanggan</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 pr-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan="5" className="p-6 text-center neu-sub font-black">Memuat laporan...</td></tr>
                  ) : reports.length === 0 ? (
                    <tr><td colSpan="5" className="p-6 text-center neu-sub font-black">Tidak ada transaksi pada periode ini.</td></tr>
                  ) : reports.map(r => (
                    <tr key={r.id} className="neu-item">
                      <td className="p-3.5 pl-4 rounded-l-2xl text-xs font-bold neu-sub">
                        {new Date(r.created_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="p-3.5 font-black text-xs neu-text">{r.branchName}</td>
                      <td className="p-3.5 text-xs font-bold neu-text">{r.customer_name || 'Walk-in'}</td>
                      <td className="p-3.5">
                        <span className={`neu-inset-pill px-3 py-1 text-[11px] font-black uppercase tracking-wider ${
                          r.status === 'completed'
                            ? 'text-emerald-500'
                            : r.status === 'cancelled'
                            ? 'text-rose-500'
                            : 'text-amber-500'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="p-3.5 pr-4 rounded-r-2xl text-right font-black text-sm text-emerald-500 owner-num">
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
    </div>
  );
}