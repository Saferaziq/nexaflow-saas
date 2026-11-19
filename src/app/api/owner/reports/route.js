import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const managerEmail = (searchParams.get('manager_email') || '').trim();
    const period = searchParams.get('period') || 'monthly';
    const dateStr = searchParams.get('date_str') || new Date().toISOString().slice(0, 7);
    const branchId = searchParams.get('branch_id') || 'all';

    if (!managerEmail) {
      return NextResponse.json({ error: 'manager_email wajib diisi.' }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: tenants, error: tenantErr } = await supabaseAdmin
      .from('tenants')
      .select('id, name')
      .ilike('manager_email', managerEmail)
      .order('created_at', { ascending: false });

    if (tenantErr) {
      return NextResponse.json({ error: tenantErr.message }, { status: 500 });
    }

    if (!tenants || tenants.length === 0) {
      return NextResponse.json({
        tenants: [],
        reports: [],
        plData: {
          revenue: 0,
          dailyExpense: 0,
          monthlyExpense: 0,
          salaryExpense: 0,
          actualSalaryTx: 0,
          pendingBaseSalary: 0,
          totalExpense: 0,
          netProfit: 0,
        },
      });
    }

    const allTenantIds = tenants.map((x) => x.id);
    const targetTenantIds =
      branchId && branchId !== 'all'
        ? allTenantIds.filter((id) => id === branchId)
        : allTenantIds;

    let startDate = new Date();
    let endDate = new Date();

    if (period === 'daily') {
      startDate = new Date(dateStr);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(dateStr);
      endDate.setHours(23, 59, 59, 999);
    } else if (period === 'monthly') {
      const [year, month] = dateStr.split('-').map(Number);
      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 0, 23, 59, 59, 999);
    } else if (period === 'weekly') {
      const [year, week] = dateStr.split('-W').map(Number);
      const simple = new Date(year, 0, 1 + (week - 1) * 7);
      const dow = simple.getDay();
      startDate = new Date(simple);
      if (dow <= 4) startDate.setDate(simple.getDate() - simple.getDay() + 1);
      else startDate.setDate(simple.getDate() + 8 - simple.getDay());
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
    }

    const startStr = startDate.toISOString();
    const endStr = endDate.toISOString();
    const safeTargetIds =
      targetTenantIds.length > 0
        ? targetTenantIds
        : ['00000000-0000-0000-0000-000000000000'];

    const [ordersRes, expensesRes, empTxRes, empRes] = await Promise.all([
      supabaseAdmin
        .from('orders')
        .select('id, tenant_id, customer_name, total_price, created_at, status, payment_status')
        .in('tenant_id', safeTargetIds)
        .gte('created_at', startStr)
        .lte('created_at', endStr)
        .order('created_at', { ascending: false }),
      supabaseAdmin
        .from('expenses')
        .select('id, tenant_id, category, amount, expense_date')
        .in('tenant_id', safeTargetIds)
        .gte('expense_date', startStr)
        .lte('expense_date', endStr),
      supabaseAdmin
        .from('employee_transactions')
        .select('id, employee_id, tenant_id, type, amount, transaction_date')
        .in('tenant_id', safeTargetIds)
        .gte('transaction_date', startStr)
        .lte('transaction_date', endStr),
      supabaseAdmin
        .from('employees')
        .select('id, tenant_id, name, base_salary, is_active')
        .in('tenant_id', safeTargetIds),
    ]);

    const rawOrders = ordersRes.data || [];
    const validOrders = rawOrders.filter((o) => o.status !== 'cancelled');
    const mappedOrders = validOrders.map((o) => ({
      ...o,
      branchName: tenants.find((x) => x.id === o.tenant_id)?.name || 'Cabang',
    }));

    const exps = expensesRes.data || [];
    const empTx = empTxRes.data || [];
    const empList = empRes.data || [];

    const totalRevenue = validOrders
      .filter((o) => o.payment_status === 'PAID' || o.status === 'completed')
      .reduce((sum, o) => sum + Number(o.total_price || 0), 0);

    const dailyExpense = exps
      .filter((e) => e.category === 'Harian')
      .reduce((sum, e) => sum + Number(e.amount || 0), 0);

    const monthlyExpense = exps
      .filter((e) => e.category !== 'Harian')
      .reduce((sum, e) => sum + Number(e.amount || 0), 0);

    const actualSalaryTx = empTx.reduce((sum, e) => sum + Number(e.amount || 0), 0);

    let pendingBaseSalary = 0;
    if (period === 'monthly') {
      const paidEmployeeIds = new Set(
        empTx.filter((tx) => tx.type === 'Gaji').map((tx) => tx.employee_id)
      );
      pendingBaseSalary = empList
        .filter((emp) => emp.is_active && !paidEmployeeIds.has(emp.id))
        .reduce((sum, emp) => sum + Number(emp.base_salary || 0), 0);
    }

    const salaryExpense = actualSalaryTx + pendingBaseSalary;
    const totalExpense = dailyExpense + monthlyExpense + salaryExpense;
    const netProfit = totalRevenue - totalExpense;

    return NextResponse.json({
      tenants,
      reports: mappedOrders,
      plData: {
        revenue: totalRevenue,
        dailyExpense,
        monthlyExpense,
        salaryExpense,
        actualSalaryTx,
        pendingBaseSalary,
        totalExpense,
        netProfit,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: 'Terjadi kesalahan server: ' + err.message }, { status: 500 });
  }
}