'use client';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

const Icons = {
  Clipboard: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 14l2 2 4-4"/></svg>,
  Utensils: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>,
  Grid: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
  Settings: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>,
  Logout: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Print: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  Plus: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Chart: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>,
  X: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Clock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Search: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Download: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Calendar: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  TrendUp: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  Expand: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>,
  Shrink: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>,
};

function crc16(str) {
  let crc = 0xFFFF;
  for (let c = 0; c < str.length; c++) {
    crc ^= str.charCodeAt(c) << 8;
    for (let i = 0; i < 8; i++) {
      if (crc & 0x8000) crc = (crc << 1) ^ 0x1021;
      else crc <<= 1;
    }
  }
  let hex = (crc & 0xFFFF).toString(16).toUpperCase();
  return hex.padStart(4, '0');
}

function generateDynamicQRIS(staticString, amount) {
  try {
    if (!staticString) return null;
    let str = staticString.trim();
    if (str.includes('010211')) str = str.replace('010211', '010212');
    str = str.replace(/54\d{2}\d+(?=58)/, '');
    str = str.replace(/6304[0-9A-Fa-f]{4}$/, '');
    const amountStr = Math.round(amount).toString();
    const amountLen = amountStr.length.toString().padStart(2, '0');
    const amountTag = `54${amountLen}${amountStr}`;
    const insertIndex = str.indexOf('5802');
    if (insertIndex === -1) return null;
    const finalStrWithTag = str.slice(0, insertIndex) + amountTag + str.slice(insertIndex);
    const toCalculateCRC = finalStrWithTag + '6304';
    const crc = crc16(toCalculateCRC);
    return toCalculateCRC + crc;
  } catch (e) {
    console.error("QRIS Generate Error:", e);
    return null;
  }
}

