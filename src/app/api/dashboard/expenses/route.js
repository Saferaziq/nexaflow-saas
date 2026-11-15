import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    // Berikan nilai default 'Operasional' jika category tidak dikirim
    const { tenant_id, category = 'Operasional', description, quantity, unit_price } = body;

    if (!tenant_id || !description || !quantity || !unit_price) {
      return NextResponse.json({ error: 'Data tidak lengkap. Pastikan nama barang, qty, dan harga terisi.' }, { status: 400 });
    }

    const total_amount = Number(quantity) * Number(unit_price);

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabaseAdmin
      .from('expenses')
      .insert([{
        tenant_id,
        category,
        description,
        quantity: Number(quantity),
        unit_price: Number(unit_price),
        amount: total_amount
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Pengeluaran berhasil dicatat!', data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}