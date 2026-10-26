'use client';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const WA_NUMBER = '6281389744957'; // GANTI DENGAN NOMOR WA ANDA

const extractDominantColor = (imgUrl) => {
  try {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imgUrl;
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width; canvas.height = img.height;
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
          document.documentElement.style.setProperty('--primary-light', `rgba(${r}, ${g}, ${b}, 0.1)`);
          const darkR = Math.max(0, r - 30); const darkG = Math.max(0, g - 30); const darkB = Math.max(0, b - 30);
          document.documentElement.style.setProperty('--primary-dark', `rgb(${darkR}, ${darkG}, ${darkB})`);
        } else { throw new Error('Fallback'); }
      } catch (err) {
        document.documentElement.style.setProperty('--primary-color', '#3A2A20');
        document.documentElement.style.setProperty('--primary-light', '#e0e7ff');
        document.documentElement.style.setProperty('--primary-dark', '#2A1F17');
      }
    };
    img.onerror = () => {
      document.documentElement.style.setProperty('--primary-color', '#3A2A20');
      document.documentElement.style.setProperty('--primary-light', '#e0e7ff');
      document.documentElement.style.setProperty('--primary-dark', '#2A1F17');
    };
  } catch (e) {
    document.documentElement.style.setProperty('--primary-color', '#3A2A20');
    document.documentElement.style.setProperty('--primary-light', '#e0e7ff');
    document.documentElement.style.setProperty('--primary-dark', '#2A1F17');
  }
};

const printHTML = (htmlContent) => {
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed'; iframe.style.right = '0'; iframe.style.bottom = '0'; iframe.style.width = '0'; iframe.style.height = '0'; iframe.style.border = '0';
  document.body.appendChild(iframe);
  const doc = iframe.contentWindow.document;
  doc.open(); doc.write(htmlContent); doc.close();
  setTimeout(() => {
    iframe.contentWindow.focus(); iframe.contentWindow.print();
    setTimeout(() => { document.body.removeChild(iframe); }, 5000);
  }, 500);
};

