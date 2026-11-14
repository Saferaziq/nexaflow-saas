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

    // Cari ID tenant milik manager ini
    let tenantIds = [];
    if (managerEmail) {
      const { data: tenants } = await supabaseAdmin.from('tenants').select('id').eq('manager_email', managerEmail);
      if (tenants) tenantIds = tenants.map(t => t.id);
    }

    let query = supabaseAdmin
      .from('orders')
      .select('id, total_price, created_at, customer_name, tenant_id, tenants(name)')
      .order('created_at', { ascending: false })
      .limit(5);

    // Jika managerEmail ada, filter hanya untuk cabangnya saja
    if (managerEmail && tenantIds.length > 0) {
      query = query.in('tenant_id', tenantIds);
    } else if (managerEmail) {
      return NextResponse.json([]); // Jika belum punya cabang, kosongkan
    }

    const { data: orders, error } = await query;
    if (error) throw error;

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil aktivitas' }, { status: 500 });
  }
}