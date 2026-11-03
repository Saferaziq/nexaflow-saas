const fs = require('fs');
const path = require('path');

const APP_DIR = path.join(__dirname, 'src', 'app');

// Fungsi untuk mencari semua file .js di dalam folder src/app
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (file.endsWith('.js')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

console.log('🔍 Memindai seluruh tombol di aplikasi NexaFlow...\n');

const allFiles = getAllFiles(APP_DIR);
let totalTombol = 0;
let tombolBermasalah = 0;

allFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    // Mencari tag <button>
    if (line.includes('<button')) {
      totalTombol++;
      
      // Cek apakah ada onClick
      if (!line.includes('onClick')) {
        // Abaikan jika tombol berada di dalam form submit
        if (!line.includes('type="submit"')) {
          console.log(`⚠️  [TANPA ONCLICK] ${file.replace(__dirname, '')} (Baris ${index + 1})`);
          console.log(`    Kode: ${line.trim().substring(0, 80)}...\n`);
          tombolBermasalah++;
        }
      } 
      // Cek apakah onClick kosong () => {}
      else if (line.includes('onClick={() => {}}') || line.includes('onClick={() => { }}')) {
        console.log(`❌ [ONCLICK KOSONG] ${file.replace(__dirname, '')} (Baris ${index + 1})`);
        console.log(`    Kode: ${line.trim().substring(0, 80)}...\n`);
        tombolBermasalah++;
      }
    }
  });
});

console.log('====================================');
console.log(`📊 Total Tombol Ditemukan: ${totalTombol}`);
console.log(`✅ Tombol Berfungsi: ${totalTombol - tombolBermasalah}`);
console.log(`⚠️ Tombol Bermasalah (Kosong/Tanpa Aksi): ${tombolBermasalah}`);
console.log('====================================');

if (tombolBermasalah > 0) {
  console.log('\n💡 SARAN PERBAIKAN:');
  console.log('1. Buka file yang ditandai di atas.');
  console.log('2. Pastikan setiap <button> memiliki onClick yang jelas.');
  console.log('3. Jika tombol memang tidak butuh aksi (misal tombol dekorasi), abaikan peringatan ini.');
} else {
  console.log('\n🎉 SEMPURNA! Semua tombol memiliki fungsi onClick.');
}