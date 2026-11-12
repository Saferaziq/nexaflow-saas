'use client';

import { Icons } from '../helpers/icons';

export default function StatsCards({ theme, stats, rp }) {
  // Warna teks super tegas (Hitam Pekat)
  const textMainClass = theme === 'light' ? 'text-[#1A1512]' : 'text-white';
  
  // Kartu TEGAS: Putih bersih dengan border tebal
  const cardClass = theme === 'light' ? 'bg-white border-2 border-[#E0D6CC] shadow-sm' : 'bg-slate-900 border-2 border-slate-700 shadow-sm';

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* Total Pesanan */}
      <div className={`rounded-2xl p-5 transition-colors duration-300 ${cardClass}`}>
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 ${theme === 'light' ? 'bg-[#F4EFE9] border-[#E0D6CC] text-[#1A1512]' : 'bg-slate-800 border-slate-600 text-slate-300'}`}>
            <Icons.Clipboard />
          </div>
          <p className={`text-[11px] font-black uppercase tracking-widest ${theme === 'light' ? 'text-[#8C7A6B]' : 'text-slate-400'}`}>Total Pesanan</p>
        </div>
        <h3 className={`text-4xl font-black tracking-tight ${textMainClass}`}>{stats?.total || 0}</h3>
        <p className={`text-xs font-bold mt-1 ${theme === 'light' ? 'text-[#A69B91]' : 'text-slate-500'}`}>Hari ini</p>
      </div>

      {/* Siap Saji */}
      <div className={`rounded-2xl p-5 transition-colors duration-300 ${cardClass}`}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border-2 border-emerald-200">
            <Icons.Grid />
          </div>
          <p className={`text-[11px] font-black uppercase tracking-widest ${theme === 'light' ? 'text-emerald-600' : 'text-emerald-400'}`}>Siap Saji</p>
        </div>
        <h3 className={`text-4xl font-black tracking-tight ${theme === 'light' ? 'text-emerald-600' : 'text-emerald-400'}`}>{stats?.ready || 0}</h3>
        <p className={`text-xs font-bold mt-1 ${theme === 'light' ? 'text-[#A69B91]' : 'text-slate-500'}`}>Menunggu diantar</p>
      </div>

      {/* Dimasak */}
      <div className={`rounded-2xl p-5 transition-colors duration-300 ${cardClass}`}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border-2 border-amber-200">
            <Icons.Clock />
          </div>
          <p className={`text-[11px] font-black uppercase tracking-widest ${theme === 'light' ? 'text-amber-600' : 'text-amber-400'}`}>Dimasak</p>
        </div>
        <h3 className={`text-4xl font-black tracking-tight ${theme === 'light' ? 'text-amber-600' : 'text-amber-400'}`}>{stats?.cooking || 0}</h3>
        <p className={`text-xs font-bold mt-1 ${theme === 'light' ? 'text-[#A69B91]' : 'text-slate-500'}`}>Sedang diproses</p>
      </div>

      {/* Omset (Warna Coklat Gelap Tegas) */}
      <div className="rounded-2xl p-5 bg-[#2A1F17] text-white border-2 border-[#1A1512] shadow-md">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border-2 border-white/20">
            <Icons.Chart />
          </div>
          <p className="text-[11px] font-black text-[#D3C8BB] uppercase tracking-widest">Omset Hari Ini</p>
        </div>
        <h3 className="text-3xl font-black tracking-tight">{rp(stats?.revenue || 0)}</h3>
        <p className="text-xs text-[#D3C8BB] font-bold mt-1">Total pendapatan</p>
      </div>

    </div>
  );
}