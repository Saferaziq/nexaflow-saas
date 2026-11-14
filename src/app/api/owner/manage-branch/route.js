import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { tenant_id, action, name, email } = body;

    if (!tenant_id || !action) {
      return NextResponse.json({ error: 'Data tidak lengkap.' }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    if (action === 'edit') {
      // 1. Update Nama Tenant
      const { error: tenantErr } = await supabaseAdmin
        .from('tenants')
        .update({ name })
        .eq('id', tenant_id);
        
      if (tenantErr) throw tenantErr;

      // 2. Update Email Kasir (Jika diubah)
      if (email) {
        const { data: userData } = await supabaseAdmin.from('users').select('id').eq('tenant_id', tenant_id).single();
        if (userData) {
          await supabaseAdmin.auth.admin.updateUserById(userData.id, { email });
          await supabaseAdmin.from('users').update({ email }).eq('tenant_id', tenant_id);
        }
      }
      return NextResponse.json({ success: true, message: 'Cabang berhasil diperbarui.' });
    }

    if (action === 'toggle_active') {
      // Ambil status saat ini
      const { data: tenant } = await supabaseAdmin.from('tenants').select('is_active').eq('id', tenant_id).single();
      const newStatus = !tenant.is_active;

      // Update status tenant
      const { error } = await supabaseAdmin.from('tenants').update({ is_active: newStatus }).eq('id', tenant_id);
      if (error) throw error;

      return NextResponse.json({ success: true, message: `Cabang berhasil di ${newStatus ? 'aktifkan' : 'suspend'}.` });
    }

    return NextResponse.json({ error: 'Aksi tidak dikenal.' }, { status: 400 });
  } catch (error) {
    console.error('API Manage Branch Error:', error);
    return NextResponse.json({ error: error.message || 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}