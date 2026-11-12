'use client';
import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const Icons = {
  Shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Store: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Activity: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  Logout: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Plus: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Search: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Copy: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  WhatsApp: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg>,
  Trash: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  BarChart: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>,
  Dollar: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  X: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Sun: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  Moon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  Settings: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>,
  Eye: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Key: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/><path d="m21 2-9.6 9.6"/><circle cx="7.5" cy="15.5" r="5.5"/></svg>,
  Sort: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="m21 8-4-4-4 4"/><path d="M17 4v16"/></svg>,
  Users: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  UserPlus: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>,
  Download: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  MapPin: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  TrendingUp: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
};

const ADMIN_EMAIL = 'dinamis.id.shop@gmail.com';
const EMPTY_CONFIRM = { open: false, title: '', message: '', requireInput: '', inputValue: '', danger: true, loading: false, onConfirm: null };

const getPrice = (tenant) => Number(tenant?.rental_price ?? 150000);
const getCommission = (tenant) => Number(tenant?.sales_commission ?? 0);
const hasEndDate = (tenant) => !!tenant?.subscription_end_date;
const formatDateID = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? '—' : d.toLocaleDateString('id-ID');
};
const formatPhone = (num) => {
  if (!num) return '';
  let phone = num.replace(/[^0-9]/g, '');
  if (phone.startsWith('0')) return '62' + phone.slice(1);
  if (phone.startsWith('8')) return '62' + phone;
  if (phone.startsWith('620')) return '62' + phone.slice(3);
  return phone;
};

const parseQRIS = (qris) => {
  if (!qris) return { merchantName: 'MERCHANT NAME', nmid: 'ID...', terminalId: 'A01' };
  let merchantName = 'MERCHANT NAME';
  let nmid = 'ID...';
  let terminalId = 'A01';
  try {
    let i = 0;
    while (i < qris.length) {
      const tag = qris.substr(i, 2);
      const len = parseInt(qris.substr(i+2, 2), 10);
      const value = qris.substr(i+4, len);
      if (tag === '59') merchantName = value;
      if (tag === '62') {
         let j = 0;
         while (j < value.length) {
           const subTag = value.substr(j, 2);
           const subLen = parseInt(value.substr(j+2, 2), 10);
           const subValue = value.substr(j+4, subLen);
           if (subTag === '01') nmid = subValue;
           if (subTag === '07') terminalId = subValue;
           j += 4 + subLen;
         }
      }
      i += 4 + len;
    }
  } catch(e) {}
  return { merchantName, nmid, terminalId };
};

