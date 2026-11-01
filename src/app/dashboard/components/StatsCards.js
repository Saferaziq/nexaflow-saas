'use client';

import { Icons } from '../helpers/icons';

export default function StatsCards({ theme, stats, rp }) {
  const textMainClass = theme === 'light' ? 'text-[#2A1F17]' : 'text-white';
  const textSubClass = theme === 'light' ? 'text-[#5C4B3E]' : 'text-slate-300';
  const cardClass = theme === 'light' ? 'bg-white border-2 border-[#D4C5B8]' : 'bg-slate-900 border-2 border-slate-700';

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

      {/* Total Pesanan */}
      <div className={`rounded-[2rem] p-6 shadow-sm relative overflow-hidden group transition-colors duration-300 ${cardClass}`}>
        <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-[4rem] -z-10 group-hover:scale-110 transition-transform ${theme === 'light' ? 'bg-[#F4EFE9]' : 'bg-slate-800/50'}`}></div>
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border ${theme === 'light' ? 'bg-[#F4EFE9] border-[#D4C5B8] text-[#5C4B3E]' : 'bg-slate-800 border-slate-600 text-slate-300'}`}>
            <Icons.Clipboard />
          </div>
          <p className={`text-[11px] font-extrabold uppercase tracking-widest ${theme === 'light' ? 'text-[#2A1F17]' : 'text-slate-300'}`}>Total Pesanan</p>
        </div>
        <h3 className={`text-4xl font-black tracking-tight ${theme === 'light' ? 'text-[#2A1F17]' : 'text-white'}`}>{stats.total}</h3>
        <p className={`text-xs font-semibold mt-1 ${theme === 'light' ? 'text-[#5C4B3E]' : 'text-slate-400'}`}>Hari ini</p>
      </div>

      {/* Siap Saji */}
      <div className={`rounded-[2rem] p-6 shadow-sm relative overflow-hidden group transition-colors duration-300 ${cardClass}`}>
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-bl-[4rem] -z-10 group-hover:scale-110 transition-transform"></div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-sm border border-emerald-300">
            <Icons.Grid />
          </div>
          <p className={`text-[11px] font-extrabold uppercase tracking-widest ${theme === 'light' ? 'text-emerald-700' : 'text-emerald-400'}`}>Siap Saji</p>
        </div>
        <h3 className={`text-4xl font-black tracking-tight ${theme === 'light' ? 'text-emerald-700' : 'text-emerald-400'}`}>{stats.ready}</h3>
        <p className={`text-xs font-semibold mt-1 ${theme === 'light' ? 'text-[#5C4B3E]' : 'text-slate-400'}`}>Menunggu diantar</p>
      </div>

      {/* Dimasak */}
      <div className={`rounded-[2rem] p-6 shadow-sm relative overflow-hidden group transition-colors duration-300 ${cardClass}`}>
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-bl-[4rem] -z-10 group-hover:scale-110 transition-transform"></div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-sm border border-amber-300">
            <Icons.Clock />
          </div>
          <p className={`text-[11px] font-extrabold uppercase tracking-widest ${theme === 'light' ? 'text-amber-700' : 'text-amber-400'}`}>Dimasak</p>
        </div>
        <h3 className={`text-4xl font-black tracking-tight ${theme === 'light' ? 'text-amber-700' : 'text-amber-400'}`}>{stats.cooking}</h3>
        <p className={`text-xs font-semibold mt-1 ${theme === 'light' ? 'text-[#5C4B3E]' : 'text-slate-400'}`}>Sedang diproses</p>
      </div>

      {/* Omset Hari Ini */}
      <div className="rounded-[2rem] p-6 bg-[#3A2A20] shadow-lg relative overflow-hidden group text-white border-2 border-[#2A1F17]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shadow-inner backdrop-blur-sm border border-white/20">
            <Icons.Chart />
          </div>
          <p className="text-[11px] font-extrabold text-white/80 uppercase tracking-widest">Omset Hari Ini</p>
        </div>
        <h3 className="text-3xl font-black tracking-tight drop-shadow-md">{rp(stats.revenue)}</h3>
        <p className="text-xs text-white/80 font-semibold mt-1">Total pendapatan</p>
      </div>

    </div>
  );
}