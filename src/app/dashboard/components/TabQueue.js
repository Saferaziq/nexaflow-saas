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
        {['active', 'completed', 'all'].map((f) => (
          <button
            key={f}
            onClick={() => setQueueFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all border-2 ${
              queueFilter === f
                ? 'bg-[var(--primary-color)] text-white border-[var(--primary-color)]'
                : theme === 'light'
                ? 'bg-white text-slate-600 border-[#D4C5B8] hover:bg-[#F4EFE9]'
                : 'bg-slate-800 text-slate-300 border-slate-600 hover:bg-slate-700'
            }`}
          >
            {f === 'active' ? 'Aktif' : f === 'completed' ? 'Selesai' : 'Semua'}
          </button>
        ))}
      </div>

      {displayOrders.length === 0 ? (
        <div className={`rounded-[2rem] p-20 text-center shadow-sm border-2 ${cardClass}`}>
          <div className="text-6xl mb-4 opacity-50">📋</div>
          <p className={`font-black text-xl ${textMainClass}`}>Tidak ada pesanan</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayOrders.map((order) => (
            <div
              key={order.id}
              className={`rounded-2xl p-4 flex flex-col relative shadow-sm border-2 ${cardClass} ${
                order.status === 'ready' ? 'border-emerald-400 shadow-emerald-100' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className={`font-black text-lg ${textMainClass}`}>Meja {order.table_number}</h3>
                  <p className="text-xs font-bold text-slate-500">
                    {order.customer_name || 'Tanpa Nama'}
                  </p>
                </div>
                <span className={`text-xs font-black ${getAgeColor(order.created_at)}`}>
                  {getAge(order.created_at)}
                </span>
              </div>

              <div className="flex-1 space-y-2 mb-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-slate-600 font-semibold">
                      {item.qty}x {item.name}
                    </span>
                    <span className="font-bold text-slate-800">
                      {rp(item.price * item.qty)}
                    </span>
                  </div>
                ))}
                {order.order_note && (
                  <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-xs text-amber-800 font-bold">Catatan: {order.order_note}</p>
                  </div>
                )}
              </div>

              <div className="border-t-2 border-slate-200 pt-3 mt-auto space-y-2">
                <div className="flex justify-between font-black text-sm mb-3">
                  <span className={textMainClass}>Total</span>
                  <span className="text-[var(--primary-color)]">{rp(order.total_price)}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onPrintBill(order)}
                    className="col-span-2 w-full bg-slate-100 text-slate-700 font-bold py-2.5 rounded-lg border-2 border-slate-300 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                  >
                    🖨️ Cetak Bill & QRIS
                  </button>

                  {order.status === 'pending' && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, 'cooking')}
                      className="col-span-2 w-full bg-amber-100 text-amber-700 font-bold py-2 rounded-lg border-2 border-amber-300 hover:bg-amber-500 hover:text-white transition-colors"
                    >
                      Proses Pesanan
                    </button>
                  )}
                  {order.status === 'cooking' && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, 'ready')}
                      className="col-span-2 w-full bg-emerald-100 text-emerald-700 font-bold py-2 rounded-lg border-2 border-emerald-300 hover:bg-emerald-500 hover:text-white transition-colors"
                    >
                      Tandai Siap
                    </button>
                  )}
                  {order.status === 'ready' && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, 'completed')}
                      className="col-span-2 w-full bg-blue-100 text-blue-700 font-bold py-2 rounded-lg border-2 border-blue-300 hover:bg-blue-500 hover:text-white transition-colors"
                    >
                      Selesaikan Pesanan
                    </button>
                  )}
                  
                  {order.status !== 'completed' && order.status !== 'cancelled' && (
                     <button
                        onClick={() => onCancelOrder(order.id)}
                        className="col-span-2 w-full bg-rose-100 text-rose-600 font-bold py-2 rounded-lg border-2 border-rose-300 hover:bg-rose-500 hover:text-white transition-colors"
                      >
                        Tolak Pesanan
                      </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}