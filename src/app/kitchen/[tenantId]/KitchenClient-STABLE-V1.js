'use client';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';

const WA_ADMIN = '6281389744957';

// FUNGSI EKSTRAKSI WARNA DARI BANNER
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
          document.documentElement.style.setProperty('--primary-light', `rgba(${r}, ${g}, ${b}, 0.2)`);
          document.documentElement.style.setProperty('--primary-dark', `rgb(${Math.max(0, r-20)}, ${Math.max(0, g-20)}, ${Math.max(0, b-20)})`);
        } else {
          throw new Error('Fallback');
        }
      } catch (err) {
        document.documentElement.style.setProperty('--primary-color', '#4f46e5');
        document.documentElement.style.setProperty('--primary-light', 'rgba(79, 70, 229, 0.2)');
        document.documentElement.style.setProperty('--primary-dark', '#3730a3');
      }
    };
    img.onerror = () => {
      document.documentElement.style.setProperty('--primary-color', '#4f46e5');
      document.documentElement.style.setProperty('--primary-light', 'rgba(79, 70, 229, 0.2)');
      document.documentElement.style.setProperty('--primary-dark', '#3730a3');
    };
  } catch (e) {
    document.documentElement.style.setProperty('--primary-color', '#4f46e5');
    document.documentElement.style.setProperty('--primary-light', 'rgba(79, 70, 229, 0.2)');
    document.documentElement.style.setProperty('--primary-dark', '#3730a3');
  }
};

const Icons = {
  Clock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polyline points="20 6 9 17 4 12"/></svg>,
  Fire: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>,
  Volume: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>,
  VolumeOff: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>,
  Expand: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>,
  Logout: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Lock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Undo: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>,
  Alert: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Sun: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  Moon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  Printer: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  FileText: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
};

