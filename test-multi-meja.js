const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://scjfiaoqzyjrdpurhaoa.supabase.co';
const supabaseKey = 'sb_publishable_12m9XkRQEYAeCBPDyUuIqA_0EQMBGuo';
const supabase = createClient(supabaseUrl, supabaseKey);

const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function simulasiBanyakMeja() {
  console.log("🔥 MEMULAI SIMULASI 3 MEJA BERBEDA...\n");

  // 1. Login
  console.log("🔐 Login Admin...");
  const { data: authData } = await supabase.auth.signInWithPassword({ email: 'admin@kafeuji.com', password: '123456' });
  const { data: userData } = await supabase.from('users').select('tenant_id').eq('id', authData.user.id).single();
  const tenantId = userData.tenant_id;
  console.log("✅ Login Berhasil.\n");

  // Helper untuk buat pesanan
  const buatPesanan = async (meja, menu, total) => {
    const orderData = {
      tenant_id: tenantId,
      table_number: meja,
      items: menu,
      total_price: total,
      status: 'pending',
      payment_status: 'unpaid'
    };
    const { data } = await supabase.from('orders').insert([orderData]).select().single();
    return data;
  };

  // 2. Masukkan 3 Pesanan sekaligus dari Meja 1, 2, dan 3
  console.log("🛒 Pelanggan Meja 1, 2, dan 3 memesan bersamaan...");
  const order1 = await buatPesanan('1', [{ id: 1, name: 'Nasi Goreng', price: 25000, qty: 1 }], 25000);
  const order2 = await buatPesanan('2', [{ id: 2, name: 'Mie Ayam', price: 20000, qty: 2 }], 40000);
  const order3 = await buatPesanan('3', [{ id: 3, name: 'Es Jeruk', price: 7000, qty: 3 }], 21000);
  
  console.log("✅ 3 Pesanan masuk (Meja 1, 2, 3)!");
  console.log("👉 CEK BROWSER ANDA SEKARANG. Akan ada 3 kartu pesanan baru.\n");
  await delay(5000);

  // 3. Ubah Status Pesanan Meja 1 menjadi "Masak"
  console.log("👨‍🍳 Kasir memproses Meja 1 (Masak)...");
  await supabase.from('orders').update({ status: 'cooking' }).eq('id', order1.id);
  await delay(4000);

  // 4. Ubah Status Pesanan Meja 2 menjadi "Siap"
  console.log("🍽️ Kasir menyajikan Meja 2 (Siap)...");
  await supabase.from('orders').update({ status: 'ready' }).eq('id', order2.id);
  await delay(4000);

  // 5. Selesaikan Pesanan Meja 3
  console.log("💵 Kasir menyelesaikan Meja 3 (Lunas)...");
  await supabase.from('orders').update({ status: 'completed', payment_status: 'paid' }).eq('id', order3.id);

  console.log("\n🎉 SIMULASI MULTI-MEJA SELESAI!");
  console.log("Perhatikan di browser: Meja 1 (Dimasak), Meja 2 (Siap), dan Meja 3 (Hilang dari antrian aktif karena sudah selesai).");
}

simulasiBanyakMeja();