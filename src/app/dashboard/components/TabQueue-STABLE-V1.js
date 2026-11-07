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
}) {
  const textMainClass = theme === 'light' ? 'text-[#2A1F17]' : 'text-white';
  const cardClass = theme === 'light' ? 'bg-white border-2 border-[#D4C5B8]' : 'bg-slate-900 border-2 border-slate-700';

  const getAge = (createdAt) => {
    if (!createdAt) return '';
    const diff = Math.floor((nowTick - new Date(createdAt).getTime()) / 60000);
    return `${diff} mnt`;
  };

  const getAgeColor = (createdAt) => {
    if (!createdAt) return 'text-slate-500';
    const diff = Math.floor((nowTick - new Date(createdAt).getTime()) / 60000);
    if (diff < 10) return 'text-emerald-500';
    if (diff < 20) return 'text-amber-500';
    return 'text-rose-500 font-black animate-pulse';
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
                ? 'bg-[#3A2A20] text-white border-[#2A1F17] shadow-md'
                : theme === 'light'
                ? 'bg-white text-slate-600 border-[#D4C5B8] hover:bg-[#F4EFE9]'
                : 'bg-slate-800 text-slate-300 border-slate-600 hover:bg-slate-700'
            }`}
          >
            {f === 'unpaid' ? 'Menunggu Bayar' : f === 'active' ? 'Sedang Proses' : f === 'completed' ? 'Selesai' : 'Semua'}
          </button>
        ))}
      </div>

      {displayOrders.length === 0 ? (
        <div className={`rounded-xl p-20 text-center shadow-sm border-2 ${cardClass}`}>
          <div className="text-6xl mb-4 opacity-50">📋</div>
          <p className={`font-black text-xl ${textMainClass}`}>Tidak ada pesanan</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayOrders.map((order) => {
            const isWaitingPayment = ['WAITING_QRIS', 'WAITING_CASH'].includes(order.payment_status);
            const isPaid = ['PAID', 'paid'].includes(order.payment_status) || !order.payment_status;
            
            let statusLabel = null;
            if (isWaitingPayment) statusLabel = <div className="absolute top-0 right-0 bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-lg border-b-2 border-l-2 border-amber-300">Menunggu Bayar</div>;
            else if (order.status === 'pending') statusLabel = <div className="absolute top-0 right-0 bg-slate-100 text-slate-800 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-lg border-b-2 border-l-2 border-slate-300">Antrian</div>;
            else if (order.status === 'cooking') statusLabel = <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-lg border-b-2 border-l-2 border-blue-300">Dimasak</div>;
            else if (order.status === 'ready') statusLabel = <div className="absolute top-0 right-0 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-lg border-b-2 border-l-2 border-emerald-300">Siap</div>;

            return (
              <div
                key={order.id}
                className={`rounded-xl p-5 flex flex-col relative shadow-sm overflow-hidden ${cardClass}`}
              >
                {statusLabel}

                <div className="flex justify-between items-start mb-4 mt-2">
                  <div>
                    <h3 className={`font-black text-2xl ${textMainClass}`}>Meja {order.table_number}</h3>
                    <p className="text-sm font-bold text-slate-500">
                      {order.customer_name || 'Tanpa Nama'}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-xs font-black ${getAgeColor(order.created_at)}`}>
                      {getAge(order.created_at)}
                    </span>
                    {order.payment_method && (
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded border-2 ${
                        order.payment_method === 'QRIS' 
                          ? 'bg-cyan-50 text-cyan-700 border-cyan-300' 
                          : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      }`}>
                        {order.payment_method}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex-1 space-y-3 mb-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm items-center">
                      <span className="font-bold text-[#2A1F17] dark:text-slate-200">
                        <span className={`font-black px-1.5 py-0.5 rounded border mr-2 ${theme === 'light' ? 'bg-[#F4EFE9] border-[#D4C5B8] text-[#3A2A20]' : 'bg-slate-800 border-slate-600 text-white'}`}>{item.qty}x</span> 
                        {item.name}
                      </span>
                      <span className="font-black text-[#2A1F17] dark:text-white">
                        {rp(item.price * item.qty)}
                      </span>
                    </div>
                  ))}
                  {order.order_note && (
                    <div className="mt-2 p-2 bg-amber-50 border-2 border-amber-200 rounded-lg">
                      <p className="text-xs text-amber-800 font-bold">Catatan: {order.order_note}</p>
                    </div>
                  )}
                </div>

                <div className={`border-t-2 pt-3 mt-auto space-y-3 ${theme === 'light' ? 'border-slate-200' : 'border-slate-700'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-sm font-black uppercase tracking-wider ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Total</span>
                    <span className="text-xl font-black text-[var(--primary-color)]">{rp(order.total_price)}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {isWaitingPayment && (
                      <button
                        onClick={() => onConfirmPayment(order.id)}
                        className="col-span-2 w-full bg-cyan-500 text-white font-black py-3 rounded-lg border-2 border-cyan-600 hover:bg-cyan-600 transition-all text-sm uppercase tracking-wide shadow-sm"
                      >
                        💰 Konfirmasi Lunas
                      </button>
                    )}

                    {!isWaitingPayment && (
                      <>
                        <button
                          onClick={() => onPrintBill(order)}
                          className={`col-span-2 w-full font-bold py-2.5 rounded-lg border-2 transition-colors flex items-center justify-center gap-2 text-xs uppercase tracking-wide ${theme === 'light' ? 'bg-white border-[#D4C5B8] text-slate-700 hover:bg-slate-50' : 'bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700'}`}
                        >
                          🖨️ Cetak Bill
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
                    
                    {order.status !== 'completed' && order.status !== 'cancelled' && (
                       <button
                          onClick={() => onCancelOrder(order.id)}
                          className="col-span-2 w-full bg-rose-50 text-rose-600 font-bold py-2.5 rounded-lg border-2 border-rose-300 hover:bg-rose-500 hover:text-white transition-all text-xs uppercase tracking-wide mt-2"
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