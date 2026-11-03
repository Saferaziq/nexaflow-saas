const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ERROR: Kredensial Supabase tidak ditemukan di .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runSimulation() {
  console.log('🚀 MEMULAI SIMULASI END-TO-END NEXAFLOW\n');

  // 1. Ambil Tenant ID
  console.log('1️⃣  Mengambil data Tenant...');
  const { data: tenant, error: tErr } = await supabase.from('tenants').select('*').limit(1).single();
  if (tErr || !tenant) return console.error('❌ Gagal ambil tenant:', tErr?.message);
  console.log(`   ✅ Tenant ditemukan: ${tenant.name}`);

  // 2. Ambil Menu
  console.log('\n2️⃣  Mengambil menu untuk dipesan...');
  const { data: menu, error: mErr } = await supabase.from('menus').select('*').eq('tenant_id', tenant.id).limit(1).single();
  if (mErr || !menu) return console.error('❌ Gagal ambil menu. Pastikan ada menu.', mErr?.message);
  console.log(`   ✅ Menu dipilih: ${menu.name} (Rp ${menu.price})`);

  // 3. PELANGGAN MEMESAN
  console.log('\n3️⃣  [PELANGGAN] Membuat pesanan baru...');
  const orderData = {
    tenant_id: tenant.id,
    table_number: '99',
    customer_name: 'Budi Simulasi',
    order_note: 'Tolong pedas',
    items: [{ ...menu, qty: 2, note: '' }],
    subtotal: menu.price * 2,
    tax_amount: 0,
    total_price: menu.price * 2,
    status: 'pending',
    payment_status: 'unpaid',
    payment_method: 'cash'
  };

  const { data: newOrder, error: oErr } = await supabase.from('orders').insert([orderData]).select().single();
  if (oErr) return console.error('❌ Gagal buat pesanan:', oErr.message);
  console.log(`   ✅ Pesanan berhasil dibuat! (Order ID: ${newOrder.id})`);

  // 4. KASIR MEMPROSES
  console.log('\n4️⃣  [KASIR] Memproses pesanan (Ubah ke Dimasak)...');
  await new Promise(r => setTimeout(r, 1500));
  const { error: cErr } = await supabase.from('orders').update({ status: 'cooking' }).eq('id', newOrder.id);
  if (cErr) return console.error('❌ Gagal update status:', cErr.message);
  console.log('   ✅ Status berubah menjadi: COOKING (Dimasak)');

  // 5. DAPUR MENYELESAIKAN
  console.log('\n5️⃣  [DAPUR] Menandai pesanan siap saji...');
  await new Promise(r => setTimeout(r, 1500));
  const { error: rErr } = await supabase.from('orders').update({ status: 'ready' }).eq('id', newOrder.id);
  if (rErr) return console.error('❌ Gagal update status:', rErr.message);
  console.log('   ✅ Status berubah menjadi: READY (Siap)');

  // 6. KASIR MENYELESAIKAN
  console.log('\n6️⃣  [KASIR] Menyelesaikan pesanan (Bayar)...');
  await new Promise(r => setTimeout(r, 1500));
  const { error: dErr } = await supabase.from('orders').update({ status: 'completed', payment_status: 'paid' }).eq('id', newOrder.id);
  if (dErr) return console.error('❌ Gagal update status:', dErr.message);
  console.log('   ✅ Status berubah menjadi: COMPLETED (Selesai) & PAID');

  // 7. VERIFIKASI RIWAYAT & LAPORAN
  console.log('\n7️⃣  [SISTEM] Verifikasi Riwayat & Laporan...');
  const { data: finalOrder, error: fErr } = await supabase.from('orders').select('*').eq('id', newOrder.id).single();
  
  if (fErr) return console.error('❌ Gagal verifikasi:', fErr.message);
  
  console.log(`   ✅ Pesanan ditemukan di Riwayat.`);
  console.log(`   ✅ Total Omset tercatat: Rp ${finalOrder.total_price}`);
  console.log(`   ✅ Status akhir: ${finalOrder.status} | Pembayaran: ${finalOrder.payment_status}`);

  console.log('\n🎉 SIMULASI SELESAI! Semua sistem berjalan normal.');
  console.log('\n📌 LANGKAH SELANJUTNYA (Manual di Browser):');
  console.log('1. Buka Dashboard Kasir dan pastikan pesanan "Meja 99" ada di tab "Selesai".');
  console.log('2. Buka Tab Laporan, cek apakah total omset bertambah sesuai simulasi.');
  console.log('3. Coba klik tombol "Cetak Bill" pada pesanan tersebut.');
}

runSimulation();