'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import Chart from 'chart.js/auto';
import { supabase } from '@/lib/supabase';

const Icons = {
  Menu: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  Sun: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  Moon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  ChevronDown: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><polyline points="6 9 12 15 18 9"/></svg>,
  ArrowRight: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 inline-block"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Activity: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  Plus: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Logout: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 shrink-0"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Refresh: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
  Download: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Search: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Alert: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Box: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  File: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  Coin: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><circle cx="12" cy="12" r="10"/><line x1="12" y1="6" x2="12" y2="18"/><path d="M15 9h-4a2 2 0 0 0 0 4h2a2 2 0 0 1 0 4H9"/></svg>,
  Grid: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" className="w-4 h-4 shrink-0"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
  Chart: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" className="w-4 h-4 shrink-0"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  Settings: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-4 h-4 shrink-0"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Close: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Bot: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M12 2a4 4 0 0 1 4 4v2h2a2 2 0 0 1 2 2v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-8a2 2 0 0 1 2-2h2V6a4 4 0 0 1 4-4z"/><circle cx="9" cy="13" r="1"/><circle cx="15" cy="13" r="1"/></svg>,
  Shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  Tag: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  Bolt: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5"><polyline points="20 6 9 17 4 12"/></svg>,
  Clock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
};

const DONUT_COLORS = ['#2563EB', '#10B981', '#D97706', '#E11D48', '#7C3AED', '#DB2777', '#0D9488', '#475569'];

const QUICK_AI_PROMPTS = [
  'Evaluasi laba bersih & margin HPP',
  'Buatkan promo 3 jam menu sepi',
  'Menu apa yang perlu dinaikkan stoknya?',
  'Cek anomali biaya & kasir hari ini',
];

