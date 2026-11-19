'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import Chart from 'chart.js/auto';
import { supabase } from '@/lib/supabase';

const Icons = {
  Sun: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  Moon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  Activity: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  Plus: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Logout: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Refresh: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
  Download: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Search: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Alert: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Box: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  File: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  Coin: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><circle cx="12" cy="12" r="10"/><line x1="12" y1="6" x2="12" y2="18"/><path d="M15 9h-4a2 2 0 0 0 0 4h2a2 2 0 0 1 0 4H9"/></svg>,
  Settings: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Close: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Bot: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M12 2a4 4 0 0 1 4 4v2h2a2 2 0 0 1 2 2v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-8a2 2 0 0 1 2-2h2V6a4 4 0 0 1 4-4z"/><circle cx="9" cy="13" r="1"/><circle cx="15" cy="13" r="1"/></svg>,
  Shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  Tag: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  Bolt: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5"><polyline points="20 6 9 17 4 12"/></svg>,
  Clock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
};

const DONUT_COLORS = ['#2563EB', '#10B981', '#D97706', '#E11D48', '#7C3AED', '#DB2777', '#0D9488', '#475569'];

export default function OwnerDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const donutRef = useRef(null);
  const donutInstance = useRef(null);
  const realtimeDebounceRef = useRef(null);
  const latestParamsRef = useRef({ email: '', period: 'monthly', dateStr: '', branchId: 'all' });

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [realtimeConnected, setRealtimeConnected] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [period, setPeriod] = useState('monthly');
  const [selectedBranchId, setSelectedBranchId] = useState('all');
  const [activeAiTab, setActiveAiTab] = useState('advisor');

  const [dateDaily, setDateDaily] = useState(new Date().toLocaleDateString('en-CA'));
  const [dateWeekly, setDateWeekly] = useState(() => {
    const now = new Date();
    const onejan = new Date(now.getFullYear(), 0, 1);
    const week = Math.ceil((((now - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    return `${now.getFullYear()}-W${week.toString().padStart(2, '0')}`;
  });
  const [dateMonthly, setDateMonthly] = useState(new Date().toISOString().slice(0, 7));

  const [branches, setBranches] = useState([]);
  const [activities, setActivities] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [employeeTransactions, setEmployeeTransactions] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState({});
  const [topMenus, setTopMenus] = useState([]);
  const [lowStockMenus, setLowStockMenus] = useState([]);
  const [unpaidInvoices, setUnpaidInvoices] = useState([]);

  const [stats, setStats] = useState({
    totalRevenue: 0,
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

  const getActiveMonthStr = () => new Date().toISOString().slice(0, 7);

  const getPrevPeriodStr = (currentPeriod, currentDateStr) => {
    if (currentPeriod === 'daily') {
      const d = new Date(currentDateStr);
      d.setDate(d.getDate() - 1);
      return d.toLocaleDateString('en-CA');
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
    const savedTheme = localStorage.getItem('nexaflow_theme');
    if (savedTheme === 'dark') setIsDarkMode(true);
    else setIsDarkMode(false);
  }, []);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('nexaflow_theme', isDarkMode ? 'dark' : 'light');
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

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  const fetchAllData = async (email, currentPeriod, currentDateStr, branchId = selectedBranchId) => {
    if (!email) return;
    try {
      const prevDateStr = getPrevPeriodStr(currentPeriod, currentDateStr);
      const branchQuery = branchId && branchId !== 'all' ? `&tenant_id=${encodeURIComponent(branchId)}` : '';
      const [tenantsRes, statsRes, actRes, prevRes] = await Promise.all([
        supabase.from('tenants').select('*').eq('manager_email', email).order('created_at', { ascending: false }),
        fetch(`/api/owner/stats?manager_email=${encodeURIComponent(email)}&period=${currentPeriod}&date_str=${currentDateStr}${branchQuery}`),
        fetch(`/api/owner/recent-activity?manager_email=${encodeURIComponent(email)}`),
        fetch(`/api/owner/stats?manager_email=${encodeURIComponent(email)}&period=${currentPeriod}&date_str=${prevDateStr}${branchQuery}`),
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

      const todayStr = new Date().toLocaleDateString('en-CA');
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

  // SUPABASE REALTIME SUBSCRIPTION (RESPONSIF TANPA DELAY)
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
        borderColor: isDarkMode ? '#38BDF8' : '#2A1F17',
        backgroundColor: isDarkMode ? 'rgba(56, 189, 248, 0.14)' : 'rgba(42, 31, 23, 0.10)',
        borderWidth: 3,
        pointBackgroundColor: isDarkMode ? '#38BDF8' : '#2A1F17',
        pointBorderColor: isDarkMode ? '#0a192f' : '#FFFFFF',
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
        borderColor: isDarkMode ? '#94A3B8' : '#8C7A6B',
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
            grid: { color: isDarkMode ? 'rgba(148, 163, 184, 0.12)' : 'rgba(224, 214, 204, 0.7)', drawBorder: false },
            ticks: { color: isDarkMode ? '#CBD5E1' : '#5C4B3E', font: { family: 'Inter', size: 12, weight: '700' } },
          },
          y: {
            grid: { color: isDarkMode ? 'rgba(148, 163, 184, 0.12)' : 'rgba(224, 214, 204, 0.7)', drawBorder: false },
            ticks: {
              color: isDarkMode ? '#CBD5E1' : '#5C4B3E',
              font: { family: 'Inter', size: 12, weight: '700' },
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

  const handleAskAiAdvisor = async (e) => {
    e.preventDefault();
    const q = aiPromptInput.trim();
    if (!q || isAskingAi) return;
    setIsAskingAi(true);
    try {
      const branchSummary = branches.map(b => ({
        nama: b.name,
        omzet: stats.branchStats?.[b.id]?.revenue || 0,
        transaksi: stats.branchStats?.[b.id]?.transactions || 0,
      }));

      const compactContext = {
        cabangAktif: selectedBranchLabel,
        periode: `${period} (${getActiveDateStr()})`,
        totalRevenue: stats.totalRevenue,
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
        deadStockSample: (aiInsights.deadStockMenus || []).slice(0, 5).map(m => `${m.name} (${m.branch_name})`),
        topMenus: topMenus.slice(0, 5),
        lowStockCount: lowStockMenus.length,
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
        setAiPromptInput('');
      }
    } catch (err) {
      showToast('Gagal menghubungi AI Business Advisor', 'error');
    } finally {
      setIsAskingAi(false);
    }
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
      ['Pendapatan Kotor', stats.totalRevenue],
      ['Total Transaksi', stats.totalTransactions],
      ['Rata-Rata Nilai Struk (Basket Size)', aiInsights.avgBasket],
      ['Pengeluaran Operasional', stats.operationalExpense],
      ['Biaya Karyawan (Gaji/Kasbon/Bonus)', stats.salaryExpense],
      ['Total Pengeluaran', stats.totalExpense],
      ['Laba Bersih (Net Profit)', stats.netProfit],
      ['Margin Laba (%)', `${marginPct}%`],
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

  const currentMonthStr = new Date().toISOString().slice(0, 7);
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
    <div className="bg-[#F4EFE9] text-[#1A1512] dark:bg-[#0a192f] dark:text-white min-h-screen font-sans">
      <style>{`
        .owner-card { box-shadow: 0 2px 8px rgba(26, 21, 18, 0.06); }
        .dark .owner-card { box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35); }
        .owner-num { font-variant-numeric: tabular-nums; letter-spacing: -0.02em; }
      `}</style>

      <div className="flex min-h-screen">
        {/* SIDEBAR TEGAS SELARAS KASIR */}
        <aside className="hidden lg:flex lg:w-60 bg-[#2A1F17] text-white dark:bg-slate-900 border-r-2 border-[#1A1512] dark:border-slate-700 flex-col justify-between p-5 shrink-0 h-screen sticky top-0">
          <div className="space-y-8">
            <div className="flex items-center gap-3 px-1">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0 p-1 shadow-sm">
                <img src="/logo-nexaflow-3d.png" alt="NexaFlow" className="w-full h-full object-contain" />
              </div>
              <div>
                <p className="text-base font-black tracking-tight text-white leading-none">NEXAFLOW</p>
                <p className="text-[11px] font-extrabold text-amber-400 tracking-wider uppercase mt-1">Owner Panel</p>
              </div>
            </div>

            <nav className="space-y-1.5">
              <Link href="/owner" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-black border border-blue-400/40">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="w-4 h-4 shrink-0"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                <span>Command Center AI</span>
              </Link>
              <Link href="/owner/finance" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[#D3C8BB] dark:text-slate-300 hover:bg-white/10 hover:text-white text-xs font-bold transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="w-4 h-4 shrink-0"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                <span>Keuangan & Stok</span>
              </Link>
              <Link href="/owner/reports" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[#D3C8BB] dark:text-slate-300 hover:bg-white/10 hover:text-white text-xs font-bold transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="w-4 h-4 shrink-0"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                <span>Laporan Global P&L</span>
              </Link>
              <Link href="/owner/settings" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[#D3C8BB] dark:text-slate-300 hover:bg-white/10 hover:text-white text-xs font-bold transition-colors">
                <Icons.Settings />
                <span>Pengaturan & AI Key</span>
              </Link>
            </nav>
          </div>

          <div className="pt-4 border-t border-white/15 space-y-3">
            <div className="px-1">
              <p className="text-xs font-black text-white truncate">{userEmail || 'Owner'}</p>
              <p className="text-[11px] font-bold text-[#D3C8BB] dark:text-slate-400 mt-0.5">{branches.length} Cabang Aktif</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black transition-colors"
            >
              <Icons.Logout />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* AREA KONTEN UTAMA */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* NAVIGASI MOBILE */}
          <div className="lg:hidden bg-[#2A1F17] dark:bg-slate-900 border-b-2 border-[#1A1512] dark:border-slate-700 px-4 py-2.5 flex items-center justify-between gap-2 overflow-x-auto">
            <div className="flex items-center gap-1.5">
              <Link href="/owner" className="px-3 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-black whitespace-nowrap">Overview</Link>
              <Link href="/owner/finance" className="px-3 py-1.5 rounded-lg text-[#D3C8BB] text-xs font-bold whitespace-nowrap">Keuangan</Link>
              <Link href="/owner/reports" className="px-3 py-1.5 rounded-lg text-[#D3C8BB] text-xs font-bold whitespace-nowrap">Laporan</Link>
              <Link href="/owner/settings" className="px-3 py-1.5 rounded-lg text-[#D3C8BB] text-xs font-bold whitespace-nowrap">Pengaturan</Link>
            </div>
            <button type="button" onClick={handleLogout} className="px-2.5 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-black shrink-0">
              Keluar
            </button>
          </div>

          {/* HEADER */}
          <header className="bg-white dark:bg-slate-900 border-b-2 border-[#E0D6CC] dark:border-slate-700 px-5 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-30">
            <div>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${realtimeConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#5C4B3E] dark:text-sky-300">
                  {realtimeConnected ? 'Realtime Aktif' : 'Menghubungkan...'} · Periode {getActiveDateStr()}
                </p>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-[#1A1512] dark:text-white tracking-tight mt-0.5">
                Command Center & AI Business Advisor
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(e.target.value)}
                aria-label="Filter Cabang"
                className="bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 rounded-xl px-3 py-2 text-xs font-extrabold text-[#1A1512] dark:text-white outline-none max-w-[200px]"
              >
                <option value="all">Semua Cabang ({branches.length} Outlet)</option>
                {branches.map((b, idx) => (
                  <option key={b.id} value={b.id}>Cabang {idx + 1} · {b.name}</option>
                ))}
              </select>

              <div className="flex items-center gap-2">
                {period === 'daily' && (
                  <input type="date" value={dateDaily} onChange={(e) => handleDateChange(e, 'daily')} className="bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 rounded-xl px-3 py-2 text-xs font-extrabold text-[#1A1512] dark:text-white outline-none" />
                )}
                {period === 'weekly' && (
                  <input type="week" value={dateWeekly} onChange={(e) => handleDateChange(e, 'weekly')} className="bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 rounded-xl px-3 py-2 text-xs font-extrabold text-[#1A1512] dark:text-white outline-none" />
                )}
                {period === 'monthly' && (
                  <input type="month" value={dateMonthly} onChange={(e) => handleDateChange(e, 'monthly')} className="bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 rounded-xl px-3 py-2 text-xs font-extrabold text-[#1A1512] dark:text-white outline-none" />
                )}
                <div className="hidden md:flex bg-[#FAF6F2] dark:bg-slate-800 rounded-xl p-1 border-2 border-[#E0D6CC] dark:border-slate-600">
                  <button onClick={() => handlePeriodChange('daily')} className={`px-3 py-1 rounded-lg text-xs font-black ${period === 'daily' ? 'bg-[#2A1F17] text-white dark:bg-[#2563EB]' : 'text-[#5C4B3E] dark:text-slate-300'}`}>Harian</button>
                  <button onClick={() => handlePeriodChange('weekly')} className={`px-3 py-1 rounded-lg text-xs font-black ${period === 'weekly' ? 'bg-[#2A1F17] text-white dark:bg-[#2563EB]' : 'text-[#5C4B3E] dark:text-slate-300'}`}>Mingguan</button>
                  <button onClick={() => handlePeriodChange('monthly')} className={`px-3 py-1 rounded-lg text-xs font-black ${period === 'monthly' ? 'bg-[#2A1F17] text-white dark:bg-[#2563EB]' : 'text-[#5C4B3E] dark:text-slate-300'}`}>Bulanan</button>
                </div>
              </div>

              <button onClick={handleRefresh} title="Refresh Riset AI" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 text-[#1A1512] dark:text-white text-xs font-black hover:bg-[#EFEAE2] dark:hover:bg-slate-700">
                <Icons.Refresh />
                <span className="hidden xl:inline">Refresh</span>
              </button>

              <button onClick={handleExportCSV} title="Export Ringkasan P&L (CSV)" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 text-[#1A1512] dark:text-white text-xs font-black hover:bg-[#EFEAE2] dark:hover:bg-slate-700">
                <Icons.Download />
                <span className="hidden sm:inline">CSV</span>
              </button>

              <button onClick={() => setIsDarkMode(!isDarkMode)} title="Ubah Tema" className="p-2 rounded-xl bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 text-[#1A1512] dark:text-amber-400">
                {isDarkMode ? <Icons.Sun /> : <Icons.Moon />}
              </button>

              <button onClick={() => setIsModalOpen(true)} className="bg-[#2563EB] hover:bg-blue-700 text-white font-black px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 border-2 border-blue-700">
                <Icons.Plus />
                <span className="hidden sm:inline">Tambah Cabang</span>
              </button>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
            {/* SUB-NAVIGATION TABS */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <button
                  type="button"
                  onClick={() => setActiveAiTab('advisor')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black whitespace-nowrap border-2 ${
                    activeAiTab === 'advisor'
                      ? 'bg-[#2A1F17] dark:bg-[#2563EB] text-white border-[#1A1512] dark:border-blue-500'
                      : 'bg-white dark:bg-slate-900 border-[#E0D6CC] dark:border-slate-700 text-[#1A1512] dark:text-slate-200'
                  }`}
                >
                  <Icons.Bot />
                  <span>AI Business Advisor</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveAiTab('audit')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black whitespace-nowrap border-2 ${
                    activeAiTab === 'audit'
                      ? 'bg-[#2A1F17] dark:bg-[#2563EB] text-white border-[#1A1512] dark:border-blue-500'
                      : 'bg-white dark:bg-slate-900 border-[#E0D6CC] dark:border-slate-700 text-[#1A1512] dark:text-slate-200'
                  }`}
                >
                  <Icons.Shield />
                  <span>Audit Fraud & Kasir</span>
                  <span className="ml-1 px-2 py-0.5 rounded bg-rose-600 text-white text-[11px] font-black">
                    {aiInsights.fraudAlerts?.length || 0}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveAiTab('promo')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black whitespace-nowrap border-2 ${
                    activeAiTab === 'promo'
                      ? 'bg-[#2A1F17] dark:bg-[#2563EB] text-white border-[#1A1512] dark:border-blue-500'
                      : 'bg-white dark:bg-slate-900 border-[#E0D6CC] dark:border-slate-700 text-[#1A1512] dark:text-slate-200'
                  }`}
                >
                  <Icons.Tag />
                  <span>Menu & Promo Aktif</span>
                  <span className="ml-1 px-2 py-0.5 rounded bg-emerald-600 text-white text-[11px] font-black">
                    {aiInsights.activePromos?.length || 0}
                  </span>
                </button>
              </div>

              <Link
                href="/owner/settings"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border-2 border-[#E0D6CC] dark:border-slate-700 text-xs font-extrabold text-[#1A1512] dark:text-slate-200"
              >
                <span className={`w-2.5 h-2.5 rounded-full ${aiConfig.apiKey ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                <span>Mesin AI: {aiConfig.provider.toUpperCase()} ({aiConfig.model})</span>
              </Link>
            </div>

            {/* ALERT BAR */}
            {(unpaidInvoices.length > 0 || unpaidEmployees.length > 0 || lowStockMenus.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {unpaidInvoices.length > 0 && (
                  <div className="owner-card bg-white dark:bg-slate-900 border-2 border-blue-400 dark:border-blue-500/60 rounded-2xl p-4 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center shrink-0 text-blue-700 dark:text-blue-300">
                      <Icons.File />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-blue-800 dark:text-blue-300">Tagihan Langganan NexaFlow</p>
                      <p className="text-xs font-bold text-[#1A1512] dark:text-slate-200 mt-1">
                        {unpaidInvoices.length} invoice belum dibayar · <span className="owner-num font-black">{formatRp(totalUnpaidInvoiceAmount)}</span>
                      </p>
                      <p className="text-[11px] font-bold text-[#5C4B3E] dark:text-slate-400 mt-1 truncate">
                        {unpaidInvoices.slice(0, 2).map(inv => `${inv.branch_name} (${inv.period})`).join(', ')}
                      </p>
                    </div>
                  </div>
                )}

                {unpaidEmployees.length > 0 && (
                  <div className="owner-card bg-white dark:bg-slate-900 border-2 border-rose-400 dark:border-rose-500/60 rounded-2xl p-4 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center shrink-0 text-rose-700 dark:text-rose-300">
                      <Icons.Alert />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-rose-700 dark:text-rose-300">Peringatan Gaji Karyawan</p>
                      <p className="text-xs font-bold text-[#1A1512] dark:text-slate-200 mt-1">{unpaidEmployees.length} karyawan belum menerima gaji bulan ini.</p>
                      <Link href="/owner/finance" className="text-xs font-black text-rose-700 dark:text-rose-400 mt-1.5 inline-block underline">Proses Gaji →</Link>
                    </div>
                  </div>
                )}

                {lowStockMenus.length > 0 && (
                  <div className="owner-card bg-white dark:bg-slate-900 border-2 border-amber-400 dark:border-amber-500/60 rounded-2xl p-4 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center shrink-0 text-amber-700 dark:text-amber-300">
                      <Icons.Box />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-amber-800 dark:text-amber-300">Stok Menipis</p>
                      <p className="text-xs font-bold text-[#1A1512] dark:text-slate-200 mt-1">{lowStockMenus.length} menu di bawah 10 pcs</p>
                      <Link href="/owner/finance" className="text-xs font-black text-amber-800 dark:text-amber-400 mt-1.5 inline-block underline">Kelola Stok →</Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4 KPI UTAMA TEGAS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="owner-card bg-white dark:bg-slate-900 border-2 border-[#E0D6CC] dark:border-slate-700 rounded-2xl p-5">
                <p className="text-xs font-black text-[#5C4B3E] dark:text-slate-300 uppercase tracking-wide">Omzet Periode Ini</p>
                <h3 className="text-xl sm:text-2xl font-black text-[#1A1512] dark:text-white owner-num mt-1.5">
                  {isLoading ? '...' : formatRp(stats.totalRevenue)}
                </h3>
                <p className="mt-2 text-xs font-extrabold text-blue-700 dark:text-sky-300">
                  {stats.totalTransactions} transaksi selesai
                </p>
              </div>

              <div className="owner-card bg-white dark:bg-slate-900 border-2 border-[#E0D6CC] dark:border-slate-700 rounded-2xl p-5">
                <p className="text-xs font-black text-[#5C4B3E] dark:text-slate-300 uppercase tracking-wide">Rata-Rata / Struk</p>
                <h3 className="text-xl sm:text-2xl font-black text-[#1A1512] dark:text-white owner-num mt-1.5">
                  {isLoading ? '...' : formatRp(aiInsights.avgBasket)}
                </h3>
                <p className="mt-2 text-xs font-extrabold text-amber-700 dark:text-amber-300">
                  Repeat Order: {aiInsights.repeatRate}%
                </p>
              </div>

              <div className="owner-card bg-white dark:bg-slate-900 border-2 border-[#E0D6CC] dark:border-slate-700 rounded-2xl p-5">
                <p className="text-xs font-black text-[#5C4B3E] dark:text-slate-300 uppercase tracking-wide">Laba Bersih (P&L)</p>
                <h3 className={`text-xl sm:text-2xl font-black owner-num mt-1.5 ${stats.netProfit >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {isLoading ? '...' : formatRp(stats.netProfit)}
                </h3>
                <p className="mt-2 text-xs font-extrabold text-rose-700 dark:text-rose-300">
                  Biaya: {formatRp(stats.totalExpense)}
                </p>
              </div>

              <div className="owner-card bg-white dark:bg-slate-900 border-2 border-[#E0D6CC] dark:border-slate-700 rounded-2xl p-5">
                <p className="text-xs font-black text-[#5C4B3E] dark:text-slate-300 uppercase tracking-wide">Kecepatan Dapur</p>
                <h3 className="text-xl sm:text-2xl font-black text-[#1A1512] dark:text-white owner-num mt-1.5">
                  {isLoading ? '...' : `${aiInsights.avgKdsMinutes} Menit`}
                </h3>
                <p className="mt-2 text-xs font-extrabold text-emerald-700 dark:text-emerald-300">
                  Staf Aktif: {employees.filter(e => e.is_active).length}/{employees.length}
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
                        className={`owner-card rounded-2xl p-4 border-2 flex items-start gap-3 bg-white dark:bg-slate-900 ${
                          anom.status === 'drop' ? 'border-rose-500' : 'border-emerald-500'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          anom.status === 'drop' ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                        }`}>
                          {anom.status === 'drop' ? <Icons.Alert /> : <Icons.Activity />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className={`text-xs font-black ${anom.status === 'drop' ? 'text-rose-700 dark:text-rose-300' : 'text-emerald-700 dark:text-emerald-300'}`}>
                              {anom.status === 'drop' ? 'Peringatan Anomali Omzet Turun' : 'Lonjakan Omzet Terdeteksi'}: {anom.branch_name}
                            </p>
                            <span className={`px-2 py-0.5 rounded text-xs font-black owner-num ${
                              anom.status === 'drop' ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                            }`}>
                              {anom.diffPct > 0 ? `+${anom.diffPct}%` : `${anom.diffPct}%`}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-[#1A1512] dark:text-slate-200 mt-1">
                            Aktual <span className="owner-num font-black">{formatRp(anom.currentRev)}</span> vs rata-rata historis <span className="owner-num font-black">{formatRp(anom.expectedRev)}</span>.
                          </p>
                        </div>
                      </div>
                    ))}

                    {(aiInsights.costAudit || []).map((audit) => (
                      <div
                        key={`cost-${audit.tenant_id}`}
                        className="owner-card rounded-2xl p-4 border-2 border-amber-500 bg-white dark:bg-slate-900 flex items-start gap-3"
                      >
                        <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 flex items-center justify-center shrink-0">
                          <Icons.Coin />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-black text-amber-800 dark:text-amber-300">
                              Audit Rasio Biaya Tinggi: {audit.branch_name}
                            </p>
                            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 text-xs font-black owner-num">
                              {audit.costRatioPct}% Omzet
                            </span>
                          </div>
                          <p className="text-xs font-bold text-[#1A1512] dark:text-slate-200 mt-1">
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
                    <div className="owner-card bg-white dark:bg-slate-900 border-2 border-[#E0D6CC] dark:border-slate-700 rounded-2xl p-5 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
                        <div>
                          <h2 className="text-base sm:text-lg font-black text-[#1A1512] dark:text-white">
                            Perbandingan Omzet: Periode Ini vs Periode Lalu
                          </h2>
                          <p className="text-xs font-bold text-[#5C4B3E] dark:text-slate-300 mt-0.5">
                            Pendapatan dalam Juta Rupiah · {selectedBranchLabel}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-extrabold">
                          <span className="inline-flex items-center gap-1.5 text-[#1A1512] dark:text-sky-300">
                            <span className="w-3 h-3 rounded-full bg-[#2A1F17] dark:bg-sky-400"></span>Periode Ini
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-[#5C4B3E] dark:text-slate-300">
                            <span className="w-3 h-3 rounded-full bg-[#8C7A6B] dark:bg-slate-400"></span>Periode Lalu
                          </span>
                        </div>
                      </div>
                      <div className="relative h-64 sm:h-72">
                        <canvas ref={chartRef}></canvas>
                      </div>
                    </div>

                    {/* HASIL RISET MENDALAM AI */}
                    <div className="owner-card bg-white dark:bg-slate-900 border-2 border-[#E0D6CC] dark:border-slate-700 rounded-2xl p-5 sm:p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 flex items-center justify-center text-[#1A1512] dark:text-sky-300">
                            <Icons.Search />
                          </div>
                          <div>
                            <h3 className="text-sm sm:text-base font-black text-[#1A1512] dark:text-white">
                              Hasil Riset Mendalam AI (Diagnostik Operasional)
                            </h3>
                            <p className="text-xs font-bold text-[#5C4B3E] dark:text-slate-300">
                              Dihitung otomatis dari data transaksi, stok menu, pengeluaran, dan perangkat
                            </p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-black">
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
                              : 'bg-[#2563EB] text-white';
                          return (
                            <div
                              key={diag.code}
                              className="rounded-xl bg-[#FAF6F2] dark:bg-slate-800/80 border-2 border-[#E0D6CC] dark:border-slate-700 p-4 flex items-start gap-3"
                            >
                              <span className={`px-2.5 py-0.5 rounded text-xs font-black font-mono shrink-0 mt-0.5 ${badgeCls}`}>
                                {diag.code}
                              </span>
                              <div>
                                <p className="text-sm font-black text-[#1A1512] dark:text-white">{diag.title}</p>
                                <p className="text-xs font-semibold text-[#5C4B3E] dark:text-slate-200 mt-1 leading-relaxed">
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
                      <div className="owner-card bg-white dark:bg-slate-900 border-2 border-amber-400 dark:border-amber-500/60 rounded-2xl p-5 sm:p-6">
                        <div className="flex items-center justify-between gap-2 mb-4">
                          <div>
                            <h3 className="text-sm sm:text-base font-black text-[#1A1512] dark:text-white">
                              Detektor Menu Mati (0 Penjualan 30 Hari Terakhir)
                            </h3>
                            <p className="text-xs font-bold text-[#5C4B3E] dark:text-slate-300 mt-0.5">
                              Menu aktif yang belum terjual sama sekali dalam 30 hari terakhir
                            </p>
                          </div>
                          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-300 text-xs font-black">
                            {aiInsights.deadStockMenus.length} Menu
                          </span>
                        </div>
                        <div className="space-y-2.5">
                          {aiInsights.deadStockMenus.slice(0, 5).map((dm) => {
                            const actionId = `deadstock_${dm.id}`;
                            const isDone = Boolean(executedActionIds[actionId]);
                            const isBusy = executingActionId === actionId;
                            return (
                              <div
                                key={dm.id}
                                className="rounded-xl bg-[#FAF6F2] dark:bg-slate-800/80 border-2 border-[#E0D6CC] dark:border-slate-700 p-3 flex flex-wrap items-center justify-between gap-3"
                              >
                                <div className="min-w-0">
                                  <p className="text-xs font-black text-[#1A1512] dark:text-white truncate">{dm.name}</p>
                                  <p className="text-xs font-bold text-[#5C4B3E] dark:text-slate-300">
                                    {dm.branch_name} · Stok: {dm.stock} pcs · <span className="owner-num">{formatRp(dm.price)}</span>
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
                                    })
                                  }
                                  className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 ${
                                    isDone
                                      ? 'bg-emerald-600 text-white cursor-default'
                                      : 'bg-amber-600 hover:bg-amber-700 text-white'
                                  }`}
                                >
                                  {isDone ? (
                                    <>
                                      <Icons.Check />
                                      <span>Promo Aktif</span>
                                    </>
                                  ) : (
                                    <>
                                      <Icons.Bolt />
                                      <span>{isBusy ? 'Memproses...' : `Cuci Gudang (${formatRp(dm.suggested_discount_price)})`}</span>
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
                    <div className="owner-card bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border-2 border-[#2563EB]/50 dark:border-blue-500/50">
                      <div className="flex items-center justify-between gap-2 pb-4 border-b-2 border-[#F4EFE9] dark:border-slate-700">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#2A1F17] dark:bg-[#2563EB] flex items-center justify-center text-white shrink-0">
                            <Icons.Bot />
                          </div>
                          <div>
                            <h2 className="text-sm sm:text-base font-black text-[#1A1512] dark:text-white">
                              Rencana Aksi AI (1-Klik)
                            </h2>
                            <p className="text-xs font-bold text-[#2563EB] dark:text-sky-300">
                              Eksekusi langsung ke database & QR pelanggan
                            </p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded bg-[#2A1F17] dark:bg-blue-600 text-white text-xs font-black">
                          {(aiInsights.actionPlans || []).length} Aksi
                        </span>
                      </div>

                      <div className="mt-4 space-y-3.5">
                        {(aiInsights.actionPlans || []).map((act, idx) => {
                          const isDone = Boolean(executedActionIds[act.id]);
                          const isBusy = executingActionId === act.id;
                          const badgeThemeCls =
                            act.badgeTheme === 'amber'
                              ? 'bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-300'
                              : act.badgeTheme === 'sky'
                              ? 'bg-blue-100 text-blue-800 dark:bg-sky-500/20 dark:text-sky-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300';

                          return (
                            <div
                              key={act.id}
                              className={`rounded-xl bg-[#FAF6F2] dark:bg-slate-800/80 border-2 p-4 space-y-3 ${
                                isDone ? 'border-emerald-500' : 'border-[#E0D6CC] dark:border-slate-700'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-black uppercase tracking-wide mb-1.5 ${badgeThemeCls}`}>
                                    {act.badge}
                                  </span>
                                  <h4 className="text-sm font-black text-[#1A1512] dark:text-white">
                                    {act.title}
                                  </h4>
                                </div>
                                <span className="text-right shrink-0">
                                  {act.action_type === 'promo_discount' && (
                                    <>
                                      <span className="block text-xs text-[#8C7A6B] dark:text-slate-400 line-through font-bold owner-num">
                                        {formatRp(act.original_price)}
                                      </span>
                                      <span className="text-sm font-black text-emerald-700 dark:text-emerald-400 owner-num">
                                        {formatRp(act.discount_price)}
                                      </span>
                                    </>
                                  )}
                                  {act.action_type === 'restock_menu' && (
                                    <span className="text-xs font-black text-blue-700 dark:text-sky-300 owner-num">
                                      {act.current_stock} → {act.new_stock} Porsi
                                    </span>
                                  )}
                                  {act.action_type === 'create_bundle' && (
                                    <span className="text-sm font-black text-emerald-700 dark:text-emerald-400 owner-num">
                                      {formatRp(act.bundle_price)}
                                    </span>
                                  )}
                                </span>
                              </div>

                              <p className="text-xs font-semibold text-[#5C4B3E] dark:text-slate-200 leading-relaxed">
                                {act.description}
                              </p>

                              <button
                                type="button"
                                disabled={isDone || isBusy}
                                onClick={() => handleExecuteAiAction(act)}
                                className={`w-full py-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 border-2 ${
                                  isDone
                                    ? 'bg-emerald-600 border-emerald-700 text-white cursor-default'
                                    : idx === 0
                                    ? 'bg-[#2A1F17] hover:bg-[#1A1512] border-[#1A1512] text-white dark:bg-amber-600 dark:hover:bg-amber-700 dark:border-amber-500'
                                    : 'bg-[#2563EB] hover:bg-blue-700 border-blue-700 text-white'
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

                      {/* KOTAK TANYA AI ADVISOR */}
                      <div className="mt-5 pt-4 border-t-2 border-[#F4EFE9] dark:border-slate-700">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-black text-[#1A1512] dark:text-slate-200">
                            Tanya AI Advisor:
                          </p>
                          <Link href="/owner/settings" className="text-xs font-black text-[#2563EB] dark:text-sky-400 underline">
                            Atur API Key →
                          </Link>
                        </div>

                        {aiChatReply && (
                          <div className="mb-3 rounded-xl bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#2563EB]/40 p-3.5 text-xs font-semibold text-[#1A1512] dark:text-slate-100 leading-relaxed whitespace-pre-line">
                            <strong className="text-[#2563EB] dark:text-sky-300 block mb-1">
                              AI Advisor ({aiConfig.model}):
                            </strong>
                            {aiChatReply}
                          </div>
                        )}

                        <form onSubmit={handleAskAiAdvisor} className="flex gap-2">
                          <input
                            type="text"
                            value={aiPromptInput}
                            onChange={(e) => setAiPromptInput(e.target.value)}
                            placeholder="Tanya performa cabang atau biaya..."
                            className="flex-1 bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1A1512] dark:text-white placeholder-[#8C7A6B] dark:placeholder-slate-400 focus:outline-none focus:border-[#2563EB]"
                          />
                          <button
                            type="submit"
                            disabled={isAskingAi}
                            className="px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-black shrink-0 disabled:opacity-50"
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
                  <div className="owner-card bg-white dark:bg-slate-900 border-2 border-[#E0D6CC] dark:border-slate-700 rounded-2xl p-6 flex flex-col">
                    <h2 className="text-lg font-black text-[#1A1512] dark:text-white mb-1">Pengeluaran</h2>
                    <p className="text-xs font-bold text-[#5C4B3E] dark:text-slate-300 mb-4">Per kategori periode aktif</p>
                    {Object.keys(expenseCategories).length === 0 ? (
                      <div className="flex-1 flex items-center justify-center py-8">
                        <p className="text-xs font-bold text-[#5C4B3E] dark:text-slate-400 text-center">Belum ada pengeluaran tercatat.</p>
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
                                <span className="font-extrabold text-[#1A1512] dark:text-slate-200 truncate">{cat}</span>
                              </div>
                              <span className="font-black text-[#1A1512] dark:text-white owner-num shrink-0 ml-2">{formatRp(amt)}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="owner-card bg-white dark:bg-slate-900 border-2 border-[#E0D6CC] dark:border-slate-700 rounded-2xl p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-1">
                      <h2 className="text-lg font-black text-[#1A1512] dark:text-white">Biaya Karyawan</h2>
                      <Link href="/owner/finance" className="text-xs font-black text-[#2563EB] dark:text-sky-400 underline">Kelola →</Link>
                    </div>
                    <p className="text-xs font-bold text-[#5C4B3E] dark:text-slate-300 mb-5">{selectedBranchLabel}</p>

                    <div className="space-y-3">
                      <div className="bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-700 rounded-xl p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-blue-700 dark:text-sky-400"><Icons.Coin /></span>
                          <span className="text-xs font-black text-[#1A1512] dark:text-white">Gaji</span>
                        </div>
                        <span className="text-xs font-black text-[#1A1512] dark:text-white owner-num">{formatRp(employeeTransactions.filter(t => t.type === 'Gaji').reduce((s, t) => s + Number(t.amount), 0))}</span>
                      </div>
                      <div className="bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-700 rounded-xl p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-amber-700 dark:text-amber-400"><Icons.Clock /></span>
                          <span className="text-xs font-black text-[#1A1512] dark:text-white">Kasbon</span>
                        </div>
                        <span className="text-xs font-black text-[#1A1512] dark:text-white owner-num">{formatRp(employeeTransactions.filter(t => t.type === 'Kasbon').reduce((s, t) => s + Number(t.amount), 0))}</span>
                      </div>
                      <div className="bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-700 rounded-xl p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-700 dark:text-emerald-400"><Icons.Check /></span>
                          <span className="text-xs font-black text-[#1A1512] dark:text-white">Bonus</span>
                        </div>
                        <span className="text-xs font-black text-[#1A1512] dark:text-white owner-num">{formatRp(employeeTransactions.filter(t => t.type === 'Bonus').reduce((s, t) => s + Number(t.amount), 0))}</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t-2 border-[#F4EFE9] dark:border-slate-700 flex items-center justify-between">
                      <span className="text-xs font-black text-[#5C4B3E] dark:text-slate-300 uppercase">Total</span>
                      <span className="text-sm font-black text-rose-600 dark:text-rose-400 owner-num">{formatRp(employeeTransactions.reduce((s, t) => s + Number(t.amount), 0))}</span>
                    </div>
                  </div>

                  <div className="owner-card bg-white dark:bg-slate-900 border-2 border-[#E0D6CC] dark:border-slate-700 rounded-2xl p-6">
                    <h2 className="text-lg font-black text-[#1A1512] dark:text-white mb-4">Aktivitas Terbaru</h2>
                    <div className="max-h-[250px] overflow-y-auto pr-2 space-y-3.5">
                      {filteredActivities.length === 0 ? (
                        <p className="text-xs font-bold text-[#5C4B3E] dark:text-slate-400 text-center mt-10">Belum ada aktivitas.</p>
                      ) : filteredActivities.map((act, i) => (
                        <div key={i} className="flex gap-3 items-start">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0">
                            <Icons.Activity />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-xs font-black text-[#1A1512] dark:text-white truncate">Pesanan Masuk</p>
                              <p className="text-[11px] font-bold text-[#5C4B3E] dark:text-slate-400 shrink-0">{timeAgo(act.created_at)}</p>
                            </div>
                            <p className="text-xs font-bold text-[#5C4B3E] dark:text-slate-300 mt-0.5 truncate">
                              {act.tenants?.name || 'Cabang'} · <span className="owner-num text-[#1A1512] dark:text-white">{formatRp(act.total_price)}</span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* TOP MENU + STOK MENIPIS */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="owner-card bg-white dark:bg-slate-900 border-2 border-[#E0D6CC] dark:border-slate-700 rounded-2xl p-6">
                    <div className="mb-5">
                      <h2 className="text-lg font-black text-[#1A1512] dark:text-white">Menu Terlaris</h2>
                      <p className="text-xs font-bold text-[#5C4B3E] dark:text-slate-300 mt-1">Top 5 periode aktif</p>
                    </div>
                    {topMenus.length === 0 ? (
                      <p className="text-xs font-bold text-[#5C4B3E] dark:text-slate-400 text-center py-8">Belum ada data penjualan.</p>
                    ) : (
                      <div className="space-y-4">
                        {topMenus.map((m, i) => {
                          const maxQty = topMenus[0]?.qty || 1;
                          const pct = (m.qty / maxQty) * 100;
                          return (
                            <div key={m.name + i}>
                              <div className="flex items-center justify-between mb-1.5 gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="text-xs font-black text-[#2563EB] dark:text-sky-400 w-5 shrink-0">#{i + 1}</span>
                                  <span className="text-xs font-black text-[#1A1512] dark:text-white truncate">{m.name}</span>
                                </div>
                                <span className="text-xs font-extrabold text-[#5C4B3E] dark:text-slate-200 shrink-0 owner-num">{m.qty} pcs · {formatRp(m.revenue)}</span>
                              </div>
                              <div className="h-2.5 bg-[#FAF6F2] dark:bg-slate-800 rounded-full overflow-hidden border border-[#E0D6CC] dark:border-slate-700">
                                <div className="h-full bg-[#2A1F17] dark:bg-[#2563EB]" style={{ width: `${pct}%` }}></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="owner-card bg-white dark:bg-slate-900 border-2 border-[#E0D6CC] dark:border-slate-700 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <h2 className="text-lg font-black text-[#1A1512] dark:text-white">Stok Menipis</h2>
                        <p className="text-xs font-bold text-[#5C4B3E] dark:text-slate-300 mt-1">Menu dengan stok ≤ 10 pcs</p>
                      </div>
                      <Link href="/owner/finance" className="text-xs font-black text-[#2563EB] dark:text-sky-400 underline">Kelola →</Link>
                    </div>
                    {lowStockMenus.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-700 dark:text-emerald-400 mb-2">
                          <Icons.Check />
                        </div>
                        <p className="text-xs font-black text-[#5C4B3E] dark:text-slate-300">Semua stok aman</p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                        {lowStockMenus.slice(0, 8).map((m) => (
                          <div key={m.id} className="flex items-center justify-between bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-700 rounded-xl px-3.5 py-2.5">
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-black text-[#1A1512] dark:text-white truncate">{m.name}</p>
                              <p className="text-[11px] font-bold text-[#5C4B3E] dark:text-slate-300">{m.branch_name || m.tenant_id}</p>
                            </div>
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-black shrink-0 ${Number(m.stock) <= 3 ? 'bg-rose-600 text-white' : 'bg-amber-500 text-[#1A1512]'}`}>
                              {m.stock} pcs
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* DAFTAR CABANG */}
                <div id="daftar-cabang" className="owner-card bg-white dark:bg-slate-900 border-2 border-[#E0D6CC] dark:border-slate-700 rounded-2xl overflow-hidden">
                  <div className="p-6 border-b-2 border-[#E0D6CC] dark:border-slate-700 flex justify-between items-center bg-[#FAF6F2] dark:bg-slate-800/70">
                    <h3 className="text-lg font-black text-[#1A1512] dark:text-white">Daftar Cabang Anda</h3>
                    <span className="text-xs font-black text-[#5C4B3E] dark:text-slate-300">{branches.length} cabang</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b-2 border-[#E0D6CC] dark:border-slate-700 text-xs uppercase tracking-wider text-[#5C4B3E] dark:text-slate-300 bg-[#FAF6F2] dark:bg-slate-800/40">
                          <th className="p-4 pl-6 font-black">Nama Cabang</th>
                          <th className="p-4 font-black">Status</th>
                          <th className="p-4 font-black">Pendapatan</th>
                          <th className="p-4 font-black">Transaksi</th>
                          <th className="p-4 font-black text-center">Karyawan</th>
                          <th className="p-4 font-black text-right pr-6">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y-2 divide-[#F4EFE9] dark:divide-slate-800">
                        {isLoading ? (
                          <tr><td colSpan="6" className="p-6 text-center text-[#5C4B3E] dark:text-slate-300 font-black">Memuat data...</td></tr>
                        ) : branches.length === 0 ? (
                          <tr><td colSpan="6" className="p-6 text-center text-[#5C4B3E] dark:text-slate-300 font-black">Belum ada cabang. Silakan tambahkan cabang baru.</td></tr>
                        ) : branches.map((branch) => {
                          const bStat = stats.branchStats[branch.id] || { revenue: 0, transactions: 0, employeeCount: 0 };
                          const isSelected = selectedBranchId === branch.id;
                          return (
                            <tr key={branch.id} className={`${isSelected ? 'bg-blue-50 dark:bg-slate-800' : 'hover:bg-[#FAF6F2] dark:hover:bg-slate-800/60'}`}>
                              <td className="p-4 pl-6">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-lg bg-[#2A1F17] dark:bg-[#2563EB] flex items-center justify-center text-white font-black text-sm">
                                    {branch.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-black text-sm text-[#1A1512] dark:text-white truncate">{branch.name}</p>
                                    <p className="text-[11px] font-bold text-[#5C4B3E] dark:text-slate-400">ID: {branch.id.split('-')[0]}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black ${branch.is_active ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300'}`}>
                                  <span className={`w-2 h-2 rounded-full ${branch.is_active ? 'bg-emerald-600' : 'bg-rose-600'}`}></span>
                                  {branch.is_active ? 'Aktif' : 'Suspend'}
                                </span>
                              </td>
                              <td className="p-4">
                                <p className="font-black text-sm text-[#1A1512] dark:text-white owner-num">{formatRp(bStat.revenue)}</p>
                              </td>
                              <td className="p-4">
                                <p className="font-extrabold text-sm text-[#1A1512] dark:text-slate-200 owner-num">{bStat.transactions}</p>
                              </td>
                              <td className="p-4 text-center">
                                <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-[#FAF6F2] dark:bg-slate-800 border border-[#E0D6CC] dark:border-slate-600 text-[#1A1512] dark:text-white text-xs font-black">
                                  {bStat.employeeCount} Orang
                                </span>
                              </td>
                              <td className="p-4 pr-6 text-right">
                                <button onClick={() => window.location.href = `/dashboard?tenant_id=${branch.id}`} className="bg-[#2A1F17] hover:bg-[#1A1512] dark:bg-[#2563EB] dark:hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-black transition-colors">
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
                <div className="owner-card bg-white dark:bg-slate-900 rounded-2xl p-6 border-2 border-rose-400 dark:border-rose-500/50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                    <div>
                      <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white text-xs font-black uppercase tracking-wider">
                        AI Fraud & Void Watchdog
                      </span>
                      <h2 className="text-xl font-black text-[#1A1512] dark:text-white mt-2">
                        Deteksi Anomali Pembatalan Kasir & Kecepatan Dapur
                      </h2>
                    </div>
                    <span className="text-xs font-extrabold text-[#5C4B3E] dark:text-slate-300">
                      Dipantau otomatis 30 hari terakhir
                    </span>
                  </div>

                  {(aiInsights.fraudAlerts || []).length === 0 ? (
                    <div className="rounded-xl bg-emerald-50 dark:bg-emerald-500/15 border-2 border-emerald-300 dark:border-emerald-500/40 p-5 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <Icons.Check />
                      </div>
                      <div>
                        <p className="text-sm font-black text-emerald-900 dark:text-emerald-300">Tidak Ditemukan Anomali Kasir</p>
                        <p className="text-xs font-bold text-emerald-800 dark:text-slate-200 mt-0.5">
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
                            className="rounded-xl bg-[#FAF6F2] dark:bg-slate-800 border-2 border-rose-400 dark:border-rose-500/50 p-4 space-y-2.5"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <p className="text-sm font-black text-rose-700 dark:text-rose-300">
                                Peringatan Audit: {alert.branch_name}
                              </p>
                              <span className="text-xs font-mono font-bold text-rose-700 dark:text-rose-300">
                                Rentang Jam: {minHour} – {maxHour} WIB
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {alert.nightCashCancelCount > 0 && (
                                <span className="px-2.5 py-0.5 rounded-md bg-rose-600 text-white text-xs font-black">
                                  {alert.nightCashCancelCount}x Cancel Tunai Jam Malam (mulai 20.00 WIB)
                                </span>
                              )}
                              {alert.staleCashCount > 0 && (
                                <span className="px-2.5 py-0.5 rounded-md bg-amber-500 text-[#1A1512] text-xs font-black">
                                  {alert.staleCashCount} Order Tunai Menggantung lebih dari 2 Jam ({formatRp(alert.staleCashAmount)})
                                </span>
                              )}
                            </div>

                            <p className="text-xs font-semibold text-[#1A1512] dark:text-slate-200 leading-relaxed">
                              Ditemukan <strong>{alert.count} pesanan dibatalkan ({alert.cashCount} di antaranya metode Tunai/Cash)</strong> dengan total nilai{' '}
                              <strong className="text-rose-700 dark:text-rose-300 owner-num">{formatRp(alert.totalAmount)}</strong>. Disarankan meninjau aktivitas kasir pada jam tersebut.
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* KDS SPEED MONITOR + PEAK HOUR BOTTLENECK */}
                  <div className="mt-6 pt-5 border-t-2 border-[#F4EFE9] dark:border-slate-700 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-xl bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-700 p-4">
                      <p className="text-xs font-black text-blue-700 dark:text-sky-300 uppercase">
                        Rata-Rata Kecepatan Dapur
                      </p>
                      <p className="text-2xl font-black text-[#1A1512] dark:text-white mt-1 owner-num">
                        {aiInsights.avgKdsMinutes} Menit / Pesanan
                      </p>
                      <p className="text-xs font-bold text-[#5C4B3E] dark:text-slate-300 mt-1">
                        Selisih waktu pesanan masuk hingga selesai di layar KDS.
                      </p>
                    </div>
                    <div className="rounded-xl bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-700 p-4">
                      <p className="text-xs font-black text-amber-800 dark:text-amber-300 uppercase">
                        Antrean Terlama Tercatat
                      </p>
                      <p className="text-2xl font-black text-[#1A1512] dark:text-white mt-1 owner-num">
                        {aiInsights.maxKdsMin > 0 ? `${aiInsights.maxKdsMin} Menit (Meja ${aiInsights.slowestTable})` : 'Normal (di bawah 15 Menit)'}
                      </p>
                      <p className="text-xs font-bold text-[#5C4B3E] dark:text-slate-300 mt-1">
                        Cabang: {aiInsights.slowestBranch || selectedBranchLabel}
                      </p>
                    </div>
                    <div className="rounded-xl bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-700 p-4">
                      <p className="text-xs font-black text-rose-700 dark:text-rose-300 uppercase">
                        Jam Sibuk Dapur (Bottleneck)
                      </p>
                      <p className="text-lg font-black text-[#1A1512] dark:text-white mt-1 owner-num">
                        {aiInsights.kdsPeakBottleneck
                          ? `${aiInsights.kdsPeakBottleneck.peakHourLabel} (${aiInsights.kdsPeakBottleneck.avgMinutes} mnt)`
                          : 'Belum Ada Bottleneck'}
                      </p>
                      <p className="text-xs font-bold text-[#5C4B3E] dark:text-slate-300 mt-1">
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
              <div className="owner-card bg-white dark:bg-slate-900 rounded-2xl p-6 border-2 border-[#E0D6CC] dark:border-slate-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
                  <div>
                    <h2 className="text-xl font-black text-[#1A1512] dark:text-white">
                      Daftar Menu Unggulan, Harga Coret & Paket Bundling Aktif
                    </h2>
                    <p className="text-xs font-bold text-[#5C4B3E] dark:text-slate-300 mt-0.5">
                      Seluruh menu di bawah ini sedang tampil menonjol di layar QR pelanggan.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveAiTab('advisor')}
                    className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-black self-start"
                  >
                    + Tambah Promo dari AI Advisor
                  </button>
                </div>

                {(aiInsights.activePromos || []).length === 0 ? (
                  <p className="text-xs font-bold text-[#5C4B3E] dark:text-slate-300 py-8 text-center">
                    Belum ada menu promo atau paket bundling yang aktif. Silakan kembali ke tab <strong>AI Business Advisor</strong> dan klik tombol eksekusi 1-klik.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {aiInsights.activePromos.map((m, idx) => (
                      <div
                        key={m.id}
                        className="rounded-xl bg-[#FAF6F2] dark:bg-slate-800 border-2 border-emerald-500/50 p-4 flex flex-wrap items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="px-2.5 py-1 rounded bg-emerald-600 text-white font-mono text-xs font-black">
                            #{idx + 1}
                          </span>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-black text-[#1A1512] dark:text-white truncate">{m.name}</p>
                              {m.promo_expires_at && (
                                <span className="px-2.5 py-0.5 rounded bg-amber-500 text-[#1A1512] text-xs font-black">
                                  Auto-stop:{' '}
                                  {new Date(m.promo_expires_at).toLocaleString('id-ID', {
                                    timeZone: 'Asia/Jakarta',
                                    day: '2-digit',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}{' '}
                                  WIB
                                </span>
                              )}
                            </div>
                            <p className="text-xs font-bold text-[#5C4B3E] dark:text-slate-300 mt-0.5">
                              {m.branch_name} · Kategori: {m.category} · Stok: {m.stock} pcs
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            {m.discount_price ? (
                              <>
                                <span className="block text-xs text-[#8C7A6B] dark:text-slate-400 line-through font-bold owner-num">
                                  {formatRp(m.price)}
                                </span>
                                <span className="text-sm font-black text-emerald-700 dark:text-emerald-400 owner-num">
                                  {formatRp(m.discount_price)}
                                </span>
                              </>
                            ) : (
                              <span className="text-sm font-black text-[#1A1512] dark:text-white owner-num">
                                {formatRp(m.price)}
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDisablePromo(m.id)}
                            className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black transition-colors"
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
          </main>
        </div>
      </div>

      {/* MODAL TAMBAH CABANG */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border-2 border-[#E0D6CC] dark:border-slate-700 w-full max-w-md rounded-2xl p-6 sm:p-8">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-xl font-black text-[#1A1512] dark:text-white">Tambah Cabang Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-[#5C4B3E] dark:text-slate-300" title="Tutup">
                <Icons.Close />
              </button>
            </div>
            <p className="text-xs font-bold text-[#5C4B3E] dark:text-slate-300 mb-6">Sistem akan membuat akun kasir baru dan menghubungkannya ke dashboard Anda.</p>

            {errorMsg && (
              <div className="mb-4 p-3 bg-rose-50 border-2 border-rose-300 text-rose-700 text-xs font-black rounded-xl">{errorMsg}</div>
            )}

            <form onSubmit={handleCreateBranch} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-[#1A1512] dark:text-slate-200 mb-1.5 uppercase">Nama Kafe / Resto</label>
                <input type="text" value={linkBranchName} onChange={(e) => setLinkBranchName(e.target.value)} required placeholder="Contoh: Kopi Senja Bandung" className="w-full bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 rounded-xl px-4 py-3 text-sm font-bold text-[#1A1512] dark:text-white focus:outline-none focus:border-[#2563EB]" />
              </div>
              <div>
                <label className="block text-xs font-black text-[#1A1512] dark:text-slate-200 mb-1.5 uppercase">Email Login Kasir Baru</label>
                <input type="email" value={linkBranchEmail} onChange={(e) => setLinkBranchEmail(e.target.value)} required placeholder="kasir.bandung@gmail.com" className="w-full bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 rounded-xl px-4 py-3 text-sm font-bold text-[#1A1512] dark:text-white focus:outline-none focus:border-[#2563EB]" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 text-[#1A1512] dark:text-slate-200 font-black py-3 rounded-xl text-xs">Batal</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-[#2563EB] hover:bg-blue-700 text-white font-black py-3 rounded-xl text-xs disabled:opacity-60">{isSubmitting ? 'Memproses...' : 'Buat Cabang'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-[200]">
          <div className={`flex items-center gap-3 px-5 py-3.5 rounded-xl border-2 shadow-lg bg-white dark:bg-slate-900 ${toast.type === 'success' ? 'border-emerald-500 text-emerald-800 dark:text-emerald-300' : 'border-rose-500 text-rose-800 dark:text-rose-300'}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'}`}>
              {toast.type === 'success' ? <Icons.Check /> : <Icons.Close />}
            </div>
            <p className="text-xs font-black pr-2">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}