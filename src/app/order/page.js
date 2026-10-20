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
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'tenants', filter: `id=eq.${tenantId}` }, (payload) => {
        setCafe(payload.new); 
      })
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

  const addToCart = (menu) => { setCart(prev => { const ex = prev.find(i => i.id === menu.id); if (ex) return prev.map(i => i.id === menu.id ? { ...i, qty: i.qty + 1 } : i); return [...prev, { ...menu, qty: 1 }]; }); };
  const decCart = (id) => { setCart(prev => { const ex = prev.find(i => i.id === id); if (ex.qty === 1) return prev.filter(i => i.id !== id); return prev.map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i); }); };
  const totalPrice = cart.reduce((s, i) => s + (i.price * i.qty), 0);

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
  };

  if (!tenantId || !tableNumber) return <div className="p-10 text-center font-bold text-slate-800">QR Code tidak valid. Silakan scan ulang.</div>;
  if (loading) return <div className="p-10 text-center font-bold text-slate-800">Memuat menu...</div>;

  const filteredMenus = category === 'all' ? menus : menus.filter(m => m.category === category);
  const totalCartQty = cart.reduce((a,b) => a+b.qty, 0);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-32">
      
      {/* HEADER KAFE */}
      <div className="bg-gradient-to-br from-orange-500 to-amber-500 text-white p-6 rounded-b-3xl shadow-lg mb-4 flex items-center gap-4">
        {cafe.logo_url && <img src={cafe.logo_url} className="w-16 h-16 rounded-xl bg-white object-cover border-2 border-white shadow-md" alt="Logo" />}
        <div>
          <h1 className="text-2xl font-extrabold text-white drop-shadow-sm">{cafe.name}</h1>
          <p className="text-sm font-bold text-white opacity-90 mt-1">📍 Meja {tableNumber}</p>
        </div>
      </div>

      <div className="flex gap-2 px-4 max-w-md mx-auto">
        <button onClick={() => setActiveTab('menu')} className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'menu' ? 'bg-orange-600 text-white shadow-md' : 'bg-white text-slate-700 border border-slate-200'}`}>Menu</button>
        <button onClick={() => setActiveTab('cart')} className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'cart' ? 'bg-orange-600 text-white shadow-md' : 'bg-white text-slate-700 border border-slate-200'}`}>Keranjang ({totalCartQty})</button>
        <button onClick={() => setActiveTab('status')} className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'status' ? 'bg-orange-600 text-white shadow-md' : 'bg-white text-slate-700 border border-slate-200'}`}>Status</button>
      </div>

      {activeTab === 'menu' && (
        <div className="px-4 mt-4">
          <div className="flex gap-2 overflow-x-auto pb-3">
            {['all','makanan','minuman','cemilan'].map(cat => (
              <button key={cat} onClick={() => setCategory(cat)} className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${category === cat ? 'bg-orange-600 text-white shadow-md' : 'bg-white text-slate-700 border border-slate-200'}`}>
                {cat === 'all' ? 'Semua' : cat.charAt(0).toUpperCase()+cat.slice(1)}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            {filteredMenus.map(menu => (
              <div key={menu.id} className="bg-white p-3 rounded-2xl shadow-sm flex gap-3 border border-slate-100">
                <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                  {menu.image_url ? <img src={menu.image_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-3xl">🍽️</div>}
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    {/* Nama Menu: Warna Gelap, Bukan Hitam Pekat */}
                    <h3 className="font-extrabold text-slate-900 text-sm">{menu.name}</h3>
                    <p className="text-xs text-slate-500 font-medium line-clamp-2 mt-0.5">{menu.description}</p>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    {/* Harga: Oranye Tegas */}
                    <span className="font-extrabold text-orange-600 text-sm">Rp {Number(menu.price).toLocaleString('id-ID')}</span>
                    <button onClick={() => addToCart(menu)} className="w-8 h-8 bg-orange-50 text-orange-600 rounded-full font-bold text-xl flex items-center justify-center shadow-sm">+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'cart' && (
        <div className="px-4 mt-4 max-w-md mx-auto">
          {cart.length === 0 ? <div className="bg-white p-8 rounded-2xl text-center border border-slate-100"><p className="text-slate-500 font-bold">Keranjang masih kosong</p></div> : (
            <>
              <div className="bg-white rounded-2xl p-4 space-y-4 border border-slate-100 shadow-sm">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center border-b pb-3 last:border-0 border-slate-100">
                    <div>
                      <p className="font-extrabold text-slate-900 text-sm">{item.name}</p>
                      <p className="text-xs text-slate-500 font-bold mt-1">Rp {Number(item.price).toLocaleString('id-ID')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => decCart(item.id)} className="w-8 h-8 bg-slate-100 rounded-lg font-bold text-slate-700">-</button>
                      <span className="w-6 text-center font-bold text-slate-900 text-sm">{item.qty}</span>
                      <button onClick={() => addToCart(item)} className="w-8 h-8 bg-orange-50 text-orange-600 rounded-lg font-bold shadow-sm">+</button>
                    </div>
                  </div>
                ))}
                <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                  <span className="font-extrabold text-slate-900">Total:</span>
                  <span className="font-extrabold text-lg text-orange-600">Rp {totalPrice.toLocaleString('id-ID')}</span>
                </div>
              </div>
              <button onClick={handleCheckout} disabled={isSubmitting} className="w-full btn-3d-orange text-white font-bold py-4 rounded-2xl mt-4 shadow-lg text-sm">{isSubmitting ? 'Mengirim...' : '🚀 Kirim Pesanan'}</button>
            </>
          )}
        </div>
      )}

      {activeTab === 'status' && (
        <div className="px-4 mt-4 max-w-md mx-auto space-y-3">
          {myOrders.length === 0 ? <div className="bg-white p-8 rounded-2xl text-center border border-slate-100"><p className="text-slate-500 font-bold">Belum ada pesanan</p></div> : myOrders.map(o => (
            <div key={o.id} className="bg-white rounded-2xl p-4 space-y-3 shadow-sm border border-slate-100">
              <div className="flex justify-between items-center border-b pb-2 border-slate-100">
                <span className="font-bold text-xs text-slate-500">#{o.id.slice(0,8)}</span>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${o.status === 'pending' ? 'bg-amber-100 text-amber-700' : o.status === 'cooking' ? 'bg-blue-100 text-blue-700' : o.status === 'ready' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>{o.status}</span>
              </div>
              <div className="space-y-1">{o.items.map((i, idx) => <div key={idx} className="flex justify-between text-xs font-semibold text-slate-800"><span>{i.qty}x {i.name}</span><span>Rp {(i.price*i.qty).toLocaleString('id-ID')}</span></div>)}</div>
              <div className="border-t pt-2 flex justify-between font-extrabold text-slate-900 border-slate-100"><span>Total</span><span className="text-orange-600">Rp {Number(o.total_price).toLocaleString('id-ID')}</span></div>
              
              <div className="flex items-center gap-1 mt-2">
                {['pending','cooking','ready','completed'].map((step, i) => {
                  const labels = ['Diterima','Dimasak','Siap','Selesai'];
                  const currentIdx = ['pending','cooking','ready','completed'].indexOf(o.status);
                  const isDone = i <= currentIdx;
                  return (
                    <div key={step} className="flex-1 text-center">
                      <div className={`w-full h-1.5 rounded-full ${isDone ? 'bg-orange-500' : 'bg-slate-200'}`}></div>
                      <p className={`text-[9px] font-bold mt-1 ${isDone ? 'text-orange-600' : 'text-slate-400'}`}>{labels[i]}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {totalCartQty > 0 && activeTab !== 'cart' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-2xl z-50 rounded-t-3xl">
          <div className="max-w-md mx-auto flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-500 font-bold">{totalCartQty} item dipilih</p>
              <p className="font-extrabold text-lg text-slate-900">Rp {totalPrice.toLocaleString('id-ID')}</p>
            </div>
            <button onClick={() => setActiveTab('cart')} className="btn-3d-orange text-white font-bold py-3 px-6 rounded-xl shadow-md text-sm">Lihat Keranjang</button>
          </div>
        </div>
      )}

      <div className="text-center mt-10 mb-6 pb-20">
        <p className="text-[11px] font-bold text-slate-400">
          Powered by <span className="text-orange-600 font-extrabold">Nexa Flow</span> • WA: 081389744957
        </p>
      </div>

    </div>
  );
}

export default function OrderPage() {
  return <Suspense fallback={<div className="p-10 text-center font-bold text-slate-800">Memuat...</div>}><OrderContent /></Suspense>;
}