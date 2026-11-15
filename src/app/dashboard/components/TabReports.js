'use client';

import { useState, useMemo } from 'react';
import { Icons } from '../helpers/icons';

const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

const SvgIcons = {
  Calendar: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Qris: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
  Cash: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>,
  Warning: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  Plus: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Trash: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
};

export default function TabReports({
  theme,
  reportMode, setReportMode,
  reportDateStr, setReportDateStr,
  reportMonth, setReportMonth,
  reportYear, setReportYear,
  reportStartDateStr, setReportStartDateStr,
  reportEndDateStr, setReportEndDateStr,
  reportLabel,
  reportStats,
  topMenus,
  chartData,
  maxChartRev,
  totalChartRev,
  showDailyBreakdown,
  activeDays,
  onExportCSV,
  onPrintReport,
  rp,
  d,
}) {
  const textMainClass = theme === 'light' ? 'text-[#2A1F17]' : 'text-white';
  const textSubClass = theme === 'light' ? 'text-[#5C4B3E]' : 'text-slate-300';
  const cardClass = theme === 'light' ? 'bg-white border-2 border-[#D4C5B8]' : 'bg-slate-900 border-2 border-slate-700';
  const inputClass = `w-full border-2 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-[var(--primary-color)]/20 focus:border-[var(--primary-color)] ${theme === 'light' ? 'border-[#D4C5B8] bg-white text-[#2A1F17]' : 'border-slate-600 bg-slate-800 text-white'}`;

  const [expenseModal, setExpenseModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formExpense, setFormExpense] = useState({ description: '', quantity: 1, unit_price: 0 });

  const filteredExpenses = useMemo(() => {
    const exps = d?.expenses || [];
    return exps.filter(ex => {
      const exDate = new Date(ex.expense_date).toLocaleDateString('en-CA');
      if (reportMode === 'daily') return exDate === reportDateStr;
      if (reportMode === 'weekly') {
        const today = new Date();
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 6);
        return exDate >= weekAgo.toLocaleDateString('en-CA') && exDate <= today.toLocaleDateString('en-CA');
      }
      if (reportMode === 'monthly') {
        const year = reportYear;
        const month = String(reportMonth + 1).padStart(2, '0');
        return exDate.startsWith(`${year}-${month}`);
      }
      if (reportMode === 'custom') {
        return exDate >= reportStartDateStr && exDate <= reportEndDateStr;
      }
      return true;
    });
  }, [d?.expenses, reportMode, reportDateStr, reportMonth, reportYear, reportStartDateStr, reportEndDateStr]);

  const totalExpense = filteredExpenses.reduce((sum, ex) => sum + Number(ex.amount || 0), 0);
  const netProfit = (reportStats?.revenue || 0) - totalExpense;

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!d) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/dashboard/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant_id: d.tenantId,
          category: 'Belanja Harian', // <-- KATEGORI DEFAULT DITAMBAHKAN
          ...formExpense
        })
      });
      if (!res.ok) throw new Error('Gagal mencatat pengeluaran');
      
      d.showToast('Pengeluaran berhasil dicatat', 'success');
      setExpenseModal(false);
      setFormExpense({ description: '', quantity: 1, unit_price: 0 });
      d.fetchExpenses(d.tenantId);
    } catch (err) {
      d.showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className={`rounded-[2rem] p-6 shadow-sm border-2 ${cardClass}`}>
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { k: 'daily', l: 'Harian' },
            { k: 'weekly', l: 'Mingguan' },
            { k: 'monthly', l: 'Bulanan' },
            { k: 'custom', l: 'Custom' },
          ].map(({ k, l }) => (
            <button key={k} onClick={() => setReportMode(k)} className={`px-5 py-2 rounded-xl text-xs font-extrabold transition-all border-2 ${reportMode === k ? 'bg-[var(--primary-color)] text-white border-[var(--primary-dark)] shadow-md' : theme === 'light' ? 'bg-[#F4EFE9] border-[#D4C5B8] text-[#2A1F17]' : 'bg-slate-800 border-slate-600 text-slate-300'}`}>{l}</button>
          ))}
          <button onClick={() => setExpenseModal(true)} className="ml-auto bg-[var(--primary-color)] text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-md hover:bg-[var(--primary-dark)] transition-colors">
            <SvgIcons.Plus /> Catat Pengeluaran
          </button>
        </div>

        {reportMode === 'daily' && (
          <input type="date" value={reportDateStr} onChange={e => setReportDateStr(e.target.value)} className={inputClass} />
        )}
        {reportMode === 'weekly' && (
          <div className={`rounded-xl p-4 border-2 flex items-center gap-3 ${theme === 'light' ? 'bg-[#F4EFE9] border-[#D4C5B8]' : 'bg-slate-800 border-slate-600'}`}>
            <SvgIcons.Calendar />
            <div>
              <p className={`text-xs font-bold ${textSubClass}`}>Menampilkan data 7 hari terakhir (termasuk hari ini)</p>
              <p className={`text-sm font-black mt-1 ${textMainClass}`}>{reportLabel}</p>
            </div>
          </div>
        )}
        {reportMode === 'monthly' && (
          <div className="grid grid-cols-2 gap-3">
            <select value={reportMonth} onChange={e => setReportMonth(Number(e.target.value))} className={inputClass}>
              {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
            </select>
            <select value={reportYear} onChange={e => setReportYear(Number(e.target.value))} className={inputClass}>
              {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        )}
        {reportMode === 'custom' && (
          <div className="grid grid-cols-2 gap-3">
            <input type="date" value={reportStartDateStr} onChange={e => setReportStartDateStr(e.target.value)} className={inputClass} />
            <input type="date" value={reportEndDateStr} onChange={e => setReportEndDateStr(e.target.value)} className={inputClass} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`rounded-2xl p-5 shadow-sm border-2 ${cardClass}`}>
          <p className={`text-[10px] font-extrabold uppercase tracking-widest mb-2 ${textSubClass}`}>Total Pesanan</p>
          <p className={`text-3xl font-black ${textMainClass}`}>{reportStats?.totalOrders || 0}</p>
        </div>
        <div className={`rounded-2xl p-5 shadow-sm border-2 ${cardClass}`}>
          <p className={`text-[10px] font-extrabold uppercase tracking-widest mb-2 ${textSubClass}`}>Total Omset (Pendapatan)</p>
          <p className="text-2xl font-black text-[var(--primary-color)]">{rp(reportStats?.revenue || 0)}</p>
        </div>
        <div className={`rounded-2xl p-5 shadow-sm border-2 ${cardClass}`}>
          <p className={`text-[10px] font-extrabold uppercase tracking-widest mb-2 text-rose-500`}>Total Pengeluaran</p>
          <p className="text-2xl font-black text-rose-500">- {rp(totalExpense)}</p>
        </div>
        <div className={`rounded-2xl p-5 shadow-sm border-2 ${cardClass}`}>
          <p className={`text-[10px] font-extrabold uppercase tracking-widest mb-2 ${netProfit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>Laba Bersih</p>
          <p className={`text-2xl font-black ${netProfit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{rp(netProfit)}</p>
        </div>
      </div>

      {filteredExpenses.length > 0 && (
        <div className={`rounded-[2rem] p-6 shadow-sm border-2 ${cardClass}`}>
          <h3 className={`font-black text-lg mb-4 ${textMainClass}`}>Rincian Pengeluaran</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {filteredExpenses.map(ex => (
              <div key={ex.id} className={`flex justify-between items-center p-3 rounded-xl border-2 ${theme === 'light' ? 'bg-[#FAF6F2] border-[#E0D6CC]' : 'bg-slate-800 border-slate-700'}`}>
                <div>
                  <p className={`text-sm font-bold ${textMainClass}`}>{ex.description}</p>
                  <p className={`text-[10px] ${textSubClass}`}>{new Date(ex.expense_date).toLocaleDateString('id-ID')} • {ex.quantity} Qty x {rp(ex.unit_price)}</p>
                </div>
                <p className="text-sm font-black text-rose-500">- {rp(ex.amount)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className={`rounded-2xl p-5 shadow-sm border-2 ${theme === 'light' ? 'bg-cyan-50 border-cyan-400' : 'bg-cyan-950 border-cyan-600'}`}>
          <div className="flex items-center gap-2 mb-2">
            <SvgIcons.Qris />
            <p className={`text-[10px] font-extrabold uppercase tracking-widest ${theme === 'light' ? 'text-cyan-800' : 'text-cyan-400'}`}>Pendapatan QRIS</p>
          </div>
          <p className={`text-2xl font-black ${theme === 'light' ? 'text-cyan-800' : 'text-cyan-300'}`}>{rp(reportStats?.revenueQRIS || 0)}</p>
          <p className={`text-xs font-bold mt-1 ${theme === 'light' ? 'text-cyan-700' : 'text-cyan-500'}`}>{reportStats?.countQRIS || 0} transaksi</p>
        </div>
        <div className={`rounded-2xl p-5 shadow-sm border-2 ${theme === 'light' ? 'bg-emerald-50 border-emerald-400' : 'bg-emerald-950 border-emerald-600'}`}>
          <div className="flex items-center gap-2 mb-2">
            <SvgIcons.Cash />
            <p className={`text-[10px] font-extrabold uppercase tracking-widest ${theme === 'light' ? 'text-emerald-800' : 'text-emerald-400'}`}>Pendapatan Cash</p>
          </div>
          <p className={`text-2xl font-black ${theme === 'light' ? 'text-emerald-800' : 'text-emerald-300'}`}>{rp(reportStats?.revenueCash || 0)}</p>
          <p className={`text-xs font-bold mt-1 ${theme === 'light' ? 'text-emerald-700' : 'text-emerald-500'}`}>{reportStats?.countCash || 0} transaksi</p>
        </div>
      </div>

      {reportStats?.cancelledCount > 0 && (
        <div className={`rounded-[2rem] p-6 shadow-sm border-2 ${theme === 'light' ? 'bg-rose-50 border-rose-300' : 'bg-slate-900 border-rose-900'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <SvgIcons.Warning />
              <h3 className={`font-black text-lg ${theme === 'light' ? 'text-rose-800' : 'text-rose-400'}`}>Pesanan Ditolak</h3>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-black ${theme === 'light' ? 'bg-rose-200 text-rose-800' : 'bg-rose-900/50 text-rose-400'}`}>
              {reportStats.cancelledCount} Pesanan
            </span>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {reportStats.cancelledOrders.map((o) => (
              <div key={o.id} className={`p-4 rounded-xl border-2 flex flex-col gap-2 ${theme === 'light' ? 'bg-white border-rose-200' : 'bg-slate-800 border-rose-900/50'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`text-sm font-black ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Meja {o.table_number} - {o.customer_name || 'Tamu'}</p>
                    <p className="text-[10px] font-bold text-slate-500">{new Date(o.created_at).toLocaleString('id-ID')}</p>
                  </div>
                  <p className={`text-sm font-black ${theme === 'light' ? 'text-rose-600' : 'text-rose-400'}`}>{rp(o.total_price)}</p>
                </div>
                <div>
                  <p className={`text-xs font-semibold mb-1 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                    Item: {o.items?.map(i => `${i.qty}x ${i.name}`).join(', ')}
                  </p>
                  <p className={`text-xs font-bold p-2 rounded-lg inline-block ${theme === 'light' ? 'bg-rose-100 text-rose-800' : 'bg-rose-950 text-rose-300'}`}>
                    Keterangan: {o.order_note || 'Dibatalkan oleh Kasir'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={`rounded-[2rem] p-6 shadow-sm border-2 ${cardClass}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-black text-lg ${textMainClass}`}>7 Hari Terakhir</h3>
          <p className={`text-sm font-bold ${textSubClass}`}>Total: {rp(totalChartRev || 0)}</p>
        </div>
        <div className="flex items-end gap-2 h-40 pt-4">
          {(chartData || []).map((d, i) => {
            const safeMax = maxChartRev > 0 ? maxChartRev : 1;
            const heightPct = Math.max((d.revenue / safeMax) * 100, 4);
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div className="w-full rounded-t-lg bg-gradient-to-t from-[var(--primary-dark)] to-[var(--primary-color)] transition-all" style={{ height: `${heightPct}%` }}></div>
                <span className={`text-[9px] font-bold mt-1 ${textSubClass}`}>{d.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {topMenus && topMenus.length > 0 && (
        <div className={`rounded-[2rem] p-6 shadow-sm border-2 ${cardClass}`}>
          <h3 className={`font-black text-lg mb-4 ${textMainClass}`}>Menu Terlaris</h3>
          <div className="space-y-2">
            {topMenus.map(([name, data], i) => (
              <div key={name} className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor: theme === 'light' ? '#E8DFD3' : '#334155' }}>
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black ${theme === 'light' ? 'bg-[#F4EFE9] text-[var(--primary-color)]' : 'bg-slate-800 text-[var(--primary-color)]'}`}>{i + 1}</span>
                  <span className={`font-bold text-sm ${textMainClass}`}>{name}</span>
                </div>
                <div className="text-right">
                  <p className={`font-black text-sm ${textMainClass}`}>{data?.qty || 0}x</p>
                  <p className={`text-[11px] font-semibold ${textSubClass}`}>{rp(data?.revenue || 0)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button onClick={onExportCSV} className={`flex-1 font-extrabold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all border-2 ${theme === 'light' ? 'bg-white hover:bg-[#F4EFE9] border-[#D4C5B8] text-[#2A1F17]' : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-white'}`}>
          <Icons.Download /> Export CSV
        </button>
        <button onClick={onPrintReport} className="flex-1 bg-gradient-to-r from-[var(--primary-color)] to-[var(--primary-dark)] text-white font-extrabold py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 border-2 border-[var(--primary-dark)]">
          <Icons.Print /> Cetak Laporan
        </button>
      </div>

      {expenseModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className={`w-full max-w-md p-6 sm:p-8 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200 border-2 ${cardClass}`}>
            <h3 className={`text-xl font-black mb-6 ${textMainClass}`}>Catat Pengeluaran Baru</h3>
            
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className={`block text-xs font-bold mb-1 ${textSubClass}`}>Nama Barang / Keterangan</label>
                <input 
                  type="text" required 
                  value={formExpense.description} 
                  onChange={e => setFormExpense({...formExpense, description: e.target.value})} 
                  placeholder="Contoh: Beli Susu UHT" 
                  className={inputClass} 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-bold mb-1 ${textSubClass}`}>Jumlah (Qty)</label>
                  <input 
                    type="number" required min="1"
                    value={formExpense.quantity} 
                    onChange={e => setFormExpense({...formExpense, quantity: e.target.value})} 
                    className={inputClass} 
                  />
                </div>
                <div>
                  <label className={`block text-xs font-bold mb-1 ${textSubClass}`}>Harga Satuan (Rp)</label>
                  <input 
                    type="number" required min="0"
                    value={formExpense.unit_price} 
                    onChange={e => setFormExpense({...formExpense, unit_price: e.target.value})} 
                    placeholder="20000" 
                    className={inputClass} 
                  />
                </div>
              </div>

              <div className={`p-4 rounded-xl flex justify-between items-center border-2 ${theme === 'light' ? 'bg-rose-50 border-rose-200' : 'bg-rose-950 border-rose-900'}`}>
                <span className={`text-sm font-black uppercase ${theme === 'light' ? 'text-rose-800' : 'text-rose-400'}`}>Total Otomatis</span>
                <span className={`text-xl font-black ${theme === 'light' ? 'text-rose-600' : 'text-rose-400'}`}>{rp(Number(formExpense.quantity) * Number(formExpense.unit_price))}</span>
              </div>

              <div className="flex gap-2 pt-4">
                <button type="button" onClick={() => setExpenseModal(false)} className={`flex-1 font-bold py-3 rounded-xl transition-colors border-2 ${theme === 'light' ? 'bg-[#FAF6F2] border-[#D4C5B8] text-[#2A1F17] hover:bg-[#F4EFE9]' : 'bg-slate-800 border-slate-600 text-white hover:bg-slate-700'}`}>
                  Batal
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-[var(--primary-color)] text-white font-black py-3 rounded-xl hover:bg-[var(--primary-dark)] transition-colors disabled:opacity-50 shadow-md">
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Pengeluaran'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}