'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
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
  const [settings, setSettings] = useState({ 
    name: '', wa: '', address: '', logo_url: '', qris_string: '', 
    banner_url: '', tax_percentage: 11, notify_order_ready: true,
    is_pay_first: true, business_type: 'kafe'
  });
  const [isOpen, setIsOpen] = useState(true);
  const [todayStr, setTodayStr] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [isExpired, setIsExpired] = useState(false);
  const [isSuspended, setIsSuspended] = useState(false);
  const [theme, setTheme] = useState('light');
  const [nowTick, setNowTick] = useState(0);
  const [realtimeStatus, setRealtimeStatus] = useState('connecting');
  const [toasts, setToasts] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', onConfirm: null, danger: false });
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [cancelModal, setCancelModal] = useState({ open: false, orderId: null, reason: '' });

  const [menuSearch, setMenuSearch] = useState("");
  const [menuCategoryFilter, setMenuCategoryFilter] = useState("all");
  const [queueFilter, setQueueFilter] = useState("unpaid");

  const [reportMode, setReportMode] = useState('daily');
  const [reportDateStr, setReportDateStr] = useState('');
  const [reportMonth, setReportMonth] = useState(new Date().getMonth());
  const [reportYear, setReportYear] = useState(new Date().getFullYear());
  const [reportStartDateStr, setReportStartDateStr] = useState('');
  const [reportEndDateStr, setReportEndDateStr] = useState('');

  const audioCtxRef = useRef(null);
  const prevOrderIdsRef = useRef(null);
  const beepIntervalRef = useRef(null);
  const hasPendingOrderRef = useRef(false);
  
  const ordersRef = useRef([]);
  ordersRef.current = orders;
  const menusRef = useRef([]);
  menusRef.current = menus;
  const realtimeDebounceRef = useRef(null);

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const askConfirm = (title, message, onConfirm, danger = false) => {
    setConfirmDialog({ open: true, title, message, onConfirm, danger });
  };

  const unlockAudio = () => {
    if (!audioCtxRef.current) {
      try { audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)(); } catch { }
    }
    if (audioCtxRef.current?.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    setAudioUnlocked(true);
  };

  const playBeep = () => {
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
      playOne(0); playOne(0.22);
    } catch { }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('nexaflow_theme', newTheme);
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
    if (!tId) return;
    const cutoff = new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString();
    
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('tenant_id', tId)
      .or(`status.in.(pending,cooking,ready),created_at.gte.${cutoff}`)
      .order('created_at', { ascending: false });
    
    if (data) {
      const waitingPaymentIds = new Set(data.filter(o => 
        o.status === 'pending' && 
        ['WAITING_QRIS', 'WAITING_CASH'].includes(o.payment_status)
      ).map(o => o.id));
      
      const prevIds = prevOrderIdsRef.current;
      if (prevIds !== null) {
        const newOnes = [...waitingPaymentIds].filter(id => !prevIds.has(id));
        if (newOnes.length > 0) {
          playBeep();
          const first = data.find(o => o.id === newOnes[0]);
          if (first) showToast(`Pesanan baru menunggu bayar! Meja ${first.table_number} - ${rp(first.total_price)}`, 'info');
        }
      }
      prevOrderIdsRef.current = waitingPaymentIds;
      setOrders(data);
    }
  };

  const fetchTenantStatus = async (tId) => {
    const { data } = await supabase.from('tenants').select('is_open, is_pay_first, is_active').eq('id', tId).single();
    if (data) {
      if (data.is_open !== undefined) setIsOpen(data.is_open !== false);
      if (data.is_pay_first !== undefined) setSettings(prev => ({ ...prev, is_pay_first: data.is_pay_first }));
      if (data.is_active !== undefined) setIsSuspended(data.is_active === false);
    }
  };

  useEffect(() => {
    hasPendingOrderRef.current = orders.some(o => 
      o.status === 'pending' && 
      ['WAITING_QRIS', 'WAITING_CASH'].includes(o.payment_status)
    );
  }, [orders]);

  useEffect(() => {
    beepIntervalRef.current = setInterval(() => {
      if (hasPendingOrderRef.current) playBeep();
    }, 10000);
    return () => {
      if (beepIntervalRef.current) { clearInterval(beepIntervalRef.current); beepIntervalRef.current = null; }
    };
  }, []);

  useEffect(() => {
    setTheme(localStorage.getItem('nexaflow_theme') || 'light');
    const today = new Date().toISOString().split('T')[0];
    setReportDateStr(today);
    setReportStartDateStr(today);
    setReportEndDateStr(today);
  }, []);

  useEffect(() => {
    const h = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', h);
    return () => document.removeEventListener('fullscreenchange', h);
  }, []);

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
    let pollingInterval = null;

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

      if (userData.tenants.is_active === false) {
        setIsSuspended(true);
        return;
      }

      if (userData && userData.tenants && isMounted) {
        const tId = userData.tenant_id;
        setTenantId(tId);
        setCafeName(userData.tenants.name);
        setIsOpen(userData.tenants.is_open !== false);
        setSettings({
          name: userData.tenants.name,
          wa: userData.tenants.wa_number || '',
          address: userData.tenants.address || '',
          logo_url: userData.tenants.logo_url || '',
          qris_string: userData.tenants.qris_string || '',
          banner_url: userData.tenants.banner_url || '',
          tax_percentage: userData.tenants.tax_percentage !== null ? userData.tenants.tax_percentage : 11,
          notify_order_ready: userData.tenants.notify_order_ready !== false,
          is_pay_first: userData.tenants.is_pay_first !== false,
          business_type: userData.tenants.business_type || 'kafe', // 🔥 TAMBAHAN
        });

        if (userData.tenants.banner_url) extractDominantColor(userData.tenants.banner_url);
        else if (userData.tenants.logo_url) extractDominantColor(userData.tenants.logo_url);

        await Promise.all([fetchMenus(tId), fetchTables(tId), fetchOrders(tId)]);

        channel = supabase.channel('realtime-orders-' + Date.now())
          .on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: `tenant_id=eq.${tId}` }, (payload) => {
            if (payload.eventType === 'INSERT') {
              fetchOrders(tId);
              return;
            }
            if (realtimeDebounceRef.current) clearTimeout(realtimeDebounceRef.current);
            realtimeDebounceRef.current = setTimeout(() => fetchOrders(tId), 600);
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'menus', filter: `tenant_id=eq.${tId}` }, () => fetchMenus(tId))
          .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'tenants', filter: `id=eq.${tId}` }, (payload) => {
            if (payload.new.is_open !== undefined) setIsOpen(payload.new.is_open);
            if (payload.new.is_pay_first !== undefined) setSettings(prev => ({ ...prev, is_pay_first: payload.new.is_pay_first }));
            if (payload.new.is_active !== undefined) setIsSuspended(payload.new.is_active === false);
            if (payload.new.business_type !== undefined) setSettings(prev => ({ ...prev, business_type: payload.new.business_type })); // 🔥 TAMBAHAN
          })
          .subscribe((s) => {
            if (s === 'SUBSCRIBED') setRealtimeStatus('online');
            else if (s === 'CHANNEL_ERROR' || s === 'TIMED_OUT' || s === 'CLOSED') setRealtimeStatus('offline');
            else setRealtimeStatus('connecting');
          });

        presenceChannel = supabase.channel('online-rooms');
        presenceChannel.subscribe(async (s) => {
          if (s === 'SUBSCRIBED') {
            try {
              await presenceChannel.track({ 
                tenant_id: tId, 
                user_email: session.user.email, 
                online_at: new Date().toISOString() 
              });
            } catch (err) {
              console.error('[Kasir Presence] Track Error:', err);
            }
          }
        });

        pollingInterval = setInterval(() => {
          fetchOrders(tId);
          fetchTenantStatus(tId);
        }, 5000);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
      if (pollingInterval) clearInterval(pollingInterval);
      if (realtimeDebounceRef.current) clearTimeout(realtimeDebounceRef.current);
      if (channel) supabase.removeChannel(channel);
      if (presenceChannel) supabase.removeChannel(presenceChannel);
    };
  }, [router]);

  const handleToggleCafeStatus = async () => {
    const newStatus = !isOpen;
    const { error } = await supabase.from('tenants').update({ is_open: newStatus }).eq('id', tenantId);
    if (error) { showToast('Gagal ubah status: ' + error.message, 'error'); return; }
    setIsOpen(newStatus);
    showToast(newStatus ? 'Kafe sekarang BUKA' : 'Kafe sekarang TUTUP', newStatus ? 'success' : 'warning');
  };

  const handleTogglePayFirst = async () => {
    if (!tenantId) return;
    const newStatus = !settings.is_pay_first;
    const { error } = await supabase.from('tenants').update({ is_pay_first: newStatus }).eq('id', tenantId);
    if (error) { showToast('Gagal ubah pengaturan: ' + error.message, 'error'); return; }
    setSettings(prev => ({ ...prev, is_pay_first: newStatus }));
    showToast(newStatus ? 'Sistem Wajib Bayar Dulu (Pay First) AKTIF' : 'Sistem Wajib Bayar Dulu (Pay First) NONAKTIF', newStatus ? 'success' : 'warning');
  };

  const handleConfirmPayment = (orderId) => {
    askConfirm('Konfirmasi Pembayaran', 'Pastikan uang sudah diterima (Cash) atau mutasi sudah masuk (QRIS). Lanjutkan?', async () => {
      const prevOrder = ordersRef.current.find(o => o.id === orderId);
      if (!prevOrder) return;
      
      setOrders(prev => prev.map(o => 
        o.id === orderId ? { ...o, payment_status: 'PAID', paid_at: new Date().toISOString() } : o
      ));

      const { error } = await supabase.from('orders').update({
        payment_status: 'PAID',
        paid_at: new Date().toISOString(),
      }).eq('id', orderId);

      if (error) {
        setOrders(prev => prev.map(o => 
          o.id === orderId ? { ...o, payment_status: prevOrder.payment_status, paid_at: prevOrder.paid_at } : o
        ));
        showToast('Gagal konfirmasi: ' + error.message, 'error');
        return;
      }
      
      showToast('Pembayaran dikonfirmasi. Pesanan diteruskan ke dapur!', 'success');
    }, false);
  };

  const getLocalDateStr = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' }); 
  };

  const reportData = useMemo(() => {
    let start = '', end = '', label = '';

    if (reportMode === 'daily') {
      start = reportDateStr;
      end = reportDateStr;
      label = new Date(reportDateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    } else if (reportMode === 'weekly') {
      const today = new Date();
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 6);
      start = weekAgo.toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });
      end = today.toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });
      label = `7 Hari Terakhir (${weekAgo.toLocaleDateString('id-ID')} - ${today.toLocaleDateString('id-ID')})`;
    } else if (reportMode === 'monthly') {
      const lastDay = new Date(reportYear, reportMonth + 1, 0).getDate();
      start = `${reportYear}-${String(reportMonth + 1).padStart(2, '0')}-01`;
      end = `${reportYear}-${String(reportMonth + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
      label = `${['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'][reportMonth]} ${reportYear}`;
    } else {
      start = reportStartDateStr;
      end = reportEndDateStr;
      label = `${new Date(start).toLocaleDateString('id-ID')} - ${new Date(end).toLocaleDateString('id-ID')}`;
    }

    const cancelledFiltered = orders.filter(o => {
      if (o.status !== 'cancelled') return false;
      const localDate = getLocalDateStr(o.created_at);
      return localDate >= start && localDate <= end;
    });

    const filtered = orders.filter(o => {
      if (o.status === 'cancelled') return false;
      const localDate = getLocalDateStr(o.created_at);
      return localDate >= start && localDate <= end;
    });

    let revenue = 0;
    let totalItems = 0;
    let revenueQRIS = 0;
    let revenueCash = 0;
    let countQRIS = 0;
    let countCash = 0;
    const statusCount = { pending: 0, cooking: 0, ready: 0, completed: 0, cancelled: 0 };
    const menuMap = new Map();

    filtered.forEach(o => {
      const amount = Number(o.total_price || 0);
      revenue += amount;

      const method = String(o.payment_method || 'CASH').toUpperCase();
      if (method === 'QRIS') {
        revenueQRIS += amount;
        countQRIS++;
      } else {
        revenueCash += amount;
        countCash++;
      }

      if (statusCount.hasOwnProperty(o.status)) statusCount[o.status]++;

      if (o.items && Array.isArray(o.items)) {
        o.items.forEach(item => {
          totalItems += Number(item.qty || 0);
          const existing = menuMap.get(item.name) || { qty: 0, revenue: 0 };
          menuMap.set(item.name, {
            qty: existing.qty + Number(item.qty || 0),
            revenue: existing.revenue + (Number(item.price || 0) * Number(item.qty || 0))
          });
        });
      }
    });

    const topMenus = Array.from(menuMap.entries()).sort((a, b) => b[1].qty - a[1].qty).slice(0, 5);
    const totalOrders = filtered.length;
    const avgOrder = totalOrders > 0 ? revenue / totalOrders : 0;

    const reportStats = { 
      totalOrders, revenue, avgOrder, totalItems,
      revenueQRIS, revenueCash, countQRIS, countCash,
      statusCount,
      cancelledCount: cancelledFiltered.length,
      cancelledOrders: cancelledFiltered
    };

    const chartData = [];
    let maxChartRev = 0;
    let totalChartRev = 0;
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dStr = d.toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' }); 
      
      const dayOrders = orders.filter(o => o.status !== 'cancelled' && getLocalDateStr(o.created_at) === dStr);
      const dayRev = dayOrders.reduce((sum, o) => sum + Number(o.total_price || 0), 0);
      
      if (dayRev > maxChartRev) maxChartRev = dayRev;
      totalChartRev += dayRev;
      chartData.push({
        label: d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
        revenue: dayRev
      });
    }

    return { reportStats, topMenus, chartData, maxChartRev, totalChartRev, label };
  }, [orders, reportMode, reportDateStr, reportMonth, reportYear, reportStartDateStr, reportEndDateStr]);

  const handleExportCSV = () => {
    const { reportStats, topMenus, label } = reportData;
    let csv = `Laporan: ${label}\n\n`;
    csv += `Total Pesanan,${reportStats.totalOrders}\n`;
    csv += `Total Omset,${reportStats.revenue}\n`;
    csv += `Rata-rata/Order,${reportStats.avgOrder}\n`;
    csv += `Item Terjual,${reportStats.totalItems}\n\n`;
    csv += `Pendapatan QRIS,${reportStats.revenueQRIS} (${reportStats.countQRIS} transaksi)\n`;
    csv += `Pendapatan Cash,${reportStats.revenueCash} (${reportStats.countCash} transaksi)\n\n`;
    csv += `Menu Terlaris,Qty,Omset\n`;
    topMenus.forEach(([name, data]) => {
      csv += `"${name}",${data.qty},${data.revenue}\n`;
    });

    csv += `\nPesanan Ditolak,Meja,Nama,Alasan\n`;
    reportStats.cancelledOrders.forEach(o => {
      csv += `"${o.id.slice(0,6)}","${o.table_number}","${o.customer_name}","${o.order_note || 'Tanpa Alasan'}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Laporan_${label.replace(/\s/g, '_')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Laporan CSV berhasil diunduh', 'success');
  };

  const handlePrintReport = async () => {
    try {
      const printModule = await import('../helpers/print');
      const printFn = printModule.printReport;
      if (printFn) {
        printFn({ 
          reportStats: reportData.reportStats, 
          topMenus: reportData.topMenus, 
          reportLabel: reportData.label,
          settings, 
          userEmail,
          reportNow: new Date(),
        });
      } else {
        showToast('Fungsi cetak laporan tidak ditemukan', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Gagal memuat fungsi cetak laporan: ' + err.message, 'error');
    }
  };

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
    const prevOrder = ordersRef.current.find(o => o.id === id);
    if (!prevOrder) return;
    const prevStatus = prevOrder.status;
    const prevPaymentStatus = prevOrder.payment_status;

    setOrders(prev => prev.map(o => 
      o.id === id ? { ...o, status, ...(status === 'completed' ? { payment_status: 'paid' } : {}) } : o
    ));

    const u = { status };
    if (status === 'completed') u.payment_status = 'paid';
    const { error } = await supabase.from('orders').update(u).eq('id', id);
    
    if (error) {
      setOrders(prev => prev.map(o => 
        o.id === id ? { ...o, status: prevStatus, ...(status === 'completed' ? { payment_status: prevPaymentStatus } : {}) } : o
      ));
      showToast('Gagal update status: ' + error.message, 'error');
    }
  };

  const handleCancelOrder = (id) => {
    setCancelModal({ open: true, orderId: id, reason: 'Stok habis' });
  };

  const executeCancelOrder = async () => {
    const { orderId, reason } = cancelModal;
    if (!reason.trim()) {
      showToast('Alasan penolakan wajib diisi', 'warning');
      return;
    }
    setCancelModal({ open: false, orderId: null, reason: '' });

    const currentOrder = ordersRef.current.find(o => o.id === orderId);
    if (!currentOrder) return;
    
    const prevStatus = currentOrder.status;
    const prevPaymentStatus = currentOrder.payment_status;
    const prevNote = currentOrder.order_note;
    const finalNote = `[DITOLAK: ${reason.trim()}]${prevNote ? ' ' + prevNote : ''}`;

    setOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, status: 'cancelled', payment_status: 'CANCELLED', order_note: finalNote } : o
    ));

    if (currentOrder.status !== 'cancelled' && Array.isArray(currentOrder.items)) {
      for (const item of currentOrder.items) {
        const menu = menusRef.current.find(m => m.id === item.id) || menusRef.current.find(m => m.name === item.name);
        if (menu) {
          const newStock = Number(menu.stock || 0) + Number(item.qty || 0);
          supabase.from('menus').update({ stock: newStock }).eq('id', menu.id).then(({ error }) => {
            if (error) console.error('Stock restore error:', error);
          });
        }
      }
      fetchMenus(tenantId);
    }

    const { error } = await supabase.from('orders').update({ 
      status: 'cancelled', 
      payment_status: 'CANCELLED',
      order_note: finalNote
    }).eq('id', orderId);
    
    if (error) {
      setOrders(prev => prev.map(o => 
        o.id === orderId ? { ...o, status: prevStatus, payment_status: prevPaymentStatus, order_note: prevNote } : o
      ));
      showToast('Gagal batalkan: ' + error.message, 'error');
      return;
    }
    
    showToast('Pesanan ditolak dan dibatalkan', 'warning');
  };

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
    const prevMenus = menusRef.current;
    
    setMenus(prev => prev.map(m => m.id === menu.id ? { ...m, status: ns } : m));
    
    const { error } = await supabase.from('menus').update({ status: ns }).eq('id', menu.id);
    
    if (error) {
      setMenus(prevMenus);
      showToast('Gagal ubah status: ' + error.message, 'error');
      return;
    }
    showToast(ns === 'available' ? 'Menu tersedia' : 'Menu ditandai habis', 'success');
  };

  const handleUpdateStock = async (menuId, currentStock, change) => {
    const newStock = Math.max(0, Number(currentStock || 0) + change);
    const prevMenus = menusRef.current;
    
    setMenus(prev => prev.map(m => m.id === menuId ? { ...m, stock: newStock } : m));
    
    const { error } = await supabase.from('menus').update({ stock: newStock }).eq('id', menuId);
    
    if (error) {
      setMenus(prevMenus);
      showToast('Gagal update stok: ' + error.message, 'error');
      return;
    }
    showToast(change > 0 ? 'Stok ditambah' : 'Stok dikurangi', 'success');
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from('tenants').update({
      name: settings.name, 
      wa_number: settings.wa, 
      address: settings.address,
      logo_url: settings.logo_url, 
      qris_string: settings.qris_string,
      banner_url: settings.banner_url, 
      tax_percentage: settings.tax_percentage,
      business_type: settings.business_type, // 🔥 TAMBAHAN
    }).eq('id', tenantId).select();

    if (error) { showToast('Gagal simpan: ' + error.message, 'error'); return; }
    if (data.length === 0) { showToast('Gagal simpan: Akses ditolak (RLS).', 'error'); return; }

    setCafeName(settings.name);
    showToast('Pengaturan disimpan', 'success');
  };

  const handleSaveMenu = async (currentMenu, resetFn) => {
    const isEdit = !!currentMenu.id;
    const payload = {
      tenant_id: tenantId, 
      name: currentMenu.name, 
      category: currentMenu.category,
      price: parseFloat(currentMenu.price), 
      description: currentMenu.desc,
      status: currentMenu.status, 
      image_url: currentMenu.image_url,
      stock: parseInt(currentMenu.stock, 10) || 0,
      is_featured: currentMenu.is_featured || false,
      is_new: currentMenu.is_new || false,
      discount_price: currentMenu.discount_price ? parseFloat(currentMenu.discount_price) : null,
    };
    
    if (isEdit) {
      const prevMenus = menusRef.current;
      setMenus(prev => prev.map(m => m.id === currentMenu.id ? { ...m, ...payload } : m));
      
      const { error } = await supabase.from('menus').update(payload).eq('id', currentMenu.id);
      if (error) {
        setMenus(prevMenus);
        showToast('Gagal simpan menu: ' + error.message, 'error');
        return;
      }
    } else {
      const { data, error } = await supabase.from('menus').insert([payload]).select().single();
      if (error) {
        showToast('Gagal simpan menu: ' + error.message, 'error');
        return;
      }
      setMenus(prev => [data, ...prev]);
    }
    
    resetFn({ 
      id: null, name: '', category: 'makanan', price: '', desc: '', status: 'available', image_url: '', stock: 0,
      is_featured: false, is_new: false, discount_price: ''
    });
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

  const handlePrintBill = async (order) => {
    try {
      const printModule = await import('../helpers/print');
      const qrisModule = await import('../helpers/qris');
      const printFn = printModule.printBillWithQRIS;
      const qrisFn = qrisModule.generateDynamicQRIS;
      if (printFn && qrisFn) {
        printFn({ order, settings, generateDynamicQRIS: qrisFn, showToast });
      } else {
        showToast('Fungsi cetak tidak ditemukan di print.js', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Gagal memuat fungsi cetak: ' + err.message, 'error');
    }
  };

  const handlePrintDaily = async () => {
    try {
      const printModule = await import('../helpers/print');
      const printFn = printModule.printDailyReport;
      if (printFn) {
        printFn({ orders, settings, userEmail });
      } else {
        showToast('Fungsi cetak laporan tidak ditemukan', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Gagal memuat fungsi cetak laporan: ' + err.message, 'error');
    }
  };

  const handleDownloadQR = async (table) => {
    if (!table || !table.table_number) return;
    try {
      showToast('Menyiapkan gambar QR...', 'info');
      const orderUrl = `${baseUrl}/order?tenant=${tenantId}&table=${table.table_number}`;
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&ecc=H&margin=30&data=${encodeURIComponent(orderUrl)}`;
      
      const canvas = document.createElement('canvas');
      canvas.width = 1500; 
      canvas.height = 1950;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (settings.logo_url) {
        const logoImg = new Image();
        logoImg.crossOrigin = 'Anonymous'; 
        logoImg.src = settings.logo_url;
        await new Promise((resolve) => {
          logoImg.onload = () => { ctx.drawImage(logoImg, 600, 100, 300, 300); resolve(); };
          logoImg.onerror = resolve;
        });
      }

      ctx.fillStyle = '#2A1F17'; 
      ctx.font = 'bold 70px Arial'; 
      ctx.textAlign = 'center';
      ctx.fillText(settings.name.toUpperCase(), 750, 520);

      const qrImg = new Image();
      qrImg.crossOrigin = 'Anonymous'; 
      qrImg.src = qrApiUrl;
      await new Promise((resolve, reject) => {
        qrImg.onload = () => { ctx.drawImage(qrImg, 250, 620, 1000, 1000); resolve(); };
        qrImg.onerror = reject;
      });

      ctx.fillStyle = '#2A1F17'; 
      ctx.font = 'bold 100px Arial';
      ctx.fillText(`MEJA ${table.table_number}`, 750, 1780);
      
      ctx.fillStyle = '#5C4B3E'; 
      ctx.font = 'bold 40px Arial';
      ctx.fillText('Scan untuk memesan menu', 750, 1860);
      
      ctx.fillStyle = '#888888'; 
      ctx.font = '28px Arial';
      ctx.fillText('Jika QR tidak terbaca, silakan hubungi kasir', 750, 1915);

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

  const displayOrders = useMemo(() => {
    return orders.filter(o => {
      const isPaid = (o.payment_status === 'PAID' || o.payment_status === 'paid' || !o.payment_status);
      
      if (queueFilter === "unpaid") {
        return ['WAITING_QRIS', 'WAITING_CASH'].includes(o.payment_status) && o.status === 'pending';
      }
      if (queueFilter === "active") {
        return ["pending", "cooking", "ready"].includes(o.status) && (!settings.is_pay_first || isPaid);
      }
      if (queueFilter === "completed") {
        return o.status === "completed";
      }
      return true;
    });
  }, [orders, queueFilter, settings.is_pay_first]);

  return {
    cafeName, userEmail, tenantId, menus, orders, tables, settings, isOpen, isSuspended,
    todayStr, baseUrl, isExpired, theme, nowTick, realtimeStatus, toasts, confirmDialog, isFullscreen, audioUnlocked,
    setTheme, setSettings, setMenus, setOrders, setTables, setToasts, setConfirmDialog,
    rp, showToast, askConfirm, unlockAudio, toggleTheme, toggleFullscreen, handleLogout,
    handleImageUpload, handleUpdateOrderStatus, handleCancelOrder, handleDeleteMenu, handleDeleteTable, toggleMenuStatus,
    handleUpdateStock, 
    handleToggleCafeStatus, 
    handleTogglePayFirst, 
    handleConfirmPayment,
    handleSaveSettings, handleSaveMenu, handleAddTable, openKitchenLink, handlePrintBill, handlePrintDaily, handleDownloadQR,
    fetchMenus, fetchOrders, fetchTables, menuSearch, setMenuSearch, menuCategoryFilter, setMenuCategoryFilter,
    queueFilter, setQueueFilter, displayOrders,
    reportMode, setReportMode, reportDateStr, setReportDateStr, reportMonth, setReportMonth, reportYear, setReportYear,
    reportStartDateStr, setReportStartDateStr, reportEndDateStr, setReportEndDateStr,
    reportLabel: reportData.label, reportStats: reportData.reportStats, topMenus: reportData.topMenus,
    chartData: reportData.chartData, maxChartRev: reportData.maxChartRev, totalChartRev: reportData.totalChartRev,
    showDailyBreakdown: false, activeDays: [], onExportCSV: handleExportCSV, onPrintReport: handlePrintReport,
    
    cancelModal, setCancelModal, executeCancelOrder
  };
}