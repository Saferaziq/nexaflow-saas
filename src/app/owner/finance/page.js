'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const Icons = {
  Menu: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  Sun: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  Moon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  ChevronDown: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><polyline points="6 9 12 15 18 9"/></svg>,
  Overview: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" className="w-4 h-4 shrink-0"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
  Finance: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" className="w-4 h-4 shrink-0"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  Box: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" className="w-4 h-4 shrink-0"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  Reports: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" className="w-4 h-4 shrink-0"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  Settings: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-4 h-4 shrink-0"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Logout: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 shrink-0"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Close: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5"><polyline points="20 6 9 17 4 12"/></svg>,
  Plus: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Trash: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-4 h-4"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Edit: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-4 h-4"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
};

function NeuSelect({ value, onChange, options, placeholder = 'Pilih...', className = '' }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handleOutside);
    return () => document.removeEventListener('click', handleOutside);
  }, []);

  const selectedObj = options.find(opt => String(opt.value) === String(value));

  return (
    <div className={`relative ${className}`} ref={wrapRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="neu-inset w-full px-3.5 py-2.5 flex items-center justify-between gap-2 text-left text-xs font-extrabold neu-text cursor-pointer"
      >
        <span className="truncate">{selectedObj ? selectedObj.label : placeholder}</span>
        <span className={`neu-sub shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}>
          <Icons.ChevronDown />
        </span>
      </button>

      {open && (
        <div className="neu-dropdown-menu absolute left-0 right-0 mt-2 p-1.5 z-50 space-y-1 max-h-60 overflow-y-auto">
          {options.map((opt) => {
            const isSelected = String(opt.value) === String(value);
            return (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`neu-dropdown-option w-full px-3 py-2 text-left text-xs flex items-center justify-between gap-2 ${
                  isSelected ? 'selected font-extrabold' : 'font-bold'
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && <Icons.Check />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function OwnerFinance() {
  const [userEmail, setUserEmail] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam === 'stocks') {
        setActiveTab('stocks');
      } else if (tabParam === 'employees') {
        setActiveTab('employees');
      } else if (tabParam === 'expenses_monthly') {
        setActiveTab('expenses_monthly');
      } else {
        setActiveTab('expenses_daily');
      }
    } catch (e) {}
  }, []);

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

  const handleSwitchSection = (targetTab) => {
    setActiveTab(targetTab);
    setIsSidebarOpen(false);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', targetTab === 'stocks' ? 'stocks' : 'expenses');
      window.history.replaceState({}, '', url.toString());
    } catch (e) {}
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

  const isStockSection = activeTab === 'stocks';

  const tenantFilterOptions = useMemo(() => [
    { value: 'all', label: `Semua Cabang (${tenants.length})` },
    ...tenants.map(t => ({ value: t.id, label: t.name }))
  ], [tenants]);

  const tenantOptions = useMemo(() => tenants.map(t => ({ value: t.id, label: t.name })), [tenants]);

  const categoryOptions = [
    { value: 'makanan', label: 'Makanan' },
    { value: 'minuman', label: 'Minuman' },
    { value: 'cemilan', label: 'Cemilan' },
    { value: 'Paket Bundling', label: 'Paket Bundling' },
  ];

  const promoHourOptions = [
    { value: '0', label: 'Tanpa Batas Waktu / Pertahankan' },
    { value: '1', label: '1 Jam (Flash Sale)' },
    { value: '3', label: '3 Jam (Happy Hour)' },
    { value: '6', label: '6 Jam' },
    { value: '24', label: '24 Jam (1 Hari)' },
  ];

  const roleOptions = [
    { value: 'Kasir', label: 'Kasir' },
    { value: 'Koki / Barista', label: 'Koki / Barista' },
    { value: 'Pelayan', label: 'Pelayan' },
    { value: 'Manager', label: 'Manager' },
  ];

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
        .num-tabular { font-variant-numeric: tabular-nums; letter-spacing: -0.02em; }

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
        .neu-inset:focus-within {
          border-color: rgba(37, 99, 235, 0.5);
          box-shadow: inset 5px 5px 10px var(--shadow-dark), inset -5px -5px 10px var(--shadow-light), 0 0 0 3px rgba(37, 99, 235, 0.15);
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
        .neu-btn-amber:hover {
          background: linear-gradient(135deg, #D97706, #B45309);
          border-color: #FCD34D;
          box-shadow: 6px 6px 14px var(--shadow-dark), 0 0 14px rgba(217, 119, 6, 0.38);
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
      `}</style>

      {/* BACKDROP SIDEBAR BUKA-TUTUP */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 ios-blur-backdrop z-40"
        />
      )}

      {/* SIDEBAR BUKA-TUTUP OWNER (TERPISAH ANTARA KEUANGAN & STOK MENU) */}
      <aside
        className={`neu-card fixed top-3.5 left-3.5 bottom-3.5 z-50 w-64 p-5 flex flex-col justify-between transition-all duration-200 ${
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

            <button
              type="button"
              onClick={() => handleSwitchSection('expenses_daily')}
              className={`neu-btn w-full flex items-center gap-3 px-3.5 py-3 text-left text-xs whitespace-nowrap ${
                !isStockSection ? 'active font-extrabold' : 'neu-sub font-bold'
              }`}
            >
              <Icons.Finance />
              <span>Keuangan & Gaji</span>
            </button>

            <button
              type="button"
              onClick={() => handleSwitchSection('stocks')}
              className={`neu-btn w-full flex items-center justify-between gap-2 px-3.5 py-3 text-left text-xs whitespace-nowrap ${
                isStockSection ? 'active font-extrabold' : 'neu-sub font-bold'
              }`}
            >
              <span className="flex items-center gap-3 truncate">
                <Icons.Box />
                <span className="truncate">Master Menu & Stok</span>
              </span>
              {lowStockCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-900 text-[10px] font-black shrink-0">
                  {lowStockCount}
                </span>
              )}
            </button>

            <Link
              href="/owner/reports"
              onClick={() => setIsSidebarOpen(false)}
              className="neu-btn flex items-center gap-3 px-3.5 py-3 neu-sub text-xs font-bold whitespace-nowrap"
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
      <div className="max-w-6xl w-full mx-auto p-3.5 sm:p-6 space-y-6 pb-20">
        {/* HEADER */}
        <header className="neu-card px-4 sm:px-6 py-4 flex items-center justify-between gap-3 sticky top-3 z-30">
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
              <h1 className="text-base sm:text-xl font-black tracking-tight neu-text truncate">
                {isStockSection ? 'Master Menu, HPP (Modal) & Stok' : 'Keuangan, Pengeluaran & Gaji Karyawan'}
              </h1>
              <p className="text-xs font-bold neu-sub truncate">
                {isStockSection
                  ? 'Kendali harga modal HPP, diskon promo berbatas waktu & stok seluruh cabang'
                  : 'Kendali pengeluaran kasir, biaya tetap bulanan & payroll slip WhatsApp'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsDarkMode(!isDarkMode)}
            title="Ubah Tema"
            aria-label="Ubah Tema"
            className={`neu-orb shrink-0 ${isDarkMode ? 'text-sky-400' : 'text-amber-500'}`}
          >
            {isDarkMode ? <Icons.Sun /> : <Icons.Moon />}
          </button>
        </header>

        {/* SUB-TABS KEUANGAN (HANYA TAMPIL SAAT DI BAGIAN KEUANGAN & GAJI) */}
        {!isStockSection && (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setActiveTab('expenses_daily')}
                className={`neu-btn px-4 py-2.5 text-xs font-black whitespace-nowrap ${
                  activeTab === 'expenses_daily' ? 'active' : 'neu-sub'
                }`}
              >
                Pengeluaran Harian (Kasir)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('expenses_monthly')}
                className={`neu-btn px-4 py-2.5 text-xs font-black whitespace-nowrap ${
                  activeTab === 'expenses_monthly' ? 'active' : 'neu-sub'
                }`}
              >
                Biaya Bulanan (Fixed Cost)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('employees')}
                className={`neu-btn px-4 py-2.5 text-xs font-black whitespace-nowrap ${
                  activeTab === 'employees' ? 'active' : 'neu-sub'
                }`}
              >
                Data Karyawan & Gaji
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleSwitchSection('stocks')}
              className="neu-btn px-4 py-2.5 text-xs font-black text-blue-500 inline-flex items-center gap-2"
            >
              <Icons.Box />
              <span>Buka Master Menu & Stok</span>
            </button>
          </div>
        )}

        {/* TAB 1: PENGELUARAN HARIAN KASIR */}
        {activeTab === 'expenses_daily' && (
          <div className="space-y-4">
            <div className="neu-card p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-bold neu-sub">Catatan pengeluaran harian yang diinput oleh Kasir (bahan baku, gas, es, dll).</p>
              <span className="neu-inset-pill px-4 py-1.5 text-sm font-black text-rose-500 num-tabular">Total: {formatRp(totalPengeluaranHarian)}</span>
            </div>

            <div className="neu-card overflow-hidden p-3 sm:p-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-2">
                  <thead>
                    <tr className="text-xs font-black uppercase neu-sub">
                      <th className="py-2.5 px-4">Tanggal</th>
                      <th className="py-2.5 px-4">Cabang</th>
                      <th className="py-2.5 px-4">Keterangan</th>
                      <th className="py-2.5 px-4">Nominal</th>
                      <th className="py-2.5 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs">
                    {isLoading ? (
                      <tr><td colSpan="5" className="py-8 text-center font-bold neu-sub">Memuat data...</td></tr>
                    ) : expensesDaily.map(ex => {
                      const safeUnitPrice = Number(ex.unit_price) || (Number(ex.amount) / (Number(ex.quantity) || 1));
                      return (
                        <tr key={ex.id} className="neu-item">
                          <td className="py-3.5 px-4 rounded-l-2xl font-bold neu-sub whitespace-nowrap">{new Date(ex.expense_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                          <td className="py-3.5 px-4 font-black neu-text">{tenants.find(t => t.id === ex.tenant_id)?.name || '-'}</td>
                          <td className="py-3.5 px-4">
                            <span className="font-extrabold neu-text">{ex.description || '-'}</span>
                            <span className="neu-sub font-bold ml-2">({ex.quantity || 1} x {formatRp(safeUnitPrice)})</span>
                          </td>
                          <td className="py-3.5 px-4 font-black text-rose-500 num-tabular whitespace-nowrap">-{formatRp(ex.amount)}</td>
                          <td className="py-3.5 px-4 text-right rounded-r-2xl">
                            <button type="button" onClick={() => handleDelete('expense', ex.id)} className="neu-btn neu-btn-danger p-2 text-rose-500" title="Hapus"><Icons.Trash /></button>
                          </td>
                        </tr>
                      );
                    })}
                    {!isLoading && expensesDaily.length === 0 && (
                      <tr><td colSpan="5" className="py-8 text-center font-bold neu-sub">Belum ada pengeluaran harian dari kasir.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BIAYA BULANAN (FIXED COST) */}
        {activeTab === 'expenses_monthly' && (
          <div className="space-y-4">
            <div className="neu-card p-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-6">
                <div className="neu-inset px-4 py-3">
                  <p className="text-[11px] font-black neu-sub uppercase">Total Beban Bulanan + Gaji</p>
                  <p className="text-lg font-black text-rose-500 num-tabular mt-0.5">{formatRp(totalPengeluaranBulanan)}</p>
                </div>
                <div className="neu-inset px-4 py-3">
                  <p className="text-[11px] font-black neu-sub uppercase">Gaji Dibayarkan</p>
                  <p className="text-lg font-black neu-text num-tabular mt-0.5">{formatRp(totalGajiBulanIni)}</p>
                </div>
              </div>
              <button type="button" onClick={() => { setFormExpense({ ...formExpense, category: 'Bulanan' }); setExpenseModal(true); }} className="neu-btn neu-btn-green px-4 py-2.5 text-emerald-500 text-xs font-black">+ Catat Biaya Bulanan</button>
            </div>

            <div className="neu-card overflow-hidden p-3 sm:p-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-2">
                  <thead>
                    <tr className="text-xs font-black uppercase neu-sub">
                      <th className="py-2.5 px-4">Tanggal</th>
                      <th className="py-2.5 px-4">Cabang</th>
                      <th className="py-2.5 px-4">Keterangan Biaya</th>
                      <th className="py-2.5 px-4">Nominal</th>
                      <th className="py-2.5 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs">
                    {expensesMonthly.map(ex => (
                      <tr key={ex.id} className="neu-item">
                        <td className="py-3.5 px-4 rounded-l-2xl font-bold neu-sub whitespace-nowrap">{new Date(ex.expense_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                        <td className="py-3.5 px-4 font-black neu-text">{tenants.find(t => t.id === ex.tenant_id)?.name || '-'}</td>
                        <td className="py-3.5 px-4 font-extrabold neu-text">{ex.description || '-'}</td>
                        <td className="py-3.5 px-4 font-black text-rose-500 num-tabular whitespace-nowrap">-{formatRp(ex.amount)}</td>
                        <td className="py-3.5 px-4 text-right rounded-r-2xl">
                          <button type="button" onClick={() => handleDelete('expense', ex.id)} className="neu-btn neu-btn-danger p-2 text-rose-500" title="Hapus"><Icons.Trash /></button>
                        </td>
                      </tr>
                    ))}
                    {expensesMonthly.length === 0 && (
                      <tr><td colSpan="5" className="py-8 text-center font-bold neu-sub">Belum ada catatan biaya bulanan.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DATA KARYAWAN & GAJI */}
        {activeTab === 'employees' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <button type="button" onClick={() => setShowInactiveEmployees(false)} className={`neu-btn px-3.5 py-2 text-xs font-black ${!showInactiveEmployees ? 'active' : 'neu-sub'}`}>Aktif ({activeEmployees.length})</button>
                <button type="button" onClick={() => setShowInactiveEmployees(true)} className={`neu-btn px-3.5 py-2 text-xs font-black ${showInactiveEmployees ? 'active' : 'neu-sub'}`}>Nonaktif ({inactiveEmployees.length})</button>
              </div>
              <button type="button" onClick={() => { setFormEmployee({ id: null, tenant_id: tenants[0]?.id || '', name: '', role: 'Kasir', base_salary: '', wa_number: '', address: '', bank_name: '', bank_account: '' }); setEmployeeModal({ open: true, data: null }); }} className="neu-btn neu-btn-green px-4 py-2.5 text-emerald-500 text-xs font-black">+ Tambah Karyawan</button>
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
                  <div key={emp.id} className={`neu-card neu-card-hover p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${!isActive ? 'opacity-80' : ''}`}>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-black neu-text">{emp.name}</p>
                        {!isActive && <span className="neu-inset-pill px-2.5 py-0.5 neu-sub text-[10px] font-black">Nonaktif</span>}
                        {showSalaryReminder && <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black">Belum Digaji</span>}
                      </div>
                      <p className="text-xs font-bold neu-sub mt-0.5">{emp.role} · {tenants.find(t => t.id === emp.tenant_id)?.name || 'Cabang'}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 sm:gap-6 text-xs">
                      <div className="neu-inset px-3 py-2">
                        <p className="font-bold neu-sub">Gaji Pokok</p>
                        <p className="font-black neu-text num-tabular mt-0.5">{formatRp(emp.base_salary)}</p>
                      </div>
                      <div className="neu-inset px-3 py-2">
                        <p className="font-bold neu-sub">Kasbon</p>
                        <p className="font-black text-amber-500 num-tabular mt-0.5">{totalKasbon > 0 ? formatRp(totalKasbon) : '-'}</p>
                      </div>
                      <div className="neu-inset px-3 py-2">
                        <p className="font-bold neu-sub">Bonus</p>
                        <p className="font-black text-emerald-500 num-tabular mt-0.5">{totalBonus > 0 ? formatRp(totalBonus) : '-'}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {isActive ? (
                        <>
                          <button type="button" onClick={() => setPayrollModal({ open: true, employee: emp, type: 'Gaji' })} className="neu-btn px-3 py-1.5 text-xs font-black text-blue-500">Gaji</button>
                          <button type="button" onClick={() => setPayrollModal({ open: true, employee: emp, type: 'Kasbon' })} className="neu-btn neu-btn-amber px-3 py-1.5 text-xs font-black text-amber-500">Kasbon</button>
                          <button type="button" onClick={() => setPayrollModal({ open: true, employee: emp, type: 'Bonus' })} className="neu-btn neu-btn-green px-3 py-1.5 text-xs font-black text-emerald-500">Bonus</button>
                          <button type="button" onClick={() => handleSendSalaryWA(emp)} className="neu-btn neu-btn-green px-3 py-1.5 text-emerald-500 text-xs font-black">Slip WA</button>
                          <button type="button" onClick={() => handleOpenEditEmployee(emp)} className="neu-btn p-2 neu-text" title="Edit"><Icons.Edit /></button>
                          <button type="button" onClick={() => handleDelete('employee', emp.id)} className="neu-btn neu-btn-danger p-2 text-rose-500" title="Nonaktifkan"><Icons.Trash /></button>
                        </>
                      ) : (
                        <>
                          <button type="button" onClick={() => handleSendSalaryWA(emp)} className="neu-btn neu-btn-green px-3 py-1.5 text-emerald-500 text-xs font-black">Slip WA</button>
                          <button type="button" onClick={() => handleOpenEditEmployee(emp)} className="neu-btn p-2 neu-text" title="Edit"><Icons.Edit /></button>
                          <button type="button" onClick={() => handleRestoreEmployee(emp)} className="neu-btn px-3 py-1.5 text-blue-500 text-xs font-black">Aktifkan Kembali</button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
              {displayedEmployees.length === 0 && (
                <div className="neu-card p-8 text-center text-xs font-bold neu-sub">
                  {showInactiveEmployees ? 'Tidak ada karyawan nonaktif.' : 'Belum ada data karyawan aktif.'}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: MASTER MENU, HPP (MODAL), PROMO & STOK EKSKLUSIF OWNER */}
        {isStockSection && (
          <div className="space-y-4">
            <div className="neu-card p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[240px]">
                <NeuSelect
                  value={stockBranchFilter}
                  onChange={setStockBranchFilter}
                  options={tenantFilterOptions}
                  className="w-52"
                />
                <div className="neu-inset px-3.5 py-2.5 flex-1 max-w-xs">
                  <input
                    type="text"
                    value={stockSearch}
                    onChange={(e) => setStockSearch(e.target.value)}
                    placeholder="Cari nama menu..."
                    className="bg-transparent w-full text-xs font-bold neu-text outline-none"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handleSwitchSection('expenses_daily')}
                  className="neu-btn px-3.5 py-2.5 text-xs font-bold neu-sub"
                >
                  Ke Keuangan & Gaji
                </button>
                <button
                  type="button"
                  onClick={handleOpenAddMenu}
                  className="neu-btn neu-btn-green px-4 py-2.5 text-emerald-500 text-xs font-black inline-flex items-center gap-1.5"
                >
                  <Icons.Plus />
                  <span>Tambah Menu & HPP</span>
                </button>
              </div>
            </div>

            <div className="neu-card overflow-hidden p-3 sm:p-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-2">
                  <thead>
                    <tr className="text-xs font-black uppercase neu-sub">
                      <th className="py-2.5 px-4">Menu & Cabang</th>
                      <th className="py-2.5 px-4">Harga Jual / Promo</th>
                      <th className="py-2.5 px-4">HPP (Modal) & Margin</th>
                      <th className="py-2.5 px-4 text-center">Stok</th>
                      <th className="py-2.5 px-4 text-right">Kelola</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs">
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
                        <tr key={m.id} className="neu-item">
                          <td className="py-3.5 px-4 rounded-l-2xl">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p className="font-black neu-text">{m.name}</p>
                              {m.is_featured && !isPromoExpired && (
                                <span className="neu-inset-pill px-2.5 py-0.5 text-amber-500 text-[10px] font-black">Unggulan</span>
                              )}
                            </div>
                            <p className="text-[11px] font-bold neu-sub mt-0.5">{branchName} · {m.category}</p>
                          </td>
                          <td className="py-3.5 px-4 num-tabular">
                            {hasPromo ? (
                              <div>
                                <span className="font-black text-rose-500">{formatRp(discPrice)}</span>
                                <span className="text-[10px] font-bold line-through neu-sub ml-1.5">{formatRp(normalPrice)}</span>
                              </div>
                            ) : (
                              <span className="font-black neu-text">{formatRp(normalPrice)}</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 num-tabular">
                            {costNum > 0 ? (
                              <div>
                                <p className="font-bold neu-sub">Modal: {formatRp(costNum)}</p>
                                <p className={`text-[11px] font-black ${unitMargin < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                  Laba: {formatRp(unitMargin)} ({marginPct}%)
                                </p>
                              </div>
                            ) : (
                              <span className="text-[11px] font-bold text-amber-500">HPP belum diisi</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className={`px-3 py-1 rounded-full font-black num-tabular ${stockNum <= 3 ? 'bg-rose-600 text-white' : stockNum <= 10 ? 'bg-amber-500 text-slate-900' : 'neu-inset-pill text-emerald-500'}`}>
                              {stockNum} pcs
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right rounded-r-2xl">
                            <div className="flex items-center justify-end gap-1.5">
                              <button type="button" onClick={() => handleQuickAddStock(m, 10)} className="neu-btn neu-btn-green px-2.5 py-1.5 text-emerald-500 font-black" title="Tambah 10 stok">+10</button>
                              <button type="button" onClick={() => setStockModal({ open: true, menu: m, mode: 'add', qty: '20' })} className="neu-btn px-2.5 py-1.5 neu-text font-black">Stok</button>
                              <button type="button" onClick={() => handleOpenEditMenu(m)} className="neu-btn px-3 py-1.5 text-blue-500 font-black">Edit / Promo</button>
                              <button type="button" onClick={() => handleDelete('menu', m.id)} className="neu-btn neu-btn-danger p-1.5 text-rose-500" title="Hapus Menu"><Icons.Trash /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredMenus.length === 0 && (
                      <tr><td colSpan="5" className="py-8 text-center font-bold neu-sub">Tidak ada menu yang cocok.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL TAMBAH / EDIT MASTER MENU, HPP & PROMO */}
      {menuModal.open && (
        <div className="fixed inset-0 ios-blur-backdrop z-50 flex items-center justify-center p-4">
          <div className="neu-card w-full max-w-lg p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-base font-black neu-text">
                  {menuModal.mode === 'edit' ? 'Edit Menu, HPP & Promo' : 'Tambah Menu Baru & HPP'}
                </h3>
                <p className="text-xs font-bold neu-sub">Data modal HPP & pengaturan promo hanya tampil untuk Owner</p>
              </div>
              <button type="button" onClick={() => setMenuModal({ open: false, mode: 'add' })} className="neu-orb w-9 h-9 neu-sub">
                <Icons.Close />
              </button>
            </div>

            <form onSubmit={handleSaveMenu} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black neu-sub mb-1">Cabang</label>
                  <NeuSelect
                    value={formMenu.tenant_id}
                    onChange={(val) => setFormMenu({ ...formMenu, tenant_id: val })}
                    options={tenantOptions}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black neu-sub mb-1">Kategori</label>
                  <NeuSelect
                    value={formMenu.category}
                    onChange={(val) => setFormMenu({ ...formMenu, category: val })}
                    options={categoryOptions}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black neu-sub mb-1">Nama Menu</label>
                <div className="neu-inset px-3.5 py-2.5">
                  <input type="text" required value={formMenu.name} onChange={e => setFormMenu({ ...formMenu, name: e.target.value })} placeholder="Contoh: Kopi Susu Aren" className="bg-transparent w-full text-xs font-bold neu-text outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black neu-sub mb-1">Harga Jual Normal (Rp)</label>
                  <div className="neu-inset px-3.5 py-2.5">
                    <input type="number" required min="0" value={formMenu.price} onChange={e => setFormMenu({ ...formMenu, price: e.target.value })} placeholder="22000" className="bg-transparent w-full text-xs font-bold neu-text outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-emerald-500 mb-1">Harga Modal / HPP (Rp)</label>
                  <div className="neu-inset px-3.5 py-2.5">
                    <input type="number" min="0" value={formMenu.cost_price} onChange={e => setFormMenu({ ...formMenu, cost_price: e.target.value })} placeholder="8500" className="bg-transparent w-full text-xs font-bold neu-text outline-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-rose-500 mb-1">Harga Promo / Coret (Opsional)</label>
                  <div className="neu-inset px-3.5 py-2.5">
                    <input type="number" min="0" value={formMenu.discount_price} onChange={e => setFormMenu({ ...formMenu, discount_price: e.target.value })} placeholder="Kosongkan jika normal" className="bg-transparent w-full text-xs font-bold neu-text outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black neu-sub mb-1">Durasi Promo</label>
                  <NeuSelect
                    value={formMenu.promo_hours}
                    onChange={(val) => setFormMenu({ ...formMenu, promo_hours: val })}
                    options={promoHourOptions}
                  />
                </div>
              </div>

              {modalSellPrice > 0 && (
                <div className={`neu-inset p-3 flex items-center justify-between text-xs ${modalNetMargin < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                  <span className="font-bold">Estimasi Laba Bersih / Porsi:</span>
                  <span className="font-black num-tabular">{formatRp(modalNetMargin)} ({modalMarginPct}%)</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block text-xs font-black neu-sub mb-1">Stok Awal (Porsi)</label>
                  <div className="neu-inset px-3.5 py-2.5">
                    <input type="number" min="0" required value={formMenu.stock} onChange={e => setFormMenu({ ...formMenu, stock: e.target.value })} className="bg-transparent w-full text-xs font-bold neu-text outline-none" />
                  </div>
                </div>
                <div className="flex flex-col gap-2 pt-4">
                  <label className="flex items-center gap-2 text-xs font-black neu-text cursor-pointer">
                    <input type="checkbox" checked={formMenu.is_featured} onChange={e => setFormMenu({ ...formMenu, is_featured: e.target.checked })} className="w-4 h-4 rounded" />
                    Tampilkan di Unggulan QR
                  </label>
                  <label className="flex items-center gap-2 text-xs font-black neu-text cursor-pointer">
                    <input type="checkbox" checked={formMenu.is_new} onChange={e => setFormMenu({ ...formMenu, is_new: e.target.checked })} className="w-4 h-4 rounded" />
                    Tandai Menu Baru
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black neu-sub mb-1">Deskripsi Singkat (Opsional)</label>
                <div className="neu-inset px-3.5 py-2.5">
                  <input type="text" value={formMenu.description} onChange={e => setFormMenu({ ...formMenu, description: e.target.value })} placeholder="Komposisi atau rasa menu..." className="bg-transparent w-full text-xs font-bold neu-text outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black neu-sub mb-1">URL Gambar Menu (Opsional)</label>
                <div className="neu-inset px-3.5 py-2.5">
                  <input type="text" value={formMenu.image_url} onChange={e => setFormMenu({ ...formMenu, image_url: e.target.value })} placeholder="https://..." className="bg-transparent w-full text-xs font-bold neu-text outline-none" />
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button type="button" onClick={() => setMenuModal({ open: false, mode: 'add' })} className="neu-btn flex-1 py-2.5 text-xs font-black neu-sub">Batal</button>
                <button type="submit" disabled={isSavingMenu} className="neu-btn neu-btn-green flex-1 py-2.5 text-emerald-500 text-xs font-black">{isSavingMenu ? 'Menyimpan...' : 'Simpan Menu'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ATUR STOK */}
      {stockModal.open && stockModal.menu && (
        <div className="fixed inset-0 ios-blur-backdrop z-50 flex items-center justify-center p-4">
          <div className="neu-card w-full max-w-md p-6 space-y-4">
            <div>
              <h3 className="text-base font-black neu-text">Atur Stok Menu</h3>
              <p className="text-xs font-bold neu-sub mt-0.5">{stockModal.menu.name} · Stok saat ini: {stockModal.menu.stock} pcs</p>
            </div>
            <form onSubmit={handleSaveStockModal} className="space-y-4">
              <div className="neu-inset grid grid-cols-2 gap-1.5 p-1.5">
                <button type="button" onClick={() => setStockModal(prev => ({ ...prev, mode: 'add' }))} className={`neu-btn py-2 text-xs font-black ${stockModal.mode === 'add' ? 'active' : 'neu-sub'}`}>+ Tambah Stok</button>
                <button type="button" onClick={() => setStockModal(prev => ({ ...prev, mode: 'set', qty: String(stockModal.menu.stock || 0) }))} className={`neu-btn py-2 text-xs font-black ${stockModal.mode === 'set' ? 'active' : 'neu-sub'}`}>Setel Angka Pasti</button>
              </div>
              <div>
                <label className="block text-xs font-black neu-sub mb-1">{stockModal.mode === 'add' ? 'Jumlah Porsi Ditambahkan' : 'Total Stok Baru'}</label>
                <div className="neu-inset px-3.5 py-2.5">
                  <input type="number" min="0" required value={stockModal.qty} onChange={(e) => setStockModal(prev => ({ ...prev, qty: e.target.value }))} className="bg-transparent w-full text-sm font-bold neu-text outline-none" />
                </div>
              </div>
              <div className="flex gap-2.5">
                <button type="button" onClick={() => setStockModal({ open: false, menu: null, mode: 'add', qty: '' })} className="neu-btn flex-1 py-2.5 text-xs font-black neu-sub">Batal</button>
                <button type="submit" disabled={isUpdatingStock} className="neu-btn neu-btn-green flex-1 py-2.5 text-emerald-500 text-xs font-black">{isUpdatingStock ? 'Menyimpan...' : 'Simpan'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CATAT BIAYA BULANAN */}
      {expenseModal && (
        <div className="fixed inset-0 ios-blur-backdrop z-50 flex items-center justify-center p-4">
          <div className="neu-card w-full max-w-md p-6 space-y-4">
            <h3 className="text-base font-black neu-text">Catat Biaya Bulanan</h3>
            <form onSubmit={handleAddExpense} className="space-y-3.5">
              <div>
                <label className="block text-xs font-black neu-sub mb-1">Cabang</label>
                <NeuSelect
                  value={formExpense.tenant_id}
                  onChange={(val) => setFormExpense({ ...formExpense, tenant_id: val })}
                  options={tenantOptions}
                />
              </div>
              <div>
                <label className="block text-xs font-black neu-sub mb-1">Keterangan Biaya</label>
                <div className="neu-inset px-3.5 py-2.5">
                  <input type="text" required value={formExpense.description} onChange={e => setFormExpense({ ...formExpense, description: e.target.value })} placeholder="Sewa, Listrik, WiFi..." className="bg-transparent w-full text-xs font-bold neu-text outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black neu-sub mb-1">Nominal (Rp)</label>
                <div className="neu-inset px-3.5 py-2.5">
                  <input type="number" required value={formExpense.amount} onChange={e => setFormExpense({ ...formExpense, amount: e.target.value })} className="bg-transparent w-full text-xs font-bold neu-text outline-none" />
                </div>
              </div>
              <div className="flex gap-2.5 pt-2">
                <button type="button" onClick={() => setExpenseModal(false)} className="neu-btn flex-1 py-2.5 text-xs font-black neu-sub">Batal</button>
                <button type="submit" className="neu-btn neu-btn-green flex-1 py-2.5 text-emerald-500 text-xs font-black">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH / EDIT KARYAWAN */}
      {employeeModal.open && (
        <div className="fixed inset-0 ios-blur-backdrop z-50 flex items-center justify-center p-4">
          <div className="neu-card w-full max-w-md p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-black neu-text">{formEmployee.id ? 'Edit Karyawan' : 'Tambah Karyawan'}</h3>
            <form onSubmit={handleSaveEmployee} className="space-y-3.5">
              <div>
                <label className="block text-xs font-black neu-sub mb-1">Cabang</label>
                <NeuSelect
                  value={formEmployee.tenant_id}
                  onChange={(val) => setFormEmployee({ ...formEmployee, tenant_id: val })}
                  options={tenantOptions}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black neu-sub mb-1">Nama Lengkap</label>
                  <div className="neu-inset px-3.5 py-2.5">
                    <input type="text" required value={formEmployee.name} onChange={e => setFormEmployee({ ...formEmployee, name: e.target.value })} className="bg-transparent w-full text-xs font-bold neu-text outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black neu-sub mb-1">No. WhatsApp</label>
                  <div className="neu-inset px-3.5 py-2.5">
                    <input type="tel" value={formEmployee.wa_number} onChange={e => setFormEmployee({ ...formEmployee, wa_number: e.target.value })} className="bg-transparent w-full text-xs font-bold neu-text outline-none" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-black neu-sub mb-1">Alamat</label>
                <div className="neu-inset px-3.5 py-2.5">
                  <input type="text" value={formEmployee.address} onChange={e => setFormEmployee({ ...formEmployee, address: e.target.value })} className="bg-transparent w-full text-xs font-bold neu-text outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black neu-sub mb-1">Jabatan</label>
                  <NeuSelect
                    value={formEmployee.role}
                    onChange={(val) => setFormEmployee({ ...formEmployee, role: val })}
                    options={roleOptions}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black neu-sub mb-1">Gaji Pokok (Rp)</label>
                  <div className="neu-inset px-3.5 py-2.5">
                    <input type="number" required value={formEmployee.base_salary} onChange={e => setFormEmployee({ ...formEmployee, base_salary: e.target.value })} className="bg-transparent w-full text-xs font-bold neu-text outline-none" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black neu-sub mb-1">Nama Bank</label>
                  <div className="neu-inset px-3.5 py-2.5">
                    <input type="text" value={formEmployee.bank_name} onChange={e => setFormEmployee({ ...formEmployee, bank_name: e.target.value })} className="bg-transparent w-full text-xs font-bold neu-text outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black neu-sub mb-1">No. Rekening</label>
                  <div className="neu-inset px-3.5 py-2.5">
                    <input type="text" value={formEmployee.bank_account} onChange={e => setFormEmployee({ ...formEmployee, bank_account: e.target.value })} className="bg-transparent w-full text-xs font-bold neu-text outline-none" />
                  </div>
                </div>
              </div>
              <div className="flex gap-2.5 pt-2">
                <button type="button" onClick={() => setEmployeeModal({ open: false, data: null })} className="neu-btn flex-1 py-2.5 text-xs font-black neu-sub">Batal</button>
                <button type="submit" className="neu-btn neu-btn-green flex-1 py-2.5 text-emerald-500 text-xs font-black">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CATAT GAJI / KASBON / BONUS */}
      {payrollModal.open && (
        <div className="fixed inset-0 ios-blur-backdrop z-50 flex items-center justify-center p-4">
          <div className="neu-card w-full max-w-md p-6 space-y-4">
            <div>
              <h3 className="text-base font-black neu-text">Catat {payrollModal.type}</h3>
              <p className="text-xs font-bold neu-sub">{payrollModal.employee.name}</p>
            </div>
            <form onSubmit={handlePayroll} className="space-y-3.5">
              <div>
                <label className="block text-xs font-black neu-sub mb-1">Nominal (Rp)</label>
                <div className="neu-inset px-3.5 py-2.5">
                  <input type="number" required value={formPayroll.amount} onChange={e => setFormPayroll({ ...formPayroll, amount: e.target.value })} placeholder={payrollModal.type === 'Gaji' ? payrollModal.employee.base_salary : ''} className="bg-transparent w-full text-xs font-bold neu-text outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black neu-sub mb-1">Catatan (Opsional)</label>
                <div className="neu-inset px-3.5 py-2.5">
                  <input type="text" value={formPayroll.notes} onChange={e => setFormPayroll({ ...formPayroll, notes: e.target.value })} className="bg-transparent w-full text-xs font-bold neu-text outline-none" />
                </div>
              </div>
              <div className="flex gap-2.5 pt-2">
                <button type="button" onClick={() => setPayrollModal({ open: false, employee: null, type: 'Gaji' })} className="neu-btn flex-1 py-2.5 text-xs font-black neu-sub">Batal</button>
                <button type="submit" className="neu-btn neu-btn-green flex-1 py-2.5 text-emerald-500 text-xs font-black">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS / NONAKTIFKAN */}
      {confirmModal.open && (
        <div className="fixed inset-0 ios-blur-backdrop z-50 flex items-center justify-center p-4">
          <div className="neu-card w-full max-w-sm p-6 space-y-4 text-center">
            <h3 className="text-base font-black neu-text">{confirmModal.title}</h3>
            <p className="text-xs font-bold neu-sub">{confirmModal.message}</p>
            <div className="flex gap-2.5 pt-2">
              <button type="button" onClick={() => setConfirmModal({ open: false, title: '', message: '', confirmText: 'Hapus', isDanger: false, onConfirm: null, loading: false })} disabled={confirmModal.loading} className="neu-btn flex-1 py-2.5 text-xs font-black neu-sub">Batal</button>
              <button type="button" onClick={confirmModal.onConfirm} disabled={confirmModal.loading} className="neu-btn neu-btn-danger flex-1 py-2.5 text-rose-500 text-xs font-black">{confirmModal.loading ? 'Memproses...' : confirmModal.confirmText}</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast.show && (
        <div className="fixed bottom-5 right-5 z-50">
          <div className="neu-card flex items-center gap-2.5 px-4 py-3 rounded-2xl">
            <span className={`w-2.5 h-2.5 rounded-full ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
            <p className="text-xs font-black neu-text">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}