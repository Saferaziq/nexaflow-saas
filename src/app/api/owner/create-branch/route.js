import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, manager_email } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Nama Cabang dan Email wajib diisi.' }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const defaultPassword = 'NexaFlow' + Math.floor(100000 + Math.random() * 900000) + '!';
    
    // 1. Buat Akun Auth untuk Kasir Cabang Baru
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email, password: defaultPassword, email_confirm: true
    });

    if (authError) {
      return NextResponse.json({ error: 'Email sudah terdaftar. Gunakan email lain.' }, { status: 400 });
    }

    // 2. Buat Data Tenant (Kafe/Cabang Baru)
    const { data: tenantData, error: tenantError } = await supabaseAdmin
      .from('tenants')
      .insert([{ name: name, is_active: true, is_open: true, subscription_status: 'trial', manager_email: manager_email || null }])
      .select().single();

    if (tenantError) {
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json({ error: 'Gagal membuat data cabang.' }, { status: 500 });
    }

    // 3. Hubungkan User (Kasir) ke Tenant (Cabang Baru)
    const { error: userError } = await supabaseAdmin
      .from('users')
      .insert([{ id: authData.user.id, tenant_id: tenantData.id, email: email, role: 'kasir' }]);

    if (userError) {
      await supabaseAdmin.from('tenants').delete().eq('id', tenantData.id);
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json({ error: 'Gagal menghubungkan user ke cabang.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: `Kafe "${name}" berhasil ditambahkan!` });
  } catch (error) {
    return NextResponse.json({ error: 'Terjadi kesalahan pada server: ' + error.message }, { status: 500 });
  }
}