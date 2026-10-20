'use client';
import { useEffect, useState, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { useSearchParams } from 'next/navigation';

function OrderContent() {
  const searchParams = useSearchParams();
  const tenantId = searchParams.get('tenant');
  const tableNumber = searchParams.get('table');

  const [cafe, setCafe] = useState({ name: 'Kafe', logo_url: '' });
  const [menus, setMenus] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('menu');
  const [category, setCategory] = useState('all');
  const [myOrders, setMyOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!tenantId) return;
    const fetchData = async () => {
      const { data: cafeData } = await supabase.from('tenants').select('*').eq('id', tenantId).single();
      if (cafeData) setCafe(cafeData);
      const { data: menuData } = await supabase.from('menus').select('*').eq('tenant_id', tenantId).eq('status', 'available');
      if (menuData) setMenus(menuData);
      setLoading(false);
    };
    fetchData();

    const channel = supabase.channel('customer-realtime-' + Date.now())
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'tenants', filter: `id=eq.${tenantId}` }, (payload) => setCafe(payload.new))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: `tenant_id=eq.${tenantId}` }, () => {
        const existingOrders = JSON.parse(localStorage.getItem('my_order_ids_' + tableNumber) || '[]');
        if (existingOrders.length > 0) fetchMyOrders(existingOrders);
      })
      .subscribe();

    const existingIds = JSON.parse(localStorage.getItem('my_order_ids_' + tableNumber) || '[]');
    if (existingIds.length > 0) fetchMyOrders(existingIds);

    return () => supabase.removeChannel(channel);
  }, [tenantId, tableNumber]);

  const fetchMyOrders = async (ids) => {
    const { data } = await supabase.from('orders').select('*').in('id', ids).order('created_at', { ascending: false });
    if (data) setMyOrders(data);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  };

  const addToCart = (menu) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === menu.id);
      if (ex) return prev.map(i => i.id === menu.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...menu, qty: 1, note: '' }];
    });
    showToast(`${menu.name} ditambah ✓`);
  };

  const decCart = (id) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === id);
      if (ex.qty === 1) return prev.filter(i => i.id !== id);
      return prev.map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i);
    });
  };

  const updateItemNote = (id, note) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, note } : i));
  };

  const totalPrice = cart.reduce((s, i) => s + (i.price * i.qty), 0);
  const totalCartQty = cart.reduce((a, b) => a + b.qty, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);
    const orderData = { tenant_id: tenantId, table_number: tableNumber, items: cart, total_price: totalPrice, status: 'pending', payment_status: 'unpaid', payment_method: 'cash' };
    const { data, error } = await supabase.from('orders').insert([orderData]).select().single();
    if (error) { alert('Gagal: ' + error.message); setIsSubmitting(false); return; }
    const existingIds = JSON.parse(localStorage.getItem('my_order_ids_' + tableNumber) || '[]');
    localStorage.setItem('my_order_ids_' + tableNumber, JSON.stringify([...existingIds, data.id]));
    setCart([]); setIsSubmitting(false); setActiveTab('status');
    fetchMyOrders([...existingIds, data.id]);
    showToast('Pesanan terkirim! 🎉');
  };

  if (!tenantId || !tableNumber) return <div className="p-10 text-center font-bold text-slate-800">QR Code tidak valid.</div>;
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-orange-500 rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-slate-600 font-bold text-sm">Memuat menu...</p>
      </div>
    </div>
  );

  const filteredMenus = menus.filter(m => {
    const matchCat = category === 'all' || m.category === category;
    const matchSearch = !searchQuery || m.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const categoryEmoji = { makanan: '🍽️', minuman: '🥤', cemilan: '🍿' };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-28">
      
      {/* HERO HEADER */}
      <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 text-white overflow-hidden">
        <div className="relative px-5 pt-5 pb-10">
          <div className="flex items-center justify-between mb-6">
            <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black tracking-wider">✦ NEXAFLOW</div>
            <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-black">📍 Meja {tableNumber}</div>
          </div>
          
          <div className="flex items-center gap-4">
            {cafe.logo_url ? (
              <img src={cafe.logo_url} className="w-16 h-16 rounded-2xl bg-white object-cover border-2 border-white/50 shadow-xl" alt="Logo" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl font-black border-2 border-white/30">
                {cafe.name.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-black text-white drop-shadow-sm truncate">{cafe.name}</h1>
              <p className="text-xs text-white/80 font-bold mt-0.5">Selamat datang! 👋</p>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="px-4 -mt-5 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center px-4 py-3">
          <span className="text-slate-400 text-lg">🔍</span>
          <input type="text" placeholder="Cari menu favorit Anda..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 ml-3 text-sm font-medium outline-none text-slate-800 placeholder-slate-400" />
          {searchQuery && <button onClick={() => setSearchQuery('')} className="text-slate-400 text-lg font-bold">×</button>}
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-4 mt-4">
        {activeTab === 'menu' && (
          <>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
              <button onClick={() => setCategory('all')} className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all ${category === 'all' ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'bg-white text-slate-700 border border-slate-200'}`}>
                ✨ Semua
              </button>
              {['makanan', 'minuman', 'cemilan'].map(cat => (
                <button key={cat} onClick={() => setCategory(cat)} className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all ${category === cat ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'bg-white text-slate-700 border border-slate-200'}`}>
                  {categoryEmoji[cat]} {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>

            <div className="space-y-3 mt-2">
              {filteredMenus.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
                  <div className="text-5xl mb-3">🍽️</div>
                  <p className="text-slate-500 font-bold text-sm">Menu tidak ditemukan</p>
                  <p className="text-slate-400 text-xs mt-1">Coba kata kunci lain atau kategori berbeda</p>
                </div>
              ) : filteredMenus.map(menu => {
                const cartItem = cart.find(c => c.id === menu.id);
                return (
                  <div key={menu.id} className="bg-white p-3 rounded-3xl shadow-sm flex gap-3 border border-slate-100 relative">
                    <div className="w-24 h-24 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0 relative">
                      {menu.image_url ? <img src={menu.image_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-4xl">🍽️</div>}
                      {cartItem && (
                        <div className="absolute top-1 right-1 bg-orange-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                          {cartItem.qty}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <h3 className="font-black text-slate-900 text-sm truncate">{menu.name}</h3>
                        <p className="text-[11px] text-slate-500 font-medium line-clamp-2 mt-0.5">{menu.description || 'Menu andalan kami'}</p>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="font-black text-orange-600 text-sm">Rp {Number(menu.price).toLocaleString('id-ID')}</span>
                        {cartItem ? (
                          <div className="flex items-center gap-2">
                            <button onClick={() => decCart(menu.id)} className="w-7 h-7 bg-slate-100 rounded-full font-black text-slate-700 text-lg flex items-center justify-center">-</button>
                            <span className="font-black text-slate-900 text-sm w-4 text-center">{cartItem.qty}</span>
                            <button onClick={() => addToCart(menu)} className="w-7 h-7 bg-orange-500 text-white rounded-full font-black text-lg flex items-center justify-center shadow-sm">+</button>
                          </div>
                        ) : (
                          <button onClick={() => addToCart(menu)} className="w-8 h-8 bg-orange-500 text-white rounded-full font-black text-xl flex items-center justify-center shadow-md shadow-orange-500/30 active:scale-95 transition-transform">+</button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {activeTab === 'cart' && (
          <>
            {cart.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 mt-4">
                <div className="text-6xl mb-4">🛒</div>
                <p className="text-slate-700 font-black text-base">Keranjang masih kosong</p>
                <p className="text-slate-400 text-xs mt-2 mb-6">Yuk pilih menu favorit Anda dulu</p>
                <button onClick={() => setActiveTab('menu')} className="bg-orange-500 text-white font-black px-6 py-3 rounded-xl text-sm shadow-md">Lihat Menu</button>
              </div>
            ) : (
              <>
                <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm mt-2">
                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
                    <h3 className="font-black text-slate-900 text-sm">Pesanan Anda</h3>
                    <span className="text-[10px] bg-orange-50 text-orange-600 px-2.5 py-1 rounded-full font-black">{totalCartQty} item</span>
                  </div>
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="border-b pb-4 last:border-0 last:pb-0 border-slate-100">
                        <div className="flex justify-between items-start gap-3">
                          <div className="w-14 h-14 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                            {item.image_url ? <img src={item.image_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xl">🍽️</div>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-black text-slate-900 text-sm truncate">{item.name}</p>
                            <p className="text-xs text-orange-600 font-black mt-0.5">Rp {Number(item.price).toLocaleString('id-ID')}</p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => decCart(item.id)} className="w-7 h-7 bg-slate-100 rounded-full font-black text-slate-700">-</button>
                            <span className="w-5 text-center font-black text-slate-900 text-xs">{item.qty}</span>
                            <button onClick={() => addToCart(item)} className="w-7 h-7 bg-orange-500 text-white rounded-full font-black">+</button>
                          </div>
                        </div>
                        <input
                          type="text"
                          placeholder="Catatan (mis. tanpa gula, tidak pedas)"
                          value={item.note || ''}
                          onChange={(e) => updateItemNote(item.id, e.target.value)}
                          className="w-full mt-2 text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-orange-500 bg-slate-50 font-medium"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm mt-3">
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between text-slate-500 font-semibold">
                      <span>Subtotal</span>
                      <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between font-black text-base pt-2 border-t border-slate-100">
                      <span className="text-slate-900">Total Bayar</span>
                      <span className="text-orange-600">Rp {totalPrice.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>

                <button onClick={handleCheckout} disabled={isSubmitting} className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-black py-4 rounded-2xl mt-3 shadow-lg shadow-orange-500/30 text-sm active:scale-[0.98] transition-transform disabled:opacity-50">
                  {isSubmitting ? '⏳ Mengirim...' : '🚀 Kirim Pesanan'}
                </button>
              </>
            )}
          </>
        )}

        {activeTab === 'status' && (
          <div className="space-y-3 mt-2">
            {myOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
                <div className="text-6xl mb-4">📋</div>
                <p className="text-slate-700 font-black text-base">Belum ada pesanan</p>
                <p className="text-slate-400 text-xs mt-2">Pesanan Anda akan muncul di sini</p>
              </div>
            ) : myOrders.map(o => {
              const statusIdx = ['pending', 'cooking', 'ready', 'completed'].indexOf(o.status);
              const statusLabels = ['Diterima', 'Dimasak', 'Siap', 'Selesai'];
              const statusEmojis = ['✅', '👨‍🍳', '🍽️', '🎉'];
              const statusColors = ['bg-amber-500', 'bg-blue-500', 'bg-emerald-500', 'bg-slate-700'];
              
              return (
                <div key={o.id} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-[10px] text-slate-400 font-black tracking-wider">ORDER #{o.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-xs text-slate-500 font-bold mt-0.5">{new Date(o.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase text-white ${statusColors[statusIdx]}`}>
                      {o.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 mb-4">
                    {o.items.map((i, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between text-xs font-bold text-slate-700">
                          <span>{i.qty}x {i.name}</span>
                          <span>Rp {(i.price * i.qty).toLocaleString('id-ID')}</span>
                        </div>
                        {i.note && <p className="text-[10px] text-orange-600 font-bold italic ml-3">↳ "{i.note}"</p>}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                    <span className="text-xs text-slate-500 font-bold">Total</span>
                    <span className="text-base font-black text-orange-600">Rp {Number(o.total_price).toLocaleString('id-ID')}</span>
                  </div>

                  <div className="mt-4 space-y-3">
                    {statusLabels.map((label, i) => {
                      const isDone = i <= statusIdx;
                      const isActive = i === statusIdx;
                      return (
                        <div key={i} className="flex items-start gap-3">
                          <div className="flex flex-col items-center">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${isDone ? statusColors[statusIdx] + ' text-white shadow-md' : 'bg-slate-100 text-slate-400'}`}>
                              {isDone ? statusEmojis[i] : (i + 1)}
                            </div>
                            {i < statusLabels.length - 1 && (
                              <div className={`w-0.5 h-4 mt-0.5 ${isDone && i < statusIdx ? statusColors[statusIdx] : 'bg-slate-100'}`}></div>
                            )}
                          </div>
                          <div className="flex-1 pt-0.5">
                            <p className={`text-xs font-black ${isDone ? 'text-slate-900' : 'text-slate-400'}`}>{label}</p>
                            {isActive && <p className="text-[10px] text-slate-500 font-medium mt-0.5">Sedang berlangsung...</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="text-center mt-8 pb-28">
        <p className="text-[10px] font-bold text-slate-400">
          Powered by <span className="text-orange-600 font-black">Nexa Flow</span>
        </p>
        <p className="text-[9px] text-slate-400 mt-0.5">WA: 081389744957</p>
      </div>

      {/* FLOATING BOTTOM NAV */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-3">
        <div className="max-w-md mx-auto bg-white/95 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-2xl p-1.5 flex gap-1">
          <button onClick={() => setActiveTab('menu')} className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-2xl transition-all ${activeTab === 'menu' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}>
            <span className="text-lg">🍽️</span>
            <span className="text-[10px] font-black mt-0.5">Menu</span>
          </button>
          <button onClick={() => setActiveTab('cart')} className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-2xl transition-all relative ${activeTab === 'cart' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}>
            <span className="text-lg">🛒</span>
            <span className="text-[10px] font-black mt-0.5">Keranjang</span>
            {totalCartQty > 0 && (
              <span className="absolute top-1 right-2 bg-orange-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
                {totalCartQty}
              </span>
            )}
          </button>
          <button onClick={() => setActiveTab('status')} className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-2xl transition-all ${activeTab === 'status' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}>
            <span className="text-lg">📋</span>
            <span className="text-[10px] font-black mt-0.5">Status</span>
          </button>
        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] bg-slate-900 text-white px-4 py-2.5 rounded-full text-xs font-black shadow-xl">
          {toast}
        </div>
      )}

    </div>
  );
}

export default function OrderPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-slate-200 border-t-orange-500 rounded-full animate-spin"></div></div>}><OrderContent /></Suspense>;
}
// FORCE UPDATE VERCEL