const Icons = {
  Clipboard: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 14l2 2 4-4"/></svg>,
  Utensils: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>,
  Grid: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
  Settings: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>,
  Logout: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Print: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  Plus: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Chart: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>,
  X: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Clock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Search: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Download: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Calendar: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  TrendUp: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  Expand: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>,
  Shrink: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>,
  Menu: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  Lock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  WhatsApp: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>,
  Sun: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  Moon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
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
  } catch (e) { return null; }
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
  const [settings, setSettings] = useState({ name: '', wa: '', address: '', logo_url: '', qris_string: '', banner_url: '', tax_percentage: 11 });
  const [newTableNum, setNewTableNum] = useState('');
  const [todayStr, setTodayStr] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  
  // STATE UNTUK TEMA
  const [theme, setTheme] = useState('light');

  const [reportNow, setReportNow] = useState(null);
  const [reportMode, setReportMode] = useState('daily');
  const [reportDateStr, setReportDateStr] = useState('');
  const [reportMonth, setReportMonth] = useState(0);
  const [reportYear, setReportYear] = useState(2026);
  const [reportStartDateStr, setReportStartDateStr] = useState('');
  const [reportEndDateStr, setReportEndDateStr] = useState('');
  
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const fileInputRef = useRef(null);
  const logoInputRef = useRef(null);
  const bannerInputRef = useRef(null);
  const audioCtxRef = useRef(null);
  const soundEnabledRef = useRef(true);
  const audioUnlockedRef = useRef(false);
  const prevOrderIdsRef = useRef(null);
  const router = useRouter();

  const rp = (num) => 'Rp ' + Number(num || 0).toLocaleString('id-ID');

  // LOGIKA TEMA
  useEffect(() => {
    const savedTheme = localStorage.getItem('nexaflow_theme') || 'light';
    setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('nexaflow_theme', newTheme);
  };

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
      const playOne = (startTime) => {
        const osc = ctx.createOscillator(); const gain = ctx.createGain();
        osc.frequency.value = 880; osc.type = 'sine';
        gain.gain.setValueAtTime(0, ctx.currentTime + startTime);
        gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + 0.18);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(ctx.currentTime + startTime); osc.stop(ctx.currentTime + startTime + 0.18);
      };
      playOne(0); playOne(0.22);
    } catch {}
  };

  const handleSoundToggle = () => {
    if (!audioUnlockedRef.current) {
      try {
        if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        audioCtxRef.current.resume();
        audioUnlockedRef.current = true; setAudioUnlocked(true);
        soundEnabledRef.current = true; setSoundEnabled(true);
        playBeep(); showToast('🔊 Notifikasi suara aktif', 'success');
      } catch { showToast('Browser tidak mendukung suara', 'error'); }
    } else {
      const newEnabled = !soundEnabledRef.current;
      soundEnabledRef.current = newEnabled; setSoundEnabled(newEnabled);
      if (newEnabled) { playBeep(); showToast('🔊 Suara aktif', 'info'); } else showToast('🔇 Suara dimatikan', 'info');
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
    return () => { window.removeEventListener('online', onOnline); window.removeEventListener('offline', onOffline); };
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

    let channel, presenceChannel, isMounted = true;
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return router.push('/login');
      if (!isMounted) return;
      setUserEmail(session.user.email);
      
      const { data: userData } = await supabase.from('users').select('tenant_id, tenants(*)').eq('id', session.user.id).single();
      
      if (!userData || !userData.tenants) {
        if (session.user.email === 'dinamis.id.shop@gmail.com') return router.push('/admin');
        else { showToast('Akun ini belum terhubung ke kafe manapun.', 'error'); await supabase.auth.signOut(); return router.push('/login'); }
      }

      if (userData.tenants.subscription_end_date) {
        const endDate = new Date(userData.tenants.subscription_end_date);
        if (endDate < now) setIsExpired(true);
      }

      if (userData && userData.tenants && isMounted) {
        const tId = userData.tenant_id;
        setTenantId(tId);
        setCafeName(userData.tenants.name);
        setSettings({ 
          name: userData.tenants.name, wa: userData.tenants.wa_number || '', address: userData.tenants.address || '', 
          logo_url: userData.tenants.logo_url || '', qris_string: userData.tenants.qris_string || '', banner_url: userData.tenants.banner_url || '',
          tax_percentage: userData.tenants.tax_percentage !== null ? userData.tenants.tax_percentage : 11
        });
        
        if (userData.tenants.banner_url) extractDominantColor(userData.tenants.banner_url);
        else if (userData.tenants.logo_url) extractDominantColor(userData.tenants.logo_url);

        await Promise.all([fetchMenus(tId), fetchTables(tId), fetchOrders(tId)]);

        channel = supabase.channel('realtime-orders-' + Date.now())
          .on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: `tenant_id=eq.${tId}` }, () => fetchOrders(tId))
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') setRealtimeStatus('online');
            else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') setRealtimeStatus('offline');
            else setRealtimeStatus('connecting');
          });

        presenceChannel = supabase.channel('online-rooms', { config: { presence: { key: session.user.id } } });
        presenceChannel.subscribe(async (status) => {
          if (status === 'SUBSCRIBED') await presenceChannel.track({ tenant_id: tId, user_email: session.user.email, online_at: new Date().toISOString() });
        });
      }
    };
    fetchData();
    return () => { isMounted = false; if (channel) supabase.removeChannel(channel); if (presenceChannel) supabase.removeChannel(presenceChannel); };
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
      if (error) { showToast('Kolom kitchen_pin belum ada.', 'error'); return; }
      const pin = data?.kitchen_pin || '1234';
      setKitchenModal({ open: true, url: `${baseUrl}/kitchen/${tenantId}?pin=${pin}`, pin });
    } catch (e) { showToast('Error: ' + e.message, 'error'); }
  };

  const handleImageUpload = async (e, type = 'menu') => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (type === 'logo') setUploadingLogo(true); else if (type === 'banner') setUploadingBanner(true); else setUploading(true);
    try {
      const compressedFile = await new Promise((resolve, reject) => {
        const reader = new FileReader(); reader.readAsDataURL(file);
        reader.onload = (event) => {
          const img = new Image(); img.src = event.target.result;
          img.onload = () => {
            const canvas = document.createElement('canvas'); let width = img.width; let height = img.height;
            const MAX_SIZE = type === 'banner' ? 1200 : 800;
            if (width > height) { if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; } } else { if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; } }
            canvas.width = width; canvas.height = height; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob((blob) => { resolve(new File([blob], `img-${Date.now()}.jpg`, { type: 'image/jpeg' })); }, 'image/jpeg', 0.8);
          };
          img.onerror = (error) => reject(error);
        };
        reader.onerror = (error) => reject(error);
      });
      const fileName = `${tenantId}-${type}-${Date.now()}.jpg`;
      const bucket = (type === 'logo' || type === 'banner') ? 'cafe-logos' : 'menu-images';
      const { error: uploadError } = await supabase.storage.from(bucket).upload(fileName, compressedFile, { cacheControl: '3600', upsert: false });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
      if (type === 'logo') setSettings(prev => ({ ...prev, logo_url: urlData.publicUrl }));
      else if (type === 'banner') { setSettings(prev => ({ ...prev, banner_url: urlData.publicUrl })); extractDominantColor(urlData.publicUrl); }
      else setCurrentMenu(prev => ({ ...prev, image_url: urlData.publicUrl }));
      showToast('Foto berhasil diupload', 'success');
    } catch (err) { showToast('Gagal upload: ' + err.message, 'error'); }
    if (type === 'logo') setUploadingLogo(false); else if (type === 'banner') setUploadingBanner(false); else setUploading(false);
  };

  const handleSaveMenu = async (e) => {
    e.preventDefault();
    const isEdit = !!currentMenu.id;
    const payload = { tenant_id: tenantId, name: currentMenu.name, category: currentMenu.category, price: parseFloat(currentMenu.price), description: currentMenu.desc, status: currentMenu.status, image_url: currentMenu.image_url };
    if (isEdit) await supabase.from('menus').update(payload).eq('id', currentMenu.id); else await supabase.from('menus').insert([payload]);
    setIsMenuModalOpen(false); fetchMenus(tenantId); showToast(isEdit ? '✅ Menu diperbarui' : '✅ Menu ditambahkan', 'success');
  };

  const handleDeleteMenu = (id) => askConfirm('Hapus Menu', 'Menu akan dihapus permanen. Lanjutkan?', async () => { await supabase.from('menus').delete().eq('id', id); fetchMenus(tenantId); showToast('Menu dihapus', 'success'); }, true);

  const handleUpdateOrderStatus = async (id, status) => {
    const updates = { status };
    if (status === 'completed') updates.payment_status = 'paid';
    await supabase.from('orders').update(updates).eq('id', id);
    fetchOrders(tenantId);
  };

  const handleCancelOrder = (id) => askConfirm('Tolak Pesanan', 'Pesanan akan dibatalkan. Lanjutkan?', async () => { await supabase.from('orders').update({ status: 'cancelled' }).eq('id', id); fetchOrders(tenantId); showToast('Pesanan ditolak', 'warning'); }, true);
  const handleAddTable = async (e) => { e.preventDefault(); if (!newTableNum) return; await supabase.from('tables').insert([{ tenant_id: tenantId, table_number: newTableNum }]); setNewTableNum(''); fetchTables(tenantId); showToast('✅ Meja ditambahkan', 'success'); };
  const handleDeleteTable = (id) => askConfirm('Hapus Meja', 'Meja akan dihapus. Lanjutkan?', async () => { await supabase.from('tables').delete().eq('id', id); fetchTables(tenantId); showToast('Meja dihapus', 'success'); }, true);
  
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    await supabase.from('tenants').update({ name: settings.name, wa_number: settings.wa, address: settings.address, logo_url: settings.logo_url, qris_string: settings.qris_string, banner_url: settings.banner_url, tax_percentage: settings.tax_percentage }).eq('id', tenantId);
    setCafeName(settings.name); showToast('✅ Pengaturan disimpan', 'success');
  };

  const toggleMenuStatus = async (menu) => {
    const newStatus = menu.status === 'available' ? 'soldout' : 'available';
    const { error } = await supabase.from('menus').update({ status: newStatus }).eq('id', menu.id);
    if (error) { showToast('Gagal ubah status: ' + error.message, 'error'); return; }
    fetchMenus(tenantId); showToast(newStatus === 'available' ? '✅ Menu tersedia' : '⛔ Menu ditandai habis', 'success');
  };

  const printBillWithQRIS = (order) => {
    if (!settings.qris_string) { showToast('QRIS belum diatur.', 'error'); return; }
    const dynamicQRIS = generateDynamicQRIS(settings.qris_string, order.total_price);
    if (!dynamicQRIS) { showToast('Gagal generate QRIS.', 'error'); return; }
    const subtotal = order.subtotal || order.total_price; const taxAmount = order.tax_amount || 0; const taxRate = settings.tax_percentage || 0;
    
    const html = `
      <html><head><title>Bill - Meja ${order.table_number}</title><style>
        * { margin: 0; padding: 0; box-sizing: border-box; } 
        body { font-family: 'Courier New', monospace; font-size: 12px; padding: 10px; color: #000; max-width: 80mm; margin: 0 auto; } 
        .center { text-align: center; } .bold { font-weight: bold; } h2 { font-size: 16px; margin-bottom: 4px; } 
        table { width: 100%; border-collapse: collapse; margin: 10px 0; } td { padding: 4px 0; vertical-align: top; } 
        .right { text-align: right; } .line { border-top: 1px dashed #000; margin: 8px 0; } 
        .total { font-size: 14px; font-weight: bold; margin-top: 8px; } 
        .qris-box { text-align: center; margin-top: 15px; padding: 10px; border: 1px solid #ccc; border-radius: 8px; } 
        .qris-box img { width: 180px; height: 180px; display: block; margin: 0 auto; } 
        .qris-text { font-size: 10px; color: #555; margin-top: 5px; } 
        @media print { body { padding: 0; max-width: 100%; } @page { margin: 5mm; } .qris-box { border: none; } }
      </style></head><body>
        <div class="center"><h2>${settings.name || 'Kafe'}</h2><p>${settings.address || ''}</p><p>WA: ${settings.wa || ''}</p></div><div class="line"></div>
        <table><tr><td class="bold">Bill:</td><td class="right">#${order.id.slice(0,8).toUpperCase()}</td></tr><tr><td class="bold">Pelanggan:</td><td class="right">${order.customer_name || 'Tamu'}</td></tr><tr><td class="bold">Meja:</td><td class="right">${order.table_number}</td></tr><tr><td class="bold">Waktu:</td><td class="right">${new Date(order.created_at).toLocaleString('id-ID')}</td></tr></table><div class="line"></div>
        <table>${order.items.map(i => `<tr><td>${i.qty}× ${i.name}</td><td class="right">${rp(i.price * i.qty)}</td></tr>`).join('')}</table><div class="line"></div>
        <table><tr><td>Subtotal</td><td class="right">${rp(subtotal)}</td></tr>${taxAmount > 0 ? `<tr><td>PPN (${taxRate}%)</td><td class="right">${rp(taxAmount)}</td></tr>` : ''}<tr class="total"><td>TOTAL</td><td class="right">${rp(order.total_price)}</td></tr></table>
        <div class="qris-box"><p class="bold" style="margin-bottom:8px;">BAYAR DENGAN QRIS</p><img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(dynamicQRIS)}" alt="QRIS" /><p class="qris-text">Scan dengan aplikasi bank / e-wallet apa saja.</p><p class="qris-text">Nominal sudah otomatis terisi.</p><p class="qris-text bold" style="margin-top:5px;">Merchant: ${settings.name}</p></div>
        <div class="line" style="margin-top:15px;"></div><p class="center" style="font-size:10px; margin-top:5px;">Terima Kasih 🙏</p></body></html>
    `;
    printHTML(html);
  };

  const printTableQR = (table) => {
    if (!baseUrl) { showToast('Halaman belum siap', 'error'); return; }
    const orderUrl = `${baseUrl}/order?tenant=${tenantId}&table=${table.table_number}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(orderUrl)}`;
    
    const html = `
      <html><head><title>QR Meja ${table.table_number}</title><style>
        * { margin: 0; padding: 0; box-sizing: border-box; } 
        body { font-family: -apple-system, system-ui, sans-serif; text-align: center; padding: 30px; } 
        .logo { width: 80px; height: 80px; object-fit: cover; border-radius: 16px; margin: 0 auto 16px; display: block; border: 2px solid #000; } 
        .badge { display: inline-block; background: #000; color: white; font-size: 11px; font-weight: bold; padding: 4px 14px; border-radius: 99px; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 12px; } 
        h1 { font-size: 22px; color: #0f172a; margin-bottom: 4px; font-weight: 900; } 
        h2 { font-size: 48px; color: #000; margin: 8px 0 20px; font-weight: 900; letter-spacing: -1px; } 
        .qr-wrapper { display: inline-block; padding: 16px; background: white; border: 3px dashed #000; border-radius: 16px; margin: 10px 0; } 
        .qr-wrapper img { width: 320px; height: 320px; display: block; } 
        .hint { font-size: 14px; color: #475569; font-weight: 600; margin-top: 16px; } 
        .url { font-size: 10px; color: #94a3b8; margin-top: 8px; word-break: break-all; padding: 0 20px; } 
        @media print { body { padding: 10px; } }
      </style></head><body>
        ${settings.logo_url ? `<img src="${settings.logo_url}" class="logo" alt="Logo" />` : ''}<span class="badge">Scan untuk Pesan</span><h1>${settings.name || 'Kafe'}</h1><h2>Meja ${table.table_number}</h2>
        <div class="qr-wrapper"><img src="${qrUrl}" alt="QR" /></div><p class="hint">📱 Buka kamera HP, arahkan ke QR code</p><p class="url">${orderUrl}</p></body></html>
    `;
    printHTML(html);
  };

  const exportCSV = (reportOrders, reportLabelForFile) => {
    if (reportOrders.length === 0) { showToast('Tidak ada data', 'warning'); return; }
    const headers = ['Tanggal', 'Jam', 'Pelanggan', 'Meja', 'Order ID', 'Status', 'Pembayaran', 'Menu', 'Qty', 'Harga', 'Subtotal', 'PPN', 'Total Order'];
    const rows = []; reportOrders.forEach(o => { const dt = new Date(o.created_at); const dateStr = dt.toLocaleDateString('id-ID'); const timeStr = dt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }); (o.items || []).forEach(item => { rows.push([dateStr, timeStr, o.customer_name || 'Tamu', o.table_number, o.id.slice(0, 8), o.status, o.payment_status, item.name, item.qty, item.price, item.price * item.qty, o.tax_amount || 0, o.total_price]); }); });
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `laporan-${String(reportLabelForFile).replace(/[^a-zA-Z0-9-]/g, '_')}.csv`; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); showToast('✅ CSV diunduh', 'success');
  };

  const printReport = (reportStats, topMenus, reportLabel) => {
    const html = `
      <html><head><title>Laporan ${reportLabel}</title><style>
        * { margin: 0; padding: 0; box-sizing: border-box; } 
        body { font-family: -apple-system, system-ui, sans-serif; padding: 30px; color: #0f172a; } 
        h1 { font-size: 22px; margin-bottom: 4px; font-weight: 900; } h2 { font-size: 13px; color: #64748b; margin-bottom: 24px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; } 
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; } 
        .card { border: 1px solid #e2e8f0; padding: 14px; border-radius: 10px; } 
        .card p:first-child { font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: 800; letter-spacing: 1px; margin-bottom: 6px; } 
        .card p:last-child { font-size: 22px; font-weight: 900; } 
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; } th, td { padding: 8px 6px; border-bottom: 1px solid #e2e8f0; text-align: left; } th { background: #f8fafc; font-weight: 800; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; } 
        .text-right { text-align: right; } .section-title { font-size: 13px; font-weight: 900; margin: 24px 0 12px; padding-bottom: 6px; border-bottom: 2px solid #0f172a; } 
        .footer { margin-top: 30px; font-size: 10px; color: #94a3b8; text-align: center; padding-top: 20px; border-top: 1px solid #e2e8f0; } 
        @media print { body { padding: 10mm; } }
      </style></head><body>
        <h1>${settings.name || 'Kafe'}</h1><h2>Laporan · ${reportLabel}</h2>
        <div class="grid"><div class="card"><p>Total Pesanan</p><p>${reportStats.totalOrders}</p></div><div class="card"><p>Total Omset</p><p>${rp(reportStats.revenue)}</p></div><div class="card"><p>Rata-rata / Order</p><p>${rp(reportStats.avgOrder)}</p></div><div class="card"><p>Item Terjual</p><p>${reportStats.totalItems}</p></div></div>
        <p class="section-title">STATUS PESANAN</p><table><thead><tr><th>Status</th><th class="text-right">Jumlah</th></tr></thead><tbody><tr><td>Baru</td><td class="text-right">${reportStats.statusCount.pending}</td></tr><tr><td>Dimasak</td><td class="text-right">${reportStats.statusCount.cooking}</td></tr><tr><td>Siap</td><td class="text-right">${reportStats.statusCount.ready}</td></tr><tr><td>Selesai</td><td class="text-right">${reportStats.statusCount.completed}</td></tr><tr><td>Batal</td><td class="text-right">${reportStats.statusCount.cancelled}</td></tr></tbody></table>
        ${topMenus.length > 0 ? `<p class="section-title">MENU TERLARIS</p><table><thead><tr><th>#</th><th>Menu</th><th class="text-right">Qty</th><th class="text-right">Omset</th></tr></thead><tbody>${topMenus.map(([name, data], idx) => `<tr><td>${idx + 1}</td><td>${name}</td><td class="text-right">${data.qty}×</td><td class="text-right">${rp(data.revenue)}</td></tr>`).join('')}</tbody></table>` : ''}
        <div class="footer">Dicetak ${reportNow ? reportNow.toLocaleString('id-ID') : ''} · NexaFlow SaaS</div></body></html>
    `;
    printHTML(html);
  };

  const activeOrders = orders.filter(o => ['pending', 'cooking', 'ready'].includes(o.status));
  const filteredOrders = queueFilter === 'active' ? activeOrders : queueFilter === 'done' ? orders.filter(o => ['completed', 'cancelled'].includes(o.status)) : orders;
  const displayOrders = (() => { const arr = [...filteredOrders]; if (queueFilter === 'active') arr.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)); else arr.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); return arr; })();
  const todayOrders = todayStr ? orders.filter(o => new Date(o.created_at).toDateString() === todayStr) : [];
  const stats = { total: todayOrders.length, cooking: todayOrders.filter(o => o.status === 'cooking').length, ready: todayOrders.filter(o => o.status === 'ready').length, revenue: todayOrders.filter(o => o.payment_status === 'paid').reduce((sum, o) => sum + Number(o.total_price), 0) };

  let reportOrders = []; let reportStats = { totalOrders: 0, revenue: 0, paidCount: 0, totalItems: 0, avgOrder: 0, statusCount: { pending: 0, cooking: 0, ready: 0, completed: 0, cancelled: 0 } }; let topMenus = []; let activeDays = []; let reportLabel = 'Memuat...'; let monthName = '';
  if (reportNow) {
    let startD, endD;
    if (reportMode === 'daily') { const baseD = reportDateStr ? new Date(reportDateStr + 'T00:00:00') : reportNow; startD = new Date(baseD.getFullYear(), baseD.getMonth(), baseD.getDate()); endD = new Date(startD.getTime() + 24 * 60 * 60 * 1000); } 
    else if (reportMode === 'monthly') { startD = new Date(reportYear, reportMonth, 1); endD = new Date(reportYear, reportMonth + 1, 1); } 
    else { const startBase = reportStartDateStr ? new Date(reportStartDateStr + 'T00:00:00') : new Date(reportNow.getFullYear(), reportNow.getMonth(), 1); const endBase = reportEndDateStr ? new Date(reportEndDateStr + 'T00:00:00') : reportNow; startD = new Date(startBase.getFullYear(), startBase.getMonth(), startBase.getDate()); endD = new Date(endBase.getFullYear(), endBase.getMonth(), endBase.getDate() + 1); }
    reportOrders = orders.filter(o => { const d = new Date(o.created_at); return d >= startD && d < endD; });
    reportStats = { totalOrders: reportOrders.length, revenue: reportOrders.filter(o => o.payment_status === 'paid').reduce((s, o) => s + Number(o.total_price || 0), 0), paidCount: reportOrders.filter(o => o.payment_status === 'paid').length, totalItems: reportOrders.reduce((s, o) => s + (o.items || []).reduce((si, i) => si + (i.qty || 0), 0), 0), statusCount: { pending: reportOrders.filter(o => o.status === 'pending').length, cooking: reportOrders.filter(o => o.status === 'cooking').length, ready: reportOrders.filter(o => o.status === 'ready').length, completed: reportOrders.filter(o => o.status === 'completed').length, cancelled: reportOrders.filter(o => o.status === 'cancelled').length, }, };
    reportStats.avgOrder = reportStats.paidCount > 0 ? reportStats.revenue / reportStats.paidCount : 0;
    const menuSales = {}; reportOrders.forEach(o => { (o.items || []).forEach(item => { const key = item.name || 'Unknown'; if (!menuSales[key]) menuSales[key] = { qty: 0, revenue: 0 }; menuSales[key].qty += item.qty || 0; menuSales[key].revenue += (item.price || 0) * (item.qty || 0); }); }); topMenus = Object.entries(menuSales).sort((a, b) => b[1].qty - a[1].qty).slice(0, 5);
    const dailyMap = {}; reportOrders.forEach(o => { const d = new Date(o.created_at); const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; if (!dailyMap[key]) dailyMap[key] = { date: d, orders: 0, revenue: 0 }; dailyMap[key].orders += 1; if (o.payment_status === 'paid') dailyMap[key].revenue += Number(o.total_price || 0); }); activeDays = Object.values(dailyMap).sort((a, b) => a.date - b.date);
    if (reportMode === 'daily') reportLabel = startD.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); else if (reportMode === 'monthly') reportLabel = new Date(reportYear, reportMonth, 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }); else { const s = startD.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }); const e = new Date(endD.getTime() - 24 * 60 * 60 * 1000).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }); reportLabel = `${s} - ${e}`; }
    monthName = reportNow.toLocaleDateString('id-ID', { month: 'short' });
  }

  const chartData = []; if (reportNow) { for (let i = 6; i >= 0; i--) { const d = new Date(reportNow.getFullYear(), reportNow.getMonth(), reportNow.getDate() - i); const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()); const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000); const dayOrders = orders.filter(o => { const od = new Date(o.created_at); return od >= dayStart && od < dayEnd; }); const dayRev = dayOrders.filter(o => o.payment_status === 'paid').reduce((s, o) => s + Number(o.total_price || 0), 0); chartData.push({ label: d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }), revenue: dayRev, orders: dayOrders.length, }); } }
  const maxChartRev = Math.max(...chartData.map(c => c.revenue), 1); const totalChartRev = chartData.reduce((s, c) => s + c.revenue, 0);

  const filteredMenus = menus.filter(m => { const matchSearch = !menuSearch || m.name.toLowerCase().includes(menuSearch.toLowerCase()) || (m.description || '').toLowerCase().includes(menuSearch.toLowerCase()); const matchCat = menuCategoryFilter === 'all' || m.category === menuCategoryFilter; return matchSearch && matchCat; });
  const showDailyBreakdown = reportMode === 'monthly' || reportMode === 'custom';
  const statusColors = { pending: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' }, cooking: { bg: 'bg-[var(--primary-light)]', border: 'border-[var(--primary-color)]', text: 'text-[var(--primary-color)]' }, ready: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' }, completed: { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700' }, cancelled: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700' }, };
  const pageTitle = { queue: 'Antrian Pesanan', menu: 'Kelola Menu', tables: 'Meja & QR Code', reports: 'Laporan Penjualan', settings: 'Pengaturan Toko' }[activeTab];
  const pageSubtitle = { queue: 'Kelola dan proses pesanan masuk secara real-time', menu: 'Atur daftar menu, harga, dan ketersediaan', tables: 'Generate dan kelola QR code per meja', reports: 'Ringkasan omset harian, bulanan & custom', settings: 'Konfigurasi profil dan identitas kafe' }[activeTab];
  const getStatusPill = (status) => ({ pending: 'status-pending', cooking: 'status-cooking', ready: 'status-ready', completed: 'status-completed', cancelled: 'status-cancelled' }[status] || 'status-completed');
  const getStatusLabel = (status) => ({ pending: 'Baru', cooking: 'Dimasak', ready: 'Siap', completed: 'Selesai', cancelled: 'Batal' }[status] || status);
  const getTimeBadge = (createdAt) => { if (!nowTick) return null; const mins = Math.floor((nowTick - new Date(createdAt).getTime()) / 60000); if (mins < 0) return null; if (mins < 5) return { mins, cls: 'bg-slate-100 border-slate-200 text-slate-600', pulse: false }; if (mins < 15) return { mins, cls: 'bg-amber-50 border-amber-300 text-amber-700', pulse: false }; return { mins, cls: 'bg-rose-50 border-rose-300 text-rose-700', pulse: true }; };

  // ==========================================
  // BLOKIR JIKA MASA AKTIF HABIS (EXPIRED)
  // ==========================================
  if (isExpired) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans ${theme === 'light' ? 'bg-[#F4EFE9]' : 'bg-slate-950'}`}>
        <div className={`absolute inset-0 opacity-10 ${theme === 'light' ? 'bg-[radial-gradient(#3A2A20_1px,transparent_1px)]' : 'bg-[radial-gradient(#ffffff_1px,transparent_1px)]'} bg-[size:20px_20px]`}></div>
        <div className={`rounded-[2rem] p-8 sm:p-12 max-w-lg w-full text-center shadow-2xl relative z-10 border ${theme === 'light' ? 'bg-white border-[#E3DCD1]' : 'bg-slate-900 border-slate-800'}`}>
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ${theme === 'light' ? 'bg-rose-100 text-rose-500' : 'bg-rose-500/20 text-rose-400'}`}><Icons.Lock /></div>
          <h1 className={`text-3xl font-black mb-2 ${theme === 'light' ? 'text-[#3A2A20]' : 'text-white'}`}>Masa Trial Berakhir</h1>
          <p className={`font-medium mb-8 ${theme === 'light' ? 'text-[#8C7A6B]' : 'text-slate-400'}`}>Masa percobaan 7 hari Anda telah selesai. Untuk melanjutkan penggunaan NexaFlow dan mengelola pesanan, silakan perpanjang langganan Anda.</p>
          <div className="space-y-3">
            <a href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Halo Admin NexaFlow, saya ingin memperpanjang langganan kafe saya: ' + cafeName)}`} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-[var(--primary-color)] hover:bg-[var(--primary-dark)] text-white font-bold py-4 rounded-xl shadow-lg shadow-[var(--primary-color)]/30 transition-all active:scale-95 text-lg"><Icons.WhatsApp /> Perpanjang Sekarang</a>
            <a href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Halo Tim Developer NexaFlow, saya butuh konsultasi gratis mengenai sistem.' )}`} target="_blank" rel="noopener noreferrer" className={`w-full flex items-center justify-center gap-2 font-bold py-4 rounded-xl transition-all border active:scale-95 ${theme === 'light' ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'}`}>Konsultasi Gratis Tim Developer</a>
          </div>
          <button onClick={handleLogout} className={`mt-8 text-xs font-bold underline ${theme === 'light' ? 'text-slate-400 hover:text-slate-600' : 'text-slate-500 hover:text-slate-300'}`}>Keluar Akun</button>
        </div>
      </div>
    );
  }

  if (!tenantId) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'light' ? 'bg-[#F4EFE9]' : 'bg-slate-950'}`}>
        <div className="text-center">
          <div className={`w-16 h-16 border-4 border-t-[var(--primary-color)] rounded-full animate-spin mx-auto mb-4 ${theme === 'light' ? 'border-[#E3DCD1]' : 'border-slate-800'}`}></div>
          <h2 className={`text-xl font-black ${theme === 'light' ? 'text-[#3A2A20]' : 'text-white'}`}>Memuat Dashboard...</h2>
        </div>
      </div>
    );
  }

  // VARIABEL UNTUK STYLING TEMA
  const bgClass = theme === 'light' ? 'bg-[#F4EFE9]' : 'bg-slate-950';
  const textMainClass = theme === 'light' ? 'text-[#3A2A20]' : 'text-slate-100';
  const textSubClass = theme === 'light' ? 'text-[#8C7A6B]' : 'text-slate-400';
  const cardClass = theme === 'light' ? 'bg-white border-[#E3DCD1]' : 'bg-slate-900 border-slate-800';
  const headerClass = theme === 'light' ? 'bg-[#F4EFE9]/90 border-[#E3DCD1]' : 'bg-slate-900/90 border-slate-800';
  const navBtnClass = (isActive) => `relative flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all duration-200 ${isActive ? 'bg-[var(--primary-light)] text-[var(--primary-color)] shadow-sm' : theme === 'light' ? 'text-[#8C7A6B] hover:text-[#3A2A20] hover:bg-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`;
  const inputClass = `w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]/20 focus:border-[var(--primary-color)] font-medium ${theme === 'light' ? 'border-[#E3DCD1] bg-white text-[#3A2A20]' : 'border-slate-700 bg-slate-800 text-white'}`;

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${bgClass} ${textMainClass}`}>
      
      <header className={`backdrop-blur-xl border-b sticky top-0 z-50 print:hidden transition-colors duration-300 ${headerClass}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-20">
            
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary-color)] to-[var(--primary-dark)] flex items-center justify-center shadow-lg shadow-[var(--primary-color)]/30"><span className="text-white font-black text-lg">N</span></div>
              <div><h1 className={`text-lg font-black tracking-tight leading-none ${theme === 'light' ? 'text-[#3A2A20]' : 'text-white'}`}>NexaFlow</h1><p className="text-[10px] font-bold text-[var(--primary-color)] tracking-widest uppercase mt-0.5">Kasir</p></div>
            </div>

            <nav className="hidden md:flex items-center gap-1">
              {[{ key: 'queue', label: 'Antrian', Icon: Icons.Clipboard, badge: activeOrders.length },{ key: 'menu', label: 'Menu', Icon: Icons.Utensils },{ key: 'tables', label: 'Meja', Icon: Icons.Grid },{ key: 'reports', label: 'Laporan', Icon: Icons.Chart },{ key: 'settings', label: 'Pengaturan', Icon: Icons.Settings },].map(({ key, label, Icon, badge }) => (
                <button key={key} onClick={() => setActiveTab(key)} className={navBtnClass(activeTab === key)}><Icon /><span>{label}</span>{badge > 0 && <span className="absolute top-1 right-1 bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-sm">{badge}</span>}</button>
              ))}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`md:hidden p-2 rounded-xl transition-colors ${theme === 'light' ? 'text-[#3A2A20] hover:bg-white' : 'text-slate-300 hover:bg-slate-800'}`}><Icons.Menu /></button>
              <button onClick={openKitchenLink} className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl shadow-md transition-all text-xs font-bold ${theme === 'light' ? 'bg-[#3A2A20] hover:bg-[#2A1F17] text-white shadow-[#3A2A20]/20' : 'bg-slate-800 hover:bg-slate-700 text-white shadow-slate-900/20'}`}>🍳 <span className="hidden lg:inline">Layar Dapur</span></button>
              <div className={`hidden lg:flex items-center gap-2 px-3 py-2 rounded-2xl border ${realtimeStatus === 'online' ? 'bg-emerald-500/10 border-emerald-500/30' : realtimeStatus === 'offline' ? 'bg-rose-500/10 border-rose-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}><span className={`w-2 h-2 rounded-full ${realtimeStatus === 'online' ? 'bg-emerald-500 animate-pulse' : realtimeStatus === 'offline' ? 'bg-rose-500' : 'bg-amber-500 animate-pulse'}`}></span><span className={`text-[11px] font-bold ${realtimeStatus === 'online' ? 'text-emerald-500' : realtimeStatus === 'offline' ? 'text-rose-500' : 'text-amber-500'}`}>{realtimeStatus === 'online' ? 'Online' : 'Offline'}</span></div>
              
              {/* TOMBOL TOGGLE TEMA */}
              <button onClick={toggleTheme} className={`p-2.5 rounded-2xl border transition-all shadow-sm ${theme === 'light' ? 'bg-white border-[#E3DCD1] text-[#3A2A20] hover:bg-[#F4EFE9]' : 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700'}`} title="Ganti Tema">
                {theme === 'light' ? <Icons.Moon /> : <Icons.Sun />}
              </button>

              <button onClick={handleSoundToggle} className={`p-2.5 rounded-2xl border transition-all ${!audioUnlocked ? 'bg-[var(--primary-color)] border-[var(--primary-dark)] text-white shadow-md shadow-[var(--primary-color)]/30' : soundEnabled ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600' : theme === 'light' ? 'bg-white border-[#E3DCD1] text-[#8C7A6B]' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>{!audioUnlocked ? <span className="text-xs font-bold">🔕 ON</span> : soundEnabled ? <span className="text-lg">🔊</span> : <span className="text-lg">🔇</span>}</button>
              <button onClick={toggleFullscreen} className={`hidden sm:block p-2.5 rounded-2xl border transition-all shadow-sm ${theme === 'light' ? 'bg-white border-[#E3DCD1] text-[#3A2A20] hover:bg-[#F4EFE9]' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'}`}>{isFullscreen ? <Icons.Shrink /> : <Icons.Expand />}</button>
              <button onClick={handleLogout} className={`p-2.5 rounded-2xl border transition-all shadow-sm ${theme === 'light' ? 'bg-white border-[#E3DCD1] text-[#8C7A6B] hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/30'}`}><Icons.Logout /></button>
            </div>
          </div>
        </div>
        
        {isMobileMenuOpen && (
          <div className={`md:hidden border-t p-4 space-y-2 absolute w-full shadow-xl z-50 ${theme === 'light' ? 'bg-white border-[#E3DCD1]' : 'bg-slate-900 border-slate-800'}`}>
            {[{ key: 'queue', label: 'Antrian', Icon: Icons.Clipboard, badge: activeOrders.length },{ key: 'menu', label: 'Menu', Icon: Icons.Utensils },{ key: 'tables', label: 'Meja', Icon: Icons.Grid },{ key: 'reports', label: 'Laporan', Icon: Icons.Chart },{ key: 'settings', label: 'Pengaturan', Icon: Icons.Settings },].map(({ key, label, Icon, badge }) => (
              <button key={key} onClick={() => { setActiveTab(key); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === key ? 'bg-[var(--primary-light)] text-[var(--primary-color)]' : theme === 'light' ? 'text-[#8C7A6B] hover:bg-[#F4EFE9]' : 'text-slate-400 hover:bg-slate-800'}`}><Icon /> {label}{badge > 0 && <span className="ml-auto bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full">{badge}</span>}</button>
            ))}
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`rounded-[2rem] p-6 shadow-sm border relative overflow-hidden group transition-colors duration-300 ${cardClass}`}><div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-[4rem] -z-10 group-hover:scale-110 transition-transform ${theme === 'light' ? 'bg-[#F4EFE9]' : 'bg-slate-800/50'}`}></div><div className="flex items-center gap-3 mb-3"><div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${theme === 'light' ? 'bg-[#F4EFE9] text-[#8C7A6B]' : 'bg-slate-800 text-slate-400'}`}><Icons.Clipboard /></div><p className={`text-[11px] font-bold uppercase tracking-widest ${textSubClass}`}>Total Pesanan</p></div><h3 className={`text-4xl font-black tracking-tight ${textMainClass}`}>{stats.total}</h3><p className={`text-xs font-medium mt-1 ${textSubClass}`}>Hari ini</p></div>
          <div className={`rounded-[2rem] p-6 shadow-sm border relative overflow-hidden group transition-colors duration-300 ${cardClass}`}><div className="absolute top-0 right-0 w-24 h-24 bg-[var(--primary-light)] rounded-bl-[4rem] -z-10 group-hover:scale-110 transition-transform"></div><div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-xl bg-[var(--primary-light)] text-[var(--primary-color)] flex items-center justify-center shadow-sm text-xl">👨‍🍳</div><p className="text-[11px] font-bold text-[var(--primary-color)] uppercase tracking-widest">Dimasak</p></div><h3 className="text-4xl font-black text-[var(--primary-color)] tracking-tight">{stats.cooking}</h3><p className={`text-xs font-medium mt-1 ${textSubClass}`}>Sedang diproses</p></div>
          <div className={`rounded-[2rem] p-6 shadow-sm border relative overflow-hidden group transition-colors duration-300 ${cardClass}`}><div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-bl-[4rem] -z-10 group-hover:scale-110 transition-transform"></div><div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 flex items-center justify-center shadow-sm text-xl">🍽️</div><p className="text-[11px] font-bold text-emerald-500 uppercase tracking-widest">Siap Saji</p></div><h3 className="text-4xl font-black text-emerald-600 tracking-tight">{stats.ready}</h3><p className={`text-xs font-medium mt-1 ${textSubClass}`}>Menunggu diantar</p></div>
          <div className="rounded-[2rem] p-6 bg-gradient-to-br from-[var(--primary-color)] to-[var(--primary-dark)] shadow-[0_8px_30px_var(--primary-color)] relative overflow-hidden group text-white border border-[var(--primary-dark)]"><div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div><div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shadow-inner text-xl backdrop-blur-sm">💰</div><p className="text-[11px] font-bold text-white/80 uppercase tracking-widest">Omset Hari Ini</p></div><h3 className="text-3xl font-black tracking-tight drop-shadow-md">{rp(stats.revenue)}</h3><p className="text-xs text-white/80 font-medium mt-1">Total pendapatan</p></div>
        </div>

        <div className="bg-transparent mt-6">
          {activeTab === 'queue' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className={`flex items-center gap-1 rounded-2xl p-1 w-fit border shadow-sm ${theme === 'light' ? 'bg-[#E3DCD1]/50 border-[#E3DCD1]' : 'bg-slate-900 border-slate-800'}`}>
                  {[{k:'active',l:'Aktif'},{k:'done',l:'Selesai'},{k:'all',l:'Semua'}].map(({k,l}) => (<button key={k} onClick={() => setQueueFilter(k)} className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${queueFilter === k ? (theme === 'light' ? 'bg-white text-[#3A2A20] shadow-sm' : 'bg-slate-700 text-white shadow-sm') : textSubClass}`}>{l}</button>))}
                </div>
                {queueFilter === 'active' && <p className={`text-[11px] font-medium flex items-center gap-1.5 ${textSubClass}`}><Icons.Clock /> Urut dari yang paling lama menunggu</p>}
              </div>

              {displayOrders.length === 0 ? (
                <div className={`rounded-[2rem] p-20 text-center border shadow-sm ${cardClass}`}><div className={`w-20 h-20 mx-auto mb-4 rounded-[1.5rem] flex items-center justify-center text-4xl shadow-inner border ${theme === 'light' ? 'bg-[#F4EFE9] border-[#E3DCD1]' : 'bg-slate-800 border-slate-700'}`}>📋</div><p className={`font-bold text-lg ${textMainClass}`}>Tidak ada antrian pesanan</p><p className={`text-sm mt-1 ${textSubClass}`}>Pesanan baru akan muncul otomatis</p></div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {displayOrders.map(order => {
                    const badge = ['pending', 'cooking', 'ready'].includes(order.status) ? getTimeBadge(order.created_at) : null;
                    return (
                      <div key={order.id} className={`rounded-[2rem] overflow-hidden shadow-sm border flex flex-col hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ${cardClass}`}>
                        <div className={`px-6 py-5 border-b flex justify-between items-center ${theme === 'light' ? 'bg-gradient-to-br from-[#F4EFE9] to-white border-[#E3DCD1]' : 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700'}`}>
                          <div><p className={`text-[10px] font-bold uppercase tracking-widest ${textSubClass}`}>Meja {order.table_number}</p><p className={`text-2xl font-black leading-tight truncate max-w-[150px] ${textMainClass}`}>{order.customer_name || 'Tamu'}</p></div>
                          <span className={`status-pill shadow-sm ${getStatusPill(order.status)}`}>{getStatusLabel(order.status)}</span>
                        </div>
                        <div className="px-6 py-5 space-y-4 flex-1 flex flex-col">
                          <div className={`flex items-center justify-between gap-2 text-[11px] font-semibold ${textSubClass}`}>
                            <span>#{order.id.slice(0, 8).toUpperCase()}</span>
                            <div className="flex items-center gap-2">
                              {badge && (<span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[10px] font-black shadow-sm ${badge.cls} ${badge.pulse ? 'animate-pulse' : ''}`}><Icons.Clock /> {badge.mins}m</span>)}
                              <span>{new Date(order.created_at).toLocaleTimeString('id-ID', {hour:'2-digit',minute:'2-digit'})}</span>
                            </div>
                          </div>
                          {order.order_note && (<div className="bg-amber-500/10 border-l-4 border-amber-500 p-3 rounded-r-xl text-xs font-bold text-amber-600 shadow-sm">📝 Catatan: {order.order_note}</div>)}
                          <div className="space-y-3 pt-1 flex-1">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-start gap-3">
                                <div className="flex-1"><span className={`font-bold text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>{item.qty}× {item.name}</span>{item.note && (<p className={`text-[11px] font-bold mt-1 italic inline-block px-2 py-0.5 rounded ${theme === 'light' ? 'text-[var(--primary-color)] bg-[var(--primary-light)]' : 'text-cyan-400 bg-cyan-400/10'}`}>↳ "{item.note}"</p>)}</div>
                                <span className={`font-bold text-sm whitespace-nowrap ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{rp(item.price * item.qty)}</span>
                              </div>
                            ))}
                          </div>
                          <div className={`pt-4 border-t flex justify-between items-center ${theme === 'light' ? 'border-slate-100' : 'border-slate-800'}`}><span className={`text-xs font-bold ${textSubClass}`}>Total Tagihan</span><span className="text-xl font-black text-[var(--primary-color)]">{rp(order.total_price)}</span></div>
                          {order.status !== 'completed' && order.status !== 'cancelled' && (
                            <div className="space-y-2 pt-2">
                              <div className="grid grid-cols-2 gap-2"><button onClick={() => handleUpdateOrderStatus(order.id, 'cooking')} className={`font-bold py-2.5 rounded-xl text-xs transition-all shadow-sm active:scale-95 border ${theme === 'light' ? 'bg-[var(--primary-light)] hover:bg-[var(--primary-color)] hover:text-white border-[var(--primary-color)] text-[var(--primary-color)]' : 'bg-slate-800 hover:bg-[var(--primary-color)] border-slate-700 text-[var(--primary-color)] hover:text-white'}`}>Masak</button><button onClick={() => handleUpdateOrderStatus(order.id, 'ready')} className="bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 hover:text-white border border-emerald-500/30 font-bold py-2.5 rounded-xl text-xs transition-all shadow-sm active:scale-95">Sajikan</button></div>
                              <button onClick={() => handleUpdateOrderStatus(order.id, 'completed')} className={`w-full font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all ${theme === 'light' ? 'bg-[#3A2A20] hover:bg-[#2A1F17] text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'}`}>Selesai / Lunas</button>
                              <button onClick={() => handleCancelOrder(order.id)} className="w-full bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/30 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"><Icons.X /> Tolak Pesanan</button>
                            </div>
                          )}
                          <div className="pt-2 mt-auto"><button onClick={() => printBillWithQRIS(order)} className="w-full bg-gradient-to-r from-[var(--primary-color)] to-[var(--primary-dark)] text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[var(--primary-color)]/30 active:scale-95 border border-[var(--primary-dark)]"><Icons.Print /> Cetak Bill & QRIS</button></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'menu' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"><div><h3 className={`font-black text-xl ${textMainClass}`}>Daftar Menu</h3><p className={`text-xs mt-1 ${textSubClass}`}>{filteredMenus.length} dari {menus.length} menu</p></div><button onClick={() => { setCurrentMenu({ id: null, name: '', category: 'makanan', price: '', desc: '', status: 'available', image_url: '' }); setIsMenuModalOpen(true); }} className="bg-gradient-to-r from-[var(--primary-color)] to-[var(--primary-dark)] text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-[var(--primary-color)]/30 active:scale-95 transition-all border border-[var(--primary-dark)]"><Icons.Plus /> Tambah Menu</button></div>
              <div className={`flex flex-col sm:flex-row gap-3 p-2 rounded-2xl shadow-sm border ${cardClass}`}><div className="relative flex-1"><span className={`absolute left-3 top-1/2 -translate-y-1/2 ${textSubClass}`}><Icons.Search /></span><input type="text" value={menuSearch} onChange={e => setMenuSearch(e.target.value)} placeholder="Cari menu..." className={`w-full pl-10 pr-4 py-2.5 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]/20 font-medium ${theme === 'light' ? 'bg-[#F4EFE9] text-[#3A2A20]' : 'bg-slate-800 text-white'}`} /></div><div className={`flex items-center gap-1 rounded-xl p-1 overflow-x-auto ${theme === 'light' ? 'bg-[#F4EFE9]' : 'bg-slate-800'}`}>{[{k:'all',l:'Semua'},{k:'makanan',l:'Makanan'},{k:'minuman',l:'Minuman'},{k:'cemilan',l:'Cemilan'}].map(({k,l}) => (<button key={k} onClick={() => setMenuCategoryFilter(k)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${menuCategoryFilter === k ? (theme === 'light' ? 'bg-white text-[var(--primary-color)] shadow-sm border border-[#E3DCD1]' : 'bg-slate-700 text-white shadow-sm') : textSubClass}`}>{l}</button>))}</div></div>
              {filteredMenus.length === 0 ? (<div className={`rounded-[2rem] p-20 text-center shadow-sm border ${cardClass}`}><div className="text-5xl mb-3 opacity-50">🔍</div><p className={`font-bold text-lg ${textMainClass}`}>Tidak ada menu</p></div>) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">{filteredMenus.map(menu => (<div key={menu.id} className={`rounded-[2rem] overflow-hidden flex flex-col border shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ${cardClass}`}><div className={`h-48 relative overflow-hidden ${theme === 'light' ? 'bg-[#F4EFE9]' : 'bg-slate-800'}`}>{menu.image_url ? <img src={menu.image_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-5xl">🍽️</div>}<div className="absolute top-4 left-4 z-10"><button onClick={() => toggleMenuStatus(menu)} className={`text-[10px] font-bold px-3 py-1.5 rounded-xl shadow-md transition-all backdrop-blur-md ${menu.status === 'available' ? 'bg-rose-600/90 hover:bg-rose-700 text-white' : 'bg-emerald-500/90 hover:bg-emerald-600 text-white'}`}>{menu.status === 'available' ? '⛔ Set Habis' : '✅ Set Tersedia'}</button></div><div className="absolute top-4 right-4"><span className={`text-[10px] font-bold px-3 py-1.5 rounded-xl shadow-sm ${menu.status === 'available' ? 'bg-emerald-500 text-white shadow-emerald-500/30' : 'bg-rose-500 text-white shadow-rose-500/30'}`}>{menu.status === 'available' ? 'Tersedia' : 'Habis'}</span></div></div><div className="p-5 flex-1 flex flex-col justify-between"><div><span className="text-[9px] font-bold text-[var(--primary-color)] uppercase tracking-widest">{menu.category}</span><h4 className={`font-black text-lg mt-1 ${textMainClass}`}>{menu.name}</h4><p className={`text-xs font-medium line-clamp-2 mt-1 min-h-[2rem] ${textSubClass}`}>{menu.description || 'Tidak ada deskripsi'}</p><p className="font-black text-[var(--primary-color)] text-xl mt-3">{rp(menu.price)}</p></div><div className="flex gap-2 mt-5"><button onClick={() => { setCurrentMenu({ ...menu, desc: menu.description || '' }); setIsMenuModalOpen(true); }} className={`flex-1 font-bold py-2.5 rounded-xl text-xs transition-colors ${theme === 'light' ? 'bg-[#F4EFE9] hover:bg-[#E3DCD1] text-[#3A2A20]' : 'bg-slate-800 hover:bg-slate-700 text-white'}`}>Edit</button><button onClick={() => handleDeleteMenu(menu.id)} className={`flex-1 font-bold py-2.5 rounded-xl text-xs transition-colors ${theme === 'light' ? 'bg-rose-50 hover:bg-rose-100 text-rose-600' : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400'}`}>Hapus</button></div></div></div>))}</div>
              )}
            </div>
          )}

          {activeTab === 'tables' && (
            <div className={`rounded-[2rem] p-6 sm:p-8 border shadow-sm ${cardClass}`}>
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8"><div><h3 className={`font-black text-xl ${textMainClass}`}>QR Code Meja</h3><p className={`text-xs mt-1 ${textSubClass}`}>{tables.length} meja terdaftar · Klik "Cetak QR" untuk cetak per meja</p></div><form onSubmit={handleAddTable} className="flex gap-2 w-full sm:w-auto"><input type="number" required value={newTableNum} onChange={e => setNewTableNum(e.target.value)} placeholder="No Meja" className={`border rounded-xl px-4 py-2.5 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]/20 font-bold ${theme === 'light' ? 'border-[#E3DCD1] bg-[#F4EFE9] text-[#3A2A20]' : 'border-slate-700 bg-slate-800 text-white'}`} /><button type="submit" className={`px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition-colors ${theme === 'light' ? 'bg-[#3A2A20] text-white hover:bg-[#2A1F17]' : 'bg-slate-700 text-white hover:bg-slate-600'}`}>Tambah</button></form></div>
              {tables.length === 0 ? (<div className="text-center py-20"><div className={`w-20 h-20 mx-auto mb-4 rounded-3xl flex items-center justify-center text-4xl border shadow-inner ${theme === 'light' ? 'bg-[#F4EFE9] border-[#E3DCD1]' : 'bg-slate-800 border-slate-700'}`}>🪑</div><p className={`font-bold text-lg ${textMainClass}`}>Belum ada meja</p></div>) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">{tables.map(t => (<div key={t.id} className={`border rounded-3xl p-5 text-center group hover:shadow-lg transition-all duration-300 ${theme === 'light' ? 'bg-[#F4EFE9] border-[#E3DCD1] hover:bg-white' : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800'}`}><p className={`font-black text-lg mb-4 ${textMainClass}`}>Meja {t.table_number}</p><img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${baseUrl}/order?tenant=${tenantId}&table=${t.table_number}`)}`} className="w-full rounded-2xl mb-4 shadow-sm border border-slate-200" alt="QR" /><div className="flex gap-2"><button onClick={() => printTableQR(t)} className={`flex-1 text-white text-[11px] font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md ${theme === 'light' ? 'bg-[#3A2A20] hover:bg-[#2A1F17]' : 'bg-slate-700 hover:bg-slate-600'}`}><Icons.Print /> Cetak QR</button><button onClick={() => handleDeleteTable(t.id)} className={`text-[11px] rounded-xl px-3 font-bold transition-colors ${theme === 'light' ? 'bg-rose-50 hover:bg-rose-100 text-rose-600' : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400'}`}>Hapus</button></div></div>))}</div>
              )}
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex flex-wrap items-center gap-2"><div className={`flex items-center gap-1 rounded-2xl p-1.5 border shadow-sm ${theme === 'light' ? 'bg-white border-[#E3DCD1]' : 'bg-slate-900 border-slate-800'}`}><button onClick={() => setReportMode('daily')} className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${reportMode === 'daily' ? (theme === 'light' ? 'bg-[#3A2A20] text-white shadow-md' : 'bg-slate-700 text-white shadow-md') : textSubClass}`}>📅 Harian</button><button onClick={() => setReportMode('monthly')} className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${reportMode === 'monthly' ? (theme === 'light' ? 'bg-[#3A2A20] text-white shadow-md' : 'bg-slate-700 text-white shadow-md') : textSubClass}`}>📊 Bulanan</button><button onClick={() => setReportMode('custom')} className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${reportMode === 'custom' ? (theme === 'light' ? 'bg-[#3A2A20] text-white shadow-md' : 'bg-slate-700 text-white shadow-md') : textSubClass}`}>📆 Custom</button></div></div>
                <div className="flex items-center gap-3"><button onClick={() => exportCSV(reportOrders, reportLabel)} disabled={!reportNow || reportOrders.length === 0} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-500/20 transition-all"><Icons.Download /> Export CSV</button><button onClick={() => printReport(reportStats, topMenus, reportLabel)} disabled={!reportNow} className={`flex items-center gap-2 px-4 py-2.5 disabled:opacity-40 text-white text-xs font-bold rounded-xl shadow-md transition-all ${theme === 'light' ? 'bg-[#3A2A20] hover:bg-[#2A1F17]' : 'bg-slate-700 hover:bg-slate-600'}`}><Icons.Print /> Print</button></div>
              </div>

              {reportNow && (
                <div className={`rounded-[2rem] p-6 border shadow-sm ${cardClass}`}>
                  {reportMode === 'daily' && (<div className="flex items-center gap-4 flex-wrap"><label className={`text-xs font-bold flex items-center gap-2 ${textSubClass}`}><Icons.Calendar /> Pilih Tanggal:</label><input type="date" value={reportDateStr} onChange={e => setReportDateStr(e.target.value)} max={reportNow.toISOString().slice(0, 10)} className={`border rounded-xl px-4 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]/20 ${theme === 'light' ? 'border-[#E3DCD1] bg-[#F4EFE9] text-[#3A2A20]' : 'border-slate-700 bg-slate-800 text-white'}`} /></div>)}
                  {reportMode === 'monthly' && (<div className="flex items-center gap-4 flex-wrap"><label className={`text-xs font-bold flex items-center gap-2 ${textSubClass}`}><Icons.Calendar /> Pilih Bulan:</label><select value={reportMonth} onChange={e => setReportMonth(Number(e.target.value))} className={`border rounded-xl px-4 py-2 text-sm font-bold focus:outline-none ${theme === 'light' ? 'border-[#E3DCD1] bg-[#F4EFE9] text-[#3A2A20]' : 'border-slate-700 bg-slate-800 text-white'}`}>{MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}</select><select value={reportYear} onChange={e => setReportYear(Number(e.target.value))} className={`border rounded-xl px-4 py-2 text-sm font-bold focus:outline-none ${theme === 'light' ? 'border-[#E3DCD1] bg-[#F4EFE9] text-[#3A2A20]' : 'border-slate-700 bg-slate-800 text-white'}`}>{reportNow && Array.from({ length: reportNow.getFullYear() - 2023 }, (_, i) => 2024 + i).map(y => <option key={y} value={y}>{y}</option>)}</select></div>)}
                  {reportMode === 'custom' && (<div className="flex items-center gap-4 flex-wrap"><label className={`text-xs font-bold flex items-center gap-2 ${textSubClass}`}><Icons.Calendar /> Dari:</label><input type="date" value={reportStartDateStr} onChange={e => setReportStartDateStr(e.target.value)} max={reportNow.toISOString().slice(0, 10)} className={`border rounded-xl px-4 py-2 text-sm font-bold focus:outline-none ${theme === 'light' ? 'border-[#E3DCD1] bg-[#F4EFE9] text-[#3A2A20]' : 'border-slate-700 bg-slate-800 text-white'}`} /><label className={`text-xs font-bold ${textSubClass}`}>Sampai:</label><input type="date" value={reportEndDateStr} onChange={e => setReportEndDateStr(e.target.value)} max={reportNow.toISOString().slice(0, 10)} className={`border rounded-xl px-4 py-2 text-sm font-bold focus:outline-none ${theme === 'light' ? 'border-[#E3DCD1] bg-[#F4EFE9] text-[#3A2A20]' : 'border-slate-700 bg-slate-800 text-white'}`} /></div>)}
                  <div className={`mt-4 pt-4 border-t flex items-center gap-3 ${theme === 'light' ? 'border-slate-100' : 'border-slate-800'}`}><p className={`text-[10px] font-bold uppercase tracking-widest ${textSubClass}`}>Periode:</p><p className={`text-sm font-black px-3 py-1 rounded-lg inline-block ${theme === 'light' ? 'text-[#3A2A20] bg-[#E3DCD1]' : 'text-white bg-slate-800'}`}>{reportLabel}</p></div>
                </div>
              )}

              {!reportNow ? (
                <div className={`rounded-[2rem] p-16 text-center shadow-sm ${cardClass}`}><p className={`font-bold ${textMainClass}`}>Memuat laporan...</p></div>
              ) : (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                    <div className={`rounded-[2rem] p-6 border shadow-sm ${cardClass}`}><p className={`text-[11px] font-bold uppercase tracking-widest mb-2 ${textSubClass}`}>Total Pesanan</p><h3 className={`text-4xl font-black ${textMainClass}`}>{reportStats.totalOrders}</h3><p className={`text-xs font-medium mt-1 ${textSubClass}`}>{reportStats.paidCount} lunas</p></div>
                    <div className={`rounded-[2rem] p-6 shadow-lg text-white ${theme === 'light' ? 'bg-gradient-to-br from-[#3A2A20] to-[#2A1F17]' : 'bg-gradient-to-br from-slate-800 to-slate-900'}`}><p className="text-[11px] font-bold text-[var(--primary-color)] uppercase tracking-widest mb-2">Total Omset</p><h3 className="text-3xl font-black">{rp(reportStats.revenue)}</h3><p className="text-xs text-slate-400 font-medium mt-1">Dari pesanan lunas</p></div>
                    <div className={`rounded-[2rem] p-6 border shadow-sm ${cardClass}`}><p className={`text-[11px] font-bold uppercase tracking-widest mb-2 ${textSubClass}`}>Rata-rata / Order</p><h3 className={`text-3xl font-black ${textMainClass}`}>{rp(reportStats.avgOrder)}</h3><p className={`text-xs font-medium mt-1 ${textSubClass}`}>Per transaksi lunas</p></div>
                    <div className={`rounded-[2rem] p-6 border shadow-sm ${cardClass}`}><p className={`text-[11px] font-bold uppercase tracking-widest mb-2 ${textSubClass}`}>Item Terjual</p><h3 className={`text-4xl font-black ${textMainClass}`}>{reportStats.totalItems}</h3><p className={`text-xs font-medium mt-1 ${textSubClass}`}>Total porsi</p></div>
                  </div>

                  <div className={`rounded-[2rem] p-8 border shadow-sm ${cardClass}`}>
                    <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 ${textMainClass}`}><div className="flex items-center gap-3"><Icons.TrendUp /><h3 className="font-black text-lg">Grafik Omzet 7 Hari Terakhir</h3></div></div>
                    {chartData.length > 0 && chartData.every(c => c.revenue === 0) ? (<div className="text-center py-16"><p className="text-5xl mb-3">📈</p><p className={`text-sm font-bold ${textMainClass}`}>Belum ada omzet</p></div>) : (
                      <><div className="h-64 flex items-end gap-2 px-2">{chartData.map((d, i) => (<div key={i} className="flex-1 h-full flex flex-col"><div className="flex-1 relative group"><div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[var(--primary-color)] to-[var(--primary-light)] rounded-t-lg transition-all cursor-default shadow-sm group-hover:from-[var(--primary-dark)]" style={{ height: `${(d.revenue / maxChartRev) * 100}%`, minHeight: d.revenue > 0 ? '4px' : '0' }} title={`${d.label}: ${rp(d.revenue)} (${d.orders} order)`}></div></div><p className={`text-[10px] font-bold mt-2 text-center truncate ${textSubClass}`}>{d.label}</p></div>))}</div><div className={`mt-6 pt-6 border-t flex justify-between text-sm ${theme === 'light' ? 'border-slate-100' : 'border-slate-800'}`}><span className={`font-bold ${textSubClass}`}>Total: <span className="text-[var(--primary-color)] font-black text-lg ml-1">{rp(totalChartRev)}</span></span><span className={`font-bold ${textSubClass}`}>Max hari: <span className={`font-black text-lg ml-1 ${textMainClass}`}>{rp(maxChartRev)}</span></span></div></>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className={`rounded-[2rem] p-8 border shadow-sm ${cardClass}`}>
                      <h3 className={`font-black mb-6 text-lg ${textMainClass}`}>Status Pesanan</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">{[{key:'pending',label:'Baru'},{key:'cooking',label:'Dimasak'},{key:'ready',label:'Siap'},{key:'completed',label:'Selesai'},{key:'cancelled',label:'Batal'}].map(({key,label}) => { const c = statusColors[key]; return (<div key={key} className={`p-5 rounded-2xl border ${c.bg} ${c.border} text-center shadow-sm`}><p className={`text-[10px] font-bold uppercase tracking-widest ${c.text} mb-1`}>{label}</p><p className={`text-3xl font-black ${c.text}`}>{reportStats.statusCount[key] || 0}</p></div>); })}</div>
                    </div>

                    <div className={`rounded-[2rem] p-8 border shadow-sm ${cardClass}`}>
                      <h3 className={`font-black mb-6 text-lg ${textMainClass}`}>🔥 Menu Terlaris</h3>
                      {topMenus.length === 0 ? (<div className="text-center py-10"><p className="text-5xl mb-3">📊</p><p className={`text-sm font-bold ${textMainClass}`}>Belum ada penjualan</p></div>) : (
                        <div className="space-y-5">{topMenus.map(([name, data], idx) => { const maxQty = topMenus[0][1].qty; const pct = maxQty > 0 ? (data.qty / maxQty) * 100 : 0; const rankBg = idx === 0 ? 'bg-amber-500/20 text-amber-600' : idx === 1 ? 'bg-slate-500/20 text-slate-600' : idx === 2 ? 'bg-[var(--primary-light)] text-[var(--primary-color)]' : (theme === 'light' ? 'bg-[#F4EFE9] text-[#8C7A6B]' : 'bg-slate-800 text-slate-400'); return (<div key={name}><div className="flex justify-between items-center mb-2"><div className="flex items-center gap-3 min-w-0"><span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 shadow-sm ${rankBg}`}>{idx + 1}</span><span className={`font-bold text-sm truncate ${textMainClass}`}>{name}</span></div><span className={`text-xs font-bold whitespace-nowrap ml-2 px-2 py-1 rounded-lg ${theme === 'light' ? 'bg-[#F4EFE9] text-[#8C7A6B]' : 'bg-slate-800 text-slate-300'}`}>{data.qty}× · {rp(data.revenue)}</span></div><div className={`h-2.5 rounded-full overflow-hidden ${theme === 'light' ? 'bg-[#F4EFE9]' : 'bg-slate-800'}`}><div className="h-full bg-gradient-to-r from-[var(--primary-color)] to-[var(--primary-dark)] rounded-full transition-all" style={{ width: `${pct}%` }}></div></div></div>); })}</div>
                      )}
                    </div>
                  </div>

                  {showDailyBreakdown && (
                    <div className={`rounded-[2rem] p-8 border shadow-sm ${cardClass}`}>
                      <h3 className={`font-black mb-6 text-lg ${textMainClass}`}>📅 Rincian Per Hari</h3>
                      {activeDays.length === 0 ? (<div className="text-center py-10"><p className="text-5xl mb-3">🗓️</p><p className={`text-sm font-bold ${textMainClass}`}>Belum ada pesanan di periode ini</p></div>) : (
                        <div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead className={theme === 'light' ? 'bg-[#F4EFE9]' : 'bg-slate-800'}><tr><th className={`py-3 px-4 text-[10px] font-bold uppercase tracking-widest rounded-l-xl ${textSubClass}`}>Tanggal</th><th className={`text-right py-3 px-4 text-[10px] font-bold uppercase tracking-widest ${textSubClass}`}>Pesanan</th><th className={`text-right py-3 px-4 text-[10px] font-bold uppercase tracking-widest rounded-r-xl ${textSubClass}`}>Omset</th></tr></thead><tbody>{activeDays.map(d => (<tr key={d.date.toISOString()} className={`border-b transition-colors ${theme === 'light' ? 'border-[#E3DCD1] hover:bg-[#F4EFE9]/50' : 'border-slate-800 hover:bg-slate-800/50'}`}><td className={`py-3 px-4 font-bold ${theme === 'light' ? 'text-[#3A2A20]' : 'text-slate-200'}`}>{d.date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}</td><td className={`text-right py-3 px-4 font-semibold ${textSubClass}`}>{d.orders}</td><td className="text-right py-3 px-4 font-black text-[var(--primary-color)]">{rp(d.revenue)}</td></tr>))}</tbody><tfoot><tr className={`border-t-2 ${theme === 'light' ? 'border-[#3A2A20]' : 'border-slate-600'}`}><td className={`py-4 px-4 font-black ${textMainClass}`}>TOTAL</td><td className={`text-right py-4 px-4 font-black ${textMainClass}`}>{reportStats.totalOrders}</td><td className="text-right py-4 px-4 font-black text-[var(--primary-color)] text-lg">{rp(reportStats.revenue)}</td></tr></tfoot></table></div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className={`rounded-[2rem] p-8 md:p-10 max-w-3xl mx-auto shadow-sm border ${cardClass}`}>
              <div className={`border-b pb-6 mb-8 ${theme === 'light' ? 'border-[#E3DCD1]' : 'border-slate-800'}`}><h3 className={`font-black text-xl ${textMainClass}`}>Profil Toko</h3><p className={`text-sm mt-1 ${textSubClass}`}>Ubah identitas dan kontak kafe Anda</p></div>
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className={`block text-xs font-bold mb-2 ${textSubClass}`}>Logo Kafe</label><div className={`flex items-center gap-4 p-4 rounded-2xl border ${theme === 'light' ? 'bg-[#F4EFE9] border-[#E3DCD1]' : 'bg-slate-800 border-slate-700'}`}>{settings.logo_url ? (<img src={settings.logo_url} className="w-16 h-16 rounded-xl object-cover shadow-sm border border-slate-200" />) : (<div className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl ${theme === 'light' ? 'bg-[#E3DCD1]' : 'bg-slate-700'}`}>🏪</div>)}<div className="flex-1"><input type="file" accept="image/*" ref={logoInputRef} onChange={(e) => handleImageUpload(e, 'logo')} className="hidden" /><button type="button" onClick={() => logoInputRef.current?.click()} className={`w-full py-2 rounded-xl text-xs font-bold shadow-sm transition-colors ${theme === 'light' ? 'bg-white border-[#E3DCD1] hover:bg-[#F4EFE9] text-[#3A2A20]' : 'bg-slate-700 border-slate-600 hover:bg-slate-600 text-white'}`}>{uploadingLogo ? 'Mengupload...' : '📷 Ganti Logo'}</button><p className={`text-[10px] mt-1.5 ${textSubClass}`}>PNG/JPG, maksimal 2MB</p></div></div></div>
                  <div><label className={`block text-xs font-bold mb-2 ${textSubClass}`}>Banner Kafe (Latar Belakang)</label><div className={`flex items-center gap-4 p-4 rounded-2xl border ${theme === 'light' ? 'bg-[#F4EFE9] border-[#E3DCD1]' : 'bg-slate-800 border-slate-700'}`}>{settings.banner_url ? (<img src={settings.banner_url} className="w-24 h-16 rounded-xl object-cover shadow-sm border border-slate-200" />) : (<div className={`w-24 h-16 rounded-xl flex items-center justify-center text-2xl ${theme === 'light' ? 'bg-[#E3DCD1]' : 'bg-slate-700'}`}>🖼️</div>)}<div className="flex-1"><input type="file" accept="image/*" ref={bannerInputRef} onChange={(e) => handleImageUpload(e, 'banner')} className="hidden" /><button type="button" onClick={() => bannerInputRef.current?.click()} className={`w-full py-2 rounded-xl text-xs font-bold shadow-sm transition-colors ${theme === 'light' ? 'bg-white border-[#E3DCD1] hover:bg-[#F4EFE9] text-[#3A2A20]' : 'bg-slate-700 border-slate-600 hover:bg-slate-600 text-white'}`}>{uploadingBanner ? 'Mengupload...' : '📷 Pilih Banner'}</button><p className={`text-[10px] mt-1.5 ${textSubClass}`}>Disarankan landscape.</p></div></div></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className={`block text-xs font-bold mb-2 ${textSubClass}`}>Nama Kafe</label><input type="text" value={settings.name} onChange={e => setSettings({...settings, name: e.target.value})} className={inputClass} /></div>
                  <div><label className={`block text-xs font-bold mb-2 ${textSubClass}`}>Nomor WhatsApp</label><input type="text" value={settings.wa} onChange={e => setSettings({...settings, wa: e.target.value})} className={inputClass} placeholder="08xxxxxxxxxx" /></div>
                </div>
                <div><label className={`block text-xs font-bold mb-2 ${textSubClass}`}>Alamat</label><input type="text" value={settings.address} onChange={e => setSettings({...settings, address: e.target.value})} className={inputClass} placeholder="Jl. Contoh No. 123" /></div>
                <div className={`border-t pt-6 ${theme === 'light' ? 'border-[#E3DCD1]' : 'border-slate-800'}`}><label className={`block text-xs font-bold mb-2 ${textSubClass}`}>Persentase PPN (%)</label><input type="number" min="0" max="100" value={settings.tax_percentage} onChange={e => setSettings({...settings, tax_percentage: Number(e.target.value)})} className={inputClass} placeholder="11" /><p className={`text-[11px] font-medium mt-2 ${textSubClass}`}>Sesuai ketentuan pemerintah, standar PPN adalah 11%. Isi 0 jika tidak ada pajak.</p></div>
                <div className={`border-t pt-6 ${theme === 'light' ? 'border-[#E3DCD1]' : 'border-slate-800'}`}><label className={`block text-xs font-bold mb-2 ${textSubClass}`}>QRIS Bank/E-Wallet (Untuk Cetak Bill)</label><textarea value={settings.qris_string} onChange={e => setSettings({...settings, qris_string: e.target.value})} className={`${inputClass} font-mono text-xs`} rows="3" placeholder="00020101021126..."></textarea><p className={`text-[11px] font-medium mt-2 ${textSubClass}`}>Paste string QRIS statis (DANA, Mandiri, BCA, dll).</p></div>
                <button type="submit" className={`w-full font-bold py-4 rounded-2xl shadow-lg transition-all mt-4 ${theme === 'light' ? 'bg-[#3A2A20] hover:bg-[#2A1F17] text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'}`}>Simpan Pengaturan</button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* MODAL EDIT MENU */}
      {isMenuModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 print:hidden">
          <div className={`rounded-[2rem] max-w-3xl w-full p-8 sm:p-10 shadow-2xl max-h-[90vh] overflow-y-auto border animate-in zoom-in-95 ${theme === 'light' ? 'bg-white border-[#E3DCD1]' : 'bg-slate-900 border-slate-800'}`}>
            <div className="flex justify-between items-start mb-6"><div><h3 className={`font-black text-2xl ${textMainClass}`}>{currentMenu.id ? 'Edit Menu' : 'Tambah Menu'}</h3><p className={`text-sm mt-1 ${textSubClass}`}>Isi informasi menu baru</p></div><button onClick={() => setIsMenuModalOpen(false)} className={`w-10 h-10 rounded-full font-bold text-xl flex items-center justify-center transition-colors ${theme === 'light' ? 'bg-[#F4EFE9] hover:bg-[#E3DCD1] text-[#3A2A20]' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}>×</button></div>
            <form onSubmit={handleSaveMenu} className="space-y-6">
              <div><label className={`block text-sm font-bold mb-2 ${textSubClass}`}>Foto Menu</label><div className="flex items-center gap-6"><div className={`w-32 h-32 rounded-2xl overflow-hidden flex items-center justify-center text-5xl border ${theme === 'light' ? 'bg-[#F4EFE9] border-[#E3DCD1]' : 'bg-slate-800 border-slate-700'}`}>{currentMenu.image_url ? <img src={currentMenu.image_url} className="w-full h-full object-cover" /> : '🍽️'}</div><div className="flex-1"><input type="file" ref={fileInputRef} onChange={(e) => handleImageUpload(e, 'menu')} accept="image/*" className="hidden" /><button type="button" onClick={() => fileInputRef.current?.click()} className={`w-full py-3 rounded-xl text-sm font-bold transition-colors ${theme === 'light' ? 'bg-[#F4EFE9] hover:bg-[#E3DCD1] text-[#3A2A20]' : 'bg-slate-800 hover:bg-slate-700 text-white'}`}>{uploading ? 'Mengupload...' : '📷 Pilih Foto'}</button></div></div></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className={`block text-sm font-bold mb-2 ${textSubClass}`}>Nama Menu</label><input required type="text" value={currentMenu.name} onChange={e => setCurrentMenu({...currentMenu, name: e.target.value})} className={inputClass} placeholder="Contoh: Nasi Goreng Spesial" /></div>
                <div><label className={`block text-sm font-bold mb-2 ${textSubClass}`}>Harga (Rp)</label><input required type="number" value={currentMenu.price} onChange={e => setCurrentMenu({...currentMenu, price: e.target.value})} className={inputClass} placeholder="25000" /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className={`block text-sm font-bold mb-2 ${textSubClass}`}>Kategori</label><select value={currentMenu.category} onChange={e => setCurrentMenu({...currentMenu, category: e.target.value})} className={inputClass}><option value="makanan">Makanan</option><option value="minuman">Minuman</option><option value="cemilan">Cemilan</option></select></div>
              </div>
              <div><label className={`block text-sm font-bold mb-2 ${textSubClass}`}>Deskripsi</label><textarea value={currentMenu.desc} onChange={e => setCurrentMenu({...currentMenu, desc: e.target.value})} className={inputClass} rows="3" placeholder="Deskripsi singkat menu"></textarea></div>
              <div className={`flex gap-3 pt-4 border-t ${theme === 'light' ? 'border-[#E3DCD1]' : 'border-slate-800'}`}><button type="submit" className="flex-1 bg-gradient-to-r from-[var(--primary-color)] to-[var(--primary-dark)] text-white font-bold py-3.5 rounded-xl text-base shadow-lg shadow-[var(--primary-color)]/30 active:scale-95 transition-all border border-[var(--primary-dark)]">Simpan Menu</button><button type="button" onClick={() => setIsMenuModalOpen(false)} className={`font-bold px-8 py-3.5 rounded-xl text-base transition-colors ${theme === 'light' ? 'bg-[#F4EFE9] hover:bg-[#E3DCD1] text-[#3A2A20]' : 'bg-slate-800 hover:bg-slate-700 text-white'}`}>Batal</button></div>
            </form>
          </div>
        </div>
      )}

      {/* KITCHEN MODAL */}
      {kitchenModal.open && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[80] print:hidden">
          <div className={`rounded-[2rem] max-w-md w-full p-8 shadow-2xl border ${theme === 'light' ? 'bg-white border-[#E3DCD1]' : 'bg-slate-900 border-slate-800'}`}>
            <div className="flex items-start justify-between mb-5"><div><h3 className={`font-black text-xl ${textMainClass}`}>🍳 Layar Dapur (KDS)</h3><p className={`text-xs mt-1 ${textSubClass}`}>Buka URL ini di tablet / TV dapur</p></div><button onClick={() => setKitchenModal({ open: false, url: '', pin: '' })} className={`w-10 h-10 rounded-full font-bold text-xl flex items-center justify-center transition-colors ${theme === 'light' ? 'bg-[#F4EFE9] hover:bg-[#E3DCD1] text-[#3A2A20]' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}>×</button></div>
            <div className="space-y-4">
              <div><label className={`block text-[10px] font-bold uppercase mb-2 ${textSubClass}`}>URL</label><div className="flex gap-2"><input readOnly value={kitchenModal.url} className={`flex-1 border rounded-xl px-3 py-2.5 text-xs font-mono ${theme === 'light' ? 'border-[#E3DCD1] bg-[#F4EFE9] text-[#3A2A20]' : 'border-slate-700 bg-slate-800 text-slate-300'}`} /><button onClick={() => { navigator.clipboard.writeText(kitchenModal.url); showToast('✅ URL disalin', 'success'); }} className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap shadow-sm transition-colors ${theme === 'light' ? 'bg-[#3A2A20] hover:bg-[#2A1F17] text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'}`}>📋 Salin</button></div></div>
              <div className={`text-center p-4 rounded-2xl border ${theme === 'light' ? 'bg-[#F4EFE9] border-[#E3DCD1]' : 'bg-slate-800 border-slate-700'}`}><img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(kitchenModal.url)}`} className="w-40 h-40 mx-auto rounded-xl shadow-sm border border-slate-200 bg-white" alt="QR KDS" /><p className={`text-[10px] mt-3 font-medium ${textSubClass}`}>Scan QR dengan tablet dapur</p></div>
              <div className={`border rounded-xl p-4 ${theme === 'light' ? 'bg-amber-50 border-amber-200' : 'bg-amber-500/10 border-amber-500/30'}`}><p className={`text-sm font-bold ${theme === 'light' ? 'text-amber-900' : 'text-amber-500'}`}>PIN: {kitchenModal.pin}</p><p className={`text-[11px] mt-1 font-medium ${theme === 'light' ? 'text-amber-700' : 'text-amber-500/70'}`}>PIN ini sudah termasuk di URL. Jangan bagikan ke pelanggan.</p></div>
            </div>
            <button onClick={() => setKitchenModal({ open: false, url: '', pin: '' })} className={`w-full mt-5 font-bold py-3 rounded-xl text-sm transition-colors ${theme === 'light' ? 'bg-[#F4EFE9] hover:bg-[#E3DCD1] text-[#3A2A20]' : 'bg-slate-800 hover:bg-slate-700 text-white'}`}>Tutup</button>
          </div>
        </div>
      )}

      {/* TOASTS */}
      <div className="fixed top-4 right-4 z-[100] space-y-2 w-80 max-w-[calc(100vw-2rem)] print:hidden pointer-events-none">
        {toasts.map(t => {
          const c = { success: { border: 'border-emerald-500', icon: '✅', bar: 'bg-emerald-500' }, error: { border: 'border-rose-500', icon: '❌', bar: 'bg-rose-500' }, warning: { border: 'border-amber-500', icon: '⚠️', bar: 'bg-amber-500' }, info: { border: 'border-[var(--primary-color)]', icon: '🔔', bar: 'bg-[var(--primary-color)]' } }[t.type] || { border: 'border-slate-500', icon: 'ℹ️', bar: 'bg-slate-500' };
          return (<div key={t.id} className={`pointer-events-auto rounded-2xl shadow-2xl border overflow-hidden flex items-stretch animate-in slide-in-from-right-8 ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} ${c.border}`}><div className={`${c.bar} w-1.5 shrink-0`}></div><div className="flex items-start gap-3 px-4 py-3 flex-1"><span className="text-xl shrink-0">{c.icon}</span><p className={`text-sm font-bold flex-1 ${textMainClass}`}>{t.message}</p></div></div>);
        })}
      </div>

      {/* CONFIRM DIALOG */}
      {confirmDialog.open && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[90] print:hidden">
          <div className={`rounded-[2rem] max-w-sm w-full p-8 shadow-2xl border animate-in zoom-in-95 ${theme === 'light' ? 'bg-white border-[#E3DCD1]' : 'bg-slate-900 border-slate-800'}`}>
            <h3 className={`font-black text-xl mb-2 ${textMainClass}`}>{confirmDialog.title}</h3>
            <p className={`text-sm mb-8 whitespace-pre-line font-medium ${textSubClass}`}>{confirmDialog.message}</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDialog({ open: false, title: '', message: '', onConfirm: null, danger: false })} className={`flex-1 font-bold py-3 rounded-xl text-sm transition-colors ${theme === 'light' ? 'bg-[#F4EFE9] hover:bg-[#E3DCD1] text-[#3A2A20]' : 'bg-slate-800 hover:bg-slate-700 text-white'}`}>Batal</button>
              <button onClick={async () => { const cb = confirmDialog.onConfirm; setConfirmDialog({ open: false, title: '', message: '', onConfirm: null, danger: false }); if (cb) { try { await cb(); } catch (err) { showToast('Error: ' + err.message, 'error'); } } }} className={`flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all ${confirmDialog.danger ? 'bg-rose-500 hover:bg-rose-600 shadow-md shadow-rose-500/30' : 'bg-[var(--primary-color)] hover:bg-[var(--primary-dark)] shadow-md shadow-[var(--primary-color)]/30'}`}>Ya, Lanjutkan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}