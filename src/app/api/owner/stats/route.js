import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const managerEmail = searchParams.get('manager_email');
    const period = searchParams.get('period') || 'daily';
    const dateStr = searchParams.get('date_str'); 

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
        totalRevenue: 0, totalTransactions: 0, activeBranches: 0, 
        chartData: [], labels: [], branchStats: {}, totalExpense: 0, netProfit: 0
      });
    }

    const tenantIds = tenants.map(t => t.id);

    let startDate = new Date();
    let endDate = new Date();
    let labels = [];

    // 🔥 PENGAMANAN PARSING TANGGAL 🔥
    try {
      if (period === 'daily') {
        const safeDate = dateStr ? dateStr : new Date().toLocaleDateString('en-CA');
        startDate = new Date(safeDate); startDate.setHours(0,0,0,0);
        endDate = new Date(safeDate); endDate.setHours(23,59,59,999);
        labels = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
      } else if (period === 'monthly') {
        const [year, month] = (dateStr || new Date().toISOString().slice(0,7)).split('-');
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
        startDate.setHours(0,0,0,0);
        
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23,59,59,999);
        labels = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
      }
    } catch (e) {
      console.log("Fallback date parsing error", e);
      startDate = new Date(); startDate.setHours(0,0,0,0);
      endDate = new Date(); endDate.setHours(23,59,59,999);
    }

    const [orderRes, expenseRes, empTransRes, empRes] = await Promise.all([
      supabaseAdmin.from('orders').select('total_price, created_at, tenant_id').eq('status', 'completed').in('tenant_id', tenantIds).gte('created_at', startDate.toISOString()).lte('created_at', endDate.toISOString()),
      supabaseAdmin.from('expenses').select('amount, tenant_id').in('tenant_id', tenantIds).gte('expense_date', startDate.toISOString()).lte('expense_date', endDate.toISOString()),
      supabaseAdmin.from('employee_transactions').select('amount, tenant_id').in('tenant_id', tenantIds).gte('transaction_date', startDate.toISOString()).lte('transaction_date', endDate.toISOString()),
      supabaseAdmin.from('employees').select('id, tenant_id').in('tenant_id', tenantIds)
    ]);

    const orders = orderRes.data || [];
    const expenses = expenseRes.data || [];
    const empTrans = empTransRes.data || [];
    const employees = empRes.data || [];

    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_price), 0);
    const totalExpense = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0) + empTrans.reduce((sum, trx) => sum + Number(trx.amount), 0);
    const netProfit = totalRevenue - totalExpense;

    let chartData = [];
    if (period === 'daily') chartData = [0, 0, 0, 0, 0, 0, 0, 0];
    if (period === 'monthly') chartData = [0, 0, 0, 0, 0];
    if (period === 'weekly') chartData = [0, 0, 0, 0, 0, 0, 0];
    
    const branchStats = {};
    tenantIds.forEach(id => { 
      branchStats[id] = { 
        revenue: 0, transactions: 0, 
        employeeCount: employees.filter(e => e.tenant_id === id).length 
      }; 
    });

    orders.forEach(order => {
      const orderDate = new Date(order.created_at);
      const amt = Number(order.total_price);
      
      branchStats[order.tenant_id].revenue += amt;
      branchStats[order.tenant_id].transactions += 1;

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
      totalRevenue, totalTransactions: orders.length,
      totalBranches: tenants.length, activeBranches: tenants.filter(t => t.is_active).length,
      chartData: chartDataJuta, labels, branchStats, totalExpense, netProfit
    });

  } catch (error) {
    console.error('Stats API Error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data statistik' }, { status: 500 });
  }
}