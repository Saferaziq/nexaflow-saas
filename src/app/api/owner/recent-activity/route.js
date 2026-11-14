import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: orders, error } = await supabaseAdmin
      .from('orders')
      .select('id, total_price, created_at, customer_name, tenant_id, tenants(name)')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) throw error;

    return NextResponse.json(orders);
  } catch (error) {
    console.error('API Recent Activity Error:', error);
    return NextResponse.json({ error: 'Gagal mengambil aktivitas' }, { status: 500 });
  }
}