'use client';

import { Icons } from '../helpers/icons';

export default function StatsCards({ theme, stats, rp }) {
  const textMainClass = theme === 'light' ? 'text-[#2A1F17]' : 'text-white';
  const cardClass = theme === 'light' ? 'bg-white border-2 border-[#D4C5B8]' : 'bg-slate-900 border-2 border-slate-700';

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className={`rounded-xl p-5 shadow-sm transition-colors duration-300 ${cardClass}`}>
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-8 h-8 rounded-md flex items-center justify-center border-2 ${theme === 'light' ? 'bg-[#F4EFE9] border-[#D4C5B8] text-[#3A2A20]' : 'bg-slate-800 border-slate-600 text-slate-300'}`}>
            <Icons.Clipboard />
          </div>
          <p className={`text-[11px] font-black uppercase tracking-widest ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>Total Pesanan</p>
        </div>
        <h3 className={`text-4xl font-black tracking-tight ${textMainClass}`}>{stats?.total || 0}</h3>
        <p className={`text-xs font-bold mt-1 ${theme === 'light' ? 'text-slate-500' : 'text-slate-500'}`}>Hari ini</p>
      </div>

      <div className={`rounded-xl p-5 shadow-sm transition-colors duration-300 ${cardClass}`}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center border-2 border-emerald-300">
            <Icons.Grid />
          </div>
          <p className={`text-[11px] font-black uppercase tracking-widest ${theme === 'light' ? 'text-emerald-700' : 'text-emerald-400'}`}>Siap Saji</p>
        </div>
        <h3 className={`text-4xl font-black tracking-tight ${theme === 'light' ? 'text-emerald-700' : 'text-emerald-400'}`}>{stats?.ready || 0}</h3>
        <p className={`text-xs font-bold mt-1 ${theme === 'light' ? 'text-slate-500' : 'text-slate-500'}`}>Menunggu diantar</p>
      </div>

      <div className={`rounded-xl p-5 shadow-sm transition-colors duration-300 ${cardClass}`}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center border-2 border-amber-300">
            <Icons.Clock />
          </div>
          <p className={`text-[11px] font-black uppercase tracking-widest ${theme === 'light' ? 'text-amber-700' : 'text-amber-400'}`}>Dimasak</p>
        </div>
        <h3 className={`text-4xl font-black tracking-tight ${theme === 'light' ? 'text-amber-700' : 'text-amber-400'}`}>{stats?.cooking || 0}</h3>
        <p className={`text-xs font-bold mt-1 ${theme === 'light' ? 'text-slate-500' : 'text-slate-500'}`}>Sedang diproses</p>
      </div>

      <div className="rounded-xl p-5 bg-[#3A2A20] shadow-sm text-white border-2 border-[#2A1F17]">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center border-2 border-white/20">
            <Icons.Chart />
          </div>
          <p className="text-[11px] font-black text-white/80 uppercase tracking-widest">Omset Hari Ini</p>
        </div>
        <h3 className="text-3xl font-black tracking-tight">{rp(stats?.revenue || 0)}</h3>
        <p className="text-xs text-white/70 font-bold mt-1">Total pendapatan</p>
      </div>
    </div>
  );
}