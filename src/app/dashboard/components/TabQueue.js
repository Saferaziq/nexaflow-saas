'use client';

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
  onConfirmPayment,
  printingOrderId,
}) {
  const isLight = theme === 'light';
  const textMainClass = isLight ? 'text-[#2A1F17]' : 'text-white';
  const textSubClass = isLight ? 'text-slate-600' : 'text-slate-300';
  const cardClass = isLight ? 'bg-white border-2 border-[#D4C5B8]' : 'bg-slate-900 border-2 border-slate-700';

  const formatOrderDateTime = (createdAt) => {
    if (!createdAt) return '-';
    const date = new Date(createdAt);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getAge = (createdAt) => {
    if (!createdAt) return '';
    const diff = Math.max(0, Math.floor((nowTick - new Date(createdAt).getTime()) / 60000));
    if (diff < 1) return 'Baru saja';
    if (diff < 60) return `${diff} mnt`;
    if (diff < 1440) {
      const hours = Math.floor(diff / 60);
      const mins = diff % 60;
      return mins > 0 ? `${hours} jam ${mins} mnt` : `${hours} jam`;
    }
    const days = Math.floor(diff / 1440);
    return `${days} hari lalu`;
  };

  const getAgeColor = (createdAt) => {
    if (!createdAt) return isLight ? 'text-slate-500' : 'text-slate-400';
    const diff = Math.max(0, Math.floor((nowTick - new Date(createdAt).getTime()) / 60000));
    if (diff < 10) return isLight ? 'text-emerald-600' : 'text-emerald-400';
    if (diff < 20) return isLight ? 'text-amber-600' : 'text-amber-400';
    return isLight ? 'text-rose-600 font-black animate-pulse' : 'text-rose-400 font-black animate-pulse';
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['unpaid', 'active', 'completed', 'all'].map((f) => (
          <button
            key={f}
            onClick={() => setQueueFilter(f)}
            className={`px-5 py-2.5 rounded-lg text-xs font-black uppercase transition-all border-2 whitespace-nowrap ${
              queueFilter === f
                ? isLight
                  ? 'bg-[#3A2A20] text-white border-[#2A1F17] shadow-md'
                  : 'bg-cyan-600 text-white border-cyan-400 shadow-md'
                : isLight
                ? 'bg-white text-slate-600 border-[#D4C5B8] hover:bg-[#F4EFE9]'
                : 'bg-slate-800 text-slate-200 border-slate-600 hover:bg-slate-700'
            }`}
          >
            {f === 'unpaid' ? 'Menunggu Bayar' : f === 'active' ? 'Sedang Proses' : f === 'completed' ? 'Selesai' : 'Semua'}
          </button>
        ))}
      </div>

      {displayOrders.length === 0 ? (
        <div className={`rounded-xl p-20 text-center shadow-sm border-2 ${cardClass}`}>
          <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center ${isLight ? 'bg-[#F4EFE9] text-[#8C7A6B]' : 'bg-slate-800 text-slate-300'}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
          </div>
          <p className={`font-black text-xl ${textMainClass}`}>Tidak ada pesanan</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayOrders.map((order) => {
            const isWaitingPayment = ['WAITING_QRIS', 'WAITING_CASH'].includes(order.payment_status);
            const isPrinting = printingOrderId === order.id;
            const isFinished = order.status === 'completed' || order.status === 'cancelled';

            let statusLabel = null;
            if (isWaitingPayment) statusLabel = <div className="absolute top-0 right-0 bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-lg border-b-2 border-l-2 border-amber-300">Menunggu Bayar</div>;
            else if (order.status === 'pending') statusLabel = <div className="absolute top-0 right-0 bg-slate-100 text-slate-800 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-lg border-b-2 border-l-2 border-slate-300">Antrian</div>;
            else if (order.status === 'cooking') statusLabel = <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-lg border-b-2 border-l-2 border-blue-300">Dimasak</div>;
            else if (order.status === 'ready') statusLabel = <div className="absolute top-0 right-0 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-lg border-b-2 border-l-2 border-emerald-300">Siap</div>;

            return (
              <div
                key={order.id}
                className={`rounded-xl p-5 flex flex-col relative shadow-sm overflow-hidden ${cardClass}`}
              >
                {statusLabel}

                <div className="flex justify-between items-start gap-2 mb-4 mt-2">
                  <div className="min-w-0">
                    <div className="mb-1.5">
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm ${isLight ? 'bg-[#3A2A20] text-white' : 'bg-slate-700 text-amber-300 border border-slate-600'}`}>
                        Antrean #{order.queue_number || '-'}
                      </span>
                    </div>
                    <h3 className={`font-black text-2xl ${textMainClass}`}>Meja {order.table_number}</h3>
                    <p className={`text-sm font-bold truncate ${textSubClass}`}>
                      {order.customer_name || 'Tanpa Nama'}
                    </p>
                    <p className={`text-[11px] font-semibold mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      {formatOrderDateTime(order.created_at)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {!isFinished && (
                      <span className={`text-xs font-black ${getAgeColor(order.created_at)}`}>
                        {getAge(order.created_at)}
                      </span>
                    )}
                    {order.payment_method && (
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded border-2 ${
                        order.payment_method === 'QRIS'
                          ? isLight
                            ? 'bg-cyan-50 text-cyan-700 border-cyan-300'
                            : 'bg-cyan-950/60 text-cyan-300 border-cyan-600'
                          : isLight
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : 'bg-emerald-950/60 text-emerald-300 border-emerald-600'
                      }`}>
                        {order.payment_method}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex-1 space-y-2.5 mb-4">
                  {(order.items || []).map((item, idx) => (
                    <div key={idx} className="flex justify-between gap-2 text-sm items-start">
                      <span className={`font-bold leading-snug ${isLight ? 'text-[#2A1F17]' : 'text-slate-100'}`}>
                        <span className={`font-black px-1.5 py-0.5 rounded border mr-2 inline-block ${isLight ? 'bg-[#F4EFE9] border-[#D4C5B8] text-[#3A2A20]' : 'bg-slate-800 border-slate-600 text-cyan-300'}`}>{item.qty}x</span>
                        {item.name}
                      </span>
                      <span className={`font-black whitespace-nowrap ${isLight ? 'text-[#2A1F17]' : 'text-white'}`}>
                        {rp(item.price * item.qty)}
                      </span>
                    </div>
                  ))}
                  {order.order_note && (
                    <div className={`mt-2 p-2.5 border-2 rounded-lg ${isLight ? 'bg-amber-50 border-amber-200' : 'bg-amber-950/50 border-amber-700'}`}>
                      <p className={`text-xs font-bold ${isLight ? 'text-amber-800' : 'text-amber-200'}`}>Catatan: {order.order_note}</p>
                    </div>
                  )}
                </div>

                <div className={`border-t-2 pt-3 mt-auto space-y-3 ${isLight ? 'border-slate-200' : 'border-slate-700'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-sm font-black uppercase tracking-wider ${textSubClass}`}>Total</span>
                    <span className={`text-xl font-black ${isLight ? 'text-[var(--primary-color)]' : 'text-cyan-400'}`}>{rp(order.total_price)}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {isWaitingPayment && (
                      <button
                        onClick={() => onConfirmPayment(order.id)}
                        className="col-span-2 w-full bg-cyan-500 text-white font-black py-3 rounded-lg border-2 border-cyan-600 hover:bg-cyan-600 transition-all text-sm uppercase tracking-wide shadow-sm"
                      >
                        Konfirmasi Lunas
                      </button>
                    )}

                    {!isWaitingPayment && (
                      <>
                        <button
                          type="button"
                          disabled={isPrinting}
                          onClick={() => onPrintBill(order)}
                          className={`col-span-2 w-full font-bold py-2.5 rounded-lg border-2 transition-colors flex items-center justify-center gap-2 text-xs uppercase tracking-wide disabled:opacity-60 ${isLight ? 'bg-white border-[#D4C5B8] text-slate-700 hover:bg-slate-50' : 'bg-slate-800 border-slate-600 text-slate-100 hover:bg-slate-700'}`}
                        >
                          {isPrinting ? (
                            <>
                              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                              <span>Menyiapkan Bill...</span>
                            </>
                          ) : (
                            <>
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                              <span>Cetak Bill</span>
                            </>
                          )}
                        </button>

                        {order.status === 'pending' && (
                          <button
                            onClick={() => onUpdateOrderStatus(order.id, 'cooking')}
                            className="col-span-2 w-full bg-amber-500 text-white font-black py-3 rounded-lg border-2 border-amber-600 hover:bg-amber-600 transition-all text-sm uppercase tracking-wide shadow-sm"
                          >
                            Proses Pesanan
                          </button>
                        )}
                        {order.status === 'cooking' && (
                          <button
                            onClick={() => onUpdateOrderStatus(order.id, 'ready')}
                            className="col-span-2 w-full bg-emerald-500 text-white font-black py-3 rounded-lg border-2 border-emerald-600 hover:bg-emerald-600 transition-all text-sm uppercase tracking-wide shadow-sm"
                          >
                            Tandai Siap
                          </button>
                        )}
                        {order.status === 'ready' && (
                          <button
                            onClick={() => onUpdateOrderStatus(order.id, 'completed')}
                            className="col-span-2 w-full bg-blue-500 text-white font-black py-3 rounded-lg border-2 border-blue-600 hover:bg-blue-600 transition-all text-sm uppercase tracking-wide shadow-sm"
                          >
                            Selesaikan Pesanan
                          </button>
                        )}
                      </>
                    )}

                    {!isFinished && (
                      <button
                        onClick={() => onCancelOrder(order.id)}
                        className={`col-span-2 w-full font-bold py-2.5 rounded-lg border-2 transition-all text-xs uppercase tracking-wide mt-2 ${
                          isLight
                            ? 'bg-rose-50 text-rose-600 border-rose-300 hover:bg-rose-500 hover:text-white'
                            : 'bg-rose-950/50 text-rose-300 border-rose-700 hover:bg-rose-600 hover:text-white'
                        }`}
                      >
                        Tolak Pesanan
                      </button>
                    )}
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
