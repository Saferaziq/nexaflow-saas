'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// ============ KONFIGURASI WHATSAPP ============
const WA_NUMBER = '6281389744957';
const WA_MESSAGE = 'Halo NexaFlow, saya tertarik dengan sistem kasir kafe/resto Anda. Bisa info lebih lanjut?';
const waLink = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`;

// ============ KOMPONEN LOGO ============
const LogoImg = ({ className = "w-10 h-10" }) => (
  <img 
    src="/logo-nexaflow-3d.png" 
    alt="NexaFlow Logo" 
    className={`${className} object-contain`} 
  />
);

// ============ DATA ============
const internalSolutions = [
  { icon: 'users', metric: '0 Menit Antre', before: 'Antrean Menumpuk di Depan Kasir', title: 'Pelanggan Langsung Duduk & Pesan dari Meja', desc: 'Tidak ada lagi kerumunan orang berdiri mengantre di depan kasir saat jam sibuk. Pelanggan duduk nyaman, scan QR meja dari HP, dan kasir bekerja tenang.' },
  { icon: 'kds', metric: '0 Struk Hilang', before: 'Kertas Pesanan Hilang / Salah Catat', title: 'Catatan Khusus Tampil Jelas di Layar Dapur', desc: 'Permintaan seperti "Less Sugar" atau "Tanpa Pedas" langsung tertulis di monitor/tablet dapur (KDS). Bebas salah dengar antara kasir dan koki.' },
  { icon: 'speaker', metric: 'Panggilan Otomatis', before: 'Staf Teriak Panggil Nama / Bolak-Balik Meja', title: 'HP Pelanggan Bergetar & Memanggil Otomatis', desc: 'Begitu pesanan selesai dimasak, 1 klik dari dapur atau kasir langsung membunyikan panggilan suara di HP pelanggan untuk mengambil pesanan.' },
  { icon: 'bolt', metric: 'Kunci Stok Real-Time', before: 'Pelanggan Kecewa Menu Ternyata Habis', title: 'Stok Habis Otomatis Terkunci Detik Itu Juga', desc: 'Saat porsi terakhir terbeli, status menu otomatis berubah menjadi Habis (Sold Out) di semua HP pelanggan detik itu juga tanpa perlu diupdate manual.' },
  { icon: 'wallet', metric: 'Akurasi Kas 100%', before: 'Lembur Hitung Nota saat Tutup Kasir (Closing)', title: 'Rekap Tunai & QRIS Otomatis Akurat', desc: 'Tidak ada lagi selisih hitungan saat tutup toko malam hari. Semua pembayaran tunai, QRIS, dan pajak sudah terjumlah otomatis di layar iPad/PC.' },
  { icon: 'store', metric: '5 Menit Paham', before: 'Pusing Training Karyawan Baru', title: 'Tanpa Menu Sampah, Staf Baru Langsung Lancar', desc: 'Karena layar kasir dan dapur bersih dari puluhan tombol pengaturan yang tidak terpakai, karyawan baru bisa langsung mengoperasikan di hari pertama.' }
];

const features = [
  { icon: 'qr', title: 'Self-Order via QR', desc: 'Pelanggan memindai QR di meja dan memesan langsung dari browser HP mereka. Tanpa antre di kasir, tanpa perlu unduh aplikasi.' },
  { icon: 'kds', title: 'Kitchen Display System', desc: 'Layar khusus iPad/Monitor dapur yang menampilkan antrean pesanan secara real-time. Mencegah kertas pesanan terselip.' },
  { icon: 'qris', title: 'QRIS Dinamis Otomatis', desc: 'Tampilkan dan cetak QRIS dengan nominal tagihan yang sudah terisi otomatis sesuai total pesanan pelanggan.' },
  { icon: 'chart', title: 'Laporan Omzet Instan', desc: 'Pantau pendapatan harian, menu terlaris, dan performa kafe secara langsung di PC atau HP. Ekspor ke CSV hanya 1 klik.' },
  { icon: 'tag', title: 'Promo & Diskon Menu', desc: 'Atur label menu Unggulan, Menu Baru, dan Harga Coret (Diskon) agar tampil menarik di layar HP pelanggan.' },
  { icon: 'speaker', title: 'Panggilan Suara (TTS)', desc: 'HP pelanggan otomatis bergetar dan mengucapkan nama mereka saat pesanan selesai disiapkan di kasir.' },
  { icon: 'printer', title: 'Cetak Bluetooth (RawBT)', desc: 'Cetak struk thermal langsung dari iPad, Tablet, atau HP kasir melalui koneksi Bluetooth tanpa perlu instalasi rumit.' },
  { icon: 'store', title: 'Layar Bersih Tanpa Sampah', desc: 'Antarmuka kasir bebas dari puluhan menu pengaturan teknis yang tidak pernah dipakai, sehingga staf baru langsung lancar.' },
  { icon: 'shield', title: 'Anti-Fraud Server-Side', desc: 'Harga, diskon, dan pajak dihitung ulang di database server — aman dari manipulasi Inspect Element di browser.' },
  { icon: 'bolt', title: 'Anti-Spam & Kunci Stok', desc: 'Pembatasan antrean per perangkat dan penguncian stok atomik saat checkout mencegah pesanan ganda pada stok terakhir.' },
  { icon: 'wallet', title: 'Bayar Dulu / Belakangan', desc: 'Mode pembayaran fleksibel yang dapat disesuaikan dengan alur layanan kafe atau restoran Anda.' },
  { icon: 'mobile', title: 'Multi-Device (HP, iPad, PC)', desc: 'Desain responsif penuh: nyaman di layar vertikal HP pelanggan maupun layar lebar iPad, Tablet, dan PC kasir/dapur.' }
];

const whyUs = [
  { icon: 'bolt', title: 'Paham dalam 5 Menit', desc: 'Tidak ada tombol atau menu sampah yang membingungkan kasir. Staf baru bisa langsung mengoperasikan tanpa kursus rumit.' },
  { icon: 'shield', title: 'Keamanan Full-Stack Server', desc: 'Seluruh kalkulasi harga dan pemotongan stok dikunci otomatis di sisi database server, bebas dari manipulasi browser.' },
  { icon: 'chart', title: 'Pantau dari Mana Saja', desc: 'Sebagai pemilik, Anda dapat memantau omzet dan antrean kafe secara real-time dari HP meski sedang di luar kota.' },
  { icon: 'wrench', title: 'Setup Awal 100% Terima Beres', desc: 'Tim kami yang menginput seluruh daftar menu, foto produk, dan kode QR meja Anda tanpa biaya di awal.' },
  { icon: 'users', title: 'Bimbingan Sampai Mahir', desc: 'Pendampingan langsung 1-on-1 hingga seluruh staf kasir dan dapur Anda benar-benar lancar mengoperasikan sistem.' },
  { icon: 'headset', title: 'Dukungan Teknis Responsif', desc: 'Komunikasi langsung dengan tim pengembang dan mitra lapangan via WhatsApp kapan pun Anda membutuhkan bantuan.' }
];

const comparisons = [
  { f: 'Menghilangkan Antrean Panjang di Depan Kasir', m: false, c: false, n: true },
  { f: 'Tampilan Bersih Tanpa Menu Pengaturan Sampah', m: false, c: false, n: true },
  { f: 'Staf Baru Langsung Lancar dalam 5 Menit', m: true, c: false, n: true },
  { f: 'Kitchen Display System (Layar Dapur Tanpa Kertas)', m: false, c: false, n: true },
  { f: 'Promo Harga Coret & Label Menu Unggulan', m: false, c: false, n: true },
  { f: 'Panggilan Suara & Getar Otomatis di HP Pelanggan', m: false, c: false, n: true },
  { f: 'Tampilan Optimal di HP, iPad, Tablet & PC Kasir', m: false, c: true, n: true },
  { f: 'Bebas Potongan Komisi per Transaksi', m: true, c: false, n: true },
  { f: 'Validasi Harga & Pajak Server-Side (Anti-Fraud)', m: false, c: false, n: true },
  { f: 'Proteksi Anti-Spam Order per Perangkat', m: false, c: false, n: true },
  { f: 'Kunci Stok Otomatis & Auto-Restock Saat Batal', m: false, c: true, n: true },
  { f: 'Setup Terima Beres + Bimbingan Sampai Bisa', m: false, c: false, n: true }
];

const pricingFeatures = [
  'Bebas antrean kasir & tampilan bersih tanpa menu rumit',
  'Siap dibuka di iPad, PC Kasir, Tablet Dapur & HP Pelanggan',
  'Jumlah menu, kategori, dan nomor meja tanpa batas',
  'Order mandiri via QR Meja & kalkulasi QRIS otomatis',
  'Layar Dapur Real-Time (Kitchen Display System)',
  'Setup awal 100% terima beres + bimbingan staf 1-on-1',
  'Dukungan teknis langsung via WhatsApp 24/7'
];

const faqs = [
  { q: 'Mengapa NexaFlow jauh lebih mudah dipakai dibanding aplikasi kasir lain?', a: 'Karena kami membuang seluruh menu pengaturan berlapis dan fitur sampah yang tidak pernah disentuh oleh kasir. Layar iPad/PC Kasir dan Layar Dapur dirancang fokus hanya pada transaksi harian, sehingga staf baru pun langsung paham dalam 5 menit.' },
  { q: 'Bagaimana NexaFlow mengatasi antrean panjang di depan meja kasir?', a: 'Pelanggan tidak perlu lagi berdiri mengantre di depan kasir untuk melihat menu dan memesan. Mereka cukup duduk di meja, scan QR menggunakan HP masing-masing, lalu memilih menu. Pesanan otomatis muncul di layar iPad/PC kasir dan layar dapur.' },
  { q: 'Bagaimana skema pemasangan dan pembayarannya?', a: 'Setup awal 100% gratis dan terima beres. Tim mitra kami akan menyiapkan menu, foto, dan QR meja kafe Anda serta membimbing staf sampai lancar. Komitmen biaya langganan baru berjalan setelah sistem aktif beroperasi di kafe Anda, tanpa DP di awal.' },
  { q: 'Apakah tampilan kasir dan dapur bisa dibuka di iPad, Tablet, atau PC?', a: 'Sangat bisa. Tampilan Kasir dan Kitchen Display System (KDS) dirancang responsif untuk layar lebar seperti iPad, Tablet Android, Laptop, maupun Monitor PC, sementara tampilan pemesanan pelanggan dioptimalkan khusus untuk layar HP.' },
  { q: 'Apakah pelanggan bisa memanipulasi harga lewat Inspect Element?', a: 'Tidak. Seluruh harga menu, diskon, pajak, dan ketersediaan stok dihitung ulang secara otomatis di dalam database server (PostgreSQL RPC) saat checkout. Manipulasi angka dari browser pelanggan otomatis ditolak.' },
  { q: 'Apakah fitur Panggilan Suara (TTS) dikenakan biaya tambahan?', a: 'Tidak. Fitur panggilan suara dan getar menggunakan teknologi Web Speech API bawaan browser HP pelanggan, sehingga sepenuhnya gratis tanpa biaya tambahan.' },
  { q: 'Berapa lama waktu yang dibutuhkan untuk setup awal?', a: 'Rata-rata 1 hingga 2 hari kerja. Anda cukup mengirimkan daftar menu dan foto produk, lalu tim kami yang menyiapkan akun, menu, dan file cetak QR meja hingga siap dipakai.' }
];

// ============ ICONS ============
const Icons = {
  qr: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3z"/><path d="M18 18h3v3h-3z"/><path d="M14 19h2"/><path d="M19 14v2"/></svg>,
  kds: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/><path d="M7 8h4"/><path d="M7 12h2"/><path d="M14 8h3"/><path d="M14 12h3"/></svg>,
  qris: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><line x1="6" y1="15" x2="10" y2="15"/></svg>,
  chart: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
  tag: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  speaker: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>,
  printer: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  store: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>,
  bolt: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  wallet: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>,
  mobile: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
  wrench: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  users: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  headset: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>,
  x: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><polyline points="20 6 9 17 4 12"/></svg>,
};

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(0);
  const [phoneAlertOpen, setPhoneAlertOpen] = useState(true);
  const [demoOrderConfirmed, setDemoOrderConfirmed] = useState(false);
  const [simStage, setSimStage] = useState(1);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrameId;
    const particleCount = window.innerWidth < 768 ? 24 : 50;
    const maxDistance = 180;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    resize();

    for (let i = 0; i < particleCount; i++) {
      particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35, radius: Math.random() * 1.8 + 1.0 });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fillStyle = 'rgba(96, 165, 250, 0.32)'; ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          let p2 = particles[j]; let dx = p.x - p2.x, dy = p.y - p2.y; let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < maxDistance) {
            let opacity = 1 - (distance / maxDistance);
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${opacity * 0.16})`; ctx.lineWidth = 1; ctx.stroke();
          }
        }
      }
      animFrameId = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animFrameId); };
  }, []);

  const handleSimStage = (stage) => {
    setSimStage(stage);
    if (stage === 1) {
      setPhoneAlertOpen(false);
      setDemoOrderConfirmed(true);
    } else if (stage === 2) {
      setPhoneAlertOpen(false);
      setDemoOrderConfirmed(false);
    } else if (stage === 3) {
      setPhoneAlertOpen(true);
    }
  };

  const togglePhoneAlert = () => setPhoneAlertOpen(!phoneAlertOpen);

  const confirmDemoOrder = () => {
    setDemoOrderConfirmed(!demoOrderConfirmed);
  };

  return (
    <div className="min-h-screen overflow-x-hidden selection:bg-[#2563EB] selection:text-white bg-[#060911] font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&family=Plus+Jakarta+Sans:wght@700;800;900&display=swap');
        body { font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
        h1, h2, h3, h4, .font-display { font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; }
        .font-mono-code { font-family: 'JetBrains Mono', monospace; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .bg-arch-grid {
          background-size: 48px 48px;
          background-image: linear-gradient(to right, rgba(148, 163, 184, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(148, 163, 184, 0.05) 1px, transparent 1px);
        }
        .text-gradient-nf { background: linear-gradient(135deg, #60A5FA 0%, #93C5FD 38%, #F59E0B 78%, #EA580C 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .text-gradient-sapphire { background: linear-gradient(135deg, #1E4E8C 0%, #2563EB 50%, #D97736 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .btn-sapphire { background: linear-gradient(135deg, #1E4E8C 0%, #2563EB 55%, #1D4ED8 100%); box-shadow: 0 12px 32px -8px rgba(37, 99, 235, 0.55), inset 0 1px 0 0 rgba(255, 255, 255, 0.25); }
        .btn-sapphire:hover { background: linear-gradient(135deg, #2563EB 0%, #3B82F6 55%, #1E4E8C 100%); box-shadow: 0 16px 38px -6px rgba(59, 130, 246, 0.7), inset 0 1px 0 0 rgba(255, 255, 255, 0.35); }
        .card-obsidian { background: linear-gradient(180deg, rgba(17, 25, 43, 0.88) 0%, rgba(10, 15, 28, 0.94) 100%); border: 1px solid rgba(148, 163, 184, 0.14); box-shadow: 0 20px 50px -15px rgba(0, 0, 0, 0.7), inset 0 1px 0 0 rgba(255, 255, 255, 0.08); }
        .card-obsidian:hover { border-color: rgba(96, 165, 250, 0.38); }
        .animate-pulse-subtle { animation: pulse-subtle 2.4s infinite ease-in-out; }
        @keyframes pulse-subtle { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.92; } }
        .animate-float { animation: float-slow 5s infinite ease-in-out; }
        @keyframes float-slow { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-6px); } }
      `}</style>

      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none"></canvas>
      <div className="fixed top-[-180px] left-[10%] w-[560px] h-[560px] rounded-full bg-[#2563EB]/18 blur-[150px] pointer-events-none z-0"></div>
      <div className="fixed top-[15%] right-[5%] w-[440px] h-[440px] rounded-full bg-[#D97736]/14 blur-[150px] pointer-events-none z-0"></div>

      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#060911]/80 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-3.5 relative z-10 group">
              <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center shadow-lg shadow-blue-950/60 group-hover:border-blue-500/50 transition-all overflow-hidden p-1">
                <LogoImg className="w-full h-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-xl font-black text-white tracking-tight leading-none uppercase font-display">NEXA<span className="text-sky-400">FLOW</span></p>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EA8B42]"></span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-1">FULL-STACK RESTAURANT OS</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 relative z-10">
              <a href="#masalah-internal" className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors">Solusi Kafe</a>
              <a href="#tampilan" className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors">Simulasi 3 Layar</a>
              <a href="#kesederhanaan" className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors">Zero-Bloatware</a>
              <a href="#fitur" className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors">Fitur</a>
              <a href="#bandingkan" className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors">Bandingkan</a>
              <a href="#harga" className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors">Program</a>
              <a href="#faq" className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors">FAQ</a>
            </nav>

            <div className="flex items-center gap-2 sm:gap-3 relative z-10">
              <Link href="/login" className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold text-slate-300 hover:text-white transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-sky-400"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                <span>Masuk</span>
              </Link>
              <Link href="/register" className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl btn-sapphire text-white text-xs sm:text-sm font-bold hover:-translate-y-0.5 transition-all">
                <span>Coba Gratis</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#FBBF24]"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative pt-32 sm:pt-36 pb-20 sm:pb-24 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            <div className="lg:col-span-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-sky-500/30 text-sky-300 text-[11px] font-extrabold tracking-[0.12em] uppercase mb-6 shadow-inner">
                <span className="w-2 h-2 rounded-full bg-[#EA8B42] animate-pulse"></span>
                <span>Bebas Antrean Kasir · Tanpa Menu Sampah</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-black text-white leading-[1.06] tracking-tight font-display">
                Meja Kasir Tenang,<br />
                <span className="text-gradient-nf">Staf Paham 5 Menit.</span>
              </h1>

              <p className="mt-5 sm:mt-6 text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
                Sistem <i>full-stack</i> yang menghapus kerumunan antrean di depan meja kasir dan membuang puluhan menu pengaturan rumit yang tidak pernah dipakai. <strong className="text-white font-semibold">Pelanggan pesan dari HP di meja, kasir konfirmasi di iPad/PC, dan dapur langsung memasak tanpa kertas hilang.</strong>
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5 justify-center lg:justify-start">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-bold text-slate-200">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-sky-400"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                  <span>0 Antrean Depan Kasir</span>
                </span>
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-bold text-slate-200">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-[#EA8B42]"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                  <span>Zero-Bloatware (Tanpa Ribet)</span>
                </span>
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-bold text-slate-200">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-emerald-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
                  <span>Anti-Fraud Server RPC</span>
                </span>
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-bold text-slate-200">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-amber-400"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>
                  <span>Terima Beres & Didampingi</span>
                </span>
              </div>

              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start">
                <Link href="/register" className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl btn-sapphire text-white font-extrabold text-sm sm:text-base hover:-translate-y-0.5 transition-all">
                  <span>Mulai Tanpa Biaya Awal</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#FBBF24]"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </Link>
                <a href="#tampilan" className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-slate-900/90 border border-slate-700 text-white font-bold text-sm sm:text-base hover:border-sky-400/50 hover:bg-slate-800/80 transition-all">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-sky-400"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                  <span>Coba Simulasi HP, iPad & PC</span>
                </a>
              </div>

              <div className="mt-10 pt-8 border-t border-slate-800/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-white font-display">0 <span className="text-sm font-bold text-sky-400">Menit</span></p>
                  <p className="text-[11px] font-medium text-slate-400 mt-0.5">Antrean berdiri di kasir</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-white font-display">5 <span className="text-sm font-bold text-[#EA8B42]">Menit</span></p>
                  <p className="text-[11px] font-medium text-slate-400 mt-0.5">Staf baru langsung lancar</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-white font-display">100<span className="text-sm font-bold text-emerald-400">%</span></p>
                  <p className="text-[11px] font-medium text-slate-400 mt-0.5">Setup terima beres gratis</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="absolute -inset-6 bg-gradient-to-tr from-[#2563EB]/25 via-sky-500/10 to-[#EA8B42]/25 rounded-[2.5rem] blur-2xl pointer-events-none"></div>
              <div className="relative rounded-[1.75rem] p-2.5 bg-gradient-to-b from-slate-700 to-slate-900 shadow-2xl border border-slate-700/80">
                <div className="rounded-[1.25rem] overflow-hidden bg-[#0B1221] border border-slate-800">
                  <div className="bg-[#070B14] px-4 py-3 flex items-center justify-between border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                      <span className="ml-2 text-[11px] font-bold text-slate-300 font-mono-code">nexaflow.app/kasir-ipad</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">Sinkron 3 Layar</span>
                    </div>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-1.5">
                          <LogoImg className="w-full h-full" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-[#EA8B42] uppercase tracking-widest">Layar iPad / PC Kasir</p>
                          <p className="text-lg font-black text-white">Kopi Senja & Bistro</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-sky-300 bg-sky-500/10 border border-sky-500/25 px-3 py-1 rounded-lg">Hanya 3 Tombol Utama</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-[#111C33] rounded-xl p-3.5 border border-slate-800">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Antrean Meja</p>
                        <p className="text-2xl font-black text-white font-display">24</p>
                        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Tanpa antre fisik</p>
                      </div>
                      <div className="bg-[#111C33] rounded-xl p-3.5 border border-slate-800">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Dimasak KDS</p>
                        <p className="text-2xl font-black text-[#EA8B42] font-display">7</p>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Tampil di monitor</p>
                      </div>
                      <div className="btn-sapphire rounded-xl p-3.5">
                        <p className="text-[10px] font-bold text-sky-200 uppercase mb-1">Rekap Hari Ini</p>
                        <p className="text-xl font-black text-white font-display">Rp 2,4jt</p>
                        <p className="text-[10px] text-sky-100 font-semibold mt-0.5">Otomatis akurat</p>
                      </div>
                    </div>
                    <div className="rounded-xl bg-[#111C33] border border-slate-700/80 p-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center font-black text-xs text-sky-300 font-mono-code">#18</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-black text-white">Meja 07 · Raka Pratama</p>
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold uppercase">QRIS Valid</span>
                          </div>
                          <p className="text-[11px] font-medium text-slate-400 mt-0.5">2x Iced Kopi Susu (Less Sugar), 1x Butter Croissant</p>
                        </div>
                      </div>
                      <a href="#tampilan" className="px-3 py-1.5 rounded-lg bg-[#EA8B42] text-slate-950 text-[10px] font-black uppercase tracking-wider hover:bg-amber-400 transition-colors shrink-0">Uji Klik ↓</a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-3.5 absolute -bottom-6 -left-6 bg-[#0E1729]/95 backdrop-blur-xl border border-sky-400/30 rounded-2xl p-3.5 shadow-2xl animate-float">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300 shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">HP Pelanggan · Meja 10</p>
                  <p className="text-xs font-extrabold text-white">Pesan sendiri & dipanggil suara otomatis</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MASALAH INTERNAL */}
      <section id="masalah-internal" className="px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative z-10 bg-[#F8FAFC] text-[#0B172A] rounded-t-[2.5rem] sm:rounded-t-[3.5rem] shadow-2xl">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 border border-sky-200 text-[#1E4E8C] text-[10px] font-black uppercase tracking-widest mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-[#D97736]"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <span>Solusi Masalah Internal Kafe & Resto</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B172A] tracking-tight leading-tight mb-4 font-display">Berbagai Kekacauan Jam Ramai <span className="text-gradient-sapphire">Langsung Beres Sekaligus</span></h2>
            <p className="text-slate-600 text-base sm:text-lg font-medium">Pemilik kafe sering pusing karena antrean menumpuk di depan kasir, salah catat pesanan, hingga selisih uang saat tutup toko. NexaFlow memotong sumber masalah tersebut dari akarnya.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {internalSolutions.map((item, i) => {
              const IconComp = Icons[item.icon];
              return (
                <div key={i} className="rounded-2xl p-6 bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-[#2563EB]/40 transition-all flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 text-[#1E4E8C] flex items-center justify-center shrink-0 group-hover:bg-[#0F294A] group-hover:text-white transition-colors">
                        <IconComp />
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-bold line-through">{item.before}</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-[#0B172A] mb-2 font-display">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold">
                    <span className="text-[#2563EB] flex items-center gap-1.5">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-[#D97736]"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>Solusi NexaFlow</span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-sky-50 text-[#0F294A] font-extrabold">{item.metric}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PRATINJAU PERANGKAT */}
      <section id="tampilan" className="px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative z-10 bg-white text-[#0B172A] border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-[#0F294A] text-[10px] font-black uppercase tracking-widest mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-[#2563EB]"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              <span>Pratinjau Perangkat Sesuai Peran</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B172A] tracking-tight leading-tight mb-4 font-display">HP untuk Pelanggan, <span className="text-gradient-sapphire">iPad & PC untuk Kasir & Dapur</span></h2>
            <p className="text-slate-600 text-base sm:text-lg font-medium">Dirancang presisi mengikuti perangkat kerja di lapangan—layar vertikal HP untuk pelanggan di meja, serta layar lebar iPad, Tablet, atau PC untuk kasir dan dapur.</p>
          </div>

          <div className="max-w-4xl mx-auto mb-16 bg-slate-900 text-white rounded-2xl p-3 sm:p-4 border border-slate-800 shadow-xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 px-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EA8B42] animate-pulse"></span>
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-200">Uji Alur Otomatis 3 Layar:</span>
              </div>
              <div className="grid grid-cols-3 gap-2 w-full sm:w-auto">
                <button type="button" onClick={() => handleSimStage(1)} className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${simStage === 1 ? 'bg-[#2563EB] text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>1. Pelanggan Pesan (HP)</button>
                <button type="button" onClick={() => handleSimStage(2)} className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${simStage === 2 ? 'bg-[#2563EB] text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>2. Kasir Konfirmasi (iPad)</button>
                <button type="button" onClick={() => handleSimStage(3)} className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${simStage === 3 ? 'bg-[#2563EB] text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>3. Dapur Siap & Panggil</button>
              </div>
            </div>
          </div>

          {/* 1. PELANGGAN */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-20 sm:mb-28">
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-100 text-[#0F294A] text-[10px] font-black uppercase tracking-widest mb-4">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-[#2563EB]"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                <span>1 · Tampilan HP Pelanggan (Smartphone)</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#0B172A] mb-3 sm:mb-4 font-display">Pesan dari Meja Tanpa Berdiri Mengantre</h3>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-5 font-medium">Pelanggan langsung duduk di meja, pindai QR menggunakan HP masing-masing, melihat menu unggulan dan promo harga coret, lalu memesan. Saat dapur selesai memasak, HP pelanggan otomatis <strong>bergetar dan memanggil nama mereka</strong>.</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm font-bold text-[#0B172A]">
                  <span className="w-5 h-5 rounded-full bg-sky-100 text-[#2563EB] flex items-center justify-center shrink-0"><Icons.check /></span>
                  <span>Ringan Dibuka di Semua Browser HP (Tanpa Install Aplikasi)</span>
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-[#0B172A]">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0"><Icons.check /></span>
                  <span>Notifikasi Getar & Panggilan Suara Otomatis (TTS) di HP</span>
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-[#0B172A]">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-[#D97736] flex items-center justify-center shrink-0"><Icons.check /></span>
                  <span>Label Promo Diskon & Stok Habis Otomatis Terkunci</span>
                </li>
              </ul>
              <div className="mt-6">
                <button type="button" onClick={togglePhoneAlert} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-300 text-xs font-bold text-[#0B172A] hover:bg-slate-200 transition-colors shadow-sm">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-[#2563EB]"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                  <span>{phoneAlertOpen ? 'Sembunyikan Popup Panggilan' : 'Tampilkan Simulasi Panggilan Suara'}</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 flex justify-center">
              <div className="w-full max-w-[305px] h-[575px] bg-white rounded-[2.85rem] border-[9px] border-[#070B14] shadow-2xl overflow-hidden relative ring-4 ring-sky-500/20">
                <div className="bg-slate-100 px-5 pt-2.5 pb-1 flex items-center justify-between text-[9px] font-bold text-[#0B172A] relative z-20">
                  <span>09:41</span>
                  <div className="w-20 h-4 bg-[#070B14] rounded-full"></div>
                  <div className="flex items-center gap-1"><span>5G</span><div className="w-4 h-2.5 border border-[#0B172A] rounded-sm p-0.5"><div className="w-full h-full bg-[#0B172A]"></div></div></div>
                </div>

                <div className="p-4 pt-3 h-[calc(100%-28px)] flex flex-col bg-slate-50 relative">
                  <div className="mb-3.5 flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
                    <div>
                      <p className="text-[9px] font-bold text-[#2563EB] uppercase tracking-wider">Meja 10 · Dine-In</p>
                      <h4 className="text-base font-black text-[#0B172A]">Nexa Kafe</h4>
                    </div>
                    <span className="px-2 py-1 rounded-md bg-sky-50 border border-sky-200 text-[9px] font-black text-[#0F294A] font-mono-code">#ORD-12</span>
                  </div>

                  <div className="flex gap-3 bg-white border border-slate-200 rounded-xl p-3 shadow-sm mb-3 relative overflow-hidden">
                    <div className="absolute top-0 left-0 bg-[#D97736] text-white text-[8px] font-bold px-2 py-0.5 rounded-br-lg z-10 flex items-center gap-1">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      <span>Unggulan</span>
                    </div>
                    <div className="w-14 h-14 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center flex-shrink-0 mt-2 text-[#1E4E8C]">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>
                    </div>
                    <div className="pt-1 flex-1">
                      <p className="font-bold text-xs text-[#0B172A]">Iced Matcha Latte</p>
                      <p className="text-[9px] text-slate-400 line-through mt-0.5">Rp 28.000</p>
                      <div className="flex items-center justify-between mt-0.5">
                        <p className="font-black text-sm text-[#D97736]">Rp 22.000</p>
                        <span className="w-5 h-5 rounded-md bg-[#0F294A] text-white flex items-center justify-center text-xs font-bold">+</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 bg-white border border-slate-200 rounded-xl p-3 shadow-sm mb-3">
                    <div className="w-14 h-14 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center flex-shrink-0 text-[#1E4E8C]">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><path d="M4.6 13.11l5.79-3.21c1.89-1.05 4.79 1.78 3.71 3.71l-3.22 5.81C8.8 23.16.79 15.23 4.6 13.11Z"/><path d="m10.5 9.5-1-2.29C9.2 6.48 8.8 6 8 6H4.5C2.79 6 2 6.5 2 8.5a7.71 7.71 0 0 0 2 4.83"/><path d="M8 6c0-1.55.24-4-2-4-2 0-2.5 2.17-2.5 4"/><path d="m14.5 13.5 2.29 1c.73.3 1.21.7 1.21 1.5v3.5c0 1.71-.5 2.5-2.5 2.5a7.71 7.71 0 0 1-4.83-2"/><path d="M18 16c1.55 0 4-.24 4 2 0 2-2.17 2.5-4 2.5"/></svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-xs text-[#0B172A]">Croissant Butter</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Freshly baked pastry</p>
                      <div className="flex items-center justify-between mt-1.5">
                        <p className="font-black text-sm text-[#0B172A]">Rp 18.000</p>
                        <span className="w-5 h-5 rounded-md bg-[#0F294A] text-white flex items-center justify-center text-xs font-bold">+</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto btn-sapphire text-white rounded-xl p-3 flex items-center justify-between shadow-lg">
                    <div>
                      <p className="text-[9px] text-sky-200 font-semibold uppercase">2 Item · Meja 10</p>
                      <p className="text-xs font-black">Rp 40.000</p>
                    </div>
                    <button type="button" onClick={() => handleSimStage(2)} className="px-3 py-1.5 rounded-lg bg-white text-[#0F294A] text-[10px] font-black hover:bg-sky-50 transition-colors">Kirim ke Kasir →</button>
                  </div>

                  {phoneAlertOpen && (
                    <div className="absolute inset-0 bg-[#070B14]/65 backdrop-blur-sm flex items-center justify-center p-4 z-10 transition-opacity duration-300">
                      <div className="bg-white w-full rounded-2xl p-4 text-center border-2 border-[#2563EB] shadow-xl">
                        <div className="w-12 h-12 bg-sky-100 text-[#2563EB] rounded-full flex items-center justify-center mx-auto mb-2.5 animate-pulse-subtle">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
                        </div>
                        <h4 className="font-black text-[#0B172A] text-sm">Pesanan Siap!</h4>
                        <p className="text-[10px] text-slate-600 font-bold mt-1 mb-3">Budi, Meja 10, silakan ambil pesanan di kasir.</p>
                        <button type="button" onClick={togglePhoneAlert} className="w-full btn-sapphire text-white text-[10px] font-bold py-2 rounded-lg transition-colors">Suara Panggilan Aktif · Tutup</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 2. KASIR */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-20 sm:mb-28">
            <div className="lg:col-span-7 lg:order-2">
              <div className="w-full bg-[#070B14] p-2.5 sm:p-3.5 rounded-[2rem] shadow-2xl ring-4 ring-sky-500/20">
                <div className="flex justify-center mb-2"><div className="w-2 h-2 rounded-full bg-slate-700"></div></div>
                <div className="bg-white rounded-[1.35rem] overflow-hidden border border-slate-200">
                  <div className="bg-slate-50 px-4 sm:px-5 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center p-1 shadow-sm"><LogoImg className="w-full h-full" /></div>
                      <div>
                        <p className="text-xs font-black text-[#0B172A] leading-none">Dashboard Kasir · Layar iPad / PC</p>
                        <p className="text-[10px] font-semibold text-slate-500 mt-0.5">Tanpa menu rumit · Fokus konfirmasi & cetak struk</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full text-[10px] font-bold">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                        <span>Printer Thermal Aktif</span>
                      </span>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-12 bg-slate-50/50">
                    <div className="sm:col-span-4 border-b sm:border-b-0 sm:border-r border-slate-200 p-3.5 space-y-2 bg-slate-100/70">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 px-2">Menu Kasir (Hanya 3 Tab)</p>
                      <div className="flex sm:flex-col gap-1.5">
                        <div className="flex-1 flex items-center justify-between px-3 py-2 rounded-xl btn-sapphire text-white text-xs font-bold shadow-sm">
                          <span>Antrean Masuk</span>
                          <span className="px-1.5 py-0.5 rounded bg-white/20 text-[10px]">2</span>
                        </div>
                        <div className="flex-1 flex items-center justify-between px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs font-bold">
                          <span>Stok Menu</span>
                          <span className="text-[10px] text-emerald-700 font-bold">Aktif</span>
                        </div>
                        <div className="flex-1 flex items-center justify-between px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs font-bold">
                          <span>Rekap Kas</span>
                          <span className="text-[10px] text-[#0F294A]">2,4jt</span>
                        </div>
                      </div>
                      <div className="hidden sm:block pt-2 border-t border-slate-200 text-[10px] text-slate-500 font-medium leading-relaxed px-1">
                        Tidak ada tombol pengaturan rumit di layar kasir. Kasir fokus melayani pembayaran.
                      </div>
                    </div>
                    <div className="sm:col-span-8 p-4 space-y-3">
                      <div className={`bg-white rounded-xl p-3.5 border border-slate-200 border-l-4 flex justify-between items-center shadow-sm transition-all ${demoOrderConfirmed ? 'border-l-emerald-600' : 'border-l-[#D97736]'}`}>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-black text-[#0F294A] font-mono-code">#ORD-12</span>
                            <p className="font-black text-sm text-[#0B172A]">Meja 10</p>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${demoOrderConfirmed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                              {demoOrderConfirmed ? 'Lunas · Masuk Dapur' : 'Menunggu Bayar'}
                            </span>
                          </div>
                          <p className="text-xs text-[#0B172A] font-bold mt-1.5">Budi · 1x Iced Matcha, 1x Croissant</p>
                          <p className="text-[11px] text-slate-500 font-semibold">Total: Rp 40.000 · Metode: QRIS</p>
                        </div>
                        <button type="button" onClick={confirmDemoOrder} className={`text-[11px] font-bold px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-sm shrink-0 ${demoOrderConfirmed ? 'bg-slate-100 border border-slate-300 text-[#0B172A]' : 'btn-sapphire text-white'}`}>
                          {demoOrderConfirmed ? <span>Reset Simulasi</span> : <><Icons.check /> <span>Konfirmasi</span></>}
                        </button>
                      </div>
                      <div className="bg-white rounded-xl p-3.5 border border-slate-200 border-l-4 border-l-[#2563EB] flex justify-between items-center shadow-sm">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-black text-[#0F294A] font-mono-code">#ORD-11</span>
                            <p className="font-black text-sm text-[#0B172A]">Meja 04</p>
                            <span className="text-[10px] font-bold bg-sky-100 text-[#1E4E8C] px-2 py-0.5 rounded">Sedang Dimasak Dapur</span>
                          </div>
                          <p className="text-xs text-[#0B172A] font-bold mt-1.5">Sinta · 2x Es Kopi Susu, 1x French Fries</p>
                          <p className="text-[11px] text-emerald-700 font-semibold">Lunas (Rp 65.000) · Struk Tercetak</p>
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 px-2.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200 shrink-0">Cetak Ulang</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden sm:flex flex-col items-center">
                <div className="w-24 h-3 bg-[#0B172A] rounded-b-lg"></div>
                <div className="w-40 h-1.5 bg-slate-300 rounded-full"></div>
              </div>
            </div>
            <div className="lg:col-span-5 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-100 text-[#0F294A] text-[10px] font-black uppercase tracking-widest mb-4">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-[#2563EB]"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                <span>2 · Tampilan iPad / PC Kasir</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#0B172A] mb-3 sm:mb-4 font-display">Layar Lebar yang Bersih, Hanya 3 Menu Utama</h3>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-5 font-medium">Buka di iPad, Tablet Android, maupun PC Kasir. Tidak ada puluhan tombol pengaturan sampah yang membuat staf bingung. Kasir cukup melihat pesanan dari meja masuk ke layar, klik <strong>Konfirmasi</strong>, dan struk langsung tercetak.</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm font-bold text-[#0B172A]"><span className="w-5 h-5 rounded-full bg-sky-100 text-[#2563EB] flex items-center justify-center shrink-0"><Icons.check /></span><span>Meja Kasir Tenang Tanpa Kerumunan Orang Mengantre</span></li>
                <li className="flex items-center gap-3 text-sm font-bold text-[#0B172A]"><span className="w-5 h-5 rounded-full bg-sky-100 text-[#2563EB] flex items-center justify-center shrink-0"><Icons.check /></span><span>Hanya Menampilkan Antrean, Stok Menu, dan Rekap Kas</span></li>
                <li className="flex items-center gap-3 text-sm font-bold text-[#0B172A]"><span className="w-5 h-5 rounded-full bg-sky-100 text-[#2563EB] flex items-center justify-center shrink-0"><Icons.check /></span><span>Tutup Kasir (Closing) Otomatis Pas Tanpa Hitung Kertas</span></li>
              </ul>
            </div>
          </div>

          {/* 3. DAPUR */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-100 text-[#0F294A] text-[10px] font-black uppercase tracking-widest mb-4">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-[#D97736]"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/><line x1="6" y1="17" x2="18" y2="17"/></svg>
                <span>3 · Tampilan Tablet / Monitor PC Dapur (KDS)</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#0B172A] mb-3 sm:mb-4 font-display">Bebas Salah Masak & Bebas Kertas Hilang</h3>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-5 font-medium">Pasang Tablet atau layar Monitor di dinding dapur. Koki langsung melihat kartu pesanan berukuran besar lengkap dengan catatan khusus pelanggan (seperti <em>"Less Sugar"</em> atau <em>"Tidak Pedas"</em>). Selesai masak, cukup sentuh 1 tombol untuk memanggil HP pelanggan.</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm font-bold text-[#0B172A]"><span className="w-5 h-5 rounded-full bg-sky-100 text-[#2563EB] flex items-center justify-center shrink-0"><Icons.check /></span><span>Tidak Ada Lagi Salah Dengar atau Kertas Pesanan Terselip</span></li>
                <li className="flex items-center gap-3 text-sm font-bold text-[#0B172A]"><span className="w-5 h-5 rounded-full bg-sky-100 text-[#2563EB] flex items-center justify-center shrink-0"><Icons.check /></span><span>Catatan Pelanggan Tertulis Jelas di Setiap Kartu Menu</span></li>
                <li className="flex items-center gap-3 text-sm font-bold text-[#0B172A]"><span className="w-5 h-5 rounded-full bg-sky-100 text-[#2563EB] flex items-center justify-center shrink-0"><Icons.check /></span><span>1 Klik "Pesanan Siap" Langsung Menggetarkan HP Pelanggan</span></li>
              </ul>
            </div>
            <div className="lg:col-span-7">
              <div className="w-full bg-[#070B14] p-2.5 sm:p-3.5 rounded-[2rem] shadow-2xl border-2 border-slate-800 ring-4 ring-sky-500/20">
                <div className="bg-[#0B1221] rounded-[1.35rem] overflow-hidden border border-slate-800">
                  <div className="bg-[#0F192D] px-4 sm:px-5 py-3 border-b border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-2.5 text-white font-bold text-xs sm:text-sm">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#EA8B42]"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                      <span>Layar Monitor / iPad Dapur (Kitchen Display System)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="hidden sm:inline-flex text-[10px] font-bold text-slate-300 bg-slate-800 px-2.5 py-1 rounded-full">PIN Dapur Aktif</span>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-400 bg-sky-400/10 px-2.5 py-1 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span><span>Realtime</span></span>
                    </div>
                  </div>
                  <div className="p-4 grid sm:grid-cols-3 gap-3.5">
                    <div className={`bg-[#131F35] rounded-xl p-3.5 border-t-4 flex flex-col justify-between transition-all ${simStage === 3 ? 'border-emerald-500 opacity-65' : 'border-[#EA8B42]'}`}>
                      <div>
                        <div className="flex justify-between items-start mb-1.5">
                          <span className="text-white font-black text-base">Meja 10</span>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${simStage === 3 ? 'text-emerald-400 bg-emerald-400/15' : 'text-amber-300 bg-amber-400/15'}`}>{simStage === 3 ? '#12 · SIAP SAJI' : '#12 · BARU'}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mb-2.5">Budi · 10:52 WIB</p>
                        <ul className="space-y-1.5 text-xs text-white font-semibold">
                          <li>1x Iced Matcha Latte<span className="block text-[10px] text-amber-300 font-normal">Catatan: Less Sugar</span></li>
                          <li>1x Croissant Butter</li>
                        </ul>
                      </div>
                      <div className="mt-3 pt-2.5 border-t border-slate-700/70 text-center">
                        <button type="button" onClick={() => handleSimStage(3)} className={`block w-full py-1.5 rounded-lg text-[10px] font-bold transition-colors ${simStage === 3 ? 'bg-emerald-600 text-white' : 'bg-[#2563EB] hover:bg-blue-500 text-white'}`}>{simStage === 3 ? 'HP Meja 10 Berdering!' : 'Tandai Siap & Panggil HP'}</button>
                      </div>
                    </div>
                    <div className="bg-[#131F35] rounded-xl p-3.5 border-t-4 border-sky-400 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-1.5">
                          <span className="text-white font-black text-base">Meja 04</span>
                          <span className="text-[9px] font-bold text-sky-300 bg-sky-400/15 px-2 py-0.5 rounded">#11 · DIMASAK</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mb-2.5">Sinta · 10:48 WIB</p>
                        <ul className="space-y-1.5 text-xs text-white font-semibold">
                          <li>2x Es Kopi Susu</li>
                          <li>1x French Fries<span className="block text-[10px] text-sky-300 font-normal">Catatan: Saus Pisah</span></li>
                        </ul>
                      </div>
                      <div className="mt-3 pt-2.5 border-t border-slate-700/70 text-center">
                        <span className="block w-full py-1.5 rounded-lg bg-emerald-600 text-white text-[10px] font-bold">Sedang Disiapkan</span>
                      </div>
                    </div>
                    <div className="bg-[#131F35] rounded-xl p-3.5 border-t-4 border-emerald-500 opacity-65 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-1.5">
                          <span className="text-white font-black text-base">Meja 09</span>
                          <span className="text-[9px] font-bold text-emerald-400 bg-emerald-400/15 px-2 py-0.5 rounded">#10 · SIAP</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mb-2.5">Andi · 10:42 WIB</p>
                        <ul className="space-y-1.5 text-xs text-slate-300 font-medium line-through">
                          <li>2x Matcha Latte</li>
                          <li>1x Roti Bakar Cokelat</li>
                        </ul>
                      </div>
                      <div className="mt-3 pt-2.5 border-t border-slate-700/70 text-center">
                        <span className="block w-full py-1.5 rounded-lg bg-slate-800 text-emerald-400 text-[10px] font-bold">HP Pelanggan Terpanggil</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden sm:flex flex-col items-center">
                <div className="w-28 h-3 bg-[#0B172A] rounded-b-lg"></div>
                <div className="w-44 h-1.5 bg-slate-300 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FILOSOFI ZERO-BLOATWARE */}
      <section id="kesederhanaan" className="px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-sky-500/30 text-sky-300 text-[10px] font-black uppercase tracking-widest mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-[#EA8B42]"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
              <span>Filosofi Zero-Bloatware</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4 font-display">Kenapa Aplikasi Kasir Lain <span className="text-gradient-nf">Terasa Membingungkan?</span></h2>
            <p className="text-slate-300 text-base sm:text-lg font-medium">Banyak aplikasi POS menumpuk puluhan menu pengaturan yang tidak pernah dipakai kasir. NexaFlow memangkas semua bagian "sampah" tersebut agar staf Anda fokus melayani pelanggan.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            <div className="rounded-3xl card-obsidian p-6 sm:p-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold mb-4">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                <span>Aplikasi POS Konvensional</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mb-4 font-display">Penuh Menu yang Tidak Pernah Dipakai</h3>
              <ul className="space-y-3.5 text-sm font-medium text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">×</span>
                  <span>Puluhan tab pengaturan teknis yang membuat kasir takut salah pencet saat kafe sedang ramai.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">×</span>
                  <span>Pelanggan masih harus mengantre panjang di depan meja kasir untuk menyebutkan pesanan satu per satu.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">×</span>
                  <span>Setiap ganti karyawan baru harus training berhari-hari karena alurnya berbelit-belit.</span>
                </li>
              </ul>
            </div>
            <div className="rounded-3xl bg-gradient-to-br from-[#0F294A] via-[#132A4A] to-[#0A1426] text-white p-6 sm:p-8 shadow-2xl border border-sky-400/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#EA8B42]/20 rounded-full blur-3xl pointer-events-none"></div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EA8B42]/20 border border-[#EA8B42]/40 text-[#FBBF24] text-xs font-bold mb-4">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Pendekatan Full-Stack NexaFlow</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mb-4 font-display">Bersih, Presisi, Langsung Jalan dalam 5 Menit</h3>
              <ul className="space-y-3.5 text-sm font-medium text-slate-200">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#2563EB] text-white flex items-center justify-center shrink-0 mt-0.5"><Icons.check /></span>
                  <span><strong className="text-white">Layar iPad/PC Kasir Khusus Transaksi:</strong> Hanya menampilkan antrean masuk, konfirmasi bayar, dan cetak struk.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#2563EB] text-white flex items-center justify-center shrink-0 mt-0.5"><Icons.check /></span>
                  <span><strong className="text-white">Otomatisasi di Balik Layar:</strong> Hitung pajak, diskon, nomor antrean harian, dan penguncian stok berjalan otomatis di server tanpa perlu disetel kasir.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#D97736] text-white flex items-center justify-center shrink-0 mt-0.5"><Icons.check /></span>
                  <span><strong className="text-white">100% Terima Beres:</strong> Tim kami yang menyiapkan semua pengaturan awal hingga kafe Anda siap menerima pesanan pertama.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FITUR */}
      <section id="fitur" className="px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative z-10 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4 font-display">Teknologi Full-Stack<br /><span className="text-gradient-nf">yang Bekerja Otomatis</span></h2>
            <p className="text-slate-300 text-base sm:text-lg font-medium">Canggih di dalam mesinnya, namun sangat ringan dan sederhana saat disentuh oleh staf Anda.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((f, i) => {
              const IconComp = Icons[f.icon];
              return (
                <div key={i} className="group rounded-2xl p-6 card-obsidian transition-all duration-300 hover:-translate-y-1">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-sky-500/15 border border-sky-400/30 text-sky-400 mb-4 group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                    <IconComp />
                  </div>
                  <h3 className="text-lg font-black text-white mb-2 font-display">{f.title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed font-medium">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* KENAPA NEXAFLOW */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 sm:py-24 relative bg-[#F8FAFC] text-[#0B172A] z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B172A] tracking-tight leading-tight mb-4 font-display">Kenapa Harus <span className="text-gradient-sapphire">NexaFlow?</span></h2>
            <p className="text-slate-600 text-base sm:text-lg font-medium">Bukan sekadar aplikasi kasir, melainkan mitra operasional yang memastikan kafe Anda berjalan rapi setiap hari.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {whyUs.map((w, i) => {
              const IconComp = Icons[w.icon];
              return (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-center group">
                  <div className="w-14 h-14 mx-auto bg-sky-50 border border-sky-200 text-[#1E4E8C] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 group-hover:bg-[#0F294A] group-hover:text-[#FBBF24] group-hover:border-[#0F294A] transition-all">
                    <IconComp />
                  </div>
                  <h3 className="text-base font-black text-[#0B172A] mb-2 font-display">{w.title}</h3>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">{w.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PERBANDINGAN */}
      <section id="bandingkan" className="px-4 sm:px-6 lg:px-8 py-20 sm:py-24 relative z-10 bg-white text-[#0B172A] border-t border-slate-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B172A] tracking-tight leading-tight mb-4 font-display">NexaFlow vs <span className="text-gradient-sapphire">Lainnya</span></h2>
            <p className="text-slate-600 text-base sm:text-lg font-medium">Lihat mengapa sistem yang simpel dan terfokus jauh lebih efektif dibandingkan POS konvensional yang rumit.</p>
          </div>
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
            <div className="grid grid-cols-4 bg-[#070B14] text-white text-center text-[10px] sm:text-sm font-black uppercase tracking-wider">
              <div className="p-3 sm:p-5 text-left border-r border-slate-800">Keunggulan Sistem</div>
              <div className="p-3 sm:p-5 border-r border-slate-800 text-slate-300">Manual / Buku</div>
              <div className="p-3 sm:p-5 border-r border-slate-800 text-slate-300">POS Konvensional</div>
              <div className="p-3 sm:p-5 btn-sapphire text-white">NexaFlow</div>
            </div>
            {comparisons.map((r, i) => (
              <div key={i} className={`grid grid-cols-4 text-center text-xs sm:text-sm font-bold ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/80'} border-t border-slate-200`}>
                <div className="p-3 sm:p-5 text-left text-[#0B172A] border-r border-slate-200 flex items-center">{r.f}</div>
                <div className="p-3 sm:p-5 border-r border-slate-200 flex justify-center items-center">{r.m ? <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700"><Icons.check /></span> : <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-50 text-rose-500"><Icons.x /></span>}</div>
                <div className="p-3 sm:p-5 border-r border-slate-200 flex justify-center items-center">{r.c ? <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700"><Icons.check /></span> : <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-50 text-rose-500"><Icons.x /></span>}</div>
                <div className="p-3 sm:p-5 bg-sky-50/70 flex justify-center items-center">{r.n ? <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#2563EB] text-white shadow-sm"><Icons.check /></span> : <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-50 text-rose-500"><Icons.x /></span>}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CARA KERJA */}
      <section id="cara-kerja" className="px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative z-10 bg-[#F8FAFC] text-[#0B172A] border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B172A] tracking-tight leading-tight mb-4 font-display">Mulai Beroperasi dalam <span className="text-gradient-sapphire">3 Langkah Terima Beres</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4 sm:gap-6 relative">
            <div className="relative bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 text-center md:text-left shadow-sm">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 text-[#1E4E8C] font-black text-lg mb-4">01</div>
              <h3 className="text-lg sm:text-xl font-black text-[#0B172A] mb-2 flex items-center justify-center md:justify-start gap-2">
                <span>Kirim Menu</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#D97736]"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                <span>Kami Setup Penuh</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">Anda tidak perlu pusing melakukan pengaturan awal. Tim kami yang menginput seluruh menu, foto, dan nomor meja kafe Anda — <strong className="text-[#0B172A]">100% gratis</strong>.</p>
            </div>
            <div className="relative bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 text-center md:text-left shadow-sm">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 text-[#1E4E8C] font-black text-lg mb-4">02</div>
              <h3 className="text-lg sm:text-xl font-black text-[#0B172A] mb-2">Pasang QR Meja</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">Kode QR siap pakai langsung diletakkan di setiap meja pelanggan. Kasir dan dapur cukup membuka sistem dari iPad, PC, atau Tablet yang ada.</p>
            </div>
            <div className="relative bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 text-center md:text-left shadow-sm">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-[#D97736] font-black text-lg mb-4">03</div>
              <h3 className="text-lg sm:text-xl font-black text-[#0B172A] mb-2">Staf Lancar dalam 5 Menit</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">Karena tampilannya bersih tanpa menu sampah, kasir dan koki langsung paham cara pakainya. Kami dampingi sampai benar-benar jalan.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAM IMPLEMENTASI */}
      <section id="harga" className="px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-sky-500/30 text-sky-300 text-[10px] font-black tracking-[0.15em] uppercase mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-[#EA8B42]"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
              <span>Garansi Implementasi Tanpa Risiko</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4 font-display">Setup Gratis, Dibimbing Sampai Bisa,<br /><span className="text-gradient-nf">Komitmen Setelah Sistem Jalan.</span></h2>
            <p className="text-slate-300 text-base sm:text-lg font-medium">Buktikan sendiri kemudahannya di kafe Anda terlebih dahulu tanpa biaya pemasangan di awal.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-12">
            <div className="card-obsidian rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center text-sky-400 mx-auto mb-4"><Icons.wrench /></div>
              <h3 className="font-black text-white mb-2">Setup 100% Gratis</h3>
              <p className="text-xs font-medium text-slate-400 leading-relaxed">Kami input menu, QR meja, dan foto produk. Anda tinggal terima beres.</p>
            </div>
            <div className="card-obsidian rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center text-sky-400 mx-auto mb-4"><Icons.users /></div>
              <h3 className="font-black text-white mb-2">Bimbingan Sampai Bisa</h3>
              <p className="text-xs font-medium text-slate-400 leading-relaxed">Pendampingan langsung oleh tim kami sampai staf kasir & dapur lancar.</p>
            </div>
            <div className="card-obsidian rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-[#EA8B42] mx-auto mb-4">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="m9 16 2 2 4-4"/></svg>
              </div>
              <h3 className="font-black text-white mb-2">Aktif Jalan Dulu</h3>
              <p className="text-xs font-medium text-slate-400 leading-relaxed">Tidak ada biaya di muka. Sistem dipastikan berjalan mulus terlebih dahulu.</p>
            </div>
          </div>

          <div className="relative max-w-md mx-auto">
            <div className="absolute -inset-2 bg-gradient-to-r from-[#2563EB] via-sky-400 to-[#EA8B42] rounded-[2.25rem] blur-xl opacity-50"></div>
            <div className="relative rounded-[2rem] bg-white text-[#0B172A] border border-slate-200 overflow-hidden shadow-2xl">
              <div className="p-6 sm:p-10 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#D97736] text-[11px] font-extrabold uppercase tracking-widest mb-3">Paket Full-Stack All-In-One</div>
                <div className="mb-6">
                  <p className="text-3xl sm:text-4xl font-black text-[#0B172A] leading-tight font-display">Terima Beres & Siap Pakai</p>
                  <p className="text-xs sm:text-sm font-medium text-slate-500 mt-2">Tanpa biaya setup · Skema kemitraan fleksibel setelah sistem jalan</p>
                </div>
                <div className="space-y-3 mb-8 text-left">
                  {pricingFeatures.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-sky-50 border border-sky-200 text-[#2563EB] flex items-center justify-center mt-0.5 shrink-0"><Icons.check /></span>
                      <span className="text-xs sm:text-sm font-bold text-slate-600">{item}</span>
                    </div>
                  ))}
                </div>
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl btn-sapphire text-white font-black text-sm sm:text-base hover:-translate-y-0.5 transition-all">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#FBBF24]"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                  <span>Konsultasi & Klaim Setup Gratis</span>
                </a>
                <p className="text-center text-[10px] sm:text-[11px] font-bold text-slate-500 mt-4 leading-relaxed">
                  Didampingi langsung oleh tim mitra resmi NexaFlow<br />
                  Tanpa DP di awal · Bebas ribet · Langsung siap operasional
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative bg-[#F8FAFC] text-[#0B172A] border-t border-slate-200 z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B172A] tracking-tight leading-tight font-display">Pertanyaan Umum</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={i} className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
                <button type="button" onClick={() => setOpenFaq(openFaq === i ? -1 : i)} className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left hover:bg-slate-50 transition-colors">
                  <span className="font-bold text-[#0B172A] text-sm sm:text-base">{f.q}</span>
                  <span className={`w-7 h-7 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center shrink-0 text-[#1E4E8C] transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="6 9 12 15 18 9"/></svg>
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium border-t border-slate-100 pt-3">
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 px-4 sm:px-6 lg:px-8 py-12 sm:py-16 bg-[#04060B] text-slate-300 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 mb-10 sm:mb-12">
            <div className="sm:col-span-2">
              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center p-1.5 shadow-lg">
                  <LogoImg className="w-full h-full" />
                </div>
                <div>
                  <p className="text-lg font-black text-white leading-none uppercase font-display">NEXA<span className="text-sky-400">FLOW</span></p>
                  <p className="text-[10px] font-bold text-[#EA8B42] tracking-[0.2em] uppercase mt-1">FULL-STACK RESTAURANT OS</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm font-medium">Sistem kasir dan pemesanan QR full-stack yang menghilangkan antrean di depan kasir, bebas menu sampah, dan langsung dipahami oleh seluruh staf Kafe & Resto Anda.</p>
            </div>
            <div>
              <p className="text-[10px] sm:text-xs font-black text-white uppercase tracking-widest mb-3">Navigasi Produk</p>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li><a href="#masalah-internal" className="text-slate-400 hover:text-white font-semibold transition-colors">Solusi Masalah Kafe</a></li>
                <li><a href="#tampilan" className="text-slate-400 hover:text-white font-semibold transition-colors">Layar HP, iPad & PC</a></li>
                <li><a href="#kesederhanaan" className="text-slate-400 hover:text-white font-semibold transition-colors">Filosofi Simpel</a></li>
                <li><a href="#harga" className="text-slate-400 hover:text-white font-semibold transition-colors">Program Implementasi</a></li>
                <li><Link href="/login" className="text-slate-400 hover:text-white font-semibold transition-colors">Masuk Akun</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-[10px] sm:text-xs font-black text-white uppercase tracking-widest mb-3">Hubungi Kami</p>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                <li>
                  <a href={waLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-slate-400 hover:text-white font-semibold transition-colors">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#EA8B42]"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                    <span>WhatsApp Konsultasi</span>
                  </a>
                </li>
                <li>
                  <a href="mailto:nexaflow@nexaflowkasir.it.com" className="inline-flex items-center gap-2 text-slate-400 hover:text-white font-semibold transition-colors">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-sky-400"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    <span>nexaflow@nexaflowkasir.it.com</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-[10px] sm:text-xs font-semibold text-slate-500">© {new Date().getFullYear()} NexaFlow Digital Solution. All rights reserved.</p>
            <p className="text-[10px] sm:text-xs font-semibold text-slate-500 flex items-center gap-1.5"><span>Dirancang presisi untuk Kafe & Resto di Indonesia</span></p>
          </div>
        </div>
      </footer>

      {/* FLOATING WA */}
      <a href={waLink} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-2xl btn-sapphire text-white flex items-center justify-center shadow-2xl hover:scale-105 transition-transform border border-sky-400/40" aria-label="Chat WhatsApp">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#EA8B42] rounded-full border-2 border-[#060911]"></span>
      </a>

    </div>
  );
}