export default function KitchenClient({ tenantId }) {
  const [authMode, setAuthMode] = useState('loading');
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [verifying, setVerifying] = useState(false);

  const [tenant, setTenant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isPayFirst, setIsPayFirst] = useState(false);
  const [isSuspended, setIsSuspended] = useState(false);
  const [realtimeStatus, setRealtimeStatus] = useState('connecting');
  const [nowTick, setNowTick] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState('new');
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // 🔥 THEME STATE (Default gelap untuk dapur, bisa diubah)
  const [theme, setTheme] = useState('dark');

  const [cancelBanner, setCancelBanner] = useState(null);
  const [undoToast, setUndoToast] = useState(null);
  const [wakeLockActive, setWakeLockActive] = useState(false);

  const audioCtxRef = useRef(null);
  const soundEnabledRef = useRef(true);
  const prevOrderIdsRef = useRef(null);
  const prevOrderStatusMapRef = useRef(new Map());
  const channelRef = useRef(null);
  const wakeLockRef = useRef(null);
  const undoTimerRef = useRef(null);
  const cancelBannerTimerRef = useRef(null);
  const isPayFirstRef = useRef(false);
  
  const ordersRef = useRef([]);
  ordersRef.current = orders;
  const realtimeDebounceRef = useRef(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('nexaflow_kds_theme');
    if (savedTheme) setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('nexaflow_kds_theme', newTheme);
  };

  useEffect(() => {
    const update = () => setNowTick(Date.now());
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  useEffect(() => {
    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current);
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
      if (cancelBannerTimerRef.current) clearTimeout(cancelBannerTimerRef.current);
      if (realtimeDebounceRef.current) clearTimeout(realtimeDebounceRef.current);
      if (wakeLockRef.current) { try { wakeLockRef.current.release(); } catch {} }
    };
  }, []);

  const requestWakeLock = async () => {
    try {
      if (!('wakeLock' in navigator)) return false;
      if (wakeLockRef.current) return true;
      wakeLockRef.current = await navigator.wakeLock.request('screen');
      setWakeLockActive(true);
      wakeLockRef.current.addEventListener('release', () => {
        setWakeLockActive(false);
        wakeLockRef.current = null;
      });
      return true;
    } catch (e) { return false; }
  };

  const releaseWakeLock = async () => {
    if (wakeLockRef.current) {
      try { await wakeLockRef.current.release(); } catch {}
      wakeLockRef.current = null;
      setWakeLockActive(false);
    }
  };

  useEffect(() => {
    if (authMode !== 'ready') return;
    requestWakeLock();
    const onVisibility = () => { 
      if (document.visibilityState === 'visible') {
        requestWakeLock();
        fetchOrders();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => { document.removeEventListener('visibilitychange', onVisibility); releaseWakeLock(); };
  }, [authMode]);

  useEffect(() => {
    if (authMode !== 'ready' || !tenantId) return;
    const poll = setInterval(() => {
      fetchOrders();
    }, 5000);
    return () => clearInterval(poll);
  }, [authMode, tenantId]);

  const playBeep = (force = false) => {
    if (!force && !soundEnabledRef.current) return;
    if (!audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      [0, 0.25, 0.5].forEach(t => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = 880;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0, ctx.currentTime + t);
        gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + t);
        osc.stop(ctx.currentTime + t + 0.2);
      });
    } catch {}
  };

  const playCancelBeep = (force = false) => {
    if (!force && !soundEnabledRef.current) return;
    if (!audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      [0, 0.35].forEach(t => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = 400;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0, ctx.currentTime + t);
        gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + t + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + t);
        osc.stop(ctx.currentTime + t + 0.3);
      });
    } catch {}
  };

  const initAudio = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      audioCtxRef.current.resume();
      setAudioUnlocked(true);
      soundEnabledRef.current = true;
      setSoundEnabled(true);
      playBeep(true);
    } catch {}
  };

  const handleSoundToggle = () => {
    if (!audioUnlocked) { initAudio(); return; }
    const newVal = !soundEnabledRef.current;
    soundEnabledRef.current = newVal;
    setSoundEnabled(newVal);
    if (newVal) playBeep(true);
  };

  const fetchOrders = async () => {
    if (!tenantId) return;
    const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('tenant_id', tenantId)
      .or(`status.in.(pending,cooking),created_at.gte.${cutoff}`)
      .order('created_at', { ascending: true });
    
    if (data) {
      const isPaidCheck = (o) => (o.payment_status === 'PAID' || o.payment_status === 'paid' || !o.payment_status);
      
      const activeIds = new Set(data.filter(o => 
        ['pending', 'cooking'].includes(o.status) && 
        (!isPayFirstRef.current || isPaidCheck(o))
      ).map(o => o.id));
      
      const prevIds = prevOrderIdsRef.current;
      if (prevIds !== null) {
        const newOnes = [...activeIds].filter(id => !prevIds.has(id));
        if (newOnes.length > 0) playBeep();
      }
      prevOrderIdsRef.current = activeIds;

      const prevMap = prevOrderStatusMapRef.current;
      const newMap = new Map();
      data.forEach(o => {
        newMap.set(o.id, o.status);
        const prevStatus = prevMap.get(o.id);
        if (prevStatus && ['pending', 'cooking'].includes(prevStatus) && o.status === 'cancelled') {
          playCancelBeep();
          if (cancelBannerTimerRef.current) clearTimeout(cancelBannerTimerRef.current);
          setCancelBanner({ tableNumber: o.table_number, id: o.id });
          cancelBannerTimerRef.current = setTimeout(() => setCancelBanner(null), 12000);
        }
      });
      prevOrderStatusMapRef.current = newMap;

      setOrders(data);
    }
  };

  const loadData = async () => {
    try {
      const { data: tenantData } = await supabase.from('tenants').select('name, logo_url, banner_url, is_pay_first, is_active').eq('id', tenantId).single();
      if (tenantData) {
        if (tenantData.is_active === false) {
          setIsSuspended(true);
          setTenant(tenantData);
          return;
        }

        setTenant(tenantData);
        const payFirstStatus = tenantData.is_pay_first !== false;
        setIsPayFirst(payFirstStatus);
        isPayFirstRef.current = payFirstStatus;
        
        if (tenantData.banner_url) extractDominantColor(tenantData.banner_url);
        else if (tenantData.logo_url) extractDominantColor(tenantData.logo_url);
      }
    } catch {}
    await fetchOrders();
    
    if (channelRef.current) supabase.removeChannel(channelRef.current);
    channelRef.current = supabase.channel('kitchen-' + tenantId + '-' + Date.now())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: `tenant_id=eq.${tenantId}` }, (payload) => {
        if (payload.eventType === 'INSERT') {
          fetchOrders();
          return;
        }
        if (realtimeDebounceRef.current) clearTimeout(realtimeDebounceRef.current);
        realtimeDebounceRef.current = setTimeout(() => fetchOrders(), 600);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'tenants', filter: `id=eq.${tenantId}` }, (payload) => {
        if (payload.new.is_pay_first !== undefined) {
          const pf = payload.new.is_pay_first !== false;
          setIsPayFirst(pf);
          isPayFirstRef.current = pf;
          fetchOrders();
        }
        if (payload.new.is_active !== undefined) {
          setIsSuspended(payload.new.is_active === false);
        }
      })
      .subscribe(status => {
        if (status === 'SUBSCRIBED') setRealtimeStatus('online');
        else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') setRealtimeStatus('offline');
        else setRealtimeStatus('connecting');
      });
  };

  const verifyPin = async (pin) => {
    if (!tenantId || !pin) return false;
    try {
      const { data: tenantData } = await supabase.from('tenants').select('is_active').eq('id', tenantId).single();
      if (tenantData && tenantData.is_active === false) {
        return 'SUSPENDED';
      }
    } catch {}

    try {
      const { data, error } = await supabase.rpc('verify_kitchen_pin', { p_tenant: tenantId, p_pin: pin });
      if (!error) return data === true;
    } catch {}
    try {
      const { data } = await supabase.from('tenants').select('kitchen_pin').eq('id', tenantId).single();
      return data?.kitchen_pin === pin;
    } catch {}
    return false;
  };

  useEffect(() => {
    if (!tenantId) return;
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && !session.user.is_anonymous) {
        const { data: userData } = await supabase.from('users').select('tenant_id').eq('id', session.user.id).single();
        if (userData?.tenant_id === tenantId) {
          await loadData();
          setAuthMode('ready');
          return;
        }
      }
      const urlParams = new URLSearchParams(window.location.search);
      const urlPin = urlParams.get('pin');
      if (urlPin) {
        const ok = await verifyPin(urlPin);
        if (ok === 'SUSPENDED') {
          setIsSuspended(true);
          setAuthMode('suspended');
          return;
        }
        if (ok === true) {
          localStorage.setItem('kds_pin_' + tenantId, urlPin);
          window.history.replaceState({}, '', '/kitchen/' + tenantId);
          await loadData();
          setAuthMode('ready');
          return;
        }
      }
      const savedPin = localStorage.getItem('kds_pin_' + tenantId);
      if (savedPin) {
        const ok = await verifyPin(savedPin);
        if (ok === 'SUSPENDED') {
          setIsSuspended(true);
          setAuthMode('suspended');
          return;
        }
        if (ok === true) { await loadData(); setAuthMode('ready'); return; }
        localStorage.removeItem('kds_pin_' + tenantId);
      }
      setAuthMode('pin');
    };
    init();
  }, [tenantId]);

  const submitPin = async () => {
    if (pinInput.length !== 4) return;
    setVerifying(true);
    setPinError('');
    const ok = await verifyPin(pinInput);
    if (ok === 'SUSPENDED') {
      setAuthMode('suspended');
      setVerifying(false);
      return;
    }
    if (ok === true) {
      localStorage.setItem('kds_pin_' + tenantId, pinInput);
      initAudio();
      await loadData();
      setAuthMode('ready');
    } else {
      setPinError('PIN salah. Coba lagi.');
      setPinInput('');
    }
    setVerifying(false);
  };

  const markCooking = async (orderId) => {
    const prevOrder = ordersRef.current.find(o => o.id === orderId);
    if (!prevOrder) return;
    
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'cooking' } : o));
    
    const { error } = await supabase.from('orders').update({ status: 'cooking' }).eq('id', orderId);
    if (error) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: prevOrder.status } : o));
      alert('Gagal update: ' + error.message);
    }
  };

  const markReady = async (order) => {
    const previousStatus = order.status;
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'ready' } : o));
    
    const { error } = await supabase.from('orders').update({ status: 'ready' }).eq('id', order.id);
    if (error) {
      setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: previousStatus } : o));
      alert('Gagal update: ' + error.message);
      return;
    }
    
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    setUndoToast({ orderId: order.id, tableNumber: order.table_number, previousStatus });
    undoTimerRef.current = setTimeout(() => setUndoToast(null), 5000);
  };

  const undoMarkReady = async () => {
    if (!undoToast) return;
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    
    setOrders(prev => prev.map(o => o.id === undoToast.orderId ? { ...o, status: undoToast.previousStatus } : o));
    
    const { error } = await supabase.from('orders').update({ status: undoToast.previousStatus }).eq('id', undoToast.orderId);
    if (error) {
      alert('Gagal undo: ' + error.message);
    }
    setUndoToast(null);
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    } catch {}
  };

  const handleLogout = () => {
    if (confirm('Keluar dari layar dapur? Anda perlu PIN lagi untuk masuk.')) {
      localStorage.removeItem('kds_pin_' + tenantId);
      releaseWakeLock();
      setAuthMode('pin');
      setPinInput('');
    }
  };

  // 🔥 FUNGSI CETAK PESANAN (DIPERBESAR & DIPERTEBAL)
  const handlePrintOrder = (order) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Pop-up diblokir. Izinkan pop-up untuk mencetak.");
      return;
    }

    const itemsHtml = order.items.map(item => `
      <tr>
        <td style="font-size: 26px; font-weight: 900; padding: 10px 0; border-bottom: 2px dotted #000;">${item.qty}x ${item.name}</td>
      </tr>
      ${item.note ? `<tr><td style="font-size: 20px; font-weight: bold; font-style: italic; color: #000; padding-bottom: 10px;">➔ Note: ${item.note}</td></tr>` : ''}
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Order Meja ${order.table_number}</title>
          <style>
            @page { margin: 0; }
            body { font-family: 'Courier New', Courier, monospace; padding: 15px; margin: 0 auto; width: 80mm; color: #000; }
            .header { text-align: center; border-bottom: 3px dashed #000; padding-bottom: 15px; margin-bottom: 15px; }
            h1 { font-size: 42px; margin: 0 0 5px 0; font-weight: 900; letter-spacing: 1px; }
            h2 { font-size: 24px; margin: 0; font-weight: 900; }
            .meta { font-size: 16px; font-weight: bold; margin-bottom: 5px; }
            .items { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .notes { border: 3px solid #000; padding: 12px; font-size: 22px; font-weight: 900; margin-bottom: 20px; text-align: center; }
            .footer { text-align: center; font-size: 14px; font-weight: bold; border-top: 3px dashed #000; padding-top: 15px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>MEJA ${order.table_number}</h1>
            <h2>${order.customer_name || 'TAMU'}</h2>
          </div>
          <div class="meta">Waktu: ${new Date(order.created_at).toLocaleTimeString('id-ID')}</div>
          <div class="meta">Order ID: #${order.id.slice(0, 6).toUpperCase()}</div>
          <hr style="border-top: 2px solid #000; margin: 10px 0;" />
          
          <table class="items">
            ${itemsHtml}
          </table>

          ${order.order_note ? `<div class="notes">CATATAN: ${order.order_note}</div>` : ''}

          <div class="footer">
            --- KITCHEN TICKET ---<br/>
            Powered by NexaFlow
          </div>
          <script>
            window.onload = function() { 
              window.print(); 
              setTimeout(() => window.close(), 1000); 
            }
          <\/script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // 🔥 FUNGSI CETAK LAPORAN DAPUR (BARU)
  const handlePrintReport = () => {
    const today = new Date().toDateString();
    const todayOrders = orders.filter(o => new Date(o.created_at).toDateString() === today && ['ready', 'completed'].includes(o.status));
    
    let totalOrders = todayOrders.length;
    let totalItems = 0;
    const menuMap = new Map();

    todayOrders.forEach(o => {
      if (o.items) {
        o.items.forEach(i => {
          totalItems += Number(i.qty || 0);
          const existing = menuMap.get(i.name) || 0;
          menuMap.set(i.name, existing + Number(i.qty || 0));
        });
      }
    });

    const sortedMenus = Array.from(menuMap.entries()).sort((a, b) => b[1] - a[1]);

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Pop-up diblokir. Izinkan pop-up untuk mencetak.");
      return;
    }

    const menuRows = sortedMenus.map(([name, qty]) => `
      <tr>
        <td style="font-size: 18px; padding: 10px; border-bottom: 1px solid #ccc; font-weight: bold;">${name}</td>
        <td style="font-size: 18px; padding: 10px; border-bottom: 1px solid #ccc; font-weight: bold; text-align: right;">${qty} Porsi</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Laporan Dapur Harian</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; color: #000; margin: 0 auto; max-width: 210mm; }
            .header { text-align: center; border-bottom: 3px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
            h1 { font-size: 32px; margin: 0 0 10px 0; font-weight: 900; letter-spacing: 1px; }
            h2 { font-size: 20px; margin: 0; font-weight: bold; color: #555; }
            .summary { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .box { border: 3px solid #000; padding: 20px; border-radius: 8px; text-align: center; width: 45%; }
            .box h3 { margin: 0; font-size: 18px; color: #555; }
            .box p { margin: 10px 0 0 0; font-size: 40px; font-weight: 900; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #f0f0f0; padding: 15px; text-align: left; font-size: 18px; border-bottom: 3px solid #000; }
            .footer { text-align: center; margin-top: 50px; font-size: 14px; font-weight: bold; border-top: 2px dashed #000; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>LAPORAN DAPUR HARIAN</h1>
            <h2>${tenant?.name || 'Kafe'} - ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h2>
          </div>
          
          <div class="summary">
            <div class="box">
              <h3>Total Pesanan Selesai</h3>
              <p>${totalOrders}</p>
            </div>
            <div class="box">
              <h3>Total Porsi Dimasak</h3>
              <p>${totalItems}</p>
            </div>
          </div>

          <h2 style="margin-top: 30px; font-size: 24px;">Rekap Menu Dimasak</h2>
          <table>
            <thead>
              <tr>
                <th>Nama Menu</th>
                <th style="text-align: right;">Jumlah</th>
              </tr>
            </thead>
            <tbody>
              ${menuRows || '<tr><td colspan="2" style="text-align:center; padding: 30px; font-size: 18px; font-weight: bold;">Belum ada pesanan selesai hari ini</td></tr>'}
            </tbody>
          </table>

          <div class="footer">
            Dicetak pada: ${new Date().toLocaleTimeString('id-ID')} | Powered by NexaFlow
          </div>
          <script>
            window.onload = function() { 
              window.print(); 
              setTimeout(() => window.close(), 1000); 
            }
          <\/script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const isPaid = (o) => (o.payment_status === 'PAID' || o.payment_status === 'paid' || !o.payment_status);
  
  const pendingOrders = orders
    .filter(o => o.status === 'pending' && (!isPayFirst || isPaid(o)))
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    
  const cookingOrders = orders
    .filter(o => o.status === 'cooking' && (!isPayFirst || isPaid(o)))
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    
  const displayOrders = activeTab === 'new' ? pendingOrders : activeTab === 'cooking' ? cookingOrders : [...pendingOrders, ...cookingOrders].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  const getTimeBadge = (createdAt) => {
    if (!nowTick) return null;
    const mins = Math.floor((nowTick - new Date(createdAt).getTime()) / 60000);
    if (mins < 0) return null;
    if (mins < 5) return { mins, cls: theme === 'dark' ? 'bg-slate-700/50 text-slate-300 border border-slate-600' : 'bg-slate-100 text-slate-600 border border-slate-300', pulse: false };
    if (mins < 15) return { mins, cls: theme === 'dark' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-amber-100 text-amber-700 border border-amber-300', pulse: false };
    return { mins, cls: theme === 'dark' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-rose-100 text-rose-700 border border-rose-300', pulse: true };
  };

  const clock = nowTick ? new Date(nowTick).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '';

  if (isSuspended || authMode === 'suspended') {
    const waMessage = `Halo Admin NexaFlow, akun kafe dengan ID ${tenantId} sedang disuspend. Mohon bantu aktifkan kembali untuk layar dapur. Terima kasih.`;
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center border-4 border-rose-500">
          <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-rose-300">
            <span className="text-5xl">🔒</span>
          </div>
          
          <h1 className="text-3xl font-black text-slate-900 mb-2">Layar Dapur Dinonaktifkan</h1>
          {tenant?.name && (
            <p className="text-sm font-semibold text-slate-600 mb-4">Kafe: <span className="font-black text-slate-900">{tenant.name}</span></p>
          )}
          
          <div className="bg-rose-50 border-2 border-rose-300 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm font-bold text-rose-900 leading-relaxed">
              Akun kafe sedang <strong>dinonaktifkan oleh Admin NexaFlow</strong>. 
              Layar dapur tidak bisa digunakan sampai akun diaktifkan kembali. Silakan hubungi admin.
            </p>
          </div>

          <div className="space-y-3">
            <a
              href={`https://wa.me/${WA_ADMIN}?text=${encodeURIComponent(waMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-xl text-base shadow-lg active:scale-95 transition-transform border-2 border-emerald-700"
            >
              💬 Hubungi Admin
            </a>
            <button
              onClick={() => {
                localStorage.removeItem('kds_pin_' + tenantId);
                releaseWakeLock();
                setAuthMode('pin');
                setIsSuspended(false);
              }}
              className="w-full flex items-center justify-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-black py-3 rounded-xl text-sm active:scale-95 transition-transform border-2 border-slate-300"
            >
              🚪 Keluar
            </button>
          </div>

          <p className="text-[10px] font-bold text-slate-400 mt-6">
            NexaFlow SaaS · Kitchen Display dalam mode terbatas
          </p>
        </div>
      </div>
    );
  }

  if (authMode === 'loading') {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-slate-900 text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[var(--primary-color)]/30 border-t-[var(--primary-color)] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-bold">Memuat layar dapur...</p>
        </div>
      </div>
    );
  }

  if (authMode === 'pin') {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <div className={`border-2 rounded-2xl p-8 sm:p-12 max-w-md w-full shadow-2xl ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'}`}>
          <div className="text-center mb-8">
            <div className={`w-16 h-16 border-2 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm ${theme === 'dark' ? 'bg-[var(--primary-color)]/20 border-[var(--primary-color)]/30 text-[var(--primary-color)]' : 'bg-[var(--primary-light)] border-[var(--primary-color)]/50 text-[var(--primary-color)]'}`}>
              <Icons.Lock />
            </div>
            <h1 className="text-2xl font-black mb-2">Layar Dapur</h1>
            <p className="text-sm font-semibold text-slate-500">Masukkan PIN 4 digit</p>
          </div>
          <input
            type="tel"
            inputMode="numeric"
            maxLength={4}
            value={pinInput}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 4);
              setPinInput(val);
              if (val.length === 4) setTimeout(() => submitPin(), 150);
            }}
            autoFocus
            className={`w-full border-2 focus:border-[var(--primary-color)] rounded-xl text-center text-5xl font-black py-5 tracking-[0.5em] outline-none transition-all ${theme === 'dark' ? 'bg-slate-900/50 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
            placeholder="••••"
          />
          {pinError && <p className="text-rose-500 text-sm font-bold text-center mt-3">{pinError}</p>}
          {verifying && <p className="text-slate-500 text-sm text-center mt-3 font-semibold">Memverifikasi...</p>}
          <button
            onClick={submitPin}
            disabled={pinInput.length !== 4 || verifying}
            className="w-full mt-6 bg-[var(--primary-color)] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black py-4 rounded-xl text-lg shadow-md transition-all border-2 border-[var(--primary-dark)]"
          >
            {verifying ? 'Memverifikasi...' : 'Masuk'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col relative font-sans transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900 text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
      {cancelBanner && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] w-[90%] max-w-2xl bg-rose-600 text-white px-6 py-5 rounded-2xl shadow-2xl border-2 border-rose-700 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <Icons.Alert />
            </div>
            <div className="flex-1">
              <p className="text-2xl sm:text-3xl font-black leading-tight tracking-wide">⚠️ MEJA {cancelBanner.tableNumber} DIBATALKAN</p>
              <p className="text-sm font-bold mt-1 opacity-90">JANGAN DIMASAK — Order sudah dibatalkan kasir</p>
            </div>
            <button
              onClick={() => setCancelBanner(null)}
              className="text-white/80 hover:text-white text-3xl font-black px-2 leading-none shrink-0"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {undoToast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] w-[90%] max-w-md rounded-2xl shadow-2xl overflow-hidden border-2 ${theme === 'dark' ? 'bg-slate-800 border-emerald-500/50' : 'bg-white border-emerald-500'}`}>
          <div className="flex items-center gap-3 p-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 ${theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
              <Icons.Check />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-bold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>Meja {undoToast.tableNumber} ditandai SIAP</p>
              <p className="text-xs text-slate-500 font-semibold">Tap "Batalkan" jika salah tap</p>
            </div>
            <button
              onClick={undoMarkReady}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-sm shrink-0 transition-all active:scale-95 shadow-md border-2 border-amber-600"
            >
              <Icons.Undo /> Batalkan
            </button>
          </div>
          <div className={`h-1.5 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}>
            <div className="h-full bg-amber-500 animate-[shrink_5s_linear_forwards]" style={{ animation: 'shrink 5s linear forwards' }}></div>
          </div>
        </div>
      )}

      <header className={`px-4 sm:px-6 py-3 flex items-center justify-between shrink-0 border-b-2 transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900/90 backdrop-blur-md border-slate-800' : 'bg-white border-slate-300 shadow-sm'}`}>
        <div className="flex items-center gap-3 min-w-0">
          {tenant?.logo_url ? (
            <img src={tenant.logo_url} className="w-10 h-10 rounded-xl object-cover border-2 border-[var(--primary-color)] shrink-0" alt="" />
          ) : (
            <div className={`w-10 h-10 rounded-xl border-2 border-[var(--primary-color)] flex items-center justify-center font-black shrink-0 text-[var(--primary-color)] ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}>
              {(tenant?.name || 'K').charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <h1 className={`text-base font-black truncate tracking-tight ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>{tenant?.name || 'Dapur'}</h1>
            <p className="text-[10px] font-black text-[var(--primary-color)] uppercase tracking-widest mt-0.5">Kitchen Display</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {wakeLockActive && (
            <div className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 text-[10px] font-black tracking-wide ${theme === 'dark' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`} title="Layar tidak akan mati">
              Layar Aktif
            </div>
          )}
          <span className={`hidden md:block text-2xl font-black tabular-nums tracking-tight ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>{clock}</span>
          
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 text-[11px] font-black tracking-wide ${
            realtimeStatus === 'online' ? (theme === 'dark' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700') :
            realtimeStatus === 'offline' ? (theme === 'dark' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-rose-50 border-rose-200 text-rose-700') :
            (theme === 'dark' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-700')
          }`}>
            <span className={`w-2.5 h-2.5 rounded-full ${
              realtimeStatus === 'online' ? 'bg-emerald-500 animate-pulse' :
              realtimeStatus === 'offline' ? 'bg-rose-500' :
              'bg-amber-500 animate-pulse'
            }`}></span>
            <span className="hidden sm:inline">
              {realtimeStatus === 'online' ? 'Online' : realtimeStatus === 'offline' ? 'Offline' : '...'}
            </span>
          </div>

          {/* 🔥 TOMBOL CETAK LAPORAN BARU */}
          <button
            onClick={handlePrintReport}
            className={`p-2.5 rounded-xl border-2 transition-all active:scale-95 flex items-center justify-center ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white' : 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200 hover:text-slate-900'}`}
            title="Cetak Laporan Dapur Hari Ini"
          >
            <Icons.FileText />
          </button>

          {/* 🔥 TOMBOL TEMA */}
          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-xl border-2 transition-all active:scale-95 flex items-center justify-center ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white' : 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200 hover:text-slate-900'}`}
            title={theme === 'dark' ? 'Ubah ke Mode Terang' : 'Ubah ke Mode Gelap'}
          >
            {theme === 'dark' ? <Icons.Sun /> : <Icons.Moon />}
          </button>

          <button
            onClick={handleSoundToggle}
            className={`p-2.5 rounded-xl border-2 transition-all active:scale-95 ${
              audioUnlocked && soundEnabled
                ? (theme === 'dark' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-emerald-50 border-emerald-300 text-emerald-600')
                : (theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-300 text-slate-500')
            }`}
          >
            {audioUnlocked && soundEnabled ? <Icons.Volume /> : <Icons.VolumeOff />}
          </button>
          <button onClick={toggleFullscreen} className={`p-2.5 rounded-xl border-2 transition-all active:scale-95 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200' : 'bg-slate-100 border-slate-300 text-slate-500 hover:text-slate-800'}`}>
            <Icons.Expand />
          </button>
          <button onClick={handleLogout} className={`p-2.5 rounded-xl border-2 transition-all active:scale-95 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/40' : 'bg-slate-100 border-slate-300 text-slate-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300'}`}>
            <Icons.Logout />
          </button>
        </div>
      </header>

      {!audioUnlocked && (
        <button onClick={initAudio} className="bg-amber-500 hover:bg-amber-600 text-white font-black py-3 px-4 text-center text-sm animate-pulse border-b-2 border-amber-700 tracking-wide">
          🔔 Klik di sini untuk aktifkan suara notifikasi pesanan
        </button>
      )}

      <div className={`px-4 sm:px-6 py-3 border-b-2 flex items-center gap-3 overflow-x-auto shrink-0 transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-300 shadow-sm'}`}>
        {[
          { key: 'new', label: 'Baru', count: pendingOrders.length },
          { key: 'cooking', label: 'Sedang Dimasak', count: cookingOrders.length },
          { key: 'all', label: 'Semua', count: pendingOrders.length + cookingOrders.length },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2.5 rounded-xl font-black text-sm whitespace-nowrap transition-all border-2 active:scale-95 ${
              activeTab === tab.key 
                ? 'bg-[var(--primary-color)] text-white border-[var(--primary-dark)] shadow-md' 
                : (theme === 'dark' ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200')
            }`}
          >
            {tab.label}
            <span className={`ml-2 px-2 py-0.5 rounded-md text-[11px] border ${activeTab === tab.key ? 'bg-black/20 border-transparent' : (theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-slate-200 border-slate-300')}`}>{tab.count}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {displayOrders.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 opacity-50">{activeTab === 'new' ? '📋' : activeTab === 'cooking' ? '🍳' : '✨'}</div>
            <p className={`text-xl font-black mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-800'}`}>
              {activeTab === 'new' ? 'Belum ada pesanan lunas yang masuk' : activeTab === 'cooking' ? 'Tidak ada yang sedang dimasak' : 'Semua bersih!'}
            </p>
            <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>
              {activeTab === 'new' ? 'Pesanan akan muncul setelah pembayaran dikonfirmasi kasir' : 'Pesanan sedang dimasak akan tampil di sini'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 items-start">
            {displayOrders.map(order => {
              const badge = getTimeBadge(order.created_at);
              const isCooking = order.status === 'cooking';
              const totalItems = (order.items || []).reduce((s, i) => s + (i.qty || 0), 0);
              return (
                <div key={order.id} className={`rounded-2xl overflow-hidden flex flex-col border-2 transition-all shadow-sm ${
                  badge?.pulse 
                    ? (theme === 'dark' ? 'bg-slate-800 border-rose-500/80 shadow-md' : 'bg-white border-rose-500 shadow-md') 
                    : (theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300')
                }`}>
                  
                  {/* Card Header */}
                  <div className={`px-5 py-4 flex items-center justify-between border-b-2 ${
                    isCooking 
                      ? (theme === 'dark' ? 'bg-[var(--primary-color)]/10 border-[var(--primary-color)]/20' : 'bg-[var(--primary-light)] border-[var(--primary-color)]/30') 
                      : (theme === 'dark' ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-200')
                  }`}>
                    <div>
                      <p className={`text-[11px] font-black uppercase tracking-widest ${isCooking ? 'text-[var(--primary-color)]' : 'text-amber-500'}`}>{isCooking ? 'Dimasak' : 'Baru'}</p>
                      <p className={`text-3xl font-black leading-tight tracking-tight ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>MEJA {order.table_number}</p>
                      <p className={`text-sm font-bold mt-1 truncate max-w-[140px] ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{order.customer_name || 'Tamu'}</p>
                      <p className={`text-xs font-bold mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{totalItems} ITEM</p>
                    </div>
                    <div className="text-right">
                      {badge && (
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-black text-xs shadow-sm border-2 ${badge.cls} ${badge.pulse ? 'animate-pulse' : ''}`}>
                          <Icons.Clock /> {badge.mins}m
                        </span>
                      )}
                      <p className={`text-[10px] font-black mt-2 tracking-wider ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>#{order.id.slice(0, 6).toUpperCase()}</p>
                      {order.payment_method && (
                        <span className={`inline-block mt-1 text-[10px] font-black px-2 py-0.5 rounded border-2 ${
                          order.payment_method === 'QRIS' 
                            ? (theme === 'dark' ? 'bg-cyan-900/30 text-cyan-400 border-cyan-700/50' : 'bg-cyan-50 text-cyan-700 border-cyan-200')
                            : (theme === 'dark' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-700/50' : 'bg-emerald-50 text-emerald-700 border-emerald-200')
                        }`}>
                          {order.payment_method}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {order.order_note && (
                    <div className={`px-5 py-3 border-l-4 border-amber-500 border-b-2 ${theme === 'dark' ? 'bg-amber-500/10 border-b-slate-700' : 'bg-amber-50 border-b-slate-200'}`}>
                      <p className={`text-xs font-bold ${theme === 'dark' ? 'text-amber-400' : 'text-amber-700'}`}>📝 {order.order_note}</p>
                    </div>
                  )}

                  {/* List Items */}
                  <div className="flex-1 p-5 space-y-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <span className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center text-base font-black shrink-0 ${theme === 'dark' ? 'bg-slate-700/50 border-slate-600 text-slate-100' : 'bg-slate-100 border-slate-300 text-slate-900'}`}>{item.qty}</span>
                        <div className="flex-1 min-w-0 pt-1">
                          <p className={`text-base font-bold leading-tight ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>{item.name}</p>
                          {item.note && (
                            <div className={`mt-2 border-2 px-3 py-2 rounded-lg ${theme === 'dark' ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-300'}`}>
                              <p className={`text-xs font-bold leading-snug ${theme === 'dark' ? 'text-amber-300' : 'text-amber-700'}`}>📝 {item.note}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className={`p-4 pt-3 flex gap-2 border-t-2 ${theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200'}`}>
                    <button onClick={() => handlePrintOrder(order)} className={`flex-1 font-black py-3.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 active:scale-95 border-2 ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600' : 'bg-slate-200 border-slate-300 text-slate-700 hover:bg-slate-300'}`}>
                      <Icons.Printer /> CETAK
                    </button>
                    
                    {isCooking ? (
                      <button onClick={() => markReady(order)} className={`flex-[2] font-black py-3.5 rounded-xl text-base shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 border-2 ${theme === 'dark' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30' : 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100'}`}>
                        <Icons.Check /> SIAP
                      </button>
                    ) : (
                      <button onClick={() => markCooking(order.id)} className={`flex-[2] font-black py-3.5 rounded-xl text-base shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 border-2 ${theme === 'dark' ? 'bg-[var(--primary-color)]/20 border-[var(--primary-color)]/40 text-[var(--primary-color)] hover:bg-[var(--primary-color)]/30' : 'bg-[var(--primary-light)] border-[var(--primary-color)]/50 text-[var(--primary-color)] hover:bg-[var(--primary-light)]'}`}>
                        <Icons.Fire /> MULAI MASAK
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}