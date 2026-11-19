'use client';

import { Icons } from '../helpers/icons';

export default function StatsCards({ theme, stats, rp }) {
  const textMainClass = theme === 'light' ? 'text-[#1A1512]' : 'text-white';
  const cardClass = theme === 'light' ? 'bg-white border-2 border-[#E0D6CC] shadow-sm' : 'bg-slate-900 border-2 border-slate-700 shadow-sm';

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

      <div className={`rounded-2xl p-3.5 sm:p-5 transition-colors duration-300 min-w-0 ${cardClass}`}>
        <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center border-2 shrink-0 ${theme === 'light' ? 'bg-[#F4EFE9] border-[#E0D6CC] text-[#1A1512]' : 'bg-slate-800 border-slate-600 text-slate-300'}`}>
            <Icons.Clipboard />
          </div>
          <p className={`text-[10px] sm:text-[11px] font-black uppercase tracking-wider sm:tracking-widest leading-tight ${theme === 'light' ? 'text-[#8C7A6B]' : 'text-slate-400'}`}>Total Pesanan</p>
        </div>
        <h3 className={`text-2xl sm:text-4xl font-black tracking-tight ${textMainClass}`}>{stats?.total || 0}</h3>
        <p className={`text-[11px] sm:text-xs font-bold mt-1 ${theme === 'light' ? 'text-[#A69B91]' : 'text-slate-500'}`}>Hari ini</p>
      </div>

      <div className={`rounded-2xl p-3.5 sm:p-5 transition-colors duration-300 min-w-0 ${cardClass}`}>
        <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border-2 border-emerald-200 shrink-0">
            <Icons.Grid />
          </div>
          <p className={`text-[10px] sm:text-[11px] font-black uppercase tracking-wider sm:tracking-widest leading-tight ${theme === 'light' ? 'text-emerald-600' : 'text-emerald-400'}`}>Siap Saji</p>
        </div>
        <h3 className={`text-2xl sm:text-4xl font-black tracking-tight ${theme === 'light' ? 'text-emerald-600' : 'text-emerald-400'}`}>{stats?.ready || 0}</h3>
        <p className={`text-[11px] sm:text-xs font-bold mt-1 ${theme === 'light' ? 'text-[#A69B91]' : 'text-slate-500'}`}>Menunggu diantar</p>
      </div>

      <div className={`rounded-2xl p-3.5 sm:p-5 transition-colors duration-300 min-w-0 ${cardClass}`}>
        <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border-2 border-amber-200 shrink-0">
            <Icons.Clock />
          </div>
          <p className={`text-[10px] sm:text-[11px] font-black uppercase tracking-wider sm:tracking-widest leading-tight ${theme === 'light' ? 'text-amber-600' : 'text-amber-400'}`}>Dimasak</p>
        </div>
        <h3 className={`text-2xl sm:text-4xl font-black tracking-tight ${theme === 'light' ? 'text-amber-600' : 'text-amber-400'}`}>{stats?.cooking || 0}</h3>
        <p className={`text-[11px] sm:text-xs font-bold mt-1 ${theme === 'light' ? 'text-[#A69B91]' : 'text-slate-500'}`}>Sedang diproses</p>
      </div>

      <div className="rounded-2xl p-3.5 sm:p-5 bg-[#2A1F17] text-white border-2 border-[#1A1512] shadow-md min-w-0">
        <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center border-2 border-white/20 shrink-0">
            <Icons.Chart />
          </div>
          <p className="text-[10px] sm:text-[11px] font-black text-[#D3C8BB] uppercase tracking-wider sm:tracking-widest leading-tight">Omset Hari Ini</p>
        </div>
        <h3 className="text-lg sm:text-3xl font-black tracking-tight break-words">{rp(stats?.revenue || 0)}</h3>
        <p className="text-[11px] sm:text-xs text-[#D3C8BB] font-bold mt-1">Total pendapatan</p>
      </div>

    </div>
  );
}
