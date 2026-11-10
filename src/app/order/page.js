'use client';
import { useEffect, useState, Suspense, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useSearchParams } from 'next/navigation';
import { generateDynamicQRIS } from '../dashboard/helpers/qris';

// Mengimpor font secara langsung untuk memastikan tampilan Serif berjalan
const fontImport = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap');
  .font-serif { font-family: 'Playfair Display', serif; }
`;

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

const getEffectivePrice = (menu) => {
  if (menu.discount_price && Number(menu.discount_price) > 0) {
    return Number(menu.discount_price);
  }
  return Number(menu.price);
};

const Icons = {
  Star: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Coffee: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
  Utensils: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>,
  Cake: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M12 6v6l4 2"/></svg>,
  Search: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Filter: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>,
  Back: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Cart: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
  Book: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  Speaker: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>,
  X: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
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

  const [selectedMenu, setSelectedMenu] = useState(null);
  const [popupNote, setPopupNote] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

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
  const spokenReadyOrderIdRef = useRef(null);

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

  const speakReadyOrder = (order) => {
    if (!('speechSynthesis' in window)) {
      showToast('Browser Anda tidak mendukung fitur suara.');
      return;
    }
    window.speechSynthesis.resume();
    window.speechSynthesis.cancel();

    const text = `Pesanan atas nama ${order.customer_name}, meja ${order.table_number}, sudah siap silahkan ambil di kasir.`;
    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.lang = 'id-ID';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    const playVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const idVoice = voices.find(v => v.lang.includes('id-ID') || v.lang.includes('id_ID'));
      if (idVoice) utterance.voice = idVoice;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (e) => {
        console.error('TTS Error:', e);
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        playVoice();
        window.speechSynthesis.onvoiceschanged = null;
      };
    } else {
      playVoice();
    }
  };

  const readyOrder = myOrders.find(o => o.status === 'ready');
  const showReadyPopup = !!readyOrder && cafe.notify_order_ready !== false;

  useEffect(() => {
    if (showReadyPopup && readyOrder) {
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200, 100, 500]);
      }
      
      if (spokenReadyOrderIdRef.current !== readyOrder.id) {
        setTimeout(() => {
          speakReadyOrder(readyOrder);
          spokenReadyOrderIdRef.current = readyOrder.id;
        }, 800);
      }
    }
  }, [showReadyPopup, readyOrder]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const addToCart = (menu, note = '') => {
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

    const effectivePrice = getEffectivePrice(menu);

    setCart(prev => {
      const ex = prev.find(i => i.id === menu.id);
      if (ex) {
        return prev.map(i => i.id === menu.id ? { ...i, qty: i.qty + 1, note: note || i.note } : i);
      }
      return [...prev, { ...menu, price: effectivePrice, qty: 1, note: note }];
    });
    showToast(`${menu.name} ditambah`);
    setPopupNote('');
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
      showToast('Pesanan dibuat. Menunggu Konfirmasi Kasir');
    } else {
      showToast('Pesanan terkirim!');
    }
  };

  if (!tenantId || !tableNumber) return <div className="p-10 text-center font-black text-slate-800">QR Code tidak valid.</div>;
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-slate-300 rounded-full animate-spin mx-auto border-t-cyan-500"></div>
        <p className="mt-4 text-slate-600 font-bold text-sm">Memuat menu...</p>
      </div>
    </div>
  );

  const filteredMenus = menus.filter(m => {
    const matchCat = category === 'all' || m.category === category;
    const matchSearch = !searchQuery || m.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const recommendedMenus = menus.filter(m => (m.is_featured || m.is_new) && !getMenuStock(m).isOut);
  const hasWaitingOrder = myOrders.some(o => ['WAITING_QRIS', 'WAITING_CASH'].includes(o.payment_status));

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-32 selection:bg-slate-900 selection:text-white">
      <style>{fontImport}</style>

      {/* HEADER KAFE (Immersive) */}
      <div className="relative w-full h-[380px] bg-slate-900 overflow-hidden rounded-b-[2.5rem]">
        {cafe.banner_url ? (
          <img src={cafe.banner_url} className="absolute inset-0 w-full h-full object-cover opacity-80 scale-105" alt="Banner" />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-800 to-slate-900"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-black/20"></div>

        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20">
          <a href="/" className="w-10 h-10 bg-white/65 backdrop-blur-2xl rounded-full flex items-center justify-center text-slate-900 border border-white/90 shadow-[0_20px_40px_-10px_rgba(15,23,42,0.08)]">
            <Icons.Back />
          </a>
          <div className="bg-white/65 backdrop-blur-2xl px-4 py-2 rounded-full flex items-center gap-2 border border-white/90 shadow-[0_20px_40px_-10px_rgba(15,23,42,0.08)]">
            <span className={`w-2 h-2 rounded-full ${cafe.is_open === false ? 'bg-rose-500' : 'bg-cyan-500 animate-pulse'}`}></span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-800">Meja {tableNumber}</span>
          </div>
        </div>

        <div className="absolute bottom-10 left-6 right-6 z-10 text-center">
          <p className="text-[10px] font-bold text-cyan-400 tracking-[0.2em] uppercase mb-2">Welcome to</p>
          <h1 className="text-4xl font-serif text-white mb-2">{cafe.name}</h1>
          <p className="text-xs font-medium text-slate-300">{cafe.address || 'Fine Dining & Artisan Coffee'}</p>
        </div>
      </div>

      {/* SEARCH BAR (Sticky) */}
      <div className="sticky top-4 z-40 px-6 -mt-6">
        <div className="bg-white/65 backdrop-blur-2xl border border-white/90 shadow-[0_20px_40px_-10px_rgba(15,23,42,0.08)] rounded-2xl flex items-center px-5 py-4">
          <div className="text-slate-500"><Icons.Search /></div>
          <input type="text" placeholder="Cari hidangan..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 ml-3 text-sm font-semibold outline-none bg-transparent placeholder:text-slate-400 text-slate-900" />
          {searchQuery ? (
            <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
              <Icons.X />
            </button>
          ) : (
            <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white cursor-pointer">
              <Icons.Filter />
            </div>
          )}
        </div>
      </div>

      {activeTab === 'menu' && (
        <>
          {/* KATEGORI (Custom SVG Icons) */}
          <div className="flex gap-6 overflow-x-auto px-6 mt-8 scrollbar-hide border-b border-slate-200 pb-4">
            <button onClick={() => setCategory('all')} className={`flex items-center gap-2 text-sm font-bold whitespace-nowrap relative pb-4 ${category === 'all' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-700 transition-colors'}`}>
              <Icons.Star /> Semua
              {category === 'all' && <span className="absolute bottom-0 left-0 w-full h-1 bg-cyan-500 rounded-t-full"></span>}
            </button>
            <button onClick={() => setCategory('minuman')} className={`flex items-center gap-2 text-sm font-semibold whitespace-nowrap pb-4 ${category === 'minuman' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-700 transition-colors'}`}>
              <Icons.Coffee /> Minuman
              {category === 'minuman' && <span className="absolute bottom-0 left-0 w-full h-1 bg-cyan-500 rounded-t-full"></span>}
            </button>
            <button onClick={() => setCategory('makanan')} className={`flex items-center gap-2 text-sm font-semibold whitespace-nowrap pb-4 ${category === 'makanan' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-700 transition-colors'}`}>
              <Icons.Utensils /> Makanan
              {category === 'makanan' && <span className="absolute bottom-0 left-0 w-full h-1 bg-cyan-500 rounded-t-full"></span>}
            </button>
            <button onClick={() => setCategory('cemilan')} className={`flex items-center gap-2 text-sm font-semibold whitespace-nowrap pb-4 ${category === 'cemilan' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-700 transition-colors'}`}>
              <Icons.Cake /> Camilan
              {category === 'cemilan' && <span className="absolute bottom-0 left-0 w-full h-1 bg-cyan-500 rounded-t-full"></span>}
            </button>
          </div>

          {/* REKOMENDASI PILIHAN */}
          {!searchQuery && category === 'all' && recommendedMenus.length > 0 && (
            <div className="mt-8">
              <div className="px-6 flex justify-between items-end mb-4">
                <div>
                  <p className="text-[10px] font-bold text-cyan-600 tracking-[0.2em] uppercase mb-1">Signature</p>
                  <h2 className="text-2xl font-serif text-slate-900">Chef's Recommendation</h2>
                </div>
              </div>
              
              <div className="flex gap-5 overflow-x-auto px-6 pb-6 scrollbar-hide snap-x">
                {recommendedMenus.map(menu => {
                  const effectivePrice = getEffectivePrice(menu);
                  const hasDiscount = menu.discount_price && Number(menu.discount_price) > 0;
                  return (
                    <div key={menu.id} onClick={() => setSelectedMenu(menu)} className="snap-start shrink-0 w-64 bg-white rounded-[1.5rem] overflow-hidden shadow-[0_15px_35px_-5px_rgba(15,23,42,0.05),0_5px_15px_-3px_rgba(15,23,42,0.03)] border border-slate-100 relative group transition-transform duration-300 cursor-pointer">
                      <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                        {menu.image_url ? <img src={menu.image_url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" /> : <div className="w-full h-full flex items-center justify-center text-slate-300 font-serif">No Image</div>}
                        
                        {menu.is_featured && (
                          <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md text-white text-[9px] font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 tracking-widest uppercase">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-cyan-400"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                            Unggulan
                          </div>
                        )}
                        {menu.is_new && !menu.is_featured && (
                          <div className="absolute top-3 left-3 bg-emerald-500/90 backdrop-blur-md text-white text-[9px] font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 tracking-widest uppercase">
                            Baru
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="font-serif text-lg text-slate-900 leading-tight mb-1 line-clamp-1">{menu.name}</h3>
                        <p className="text-[11px] text-slate-500 font-medium line-clamp-1 mb-3">{menu.description || 'Deskripsi hidangan lezat.'}</p>
                        <div className="flex items-end gap-2">
                          {hasDiscount && <p className="text-[11px] text-slate-400 font-semibold line-through mb-0.5">Rp {Number(menu.price).toLocaleString('id-ID')}</p>}
                          <p className="font-bold text-base text-slate-900">Rp {effectivePrice.toLocaleString('id-ID')}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SEMUA MENU */}
          <div className="px-6 mt-2">
            <h2 className="text-xl font-serif text-slate-900 mb-5">Semua Menu</h2>
            
            <div className="grid grid-cols-2 gap-4">
              {filteredMenus.length === 0 ? (
                <div className="col-span-2 text-center py-10">
                  <p className="text-slate-500 font-serif text-lg">Menu tidak ditemukan</p>
                </div>
              ) : filteredMenus.map(menu => {
                const cartItem = cart.find(c => c.id === menu.id);
                const stock = getMenuStock(menu);
                const isOut = stock.isOut;
                const isLow = stock.isLow;
                const effectivePrice = getEffectivePrice(menu);
                const hasDiscount = menu.discount_price && Number(menu.discount_price) > 0;

                return (
                  <div key={menu.id} className={`bg-white rounded-[1.25rem] overflow-hidden shadow-[0_15px_35px_-5px_rgba(15,23,42,0.05),0_5px_15px_-3px_rgba(15,23,42,0.03)] border border-slate-100 relative group ${isOut ? 'opacity-60 grayscale' : ''}`}>
                    <div onClick={() => setSelectedMenu(menu)} className="relative aspect-[4/5] bg-slate-100 overflow-hidden cursor-pointer">
                      {menu.image_url ? <img src={menu.image_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300 font-serif text-xs">No Image</div>}
                      
                      {cartItem && !isOut && (
                        <div className="absolute bottom-2 right-2 bg-white/65 backdrop-blur-2xl w-7 h-7 rounded-full flex items-center justify-center shadow-md border border-white/90">
                          <span className="text-[11px] font-black text-slate-900">{cartItem.qty}</span>
                        </div>
                      )}
                      {isLow && !isOut && (
                        <div className="absolute top-2 left-2 bg-rose-500 text-white text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Sisa {stock.value}</div>
                      )}
                      {isOut && (
                        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center">
                          <span className="bg-slate-900 text-white font-bold text-[10px] px-3 py-1.5 rounded-full uppercase tracking-widest">Habis</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 onClick={() => setSelectedMenu(menu)} className="font-serif text-[15px] text-slate-900 leading-tight line-clamp-1 mb-1 cursor-pointer">{menu.name}</h3>
                      <div className="flex flex-col mb-4">
                        {hasDiscount && <span className="text-[10px] text-slate-400 font-semibold line-through">Rp {Number(menu.price).toLocaleString('id-ID')}</span>}
                        <span className="font-bold text-[15px] text-slate-900">Rp {effectivePrice.toLocaleString('id-ID')}</span>
                      </div>
                      
                      {isOut ? (
                        <button disabled className="w-full bg-slate-100 text-slate-400 font-bold py-2.5 rounded-xl text-xs cursor-not-allowed">Habis</button>
                      ) : cartItem ? (
                        <div className="flex items-center justify-between bg-slate-50 rounded-xl p-1.5 border border-slate-100">
                          <button onClick={() => decCart(menu.id)} className="w-8 h-8 bg-white rounded-lg font-bold text-slate-600 shadow-sm active:scale-95 transition-transform">−</button>
                          <span className="font-bold text-sm text-slate-900">{cartItem.qty}</span>
                          <button onClick={() => addToCart(menu)} disabled={stock.tracked && cartItem.qty >= stock.value} className="w-8 h-8 bg-slate-900 text-white rounded-lg font-bold shadow-md active:scale-95 transition-transform disabled:opacity-40">+</button>
                        </div>
                      ) : (
                        <button onClick={() => addToCart(menu)} className="w-full bg-white border border-slate-200 text-slate-900 font-bold py-2.5 rounded-xl text-xs active:bg-slate-50 transition-colors shadow-sm">Tambah</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {activeTab === 'cart' && (
        <div className="px-6 mt-8 animate-in fade-in slide-in-from-bottom-4">
          {cart.length === 0 ? (
            <div className="bg-white rounded-[1.5rem] p-10 text-center shadow-[0_15px_35px_-5px_rgba(15,23,42,0.05)] border border-slate-100">
              <div className="text-slate-300 mb-4 flex justify-center"><Icons.Cart /></div>
              <p className="text-slate-900 font-serif text-xl mb-2">Keranjang Kosong</p>
              <p className="text-xs text-slate-500 font-medium mb-6">Anda belum menambahkan menu apapun.</p>
              <button onClick={() => setActiveTab('menu')} className="bg-slate-900 text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider">Lihat Menu</button>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-[1.5rem] p-6 border border-slate-100 shadow-[0_15px_35px_-5px_rgba(15,23,42,0.05)]">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                  <h3 className="font-serif text-lg text-slate-900">Pesanan Anda</h3>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-bold uppercase tracking-widest">{totalCartQty} Item</span>
                </div>
                <div className="space-y-6">
                  {cart.map(item => {
                    const liveMenu = menus.find(m => m.id === item.id);
                    const liveStock = getMenuStock(liveMenu);
                    const maxQty = liveStock.tracked ? liveStock.value : Infinity;
                    return (
                    <div key={item.id} className="flex flex-col gap-3">
                      <div className="flex justify-between items-start gap-4">
                        <div className="w-16 h-16 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200">
                          {item.image_url ? <img src={item.image_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">No Img</div>}
                        </div>
                        <div className="flex-1 min-w-0 pt-1">
                          <p className="font-serif text-base text-slate-900 truncate">{item.name}</p>
                          <p className="text-xs font-bold text-slate-600 mt-1">Rp {Number(item.price).toLocaleString('id-ID')}</p>
                          {liveStock.isOut && <p className="text-[10px] text-rose-500 font-bold mt-1">Stok Habis</p>}
                        </div>
                        <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-1.5 border border-slate-100">
                          <button onClick={() => decCart(item.id)} className="w-7 h-7 bg-white rounded-lg font-bold text-slate-600 shadow-sm active:scale-95 transition-transform">−</button>
                          <span className="font-bold text-sm text-slate-900">{item.qty}</span>
                          <button onClick={() => addToCart(item)} disabled={item.qty >= maxQty} className="w-7 h-7 bg-slate-900 text-white rounded-lg font-bold shadow-sm active:scale-95 transition-transform disabled:opacity-40">+</button>
                        </div>
                      </div>
                      <input type="text" placeholder="Catatan khusus (mis. tanpa gula)..." value={item.note || ''} onChange={(e) => updateItemNote(item.id, e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium text-slate-900 outline-none focus:border-slate-400 transition-colors placeholder:text-slate-400" />
                    </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-[1.5rem] p-6 border border-slate-100 shadow-[0_15px_35px_-5px_rgba(15,23,42,0.05)] mt-4">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-slate-500 font-medium">
                    <span>Subtotal</span>
                    <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  {taxRate > 0 && (
                    <div className="flex justify-between text-slate-500 font-medium">
                      <span>PPN ({taxRate}%)</span>
                      <span>Rp {taxAmount.toLocaleString('id-ID')}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg pt-4 border-t border-slate-100 mt-2">
                    <span className="text-slate-900 font-serif">Total</span>
                    <span className="text-slate-900">Rp {totalPrice.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>

              <button onClick={openConfirmation} disabled={isSubmitting} className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl mt-4 shadow-xl shadow-slate-900/20 active:scale-[0.98] transition-all text-sm uppercase tracking-wider disabled:opacity-50">
                {isSubmitting ? 'Memproses...' : 'Lanjut ke Konfirmasi'}
              </button>
            </>
          )}
        </div>
      )}

      {activeTab === 'status' && (
        <div className="px-6 mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4">
          {hasWaitingOrder && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-[1.25rem] flex items-start gap-3 shadow-sm">
              <div className="text-amber-500 mt-0.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div>
                <p className="font-bold text-amber-900 text-sm">Menunggu Konfirmasi Kasir</p>
                <p className="text-xs font-medium text-amber-700 mt-1">Kasir sedang memverifikasi pesanan Anda.</p>
              </div>
            </div>
          )}

          {myOrders.length === 0 ? (
            <div className="bg-white rounded-[1.5rem] p-10 text-center shadow-[0_15px_35px_-5px_rgba(15,23,42,0.05)] border border-slate-100">
              <div className="text-slate-300 mb-4 flex justify-center"><Icons.Book /></div>
              <p className="text-slate-900 font-serif text-xl mb-2">Belum ada pesanan</p>
              <p className="text-xs text-slate-500 font-medium">Silakan pesan menu terlebih dahulu.</p>
            </div>
          ) : myOrders.map(o => {
            const isCancelled = o.payment_status === 'CANCELLED';
            const isWaitingCash = o.payment_status === 'WAITING_CASH';
            const isWaitingQris = o.payment_status === 'WAITING_QRIS';
            
            const statusIdx = ['pending', 'cooking', 'ready', 'completed'].indexOf(o.status);
            const statusLabels = ['Diterima', 'Dimasak', 'Siap', 'Selesai'];
            const statusColors = ['bg-amber-500', 'bg-blue-500', 'bg-emerald-500', 'bg-slate-900'];

            return (
              <div key={o.id} className="bg-white rounded-[1.5rem] p-6 border border-slate-100 shadow-[0_15px_35px_-5px_rgba(15,23,42,0.05)]">
                <div className="flex justify-between items-center mb-5 pb-4 border-b border-slate-100">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold tracking-wider">ORDER #{o.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-xs text-slate-600 font-medium mt-1">{new Date(o.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full uppercase text-white tracking-wider ${
                    isCancelled ? 'bg-rose-500' : isWaitingCash || isWaitingQris ? 'bg-amber-500' : statusColors[statusIdx]
                  }`}>
                    {isCancelled ? 'Ditolak' : isWaitingCash || isWaitingQris ? 'Menunggu Bayar' : o.status}
                  </span>
                </div>

                <div className="space-y-2 mb-5">
                  {o.items.map((i, idx) => (
                    <div key={idx} className="flex justify-between text-xs font-medium text-slate-700">
                      <span>{i.qty}x {i.name}</span>
                      <span>Rp {(i.price * i.qty).toLocaleString('id-ID')}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-100 mb-6">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total</span>
                  <span className="text-lg font-bold text-slate-900">Rp {Number(o.total_price).toLocaleString('id-ID')}</span>
                </div>

                {isCancelled && (
                  <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-center">
                    <p className="text-rose-800 font-bold text-sm">Pesanan Ditolak</p>
                    <p className="text-rose-600 text-xs font-medium mt-1">Pembayaran tidak ditemukan. Silakan pesan ulang.</p>
                  </div>
                )}

                {!isCancelled && !isWaitingCash && !isWaitingQris && (
                  <div className="mt-4 space-y-4">
                    {statusLabels.map((label, i) => {
                      const isDone = i <= statusIdx;
                      const isActive = i === statusIdx;
                      return (
                        <div key={i} className="flex items-start gap-4">
                          <div className="flex flex-col items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${isDone ? statusColors[statusIdx] + ' text-white border-transparent' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                              {isDone ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><polyline points="20 6 9 17 4 12"/></svg> : (i + 1)}
                            </div>
                            {i < statusLabels.length - 1 && (
                              <div className={`w-0.5 h-6 mt-1 rounded-full ${isDone && i < statusIdx ? statusColors[statusIdx] : 'bg-slate-200'}`}></div>
                            )}
                          </div>
                          <div className="flex-1 pt-0.5">
                            <p className={`text-sm font-bold ${isDone ? 'text-slate-900' : 'text-slate-400'}`}>{label}</p>
                            {isActive && <p className="text-[10px] text-cyan-600 font-bold mt-1 animate-pulse">Sedang berlangsung...</p>}
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

      {/* FOOTER INFO */}
      <div className="text-center mt-12 pb-32 space-y-4">
        {cafe.wa_number && (
          <a href={`https://wa.me/${cafe.wa_number.replace(/^0/, '62')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-5 py-2.5 rounded-full shadow-sm transition-all hover:bg-slate-50 uppercase tracking-wider">
            Hubungi Kasir
          </a>
        )}
        <div className="pt-2 flex flex-col items-center justify-center gap-1.5">
          <p className="text-[10px] font-medium text-slate-400">
            Powered by <a href="https://wa.me/6281389744957" target="_blank" rel="noopener noreferrer" className="text-slate-600 font-bold hover:text-slate-900 transition-colors">NexaFlow</a>
          </p>
        </div>
      </div>

      {/* FLOATING CART (Sleek Dark) */}
      {activeTab === 'menu' && totalCartQty > 0 && (
        <div className="fixed bottom-28 left-6 right-6 z-40 animate-in slide-in-from-bottom-8 duration-500">
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-[1.25rem] p-3.5 flex justify-between items-center shadow-2xl border border-slate-700">
            <div className="flex items-center gap-3.5 pl-1">
              <div className="relative w-11 h-11 bg-slate-800 rounded-xl flex items-center justify-center font-bold text-white border border-slate-700 text-slate-300">
                <Icons.Cart />
                <span className="absolute -top-1.5 -right-1.5 bg-cyan-500 text-slate-900 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900">{totalCartQty}</span>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400">Total Tagihan</p>
                <p className="text-[15px] font-bold text-white">Rp {totalPrice.toLocaleString('id-ID')}</p>
              </div>
            </div>
            <button onClick={() => setActiveTab('cart')} className="bg-cyan-500 text-slate-900 font-black px-5 py-3 rounded-xl text-[11px] uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.3)] active:scale-95 transition-transform">
              Checkout
            </button>
          </div>
        </div>
      )}

      {/* BOTTOM NAVIGATION (Premium Glass) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-6">
        <div className="max-w-md mx-auto bg-white/65 backdrop-blur-2xl border border-white/90 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] rounded-[2rem] p-2 flex justify-between items-center">
          <button onClick={() => setActiveTab('menu')} className={`flex flex-col items-center justify-center w-20 h-14 rounded-2xl transition-all ${activeTab === 'menu' ? 'bg-white shadow-sm text-slate-900 border border-slate-100' : 'text-slate-400 hover:text-slate-900'}`}>
            <Icons.Book />
            <span className="text-[9px] font-bold uppercase tracking-wider mt-1">Menu</span>
          </button>
          
          <button onClick={() => setActiveTab('cart')} className={`flex flex-col items-center justify-center w-20 h-14 rounded-2xl transition-all relative ${activeTab === 'cart' ? 'bg-white shadow-sm text-slate-900 border border-slate-100' : 'text-slate-400 hover:text-slate-900'}`}>
            <Icons.Cart />
            <span className="text-[9px] font-bold uppercase tracking-wider mt-1">Keranjang</span>
            {totalCartQty > 0 && activeTab !== 'cart' && (
              <span className="absolute top-2.5 right-3.5 bg-rose-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">{totalCartQty}</span>
            )}
          </button>
          
          <button onClick={() => setActiveTab('status')} className={`flex flex-col items-center justify-center w-20 h-14 rounded-2xl transition-all ${activeTab === 'status' ? 'bg-white shadow-sm text-slate-900 border border-slate-100' : 'text-slate-400 hover:text-slate-900'}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            <span className="text-[9px] font-bold uppercase tracking-wider mt-1">Status</span>
          </button>
        </div>
      </div>

      {/* MODAL DETAIL MENU */}
      {selectedMenu && (() => {
        const selectedStock = getMenuStock(selectedMenu);
        const selectedCartItem = cart.find(c => c.id === selectedMenu.id);
        const effectivePrice = getEffectivePrice(selectedMenu);
        const hasDiscount = selectedMenu.discount_price && Number(selectedMenu.discount_price) > 0;
        
        return (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-[100] p-0 sm:p-4" onClick={() => setSelectedMenu(null)}>
            <div className="bg-white w-full max-w-md rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl animate-in slide-in-from-bottom-10 sm:zoom-in-95 overflow-hidden flex flex-col max-h-[92vh]" onClick={e => e.stopPropagation()}>
              <div className="overflow-y-auto pb-[100px] relative">
                <div className="relative w-full h-[300px] sm:h-[320px] bg-slate-100">
                  {selectedMenu.image_url ? (
                    <img src={selectedMenu.image_url} alt={selectedMenu.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 font-serif">No Image</div>
                  )}
                  
                  <div className="absolute top-5 left-5 flex flex-wrap gap-2 max-w-[70%]">
                    {selectedMenu.is_featured && (
                      <span className="bg-slate-900/90 backdrop-blur-md text-white text-[9px] font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 tracking-widest uppercase">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-cyan-400"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        Unggulan
                      </span>
                    )}
                  </div>
                  
                  <button onClick={() => setSelectedMenu(null)} className="absolute top-5 right-5 w-10 h-10 bg-white/65 backdrop-blur-2xl hover:bg-white text-slate-900 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-90 border border-white/90">
                    <Icons.X />
                  </button>
                </div>

                <div className="bg-white rounded-t-[2rem] -mt-8 relative px-6 py-8">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-serif text-slate-900 leading-tight max-w-[65%]">{selectedMenu.name}</h2>
                    
                    <div className="flex flex-col items-end">
                      {hasDiscount && <span className="text-sm text-slate-400 font-medium line-through mb-0.5">Rp {Number(selectedMenu.price).toLocaleString('id-ID')}</span>}
                      <span className={`text-2xl font-bold tracking-tight text-slate-900`}>Rp {effectivePrice.toLocaleString('id-ID')}</span>
                      
                      {hasDiscount && (
                        <span className="bg-rose-50 text-rose-600 text-[10px] font-bold px-2.5 py-1 rounded-full mt-1.5 border border-rose-100 flex items-center gap-1 uppercase tracking-wider">
                          Hemat {Math.round(((Number(selectedMenu.price) - Number(selectedMenu.discount_price)) / Number(selectedMenu.price)) * 100)}%
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-[15px] text-slate-600 leading-relaxed mb-6 font-medium">
                    {selectedMenu.description || 'Belum ada deskripsi untuk menu ini.'}
                  </p>

                  <div className="mb-4">
                    <label className="block text-xs font-bold text-slate-900 mb-2 uppercase tracking-wide">Catatan Khusus</label>
                    <input 
                      type="text" 
                      value={popupNote}
                      onChange={e => setPopupNote(e.target.value)}
                      placeholder="Misal: Less sugar, extra ice..." 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 outline-none focus:border-slate-400 transition-colors placeholder:text-slate-400" 
                    />
                  </div>

                  {selectedStock.isLow && (
                    <div className="bg-rose-50 text-rose-600 text-[10px] font-bold px-3 py-2 rounded-lg inline-flex items-center gap-2 border border-rose-200 uppercase tracking-wider">
                      Sisa {selectedStock.value} Porsi
                    </div>
                  )}
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-100 p-5 flex gap-4 items-center z-10 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                {selectedStock.isOut ? (
                  <button disabled className="w-full bg-slate-100 text-slate-400 font-bold py-4 rounded-xl text-sm cursor-not-allowed uppercase tracking-wider">Habis</button>
                ) : selectedCartItem ? (
                  <>
                    <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200 overflow-hidden h-[56px]">
                      <button onClick={() => decCart(selectedMenu.id)} className="w-12 h-full text-slate-600 text-2xl font-bold flex items-center justify-center hover:bg-slate-200 transition-colors">−</button>
                      <span className="w-8 text-center font-bold text-slate-900 text-lg">{selectedCartItem.qty}</span>
                      <button onClick={() => addToCart(selectedMenu, popupNote)} disabled={selectedStock.tracked && selectedCartItem.qty >= selectedStock.value} className="w-12 h-full text-slate-600 text-2xl font-bold flex items-center justify-center hover:bg-slate-200 transition-colors disabled:opacity-40">+</button>
                    </div>
                    <button onClick={() => { addToCart(selectedMenu, popupNote); setSelectedMenu(null); }} className="flex-1 bg-slate-900 text-white font-bold py-4 rounded-xl text-[15px] shadow-lg active:scale-[0.98] transition-transform flex justify-between items-center px-6">
                      <span>Tambah</span>
                      <span>Rp {(effectivePrice * selectedCartItem.qty).toLocaleString('id-ID')}</span>
                    </button>
                  </>
                ) : (
                  <button onClick={() => { addToCart(selectedMenu, popupNote); setSelectedMenu(null); }} className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl text-[15px] shadow-lg active:scale-[0.98] transition-transform flex justify-between items-center px-6">
                    <span>Tambah Pesanan</span>
                    <span>Rp {effectivePrice.toLocaleString('id-ID')}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* POPUP PESANAN SIAP (TTS) */}
      {showReadyPopup && (
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-white/95 backdrop-blur-xl w-full max-w-sm rounded-[2rem] p-8 text-center shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border border-white animate-in zoom-in-95 duration-500">
            
            <div className="relative w-24 h-24 mx-auto mb-6">
              {isSpeaking && (
                <>
                  <div className="absolute inset-0 rounded-full border border-emerald-400 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                  <div className="absolute inset-0 rounded-full border border-emerald-400 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite_0.5s]"></div>
                </>
              )}
              <div className="w-full h-full bg-emerald-50 rounded-full flex items-center justify-center relative z-10 shadow-inner text-emerald-600 p-6">
                <Icons.Speaker />
              </div>
            </div>
            
            <h2 className="text-3xl font-serif text-slate-900 mb-2">Pesanan Siap!</h2>
            <p className="text-[13px] font-medium text-slate-500 mb-8 leading-relaxed">
              Pesanan atas nama <strong className="text-slate-900">{readyOrder?.customer_name}</strong>, meja <strong className="text-slate-900">{readyOrder?.table_number}</strong>, sudah siap silahkan ambil di kasir.
            </p>

            <button onClick={() => speakReadyOrder(readyOrder)} disabled={isSpeaking} className={`w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-transform flex justify-center items-center gap-2 text-sm disabled:opacity-50`}>
              <span className="w-4 h-4"><Icons.Speaker /></span>
              {isSpeaking ? 'Sedang Memanggil...' : 'Putar Suara'}
            </button>
            
            <p className="mt-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Menunggu konfirmasi kasir
            </p>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-[100] p-0 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-t-[2rem] sm:rounded-[2rem] p-6 sm:p-8 shadow-2xl animate-in slide-in-from-bottom-10 sm:zoom-in-95 border-t border-slate-100">
            <h3 className="text-xl font-serif text-slate-900 text-center mb-1">Konfirmasi Pesanan</h3>
            <p className="text-xs text-slate-500 font-medium text-center mb-6">Pastikan nama dan pesanan sudah benar.</p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-[11px] font-bold text-slate-900 mb-2 uppercase tracking-wide">Nama Pemesan <span className="text-rose-500">*</span></label>
                <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Contoh: Budi" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-slate-400 transition-colors placeholder:text-slate-400" autoFocus />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-900 mb-2 uppercase tracking-wide">Catatan Tambahan (Opsional)</label>
                <input type="text" value={globalNote} onChange={e => setGlobalNote(e.target.value)} placeholder="Contoh: Tolong cepat ya" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-slate-400 transition-colors placeholder:text-slate-400" />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-3.5 rounded-xl font-bold text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">Batal</button>
              <button onClick={handleNextToPayment} disabled={isSubmitting || !customerName.trim()} className="flex-[2] bg-slate-900 text-white font-bold py-3.5 rounded-xl text-sm shadow-lg active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100">
                {cafe.is_pay_first ? 'Pilih Pembayaran' : (isSubmitting ? 'Memproses...' : 'Kirim Pesanan')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PEMBAYARAN */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-[100] p-0 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-t-[2rem] sm:rounded-[2rem] p-6 sm:p-8 shadow-2xl animate-in slide-in-from-bottom-10 sm:zoom-in-95 border-t border-slate-100">
            <h3 className="text-xl font-serif text-slate-900 text-center mb-1">Pilih Pembayaran</h3>
            <p className="text-xs text-slate-500 font-medium text-center mb-6">Silakan pilih cara pembayaran Anda.</p>

            <div className="space-y-3 mb-6">
              <button onClick={() => handleCheckout('CASH')} className="w-full bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-between hover:bg-slate-50 transition-colors shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm text-slate-900">Bayar Tunai (Cash)</p>
                    <p className="text-[10px] font-medium text-slate-500 mt-0.5">Bayar langsung ke kasir</p>
                  </div>
                </div>
              </button>

              <button onClick={() => { setShowPaymentModal(false); setShowQrisModal(true); }} className="w-full bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-between hover:bg-slate-50 transition-colors shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-50 text-cyan-600 rounded-xl flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm text-slate-900">QRIS (Scan Barcode)</p>
                    <p className="text-[10px] font-medium text-slate-500 mt-0.5">M-Banking / E-Wallet</p>
                  </div>
                </div>
              </button>
            </div>

            <button onClick={() => { setShowPaymentModal(false); setShowConfirmModal(true); }} className="w-full py-3.5 rounded-xl font-bold text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">Kembali</button>
          </div>
        </div>
      )}

      {/* MODAL QRIS */}
      {showQrisModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-[100] p-0 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-t-[2rem] sm:rounded-[2rem] p-6 sm:p-8 shadow-2xl animate-in slide-in-from-bottom-10 sm:zoom-in-95 border-t border-slate-100">
            <h3 className="text-xl font-serif text-slate-900 text-center mb-1">Scan QRIS</h3>
            <p className="text-xs text-slate-500 font-medium text-center mb-4">Total: <span className="text-slate-900 font-bold">Rp {totalPrice.toLocaleString('id-ID')}</span></p>

            <div className="bg-white border border-slate-200 rounded-2xl p-2 mb-4 flex justify-center shadow-sm">
              {cafe.qris_string ? (
                 <img src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(generateDynamicQRIS(cafe.qris_string, totalPrice) || cafe.qris_string)}&margin=10`} alt="QRIS" className="w-full max-w-[250px] object-contain" />
              ) : (
                 <div className="text-center p-8 text-slate-500 font-medium text-sm">Gambar QRIS belum diset.</div>
              )}
            </div>

            <p className="text-[10px] text-slate-400 font-medium text-center mb-6">Silakan screenshot halaman ini atau tunjukkan ke kasir jika pembayaran berhasil.</p>

            <div className="space-y-2">
              <button onClick={() => handleCheckout('QRIS')} className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl text-sm shadow-lg active:scale-95 transition-transform">
                Saya Sudah Bayar
              </button>
              <button onClick={() => { setShowQrisModal(false); setShowPaymentModal(true); }} className="w-full py-3 rounded-xl font-bold text-xs text-slate-500 hover:text-slate-900">Ganti Metode</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[110] bg-slate-900 text-white px-5 py-3 rounded-full text-xs font-bold shadow-2xl animate-in fade-in slide-in-from-top-4 border border-slate-700">
          {toast}
        </div>
      )}
    </div>
  );
}

export default function OrderPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-12 h-12 border-4 border-slate-300 border-t-cyan-500 rounded-full animate-spin"></div></div>}><OrderContent /></Suspense>;
}