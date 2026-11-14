import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // 1. Ambil semua data cabang
    const { data: tenants, error: tenantErr } = await supabaseAdmin.from('tenants').select('id, name, is_active');
    if (tenantErr) throw tenantErr;

    // 2. Ambil data pesanan yang completed (7 hari terakhir untuk chart)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: orders, error: orderErr } = await supabaseAdmin
      .from('orders')
      .select('total_price, created_at')
      .eq('status', 'completed')
      .gte('created_at', sevenDaysAgo.toISOString());
    
    if (orderErr) throw orderErr;

    // 3. Hitung Total Omset & Transaksi
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_price), 0);
    const totalTransactions = orders.length;

    // 4. Siapkan data Chart (Agregasi per Hari)
    const chartData = [0, 0, 0, 0, 0, 0, 0]; // Senin - Minggu
    const labels = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
    
    orders.forEach(order => {
      const date = new Date(order.created_at);
      let dayIndex = date.getDay() - 1; // getDay() 0 = Minggu
      if (dayIndex === -1) dayIndex = 6; // Set Minggu ke index 6
      chartData[dayIndex] += Number(order.total_price);
    });

    // Ubah ke format Juta (misal: 12500000 -> 12.5)
    const chartDataJuta = chartData.map(val => Number((val / 1000000).toFixed(1)));

    return NextResponse.json({
      totalRevenue,
      totalTransactions,
      totalBranches: tenants.length,
      activeBranches: tenants.filter(t => t.is_active).length,
      chartData: chartDataJuta,
      labels
    });

  } catch (error) {
    console.error('Stats API Error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data statistik' }, { status: 500 });
  }
}