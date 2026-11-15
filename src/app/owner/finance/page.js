'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function OwnerFinance() {
  const [userEmail, setUserEmail] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('expenses'); // 'expenses' atau 'employees'
  
  // Data State
  const [tenants, setTenants] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals State
  const [expenseModal, setExpenseModal] = useState(false);
  const [employeeModal, setEmployeeModal] = useState(false);
  const [payrollModal, setPayrollModal] = useState({ open: false, employee: null, type: 'Gaji' });

  // Form State
  const [formExpense, setFormExpense] = useState({ tenant_id: '', category: 'Listrik', description: '', amount: '' });
  const [formEmployee, setFormEmployee] = useState({ tenant_id: '', name: '', role: 'Kasir', base_salary: '' });
  const [formPayroll, setFormPayroll] = useState({ amount: '', notes: '' });
  
  // UI State
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
        if (data.tenants.length > 0 && !formExpense.tenant_id) {
          setFormExpense(prev => ({ ...prev, tenant_id: data.tenants[0].id }));
          setFormEmployee(prev => ({ ...prev, tenant_id: data.tenants[0].id }));
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

  const handleAddExpense = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/owner/finance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add_expense', manager_email: userEmail, payload: { ...formExpense, amount: Number(formExpense.amount) } })
    });
    const data = await res.json();
    if (res.ok) {
      showToast(data.message);
      setExpenseModal(false);
      setFormExpense({ ...formExpense, description: '', amount: '' });
      fetchData(userEmail);
    } else showToast(data.error, 'error');
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/owner/finance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add_employee', manager_email: userEmail, payload: { ...formEmployee, base_salary: Number(formEmployee.base_salary) } })
    });
    const data = await res.json();
    if (res.ok) {
      showToast(data.message);
      setEmployeeModal(false);
      setFormEmployee({ ...formEmployee, name: '', base_salary: '' });
      fetchData(userEmail);
    } else showToast(data.error, 'error');
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

  // 🔥 FUNGSI DELETE DENGAN MODAL KUSTOM 🔥
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
          } else {
            throw new Error(data.error);
          }
        } catch (err) {
          showToast(err.message, 'error');
          setConfirmModal({ open: false, title: '', message: '', isDanger: false, onConfirm: null, loading: false });
        }
      }
    });
  };

  const formatRp = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  return (
    <div className="bg-slate-50 text-slate-800 dark:bg-[#04060B] dark:text-slate-200 min-h-screen overflow-hidden font-sans transition-colors duration-300">
      <div className="fixed top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-[#2563EB]/10 dark:bg-[#2563EB]/15 blur-[150px] pointer-events-none z-0"></div>
      
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
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 flex flex-col h-full overflow-hidden relative">
          <header className="h-20 bg-white/60 dark:bg-[#04060B]/60 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between px-6 lg:px-10 z-40 transition-colors">
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight">Manajemen Keuangan</h1>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">Kelola pengeluaran dan data karyawan kafe Anda</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2.5 rounded-xl bg-slate-100 dark:bg-[#0F172A] text-slate-600 dark:text-amber-400 border border-slate-200 dark:border-slate-800 shadow-sm">
                {isDarkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-6 lg:p-10 z-10 scroll-smooth">
            
            {/* TABS */}
            <div className="flex gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
              <button onClick={() => setActiveTab('expenses')} className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'expenses' ? 'bg-[#2563EB] text-white shadow-lg' : 'bg-white dark:bg-[#111C33] text-slate-500'}`}>Pengeluaran Operasional</button>
              <button onClick={() => setActiveTab('employees')} className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'employees' ? 'bg-[#2563EB] text-white shadow-lg' : 'bg-white dark:bg-[#111C33] text-slate-500'}`}>Data Karyawan & Gaji</button>
            </div>

            {/* TAB 1: PENGELUARAN */}
            {activeTab === 'expenses' && (
              <div className="animate-in fade-in duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-black text-slate-900 dark:text-white font-display">Catatan Pengeluaran</h2>
                  <button onClick={() => setExpenseModal(true)} className="bg-[#2563EB] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg">+ Catat Pengeluaran</button>
                </div>
                <div className="bg-white dark:bg-[#0A0F1C] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-[#060911]/50 border-b border-slate-200 dark:border-slate-800">
                      <tr className="text-[10px] uppercase tracking-wider text-slate-500 font-black">
                        <th className="p-4 pl-6">Tanggal</th>
                        <th className="p-4">Cabang</th>
                        <th className="p-4">Kategori</th>
                        <th className="p-4">Keterangan</th>
                        <th className="p-4">Nominal</th>
                        <th className="p-4 pr-6 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                      {expenses.map(ex => (
                        <tr key={ex.id} className="hover:bg-slate-50 dark:hover:bg-[#111C33]/50 transition-colors">
                          <td className="p-4 pl-6 text-sm text-slate-500">{new Date(ex.expense_date).toLocaleDateString('id-ID')}</td>
                          <td className="p-4 text-sm font-bold">{tenants.find(t => t.id === ex.tenant_id)?.name || '-'}</td>
                          <td className="p-4"><span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs font-bold">{ex.category}</span></td>
                          <td className="p-4 text-sm">{ex.description || '-'}</td>
                          <td className="p-4 text-sm font-black text-rose-500">- {formatRp(ex.amount)}</td>
                          <td className="p-4 pr-6 text-right">
                            <button onClick={() => handleDelete('expense', ex.id)} className="text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-colors"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
                          </td>
                        </tr>
                      ))}
                      {expenses.length === 0 && <tr><td colSpan="6" className="p-6 text-center text-slate-500 font-bold">Belum ada catatan pengeluaran.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: KARYAWAN */}
            {activeTab === 'employees' && (
              <div className="animate-in fade-in duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-black text-slate-900 dark:text-white font-display">Daftar Karyawan</h2>
                  <button onClick={() => setEmployeeModal(true)} className="bg-[#EA8B42] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg">+ Tambah Karyawan</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {employees.map(emp => {
                    const empTrans = transactions.filter(t => t.employee_id === emp.id);
                    const totalKasbon = empTrans.filter(t => t.type === 'Kasbon').reduce((s, t) => s + t.amount, 0);
                    const totalBonus = empTrans.filter(t => t.type === 'Bonus').reduce((s, t) => s + t.amount, 0);
                    
                    return (
                      <div key={emp.id} className="bg-white dark:bg-[#0A0F1C] border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm relative">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-black text-lg">{emp.name}</h3>
                            <p className="text-xs font-bold text-slate-500 uppercase">{emp.role} • {tenants.find(t => t.id === emp.tenant_id)?.name}</p>
                          </div>
                          <button onClick={() => handleDelete('employee', emp.id)} className="text-rose-500 hover:bg-rose-50 p-1.5 rounded transition-colors"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
                        </div>
                        <div className="bg-slate-50 dark:bg-[#04060B] rounded-xl p-3 mb-4 space-y-1">
                          <div className="flex justify-between text-xs"><span className="text-slate-500">Gaji Pokok:</span> <span className="font-bold">{formatRp(emp.base_salary)}</span></div>
                          <div className="flex justify-between text-xs"><span className="text-slate-500">Total Kasbon:</span> <span className="font-bold text-rose-500">{formatRp(totalKasbon)}</span></div>
                          <div className="flex justify-between text-xs"><span className="text-slate-500">Total Bonus:</span> <span className="font-bold text-emerald-500">{formatRp(totalBonus)}</span></div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <button onClick={() => setPayrollModal({ open: true, employee: emp, type: 'Gaji' })} className="bg-[#2563EB] text-white text-xs font-bold py-2 rounded-lg">Gaji</button>
                          <button onClick={() => setPayrollModal({ open: true, employee: emp, type: 'Kasbon' })} className="bg-rose-500 text-white text-xs font-bold py-2 rounded-lg">Kasbon</button>
                          <button onClick={() => setPayrollModal({ open: true, employee: emp, type: 'Bonus' })} className="bg-emerald-500 text-white text-xs font-bold py-2 rounded-lg">Bonus</button>
                        </div>
                      </div>
                    );
                  })}
                  {employees.length === 0 && <div className="col-span-full p-10 text-center text-slate-500 font-bold border-2 border-dashed rounded-2xl">Belum ada data karyawan.</div>}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* MODAL PENGELUARAN */}
      {expenseModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F172A] w-full max-w-md p-8 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-black mb-6">Catat Pengeluaran</h3>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1">Pilih Cabang</label>
                <select value={formExpense.tenant_id} onChange={e => setFormExpense({...formExpense, tenant_id: e.target.value})} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#04060B] border border-slate-300 dark:border-slate-700 text-sm font-bold">
                  {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Kategori</label>
                <select value={formExpense.category} onChange={e => setFormExpense({...formExpense, category: e.target.value})} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#04060B] border border-slate-300 dark:border-slate-700 text-sm font-bold">
                  <option>Listrik</option>
                  <option>Air</option>
                  <option>Wifi</option>
                  <option>Sewa Tempat</option>
                  <option>Bahan Baku</option>
                  <option>Operasional Lainnya</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Keterangan (Opsional)</label>
                <input type="text" value={formExpense.description} onChange={e => setFormExpense({...formExpense, description: e.target.value})} placeholder="Contoh: Token Listrik Juli" className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#04060B] border border-slate-300 dark:border-slate-700 text-sm font-bold" />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Nominal (Rp)</label>
                <input type="number" required value={formExpense.amount} onChange={e => setFormExpense({...formExpense, amount: e.target.value})} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#04060B] border border-slate-300 dark:border-slate-700 text-sm font-bold" />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setExpenseModal(false)} className="flex-1 bg-slate-200 dark:bg-slate-800 font-bold py-3 rounded-xl">Batal</button>
                <button type="submit" className="flex-1 bg-[#2563EB] text-white font-bold py-3 rounded-xl">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL KARYAWAN */}
      {employeeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F172A] w-full max-w-md p-8 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-black mb-6">Tambah Karyawan</h3>
            <form onSubmit={handleAddEmployee} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1">Pilih Cabang</label>
                <select value={formEmployee.tenant_id} onChange={e => setFormEmployee({...formEmployee, tenant_id: e.target.value})} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#04060B] border border-slate-300 dark:border-slate-700 text-sm font-bold">
                  {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Nama Lengkap</label>
                <input type="text" required value={formEmployee.name} onChange={e => setFormEmployee({...formEmployee, name: e.target.value})} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#04060B] border border-slate-300 dark:border-slate-700 text-sm font-bold" />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Jabatan</label>
                <select value={formEmployee.role} onChange={e => setFormEmployee({...formEmployee, role: e.target.value})} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#04060B] border border-slate-300 dark:border-slate-700 text-sm font-bold">
                  <option>Kasir</option>
                  <option>Koki / Barista</option>
                  <option>Pelayan</option>
                  <option>Manager</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Gaji Pokok (Rp)</label>
                <input type="number" required value={formEmployee.base_salary} onChange={e => setFormEmployee({...formEmployee, base_salary: e.target.value})} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#04060B] border border-slate-300 dark:border-slate-700 text-sm font-bold" />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setEmployeeModal(false)} className="flex-1 bg-slate-200 dark:bg-slate-800 font-bold py-3 rounded-xl">Batal</button>
                <button type="submit" className="flex-1 bg-[#EA8B42] text-white font-bold py-3 rounded-xl">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PAYROLL */}
      {payrollModal.open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F172A] w-full max-w-md p-8 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-black mb-2">Catat {payrollModal.type}</h3>
            <p className="text-sm font-bold text-slate-500 mb-6">{payrollModal.employee.name}</p>
            <form onSubmit={handlePayroll} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1">Nominal (Rp)</label>
                <input type="number" required value={formPayroll.amount} onChange={e => setFormPayroll({...formPayroll, amount: e.target.value})} placeholder={payrollModal.type === 'Gaji' ? payrollModal.employee.base_salary : ''} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#04060B] border border-slate-300 dark:border-slate-700 text-sm font-bold" />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Catatan (Opsional)</label>
                <input type="text" value={formPayroll.notes} onChange={e => setFormPayroll({...formPayroll, notes: e.target.value})} placeholder="Contoh: Gaji Bulan Juli" className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#04060B] border border-slate-300 dark:border-slate-700 text-sm font-bold" />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setPayrollModal({ open: false, employee: null, type: 'Gaji' })} className="flex-1 bg-slate-200 dark:bg-slate-800 font-bold py-3 rounded-xl">Batal</button>
                <button type="submit" className="flex-1 bg-[#2563EB] text-white font-bold py-3 rounded-xl">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOM CONFIRM MODAL (PENGGANTI ALERT BAWAAN BROWSER) */}
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

      {/* TOAST */}
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