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

  if (!tenantId || !tableNumber) return <div className="p-10 text-center font-bold text-black">QR Code tidak valid. Silakan scan ulang.</div>;
  if (loading) return <div className="p-10 text-center font-bold text-black">Memuat menu...</div>;

  const filteredMenus = category === 'all' ? menus : menus.filter(m => m.category === category);
  const totalCartQty = cart.reduce((a,b) => a+b.qty, 0);

  return (
    <div className="min-h-screen bg-slate-100 font-sans pb-32">
      
      {/* HEADER KAFE */}
      <div className="bg-gradient-to-br from-orange-500 to-amber-500 text-white p-6 rounded-b-3xl shadow-lg mb-4 flex items-center gap-4">
        {cafe.logo_url && <img src={cafe.logo_url} className="w-16 h-16 rounded-xl bg-white object-cover border-2 border-white shadow-md" alt="Logo" />}
        <div>
          <h1 className="text-2xl font-black text-white drop-shadow-md">{cafe.name}</h1>
          <p className="text-sm font-black text-white mt-1">📍 Meja {tableNumber}</p>
        </div>
      </div>

      <div className="flex gap-1 px-4 max-w-md mx-auto">
        <button onClick={() => setActiveTab('menu')} className={`flex-1 py-3 rounded-xl text-sm font-black ${activeTab === 'menu' ? 'bg-orange-600 text-white shadow-md' : 'bg-white text-black border border-slate-300'}`}>Menu</button>
        <button onClick={() => setActiveTab('cart')} className={`flex-1 py-3 rounded-xl text-sm font-black ${activeTab === 'cart' ? 'bg-orange-600 text-white shadow-md' : 'bg-white text-black border border-slate-300'}`}>Keranjang ({totalCartQty})</button>
        <button onClick={() => setActiveTab('status')} className={`flex-1 py-3 rounded-xl text-sm font-black ${activeTab === 'status' ? 'bg-orange-600 text-white shadow-md' : 'bg-white text-black border border-slate-300'}`}>Status</button>
      </div>

      {activeTab === 'menu' && (
        <div className="px-4 mt-4">
          <div className="flex gap-2 overflow-x-auto pb-3">
            {['all','makanan','minuman','cemilan'].map(cat => (
              <button key={cat} onClick={() => setCategory(cat)} className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap ${category === cat ? 'bg-orange-600 text-white' : 'bg-white text-black border border-slate-300'}`}>
                {cat === 'all' ? 'Semua' : cat.charAt(0).toUpperCase()+cat.slice(1)}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            {filteredMenus.map(menu => (
              <div key={menu.id} className="bg-white p-3 rounded-2xl shadow-sm flex gap-3 border border-slate-200">
                <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                  {menu.image_url ? <img src={menu.image_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-3xl">🍽️</div>}
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    {/* Teks Nama Menu Hitam Pekat */}
                    <h3 className="font-black text-black text-base">{menu.name}</h3>
                    <p className="text-xs text-black font-semibold line-clamp-2 mt-0.5">{menu.description}</p>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    {/* Harga Oranye Tebal */}
                    <span className="font-black text-orange-600 text-base">Rp {Number(menu.price).toLocaleString('id-ID')}</span>
                    <button onClick={() => addToCart(menu)} className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full font-black text-xl flex items-center justify-center">+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'cart' && (
        <div className="px-4 mt-4 max-w-md mx-auto">
          {cart.length === 0 ? <div className="bg-white p-8 rounded-2xl text-center border"><p className="text-black font-bold">Keranjang masih kosong</p></div> : (
            <>
              <div className="bg-white rounded-2xl p-4 space-y-4 border">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center border-b pb-3 last:border-0 border-slate-200">
                    <div>
                      {/* Teks Hitam Pekat */}
                      <p className="font-black text-black text-base">{item.name}</p>
                      <p className="text-sm text-black font-bold mt-1">Rp {Number(item.price).toLocaleString('id-ID')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => decCart(item.id)} className="w-8 h-8 bg-slate-200 rounded-lg font-black text-black text-lg">-</button>
                      <span className="w-6 text-center font-black text-black text-base">{item.qty}</span>
                      <button onClick={() => addToCart(item)} className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg font-black text-lg">+</button>
                    </div>
                  </div>
                ))}
                <div className="pt-3 border-t border-slate-300 flex justify-between items-center">
                  <span className="font-black text-black text-lg">Total:</span>
                  <span className="font-black text-xl text-orange-600">Rp {totalPrice.toLocaleString('id-ID')}</span>
                </div>
              </div>
              <button onClick={handleCheckout} disabled={isSubmitting} className="w-full btn-3d-orange text-white font-black py-4 rounded-2xl mt-4 shadow-lg text-lg">{isSubmitting ? 'Mengirim...' : '🚀 Kirim Pesanan'}</button>
            </>
          )}
        </div>
      )}

      {activeTab === 'status' && (
        <div className="px-4 mt-4 max-w-md mx-auto space-y-3">
          {myOrders.length === 0 ? <div className="bg-white p-8 rounded-2xl text-center border"><p className="text-black font-bold">Belum ada pesanan</p></div> : myOrders.map(o => (
            <div key={o.id} className="bg-white rounded-2xl p-4 space-y-3 shadow-sm border border-slate-200">
              <div className="flex justify-between items-center border-b pb-2 border-slate-200">
                <span className="font-black text-sm text-black">#{o.id.slice(0,8)}</span>
                <span className={`text-[11px] font-black px-2 py-1 rounded-full uppercase ${o.status === 'pending' ? 'bg-amber-200 text-black' : o.status === 'cooking' ? 'bg-blue-200 text-black' : o.status === 'ready' ? 'bg-emerald-200 text-black' : 'bg-slate-300 text-black'}`}>{o.status}</span>
              </div>
              <div className="space-y-1">{o.items.map((i, idx) => <div key={idx} className="flex justify-between text-sm font-bold text-black"><span>{i.qty}x {i.name}</span><span>Rp {(i.price*i.qty).toLocaleString('id-ID')}</span></div>)}</div>
              <div className="border-t pt-2 flex justify-between font-black text-black text-lg border-slate-200"><span>Total</span><span className="text-orange-600">Rp {Number(o.total_price).toLocaleString('id-ID')}</span></div>
              
              {/* Progress Bar Status */}
              <div className="flex items-center gap-1 mt-2">
                {['pending','cooking','ready','completed'].map((step, i) => {
                  const labels = ['Diterima','Dimasak','Siap','Selesai'];
                  const currentIdx = ['pending','cooking','ready','completed'].indexOf(o.status);
                  const isDone = i <= currentIdx;
                  return (
                    <div key={step} className="flex-1 text-center">
                      <div className={`w-full h-2 rounded-full ${isDone ? 'bg-orange-500' : 'bg-slate-200'}`}></div>
                      <p className={`text-[10px] font-black mt-1 ${isDone ? 'text-orange-600' : 'text-black'}`}>{labels[i]}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FLOATING CART BUTTON */}
      {totalCartQty > 0 && activeTab !== 'cart' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-300 p-4 shadow-2xl z-50 rounded-t-3xl">
          <div className="max-w-md mx-auto flex justify-between items-center">
            <div>
              <p className="text-sm text-black font-black">{totalCartQty} item dipilih</p>
              <p className="font-black text-xl text-black">Rp {totalPrice.toLocaleString('id-ID')}</p>
            </div>
            <button onClick={() => setActiveTab('cart')} className="btn-3d-orange text-white font-black py-3 px-6 rounded-xl shadow-md text-sm">Lihat Keranjang</button>
          </div>
        </div>
      )}

      {/* FOOTER BRANDING */}
      <div className="text-center mt-10 mb-6 pb-20">
        <p className="text-[11px] font-bold text-black">
          Powered by <span className="text-orange-600 font-black">Nexa Flow</span> • WA: 081389744957
        </p>
      </div>

    </div>
  );
}

export default function OrderPage() {
  return <Suspense fallback={<div className="p-10 text-center font-bold text-black">Memuat...</div>}><OrderContent /></Suspense>;
}