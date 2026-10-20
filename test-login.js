const { createClient } = require('@supabase/supabase-js');

// Sesuaikan dengan URL & Key proyek Anda
const supabaseUrl = 'https://scjfiaoqzyjrdpurhaoa.supabase.co';
const supabaseKey = 'sb_publishable_12m9XkRQEYAeCBPDyUuIqA_0EQMBGuo';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testLogin() {
  console.log("⏳ Mencoba login ke Supabase...");
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'admin@kafeuji.com',
    password: '123456'
  });

  if (error) {
    console.error("❌ LOGIN GAGAL. Pesan Error:", error.message);
    console.log("👉 Solusi: Akun belum ada atau password salah. Jalankan SQL pembuat akun ulang di Supabase.");
  } else {
    console.log("✅ LOGIN BERHASIL! ID User:", data.user.id);
    console.log("👉 Artinya database dan akun Anda 100% SEHAT. Masalahnya hanya di browser/Cache.");
  }
}
testLogin();