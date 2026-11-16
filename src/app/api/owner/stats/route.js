import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const formatRpServer = (num) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num || 0);

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
        aiInsights: {
          avgBasket: 0,
          repeatRate: 0,
          avgKdsMinutes: 0,
          slowestTable: '-',
          diagnostics: [],
          actionPlans: [],
          fraudAlerts: [],
          activePromos: [],
        },
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
        .select('amount, tenant_id')
        .in('tenant_id', safeTargetIds)
        .gte('transaction_date', startDate.toISOString())
        .lte('transaction_date', endDate.toISOString()),
      supabaseAdmin
        .from('employees')
        .select('id, tenant_id')
        .in('tenant_id', allTenantIds),
      supabaseAdmin
        .from('menus')
        .select('id, tenant_id, name, category, price, discount_price, stock, status, is_featured')
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
        .limit(400),
    ]);

    const rawPeriodOrders = orderRes.data || [];
    const completedAllOrders = rawPeriodOrders.filter((o) => o.status === 'completed');
    const expenses = expenseRes.data || [];
    const empTrans = empTransRes.data || [];
    const employees = empRes.data || [];
    const allMenus = (allMenusRes.data || []).map((m) => ({
      ...m,
      branch_name: tenantNameMap[m.tenant_id] || 'Cabang',
    }));

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
        employeeCount: employees.filter((e) => e.tenant_id === id).length,
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

    // =========================================================================
    // KALKULASI RISET MENDALAM AI AGENT (HEMAT TOKEN - DIHITUNG DI SERVER)
    // =========================================================================
    const recent30Orders = recent30OrdersRes.data || [];
    const completed30 = recent30Orders.filter((o) => o.status === 'completed');

    // 1. Rata-rata nilai struk (Basket Size)
    const avgBasket =
      targetOrders.length > 0
        ? Math.round(totalRevenue / targetOrders.length)
        : completed30.length > 0
        ? Math.round(completed30.reduce((s, o) => s + Number(o.total_price), 0) / completed30.length)
        : 0;

    // 2. Repeat Order Rate berdasarkan device_id (30 hari terakhir)
    const deviceCountMap = {};
    completed30.forEach((o) => {
      if (o.device_id && String(o.device_id).trim() !== '') {
        deviceCountMap[o.device_id] = (deviceCountMap[o.device_id] || 0) + 1;
      }
    });
    const uniqueDevices = Object.keys(deviceCountMap).length;
    const repeatDevices = Object.values(deviceCountMap).filter((c) => c > 1).length;
    const repeatRate = uniqueDevices > 0 ? Number(((repeatDevices / uniqueDevices) * 100).toFixed(1)) : 0;

    // 3. KDS Speed Monitor (created_at -> updated_at pada pesanan completed)
    let kdsTotalMin = 0;
    let kdsCount = 0;
    let maxKdsMin = 0;
    let slowestTable = '-';
    let slowestBranch = '-';
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
        }
      }
    });
    const avgKdsMinutes = kdsCount > 0 ? Number((kdsTotalMin / kdsCount).toFixed(1)) : 8.5;

    // 4. AI Fraud & Void Watchdog (Pesanan Cancelled)
    const cancelledOrders = recent30Orders.filter(
      (o) => o.status === 'cancelled' || o.payment_status === 'CANCELLED'
    );
    const fraudByBranch = {};
    cancelledOrders.forEach((o) => {
      const bId = o.tenant_id;
      if (!fraudByBranch[bId]) {
        fraudByBranch[bId] = {
          tenant_id: bId,
          branch_name: tenantNameMap[bId] || 'Cabang',
          count: 0,
          cashCount: 0,
          totalAmount: 0,
          latestAt: o.updated_at || o.created_at,
          hours: [],
        };
      }
      fraudByBranch[bId].count += 1;
      if ((o.payment_method || '').toLowerCase() === 'cash') {
        fraudByBranch[bId].cashCount += 1;
      }
      fraudByBranch[bId].totalAmount += Number(o.total_price || 0);
      const dt = new Date(o.updated_at || o.created_at);
      fraudByBranch[bId].hours.push(`${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`);
    });
    const fraudAlerts = Object.values(fraudByBranch).sort((a, b) => b.totalAmount - a.totalAmount);

    // 5. Smart Basket Analysis (Pasangan Menu dari orders.items 30 hari terakhir)
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

    // 6. Kandidat Menu untuk Promo Jam Sepi & Restock
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

    // 7. Susun 3 Hasil Riset Mendalam (Diagnostics 01 - 03)
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
          ? `Menu ${restockCandidate.name} (${restockCandidate.branch_name}) berada pada stok ${restockCandidate.stock} pcs (status: ${restockCandidate.status}). Jika habis sebelum jam ramai malam, potensi kehilangan sekitar 15 porsi penjualan.`
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

    // 8. Susun 3 Rencana Aksi 1-Klik (Action Plan)
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
        description: `AI akan mengaktifkan is_featured = true dan discount_price = ${promoDiscountPrice} pada menu ${promoCandidate.name} (${promoCandidate.branch_name}) agar tampil paling atas di HP pelanggan.`,
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
      netProfit,
      expenseCategories,
      topMenus,
      lowStockMenus,
      unpaidInvoices,
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

    // 1. EKSEKUSI 1-KLIK: AKTIFKAN PROMO HARGA CORET
    if (action_type === 'promo_discount') {
      const { menu_id, discount_price } = body;
      if (!menu_id) {
        return NextResponse.json({ error: 'ID Menu tidak ditemukan' }, { status: 400 });
      }
      const { error } = await supabaseAdmin
        .from('menus')
        .update({
          is_featured: true,
          discount_price: Number(discount_price),
          status: 'available',
        })
        .eq('id', menu_id);

      if (error) throw error;
      return NextResponse.json({
        success: true,
        message: 'Promo Harga Coret & Label Unggulan berhasil diaktifkan di layar QR pelanggan!',
      });
    }

    // 2. EKSEKUSI 1-KLIK: NAIKKAN STOK OTOMATIS
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

    // 3. EKSEKUSI 1-KLIK: BUAT PAKET BUNDLING OTOMATIS
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

    // 4. MATIKAN PROMO HARGA CORET DARI TAB MENU & PROMO AKTIF
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
        })
        .eq('id', menu_id);

      if (error) throw error;
      return NextResponse.json({
        success: true,
        message: 'Promo pada menu berhasil dinonaktifkan.',
      });
    }

    // 5. TANYA-JAWAB EXECUTIVE AI ADVISOR (HEMAT TOKEN: RINGKASAN JSON KECIL)
    if (action_type === 'ask_ai') {
      const { question, ai_config, context_summary } = body;
      if (!question || !String(question).trim()) {
        return NextResponse.json({ error: 'Pertanyaan tidak boleh kosong' }, { status: 400 });
      }

      const provider = ai_config?.provider || 'gemini';
      const model = ai_config?.model || 'gemini-2.5-flash';
      const apiKey =
        ai_config?.apiKey?.trim() ||
        process.env.GEMINI_API_KEY ||
        process.env.DEEPSEEK_API_KEY ||
        process.env.OPENAI_API_KEY ||
        '';

      // Ringkasan JSON super ringkas agar biaya API < Rp 15.000/bulan
      const compactSummary = context_summary || { manager: manager_email, info: 'Ringkasan operasional NexaFlow' };
      const systemPrompt = `Anda adalah NexaFlow Executive AI Business Advisor untuk pemilik kafe/restoran multi-cabang di Indonesia. Jawab dalam Bahasa Indonesia yang ringkas, tajam, berbasis angka dari JSON berikut, dan berikan saran tindakan nyata (maksimal 3-4 kalimat). Data JSON Kafe: ${JSON.stringify(compactSummary)}`;

      if (!apiKey) {
        // Fallback cerdas berbasis data jika Owner belum menempelkan API Key di Pengaturan
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
            generationConfig: { temperature: 0.3, maxOutputTokens: 350 },
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
        // OpenAI-Compatible Endpoint (DeepSeek, Groq, OpenAI, OpenRouter)
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
            max_tokens: 350,
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