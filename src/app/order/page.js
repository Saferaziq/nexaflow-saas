'use client';
import { useEffect, useState, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { useSearchParams } from 'next/navigation';

const extractDominantColor = (imgUrl) => {
  try {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imgUrl;
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < data.length; i += 40) {
          const alpha = data[i + 3];
          if (alpha < 128) continue;
          r += data[i]; g += data[i + 1]; b += data[i + 2]; count++;
        }
        if (count > 0) {
          r = Math.floor(r / count); g = Math.floor(g / count); b = Math.floor(b / count);
          document.documentElement.style.setProperty('--primary-color', `rgb(${r}, ${g}, ${b})`);
          document.documentElement.style.setProperty('--primary-light', `rgba(${r}, ${g}, ${b}, 0.15)`);
        } else {
          throw new Error('Fallback');
        }
      } catch (err) {
        document.documentElement.style.setProperty('--primary-color', '#3A2A20');
        document.documentElement.style.setProperty('--primary-light', '#F4EFE9');
      }
    };
    img.onerror = () => {
      document.documentElement.style.setProperty('--primary-color', '#3A2A20');
      document.documentElement.style.setProperty('--primary-light', '#F4EFE9');
    };
  } catch (e) {
    document.documentElement.style.setProperty('--primary-color', '#3A2A20');
    document.documentElement.style.setProperty('--primary-light', '#F4EFE9');
  }
};

