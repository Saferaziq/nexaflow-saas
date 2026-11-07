'use client';
import { useEffect, useState, Suspense, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useSearchParams } from 'next/navigation';
import { generateDynamicQRIS } from '../dashboard/helpers/qris';

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

const getMenuStock = (menu) => {
  if (!menu) return { tracked: false, value: null, isOut: true, isLow: false };
  const tracked = menu.stock !== null && menu.stock !== undefined;
  const value = tracked ? Number(menu.stock) : null;
  const isOut = menu.status !== 'available' || (tracked && value <= 0);
  const isLow = tracked && value > 0 && value <= 5;
  return { tracked, value, isOut, isLow };
};

function OrderContent() {
  const searchParams = useSearchParams();
  const tenantId = searchParams.get('tenant');
  const tableNumber = searchParams.get('table');

  const [cafe, setCafe] = useState({ name: 'Kafe', logo_url: '', banner_url: '', wa_number: '', tax_percentage: 0, notify_order_ready: true, is_open: true, is_active: true, is_pay_first: false, qris_string: '' });
  const [menus, setMenus] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('menu');
  const [category, setCategory] = useState('all');
  const [myOrders, setMyOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);

  // 🔥 STATE UNTUK POPUP MENU
  const [selectedMenu, setSelectedMenu] = useState(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showQrisModal, setShowQrisModal] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [globalNote, setGlobalNote] = useState('');

  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const audioCtxRef = useRef(null);
  const intervalRef = useRef(null);
  const pollRef = useRef(null);
  const myOrderIdsRef = useRef([]);
  const myOrdersRef = useRef([]);
  myOrdersRef.current = myOrders;
  const prevReadyRef = useRef(false);

  const fetchAllMenus = async () => {
    const { data } = await supabase.from('menus').select('*').eq('tenant_id', tenantId);
    if (data) {
      const sorted = [...data].sort((a, b) => {
        const sa = getMenuStock(a);
        const sb = getMenuStock(b);
        if (sa.isOut !== sb.isOut) return sa.isOut ? 1 : -1;
        if (sa.isLow !== sb.isLow) return sa.isLow ? 1 : -1;
        return 0;
      });
      setMenus(sorted);
    }
  };

  const fetchMyOrders = async (ids) => {
    if (!ids || ids.length === 0) {
      setMyOrders([]);
      return;
    }
    const { data } = await supabase.rpc('get_customer_orders', { p_order_ids: ids });
    if (data) setMyOrders(data);
  };

  const fetchCafeStatus = async () => {
    const { data } = await supabase.from('tenants').select('is_open, is_pay_first, is_active').eq('id', tenantId).single();
    if (data) {
      setCafe(prev => ({ 
        ...prev, 
        is_open: data.is_open !== false, 
        is_pay_first: data.is_pay_first !== false,
        is_active: data.is_active !== false
      }));
    }
  };

  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', '#3A2A20');
    document.documentElement.style.setProperty('--primary-light', '#F4EFE9');

    if (!tenantId) return;

    const existingIds = JSON.parse(localStorage.getItem('my_order_ids_' + tableNumber) || '[]');
    myOrderIdsRef.current = existingIds;

    const fetchData = async () => {
      const [cafeRes, menuRes] = await Promise.all([
        supabase.from('tenants').select('*').eq('id', tenantId).single(),
        supabase.from('menus').select('*').eq('tenant_id', tenantId)
      ]);
      
      if (cafeRes.data) {
        setCafe(cafeRes.data);
        if (cafeRes.data.banner_url) extractDominantColor(cafeRes.data.banner_url);
        else if (cafeRes.data.logo_url) extractDominantColor(cafeRes.data.logo_url);
      }
      
      if (menuRes.data) {
        const sorted = [...menuRes.data].sort((a, b) => {
          const sa = getMenuStock(a);
          const sb = getMenuStock(b);
          if (sa.isOut !== sb.isOut) return sa.isOut ? 1 : -1;
          if (sa.isLow !== sb.isLow) return sa.isLow ? 1 : -1;
          return 0;
        });
        setMenus(sorted);
      }
      
      const savedName = localStorage.getItem('nexaflow_customer_name');
      if (savedName) setCustomerName(savedName);

      setLoading(false);

      if (existingIds.length > 0) fetchMyOrders(existingIds);
    };
    fetchData();

    const channel = supabase.channel('customer-realtime-' + Date.now())
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'tenants', filter: `id=eq.${tenantId}` }, (payload) => {
        setCafe(prev => ({ ...prev, ...payload.new }));
        if (payload.new.banner_url) extractDominantColor(payload.new.banner_url);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: `tenant_id=eq.${tenantId}` }, () => {
        if (myOrderIdsRef.current.length > 0) fetchMyOrders(myOrderIdsRef.current);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'menus', filter: `tenant_id=eq.${tenantId}` }, async () => {
        await fetchAllMenus();
      })
      .subscribe();

    pollRef.current = setInterval(() => {
      if (myOrderIdsRef.current.length > 0) {
        fetchMyOrders(myOrderIdsRef.current);
      }
      fetchCafeStatus(); 
    }, 3000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      supabase.removeChannel(channel);
    };
  }, [tenantId, tableNumber]);

  useEffect(() => {
    if (cart.length === 0 || menus.length === 0) return;
    setCart(prev => {
      let changed = false;
      const next = prev.map(item => {
        const menu = menus.find(m => m.id === item.id);
        if (!menu) { changed = true; return { ...item, qty: 0 }; }
        const stock = getMenuStock(menu);
        if (stock.isOut) { changed = true; return { ...item, qty: 0 }; }
        if (stock.tracked && item.qty > stock.value) {
          changed = true;
          return { ...item, qty: Math.max(0, stock.value) };
        }
        return item;
      }).filter(i => i.qty > 0);
      if (changed) showToast('Beberapa item disesuaikan dengan stok terkini');
      return changed ? next : prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menus]);

  const playReadySound = () => {
    if (!audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const playOne = (t) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = 880;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0, ctx.currentTime + t);
        gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.18);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(ctx.currentTime + t); osc.stop(ctx.currentTime + t + 0.18);
      };
      playOne(0); playOne(0.22); playOne(0.44);
    } catch (e) { console.log('Audio error:', e); }
  };

  const unlockAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    setAudioUnlocked(true);
  };

  useEffect(() => {
    const handleInteraction = () => unlockAudio();
    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);
    document.addEventListener('keydown', handleInteraction);
    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  useEffect(() => {
    const hasReady = myOrders.some(o => o.status === 'ready');
    if (hasReady && !prevReadyRef.current && audioUnlocked && cafe.notify_order_ready !== false) {
      playReadySound();
    }
    prevReadyRef.current = hasReady;
  }, [myOrders, audioUnlocked, cafe.notify_order_ready]);

  useEffect(() => {
    if (!audioUnlocked) return;
    if (cafe.notify_order_ready === false) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      const hasReady = myOrdersRef.current.some(o => o.status === 'ready');
      if (hasReady) {
        playReadySound();
      }
    }, 20000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [audioUnlocked, cafe.notify_order_ready]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const addToCart = (menu) => {
    unlockAudio();
    if (cafe.is_open === false) {
      showToast('Kafe sedang tutup, tidak bisa memesan');
      return;
    }
    const stock = getMenuStock(menu);
    const existing = cart.find(i => i.id === menu.id);
    const currentQty = existing ? existing.qty : 0;

    if (stock.isOut) {
      showToast(`${menu.name} sedang habis`);
      return;
    }
    if (stock.tracked && currentQty >= stock.value) {
      showToast(`Stok ${menu.name} tersisa ${stock.value}`);
      return;
    }
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
    if (cafe.is_open === false) {
      showToast('Kafe sedang tutup, tidak bisa memesan');
      return;
    }
    const invalid = cart.find(item => {
      const menu = menus.find(m => m.id === item.id);
      return !menu || getMenuStock(menu).isOut;
    });
    if (invalid) {
      showToast(`${invalid.name} sudah habis, hapus dulu dari keranjang`);
      return;
    }
    unlockAudio();
    setShowConfirmModal(true);
  };

  const handleNextToPayment = () => {
    if (!customerName.trim()) {
      showToast('Mohon isi nama Anda');
      return;
    }
    if (cafe.is_pay_first) {
      setShowConfirmModal(false);
      setShowPaymentModal(true);
    } else {
      handleCheckout('CASH');
    }
  };

  const handleCheckout = async (method) => {
    if (cafe.is_open === false) {
      showToast('Kafe sedang tutup, tidak bisa memesan');
      return;
    }
    if (!customerName.trim()) {
      showToast('Mohon isi nama Anda');
      return;
    }
    setIsSubmitting(true);

    const menuIds = cart.map(i => i.id);
    const [tenantRes, menuRes] = await Promise.all([
      supabase.from('tenants').select('is_open, is_active').eq('id', tenantId).single(),
      supabase.from('menus').select('id, name, stock, status').in('id', menuIds)
    ]);

    if (tenantRes.data && tenantRes.data.is_active === false) {
      showToast('Maaf, kafe sedang tidak aktif.');
      setCafe(prev => ({ ...prev, is_active: false }));
      setIsSubmitting(false);
      return;
    }

    if (tenantRes.data && tenantRes.data.is_open === false) {
      showToast('Maaf, kafe baru saja tutup.');
      setCafe(prev => ({ ...prev, is_open: false }));
      setIsSubmitting(false);
      return;
    }

    if (menuRes.error) {
      showToast('Gagal cek stok: ' + menuRes.error.message);
      setIsSubmitting(false);
      return;
    }

    const freshMenus = menuRes.data || [];
    const freshMap = new Map(freshMenus.map(m => [m.id, m]));
    const shortage = cart.find(item => {
      const fm = freshMap.get(item.id);
      if (!fm) return true;
      if (fm.status !== 'available') return true;
      const tracked = fm.stock !== null && fm.stock !== undefined;
      if (tracked && Number(fm.stock) < item.qty) return true;
      return false;
    });
    if (shortage) {
      const fm = freshMap.get(shortage.id);
      const tracked = fm && fm.stock !== null && fm.stock !== undefined;
      const avail = tracked ? Number(fm.stock) : 0;
      showToast(fm && fm.status !== 'available' 
        ? `${shortage.name} sedang habis` 
        : `Stok ${shortage.name} tidak cukup (tersisa ${avail})`);
      fetchAllMenus();
      setIsSubmitting(false);
      return;
    }

    localStorage.setItem('nexaflow_customer_name', customerName.trim());

    let finalStatus = 'pending';
    let finalPaymentStatus = 'unpaid';
    
    if (cafe.is_pay_first) {
      finalPaymentStatus = method === 'QRIS' ? 'WAITING_QRIS' : 'WAITING_CASH';
    } else {
      finalPaymentStatus = 'unpaid';
    }

    const slimItems = cart.map(i => ({
      id: i.id,
      name: i.name,
      price: i.price,
      qty: i.qty,
      note: i.note || ''
    }));

    const orderData = { 
      tenant_id: tenantId, 
      table_number: tableNumber, 
      customer_name: customerName.trim(),
      order_note: globalNote.trim(),
      items: slimItems,
      subtotal: subtotal,
      tax_amount: taxAmount,
      total_price: totalPrice, 
      status: finalStatus, 
      payment_status: finalPaymentStatus, 
      payment_method: method
    };

    const { data, error } = await supabase.from('orders').insert([orderData]).select().single();
    
    if (error) { 
      showToast('Gagal: ' + error.message); 
      setIsSubmitting(false); 
      return; 
    }

    supabase.rpc('decrement_menu_stock', {
      p_tenant_id: tenantId,
      p_items: cart.map(i => ({ id: i.id, qty: i.qty })),
    }).then(({ error: decErr }) => {
      if (decErr) console.error('Stock decrement error:', decErr);
    });

    const existingIds = JSON.parse(localStorage.getItem('my_order_ids_' + tableNumber) || '[]');
    const newIds = [...existingIds, data.id];
    localStorage.setItem('my_order_ids_' + tableNumber, JSON.stringify(newIds));
    myOrderIdsRef.current = newIds;

    setMyOrders(prev => [data, ...prev]);
    
    setCart([]); 
    setGlobalNote('');
    setIsSubmitting(false); 
    setShowConfirmModal(false);
    setShowPaymentModal(false);
    setShowQrisModal(false);
    setActiveTab('status');
    
    if (cafe.is_pay_first) {
      showToast('Pesanan dibuat. Menunggu Konfirmasi Kasir ⏳');
    } else {
      showToast('Pesanan terkirim! 🎉');
    }
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
  const hasReadyOrder = myOrders.some(o => o.status === 'ready');
  const hasWaitingOrder = myOrders.some(o => ['WAITING_QRIS', 'WAITING_CASH'].includes(o.payment_status));

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-32">
      
      {cafe.is_active === false && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-6">
          <div className="text-center max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border-4 border-rose-500 animate-in zoom-in-95 duration-300">
            <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-rose-300">
              <span className="text-5xl">🔒</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-3">Kafe Tidak Aktif</h2>
            <p className="text-sm font-bold text-slate-600 mb-6 leading-relaxed">
              Mohon maaf, <strong>{cafe.name}</strong> sedang <strong>tidak melayani pesanan</strong> saat ini. Silakan hubungi kasir untuk informasi lebih lanjut.
            </p>
            {cafe.wa_number && (
              <a href={`https://wa.me/${cafe.wa_number.replace(/^0/, '62')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-full gap-2 text-sm font-black text-white bg-emerald-500 px-6 py-4 rounded-2xl border-2 border-emerald-700 shadow-lg transition-all hover:bg-emerald-600 active:scale-95">
                💬 Hubungi Kasir
              </a>
            )}
            <p className="text-[10px] font-bold text-slate-400 mt-6">
              Powered by NexaFlow
            </p>
          </div>
        </div>
      )}

      {cafe.is_open === false && cafe.is_active !== false && (
        <div className="fixed inset-0 z-[999] bg-white/95 backdrop-blur-md flex items-center justify-center p-6">
          <div className="text-center max-w-md w-full animate-in zoom-in-95 duration-300">
            <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-rose-100 shadow-lg shadow-rose-100">
              <span className="text-5xl">🔒</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-3">Kafe Sedang Tutup</h2>
            <p className="text-sm font-bold text-slate-600 mb-8 leading-relaxed">
              Mohon maaf, <strong>{cafe.name}</strong> sedang tidak menerima pesanan saat ini. Silakan kembali lagi nanti.
            </p>
            {cafe.wa_number && (
              <a href={`https://wa.me/${cafe.wa_number.replace(/^0/, '62')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-black text-emerald-700 bg-emerald-50 px-6 py-3 rounded-xl border-2 border-emerald-200 shadow-sm transition-all hover:bg-emerald-100">
                💬 Hubungi Kafe via WA
              </a>
            )}
          </div>
        </div>
      )}

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
              <span className={`w-2 h-2 rounded-full ${cafe.is_open === false ? 'bg-rose-400' : 'bg-emerald-400'} animate-pulse`}></span> 
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

      {hasReadyOrder && cafe.notify_order_ready !== false && (
        <div className="px-5 mt-4 relative z-30 animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-4 flex items-center gap-3 shadow-lg shadow-emerald-500/20">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-xl text-white shadow-inner animate-bounce">
              🍽️
            </div>
            <div>
              <p className="text-emerald-900 font-black text-sm uppercase tracking-wide">Pesanan Siap!</p>
              <p className="text-emerald-700 font-bold text-xs mt-0.5">"Yeay! Pesanan Anda sudah siap. Silakan menuju kasir untuk mengambilnya."</p>
            </div>
          </div>
        </div>
      )}

      <div className="px-5 mt-4 relative z-20">
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border-2 border-slate-300 flex items-center px-4 py-3">
          <span className="text-slate-500 text-lg">🔍</span>
          <input type="text" placeholder="Cari menu..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 ml-3 text-[16px] font-bold outline-none text-slate-800 placeholder:text-slate-500 bg-transparent" />
          {searchQuery && <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600 text-xl font-black px-2">×</button>}
        </div>
      </div>

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
                const stock = getMenuStock(menu);
                const isOut = stock.isOut;
                const isLow = stock.isLow;
                return (
                  <div key={menu.id} className={`bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col border-2 border-slate-300 relative ${isOut ? 'opacity-70' : ''}`}>
                    
                    {/* Gambar - aspect ratio asli 4/3 */}
                    <div onClick={() => setSelectedMenu(menu)} className="aspect-[4/3] bg-slate-100 relative w-full border-b-2 border-slate-200 cursor-pointer">
                      {menu.image_url ? <img src={menu.image_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-4xl">🍽️</div>}
                      {cartItem && !isOut && <div className="absolute top-2 right-2 bg-[var(--primary-color)] text-white text-[11px] font-black w-6 h-6 rounded-full flex items-center justify-center shadow-md border-2 border-white z-10">{cartItem.qty}</div>}
                      {isLow && !isOut && (
                        <div className="absolute top-2 left-2 bg-amber-400 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-500 shadow-sm z-10">
                          Sisa {stock.value}
                        </div>
                      )}
                      {isOut && (
                        <div className="absolute inset-0 bg-black/55 flex items-center justify-center z-10">
                          <span className="text-white font-black text-xs uppercase tracking-widest bg-rose-500 px-3 py-1.5 rounded-lg border-2 border-white/40 shadow-lg">Habis</span>
                        </div>
                      )}
                    </div>

                    {/* Teks - Hanya Nama (1 baris), Harga, Tombol (Agar tinggi seragam) */}
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div onClick={() => setSelectedMenu(menu)} className="cursor-pointer">
                        <h3 className="font-black text-slate-900 text-[13px] leading-tight line-clamp-1">{menu.name}</h3>
                      </div>
                      <div className="mt-2 flex flex-col gap-2">
                        <span className="font-black text-[var(--primary-color)] text-sm">Rp {Number(menu.price).toLocaleString('id-ID')}</span>
                        {isOut ? (
                          <button disabled className="w-full bg-slate-200 text-slate-500 font-black py-1.5 rounded-lg text-xs border-2 border-slate-300 cursor-not-allowed">Habis</button>
                        ) : cartItem ? (
                          <div className="flex items-center justify-between bg-slate-50 rounded-lg p-1 border-2 border-slate-300">
                            <button onClick={() => decCart(menu.id)} className="w-6 h-6 bg-white border border-slate-300 rounded shadow-sm font-black text-slate-700 flex items-center justify-center">-</button>
                            <span className="font-black text-slate-900 text-xs">{cartItem.qty}</span>
                            <button onClick={() => addToCart(menu)} disabled={stock.tracked && cartItem.qty >= stock.value} className="w-6 h-6 bg-[var(--primary-color)] text-white rounded shadow-sm font-black flex items-center justify-center border border-[var(--primary-color)] disabled:opacity-40 disabled:cursor-not-allowed">+</button>
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
                    {cart.map(item => {
                      const liveMenu = menus.find(m => m.id === item.id);
                      const liveStock = getMenuStock(liveMenu);
                      const maxQty = liveStock.tracked ? liveStock.value : Infinity;
                      return (
                      <div key={item.id} className="border-b-2 border-slate-100 pb-5 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start gap-3">
                          <div className="w-14 h-14 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 border border-slate-300">
                            {item.image_url ? <img src={item.image_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xl">🍽️</div>}
                          </div>
                          <div className="flex-1 min-w-0 pt-0.5">
                            <p className="font-black text-slate-900 text-sm truncate">{item.name}</p>
                            <p className="text-xs text-[var(--primary-color)] font-black mt-1">Rp {Number(item.price).toLocaleString('id-ID')}</p>
                            {liveStock.isOut && (
                              <p className="text-[10px] text-rose-600 font-black mt-1">⚠️ Sudah habis — hapus dari keranjang</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => decCart(item.id)} className="w-7 h-7 bg-slate-100 border border-slate-300 rounded-full font-black text-slate-700">-</button>
                            <span className="w-5 text-center font-black text-slate-900 text-xs">{item.qty}</span>
                            <button onClick={() => addToCart(item)} disabled={item.qty >= maxQty} className="w-7 h-7 bg-[var(--primary-light)] border border-[var(--primary-color)]/30 text-[var(--primary-color)] rounded-full font-black disabled:opacity-40 disabled:cursor-not-allowed">+</button>
                          </div>
                        </div>
                        <input type="text" placeholder="Catatan (mis. tanpa gula)" value={item.note || ''} onChange={(e) => updateItemNote(item.id, e.target.value)} className="w-full mt-3 text-[16px] bg-slate-50 border-2 border-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[var(--primary-color)] font-bold text-slate-900 placeholder:text-slate-400" />
                      </div>
                      );
                    })}
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
            
            {hasWaitingOrder && (
              <div className="bg-amber-50 border-2 border-amber-400 p-4 rounded-2xl flex items-start gap-3 shadow-md shadow-amber-500/10 animate-pulse mb-2">
                <span className="text-2xl mt-0.5">⏳</span>
                <div>
                  <p className="font-black text-amber-900 text-sm">Menunggu Konfirmasi Kasir</p>
                  <p className="text-xs font-bold text-amber-700 mt-1">Kasir sedang memverifikasi pembayaran Anda. Pesanan akan segera diproses setelah dikonfirmasi.</p>
                </div>
              </div>
            )}

            {myOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center shadow-sm border-2 border-slate-300">
                <div className="text-6xl mb-4 opacity-50">📋</div>
                <p className="text-slate-800 font-black text-base">Belum ada pesanan</p>
              </div>
            ) : myOrders.map(o => {
              const isCancelled = o.payment_status === 'CANCELLED';
              const isWaitingCash = o.payment_status === 'WAITING_CASH';
              const isWaitingQris = o.payment_status === 'WAITING_QRIS';
              
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
                    <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase text-white shadow-sm border-2 border-black/10 ${
                      isCancelled ? 'bg-rose-600' : isWaitingCash || isWaitingQris ? 'bg-amber-500' : statusColors[statusIdx]
                    }`}>
                      {isCancelled ? 'Ditolak' : isWaitingCash || isWaitingQris ? 'Menunggu Bayar' : o.status}
                    </span>
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

                  <div className="flex justify-between items-center pt-3 border-t-2 border-slate-100 mb-4">
                    <span className="text-xs text-slate-600 font-bold">Total</span>
                    <span className="text-base font-black text-[var(--primary-color)]">Rp {Number(o.total_price).toLocaleString('id-ID')}</span>
                  </div>

                  {isCancelled && (
                    <div className="bg-rose-50 border-2 border-rose-300 p-4 rounded-xl text-center">
                      <p className="text-rose-800 font-black text-sm">❌ Pesanan Ditolak</p>
                      <p className="text-rose-600 text-xs font-bold mt-1">Pembayaran tidak ditemukan. Silakan lakukan pemesanan ulang.</p>
                    </div>
                  )}

                  {isWaitingCash && (
                    <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-xl text-center">
                      <p className="text-amber-800 font-black text-sm">💵 Menunggu Pembayaran Tunai</p>
                      <p className="text-amber-700 text-xs font-bold mt-1">Silakan menuju ke Kasir untuk melakukan pembayaran Anda.</p>
                    </div>
                  )}

                  {isWaitingQris && (
                    <div className="bg-blue-50 border-2 border-blue-300 p-4 rounded-xl text-center">
                      <p className="text-blue-800 font-black text-sm">⏳ Menunggu Verifikasi Kasir</p>
                      <p className="text-blue-700 text-xs font-bold mt-1">Pesanan akan diproses setelah kasir memverifikasi pembayaran Anda.</p>
                    </div>
                  )}

                  {!isCancelled && !isWaitingCash && !isWaitingQris && (
                    <div className="mt-2 space-y-4">
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
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

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
        </div>
      </div>

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

      {/* 🔥 MODAL POPUP DETAIL MENU (BARU) */}
      {selectedMenu && (() => {
        const selectedStock = getMenuStock(selectedMenu);
        const selectedCartItem = cart.find(c => c.id === selectedMenu.id);
        return (
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-end sm:items-center justify-center z-[100] p-0 sm:p-4" onClick={() => setSelectedMenu(null)}>
            <div 
              className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-0 shadow-2xl animate-in slide-in-from-bottom-10 sm:zoom-in-95 overflow-hidden border-t-4 sm:border-4 border-slate-800 flex flex-col max-h-[90vh]" 
              onClick={e => e.stopPropagation()}
            >
              <div className="relative w-full h-64 sm:h-72 bg-slate-100 flex-shrink-0">
                {selectedMenu.image_url ? (
                  <img src={selectedMenu.image_url} alt={selectedMenu.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">🍽️</div>
                )}
                <button 
                  onClick={() => setSelectedMenu(null)} 
                  className="absolute top-3 right-3 w-8 h-8 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center backdrop-blur-md border-2 border-white/30 transition-all active:scale-90"
                >
                  <span className="text-xl font-black leading-none mb-1">&times;</span>
                </button>
                {selectedStock.isLow && (
                  <div className="absolute bottom-3 left-3 bg-amber-400 text-amber-900 text-xs font-black px-3 py-1.5 rounded-lg border-2 border-amber-500 shadow-sm">
                    Sisa {selectedStock.value} Porsi
                  </div>
                )}
              </div>

              <div className="p-5 flex-1 overflow-y-auto flex flex-col">
                <h2 className="text-2xl font-black text-slate-900 leading-tight mb-2">{selectedMenu.name}</h2>
                <p className="text-xl font-black text-[var(--primary-color)] mb-4">Rp {Number(selectedMenu.price).toLocaleString('id-ID')}</p>
                <div className="h-0.5 w-full bg-slate-200 mb-4 rounded-full"></div>
                <div className="mb-6">
                  <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1">Deskripsi</p>
                  <p className="text-sm font-semibold text-slate-700 leading-relaxed whitespace-pre-line">
                    {selectedMenu.description || 'Belum ada deskripsi untuk menu ini.'}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t-2 border-slate-200">
                {selectedStock.isOut ? (
                  <button disabled className="w-full bg-slate-200 text-slate-500 font-black py-3.5 rounded-xl text-sm border-2 border-slate-300 cursor-not-allowed">Habis</button>
                ) : selectedCartItem ? (
                  <div className="flex items-center justify-between bg-white rounded-xl p-1.5 border-2 border-slate-300">
                    <button onClick={() => decCart(selectedMenu.id)} className="w-10 h-10 bg-slate-100 border border-slate-300 rounded-lg shadow-sm font-black text-slate-700 flex items-center justify-center text-lg">-</button>
                    <span className="font-black text-slate-900 text-lg">{selectedCartItem.qty}</span>
                    <button onClick={() => addToCart(selectedMenu)} disabled={selectedStock.tracked && selectedCartItem.qty >= selectedStock.value} className="w-10 h-10 bg-[var(--primary-color)] text-white rounded-lg shadow-sm font-black flex items-center justify-center border border-[var(--primary-color)] disabled:opacity-40 disabled:cursor-not-allowed text-lg">+</button>
                  </div>
                ) : (
                  <button onClick={() => addToCart(selectedMenu)} className="w-full bg-[var(--primary-color)] hover:opacity-90 text-white font-black py-3.5 rounded-xl text-sm shadow-md active:scale-95 transition-all border-2 border-[var(--primary-dark)]">
                    + Tambah ke Keranjang
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })()}

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

            <div className="flex gap-3">
              <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-3.5 rounded-xl font-black text-sm text-slate-700 bg-slate-200 hover:bg-slate-300 transition-colors border-2 border-slate-300">Batal</button>
              <button onClick={handleNextToPayment} disabled={isSubmitting || !customerName.trim()} className="flex-[2] bg-[var(--primary-color)] text-white font-black py-3.5 rounded-xl text-sm shadow-lg active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100 border-2 border-[var(--primary-dark)]">
                {cafe.is_pay_first ? 'Pilih Metode Pembayaran' : (isSubmitting ? 'Memproses...' : 'Ya, Kirim Pesanan')}
              </button>
            </div>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-end sm:items-center justify-center z-[100] p-0 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-t-[2rem] sm:rounded-[2rem] p-6 sm:p-8 shadow-2xl animate-in slide-in-from-bottom-10 sm:zoom-in-95 border-t-4 sm:border-4 border-slate-800">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-6 sm:hidden"></div>
            
            <h3 className="text-xl font-black text-slate-900 text-center mb-1">Pilih Pembayaran</h3>
            <p className="text-xs text-slate-600 font-bold text-center mb-6">Silakan pilih cara pembayaran Anda</p>

            <div className="space-y-3 mb-6">
              <button onClick={() => handleCheckout('CASH')} className="w-full bg-emerald-50 border-2 border-emerald-500 text-emerald-900 p-4 rounded-2xl flex items-center justify-between hover:bg-emerald-100 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💵</span>
                  <div className="text-left">
                    <p className="font-black text-sm">Bayar Tunai (Cash)</p>
                    <p className="text-[10px] font-bold text-emerald-700 mt-0.5">Bayar langsung ke kasir</p>
                  </div>
                </div>
                <span className="text-emerald-500 font-black">➔</span>
              </button>

              <button onClick={() => { setShowPaymentModal(false); setShowQrisModal(true); }} className="w-full bg-blue-50 border-2 border-blue-500 text-blue-900 p-4 rounded-2xl flex items-center justify-between hover:bg-blue-100 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📱</span>
                  <div className="text-left">
                    <p className="font-black text-sm">QRIS (Scan Barcode)</p>
                    <p className="text-[10px] font-bold text-blue-700 mt-0.5">Bayar via M-Banking / E-Wallet</p>
                  </div>
                </div>
                <span className="text-blue-500 font-black">➔</span>
              </button>
            </div>

            <button onClick={() => { setShowPaymentModal(false); setShowConfirmModal(true); }} className="w-full py-3.5 rounded-xl font-black text-sm text-slate-700 bg-slate-200 hover:bg-slate-300 transition-colors border-2 border-slate-300">Kembali</button>
          </div>
        </div>
      )}

      {showQrisModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-end sm:items-center justify-center z-[100] p-0 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-t-[2rem] sm:rounded-[2rem] p-6 sm:p-8 shadow-2xl animate-in slide-in-from-bottom-10 sm:zoom-in-95 border-t-4 sm:border-4 border-slate-800">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-6 sm:hidden"></div>
            
            <h3 className="text-xl font-black text-slate-900 text-center mb-1">Scan QRIS</h3>
            <p className="text-xs text-slate-600 font-bold text-center mb-4">Total: <span className="text-[var(--primary-color)] font-black">Rp {totalPrice.toLocaleString('id-ID')}</span></p>

            <div className="bg-white border-4 border-slate-300 rounded-2xl p-2 mb-4 flex justify-center">
              {cafe.qris_string ? (
                 <img src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(generateDynamicQRIS(cafe.qris_string, totalPrice) || cafe.qris_string)}&margin=10`} alt="QRIS" className="w-full max-w-[250px] object-contain" />
              ) : (
                 <div className="text-center p-8 text-slate-500 font-bold text-sm">Gambar QRIS belum diset oleh Kafe.</div>
              )}
            </div>

            <p className="text-[10px] text-slate-500 font-bold text-center mb-6">Silakan screenshot halaman ini atau tunjukkan ke kasir jika pembayaran berhasil.</p>

            <div className="space-y-2">
              <button onClick={() => handleCheckout('QRIS')} className="w-full bg-[var(--primary-color)] text-white font-black py-4 rounded-xl text-sm shadow-lg active:scale-95 transition-transform border-2 border-[var(--primary-dark)]">
                Saya Sudah Bayar
              </button>
              <button onClick={() => { setShowQrisModal(false); setShowPaymentModal(true); }} className="w-full py-3 rounded-xl font-black text-xs text-slate-600 hover:text-slate-900">Ganti Metode</button>
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