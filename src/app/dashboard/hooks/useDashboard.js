'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { extractDominantColor } from '../helpers/color';

export function useDashboard() {
  const router = useRouter();
  const rp = (num) => 'Rp ' + Number(num || 0).toLocaleString('id-ID');

  const [cafeName, setCafeName] = useState('Memuat...');
  const [userEmail, setUserEmail] = useState('');
  const [tenantId, setTenantId] = useState(null);
  const [menus, setMenus] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [settings, setSettings] = useState({ name: '', wa: '', address: '', logo_url: '', qris_string: '', banner_url: '', tax_percentage: 11 });
  const [todayStr, setTodayStr] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [isExpired, setIsExpired] = useState(false);
  const [theme, setTheme] = useState('light');
  const [nowTick, setNowTick] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [realtimeStatus, setRealtimeStatus] = useState('connecting');
  const [toasts, setToasts] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', onConfirm: null, danger: false });
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [menuSearch, setMenuSearch] = useState("");
  const [menuCategoryFilter, setMenuCategoryFilter] = useState("all");
  const [queueFilter, setQueueFilter] = useState("active");

  const audioCtxRef = useRef(null);
  const soundEnabledRef = useRef(true);
  const audioUnlockedRef = useRef(false);
  const prevOrderIdsRef = useRef(null);

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const askConfirm = (title, message, onConfirm, danger = false) => {
    setConfirmDialog({ open: true, title, message, onConfirm, danger });
  };

  const playBeep = () => {
    if (!soundEnabledRef.current || !audioCtxRef.current) return;
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
      playOne(0); playOne(0.22);
    } catch { }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('nexaflow_theme', newTheme);
  };

  const handleSoundToggle = () => {
    if (!audioUnlockedRef.current) {
      try {
        if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        audioCtxRef.current.resume();
        audioUnlockedRef.current = true;
        setAudioUnlocked(true);
        soundEnabledRef.current = true;
        setSoundEnabled(true);
        playBeep();
        showToast('Notifikasi suara aktif', 'success');
      } catch { showToast('Browser tidak mendukung suara', 'error'); }
    } else {
      const n = !soundEnabledRef.current;
      soundEnabledRef.current = n;
      setSoundEnabled(n);
      if (n) { playBeep(); showToast('Suara aktif', 'info'); }
      else showToast('Suara dimatikan', 'info');
    }
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    } catch { }
  };

  const fetchMenus = async (tId) => {
    const { data } = await supabase.from('menus').select('*').eq('tenant_id', tId).order('created_at', { ascending: false });
    if (data) setMenus(data);
  };

  const fetchTables = async (tId) => {
    const { data } = await supabase.from('tables').select('*').eq('tenant_id', tId);
    if (data) {
      const sorted = [...data].sort((a, b) => 
        a.table_number.localeCompare(b.table_number, undefined, { numeric: true, sensitivity: 'base' })
      );
      setTables(sorted);
    }
  };

  const fetchOrders = async (tId) => {
    const { data } = await supabase.from('orders').select('*').eq('tenant_id', tId).order('created_at', { ascending: false });
    if (data) {
      const activeIds = new Set(data.filter(o => ['pending', 'cooking', 'ready'].includes(o.status)).map(o => o.id));
      const prevIds = prevOrderIdsRef.current;
      if (prevIds !== null) {
        const newOnes = [...activeIds].filter(id => !prevIds.has(id));
        if (newOnes.length > 0) {
          playBeep();
          const first = data.find(o => o.id === newOnes[0]);
          if (first) showToast(`Pesanan baru! Meja ${first.table_number} - ${rp(first.total_price)}`, 'info');
        }
      }
      prevOrderIdsRef.current = activeIds;
      setOrders(data);
    }
  };

  useEffect(() => {
    setTheme(localStorage.getItem('nexaflow_theme') || 'light');
  }, []);

  useEffect(() => {
    const h = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', h);
    return () => document.removeEventListener('fullscreenchange', h);
  }, []);

  useEffect(() => {
    const u = () => setNowTick(Date.now());
    u();
    const id = setInterval(u, 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const off = () => setRealtimeStatus('offline');
    const on = () => setRealtimeStatus('connecting');
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  useEffect(() => {
    const now = new Date();
    setTodayStr(now.toDateString());
    setBaseUrl(window.location.origin);

    let channel, presenceChannel, isMounted = true;

    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return router.push('/login');
      if (!isMounted) return;
      setUserEmail(session.user.email);

      const { data: userData } = await supabase.from('users').select('tenant_id, tenants(*)').eq('id', session.user.id).single();

      if (!userData || !userData.tenants) {
        if (session.user.email === 'dinamis.id.shop@gmail.com') return router.push('/admin');
        showToast('Akun belum terhubung ke kafe.', 'error');
        await supabase.auth.signOut();
        return router.push('/login');
      }

      if (userData.tenants.subscription_end_date) {
        if (new Date(userData.tenants.subscription_end_date) < now) setIsExpired(true);
      }

      if (userData && userData.tenants && isMounted) {
        const tId = userData.tenant_id;
        setTenantId(tId);
        setCafeName(userData.tenants.name);
        setSettings({
          name: userData.tenants.name,
          wa: userData.tenants.wa_number || '',
          address: userData.tenants.address || '',
          logo_url: userData.tenants.logo_url || '',
          qris_string: userData.tenants.qris_string || '',
          banner_url: userData.tenants.banner_url || '',
          tax_percentage: userData.tenants.tax_percentage !== null ? userData.tenants.tax_percentage : 11,
        });

        if (userData.tenants.banner_url) extractDominantColor(userData.tenants.banner_url);
        else if (userData.tenants.logo_url) extractDominantColor(userData.tenants.logo_url);

        await Promise.all([fetchMenus(tId), fetchTables(tId), fetchOrders(tId)]);

        channel = supabase.channel('realtime-orders-' + Date.now())
          .on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: `tenant_id=eq.${tId}` }, () => fetchOrders(tId))
          .subscribe((s) => {
            if (s === 'SUBSCRIBED') setRealtimeStatus('online');
            else if (s === 'CHANNEL_ERROR' || s === 'TIMED_OUT' || s === 'CLOSED') setRealtimeStatus('offline');
            else setRealtimeStatus('connecting');
          });

        presenceChannel = supabase.channel('online-rooms', { config: { presence: { key: session.user.id } } });
        presenceChannel.subscribe(async (s) => {
          if (s === 'SUBSCRIBED') await presenceChannel.track({ tenant_id: tId, user_email: session.user.email, online_at: new Date().toISOString() });
        });
      }
    };

    fetchData();
    return () => {
      isMounted = false;
      if (channel) supabase.removeChannel(channel);
      if (presenceChannel) supabase.removeChannel(presenceChannel);
    };
  }, [router]);

  const handleLogout = () => askConfirm('Keluar dari Dashboard', 'Yakin ingin logout?', async () => {
    await supabase.auth.signOut();
    router.push('/login');
  }, true);

  const handleImageUpload = async (e, type, setUploading, setMenuFn) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const compressed = await new Promise((resolve, reject) => {
        const r = new FileReader();
        r.readAsDataURL(file);
        r.onload = (ev) => {
          const img = new Image();
          img.src = ev.target.result;
          img.onload = () => {
            const c = document.createElement('canvas');
            let w = img.width, h = img.height;
            const M = type === 'banner' ? 1200 : 800;
            if (w > h) { if (w > M) { h *= M / w; w = M; } } else { if (h > M) { w *= M / h; h = M; } }
            c.width = w; c.height = h;
            c.getContext('2d').drawImage(img, 0, 0, w, h);
            c.toBlob((b) => resolve(new File([b], `img-${Date.now()}.jpg`, { type: 'image/jpeg' })), 'image/jpeg', 0.8);
          };
          img.onerror = reject;
        };
        r.onerror = reject;
      });
      const fileName = `${tenantId}-${type}-${Date.now()}.jpg`;
      const bucket = (type === 'logo' || type === 'banner') ? 'cafe-logos' : 'menu-images';
      const { error: upErr } = await supabase.storage.from(bucket).upload(fileName, compressed, { cacheControl: '3600', upsert: false });
      if (upErr) throw upErr;
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
      if (type === 'logo') setSettings(p => ({ ...p, logo_url: urlData.publicUrl }));
      else if (type === 'banner') { setSettings(p => ({ ...p, banner_url: urlData.publicUrl })); extractDominantColor(urlData.publicUrl); }
      else if (setMenuFn) setMenuFn(p => ({ ...p, image_url: urlData.publicUrl }));
      showToast('Foto berhasil diupload', 'success');
    } catch (err) { showToast('Gagal upload: ' + err.message, 'error'); }
    setUploading(false);
  };

  const handleUpdateOrderStatus = async (id, status) => {
    const u = { status };
    if (status === 'completed') u.payment_status = 'paid';
    await supabase.from('orders').update(u).eq('id', id);
    fetchOrders(tenantId);
  };

  const handleCancelOrder = (id) => askConfirm('Tolak Pesanan', 'Pesanan akan dibatalkan. Lanjutkan?', async () => {
    await supabase.from('orders').update({ status: 'cancelled' }).eq('id', id);
    fetchOrders(tenantId);
    showToast('Pesanan ditolak', 'warning');
  }, true);

  const handleDeleteMenu = (id) => askConfirm('Hapus Menu', 'Menu akan dihapus permanen. Lanjutkan?', async () => {
    await supabase.from('menus').delete().eq('id', id);
    fetchMenus(tenantId);
    showToast('Menu dihapus', 'success');
  }, true);

  const handleDeleteTable = (id) => askConfirm('Hapus Meja', 'Meja akan dihapus. Lanjutkan?', async () => {
    await supabase.from('tables').delete().eq('id', id);
    fetchTables(tenantId);
    showToast('Meja dihapus', 'success');
  }, true);

  const toggleMenuStatus = async (menu) => {
    const ns = menu.status === 'available' ? 'soldout' : 'available';
    const { error } = await supabase.from('menus').update({ status: ns }).eq('id', menu.id);
    if (error) { showToast('Gagal ubah status: ' + error.message, 'error'); return; }
    fetchMenus(tenantId);
    showToast(ns === 'available' ? 'Menu tersedia' : 'Menu ditandai habis', 'success');
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    await supabase.from('tenants').update({
      name: settings.name, wa_number: settings.wa, address: settings.address,
      logo_url: settings.logo_url, qris_string: settings.qris_string,
      banner_url: settings.banner_url, tax_percentage: settings.tax_percentage,
    }).eq('id', tenantId);
    setCafeName(settings.name);
    showToast('Pengaturan disimpan', 'success');
  };

  const handleSaveMenu = async (currentMenu, resetFn) => {
    const isEdit = !!currentMenu.id;
    const payload = {
      tenant_id: tenantId, name: currentMenu.name, category: currentMenu.category,
      price: parseFloat(currentMenu.price), description: currentMenu.desc,
      status: currentMenu.status, image_url: currentMenu.image_url,
    };
    if (isEdit) await supabase.from('menus').update(payload).eq('id', currentMenu.id);
    else await supabase.from('menus').insert([payload]);
    resetFn({ id: null, name: '', category: 'makanan', price: '', desc: '', status: 'available', image_url: '' });
    fetchMenus(tenantId);
    showToast(isEdit ? 'Menu diperbarui' : 'Menu ditambahkan', 'success');
  };

  const handleAddTable = async (num, resetFn) => {
    if (!num) return;
    await supabase.from('tables').insert([{ tenant_id: tenantId, table_number: num }]);
    resetFn('');
    fetchTables(tenantId);
    showToast('Meja ditambahkan', 'success');
  };

  const openKitchenLink = async (setKitchenModal) => {
    try {
      const { data, error } = await supabase.from('tenants').select('kitchen_pin').eq('id', tenantId).single();
      if (error) { showToast('Kolom kitchen_pin belum ada.', 'error'); return; }
      const pin = data?.kitchen_pin || '1234';
      setKitchenModal({ open: true, url: `${baseUrl}/kitchen/${tenantId}?pin=${pin}`, pin });
    } catch (e) { showToast('Error: ' + e.message, 'error'); }
  };

  // --- FUNGSI DOWNLOAD QR DENGAN GAMBAR & NAMA KAFE (CANVAS) ---
  const handleDownloadQR = async (table) => {
    if (!table || !table.table_number) return;
    
    try {
      showToast('Menyiapkan gambar QR...', 'info');
      
      const orderUrl = `${baseUrl}/order?tenant=${tenantId}&table=${table.table_number}`;
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(orderUrl)}`;
      
      // 1. Siapkan Canvas ukuran 1000x1300 (Beri ruang bawah untuk teks)
      const canvas = document.createElement('canvas');
      canvas.width = 1000;
      canvas.height = 1300;
      const ctx = canvas.getContext('2d');

      // 2. Warnai Background Putih
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 3. Gambar Logo Kafe (Jika ada)
      if (settings.logo_url) {
        const logoImg = new Image();
        logoImg.crossOrigin = 'Anonymous';
        logoImg.src = settings.logo_url;
        await new Promise((resolve) => {
          logoImg.onload = () => {
            // Gambar logo di tengah atas (kotak 200x200)
            ctx.drawImage(logoImg, 400, 80, 200, 200); 
            resolve();
          };
          logoImg.onerror = resolve; // Lanjut meski logo gagal dimuat
        });
      }

      // 4. Tulis Nama Kafe
      ctx.fillStyle = '#2A1F17'; // Warna Espresso gelap
      ctx.font = 'bold 50px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(settings.name.toUpperCase(), 500, 350);

      // 5. Gambar QR Code dari API
      const qrImg = new Image();
      qrImg.crossOrigin = 'Anonymous';
      qrImg.src = qrApiUrl;
      
      await new Promise((resolve, reject) => {
        qrImg.onload = () => {
          // Gambar QR di tengah (kotak 700x700)
          ctx.drawImage(qrImg, 150, 400, 700, 700);
          resolve();
        };
        qrImg.onerror = reject;
      });

      // 6. Tulis Nomor Meja (di bawah QR)
      ctx.fillStyle = '#2A1F17';
      ctx.font = 'bold 70px Arial';
      ctx.fillText(`MEJA ${table.table_number}`, 500, 1200);

      // 7. Tulis Petunjuk Kecil
      ctx.fillStyle = '#5C4B3E';
      ctx.font = '30px Arial';
      ctx.fillText('Scan untuk memesan menu', 500, 1260);

      // 8. Konversi Canvas ke Blob dan Unduh
      canvas.toBlob((blob) => {
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `QR_Meja_${table.table_number}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
        
        showToast(`QR Meja ${table.table_number} berhasil diunduh`, 'success');
      }, 'image/png');

    } catch (error) {
      console.error(error);
      showToast('Gagal membuat gambar QR.', 'error');
    }
  };

  const displayOrders = orders.filter(o => 
    queueFilter === "all" ? true : 
    queueFilter === "active" ? ["pending", "cooking", "ready"].includes(o.status) : 
    o.status === "completed"
  );

  return {
    cafeName, userEmail, tenantId, menus, orders, tables, settings,
    todayStr, baseUrl, isExpired, theme, nowTick, soundEnabled, audioUnlocked,
    realtimeStatus, toasts, confirmDialog, isFullscreen,
    setTheme, setSettings, setMenus, setOrders, setTables, setToasts, setConfirmDialog,
    rp, showToast, askConfirm,
    toggleTheme, handleSoundToggle, toggleFullscreen, handleLogout,
    handleImageUpload, handleUpdateOrderStatus, handleCancelOrder,
    handleDeleteMenu, handleDeleteTable, toggleMenuStatus,
    handleSaveSettings, handleSaveMenu, handleAddTable, openKitchenLink,
    handleDownloadQR,
    fetchMenus, fetchOrders, fetchTables,
    menuSearch, setMenuSearch, menuCategoryFilter, setMenuCategoryFilter,
    queueFilter, setQueueFilter, displayOrders,
  };
}