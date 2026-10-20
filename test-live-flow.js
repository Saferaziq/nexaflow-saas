const { createClient } = require('@supabase/supabase-js');

// Koneksi ke Supabase Production Anda
const supabaseUrl = 'https://scjfiaoqzyjrdpurhaoa.supabase.co';
const supabaseKey = 'sb_publishable_12m9XkRQEYAeCBPDyUuIqA_0EQMBGuo';
const supabase = createClient(supabaseUrl, supabaseKey);

const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function simulasiLive() {
  console.log("🚀 MEMULAI SIMULASI LIVE FLOW (PELANGGAN -> KASIR)...\n");

  // 1. Login Admin untuk mendapatkan Tenant ID
  console.log("🔐 Login Admin...");
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin@kafeuji.com',
    password: '123456'
  });
  if (authError) return console.log("❌ Gagal Login:", authError.message);
  
  const { data: userData } = await supabase.from('users').select('tenant_id').eq('id', authData.user.id).single();
  const tenantId = userData.tenant_id;
  console.log(`✅ Terhubung ke Kafe ID: ${tenantId}\n`);

  // 2. SIMULASI PELANGGAN SCAN QR (Meja 9)
  console.log("📱 [PELANGGAN] Scan QR Meja 9 dan memesan 2 Nasi Goreng, 2 Es Teh...");
  const orderData = {
    tenant_id: tenantId,
    table_number: '9',
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
  
  console.log(`✅ [PELANGGAN] Pesanan terkirim! (ID: ${order.id.slice(0,8)})`);
  console.log(`👉 CEK LAYAR BROWSER ANDA: Pesanan Meja 9 harusnya muncul sekarang!`);
  await delay(6000); // Jeda 6 detik agar Anda bisa melihat browser

  // 3. SIMULASI PENJUAL KLIK "MASAK"
  console.log("\n👨‍🍳 [KASIR] Menekan tombol 'Masak'...");
  await supabase.from('orders').update({ status: 'cooking' }).eq('id', order.id);
  console.log("✅ Status di database berubah: DIMASAK.");
  console.log(`👉 CEK BROWSER: Kartu Meja 9 berubah warna jadi Biru.`);
  await delay(6000);

  // 4. SIMULASI PENJUAL KLIK "SAJIKAN"
  console.log("\n🍽️ [KASIR] Menekan tombol 'Sajikan'...");
  await supabase.from('orders').update({ status: 'ready' }).eq('id', order.id);
  console.log("✅ Status di database berubah: SIAP DISAJIKAN.");
  console.log(`👉 CEK BROWSER: Kartu Meja 9 berubah warna jadi Hijau.`);
  await delay(6000);

  // 5. SIMULASI PENJUAL KLIK "SELESAI / LUNAS"
  console.log("\n💵 [KASIR] Menekan tombol 'Selesai / Lunas'...");
  await supabase.from('orders').update({ status: 'completed', payment_status: 'paid' }).eq('id', order.id);
  console.log("✅ Status di database berubah: SELESAI & LUNAS.");
  console.log(`👉 CEK BROWSER: Pesanan Meja 9 hilang dari tab "Aktif", dan Omset Hari Ini bertambah Rp 60.000.`);
  
  console.log("\n🎉 SIMULASI LIVE FLOW SELESAI!");
}

simulasiLive();