const toLocalYYYYMMDD = (dateInput = new Date()) => {
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export default function OwnerDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const donutRef = useRef(null);
  const donutInstance = useRef(null);
  const branchDropdownRef = useRef(null);
  const realtimeDebounceRef = useRef(null);
  const latestParamsRef = useRef({ email: '', period: 'monthly', dateStr: '', branchId: 'all' });

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [realtimeConnected, setRealtimeConnected] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [period, setPeriod] = useState('monthly');
  const [selectedBranchId, setSelectedBranchId] = useState('all');
  const [activeAiTab, setActiveAiTab] = useState('advisor');

  const [dateDaily, setDateDaily] = useState(() => toLocalYYYYMMDD(new Date()));
  const [dateWeekly, setDateWeekly] = useState(() => {
    const now = new Date();
    const onejan = new Date(now.getFullYear(), 0, 1);
    const week = Math.ceil((((now - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    return `${now.getFullYear()}-W${week.toString().padStart(2, '0')}`;
  });
  const [dateMonthly, setDateMonthly] = useState(() => toLocalYYYYMMDD(new Date()).slice(0, 7));

  const [branches, setBranches] = useState([]);
  const [activities, setActivities] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [employeeTransactions, setEmployeeTransactions] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState({});
  const [topMenus, setTopMenus] = useState([]);
  const [lowMarginMenus, setLowMarginMenus] = useState([]);
  const [lowStockMenus, setLowStockMenus] = useState([]);
  const [unpaidInvoices, setUnpaidInvoices] = useState([]);

  const [stats, setStats] = useState({
    totalRevenue: 0,
    unpaidRevenue: 0,
    totalCogs: 0,
    grossProfit: 0,
    totalTransactions: 0,
    activeBranches: 0,
    chartData: [],
    prevChartData: [],
    labels: [],
    branchStats: {},
    totalExpense: 0,
    operationalExpense: 0,
    salaryExpense: 0,
    netProfit: 0,
    trends: { revenue: null, expense: null, netProfit: null },
  });

  const [aiInsights, setAiInsights] = useState({
    avgBasket: 0,
    repeatRate: 0,
    avgKdsMinutes: 0,
    maxKdsMin: 0,
    slowestTable: '-',
    slowestBranch: '-',
    diagnostics: [],
    actionPlans: [],
    fraudAlerts: [],
    activePromos: [],
    revenueAnomalies: [],
    costAudit: [],
    deadStockMenus: [],
    kdsPeakBottleneck: null,
  });

  const [executedActionIds, setExecutedActionIds] = useState({});
  const [executingActionId, setExecutingActionId] = useState(null);
  const [aiPromptInput, setAiPromptInput] = useState('');
  const [aiChatReply, setAiChatReply] = useState('');
  const [aiSuggestedAction, setAiSuggestedAction] = useState(null);
  const [isAskingAi, setIsAskingAi] = useState(false);
  const [aiConfig, setAiConfig] = useState({ provider: 'gemini', model: 'gemini-2.5-flash', apiKey: '' });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [linkBranchName, setLinkBranchName] = useState('');
  const [linkBranchEmail, setLinkBranchEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const getActiveDateStr = () => {
    if (period === 'daily') return dateDaily;
    if (period === 'weekly') return dateWeekly;
    return dateMonthly;
  };

  const getActiveWeekStr = () => {
    const now = new Date();
    const onejan = new Date(now.getFullYear(), 0, 1);
    const week = Math.ceil((((now - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    return `${now.getFullYear()}-W${week.toString().padStart(2, '0')}`;
  };

  const getActiveMonthStr = () => toLocalYYYYMMDD(new Date()).slice(0, 7);

  const getPrevPeriodStr = (currentPeriod, currentDateStr) => {
    if (currentPeriod === 'daily') {
      const d = new Date(`${currentDateStr}T00:00:00`);
      d.setDate(d.getDate() - 1);
      return toLocalYYYYMMDD(d);
    }
    if (currentPeriod === 'weekly') {
      const [y, w] = currentDateStr.split('-W').map(Number);
      if (w === 1) return `${y - 1}-W52`;
      return `${y}-W${(w - 1).toString().padStart(2, '0')}`;
    }
    if (currentPeriod === 'monthly') {
      const [y, m] = currentDateStr.split('-').map(Number);
      if (m === 1) return `${y - 1}-12`;
      return `${y}-${(m - 1).toString().padStart(2, '0')}`;
    }
    return currentDateStr;
  };

  const getPeriodRange = (p, dateStr) => {
    if (p === 'daily') {
      return { start: `${dateStr}T00:00:00`, end: `${dateStr}T23:59:59` };
    }
    if (p === 'weekly') {
      const [year, weekNum] = dateStr.split('-W').map(Number);
      const jan4 = new Date(Date.UTC(year, 0, 4));
      const weekStart = new Date(jan4.getTime() - ((jan4.getUTCDay() || 7) - 1) * 86400000 + (weekNum - 1) * 7 * 86400000);
      const weekEnd = new Date(weekStart.getTime() + 7 * 86400000 - 1);
      return { start: weekStart.toISOString().slice(0, 19), end: weekEnd.toISOString().slice(0, 19) };
    }
    if (p === 'monthly') {
      const [year, month] = dateStr.split('-').map(Number);
      const start = new Date(Date.UTC(year, month - 1, 1));
      const end = new Date(Date.UTC(year, month, 1) - 1);
      return { start: start.toISOString().slice(0, 19), end: end.toISOString().slice(0, 19) };
    }
    return { start: '', end: '' };
  };

  const computeTrend = (curr, prev) => {
    if (prev == null || prev === 0) return null;
    return ((curr - prev) / prev) * 100;
  };

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('nexaflow_theme');
      if (savedTheme === 'dark') setIsDarkMode(true);
      else setIsDarkMode(false);
    } catch (e) {
      // noop
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    try {
      localStorage.setItem('nexaflow_theme', isDarkMode ? 'dark' : 'light');
    } catch (e) {
      // noop
    }
  }, [isDarkMode]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('nexaflow_ai_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        setAiConfig({
          provider: parsed.provider || 'gemini',
          model: parsed.model || 'gemini-2.5-flash',
          apiKey: parsed.apiKey || '',
        });
      }
    } catch (e) {
      // noop
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (branchDropdownRef.current && !branchDropdownRef.current.contains(e.target)) {
        setIsBranchDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  const fetchAllData = async (email, currentPeriod, currentDateStr, branchId = selectedBranchId) => {
    if (!email) return;
    try {
      const prevDateStr = getPrevPeriodStr(currentPeriod, currentDateStr);
      const branchQuery = branchId && branchId !== 'all' ? `&tenant_id=${encodeURIComponent(branchId)}` : '';
      const tzOffset = new Date().getTimezoneOffset();
      const tzQuery = `&tz_offset=${encodeURIComponent(tzOffset)}`;

      const [tenantsRes, statsRes, actRes, prevRes] = await Promise.all([
        supabase.from('tenants').select('*').eq('manager_email', email).order('created_at', { ascending: false }),
        fetch(`/api/owner/stats?manager_email=${encodeURIComponent(email)}&period=${currentPeriod}&date_str=${currentDateStr}${branchQuery}${tzQuery}`),
        fetch(`/api/owner/recent-activity?manager_email=${encodeURIComponent(email)}`),
        fetch(`/api/owner/stats?manager_email=${encodeURIComponent(email)}&period=${currentPeriod}&date_str=${prevDateStr}${branchQuery}${tzQuery}`),
      ]);

      const tenantList = tenantsRes.data || [];
      setBranches(tenantList);

      let prevData = null;
      if (prevRes.ok) {
        try { prevData = await prevRes.json(); } catch (e) { prevData = null; }
      }

      if (statsRes.ok) {
        const statData = await statsRes.json();
        const branchIds = tenantList.map(b => b.id);
        const targetBranchIds = branchId && branchId !== 'all'
          ? branchIds.filter(id => id === branchId)
          : branchIds;
        const range = getPeriodRange(currentPeriod, currentDateStr);

        let empList = [];
        let txList = [];

        if (targetBranchIds.length > 0) {
          const [empRes, txRes] = await Promise.all([
            supabase.from('employees').select('id, tenant_id, name, role, base_salary, wa_number, is_active, created_at').in('tenant_id', targetBranchIds),
            supabase.from('employee_transactions').select('id, employee_id, tenant_id, type, amount, transaction_date').in('tenant_id', targetBranchIds).gte('transaction_date', range.start).lte('transaction_date', range.end),
          ]);
          empList = empRes.data || [];
          txList = txRes.data || [];
        }

        setEmployees(empList);
        setEmployeeTransactions(txList);
        setExpenseCategories(statData.expenseCategories || {});
        setTopMenus(statData.topMenus || []);
        setLowMarginMenus(statData.lowMarginMenus || []);
        setLowStockMenus(statData.lowStockMenus || []);
        setUnpaidInvoices(statData.unpaidInvoices || []);
        if (statData.savedAiConfig) {
          setAiConfig(prev => ({
            provider: statData.savedAiConfig.provider || prev.provider,
            model: statData.savedAiConfig.model || prev.model,
            apiKey: statData.savedAiConfig.apiKey || prev.apiKey,
          }));
        }
        if (statData.aiInsights) {
          setAiInsights(statData.aiInsights);
        }

        setStats({
          totalRevenue: statData.totalRevenue || 0,
          unpaidRevenue: statData.unpaidRevenue || 0,
          totalCogs: statData.totalCogs || 0,
          grossProfit: statData.grossProfit ?? (statData.totalRevenue || 0),
          totalTransactions: statData.totalTransactions || 0,
          activeBranches: statData.activeBranches || 0,
          chartData: statData.chartData || [],
          prevChartData: prevData?.chartData || [],
          labels: statData.labels || [],
          branchStats: statData.branchStats || {},
          totalExpense: statData.totalExpense || 0,
          operationalExpense: statData.operationalExpense || 0,
          salaryExpense: statData.salaryExpense || 0,
          netProfit: statData.netProfit || 0,
          trends: {
            revenue: computeTrend(statData.totalRevenue || 0, prevData?.totalRevenue || 0),
            expense: computeTrend(statData.totalExpense || 0, prevData?.totalExpense || 0),
            netProfit: computeTrend(statData.netProfit || 0, prevData?.netProfit || 0),
          },
        });
      }

      if (actRes.ok) {
        try { setActivities(await actRes.json()); } catch (e) { /* noop */ }
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    latestParamsRef.current = {
      email: userEmail,
      period,
      dateStr: getActiveDateStr(),
      branchId: selectedBranchId,
    };
  });

  useEffect(() => {
    let interval;
    const getSessionAndFetch = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = '/login';
        return;
      }
      const email = session.user.email;
      setUserEmail(email);

      setIsLoading(true);
      await fetchAllData(email, period, getActiveDateStr(), selectedBranchId);
      setIsLoading(false);

      const todayStr = toLocalYYYYMMDD(new Date());
      const isToday = (period === 'daily' && dateDaily === todayStr) ||
                      (period === 'weekly' && dateWeekly === getActiveWeekStr()) ||
                      (period === 'monthly' && dateMonthly === getActiveMonthStr());

      if (isToday) {
        interval = setInterval(async () => {
          const p = latestParamsRef.current;
          await fetchAllData(p.email, p.period, p.dateStr, p.branchId);
        }, 30000);
      }
    };

    getSessionAndFetch();
    return () => { if (interval) clearInterval(interval); };
  }, [period, dateDaily, dateWeekly, dateMonthly, selectedBranchId]);

  const branchIdsKey = useMemo(() => branches.map(b => b.id).sort().join(','), [branches]);
  useEffect(() => {
    if (!branchIdsKey) return;
    const triggerRealtimeRefresh = () => {
      if (realtimeDebounceRef.current) clearTimeout(realtimeDebounceRef.current);
      realtimeDebounceRef.current = setTimeout(() => {
        const p = latestParamsRef.current;
        if (p.email) {
          fetchAllData(p.email, p.period, p.dateStr, p.branchId);
        }
      }, 900);
    };

    const channel = supabase
      .channel(`owner-realtime-${Date.now()}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, triggerRealtimeRefresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'menus' }, triggerRealtimeRefresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses' }, triggerRealtimeRefresh)
      .subscribe((status) => {
        setRealtimeConnected(status === 'SUBSCRIBED');
      });

    return () => {
      if (realtimeDebounceRef.current) clearTimeout(realtimeDebounceRef.current);
      supabase.removeChannel(channel);
    };
  }, [branchIdsKey]);

  useEffect(() => {
    if (!chartRef.current || isLoading || activeAiTab !== 'advisor') return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }

    const ctx = chartRef.current.getContext('2d');
    const datasets = [
      {
        label: 'Periode Ini (Juta Rp)',
        data: stats.chartData,
        borderColor: isDarkMode ? '#38BDF8' : '#2563EB',
        backgroundColor: isDarkMode ? 'rgba(56, 189, 248, 0.14)' : 'rgba(37, 99, 235, 0.10)',
        borderWidth: 3,
        pointBackgroundColor: isDarkMode ? '#38BDF8' : '#2563EB',
        pointBorderColor: isDarkMode ? '#1B202C' : '#E6E9EF',
        pointBorderWidth: 2,
        pointRadius: 3.5,
        pointHoverRadius: 5.5,
        fill: true,
        tension: 0.35,
      },
    ];

    if (Array.isArray(stats.prevChartData) && stats.prevChartData.length === stats.labels.length) {
      datasets.push({
        label: 'Periode Lalu (Juta Rp)',
        data: stats.prevChartData,
        borderColor: isDarkMode ? '#94A3B8' : '#626E82',
        borderDash: [6, 5],
        borderWidth: 2,
        fill: false,
        tension: 0.35,
        pointRadius: 0,
      });
    }

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: stats.labels,
        datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 0 },
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { display: false } },
        scales: {
          x: {
            grid: { color: isDarkMode ? 'rgba(148, 163, 184, 0.10)' : 'rgba(148, 163, 184, 0.22)', drawBorder: false },
            ticks: { color: isDarkMode ? '#94A3B8' : '#626E82', font: { family: 'Plus Jakarta Sans', size: 11, weight: '700' } },
          },
          y: {
            grid: { color: isDarkMode ? 'rgba(148, 163, 184, 0.10)' : 'rgba(148, 163, 184, 0.22)', drawBorder: false },
            ticks: {
              color: isDarkMode ? '#94A3B8' : '#626E82',
              font: { family: 'Plus Jakarta Sans', size: 11, weight: '700' },
              callback: function (value) { return 'Rp ' + value + 'jt'; },
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [isDarkMode, stats.chartData, stats.prevChartData, stats.labels, isLoading, activeAiTab]);

  useEffect(() => {
    if (!donutRef.current || isLoading || activeAiTab !== 'advisor') return;

    if (donutInstance.current) {
      donutInstance.current.destroy();
      donutInstance.current = null;
    }

    const labels = Object.keys(expenseCategories);
    const data = Object.values(expenseCategories);
    if (labels.length === 0) return;

    donutInstance.current = new Chart(donutRef.current, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: labels.map((_, i) => DONUT_COLORS[i % DONUT_COLORS.length]),
          borderWidth: 0,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        animation: { duration: 0 },
        plugins: { legend: { display: false } },
      },
    });

    return () => {
      if (donutInstance.current) {
        donutInstance.current.destroy();
        donutInstance.current = null;
      }
    };
  }, [expenseCategories, isLoading, activeAiTab]);

  const handlePeriodChange = (newPeriod) => setPeriod(newPeriod);

  const handleDateChange = (e, type) => {
    const val = e.target.value;
    if (type === 'daily') setDateDaily(val);
    if (type === 'weekly') setDateWeekly(val);
    if (type === 'monthly') setDateMonthly(val);
  };

  const handleRefresh = () => {
    fetchAllData(userEmail, period, getActiveDateStr(), selectedBranchId);
    showToast('Riset AI & data transaksi berhasil diperbarui', 'success');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const handleCreateBranch = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/owner/create-branch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: linkBranchName.trim(),
          email: linkBranchEmail.trim(),
          manager_email: userEmail,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Gagal menambahkan cabang.');
        setIsSubmitting(false);
        return;
      }
      setIsModalOpen(false);
      setLinkBranchName('');
      setLinkBranchEmail('');
      showToast(data.message || 'Cabang berhasil ditambahkan', 'success');
      await fetchAllData(userEmail, period, getActiveDateStr(), selectedBranchId);
    } catch (err) {
      setErrorMsg('Terjadi kesalahan jaringan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExecuteAiAction = async (actionPlan) => {
    if (executedActionIds[actionPlan.id] || executingActionId) return;
    setExecutingActionId(actionPlan.id);
    try {
      const res = await fetch('/api/owner/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...actionPlan,
          manager_email: userEmail,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        showToast(data.error || 'Gagal mengeksekusi aksi AI', 'error');
      } else {
        setExecutedActionIds(prev => ({ ...prev, [actionPlan.id]: true }));
        showToast(data.message || 'Aksi AI berhasil diterapkan ke database!', 'success');
        await fetchAllData(userEmail, period, getActiveDateStr(), selectedBranchId);
      }
    } catch (err) {
      showToast('Terjadi kesalahan jaringan saat mengeksekusi aksi AI', 'error');
    } finally {
      setExecutingActionId(null);
    }
  };

  const handleDisablePromo = async (menuId) => {
    try {
      const res = await fetch('/api/owner/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action_type: 'disable_promo',
          menu_id: menuId,
          manager_email: userEmail,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        showToast(data.error || 'Gagal menonaktifkan promo', 'error');
      } else {
        showToast(data.message || 'Promo dinonaktifkan', 'success');
        await fetchAllData(userEmail, period, getActiveDateStr(), selectedBranchId);
      }
    } catch (err) {
      showToast('Gagal menghubungi server', 'error');
    }
  };

  const selectedBranchObj = useMemo(
    () => branches.find(b => b.id === selectedBranchId) || null,
    [branches, selectedBranchId]
  );
  const selectedBranchLabel = selectedBranchObj ? selectedBranchObj.name : `Semua Cabang (${branches.length} Outlet)`;

  const submitAiQuestion = async (questionText) => {
    const q = String(questionText || '').trim();
    if (!q || isAskingAi) return;
    setIsAskingAi(true);
    setAiSuggestedAction(null);
    try {
      const branchSummary = branches.map(b => ({
        nama: b.name,
        omzet: stats.branchStats?.[b.id]?.revenue || 0,
        transaksi: stats.branchStats?.[b.id]?.transactions || 0,
      }));

      const compactContext = {
        cabangAktif: selectedBranchLabel,
        zonaWaktu: Intl.DateTimeFormat().resolvedOptions().timeZone,
        periode: `${period} (${getActiveDateStr()})`,
        totalRevenue: stats.totalRevenue,
        unpaidRevenue: stats.unpaidRevenue,
        totalCogs: stats.totalCogs,
        grossProfit: stats.grossProfit,
        totalExpense: stats.totalExpense,
        operationalExpense: stats.operationalExpense,
        salaryExpense: stats.salaryExpense,
        netProfit: stats.netProfit,
        totalTransactions: stats.totalTransactions,
        avgBasket: aiInsights.avgBasket,
        repeatRatePct: aiInsights.repeatRate,
        avgKdsMinutes: aiInsights.avgKdsMinutes,
        kdsPeakBottleneck: aiInsights.kdsPeakBottleneck,
        ringkasanCabang: branchSummary,
        kategoriPengeluaran: expenseCategories,
        anomaliOmzet: aiInsights.revenueAnomalies || [],
        auditBiayaTinggi: aiInsights.costAudit || [],
        deadStockCount: aiInsights.deadStockMenus?.length || 0,
        deadStockSample: (aiInsights.deadStockMenus || []).slice(0, 5).map(m => ({
          id: m.id,
          name: m.name,
          branch: m.branch_name,
          stock: m.stock,
          price: m.price,
          cost_price: m.cost_price,
          suggested_discount: m.suggested_discount_price,
        })),
        topMenus: topMenus.slice(0, 5),
        lowMarginMenus: lowMarginMenus.slice(0, 5),
        lowStockSample: lowStockMenus.slice(0, 5).map(m => ({
          id: m.id,
          name: m.name,
          branch: m.branch_name,
          stock: m.stock,
        })),
        actionableCandidates: (aiInsights.actionPlans || []).map(a => ({
          action_type: a.action_type,
          menu_id: a.menu_id,
          title: a.title,
          discount_price: a.discount_price,
          new_stock: a.new_stock,
        })),
        activePromoCount: aiInsights.activePromos?.length || 0,
        fraudAlerts: (aiInsights.fraudAlerts || []).map(f => ({
          cabang: f.branch_name,
          cancelCount: f.count,
          cancelCash: f.cashCount,
          nightCancelCash: f.nightCashCancelCount,
          staleCash: f.staleCashCount,
          nilai: f.totalAmount,
        })),
      };

      const res = await fetch('/api/owner/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action_type: 'ask_ai',
          manager_email: userEmail,
          question: q,
          ai_config: aiConfig,
          context_summary: compactContext,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        showToast(data.error || 'Gagal mendapatkan jawaban AI', 'error');
      } else {
        setAiChatReply(data.answer || '');
        if (data.suggestedAction) {
          setAiSuggestedAction(data.suggestedAction);
        }
        setAiPromptInput('');
      }
    } catch (err) {
      showToast('Gagal menghubungi AI Business Advisor', 'error');
    } finally {
      setIsAskingAi(false);
    }
  };

  const handleAskAiAdvisor = async (e) => {
    e.preventDefault();
    await submitAiQuestion(aiPromptInput);
  };

  const handleExportCSV = () => {
    const activeDate = getActiveDateStr();
    const periodLabel = period === 'daily' ? 'Harian' : period === 'weekly' ? 'Mingguan' : 'Bulanan';
    const marginPct = stats.totalRevenue > 0 ? ((stats.netProfit / stats.totalRevenue) * 100).toFixed(1) : '0.0';

    const escapeCsv = (val) => {
      const str = String(val ?? '');
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const rows = [
      ['Laporan Ringkasan Laba Rugi (P&L) - NexaFlow', ''],
      ['Cabang', selectedBranchLabel],
      ['Periode', periodLabel],
      ['Tanggal / Filter Aktif', activeDate],
      ['', ''],
      ['Komponen P&L', 'Nilai (IDR)'],
      ['Omzet Lunas', stats.totalRevenue],
      ['Menunggu Bayar', stats.unpaidRevenue],
      ['Total Modal Menu (HPP)', stats.totalCogs],
      ['Laba Kotor Produk', stats.grossProfit],
      ['Total Transaksi', stats.totalTransactions],
      ['Rata-Rata Nilai Struk (Basket Size)', aiInsights.avgBasket],
      ['Pengeluaran Operasional', stats.operationalExpense],
      ['Biaya Karyawan (Gaji/Kasbon/Bonus)', stats.salaryExpense],
      ['Total Pengeluaran', stats.totalExpense],
      ['Laba Bersih (Net Profit)', stats.netProfit],
      ['Margin Laba Bersih (%)', `${marginPct}%`],
    ];

    const categoryEntries = Object.entries(expenseCategories).sort((a, b) => b[1] - a[1]);
    if (categoryEntries.length > 0) {
      rows.push(['', '']);
      rows.push(['Rincian Pengeluaran per Kategori', 'Nilai (IDR)']);
      categoryEntries.forEach(([cat, amt]) => {
        rows.push([cat, amt]);
      });
    }

    const csvContent = '\uFEFF' + rows.map(r => r.map(escapeCsv).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const slugBranch = selectedBranchLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    link.href = url;
    link.setAttribute('download', `laporan-pnl-nexaflow-${slugBranch}-${activeDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Ringkasan P&L berhasil diunduh', 'success');
  };

  const formatRp = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num || 0);
  const timeAgo = (dateStr) => {
    const diff = Math.floor((new Date() - new Date(dateStr)) / 60000);
    if (diff < 1) return 'Baru saja';
    if (diff < 60) return `${diff} menit lalu`;
    return `${Math.floor(diff / 60)} jam lalu`;
  };

  const filteredActivities = useMemo(() => {
    if (selectedBranchId === 'all') return activities;
    return activities.filter((act) => {
      if (act.tenant_id) return act.tenant_id === selectedBranchId;
      if (selectedBranchObj && act.tenants?.name) return act.tenants.name === selectedBranchObj.name;
      return true;
    });
  }, [activities, selectedBranchId, selectedBranchObj]);

  const currentMonthStr = toLocalYYYYMMDD(new Date()).slice(0, 7);
  const isEndOfMonth = new Date().getDate() >= 25;
  const unpaidEmployees = useMemo(() => {
    if (!isEndOfMonth) return [];
    return employees.filter(emp => {
      const empTrans = employeeTransactions.filter(t => t.employee_id === emp.id);
      const hasPaid = empTrans.some(t => t.type === 'Gaji' && t.transaction_date.startsWith(currentMonthStr));
      return emp.is_active && !hasPaid;
    });
  }, [employees, employeeTransactions, isEndOfMonth, currentMonthStr]);

  const totalUnpaidInvoiceAmount = useMemo(
    () => unpaidInvoices.reduce((sum, inv) => sum + Number(inv.amount || 0), 0),
    [unpaidInvoices]
  );

  return (
    <div className={`neu-owner-shell font-sans ${isDarkMode ? 'neu-dark' : ''}`}>
      <style>{`
        .neu-owner-shell {
          --bg-base: #E6E9EF;
          --surface: #E6E9EF;
          --surface-elevated: #EDF0F6;
          --shadow-light: #FFFFFF;
          --shadow-dark: #C2C8D4;
          --border-subtle: rgba(255, 255, 255, 0.65);
          --divider: rgba(148, 163, 184, 0.28);
          --text-primary: #1E2532;
          --text-secondary: #626E82;
          --sb-thumb: #C5CCD8;

          background-color: var(--bg-base);
          color: var(--text-primary);
          min-height: 100vh;
          min-height: -webkit-fill-available;
          transition: background-color 0.2s ease, color 0.18s ease;
        }
        .neu-owner-shell.neu-dark {
          --bg-base: #1B202C;
          --surface: #1B202C;
          --surface-elevated: #222838;
          --shadow-light: #252C3C;
          --shadow-dark: #11151D;
          --border-subtle: rgba(255, 255, 255, 0.06);
          --divider: rgba(148, 163, 184, 0.14);
          --text-primary: #F1F5F9;
          --text-secondary: #94A3B8;
          --sb-thumb: #2A3244;
        }

        .neu-owner-shell * {
          scrollbar-width: thin;
          scrollbar-color: var(--sb-thumb) var(--bg-base);
          -webkit-tap-highlight-color: transparent;
        }
        .neu-owner-shell ::-webkit-scrollbar { width: 8px; height: 8px; }
        .neu-owner-shell ::-webkit-scrollbar-track { background: var(--bg-base); }
        .neu-owner-shell ::-webkit-scrollbar-button { display: none; width: 0; height: 0; }
        .neu-owner-shell ::-webkit-scrollbar-thumb {
          background: var(--sb-thumb);
          border-radius: 9999px;
          border: 2px solid var(--bg-base);
        }
        .neu-owner-shell ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #2563EB, #10B981);
        }

        .neu-text { color: var(--text-primary); }
        .neu-sub { color: var(--text-secondary); }
        .neu-div { border-color: var(--divider); }
        .owner-num { font-variant-numeric: tabular-nums; letter-spacing: -0.02em; }

        .neu-card {
          background: var(--surface);
          border-radius: 26px;
          box-shadow: 9px 9px 18px var(--shadow-dark), -9px -9px 18px var(--shadow-light);
          border: 1px solid var(--border-subtle);
          transition: background-color 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, transform 0.16s ease;
        }
        .neu-card-hover:hover {
          background: var(--surface-elevated);
          border-color: rgba(37, 99, 235, 0.35);
          box-shadow: 11px 11px 22px var(--shadow-dark), -11px -11px 22px var(--shadow-light);
        }

        .neu-inset {
          background: var(--surface);
          border-radius: 16px;
          box-shadow: inset 5px 5px 10px var(--shadow-dark), inset -5px -5px 10px var(--shadow-light);
          border: 1px solid transparent;
        }
        .neu-inset:focus-within {
          border-color: rgba(37, 99, 235, 0.5);
          box-shadow: inset 5px 5px 10px var(--shadow-dark), inset -5px -5px 10px var(--shadow-light), 0 0 0 3px rgba(37, 99, 235, 0.15);
        }

        .neu-inset-pill {
          background: var(--surface);
          border-radius: 9999px;
          box-shadow: inset 4px 4px 8px var(--shadow-dark), inset -4px -4px 8px var(--shadow-light);
        }

        .neu-item {
          background: var(--surface);
          border-radius: 18px;
          box-shadow: 5px 5px 10px var(--shadow-dark), -5px -5px 10px var(--shadow-light);
          border: 1px solid var(--border-subtle);
          transition: all 0.18s ease;
        }
        .neu-item:hover {
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(16, 185, 129, 0.07)), var(--surface-elevated);
          border-color: rgba(59, 130, 246, 0.45);
          transform: translateY(-1px);
        }

        .neu-btn {
          background: var(--surface);
          border-radius: 15px;
          box-shadow: 5px 5px 10px var(--shadow-dark), -5px -5px 10px var(--shadow-light);
          border: 1px solid var(--border-subtle);
          transition: all 0.18s ease;
          cursor: pointer;
        }
        .neu-btn:hover {
          background: linear-gradient(135deg, #2563EB, #1D4ED8);
          color: #FFFFFF !important;
          border-color: #60A5FA;
          box-shadow: 6px 6px 14px var(--shadow-dark), 0 0 14px rgba(37, 99, 235, 0.35);
          transform: translateY(-1px);
        }
        .neu-btn:hover * { color: #FFFFFF !important; }
        .neu-btn:active {
          box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.4);
          transform: scale(0.97);
        }
        .neu-btn.active {
          background: linear-gradient(135deg, #2563EB, #10B981);
          color: #FFFFFF !important;
          border-color: rgba(255, 255, 255, 0.3);
          box-shadow: inset 3px 3px 7px rgba(0, 0, 0, 0.28), 0 4px 12px rgba(37, 99, 235, 0.28);
        }
        .neu-btn.active * { color: #FFFFFF !important; }

        .neu-btn-green:hover {
          background: linear-gradient(135deg, #16A34A, #15803D);
          border-color: #4ADE80;
          box-shadow: 6px 6px 14px var(--shadow-dark), 0 0 14px rgba(22, 163, 74, 0.38);
        }
        .neu-btn-amber:hover {
          background: linear-gradient(135deg, #D97706, #B45309);
          border-color: #FCD34D;
          box-shadow: 6px 6px 14px var(--shadow-dark), 0 0 14px rgba(217, 119, 6, 0.38);
        }
        .neu-btn-danger:hover {
          background: linear-gradient(135deg, #E11D48, #BE123C);
          border-color: #FDA4AF;
          box-shadow: 6px 6px 14px var(--shadow-dark), 0 0 14px rgba(225, 29, 72, 0.38);
        }

        .neu-orb {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: var(--surface);
          box-shadow: 5px 5px 10px var(--shadow-dark), -5px -5px 10px var(--shadow-light);
          border: 1px solid var(--border-subtle);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.18s ease;
          cursor: pointer;
        }
        .neu-orb:hover {
          background: linear-gradient(135deg, #2563EB, #0EA5E9);
          color: #FFFFFF !important;
          border-color: #7DD3FC;
          box-shadow: 0 0 14px rgba(14, 165, 233, 0.45);
          transform: scale(1.06);
        }
        .neu-orb:active {
          box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.4);
          transform: scale(0.94);
        }

        .neu-knob {
          background: var(--surface);
          border-radius: 50%;
          box-shadow: 6px 6px 12px var(--shadow-dark), -6px -6px 12px var(--shadow-light);
          border: 1px solid var(--border-subtle);
        }

        .neu-dropdown-menu {
          background: var(--surface-elevated);
          border-radius: 20px;
          box-shadow: 10px 12px 24px var(--shadow-dark), -6px -6px 16px var(--shadow-light);
          border: 1px solid var(--border-subtle);
        }
        .neu-dropdown-option {
          border-radius: 12px;
          color: var(--text-primary);
          transition: all 0.15s ease;
          cursor: pointer;
        }
        .neu-dropdown-option:hover {
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.14), rgba(16, 185, 129, 0.12));
          color: #3B82F6;
        }
        .neu-dropdown-option.selected {
          background: linear-gradient(135deg, #2563EB, #10B981);
          color: #FFFFFF !important;
        }
        .neu-dropdown-option.selected * { color: #FFFFFF !important; }

        .ios-blur-backdrop {
          background: rgba(15, 23, 42, 0.48);
          -webkit-backdrop-filter: blur(4px);
          backdrop-filter: blur(4px);
        }
      `}</style>

      {/* BACKDROP SIDEBAR BUKA-TUTUP */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 ios-blur-backdrop z-40"
        />
      )}

      {/* SIDEBAR BUKA-TUTUP OWNER */}
      <aside
        className={`neu-card fixed top-3.5 left-3.5 bottom-3.5 z-50 w-64 p-5 flex flex-col justify-between transition-all duration-200 ${
          isSidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-[130%] opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex items-center justify-between gap-2.5 pb-4 border-b neu-div shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="neu-knob w-10 h-10 flex items-center justify-center shrink-0 p-1.5">
                <img src="/logo-nexaflow-3d.png" alt="NexaFlow" className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black tracking-tight neu-text leading-none truncate">NEXAFLOW</p>
                <p className="text-[10px] font-extrabold text-emerald-500 tracking-wider uppercase mt-1">Owner Panel</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Tutup Sidebar"
              className="neu-orb w-9 h-9 neu-sub shrink-0"
            >
              <Icons.Close />
            </button>
          </div>

          <nav className="flex-1 mt-5 space-y-2.5 overflow-y-auto overflow-x-hidden pr-0.5">
            <Link
              href="/owner"
              onClick={() => setIsSidebarOpen(false)}
              className="neu-btn active flex items-center gap-3 px-3.5 py-3 text-xs font-extrabold whitespace-nowrap"
            >
              <Icons.Grid />
              <span>Command Center AI</span>
            </Link>
            <Link
              href="/owner/finance"
              onClick={() => setIsSidebarOpen(false)}
              className="neu-btn flex items-center gap-3 px-3.5 py-3 neu-sub text-xs font-bold whitespace-nowrap"
            >
              <Icons.Coin />
              <span>Keuangan & Stok</span>
            </Link>
            <Link
              href="/owner/reports"
              onClick={() => setIsSidebarOpen(false)}
              className="neu-btn flex items-center gap-3 px-3.5 py-3 neu-sub text-xs font-bold whitespace-nowrap"
            >
              <Icons.Chart />
              <span>Laporan Global P&L</span>
            </Link>
            <Link
              href="/owner/settings"
              onClick={() => setIsSidebarOpen(false)}
              className="neu-btn flex items-center gap-3 px-3.5 py-3 neu-sub text-xs font-bold whitespace-nowrap"
            >
              <Icons.Settings />
              <span>Pengaturan & AI Key</span>
            </Link>
          </nav>
        </div>

        <div className="pt-4 mt-4 border-t neu-div space-y-3 shrink-0">
          <div className="neu-inset p-3.5 overflow-hidden">
            <p className="text-xs font-black neu-text truncate">{userEmail || 'Owner'}</p>
            <p className="text-[11px] font-bold text-emerald-500 mt-0.5">{branches.length} Cabang Aktif</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="neu-btn neu-btn-danger w-full flex items-center justify-center gap-2 py-2.5 px-3 text-rose-500 text-xs font-black"
          >
            <Icons.Logout />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* AREA KONTEN UTAMA */}
      <div className="max-w-7xl w-full mx-auto p-3.5 sm:p-6 space-y-6 pb-20">
        {/* HEADER */}
        <header className="neu-card px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3 sticky top-3 z-30">
          <div className="flex items-center gap-3.5 min-w-0">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label="Buka atau Tutup Sidebar"
              className="neu-orb neu-text shrink-0"
            >
              <Icons.Menu />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${realtimeConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                <p className="text-[11px] font-extrabold uppercase tracking-wider neu-sub truncate">
                  {realtimeConnected ? 'Realtime Aktif' : 'Menghubungkan...'} · Periode {getActiveDateStr()}
                </p>
              </div>
              <h1 className="text-base sm:text-xl font-black neu-text tracking-tight mt-0.5 truncate">
                Command Center & AI Business Advisor
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 shrink-0">
            {/* CUSTOM DROPDOWN FILTER CABANG (TANPA SELECT BAWAAN OS) */}
            <div className="relative" ref={branchDropdownRef}>
              <button
                type="button"
                onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
                aria-label="Filter Cabang"
                className="neu-inset-pill px-3.5 py-2 flex items-center gap-2 text-xs font-extrabold neu-text max-w-[205px] cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span className="truncate">{selectedBranchLabel}</span>
                <span className={`neu-sub shrink-0 transition-transform ${isBranchDropdownOpen ? 'rotate-180' : ''}`}>
                  <Icons.ChevronDown />
                </span>
              </button>

              {isBranchDropdownOpen && (
                <div className="neu-dropdown-menu absolute right-0 mt-2 w-64 p-1.5 z-50 space-y-1 max-h-64 overflow-y-auto">
                  <button
                    type="button"
                    onClick={() => { setSelectedBranchId('all'); setIsBranchDropdownOpen(false); }}
                    className={`neu-dropdown-option w-full px-3 py-2 text-left text-xs font-extrabold flex items-center justify-between ${
                      selectedBranchId === 'all' ? 'selected' : ''
                    }`}
                  >
                    <span>Semua Cabang ({branches.length} Outlet)</span>
                    {selectedBranchId === 'all' && <Icons.Check />}
                  </button>
                  {branches.map((b, idx) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => { setSelectedBranchId(b.id); setIsBranchDropdownOpen(false); }}
                      className={`neu-dropdown-option w-full px-3 py-2 text-left text-xs font-bold flex items-center justify-between ${
                        selectedBranchId === b.id ? 'selected font-extrabold' : ''
                      }`}
                    >
                      <span className="truncate">Cabang {idx + 1} · {b.name}</span>
                      {selectedBranchId === b.id && <Icons.Check />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="neu-inset-pill px-3.5 py-2">
                {period === 'daily' && (
                  <input type="date" value={dateDaily} onChange={(e) => handleDateChange(e, 'daily')} className="bg-transparent text-xs font-extrabold neu-text outline-none" />
                )}
                {period === 'weekly' && (
                  <input type="week" value={dateWeekly} onChange={(e) => handleDateChange(e, 'weekly')} className="bg-transparent text-xs font-extrabold neu-text outline-none" />
                )}
                {period === 'monthly' && (
                  <input type="month" value={dateMonthly} onChange={(e) => handleDateChange(e, 'monthly')} className="bg-transparent text-xs font-extrabold neu-text outline-none" />
                )}
              </div>

              <div className="hidden md:flex neu-inset p-1 gap-1">
                <button type="button" onClick={() => handlePeriodChange('daily')} className={`neu-btn px-3 py-1.5 rounded-xl text-xs font-black ${period === 'daily' ? 'active' : 'neu-sub'}`}>Harian</button>
                <button type="button" onClick={() => handlePeriodChange('weekly')} className={`neu-btn px-3 py-1.5 rounded-xl text-xs font-black ${period === 'weekly' ? 'active' : 'neu-sub'}`}>Mingguan</button>
                <button type="button" onClick={() => handlePeriodChange('monthly')} className={`neu-btn px-3 py-1.5 rounded-xl text-xs font-black ${period === 'monthly' ? 'active' : 'neu-sub'}`}>Bulanan</button>
              </div>
            </div>

            <button type="button" onClick={handleRefresh} title="Refresh Riset AI" className="neu-btn inline-flex items-center gap-1.5 px-3 py-2 neu-text text-xs font-black">
              <Icons.Refresh />
              <span className="hidden xl:inline">Refresh</span>
            </button>

            <button type="button" onClick={handleExportCSV} title="Export Ringkasan P&L (CSV)" className="neu-btn inline-flex items-center gap-1.5 px-3 py-2 neu-text text-xs font-black">
              <Icons.Download />
              <span className="hidden sm:inline">CSV</span>
            </button>

            <button
              type="button"
              onClick={() => setIsDarkMode(!isDarkMode)}
              title="Ubah Tema"
              aria-label="Ubah Tema"
              className={`neu-orb shrink-0 ${isDarkMode ? 'text-sky-400' : 'text-amber-500'}`}
            >
              {isDarkMode ? <Icons.Sun /> : <Icons.Moon />}
            </button>

            <button type="button" onClick={() => setIsModalOpen(true)} className="neu-btn neu-btn-green text-blue-500 font-black px-3.5 py-2 text-xs flex items-center gap-1.5">
              <Icons.Plus />
              <span className="hidden sm:inline">Tambah Cabang</span>
            </button>
          </div>
        </header>

        {/* FILTER PERIODE MOBILE */}
        <div className="md:hidden neu-inset p-1.5 grid grid-cols-3 gap-1.5">
          <button type="button" onClick={() => handlePeriodChange('daily')} className={`neu-btn py-2 text-xs font-black ${period === 'daily' ? 'active' : 'neu-sub'}`}>Harian</button>
          <button type="button" onClick={() => handlePeriodChange('weekly')} className={`neu-btn py-2 text-xs font-black ${period === 'weekly' ? 'active' : 'neu-sub'}`}>Mingguan</button>
          <button type="button" onClick={() => handlePeriodChange('monthly')} className={`neu-btn py-2 text-xs font-black ${period === 'monthly' ? 'active' : 'neu-sub'}`}>Bulanan</button>
        </div>

        {/* SUB-NAVIGATION TABS */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setActiveAiTab('advisor')}
              className={`neu-btn flex items-center gap-2 px-4 py-2.5 text-xs font-black whitespace-nowrap ${
                activeAiTab === 'advisor' ? 'active' : 'neu-sub'
              }`}
            >
              <Icons.Bot />
              <span>AI Business Advisor</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveAiTab('audit')}
              className={`neu-btn flex items-center gap-2 px-4 py-2.5 text-xs font-black whitespace-nowrap ${
                activeAiTab === 'audit' ? 'active' : 'neu-sub'
              }`}
            >
              <Icons.Shield />
              <span>Audit Fraud & Kasir</span>
              <span className="ml-1 px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black">
                {aiInsights.fraudAlerts?.length || 0}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveAiTab('promo')}
              className={`neu-btn flex items-center gap-2 px-4 py-2.5 text-xs font-black whitespace-nowrap ${
                activeAiTab === 'promo' ? 'active' : 'neu-sub'
              }`}
            >
              <Icons.Tag />
              <span>Menu & Promo Aktif</span>
              <span className="ml-1 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black">
                {aiInsights.activePromos?.length || 0}
              </span>
            </button>
          </div>

          <Link
            href="/owner/settings"
            className="neu-inset-pill inline-flex items-center gap-2 px-4 py-2 text-xs font-extrabold neu-text"
          >
            <span className={`w-2.5 h-2.5 rounded-full ${aiConfig.apiKey ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            <span>Mesin AI: {aiConfig.provider.toUpperCase()} ({aiConfig.model})</span>
          </Link>
        </div>

        {/* ALERT BAR */}
        {(unpaidInvoices.length > 0 || unpaidEmployees.length > 0 || lowStockMenus.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unpaidInvoices.length > 0 && (
              <div className="neu-card neu-card-hover p-4 flex items-start gap-3">
                <div className="neu-knob w-9 h-9 flex items-center justify-center shrink-0 text-blue-500">
                  <Icons.File />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-blue-500">Tagihan Langganan NexaFlow</p>
                  <p className="text-xs font-bold neu-text mt-1">
                    {unpaidInvoices.length} invoice belum dibayar · <span className="owner-num font-black">{formatRp(totalUnpaidInvoiceAmount)}</span>
                  </p>
                  <p className="text-[11px] font-bold neu-sub mt-1 truncate">
                    {unpaidInvoices.slice(0, 2).map(inv => `${inv.branch_name} (${inv.period})`).join(', ')}
                  </p>
                </div>
              </div>
            )}

            {unpaidEmployees.length > 0 && (
              <div className="neu-card neu-card-hover p-4 flex items-start gap-3">
                <div className="neu-knob w-9 h-9 flex items-center justify-center shrink-0 text-rose-500">
                  <Icons.Alert />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-rose-500">Peringatan Gaji Karyawan</p>
                  <p className="text-xs font-bold neu-text mt-1">{unpaidEmployees.length} karyawan belum menerima gaji bulan ini.</p>
                  <Link href="/owner/finance" className="text-xs font-black text-rose-500 mt-1.5 inline-flex items-center gap-1 underline">
                    <span>Proses Gaji</span>
                    <Icons.ArrowRight />
                  </Link>
                </div>
              </div>
            )}

            {lowStockMenus.length > 0 && (
              <div className="neu-card neu-card-hover p-4 flex items-start gap-3">
                <div className="neu-knob w-9 h-9 flex items-center justify-center shrink-0 text-amber-500">
                  <Icons.Box />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-amber-500">Stok Menipis</p>
                  <p className="text-xs font-bold neu-text mt-1">{lowStockMenus.length} menu di bawah 10 pcs</p>
                  <Link href="/owner/finance" className="text-xs font-black text-amber-500 mt-1.5 inline-flex items-center gap-1 underline">
                    <span>Kelola Stok</span>
                    <Icons.ArrowRight />
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4 KPI UTAMA TEGAS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="neu-card neu-card-hover p-5">
            <p className="text-[11px] font-black neu-sub uppercase tracking-wider">Omzet Lunas</p>
            <h3 className="text-xl sm:text-2xl font-black neu-text owner-num mt-1.5">
              {isLoading ? '...' : formatRp(stats.totalRevenue)}
            </h3>
            <p className="mt-2 text-xs font-extrabold text-blue-500">
              {stats.totalTransactions} transaksi · Belum bayar: {formatRp(stats.unpaidRevenue)}
            </p>
          </div>

          <div className="neu-card neu-card-hover p-5">
            <p className="text-[11px] font-black neu-sub uppercase tracking-wider">Laba Kotor (Setelah HPP)</p>
            <h3 className="text-xl sm:text-2xl font-black neu-text owner-num mt-1.5">
              {isLoading ? '...' : formatRp(stats.grossProfit)}
            </h3>
            <p className="mt-2 text-xs font-extrabold text-amber-500">
              Modal Menu (HPP): {formatRp(stats.totalCogs)}
            </p>
          </div>

          <div className="neu-card neu-card-hover p-5">
            <p className="text-[11px] font-black neu-sub uppercase tracking-wider">Laba Bersih (P&L)</p>
            <h3 className={`text-xl sm:text-2xl font-black owner-num mt-1.5 ${stats.netProfit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {isLoading ? '...' : formatRp(stats.netProfit)}
            </h3>
            <p className="mt-2 text-xs font-extrabold text-rose-500">
              Operasional & Gaji: {formatRp(stats.totalExpense)}
            </p>
          </div>

          <div className="neu-card neu-card-hover p-5">
            <p className="text-[11px] font-black neu-sub uppercase tracking-wider">Struk & Kecepatan Dapur</p>
            <h3 className="text-xl sm:text-2xl font-black neu-text owner-num mt-1.5">
              {isLoading ? '...' : formatRp(aiInsights.avgBasket)}
            </h3>
            <p className="mt-2 text-xs font-extrabold text-emerald-500">
              KDS {aiInsights.avgKdsMinutes} mnt · Repeat {aiInsights.repeatRate}%
            </p>
          </div>
        </div>

        {/* TAB 1: AI BUSINESS ADVISOR */}
        {activeAiTab === 'advisor' && (
          <>
            {((aiInsights.revenueAnomalies || []).length > 0 || (aiInsights.costAudit || []).length > 0) && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {(aiInsights.revenueAnomalies || []).map((anom) => (
                  <div
                    key={`anom-${anom.tenant_id}`}
                    className="neu-card neu-card-hover p-4 flex items-start gap-3"
                  >
                    <div className={`neu-knob w-9 h-9 flex items-center justify-center shrink-0 ${
                      anom.status === 'drop' ? 'text-rose-500' : 'text-emerald-500'
                    }`}>
                      {anom.status === 'drop' ? <Icons.Alert /> : <Icons.Activity />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-xs font-black ${anom.status === 'drop' ? 'text-rose-500' : 'text-emerald-500'}`}>
                          {anom.status === 'drop' ? 'Peringatan Anomali Omzet Turun' : 'Lonjakan Omzet Terdeteksi'}: {anom.branch_name}
                        </p>
                        <span className={`neu-inset-pill px-2.5 py-0.5 text-xs font-black owner-num ${
                          anom.status === 'drop' ? 'text-rose-500' : 'text-emerald-500'
                        }`}>
                          {anom.diffPct > 0 ? `+${anom.diffPct}%` : `${anom.diffPct}%`}
                        </span>
                      </div>
                      <p className="text-xs font-bold neu-text mt-1">
                        Aktual <span className="owner-num font-black">{formatRp(anom.currentRev)}</span> vs rata-rata historis <span className="owner-num font-black">{formatRp(anom.expectedRev)}</span>.
                      </p>
                    </div>
                  </div>
                ))}

                {(aiInsights.costAudit || []).map((audit) => (
                  <div
                    key={`cost-${audit.tenant_id}`}
                    className="neu-card neu-card-hover p-4 flex items-start gap-3"
                  >
                    <div className="neu-knob w-9 h-9 text-amber-500 flex items-center justify-center shrink-0">
                      <Icons.Coin />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-black text-amber-500">
                          Audit Rasio Biaya Tinggi: {audit.branch_name}
                        </p>
                        <span className="neu-inset-pill px-2.5 py-0.5 text-amber-500 text-xs font-black owner-num">
                          {audit.costRatioPct}% Omzet
                        </span>
                      </div>
                      <p className="text-xs font-bold neu-text mt-1">
                        Total biaya <span className="owner-num font-black">{formatRp(audit.totalExpense)}</span> (terbesar: <strong>{audit.topCategory}</strong> senilai <span className="owner-num font-black">{formatRp(audit.topCategoryAmount)}</span>).
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="grid lg:grid-cols-12 gap-6 items-start">
              {/* KIRI 7 KOLOM */}
              <div className="lg:col-span-7 space-y-6">
                <div className="neu-card neu-card-hover p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
                    <div>
                      <h2 className="text-base sm:text-lg font-black neu-text">
                        Perbandingan Omzet: Periode Ini vs Periode Lalu
                      </h2>
                      <p className="text-xs font-bold neu-sub mt-0.5">
                        Pendapatan dalam Juta Rupiah · {selectedBranchLabel}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-extrabold">
                      <span className="inline-flex items-center gap-1.5 text-blue-500">
                        <span className="w-3 h-3 rounded-full bg-blue-500"></span>Periode Ini
                      </span>
                      <span className="inline-flex items-center gap-1.5 neu-sub">
                        <span className="w-3 h-3 rounded-full bg-slate-400"></span>Periode Lalu
                      </span>
                    </div>
                  </div>
                  <div className="neu-inset p-3.5 relative h-64 sm:h-72">
                    <canvas ref={chartRef}></canvas>
                  </div>
                </div>

                {/* HASIL RISET MENDALAM AI */}
                <div className="neu-card neu-card-hover p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="neu-knob w-9 h-9 flex items-center justify-center text-blue-500 shrink-0">
                        <Icons.Search />
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-black neu-text">
                          Hasil Riset Mendalam AI (Diagnostik Operasional & Margin)
                        </h3>
                        <p className="text-xs font-bold neu-sub">
                          Dihitung otomatis dari transaksi, HPP modal menu, stok, dan pengeluaran
                        </p>
                      </div>
                    </div>
                    <span className="neu-inset-pill px-3 py-1 text-emerald-500 text-xs font-black shrink-0">
                      Terverifikasi
                    </span>
                  </div>

                  <div className="space-y-3">
                    {(aiInsights.diagnostics || []).map((diag) => {
                      const badgeCls =
                        diag.badgeColor === 'rose'
                          ? 'bg-rose-600 text-white'
                          : diag.badgeColor === 'amber'
                          ? 'bg-amber-600 text-white'
                          : 'bg-blue-600 text-white';
                      return (
                        <div
                          key={diag.code}
                          className="neu-item p-4 flex items-start gap-3"
                        >
                          <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black font-mono shrink-0 mt-0.5 ${badgeCls}`}>
                            {diag.code}
                          </span>
                          <div>
                            <p className="text-sm font-black neu-text">{diag.title}</p>
                            <p className="text-xs font-semibold neu-sub mt-1 leading-relaxed">
                              {diag.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* DETEKTOR MENU MATI (DEAD STOCK 30 HARI) */}
                {(aiInsights.deadStockMenus || []).length > 0 && (
                  <div className="neu-card neu-card-hover p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div>
                        <h3 className="text-sm sm:text-base font-black neu-text">
                          Detektor Menu Mati (0 Penjualan 30 Hari Terakhir)
                        </h3>
                        <p className="text-xs font-bold neu-sub mt-0.5">
                          Diskon cuci gudang 3 jam otomatis dijaga agar tetap di atas modal (HPP)
                        </p>
                      </div>
                      <span className="neu-inset-pill px-3 py-1 text-amber-500 text-xs font-black shrink-0">
                        {aiInsights.deadStockMenus.length} Menu
                      </span>
                    </div>
                    <div className="space-y-3">
                      {aiInsights.deadStockMenus.slice(0, 5).map((dm) => {
                        const actionId = `deadstock_${dm.id}`;
                        const isDone = Boolean(executedActionIds[actionId]);
                        const isBusy = executingActionId === actionId;
                        return (
                          <div
                            key={dm.id}
                            className="neu-item p-3.5 flex flex-wrap items-center justify-between gap-3"
                          >
                            <div className="min-w-0">
                              <p className="text-xs font-black neu-text truncate">{dm.name}</p>
                              <p className="text-xs font-bold neu-sub">
                                {dm.branch_name} · Stok: {dm.stock} pcs · <span className="owner-num">{formatRp(dm.price)}</span>
                                {dm.cost_price > 0 ? ` (Modal: ${formatRp(dm.cost_price)})` : ''}
                              </p>
                            </div>
                            <button
                              type="button"
                              disabled={isDone || isBusy}
                              onClick={() =>
                                handleExecuteAiAction({
                                  id: actionId,
                                  action_type: 'promo_discount',
                                  menu_id: dm.id,
                                  discount_price: dm.suggested_discount_price,
                                  duration_hours: 3,
                                })
                              }
                              className={`neu-btn px-3.5 py-2 text-xs font-black flex items-center gap-1.5 ${
                                isDone
                                  ? 'active cursor-default'
                                  : 'neu-btn-amber text-amber-500'
                              }`}
                            >
                              {isDone ? (
                                <>
                                  <Icons.Check />
                                  <span>Promo 3 Jam Aktif</span>
                                </>
                              ) : (
                                <>
                                  <Icons.Bolt />
                                  <span>{isBusy ? 'Memproses...' : `Promo 3 Jam (${formatRp(dm.suggested_discount_price)})`}</span>
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* KANAN 5 KOLOM: RENCANA AKSI 1-KLIK + TANYA AI ADVISOR */}
              <div className="lg:col-span-5 space-y-6">
                <div className="neu-card neu-card-hover p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-2 pb-4 border-b neu-div">
                    <div className="flex items-center gap-3">
                      <div className="neu-knob w-10 h-10 flex items-center justify-center text-blue-500 shrink-0">
                        <Icons.Bot />
                      </div>
                      <div>
                        <h2 className="text-sm sm:text-base font-black neu-text">
                          Rencana Aksi AI (1-Klik)
                        </h2>
                        <p className="text-xs font-bold text-blue-500">
                          Eksekusi langsung ke database & QR pelanggan
                        </p>
                      </div>
                    </div>
                    <span className="neu-inset-pill px-3 py-1 neu-text text-xs font-black">
                      {(aiInsights.actionPlans || []).length} Aksi
                    </span>
                  </div>

                  <div className="mt-4 space-y-3.5">
                    {(aiInsights.actionPlans || []).map((act, idx) => {
                      const isDone = Boolean(executedActionIds[act.id]);
                      const isBusy = executingActionId === act.id;
                      const badgeThemeCls =
                        act.badgeTheme === 'amber'
                          ? 'text-amber-500'
                          : act.badgeTheme === 'sky'
                          ? 'text-sky-500'
                          : 'text-emerald-500';

                      return (
                        <div
                          key={act.id}
                          className="neu-item p-4 space-y-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className={`neu-inset-pill inline-block px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide mb-1.5 ${badgeThemeCls}`}>
                                {act.badge}
                              </span>
                              <h4 className="text-sm font-black neu-text">
                                {act.title}
                              </h4>
                            </div>
                            <span className="text-right shrink-0">
                              {act.action_type === 'promo_discount' && (
                                <>
                                  <span className="block text-xs neu-sub line-through font-bold owner-num">
                                    {formatRp(act.original_price)}
                                  </span>
                                  <span className="text-sm font-black text-emerald-500 owner-num">
                                    {formatRp(act.discount_price)}
                                  </span>
                                </>
                              )}
                              {act.action_type === 'restock_menu' && (
                                <span className="inline-flex items-center gap-1 text-xs font-black text-blue-500 owner-num">
                                  <span>{act.current_stock}</span>
                                  <Icons.ArrowRight />
                                  <span>{act.new_stock} Porsi</span>
                                </span>
                              )}
                              {act.action_type === 'create_bundle' && (
                                <span className="text-sm font-black text-emerald-500 owner-num">
                                  {formatRp(act.bundle_price)}
                                </span>
                              )}
                            </span>
                          </div>

                          <p className="text-xs font-semibold neu-sub leading-relaxed">
                            {act.description}
                          </p>

                          <button
                            type="button"
                            disabled={isDone || isBusy}
                            onClick={() => handleExecuteAiAction(act)}
                            className={`neu-btn w-full py-3 text-xs font-black flex items-center justify-center gap-2 ${
                              isDone
                                ? 'active cursor-default'
                                : idx === 0
                                ? 'neu-btn-green text-emerald-500'
                                : 'text-blue-500'
                            }`}
                          >
                            {isDone ? (
                              <>
                                <Icons.Check />
                                <span>Berhasil Diterapkan ke QR Menu!</span>
                              </>
                            ) : (
                              <>
                                <Icons.Bolt />
                                <span>{isBusy ? 'Menerapkan ke Database...' : act.buttonLabel}</span>
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* KOTAK TANYA AI ADVISOR + QUICK PROMPTS + KARTU AKSI DARI CHAT */}
                  <div className="mt-5 pt-4 border-t neu-div">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-black neu-text">
                        Tanya AI Advisor:
                      </p>
                      <Link href="/owner/settings" className="text-xs font-black text-blue-500 inline-flex items-center gap-1 underline">
                        <span>Atur API Key</span>
                        <Icons.ArrowRight />
                      </Link>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {QUICK_AI_PROMPTS.map((qp) => (
                        <button
                          key={qp}
                          type="button"
                          disabled={isAskingAi}
                          onClick={() => submitAiQuestion(qp)}
                          className="neu-btn px-2.5 py-1.5 text-[11px] font-bold neu-text disabled:opacity-50"
                        >
                          {qp}
                        </button>
                      ))}
                    </div>

                    {aiChatReply && (
                      <div className="neu-inset mb-3 p-3.5 text-xs font-semibold neu-text leading-relaxed whitespace-pre-line space-y-3">
                        <div>
                          <strong className="text-blue-500 block mb-1">
                            AI Advisor ({aiConfig.model}):
                          </strong>
                          {aiChatReply}
                        </div>

                        {aiSuggestedAction && (
                          <div className="pt-2.5 border-t neu-div">
                            <button
                              type="button"
                              disabled={
                                Boolean(executedActionIds[aiSuggestedAction.id]) ||
                                executingActionId === aiSuggestedAction.id
                              }
                              onClick={() => handleExecuteAiAction(aiSuggestedAction)}
                              className={`neu-btn w-full py-2.5 px-3 text-xs font-black flex items-center justify-center gap-2 ${
                                executedActionIds[aiSuggestedAction.id]
                                  ? 'active'
                                  : 'neu-btn-green text-emerald-500'
                              }`}
                            >
                              {executedActionIds[aiSuggestedAction.id] ? (
                                <>
                                  <Icons.Check />
                                  <span>Aksi Berhasil Diterapkan!</span>
                                </>
                              ) : (
                                <>
                                  <Icons.Bolt />
                                  <span>
                                    {executingActionId === aiSuggestedAction.id
                                      ? 'Menerapkan...'
                                      : aiSuggestedAction.buttonLabel || aiSuggestedAction.title || 'Terapkan Saran AI'}
                                  </span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    <form onSubmit={handleAskAiAdvisor} className="flex gap-2">
                      <div className="neu-inset flex-1 px-3.5 py-2.5">
                        <input
                          type="text"
                          value={aiPromptInput}
                          onChange={(e) => setAiPromptInput(e.target.value)}
                          placeholder="Tanya margin menu, promo, atau biaya..."
                          className="bg-transparent w-full text-xs font-bold neu-text outline-none"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isAskingAi}
                        className="neu-btn px-4 py-2.5 text-blue-500 text-xs font-black shrink-0 disabled:opacity-50"
                      >
                        {isAskingAi ? '...' : 'Tanya'}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION BAWAH */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="neu-card neu-card-hover p-6 flex flex-col">
                <h2 className="text-lg font-black neu-text mb-1">Pengeluaran</h2>
                <p className="text-xs font-bold neu-sub mb-4">Per kategori periode aktif</p>
                {Object.keys(expenseCategories).length === 0 ? (
                  <div className="flex-1 flex items-center justify-center py-8">
                    <p className="text-xs font-bold neu-sub text-center">Belum ada pengeluaran tercatat.</p>
                  </div>
                ) : (
                  <>
                    <div className="relative w-full h-[140px] mb-3">
                      <canvas ref={donutRef}></canvas>
                    </div>
                    <div className="space-y-2 mt-1 overflow-y-auto max-h-[140px] pr-1">
                      {Object.entries(expenseCategories).sort((a, b) => b[1] - a[1]).map(([cat, amt], i) => (
                        <div key={cat} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-3 h-3 rounded-sm shrink-0" style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }}></span>
                            <span className="font-extrabold neu-text truncate">{cat}</span>
                          </div>
                          <span className="font-black neu-text owner-num shrink-0 ml-2">{formatRp(amt)}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="neu-card neu-card-hover p-6 flex flex-col">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-lg font-black neu-text">Biaya Karyawan</h2>
                  <Link href="/owner/finance" className="text-xs font-black text-blue-500 inline-flex items-center gap-1 underline">
                    <span>Kelola</span>
                    <Icons.ArrowRight />
                  </Link>
                </div>
                <p className="text-xs font-bold neu-sub mb-5">{selectedBranchLabel}</p>

                <div className="space-y-3">
                  <div className="neu-inset p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-500"><Icons.Coin /></span>
                      <span className="text-xs font-black neu-text">Gaji</span>
                    </div>
                    <span className="text-xs font-black neu-text owner-num">{formatRp(employeeTransactions.filter(t => t.type === 'Gaji').reduce((s, t) => s + Number(t.amount), 0))}</span>
                  </div>
                  <div className="neu-inset p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-amber-500"><Icons.Clock /></span>
                      <span className="text-xs font-black neu-text">Kasbon</span>
                    </div>
                    <span className="text-xs font-black neu-text owner-num">{formatRp(employeeTransactions.filter(t => t.type === 'Kasbon').reduce((s, t) => s + Number(t.amount), 0))}</span>
                  </div>
                  <div className="neu-inset p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-500"><Icons.Check /></span>
                      <span className="text-xs font-black neu-text">Bonus</span>
                    </div>
                    <span className="text-xs font-black neu-text owner-num">{formatRp(employeeTransactions.filter(t => t.type === 'Bonus').reduce((s, t) => s + Number(t.amount), 0))}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t neu-div flex items-center justify-between">
                  <span className="text-xs font-black neu-sub uppercase">Total</span>
                  <span className="text-sm font-black text-rose-500 owner-num">{formatRp(employeeTransactions.reduce((s, t) => s + Number(t.amount), 0))}</span>
                </div>
              </div>

              <div className="neu-card neu-card-hover p-6">
                <h2 className="text-lg font-black neu-text mb-4">Aktivitas Terbaru</h2>
                <div className="max-h-[250px] overflow-y-auto pr-2 space-y-3.5">
                  {filteredActivities.length === 0 ? (
                    <p className="text-xs font-bold neu-sub text-center mt-10">Belum ada aktivitas.</p>
                  ) : filteredActivities.map((act, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div className="neu-knob w-8 h-8 flex items-center justify-center text-emerald-500 shrink-0">
                        <Icons.Activity />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-black neu-text truncate">Pesanan Masuk</p>
                          <p className="text-[11px] font-bold neu-sub shrink-0">{timeAgo(act.created_at)}</p>
                        </div>
                        <p className="text-xs font-bold neu-sub mt-0.5 truncate">
                          {act.tenants?.name || 'Cabang'} · <span className="owner-num neu-text">{formatRp(act.total_price)}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* TOP MENU + STOK MENIPIS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="neu-card neu-card-hover p-6">
                <div className="mb-5">
                  <h2 className="text-lg font-black neu-text">Menu Terlaris & Laba Kotor</h2>
                  <p className="text-xs font-bold neu-sub mt-1">Top 5 periode aktif (berdasarkan HPP per menu)</p>
                </div>
                {topMenus.length === 0 ? (
                  <p className="text-xs font-bold neu-sub text-center py-8">Belum ada data penjualan.</p>
                ) : (
                  <div className="space-y-4">
                    {topMenus.map((m, i) => {
                      const maxQty = topMenus[0]?.qty || 1;
                      const pct = (m.qty / maxQty) * 100;
                      return (
                        <div key={m.name + i}>
                          <div className="flex items-center justify-between mb-1.5 gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-xs font-black text-blue-500 w-5 shrink-0">#{i + 1}</span>
                              <span className="text-xs font-black neu-text truncate">{m.name}</span>
                            </div>
                            <span className="text-xs font-extrabold neu-sub shrink-0 owner-num">
                              {m.qty} pcs · {formatRp(m.revenue)}
                              {m.cogs > 0 ? ` (Laba ${formatRp(m.grossProfit)})` : ''}
                            </span>
                          </div>
                          <div className="neu-inset h-3 rounded-full overflow-hidden p-0.5">
                            <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500" style={{ width: `${pct}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="neu-card neu-card-hover p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-lg font-black neu-text">Stok Menipis</h2>
                    <p className="text-xs font-bold neu-sub mt-1">Menu dengan stok kurang dari atau sama dengan 10 pcs</p>
                  </div>
                  <Link href="/owner/finance" className="text-xs font-black text-blue-500 inline-flex items-center gap-1 underline">
                    <span>Kelola</span>
                    <Icons.ArrowRight />
                  </Link>
                </div>
                {lowStockMenus.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="neu-knob w-10 h-10 flex items-center justify-center text-emerald-500 mb-2">
                      <Icons.Check />
                    </div>
                    <p className="text-xs font-black neu-sub">Semua stok aman</p>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                    {lowStockMenus.slice(0, 8).map((m) => (
                      <div key={m.id} className="neu-item px-3.5 py-2.5 flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-black neu-text truncate">{m.name}</p>
                          <p className="text-[11px] font-bold neu-sub">{m.branch_name || m.tenant_id}</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-black shrink-0 ${Number(m.stock) <= 3 ? 'bg-rose-600 text-white' : 'bg-amber-500 text-slate-900'}`}>
                          {m.stock} pcs
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* DAFTAR CABANG */}
            <div id="daftar-cabang" className="neu-card overflow-hidden">
              <div className="p-6 border-b neu-div flex justify-between items-center">
                <h3 className="text-lg font-black neu-text">Daftar Cabang Anda</h3>
                <span className="neu-inset-pill px-3 py-1 text-xs font-black neu-sub">{branches.length} cabang</span>
              </div>
              <div className="overflow-x-auto p-3 sm:p-4">
                <table className="w-full text-left border-separate border-spacing-y-2">
                  <thead>
                    <tr className="text-xs uppercase tracking-wider neu-sub">
                      <th className="p-3 pl-4 font-black">Nama Cabang</th>
                      <th className="p-3 font-black">Status</th>
                      <th className="p-3 font-black">Pendapatan</th>
                      <th className="p-3 font-black">Transaksi</th>
                      <th className="p-3 font-black text-center">Karyawan</th>
                      <th className="p-3 font-black text-right pr-4">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr><td colSpan="6" className="p-6 text-center neu-sub font-black">Memuat data...</td></tr>
                    ) : branches.length === 0 ? (
                      <tr><td colSpan="6" className="p-6 text-center neu-sub font-black">Belum ada cabang. Silakan tambahkan cabang baru.</td></tr>
                    ) : branches.map((branch) => {
                      const bStat = stats.branchStats[branch.id] || { revenue: 0, transactions: 0, employeeCount: 0 };
                      const isSelected = selectedBranchId === branch.id;
                      return (
                        <tr key={branch.id} className={`neu-item ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
                          <td className="p-3.5 pl-4 rounded-l-2xl">
                            <div className="flex items-center gap-3">
                              <div className="neu-knob w-9 h-9 flex items-center justify-center text-blue-500 font-black text-sm shrink-0">
                                {branch.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="font-black text-sm neu-text truncate">{branch.name}</p>
                                <p className="text-[11px] font-bold neu-sub">ID: {branch.id.split('-')[0]}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3.5">
                            <span className={`neu-inset-pill inline-flex items-center gap-1.5 px-3 py-1 text-xs font-black ${branch.is_active ? 'text-emerald-500' : 'text-rose-500'}`}>
                              <span className={`w-2 h-2 rounded-full ${branch.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                              {branch.is_active ? 'Aktif' : 'Suspend'}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <p className="font-black text-sm neu-text owner-num">{formatRp(bStat.revenue)}</p>
                          </td>
                          <td className="p-3.5">
                            <p className="font-extrabold text-sm neu-text owner-num">{bStat.transactions}</p>
                          </td>
                          <td className="p-3.5 text-center">
                            <span className="neu-inset-pill inline-flex items-center justify-center px-3 py-1 neu-text text-xs font-black">
                              {bStat.employeeCount} Orang
                            </span>
                          </td>
                          <td className="p-3.5 pr-4 text-right rounded-r-2xl">
                            <button
                              type="button"
                              onClick={() => { window.location.href = `/dashboard?tenant_id=${branch.id}`; }}
                              className="neu-btn text-blue-500 px-3.5 py-2 text-xs font-black"
                            >
                              Buka Kasir
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* TAB 2: AUDIT FRAUD & KASIR + KECEPATAN DAPUR (KDS) */}
        {activeAiTab === 'audit' && (
          <div className="space-y-6">
            <div className="neu-card p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div>
                  <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-black uppercase tracking-wider">
                    AI Fraud & Void Watchdog
                  </span>
                  <h2 className="text-xl font-black neu-text mt-2">
                    Deteksi Anomali Pembatalan Kasir & Kecepatan Dapur
                  </h2>
                </div>
                <span className="text-xs font-extrabold neu-sub">
                  Dipantau otomatis 30 hari terakhir (Jam Lokal Cabang)
                </span>
              </div>

              {(aiInsights.fraudAlerts || []).length === 0 ? (
                <div className="neu-inset p-5 flex items-center gap-3">
                  <div className="neu-knob w-9 h-9 text-emerald-500 flex items-center justify-center shrink-0">
                    <Icons.Check />
                  </div>
                  <div>
                    <p className="text-sm font-black text-emerald-500">Tidak Ditemukan Anomali Kasir</p>
                    <p className="text-xs font-bold neu-sub mt-0.5">
                      Tidak ada transaksi dibatalkan atau order tunai menggantung mencurigakan dalam 30 hari terakhir.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {aiInsights.fraudAlerts.map((alert) => {
                    const minHour = alert.hours?.[alert.hours.length - 1] || '-';
                    const maxHour = alert.hours?.[0] || '-';
                    return (
                      <div
                        key={alert.tenant_id}
                        className="neu-item p-4 space-y-2.5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm font-black text-rose-500">
                            Peringatan Audit: {alert.branch_name}
                          </p>
                          <span className="text-xs font-mono font-bold text-rose-500">
                            Rentang Jam: {minHour} - {maxHour}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {alert.nightCashCancelCount > 0 && (
                            <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-xs font-black">
                              {alert.nightCashCancelCount}x Cancel Tunai Jam Malam (mulai 20.00)
                            </span>
                          )}
                          {alert.staleCashCount > 0 && (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-900 text-xs font-black">
                              {alert.staleCashCount} Order Tunai Menggantung lebih dari 2 Jam ({formatRp(alert.staleCashAmount)})
                            </span>
                          )}
                        </div>

                        <p className="text-xs font-semibold neu-text leading-relaxed">
                          Ditemukan <strong>{alert.count} pesanan dibatalkan ({alert.cashCount} di antaranya metode Tunai/Cash)</strong> dengan total nilai{' '}
                          <strong className="text-rose-500 owner-num">{formatRp(alert.totalAmount)}</strong>. Disarankan meninjau aktivitas kasir pada jam tersebut.
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* KDS SPEED MONITOR + PEAK HOUR BOTTLENECK */}
              <div className="mt-6 pt-5 border-t neu-div grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="neu-inset p-4">
                  <p className="text-xs font-black text-blue-500 uppercase">
                    Rata-Rata Kecepatan Dapur
                  </p>
                  <p className="text-2xl font-black neu-text mt-1 owner-num">
                    {aiInsights.avgKdsMinutes} Menit / Pesanan
                  </p>
                  <p className="text-xs font-bold neu-sub mt-1">
                    Selisih waktu pesanan masuk hingga selesai di layar KDS.
                  </p>
                </div>
                <div className="neu-inset p-4">
                  <p className="text-xs font-black text-amber-500 uppercase">
                    Antrean Terlama Tercatat
                  </p>
                  <p className="text-2xl font-black neu-text mt-1 owner-num">
                    {aiInsights.maxKdsMin > 0 ? `${aiInsights.maxKdsMin} Menit (Meja ${aiInsights.slowestTable})` : 'Normal (di bawah 15 Menit)'}
                  </p>
                  <p className="text-xs font-bold neu-sub mt-1">
                    Cabang: {aiInsights.slowestBranch || selectedBranchLabel}
                  </p>
                </div>
                <div className="neu-inset p-4">
                  <p className="text-xs font-black text-rose-500 uppercase">
                    Jam Sibuk Dapur (Bottleneck)
                  </p>
                  <p className="text-lg font-black neu-text mt-1 owner-num">
                    {aiInsights.kdsPeakBottleneck
                      ? `${aiInsights.kdsPeakBottleneck.peakHourLabel} (${aiInsights.kdsPeakBottleneck.avgMinutes} mnt)`
                      : 'Belum Ada Bottleneck'}
                  </p>
                  <p className="text-xs font-bold neu-sub mt-1">
                    {aiInsights.kdsPeakBottleneck
                      ? `Cabang padat: ${aiInsights.kdsPeakBottleneck.branchName} (${aiInsights.kdsPeakBottleneck.orderCount} pesanan)`
                      : 'Kecepatan penyajian merata di semua jam.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MENU & PROMO AKTIF */}
        {activeAiTab === 'promo' && (
          <div className="neu-card p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
              <div>
                <h2 className="text-xl font-black neu-text">
                  Daftar Menu Unggulan, Harga Coret & Paket Bundling Aktif
                </h2>
                <p className="text-xs font-bold neu-sub mt-0.5">
                  Seluruh menu di bawah ini sedang tampil menonjol di layar QR pelanggan.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveAiTab('advisor')}
                className="neu-btn text-blue-500 px-4 py-2 text-xs font-black self-start"
              >
                + Tambah Promo dari AI Advisor
              </button>
            </div>

            {(aiInsights.activePromos || []).length === 0 ? (
              <p className="text-xs font-bold neu-sub py-8 text-center">
                Belum ada menu promo atau paket bundling yang aktif. Silakan kembali ke tab <strong>AI Business Advisor</strong> dan klik tombol eksekusi 1-klik.
              </p>
            ) : (
              <div className="space-y-3">
                {aiInsights.activePromos.map((m, idx) => (
                  <div
                    key={m.id}
                    className="neu-item p-4 flex flex-wrap items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-mono text-xs font-black">
                        #{idx + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-black neu-text truncate">{m.name}</p>
                          {m.promo_expires_at && (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-900 text-xs font-black">
                              Berakhir:{' '}
                              {new Date(m.promo_expires_at).toLocaleString('id-ID', {
                                day: '2-digit',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-bold neu-sub mt-0.5">
                          {m.branch_name} · Kategori: {m.category} · Stok: {m.stock} pcs
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        {m.discount_price ? (
                          <>
                            <span className="block text-xs neu-sub line-through font-bold owner-num">
                              {formatRp(m.price)}
                            </span>
                            <span className="text-sm font-black text-emerald-500 owner-num">
                              {formatRp(m.discount_price)}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm font-black neu-text owner-num">
                            {formatRp(m.price)}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDisablePromo(m.id)}
                        className="neu-btn neu-btn-danger text-rose-500 px-3.5 py-2 text-xs font-black"
                      >
                        Matikan Promo
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL TAMBAH CABANG */}
      {isModalOpen && (
        <div className="fixed inset-0 ios-blur-backdrop z-[100] flex items-center justify-center p-4">
          <div className="neu-card w-full max-w-md p-6 sm:p-8">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-xl font-black neu-text">Tambah Cabang Baru</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="neu-orb w-9 h-9 neu-sub" title="Tutup">
                <Icons.Close />
              </button>
            </div>
            <p className="text-xs font-bold neu-sub mb-6">Sistem akan membuat akun kasir baru dan menghubungkannya ke dashboard Anda.</p>

            {errorMsg && (
              <div className="neu-inset mb-4 p-3 text-rose-500 text-xs font-black">{errorMsg}</div>
            )}

            <form onSubmit={handleCreateBranch} className="space-y-4">
              <div>
                <label className="block text-xs font-black neu-sub mb-1.5 uppercase">Nama Kafe / Resto</label>
                <div className="neu-inset px-4 py-3">
                  <input type="text" value={linkBranchName} onChange={(e) => setLinkBranchName(e.target.value)} required placeholder="Contoh: Kopi Senja Bandung" className="bg-transparent w-full text-sm font-bold neu-text outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black neu-sub mb-1.5 uppercase">Email Login Kasir Baru</label>
                <div className="neu-inset px-4 py-3">
                  <input type="email" value={linkBranchEmail} onChange={(e) => setLinkBranchEmail(e.target.value)} required placeholder="kasir.bandung@gmail.com" className="bg-transparent w-full text-sm font-bold neu-text outline-none" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="neu-btn flex-1 neu-sub font-black py-3 text-xs">Batal</button>
                <button type="submit" disabled={isSubmitting} className="neu-btn neu-btn-green flex-1 text-emerald-500 font-black py-3 text-xs disabled:opacity-60">{isSubmitting ? 'Memproses...' : 'Buat Cabang'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-[200]">
          <div className="neu-card flex items-center gap-3 px-5 py-3.5 rounded-2xl">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'}`}>
              {toast.type === 'success' ? <Icons.Check /> : <Icons.Close />}
            </div>
            <p className="text-xs font-black neu-text pr-2">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}