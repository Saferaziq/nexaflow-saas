'use client';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';

const Icons = {
  Clock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polyline points="20 6 9 17 4 12"/></svg>,
  Fire: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>,
  Volume: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>,
  VolumeOff: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>,
  Expand: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>,
  Logout: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Lock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Undo: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>,
  Alert: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Sun: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
};

export default function KitchenClient({ tenantId }) {
  const [authMode, setAuthMode] = useState('loading');
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [verifying, setVerifying] = useState(false);

  const [tenant, setTenant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [realtimeStatus, setRealtimeStatus] = useState('connecting');
  const [nowTick, setNowTick] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState('new');
  const [isFullscreen, setIsFullscreen] = useState(false);

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
    const onVisibility = () => { if (document.visibilityState === 'visible') requestWakeLock(); };
    document.addEventListener('visibilitychange', onVisibility);
    return () => { document.removeEventListener('visibilitychange', onVisibility); releaseWakeLock(); };
  }, [authMode]);

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
    const { data } = await supabase.from('orders').select('*').eq('tenant_id', tenantId).order('created_at', { ascending: true });
    if (data) {
      const activeIds = new Set(data.filter(o => ['pending', 'cooking'].includes(o.status)).map(o => o.id));
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
      const { data: tenantData } = await supabase.from('tenants').select('name, logo_url').eq('id', tenantId).single();
      if (tenantData) setTenant(tenantData);
    } catch {}
    await fetchOrders();
    if (channelRef.current) supabase.removeChannel(channelRef.current);
    channelRef.current = supabase.channel('kitchen-' + tenantId + '-' + Date.now())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: `tenant_id=eq.${tenantId}` }, () => fetchOrders())
      .subscribe(status => {
        if (status === 'SUBSCRIBED') setRealtimeStatus('online');
        else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') setRealtimeStatus('offline');
        else setRealtimeStatus('connecting');
      });
  };

  const verifyPin = async (pin) => {
    if (!tenantId || !pin) return false;
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
        if (ok) {
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
        if (ok) { await loadData(); setAuthMode('ready'); return; }
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
    if (ok) {
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
    await supabase.from('orders').update({ status: 'cooking' }).eq('id', orderId);
    fetchOrders();
  };

  const markReady = async (order) => {
    const previousStatus = order.status;
    await supabase.from('orders').update({ status: 'ready' }).eq('id', order.id);
    fetchOrders();
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    setUndoToast({ orderId: order.id, tableNumber: order.table_number, previousStatus });
    undoTimerRef.current = setTimeout(() => setUndoToast(null), 5000);
  };

  const undoMarkReady = async () => {
    if (!undoToast) return;
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    await supabase.from('orders').update({ status: undoToast.previousStatus }).eq('id', undoToast.orderId);
    fetchOrders();
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

  const pendingOrders = orders.filter(o => o.status === 'pending').sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  const cookingOrders = orders.filter(o => o.status === 'cooking').sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  const displayOrders = activeTab === 'new' ? pendingOrders : activeTab === 'cooking' ? cookingOrders : [...pendingOrders, ...cookingOrders].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  const getTimeBadge = (createdAt) => {
    if (!nowTick) return null;
    const mins = Math.floor((nowTick - new Date(createdAt).getTime()) / 60000);
    if (mins < 0) return null;
    if (mins < 5) return { mins, cls: 'bg-slate-700 text-slate-200', pulse: false };
    if (mins < 15) return { mins, cls: 'bg-amber-500 text-white', pulse: false };
    return { mins, cls: 'bg-rose-500 text-white', pulse: true };
  };

  const clock = nowTick ? new Date(nowTick).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '';

  if (authMode === 'loading') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-bold">Memuat layar dapur...</p>
        </div>
      </div>
    );
  }

  if (authMode === 'pin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 text-white">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 max-w-md w-full shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/30">
              <Icons.Lock />
            </div>
            <h1 className="text-2xl font-black mb-2">Layar Dapur</h1>
            <p className="text-sm text-slate-400">Masukkan PIN 4 digit</p>
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
            className="w-full bg-slate-950 border-2 border-slate-700 focus:border-orange-500 rounded-2xl text-center text-5xl font-black py-6 tracking-[0.5em] text-white outline-none transition-all"
            placeholder="••••"
          />
          {pinError && <p className="text-rose-400 text-sm font-bold text-center mt-3">{pinError}</p>}
          {verifying && <p className="text-slate-400 text-sm text-center mt-3">Memverifikasi...</p>}
          <button
            onClick={submitPin}
            disabled={pinInput.length !== 4 || verifying}
            className="w-full mt-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl text-lg shadow-lg shadow-orange-500/30 transition-all"
          >
            {verifying ? 'Memverifikasi...' : 'Masuk'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col relative">
      {cancelBanner && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] w-[90%] max-w-2xl bg-rose-600 text-white px-6 py-5 rounded-2xl shadow-[0_8px_32px_rgba(244,63,94,0.6)] border-4 border-rose-400 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <Icons.Alert />
            </div>
            <div className="flex-1">
              <p className="text-2xl sm:text-3xl font-black leading-tight">⚠️ MEJA {cancelBanner.tableNumber} DIBATALKAN</p>
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
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[200] w-[90%] max-w-md bg-slate-800 border-2 border-emerald-500 rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex items-center gap-3 p-4">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center shrink-0">
              <Icons.Check />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-white">Meja {undoToast.tableNumber} ditandai SIAP</p>
              <p className="text-xs text-slate-400">Tap "Batalkan" jika salah tap</p>
            </div>
            <button
              onClick={undoMarkReady}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-black text-sm shrink-0 transition-all active:scale-95"
            >
              <Icons.Undo /> Batalkan
            </button>
          </div>
          <div className="h-1 bg-slate-700">
            <div className="h-full bg-amber-500 animate-[shrink_5s_linear_forwards]" style={{ animation: 'shrink 5s linear forwards' }}></div>
          </div>
        </div>
      )}

      <header className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          {tenant?.logo_url ? (
            <img src={tenant.logo_url} className="w-10 h-10 rounded-xl object-cover ring-2 ring-orange-500/30 shrink-0" alt="" />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center font-black text-white shrink-0">
              {(tenant?.name || 'K').charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-base font-black truncate">{tenant?.name || 'Dapur'}</h1>
            <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Kitchen Display</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {wakeLockActive && (
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold" title="Layar tidak akan mati">
              <Icons.Sun /> Layar Aktif
            </div>
          )}
          <span className="hidden md:block text-3xl font-black tabular-nums">{clock}</span>
          <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[11px] font-bold ${
            realtimeStatus === 'online' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
            realtimeStatus === 'offline' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' :
            'bg-amber-500/10 border-amber-500/30 text-amber-400'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              realtimeStatus === 'online' ? 'bg-emerald-500 animate-pulse' :
              realtimeStatus === 'offline' ? 'bg-rose-500' :
              'bg-amber-500 animate-pulse'
            }`}></span>
            <span className="hidden sm:inline">
              {realtimeStatus === 'online' ? 'Online' : realtimeStatus === 'offline' ? 'Offline' : '...'}
            </span>
          </div>
          <button
            onClick={handleSoundToggle}
            className={`p-2.5 rounded-xl border transition-all ${
              audioUnlocked && soundEnabled
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {audioUnlocked && soundEnabled ? <Icons.Volume /> : <Icons.VolumeOff />}
          </button>
          <button onClick={toggleFullscreen} className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white transition-all">
            <Icons.Expand />
          </button>
          <button onClick={handleLogout} className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 transition-all">
            <Icons.Logout />
          </button>
        </div>
      </header>

      {!audioUnlocked && (
        <button onClick={initAudio} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 text-center text-sm animate-pulse">
          🔔 Klik di sini untuk aktifkan suara notifikasi
        </button>
      )}

      <div className="px-4 sm:px-6 py-3 bg-slate-900/50 border-b border-slate-800 flex items-center gap-2 overflow-x-auto shrink-0">
        {[
          { key: 'new', label: 'Baru', count: pendingOrders.length },
          { key: 'cooking', label: 'Sedang Dimasak', count: cookingOrders.length },
          { key: 'all', label: 'Semua', count: pendingOrders.length + cookingOrders.length },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
              activeTab === tab.key ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {tab.label}
            <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] ${activeTab === tab.key ? 'bg-white/20' : 'bg-slate-900'}`}>{tab.count}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {displayOrders.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">{activeTab === 'new' ? '📋' : activeTab === 'cooking' ? '🍳' : '✨'}</div>
            <p className="text-xl font-black mb-1">
              {activeTab === 'new' ? 'Belum ada pesanan baru' : activeTab === 'cooking' ? 'Tidak ada yang sedang dimasak' : 'Semua bersih!'}
            </p>
            <p className="text-sm text-slate-500">
              {activeTab === 'new' ? 'Pesanan baru akan muncul otomatis' : 'Pesanan sedang dimasak akan tampil di sini'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {displayOrders.map(order => {
              const badge = getTimeBadge(order.created_at);
              const isCooking = order.status === 'cooking';
              const totalItems = (order.items || []).reduce((s, i) => s + (i.qty || 0), 0);
              return (
                <div key={order.id} className={`rounded-2xl overflow-hidden flex flex-col ${
                  badge?.pulse ? 'bg-slate-800 border-2 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.4)]' : 'bg-slate-800 border-2 border-slate-700'
                }`}>
                  <div className={`px-4 py-3 flex items-center justify-between ${isCooking ? 'bg-orange-600' : 'bg-amber-500'}`}>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-80">{isCooking ? 'Dimasak' : 'Baru'}</p>
                      <p className="text-2xl font-black leading-tight text-white">MEJA {order.table_number}</p>
                      <p className="text-sm font-black text-white/95 mt-0.5 truncate max-w-[140px]">{order.customer_name || 'Tamu'}</p>
                      <p className="text-xs font-bold text-white/80 mt-0.5">{totalItems} ITEM</p>
                    </div>
                    <div className="text-right">
                      {badge && (
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg font-black text-xs ${badge.cls} ${badge.pulse ? 'animate-pulse' : ''}`}>
                          <Icons.Clock /> {badge.mins}m
                        </span>
                      )}
                      <p className="text-[10px] font-bold opacity-70 mt-1">#{order.id.slice(0, 6).toUpperCase()}</p>
                    </div>
                  </div>
                  
                  {order.order_note && (
                    <div className="bg-amber-900/40 border-l-4 border-amber-500 px-4 py-2">
                      <p className="text-xs font-black text-amber-300">📝 {order.order_note}</p>
                    </div>
                  )}

                  <div className="flex-1 p-4 space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-base font-black shrink-0">{item.qty}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-lg font-black leading-tight">{item.name}</p>
                          {item.note && (
                            <div className="mt-1.5 bg-amber-500/25 border-l-4 border-amber-400 px-2.5 py-1.5 rounded-r">
                              <p className="text-sm font-black text-amber-200 leading-snug">📝 {item.note}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 pt-0">
                    {isCooking ? (
                      <button onClick={() => markReady(order)} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-xl text-lg shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 active:scale-95">
                        <Icons.Check /> SIAP
                      </button>
                    ) : (
                      <button onClick={() => markCooking(order.id)} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black py-4 rounded-xl text-lg shadow-lg shadow-amber-500/30 transition-all flex items-center justify-center gap-2 active:scale-95">
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