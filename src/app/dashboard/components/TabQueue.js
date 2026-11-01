'use client';

import { Icons } from '../helpers/icons';

export default function TabQueue({
  theme,
  displayOrders,
  queueFilter,
  setQueueFilter,
  nowTick,
  rp,
  onUpdateOrderStatus,
  onCancelOrder,
  onPrintBill,
}) {
  const textMainClass = theme === 'light' ? 'text-[#2A1F17]' : 'text-white';
  const textSubClass = theme === 'light' ? 'text-[#5C4B3E]' : 'text-slate-300';
  const cardClass = theme === 'light' ? 'bg-white border-2 border-[#D4C5B8]' : 'bg-slate-900 border-2 border-slate-700';

  const getStatusPill = (status) => ({ pending: 'status-pending', cooking: 'status-cooking', ready: 'status-ready', completed: 'status-completed', cancelled: 'status-cancelled' }[status] || 'status-completed');
  const getStatusLabel = (status) => ({ pending: 'Baru', cooking: 'Dimasak', ready: 'Siap', completed: 'Selesai', cancelled: 'Batal' }[status] || status);
  const getTimeBadge = (createdAt) => {
    if (!nowTick) return null;
    const mins = Math.floor((nowTick - new Date(createdAt).getTime()) / 60000);
    if (mins < 0) return null;
    if (mins < 5) return { mins, cls: 'bg-slate-200 border-slate-300 text-slate-700', pulse: false };
    if (mins < 15) return { mins, cls: 'bg-amber-100 border-amber-300 text-amber-800', pulse: false };
    return { mins, cls: 'bg-rose-100 border-rose-300 text-rose-800', pulse: true };
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className={`flex items-center gap-1 rounded-2xl p-1.5 w-fit border-2 shadow-sm ${theme === 'light' ? 'bg-[#E8DFD3] border-[#D4C5B8]' : 'bg-slate-900 border-slate-700'}`}>
          {[{ k: 'active', l: 'Aktif' }, { k: 'done', l: 'Selesai' }, { k: 'all', l: 'Semua' }].map(({ k, l }) => (
            <button
              key={k}
              onClick={() => setQueueFilter(k)}
              className={`px-5 py-2 rounded-xl text-xs font-extrabold transition-all ${queueFilter === k ? (theme === 'light' ? 'bg-white text-[#2A1F17] shadow-md border border-[#D4C5B8]' : 'bg-slate-700 text-white shadow-md border border-slate-600') : textSubClass}`}
            >
              {l}
            </button>
          ))}
        </div>
        {queueFilter === 'active' && (
          <p className={`text-[11px] font-bold flex items-center gap-1.5 ${textSubClass}`}>
            <Icons.Clock /> Urut dari yang paling lama menunggu
          </p>
        )}
      </div>

      {displayOrders.length === 0 ? (
        <div className={`rounded-[2rem] p-20 text-center shadow-sm border-2 ${cardClass}`}>
          <div className={`w-20 h-20 mx-auto mb-4 rounded-[1.5rem] flex items-center justify-center shadow-inner border-2 ${theme === 'light' ? 'bg-[#F4EFE9] border-[#D4C5B8]' : 'bg-slate-800 border-slate-600'}`}>
            <Icons.Clipboard />
          </div>
          <p className={`font-black text-xl ${textMainClass}`}>Tidak ada antrian pesanan</p>
          <p className={`text-sm font-semibold mt-1 ${textSubClass}`}>Pesanan baru akan muncul otomatis</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayOrders.map(order => {
            const badge = ['pending', 'cooking', 'ready'].includes(order.status) ? getTimeBadge(order.created_at) : null;
            return (
              <div key={order.id} className={`rounded-[2rem] overflow-hidden shadow-sm border-2 flex flex-col hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ${cardClass}`}>
                <div className={`px-6 py-5 border-b-2 flex justify-between items-center ${theme === 'light' ? 'bg-gradient-to-br from-[#F4EFE9] to-white border-[#D4C5B8]' : 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700'}`}>
                  <div>
                    <p className={`text-[10px] font-extrabold uppercase tracking-widest ${textSubClass}`}>Meja {order.table_number}</p>
                    <p className={`text-2xl font-black leading-tight truncate max-w-[150px] ${textMainClass}`}>{order.customer_name || 'Tamu'}</p>
                  </div>
                  <span className={`status-pill shadow-sm font-black ${getStatusPill(order.status)}`}>{getStatusLabel(order.status)}</span>
                </div>
                <div className="px-6 py-5 space-y-4 flex-1 flex flex-col">
                  <div className={`flex items-center justify-between gap-2 text-[11px] font-bold ${textSubClass}`}>
                    <span>#{order.id.slice(0, 8).toUpperCase()}</span>
                    <div className="flex items-center gap-2">
                      {badge && (
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border-2 text-[10px] font-black shadow-sm ${badge.cls} ${badge.pulse ? 'animate-pulse' : ''}`}>
                          <Icons.Clock /> {badge.mins}m
                        </span>
                      )}
                      <span>{new Date(order.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                  {order.order_note && (
                    <div className="bg-amber-100 border-l-4 border-amber-500 p-3 rounded-r-xl text-xs font-bold text-amber-800 shadow-sm">Catatan: {order.order_note}</div>
                  )}
                  <div className="space-y-3 pt-1 flex-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start gap-3">
                        <div className="flex-1">
                          <span className={`font-bold text-sm ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>{item.qty}x {item.name}</span>
                          {item.note && (
                            <p className={`text-[11px] font-bold mt-1 italic inline-block px-2 py-0.5 rounded border ${theme === 'light' ? 'text-[var(--primary-color)] bg-[var(--primary-light)] border-[var(--primary-color)]/20' : 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20'}`}>
                              Catatan: "{item.note}"
                            </p>
                          )}
                        </div>
                        <span className={`font-black text-sm whitespace-nowrap ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{rp(item.price * item.qty)}</span>
                      </div>
                    ))}
                  </div>
                  <div className={`pt-4 border-t-2 border-dashed flex justify-between items-center ${theme === 'light' ? 'border-[#D4C5B8]' : 'border-slate-700'}`}>
                    <span className={`text-xs font-extrabold ${textSubClass}`}>Total Tagihan</span>
                    <span className="text-xl font-black text-[var(--primary-color)]">{rp(order.total_price)}</span>
                  </div>
                  {order.status !== 'completed' && order.status !== 'cancelled' && (
                    <div className="space-y-2 pt-2">
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => onUpdateOrderStatus(order.id, 'cooking')} className={`font-extrabold py-2.5 rounded-xl text-xs transition-all shadow-sm active:scale-95 border-2 ${theme === 'light' ? 'bg-[var(--primary-light)] hover:bg-[var(--primary-color)] hover:text-white border-[var(--primary-color)]/30 text-[var(--primary-color)]' : 'bg-slate-800 hover:bg-[var(--primary-color)] border-slate-600 text-[var(--primary-color)] hover:text-white'}`}>Masak</button>
                        <button onClick={() => onUpdateOrderStatus(order.id, 'ready')} className="bg-emerald-100 hover:bg-emerald-500 text-emerald-700 hover:text-white border-2 border-emerald-300 font-extrabold py-2.5 rounded-xl text-xs transition-all shadow-sm active:scale-95">Sajikan</button>
                      </div>
                      <button onClick={() => onUpdateOrderStatus(order.id, 'completed')} className={`w-full font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all border-2 ${theme === 'light' ? 'bg-[#2A1F17] hover:bg-[#1A120D] text-white border-[#2A1F17]' : 'bg-slate-700 hover:bg-slate-600 text-white border-slate-600'}`}>Selesai / Lunas</button>
                      <button onClick={() => onCancelOrder(order.id)} className="w-full bg-rose-100 hover:bg-rose-500 text-rose-600 hover:text-white border-2 border-rose-300 font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"><Icons.X /> Tolak Pesanan</button>
                    </div>
                  )}
                  <div className="pt-2 mt-auto">
                    <button onClick={() => onPrintBill(order)} className="w-full bg-gradient-to-r from-[var(--primary-color)] to-[var(--primary-dark)] text-white font-extrabold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[var(--primary-color)]/30 active:scale-95 border-2 border-[var(--primary-dark)]">
                      <Icons.Print /> Cetak Bill & QRIS
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}