export default function AdminDashboard() {
  const [tenants, setTenants] = useState([]);
  const [marketers, setMarketers] = useState([]);
  const [appSettings, setAppSettings] = useState({ qris_string: '', bank_name: '', bank_account: '', bank_holder: '' });
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [presenceStatus, setPresenceStatus] = useState('connecting');
  const [recentActiveTenants, setRecentActiveTenants] = useState({});
  const [stats, setStats] = useState({ total: 0, online: 0, warning: 0, revenue: 0, commission: 0, netProfit: 0 });
  const [now, setNow] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [theme, setTheme] = useState('dark');
  
  const [activeTab, setActiveTab] = useState('tenants');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showSortMenu, setShowSortMenu] = useState(false);

  const [extendModal, setExtendModal] = useState({ open: false, tenant: null, loading: false });
  const [statsModal, setStatsModal] = useState({ open: false, tenant: null, data: null, loading: false });
  const [financeModal, setFinanceModal] = useState({ open: false, tenant: null, loading: false, price: '', referral: '', commission: '' });
  const [confirmModal, setConfirmModal] = useState(EMPTY_CONFIRM);
  const [detailModal, setDetailModal] = useState({ open: false, tenant: null });
  const [pinModal, setPinModal] = useState({ open: false, tenant: null, pin: '', loading: false });
  
  const [marketerModal, setMarketerModal] = useState({ open: false, name: '', wa: '', city: '', loading: false });
  const [marketerDetailModal, setMarketerDetailModal] = useState({ open: false, marketer: null });
  const [settingsModal, setSettingsModal] = useState({ open: false, loading: false, qris_string: '', bank_name: '', bank_account: '', bank_holder: '' });
  
  const [actionLoading, setActionLoading] = useState({});
  const router = useRouter();
  
  const audioCtxRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('nexaflow_admin_theme');
    if (saved === 'light' || saved === 'dark') setTheme(saved);
    else if (typeof window !== 'undefined' && window.matchMedia) setTheme(window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('nexaflow_admin_theme', newTheme);
  };

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const playBeep = () => {
    if (!audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch {}
  };

  useEffect(() => {
    const unlockAudio = () => {
      if (!audioCtxRef.current) {
        try { audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)(); } catch { }
      }
      if (audioCtxRef.current?.state === 'suspended') audioCtxRef.current.resume();
    };
    document.addEventListener('click', unlockAudio);
    document.addEventListener('touchstart', unlockAudio);
    return () => {
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
    };
  }, []);

  useEffect(() => {
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!showSortMenu) return;
    const closeMenu = () => setShowSortMenu(false);
    const timer = setTimeout(() => document.addEventListener('click', closeMenu), 0);
    return () => { clearTimeout(timer); document.removeEventListener('click', closeMenu); };
  }, [showSortMenu]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key !== 'Escape') return;
      setExtendModal({ open: false, tenant: null, loading: false });
      setStatsModal({ open: false, tenant: null, data: null, loading: false });
      setFinanceModal({ open: false, tenant: null, loading: false, price: '', referral: '', commission: '' });
      setConfirmModal(EMPTY_CONFIRM);
      setDetailModal({ open: false, tenant: null });
      setPinModal({ open: false, tenant: null, pin: '', loading: false });
      setMarketerModal({ open: false, name: '', wa: '', city: '', loading: false });
      setMarketerDetailModal({ open: false, marketer: null });
      setSettingsModal({ open: false, loading: false, qris_string: '', bank_name: '', bank_account: '', bank_holder: '' });
      setShowSortMenu(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentEmail = session?.user?.email ? session.user.email.trim().toLowerCase() : '';
      if (currentEmail !== ADMIN_EMAIL.toLowerCase()) {
        showToast('Akses ditolak! Admin only.', 'error');
        setTimeout(() => router.push('/login'), 800);
        return;
      }
      await Promise.all([fetchTenants(), fetchMarketers(), fetchSettings()]);
      setLoading(false);
    };
    checkAuthAndFetch();
  }, [router]);

  const fetchTenants = async () => {
    const { data, error } = await supabase.from('tenants').select('*').order('created_at', { ascending: false });
    if (error) showToast('Gagal memuat tenants: ' + error.message, 'error');
    else if (data) setTenants(data);
  };

  const fetchMarketers = async () => {
    const { data, error } = await supabase.from('marketers').select('*').order('name', { ascending: true });
    if (error) showToast('Gagal memuat marketing: ' + error.message, 'error');
    else if (data) setMarketers(data);
  };

  const fetchSettings = async () => {
    const { data, error } = await supabase.from('app_settings').select('*').eq('id', 1).maybeSingle();
    if (error) {
      console.error('Fetch settings error:', error);
      return;
    }
    if (data) {
      setAppSettings({ 
        qris_string: data.qris_string || '',
        bank_name: data.bank_name || '',
        bank_account: data.bank_account || '',
        bank_holder: data.bank_holder || ''
      });
    }
  };

  // 🔥 FIX v4: gabungkan realtime presence + fallback "order aktif 10 menit terakhir"
  const effectiveOnline = useMemo(() => {
    const merged = { ...onlineUsers };
    Object.keys(recentActiveTenants).forEach((id) => {
      if (!merged[id]) merged[id] = true;
    });
    return merged;
  }, [onlineUsers, recentActiveTenants]);

  useEffect(() => {
    calculateStats(tenants, effectiveOnline);
  }, [tenants, effectiveOnline]);

  const calculateStats = (tenantData, onlineData) => {
    let onlineCount = 0, warningCount = 0, totalRevenue = 0, totalCommission = 0, netProfit = 0;
    const currentTime = Date.now();
    tenantData.forEach(t => {
      if (onlineData[t.id]) onlineCount++;
      if (t.subscription_end_date) {
        const daysLeft = Math.max(0, Math.ceil((new Date(t.subscription_end_date).getTime() - currentTime) / (1000 * 60 * 60 * 24)));
        if (daysLeft <= 7) warningCount++;
        if (daysLeft > 0 && t.is_active !== false) {
          // 🔥 OPSI B: harga & komisi penuh, tanpa prorata
          totalRevenue += getPrice(t);
          totalCommission += getCommission(t);
        }
      }
    });
    netProfit = totalRevenue - totalCommission;
    setStats({ total: tenantData.length, online: onlineCount, warning: warningCount, revenue: totalRevenue, commission: totalCommission, netProfit });
  };

  // 🔥 PERBAIKAN BUG PRESENCE (ADMIN) — v4 (realtime + fallback + status badge + log)
  useEffect(() => {
    let channel = null;
    let pollInterval = null;
    let activityInterval = null;
    let isMounted = true;
    let lastCount = -1;

    const checkRecentActivity = async () => {
      if (!isMounted) return;
      try {
        const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
        const { data, error } = await supabase
          .from('orders')
          .select('tenant_id')
          .gte('created_at', tenMinAgo);
        if (error) {
          console.warn('[Admin Fallback] recentActivity query error:', error.message);
          return;
        }
        const activeMap = {};
        (data || []).forEach((o) => { if (o.tenant_id) activeMap[o.tenant_id] = true; });
        if (isMounted) setRecentActiveTenants(activeMap);
      } catch (err) {
        console.warn('[Admin Fallback] recentActivity exception:', err);
      }
    };

    checkRecentActivity();
    activityInterval = setInterval(checkRecentActivity, 15000);

    const handlePresenceChange = () => {
      if (!isMounted || !channel) return;
      try {
        const state = channel.presenceState();
        const onlineMap = {};
        Object.keys(state).forEach((key) => {
          state[key].forEach((p) => {
            if (p.tenant_id) onlineMap[p.tenant_id] = true;
          });
        });
        const count = Object.keys(onlineMap).length;
        if (count !== lastCount) {
          console.log(`[Admin Presence] realtime online tenants: ${count}`, onlineMap);
          lastCount = count;
        }
        setOnlineUsers(onlineMap);
      } catch (err) {
        console.warn('[Admin Presence] presenceState error:', err);
      }
    };

    channel = supabase.channel('online-rooms', {
      config: {
        presence: { key: 'admin-' + Date.now() }
      }
    });

    channel
      .on('presence', { event: 'sync' }, handlePresenceChange)
      .on('presence', { event: 'join' }, handlePresenceChange)
      .on('presence', { event: 'leave' }, handlePresenceChange)
      .subscribe(async (status) => {
        console.log('[Admin Presence] subscribe status:', status);
        if (status === 'SUBSCRIBED') {
          setPresenceStatus('online');
          try {
            await channel.track({ role: 'admin', online_at: new Date().toISOString() });
          } catch (err) {
            console.warn('[Admin Presence] track error:', err);
          }
          handlePresenceChange();
          if (!pollInterval) {
            pollInterval = setInterval(handlePresenceChange, 3000);
          }
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
          setPresenceStatus('error');
          console.warn('[Admin Presence] Channel status:', status);
          if (pollInterval) { clearInterval(pollInterval); pollInterval = null; }
        } else {
          setPresenceStatus('connecting');
        }
      });

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        handlePresenceChange();
        checkRecentActivity();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      isMounted = false;
      document.removeEventListener('visibilitychange', onVisibility);
      if (pollInterval) { clearInterval(pollInterval); pollInterval = null; }
      if (activityInterval) { clearInterval(activityInterval); activityInterval = null; }
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const sub = supabase.channel('admin-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tenants' }, (payload) => {
        showToast(`🎉 Pendaftar Baru: ${payload.new.name}`, 'success');
        playBeep();
        fetchTenants();
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'tenants' }, fetchTenants)
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'tenants' }, fetchTenants)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'marketers' }, fetchMarketers)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'app_settings' }, fetchSettings)
      .subscribe();
    return () => { supabase.removeChannel(sub); };
  }, []);

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/login'); };

  const calculateDaysLeft = (endDate) => {
    if (!endDate || !now) return 0;
    return Math.max(0, Math.ceil((new Date(endDate).getTime() - now) / (1000 * 60 * 60 * 24)));
  };

  const setTenantLoading = (id, val) => {
    setActionLoading(prev => {
      const next = { ...prev };
      if (!val) delete next[id]; else next[id] = val;
      return next;
    });
  };

  const submitExtend = async (days) => {
    const { tenant } = extendModal;
    if (!tenant) return;
    setExtendModal(prev => ({ ...prev, loading: true }));
    const currentEnd = new Date(tenant.subscription_end_date || Date.now()).getTime();
    const baseDate = Math.max(Date.now(), currentEnd);
    const newEndDate = new Date(baseDate + (days * 24 * 60 * 60 * 1000)).toISOString();
    const { error } = await supabase.from('tenants').update({ subscription_end_date: newEndDate, is_active: true }).eq('id', tenant.id);
    setExtendModal({ open: false, tenant: null, loading: false });
    if (error) showToast('Gagal: ' + error.message, 'error');
    else { showToast(`✅ ${tenant.name} diperpanjang ${days} Hari!`, 'success'); fetchTenants(); }
  };

  const requestToggleStatus = (tenant) => {
    const currentlyActive = tenant.is_active !== false;
    const newStatus = !currentlyActive;
    setConfirmModal({
      open: true, title: newStatus ? 'Suspend Akun' : 'Aktifkan Akun',
      message: `Akun "${tenant.name}" akan ${newStatus ? 'disuspend.' : 'diaktifkan kembali.'}`,
      requireInput: '', inputValue: '', danger: newStatus, loading: false,
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, loading: true }));
        setTenantLoading(tenant.id, 'toggle');
        const { error } = await supabase.from('tenants').update({ is_active: newStatus }).eq('id', tenant.id);
        setTenantLoading(tenant.id, null);
        if (error) { setConfirmModal(prev => ({ ...prev, loading: false })); return showToast('Gagal: ' + error.message, 'error'); }
        setConfirmModal(EMPTY_CONFIRM); showToast(`Akun ${tenant.name} ${newStatus ? 'disuspend' : 'diaktifkan'}`, 'success'); fetchTenants();
      },
    });
  };

  const openStats = async (tenant) => {
    setStatsModal({ open: true, tenant, data: null, loading: true });
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const [menusRes, ordersAllRes, recentOrdersRes] = await Promise.all([
        supabase.from('menus').select('*', { count: 'exact', head: true }).eq('tenant_id', tenant.id),
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('tenant_id', tenant.id),
        supabase.from('orders').select('subtotal, tax_amount, created_at').eq('tenant_id', tenant.id).gte('created_at', thirtyDaysAgo),
      ]);
      const recentOrders = recentOrdersRes.data || [];
      const revenue30 = recentOrders.reduce((sum, o) => sum + (Number(o.subtotal) || 0) + (Number(o.tax_amount) || 0), 0);
      setStatsModal(prev => ({ ...prev, loading: false, data: { menus: menusRes.count || 0, orders: ordersAllRes.count || 0, recentCount: recentOrders.length, revenue30, error: false } }));
    } catch (err) { setStatsModal(prev => ({ ...prev, loading: false, data: { error: true } })); }
  };

  const openFinance = (tenant) => {
    setFinanceModal({ open: true, tenant, loading: false, price: tenant.rental_price ?? 150000, referral: tenant.referral_name || '', commission: tenant.sales_commission ?? 0 });
  };

  const saveFinance = async (e) => {
    e.preventDefault();
    setFinanceModal(prev => ({ ...prev, loading: true }));
    const payload = { rental_price: Number(financeModal.price) || 0, referral_name: financeModal.referral.trim(), sales_commission: Number(financeModal.commission) || 0 };
    const { error } = await supabase.from('tenants').update(payload).eq('id', financeModal.tenant.id);
    setFinanceModal(prev => ({ ...prev, loading: false }));
    if (error) return showToast('Gagal simpan: ' + error.message, 'error');
    showToast('Data finansial disimpan', 'success'); setFinanceModal({ open: false, tenant: null, loading: false, price: '', referral: '', commission: '' }); fetchTenants();
  };

  const requestDelete = (tenant) => {
    setConfirmModal({
      open: true, title: 'Hapus Permanen Semua Data',
      message: `⚠️ Semua data "${tenant.name}" akan DIHAPUS TOTAL:\n\n• Pesanan & riwayat transaksi\n• Menu & gambar menu\n• Meja & QR code\n• Tagihan (invoices)\n• File logo & banner\n• Akun tenant\n• Akun login (email)\n\nSetelah dihapus, email pemilik bisa didaftarkan ulang. TINDAKAN INI TIDAK BISA DIBATALKAN.`,
      requireInput: tenant.name, inputValue: '', danger: true, loading: false,
      onConfirm: () => performDelete(tenant),
    });
  };

  const performDelete = async (tenant) => {
    setConfirmModal(prev => ({ ...prev, loading: true }));
    setTenantLoading(tenant.id, 'delete');

    try {
      const { data: userRows } = await supabase.from('users').select('id').eq('tenant_id', tenant.id);
      const userIds = (userRows || []).map(u => u.id);

      const { error: orderErr } = await supabase.from('orders').delete().eq('tenant_id', tenant.id);
      if (orderErr) throw new Error('Gagal hapus pesanan: ' + orderErr.message);

      const { error: menuErr } = await supabase.from('menus').delete().eq('tenant_id', tenant.id);
      if (menuErr) throw new Error('Gagal hapus menu: ' + menuErr.message);

      const { error: tableErr } = await supabase.from('tables').delete().eq('tenant_id', tenant.id);
      if (tableErr && !tableErr.message.includes('does not exist')) {
        throw new Error('Gagal hapus meja: ' + tableErr.message);
      }

      const { error: invoiceErr } = await supabase.from('invoices').delete().eq('tenant_id', tenant.id);
      if (invoiceErr && !invoiceErr.message.includes('does not exist')) {
        throw new Error('Gagal hapus tagihan: ' + invoiceErr.message);
      }

      const { error: fileErr } = await supabase.rpc('admin_delete_tenant_files', { p_tenant_id: tenant.id });
      if (fileErr) console.warn('Gagal hapus file storage:', fileErr.message);

      const { error: tenantErr } = await supabase.from('tenants').delete().eq('id', tenant.id);
      if (tenantErr) throw new Error('Gagal hapus tenant: ' + tenantErr.message);

      for (const uid of userIds) {
        const { error: authErr } = await supabase.rpc('admin_delete_auth_user', { p_user_id: uid });
        if (authErr) console.warn('Gagal hapus akun auth:', authErr.message);
      }

      setTenantLoading(tenant.id, null);
      setConfirmModal(EMPTY_CONFIRM);
      showToast(`✅ ${tenant.name} dihapus total. Email sudah bisa didaftarkan ulang.`, 'success');
      fetchTenants();
    } catch (err) {
      setTenantLoading(tenant.id, null);
      setConfirmModal(prev => ({ ...prev, loading: false }));
      showToast(err.message, 'error');
    }
  };

  const copyToClipboard = async (text, label = 'ID') => {
    try { await navigator.clipboard.writeText(text); showToast(`${label} disalin`, 'success'); } catch { showToast('Gagal menyalin', 'error'); }
  };

  const openPinModal = (tenant) => setPinModal({ open: true, tenant, pin: '', loading: false });

  const savePin = async (e) => {
    e.preventDefault();
    if (!/^\d{4,8}$/.test(pinModal.pin)) return showToast('PIN harus 4–8 digit angka', 'error');
    setPinModal(prev => ({ ...prev, loading: true }));
    const { error } = await supabase.from('tenants').update({ kitchen_pin: pinModal.pin }).eq('id', pinModal.tenant.id);
    setPinModal(prev => ({ ...prev, loading: false }));
    if (error) return showToast('Gagal simpan PIN: ' + error.message, 'error');
    showToast('Kitchen PIN berhasil diubah', 'success'); setPinModal({ open: false, tenant: null, pin: '', loading: false }); fetchTenants();
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    setSettingsModal(prev => ({ ...prev, loading: true }));
    const { data, error } = await supabase.from('app_settings').update({
      qris_string: settingsModal.qris_string.trim(),
      bank_name: settingsModal.bank_name.trim(),
      bank_account: settingsModal.bank_account.trim(),
      bank_holder: settingsModal.bank_holder.trim()
    }).eq('id', 1).select();
    
    setSettingsModal(prev => ({ ...prev, loading: false }));
    
    if (error) return showToast('Gagal simpan pengaturan: ' + error.message, 'error');
    if (!data || data.length === 0) return showToast('Gagal simpan: Baris ID=1 tidak ada di tabel app_settings. Cek Database.', 'error');
    
    showToast('Pengaturan berhasil disimpan', 'success');
    setSettingsModal({ open: false, loading: false, qris_string: '', bank_name: '', bank_account: '', bank_holder: '' });
    fetchSettings();
  };

  const generateQRISImage = async (qrisString, tenantName) => {
    return new Promise(async (resolve, reject) => {
      try {
        const parsed = parseQRIS(qrisString);
        const merchantName = parsed.merchantName !== 'MERCHANT NAME' ? parsed.merchantName : tenantName;
        
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 1130;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#f1f5f9';
        ctx.lineWidth = 1.5;
        for (let i = -canvas.height; i < canvas.width; i += 30) {
          ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + canvas.height, canvas.height); ctx.stroke();
        }
        for (let i = 0; i < canvas.width + canvas.height; i += 30) {
          ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i - canvas.height, canvas.height); ctx.stroke();
        }

        ctx.fillStyle = '#E21E26'; 
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(320, 0); ctx.lineTo(0, 320); ctx.fill();
        ctx.beginPath(); ctx.moveTo(0, 320); ctx.lineTo(180, 500); ctx.lineTo(0, 680); ctx.fill();
        ctx.beginPath(); ctx.moveTo(800, 1130); ctx.lineTo(480, 1130); ctx.lineTo(800, 810); ctx.fill();

        ctx.fillStyle = '#000000';
        ctx.font = '900 44px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('QRIS', 50, 80);
        
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(45, 85); ctx.lineTo(45, 60); ctx.lineTo(70, 60); ctx.stroke();

        ctx.font = 'bold 14px Arial';
        ctx.fillText('QR Code Standar', 50, 105);
        ctx.fillText('Pembayaran Nasional', 50, 125);
        
        ctx.fillStyle = '#E21E26';
        ctx.beginPath();
        ctx.moveTo(730, 70); ctx.lineTo(680, 40); ctx.lineTo(710, 75); ctx.lineTo(680, 90); ctx.lineTo(730, 85);
        ctx.fill();
        ctx.fillStyle = '#1e3a8a';
        ctx.font = '900 38px Arial';
        ctx.textAlign = 'right';
        ctx.fillText('GPN', 760, 85);

        ctx.textAlign = 'center';
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 40px Arial';
        ctx.fillText(merchantName, 400, 230);

        ctx.font = '26px Arial';
        ctx.fillText(`NMID : ${parsed.nmid}`, 400, 285);
        
        ctx.font = '28px Arial';
        ctx.fillText(parsed.terminalId, 400, 335);

        const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(qrisString)}&margin=0`;
        const qrImg = new Image();
        qrImg.crossOrigin = 'Anonymous';
        qrImg.src = qrApiUrl;

        await new Promise((res, rej) => {
          qrImg.onload = () => {
            ctx.drawImage(qrImg, 150, 370, 500, 500);
            res();
          };
          qrImg.onerror = rej;
        });

        ctx.fillStyle = '#000000';
        ctx.font = '28px Arial';
        ctx.fillText('SATU QRIS UNTUK SEMUA', 400, 920);
        
        ctx.font = '22px Arial';
        ctx.fillText('Cek aplikasi penyelenggara di:', 400, 965);
        ctx.fillText('www.aspi-qris.id', 400, 1000);

        ctx.textAlign = 'left';
        ctx.font = '18px Arial';
        ctx.fillText('Dicetak oleh: 93600915', 50, 1050);
        ctx.fillText('Versi cetak: 1.0.05.11.26', 50, 1080);

        ctx.textAlign = 'center';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('Cara bayar dengan QRIS:', 650, 1010);
        
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000000';
        ctx.beginPath(); ctx.arc(550, 1065, 25, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = '#000000';
        ctx.font = '12px Arial'; 
        ctx.fillText('Buka Aplikasi', 550, 1110);
        ctx.fillText('Berlogo QRIS', 550, 1125);
        
        ctx.fillRect(543, 1052, 14, 24);
        ctx.fillStyle = '#ffffff'; 
        ctx.fillRect(545, 1054, 10, 16); 
        ctx.fillStyle = '#000000';

        ctx.beginPath(); ctx.arc(650, 1065, 25, 0, Math.PI * 2); ctx.stroke();
        ctx.fillText('Scan dan Cek', 650, 1110);
        ctx.lineWidth = 3;
        ctx.strokeRect(638, 1053, 24, 24);

        ctx.beginPath(); ctx.arc(750, 1065, 25, 0, Math.PI * 2); ctx.stroke();
        ctx.fillText('Bayar', 750, 1110);
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(750, 1065, 12, 0, Math.PI * 2); ctx.stroke();
        ctx.fillText('Rp', 750, 1069);

        canvas.toBlob(async (blob) => {
          try {
            const fileName = `qris-${tenantName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.png`;
            const { error: upErr } = await supabase.storage.from('cafe-logos').upload(fileName, blob, { cacheControl: '3600', upsert: false });
            if (upErr) throw upErr;
            const { data: urlData } = supabase.storage.from('cafe-logos').getPublicUrl(fileName);
            resolve(urlData.publicUrl);
          } catch (err) {
            reject(err);
          }
        }, 'image/png');
      } catch (err) {
        reject(err);
      }
    });
  };

  const openWaTenant = async (tenant) => {
    if (!tenant.wa_number) return showToast('Nomor WA belum diatur', 'warning');
    const phone = formatPhone(tenant.wa_number);
    if (phone.length < 10) return showToast('Format nomor WA tidak valid', 'error');
    
    const price = getPrice(tenant);
    let msg = `Selamat pagi/siang/sore Bapak/Ibu Pengelola *${tenant.name}*,\n\nKami dari Admin NexaFlow Kasir ingin menginformasikan terkait perpanjangan layanan sistem kasir Anda.\n\n🧾 *Rincian Tagihan:*\n- Layanan: Perpanjangan Sistem NexaFlow\n- Nominal: *Rp ${price.toLocaleString('id-ID')}*\n\n`;
    
    msg += `💳 *Metode Pembayaran:*\n`;
    
    if (appSettings.qris_string) {
      showToast('Menyiapkan gambar QRIS...', 'info');
      try {
        const qrisImageUrl = await generateQRISImage(appSettings.qris_string, tenant.name);
        msg += `*1. QRIS (Scan Gambar)*\nSilakan scan gambar QRIS berikut:\n${qrisImageUrl}\n\n`;
      } catch (err) {
        showToast('Gagal membuat gambar QRIS, menggunakan teks.', 'warning');
        msg += `*1. QRIS (Copy Teks)*\nSilakan copy-paste teks QRIS di bawah ini ke M-Banking:\n${appSettings.qris_string}\n\n`;
      }
    }

    if (appSettings.bank_name || appSettings.bank_account) {
      msg += `*2. Transfer Bank*\n`;
      if (appSettings.bank_name) msg += `Bank: ${appSettings.bank_name}\n`;
      if (appSettings.bank_account) msg += `No. Rek: ${appSettings.bank_account}\n`;
      if (appSettings.bank_holder) msg += `A/N: ${appSettings.bank_holder}\n`;
      msg += `\n`;
    }
    
    if (!appSettings.qris_string && !appSettings.bank_name && !appSettings.bank_account) {
      msg += `(Silakan hubungi Admin untuk info rekening/QRIS)\n\n`;
    }
    
    msg += `Jika sudah melakukan pembayaran, mohon kirimkan bukti transfernya ke chat ini agar masa aktif akun Anda bisa segera kami perpanjang.\nTerima kasih atas kepercayaan Anda kepada NexaFlow. 🙏`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const openWaMarketer = (marketer, statsData) => {
    if (!marketer.wa_number) return showToast('Nomor WA marketing belum diatur', 'warning');
    const phone = formatPhone(marketer.wa_number);
    if (phone.length < 10) return showToast('Format nomor WA tidak valid', 'error');

    const activeList = statsData.activeTenants.map(t => `- ${t.name} (Komisi: Rp ${getCommission(t).toLocaleString('id-ID')})`).join('\n') || '- Tidak ada';
    const expiredList = statsData.expiredTenants.map(t => `- ${t.name} (Belum Bayar/Expired)`).join('\n') || '- Tidak ada';

    const msg = `Halo *${marketer.name}*${marketer.city ? ` (${marketer.city})` : ''},\n\nBerikut rincian komisi (bagi hasil) Anda:\nTotal Kafe: *${statsData.count} Kafe*\nTotal Estimasi Komisi: *Rp ${statsData.commission.toLocaleString('id-ID')}*\n\n✅ *Kafe Aktif (Mendapat Komisi):*\n${activeList}\n\n⚠️ *Kafe Expired (Mohon di-follow up agar bayar):*\n${expiredList}\n\nLaporan detail (Excel/PDF) dapat Anda unduh melalui portal Admin. Terima kasih atas kerja kerasnya! 🚀`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const saveMarketer = async (e) => {
    e.preventDefault();
    setMarketerModal(prev => ({ ...prev, loading: true }));
    const payload = { name: marketerModal.name.trim(), wa_number: marketerModal.wa.trim(), city: marketerModal.city.trim() || null };
    const existing = marketers.find(m => m.name.toLowerCase() === payload.name.toLowerCase());
    if (existing) {
      setMarketerModal(prev => ({ ...prev, loading: false }));
      return showToast('Nama marketing sudah ada', 'error');
    }
    const { error } = await supabase.from('marketers').insert([payload]);
    setMarketerModal(prev => ({ ...prev, loading: false }));
    if (error) return showToast('Gagal tambah marketing: ' + error.message, 'error');
    showToast('Marketing berhasil ditambahkan', 'success');
    setMarketerModal({ open: false, name: '', wa: '', city: '', loading: false });
    fetchMarketers();
  };

  const requestDeleteMarketer = (marketer) => {
    setConfirmModal({
      open: true, title: 'Hapus Marketing',
      message: `Marketing "${marketer.name}" akan dihapus. Data kafe yang direferensikan tidak akan terhapus, namun tidak akan terhitung lagi di komisi marketing ini.`,
      requireInput: '', inputValue: '', danger: true, loading: false,
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, loading: true }));
        const { error } = await supabase.from('marketers').delete().eq('id', marketer.id);
        if (error) { setConfirmModal(prev => ({ ...prev, loading: false })); return showToast('Gagal hapus: ' + error.message, 'error'); }
        setConfirmModal(EMPTY_CONFIRM); showToast('Marketing dihapus', 'success'); fetchMarketers();
      },
    });
  };

  const handleExportMarketing = (m) => {
    let csv = `Laporan Marketing: ${m.name}${m.city ? ` (${m.city})` : ''}\n`;
    csv += `Tanggal Unduh: ${new Date().toLocaleDateString('id-ID')}\n`;
    csv += `Total Kafe: ${m.count}\n`;
    csv += `Total Omset: Rp ${m.revenue.toLocaleString('id-ID')}\n`;
    csv += `Total Komisi: Rp ${m.commission.toLocaleString('id-ID')}\n`;
    csv += `Net Profit: Rp ${(m.revenue - m.commission).toLocaleString('id-ID')}\n\n`;
    
    csv += `KAFE AKTIF (Mendapat Komisi)\n`;
    csv += `Nama Kafe,Harga Sewa,Komisi\n`;
    m.activeTenants.forEach(t => {
      csv += `"${t.name}",${getPrice(t)},${getCommission(t)}\n`;
    });
    
    csv += `\nKAFE EXPIRED/BELUM BAYAR (Tidak Mendapat Komisi)\n`;
    csv += `Nama Kafe,Status\n`;
    m.expiredTenants.forEach(t => {
      csv += `"${t.name}","${t.is_active === false ? 'Suspend' : 'Expired'}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Laporan_Marketing_${m.name.replace(/\s+/g, '_')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const marketersWithStats = useMemo(() => {
    return marketers.map(m => {
      const myTenants = tenants.filter(t => (t.referral_name || '').toLowerCase() === m.name.toLowerCase());
      let commission = 0; let revenue = 0;
      const activeTenants = [];
      const expiredTenants = [];

      myTenants.forEach(t => {
        const daysLeft = calculateDaysLeft(t.subscription_end_date);
        const isActive = daysLeft > 0 && t.is_active !== false;
        
        if (isActive) {
          revenue += getPrice(t);
          commission += getCommission(t);
          activeTenants.push(t);
        } else {
          expiredTenants.push(t);
        }
      });

      return { 
        ...m, 
        count: myTenants.length, 
        revenue, 
        commission, 
        netProfit: revenue - commission,
        activeTenants, 
        expiredTenants, 
        rawTenants: myTenants 
      };
    });
  }, [marketers, tenants, now]);

  const filteredTenants = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return tenants.filter(t => {
      const matchSearch = !q || (t.name || '').toLowerCase().includes(q) || (t.referral_name || '').toLowerCase().includes(q) || (t.wa_number || '').toLowerCase().includes(q);
      const daysLeft = calculateDaysLeft(t.subscription_end_date);
      let matchStatus = true;
      if (filterStatus === 'online') matchStatus = effectiveOnline[t.id] === true && t.is_active !== false;
      else if (filterStatus === 'expired') matchStatus = hasEndDate(t) && daysLeft <= 0 && t.is_active !== false;
      else if (filterStatus === 'suspended') matchStatus = t.is_active === false;
      else if (filterStatus === 'warning') matchStatus = daysLeft > 0 && daysLeft <= 7 && t.is_active !== false;
      return matchSearch && matchStatus;
    });
  }, [tenants, searchQuery, filterStatus, effectiveOnline, now]);

  const sortedTenants = useMemo(() => {
    const arr = [...filteredTenants];
    if (sortBy === 'name') arr.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    else if (sortBy === 'daysLeft') arr.sort((a, b) => calculateDaysLeft(a.subscription_end_date) - calculateDaysLeft(b.subscription_end_date));
    else if (sortBy === 'revenue') arr.sort((a, b) => getPrice(b) - getPrice(a));
    else arr.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return arr;
  }, [filteredTenants, sortBy, now]);

  if (loading || !now) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center font-sans ${theme === 'dark' ? 'bg-[#050b14] text-cyan-400' : 'bg-slate-50 text-cyan-600'}`}>
        <div className="animate-spin w-12 h-12 border-4 border-current border-t-transparent rounded-full mb-4"></div>
        <p className="text-sm font-black tracking-widest uppercase">Memverifikasi Hak Akses...</p>
      </div>
    );
  }

  const bgMain = theme === 'dark' ? 'bg-[#050b14]' : 'bg-[#f0f4f8]';
  const textMain = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const textSub = theme === 'dark' ? 'text-slate-400' : 'text-slate-600';
  const cardClass = theme === 'dark' ? 'bg-[#0a192f] border-2 border-slate-700 shadow-[4px_4px_0px_0px_#06b6d4]' : 'bg-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_#000000]';
  const btnBase = 'border-2 font-black uppercase tracking-wider transition-all duration-150 flex items-center justify-center gap-2';
  const btnDark = 'bg-slate-800 text-white border-slate-900 shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none hover:bg-slate-700';
  const btnLight = 'bg-white text-slate-900 border-slate-900 shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none hover:bg-slate-100';
  const inputCls = `w-full border-2 rounded-lg px-3 py-2 text-sm font-bold outline-none ${theme === 'dark' ? 'bg-[#050b14] border-slate-600 text-white focus:border-cyan-400' : 'bg-slate-50 border-slate-400 text-slate-900 focus:border-cyan-600'}`;
  const modalShell = `border-2 rounded-xl w-full overflow-hidden ${theme === 'dark' ? 'bg-[#0a192f] border-slate-700 shadow-[6px_6px_0px_0px_#06b6d4]' : 'bg-white border-slate-900 shadow-[6px_6px_0px_0px_#000]'}`;
  const modalHeader = `p-4 border-b-2 flex justify-between items-center ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-slate-900 bg-slate-100'}`;
  const sortLabels = { newest: 'Terbaru', name: 'Nama A-Z', daysLeft: 'Sisa Hari', revenue: 'Omset Tertinggi' };

  // Cek apakah referral value saat ini ada di marketers (untuk option tambahan legacy)
  const currentReferralExists = financeModal.referral && marketers.some(m => m.name.toLowerCase() === financeModal.referral.toLowerCase());

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${bgMain} ${textMain}`}>
      <header className={`border-b-2 ${theme === 'dark' ? 'border-slate-800 bg-[#0a192f]' : 'border-slate-900 bg-white'} sticky top-0 z-40`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-black tracking-tighter uppercase flex items-center gap-3">
              <span className={`p-2 border-2 rounded-lg ${theme === 'dark' ? 'border-cyan-400 text-cyan-400 bg-cyan-400/10' : 'border-cyan-600 text-cyan-600 bg-cyan-50'}`}><Icons.Shield /></span>
              Control Center
            </h1>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button onClick={() => setSettingsModal({ open: true, loading: false, qris_string: appSettings.qris_string, bank_name: appSettings.bank_name, bank_account: appSettings.bank_account, bank_holder: appSettings.bank_holder })} className={`${btnBase} ${theme === 'dark' ? btnDark : btnLight} px-4 py-2 rounded-lg`} title="Pengaturan Sistem">
              <Icons.Settings />
            </button>
            <button onClick={toggleTheme} className={`${btnBase} ${theme === 'dark' ? btnDark : btnLight} px-4 py-2 rounded-lg`} title="Toggle Tema">
              {theme === 'dark' ? <Icons.Sun /> : <Icons.Moon />}
            </button>
            <button onClick={handleLogout} className={`${btnBase} bg-rose-500 text-white border-rose-900 shadow-[2px_2px_0px_0px_#881337] hover:bg-rose-600 flex-1 sm:flex-none px-4 py-2 rounded-lg`}>
              <Icons.Logout /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        
        <div className={`flex p-1.5 rounded-xl border-2 ${theme === 'dark' ? 'bg-[#0a192f] border-slate-700' : 'bg-white border-slate-900'} w-full sm:w-max`}>
          <button onClick={() => setActiveTab('tenants')} className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-black uppercase tracking-wider text-xs transition-all ${activeTab === 'tenants' ? (theme === 'dark' ? 'bg-cyan-500 text-black shadow-[2px_2px_0px_0px_#000]' : 'bg-cyan-600 text-white shadow-[2px_2px_0px_0px_#000]') : textSub}`}>
            <Icons.Store /> Data Kafe ({stats.total})
          </button>
          <button onClick={() => setActiveTab('marketers')} className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-black uppercase tracking-wider text-xs transition-all ${activeTab === 'marketers' ? (theme === 'dark' ? 'bg-cyan-500 text-black shadow-[2px_2px_0px_0px_#000]' : 'bg-cyan-600 text-white shadow-[2px_2px_0px_0px_#000]') : textSub}`}>
            <Icons.Users /> Tim Marketing ({marketers.length})
          </button>
        </div>

        {activeTab === 'tenants' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-in fade-in slide-in-from-bottom-4">
            <div className={`${cardClass} rounded-xl p-5 relative overflow-hidden`}>
              <div className={`absolute top-0 right-0 p-3 opacity-10 ${theme === 'dark' ? 'text-white' : 'text-black'}`}><Icons.Store /></div>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${textSub}`}>Total Klien</p>
              <h3 className="text-4xl font-black">{stats.total}</h3>
            </div>
            <div className={`${cardClass} rounded-xl p-5 relative overflow-hidden`}>
              <div className={`absolute top-0 right-0 p-3 opacity-10 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}><Icons.Activity /></div>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>Kafe Online</p>
              <h3 className={`text-4xl font-black ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>{stats.online} <span className={`text-lg ${textSub}`}>/ {stats.total}</span></h3>
              <div className={`mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${
                presenceStatus === 'online' ? (theme === 'dark' ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-emerald-50 border-emerald-300 text-emerald-700') :
                presenceStatus === 'error' ? (theme === 'dark' ? 'bg-rose-500/10 border-rose-500/40 text-rose-400' : 'bg-rose-50 border-rose-300 text-rose-700') :
                (theme === 'dark' ? 'bg-amber-500/10 border-amber-500/40 text-amber-400' : 'bg-amber-50 border-amber-300 text-amber-700')
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  presenceStatus === 'online' ? 'bg-emerald-500 animate-pulse' :
                  presenceStatus === 'error' ? 'bg-rose-500' :
                  'bg-amber-500 animate-pulse'
                }`}></span>
                {presenceStatus === 'online' ? 'Realtime' : presenceStatus === 'error' ? 'Fallback' : 'Connecting'}
              </div>
            </div>
            <div className={`${cardClass} rounded-xl p-5 relative overflow-hidden`}>
              <div className={`absolute top-0 right-0 p-3 opacity-10 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}><Icons.Dollar /></div>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>Omset / Bln</p>
              <h3 className={`text-xl font-black ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>Rp {stats.revenue.toLocaleString('id-ID')}</h3>
            </div>
            <div className={`${cardClass} rounded-xl p-5 relative overflow-hidden`}>
              <div className={`absolute top-0 right-0 p-3 opacity-10 ${theme === 'dark' ? 'text-violet-400' : 'text-violet-600'}`}><Icons.BarChart /></div>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${theme === 'dark' ? 'text-violet-400' : 'text-violet-600'}`}>Komisi Sales (Total)</p>
              <h3 className={`text-xl font-black ${theme === 'dark' ? 'text-violet-400' : 'text-violet-600'}`}>Rp {stats.commission.toLocaleString('id-ID')}</h3>
            </div>
          </div>
        )}

        {/* 🔥 NET PROFIT — Bar lebar di bawah 4 kartu (Opsi B) */}
        {activeTab === 'tenants' && (
          <div className={`rounded-xl p-5 relative overflow-hidden border-2 animate-in fade-in slide-in-from-bottom-4 ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-[#0a192f] via-[#0d2137] to-[#0a192f] border-emerald-500/60 shadow-[4px_4px_0px_0px_#10b981]'
              : 'bg-gradient-to-r from-emerald-50 via-white to-emerald-50 border-emerald-600 shadow-[4px_4px_0px_0px_#059669]'
          }`}>
            <div className={`absolute top-0 right-0 p-4 opacity-10 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}><Icons.TrendingUp /></div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'}`}>💰 Net Profit (Total)</p>
                <h3 className={`text-4xl font-black ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'}`}>Rp {stats.netProfit.toLocaleString('id-ID')}</h3>
                <p className={`text-[10px] font-bold mt-1 uppercase tracking-wider ${textSub}`}>Omset (Rp {stats.revenue.toLocaleString('id-ID')}) − Komisi (Rp {stats.commission.toLocaleString('id-ID')})</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tenants' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className={`flex flex-col lg:flex-row gap-3 justify-between items-stretch p-3 rounded-xl border-2 ${theme === 'dark' ? 'bg-[#0a192f] border-slate-700 shadow-[4px_4px_0px_0px_#06b6d4]' : 'bg-white border-slate-900 shadow-[4px_4px_0px_0px_#000]'}`}>
              <div className="relative flex-1 min-w-0">
                <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${textSub}`}><Icons.Search /></span>
                <input type="text" placeholder="Cari kafe / referral / WA..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className={`w-full bg-transparent border-none outline-none pl-10 pr-4 py-2 text-sm font-bold ${theme === 'dark' ? 'text-white placeholder:text-slate-600' : 'text-slate-900 placeholder:text-slate-400'}`} />
              </div>
              <div className="relative">
                <button onClick={(e) => { e.stopPropagation(); setShowSortMenu(v => !v); }} className={`${btnBase} ${theme === 'dark' ? btnDark : btnLight} px-3 py-2 rounded-lg text-[10px] w-full lg:w-auto`}>
                  <Icons.Sort /> {sortLabels[sortBy]}
                </button>
                {showSortMenu && (
                  <div onClick={(e) => e.stopPropagation()} className={`absolute right-0 top-full mt-1 z-50 rounded-lg border-2 overflow-hidden ${theme === 'dark' ? 'bg-[#0a192f] border-slate-700' : 'bg-white border-slate-900'}`}>
                    {Object.entries(sortLabels).map(([k, v]) => (
                      <button key={k} onClick={() => { setSortBy(k); setShowSortMenu(false); }} className={`block w-full text-left px-4 py-2 text-[10px] font-black uppercase tracking-wider whitespace-nowrap ${sortBy === k ? (theme === 'dark' ? 'bg-cyan-500 text-black' : 'bg-cyan-600 text-white') : `${textSub} hover:${textMain}`}`}>{v}</button>
                    ))}
                  </div>
                )}
              </div>
              <div className={`flex p-1 rounded-lg border-2 ${theme === 'dark' ? 'bg-[#050b14] border-slate-700' : 'bg-slate-100 border-slate-300'} overflow-x-auto`}>
                {['all', 'online', 'expired', 'suspended', 'warning'].map(f => (
                  <button key={f} onClick={() => setFilterStatus(f)} className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all ${filterStatus === f ? (theme === 'dark' ? 'bg-cyan-500 text-black' : 'bg-cyan-600 text-white') : `${textSub} hover:${textMain}`}`}>{f === 'all' ? 'Semua' : f === 'suspended' ? 'Suspend' : f}</button>
                ))}
              </div>
            </div>

            <div className={`hidden lg:block rounded-xl border-2 overflow-hidden ${theme === 'dark' ? 'border-slate-700 shadow-[6px_6px_0px_0px_#06b6d4]' : 'border-slate-900 shadow-[6px_6px_0px_0px_#000]'}`}>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`text-[10px] font-black uppercase tracking-widest border-b-2 ${theme === 'dark' ? 'bg-[#050b14] text-cyan-400 border-slate-700' : 'bg-slate-200 text-slate-900 border-slate-900'}`}>
                    <th className="p-4">Nama Kafe</th><th className="p-4">Status</th><th className="p-4">Sisa Waktu</th><th className="p-4">Finansial</th><th className="p-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className={`divide-y-2 ${theme === 'dark' ? 'divide-slate-800 bg-[#0a192f]' : 'divide-slate-200 bg-white'}`}>
                  {sortedTenants.map((tenant) => {
                    const daysLeft = calculateDaysLeft(tenant.subscription_end_date);
                    const isOnline = effectiveOnline[tenant.id];
                    const isSuspended = tenant.is_active === false;
                    const isExpired = hasEndDate(tenant) && daysLeft <= 0 && !isSuspended;
                    const isWarning = hasEndDate(tenant) && daysLeft > 0 && daysLeft <= 7 && !isSuspended;
                    const busy = !!actionLoading[tenant.id];
                    return (
                      <tr key={tenant.id} className={`transition-colors ${isSuspended ? 'opacity-50 grayscale' : (theme === 'dark' ? 'hover:bg-[#0d2137]' : 'hover:bg-slate-50')}`}>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {tenant.logo_url ? <img src={tenant.logo_url} alt="" className={`w-10 h-10 rounded-lg object-cover border-2 ${theme === 'dark' ? 'border-slate-600' : 'border-slate-900'}`} /> : <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-black border-2 ${theme === 'dark' ? 'bg-slate-800 text-cyan-400 border-slate-600' : 'bg-slate-200 text-slate-900 border-slate-900'}`}>{(tenant.name || '?').charAt(0)}</div>}
                            <div>
                              <p className="font-black text-base">{tenant.name}</p>
                              <button onClick={() => copyToClipboard(tenant.id, 'ID Tenant')} className={`text-[9px] font-bold font-mono ${textSub} hover:text-cyan-400 flex items-center gap-1`}>ID: {tenant.id.slice(0, 8)}... <Icons.Copy /></button>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider border-2 ${isSuspended ? (theme === 'dark' ? 'bg-rose-500/20 border-rose-500 text-rose-400' : 'bg-rose-100 border-rose-600 text-rose-700') : isOnline ? (theme === 'dark' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-emerald-100 border-emerald-600 text-emerald-700') : (theme === 'dark' ? 'bg-slate-800 border-slate-600 text-slate-400' : 'bg-slate-100 border-slate-400 text-slate-600')}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${!isSuspended && isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></span>
                            {isSuspended ? 'Suspended' : isOnline ? 'Online' : 'Offline'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col gap-0.5">
                            <span className={`text-xl font-black ${isExpired ? 'text-rose-500' : isWarning ? 'text-violet-500' : (theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')}`}>{isSuspended ? 'BEKU' : hasEndDate(tenant) ? `${daysLeft} HARI` : '—'}</span>
                            <p className={`text-[9px] font-bold uppercase tracking-wider ${textSub}`}>{isSuspended ? 'Disuspend' : hasEndDate(tenant) ? formatDateID(tenant.subscription_end_date) : 'Belum diatur'}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col gap-0.5">
                            <p className={`text-xs font-black ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>Rp {getPrice(tenant).toLocaleString('id-ID')}</p>
                            <p className={`text-[9px] font-bold ${textSub}`}>Ref: <span className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>{tenant.referral_name || '-'}</span></p>
                            <p className={`text-[9px] font-bold ${textSub}`}>Komisi: <span className={theme === 'dark' ? 'text-violet-400' : 'text-violet-600'}>Rp {getCommission(tenant).toLocaleString('id-ID')}</span></p>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            <button onClick={() => setDetailModal({ open: true, tenant })} className={`${btnBase} ${theme === 'dark' ? 'bg-white/10 text-white border-white hover:bg-white/20' : 'bg-slate-200 text-slate-900 border-slate-900 hover:bg-slate-300'} p-2 rounded-lg`} title="Detail Tenant"><Icons.Eye /></button>
                            <button onClick={() => openWaTenant(tenant)} className={`${btnBase} ${theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500 hover:bg-emerald-500/30' : 'bg-emerald-100 text-emerald-600 border-emerald-600 hover:bg-emerald-200'} p-2 rounded-lg`} title="Kirim Tagihan & QRIS via WA"><Icons.WhatsApp /></button>
                            <button onClick={() => openStats(tenant)} className={`${btnBase} ${theme === 'dark' ? 'bg-white/10 text-white border-white hover:bg-white/20' : 'bg-slate-200 text-slate-900 border-slate-900 hover:bg-slate-300'} p-2 rounded-lg`} title="Statistik"><Icons.BarChart /></button>
                            <button onClick={() => openFinance(tenant)} className={`${btnBase} ${theme === 'dark' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500 hover:bg-cyan-500/30' : 'bg-cyan-100 text-cyan-700 border-cyan-700 hover:bg-cyan-200'} p-2 rounded-lg`} title="Finansial"><Icons.Settings /></button>
                            <button disabled={busy} onClick={() => requestToggleStatus(tenant)} className={`${btnBase} ${isSuspended ? (theme === 'dark' ? 'bg-emerald-500 text-black border-emerald-600' : 'bg-emerald-500 text-white border-emerald-700') : (theme === 'dark' ? 'bg-slate-800 text-white border-slate-600' : 'bg-slate-200 text-slate-900 border-slate-400')} px-3 py-2 rounded-lg text-[10px] disabled:opacity-50`}>{isSuspended ? 'Aktifkan' : 'Suspend'}</button>
                            <button onClick={() => setExtendModal({ open: true, tenant, loading: false })} className={`${btnBase} bg-blue-600 text-white border-blue-900 shadow-[2px_2px_0px_0px_#1e3a8a] hover:bg-blue-500 px-3 py-2 rounded-lg text-[10px]`}><Icons.Plus /> Extend</button>
                            <button disabled={busy} onClick={() => requestDelete(tenant)} className={`${btnBase} ${theme === 'dark' ? 'bg-rose-500/20 text-rose-400 border-rose-500 hover:bg-rose-500/30' : 'bg-rose-100 text-rose-600 border-rose-600 hover:bg-rose-200'} p-2 rounded-lg disabled:opacity-50`} title="Hapus"><Icons.Trash /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="lg:hidden space-y-5">
              {sortedTenants.map((tenant) => {
                const daysLeft = calculateDaysLeft(tenant.subscription_end_date);
                const isOnline = effectiveOnline[tenant.id];
                const isSuspended = tenant.is_active === false;
                const isExpired = hasEndDate(tenant) && daysLeft <= 0 && !isSuspended;
                const isWarning = hasEndDate(tenant) && daysLeft > 0 && daysLeft <= 7 && !isSuspended;
                const busy = !!actionLoading[tenant.id];
                return (
                  <div key={tenant.id} className={`${cardClass} rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden ${isSuspended ? 'opacity-60 grayscale' : ''}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2.5">
                        {tenant.logo_url ? <img src={tenant.logo_url} alt="" className={`w-10 h-10 rounded-lg object-cover border-2 ${theme === 'dark' ? 'border-slate-600' : 'border-slate-900'}`} /> : <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-black border-2 ${theme === 'dark' ? 'bg-slate-800 text-cyan-400 border-slate-600' : 'bg-slate-200 text-slate-900 border-slate-900'}`}>{(tenant.name || '?').charAt(0)}</div>}
                        <div>
                          <h3 className="font-black text-base leading-tight">{tenant.name}</h3>
                          <button onClick={() => copyToClipboard(tenant.id, 'ID Tenant')} className={`text-[9px] font-bold font-mono ${textSub} flex items-center gap-1`}>ID: {tenant.id.slice(0, 8)}... <Icons.Copy /></button>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider border-2 ${isSuspended ? (theme === 'dark' ? 'bg-rose-500/20 border-rose-500 text-rose-400' : 'bg-rose-100 border-rose-600 text-rose-700') : isOnline ? (theme === 'dark' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-emerald-100 border-emerald-600 text-emerald-700') : (theme === 'dark' ? 'bg-slate-800 border-slate-600 text-slate-400' : 'bg-slate-100 border-slate-400 text-slate-600')}`}>{isSuspended ? 'Suspended' : isOnline ? 'Online' : 'Offline'}</span>
                    </div>
                    <div className={`rounded-lg p-2.5 border-2 flex flex-col gap-1.5 ${theme === 'dark' ? 'bg-[#050b14] border-slate-700' : 'bg-slate-50 border-slate-300'}`}>
                      <div className="flex justify-between items-center"><p className={`text-[10px] font-bold uppercase ${textSub}`}>Sisa Waktu</p><span className={`text-lg font-black ${isExpired ? 'text-rose-500' : isWarning ? 'text-violet-500' : (theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')}`}>{isSuspended ? 'BEKU' : hasEndDate(tenant) ? `${daysLeft} HARI` : '—'}</span></div>
                      <div className="flex justify-between items-center"><p className={`text-[10px] font-bold uppercase ${textSub}`}>Harga Sewa</p><span className={`text-xs font-black ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>Rp {getPrice(tenant).toLocaleString('id-ID')}</span></div>
                      <div className="flex justify-between items-center"><p className={`text-[10px] font-bold uppercase ${textSub}`}>Referral</p><span className={`text-xs font-black ${textMain}`}>{tenant.referral_name || '-'}</span></div>
                      <div className="flex justify-between items-center"><p className={`text-[10px] font-bold uppercase ${textSub}`}>Komisi</p><span className={`text-xs font-black ${theme === 'dark' ? 'text-violet-400' : 'text-violet-600'}`}>Rp {getCommission(tenant).toLocaleString('id-ID')}</span></div>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 mt-1">
                      <button onClick={() => setExtendModal({ open: true, tenant, loading: false })} className={`${btnBase} bg-blue-600 text-white border-blue-900 shadow-[2px_2px_0px_0px_#1e3a8a] col-span-2 py-2.5 rounded-lg text-xs`}><Icons.Plus /> Perpanjang</button>
                      <button onClick={() => setDetailModal({ open: true, tenant })} className={`${btnBase} ${theme === 'dark' ? 'bg-slate-800 text-white border-slate-600' : 'bg-slate-200 text-slate-900 border-slate-900'} py-2 rounded-lg text-[10px]`}><Icons.Eye /> Detail</button>
                      <button onClick={() => openWaTenant(tenant)} className={`${btnBase} ${theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500' : 'bg-emerald-100 text-emerald-700 border-emerald-700'} py-2 rounded-lg text-[10px]`}><Icons.WhatsApp /> Tagih WA</button>
                      <button onClick={() => openFinance(tenant)} className={`${btnBase} ${theme === 'dark' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500' : 'bg-cyan-100 text-cyan-700 border-cyan-700'} py-2 rounded-lg text-[10px]`}><Icons.Settings /> Finansial</button>
                      <button onClick={() => openStats(tenant)} className={`${btnBase} ${theme === 'dark' ? 'bg-slate-800 text-white border-slate-600' : 'bg-slate-200 text-slate-900 border-slate-900'} py-2 rounded-lg text-[10px]`}><Icons.BarChart /> Statistik</button>
                      <button disabled={busy} onClick={() => requestToggleStatus(tenant)} className={`${btnBase} ${isSuspended ? (theme === 'dark' ? 'bg-emerald-500 text-black border-emerald-600' : 'bg-emerald-500 text-white border-emerald-700') : (theme === 'dark' ? 'bg-slate-800 text-white border-slate-600' : 'bg-slate-200 text-slate-900 border-slate-400')} py-2 rounded-lg text-[10px] disabled:opacity-50`}>{isSuspended ? 'Aktifkan' : 'Suspend'}</button>
                      <button disabled={busy} onClick={() => requestDelete(tenant)} className={`${btnBase} bg-rose-500 text-white border-rose-900 shadow-[2px_2px_0px_0px_#881337] py-2 rounded-lg text-[10px] disabled:opacity-50`}><Icons.Trash /> Hapus</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'marketers' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black uppercase tracking-wider">Tim Marketing & Bagi Hasil</h2>
              <button onClick={() => setMarketerModal({ open: true, name: '', wa: '', city: '', loading: false })} className={`${btnBase} bg-cyan-600 text-white border-cyan-900 shadow-[2px_2px_0px_0px_#164e63] hover:bg-cyan-500 px-4 py-2 rounded-lg text-xs`}>
                <Icons.UserPlus /> Tambah Marketing
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {marketersWithStats.length === 0 ? (
                <div className={`col-span-full p-8 text-center rounded-xl border-2 border-dashed ${theme === 'dark' ? 'border-slate-700 text-slate-500' : 'border-slate-300 text-slate-400'}`}>Belum ada data marketing. Silakan tambah.</div>
              ) : marketersWithStats.map(m => (
                <div key={m.id} className={`${cardClass} rounded-xl p-5 flex flex-col relative overflow-hidden`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-black text-lg text-cyan-500">{m.name}</h3>
                      <p className={`text-xs font-bold ${textSub} flex items-center gap-1 flex-wrap`}>
                        <span>{m.wa_number || 'Tanpa WA'}</span>
                        {m.city && (<><span className="opacity-50">•</span><span className="inline-flex items-center gap-0.5"><Icons.MapPin /><span className="text-[10px]">{m.city}</span></span></>)}
                      </p>
                    </div>
                    <button onClick={() => requestDeleteMarketer(m)} className={`${btnBase} ${theme === 'dark' ? 'bg-rose-500/20 text-rose-400 border-rose-500' : 'bg-rose-100 text-rose-600 border-rose-600'} p-2 rounded-lg`} title="Hapus Marketing"><Icons.Trash /></button>
                  </div>
                  
                  <div className={`rounded-lg p-3 border-2 flex flex-col gap-2 mb-4 ${theme === 'dark' ? 'bg-[#050b14] border-slate-700' : 'bg-slate-50 border-slate-300'}`}>
                    <div className="flex justify-between items-center">
                      <p className={`text-[10px] font-bold uppercase ${textSub}`}>Kafe Direferensi</p>
                      <span className={`text-sm font-black ${textMain}`}>{m.count} Kafe</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className={`text-[10px] font-bold uppercase ${textSub}`}>Total Omset Klien</p>
                      <span className={`text-xs font-black ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>Rp {m.revenue.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className={`text-[10px] font-bold uppercase ${textSub}`}>Komisi</p>
                      <span className={`text-sm font-black ${theme === 'dark' ? 'text-violet-400' : 'text-violet-600'}`}>Rp {m.commission.toLocaleString('id-ID')}</span>
                    </div>
                    <div className={`flex justify-between items-center pt-2 border-t-2 ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
                      <p className={`text-[10px] font-bold uppercase ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'}`}>Net Profit</p>
                      <span className={`text-sm font-black ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'}`}>Rp {m.netProfit.toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-auto">
                    <button onClick={() => setMarketerDetailModal({ open: true, marketer: m })} className={`${btnBase} ${theme === 'dark' ? 'bg-slate-800 text-white border-slate-600' : 'bg-slate-200 text-slate-900 border-slate-900'} py-2 rounded-lg text-[10px]`}><Icons.Eye /> Detail Kafe</button>
                    <button onClick={() => handleExportMarketing(m)} className={`${btnBase} ${theme === 'dark' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500' : 'bg-cyan-100 text-cyan-700 border-cyan-700'} py-2 rounded-lg text-[10px]`}><Icons.Download /> Export Excel</button>
                    <button onClick={() => openWaMarketer(m, { count: m.count, commission: m.commission, activeTenants: m.activeTenants, expiredTenants: m.expiredTenants })} className={`${btnBase} ${theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500' : 'bg-emerald-100 text-emerald-700 border-emerald-700'} col-span-2 py-2 rounded-lg text-[10px]`}><Icons.WhatsApp /> Kirim Rincian via WA</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* MODAL PENGATURAN */}
      {settingsModal.open && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className={`${modalShell} max-w-md`}>
            <div className={modalHeader}>
              <h3 className="font-black text-base uppercase tracking-wider flex items-center gap-2"><Icons.Settings /> Pengaturan Sistem</h3>
              <button onClick={() => setSettingsModal({ open: false, loading: false, qris_string: '', bank_name: '', bank_account: '', bank_holder: '' })} className={`p-1 border-2 rounded ${theme === 'dark' ? 'border-slate-500 hover:bg-slate-700' : 'border-slate-400 hover:bg-slate-200'}`}><Icons.X /></button>
            </div>
            <form onSubmit={saveSettings} className="p-5 space-y-3 max-h-[75vh] overflow-y-auto">
              <div>
                <label className={`block text-[10px] font-black uppercase tracking-wider mb-1 ${textSub}`}>String QRIS (Teks Panjang)</label>
                <textarea placeholder="000201010212..." rows={3} value={settingsModal.qris_string} onChange={e => setSettingsModal({ ...settingsModal, qris_string: e.target.value })} className={inputCls} />
                <p className={`text-[9px] text-slate-500 mt-1`}>*Sistem akan otomatis mengubah teks ini menjadi gambar QRIS berbingkai standar ASPI saat menagih via WA.</p>
              </div>
              <div className="border-t-2 border-slate-300 dark:border-slate-700 my-2 pt-2"></div>
              <div><label className={`block text-[10px] font-black uppercase tracking-wider mb-1 ${textSub}`}>Nama Bank (Cth: Mandiri)</label><input type="text" placeholder="Mandiri" value={settingsModal.bank_name} onChange={e => setSettingsModal({ ...settingsModal, bank_name: e.target.value })} className={inputCls} /></div>
              <div><label className={`block text-[10px] font-black uppercase tracking-wider mb-1 ${textSub}`}>Nomor Rekening</label><input type="text" placeholder="123-456-789" value={settingsModal.bank_account} onChange={e => setSettingsModal({ ...settingsModal, bank_account: e.target.value })} className={inputCls} /></div>
              <div><label className={`block text-[10px] font-black uppercase tracking-wider mb-1 ${textSub}`}>Atas Nama</label><input type="text" placeholder="Nama Pemilik" value={settingsModal.bank_holder} onChange={e => setSettingsModal({ ...settingsModal, bank_holder: e.target.value })} className={inputCls} /></div>
              <button type="submit" disabled={settingsModal.loading} className={`${btnBase} w-full py-2.5 bg-cyan-600 text-white border-cyan-900 shadow-[2px_2px_0px_0px_#164e63] hover:bg-cyan-500 mt-2 rounded-lg text-sm disabled:opacity-50`}>{settingsModal.loading ? 'Menyimpan...' : 'Simpan Pengaturan'}</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Extend */}
      {extendModal.open && extendModal.tenant && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className={`${modalShell} max-w-sm`}>
            <div className={modalHeader}>
              <h3 className="font-black text-base uppercase tracking-wider">Perpanjang Waktu</h3>
              <button disabled={extendModal.loading} onClick={() => setExtendModal({ open: false, tenant: null, loading: false })} className={`p-1 border-2 rounded ${theme === 'dark' ? 'border-slate-500 hover:bg-slate-700' : 'border-slate-400 hover:bg-slate-200'} disabled:opacity-50`}><Icons.X /></button>
            </div>
            <div className="p-5 space-y-3">
              <p className={`text-xs font-bold text-center ${textSub}`}>Pilih durasi untuk <span className={textMain}>{extendModal.tenant.name}</span>:</p>
              <div className="grid grid-cols-2 gap-2">
                {[7, 30, 90, 365].map(days => (
                  <button key={days} disabled={extendModal.loading} onClick={() => submitExtend(days)} className={`py-3 rounded-lg flex flex-col items-center justify-center transition-all border-2 disabled:opacity-50 ${theme === 'dark' ? 'bg-[#050b14] border-slate-600 hover:border-cyan-500 hover:bg-slate-800 shadow-[2px_2px_0px_0px_#000]' : 'bg-slate-50 border-slate-300 hover:border-cyan-600 hover:bg-white shadow-[2px_2px_0px_0px_#000]'}`}>
                    <span className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{days}</span>
                    <span className={`text-[9px] font-black uppercase tracking-wider ${textSub}`}>Hari</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Finansial — dengan DROPDOWN Sales */}
      {financeModal.open && financeModal.tenant && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className={`${modalShell} max-w-sm`}>
            <div className={modalHeader}>
              <h3 className="font-black text-base uppercase tracking-wider">Data Finansial</h3>
              <button onClick={() => setFinanceModal({ open: false, tenant: null, loading: false, price: '', referral: '', commission: '' })} className={`p-1 border-2 rounded ${theme === 'dark' ? 'border-slate-500 hover:bg-slate-700' : 'border-slate-400 hover:bg-slate-200'}`}><Icons.X /></button>
            </div>
            <form onSubmit={saveFinance} className="p-5 space-y-3">
              <h4 className={`font-black text-center text-base ${textMain}`}>{financeModal.tenant.name}</h4>
              <div><label className={`block text-[10px] font-black uppercase tracking-wider mb-1 ${textSub}`}>Harga Sewa / Bulan (Rp)</label><input type="number" required value={financeModal.price} onChange={e => setFinanceModal({ ...financeModal, price: e.target.value })} className={inputCls} /></div>
              <div>
                <label className={`block text-[10px] font-black uppercase tracking-wider mb-1 ${textSub}`}>Nama Sales / Referral</label>
                <select value={financeModal.referral || ''} onChange={e => setFinanceModal({ ...financeModal, referral: e.target.value })} className={inputCls}>
                  <option value="">— Tanpa Sales —</option>
                  {marketers.map(m => (
                    <option key={m.id} value={m.name}>{m.name}{m.city ? ` (${m.city})` : ''}</option>
                  ))}
                  {financeModal.referral && !currentReferralExists && (
                    <option value={financeModal.referral}>{financeModal.referral} (Tidak Terdaftar)</option>
                  )}
                </select>
                <p className={`text-[9px] mt-1 ${textSub}`}>Pilih dari daftar marketing yang sudah terdaftar. Tambah sales baru di tab "Tim Marketing".</p>
              </div>
              <div><label className={`block text-[10px] font-black uppercase tracking-wider mb-1 ${textSub}`}>Bagi Hasil / Komisi Sales (Rp)</label><input type="number" value={financeModal.commission} onChange={e => setFinanceModal({ ...financeModal, commission: e.target.value })} className={inputCls} /></div>
              {Number(financeModal.price) > 0 && (
                <div className={`rounded-lg p-3 border-2 ${theme === 'dark' ? 'bg-[#050b14] border-emerald-500/40' : 'bg-emerald-50 border-emerald-300'}`}>
                  <p className={`text-[10px] font-black uppercase tracking-wider mb-1 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'}`}>Net Profit Kafe Ini</p>
                  <p className={`text-lg font-black ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'}`}>Rp {(Number(financeModal.price) - Number(financeModal.commission || 0)).toLocaleString('id-ID')}</p>
                  <p className={`text-[9px] ${textSub}`}>Omset − Komisi</p>
                </div>
              )}
              <button type="submit" disabled={financeModal.loading} className={`${btnBase} w-full py-2.5 bg-cyan-600 text-white border-cyan-900 shadow-[2px_2px_0px_0px_#164e63] hover:bg-cyan-500 mt-2 rounded-lg text-sm disabled:opacity-50`}>{financeModal.loading ? 'Menyimpan...' : 'Simpan Finansial'}</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Statistik */}
      {statsModal.open && statsModal.tenant && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className={`${modalShell} max-w-sm`}>
            <div className={modalHeader}>
              <h3 className="font-black text-base uppercase tracking-wider flex items-center gap-2"><Icons.BarChart /> Statistik</h3>
              <button onClick={() => setStatsModal({ open: false, tenant: null, data: null, loading: false })} className={`p-1 border-2 rounded ${theme === 'dark' ? 'border-slate-500 hover:bg-slate-700' : 'border-slate-400 hover:bg-slate-200'}`}><Icons.X /></button>
            </div>
            <div className="p-5">
              <h4 className={`text-lg font-black mb-5 text-center uppercase ${textMain}`}>{statsModal.tenant.name}</h4>
              {statsModal.loading ? (
                <div className="flex justify-center py-6"><div className={`w-8 h-8 border-4 border-t-transparent rounded-full animate-spin ${theme === 'dark' ? 'border-cyan-400' : 'border-cyan-600'}`}></div></div>
              ) : statsModal.data?.error ? (
                <p className="text-center text-sm font-black text-rose-500">Gagal memuat statistik. Coba lagi.</p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div className={`border-2 rounded-lg p-3 text-center ${theme === 'dark' ? 'bg-[#050b14] border-slate-700' : 'bg-slate-50 border-slate-300'}`}><p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${textSub}`}>Total Menu</p><p className={`text-3xl font-black ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>{statsModal.data?.menus ?? '-'}</p></div>
                  <div className={`border-2 rounded-lg p-3 text-center ${theme === 'dark' ? 'bg-[#050b14] border-slate-700' : 'bg-slate-50 border-slate-300'}`}><p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${textSub}`}>Total Order</p><p className={`text-3xl font-black ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>{statsModal.data?.orders ?? '-'}</p></div>
                  <div className={`border-2 rounded-lg p-3 text-center ${theme === 'dark' ? 'bg-[#050b14] border-slate-700' : 'bg-slate-50 border-slate-300'}`}><p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${textSub}`}>Order 30 Hari</p><p className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{statsModal.data?.recentCount ?? '-'}</p></div>
                  <div className={`border-2 rounded-lg p-3 text-center ${theme === 'dark' ? 'bg-[#050b14] border-slate-700' : 'bg-slate-50 border-slate-300'}`}><p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${textSub}`}>Omzet 30 Hari</p><p className={`text-lg font-black ${theme === 'dark' ? 'text-violet-400' : 'text-violet-600'}`}>Rp {(statsModal.data?.revenue30 || 0).toLocaleString('id-ID')}</p></div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail Tenant */}
      {detailModal.open && detailModal.tenant && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className={`${modalShell} max-w-md`}>
            <div className={modalHeader}>
              <h3 className="font-black text-base uppercase tracking-wider flex items-center gap-2"><Icons.Eye /> Detail Tenant</h3>
              <button onClick={() => setDetailModal({ open: false, tenant: null })} className={`p-1 border-2 rounded ${theme === 'dark' ? 'border-slate-500 hover:bg-slate-700' : 'border-slate-400 hover:bg-slate-200'}`}><Icons.X /></button>
            </div>
            <div className="p-5 space-y-2 max-h-[70vh] overflow-y-auto">
              <h4 className={`text-lg font-black mb-3 ${textMain}`}>{detailModal.tenant.name}</h4>
              {[
                ['Tenant ID', detailModal.tenant.id, true], ['No. WhatsApp', detailModal.tenant.wa_number || '—', false], ['Status Buka Kafe', detailModal.tenant.is_open ? '🟢 Buka' : '🔴 Tutup', false], ['Status Akun', detailModal.tenant.is_active === false ? '🔴 Suspended' : '🟢 Aktif', false], ['QRIS', detailModal.tenant.qris_string || '—', true], ['Pajak (%)', detailModal.tenant.tax_percentage != null ? `${detailModal.tenant.tax_percentage}%` : '—', false], ['Banner URL', detailModal.tenant.banner_url || '—', true], ['Logo URL', detailModal.tenant.logo_url || '—', true], ['Dibuat', detailModal.tenant.created_at ? new Date(detailModal.tenant.created_at).toLocaleString('id-ID') : '—', false],
              ].map(([label, value, copyable]) => (
                <div key={label} className={`rounded-lg p-2 border-2 flex justify-between items-start gap-2 ${theme === 'dark' ? 'bg-[#050b14] border-slate-700' : 'bg-slate-50 border-slate-300'}`}>
                  <div className="min-w-0 flex-1"><p className={`text-[9px] font-black uppercase tracking-wider ${textSub}`}>{label}</p><p className={`text-xs font-bold break-all ${textMain}`}>{value}</p></div>
                  {copyable && value !== '—' && (<button onClick={() => copyToClipboard(value, label)} className={`p-1.5 border-2 rounded ${theme === 'dark' ? 'border-slate-600 hover:bg-slate-700' : 'border-slate-400 hover:bg-slate-200'}`}><Icons.Copy /></button>)}
                </div>
              ))}
              <div className={`rounded-lg p-3 border-2 flex justify-between items-center gap-2 ${theme === 'dark' ? 'bg-[#050b14] border-slate-700' : 'bg-slate-50 border-slate-300'}`}>
                <div><p className={`text-[9px] font-black uppercase tracking-wider ${textSub}`}>Kitchen PIN</p><p className={`text-xs font-bold ${textMain}`}>{detailModal.tenant.kitchen_pin ? '••••••' : 'Belum diset'}</p></div>
                <button onClick={() => openPinModal(detailModal.tenant)} className={`${btnBase} bg-cyan-600 text-white border-cyan-900 shadow-[2px_2px_0px_0px_#164e63] px-3 py-1.5 rounded text-[10px]`}><Icons.Key /> Reset PIN</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Reset PIN */}
      {pinModal.open && pinModal.tenant && (
        <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4">
          <div className={`${modalShell} max-w-sm`}>
            <div className={modalHeader}>
              <h3 className="font-black text-base uppercase tracking-wider flex items-center gap-2"><Icons.Key /> Reset PIN Dapur</h3>
              <button onClick={() => setPinModal({ open: false, tenant: null, pin: '', loading: false })} className={`p-1 border-2 rounded ${theme === 'dark' ? 'border-slate-500 hover:bg-slate-700' : 'border-slate-400 hover:bg-slate-200'}`}><Icons.X /></button>
            </div>
            <form onSubmit={savePin} className="p-5 space-y-3">
              <p className={`text-xs font-bold text-center ${textSub}`}>PIN baru untuk <span className={textMain}>{pinModal.tenant.name}</span></p>
              <input type="text" inputMode="numeric" pattern="\d*" maxLength={8} required value={pinModal.pin} onChange={e => setPinModal({ ...pinModal, pin: e.target.value.replace(/\D/g, '') })} placeholder="4–8 digit angka" className={`${inputCls} text-center text-2xl tracking-widest`} />
              <button type="submit" disabled={pinModal.loading} className={`${btnBase} w-full py-2.5 bg-cyan-600 text-white border-cyan-900 shadow-[2px_2px_0px_0px_#164e63] hover:bg-cyan-500 rounded-lg text-sm disabled:opacity-50`}>{pinModal.loading ? 'Menyimpan...' : 'Simpan PIN Baru'}</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tambah Marketing — dengan KOTA */}
      {marketerModal.open && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className={`${modalShell} max-w-sm`}>
            <div className={modalHeader}>
              <h3 className="font-black text-base uppercase tracking-wider flex items-center gap-2"><Icons.UserPlus /> Tambah Marketing</h3>
              <button onClick={() => setMarketerModal({ open: false, name: '', wa: '', city: '', loading: false })} className={`p-1 border-2 rounded ${theme === 'dark' ? 'border-slate-500 hover:bg-slate-700' : 'border-slate-400 hover:bg-slate-200'}`}><Icons.X /></button>
            </div>
            <form onSubmit={saveMarketer} className="p-5 space-y-3">
              <div><label className={`block text-[10px] font-black uppercase tracking-wider mb-1 ${textSub}`}>Nama Marketing</label><input type="text" required placeholder="Cth: Budi Santoso" value={marketerModal.name} onChange={e => setMarketerModal({ ...marketerModal, name: e.target.value })} className={inputCls} /></div>
              <div><label className={`block text-[10px] font-black uppercase tracking-wider mb-1 ${textSub}`}>Nomor WhatsApp</label><input type="text" required placeholder="Cth: 08123456789" value={marketerModal.wa} onChange={e => setMarketerModal({ ...marketerModal, wa: e.target.value })} className={inputCls} /></div>
              <div>
                <label className={`block text-[10px] font-black uppercase tracking-wider mb-1 ${textSub}`}>Kota Asal <span className="opacity-60">(opsional)</span></label>
                <input type="text" placeholder="Cth: Bandung, Surabaya, Jakarta" value={marketerModal.city} onChange={e => setMarketerModal({ ...marketerModal, city: e.target.value })} className={inputCls} />
                <p className={`text-[9px] mt-1 ${textSub}`}>Memudahkan Admin membedakan sales antar kota.</p>
              </div>
              <button type="submit" disabled={marketerModal.loading} className={`${btnBase} w-full py-2.5 bg-cyan-600 text-white border-cyan-900 shadow-[2px_2px_0px_0px_#164e63] hover:bg-cyan-500 mt-2 rounded-lg text-sm disabled:opacity-50`}>{marketerModal.loading ? 'Menyimpan...' : 'Simpan Marketing'}</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detail Marketing (Daftar Kafe) — dengan KOTA */}
      {marketerDetailModal.open && marketerDetailModal.marketer && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className={`${modalShell} max-w-md`}>
            <div className={modalHeader}>
              <h3 className="font-black text-base uppercase tracking-wider flex items-center gap-2"><Icons.Users /> Kafe Rekomendasi {marketerDetailModal.marketer.name}</h3>
              <button onClick={() => setMarketerDetailModal({ open: false, marketer: null })} className={`p-1 border-2 rounded ${theme === 'dark' ? 'border-slate-500 hover:bg-slate-700' : 'border-slate-400 hover:bg-slate-200'}`}><Icons.X /></button>
            </div>
            <div className="p-5 max-h-[70vh] overflow-y-auto space-y-2">
              {marketerDetailModal.marketer.city && (
                <div className={`rounded-lg p-2 border-2 flex items-center gap-2 ${theme === 'dark' ? 'bg-[#050b14] border-slate-700' : 'bg-slate-50 border-slate-300'}`}>
                  <Icons.MapPin /><p className={`text-xs font-bold ${textSub}`}>Kota: <span className={textMain}>{marketerDetailModal.marketer.city}</span></p>
                </div>
              )}
              {marketerDetailModal.marketer.rawTenants.length === 0 ? (
                <p className={`text-center text-sm font-bold ${textSub}`}>Belum ada kafe yang direferensikan.</p>
              ) : (
                marketerDetailModal.marketer.rawTenants.map(t => {
                  const daysLeft = calculateDaysLeft(t.subscription_end_date);
                  const isActive = daysLeft > 0 && t.is_active !== false;
                  return (
                    <div key={t.id} className={`rounded-lg p-3 border-2 flex justify-between items-center ${theme === 'dark' ? 'bg-[#050b14] border-slate-700' : 'bg-slate-50 border-slate-300'}`}>
                      <div>
                        <p className={`font-black text-sm ${textMain}`}>{t.name}</p>
                        <p className={`text-[10px] font-bold ${isActive ? 'text-emerald-500' : 'text-rose-500'}`}>{t.is_active === false ? 'Suspend' : isActive ? `${daysLeft} Hari Lagi` : 'Expired'}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-xs font-black ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>Rp {getPrice(t).toLocaleString('id-ID')}</p>
                        <p className={`text-[10px] font-bold ${theme === 'dark' ? 'text-violet-400' : 'text-violet-600'}`}>Komisi: Rp {getCommission(t).toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi */}
      {confirmModal.open && (
        <div className="fixed inset-0 z-[70] bg-black/80 flex items-center justify-center p-4">
          <div className={`${modalShell} max-w-sm`}>
            <div className={modalHeader}>
              <h3 className={`font-black text-base uppercase tracking-wider ${confirmModal.danger ? 'text-rose-500' : ''}`}>{confirmModal.title}</h3>
              <button disabled={confirmModal.loading} onClick={() => setConfirmModal(EMPTY_CONFIRM)} className={`p-1 border-2 rounded ${theme === 'dark' ? 'border-slate-500 hover:bg-slate-700' : 'border-slate-400 hover:bg-slate-200'} disabled:opacity-50`}><Icons.X /></button>
            </div>
            <div className="p-5 space-y-3">
              <p className={`text-xs font-bold whitespace-pre-line ${textSub}`}>{confirmModal.message}</p>
              {confirmModal.requireInput && (
                <>
                  <p className={`text-[10px] font-black uppercase ${textSub}`}>Ketik <span className={confirmModal.danger ? 'text-rose-500' : 'text-cyan-500'}>&quot;{confirmModal.requireInput}&quot;</span> untuk konfirmasi:</p>
                  <input type="text" value={confirmModal.inputValue} onChange={e => setConfirmModal(prev => ({ ...prev, inputValue: e.target.value }))} className={inputCls} autoFocus disabled={confirmModal.loading} />
                </>
              )}
              <div className="flex gap-2 pt-2">
                <button disabled={confirmModal.loading} onClick={() => setConfirmModal(EMPTY_CONFIRM)} className={`${btnBase} ${theme === 'dark' ? btnDark : btnLight} flex-1 py-2 rounded-lg text-xs disabled:opacity-50`}>Batal</button>
                <button disabled={confirmModal.loading || (confirmModal.requireInput && confirmModal.inputValue !== confirmModal.requireInput)} onClick={async () => { if (confirmModal.onConfirm) await confirmModal.onConfirm(); }} className={`${btnBase} flex-1 py-2 rounded-lg text-xs disabled:opacity-50 ${confirmModal.danger ? 'bg-rose-500 text-white border-rose-900 shadow-[2px_2px_0px_0px_#881337] hover:bg-rose-600' : 'bg-emerald-500 text-white border-emerald-900 shadow-[2px_2px_0px_0px_#064e3b] hover:bg-emerald-600'}`}>{confirmModal.loading ? 'Proses...' : confirmModal.danger ? 'Ya, Lanjut' : 'Ya, Aktifkan'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOASTS */}
      <div className="fixed bottom-6 right-6 z-[100] space-y-2 w-[calc(100%-3rem)] sm:w-80 pointer-events-none">
        {toasts.map(t => {
          const isErr = t.type === 'error'; const isWarn = t.type === 'warning';
          const c = isErr ? 'bg-rose-500 text-white border-rose-900 shadow-[2px_2px_0px_0px_#881337]' : isWarn ? 'bg-violet-400 text-black border-violet-700 shadow-[2px_2px_0px_0px_#4c1d95]' : 'bg-emerald-500 text-white border-emerald-900 shadow-[2px_2px_0px_0px_#064e3b]';
          return (
            <div key={t.id} className={`pointer-events-auto flex items-center gap-2 px-3 py-2 border-2 rounded-lg animate-in slide-in-from-right-8 ${c}`}>
              <span className="text-lg">{isErr ? '❌' : isWarn ? '⚠️' : <Icons.Check />}</span>
              <p className="text-xs font-black uppercase tracking-wider flex-1">{t.message}</p>
            </div>
          );
        })}
      </div>

    </div>
  );
}