import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const formatRpServer = (num) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num || 0);

const getPromoExpiresAt1630Wib = () => {
  const nowUtcMs = Date.now();
  const wibOffsetMs = 7 * 60 * 60 * 1000;
  const wibNow = new Date(nowUtcMs + wibOffsetMs);
  const year = wibNow.getUTCFullYear();
  const month = wibNow.getUTCMonth();
  const day = wibNow.getUTCDate();

  let targetUtcMs = Date.UTC(year, month, day, 9, 30, 0, 0);
  if (nowUtcMs >= targetUtcMs) {
    targetUtcMs += 24 * 60 * 60 * 1000;
  }
  return new Date(targetUtcMs).toISOString();
};

const getWibDateKey = (isoStr) => {
  const ms = new Date(isoStr).getTime() + 7 * 60 * 60 * 1000;
  return new Date(ms).toISOString().slice(0, 10);
};

const getWibHour = (isoStr) => {
  const ms = new Date(isoStr).getTime() + 7 * 60 * 60 * 1000;
  return new Date(ms).getUTCHours();
};

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

    let query = supabaseAdmin.from('tenants').select('*');
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
        actualSalaryTx: 0,
        pendingBaseSalary: 0,
        netProfit: 0,
        expenseCategories: {},
        topMenus: [],
        lowStockMenus: [],
        unpaidInvoices: [],
        savedAiConfig: null,
        aiInsights: {
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
        },
      });
    }

    const allTenantIds = tenants.map((t) => t.id);
    const tenantNameMap = {};
    tenants.forEach((t) => {
      tenantNameMap[t.id] = t.name;
    });

    const tenantWithAi = tenants.find((t) => t.ai_api_key || t.ai_provider || t.ai_model) || tenants[0];
    const savedAiConfig = {
      provider: tenantWithAi?.ai_provider || 'gemini',
      model: tenantWithAi?.ai_model || 'gemini-2.5-flash',
      apiKey: tenantWithAi?.ai_api_key || '',
    };

    const isFilteredBranch = Boolean(tenantIdParam && tenantIdParam !== 'all');
    const targetTenantIds = isFilteredBranch
      ? tenants.filter((t) => t.id === tenantIdParam).map((t) => t.id)
      : allTenantIds;

    let startDate = new Date();
    let endDate = new Date();
    let labels = [];

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
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
    }

    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000);
    const safeTargetIds = targetTenantIds.length > 0 ? targetTenantIds : ['00000000-0000-0000-0000-000000000000'];

    const [orderRes, expenseRes, empTransRes, empRes, allMenusRes, invoiceRes, recent30OrdersRes] = await Promise.all([
      supabaseAdmin
        .from('orders')
        .select('id, total_price, created_at, updated_at, paid_at, tenant_id, items, status, payment_status, payment_method, table_number, device_id')
        .in('tenant_id', allTenantIds)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString()),
      supabaseAdmin
        .from('expenses')
        .select('amount, category, tenant_id')
        .in('tenant_id', safeTargetIds)
        .gte('expense_date', startDate.toISOString())
        .lte('expense_date', endDate.toISOString()),
      supabaseAdmin
        .from('employee_transactions')
        .select('id, employee_id, type, amount, tenant_id, transaction_date')
        .in('tenant_id', safeTargetIds)
        .gte('transaction_date', startDate.toISOString())
        .lte('transaction_date', endDate.toISOString()),
      supabaseAdmin
        .from('employees')
        .select('id, tenant_id, name, base_salary, is_active')
        .in('tenant_id', allTenantIds),
      supabaseAdmin
        .from('menus')
        .select('*')
        .in('tenant_id', safeTargetIds)
        .order('stock', { ascending: true }),
      supabaseAdmin
        .from('invoices')
        .select('id, tenant_id, amount, period, status, created_at')
        .in('tenant_id', allTenantIds)
        .eq('status', 'unpaid')
        .order('created_at', { ascending: false }),
      supabaseAdmin
        .from('orders')
        .select('id, total_price, created_at, updated_at, paid_at, tenant_id, items, status, payment_status, payment_method, table_number, device_id')
        .in('tenant_id', safeTargetIds)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(600),
    ]);

    const rawPeriodOrders = orderRes.data || [];
    const completedAllOrders = rawPeriodOrders.filter((o) => o.status === 'completed');
    const expenses = expenseRes.data || [];
    const empTrans = empTransRes.data || [];
    const allEmployees = empRes.data || [];
    const targetEmployees = allEmployees.filter((e) => targetTenantIds.includes(e.tenant_id));

    // Auto-cleanup promo yang sudah melewati promo_expires_at
    const rawMenus = allMenusRes.data || [];
    const expiredPromoIds = rawMenus
      .filter((m) => m.promo_expires_at && new Date(m.promo_expires_at).getTime() <= Date.now())
      .map((m) => m.id);

    if (expiredPromoIds.length > 0) {
      await supabaseAdmin
        .from('menus')
        .update({
          is_featured: false,
          discount_price: null,
          promo_expires_at: null,
        })
        .in('id', expiredPromoIds);
    }

    const allMenus = rawMenus.map((m) => {
      const isExpired = expiredPromoIds.includes(m.id);
      return {
        ...m,
        ...(isExpired ? { is_featured: false, discount_price: null, promo_expires_at: null } : {}),
        branch_name: tenantNameMap[m.tenant_id] || 'Cabang',
      };
    });

    const lowStockMenus = allMenus.filter((m) => Number(m.stock) <= 10);
    const unpaidInvoices = (invoiceRes.data || []).map((inv) => ({
      ...inv,
      branch_name: tenantNameMap[inv.tenant_id] || 'Cabang',
    }));

    const branchStats = {};
    allTenantIds.forEach((id) => {
      branchStats[id] = {
        revenue: 0,
        transactions: 0,
        employeeCount: allEmployees.filter((e) => e.tenant_id === id).length,
      };
    });

    completedAllOrders.forEach((order) => {
      const amt = Number(order.total_price);
      if (branchStats[order.tenant_id]) {
        branchStats[order.tenant_id].revenue += amt;
        branchStats[order.tenant_id].transactions += 1;
      }
    });

    const targetOrders = isFilteredBranch
      ? completedAllOrders.filter((o) => targetTenantIds.includes(o.tenant_id))
      : completedAllOrders;

    const totalRevenue = targetOrders.reduce((sum, order) => sum + Number(order.total_price), 0);
    const operationalExpense = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
    const actualSalaryTx = empTrans.reduce((sum, trx) => sum + Number(trx.amount), 0);

    let pendingBaseSalary = 0;
    const pendingSalaryByBranch = {};
    if (period === 'monthly') {
      const paidEmployeeIds = new Set(
        empTrans.filter((tx) => tx.type === 'Gaji').map((tx) => tx.employee_id)
      );
      targetEmployees
        .filter((emp) => emp.is_active && !paidEmployeeIds.has(emp.id))
        .forEach((emp) => {
          const base = Number(emp.base_salary || 0);
          pendingBaseSalary += base;
          pendingSalaryByBranch[emp.tenant_id] = (pendingSalaryByBranch[emp.tenant_id] || 0) + base;
        });
    }

    const salaryExpense = actualSalaryTx + pendingBaseSalary;
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

    // =========================================================================
    // KALKULASI RISET MENDALAM AI AGENT (HEMAT TOKEN - DIHITUNG DI SERVER)
    // =========================================================================
    const recent30Orders = recent30OrdersRes.data || [];
    const completed30 = recent30Orders.filter((o) => o.status === 'completed');

    const avgBasket =
      targetOrders.length > 0
        ? Math.round(totalRevenue / targetOrders.length)
        : completed30.length > 0
        ? Math.round(completed30.reduce((s, o) => s + Number(o.total_price), 0) / completed30.length)
        : 0;

    const deviceCountMap = {};
    completed30.forEach((o) => {
      if (o.device_id && String(o.device_id).trim() !== '') {
        deviceCountMap[o.device_id] = (deviceCountMap[o.device_id] || 0) + 1;
      }
    });
    const uniqueDevices = Object.keys(deviceCountMap).length;
    const repeatDevices = Object.values(deviceCountMap).filter((c) => c > 1).length;
    const repeatRate = uniqueDevices > 0 ? Number(((repeatDevices / uniqueDevices) * 100).toFixed(1)) : 0;

    // 1. KDS SPEED & PEAK-HOUR BOTTLENECK
    let kdsTotalMin = 0;
    let kdsCount = 0;
    let maxKdsMin = 0;
    let slowestTable = '-';
    let slowestBranch = '-';
    const kdsByHour = {};

    completed30.forEach((o) => {
      if (o.created_at && o.updated_at) {
        const diffMin = (new Date(o.updated_at) - new Date(o.created_at)) / 60000;
        if (diffMin > 0.5 && diffMin <= 180) {
          kdsTotalMin += diffMin;
          kdsCount += 1;
          if (diffMin > maxKdsMin) {
            maxKdsMin = diffMin;
            slowestTable = o.table_number || '-';
            slowestBranch = tenantNameMap[o.tenant_id] || 'Cabang';
          }
          const h = getWibHour(o.created_at);
          if (!kdsByHour[h]) {
            kdsByHour[h] = { hour: h, totalMin: 0, count: 0, branchTotals: {} };
          }
          kdsByHour[h].totalMin += diffMin;
          kdsByHour[h].count += 1;
          const bName = tenantNameMap[o.tenant_id] || 'Cabang';
          kdsByHour[h].branchTotals[bName] = (kdsByHour[h].branchTotals[bName] || 0) + 1;
        }
      }
    });
    const avgKdsMinutes = kdsCount > 0 ? Number((kdsTotalMin / kdsCount).toFixed(1)) : 8.5;

    let kdsPeakBottleneck = null;
    const kdsHourList = Object.values(kdsByHour)
      .filter((item) => item.count >= 2)
      .map((item) => ({
        ...item,
        avg: item.totalMin / item.count,
      }))
      .sort((a, b) => b.avg - a.avg);

    const topBottleneck = kdsHourList[0] || Object.values(kdsByHour)
      .map((item) => ({ ...item, avg: item.totalMin / item.count }))
      .sort((a, b) => b.avg - a.avg)[0];

    if (topBottleneck) {
      const topBranchEntry = Object.entries(topBottleneck.branchTotals).sort((a, b) => b[1] - a[1])[0];
      const nextHour = (topBottleneck.hour + 1) % 24;
      kdsPeakBottleneck = {
        peakHourLabel: `${String(topBottleneck.hour).padStart(2, '0')}.00 – ${String(nextHour).padStart(2, '0')}.00 WIB`,
        avgMinutes: Number(topBottleneck.avg.toFixed(1)),
        orderCount: topBottleneck.count,
        branchName: topBranchEntry ? topBranchEntry[0] : 'Semua Cabang',
      };
    }

    // 2. FRAUD WATCHDOG LANJUTAN (CANCELLED + CANCEL MALAM + ORDER TUNAI MENGGANTUNG > 2 JAM)
    const cancelledOrders = recent30Orders.filter(
      (o) => o.status === 'cancelled' || o.payment_status === 'CANCELLED'
    );
    const fraudByBranch = {};
    const ensureFraudBranch = (bId) => {
      if (!fraudByBranch[bId]) {
        fraudByBranch[bId] = {
          tenant_id: bId,
          branch_name: tenantNameMap[bId] || 'Cabang',
          count: 0,
          cashCount: 0,
          nightCashCancelCount: 0,
          staleCashCount: 0,
          staleCashAmount: 0,
          totalAmount: 0,
          latestAt: null,
          hours: [],
        };
      }
      return fraudByBranch[bId];
    };

    cancelledOrders.forEach((o) => {
      const entry = ensureFraudBranch(o.tenant_id);
      entry.count += 1;
      const isCash = (o.payment_method || '').toLowerCase() === 'cash';
      if (isCash) {
        entry.cashCount += 1;
      }
      const dtIso = o.updated_at || o.created_at;
      const wibHr = getWibHour(dtIso);
      if (isCash && (wibHr >= 20 || wibHr < 5)) {
        entry.nightCashCancelCount += 1;
      }
      entry.totalAmount += Number(o.total_price || 0);
      if (!entry.latestAt || new Date(dtIso) > new Date(entry.latestAt)) {
        entry.latestAt = dtIso;
      }
      const dt = new Date(new Date(dtIso).getTime() + 7 * 60 * 60 * 1000);
      entry.hours.push(`${String(dt.getUTCHours()).padStart(2, '0')}:${String(dt.getUTCMinutes()).padStart(2, '0')}`);
    });

    const twoHoursAgoMs = Date.now() - 2 * 3600 * 1000;
    recent30Orders.forEach((o) => {
      const isCash = (o.payment_method || '').toLowerCase() === 'cash';
      const isClosed = o.status === 'completed' || o.status === 'cancelled' || o.payment_status === 'CANCELLED';
      if (isCash && !isClosed && new Date(o.created_at).getTime() < twoHoursAgoMs) {
        const entry = ensureFraudBranch(o.tenant_id);
        entry.staleCashCount += 1;
        entry.staleCashAmount += Number(o.total_price || 0);
      }
    });

    const fraudAlerts = Object.values(fraudByBranch).sort(
      (a, b) => (b.totalAmount + b.staleCashAmount) - (a.totalAmount + a.staleCashAmount)
    );

    // 3. DETEKSI ANOMALI OMZET PER CABANG (VS RATA-RATA HARIAN 30 HARI)
    const rev30ByBranch = {};
    completed30.forEach((o) => {
      const bId = o.tenant_id;
      if (!rev30ByBranch[bId]) {
        rev30ByBranch[bId] = { totalRev: 0, days: new Set() };
      }
      rev30ByBranch[bId].totalRev += Number(o.total_price || 0);
      rev30ByBranch[bId].days.add(getWibDateKey(o.created_at));
    });

    const periodDays = Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / 86400000));
    const revenueAnomalies = [];
    targetTenantIds.forEach((id) => {
      const hist = rev30ByBranch[id];
      if (!hist || hist.days.size < 2) return;
      const avgDailyRev = hist.totalRev / hist.days.size;
      const expectedRev = avgDailyRev * periodDays;
      if (expectedRev <= 0) return;
      const currentRev = branchStats[id]?.revenue || 0;
      const diffPct = ((currentRev - expectedRev) / expectedRev) * 100;
      if (diffPct <= -20 || diffPct >= 25) {
        revenueAnomalies.push({
          tenant_id: id,
          branch_name: tenantNameMap[id] || 'Cabang',
          currentRev,
          expectedRev: Math.round(expectedRev),
          diffPct: Number(diffPct.toFixed(1)),
          status: diffPct <= -20 ? 'drop' : 'surge',
        });
      }
    });

    // 4. AUDIT RASIO BIAYA & GAJI PER CABANG
    const costAudit = [];
    targetTenantIds.forEach((id) => {
      const rev = branchStats[id]?.revenue || 0;
      const branchOpExps = expenses.filter((e) => e.tenant_id === id);
      const opExp = branchOpExps.reduce((s, e) => s + Number(e.amount || 0), 0);
      const salExp =
        empTrans.filter((t) => t.tenant_id === id).reduce((s, t) => s + Number(t.amount || 0), 0) +
        (pendingSalaryByBranch[id] || 0);
      const totExp = opExp + salExp;
      if (totExp <= 0) return;

      const catTotals = {};
      branchOpExps.forEach((e) => {
        const c = e.category || 'Operasional';
        catTotals[c] = (catTotals[c] || 0) + Number(e.amount || 0);
      });
      if (salExp > 0) catTotals['Gaji & Karyawan'] = salExp;
      const topCatEntry = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0];

      const costRatioPct = rev > 0 ? Number(((totExp / rev) * 100).toFixed(1)) : 100;
      if ((rev > 0 && costRatioPct > 35) || (rev === 0 && totExp > 0)) {
        costAudit.push({
          tenant_id: id,
          branch_name: tenantNameMap[id] || 'Cabang',
          revenue: rev,
          totalExpense: totExp,
          costRatioPct,
          topCategory: topCatEntry ? topCatEntry[0] : 'Operasional',
          topCategoryAmount: topCatEntry ? topCatEntry[1] : totExp,
        });
      }
    });

    // 5. DETEKTOR MENU MATI (DEAD STOCK 30 HARI: 0 PENJUALAN)
    const soldMenuIds = new Set();
    const soldMenuNames = new Set();
    completed30.forEach((order) => {
      const items = Array.isArray(order.items) ? order.items : [];
      items.forEach((i) => {
        if (i?.menu_id) soldMenuIds.add(i.menu_id);
        if (i?.id) soldMenuIds.add(i.id);
        const nm = i?.name || i?.menu_name;
        if (nm) soldMenuNames.add(String(nm).toLowerCase().trim());
      });
    });

    const deadStockMenus = allMenus
      .filter(
        (m) =>
          m.status === 'available' &&
          Number(m.stock || 0) > 0 &&
          m.category !== 'Paket Bundling' &&
          !soldMenuIds.has(m.id) &&
          !soldMenuNames.has(String(m.name || '').toLowerCase().trim())
      )
      .slice(0, 10)
      .map((m) => ({
        id: m.id,
        tenant_id: m.tenant_id,
        name: m.name,
        branch_name: m.branch_name,
        category: m.category,
        stock: Number(m.stock),
        price: Number(m.price),
        discount_price: m.discount_price ? Number(m.discount_price) : null,
        suggested_discount_price: Math.max(5000, Math.round((Number(m.price) * 0.75) / 1000) * 1000),
      }));

    // 6. SMART BASKET ANALYSIS & ACTION PLANS
    const pairCountMap = {};
    const singleMenuPriceMap = {};
    allMenus.forEach((m) => {
      singleMenuPriceMap[m.name] = Number(m.price || 0);
    });

    completed30.forEach((order) => {
      const items = Array.isArray(order.items) ? order.items : [];
      const names = [...new Set(items.map((i) => i?.name || i?.menu_name).filter(Boolean))];
      items.forEach((i) => {
        const nm = i?.name || i?.menu_name;
        if (nm && i?.price && !singleMenuPriceMap[nm]) {
          singleMenuPriceMap[nm] = Number(i.price);
        }
      });
      for (let i = 0; i < names.length; i++) {
        for (let j = i + 1; j < names.length; j++) {
          const pair = [names[i], names[j]].sort();
          const key = `${pair[0]}|||${pair[1]}`;
          pairCountMap[key] = (pairCountMap[key] || 0) + 1;
        }
      }
    });

    const topPairEntry = Object.entries(pairCountMap).sort((a, b) => b[1] - a[1])[0];
    let bundleItemA = topMenus[0]?.name || allMenus[0]?.name || 'Es Kopi Susu';
    let bundleItemB = topMenus[1]?.name || allMenus[1]?.name || 'Snack Pilihan';
    let pairCoOccurrenceCount = 0;

    if (topPairEntry) {
      const [a, b] = topPairEntry[0].split('|||');
      bundleItemA = a;
      bundleItemB = b;
      pairCoOccurrenceCount = topPairEntry[1];
    }

    const normalBundlePrice =
      (singleMenuPriceMap[bundleItemA] || 22000) + (singleMenuPriceMap[bundleItemB] || 20000);
    const recommendedBundlePrice = Math.max(
      15000,
      Math.round((normalBundlePrice * 0.85) / 1000) * 1000
    );

    const promoCandidate =
      [...allMenus]
        .filter((m) => m.status === 'available' && Number(m.stock) >= 10 && !m.discount_price)
        .sort((a, b) => Number(b.stock) - Number(a.stock))[0] ||
      allMenus.find((m) => !m.discount_price) ||
      allMenus[0] ||
      null;

    const restockCandidate =
      allMenus.find((m) => m.status === 'soldout' || Number(m.stock) === 0) ||
      lowStockMenus[0] ||
      allMenus[0] ||
      null;

    const promoDiscountPrice = promoCandidate
      ? Math.max(5000, Math.round((Number(promoCandidate.price) * 0.8) / 1000) * 1000)
      : 15000;

    const restockTargetQty = restockCandidate
      ? Math.max(35, Number(restockCandidate.stock || 0) + 25)
      : 45;

    const estimatedLostRev = restockCandidate
      ? Number(restockCandidate.price || 25000) * 15
      : 375000;

    let soldoutTimeInfo = '';
    if (restockCandidate && restockCandidate.updated_at) {
      const dt = new Date(restockCandidate.updated_at);
      soldoutTimeInfo = ` (tercatat pada pukul ${String(dt.getHours()).padStart(2, '0')}.${String(dt.getMinutes()).padStart(2, '0')} WIB)`;
    }

    const diagnostics = [
      {
        code: '01',
        badgeColor: 'rose',
        title: 'Optimasi Trafik Jam Siang & Sore (14.00 – 16.30 WIB)',
        description: promoCandidate
          ? `Stok ${promoCandidate.name} di ${promoCandidate.branch_name} masih tersisa ${promoCandidate.stock} porsi. Mengaktifkan Harga Coret (${formatRpServer(promoDiscountPrice)}) + label Unggulan pada jam sepi efektif mendorong konversi layar QR.`
          : 'Trafik transaksi cenderung melandai pada pukul 14.00–16.30 WIB. Disarankan mengaktifkan menu promo unggulan pada jam tersebut.',
      },
      {
        code: '02',
        badgeColor: 'amber',
        title: restockCandidate
          ? `Detektor Potensi Omzet Hilang (~${formatRpServer(estimatedLostRev)}/Hari)`
          : 'Stok Menu Utama Terpantau Stabil',
        description: restockCandidate
          ? `Menu ${restockCandidate.name} (${restockCandidate.branch_name}) berada pada stok ${restockCandidate.stock} pcs dengan status "${restockCandidate.status}"${soldoutTimeInfo}. Jika habis sebelum jam ramai malam, potensi kehilangan sekitar 15 porsi penjualan.`
          : 'Seluruh menu utama masih memiliki stok di atas batas aman 10 porsi.',
      },
      {
        code: '03',
        badgeColor: 'sky',
        title: `Smart Basket Analysis (${bundleItemA} + ${bundleItemB})`,
        description:
          pairCoOccurrenceCount > 0
            ? `Ditemukan ${pairCoOccurrenceCount} transaksi yang memesan ${bundleItemA} bersamaan dengan ${bundleItemB}. Membuat paket bundling seharga ${formatRpServer(recommendedBundlePrice)} dapat menaikkan rata-rata struk (saat ini ${formatRpServer(avgBasket)}).`
            : `Kombinasi ${bundleItemA} + ${bundleItemB} potensial dijadikan Paket Bundling seharga ${formatRpServer(recommendedBundlePrice)} di bagian Unggulan QR Meja untuk mendongkrak nilai struk.`,
      },
    ];

    if (revenueAnomalies.length > 0) {
      const topAnom = revenueAnomalies[0];
      diagnostics.push({
        code: '04',
        badgeColor: topAnom.status === 'drop' ? 'rose' : 'sky',
        title:
          topAnom.status === 'drop'
            ? `Anomali Omzet Turun di ${topAnom.branch_name} (${topAnom.diffPct}%)`
            : `Lonjakan Omzet Positif di ${topAnom.branch_name} (+${topAnom.diffPct}%)`,
        description: `Omzet ${topAnom.branch_name} tercatat ${formatRpServer(topAnom.currentRev)} dibanding rata-rata historis ${formatRpServer(topAnom.expectedRev)} untuk durasi periode yang sama.`,
      });
    }

    if (costAudit.length > 0) {
      const topCost = costAudit[0];
      diagnostics.push({
        code: '05',
        badgeColor: 'amber',
        title: `Rasio Biaya Tinggi di ${topCost.branch_name} (${topCost.costRatioPct}% dari Omzet)`,
        description: `Total biaya tercatat ${formatRpServer(topCost.totalExpense)} dengan pos terbesar pada "${topCost.topCategory}" (${formatRpServer(topCost.topCategoryAmount)}). Disarankan menjaga rasio total biaya di bawah 35%.`,
      });
    }

    const actionPlans = [];
    if (promoCandidate) {
      actionPlans.push({
        id: 'promo_1',
        action_type: 'promo_discount',
        badge: 'Dongkrak Jam Sepi (14.00–16.30)',
        badgeTheme: 'amber',
        title: `Aktifkan Harga Coret "${promoCandidate.name}"`,
        branch_name: promoCandidate.branch_name,
        tenant_id: promoCandidate.tenant_id,
        menu_id: promoCandidate.id,
        original_price: Number(promoCandidate.price),
        discount_price: promoDiscountPrice,
        description: `AI akan mengaktifkan is_featured = true dan discount_price = ${promoDiscountPrice} pada menu ${promoCandidate.name} (${promoCandidate.branch_name}) agar tampil paling atas di HP pelanggan, lalu otomatis berhenti pada 16:30 WIB.`,
        buttonLabel: 'Eksekusi Promo 1-Klik Sekarang',
      });
    }

    if (restockCandidate) {
      actionPlans.push({
        id: 'restock_2',
        action_type: 'restock_menu',
        badge: `Cegah Lost Revenue (+${formatRpServer(estimatedLostRev)})`,
        badgeTheme: 'sky',
        title: `Naikkan Stok "${restockCandidate.name}"`,
        branch_name: restockCandidate.branch_name,
        tenant_id: restockCandidate.tenant_id,
        menu_id: restockCandidate.id,
        current_stock: Number(restockCandidate.stock || 0),
        new_stock: restockTargetQty,
        description: `Mengubah stok ${restockCandidate.name} di ${restockCandidate.branch_name} dari ${restockCandidate.stock} menjadi ${restockTargetQty} porsi dan memastikan status = 'available'.`,
        buttonLabel: 'Naikkan Stok Otomatis (1-Klik)',
      });
    }

    const defaultTargetTenantId = targetTenantIds[0] || allTenantIds[0];
    actionPlans.push({
      id: 'bundle_3',
      action_type: 'create_bundle',
      badge: 'Naikkan Nilai Struk / Basket Size',
      badgeTheme: 'emerald',
      title: `Terbitkan "Paket Hemat ${bundleItemA} + ${bundleItemB}"`,
      branch_name: tenantNameMap[defaultTargetTenantId] || 'Cabang Utama',
      tenant_id: defaultTargetTenantId,
      bundle_name: `Paket Hemat: ${bundleItemA} + ${bundleItemB}`,
      bundle_price: recommendedBundlePrice,
      normal_price: normalBundlePrice,
      description: `Membuat menu baru kategori "Paket Bundling" (${bundleItemA} + ${bundleItemB}) seharga ${formatRpServer(recommendedBundlePrice)} (harga normal ${formatRpServer(normalBundlePrice)}) di bagian Unggulan QR Meja.`,
      buttonLabel: 'Buat & Tampilkan Paket 1-Klik',
    });

    const activePromos = allMenus.filter(
      (m) => m.is_featured || (m.discount_price && Number(m.discount_price) > 0) || m.category === 'Paket Bundling'
    );

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
      actualSalaryTx,
      pendingBaseSalary,
      netProfit,
      expenseCategories,
      topMenus,
      lowStockMenus,
      unpaidInvoices,
      savedAiConfig,
      aiInsights: {
        avgBasket,
        repeatRate,
        avgKdsMinutes,
        maxKdsMin: Number(maxKdsMin.toFixed(1)),
        slowestTable,
        slowestBranch,
        diagnostics,
        actionPlans,
        fraudAlerts,
        activePromos,
        revenueAnomalies,
        costAudit,
        deadStockMenus,
        kdsPeakBottleneck,
      },
    });
  } catch (error) {
    console.error('Stats API Error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data statistik' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action_type, manager_email } = body;

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    if (action_type === 'save_ai_config') {
      const { provider, model, apiKey } = body;
      if (!manager_email) {
        return NextResponse.json({ error: 'Email Owner tidak ditemukan' }, { status: 400 });
      }
      const { error } = await supabaseAdmin
        .from('tenants')
        .update({
          ai_provider: provider || 'gemini',
          ai_model: model || 'gemini-2.5-flash',
          ai_api_key: apiKey || null,
        })
        .eq('manager_email', manager_email);

      if (error) throw error;
      return NextResponse.json({
        success: true,
        message: `Konfigurasi AI (${(provider || 'gemini').toUpperCase()} · ${model}) berhasil disimpan ke database lintas perangkat!`,
      });
    }

    if (action_type === 'promo_discount') {
      const { menu_id, discount_price } = body;
      if (!menu_id) {
        return NextResponse.json({ error: 'ID Menu tidak ditemukan' }, { status: 400 });
      }
      const promoExpiresAt = getPromoExpiresAt1630Wib();
      const { error } = await supabaseAdmin
        .from('menus')
        .update({
          is_featured: true,
          discount_price: Number(discount_price),
          status: 'available',
          promo_expires_at: promoExpiresAt,
        })
        .eq('id', menu_id);

      if (error) throw error;
      const expWibLabel = new Date(promoExpiresAt).toLocaleString('id-ID', {
        timeZone: 'Asia/Jakarta',
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
      return NextResponse.json({
        success: true,
        promo_expires_at: promoExpiresAt,
        message: `Promo Harga Coret & Label Unggulan aktif dan akan otomatis berhenti pada ${expWibLabel} WIB!`,
      });
    }

    if (action_type === 'restock_menu') {
      const { menu_id, new_stock } = body;
      if (!menu_id) {
        return NextResponse.json({ error: 'ID Menu tidak ditemukan' }, { status: 400 });
      }
      const { error } = await supabaseAdmin
        .from('menus')
        .update({
          stock: Number(new_stock),
          status: 'available',
        })
        .eq('id', menu_id);

      if (error) throw error;
      return NextResponse.json({
        success: true,
        message: `Stok berhasil dinaikkan menjadi ${new_stock} porsi dan status menu kembali Available!`,
      });
    }

    if (action_type === 'create_bundle') {
      const { tenant_id, bundle_name, bundle_price, normal_price, description } = body;
      if (!tenant_id || !bundle_name) {
        return NextResponse.json({ error: 'Data cabang atau nama paket belum lengkap' }, { status: 400 });
      }
      const { error } = await supabaseAdmin.from('menus').insert([
        {
          tenant_id,
          name: bundle_name,
          category: 'Paket Bundling',
          price: Number(normal_price || bundle_price),
          discount_price: Number(bundle_price),
          description: description || 'Paket Hemat Rekomendasi AI NexaFlow',
          status: 'available',
          stock: 30,
          is_featured: true,
          is_new: true,
        },
      ]);

      if (error) throw error;
      return NextResponse.json({
        success: true,
        message: `${bundle_name} berhasil diterbitkan ke daftar menu Unggulan!`,
      });
    }

    if (action_type === 'disable_promo') {
      const { menu_id } = body;
      if (!menu_id) {
        return NextResponse.json({ error: 'ID Menu tidak ditemukan' }, { status: 400 });
      }
      const { error } = await supabaseAdmin
        .from('menus')
        .update({
          is_featured: false,
          discount_price: null,
          promo_expires_at: null,
        })
        .eq('id', menu_id);

      if (error) throw error;
      return NextResponse.json({
        success: true,
        message: 'Promo pada menu berhasil dinonaktifkan.',
      });
    }

    if (action_type === 'ask_ai') {
      const { question, ai_config, context_summary } = body;
      if (!question || !String(question).trim()) {
        return NextResponse.json({ error: 'Pertanyaan tidak boleh kosong' }, { status: 400 });
      }

      let dbProvider = '';
      let dbModel = '';
      let dbApiKey = '';
      if (manager_email) {
        const { data: tList } = await supabaseAdmin
          .from('tenants')
          .select('ai_provider, ai_model, ai_api_key')
          .eq('manager_email', manager_email)
          .limit(1);
        if (tList && tList[0]) {
          dbProvider = tList[0].ai_provider || '';
          dbModel = tList[0].ai_model || '';
          dbApiKey = tList[0].ai_api_key || '';
        }
      }

      const provider = ai_config?.provider || dbProvider || 'gemini';
      const model = ai_config?.model || dbModel || 'gemini-2.5-flash';
      const apiKey =
        ai_config?.apiKey?.trim() ||
        dbApiKey?.trim() ||
        process.env.GEMINI_API_KEY ||
        process.env.DEEPSEEK_API_KEY ||
        process.env.OPENAI_API_KEY ||
        '';

      const compactSummary = context_summary || { manager: manager_email, info: 'Ringkasan operasional NexaFlow' };
      const systemPrompt = `Anda adalah NexaFlow Executive AI Business Advisor untuk pemilik kafe/restoran multi-cabang di Indonesia. Jawab dalam Bahasa Indonesia yang ringkas, tajam, berbasis angka dari JSON berikut (termasuk anomali omzet, rasio biaya, dead stock, bottleneck KDS, dan alert fraud jika ada), dan berikan saran tindakan nyata (maksimal 4 kalimat). Data JSON Kafe: ${JSON.stringify(compactSummary)}`;

      if (!apiKey) {
        const fallbackRev = formatRpServer(compactSummary?.totalRevenue || 0);
        const fallbackNet = formatRpServer(compactSummary?.netProfit || 0);
        const topMenuName = compactSummary?.topMenus?.[0]?.name || 'Menu Utama';
        return NextResponse.json({
          answer: `[Mode Analisis Lokal - Belum Ada API Key di Pengaturan] Berdasarkan data aktual cabang Anda, total omzet tercatat ${fallbackRev} dengan laba bersih ${fallbackNet} dan menu terlaris "${topMenuName}". Untuk mengaktifkan diskusi bebas dengan model ${model}, silakan tempelkan API Key Anda di menu Pengaturan -> Konfigurasi AI Business Advisor.`,
        });
      }

      if (provider === 'gemini') {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
        const res = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\nPertanyaan Owner: ${question}` }],
              },
            ],
            generationConfig: { temperature: 0.3, maxOutputTokens: 420 },
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          return NextResponse.json(
            { error: data?.error?.message || 'Gagal memanggil API Google Gemini. Periksa API Key atau nama model Anda.' },
            { status: 400 }
          );
        }
        const replyText =
          data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          'AI selesai menganalisis namun tidak mengembalikan teks.';
        return NextResponse.json({ answer: replyText });
      } else {
        let endpoint = 'https://api.openai.com/v1/chat/completions';
        if (provider === 'deepseek') endpoint = 'https://api.deepseek.com/chat/completions';
        if (provider === 'groq') endpoint = 'https://api.groq.com/openai/v1/chat/completions';
        if (provider === 'openrouter') endpoint = 'https://openrouter.ai/api/v1/chat/completions';

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: question },
            ],
            temperature: 0.3,
            max_tokens: 420,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          return NextResponse.json(
            { error: data?.error?.message || `Gagal memanggil API ${provider.toUpperCase()}. Periksa API Key atau saldo akun Anda.` },
            { status: 400 }
          );
        }
        const replyText = data?.choices?.[0]?.message?.content || 'Tidak ada balasan dari model AI.';
        return NextResponse.json({ answer: replyText });
      }
    }

    return NextResponse.json({ error: 'Aksi tidak dikenali' }, { status: 400 });
  } catch (error) {
    console.error('Stats POST API Error:', error);
    return NextResponse.json({ error: 'Gagal memproses aksi AI: ' + error.message }, { status: 500 });
  }
}