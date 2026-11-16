'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import Chart from 'chart.js/auto';
import { supabase } from '@/lib/supabase';

const Icons = {
  Sun: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  Moon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  Activity: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  Power: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>,
  Edit: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Plus: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Logout: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Refresh: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
  Download: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Search: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  ArrowUp: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-2.5 h-2.5"><polyline points="18 15 12 9 6 15"/></svg>,
  ArrowDown: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-2.5 h-2.5"><polyline points="6 9 12 15 18 9"/></svg>,
  Alert: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Box: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  File: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  Users: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Coin: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><circle cx="12" cy="12" r="10"/><line x1="12" y1="6" x2="12" y2="18"/><path d="M15 9h-4a2 2 0 0 0 0 4h2a2 2 0 0 1 0 4H9"/></svg>,
  Settings: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Close: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Bot: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M12 2a4 4 0 0 1 4 4v2h2a2 2 0 0 1 2 2v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-8a2 2 0 0 1 2-2h2V6a4 4 0 0 1 4-4z"/><circle cx="9" cy="13" r="1"/><circle cx="15" cy="13" r="1"/></svg>,
  Shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  Tag: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  Bolt: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5"><polyline points="20 6 9 17 4 12"/></svg>,
};

const DONUT_COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#64748B'];

export default function OwnerDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModal, setEditModal] = useState({ open: false, branch: null });
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const donutRef = useRef(null);
  const donutInstance = useRef(null);

  const [isDarkMode, setIsDarkMode] = useState(true);
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
    trends: { revenue: null, expense: null, netProfit: null }
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
  const [editName, setEditName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [empSearch, setEmpSearch] = useState('');
  const [empBranchFilter, setEmpBranchFilter] = useState('all');

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [confirmModal, setConfirmModal] = useState({ open: false, title: '', message: '', isDanger: false, onConfirm: null, loading: false });

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
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
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
    try {
      const prevDateStr = getPrevPeriodStr(currentPeriod, currentDateStr);
      const branchQuery = branchId && branchId !== 'all' ? `&tenant_id=${encodeURIComponent(branchId)}` : '';
      const [tenantsRes, statsRes, actRes, prevRes] = await Promise.all([
        supabase.from('tenants').select('*').eq('manager_email', email).order('created_at', { ascending: false }),
        fetch(`/api/owner/stats?manager_email=${encodeURIComponent(email)}&period=${currentPeriod}&date_str=${currentDateStr}${branchQuery}`),
        fetch(`/api/owner/recent-activity?manager_email=${encodeURIComponent(email)}`),
        fetch(`/api/owner/stats?manager_email=${encodeURIComponent(email)}&period=${currentPeriod}&date_str=${prevDateStr}${branchQuery}`)
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
            supabase.from('employee_transactions').select('id, employee_id, tenant_id, type, amount, transaction_date').in('tenant_id', targetBranchIds).gte('transaction_date', range.start).lte('transaction_date', range.end)
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
          }
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
          await fetchAllData(email, period, getActiveDateStr(), selectedBranchId);
        }, 30000);
      }
    };

    getSessionAndFetch();
    return () => { if (interval) clearInterval(interval); };
  }, [period, dateDaily, dateWeekly, dateMonthly, selectedBranchId]);

  useEffect(() => {
    if (!chartRef.current || isLoading || activeAiTab !== 'advisor') return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }

    const ctx = chartRef.current.getContext('2d');
    let gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, isDarkMode ? 'rgba(59, 130, 246, 0.35)' : 'rgba(37, 99, 235, 0.25)');
    gradient.addColorStop(1, 'rgba(37, 99, 235, 0)');

    const datasets = [
      {
        label: 'Periode Ini (Juta Rp)',
        data: stats.chartData,
        borderColor: '#3B82F6',
        backgroundColor: gradient,
        borderWidth: 3,
        pointBackgroundColor: '#60A5FA',
        pointBorderColor: '#2563EB',
        pointBorderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        fill: true,
        tension: 0.35
      }
    ];

    if (Array.isArray(stats.prevChartData) && stats.prevChartData.length === stats.labels.length) {
      datasets.push({
        label: 'Periode Lalu (Juta Rp)',
        data: stats.prevChartData,
        borderColor: '#64748B',
        borderDash: [6, 5],
        borderWidth: 2,
        fill: false,
        tension: 0.35,
        pointRadius: 0
      });
    }

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: stats.labels,
        datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 0 },
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: isDarkMode ? 'rgba(148, 163, 184, 0.08)' : 'rgba(226, 232, 240, 0.5)', drawBorder: false }, ticks: { color: isDarkMode ? '#94A3B8' : '#64748B', font: { family: 'Inter', size: 11, weight: 'bold' } } },
          y: { grid: { color: isDarkMode ? 'rgba(148, 163, 184, 0.08)' : 'rgba(226, 232, 240, 0.5)', drawBorder: false }, ticks: { color: isDarkMode ? '#94A3B8' : '#64748B', font: { family: 'Inter', size: 11, weight: 'bold' }, callback: function(value) { return 'Rp ' + value + 'jt'; } } }
        }
      }
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
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        animation: { duration: 0 },
        plugins: { legend: { display: false } }
      }
    });

    return () => {
      if (donutInstance.current) {
        donutInstance.current.destroy();
        donutInstance.current = null;
      }
    };
  }, [expenseCategories, isLoading, activeAiTab]);

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };

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
          manager_email: userEmail
        })
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

  const handleAskAiAdvisor = async (e) => {
    e.preventDefault();
    const q = aiPromptInput.trim();
    if (!q || isAskingAi) return;
    setIsAskingAi(true);
    try {
      const compactContext = {
        cabangAktif: selectedBranchLabel,
        periode: `${period} (${getActiveDateStr()})`,
        totalRevenue: stats.totalRevenue,
        totalExpense: stats.totalExpense,
        netProfit: stats.netProfit,
        totalTransactions: stats.totalTransactions,
        avgBasket: aiInsights.avgBasket,
        repeatRatePct: aiInsights.repeatRate,
        avgKdsMinutes: aiInsights.avgKdsMinutes,
        topMenus: topMenus.slice(0, 5),
        lowStockCount: lowStockMenus.length,
        fraudAlertCount: aiInsights.fraudAlerts?.length || 0,
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

  const selectedBranchObj = useMemo(
    () => branches.find(b => b.id === selectedBranchId) || null,
    [branches, selectedBranchId]
  );
  const selectedBranchLabel = selectedBranchObj ? selectedBranchObj.name : `Semua Cabang (${branches.length} Outlet)`;

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
    <div className="bg-[#F8FAFC] text-slate-800 dark:bg-[#060911] dark:text-slate-100 min-h-screen overflow-hidden font-sans transition-colors duration-300">
      <style>{`
        .owner-3d { box-shadow: 0 1px 2px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.04), 0 8px 20px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.7); }
        .dark .owner-3d { background: linear-gradient(180deg, rgba(16, 24, 41, 0.92) 0%, rgba(10, 16, 30, 0.96) 100%); border-color: rgba(148, 163, 184, 0.14); box-shadow: 0 18px 40px -15px rgba(0, 0, 0, 0.65), inset 0 1px 0 0 rgba(255, 255, 255, 0.06); }
        .owner-3d-hover { transition: transform 220ms cubic-bezier(.2,.8,.2,1), box-shadow 220ms ease; }
        .owner-3d-hover:hover { transform: translateY(-2px); }
        .owner-pill { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; letter-spacing: 0.02em; }
        .owner-num { font-variant-numeric: tabular-nums; letter-spacing: -0.02em; }
        .owner-row { transition: background-color 150ms ease; }
        .owner-row:hover { background-color: rgba(17, 28, 51, 0.04); }
        .dark .owner-row:hover { background-color: rgba(17, 28, 51, 0.55); }
        .btn-sapphire { background: linear-gradient(135deg, #1E4E8C 0%, #2563EB 60%, #1D4ED8 100%); box-shadow: 0 10px 25px -8px rgba(37, 99, 235, 0.55), inset 0 1px 0 0 rgba(255, 255, 255, 0.2); }
        .btn-sapphire:hover { background: linear-gradient(135deg, #2563EB 0%, #3B82F6 60%, #1E4E8C 100%); }
        .btn-copper { background: linear-gradient(135deg, #D97736 0%, #EA580C 60%, #C2410C 100%); box-shadow: 0 10px 25px -8px rgba(234, 88, 12, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.2); }
        .text-gradient-nf { background: linear-gradient(135deg, #60A5FA 0%, #93C5FD 40%, #F59E0B 80%, #EA8B42 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
      `}</style>
      <div className="fixed top-[-140px] left-[15%] w-[520px] h-[520px] rounded-full bg-[#2563EB]/12 blur-[140px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-120px] right-[5%] w-[420px] h-[420px] rounded-full bg-[#D97736]/10 blur-[140px] pointer-events-none z-0"></div>

      <div className="flex h-screen relative z-10">
        <aside className="group w-[80px] hover:w-64 transition-all duration-300 ease-in-out bg-white/80 dark:bg-[#070B14]/95 backdrop-blur-2xl border-r border-slate-200 dark:border-slate-800/80 flex flex-col z-50 h-full shrink-0">
          <div className="h-20 flex items-center px-6 border-b border-slate-200 dark:border-slate-800/80 overflow-hidden shrink-0">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-lg overflow-hidden p-1">
              <img src="/logo-nexaflow-3d.png" alt="NexaFlow Logo" className="w-full h-full object-contain drop-shadow-md" />
            </div>
            <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              <div className="flex items-center gap-1">
                <span className="text-lg font-black tracking-tight font-display text-slate-900 dark:text-white">NEXA<span className="text-sky-400">FLOW</span></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#EA8B42]"></span>
              </div>
              <p className="text-[9px] font-bold text-[#EA8B42] tracking-[0.18em] uppercase">OWNER EXECUTIVE</p>
            </div>
          </div>
          <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto overflow-x-hidden">
            <Link href="/owner" className="flex items-center gap-3 px-3 py-3 btn-sapphire text-white rounded-xl font-bold transition-all whitespace-nowrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5 shrink-0 text-[#FBBF24]"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">Command Center AI</span>
            </Link>
            <Link href="/owner/finance" className="flex items-center gap-3 px-3 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#111C33] hover:text-slate-900 dark:hover:text-white rounded-xl font-bold transition-all whitespace-nowrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5 shrink-0"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">Keuangan</span>
            </Link>
            <Link href="/owner/reports" className="flex items-center gap-3 px-3 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#111C33] hover:text-slate-900 dark:hover:text-white rounded-xl font-bold transition-all whitespace-nowrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5 shrink-0"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">Laporan Global</span>
            </Link>
            <Link href="/owner/settings" className="flex items-center gap-3 px-3 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#111C33] hover:text-slate-900 dark:hover:text-white rounded-xl font-bold transition-all whitespace-nowrap">
              <Icons.Settings />
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">Pengaturan & AI Key</span>
            </Link>
          </nav>
          <div className="p-4 border-t border-slate-200 dark:border-slate-800/80">
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20 rounded-xl font-bold transition-all whitespace-nowrap">
              <Icons.Logout /> <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">Logout</span>
            </button>
          </div>
        </aside>

        <main className="flex-1 flex flex-col h-full overflow-hidden relative">
          <header className="min-h-20 py-3 bg-white/70 dark:bg-[#070B14]/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 px-6 lg:px-10 z-40 transition-colors">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <p className="text-[11px] font-bold uppercase tracking-widest text-sky-500 dark:text-sky-400">
                  Riset Otomatis Periode Aktif · {getActiveDateStr()}
                </p>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight mt-0.5">
                Command Center & <span className="text-gradient-nf">AI Business Advisor</span>
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2 md:gap-2.5">
              <select
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(e.target.value)}
                aria-label="Filter Cabang"
                className="bg-slate-100 dark:bg-[#0E1628] border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 dark:text-white outline-none max-w-[210px]"
              >
                <option value="all">Semua Cabang ({branches.length} Outlet)</option>
                {branches.map((b, idx) => (
                  <option key={b.id} value={b.id}>Cabang {idx + 1} · {b.name}</option>
                ))}
              </select>

              <div className="flex items-center gap-2">
                {period === 'daily' && (
                  <input type="date" value={dateDaily} onChange={(e) => handleDateChange(e, 'daily')} className="bg-slate-100 dark:bg-[#0E1628] border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none" />
                )}
                {period === 'weekly' && (
                  <input type="week" value={dateWeekly} onChange={(e) => handleDateChange(e, 'weekly')} className="bg-slate-100 dark:bg-[#0E1628] border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none" />
                )}
                {period === 'monthly' && (
                  <input type="month" value={dateMonthly} onChange={(e) => handleDateChange(e, 'monthly')} className="bg-slate-100 dark:bg-[#0E1628] border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none" />
                )}
                <div className="hidden md:flex bg-slate-100 dark:bg-[#0E1628] rounded-xl p-1 border border-slate-200 dark:border-slate-700">
                  <button onClick={() => handlePeriodChange('daily')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${period === 'daily' ? 'bg-white dark:bg-[#1E293B] text-[#2563EB] dark:text-white shadow-sm' : 'text-slate-500'}`}>Harian</button>
                  <button onClick={() => handlePeriodChange('weekly')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${period === 'weekly' ? 'bg-white dark:bg-[#1E293B] text-[#2563EB] dark:text-white shadow-sm' : 'text-slate-500'}`}>Mingguan</button>
                  <button onClick={() => handlePeriodChange('monthly')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${period === 'monthly' ? 'bg-white dark:bg-[#1E293B] text-[#2563EB] dark:text-white shadow-sm' : 'text-slate-500'}`}>Bulanan</button>
                </div>
              </div>

              <button onClick={handleRefresh} title="Refresh Riset AI" className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-sky-500/40 text-slate-700 dark:text-sky-300 hover:bg-sky-500/10 text-xs font-bold transition-all">
                <Icons.Refresh />
                <span className="hidden xl:inline">Refresh Riset AI</span>
              </button>

              <button onClick={handleExportCSV} title="Export Ringkasan P&L (CSV)" className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-[#0F172A] text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-[#111C33] transition-colors border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-1.5 text-xs font-bold">
                <Icons.Download />
                <span className="hidden sm:inline">CSV</span>
              </button>

              <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-xl bg-slate-100 dark:bg-[#0F172A] text-slate-600 dark:text-amber-400 hover:bg-slate-200 transition-colors border border-slate-200 dark:border-slate-800 shadow-sm">
                {isDarkMode ? <Icons.Sun /> : <Icons.Moon />}
              </button>

              <button onClick={() => setIsModalOpen(true)} className="btn-sapphire text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all">
                <Icons.Plus />
                <span className="hidden sm:inline">Tambah Cabang</span>
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 z-10 scroll-smooth space-y-6">

            {/* SUB-NAVIGATION TABS (AI BUSINESS ADVISOR / AUDIT FRAUD / MENU & PROMO AKTIF) */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <button
                  type="button"
                  onClick={() => setActiveAiTab('advisor')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    activeAiTab === 'advisor'
                      ? 'btn-sapphire text-white'
                      : 'bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span className="text-[#FBBF24]"><Icons.Bot /></span>
                  <span>AI Business Advisor</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveAiTab('audit')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    activeAiTab === 'audit'
                      ? 'btn-sapphire text-white'
                      : 'bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span className="text-rose-400"><Icons.Shield /></span>
                  <span>Audit Fraud & Kasir</span>
                  <span className="ml-1 px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px] font-black">
                    {aiInsights.fraudAlerts?.length || 0}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveAiTab('promo')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    activeAiTab === 'promo'
                      ? 'btn-sapphire text-white'
                      : 'bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span className="text-[#EA8B42]"><Icons.Tag /></span>
                  <span>Menu & Promo Aktif</span>
                  <span className="ml-1 px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-black">
                    {aiInsights.activePromos?.length || 0}
                  </span>
                </button>
              </div>

              <Link
                href="/owner/settings"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#0D1526] border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:border-sky-500/40"
              >
                <span className={`w-2 h-2 rounded-full ${aiConfig.apiKey ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                <span>Mesin AI: {aiConfig.provider.toUpperCase()} ({aiConfig.model})</span>
              </Link>
            </div>

            {/* ALERT BAR (Invoice SaaS, Gaji, & Stok) */}
            {(unpaidInvoices.length > 0 || unpaidEmployees.length > 0 || lowStockMenus.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {unpaidInvoices.length > 0 && (
                  <div className="bg-blue-500/5 border border-blue-500/30 rounded-2xl p-4 flex items-start gap-3 hover:bg-blue-500/10 transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0 text-blue-500">
                      <Icons.File />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-blue-600 dark:text-blue-300">Tagihan Langganan NexaFlow</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {unpaidInvoices.length} invoice belum dibayar · Total <span className="font-bold text-slate-700 dark:text-slate-200 owner-num">{formatRp(totalUnpaidInvoiceAmount)}</span>
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 truncate">
                        {unpaidInvoices.slice(0, 2).map(inv => `${inv.branch_name} (${inv.period})`).join(', ')}
                      </p>
                    </div>
                  </div>
                )}

                {unpaidEmployees.length > 0 && (
                  <div className="bg-rose-500/5 border border-rose-500/30 rounded-2xl p-4 flex items-start gap-3 hover:bg-rose-500/10 transition-colors cursor-pointer">
                    <div className="w-9 h-9 rounded-lg bg-rose-500/20 flex items-center justify-center shrink-0 text-rose-500">
                      <Icons.Alert />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-rose-600 dark:text-rose-300">Peringatan Gaji Karyawan</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{unpaidEmployees.length} karyawan belum menerima gaji bulan ini. Segera proses!</p>
                      <Link href="/owner/finance" className="text-[10px] font-bold text-rose-600 dark:text-rose-400 mt-1.5 inline-block">Proses Gaji →</Link>
                    </div>
                  </div>
                )}

                {lowStockMenus.length > 0 && (
                  <div className="bg-amber-500/5 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3 hover:bg-amber-500/10 transition-colors cursor-pointer">
                    <div className="w-9 h-9 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0 text-amber-500">
                      <Icons.Box />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-amber-600 dark:text-amber-300">Stok Menipis</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{lowStockMenus.length} menu di bawah 10 pcs</p>
                      <Link href="/owner/finance" className="text-[10px] font-bold text-amber-600 dark:text-amber-400 mt-1.5 inline-block">Kelola Stok →</Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4 KPI UTAMA + 3 METRIK AI OPERASIONAL */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="owner-3d owner-3d-hover bg-white dark:bg-[#0A0F1C] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-5">
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Omzet Periode Ini</p>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white owner-num mt-1.5 font-display">
                  {isLoading ? '...' : formatRp(stats.totalRevenue)}
                </h3>
                <div className="mt-2 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-sky-500/15 border border-sky-500/30 text-sky-500 dark:text-sky-300 text-[10px] font-extrabold">
                    {stats.totalTransactions} transaksi selesai
                  </span>
                </div>
              </div>

              <div className="owner-3d owner-3d-hover bg-white dark:bg-[#0A0F1C] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-5">
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Rata-Rata / Struk (Basket)</p>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white owner-num mt-1.5 font-display">
                  {isLoading ? '...' : formatRp(aiInsights.avgBasket)}
                </h3>
                <div className="mt-2 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-500 dark:text-amber-300 text-[10px] font-extrabold">
                    Repeat Order (device_id): {aiInsights.repeatRate}%
                  </span>
                </div>
              </div>

              <div className="owner-3d owner-3d-hover bg-white dark:bg-[#0A0F1C] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-5">
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Laba Bersih (P&L)</p>
                <h3 className={`text-xl sm:text-2xl font-black owner-num mt-1.5 font-display ${stats.netProfit >= 0 ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500'}`}>
                  {isLoading ? '...' : formatRp(stats.netProfit)}
                </h3>
                <div className="mt-2 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-rose-500/15 border border-rose-500/30 text-rose-500 dark:text-rose-300 text-[10px] font-extrabold">
                    Pengeluaran: {formatRp(stats.totalExpense)}
                  </span>
                </div>
              </div>

              <div className="owner-3d owner-3d-hover bg-white dark:bg-[#0A0F1C] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-5">
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Kecepatan Dapur (KDS)</p>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white owner-num mt-1.5 font-display">
                  {isLoading ? '...' : `${aiInsights.avgKdsMinutes} Menit`}
                </h3>
                <div className="mt-2 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-[10px] font-extrabold">
                    Staf Aktif: {employees.filter(e => e.is_active).length}/{employees.length}
                  </span>
                </div>
              </div>
            </div>

            {/* ===================================================================== */}
            {/* TAB 1: AI BUSINESS ADVISOR + EXECUTIVE OVERVIEW */}
            {/* ===================================================================== */}
            {activeAiTab === 'advisor' && (
              <>
                <div className="grid lg:grid-cols-12 gap-6 items-start">
                  {/* KIRI 7 KOLOM: GRAFIK PERBANDINGAN + HASIL RISET MENDALAM AI */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="owner-3d bg-white dark:bg-[#0A0F1C] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-5 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
                        <div>
                          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-display">
                            Perbandingan Omzet: Periode Ini vs Periode Lalu
                          </h2>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Performa pendapatan (dalam Juta Rupiah) · {selectedBranchLabel}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] font-bold">
                          <span className="inline-flex items-center gap-1.5 text-sky-500 dark:text-sky-300">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]"></span>Periode Ini
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-slate-400">
                            <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>Periode Lalu
                          </span>
                        </div>
                      </div>
                      <div className="relative h-64 sm:h-72">
                        <canvas ref={chartRef}></canvas>
                      </div>
                    </div>

                    {/* 3 TEMUAN RISET MENDALAM AI */}
                    <div className="owner-3d bg-white dark:bg-[#0A0F1C] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-5 sm:p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-sky-500/15 border border-sky-400/30 flex items-center justify-center text-sky-400">
                            <Icons.Search />
                          </div>
                          <div>
                            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white font-display">
                              Hasil Riset Mendalam AI (Diagnostik Operasional)
                            </h3>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              Dihitung otomatis dari tabel <span className="font-mono text-sky-500 dark:text-sky-300">orders</span>, <span className="font-mono text-sky-500 dark:text-sky-300">menus</span>, dan <span className="font-mono text-sky-500 dark:text-sky-300">device_id</span>
                            </p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-[10px] font-bold">
                          Data Terverifikasi
                        </span>
                      </div>

                      <div className="space-y-3">
                        {(aiInsights.diagnostics || []).map((diag) => {
                          const badgeCls =
                            diag.badgeColor === 'rose'
                              ? 'bg-rose-500/20 text-rose-500 dark:text-rose-300'
                              : diag.badgeColor === 'amber'
                              ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300'
                              : 'bg-sky-500/20 text-sky-600 dark:text-sky-300';
                          return (
                            <div
                              key={diag.code}
                              className="rounded-xl bg-slate-50 dark:bg-[#0B1221] border border-slate-200 dark:border-slate-800 p-3.5 flex items-start gap-3"
                            >
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black font-mono shrink-0 mt-0.5 ${badgeCls}`}>
                                {diag.code}
                              </span>
                              <div>
                                <p className="text-xs font-bold text-slate-900 dark:text-white">{diag.title}</p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                                  {diag.description}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* KANAN 5 KOLOM: RENCANA AKSI 1-KLIK + TANYA AI ADVISOR */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="owner-3d bg-white dark:bg-[#0A0F1C] rounded-2xl p-5 sm:p-6 border border-sky-500/30">
                      <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl btn-sapphire flex items-center justify-center text-white shrink-0">
                            <span className="text-[#FBBF24]"><Icons.Bot /></span>
                          </div>
                          <div>
                            <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white font-display">
                              Rencana Aksi AI (Action Plan)
                            </h2>
                            <p className="text-[11px] text-sky-600 dark:text-sky-300 font-semibold">
                              Eksekusi langsung ke database menu & QR pelanggan
                            </p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-[#EA8B42]/20 text-[#EA8B42] dark:text-[#FBBF24] text-[10px] font-extrabold">
                          {(aiInsights.actionPlans || []).length} Aksi Siap
                        </span>
                      </div>

                      <div className="mt-4 space-y-3.5">
                        {(aiInsights.actionPlans || []).map((act, idx) => {
                          const isDone = Boolean(executedActionIds[act.id]);
                          const isBusy = executingActionId === act.id;
                          const badgeThemeCls =
                            act.badgeTheme === 'amber'
                              ? 'bg-amber-500/15 text-amber-600 dark:text-[#FBBF24]'
                              : act.badgeTheme === 'sky'
                              ? 'bg-sky-500/15 text-sky-600 dark:text-sky-300'
                              : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300';

                          return (
                            <div
                              key={act.id}
                              className={`rounded-xl bg-slate-50 dark:bg-[#0B1221] border p-4 space-y-3 ${
                                isDone ? 'border-emerald-500/40' : 'border-slate-200 dark:border-slate-800'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider mb-1 ${badgeThemeCls}`}>
                                    {act.badge}
                                  </span>
                                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                                    {act.title}
                                  </h4>
                                </div>
                                <span className="text-right shrink-0">
                                  {act.action_type === 'promo_discount' && (
                                    <>
                                      <span className="block text-[10px] text-slate-400 line-through owner-num">
                                        {formatRp(act.original_price)}
                                      </span>
                                      <span className="text-xs font-black text-emerald-500 dark:text-emerald-400 owner-num">
                                        {formatRp(act.discount_price)}
                                      </span>
                                    </>
                                  )}
                                  {act.action_type === 'restock_menu' && (
                                    <span className="text-xs font-black text-sky-500 dark:text-sky-300 owner-num">
                                      {act.current_stock} → {act.new_stock} Porsi
                                    </span>
                                  )}
                                  {act.action_type === 'create_bundle' && (
                                    <span className="text-xs font-black text-emerald-500 dark:text-emerald-400 owner-num">
                                      {formatRp(act.bundle_price)}
                                    </span>
                                  )}
                                </span>
                              </div>

                              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                {act.description}
                              </p>

                              <button
                                type="button"
                                disabled={isDone || isBusy}
                                onClick={() => handleExecuteAiAction(act)}
                                className={`w-full py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                                  isDone
                                    ? 'bg-emerald-600/20 border border-emerald-500/40 text-emerald-500 dark:text-emerald-300 cursor-default'
                                    : idx === 0
                                    ? 'btn-copper text-white'
                                    : 'btn-sapphire text-white'
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
                      <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                            Tanya AI Advisor tentang performa cabang Anda:
                          </p>
                          <Link href="/owner/settings" className="text-[10px] font-bold text-sky-500 hover:text-sky-400">
                            Atur API Key →
                          </Link>
                        </div>

                        {aiChatReply && (
                          <div className="mb-3 rounded-xl bg-sky-500/10 border border-sky-400/30 p-3 text-[11px] text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                            <strong className="text-sky-600 dark:text-sky-300 block mb-1">
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
                            placeholder="Contoh: Cabang mana yang paling butuh promo?"
                            className="flex-1 bg-slate-50 dark:bg-[#0B1221] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sky-400"
                          />
                          <button
                            type="submit"
                            disabled={isAskingAi}
                            className="px-4 py-2.5 rounded-xl btn-sapphire text-white text-xs font-bold shrink-0 disabled:opacity-50"
                          >
                            {isAskingAi ? '...' : 'Tanya'}
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION BAWAH: PENGELUARAN, BIAYA KARYAWAN, MENU TERLARIS, STOK, AKTIVITAS, DAFTAR CABANG */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="owner-3d bg-white dark:bg-[#0A0F1C] border border-slate-200 dark:border-slate-800/60 rounded-3xl p-6 flex flex-col">
                    <h2 className="text-lg font-black text-slate-900 dark:text-white font-display mb-1">Pengeluaran</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Per kategori periode aktif</p>
                    {Object.keys(expenseCategories).length === 0 ? (
                      <div className="flex-1 flex items-center justify-center py-8">
                        <p className="text-xs text-slate-500 text-center">Belum ada pengeluaran tercatat.</p>
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
                                <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }}></span>
                                <span className="font-bold text-slate-700 dark:text-slate-300 truncate">{cat}</span>
                              </div>
                              <span className="font-black text-slate-900 dark:text-white owner-num shrink-0 ml-2">{formatRp(amt)}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="owner-3d bg-white dark:bg-[#0A0F1C] border border-slate-200 dark:border-slate-800/60 rounded-3xl p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-1">
                      <h2 className="text-lg font-black text-slate-900 dark:text-white font-display">Biaya Karyawan</h2>
                      <Link href="/owner/finance" className="text-[10px] font-bold text-sky-500 hover:text-sky-400">Kelola →</Link>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">Periode aktif · {selectedBranchLabel}</p>

                    <div className="space-y-3">
                      <div className="bg-slate-50 dark:bg-[#04060B] border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-500">
                            <Icons.Coin />
                          </div>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Gaji</span>
                        </div>
                        <span className="text-xs font-black text-slate-900 dark:text-white owner-num">{formatRp(employeeTransactions.filter(t => t.type === 'Gaji').reduce((s, t) => s + Number(t.amount), 0))}</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-[#04060B] border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                          </div>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Kasbon</span>
                        </div>
                        <span className="text-xs font-black text-slate-900 dark:text-white owner-num">{formatRp(employeeTransactions.filter(t => t.type === 'Kasbon').reduce((s, t) => s + Number(t.amount), 0))}</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-[#04060B] border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <Icons.Check />
                          </div>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Bonus</span>
                        </div>
                        <span className="text-xs font-black text-slate-900 dark:text-white owner-num">{formatRp(employeeTransactions.filter(t => t.type === 'Bonus').reduce((s, t) => s + Number(t.amount), 0))}</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total</span>
                      <span className="text-sm font-black text-rose-500 owner-num">{formatRp(employeeTransactions.reduce((s, t) => s + Number(t.amount), 0))}</span>
                    </div>
                  </div>

                  <div className="owner-3d bg-white dark:bg-[#0A0F1C] border border-slate-200 dark:border-slate-800/60 rounded-3xl p-6">
                    <h2 className="text-lg font-black text-slate-900 dark:text-white font-display mb-4">Aktivitas Terbaru</h2>
                    <div className="max-h-[250px] overflow-y-auto pr-2 space-y-3.5">
                      {filteredActivities.length === 0 ? (
                        <p className="text-xs text-slate-500 text-center mt-10">Belum ada aktivitas.</p>
                      ) : filteredActivities.map((act, i) => (
                        <div key={i} className="flex gap-3 items-start">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                            <Icons.Activity />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">Pesanan Masuk</p>
                              <p className="text-[10px] font-bold text-slate-400 shrink-0">{timeAgo(act.created_at)}</p>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                              {act.tenants?.name || 'Cabang'} • <span className="owner-num">{formatRp(act.total_price)}</span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* TOP MENU + STOK MENIPIS */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="owner-3d bg-white dark:bg-[#0A0F1C] border border-slate-200 dark:border-slate-800/60 rounded-3xl p-6">
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <h2 className="text-lg font-black text-slate-900 dark:text-white font-display">Menu Terlaris</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Top 5 periode aktif</p>
                      </div>
                    </div>
                    {topMenus.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-8">Belum ada data penjualan.</p>
                    ) : (
                      <div className="space-y-4">
                        {topMenus.map((m, i) => {
                          const maxQty = topMenus[0]?.qty || 1;
                          const pct = (m.qty / maxQty) * 100;
                          return (
                            <div key={m.name + i}>
                              <div className="flex items-center justify-between mb-1.5 gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="text-[10px] font-black text-sky-500 dark:text-sky-400 w-5 shrink-0">#{i + 1}</span>
                                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{m.name}</span>
                                </div>
                                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 shrink-0 owner-num">{m.qty} pcs · {formatRp(m.revenue)}</span>
                              </div>
                              <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-[#1E4E8C] to-[#2563EB]" style={{ width: `${pct}%` }}></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="owner-3d bg-white dark:bg-[#0A0F1C] border border-slate-200 dark:border-slate-800/60 rounded-3xl p-6">
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <h2 className="text-lg font-black text-slate-900 dark:text-white font-display">Stok Menipis</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Menu dengan stok ≤ 10 pcs</p>
                      </div>
                      <Link href="/owner/finance" className="text-[10px] font-bold text-sky-500 hover:text-sky-400">Kelola →</Link>
                    </div>
                    {lowStockMenus.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-2">
                          <Icons.Check />
                        </div>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Semua stok aman</p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                        {lowStockMenus.slice(0, 8).map((m) => (
                          <div key={m.id} className="flex items-center justify-between bg-slate-50 dark:bg-[#04060B] border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2">
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{m.name}</p>
                              <p className="text-[10px] text-slate-500">{m.branch_name || m.tenant_id}</p>
                            </div>
                            <span className={`owner-pill shrink-0 ${Number(m.stock) <= 3 ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                              {m.stock} pcs
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* DAFTAR CABANG */}
                <div id="daftar-cabang" className="owner-3d bg-white dark:bg-[#0A0F1C] border border-slate-200 dark:border-slate-800/60 rounded-3xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-200 dark:border-slate-800/60 flex justify-between items-center bg-slate-50/50 dark:bg-[#0A0F1C]">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white font-display">Daftar Cabang Anda</h3>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{branches.length} cabang</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800/80 text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-[#060911]/50">
                          <th className="p-4 pl-6 font-black">Nama Cabang</th>
                          <th className="p-4 font-black">Status</th>
                          <th className="p-4 font-black">Pendapatan</th>
                          <th className="p-4 font-black">Transaksi</th>
                          <th className="p-4 font-black text-center">Karyawan</th>
                          <th className="p-4 font-black text-right pr-6">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {isLoading ? (
                          <tr><td colSpan="6" className="p-6 text-center text-slate-500 font-bold">Memuat data...</td></tr>
                        ) : branches.length === 0 ? (
                          <tr><td colSpan="6" className="p-6 text-center text-slate-500 font-bold">Belum ada cabang. Silakan tambahkan cabang baru.</td></tr>
                        ) : branches.map((branch) => {
                          const bStat = stats.branchStats[branch.id] || { revenue: 0, transactions: 0, employeeCount: 0 };
                          const isSelected = selectedBranchId === branch.id;
                          return (
                            <tr key={branch.id} className={`owner-row group ${isSelected ? 'bg-blue-50/60 dark:bg-[#111C33]/70' : ''}`}>
                              <td className="p-4 pl-6">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 font-black text-xs">
                                    {branch.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{branch.name}</p>
                                    <p className="text-[10px] text-slate-500">ID: {branch.id.split('-')[0]}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <span className={`owner-pill ${branch.is_active ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20'}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${branch.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                                  {branch.is_active ? 'Aktif' : 'Suspend'}
                                </span>
                              </td>
                              <td className="p-4">
                                <p className="font-black text-sm text-slate-900 dark:text-white owner-num">{formatRp(bStat.revenue)}</p>
                              </td>
                              <td className="p-4">
                                <p className="font-bold text-sm text-slate-600 dark:text-slate-300 owner-num">{bStat.transactions}</p>
                              </td>
                              <td className="p-4 text-center">
                                <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">
                                  {bStat.employeeCount} Orang
                                </span>
                              </td>
                              <td className="p-4 pr-6 text-right">
                                <div className="flex justify-end gap-2">
                                  <button onClick={() => window.location.href = `/dashboard?tenant_id=${branch.id}`} className="bg-slate-100 dark:bg-[#111C33] hover:bg-[#2563EB] text-slate-700 dark:text-slate-300 hover:text-white px-3 py-2 rounded-lg text-xs font-bold transition-all border border-slate-200 dark:border-slate-700">
                                    Buka Kasir
                                  </button>
                                </div>
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

            {/* ===================================================================== */}
            {/* TAB 2: AUDIT FRAUD & KASIR + KECEPATAN DAPUR (KDS) */}
            {/* ===================================================================== */}
            {activeAiTab === 'audit' && (
              <div className="space-y-6">
                <div className="owner-3d bg-white dark:bg-[#0A0F1C] rounded-2xl p-6 border border-rose-500/30">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                    <div>
                      <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-500 dark:text-rose-300 text-[10px] font-black uppercase tracking-wider">
                        AI Fraud & Void Watchdog
                      </span>
                      <h2 className="text-xl font-black text-slate-900 dark:text-white mt-2 font-display">
                        Deteksi Anomali Pembatalan Kasir & Kecepatan Dapur
                      </h2>
                    </div>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      Dipantau otomatis dari <span className="font-mono text-sky-500 dark:text-sky-300">orders.status</span> & <span className="font-mono text-sky-500 dark:text-sky-300">updated_at</span>
                    </span>
                  </div>

                  {(aiInsights.fraudAlerts || []).length === 0 ? (
                    <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-5 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <Icons.Check />
                      </div>
                      <div>
                        <p className="text-sm font-black text-emerald-600 dark:text-emerald-300">Tidak Ditemukan Pembatalan Mencurigakan</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Tidak ada transaksi berstatus CANCELLED dalam 30 hari terakhir pada cabang terpilih.
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
                            className="rounded-xl bg-rose-500/5 dark:bg-[#0B1221] border border-rose-500/40 p-4 space-y-2"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <p className="text-sm font-black text-rose-600 dark:text-rose-300">
                                Peringatan Audit: {alert.branch_name}
                              </p>
                              <span className="text-xs font-mono text-rose-500 dark:text-rose-400">
                                Rentang Jam: {minHour} – {maxHour} WIB
                              </span>
                            </div>
                            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                              Ditemukan <strong>{alert.count} pesanan dibatalkan ({alert.cashCount} di antaranya metode Tunai/Cash)</strong> dengan total nilai{' '}
                              <strong className="text-rose-500 dark:text-rose-300 owner-num">{formatRp(alert.totalAmount)}</strong>. Disarankan meninjau rekaman CCTV kasir pada jam tersebut untuk memastikan tidak ada pembayaran tunai yang dibatalkan sepihak.
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* KDS SPEED MONITOR */}
                  <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-xl bg-slate-50 dark:bg-[#0B1221] border border-slate-200 dark:border-slate-800 p-4">
                      <p className="text-xs font-black text-sky-500 dark:text-sky-300 uppercase tracking-wider">
                        Rata-Rata Kecepatan Penyajian Dapur (KDS)
                      </p>
                      <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-display owner-num">
                        {aiInsights.avgKdsMinutes} Menit / Pesanan
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        Dihitung dari selisih waktu pesanan masuk hingga selesai dimasak di layar KDS.
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-50 dark:bg-[#0B1221] border border-slate-200 dark:border-slate-800 p-4">
                      <p className="text-xs font-black text-amber-500 dark:text-amber-300 uppercase tracking-wider">
                        Antrean Terlama Tercatat
                      </p>
                      <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-display owner-num">
                        {aiInsights.maxKdsMin > 0 ? `${aiInsights.maxKdsMin} Menit (Meja ${aiInsights.slowestTable})` : 'Normal (< 15 Menit)'}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        Cabang: {aiInsights.slowestBranch || selectedBranchLabel}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ===================================================================== */}
            {/* TAB 3: MENU & PROMO AKTIF */}
            {/* ===================================================================== */}
            {activeAiTab === 'promo' && (
              <div className="owner-3d bg-white dark:bg-[#0A0F1C] rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white font-display">
                      Daftar Menu Unggulan, Harga Coret & Paket Bundling Aktif
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Seluruh menu di bawah ini sedang tampil menonjol di layar QR pelanggan.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveAiTab('advisor')}
                    className="px-3.5 py-2 rounded-xl btn-sapphire text-white text-xs font-bold self-start"
                  >
                    + Tambah Promo dari AI Advisor
                  </button>
                </div>

                {(aiInsights.activePromos || []).length === 0 ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400 py-8 text-center">
                    Belum ada menu promo atau paket bundling yang aktif. Silakan kembali ke tab <strong>AI Business Advisor</strong> dan klik tombol eksekusi 1-klik.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {aiInsights.activePromos.map((m, idx) => (
                      <div
                        key={m.id}
                        className="rounded-xl bg-slate-50 dark:bg-[#0B1221] border border-emerald-500/30 p-4 flex flex-wrap items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-mono text-xs font-bold">
                            #{idx + 1}
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-black text-slate-900 dark:text-white truncate">{m.name}</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              {m.branch_name} · Kategori: {m.category} · Stok: {m.stock} pcs
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            {m.discount_price ? (
                              <>
                                <span className="block text-[10px] text-slate-400 line-through owner-num">
                                  {formatRp(m.price)}
                                </span>
                                <span className="text-sm font-black text-emerald-500 dark:text-emerald-400 owner-num">
                                  {formatRp(m.discount_price)}
                                </span>
                              </>
                            ) : (
                              <span className="text-sm font-black text-slate-900 dark:text-white owner-num">
                                {formatRp(m.price)}
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDisablePromo(m.id)}
                            className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-500 dark:text-rose-300 text-[11px] font-bold transition-colors"
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
        </main>
      </div>

      {/* MODAL TAMBAH CABANG */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="owner-3d bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-3xl p-8 relative overflow-hidden">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white font-display relative z-10">Tambah Cabang Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="owner-icon-btn" title="Tutup">
                <Icons.Close />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-6 relative z-10">Sistem akan membuat akun kasir baru dan menghubungkannya ke dashboard Anda.</p>

            {errorMsg && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold rounded-xl relative z-10">{errorMsg}</div>
            )}

            <form onSubmit={handleCreateBranch} className="space-y-5 relative z-10">
              <div>
                <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Nama Kafe / Resto</label>
                <input type="text" value={linkBranchName} onChange={(e) => setLinkBranchName(e.target.value)} required placeholder="Contoh: Kopi Senja Bandung" className="w-full bg-slate-50 dark:bg-[#04060B] border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB]" />
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Email Login Kasir Baru</label>
                <input type="email" value={linkBranchEmail} onChange={(e) => setLinkBranchEmail(e.target.value)} required placeholder="kasir.bandung@gmail.com" className="w-full bg-slate-50 dark:bg-[#04060B] border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB]" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold py-3.5 rounded-xl">Batal</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 btn-sapphire text-white font-black py-3.5 rounded-xl disabled:opacity-60">{isSubmitting ? 'Memproses...' : 'Buat Cabang'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-[200] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl border backdrop-blur-xl owner-3d ${toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${toast.type === 'success' ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
              {toast.type === 'success' ? (
                <Icons.Check />
              ) : (
                <Icons.Close />
              )}
            </div>
            <p className="text-sm font-bold pr-4">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}