import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const managerEmail = searchParams.get('manager_email');

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
      return NextResponse.json({ totalRevenue: 0, totalTransactions: 0, totalBranches: 0, activeBranches: 0, chartData: [0,0,0,0,0,0,0] });
    }

    const tenantIds = tenants.map(t => t.id);

    // 2. Ambil data pesanan HANYA dari cabang-cabang tersebut
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: orders, error: orderErr } = await supabaseAdmin
      .from('orders')
      .select('total_price, created_at')
      .eq('status', 'completed')
      .in('tenant_id', tenantIds) // <-- Filter berdasarkan cabang manager
      .gte('created_at', sevenDaysAgo.toISOString());
    
    if (orderErr) throw orderErr;

    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_price), 0);
    const totalTransactions = orders.length;

    const chartData = [0, 0, 0, 0, 0, 0, 0];
    orders.forEach(order => {
      const date = new Date(order.created_at);
      let dayIndex = date.getDay() - 1;
      if (dayIndex === -1) dayIndex = 6;
      chartData[dayIndex] += Number(order.total_price);
    });

    const chartDataJuta = chartData.map(val => Number((val / 1000000).toFixed(1)));

    return NextResponse.json({
      totalRevenue,
      totalTransactions,
      totalBranches: tenants.length,
      activeBranches: tenants.filter(t => t.is_active).length,
      chartData: chartDataJuta,
    });

  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data statistik' }, { status: 500 });
  }
}