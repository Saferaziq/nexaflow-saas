import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, manager_email } = body;

    if (!email || !manager_email) {
      return NextResponse.json({ error: 'Email kasir wajib diisi.' }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // 1. Cari user berdasarkan email kasir di tabel users
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, tenant_id, email')
      .eq('email', email)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: 'Kafe dengan email kasir tersebut tidak ditemukan.' }, { status: 404 });
    }

    const tenantId = userData.tenant_id;

    // 2. Cek apakah kafe sudah punya manager
    const { data: tenantData, error: tenantError } = await supabaseAdmin
      .from('tenants')
      .select('manager_email, name')
      .eq('id', tenantId)
      .single();

    if (tenantError) {
      return NextResponse.json({ error: 'Gagal mengambil data kafe.' }, { status: 500 });
    }

    if (tenantData.manager_email && tenantData.manager_email !== manager_email) {
      return NextResponse.json({ error: `Kafe "${tenantData.name}" sudah dikelola oleh Owner lain.` }, { status: 400 });
    }

    // 3. Hubungkan kafe ke Manager (update kolom manager_email)
    const { error: updateError } = await supabaseAdmin
      .from('tenants')
      .update({ manager_email: manager_email })
      .eq('id', tenantId);

    if (updateError) {
      return NextResponse.json({ error: 'Gagal menghubungkan kafe: ' + updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: `Kafe "${tenantData.name}" berhasil dihubungkan!` });
  } catch (error) {
    return NextResponse.json({ error: 'Terjadi kesalahan pada server: ' + error.message }, { status: 500 });
  }
}