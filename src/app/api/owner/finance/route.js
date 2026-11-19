import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, manager_email, payload } = body;
    const cleanManagerEmail = String(manager_email || '').trim();

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: tenants } = await supabaseAdmin
      .from('tenants')
      .select('id')
      .ilike('manager_email', cleanManagerEmail);
    if (!tenants || tenants.length === 0) throw new Error('Tenant tidak ditemukan');
    const tenantIds = tenants.map(t => t.id);

    if (action === 'add_expense') {
      if (!tenantIds.includes(payload.tenant_id)) throw new Error('Akses ditolak');
      const { error } = await supabaseAdmin.from('expenses').insert([payload]);
      if (error) throw error;
      return NextResponse.json({ success: true, message: 'Pengeluaran dicatat!' });
    }

    if (action === 'add_employee') {
      if (!tenantIds.includes(payload.tenant_id)) throw new Error('Akses ditolak');
      const { error } = await supabaseAdmin.from('employees').insert([{
        id: crypto.randomUUID(),
        tenant_id: payload.tenant_id,
        name: payload.name,
        role: payload.role || 'Kasir',
        base_salary: Number(payload.base_salary || 0),
        wa_number: payload.wa_number || '',
        address: payload.address || '',
        bank_name: payload.bank_name || '',
        bank_account: payload.bank_account || '',
        is_active: true,
      }]);
      if (error) throw error;
      return NextResponse.json({ success: true, message: 'Karyawan ditambahkan!' });
    }

    if (action === 'edit_employee') {
      if (!tenantIds.includes(payload.tenant_id)) throw new Error('Akses ditolak');
      const { error } = await supabaseAdmin.from('employees').update({
        name: payload.name,
        role: payload.role,
        base_salary: payload.base_salary,
        wa_number: payload.wa_number,
        address: payload.address,
        bank_name: payload.bank_name,
        bank_account: payload.bank_account
      }).eq('id', payload.id).in('tenant_id', tenantIds);
      if (error) throw error;
      return NextResponse.json({ success: true, message: 'Karyawan diperbarui!' });
    }

    if (action === 'add_emp_transaction') {
      if (!tenantIds.includes(payload.tenant_id)) throw new Error('Akses ditolak');
      const { error } = await supabaseAdmin.from('employee_transactions').insert([payload]);
      if (error) throw error;
      return NextResponse.json({ success: true, message: 'Transaksi karyawan dicatat!' });
    }

    if (action === 'delete_expense') {
      const { error } = await supabaseAdmin.from('expenses').delete().eq('id', payload.id).in('tenant_id', tenantIds);
      if (error) throw error;
      return NextResponse.json({ success: true, message: 'Pengeluaran dihapus!' });
    }

    if (action === 'delete_employee') {
      const { error } = await supabaseAdmin
        .from('employees')
        .update({ is_active: false })
        .eq('id', payload.id)
        .in('tenant_id', tenantIds);
      if (error) throw error;
      return NextResponse.json({
        success: true,
        message: 'Karyawan dinonaktifkan. Riwayat gaji & kasbon tetap tersimpan.'
      });
    }

    if (action === 'restore_employee') {
      const { error } = await supabaseAdmin
        .from('employees')
        .update({ is_active: true })
        .eq('id', payload.id)
        .in('tenant_id', tenantIds);
      if (error) throw error;
      return NextResponse.json({ success: true, message: 'Karyawan diaktifkan kembali!' });
    }

    if (action === 'update_menu_stock') {
      if (!tenantIds.includes(payload.tenant_id)) throw new Error('Akses ditolak');
      const nextStock = Math.max(0, Number(payload.new_stock || 0));
      const nextStatus = nextStock > 0 ? 'available' : 'soldout';
      const { error } = await supabaseAdmin
        .from('menus')
        .update({
          stock: nextStock,
          status: nextStatus,
        })
        .eq('id', payload.menu_id)
        .eq('tenant_id', payload.tenant_id);

      if (error) throw error;
      return NextResponse.json({
        success: true,
        message: `Stok menu berhasil diperbarui menjadi ${nextStock} pcs (${nextStatus})!`,
      });
    }

    return NextResponse.json({ error: 'Aksi tidak dikenal' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const manager_email = String(searchParams.get('manager_email') || '').trim();

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: tenants } = await supabaseAdmin
      .from('tenants')
      .select('id, name')
      .ilike('manager_email', manager_email);
    if (!tenants || tenants.length === 0) return NextResponse.json({ expenses: [], employees: [], transactions: [], menus: [], tenants: [] });
    const tenantIds = tenants.map(t => t.id);

    const [expensesRes, empRes, transRes, menusRes] = await Promise.all([
      supabaseAdmin.from('expenses').select('*').in('tenant_id', tenantIds).order('expense_date', { ascending: false }),
      supabaseAdmin.from('employees').select('*').in('tenant_id', tenantIds).order('name', { ascending: true }),
      supabaseAdmin.from('employee_transactions').select('*').in('tenant_id', tenantIds).order('transaction_date', { ascending: false }),
      supabaseAdmin.from('menus').select('id, tenant_id, name, category, price, stock, status').in('tenant_id', tenantIds).order('stock', { ascending: true })
    ]);

    return NextResponse.json({
      expenses: expensesRes.data || [],
      employees: empRes.data || [],
      transactions: transRes.data || [],
      menus: menusRes.data || [],
      tenants: tenants || []
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
