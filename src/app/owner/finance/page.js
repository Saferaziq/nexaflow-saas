'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const Icons = {
  Sun: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  Moon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  Trash: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Edit: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Logout: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  WhatsApp: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>,
  Settings: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Warning: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
};

export default function OwnerFinance() {
  const [userEmail, setUserEmail] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('expenses_daily');
  
  const [tenants, setTenants] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [expenseModal, setExpenseModal] = useState(false);
  const [formExpense, setFormExpense] = useState({ tenant_id: '', category: 'Bulanan', description: '', amount: '' });
  
  const [employeeModal, setEmployeeModal] = useState({ open: false, data: null });
  const [payrollModal, setPayrollModal] = useState({ open: false, employee: null, type: 'Gaji' });

  const [formEmployee, setFormEmployee] = useState({ 
    id: null, tenant_id: '', name: '', role: 'Kasir', base_salary: '', 
    wa_number: '', address: '', bank_name: '', bank_account: '' 
  });
  const [formPayroll, setFormPayroll] = useState({ amount: '', notes: '' });
  
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [confirmModal, setConfirmModal] = useState({ open: false, title: '', message: '', isDanger: false, onConfirm: null, loading: false });

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  const fetchData = async (email) => {
    try {
      const res = await fetch(`/api/owner/finance?manager_email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (res.ok) {
        setTenants(data.tenants || []);
        setExpenses(data.expenses || []);
        setEmployees(data.employees || []);
        setTransactions(data.transactions || []);
        if (data.tenants.length > 0) {
          setFormEmployee(prev => ({ ...prev, tenant_id: data.tenants[0].id }));
          setFormExpense(prev => ({ ...prev, tenant_id: data.tenants[0].id }));
        }
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
      fetchData(session.user.email);
    };
    getSession();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/owner/finance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        action: 'add_expense', 
        manager_email: userEmail, 
        payload: { 
          ...formExpense, 
          quantity: 1, 
          unit_price: Number(formExpense.amount) 
        } 
      })
    });
    const data = await res.json();
    if (res.ok) {
      showToast(data.message);
      setExpenseModal(false);
      setFormExpense({ ...formExpense, description: '', amount: '' });
      fetchData(userEmail);
    } else showToast(data.error, 'error');
  };

  const handleSaveEmployee = async (e) => {
    e.preventDefault();
    const isEdit = !!formEmployee.id;
    const action = isEdit ? 'edit_employee' : 'add_employee';
    
    const res = await fetch('/api/owner/finance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        action, 
        manager_email: userEmail, 
        payload: { ...formEmployee, base_salary: Number(formEmployee.base_salary) } 
      })
    });
    const data = await res.json();
    if (res.ok) {
      showToast(data.message);
      setEmployeeModal({ open: false, data: null });
      setFormEmployee({ id: null, tenant_id: tenants[0]?.id || '', name: '', role: 'Kasir', base_salary: '', wa_number: '', address: '', bank_name: '', bank_account: '' });
      fetchData(userEmail);
    } else showToast(data.error, 'error');
  };

  const handleOpenEditEmployee = (emp) => {
    setFormEmployee({
      id: emp.id,
      tenant_id: emp.tenant_id,
      name: emp.name,
      role: emp.role,
      base_salary: emp.base_salary,
      wa_number: emp.wa_number || '',
      address: emp.address || '',
      bank_name: emp.bank_name || '',
      bank_account: emp.bank_account || ''
    });
    setEmployeeModal({ open: true, data: emp });
  };

  const handlePayroll = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/owner/finance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'add_emp_transaction',
        manager_email: userEmail,
        payload: {
          tenant_id: payrollModal.employee.tenant_id,
          employee_id: payrollModal.employee.id,
          type: payrollModal.type,
          amount: Number(formPayroll.amount),
          notes: formPayroll.notes
        }
      })
    });
    const data = await res.json();
    if (res.ok) {
      showToast(data.message);
      setPayrollModal({ open: false, employee: null, type: 'Gaji' });
      setFormPayroll({ amount: '', notes: '' });
      fetchData(userEmail);
    } else showToast(data.error, 'error');
  };

  const handleDelete = (type, id) => {
    setConfirmModal({
      open: true,
      title: type === 'expense' ? 'Hapus Pengeluaran' : 'Hapus Karyawan',
      message: 'Yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.',
      isDanger: true,
      loading: false,
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, loading: true }));
        try {
          const action = type === 'expense' ? 'delete_expense' : 'delete_employee';
          const res = await fetch('/api/owner/finance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, manager_email: userEmail, payload: { id } })
          });
          const data = await res.json();
          if (res.ok) {
            showToast(data.message);
            fetchData(userEmail);
            setConfirmModal({ open: false, title: '', message: '', isDanger: false, onConfirm: null, loading: false });
          } else throw new Error(data.error);
        } catch (err) {
          showToast(err.message, 'error');
          setConfirmModal({ open: false, title: '', message: '', isDanger: false, onConfirm: null, loading: false });
        }
      }
    });
  };

  const handleSendSalaryWA = (emp) => {
    if (!emp.wa_number) return showToast('Nomor WA karyawan belum diisi', 'error');
    
    const empTrans = transactions.filter(t => t.employee_id === emp.id);
    const totalKasbon = empTrans.filter(t => t.type === 'Kasbon').reduce((s, t) => s + t.amount, 0);
    const totalBonus = empTrans.filter(t => t.type === 'Bonus').reduce((s, t) => s + t.amount, 0);
    const gajiBersih = Number(emp.base_salary) + totalBonus - totalKasbon;

    const tenantName = tenants.find(t => t.id === emp.tenant_id)?.name || 'Kafe';
    
    let msg = `Halo *${emp.name}*,\n\nBerikut rincian gaji Anda di *${tenantName}*:\n`;
    msg += `----------------------------\n`;
    msg += `Gaji Pokok   : Rp ${Number(emp.base_salary).toLocaleString('id-ID')}\n`;
    msg += `Bonus        : + Rp ${totalBonus.toLocaleString('id-ID')}\n`;
    msg += `Kasbon       : - Rp ${totalKasbon.toLocaleString('id-ID')}\n`;
    msg += `----------------------------\n`;
    msg += `*Total Diterima: Rp ${gajiBersih.toLocaleString('id-ID')}*\n\n`;
    
    if (emp.bank_name && emp.bank_account) {
      msg += `Silakan transfer ke rekening:\n`;
      msg += `Bank: *${emp.bank_name}*\n`;
      msg += `No. Rek: *${emp.bank_account}*\n`;
      msg += `A/N: ${emp.name}\n\n`;
    }
    
    msg += `Terima kasih atas kerja kerasnya!`;

    const phone = emp.wa_number.replace(/^0/, '62').replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const formatRp = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const expensesDaily = expenses.filter(ex => ex.category === 'Harian');
  const expensesMonthly = expenses.filter(ex => ex.category === 'Bulanan' || ex.category === 'Operasional');
  
  const totalGajiBulanIni = transactions
    .filter(t => t.type === 'Gaji')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPengeluaranBulanan = expensesMonthly.reduce((sum, ex) => sum + Number(ex.amount), 0) + totalGajiBulanIni;
  const totalPengeluaranHarian = expensesDaily.reduce((sum, ex) => sum + Number(ex.amount), 0);

  // Logic untuk Cek Gaji Bulan Ini
  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const isEndOfMonth = new Date().getDate() >= 25;

  return (
    <div className="bg-[#F8FAFC] text-slate-800 dark:bg-[#04060B] dark:text-slate-200 min-h-screen overflow-hidden font-sans transition-colors duration-300">
      <style>{`
        .owner-3d { box-shadow: 0 1px 2px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.04), 0 8px 20px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.7); }
        .dark .owner-3d { box-shadow: 0 1px 2px rgba(0,0,0,0.30), 0 2px 6px rgba(0,0,0,0.20), 0 8px 20px rgba(0,0,0,0.25), 0 20px 40px -12px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.30); }
        .owner-3d-hover { transition: transform 220ms cubic-bezier(.2,.8,.2,1), box-shadow 220ms ease; }
        .owner-3d-hover:hover { transform: translateY(-2px); }
        .owner-pill { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; letter-spacing: 0.02em; }
        .owner-icon-btn { display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 8px; background: #F1F5F9; border: 1px solid #E2E8F0; color: #64748B; transition: all 150ms ease; }
        .dark .owner-icon-btn { background: #111826; border-color: rgba(148,163,184,0.10); color: #94A3B8; }
        .owner-icon-btn:hover { background: #E2E8F0; color: #334155; }
        .dark .owner-icon-btn:hover { background: #17202E; color: #E2E8F0; border-color: rgba(148,163,184,0.22); }
        .owner-icon-btn-danger:hover { background: #FEE2E2; color: #DC2626; border-color: #FCA5A5; }
        .dark .owner-icon-btn-danger:hover { background: rgba(244,63,94,0.10); color: #FB7185; border-color: rgba(244,63,94,0.30); }
        .owner-num { font-variant-numeric: tabular-nums; letter-spacing: -0.02em; }
        .owner-avatar { box-shadow: 0 1px 2px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.10); border: 1px solid rgba(148,163,184,0.12); }
        .owner-row { transition: background-color 150ms ease; }
        .owner-row:hover { background-color: rgba(17, 28, 51, 0.04); }
        .dark .owner-row:hover { background-color: rgba(17, 28, 51, 0.55); }
      `}</style>
      
      <div className="fixed top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-[#2563EB]/10 dark:bg-[#2563EB]/15 blur-[150px] pointer-events-none z-0"></div>
      
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
              <p className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase">Owner Space</p>
            </div>
          </div>
          <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto overflow-x-hidden">
            <Link href="/owner" className="flex items-center gap-3 px-3 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#111C33] hover:text-slate-900 dark:hover:text-white rounded-xl font-bold transition-all whitespace-nowrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5 shrink-0"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">Overview</span>
            </Link>
            <Link href="/owner/finance" className="flex items-center gap-3 px-3 py-3 bg-blue-50 dark:bg-[#111C33] text-[#2563EB] dark:text-sky-400 rounded-xl font-bold transition-all border border-blue-100 dark:border-sky-500/20 shadow-sm whitespace-nowrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5 shrink-0"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">Keuangan</span>
            </Link>
            <Link href="/owner/reports" className="flex items-center gap-3 px-3 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#111C33] hover:text-slate-900 dark:hover:text-white rounded-xl font-bold transition-all whitespace-nowrap">
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

        <main className="flex-1 flex flex-col h-full overflow-hidden relative">
          <header className="h-20 bg-white/60 dark:bg-[#04060B]/60 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between px-6 lg:px-10 z-40 transition-colors">
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight">Manajemen Keuangan</h1>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">Pisahkan biaya operasional harian dan biaya wajib bulanan</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2.5 rounded-xl bg-slate-100 dark:bg-[#0F172A] text-slate-600 dark:text-amber-400 border border-slate-200 dark:border-slate-800 shadow-sm">
                {isDarkMode ? <Icons.Sun /> : <Icons.Moon />}
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-6 lg:p-10 z-10 scroll-smooth">
            
            <div className="flex gap-2 mb-8 border-b border-slate-200 dark:border-slate-800 pb-4 overflow-x-auto">
              <button onClick={() => setActiveTab('expenses_daily')} className={`px-6 py-3 rounded-xl text-sm font-black whitespace-nowrap transition-all ${activeTab === 'expenses_daily' ? 'bg-[#2563EB] text-white shadow-lg' : 'bg-white dark:bg-[#111C33] text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#1E293B]'}`}>Pengeluaran Harian (Kasir)</button>
              <button onClick={() => setActiveTab('expenses_monthly')} className={`px-6 py-3 rounded-xl text-sm font-black whitespace-nowrap transition-all ${activeTab === 'expenses_monthly' ? 'bg-[#2563EB] text-white shadow-lg' : 'bg-white dark:bg-[#111C33] text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#1E293B]'}`}>Biaya Bulanan (Fixed Cost)</button>
              <button onClick={() => setActiveTab('employees')} className={`px-6 py-3 rounded-xl text-sm font-black whitespace-nowrap transition-all ${activeTab === 'employees' ? 'bg-[#2563EB] text-white shadow-lg' : 'bg-white dark:bg-[#111C33] text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#1E293B]'}`}>Data Karyawan & Gaji</button>
            </div>

            {activeTab === 'expenses_daily' && (
              <div className="animate-in fade-in duration-300">
                <div className="mb-6 p-4 bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/20 rounded-2xl flex items-start gap-3">
                  <div className="text-sky-500 mt-0.5"><Icons.Warning /></div>
                  <div>
                    <h4 className="font-bold text-sky-800 dark:text-sky-300">Informasi</h4>
                    <p className="text-sm text-sky-700 dark:text-sky-400 mt-1">Data di bawah ini adalah pengeluaran harian yang diinput oleh <b>Kasir</b> (seperti bahan baku, gas, dll). Owner hanya dapat memantau dan menghapus jika ada kecurangan.</p>
                  </div>
                </div>
                
                <div className="owner-3d bg-white dark:bg-[#0A0F1C] border border-slate-200 dark:border-slate-800/60 rounded-3xl overflow-hidden mb-6">
                  <div className="p-6 border-b border-slate-200 dark:border-slate-800/60 flex justify-between items-center">
                    <h2 className="text-lg font-black text-slate-900 dark:text-white font-display">Riwayat Pengeluaran Harian</h2>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Total Harian</p>
                      <p className="text-lg font-black text-rose-500 owner-num">{formatRp(totalPengeluaranHarian)}</p>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 dark:bg-[#060911]/50 border-b border-slate-200 dark:border-slate-800/80">
                        <tr className="text-xs uppercase tracking-wider text-slate-500 font-black">
                          <th className="p-4 pl-6">Tanggal</th>
                          <th className="p-4">Cabang</th>
                          <th className="p-4">Keterangan</th>
                          <th className="p-4">Total</th>
                          <th className="p-4 pr-6 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-base">
                        {expensesDaily.map(ex => {
                          const safeUnitPrice = Number(ex.unit_price) || (Number(ex.amount) / (Number(ex.quantity) || 1));
                          return (
                            <tr key={ex.id} className="owner-row">
                              <td className="p-4 pl-6 text-sm font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">{new Date(ex.expense_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                              <td className="p-4 text-sm font-bold text-slate-900 dark:text-white">{tenants.find(t => t.id === ex.tenant_id)?.name || '-'}</td>
                              <td className="p-4">
                                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{ex.description || '-'}</p>
                                <p className="text-xs text-slate-500 mt-0.5">({ex.quantity || 1} Qty x {formatRp(safeUnitPrice)})</p>
                              </td>
                              <td className="p-4 text-base font-black text-rose-500 owner-num whitespace-nowrap">- {formatRp(ex.amount)}</td>
                              <td className="p-4 pr-6 text-right">
                                <button onClick={() => handleDelete('expense', ex.id)} className="owner-icon-btn owner-icon-btn-danger inline-flex" title="Hapus"><Icons.Trash /></button>
                              </td>
                            </tr>
                          );
                        })}
                        {expensesDaily.length === 0 && <tr><td colSpan="5" className="p-10 text-center text-slate-500 font-bold text-base">Belum ada catatan pengeluaran harian dari kasir.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'expenses_monthly' && (
              <div className="animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white font-display">Biaya Wajib Bulanan</h2>
                    <p className="text-sm text-slate-500 mt-1">Catat pengeluaran tetap seperti Sewa, Listrik, Air, WiFi, dll.</p>
                  </div>
                  <button onClick={() => { setFormExpense({ ...formExpense, category: 'Bulanan' }); setExpenseModal(true); }} className="bg-[#2563EB] hover:bg-[#1E4E8C] text-white px-5 py-3 rounded-xl text-sm font-bold shadow-md transition-colors flex items-center gap-2">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Catat Biaya Bulanan
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="owner-3d bg-white dark:bg-[#0A0F1C] p-5 rounded-2xl border border-slate-200 dark:border-slate-800/60">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Pengeluaran Bulanan</p>
                    <h3 className="text-2xl font-black text-rose-500 owner-num">{formatRp(totalPengeluaranBulanan)}</h3>
                    <p className="text-[11px] text-slate-500 mt-2">*Termasuk total gaji karyawan yang telah dibayarkan</p>
                  </div>
                  <div className="owner-3d bg-white dark:bg-[#0A0F1C] p-5 rounded-2xl border border-slate-200 dark:border-slate-800/60">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Gaji Dibayarkan</p>
                    <h3 className="text-2xl font-black text-sky-500 owner-num">{formatRp(totalGajiBulanIni)}</h3>
                  </div>
                </div>
                
                <div className="owner-3d bg-white dark:bg-[#0A0F1C] border border-slate-200 dark:border-slate-800/60 rounded-3xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 dark:bg-[#060911]/50 border-b border-slate-200 dark:border-slate-800/80">
                        <tr className="text-xs uppercase tracking-wider text-slate-500 font-black">
                          <th className="p-4 pl-6">Tanggal</th>
                          <th className="p-4">Cabang</th>
                          <th className="p-4">Keterangan Biaya</th>
                          <th className="p-4">Total</th>
                          <th className="p-4 pr-6 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-base">
                        {expensesMonthly.map(ex => (
                          <tr key={ex.id} className="owner-row">
                            <td className="p-4 pl-6 text-sm font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">{new Date(ex.expense_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                            <td className="p-4 text-sm font-bold text-slate-900 dark:text-white">{tenants.find(t => t.id === ex.tenant_id)?.name || '-'}</td>
                            <td className="p-4 text-sm font-bold text-slate-800 dark:text-slate-200">{ex.description || '-'}</td>
                            <td className="p-4 text-base font-black text-rose-500 owner-num whitespace-nowrap">- {formatRp(ex.amount)}</td>
                            <td className="p-4 pr-6 text-right">
                              <button onClick={() => handleDelete('expense', ex.id)} className="owner-icon-btn owner-icon-btn-danger inline-flex" title="Hapus"><Icons.Trash /></button>
                            </td>
                          </tr>
                        ))}
                        {expensesMonthly.length === 0 && <tr><td colSpan="5" className="p-10 text-center text-slate-500 font-bold text-base">Belum ada catatan biaya wajib bulanan.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'employees' && (
              <div className="animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white font-display">Daftar Karyawan</h2>
                    <p className="text-sm text-slate-500 mt-1">Kelola gaji, kasbon, dan bonus staf kafe Anda.</p>
                  </div>
                  <button onClick={() => { setFormEmployee({ id: null, tenant_id: tenants[0]?.id || '', name: '', role: 'Kasir', base_salary: '', wa_number: '', address: '', bank_name: '', bank_account: '' }); setEmployeeModal({ open: true, data: null }); }} className="bg-[#EA8B42] hover:bg-[#D97736] text-white px-5 py-3 rounded-xl text-sm font-bold shadow-md transition-colors flex items-center gap-2">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Tambah Karyawan
                  </button>
                </div>
                
                {/* MODEL 2: HORIZONTAL CARD */}
                <div className="space-y-4">
                  {employees.map(emp => {
                    const empTrans = transactions.filter(t => t.employee_id === emp.id);
                    const totalKasbon = empTrans.filter(t => t.type === 'Kasbon').reduce((s, t) => s + t.amount, 0);
                    const totalBonus = empTrans.filter(t => t.type === 'Bonus').reduce((s, t) => s + t.amount, 0);
                    
                    // Logic Pengingat Gaji
                    const hasBeenPaidThisMonth = empTrans.some(t => t.type === 'Gaji' && t.transaction_date.startsWith(currentMonthStr));
                    const showSalaryReminder = isEndOfMonth && !hasBeenPaidThisMonth;

                    return (
                      <div key={emp.id} className="owner-3d bg-white dark:bg-[#0A0F1C] border border-slate-200 dark:border-slate-800/60 p-4 rounded-2xl flex flex-col md:flex-row items-center gap-4 relative overflow-hidden">
                        
                        {/* Indikator Belum Digaji */}
                        {showSalaryReminder && (
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-rose-400"></div>
                        )}

                        <div className="flex items-center gap-3 w-full md:w-[28%] shrink-0">
                          <div className="w-12 h-12 rounded-full owner-avatar flex items-center justify-center text-base font-black text-sky-300 shrink-0" style={{ background: 'linear-gradient(180deg,#0F2033,#0A1826)' }}>
                            {getInitials(emp.name)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                               <p className="font-bold text-white text-base truncate">{emp.name}</p>
                               {showSalaryReminder && (
                                 <span className="bg-rose-500/10 text-rose-500 border border-rose-500/20 text-[10px] font-black px-2 py-0.5 rounded shrink-0">Belum Digaji</span>
                               )}
                            </div>
                            <p className="text-[10px] font-bold text-sky-500 uppercase tracking-wider mt-0.5">{emp.role} • {tenants.find(t => t.id === emp.tenant_id)?.name}</p>
                          </div>
                        </div>
                        
                        <div className="flex-1 w-full grid grid-cols-3 gap-2 bg-slate-50 dark:bg-[#04060B] border border-slate-200 dark:border-slate-800/50 rounded-xl p-3">
                          <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Gaji Pokok</p>
                            <p className="font-black text-white owner-num text-sm">{formatRp(emp.base_salary)}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Kasbon</p>
                            <p className={`font-bold owner-num text-sm ${totalKasbon > 0 ? 'text-amber-400' : 'text-slate-600'}`}>{totalKasbon > 0 ? formatRp(totalKasbon) : '—'}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Bonus</p>
                            <p className={`font-bold owner-num text-sm ${totalBonus > 0 ? 'text-emerald-400' : 'text-slate-600'}`}>{totalBonus > 0 ? formatRp(totalBonus) : '—'}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-end mt-4 md:mt-0">
                          <button onClick={() => handleOpenEditEmployee(emp)} className="owner-icon-btn hidden md:flex" title="Edit"><Icons.Edit /></button>
                          <button onClick={() => handleDelete('employee', emp.id)} className="owner-icon-btn owner-icon-btn-danger hidden md:flex" title="Hapus"><Icons.Trash /></button>
                          
                          <div className="w-px h-8 bg-slate-800 mx-1 hidden md:block"></div>

                          <button onClick={() => setPayrollModal({ open: true, employee: emp, type: 'Gaji' })} className="flex-1 md:flex-none bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-500/20 transition-colors">Gaji</button>
                          <button onClick={() => setPayrollModal({ open: true, employee: emp, type: 'Kasbon' })} className="flex-1 md:flex-none bg-amber-500/10 text-amber-400 border border-amber-500/20 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-amber-500/20 transition-colors">Kasbon</button>
                          <button onClick={() => setPayrollModal({ open: true, employee: emp, type: 'Bonus' })} className="flex-1 md:flex-none bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-500/20 transition-colors">Bonus</button>
                          <button onClick={() => handleSendSalaryWA(emp)} className="flex-1 md:flex-none bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-[#25D366]/20 flex items-center gap-1 justify-center transition-colors">
                            <Icons.WhatsApp /> WA
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {employees.length === 0 && <div className="p-10 text-center text-slate-500 font-bold border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-base">Belum ada data karyawan.</div>}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* MODAL EXPENSE */}
      {expenseModal && (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="owner-3d bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 w-full max-w-md p-8 rounded-3xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-black mb-6 text-slate-900 dark:text-white">Catat Biaya Bulanan</h3>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Pilih Cabang</label>
                <select value={formExpense.tenant_id} onChange={e => setFormExpense({...formExpense, tenant_id: e.target.value})} className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-[#04060B] border border-slate-300 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-[#2563EB]">
                  {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Keterangan Biaya</label>
                <input type="text" required value={formExpense.description} onChange={e => setFormExpense({...formExpense, description: e.target.value})} placeholder="Contoh: Sewa Kios, Token Listrik, WiFi" className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-[#04060B] border border-slate-300 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-[#2563EB]" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nominal (Rp)</label>
                <input type="number" required value={formExpense.amount} onChange={e => setFormExpense({...formExpense, amount: e.target.value})} className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-[#04060B] border border-slate-300 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-[#2563EB]" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setExpenseModal(false)} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold py-3.5 rounded-xl hover:bg-slate-200 transition-colors">Batal</button>
                <button type="submit" className="flex-1 bg-[#2563EB] text-white font-black py-3.5 rounded-xl shadow-[0_4px_12px_-2px_rgba(37,99,235,0.5)]">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EMPLOYEE */}
      {employeeModal.open && (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="owner-3d bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 w-full max-w-md p-8 rounded-3xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-black mb-6 text-slate-900 dark:text-white">{formEmployee.id ? 'Edit Karyawan' : 'Tambah Karyawan'}</h3>
            <form onSubmit={handleSaveEmployee} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Pilih Cabang</label>
                <select value={formEmployee.tenant_id} onChange={e => setFormEmployee({...formEmployee, tenant_id: e.target.value})} className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-[#04060B] border border-slate-300 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-[#EA8B42]">
                  {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nama Lengkap</label>
                  <input type="text" required value={formEmployee.name} onChange={e => setFormEmployee({...formEmployee, name: e.target.value})} className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-[#04060B] border border-slate-300 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-[#EA8B42]" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">No. WhatsApp</label>
                  <input type="tel" value={formEmployee.wa_number} onChange={e => setFormEmployee({...formEmployee, wa_number: e.target.value})} placeholder="0812..." className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-[#04060B] border border-slate-300 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-[#EA8B42]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Alamat</label>
                <input type="text" value={formEmployee.address} onChange={e => setFormEmployee({...formEmployee, address: e.target.value})} className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-[#04060B] border border-slate-300 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-[#EA8B42]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Jabatan</label>
                  <select value={formEmployee.role} onChange={e => setFormEmployee({...formEmployee, role: e.target.value})} className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-[#04060B] border border-slate-300 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-[#EA8B42]">
                    <option>Kasir</option>
                    <option>Koki / Barista</option>
                    <option>Pelayan</option>
                    <option>Manager</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Gaji Pokok (Rp)</label>
                  <input type="number" required value={formEmployee.base_salary} onChange={e => setFormEmployee({...formEmployee, base_salary: e.target.value})} className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-[#04060B] border border-slate-300 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-[#EA8B42]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nama Bank</label>
                  <input type="text" value={formEmployee.bank_name} onChange={e => setFormEmployee({...formEmployee, bank_name: e.target.value})} placeholder="BCA / Mandiri" className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-[#04060B] border border-slate-300 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-[#EA8B42]" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">No. Rekening</label>
                  <input type="text" value={formEmployee.bank_account} onChange={e => setFormEmployee({...formEmployee, bank_account: e.target.value})} placeholder="12345678" className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-[#04060B] border border-slate-300 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-[#EA8B42]" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setEmployeeModal({ open: false, data: null })} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold py-3.5 rounded-xl hover:bg-slate-200 transition-colors">Batal</button>
                <button type="submit" className="flex-1 bg-[#EA8B42] text-white font-black py-3.5 rounded-xl shadow-[0_4px_12px_-2px_rgba(234,139,66,0.5)]">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PAYROLL */}
      {payrollModal.open && (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="owner-3d bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 w-full max-w-md p-8 rounded-3xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                payrollModal.type === 'Gaji' ? 'bg-blue-500/10 text-blue-500' : 
                payrollModal.type === 'Kasbon' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
              }`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Catat {payrollModal.type}</h3>
                <p className="text-sm font-bold text-slate-500">{payrollModal.employee.name}</p>
              </div>
            </div>
            
            <form onSubmit={handlePayroll} className="space-y-4 mt-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nominal (Rp)</label>
                <input type="number" required value={formPayroll.amount} onChange={e => setFormPayroll({...formPayroll, amount: e.target.value})} placeholder={payrollModal.type === 'Gaji' ? payrollModal.employee.base_salary : ''} className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-[#04060B] border border-slate-300 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-[#2563EB]" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Catatan (Opsional)</label>
                <input type="text" value={formPayroll.notes} onChange={e => setFormPayroll({...formPayroll, notes: e.target.value})} placeholder={`Contoh: ${payrollModal.type} Bulan Ini`} className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-[#04060B] border border-slate-300 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-[#2563EB]" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setPayrollModal({ open: false, employee: null, type: 'Gaji' })} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold py-3.5 rounded-xl hover:bg-slate-200 transition-colors">Batal</button>
                <button type="submit" className="flex-1 bg-[#2563EB] text-white font-black py-3.5 rounded-xl shadow-[0_4px_12px_-2px_rgba(37,99,235,0.5)]">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM MODAL */}
      {confirmModal.open && (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-md z-[150] flex items-center justify-center p-4">
          <div className="owner-3d bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 w-full max-w-sm rounded-3xl p-6 relative overflow-hidden animate-in zoom-in-95 duration-200">
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

      {/* TOAST */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-[200] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl border backdrop-blur-xl owner-3d ${toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'}`}>
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