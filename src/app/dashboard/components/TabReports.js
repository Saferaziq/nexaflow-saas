'use client';

import { Icons } from '../helpers/icons';

const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

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
}) {
  const textMainClass = theme === 'light' ? 'text-[#2A1F17]' : 'text-white';
  const textSubClass = theme === 'light' ? 'text-[#5C4B3E]' : 'text-slate-300';
  const cardClass = theme === 'light' ? 'bg-white border-2 border-[#D4C5B8]' : 'bg-slate-900 border-2 border-slate-700';
  const inputClass = `w-full border-2 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-[var(--primary-color)]/20 focus:border-[var(--primary-color)] ${theme === 'light' ? 'border-[#D4C5B8] bg-white text-[#2A1F17]' : 'border-slate-600 bg-slate-800 text-white'}`;

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
        </div>

        {reportMode === 'daily' && (
          <input type="date" value={reportDateStr} onChange={e => setReportDateStr(e.target.value)} className={inputClass} />
        )}
        {reportMode === 'weekly' && (
          <div className={`rounded-xl p-4 border-2 ${theme === 'light' ? 'bg-[#F4EFE9] border-[#D4C5B8]' : 'bg-slate-800 border-slate-600'}`}>
            <p className={`text-xs font-bold ${textSubClass}`}>📅 Menampilkan data 7 hari terakhir (termasuk hari ini)</p>
            <p className={`text-sm font-black mt-1 ${textMainClass}`}>{reportLabel}</p>
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
        <div className={`rounded-2xl p-5 shadow-sm border-2 ${cardClass}`}><p className={`text-[10px] font-extrabold uppercase tracking-widest mb-2 ${textSubClass}`}>Total Pesanan</p><p className={`text-3xl font-black ${textMainClass}`}>{reportStats?.totalOrders || 0}</p></div>
        <div className={`rounded-2xl p-5 shadow-sm border-2 ${cardClass}`}><p className={`text-[10px] font-extrabold uppercase tracking-widest mb-2 ${textSubClass}`}>Total Omset</p><p className="text-2xl font-black text-[var(--primary-color)]">{rp(reportStats?.revenue || 0)}</p></div>
        <div className={`rounded-2xl p-5 shadow-sm border-2 ${cardClass}`}><p className={`text-[10px] font-extrabold uppercase tracking-widest mb-2 ${textSubClass}`}>Rata-rata / Order</p><p className={`text-2xl font-black ${textMainClass}`}>{rp(reportStats?.avgOrder || 0)}</p></div>
        <div className={`rounded-2xl p-5 shadow-sm border-2 ${cardClass}`}><p className={`text-[10px] font-extrabold uppercase tracking-widest mb-2 ${textSubClass}`}>Item Terjual</p><p className={`text-3xl font-black ${textMainClass}`}>{reportStats?.totalItems || 0}</p></div>
      </div>

      {/* 🔥 QRIS vs CASH BREAKDOWN */}
      <div className="grid grid-cols-2 gap-4">
        <div className={`rounded-2xl p-5 shadow-sm border-2 ${theme === 'light' ? 'bg-cyan-50 border-cyan-400' : 'bg-cyan-950 border-cyan-600'}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">📱</span>
            <p className={`text-[10px] font-extrabold uppercase tracking-widest ${theme === 'light' ? 'text-cyan-800' : 'text-cyan-400'}`}>Pendapatan QRIS</p>
          </div>
          <p className={`text-2xl font-black ${theme === 'light' ? 'text-cyan-800' : 'text-cyan-300'}`}>{rp(reportStats?.revenueQRIS || 0)}</p>
          <p className={`text-xs font-bold mt-1 ${theme === 'light' ? 'text-cyan-700' : 'text-cyan-500'}`}>{reportStats?.countQRIS || 0} transaksi</p>
        </div>
        <div className={`rounded-2xl p-5 shadow-sm border-2 ${theme === 'light' ? 'bg-emerald-50 border-emerald-400' : 'bg-emerald-950 border-emerald-600'}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">💵</span>
            <p className={`text-[10px] font-extrabold uppercase tracking-widest ${theme === 'light' ? 'text-emerald-800' : 'text-emerald-400'}`}>Pendapatan Cash</p>
          </div>
          <p className={`text-2xl font-black ${theme === 'light' ? 'text-emerald-800' : 'text-emerald-300'}`}>{rp(reportStats?.revenueCash || 0)}</p>
          <p className={`text-xs font-bold mt-1 ${theme === 'light' ? 'text-emerald-700' : 'text-emerald-500'}`}>{reportStats?.countCash || 0} transaksi</p>
        </div>
      </div>

      {/* 🔥 DAFTAR PESANAN DITOLAK */}
      {reportStats?.cancelledCount > 0 && (
        <div className={`rounded-[2rem] p-6 shadow-sm border-2 ${theme === 'light' ? 'bg-rose-50 border-rose-300' : 'bg-slate-900 border-rose-900'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">❌</span>
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
    </div>
  );
}