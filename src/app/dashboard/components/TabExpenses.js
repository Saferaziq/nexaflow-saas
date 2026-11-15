'use client';

import { useState } from 'react';
// Hapus import { Icons } jika tidak digunakan lagi

export default function TabExpenses({ theme, d, rp }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    category: 'Bahan Baku',
    description: '',
    quantity: 1,
    unit_price: 0
  });

  const textMainClass = theme === 'light' ? 'text-[#1A1512]' : 'text-white';
  const cardClass = theme === 'light' ? 'bg-white border-2 border-[#E0D6CC] shadow-sm' : 'bg-slate-900 border-2 border-slate-700 shadow-sm';
  
  const expenses = d.expenses || [];
  const todayStr = new Date().toLocaleDateString('en-CA');
  
  const todayExpenses = expenses.filter(ex => {
    const exDate = new Date(ex.expense_date).toLocaleDateString('en-CA');
    return exDate === todayStr;
  });

  const totalToday = todayExpenses.reduce((sum, ex) => sum + Number(ex.amount), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description || formData.unit_price <= 0) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/dashboard/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant_id: d.tenantId,
          ...formData
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      d.showToast('Pengeluaran berhasil dicatat', 'success');
      setModalOpen(false);
      setFormData({ category: 'Bahan Baku', description: '', quantity: 1, unit_price: 0 });
      d.fetchExpenses(d.tenantId);
    } catch (err) {
      d.showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className={`text-xl font-black ${textMainClass}`}>Pengeluaran Kas</h2>
          <p className="text-xs font-bold text-slate-500 mt-1">Total Pengeluaran Hari Ini: <span className="text-rose-500 font-black">{rp(totalToday)}</span></p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="bg-[#2A1F17] text-white px-5 py-3 rounded-xl text-sm font-black shadow-md hover:bg-[#1A1512] transition-colors flex items-center gap-2"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Catat Pengeluaran
        </button>
      </div>

      <div className={`rounded-2xl overflow-hidden ${cardClass}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800 border-b-2 border-slate-200 dark:border-slate-700">
              <tr className="text-[10px] uppercase tracking-wider text-slate-500 font-black">
                <th className="p-4 pl-6">Waktu</th>
                <th className="p-4">Barang / Keterangan</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Harga Satuan</th>
                <th className="p-4">Qty</th>
                <th className="p-4 pr-6 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {todayExpenses.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-slate-500 font-bold">Belum ada pengeluaran hari ini.</td></tr>
              ) : todayExpenses.map(ex => (
                <tr key={ex.id} className="hover:bg-slate-50 dark:hover:bg-[#111C33]/50 transition-colors">
                  <td className="p-4 pl-6 text-xs text-slate-500 font-bold">{new Date(ex.expense_date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</td>
                  <td className={`p-4 text-sm font-bold ${textMainClass}`}>{ex.description}</td>
                  <td className="p-4"><span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs font-bold">{ex.category}</span></td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{rp(ex.unit_price)}</td>
                  <td className="p-4 text-sm font-bold">{ex.quantity}</td>
                  <td className="p-4 pr-6 text-right font-black text-rose-500">- {rp(ex.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F172A] w-full max-w-md p-6 sm:p-8 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200 border-2 border-slate-200 dark:border-slate-800">
            <h3 className={`text-xl font-black mb-6 ${textMainClass}`}>Catat Pengeluaran Baru</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1 text-slate-500">Nama Barang / Keterangan</label>
                <input 
                  type="text" required 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  placeholder="Contoh: Beli Susu UHT" 
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#04060B] border border-slate-300 dark:border-slate-700 text-sm font-bold focus:border-cyan-500 outline-none" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-500">Kategori</label>
                  <select 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})} 
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#04060B] border border-slate-300 dark:border-slate-700 text-sm font-bold focus:border-cyan-500 outline-none"
                  >
                    <option>Bahan Baku</option>
                    <option>Operasional</option>
                    <option>Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-500">Jumlah (Qty)</label>
                  <input 
                    type="number" required min="1"
                    value={formData.quantity} 
                    onChange={e => setFormData({...formData, quantity: e.target.value})} 
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#04060B] border border-slate-300 dark:border-slate-700 text-sm font-bold focus:border-cyan-500 outline-none" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-slate-500">Harga Satuan (Rp)</label>
                <input 
                  type="number" required min="0"
                  value={formData.unit_price} 
                  onChange={e => setFormData({...formData, unit_price: e.target.value})} 
                  placeholder="Contoh: 20000" 
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#04060B] border border-slate-300 dark:border-slate-700 text-sm font-bold focus:border-cyan-500 outline-none" 
                />
              </div>

              <div className="bg-rose-50 dark:bg-rose-500/10 p-4 rounded-xl flex justify-between items-center border border-rose-200 dark:border-rose-500/20">
                <span className="text-sm font-black text-rose-800 dark:text-rose-400 uppercase">Total Otomatis</span>
                <span className="text-xl font-black text-rose-600 dark:text-rose-400">{rp(Number(formData.quantity) * Number(formData.unit_price))}</span>
              </div>

              <div className="flex gap-2 pt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 bg-slate-200 dark:bg-slate-800 font-bold py-3 rounded-xl hover:bg-slate-300 transition-colors">Batal</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-[#2A1F17] text-white font-black py-3 rounded-xl hover:bg-[#1A1512] transition-colors disabled:opacity-50">
                  {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}