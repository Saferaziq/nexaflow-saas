'use client';

import { Icons } from '../helpers/icons';

export default function StatsCards({ theme, stats, rp }) {
  const isLight = theme === 'light';
  const textMainClass = isLight ? 'text-[#1A1512]' : 'text-white';
  const cardClass = isLight
    ? 'bg-white border-2 border-[#E0D6CC] shadow-sm'
    : 'bg-slate-900 border-2 border-slate-700 shadow-sm';

  const netProfit = Number(stats?.netProfit || 0);
  const unpaidRev = Number(stats?.unpaidRevenue || 0);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className={`rounded-2xl p-3.5 sm:p-5 transition-colors duration-300 min-w-0 ${cardClass}`}>
          <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
            <div
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center border-2 shrink-0 ${
                isLight
                  ? 'bg-[#F4EFE9] border-[#E0D6CC] text-[#1A1512]'
                  : 'bg-slate-800 border-slate-600 text-slate-300'
              }`}
            >
              <Icons.Clipboard />
            </div>
            <p
              className={`text-[10px] sm:text-[11px] font-black uppercase tracking-wider sm:tracking-widest leading-tight ${
                isLight ? 'text-[#8C7A6B]' : 'text-slate-400'
              }`}
            >
              Total Pesanan
            </p>
          </div>
          <h3 className={`text-2xl sm:text-4xl font-black tracking-tight ${textMainClass}`}>
            {stats?.total || 0}
          </h3>
          <p className={`text-[11px] sm:text-xs font-bold mt-1 ${isLight ? 'text-[#A69B91]' : 'text-slate-500'}`}>
            Siap: {stats?.ready || 0} · Masak: {stats?.cooking || 0}
          </p>
        </div>

        <div className={`rounded-2xl p-3.5 sm:p-5 transition-colors duration-300 min-w-0 ${cardClass}`}>
          <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border-2 border-emerald-200 shrink-0">
              <Icons.Grid />
            </div>
            <p
              className={`text-[10px] sm:text-[11px] font-black uppercase tracking-wider sm:tracking-widest leading-tight ${
                isLight ? 'text-emerald-600' : 'text-emerald-400'
              }`}
            >
              Laba Bersih
            </p>
          </div>
          <h3
            className={`text-lg sm:text-3xl font-black tracking-tight break-words ${
              netProfit < 0
                ? 'text-rose-500'
                : isLight
                ? 'text-emerald-600'
                : 'text-emerald-400'
            }`}
          >
            {rp(netProfit)}
          </h3>
          <p className={`text-[11px] sm:text-xs font-bold mt-1 ${isLight ? 'text-[#A69B91]' : 'text-slate-500'}`}>
            Kotor: {rp(stats?.grossProfit || 0)}
          </p>
        </div>

        <div className={`rounded-2xl p-3.5 sm:p-5 transition-colors duration-300 min-w-0 ${cardClass}`}>
          <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border-2 border-amber-200 shrink-0">
              <Icons.Clock />
            </div>
            <p
              className={`text-[10px] sm:text-[11px] font-black uppercase tracking-wider sm:tracking-widest leading-tight ${
                isLight ? 'text-amber-600' : 'text-amber-400'
              }`}
            >
              Menunggu Bayar
            </p>
          </div>
          <h3
            className={`text-lg sm:text-3xl font-black tracking-tight break-words ${
              isLight ? 'text-amber-600' : 'text-amber-400'
            }`}
          >
            {rp(unpaidRev)}
          </h3>
          <p className={`text-[11px] sm:text-xs font-bold mt-1 ${isLight ? 'text-[#A69B91]' : 'text-slate-500'}`}>
            Belum masuk kas lunas
          </p>
        </div>

        <div className="rounded-2xl p-3.5 sm:p-5 bg-[#2A1F17] text-white border-2 border-[#1A1512] shadow-md min-w-0">
          <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center border-2 border-white/20 shrink-0">
              <Icons.Chart />
            </div>
            <p className="text-[10px] sm:text-[11px] font-black text-[#D3C8BB] uppercase tracking-wider sm:tracking-widest leading-tight">
              Omset Lunas
            </p>
          </div>
          <h3 className="text-lg sm:text-3xl font-black tracking-tight break-words">
            {rp(stats?.revenue || 0)}
          </h3>
          <p className="text-[11px] sm:text-xs text-[#D3C8BB] font-bold mt-1">
            Cash {rp(stats?.cashRevenue || 0)} · QRIS {rp(stats?.qrisRevenue || 0)}
          </p>
        </div>
      </div>
    </div>
  );
}
