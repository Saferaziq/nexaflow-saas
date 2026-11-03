// Skrip Verifikasi NexaFlow SaaS
const http = require('http');

const routes = [
  { path: '/', name: 'Landing Page' },
  { path: '/login', name: 'Halaman Login Kasir' },
  { path: '/register', name: 'Halaman Pendaftaran Tenant' },
  { path: '/admin', name: 'Dashboard Super Admin' },
  { path: '/dashboard', name: 'Dashboard Kasir' },
  { path: '/order?tenant=test&table=1', name: 'Halaman Pengunjung (Order)' },
  { path: '/kitchen/placeholder', name: 'Kitchen Display' }
];

console.log('🚀 Memulai pengecekan rute aplikasi di server lokal...\n');
console.log('Pastikan Anda sudah menjalankan "npm run dev" di terminal lain.\n');

let successCount = 0;
let failCount = 0;

routes.forEach((route, index) => {
  setTimeout(() => {
    http.get(`http://localhost:3000${route.path}`, (res) => {
      if (res.statusCode >= 200 && res.statusCode < 400) {
        console.log(`✅ [OK] ${route.name} (${route.path}) - Status: ${res.statusCode}`);
        successCount++;
      } else {
        console.log(`❌ [GAGAL] ${route.name} (${route.path}) - Status: ${res.statusCode}`);
        failCount++;
      }
      
      if (index === routes.length - 1) {
        console.log(`\n📊 Hasil: ${successCount} Berhasil, ${failCount} Gagal.`);
        console.log('💡 Tips: Jika ada yang gagal, cek Console di browser (F12) saat membuka halaman tersebut.');
      }
    }).on('error', (err) => {
      console.log(`❌ [ERROR] ${route.name} (${route.path}) - Tidak dapat terhubung ke server.`);
      failCount++;
      if (index === routes.length - 1) {
        console.log(`\n📊 Hasil: ${successCount} Berhasil, ${failCount} Gagal.`);
      }
    });
  }, index * 500); // Jeda 0.5 detik antar request
});