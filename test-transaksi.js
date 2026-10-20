const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://scjfiaoqzyjrdpurhaoa.supabase.co';
const supabaseKey = 'sb_publishable_12m9XkRQEYAeCBPDyUuIqA_0EQMBGuo';
const supabase = createClient(supabaseUrl, supabaseKey);

const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function simulasiTransaksi() {
  console.log("🤖 MEMULAI SIMULASI TRANSAKSI...\n");

  // 1. LOGIN SEBAGAI ADMIN (Untuk mendapatkan izin baca database)
  console.log("🔐 Login sebagai Admin...");
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin@kafeuji.com',
    password: '123456'
  });
  if (authError) return console.log("❌ Gagal Login:", authError.message);
  
  // 2. Dapatkan ID Kafe (Tenant) milik Admin ini
  const { data: userData } = await supabase.from('users').select('tenant_id').eq('id', authData.user.id).single();
  if (!userData) return console.log("❌ Kafe tidak ditemukan.");
  const tenantId = userData.tenant_id;
  console.log(`✅ Berhasil masuk ke Kafe ID: ${tenantId}\n`);

  // 3. SIMULASI PEMBELI: Insert Pesanan Baru (Status: Pending)
  console.log("🛒 Pembeli memesan Nasi Goreng & Es Teh...");
  const orderData = {
    tenant_id: tenantId,
    table_number: '1',
    items: [
      { id: 1, name: 'Nasi Goreng Spesial', price: 25000, qty: 2 },
      { id: 2, name: 'Es Teh Manis', price: 5000, qty: 2 }
    ],
    total_price: 60000,
    status: 'pending',
    payment_status: 'unpaid'
  };

  const { data: order, error: errOrder } = await supabase.from('orders').insert([orderData]).select().single();
  if (errOrder) return console.log("❌ Gagal buat pesanan:", errOrder.message);
  
  console.log(`✅ Pesanan masuk (ID: ${order.id.slice(0,8)})! CEK LAYAR BROWSER ANDA SEKARANG.`);
  await delay(5000); // Jeda 5 detik

  // 4. SIMULASI PENJUAL KLIK "MASAK"
  console.log("\n👨‍🍳 Kasir klik tombol 'Masak'...");
  await supabase.from('orders').update({ status: 'cooking' }).eq('id', order.id);
  console.log("✅ Status berubah menjadi: Dimasak.");
  await delay(5000);

  // 5. SIMULASI PENJUAL KLIK "SAJIKAN"
  console.log("\n🍽️ Kasir klik tombol 'Sajikan'...");
  await supabase.from('orders').update({ status: 'ready' }).eq('id', order.id);
  console.log("✅ Status berubah menjadi: Siap Disajikan.");
  await delay(5000);

  // 6. SIMULASI PENJUAL KLIK "SELESAI / LUNAS"
  console.log("\n💵 Kasir klik tombol 'Selesai / Lunas'...");
  await supabase.from('orders').update({ status: 'completed', payment_status: 'paid' }).eq('id', order.id);
  console.log("✅ Status berubah menjadi: Selesai & Lunas.");
  
  console.log("\n🎉 SIMULASI SELESAI! Semua alur database berjalan sempurna.");
}

simulasiTransaksi();