export default function DashboardPage() {
  const [cafeName, setCafeName] = useState('Memuat...');
  const [userEmail, setUserEmail] = useState('');
  const [tenantId, setTenantId] = useState(null);
  const [activeTab, setActiveTab] = useState('queue');
  const [menus, setMenus] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [queueFilter, setQueueFilter] = useState('active');
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [currentMenu, setCurrentMenu] = useState({ id: null, name: '', category: 'makanan', price: '', desc: '', status: 'available', image_url: '' });
  
  // Tambah tax_percentage di state settings
  const [settings, setSettings] = useState({ name: '', wa: '', address: '', logo_url: '', qris_string: '', banner_url: '', tax_percentage: 11 });
  const [newTableNum, setNewTableNum] = useState('');
  const [todayStr, setTodayStr] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  const [reportNow, setReportNow] = useState(null);
  const [reportMode, setReportMode] = useState('daily');
  const [reportDateStr, setReportDateStr] = useState('');
  const [reportMonth, setReportMonth] = useState(0);
  const [reportYear, setReportYear] = useState(2026);
  const [reportStartDateStr, setReportStartDateStr] = useState('');
  const [reportEndDateStr, setReportEndDateStr] = useState('');
  const [chartDays, setChartDays] = useState(7);

  const [menuSearch, setMenuSearch] = useState('');
  const [menuCategoryFilter, setMenuCategoryFilter] = useState('all');

  const [nowTick, setNowTick] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [realtimeStatus, setRealtimeStatus] = useState('connecting');
  const [toasts, setToasts] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', onConfirm: null, danger: false });
  const [kitchenModal, setKitchenModal] = useState({ open: false, url: '', pin: '' });
  const [isFullscreen, setIsFullscreen] = useState(false);

  const fileInputRef = useRef(null);
  const logoInputRef = useRef(null);
  const bannerInputRef = useRef(null);
  const audioCtxRef = useRef(null);
  const soundEnabledRef = useRef(true);
  const audioUnlockedRef = useRef(false);
  const prevOrderIdsRef = useRef(null);
  const router = useRouter();

  const rp = (num) => 'Rp ' + Number(num || 0).toLocaleString('id-ID');

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const askConfirm = (title, message, onConfirm, danger = false) => {
    setConfirmDialog({ open: true, title, message, onConfirm, danger });
  };

  const playBeep = () => {
    if (!soundEnabledRef.current) return;
    if (!audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const playOne = (startTime) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = 880;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0, ctx.currentTime + startTime);
        gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + startTime);
        osc.stop(ctx.currentTime + startTime + 0.18);
      };
      playOne(0); playOne(0.22);
    } catch {}
  };

  const handleSoundToggle = () => {
    if (!audioUnlockedRef.current) {
      try {
        if (!audioCtxRef.current) {
          audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        audioCtxRef.current.resume();
        audioUnlockedRef.current = true;
        setAudioUnlocked(true);
        soundEnabledRef.current = true;
        setSoundEnabled(true);
        playBeep();
        showToast('🔊 Notifikasi suara aktif', 'success');
      } catch { showToast('Browser tidak mendukung suara', 'error'); }
    } else {
      const newEnabled = !soundEnabledRef.current;
      soundEnabledRef.current = newEnabled;
      setSoundEnabled(newEnabled);
      if (newEnabled) { playBeep(); showToast('🔊 Suara aktif', 'info'); }
      else showToast('🔇 Suara dimatikan', 'info');
    }
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    } catch {}
  };

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  useEffect(() => {
    const update = () => setNowTick(Date.now());
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onOffline = () => setRealtimeStatus('offline');
    const onOnline = () => setRealtimeStatus('connecting');
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  useEffect(() => {
    const now = new Date();
    setTodayStr(now.toDateString());
    setReportNow(now);
    setBaseUrl(window.location.origin);
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    setReportDateStr(`${yyyy}-${mm}-${dd}`);
    setReportMonth(now.getMonth());
    setReportYear(yyyy);
    setReportStartDateStr(`${yyyy}-${mm}-01`);
    setReportEndDateStr(`${yyyy}-${mm}-${dd}`);

    let channel, isMounted = true;
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return router.push('/login');
      if (!isMounted) return;
      setUserEmail(session.user.email);
      
      const { data: userData } = await supabase.from('users').select('tenant_id, tenants(*)').eq('id', session.user.id).single();
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
          tax_percentage: userData.tenants.tax_percentage !== null ? userData.tenants.tax_percentage : 11
        });
        
        await Promise.all([
          fetchMenus(tId), 
          fetchTables(tId), 
          fetchOrders(tId)
        ]);

        channel = supabase.channel('realtime-orders-' + Date.now())
          .on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: `tenant_id=eq.${tId}` }, () => fetchOrders(tId))
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') setRealtimeStatus('online');
            else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') setRealtimeStatus('offline');
            else setRealtimeStatus('connecting');
          });
      }
    };
    fetchData();
    return () => { isMounted = false; if (channel) supabase.removeChannel(channel); };
  }, [router]);

  const fetchMenus = async (tId) => { const { data } = await supabase.from('menus').select('*').eq('tenant_id', tId).order('created_at', { ascending: false }); if (data) setMenus(data); };
  const fetchTables = async (tId) => { const { data } = await supabase.from('tables').select('*').eq('tenant_id', tId).order('table_number', { ascending: true }); if (data) setTables(data); };
  const fetchOrders = async (tId) => {
    const { data } = await supabase.from('orders').select('*').eq('tenant_id', tId).order('created_at', { ascending: false });
    if (data) {
      const activeIds = new Set(data.filter(o => ['pending', 'cooking', 'ready'].includes(o.status)).map(o => o.id));
      const prevIds = prevOrderIdsRef.current;
      if (prevIds !== null) {
        const newOnes = [...activeIds].filter(id => !prevIds.has(id));
        if (newOnes.length > 0) {
          playBeep();
          const firstNew = data.find(o => o.id === newOnes[0]);
          if (firstNew) showToast(`🔔 Pesanan baru! Meja ${firstNew.table_number} - ${rp(firstNew.total_price)}`, 'info');
        }
      }
      prevOrderIdsRef.current = activeIds;
      setOrders(data);
    }
  };

  const handleLogout = () => askConfirm('Keluar dari Dashboard', 'Yakin ingin logout dari akun ini?', async () => { await supabase.auth.signOut(); router.push('/login'); }, true);

  const openKitchenLink = async () => {
    try {
      const { data, error } = await supabase.from('tenants').select('kitchen_pin').eq('id', tenantId).single();
      if (error) { showToast('Kolom kitchen_pin belum ada. Jalankan SQL migration dulu.', 'error'); return; }
      const pin = data?.kitchen_pin || '1234';
      setKitchenModal({ open: true, url: `${baseUrl}/kitchen/${tenantId}?pin=${pin}`, pin });
    } catch (e) { showToast('Error: ' + e.message, 'error'); }
  };

  const handleImageUpload = async (e, type = 'menu') => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (type === 'logo') setUploadingLogo(true); 
    else if (type === 'banner') setUploadingBanner(true);
    else setUploading(true);

    try {
      const compressedFile = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target.result;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            const MAX_SIZE = type === 'banner' ? 1200 : 800;

            if (width > height) {
              if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; }
            } else {
              if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob((blob) => {
              const newFile = new File([blob], `img-${Date.now()}.jpg`, { type: 'image/jpeg' });
              resolve(newFile);
            }, 'image/jpeg', 0.8);
          };
          img.onerror = (error) => reject(error);
        };
        reader.onerror = (error) => reject(error);
      });

      const fileName = `${tenantId}-${type}-${Date.now()}.jpg`;
      const bucket = (type === 'logo' || type === 'banner') ? 'cafe-logos' : 'menu-images';
      
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, compressedFile, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;
      
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
      
      if (type === 'logo') setSettings(prev => ({ ...prev, logo_url: urlData.publicUrl }));
      else if (type === 'banner') setSettings(prev => ({ ...prev, banner_url: urlData.publicUrl }));
      else setCurrentMenu(prev => ({ ...prev, image_url: urlData.publicUrl }));
      
      showToast('Foto berhasil diupload', 'success');
    } catch (err) { 
      showToast('Gagal upload: ' + err.message, 'error'); 
    }
    
    if (type === 'logo') setUploadingLogo(false); 
    else if (type === 'banner') setUploadingBanner(false);
    else setUploading(false);
  };

  const handleSaveMenu = async (e) => {
    e.preventDefault();
    const isEdit = !!currentMenu.id;
    const payload = { tenant_id: tenantId, name: currentMenu.name, category: currentMenu.category, price: parseFloat(currentMenu.price), description: currentMenu.desc, status: currentMenu.status, image_url: currentMenu.image_url };
    if (isEdit) await supabase.from('menus').update(payload).eq('id', currentMenu.id);
    else await supabase.from('menus').insert([payload]);
    setIsMenuModalOpen(false); fetchMenus(tenantId);
    showToast(isEdit ? '✅ Menu diperbarui' : '✅ Menu ditambahkan', 'success');
  };

  const handleDeleteMenu = (id) => askConfirm('Hapus Menu', 'Menu akan dihapus permanen. Lanjutkan?', async () => {
    await supabase.from('menus').delete().eq('id', id);
    fetchMenus(tenantId); showToast('Menu dihapus', 'success');
  }, true);

  const handleUpdateOrderStatus = async (id, status) => {
    const updates = { status };
    if (status === 'completed') updates.payment_status = 'paid';
    await supabase.from('orders').update(updates).eq('id', id);
    fetchOrders(tenantId);
  };

  const handleCancelOrder = (id) => askConfirm('Tolak Pesanan', 'Pesanan akan dibatalkan dan tidak diproses ke dapur. Lanjutkan?', async () => {
    await supabase.from('orders').update({ status: 'cancelled' }).eq('id', id);
    fetchOrders(tenantId); showToast('Pesanan ditolak', 'warning');
  }, true);

  const handleAddTable = async (e) => {
    e.preventDefault();
    if (!newTableNum) return;
    await supabase.from('tables').insert([{ tenant_id: tenantId, table_number: newTableNum }]);
    setNewTableNum(''); fetchTables(tenantId); showToast('✅ Meja ditambahkan', 'success');
  };

  const handleDeleteTable = (id) => askConfirm('Hapus Meja', 'Meja dan QR code-nya akan dihapus. Lanjutkan?', async () => {
    await supabase.from('tables').delete().eq('id', id);
    fetchTables(tenantId); showToast('Meja dihapus', 'success');
  }, true);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    await supabase.from('tenants').update({ 
      name: settings.name, 
      wa_number: settings.wa, 
      address: settings.address, 
      logo_url: settings.logo_url,
      qris_string: settings.qris_string,
      banner_url: settings.banner_url,
      tax_percentage: settings.tax_percentage
    }).eq('id', tenantId);
    setCafeName(settings.name); showToast('✅ Pengaturan disimpan', 'success');
  };

  const toggleMenuStatus = async (menu) => {
    const newStatus = menu.status === 'available' ? 'soldout' : 'available';
    const { error } = await supabase.from('menus').update({ status: newStatus }).eq('id', menu.id);
    if (error) { showToast('Gagal ubah status: ' + error.message, 'error'); return; }
    fetchMenus(tenantId);
    showToast(newStatus === 'available' ? '✅ Menu tersedia' : '⛔ Menu ditandai habis', 'success');
  };

  const printBillWithQRIS = (order) => {
    if (!settings.qris_string) {
      showToast('QRIS DANA belum diatur. Buka menu Pengaturan.', 'error');
      return;
    }
    const dynamicQRIS = generateDynamicQRIS(settings.qris_string, order.total_price);
    if (!dynamicQRIS) {
      showToast('Gagal generate QRIS. Periksa string QRIS Anda di Pengaturan.', 'error');
      return;
    }

    const subtotal = order.subtotal || order.total_price;
    const taxAmount = order.tax_amount || 0;
    const taxRate = settings.tax_percentage || 0;

    const win = window.open('', '', 'width=400,height=800');
    win.document.write(`
      <html><head><title>Bill - Meja ${order.table_number}</title><style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Courier New', monospace; font-size: 12px; padding: 10px; color: #000; max-width: 80mm; margin: 0 auto; }
        .center { text-align: center; }
        .bold { font-weight: bold; }
        h2 { font-size: 16px; margin-bottom: 4px; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        td { padding: 4px 0; vertical-align: top; }
        .right { text-align: right; }
        .line { border-top: 1px dashed #000; margin: 8px 0; }
        .total { font-size: 14px; font-weight: bold; margin-top: 8px; }
        .qris-box { text-align: center; margin-top: 15px; padding: 10px; border: 1px solid #ccc; border-radius: 8px; }
        .qris-box img { width: 180px; height: 180px; display: block; margin: 0 auto; }
        .qris-text { font-size: 10px; color: #555; margin-top: 5px; }
        @media print { 
          body { padding: 0; max-width: 100%; } 
          @page { margin: 5mm; }
          .qris-box { border: none; } 
        }
      </style></head><body>
        <div class="center">
          <h2>${settings.name || 'Kafe'}</h2>
          <p>${settings.address || ''}</p>
          <p>WA: ${settings.wa || ''}</p>
        </div>
        <div class="line"></div>
        <table>
          <tr><td class="bold">Bill:</td><td class="right">#${order.id.slice(0,8).toUpperCase()}</td></tr>
          <tr><td class="bold">Pelanggan:</td><td class="right">${order.customer_name || 'Tamu'}</td></tr>
          <tr><td class="bold">Meja:</td><td class="right">${order.table_number}</td></tr>
          <tr><td class="bold">Waktu:</td><td class="right">${new Date(order.created_at).toLocaleString('id-ID')}</td></tr>
        </table>
        <div class="line"></div>
        <table>
          ${order.items.map(i => `<tr><td>${i.qty}× ${i.name}</td><td class="right">${rp(i.price * i.qty)}</td></tr>`).join('')}
        </table>
        <div class="line"></div>
        <table>
          <tr><td>Subtotal</td><td class="right">${rp(subtotal)}</td></tr>
          ${taxAmount > 0 ? `<tr><td>PPN (${taxRate}%)</td><td class="right">${rp(taxAmount)}</td></tr>` : ''}
          <tr class="total"><td>TOTAL</td><td class="right">${rp(order.total_price)}</td></tr>
        </table>
        
        <div class="qris-box">
          <p class="bold" style="margin-bottom:8px;">BAYAR DENGAN QRIS</p>
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(dynamicQRIS)}" alt="QRIS" />
          <p class="qris-text">Scan dengan aplikasi bank / e-wallet apa saja.</p>
          <p class="qris-text">Nominal sudah otomatis terisi.</p>
          <p class="qris-text bold" style="margin-top:5px;">Merchant: ${settings.name}</p>
        </div>
        
        <div class="line" style="margin-top:15px;"></div>
        <p class="center" style="font-size:10px; margin-top:5px;">Terima Kasih 🙏</p>
      </body></html>
    `);
    win.document.close();
    setTimeout(() => { win.focus(); win.print(); }, 1000);
  };

  const printTableQR = (table) => {
    if (!baseUrl) { showToast('Halaman belum siap, coba lagi', 'error'); return; }
    const orderUrl = `${baseUrl}/order?tenant=${tenantId}&table=${table.table_number}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(orderUrl)}`;
    const win = window.open('', '', 'width=600,height=800');
    if (!win) { showToast('Popup diblokir. Izinkan popup untuk cetak QR', 'error'); return; }
    win.document.write(`
      <html><head><title>QR Meja ${table.table_number}</title><style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, system-ui, sans-serif; text-align: center; padding: 30px; }
        .logo { width: 80px; height: 80px; object-fit: cover; border-radius: 16px; margin: 0 auto 16px; display: block; border: 2px solid #ea580c; }
        .badge { display: inline-block; background: #ea580c; color: white; font-size: 11px; font-weight: bold; padding: 4px 14px; border-radius: 99px; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 12px; }
        h1 { font-size: 22px; color: #0f172a; margin-bottom: 4px; font-weight: 900; }
        h2 { font-size: 48px; color: #ea580c; margin: 8px 0 20px; font-weight: 900; letter-spacing: -1px; }
        .qr-wrapper { display: inline-block; padding: 16px; background: white; border: 3px dashed #ea580c; border-radius: 16px; margin: 10px 0; }
        .qr-wrapper img { width: 320px; height: 320px; display: block; }
        .hint { font-size: 14px; color: #475569; font-weight: 600; margin-top: 16px; }
        .url { font-size: 10px; color: #94a3b8; margin-top: 8px; word-break: break-all; padding: 0 20px; }
        @media print { body { padding: 10px; } }
      </style></head><body>
        ${settings.logo_url ? `<img src="${settings.logo_url}" class="logo" alt="Logo" />` : ''}
        <span class="badge">Scan untuk Pesan</span>
        <h1>${settings.name || 'Kafe'}</h1>
        <h2>Meja ${table.table_number}</h2>
        <div class="qr-wrapper"><img src="${qrUrl}" alt="QR" /></div>
        <p class="hint">📱 Buka kamera HP, arahkan ke QR code</p>
        <p class="url">${orderUrl}</p>
      </body></html>
    `);
    win.document.close();
    setTimeout(() => { win.focus(); win.print(); }, 1000);
  };

  const exportCSV = (reportOrders, reportLabelForFile) => {
    if (reportOrders.length === 0) { showToast('Tidak ada data untuk diexport', 'warning'); return; }
    const headers = ['Tanggal', 'Jam', 'Pelanggan', 'Meja', 'Order ID', 'Status', 'Pembayaran', 'Menu', 'Qty', 'Harga', 'Subtotal', 'PPN', 'Total Order'];
    const rows = [];
    reportOrders.forEach(o => {
      const dt = new Date(o.created_at);
      const dateStr = dt.toLocaleDateString('id-ID');
      const timeStr = dt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      (o.items || []).forEach(item => {
        rows.push([dateStr, timeStr, o.customer_name || 'Tamu', o.table_number, o.id.slice(0, 8), o.status, o.payment_status, item.name, item.qty, item.price, item.price * item.qty, o.tax_amount || 0, o.total_price]);
      });
    });
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laporan-${String(reportLabelForFile).replace(/[^a-zA-Z0-9-]/g, '_')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('✅ CSV berhasil diunduh', 'success');
  };

  const printReport = (reportStats, topMenus, reportLabel) => {
    const win = window.open('', '', 'width=800,height=1000');
    if (!win) { showToast('Popup diblokir. Izinkan popup untuk print', 'error'); return; }
    win.document.write(`
      <html><head><title>Laporan ${reportLabel}</title><style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, system-ui, sans-serif; padding: 30px; color: #0f172a; }
        h1 { font-size: 22px; margin-bottom: 4px; font-weight: 900; }
        h2 { font-size: 13px; color: #64748b; margin-bottom: 24px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
        .card { border: 1px solid #e2e8f0; padding: 14px; border-radius: 10px; }
        .card p:first-child { font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: 800; letter-spacing: 1px; margin-bottom: 6px; }
        .card p:last-child { font-size: 22px; font-weight: 900; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; }
        th, td { padding: 8px 6px; border-bottom: 1px solid #e2e8f0; text-align: left; }
        th { background: #f8fafc; font-weight: 800; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; }
        .text-right { text-align: right; }
        .section-title { font-size: 13px; font-weight: 900; margin: 24px 0 12px; padding-bottom: 6px; border-bottom: 2px solid #0f172a; }
        .footer { margin-top: 30px; font-size: 10px; color: #94a3b8; text-align: center; padding-top: 20px; border-top: 1px solid #e2e8f0; }
        @media print { body { padding: 10mm; } }
      </style></head><body>
        <h1>${settings.name || 'Kafe'}</h1>
        <h2>Laporan · ${reportLabel}</h2>
        <div class="grid">
          <div class="card"><p>Total Pesanan</p><p>${reportStats.totalOrders}</p></div>
          <div class="card"><p>Total Omset</p><p>${rp(reportStats.revenue)}</p></div>
          <div class="card"><p>Rata-rata / Order</p><p>${rp(reportStats.avgOrder)}</p></div>
          <div class="card"><p>Item Terjual</p><p>${reportStats.totalItems}</p></div>
        </div>
        <p class="section-title">STATUS PESANAN</p>
        <table>
          <thead><tr><th>Status</th><th class="text-right">Jumlah</th></tr></thead>
          <tbody>
            <tr><td>Baru</td><td class="text-right">${reportStats.statusCount.pending}</td></tr>
            <tr><td>Dimasak</td><td class="text-right">${reportStats.statusCount.cooking}</td></tr>
            <tr><td>Siap</td><td class="text-right">${reportStats.statusCount.ready}</td></tr>
            <tr><td>Selesai</td><td class="text-right">${reportStats.statusCount.completed}</td></tr>
            <tr><td>Batal</td><td class="text-right">${reportStats.statusCount.cancelled}</td></tr>
          </tbody>
        </table>
        ${topMenus.length > 0 ? `
          <p class="section-title">MENU TERLARIS</p>
          <table>
            <thead><tr><th>#</th><th>Menu</th><th class="text-right">Qty</th><th class="text-right">Omset</th></tr></thead>
            <tbody>
              ${topMenus.map(([name, data], idx) => `<tr><td>${idx + 1}</td><td>${name}</td><td class="text-right">${data.qty}×</td><td class="text-right">${rp(data.revenue)}</td></tr>`).join('')}
            </tbody>
          </table>
        ` : ''}
        <div class="footer">Dicetak ${reportNow ? reportNow.toLocaleString('id-ID') : ''} · NexaFlow SaaS</div>
      </body></html>
    `);
    win.document.close();
    setTimeout(() => { win.focus(); win.print(); }, 500);
  };

  const activeOrders = orders.filter(o => ['pending', 'cooking', 'ready'].includes(o.status));
  const filteredOrders = queueFilter === 'active' ? activeOrders : queueFilter === 'done' ? orders.filter(o => ['completed', 'cancelled'].includes(o.status)) : orders;
  const displayOrders = (() => {
    const arr = [...filteredOrders];
    if (queueFilter === 'active') arr.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    else arr.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return arr;
  })();

  const todayOrders = todayStr ? orders.filter(o => new Date(o.created_at).toDateString() === todayStr) : [];
  const stats = {
    total: todayOrders.length,
    cooking: todayOrders.filter(o => o.status === 'cooking').length,
    ready: todayOrders.filter(o => o.status === 'ready').length,
    revenue: todayOrders.filter(o => o.payment_status === 'paid').reduce((sum, o) => sum + Number(o.total_price), 0)
  };

  let reportOrders = [];
  let reportStats = { totalOrders: 0, revenue: 0, paidCount: 0, totalItems: 0, avgOrder: 0, statusCount: { pending: 0, cooking: 0, ready: 0, completed: 0, cancelled: 0 } };
  let topMenus = [];
  let activeDays = [];
  let reportLabel = 'Memuat...';
  let monthName = '';

  if (reportNow) {
    let startD, endD;
    if (reportMode === 'daily') {
      const baseD = reportDateStr ? new Date(reportDateStr + 'T00:00:00') : reportNow;
      startD = new Date(baseD.getFullYear(), baseD.getMonth(), baseD.getDate());
      endD = new Date(startD.getTime() + 24 * 60 * 60 * 1000);
    } else if (reportMode === 'monthly') {
      startD = new Date(reportYear, reportMonth, 1);
      endD = new Date(reportYear, reportMonth + 1, 1);
    } else {
      const startBase = reportStartDateStr ? new Date(reportStartDateStr + 'T00:00:00') : new Date(reportNow.getFullYear(), reportNow.getMonth(), 1);
      const endBase = reportEndDateStr ? new Date(reportEndDateStr + 'T00:00:00') : reportNow;
      startD = new Date(startBase.getFullYear(), startBase.getMonth(), startBase.getDate());
      endD = new Date(endBase.getFullYear(), endBase.getMonth(), endBase.getDate() + 1);
    }

    reportOrders = orders.filter(o => {
      const d = new Date(o.created_at);
      return d >= startD && d < endD;
    });

    reportStats = {
      totalOrders: reportOrders.length,
      revenue: reportOrders.filter(o => o.payment_status === 'paid').reduce((s, o) => s + Number(o.total_price || 0), 0),
      paidCount: reportOrders.filter(o => o.payment_status === 'paid').length,
      totalItems: reportOrders.reduce((s, o) => s + (o.items || []).reduce((si, i) => si + (i.qty || 0), 0), 0),
      statusCount: {
        pending: reportOrders.filter(o => o.status === 'pending').length,
        cooking: reportOrders.filter(o => o.status === 'cooking').length,
        ready: reportOrders.filter(o => o.status === 'ready').length,
        completed: reportOrders.filter(o => o.status === 'completed').length,
        cancelled: reportOrders.filter(o => o.status === 'cancelled').length,
      },
    };
    reportStats.avgOrder = reportStats.paidCount > 0 ? reportStats.revenue / reportStats.paidCount : 0;

    const menuSales = {};
    reportOrders.forEach(o => {
      (o.items || []).forEach(item => {
        const key = item.name || 'Unknown';
        if (!menuSales[key]) menuSales[key] = { qty: 0, revenue: 0 };
        menuSales[key].qty += item.qty || 0;
        menuSales[key].revenue += (item.price || 0) * (item.qty || 0);
      });
    });
    topMenus = Object.entries(menuSales).sort((a, b) => b[1].qty - a[1].qty).slice(0, 5);

    const dailyMap = {};
    reportOrders.forEach(o => {
      const d = new Date(o.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (!dailyMap[key]) dailyMap[key] = { date: d, orders: 0, revenue: 0 };
      dailyMap[key].orders += 1;
      if (o.payment_status === 'paid') dailyMap[key].revenue += Number(o.total_price || 0);
    });
    activeDays = Object.values(dailyMap).sort((a, b) => a.date - b.date);

    if (reportMode === 'daily') {
      reportLabel = startD.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    } else if (reportMode === 'monthly') {
      reportLabel = new Date(reportYear, reportMonth, 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    } else {
      const s = startD.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
      const e = new Date(endD.getTime() - 24 * 60 * 60 * 1000).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
      reportLabel = `${s} - ${e}`;
    }
    monthName = reportNow.toLocaleDateString('id-ID', { month: 'short' });
  }

  const chartData = [];
  if (reportNow) {
    for (let i = chartDays - 1; i >= 0; i--) {
      const d = new Date(reportNow.getFullYear(), reportNow.getMonth(), reportNow.getDate() - i);
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
      const dayOrders = orders.filter(o => {
        const od = new Date(o.created_at);
        return od >= dayStart && od < dayEnd;
      });
      const dayRev = dayOrders.filter(o => o.payment_status === 'paid').reduce((s, o) => s + Number(o.total_price || 0), 0);
      chartData.push({
        label: d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
        revenue: dayRev,
        orders: dayOrders.length,
      });
    }
  }
  const maxChartRev = Math.max(...chartData.map(c => c.revenue), 1);
  const totalChartRev = chartData.reduce((s, c) => s + c.revenue, 0);

  const filteredMenus = menus.filter(m => {
    const matchSearch = !menuSearch || m.name.toLowerCase().includes(menuSearch.toLowerCase()) || (m.description || '').toLowerCase().includes(menuSearch.toLowerCase());
    const matchCat = menuCategoryFilter === 'all' || m.category === menuCategoryFilter;
    return matchSearch && matchCat;
  });

  const showDailyBreakdown = reportMode === 'monthly' || reportMode === 'custom';

  const statusColors = {
    pending: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
    cooking: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' },
    ready: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
    completed: { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700' },
    cancelled: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700' },
  };

  const pageTitle = { queue: 'Antrian Pesanan', menu: 'Kelola Menu', tables: 'Meja & QR Code', reports: 'Laporan Penjualan', settings: 'Pengaturan Toko' }[activeTab];
  const pageSubtitle = { queue: 'Kelola dan proses pesanan masuk secara real-time', menu: 'Atur daftar menu, harga, dan ketersediaan', tables: 'Generate dan kelola QR code per meja', reports: 'Ringkasan omset harian, bulanan & custom', settings: 'Konfigurasi profil dan identitas kafe' }[activeTab];

  const getStatusPill = (status) => {
    const map = { pending: 'status-pending', cooking: 'status-cooking', ready: 'status-ready', completed: 'status-completed', cancelled: 'status-cancelled' };
    return map[status] || 'status-completed';
  };
  const getStatusLabel = (status) => ({ pending: 'Baru', cooking: 'Dimasak', ready: 'Siap', completed: 'Selesai', cancelled: 'Batal' }[status] || status);

  const getTimeBadge = (createdAt) => {
    if (!nowTick) return null;
    const mins = Math.floor((nowTick - new Date(createdAt).getTime()) / 60000);
    if (mins < 0) return null;
    if (mins < 5) return { mins, cls: 'bg-slate-100 border-slate-200 text-slate-600', pulse: false };
    if (mins < 15) return { mins, cls: 'bg-amber-50 border-amber-300 text-amber-700', pulse: false };
    return { mins, cls: 'bg-rose-50 border-rose-300 text-rose-700', pulse: true };
  };

  if (!tenantId) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-black text-slate-900">Memuat Dashboard...</h2>
          <p className="text-sm font-bold text-slate-500 mt-1">Menyiapkan data pesanan & menu</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      <aside className="w-64 bg-gradient-to-b from-slate-950 to-slate-900 flex-col justify-between hidden md:flex h-screen sticky top-0 print:hidden border-r border-slate-800">
        <div className="flex flex-col h-full">
          <div className="px-5 py-6 border-b border-slate-800/60">
            <div className="flex items-center gap-3">
              {settings.logo_url ? <img src={settings.logo_url} className="w-10 h-10 rounded-xl object-cover ring-2 ring-orange-500/30" alt="Logo" /> : <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-orange-500/30">N</div>}
              <div><h1 className="text-base font-black text-white tracking-tight leading-none">NexaFlow</h1><p className="text-[10px] font-semibold text-orange-400 mt-1 tracking-widest uppercase">SaaS Resto</p></div>
            </div>
          </div>
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Menu Utama</p>
            {[
              { key: 'queue', label: 'Antrian Pesanan', Icon: Icons.Clipboard, badge: activeOrders.length },
              { key: 'menu', label: 'Kelola Menu', Icon: Icons.Utensils },
              { key: 'tables', label: 'Meja & QR', Icon: Icons.Grid },
              { key: 'reports', label: 'Laporan', Icon: Icons.Chart },
              { key: 'settings', label: 'Pengaturan', Icon: Icons.Settings },
            ].map(({ key, label, Icon, badge }) => (
              <button key={key} onClick={() => setActiveTab(key)} className={`group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${activeTab === key ? 'bg-white/[0.08] text-white' : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'}`}>
                {activeTab === key && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-orange-500 rounded-r-full"></span>}
                <span className={activeTab === key ? 'text-orange-400' : ''}><Icon /></span>
                <span className="flex-1 text-left">{label}</span>
                {badge > 0 && <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{badge}</span>}
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-slate-800/60">
            <div className="bg-white/[0.04] rounded-xl p-3 border border-white/[0.06]">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-black text-xs">{cafeName.charAt(0).toUpperCase()}</div>
                <div className="flex-1 min-w-0"><p className="text-xs font-bold text-white truncate">{cafeName}</p><p className="text-[10px] text-slate-500 truncate">{userEmail}</p></div>
              </div>
              <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-white/[0.04] hover:bg-rose-500/10 border border-white/[0.06] hover:border-rose-500/30 text-slate-400 hover:text-rose-400 font-bold py-2 rounded-lg text-xs transition-all"><Icons.Logout /> <span>Logout</span></button>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 py-4 flex justify-between items-center shrink-0 z-10 print:hidden">
          <div><h2 className="text-xl font-black text-slate-900 tracking-tight leading-tight">{pageTitle}</h2><p className="text-xs text-slate-500 font-medium mt-0.5">{pageSubtitle}</p></div>
          <div className="flex items-center gap-2">
            <button onClick={openKitchenLink} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border bg-slate-900 hover:bg-slate-800 border-slate-800 text-white shadow-md transition-all text-[11px] font-bold" title="Buka layar dapur (KDS)">🍳 <span className="hidden sm:inline">Layar Dapur</span></button>
            
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${realtimeStatus === 'online' ? 'bg-emerald-50 border-emerald-200' : realtimeStatus === 'offline' ? 'bg-rose-50 border-rose-200' : 'bg-amber-50 border-amber-200'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${realtimeStatus === 'online' ? 'bg-emerald-500 animate-pulse' : realtimeStatus === 'offline' ? 'bg-rose-500' : 'bg-amber-500 animate-pulse'}`}></span>
              <span className={`text-[11px] font-bold ${realtimeStatus === 'online' ? 'text-emerald-700' : realtimeStatus === 'offline' ? 'text-rose-700' : 'text-amber-700'}`}>{realtimeStatus === 'online' ? 'Sistem Online' : realtimeStatus === 'offline' ? 'Koneksi Terputus' : 'Menghubungkan...'}</span>
            </div>
            
            <button onClick={handleSoundToggle} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all text-[11px] font-bold ${!audioUnlocked ? 'bg-orange-500 hover:bg-orange-600 border-orange-600 text-white shadow-md shadow-orange-500/30' : soundEnabled ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-500'}`}>
              {!audioUnlocked ? (<><span>🔕</span><span className="hidden sm:inline">Aktifkan Suara</span></>) : soundEnabled ? (<><span>🔊</span><span className="hidden sm:inline">Suara Aktif</span></>) : (<><span>🔇</span><span className="hidden sm:inline">Suara Mati</span></>)}
            </button>

            <button onClick={toggleFullscreen} className="p-1.5 px-2.5 rounded-full border bg-white hover:bg-slate-50 border-slate-200 text-slate-600 transition-all shadow-sm" title="Layar Penuh">
              {isFullscreen ? <Icons.Shrink /> : <Icons.Expand />}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 print:p-0">
          <div className="max-w-6xl mx-auto space-y-6 print:space-y-0">

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
              <div className="card-elevated rounded-2xl p-5"><div className="flex items-start justify-between mb-3"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Pesanan</p><div className="icon-box w-8 h-8 bg-slate-100 border-slate-200 text-slate-600"><Icons.Clipboard /></div></div><h3 className="text-3xl font-black text-slate-900 tracking-tight">{stats.total}</h3><p className="text-[11px] text-slate-500 font-semibold mt-1">Hari ini</p></div>
              <div className="card-elevated rounded-2xl p-5"><div className="flex items-start justify-between mb-3"><p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Dimasak</p><div className="icon-box w-8 h-8 bg-amber-50 border-amber-200 text-amber-600">👨‍🍳</div></div><h3 className="text-3xl font-black text-amber-600 tracking-tight">{stats.cooking}</h3><p className="text-[11px] text-slate-500 font-semibold mt-1">Sedang diproses</p></div>
              <div className="card-elevated rounded-2xl p-5"><div className="flex items-start justify-between mb-3"><p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Siap Saji</p><div className="icon-box w-8 h-8 bg-emerald-50 border-emerald-200 text-emerald-600">🍽️</div></div><h3 className="text-3xl font-black text-emerald-600 tracking-tight">{stats.ready}</h3><p className="text-[11px] text-slate-500 font-semibold mt-1">Menunggu diantar</p></div>
              <div className="rounded-2xl p-5 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-800 shadow-[0_4px_12px_-2px_rgba(15,23,42,0.3),0_12px_32px_-8px_rgba(15,23,42,0.4)]"><div className="flex items-start justify-between mb-3"><p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Omset Hari Ini</p><div className="icon-box w-8 h-8 bg-orange-500/20 border-orange-500/30 text-orange-400">💰</div></div><h3 className="text-2xl font-black text-white tracking-tight">{rp(stats.revenue)}</h3><p className="text-[11px] text-slate-400 font-semibold mt-1">Total pendapatan</p></div>
            </div>

            {activeTab === 'queue' && (
              <div className="space-y-4 print:hidden">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 bg-white rounded-xl p-1 w-fit border border-slate-200 shadow-sm">
                    {[{k:'active',l:'Aktif'},{k:'done',l:'Selesai'},{k:'all',l:'Semua'}].map(({k,l}) => (<button key={k} onClick={() => setQueueFilter(k)} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${queueFilter === k ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>{l}</button>))}
                  </div>
                  {queueFilter === 'active' && <p className="text-[11px] text-slate-500 font-semibold flex items-center gap-1.5"><Icons.Clock /> Urut dari yang paling lama menunggu</p>}
                </div>
                {displayOrders.length === 0 ? (
                  <div className="card-subtle rounded-2xl p-16 text-center"><div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl">📋</div><p className="font-bold text-slate-900">Tidak ada antrian pesanan</p><p className="text-sm text-slate-500 mt-1">Pesanan baru akan muncul di sini secara otomatis</p></div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayOrders.map(order => {
                      const badge = ['pending', 'cooking', 'ready'].includes(order.status) ? getTimeBadge(order.created_at) : null;
                      return (
                        <div key={order.id} className="card-elevated rounded-2xl overflow-hidden">
                          <div className="px-5 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 flex justify-between items-center">
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Meja {order.table_number}</p>
                              <p className="text-2xl font-black text-slate-900 leading-tight truncate max-w-[150px]">{order.customer_name || 'Tamu'}</p>
                            </div>
                            <span className={`status-pill ${getStatusPill(order.status)}`}>{getStatusLabel(order.status)}</span>
                          </div>
                          <div className="px-5 py-4 space-y-3">
                            <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 font-semibold">
                              <span>#{order.id.slice(0, 8).toUpperCase()}</span>
                              <div className="flex items-center gap-1.5">
                                {badge && (<span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-black ${badge.cls} ${badge.pulse ? 'animate-pulse' : ''}`}><Icons.Clock /> {badge.mins}m</span>)}
                                <span>{new Date(order.created_at).toLocaleTimeString('id-ID', {hour:'2-digit',minute:'2-digit'})}</span>
                              </div>
                            </div>
                            
                            {order.order_note && (
                              <div className="bg-amber-50 border-l-4 border-amber-400 p-2 rounded-r text-xs font-bold text-amber-800">
                                📝 Catatan: {order.order_note}
                              </div>
                            )}

                            <div className="space-y-2 pt-1">
                              {order.items.map((item, idx) => (<div key={idx}><div className="flex justify-between text-sm"><span className="font-bold text-slate-700">{item.qty}× {item.name}</span><span className="font-bold text-slate-900">{rp(item.price * item.qty)}</span></div>{item.note && (<p className="text-[11px] text-orange-600 font-bold mt-0.5 italic">↳ "{item.note}"</p>)}</div>))}
                            </div>
                            <div className="pt-3 border-t border-slate-100 flex justify-between items-center"><span className="text-xs font-bold text-slate-500">Total</span><span className="text-lg font-black text-orange-600">{rp(order.total_price)}</span></div>
                            
                            {order.status !== 'completed' && order.status !== 'cancelled' && (
                              <div className="space-y-2 pt-1">
                                <div className="grid grid-cols-2 gap-2">
                                  <button onClick={() => handleUpdateOrderStatus(order.id, 'cooking')} className="bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 font-bold py-2 rounded-lg text-xs transition-all">Masak</button>
                                  <button onClick={() => handleUpdateOrderStatus(order.id, 'ready')} className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-bold py-2 rounded-lg text-xs transition-all">Sajikan</button>
                                </div>
                                <button onClick={() => handleUpdateOrderStatus(order.id, 'completed')} className="w-full btn-dark py-2 rounded-lg text-xs flex items-center justify-center gap-1.5">Selesai / Lunas</button>
                                <button onClick={() => handleCancelOrder(order.id)} className="w-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all"><Icons.X /> Tolak Pesanan</button>
                              </div>
                            )}
                            
                            <div className="pt-2">
                              <button onClick={() => printBillWithQRIS(order)} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-lg text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-orange-500/30">
                                <Icons.Print /> Cetak Bill & QRIS
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'menu' && (
              <div className="space-y-4 print:hidden">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div><h3 className="font-black text-slate-900">Daftar Menu</h3><p className="text-xs text-slate-500">{filteredMenus.length} dari {menus.length} menu · klik badge di foto untuk toggle cepat</p></div>
                  <button onClick={() => { setCurrentMenu({ id: null, name: '', category: 'makanan', price: '', desc: '', status: 'available', image_url: '' }); setIsMenuModalOpen(true); }} className="btn-primary px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5"><Icons.Plus /> Tambah Menu</button>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Icons.Search /></span>
                    <input type="text" value={menuSearch} onChange={e => setMenuSearch(e.target.value)} placeholder="Cari nama atau deskripsi menu..." className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-semibold text-slate-900" />
                  </div>
                  <div className="flex items-center gap-2 bg-white rounded-xl p-1 border border-slate-200 shadow-sm">
                    {[{k:'all',l:'Semua'},{k:'makanan',l:'Makanan'},{k:'minuman',l:'Minuman'},{k:'cemilan',l:'Cemilan'}].map(({k,l}) => (<button key={k} onClick={() => setMenuCategoryFilter(k)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${menuCategoryFilter === k ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>{l}</button>))}
                  </div>
                </div>
                {filteredMenus.length === 0 ? (
                  <div className="card-subtle rounded-2xl p-16 text-center"><div className="text-4xl mb-3">🔍</div><p className="font-bold text-slate-900">{menus.length === 0 ? 'Belum ada menu' : 'Tidak ada menu yang cocok'}</p><p className="text-sm text-slate-500 mt-1">{menus.length === 0 ? 'Tambahkan menu pertama Anda' : 'Coba kata kunci atau kategori lain'}</p></div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredMenus.map(menu => (
                      <div key={menu.id} className="card-elevated rounded-2xl overflow-hidden flex flex-col">
                        <div className="h-44 bg-slate-100 relative overflow-hidden">
                          {menu.image_url ? <img src={menu.image_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-5xl">🍽️</div>}
                          <div className="absolute top-3 left-3 z-10"><button onClick={() => toggleMenuStatus(menu)} className={`text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-lg transition-all backdrop-blur-md ${menu.status === 'available' ? 'bg-rose-600/90 hover:bg-rose-700 text-white' : 'bg-emerald-500/90 hover:bg-emerald-600 text-white'}`}>{menu.status === 'available' ? '⛔ Set Habis' : '✅ Set Tersedia'}</button></div>
                          <div className="absolute top-3 right-3"><span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${menu.status === 'available' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'}`}>{menu.status === 'available' ? 'Tersedia' : 'Habis'}</span></div>
                          <div className="absolute bottom-3 left-3"><span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white uppercase tracking-wider">{menu.category}</span></div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div><h4 className="font-black text-slate-900">{menu.name}</h4><p className="text-xs text-slate-500 font-medium line-clamp-2 mt-1 min-h-[2rem]">{menu.description || 'Tidak ada deskripsi'}</p><p className="font-black text-orange-600 text-lg mt-2">{rp(menu.price)}</p></div>
                          <div className="flex gap-2 mt-4">
                            <button onClick={() => { setCurrentMenu({ ...menu, desc: menu.description || '' }); setIsMenuModalOpen(true); }} className="flex-1 btn-ghost py-2 rounded-lg text-xs">Edit</button>
                            <button onClick={() => handleDeleteMenu(menu.id)} className="flex-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 font-bold py-2 rounded-lg text-xs transition-all">Hapus</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'tables' && (
              <div className="card-elevated rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                  <div><h3 className="font-black text-slate-900">QR Code Meja</h3><p className="text-xs text-slate-500">{tables.length} meja terdaftar · Klik "Cetak QR" untuk cetak per meja</p></div>
                  <form onSubmit={handleAddTable} className="flex gap-2 w-full sm:w-auto">
                    <input type="number" required value={newTableNum} onChange={e => setNewTableNum(e.target.value)} placeholder="No Meja" className="border border-slate-200 rounded-xl px-3 py-2 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-semibold" />
                    <button type="submit" className="btn-primary px-4 py-2 rounded-xl text-xs">Tambah</button>
                  </form>
                </div>
                {tables.length === 0 ? (
                  <div className="text-center py-16"><div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl">🪑</div><p className="font-bold text-slate-900">Belum ada meja</p><p className="text-sm text-slate-500 mt-1">Tambahkan meja untuk generate QR code</p></div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {tables.map(t => (
                      <div key={t.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center group hover:bg-white hover:border-slate-300 hover:shadow-md transition-all">
                        <p className="font-black text-slate-900 text-sm mb-3">Meja {t.table_number}</p>
                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${baseUrl}/order?tenant=${tenantId}&table=${t.table_number}`)}`} className="w-full rounded-lg mb-3" alt="QR" />
                        <div className="flex gap-1.5"><button onClick={() => printTableQR(t)} className="flex-1 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all"><Icons.Print /> Cetak QR</button><button onClick={() => handleDeleteTable(t.id)} className="text-[10px] text-rose-500 hover:text-rose-700 font-bold hover:underline px-2">Hapus</button></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="space-y-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1 bg-white rounded-xl p-1 border border-slate-200 shadow-sm">
                      <button onClick={() => setReportMode('daily')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${reportMode === 'daily' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>📅 Harian</button>
                      <button onClick={() => setReportMode('monthly')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${reportMode === 'monthly' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>📊 Bulanan</button>
                      <button onClick={() => setReportMode('custom')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${reportMode === 'custom' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>📆 Custom</button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => exportCSV(reportOrders, reportLabel)} disabled={!reportNow || reportOrders.length === 0} className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg shadow-md shadow-emerald-500/30 transition-all"><Icons.Download /> Export CSV</button>
                    <button onClick={() => printReport(reportStats, topMenus, reportLabel)} disabled={!reportNow} className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-bold rounded-lg shadow-md transition-all"><Icons.Print /> Print</button>
                  </div>
                </div>

                {reportNow && (
                  <div className="card-elevated rounded-2xl p-4">
                    {reportMode === 'daily' && (
                      <div className="flex items-center gap-3 flex-wrap">
                        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5"><Icons.Calendar /> Pilih Tanggal:</label>
                        <input type="date" value={reportDateStr} onChange={e => setReportDateStr(e.target.value)} max={reportNow.toISOString().slice(0, 10)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
                      </div>
                    )}
                    {reportMode === 'monthly' && (
                      <div className="flex items-center gap-3 flex-wrap">
                        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5"><Icons.Calendar /> Pilih Bulan:</label>
                        <select value={reportMonth} onChange={e => setReportMonth(Number(e.target.value))} className="border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500">{MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}</select>
                        <select value={reportYear} onChange={e => setReportYear(Number(e.target.value))} className="border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500">{reportNow && Array.from({ length: reportNow.getFullYear() - 2023 }, (_, i) => 2024 + i).map(y => <option key={y} value={y}>{y}</option>)}</select>
                      </div>
                    )}
                    {reportMode === 'custom' && (
                      <div className="flex items-center gap-3 flex-wrap">
                        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5"><Icons.Calendar /> Dari:</label>
                        <input type="date" value={reportStartDateStr} onChange={e => setReportStartDateStr(e.target.value)} max={reportNow.toISOString().slice(0, 10)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
                        <label className="text-xs font-bold text-slate-700">Sampai:</label>
                        <input type="date" value={reportEndDateStr} onChange={e => setReportEndDateStr(e.target.value)} max={reportNow.toISOString().slice(0, 10)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
                      </div>
                    )}
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Periode:</p>
                      <p className="text-sm font-black text-slate-900">{reportLabel}</p>
                    </div>
                  </div>
                )}

                {!reportNow ? (
                  <div className="card-subtle rounded-2xl p-16 text-center"><p className="font-bold text-slate-900">Memuat laporan...</p></div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="card-elevated rounded-2xl p-5"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Total Pesanan</p><h3 className="text-3xl font-black text-slate-900">{reportStats.totalOrders}</h3><p className="text-[11px] text-slate-500 font-semibold mt-1">{reportStats.paidCount} lunas</p></div>
                      <div className="rounded-2xl p-5 bg-gradient-to-br from-slate-900 to-slate-800 shadow-lg"><p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-2">Total Omset</p><h3 className="text-2xl font-black text-white">{rp(reportStats.revenue)}</h3><p className="text-[11px] text-slate-400 font-semibold mt-1">Dari pesanan lunas</p></div>
                      <div className="card-elevated rounded-2xl p-5"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Rata-rata / Order</p><h3 className="text-2xl font-black text-slate-900">{rp(reportStats.avgOrder)}</h3><p className="text-[11px] text-slate-500 font-semibold mt-1">Per transaksi lunas</p></div>
                      <div className="card-elevated rounded-2xl p-5"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Item Terjual</p><h3 className="text-3xl font-black text-slate-900">{reportStats.totalItems}</h3><p className="text-[11px] text-slate-500 font-semibold mt-1">Total porsi</p></div>
                    </div>

                    <div className="card-elevated rounded-2xl p-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                        <div className="flex items-center gap-2"><Icons.TrendUp /><h3 className="font-black text-slate-900">Grafik Omzet {chartDays} Hari Terakhir</h3></div>
                        <div className="flex items-center gap-1 bg-white rounded-lg p-1 border border-slate-200">
                          <button onClick={() => setChartDays(7)} className={`px-3 py-1 rounded text-[11px] font-bold transition-all ${chartDays === 7 ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'}`}>7 Hari</button>
                          <button onClick={() => setChartDays(30)} className={`px-3 py-1 rounded text-[11px] font-bold transition-all ${chartDays === 30 ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'}`}>30 Hari</button>
                        </div>
                      </div>
                      {chartData.length > 0 && chartData.every(c => c.revenue === 0) ? (
                        <div className="text-center py-10"><p className="text-3xl mb-2">📈</p><p className="text-sm font-bold text-slate-900">Belum ada omzet</p><p className="text-xs text-slate-500 mt-1">Data akan muncul setelah ada pesanan lunas</p></div>
                      ) : (
                        <>
                          <div className="h-52 flex items-end gap-1 px-2">
                            {chartData.map((d, i) => (
                              <div key={i} className="flex-1 h-full flex flex-col">
                                <div className="flex-1 relative">
                                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-orange-500 to-orange-400 rounded-t hover:from-orange-600 hover:to-orange-500 transition-all cursor-default" style={{ height: `${(d.revenue / maxChartRev) * 100}%`, minHeight: d.revenue > 0 ? '3px' : '0' }} title={`${d.label}: ${rp(d.revenue)} (${d.orders} order)`}></div>
                                </div>
                                <p className="text-[8px] text-slate-400 mt-1 text-center truncate">{d.label}</p>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-xs">
                            <span className="font-bold text-slate-500">Total: <span className="text-orange-600 font-black">{rp(totalChartRev)}</span></span>
                            <span className="font-bold text-slate-500">Max hari: <span className="text-slate-900 font-black">{rp(maxChartRev)}</span></span>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="card-elevated rounded-2xl p-6">
                      <h3 className="font-black text-slate-900 mb-4">Status Pesanan</h3>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {[{key:'pending',label:'Baru'},{key:'cooking',label:'Dimasak'},{key:'ready',label:'Siap'},{key:'completed',label:'Selesai'},{key:'cancelled',label:'Batal'}].map(({key,label}) => {
                          const c = statusColors[key];
                          return (<div key={key} className={`p-4 rounded-xl border ${c.bg} ${c.border}`}><p className={`text-[10px] font-bold uppercase tracking-widest ${c.text}`}>{label}</p><p className={`text-2xl font-black ${c.text}`}>{reportStats.statusCount[key] || 0}</p></div>);
                        })}
                      </div>
                    </div>

                    <div className="card-elevated rounded-2xl p-6">
                      <h3 className="font-black text-slate-900 mb-4">🔥 Menu Terlaris</h3>
                      {topMenus.length === 0 ? (
                        <div className="text-center py-10"><p className="text-4xl mb-2">📊</p><p className="text-sm font-bold text-slate-900">Belum ada penjualan</p><p className="text-xs text-slate-500 mt-1">Data akan muncul setelah ada pesanan</p></div>
                      ) : (
                        <div className="space-y-4">
                          {topMenus.map(([name, data], idx) => {
                            const maxQty = topMenus[0][1].qty;
                            const pct = maxQty > 0 ? (data.qty / maxQty) * 100 : 0;
                            const rankBg = idx === 0 ? 'bg-amber-400 text-white' : idx === 1 ? 'bg-slate-300 text-slate-700' : idx === 2 ? 'bg-orange-300 text-white' : 'bg-slate-100 text-slate-600';
                            return (<div key={name}><div className="flex justify-between items-center mb-1.5"><div className="flex items-center gap-2.5 min-w-0"><span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${rankBg}`}>{idx + 1}</span><span className="font-bold text-sm text-slate-900 truncate">{name}</span></div><span className="text-xs font-bold text-slate-600 whitespace-nowrap ml-2">{data.qty}× · {rp(data.revenue)}</span></div><div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all" style={{ width: `${pct}%` }}></div></div></div>);
                          })}
                        </div>
                      )}
                    </div>

                    {showDailyBreakdown && (
                      <div className="card-elevated rounded-2xl p-6">
                        <h3 className="font-black text-slate-900 mb-4">📅 Rincian Per Hari</h3>
                        {activeDays.length === 0 ? (
                          <div className="text-center py-10"><p className="text-4xl mb-2">🗓️</p><p className="text-sm font-bold text-slate-900">Belum ada pesanan di periode ini</p></div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead><tr className="border-b-2 border-slate-200"><th className="text-left py-2 px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tanggal</th><th className="text-right py-2 px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pesanan</th><th className="text-right py-2 px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Omset</th></tr></thead>
                              <tbody>{activeDays.map(d => (<tr key={d.date.toISOString()} className="border-b border-slate-100 hover:bg-slate-50"><td className="py-2 px-2 font-bold text-slate-700">{d.date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}</td><td className="text-right py-2 px-2 font-semibold text-slate-600">{d.orders}</td><td className="text-right py-2 px-2 font-black text-orange-600">{rp(d.revenue)}</td></tr>))}</tbody>
                              <tfoot><tr className="border-t-2 border-slate-900"><td className="py-3 px-2 font-black text-slate-900">TOTAL</td><td className="text-right py-3 px-2 font-black text-slate-900">{reportStats.totalOrders}</td><td className="text-right py-3 px-2 font-black text-orange-600">{rp(reportStats.revenue)}</td></tr></tfoot>
                            </table>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="card-elevated rounded-2xl p-6 md:p-8 max-w-xl mx-auto print:hidden">
                <div className="border-b border-slate-100 pb-4 mb-6"><h3 className="font-black text-slate-900">Profil Toko</h3><p className="text-xs text-slate-500">Ubah identitas dan kontak kafe Anda</p></div>
                <form onSubmit={handleSaveSettings} className="space-y-5">
                  <div><label className="block text-xs font-bold text-slate-700 mb-2">Logo Kafe</label><div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">{settings.logo_url ? (<img src={settings.logo_url} className="w-16 h-16 rounded-xl object-cover shadow-sm bg-white border border-slate-200" />) : (<div className="w-16 h-16 rounded-xl bg-slate-200 flex items-center justify-center text-2xl">🏪</div>)}<div className="flex-1"><input type="file" accept="image/*" ref={logoInputRef} onChange={(e) => handleImageUpload(e, 'logo')} className="hidden" /><button type="button" onClick={() => logoInputRef.current?.click()} className="btn-ghost w-full py-2 rounded-lg text-xs">{uploadingLogo ? 'Mengupload...' : '📷 Ganti Logo'}</button><p className="text-[10px] text-slate-500 mt-1.5">PNG/JPG, maksimal 2MB</p></div></div></div>
                  
                  {/* BANNER UPLOAD */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">Banner Kafe (Latar Belakang)</label>
                    <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      {settings.banner_url ? (
                        <img src={settings.banner_url} className="w-24 h-16 rounded-lg object-cover shadow-sm bg-white border border-slate-200" />
                      ) : (
                        <div className="w-24 h-16 rounded-lg bg-slate-200 flex items-center justify-center text-2xl">🖼️</div>
                      )}
                      <div className="flex-1">
                        <input type="file" accept="image/*" ref={bannerInputRef} onChange={(e) => handleImageUpload(e, 'banner')} className="hidden" />
                        <button type="button" onClick={() => bannerInputRef.current?.click()} className="btn-ghost w-full py-2 rounded-lg text-xs">{uploadingBanner ? 'Mengupload...' : '📷 Pilih Banner'}</button>
                        <p className="text-[10px] text-slate-500 mt-1.5">Disarankan gambar landscape.</p>
                      </div>
                    </div>
                  </div>

                  <div><label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Kafe</label><input type="text" value={settings.name} onChange={e => setSettings({...settings, name: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-semibold text-slate-900" /></div>
                  <div><label className="block text-xs font-bold text-slate-700 mb-1.5">Nomor WhatsApp</label><input type="text" value={settings.wa} onChange={e => setSettings({...settings, wa: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-semibold text-slate-900" placeholder="08xxxxxxxxxx" /></div>
                  <div><label className="block text-xs font-bold text-slate-700 mb-1.5">Alamat</label><input type="text" value={settings.address} onChange={e => setSettings({...settings, address: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-semibold text-slate-900" placeholder="Jl. Contoh No. 123" /></div>
                  
                  {/* TAX PERCENTAGE */}
                  <div className="border-t border-slate-100 pt-4">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Persentase PPN (%)</label>
                    <input type="number" min="0" max="100" value={settings.tax_percentage} onChange={e => setSettings({...settings, tax_percentage: Number(e.target.value)})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-semibold text-slate-900" placeholder="11" />
                    <p className="text-[10px] text-slate-500 mt-1.5">Sesuai ketentuan pemerintah, standar PPN adalah 11%. Isi 0 jika tidak ada pajak.</p>
                  </div>

                  <div className="border-t border-slate-100 pt-4">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">QRIS Bank/E-Wallet (Untuk Cetak Bill)</label>
                    <textarea value={settings.qris_string} onChange={e => setSettings({...settings, qris_string: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-mono text-slate-900 bg-slate-50" rows="4" placeholder="00020101021126..."></textarea>
                    <p className="text-[10px] text-slate-500 mt-1.5">Paste string QRIS statis (DANA, Mandiri, BCA, dll).</p>
                  </div>

                  <button type="submit" className="btn-dark w-full py-3 rounded-xl text-sm mt-2">Simpan Pengaturan</button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Menu Modal */}
      {isMenuModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 print:hidden">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="flex justify-between items-start mb-5"><div><h3 className="font-black text-lg text-slate-900">{currentMenu.id ? 'Edit Menu' : 'Tambah Menu'}</h3><p className="text-xs text-slate-500 mt-0.5">Isi informasi menu baru</p></div><button onClick={() => setIsMenuModalOpen(false)} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-lg flex items-center justify-center">×</button></div>
            <form onSubmit={handleSaveMenu} className="space-y-4">
              <div><label className="block text-xs font-bold text-slate-700 mb-2">Foto Menu</label><div className="flex items-center gap-3"><div className="w-24 h-24 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center text-3xl border border-slate-200">{currentMenu.image_url ? <img src={currentMenu.image_url} className="w-full h-full object-cover" /> : '🍽️'}</div><div className="flex-1"><input type="file" ref={fileInputRef} onChange={(e) => handleImageUpload(e, 'menu')} accept="image/*" className="hidden" /><button type="button" onClick={() => fileInputRef.current?.click()} className="btn-ghost w-full py-2 rounded-lg text-xs">{uploading ? 'Mengupload...' : '📷 Pilih Foto'}</button></div></div></div>
              <div><label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Menu</label><input required type="text" value={currentMenu.name} onChange={e => setCurrentMenu({...currentMenu, name: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-semibold text-slate-900" placeholder="Contoh: Nasi Goreng Spesial" /></div>
              <div><label className="block text-xs font-bold text-slate-700 mb-1.5">Harga (Rp)</label><input required type="number" value={currentMenu.price} onChange={e => setCurrentMenu({...currentMenu, price: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-semibold text-slate-900" placeholder="25000" /></div>
              <div><label className="block text-xs font-bold text-slate-700 mb-1.5">Kategori</label><select value={currentMenu.category} onChange={e => setCurrentMenu({...currentMenu, category: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-semibold text-slate-900"><option value="makanan">Makanan</option><option value="minuman">Minuman</option><option value="cemilan">Cemilan</option></select></div>
              <div><label className="block text-xs font-bold text-slate-700 mb-1.5">Deskripsi</label><textarea value={currentMenu.desc} onChange={e => setCurrentMenu({...currentMenu, desc: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-semibold text-slate-900" rows="2" placeholder="Deskripsi singkat menu"></textarea></div>
              <div className="flex gap-2 pt-2"><button type="submit" className="flex-1 btn-primary py-2.5 rounded-xl text-sm">Simpan</button><button type="button" onClick={() => setIsMenuModalOpen(false)} className="btn-ghost px-6 py-2.5 rounded-xl text-sm">Batal</button></div>
            </form>
          </div>
        </div>
      )}

      {/* Kitchen Modal */}
      {kitchenModal.open && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-[80] print:hidden">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between mb-4"><div><h3 className="font-black text-lg text-slate-900">🍳 Layar Dapur (KDS)</h3><p className="text-xs text-slate-500 mt-0.5">Buka URL ini di tablet / TV dapur</p></div><button onClick={() => setKitchenModal({ open: false, url: '', pin: '' })} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-lg flex items-center justify-center">×</button></div>
            <div className="space-y-3">
              <div><label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">URL</label><div className="flex gap-2"><input readOnly value={kitchenModal.url} className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-xs bg-slate-50 font-mono" /><button onClick={() => { navigator.clipboard.writeText(kitchenModal.url); showToast('✅ URL disalin', 'success'); }} className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold whitespace-nowrap">📋 Salin</button></div></div>
              <div className="text-center"><img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(kitchenModal.url)}`} className="w-40 h-40 mx-auto rounded-lg border border-slate-200" alt="QR KDS" /><p className="text-[10px] text-slate-500 mt-2">Scan QR dengan tablet dapur</p></div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3"><p className="text-xs font-bold text-amber-900">PIN: {kitchenModal.pin}</p><p className="text-[10px] text-amber-700 mt-1">PIN ini sudah termasuk di URL. Jangan bagikan ke pelanggan.</p></div>
            </div>
            <button onClick={() => setKitchenModal({ open: false, url: '', pin: '' })} className="w-full mt-4 btn-ghost py-2.5 rounded-xl text-sm font-bold">Tutup</button>
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="fixed top-4 right-4 z-[100] space-y-2 w-80 max-w-[calc(100vw-2rem)] print:hidden pointer-events-none">
        {toasts.map(t => {
          const c = { success: { border: 'border-emerald-400', icon: '✅', bar: 'bg-emerald-500' }, error: { border: 'border-rose-400', icon: '❌', bar: 'bg-rose-500' }, warning: { border: 'border-amber-400', icon: '⚠️', bar: 'bg-amber-500' }, info: { border: 'border-orange-400', icon: '🔔', bar: 'bg-orange-500' } }[t.type] || { border: 'border-slate-300', icon: 'ℹ️', bar: 'bg-slate-500' };
          return (<div key={t.id} className={`pointer-events-auto bg-white rounded-xl shadow-2xl border-2 ${c.border} overflow-hidden flex items-stretch`}><div className={`${c.bar} w-1 shrink-0`}></div><div className="flex items-start gap-2.5 px-3 py-2.5 flex-1"><span className="text-lg shrink-0">{c.icon}</span><p className="text-sm font-bold text-slate-900 flex-1">{t.message}</p></div></div>);
        })}
      </div>

      {/* Confirm Dialog */}
      {confirmDialog.open && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-[90] print:hidden">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-black text-lg text-slate-900 mb-2">{confirmDialog.title}</h3>
            <p className="text-sm text-slate-600 mb-6 whitespace-pre-line">{confirmDialog.message}</p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmDialog({ open: false, title: '', message: '', onConfirm: null, danger: false })} className="flex-1 btn-ghost py-2.5 rounded-xl text-sm font-bold">Batal</button>
              <button onClick={async () => { const cb = confirmDialog.onConfirm; setConfirmDialog({ open: false, title: '', message: '', onConfirm: null, danger: false }); if (cb) { try { await cb(); } catch (err) { showToast('Error: ' + err.message, 'error'); } } }} className={`flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all ${confirmDialog.danger ? 'bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-500/30' : 'bg-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-900/30'}`}>Ya, Lanjutkan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}