function OrderContent() {
  const searchParams = useSearchParams();
  const tenantId = searchParams.get('tenant');
  const tableNumber = searchParams.get('table');

  const [cafe, setCafe] = useState({ name: 'Kafe', logo_url: '', banner_url: '', wa_number: '', tax_percentage: 0 });
  const [menus, setMenus] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('menu');
  const [category, setCategory] = useState('all');
  const [myOrders, setMyOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [globalNote, setGlobalNote] = useState('');

  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', '#3A2A20');
    document.documentElement.style.setProperty('--primary-light', '#F4EFE9');

    if (!tenantId) return;
    const fetchData = async () => {
      const { data: cafeData } = await supabase.from('tenants').select('*').eq('id', tenantId).single();
      if (cafeData) {
        setCafe(cafeData);
        if (cafeData.banner_url) extractDominantColor(cafeData.banner_url);
        else if (cafeData.logo_url) extractDominantColor(cafeData.logo_url);
      }
      
      const { data: menuData } = await supabase.from('menus').select('*').eq('tenant_id', tenantId).eq('status', 'available').or('stock.is.null,stock.gt.0');
      if (menuData) setMenus(menuData);
      
      const savedName = localStorage.getItem('nexaflow_customer_name');
      if (savedName) setCustomerName(savedName);

      setLoading(false);
    };
    fetchData();

    const channel = supabase.channel('customer-realtime-' + Date.now())
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'tenants', filter: `id=eq.${tenantId}` }, (payload) => {
        setCafe(payload.new);
        if (payload.new.banner_url) extractDominantColor(payload.new.banner_url);
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
    showToast(`${menu.name} ditambah ✔`);
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

  const subtotal = cart.reduce((s, i) => s + (i.price * i.qty), 0);
  const taxRate = cafe.tax_percentage || 0;
  const taxAmount = (subtotal * taxRate) / 100;
  const totalPrice = subtotal + taxAmount;
  const totalCartQty = cart.reduce((a, b) => a + b.qty, 0);

  const openConfirmation = () => {
    if (cart.length === 0) return;
    setShowConfirmModal(true);
  };

  const handleCheckout = async () => {
    if (!customerName.trim()) {
      showToast('Mohon isi nama Anda');
      return;
    }
    setIsSubmitting(true);
    localStorage.setItem('nexaflow_customer_name', customerName.trim());

    const orderData = { 
      tenant_id: tenantId, 
      table_number: tableNumber, 
      customer_name: customerName.trim(),
      order_note: globalNote.trim(),
      items: cart, 
      subtotal: subtotal,
      tax_amount: taxAmount,
      total_price: totalPrice, 
      status: 'pending', 
      payment_status: 'unpaid', 
      payment_method: 'cash' 
    };

    const { data, error } = await supabase.from('orders').insert([orderData]).select().single();
    
    if (error) { 
      showToast('Gagal: ' + error.message); 
      setIsSubmitting(false); 
      return; 
    }

    const existingIds = JSON.parse(localStorage.getItem('my_order_ids_' + tableNumber) || '[]');
    localStorage.setItem('my_order_ids_' + tableNumber, JSON.stringify([...existingIds, data.id]));
    
    setCart([]); 
    setGlobalNote('');
    setIsSubmitting(false); 
    setShowConfirmModal(false);
    setActiveTab('status');
    fetchMyOrders([...existingIds, data.id]);
    showToast('Pesanan terkirim! 🎉');
  };

  if (!tenantId || !tableNumber) return <div className="p-10 text-center font-black text-slate-800">QR Code tidak valid.</div>;
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-slate-300 rounded-full animate-spin mx-auto border-t-[var(--primary-color)]"></div>
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
    <div className="min-h-screen bg-slate-50 font-sans pb-32">
      {/* HERO HEADER (Banner Background) */}
      <div className="relative overflow-hidden pb-safe rounded-b-[2.5rem] shadow-sm bg-slate-800">
        {cafe.banner_url ? (
          <img src={cafe.banner_url} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="Banner" />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-[var(--primary-color)] opacity-90"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10"></div>

        <div className="relative px-6 pt-10 pb-12 z-10">
          <div className="flex items-center justify-end mb-6">
            <div className="bg-black/50 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 text-white border-2 border-white/30 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> 
              Anda di Meja {tableNumber}
            </div>
          </div>
          <div className="flex items-center gap-4 mt-2">
            {cafe.logo_url ? (
              <img src={cafe.logo_url} className="w-16 h-16 rounded-2xl bg-white object-cover border-2 border-white shadow-lg" alt="Logo" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl font-black border-2 border-white/40 text-white shadow-sm">
                {cafe.name.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-black text-white drop-shadow-md truncate">{cafe.name}</h1>
              <p className="text-xs text-white/95 font-bold mt-1">Silakan pilih menu favorit Anda</p>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="px-5 -mt-6 relative z-20">
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border-2 border-slate-300 flex items-center px-4 py-3">
          <span className="text-slate-500 text-lg">🔍</span>
          <input type="text" placeholder="Cari menu..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 ml-3 text-[16px] font-bold outline-none text-slate-800 placeholder:text-slate-500 bg-transparent" />
          {searchQuery && <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600 text-xl font-black px-2">×</button>}
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-5 mt-6">
        {activeTab === 'menu' && (
          <>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
              <button onClick={() => setCategory('all')} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all border-2 ${category === 'all' ? 'bg-slate-800 text-white border-slate-800 shadow-md' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}`}>✨ Semua</button>
              {['makanan', 'minuman', 'cemilan'].map(cat => (
                <button key={cat} onClick={() => setCategory(cat)} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all border-2 ${category === cat ? 'bg-slate-800 text-white border-slate-800 shadow-md' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}`}>
                  {categoryEmoji[cat]} {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              {filteredMenus.length === 0 ? (
                <div className="col-span-2 bg-white rounded-3xl p-10 text-center shadow-sm border-2 border-slate-300">
                  <div className="text-5xl mb-3 opacity-50">🍽️</div>
                  <p className="text-slate-800 font-black text-sm">Menu tidak ditemukan</p>
                </div>
              ) : filteredMenus.map(menu => {
                const cartItem = cart.find(c => c.id === menu.id);
                return (
                  <div key={menu.id} className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col border-2 border-slate-300 relative">
                    <div className="aspect-[4/3] bg-slate-100 relative w-full border-b-2 border-slate-200">
                      {menu.image_url ? <img src={menu.image_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-4xl">🍽️</div>}
                      {cartItem && <div className="absolute top-2 right-2 bg-[var(--primary-color)] text-white text-[11px] font-black w-6 h-6 rounded-full flex items-center justify-center shadow-md border-2 border-white">{cartItem.qty}</div>}
                    </div>
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-black text-slate-900 text-[13px] leading-tight line-clamp-1">{menu.name}</h3>
                        <p className="text-[10px] text-slate-600 font-semibold line-clamp-2 mt-1 leading-snug min-h-[2em]">{menu.description || 'Menu andalan kami'}</p>
                      </div>
                      <div className="mt-2 flex flex-col gap-2">
                        <span className="font-black text-[var(--primary-color)] text-sm">Rp {Number(menu.price).toLocaleString('id-ID')}</span>
                        {cartItem ? (
                          <div className="flex items-center justify-between bg-slate-50 rounded-lg p-1 border-2 border-slate-300">
                            <button onClick={() => decCart(menu.id)} className="w-6 h-6 bg-white border border-slate-300 rounded shadow-sm font-black text-slate-700 flex items-center justify-center">-</button>
                            <span className="font-black text-slate-900 text-xs">{cartItem.qty}</span>
                            <button onClick={() => addToCart(menu)} className="w-6 h-6 bg-[var(--primary-color)] text-white rounded shadow-sm font-black flex items-center justify-center border border-[var(--primary-color)]">+</button>
                          </div>
                        ) : (
                          <button onClick={() => addToCart(menu)} className="w-full bg-[var(--primary-light)] text-[var(--primary-color)] font-black py-1.5 rounded-lg text-xs transition-colors hover:bg-[var(--primary-color)] hover:text-white border-2 border-[var(--primary-color)]/20">Tambah</button>
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
              <div className="bg-white rounded-3xl p-10 text-center shadow-sm border-2 border-slate-300 mt-4">
                <div className="text-6xl mb-4 opacity-50">🛒</div>
                <p className="text-slate-800 font-black text-base">Keranjang masih kosong</p>
                <button onClick={() => setActiveTab('menu')} className="bg-[var(--primary-color)] text-white font-black px-6 py-3 rounded-xl text-sm mt-4 shadow-md border-2 border-[var(--primary-dark)]">Lihat Menu</button>
              </div>
            ) : (
              <>
                <div className="bg-white rounded-3xl p-5 border-2 border-slate-300 shadow-sm mt-2">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-slate-200">
                    <h3 className="font-black text-slate-900 text-sm">Pesanan Anda</h3>
                    <span className="text-[10px] bg-[var(--primary-light)] text-[var(--primary-color)] px-2.5 py-1 rounded-full font-black border border-[var(--primary-color)]/20">{totalCartQty} item</span>
                  </div>
                  <div className="space-y-5">
                    {cart.map(item => (
                      <div key={item.id} className="border-b-2 border-slate-100 pb-5 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start gap-3">
                          <div className="w-14 h-14 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 border border-slate-300">
                            {item.image_url ? <img src={item.image_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xl">🍽️</div>}
                          </div>
                          <div className="flex-1 min-w-0 pt-0.5">
                            <p className="font-black text-slate-900 text-sm truncate">{item.name}</p>
                            <p className="text-xs text-[var(--primary-color)] font-black mt-1">Rp {Number(item.price).toLocaleString('id-ID')}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => decCart(item.id)} className="w-7 h-7 bg-slate-100 border border-slate-300 rounded-full font-black text-slate-700">-</button>
                            <span className="w-5 text-center font-black text-slate-900 text-xs">{item.qty}</span>
                            <button onClick={() => addToCart(item)} className="w-7 h-7 bg-[var(--primary-light)] border border-[var(--primary-color)]/30 text-[var(--primary-color)] rounded-full font-black">+</button>
                          </div>
                        </div>
                        <input type="text" placeholder="Catatan (mis. tanpa gula)" value={item.note || ''} onChange={(e) => updateItemNote(item.id, e.target.value)} className="w-full mt-3 text-[16px] bg-slate-50 border-2 border-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[var(--primary-color)] font-bold text-slate-900 placeholder:text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-5 border-2 border-slate-300 shadow-sm mt-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-slate-600 font-bold">
                      <span>Subtotal</span>
                      <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                    </div>
                    {taxRate > 0 && (
                      <div className="flex justify-between text-slate-600 font-bold">
                        <span>PPN ({taxRate}%)</span>
                        <span>Rp {taxAmount.toLocaleString('id-ID')}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-black text-base pt-3 border-t-2 border-slate-200 mt-2">
                      <span className="text-slate-900">Total Bayar</span>
                      <span className="text-[var(--primary-color)]">Rp {totalPrice.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>

                <button onClick={openConfirmation} disabled={isSubmitting} className="w-full bg-[var(--primary-color)] text-white font-black py-4 rounded-2xl mt-3 shadow-lg text-sm active:scale-[0.98] transition-transform border-2 border-[var(--primary-dark)]">
                  {isSubmitting ? 'Memproses...' : 'Lanjut ke Konfirmasi'}
                </button>
              </>
            )}
          </>
        )}

        {activeTab === 'status' && (
          <div className="space-y-4 mt-2">
            {myOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center shadow-sm border-2 border-slate-300">
                <div className="text-6xl mb-4 opacity-50">📋</div>
                <p className="text-slate-800 font-black text-base">Belum ada pesanan</p>
              </div>
            ) : myOrders.map(o => {
              const statusIdx = ['pending', 'cooking', 'ready', 'completed'].indexOf(o.status);
              const statusLabels = ['Diterima', 'Dimasak', 'Siap', 'Selesai'];
              const statusEmojis = ['✅', '👨‍🍳', '🍽️', '🎉'];
              const statusColors = ['bg-amber-500', 'bg-blue-500', 'bg-emerald-500', 'bg-slate-800'];

              return (
                <div key={o.id} className="bg-white rounded-3xl p-5 border-2 border-slate-300 shadow-sm">
                  <div className="flex justify-between items-center mb-4 pb-4 border-b-2 border-slate-100">
                    <div>
                      <p className="text-[10px] text-slate-500 font-black tracking-wider">ORDER #{o.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-xs text-slate-600 font-bold mt-1">{new Date(o.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase text-white shadow-sm border-2 border-black/10 ${statusColors[statusIdx]}`}>{o.status}</span>
                  </div>

                  <div className="space-y-2 mb-4">
                    {o.items.map((i, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between text-xs font-bold text-slate-800">
                          <span>{i.qty}x {i.name}</span>
                          <span>Rp {(i.price * i.qty).toLocaleString('id-ID')}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t-2 border-slate-100">
                    <span className="text-xs text-slate-600 font-bold">Total</span>
                    <span className="text-base font-black text-[var(--primary-color)]">Rp {Number(o.total_price).toLocaleString('id-ID')}</span>
                  </div>

                  <div className="mt-6 space-y-4">
                    {statusLabels.map((label, i) => {
                      const isDone = i <= statusIdx;
                      const isActive = i === statusIdx;
                      return (
                        <div key={i} className="flex items-start gap-3">
                          <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all ${isDone ? statusColors[statusIdx] + ' text-white border-transparent shadow-sm' : 'bg-slate-50 text-slate-400 border-slate-300'}`}>
                              {isDone ? statusEmojis[i] : (i + 1)}
                            </div>
                            {i < statusLabels.length - 1 && (
                              <div className={`w-1 h-6 mt-1 rounded-full ${isDone && i < statusIdx ? statusColors[statusIdx] : 'bg-slate-200'}`}></div>
                            )}
                          </div>
                          <div className="flex-1 pt-1.5">
                            <p className={`text-sm font-black ${isDone ? 'text-slate-900' : 'text-slate-400'}`}>{label}</p>
                            {isActive && <p className="text-[11px] text-[var(--primary-color)] font-bold mt-1 animate-pulse">Sedang berlangsung...</p>}
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

      {/* FOOTER & BRANDING DEVELOPER */}
      <div className="text-center mt-10 pb-32 space-y-4">
        {cafe.wa_number && (
          <a href={`https://wa.me/${cafe.wa_number.replace(/^0/, '62')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-black text-emerald-700 bg-emerald-50 px-5 py-2.5 rounded-full border-2 border-emerald-200 shadow-sm transition-all hover:bg-emerald-100">
            💬 Hubungi Kasir via WA
          </a>
        )}
        <div className="pt-2 flex flex-col items-center justify-center gap-1.5">
          <p className="text-[11px] font-bold text-slate-500">
            Powered by <a href="https://wa.me/6281389744957" target="_blank" rel="noopener noreferrer" className="text-slate-900 font-black hover:text-[var(--primary-color)] transition-colors">NexaFlow</a>
          </p>
          <a href="https://wa.me/6281389744957" target="_blank" rel="noopener noreferrer" className="text-[9px] font-bold text-slate-500 hover:text-slate-700 transition-colors bg-slate-200 px-2.5 py-1 rounded-md border border-slate-300">
            Ingin aplikasi seperti ini? WA Developer: 0813-8974-4957
          </a>
        </div>
      </div>

      {/* FLOATING BOTTOM NAV with Safe Area */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <div className="max-w-md mx-auto bg-white/95 backdrop-blur-xl border-2 border-slate-300 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-1.5 flex gap-1">
          <button onClick={() => setActiveTab('menu')} className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-2xl transition-all border-2 ${activeTab === 'menu' ? 'bg-[var(--primary-light)] text-[var(--primary-color)] border-[var(--primary-color)]/20' : 'text-slate-500 hover:bg-slate-50 border-transparent'}`}>
            <span className="text-lg mb-0.5">🍽️</span>
            <span className={`text-[10px] font-black`}>Menu</span>
          </button>
          <button onClick={() => setActiveTab('cart')} className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-2xl transition-all relative border-2 ${activeTab === 'cart' ? 'bg-[var(--primary-light)] text-[var(--primary-color)] border-[var(--primary-color)]/20' : 'text-slate-500 hover:bg-slate-50 border-transparent'}`}>
            <span className="text-lg mb-0.5">🛒</span>
            <span className={`text-[10px] font-black`}>Keranjang</span>
            {totalCartQty > 0 && (
              <span className="absolute top-1 right-[20%] bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm border-2 border-white">
                {totalCartQty}
              </span>
            )}
          </button>
          <button onClick={() => setActiveTab('status')} className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-2xl transition-all border-2 ${activeTab === 'status' ? 'bg-[var(--primary-light)] text-[var(--primary-color)] border-[var(--primary-color)]/20' : 'text-slate-500 hover:bg-slate-50 border-transparent'}`}>
            <span className="text-lg mb-0.5">📋</span>
            <span className={`text-[10px] font-black`}>Status</span>
          </button>
        </div>
      </div>

      {/* STICKY CART BAR (Only in Menu Tab) */}
      {activeTab === 'menu' && totalCartQty > 0 && (
        <div className="fixed bottom-28 left-0 right-0 z-40 px-5 animate-in slide-in-from-bottom-5">
          <div className="max-w-md mx-auto bg-white/95 backdrop-blur-lg rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.15)] p-2.5 flex justify-between items-center border-2 border-slate-300">
            <div className="flex items-center gap-3 pl-2">
              <div className="w-10 h-10 bg-[var(--primary-light)] text-[var(--primary-color)] rounded-xl flex items-center justify-center font-black text-lg border-2 border-[var(--primary-color)]/20">
                {totalCartQty}
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-600">Total Tagihan</p>
                <p className="text-sm font-black text-slate-900">Rp {totalPrice.toLocaleString('id-ID')}</p>
              </div>
            </div>
            <button onClick={() => setActiveTab('cart')} className="bg-[var(--primary-color)] text-white font-black px-5 py-3 rounded-xl text-xs shadow-md active:scale-95 transition-transform border-2 border-[var(--primary-dark)]">
              Lihat Keranjang
            </button>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-end sm:items-center justify-center z-[100] p-0 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-t-[2rem] sm:rounded-[2rem] p-6 sm:p-8 shadow-2xl animate-in slide-in-from-bottom-10 sm:zoom-in-95 border-t-4 sm:border-4 border-slate-800">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-6 sm:hidden"></div>
            
            <h3 className="text-xl font-black text-slate-900 text-center mb-1">Konfirmasi Pesanan</h3>
            <p className="text-xs text-slate-600 font-bold text-center mb-6">Pastikan nama dan pesanan sudah benar</p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-black text-slate-800 mb-2 uppercase tracking-wide">Nama Pemesan <span className="text-red-500">*</span></label>
                <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Contoh: Budi" className="w-full bg-slate-50 border-2 border-slate-400 rounded-xl px-4 py-3.5 text-[16px] font-bold text-slate-900 focus:outline-none focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[var(--primary-light)] transition-all placeholder:text-slate-400" autoFocus />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-800 mb-2 uppercase tracking-wide">Catatan Tambahan (Opsional)</label>
                <input type="text" value={globalNote} onChange={e => setGlobalNote(e.target.value)} placeholder="Contoh: Tolong cepat ya" className="w-full bg-slate-50 border-2 border-slate-400 rounded-xl px-4 py-3.5 text-[16px] font-bold text-slate-900 focus:outline-none focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[var(--primary-light)] transition-all placeholder:text-slate-400" />
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border-2 border-slate-300 mb-6">
              <div className="flex justify-between text-xs font-bold text-slate-600 mb-2">
                <span>Subtotal</span>
                <span>Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              {taxRate > 0 && (
                <div className="flex justify-between text-xs font-bold text-slate-600 mb-2">
                  <span>PPN ({taxRate}%)</span>
                  <span>Rp {taxAmount.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t-2 border-slate-300">
                <span>Total Bayar</span>
                <span className="text-[var(--primary-color)]">Rp {totalPrice.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-3.5 rounded-xl font-black text-sm text-slate-700 bg-slate-200 hover:bg-slate-300 transition-colors border-2 border-slate-300">Batal</button>
              <button onClick={handleCheckout} disabled={isSubmitting || !customerName.trim()} className="flex-[2] bg-[var(--primary-color)] text-white font-black py-3.5 rounded-xl text-sm shadow-lg active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100 border-2 border-[var(--primary-dark)]">
                {isSubmitting ? 'Memproses...' : 'Ya, Kirim Pesanan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[110] bg-slate-800 text-white px-5 py-3 rounded-full text-xs font-black shadow-2xl animate-in fade-in slide-in-from-top-4 border-2 border-slate-600">
          {toast}
        </div>
      )}
    </div>
  );
}

export default function OrderPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-12 h-12 border-4 border-slate-300 border-t-[var(--primary-color)] rounded-full animate-spin"></div></div>}><OrderContent /></Suspense>;
}