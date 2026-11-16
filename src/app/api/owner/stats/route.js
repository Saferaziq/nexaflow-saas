import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const managerEmail = searchParams.get('manager_email');
    const period = searchParams.get('period') || 'daily';
    const dateStr = searchParams.get('date_str');
    const tenantIdParam = searchParams.get('tenant_id');

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    let query = supabaseAdmin.from('tenants').select('id, name, is_active');
    if (managerEmail) query = query.eq('manager_email', managerEmail);

    const { data: tenants, error: tenantErr } = await query;
    if (tenantErr) throw tenantErr;

    if (!tenants || tenants.length === 0) {
      return NextResponse.json({
        totalRevenue: 0,
        totalTransactions: 0,
        totalBranches: 0,
        activeBranches: 0,
        chartData: [],
        labels: [],
        branchStats: {},
        totalExpense: 0,
        operationalExpense: 0,
        salaryExpense: 0,
        netProfit: 0,
        expenseCategories: {},
        topMenus: [],
        lowStockMenus: [],
        unpaidInvoices: [],
      });
    }

    const allTenantIds = tenants.map((t) => t.id);
    const tenantNameMap = {};
    tenants.forEach((t) => {
      tenantNameMap[t.id] = t.name;
    });

    const isFilteredBranch = Boolean(tenantIdParam && tenantIdParam !== 'all');
    const targetTenantIds = isFilteredBranch
      ? tenants.filter((t) => t.id === tenantIdParam).map((t) => t.id)
      : allTenantIds;

    let startDate = new Date();
    let endDate = new Date();
    let labels = [];

    // PENGAMANAN PARSING TANGGAL
    try {
      if (period === 'daily') {
        const safeDate = dateStr ? dateStr : new Date().toLocaleDateString('en-CA');
        startDate = new Date(safeDate);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(safeDate);
        endDate.setHours(23, 59, 59, 999);
        labels = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
      } else if (period === 'monthly') {
        const [year, month] = (dateStr || new Date().toISOString().slice(0, 7)).split('-');
        startDate = new Date(year, parseInt(month) - 1, 1);
        endDate = new Date(year, parseInt(month), 0, 23, 59, 59);
        labels = ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4', 'Minggu 5'];
      } else if (period === 'weekly') {
        const [year, week] = (dateStr || '2024-W01').split('-W');
        const simple = new Date(parseInt(year), 0, 1 + (parseInt(week) - 1) * 7);
        const dow = simple.getDay();
        startDate = new Date(simple);
        if (dow <= 4) startDate.setDate(simple.getDate() - simple.getDay() + 1);
        else startDate.setDate(simple.getDate() + 8 - simple.getDay());
        startDate.setHours(0, 0, 0, 0);

        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
        labels = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
      }
    } catch (e) {
      console.log('Fallback date parsing error', e);
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
    }

    const [orderRes, expenseRes, empTransRes, empRes, lowStockRes, invoiceRes] = await Promise.all([
      supabaseAdmin
        .from('orders')
        .select('total_price, created_at, tenant_id, items')
        .eq('status', 'completed')
        .in('tenant_id', allTenantIds)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString()),
      supabaseAdmin
        .from('expenses')
        .select('amount, category, tenant_id')
        .in('tenant_id', targetTenantIds.length > 0 ? targetTenantIds : ['00000000-0000-0000-0000-000000000000'])
        .gte('expense_date', startDate.toISOString())
        .lte('expense_date', endDate.toISOString()),
      supabaseAdmin
        .from('employee_transactions')
        .select('amount, tenant_id')
        .in('tenant_id', targetTenantIds.length > 0 ? targetTenantIds : ['00000000-0000-0000-0000-000000000000'])
        .gte('transaction_date', startDate.toISOString())
        .lte('transaction_date', endDate.toISOString()),
      supabaseAdmin
        .from('employees')
        .select('id, tenant_id')
        .in('tenant_id', allTenantIds),
      supabaseAdmin
        .from('menus')
        .select('id, tenant_id, name, stock')
        .in('tenant_id', targetTenantIds.length > 0 ? targetTenantIds : ['00000000-0000-0000-0000-000000000000'])
        .lte('stock', 10)
        .order('stock', { ascending: true }),
      supabaseAdmin
        .from('invoices')
        .select('id, tenant_id, amount, period, status, created_at')
        .in('tenant_id', allTenantIds)
        .eq('status', 'unpaid')
        .order('created_at', { ascending: false }),
    ]);

    const allOrders = orderRes.data || [];
    const expenses = expenseRes.data || [];
    const empTrans = empTransRes.data || [];
    const employees = empRes.data || [];
    const lowStockMenus = (lowStockRes.data || []).map((m) => ({
      ...m,
      branch_name: tenantNameMap[m.tenant_id] || 'Cabang',
    }));
    const unpaidInvoices = (invoiceRes.data || []).map((inv) => ({
      ...inv,
      branch_name: tenantNameMap[inv.tenant_id] || 'Cabang',
    }));

    const branchStats = {};
    allTenantIds.forEach((id) => {
      branchStats[id] = {
        revenue: 0,
        transactions: 0,
        employeeCount: employees.filter((e) => e.tenant_id === id).length,
      };
    });

    allOrders.forEach((order) => {
      const amt = Number(order.total_price);
      if (branchStats[order.tenant_id]) {
        branchStats[order.tenant_id].revenue += amt;
        branchStats[order.tenant_id].transactions += 1;
      }
    });

    const targetOrders = isFilteredBranch
      ? allOrders.filter((o) => targetTenantIds.includes(o.tenant_id))
      : allOrders;

    const totalRevenue = targetOrders.reduce((sum, order) => sum + Number(order.total_price), 0);
    const operationalExpense = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
    const salaryExpense = empTrans.reduce((sum, trx) => sum + Number(trx.amount), 0);
    const totalExpense = operationalExpense + salaryExpense;
    const netProfit = totalRevenue - totalExpense;

    const expenseCategories = {};
    expenses.forEach((exp) => {
      const cat = exp.category || 'Lainnya';
      expenseCategories[cat] = (expenseCategories[cat] || 0) + Number(exp.amount);
    });

    const menuMap = {};
    targetOrders.forEach((order) => {
      const items = Array.isArray(order.items) ? order.items : [];
      items.forEach((item) => {
        const name = item?.name || item?.menu_name || 'Menu';
        const qty = Number(item?.qty ?? item?.quantity ?? 1);
        const price = Number(item?.price ?? 0);
        if (!menuMap[name]) {
          menuMap[name] = { name, qty: 0, revenue: 0 };
        }
        menuMap[name].qty += qty;
        menuMap[name].revenue += qty * price;
      });
    });
    const topMenus = Object.values(menuMap)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    let chartData = [];
    if (period === 'daily') chartData = [0, 0, 0, 0, 0, 0, 0, 0];
    if (period === 'monthly') chartData = [0, 0, 0, 0, 0];
    if (period === 'weekly') chartData = [0, 0, 0, 0, 0, 0, 0];

    targetOrders.forEach((order) => {
      const orderDate = new Date(order.created_at);
      const amt = Number(order.total_price);

      if (period === 'daily') {
        const hour = orderDate.getHours();
        if (hour <= 8) chartData[0] += amt;
        else if (hour <= 10) chartData[1] += amt;
        else if (hour <= 12) chartData[2] += amt;
        else if (hour <= 14) chartData[3] += amt;
        else if (hour <= 16) chartData[4] += amt;
        else if (hour <= 18) chartData[5] += amt;
        else if (hour <= 20) chartData[6] += amt;
        else chartData[7] += amt;
      } else if (period === 'monthly') {
        const date = orderDate.getDate();
        if (date <= 7) chartData[0] += amt;
        else if (date <= 14) chartData[1] += amt;
        else if (date <= 21) chartData[2] += amt;
        else if (date <= 28) chartData[3] += amt;
        else chartData[4] += amt;
      } else {
        let dayIndex = orderDate.getDay() - 1;
        if (dayIndex === -1) dayIndex = 6;
        chartData[dayIndex] += amt;
      }
    });

    const chartDataJuta = chartData.map((val) => Number((val / 1000000).toFixed(2)));

    return NextResponse.json({
      totalRevenue,
      totalTransactions: targetOrders.length,
      totalBranches: tenants.length,
      activeBranches: tenants.filter((t) => t.is_active).length,
      chartData: chartDataJuta,
      labels,
      branchStats,
      totalExpense,
      operationalExpense,
      salaryExpense,
      netProfit,
      expenseCategories,
      topMenus,
      lowStockMenus,
      unpaidInvoices,
    });
  } catch (error) {
    console.error('Stats API Error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data statistik' }, { status: 500 });
  }
}