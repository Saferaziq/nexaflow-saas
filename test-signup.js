const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://scjfiaoqzyjrdpurhaoa.supabase.co';
const supabaseKey = 'sb_publishable_12m9XkRQEYAeCBPDyUuIqA_0EQMBGuo';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testSignup() {
  console.log("⏳ Mendaftarkan akun baru via API...");
  
  // 1. Daftarkan akun
  const { data, error } = await supabase.auth.signUp({
    email: 'admin@kafeuji.com',
    password: '123456',
    options: {
      data: { cafe_name: 'Kafe Uji Coba' }
    }
  });

  if (error) {
    console.error("❌ GAGAL DAFTAR:", error.message);
    if(error.message.includes('already registered')){
      console.log("👉 Akun sudah ada, langsung coba login saja.");
    }
  } else {
    console.log("✅ AKUN BERHASIL DIBUAT!");
    console.log("Cek tabel 'tenants' dan 'users' di Supabase, datanya otomatis terbuat.");
  }
}
testSignup();