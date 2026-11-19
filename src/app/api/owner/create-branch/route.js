import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, manager_email } = body;

    const cleanName = String(name || '').trim();
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanManagerEmail = manager_email ? String(manager_email).trim().toLowerCase() : null;

    if (!cleanName || !cleanEmail) {
      return NextResponse.json({ error: 'Nama Cabang dan Email wajib diisi.' }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json({ error: 'Format email tidak valid.' }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // 1. Cek apakah email kasir sudah terdaftar di tabel users
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id, tenant_id, email')
      .ilike('email', cleanEmail)
      .maybeSingle();

    if (existingUser) {
      if (existingUser.tenant_id) {
        const { data: existingTenant, error: fetchTenantErr } = await supabaseAdmin
          .from('tenants')
          .select('id, name, manager_email')
          .eq('id', existingUser.tenant_id)
          .maybeSingle();

        if (fetchTenantErr || !existingTenant) {
          return NextResponse.json({ error: 'Data kafe untuk email ini tidak ditemukan.' }, { status: 404 });
        }

        if (
          existingTenant.manager_email &&
          cleanManagerEmail &&
          existingTenant.manager_email.toLowerCase() !== cleanManagerEmail
        ) {
          return NextResponse.json(
            { error: 'Kafe ini sudah terhubung ke akun owner lain.' },
            { status: 400 }
          );
        }

        const { error: linkErr } = await supabaseAdmin
          .from('tenants')
          .update({ manager_email: cleanManagerEmail })
          .eq('id', existingTenant.id);

        if (linkErr) {
          return NextResponse.json(
            { error: 'Gagal menghubungkan kafe ke dashboard Anda: ' + linkErr.message },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          message: `Kafe "${existingTenant.name}" berhasil dihubungkan ke dashboard Anda!`,
        });
      }

      // Jika user sudah ada tapi belum punya tenant_id
      const { data: newTenantForExisting, error: newTenantErr } = await supabaseAdmin
        .from('tenants')
        .insert([{
          name: cleanName,
          is_active: true,
          is_open: true,
          subscription_status: 'trial',
          manager_email: cleanManagerEmail,
        }])
        .select()
        .single();

      if (newTenantErr) {
        return NextResponse.json({ error: 'Gagal membuat data cabang: ' + newTenantErr.message }, { status: 500 });
      }

      const { error: updateUserErr } = await supabaseAdmin
        .from('users')
        .update({ tenant_id: newTenantForExisting.id })
        .eq('id', existingUser.id);

      if (updateUserErr) {
        await supabaseAdmin.from('tenants').delete().eq('id', newTenantForExisting.id);
        return NextResponse.json(
          { error: 'Gagal menghubungkan user ke cabang: ' + updateUserErr.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `Kafe "${cleanName}" berhasil ditambahkan!`,
      });
    }

    // 2. Jika email belum terdaftar, buat akun Auth baru
    const defaultPassword = 'NexaFlow' + Math.floor(100000 + Math.random() * 900000) + '!';

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: cleanEmail,
      password: defaultPassword,
      email_confirm: true,
    });

    if (authError) {
      return NextResponse.json(
        { error: authError.message || 'Email sudah terdaftar atau gagal membuat akun.' },
        { status: 400 }
      );
    }

    // 3. Buat Data Tenant (Kafe/Cabang Baru)
    const { data: tenantData, error: tenantError } = await supabaseAdmin
      .from('tenants')
      .insert([{
        name: cleanName,
        is_active: true,
        is_open: true,
        subscription_status: 'trial',
        manager_email: cleanManagerEmail,
      }])
      .select()
      .single();

    if (tenantError) {
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json({ error: 'Gagal membuat data cabang: ' + tenantError.message }, { status: 500 });
    }

    // 4. Hubungkan User (Kasir) ke Tenant (pakai upsert agar aman jika ada trigger DB)
    const { error: userError } = await supabaseAdmin
      .from('users')
      .upsert(
        [{ id: authData.user.id, tenant_id: tenantData.id, email: cleanEmail, role: 'kasir' }],
        { onConflict: 'id' }
      );

    if (userError) {
      await supabaseAdmin.from('tenants').delete().eq('id', tenantData.id);
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: 'Gagal menghubungkan user ke cabang: ' + userError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: `Kafe "${cleanName}" berhasil ditambahkan!` });
  } catch (error) {
    return NextResponse.json({ error: 'Terjadi kesalahan pada server: ' + error.message }, { status: 500 });
  }
}