'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const Icons = {
  Sun: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  Moon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  Overview: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="w-5 h-5 shrink-0"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
  Finance: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="w-5 h-5 shrink-0"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  Reports: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="w-5 h-5 shrink-0"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  Settings: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5 shrink-0"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Logout: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 shrink-0"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Trash: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-4 h-4"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Edit: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-4 h-4"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
};

export default function OwnerFinance() {
  const [userEmail, setUserEmail] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('expenses_daily');

  const [tenants, setTenants] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [menus, setMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showInactiveEmployees, setShowInactiveEmployees] = useState(false);

  const [expenseModal, setExpenseModal] = useState(false);
  const [formExpense, setFormExpense] = useState({ tenant_id: '', category: 'Bulanan', description: '', amount: '' });

  const [employeeModal, setEmployeeModal] = useState({ open: false, data: null });
  const [payrollModal, setPayrollModal] = useState({ open: false, employee: null, type: 'Gaji' });

  const [formEmployee, setFormEmployee] = useState({
    id: null, tenant_id: '', name: '', role: 'Kasir', base_salary: '',
    wa_number: '', address: '', bank_name: '', bank_account: ''
  });
  const [formPayroll, setFormPayroll] = useState({ amount: '', notes: '' });

  const [stockBranchFilter, setStockBranchFilter] = useState('all');
  const [stockSearch, setStockSearch] = useState('');
  const [stockModal, setStockModal] = useState({ open: false, menu: null, mode: 'add', qty: '' });
  const [isUpdatingStock, setIsUpdatingStock] = useState(false);

  const [menuModal, setMenuModal] = useState({ open: false, mode: 'add' });
  const [isSavingMenu, setIsSavingMenu] = useState(false);
  const [formMenu, setFormMenu] = useState({
    id: null,
    tenant_id: '',
    name: '',
    category: 'makanan',
    price: '',
    cost_price: '',
    discount_price: '',
    promo_hours: '0',
    promo_expires_at: null,
    is_featured: false,
    is_new: false,
    stock: '20',
    description: '',
    image_url: ''
  });

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    title: '',
    message: '',
    confirmText: 'Hapus',
    isDanger: false,
    onConfirm: null,
    loading: false
  });

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('nexaflow_theme');
      if (savedTheme === 'dark') setIsDarkMode(true);
      else setIsDarkMode(false);
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    try {
      localStorage.setItem('nexaflow_theme', isDarkMode ? 'dark' : 'light');
    } catch (e) {}
  }, [isDarkMode]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3500);
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
        setMenus(data.menus || []);
        if (data.tenants.length > 0) {
          setFormEmployee(prev => ({ ...prev, tenant_id: prev.tenant_id || data.tenants[0].id }));
          setFormExpense(prev => ({ ...prev, tenant_id: prev.tenant_id || data.tenants[0].id }));
          setFormMenu(prev => ({ ...prev, tenant_id: prev.tenant_id || data.tenants[0].id }));
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
        payload: { ...formExpense, quantity: 1, unit_price: Number(formExpense.amount) }
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

  const handleOpenAddMenu = () => {
    setFormMenu({
      id: null,
      tenant_id: stockBranchFilter !== 'all' ? stockBranchFilter : (tenants[0]?.id || ''),
      name: '',
      category: 'makanan',
      price: '',
      cost_price: '',
      discount_price: '',
      promo_hours: '0',
      promo_expires_at: null,
      is_featured: false,
      is_new: false,
      stock: '20',
      description: '',
      image_url: ''
    });
    setMenuModal({ open: true, mode: 'add' });
  };

  const handleOpenEditMenu = (m) => {
    setFormMenu({
      id: m.id,
      tenant_id: m.tenant_id,
      name: m.name || '',
      category: m.category || 'makanan',
      price: String(m.price || ''),
      cost_price: String(m.cost_price || ''),
      discount_price: m.discount_price ? String(m.discount_price) : '',
      promo_hours: '0',
      promo_expires_at: m.promo_expires_at || null,
      is_featured: Boolean(m.is_featured),
      is_new: Boolean(m.is_new),
      stock: String(m.stock ?? 0),
      description: m.description || '',
      image_url: m.image_url || ''
    });
    setMenuModal({ open: true, mode: 'edit' });
  };

  const handleSaveMenu = async (e) => {
    e.preventDefault();
    setIsSavingMenu(true);
    try {
      const action = menuModal.mode === 'edit' ? 'edit_menu' : 'add_menu';
      const res = await fetch('/api/owner/finance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          manager_email: userEmail,
          payload: formMenu
        })
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message);
        setMenuModal({ open: false, mode: 'add' });
        fetchData(userEmail);
      } else {
        showToast(data.error || 'Gagal menyimpan menu', 'error');
      }
    } catch (err) {
      showToast('Gagal menghubungi server', 'error');
    } finally {
      setIsSavingMenu(false);
    }
  };

  const handleQuickAddStock = async (menu, addQty) => {
    const nextStock = Math.max(0, Number(menu.stock || 0) + Number(addQty));
    try {
      const res = await fetch('/api/owner/finance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_menu_stock',
          manager_email: userEmail,
          payload: { tenant_id: menu.tenant_id, menu_id: menu.id, new_stock: nextStock }
        })
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`${menu.name}: +${addQty} pcs (Total: ${nextStock} pcs)`);
        fetchData(userEmail);
      } else showToast(data.error || 'Gagal memperbarui stok', 'error');
    } catch (err) {
      showToast('Gagal menghubungi server', 'error');
    }
  };

  const handleSaveStockModal = async (e) => {
    e.preventDefault();
    if (!stockModal.menu) return;
    const inputNum = Number(stockModal.qty || 0);
    const currentStock = Number(stockModal.menu.stock || 0);
    const nextStock = stockModal.mode === 'add' ? Math.max(0, currentStock + inputNum) : Math.max(0, inputNum);

    setIsUpdatingStock(true);
    try {
      const res = await fetch('/api/owner/finance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_menu_stock',
          manager_email: userEmail,
          payload: { tenant_id: stockModal.menu.tenant_id, menu_id: stockModal.menu.id, new_stock: nextStock }
        })
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message);
        setStockModal({ open: false, menu: null, mode: 'add', qty: '' });
        fetchData(userEmail);
      } else showToast(data.error || 'Gagal memperbarui stok', 'error');
    } catch (err) {
      showToast('Gagal menghubungi server', 'error');
    } finally {
      setIsUpdatingStock(false);
    }
  };

  const handleDelete = (type, id) => {
    const isExpense = type === 'expense';
    const isMenu = type === 'menu';
    setConfirmModal({
      open: true,
      title: isMenu ? 'Hapus Menu Permanen' : isExpense ? 'Hapus Pengeluaran' : 'Nonaktifkan Karyawan',
      message: isMenu
        ? 'Yakin ingin menghapus menu ini dari QR pelanggan & kasir?'
        : isExpense
        ? 'Yakin ingin menghapus data pengeluaran ini? Tindakan ini tidak dapat dibatalkan.'
        : 'Karyawan akan dinonaktifkan dari daftar aktif, tetapi seluruh riwayat gaji, bonus, dan kasbon tetap tersimpan aman di laporan P&L.',
      confirmText: isMenu || isExpense ? 'Hapus' : 'Nonaktifkan',
      isDanger: true,
      loading: false,
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, loading: true }));
        try {
          const action = isMenu ? 'delete_menu' : isExpense ? 'delete_expense' : 'delete_employee';
          const res = await fetch('/api/owner/finance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, manager_email: userEmail, payload: { id } })
          });
          const data = await res.json();
          if (res.ok) {
            showToast(data.message);
            fetchData(userEmail);
            setConfirmModal({ open: false, title: '', message: '', confirmText: 'Hapus', isDanger: false, onConfirm: null, loading: false });
          } else throw new Error(data.error);
        } catch (err) {
          showToast(err.message, 'error');
          setConfirmModal({ open: false, title: '', message: '', confirmText: 'Hapus', isDanger: false, onConfirm: null, loading: false });
        }
      }
    });
  };
  const handleRestoreEmployee = async (emp) => {
    try {
      const res = await fetch('/api/owner/finance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'restore_employee', manager_email: userEmail, payload: { id: emp.id } })
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message);
        fetchData(userEmail);
      } else showToast(data.error || 'Gagal mengaktifkan karyawan', 'error');
    } catch (err) {
      showToast('Gagal menghubungi server', 'error');
    }
  };

  const handleSendSalaryWA = (emp) => {
    if (!emp.wa_number) return showToast('Nomor WA karyawan belum diisi', 'error');
    const empTrans = transactions.filter(t => t.employee_id === emp.id);
    const totalKasbon = empTrans.filter(t => t.type === 'Kasbon').reduce((s, t) => s + t.amount, 0);
    const totalBonus = empTrans.filter(t => t.type === 'Bonus').reduce((s, t) => s + t.amount, 0);
    const gajiBersih = Number(emp.base_salary) + totalBonus - totalKasbon;
    const tenantName = tenants.find(t => t.id === emp.tenant_id)?.name || 'Kafe';

    let msg = `Halo *${emp.name}*,\n\nBerikut rincian gaji Anda di *${tenantName}*:\n----------------------------\n`;
    msg += `Gaji Pokok   : Rp ${Number(emp.base_salary).toLocaleString('id-ID')}\n`;
    msg += `Bonus        : + Rp ${totalBonus.toLocaleString('id-ID')}\n`;
    msg += `Kasbon       : - Rp ${totalKasbon.toLocaleString('id-ID')}\n----------------------------\n`;
    msg += `*Total Diterima: Rp ${gajiBersih.toLocaleString('id-ID')}*\n\n`;
    if (emp.bank_name && emp.bank_account) {
      msg += `Silakan transfer ke rekening:\nBank: *${emp.bank_name}*\nNo. Rek: *${emp.bank_account}*\nA/N: ${emp.name}\n\n`;
    }
    msg += `Terima kasih atas kerja kerasnya!`;

    const phone = emp.wa_number.replace(/^0/, '62').replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const formatRp = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num || 0);

  const expensesDaily = expenses.filter(ex => ex.category === 'Harian');
  const expensesMonthly = expenses.filter(ex => ex.category !== 'Harian');
  const totalGajiBulanIni = transactions.filter(t => t.type === 'Gaji').reduce((sum, t) => sum + Number(t.amount), 0);
  const totalPengeluaranBulanan = expensesMonthly.reduce((sum, ex) => sum + Number(ex.amount), 0) + totalGajiBulanIni;
  const totalPengeluaranHarian = expensesDaily.reduce((sum, ex) => sum + Number(ex.amount), 0);

  const activeEmployees = useMemo(() => employees.filter(emp => emp.is_active !== false), [employees]);
  const inactiveEmployees = useMemo(() => employees.filter(emp => emp.is_active === false), [employees]);
  const displayedEmployees = showInactiveEmployees ? inactiveEmployees : activeEmployees;

  const lowStockCount = useMemo(() => menus.filter(m => Number(m.stock) <= 10).length, [menus]);

  const filteredMenus = useMemo(() => {
    return menus.filter(m => {
      const matchBranch = stockBranchFilter === 'all' || m.tenant_id === stockBranchFilter;
      const matchSearch = !stockSearch.trim() || m.name.toLowerCase().includes(stockSearch.trim().toLowerCase());
      return matchBranch && matchSearch;
    });
  }, [menus, stockBranchFilter, stockSearch]);

  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const isEndOfMonth = new Date().getDate() >= 25;

  const modalSellPrice = Number(formMenu.discount_price) > 0 && Number(formMenu.discount_price) < Number(formMenu.price)
    ? Number(formMenu.discount_price)
    : Number(formMenu.price || 0);
  const modalCostPrice = Number(formMenu.cost_price || 0);
  const modalNetMargin = modalSellPrice - modalCostPrice;
  const modalMarginPct = modalSellPrice > 0 ? Math.round((modalNetMargin / modalSellPrice) * 100) : 0;

  return (
    <div className="bg-[#F4EFE9] text-[#1A1512] dark:bg-[#0a192f] dark:text-white min-h-screen font-sans">
      <style>{`
        .num-tabular { font-variant-numeric: tabular-nums; letter-spacing: -0.02em; }
        .owner-card { box-shadow: 0 2px 8px rgba(26, 21, 18, 0.06); }
        .dark .owner-card { box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      <div className="flex min-h-screen">
        <aside className="group hidden lg:flex w-[80px] hover:w-64 transition-[width] duration-200 ease-out bg-[#2A1F17] text-white dark:bg-slate-900 border-r-2 border-[#1A1512] dark:border-slate-700 flex-col justify-between z-50 shrink-0 h-screen sticky top-0 overflow-hidden">
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="h-20 flex items-center px-5 border-b border-white/15 dark:border-slate-700 shrink-0 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 p-1 shadow-sm">
                <img src="/logo-nexaflow-3d.png" alt="NF" className="w-full h-full object-contain" />
              </div>
              <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                <p className="text-base font-black tracking-tight text-white leading-none">NEXAFLOW</p>
                <p className="text-[11px] font-extrabold text-amber-400 tracking-wider uppercase mt-1">Owner Panel</p>
              </div>
            </div>

            <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto overflow-x-hidden">
              <Link href="/owner" className="flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-stone-200 dark:text-slate-200 hover:bg-white/10 dark:hover:bg-slate-800 hover:text-white text-xs font-bold transition-colors whitespace-nowrap">
                <Icons.Overview />
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">Command Center AI</span>
              </Link>
              <Link href="/owner/finance" className="flex items-center gap-3.5 px-3.5 py-3 rounded-xl bg-[#2563EB] text-white text-xs font-black border border-blue-400/40 whitespace-nowrap">
                <Icons.Finance />
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">Keuangan & Menu</span>
              </Link>
              <Link href="/owner/reports" className="flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-stone-200 dark:text-slate-200 hover:bg-white/10 dark:hover:bg-slate-800 hover:text-white text-xs font-bold transition-colors whitespace-nowrap">
                <Icons.Reports />
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">Laporan Global P&L</span>
              </Link>
              <Link href="/owner/settings" className="flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-stone-200 dark:text-slate-200 hover:bg-white/10 dark:hover:bg-slate-800 hover:text-white text-xs font-bold transition-colors whitespace-nowrap">
                <Icons.Settings />
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">Pengaturan & AI Key</span>
              </Link>
            </nav>
          </div>

          <div className="p-3 border-t border-white/15 dark:border-slate-700 space-y-3 shrink-0">
            <div className="px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap overflow-hidden">
              <p className="text-xs font-black text-white truncate">{userEmail || 'Owner'}</p>
              <p className="text-[11px] font-bold text-amber-300 dark:text-slate-300 mt-0.5">{tenants.length} Cabang Terdaftar</p>
            </div>
            <button type="button" onClick={handleLogout} className="w-full flex items-center justify-center gap-2.5 py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black transition-colors whitespace-nowrap">
              <Icons.Logout />
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">Logout</span>
            </button>
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="lg:hidden bg-[#2A1F17] dark:bg-slate-900 border-b-2 border-[#1A1512] dark:border-slate-700 px-4 py-2.5 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5">
              <Link href="/owner" className="px-3 py-1.5 rounded-lg text-stone-200 text-xs font-bold whitespace-nowrap">Overview</Link>
              <Link href="/owner/finance" className="px-3 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-black whitespace-nowrap">Keuangan & Menu</Link>
              <Link href="/owner/reports" className="px-3 py-1.5 rounded-lg text-stone-200 text-xs font-bold whitespace-nowrap">Laporan</Link>
              <Link href="/owner/settings" className="px-3 py-1.5 rounded-lg text-stone-200 text-xs font-bold whitespace-nowrap">Pengaturan</Link>
            </div>
            <button type="button" onClick={() => setIsDarkMode(!isDarkMode)} className="p-1.5 rounded-lg bg-white/10 text-amber-300 shrink-0">
              {isDarkMode ? <Icons.Sun /> : <Icons.Moon />}
            </button>
          </div>

          <header className="bg-white dark:bg-slate-900 border-b-2 border-[#E0D6CC] dark:border-slate-700 px-5 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
            <div>
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-[#1A1512] dark:text-white">Keuangan, Karyawan & Master Menu</h1>
              <p className="text-xs font-bold text-[#5C4B3E] dark:text-slate-300">Kendali pusat pengeluaran, gaji staf, HPP modal, promo & stok cabang</p>
            </div>
            <button type="button" onClick={() => setIsDarkMode(!isDarkMode)} title="Ubah Tema" className="hidden lg:inline-flex p-2 rounded-xl bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 text-[#1A1512] dark:text-amber-400">
              {isDarkMode ? <Icons.Sun /> : <Icons.Moon />}
            </button>
          </header>

          <main className="p-5 sm:p-8 max-w-6xl w-full mx-auto space-y-6">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              <button type="button" onClick={() => setActiveTab('expenses_daily')} className={`px-4 py-2.5 rounded-xl text-xs font-black whitespace-nowrap border-2 ${activeTab === 'expenses_daily' ? 'bg-[#2A1F17] dark:bg-[#2563EB] text-white border-[#1A1512] dark:border-blue-500' : 'bg-white dark:bg-slate-900 border-[#E0D6CC] dark:border-slate-700 text-[#1A1512] dark:text-slate-100'}`}>
                Pengeluaran Harian (Kasir)
              </button>
              <button type="button" onClick={() => setActiveTab('expenses_monthly')} className={`px-4 py-2.5 rounded-xl text-xs font-black whitespace-nowrap border-2 ${activeTab === 'expenses_monthly' ? 'bg-[#2A1F17] dark:bg-[#2563EB] text-white border-[#1A1512] dark:border-blue-500' : 'bg-white dark:bg-slate-900 border-[#E0D6CC] dark:border-slate-700 text-[#1A1512] dark:text-slate-100'}`}>
                Biaya Bulanan (Fixed Cost)
              </button>
              <button type="button" onClick={() => setActiveTab('employees')} className={`px-4 py-2.5 rounded-xl text-xs font-black whitespace-nowrap border-2 ${activeTab === 'employees' ? 'bg-[#2A1F17] dark:bg-[#2563EB] text-white border-[#1A1512] dark:border-blue-500' : 'bg-white dark:bg-slate-900 border-[#E0D6CC] dark:border-slate-700 text-[#1A1512] dark:text-slate-100'}`}>
                Data Karyawan & Gaji
              </button>
              <button type="button" onClick={() => setActiveTab('stocks')} className={`px-4 py-2.5 rounded-xl text-xs font-black whitespace-nowrap border-2 flex items-center gap-2 ${activeTab === 'stocks' ? 'bg-[#2A1F17] dark:bg-[#2563EB] text-white border-[#1A1512] dark:border-blue-500' : 'bg-white dark:bg-slate-900 border-[#E0D6CC] dark:border-slate-700 text-[#1A1512] dark:text-slate-100'}`}>
                <span>Master Menu, HPP & Promo</span>
                {lowStockCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500 text-[#1A1512] text-[10px] font-black">{lowStockCount}</span>
                )}
              </button>
            </div>

            {activeTab === 'expenses_daily' && (
              <div className="space-y-4">
                <div className="owner-card bg-white dark:bg-slate-900 border-2 border-[#E0D6CC] dark:border-slate-700 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-bold text-[#5C4B3E] dark:text-slate-200">Catatan pengeluaran harian yang diinput oleh Kasir (bahan baku, gas, es, dll).</p>
                  <span className="text-sm font-black text-rose-600 dark:text-rose-400 num-tabular">Total: {formatRp(totalPengeluaranHarian)}</span>
                </div>

                <div className="owner-card bg-white dark:bg-slate-900 border-2 border-[#E0D6CC] dark:border-slate-700 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b-2 border-[#E0D6CC] dark:border-slate-700 text-xs font-black uppercase text-[#5C4B3E] dark:text-slate-300 bg-[#FAF6F2] dark:bg-slate-800/50">
                          <th className="py-3.5 px-6">Tanggal</th>
                          <th className="py-3.5 px-4">Cabang</th>
                          <th className="py-3.5 px-4">Keterangan</th>
                          <th className="py-3.5 px-4">Nominal</th>
                          <th className="py-3.5 px-6 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y-2 divide-[#F4EFE9] dark:divide-slate-800 text-xs">
                        {isLoading ? (
                          <tr><td colSpan="5" className="py-8 text-center font-bold text-[#5C4B3E] dark:text-slate-300">Memuat data...</td></tr>
                        ) : expensesDaily.map(ex => {
                          const safeUnitPrice = Number(ex.unit_price) || (Number(ex.amount) / (Number(ex.quantity) || 1));
                          return (
                            <tr key={ex.id} className="hover:bg-[#FAF6F2] dark:hover:bg-slate-800/50">
                              <td className="py-3.5 px-6 font-bold text-[#5C4B3E] dark:text-slate-300 whitespace-nowrap">{new Date(ex.expense_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                              <td className="py-3.5 px-4 font-black text-[#1A1512] dark:text-white">{tenants.find(t => t.id === ex.tenant_id)?.name || '-'}</td>
                              <td className="py-3.5 px-4">
                                <span className="font-extrabold text-[#1A1512] dark:text-white">{ex.description || '-'}</span>
                                <span className="text-[#5C4B3E] dark:text-slate-300 font-bold ml-2">({ex.quantity || 1} x {formatRp(safeUnitPrice)})</span>
                              </td>
                              <td className="py-3.5 px-4 font-black text-rose-600 dark:text-rose-400 num-tabular whitespace-nowrap">-{formatRp(ex.amount)}</td>
                              <td className="py-3.5 px-6 text-right">
                                <button onClick={() => handleDelete('expense', ex.id)} className="p-2 rounded-lg bg-[#FAF6F2] dark:bg-slate-800 border border-[#E0D6CC] dark:border-slate-600 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white" title="Hapus"><Icons.Trash /></button>
                              </td>
                            </tr>
                          );
                        })}
                        {!isLoading && expensesDaily.length === 0 && (
                          <tr><td colSpan="5" className="py-8 text-center font-bold text-[#5C4B3E] dark:text-slate-300">Belum ada pengeluaran harian dari kasir.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'expenses_monthly' && (
              <div className="space-y-4">
                <div className="owner-card bg-white dark:bg-slate-900 border-2 border-[#E0D6CC] dark:border-slate-700 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-6">
                    <div>
                      <p className="text-xs font-black text-[#5C4B3E] dark:text-slate-300 uppercase">Total Beban Bulanan + Gaji</p>
                      <p className="text-lg font-black text-rose-600 dark:text-rose-400 num-tabular mt-0.5">{formatRp(totalPengeluaranBulanan)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-black text-[#5C4B3E] dark:text-slate-300 uppercase">Gaji Dibayarkan</p>
                      <p className="text-lg font-black text-[#1A1512] dark:text-white num-tabular mt-0.5">{formatRp(totalGajiBulanIni)}</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => { setFormExpense({ ...formExpense, category: 'Bulanan' }); setExpenseModal(true); }} className="px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-black transition-colors">+ Catat Biaya Bulanan</button>
                </div>

                <div className="owner-card bg-white dark:bg-slate-900 border-2 border-[#E0D6CC] dark:border-slate-700 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b-2 border-[#E0D6CC] dark:border-slate-700 text-xs font-black uppercase text-[#5C4B3E] dark:text-slate-300 bg-[#FAF6F2] dark:bg-slate-800/50">
                          <th className="py-3.5 px-6">Tanggal</th>
                          <th className="py-3.5 px-4">Cabang</th>
                          <th className="py-3.5 px-4">Keterangan Biaya</th>
                          <th className="py-3.5 px-4">Nominal</th>
                          <th className="py-3.5 px-6 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y-2 divide-[#F4EFE9] dark:divide-slate-800 text-xs">
                        {expensesMonthly.map(ex => (
                          <tr key={ex.id} className="hover:bg-[#FAF6F2] dark:hover:bg-slate-800/50">
                            <td className="py-3.5 px-6 font-bold text-[#5C4B3E] dark:text-slate-300 whitespace-nowrap">{new Date(ex.expense_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                            <td className="py-3.5 px-4 font-black text-[#1A1512] dark:text-white">{tenants.find(t => t.id === ex.tenant_id)?.name || '-'}</td>
                            <td className="py-3.5 px-4 font-extrabold text-[#1A1512] dark:text-slate-100">{ex.description || '-'}</td>
                            <td className="py-3.5 px-4 font-black text-rose-600 dark:text-rose-400 num-tabular whitespace-nowrap">-{formatRp(ex.amount)}</td>
                            <td className="py-3.5 px-6 text-right">
                              <button onClick={() => handleDelete('expense', ex.id)} className="p-2 rounded-lg bg-[#FAF6F2] dark:bg-slate-800 border border-[#E0D6CC] dark:border-slate-600 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white" title="Hapus"><Icons.Trash /></button>
                            </td>
                          </tr>
                        ))}
                        {expensesMonthly.length === 0 && (
                          <tr><td colSpan="5" className="py-8 text-center font-bold text-[#5C4B3E] dark:text-slate-300">Belum ada catatan biaya bulanan.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'employees' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <button type="button" onClick={() => setShowInactiveEmployees(false)} className={`px-3.5 py-2 rounded-xl text-xs font-black border-2 transition-colors ${!showInactiveEmployees ? 'bg-[#2A1F17] dark:bg-[#2563EB] text-white border-[#1A1512] dark:border-blue-500' : 'bg-white dark:bg-slate-900 border-[#E0D6CC] dark:border-slate-700 text-[#5C4B3E] dark:text-slate-300'}`}>Aktif ({activeEmployees.length})</button>
                    <button type="button" onClick={() => setShowInactiveEmployees(true)} className={`px-3.5 py-2 rounded-xl text-xs font-black border-2 transition-colors ${showInactiveEmployees ? 'bg-[#2A1F17] dark:bg-[#2563EB] text-white border-[#1A1512] dark:border-blue-500' : 'bg-white dark:bg-slate-900 border-[#E0D6CC] dark:border-slate-700 text-[#5C4B3E] dark:text-slate-300'}`}>Nonaktif ({inactiveEmployees.length})</button>
                  </div>
                  <button type="button" onClick={() => { setFormEmployee({ id: null, tenant_id: tenants[0]?.id || '', name: '', role: 'Kasir', base_salary: '', wa_number: '', address: '', bank_name: '', bank_account: '' }); setEmployeeModal({ open: true, data: null }); }} className="px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-black transition-colors">+ Tambah Karyawan</button>
                </div>

                <div className="space-y-3">
                  {displayedEmployees.map(emp => {
                    const empTrans = transactions.filter(t => t.employee_id === emp.id);
                    const totalKasbon = empTrans.filter(t => t.type === 'Kasbon').reduce((s, t) => s + t.amount, 0);
                    const totalBonus = empTrans.filter(t => t.type === 'Bonus').reduce((s, t) => s + t.amount, 0);
                    const hasBeenPaidThisMonth = empTrans.some(t => t.type === 'Gaji' && t.transaction_date.startsWith(currentMonthStr));
                    const isActive = emp.is_active !== false;
                    const showSalaryReminder = isActive && isEndOfMonth && !hasBeenPaidThisMonth;

                    return (
                      <div key={emp.id} className={`owner-card bg-white dark:bg-slate-900 border-2 border-[#E0D6CC] dark:border-slate-700 rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${!isActive ? 'opacity-80' : ''}`}>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-black text-[#1A1512] dark:text-white">{emp.name}</p>
                            {!isActive && <span className="px-2.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-black">Nonaktif</span>}
                            {showSalaryReminder && <span className="px-2.5 py-0.5 rounded bg-rose-600 text-white text-[10px] font-black">Belum Digaji</span>}
                          </div>
                          <p className="text-xs font-bold text-[#5C4B3E] dark:text-slate-300 mt-0.5">{emp.role} · {tenants.find(t => t.id === emp.tenant_id)?.name || 'Cabang'}</p>
                        </div>

                        <div className="grid grid-cols-3 gap-6 text-xs">
                          <div>
                            <p className="font-bold text-[#5C4B3E] dark:text-slate-300">Gaji Pokok</p>
                            <p className="font-black text-[#1A1512] dark:text-white num-tabular mt-0.5">{formatRp(emp.base_salary)}</p>
                          </div>
                          <div>
                            <p className="font-bold text-[#5C4B3E] dark:text-slate-300">Kasbon</p>
                            <p className="font-black text-amber-700 dark:text-amber-400 num-tabular mt-0.5">{totalKasbon > 0 ? formatRp(totalKasbon) : '—'}</p>
                          </div>
                          <div>
                            <p className="font-bold text-[#5C4B3E] dark:text-slate-300">Bonus</p>
                            <p className="font-black text-emerald-700 dark:text-emerald-400 num-tabular mt-0.5">{totalBonus > 0 ? formatRp(totalBonus) : '—'}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {isActive ? (
                            <>
                              <button onClick={() => setPayrollModal({ open: true, employee: emp, type: 'Gaji' })} className="px-3 py-1.5 rounded-xl bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 hover:border-[#2563EB] text-xs font-black text-[#1A1512] dark:text-white">Gaji</button>
                              <button onClick={() => setPayrollModal({ open: true, employee: emp, type: 'Kasbon' })} className="px-3 py-1.5 rounded-xl bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 hover:border-amber-500 text-xs font-black text-[#1A1512] dark:text-white">Kasbon</button>
                              <button onClick={() => setPayrollModal({ open: true, employee: emp, type: 'Bonus' })} className="px-3 py-1.5 rounded-xl bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 hover:border-emerald-500 text-xs font-black text-[#1A1512] dark:text-white">Bonus</button>
                              <button onClick={() => handleSendSalaryWA(emp)} className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black">Slip WA</button>
                              <button onClick={() => handleOpenEditEmployee(emp)} className="p-2 rounded-xl bg-[#FAF6F2] dark:bg-slate-800 border border-[#E0D6CC] dark:border-slate-600 text-[#1A1512] dark:text-slate-200" title="Edit"><Icons.Edit /></button>
                              <button onClick={() => handleDelete('employee', emp.id)} className="p-2 rounded-xl bg-[#FAF6F2] dark:bg-slate-800 border border-[#E0D6CC] dark:border-slate-600 text-rose-600 dark:text-rose-400" title="Nonaktifkan"><Icons.Trash /></button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => handleSendSalaryWA(emp)} className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black">Slip WA</button>
                              <button onClick={() => handleOpenEditEmployee(emp)} className="p-2 rounded-xl bg-[#FAF6F2] dark:bg-slate-800 border border-[#E0D6CC] dark:border-slate-600 text-[#1A1512] dark:text-slate-200" title="Edit"><Icons.Edit /></button>
                              <button onClick={() => handleRestoreEmployee(emp)} className="px-3 py-1.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-black">Aktifkan Kembali</button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {displayedEmployees.length === 0 && (
                    <div className="owner-card bg-white dark:bg-slate-900 border-2 border-[#E0D6CC] dark:border-slate-700 rounded-2xl p-8 text-center text-xs font-bold text-[#5C4B3E] dark:text-slate-300">
                      {showInactiveEmployees ? 'Tidak ada karyawan nonaktif.' : 'Belum ada data karyawan aktif.'}
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* TAB 4: MASTER MENU, HPP (MODAL), PROMO & STOK EKSKLUSIF OWNER */}
            {activeTab === 'stocks' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <select value={stockBranchFilter} onChange={(e) => setStockBranchFilter(e.target.value)} className="bg-white dark:bg-slate-900 border-2 border-[#E0D6CC] dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-extrabold text-[#1A1512] dark:text-white outline-none">
                      <option value="all">Semua Cabang ({tenants.length})</option>
                      {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                    <input type="text" value={stockSearch} onChange={(e) => setStockSearch(e.target.value)} placeholder="Cari nama menu..." className="bg-white dark:bg-slate-900 border-2 border-[#E0D6CC] dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-bold text-[#1A1512] dark:text-white placeholder-[#8C7A6B] dark:placeholder-slate-400 outline-none" />
                  </div>
                  <button type="button" onClick={handleOpenAddMenu} className="px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-black transition-colors shadow-sm">
                    + Tambah Menu & HPP
                  </button>
                </div>

                <div className="owner-card bg-white dark:bg-slate-900 border-2 border-[#E0D6CC] dark:border-slate-700 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b-2 border-[#E0D6CC] dark:border-slate-700 text-xs font-black uppercase text-[#5C4B3E] dark:text-slate-300 bg-[#FAF6F2] dark:bg-slate-800/50">
                          <th className="py-3.5 px-6">Menu & Cabang</th>
                          <th className="py-3.5 px-4">Harga Jual / Promo</th>
                          <th className="py-3.5 px-4">HPP (Modal) & Margin</th>
                          <th className="py-3.5 px-4 text-center">Stok</th>
                          <th className="py-3.5 px-6 text-right">Kelola</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y-2 divide-[#F4EFE9] dark:divide-slate-800 text-xs">
                        {filteredMenus.map(m => {
                          const branchName = tenants.find(t => t.id === m.tenant_id)?.name || 'Cabang';
                          const stockNum = Number(m.stock || 0);
                          const normalPrice = Number(m.price || 0);
                          const discPrice = Number(m.discount_price || 0);
                          const isPromoExpired = m.promo_expires_at && new Date(m.promo_expires_at).getTime() <= Date.now();
                          const hasPromo = !isPromoExpired && discPrice > 0 && discPrice < normalPrice;
                          const activeSell = hasPromo ? discPrice : normalPrice;
                          const costNum = Number(m.cost_price || 0);
                          const unitMargin = activeSell - costNum;
                          const marginPct = activeSell > 0 ? Math.round((unitMargin / activeSell) * 100) : 0;

                          return (
                            <tr key={m.id} className="hover:bg-[#FAF6F2] dark:hover:bg-slate-800/50">
                              <td className="py-3.5 px-6">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <p className="font-black text-[#1A1512] dark:text-white">{m.name}</p>
                                  {m.is_featured && !isPromoExpired && (
                                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 text-[10px] font-black">Unggulan</span>
                                  )}
                                </div>
                                <p className="text-[11px] font-bold text-[#5C4B3E] dark:text-slate-300 mt-0.5">{branchName} · {m.category}</p>
                              </td>
                              <td className="py-3.5 px-4 num-tabular">
                                {hasPromo ? (
                                  <div>
                                    <span className="font-black text-rose-600 dark:text-rose-400">{formatRp(discPrice)}</span>
                                    <span className="text-[10px] font-bold line-through text-slate-400 ml-1.5">{formatRp(normalPrice)}</span>
                                  </div>
                                ) : (
                                  <span className="font-black text-[#1A1512] dark:text-white">{formatRp(normalPrice)}</span>
                                )}
                              </td>
                              <td className="py-3.5 px-4 num-tabular">
                                {costNum > 0 ? (
                                  <div>
                                    <p className="font-bold text-[#5C4B3E] dark:text-slate-300">Modal: {formatRp(costNum)}</p>
                                    <p className={`text-[11px] font-black ${unitMargin < 0 ? 'text-rose-600' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                      Laba: {formatRp(unitMargin)} ({marginPct}%)
                                    </p>
                                  </div>
                                ) : (
                                  <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">HPP belum diisi</span>
                                )}
                              </td>
                              <td className="py-3.5 px-4 text-center">
                                <span className={`px-2.5 py-1 rounded-lg font-black num-tabular ${stockNum <= 3 ? 'bg-rose-600 text-white' : stockNum <= 10 ? 'bg-amber-500 text-[#1A1512]' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300'}`}>
                                  {stockNum} pcs
                                </span>
                              </td>
                              <td className="py-3.5 px-6 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button type="button" onClick={() => handleQuickAddStock(m, 10)} className="px-2 py-1.5 rounded-lg bg-[#FAF6F2] dark:bg-slate-800 border border-[#E0D6CC] dark:border-slate-600 text-emerald-700 dark:text-emerald-400 font-black" title="Tambah 10 stok">+10</button>
                                  <button type="button" onClick={() => setStockModal({ open: true, menu: m, mode: 'add', qty: '20' })} className="px-2.5 py-1.5 rounded-lg bg-[#FAF6F2] dark:bg-slate-800 border border-[#E0D6CC] dark:border-slate-600 text-[#1A1512] dark:text-white font-black">Stok</button>
                                  <button type="button" onClick={() => handleOpenEditMenu(m)} className="px-3 py-1.5 rounded-lg bg-[#2563EB] text-white font-black">Edit / Promo</button>
                                  <button type="button" onClick={() => handleDelete('menu', m.id)} className="p-1.5 rounded-lg bg-[#FAF6F2] dark:bg-slate-800 border border-[#E0D6CC] dark:border-slate-600 text-rose-600 dark:text-rose-400" title="Hapus Menu"><Icons.Trash /></button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                        {filteredMenus.length === 0 && (
                          <tr><td colSpan="5" className="py-8 text-center font-bold text-[#5C4B3E] dark:text-slate-300">Tidak ada menu yang cocok.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* MODAL TAMBAH / EDIT MASTER MENU, HPP & PROMO (EKSKLUSIF OWNER) */}
      {menuModal.open && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border-2 border-[#E0D6CC] dark:border-slate-700 w-full max-w-lg rounded-2xl p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            <div>
              <h3 className="text-base font-black text-[#1A1512] dark:text-white">
                {menuModal.mode === 'edit' ? 'Edit Menu, HPP & Promo' : 'Tambah Menu Baru & HPP'}
              </h3>
              <p className="text-xs font-bold text-[#5C4B3E] dark:text-slate-300">Data modal HPP & pengaturan promo hanya tampil untuk Owner</p>
            </div>

            <form onSubmit={handleSaveMenu} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-[#1A1512] dark:text-slate-200 mb-1">Cabang</label>
                  <select value={formMenu.tenant_id} onChange={e => setFormMenu({ ...formMenu, tenant_id: e.target.value })} className="w-full bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1A1512] dark:text-white">
                    {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-[#1A1512] dark:text-slate-200 mb-1">Kategori</label>
                  <select value={formMenu.category} onChange={e => setFormMenu({ ...formMenu, category: e.target.value })} className="w-full bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1A1512] dark:text-white">
                    <option value="makanan">Makanan</option>
                    <option value="minuman">Minuman</option>
                    <option value="cemilan">Cemilan</option>
                    <option value="Paket Bundling">Paket Bundling</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-[#1A1512] dark:text-slate-200 mb-1">Nama Menu</label>
                <input type="text" required value={formMenu.name} onChange={e => setFormMenu({ ...formMenu, name: e.target.value })} placeholder="Contoh: Kopi Susu Aren" className="w-full bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1A1512] dark:text-white" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-[#1A1512] dark:text-slate-200 mb-1">Harga Jual Normal (Rp)</label>
                  <input type="number" required min="0" value={formMenu.price} onChange={e => setFormMenu({ ...formMenu, price: e.target.value })} placeholder="22000" className="w-full bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1A1512] dark:text-white" />
                </div>
                <div>
                  <label className="block text-xs font-black text-emerald-700 dark:text-emerald-400 mb-1">Harga Modal / HPP (Rp)</label>
                  <input type="number" min="0" value={formMenu.cost_price} onChange={e => setFormMenu({ ...formMenu, cost_price: e.target.value })} placeholder="8500" className="w-full bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1A1512] dark:text-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-rose-600 dark:text-rose-400 mb-1">Harga Promo / Coret (Opsional)</label>
                  <input type="number" min="0" value={formMenu.discount_price} onChange={e => setFormMenu({ ...formMenu, discount_price: e.target.value })} placeholder="Kosongkan jika normal" className="w-full bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1A1512] dark:text-white" />
                </div>
                <div>
                  <label className="block text-xs font-black text-[#1A1512] dark:text-slate-200 mb-1">Durasi Promo</label>
                  <select value={formMenu.promo_hours} onChange={e => setFormMenu({ ...formMenu, promo_hours: e.target.value })} className="w-full bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1A1512] dark:text-white">
                    <option value="0">Tanpa Batas Waktu / Pertahankan</option>
                    <option value="1">1 Jam (Flash Sale)</option>
                    <option value="3">3 Jam (Happy Hour)</option>
                    <option value="6">6 Jam</option>
                    <option value="24">24 Jam (1 Hari)</option>
                  </select>
                </div>
              </div>

              {modalSellPrice > 0 && (
                <div className={`p-3 rounded-xl border-2 flex items-center justify-between text-xs ${modalNetMargin < 0 ? 'bg-rose-50 border-rose-300 text-rose-700 dark:bg-rose-950/40 dark:border-rose-700 dark:text-rose-300' : 'bg-emerald-50 border-emerald-300 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-700 dark:text-emerald-300'}`}>
                  <span className="font-bold">Estimasi Laba Bersih / Porsi:</span>
                  <span className="font-black num-tabular">{formatRp(modalNetMargin)} ({modalMarginPct}%)</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block text-xs font-black text-[#1A1512] dark:text-slate-200 mb-1">Stok Awal (Porsi)</label>
                  <input type="number" min="0" required value={formMenu.stock} onChange={e => setFormMenu({ ...formMenu, stock: e.target.value })} className="w-full bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1A1512] dark:text-white" />
                </div>
                <div className="flex flex-col gap-2 pt-4">
                  <label className="flex items-center gap-2 text-xs font-black text-[#1A1512] dark:text-slate-200 cursor-pointer">
                    <input type="checkbox" checked={formMenu.is_featured} onChange={e => setFormMenu({ ...formMenu, is_featured: e.target.checked })} className="w-4 h-4 rounded" />
                    Tampilkan di Unggulan QR
                  </label>
                  <label className="flex items-center gap-2 text-xs font-black text-[#1A1512] dark:text-slate-200 cursor-pointer">
                    <input type="checkbox" checked={formMenu.is_new} onChange={e => setFormMenu({ ...formMenu, is_new: e.target.checked })} className="w-4 h-4 rounded" />
                    Tandai Menu Baru
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-[#1A1512] dark:text-slate-200 mb-1">Deskripsi Singkat (Opsional)</label>
                <input type="text" value={formMenu.description} onChange={e => setFormMenu({ ...formMenu, description: e.target.value })} placeholder="Komposisi atau rasa menu..." className="w-full bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1A1512] dark:text-white" />
              </div>

              <div>
                <label className="block text-xs font-black text-[#1A1512] dark:text-slate-200 mb-1">URL Gambar Menu (Opsional)</label>
                <input type="text" value={formMenu.image_url} onChange={e => setFormMenu({ ...formMenu, image_url: e.target.value })} placeholder="https://..." className="w-full bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1A1512] dark:text-white" />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setMenuModal({ open: false, mode: 'add' })} className="flex-1 py-2.5 rounded-xl border-2 border-[#E0D6CC] dark:border-slate-600 text-xs font-black text-[#1A1512] dark:text-slate-200">Batal</button>
                <button type="submit" disabled={isSavingMenu} className="flex-1 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-black">{isSavingMenu ? 'Menyimpan...' : 'Simpan Menu'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {stockModal.open && stockModal.menu && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border-2 border-[#E0D6CC] dark:border-slate-700 w-full max-w-md rounded-2xl p-6 space-y-4">
            <div>
              <h3 className="text-base font-black text-[#1A1512] dark:text-white">Atur Stok Menu</h3>
              <p className="text-xs font-bold text-[#5C4B3E] dark:text-slate-300 mt-0.5">{stockModal.menu.name} · Stok saat ini: {stockModal.menu.stock} pcs</p>
            </div>
            <form onSubmit={handleSaveStockModal} className="space-y-4">
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-700">
                <button type="button" onClick={() => setStockModal(prev => ({ ...prev, mode: 'add' }))} className={`py-2 rounded-lg text-xs font-black ${stockModal.mode === 'add' ? 'bg-[#2563EB] text-white' : 'text-[#5C4B3E] dark:text-slate-300'}`}>+ Tambah Stok</button>
                <button type="button" onClick={() => setStockModal(prev => ({ ...prev, mode: 'set', qty: String(stockModal.menu.stock || 0) }))} className={`py-2 rounded-lg text-xs font-black ${stockModal.mode === 'set' ? 'bg-[#2563EB] text-white' : 'text-[#5C4B3E] dark:text-slate-300'}`}>Setel Angka Pasti</button>
              </div>
              <div>
                <label className="block text-xs font-black text-[#1A1512] dark:text-slate-200 mb-1">{stockModal.mode === 'add' ? 'Jumlah Porsi Ditambahkan' : 'Total Stok Baru'}</label>
                <input type="number" min="0" required value={stockModal.qty} onChange={(e) => setStockModal(prev => ({ ...prev, qty: e.target.value }))} className="w-full bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#1A1512] dark:text-white" />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setStockModal({ open: false, menu: null, mode: 'add', qty: '' })} className="flex-1 py-2.5 rounded-xl border-2 border-[#E0D6CC] dark:border-slate-600 text-xs font-black text-[#1A1512] dark:text-slate-200">Batal</button>
                <button type="submit" disabled={isUpdatingStock} className="flex-1 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-black">{isUpdatingStock ? 'Menyimpan...' : 'Simpan'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {expenseModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border-2 border-[#E0D6CC] dark:border-slate-700 w-full max-w-md rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-black text-[#1A1512] dark:text-white">Catat Biaya Bulanan</h3>
            <form onSubmit={handleAddExpense} className="space-y-3.5">
              <div>
                <label className="block text-xs font-black text-[#1A1512] dark:text-slate-200 mb-1">Cabang</label>
                <select value={formExpense.tenant_id} onChange={e => setFormExpense({...formExpense, tenant_id: e.target.value})} className="w-full bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1A1512] dark:text-white">
                  {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-[#1A1512] dark:text-slate-200 mb-1">Keterangan Biaya</label>
                <input type="text" required value={formExpense.description} onChange={e => setFormExpense({...formExpense, description: e.target.value})} placeholder="Sewa, Listrik, WiFi..." className="w-full bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1A1512] dark:text-white" />
              </div>
              <div>
                <label className="block text-xs font-black text-[#1A1512] dark:text-slate-200 mb-1">Nominal (Rp)</label>
                <input type="number" required value={formExpense.amount} onChange={e => setFormExpense({...formExpense, amount: e.target.value})} className="w-full bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1A1512] dark:text-white" />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setExpenseModal(false)} className="flex-1 py-2.5 rounded-xl border-2 border-[#E0D6CC] dark:border-slate-600 text-xs font-black text-[#1A1512] dark:text-slate-200">Batal</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-black">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {employeeModal.open && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border-2 border-[#E0D6CC] dark:border-slate-700 w-full max-w-md rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-black text-[#1A1512] dark:text-white">{formEmployee.id ? 'Edit Karyawan' : 'Tambah Karyawan'}</h3>
            <form onSubmit={handleSaveEmployee} className="space-y-3.5">
              <div>
                <label className="block text-xs font-black text-[#1A1512] dark:text-slate-200 mb-1">Cabang</label>
                <select value={formEmployee.tenant_id} onChange={e => setFormEmployee({...formEmployee, tenant_id: e.target.value})} className="w-full bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1A1512] dark:text-white">
                  {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-[#1A1512] dark:text-slate-200 mb-1">Nama Lengkap</label>
                  <input type="text" required value={formEmployee.name} onChange={e => setFormEmployee({...formEmployee, name: e.target.value})} className="w-full bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1A1512] dark:text-white" />
                </div>
                <div>
                  <label className="block text-xs font-black text-[#1A1512] dark:text-slate-200 mb-1">No. WhatsApp</label>
                  <input type="tel" value={formEmployee.wa_number} onChange={e => setFormEmployee({...formEmployee, wa_number: e.target.value})} className="w-full bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1A1512] dark:text-white" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-[#1A1512] dark:text-slate-200 mb-1">Alamat</label>
                <input type="text" value={formEmployee.address} onChange={e => setFormEmployee({...formEmployee, address: e.target.value})} className="w-full bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1A1512] dark:text-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-[#1A1512] dark:text-slate-200 mb-1">Jabatan</label>
                  <select value={formEmployee.role} onChange={e => setFormEmployee({...formEmployee, role: e.target.value})} className="w-full bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1A1512] dark:text-white">
                    <option>Kasir</option>
                    <option>Koki / Barista</option>
                    <option>Pelayan</option>
                    <option>Manager</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-[#1A1512] dark:text-slate-200 mb-1">Gaji Pokok (Rp)</label>
                  <input type="number" required value={formEmployee.base_salary} onChange={e => setFormEmployee({...formEmployee, base_salary: e.target.value})} className="w-full bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1A1512] dark:text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-[#1A1512] dark:text-slate-200 mb-1">Nama Bank</label>
                  <input type="text" value={formEmployee.bank_name} onChange={e => setFormEmployee({...formEmployee, bank_name: e.target.value})} className="w-full bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1A1512] dark:text-white" />
                </div>
                <div>
                  <label className="block text-xs font-black text-[#1A1512] dark:text-slate-200 mb-1">No. Rekening</label>
                  <input type="text" value={formEmployee.bank_account} onChange={e => setFormEmployee({...formEmployee, bank_account: e.target.value})} className="w-full bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1A1512] dark:text-white" />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setEmployeeModal({ open: false, data: null })} className="flex-1 py-2.5 rounded-xl border-2 border-[#E0D6CC] dark:border-slate-600 text-xs font-black text-[#1A1512] dark:text-slate-200">Batal</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-black">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {payrollModal.open && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border-2 border-[#E0D6CC] dark:border-slate-700 w-full max-w-md rounded-2xl p-6 space-y-4">
            <div>
              <h3 className="text-base font-black text-[#1A1512] dark:text-white">Catat {payrollModal.type}</h3>
              <p className="text-xs font-bold text-[#5C4B3E] dark:text-slate-300">{payrollModal.employee.name}</p>
            </div>
            <form onSubmit={handlePayroll} className="space-y-3.5">
              <div>
                <label className="block text-xs font-black text-[#1A1512] dark:text-slate-200 mb-1">Nominal (Rp)</label>
                <input type="number" required value={formPayroll.amount} onChange={e => setFormPayroll({...formPayroll, amount: e.target.value})} placeholder={payrollModal.type === 'Gaji' ? payrollModal.employee.base_salary : ''} className="w-full bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1A1512] dark:text-white" />
              </div>
              <div>
                <label className="block text-xs font-black text-[#1A1512] dark:text-slate-200 mb-1">Catatan (Opsional)</label>
                <input type="text" value={formPayroll.notes} onChange={e => setFormPayroll({...formPayroll, notes: e.target.value})} className="w-full bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1A1512] dark:text-white" />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setPayrollModal({ open: false, employee: null, type: 'Gaji' })} className="flex-1 py-2.5 rounded-xl border-2 border-[#E0D6CC] dark:border-slate-600 text-xs font-black text-[#1A1512] dark:text-slate-200">Batal</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-black">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmModal.open && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border-2 border-[#E0D6CC] dark:border-slate-700 w-full max-w-sm rounded-2xl p-6 space-y-4 text-center">
            <h3 className="text-base font-black text-[#1A1512] dark:text-white">{confirmModal.title}</h3>
            <p className="text-xs font-bold text-[#5C4B3E] dark:text-slate-300">{confirmModal.message}</p>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setConfirmModal({ open: false, title: '', message: '', confirmText: 'Hapus', isDanger: false, onConfirm: null, loading: false })} disabled={confirmModal.loading} className="flex-1 py-2.5 rounded-xl border-2 border-[#E0D6CC] dark:border-slate-600 text-xs font-black text-[#1A1512] dark:text-slate-200">Batal</button>
              <button onClick={confirmModal.onConfirm} disabled={confirmModal.loading} className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-black">{confirmModal.loading ? 'Memproses...' : confirmModal.confirmText}</button>
            </div>
          </div>
        </div>
      )}

      {toast.show && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 bg-white dark:bg-slate-900 border-2 border-[#E0D6CC] dark:border-slate-700 px-4 py-3 rounded-xl shadow-lg">
          <span className={`w-2.5 h-2.5 rounded-full ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
          <p className="text-xs font-black text-[#1A1512] dark:text-white">{toast.message}</p>
        </div>
      )}
    </div>
  );
}
