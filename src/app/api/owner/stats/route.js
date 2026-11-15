import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const managerEmail = searchParams.get('manager_email');
    const period = searchParams.get('period') || 'weekly'; // daily, weekly, monthly

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // 1. Ambil data cabang MILIK manager ini saja
    let query = supabaseAdmin.from('tenants').select('id, name, is_active');
    if (managerEmail) query = query.eq('manager_email', managerEmail);
    
    const { data: tenants, error: tenantErr } = await query;
    if (tenantErr) throw tenantErr;

    if (!tenants || tenants.length === 0) {
      return NextResponse.json({ 
        totalRevenue: 0, totalTransactions: 0, totalBranches: 0, activeBranches: 0, 
        chartData: [0,0,0,0,0,0,0], labels: [], branchStats: {} 
      });
    }

    const tenantIds = tenants.map(t => t.id);

    // 2. Tentukan Rentang Waktu (Start Date)
    const now = new Date();
    let startDate = new Date();
    let labels = [];

    if (period === 'daily') {
      startDate.setHours(0, 0, 0, 0); // Hari ini jam 00:00
      labels = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
    } else if (period === 'monthly') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1); // Tanggal 1 bulan ini
      labels = ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4', 'Minggu 5'];
    } else {
      // Default: Weekly
      startDate.setDate(now.getDate() - 6); // 7 hari terakhir
      startDate.setHours(0, 0, 0, 0);
      labels = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
    }

    // 3. Ambil data pesanan sesuai rentang waktu
    const { data: orders, error: orderErr } = await supabaseAdmin
      .from('orders')
      .select('total_price, created_at, tenant_id')
      .eq('status', 'completed')
      .in('tenant_id', tenantIds)
      .gte('created_at', startDate.toISOString());
    
    if (orderErr) throw orderErr;

    // 4. Hitung Total Global
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_price), 0);
    const totalTransactions = orders.length;

    // 5. Siapkan Data Chart & Cabang
    let chartData = [0, 0, 0, 0, 0, 0, 0]; // Default 7
    if (period === 'daily') chartData = [0, 0, 0, 0, 0, 0, 0, 0];
    if (period === 'monthly') chartData = [0, 0, 0, 0, 0];
    
    const branchStats = {};
    tenantIds.forEach(id => { branchStats[id] = { revenue: 0, transactions: 0 }; });

    orders.forEach(order => {
      const orderDate = new Date(order.created_at);
      const amt = Number(order.total_price);
      
      // Hitung per cabang
      branchStats[order.tenant_id].revenue += amt;
      branchStats[order.tenant_id].transactions += 1;

      // Hitung Chart
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

    const chartDataJuta = chartData.map(val => Number((val / 1000000).toFixed(2)));

    return NextResponse.json({
      totalRevenue,
      totalTransactions,
      totalBranches: tenants.length,
      activeBranches: tenants.filter(t => t.is_active).length,
      chartData: chartDataJuta,
      labels,
      branchStats
    });

  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data statistik' }, { status: 500 });
  }
}