'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// ============ KONFIGURASI TAUTAN DEMO ============
const WA_NUMBER = '6281389744957';
const WA_MESSAGE = 'Halo NexaFlow, saya ingin menjadwalkan demo serta menanyakan informasi paket sistem kasir + Dashboard Owner untuk kafe/resto saya.';
const demoLink = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`;

// ============ KOMPONEN LOGO & WORDMARK ============
const LogoImg = ({ className = 'w-10 h-10' }) => (
  <img
    src="/logo-nexaflow-3d.png"
    alt="NexaFlow Logo"
    className={`${className} object-contain`}
  />
);

const BrandWordmark = ({ size = 'md' }) => (
  <div className="flex flex-col leading-none">
    <span className={`font-brand font-extrabold tracking-[-0.04em] ${size === 'lg' ? 'text-2xl' : 'text-lg sm:text-xl'}`}>
      <span className="text-white">Nexa</span>
      <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">Flow</span>
    </span>
    <span className="text-[8px] sm:text-[9px] font-bold tracking-[0.26em] text-sky-400/80 uppercase mt-0.5">
      Operational OS
    </span>
  </div>
);

// ============ DATA KONTEN ============
const businessTypes = [
  'Kafe / Coffee Shop',
  'Restoran / Rumah Makan',
  'Bakery / Pastry',
  'Food Court / Booth',
];

const painComparisons = [
  {
    oldTitle: 'Antrean Kasir Menumpuk di Jam Ramai',
    oldDesc: 'Staf kewalahan mencatat manual, salah hitung tagihan, pelanggan lama menunggu.',
    newTitle: 'Pesanan Mengalir Otomatis dari Meja',
    newDesc: 'Pelanggan scan QR, pilih menu, bayar QRIS/Cash—kasir tinggal 1 klik konfirmasi.',
  },
  {
    oldTitle: 'Nota Kertas Tercecer & Dapur Salah Masak',
    oldDesc: 'Pesanan sering terlewat atau tertukar saat jam makan siang dan akhir pekan.',
    newTitle: 'Layar Dapur Tertata & Panggilan Suara',
    newDesc: 'Setiap pesanan lengkap dengan catatan khusus tampil urut di layar KDS hingga siap saji.',
  },
  {
    oldTitle: 'Owner Ikut Ribet & Panik di Lapangan',
    oldDesc: 'Waktu habis mengurus masalah harian, rekap manual hingga malam, bisnis sulit berkembang.',
    newTitle: 'Owner Fokus Ekspansi & Pemasaran',
    newDesc: 'Omzet, laba bersih, stok, dan audit AI terpantau real-time dari HP tanpa harus turun tangan.',
  },
];

const aiFeatures = [
  { title: 'Deteksi Anomali Omzet & Biaya', desc: 'Membandingkan pendapatan cabang terhadap rata-rata 30 hari serta mengaudit rasio pengeluaran dan gaji.' },
  { title: 'Promo Jam Sepi Auto-Stop Terjadwal', desc: 'Aktifkan harga coret dan label unggulan dalam 1 klik, lalu kembali normal otomatis sesuai jadwal yang Anda atur (mis. 14:00–16:30).' },
  { title: 'Audit Fraud & Menu Kurang Laku', desc: 'Menandai pembatalan tunai jam malam, order menggantung, serta menu tanpa penjualan selama 30 hari.' },
  { title: 'Tanya Jawab Data Multi-Cabang', desc: 'Konsultasikan performa cabang dan rekomendasi paket bundling langsung kepada AI Business Advisor.' },
];

const ownerModules = [
  {
    code: '01',
    title: 'Command Center & AI Advisor',
    desc: 'Filter omzet per cabang atau gabungan, grafik perbandingan periode, serta eksekusi promo dan restok 1-klik.',
    badge: 'Multi-Cabang',
  },
  {
    code: '02',
    title: 'Keuangan, Penggajian & Stok',
    desc: 'Pisahkan biaya harian kasir dan beban bulanan, kelola kasbon, bonus, slip gaji, serta tambah stok menu (+10/+25).',
    badge: 'P&L Akurat',
  },
  {
    code: '03',
    title: 'Audit Fraud & Kecepatan Dapur',
    desc: 'Pantau pembatalan kasir, rata-rata waktu masak KDS, antrean meja terlama, dan jam sibuk dapur.',
    badge: 'Real-Time Audit',
  },
];

const features = [
  { icon: 'qr', title: 'Self-Order via QR', desc: 'Pelanggan pesan mandiri dari meja tanpa antre dan tanpa unduh aplikasi.' },
  { icon: 'kds', title: 'Kitchen Display', desc: 'Layar monitor dapur pengganti kertas pesanan lengkap dengan pantauan bottleneck.' },
  { icon: 'qris', title: 'QRIS Dinamis', desc: 'Cetak QRIS dengan nominal tagihan otomatis sesuai total pesanan.' },
  { icon: 'chart', title: 'Laporan P&L & CSV', desc: 'Pantau omzet, pengeluaran harian, dan laba bersih dari HP kapan saja. Ekspor CSV 1 klik.' },
  { icon: 'tag', title: 'Promo & Diskon Terjadwal', desc: 'Atur harga coret dan label unggulan dengan penghentian otomatis sesuai jadwal yang Anda tentukan.' },
  { icon: 'speaker', title: 'Panggilan Suara', desc: 'HP pelanggan memanggil nama dan nomor antrean saat pesanan siap.' },
  { icon: 'printer', title: 'Cetak Struk Lintas Perangkat', desc: 'Mendukung Android (RawBT), iPad (BR RawPrinter), Windows (QZ Tray), dan Browser.' },
  { icon: 'shield', title: 'Anti-Fraud & Keamanan RLS', desc: 'Harga divalidasi di database server (RPC) dan kolom sensitif terlindungi.' },
];

const videoScenes = [
  {
    step: 1,
    timeRange: '00:00 - 00:05',
    shortLabel: '01. QR Meja',
    role: 'Layar Pelanggan (/order)',
    title: 'Pelanggan Scan QR & Pesan Tanpa Antre',
    caption: 'Jam ramai tetap tenang: pelanggan duduk, scan QR meja, dan langsung kirim pesanan dari HP mereka sendiri.',
    ownerNote: 'Pesanan #14 otomatis masuk antrean tanpa staf harus mencatat manual.',
  },
  {
    step: 2,
    timeRange: '00:05 - 00:10',
    shortLabel: '02. POS Kasir',
    role: 'Layar Kasir (/dashboard)',
    title: 'Kasir 1 Klik Konfirmasi & Cetak Struk',
    caption: 'Tagihan terhitung otomatis. Kasir cukup verifikasi QRIS/Cash, struk tercetak, dan stok menu langsung terpotong.',
    ownerNote: 'Omzet cabang bertambah real-time dan stok tercatat akurat.',
  },
  {
    step: 3,
    timeRange: '00:10 - 00:15',
    shortLabel: '03. Layar Dapur',
    role: 'Kitchen Display (/kitchen)',
    title: 'Dapur Masak Tertata, Tanpa Kertas Tercecer',
    caption: 'Tim dapur melihat antrean jelas beserta catatan khusus. Selesai masak, 1 klik langsung memanggil HP pelanggan.',
    ownerNote: 'Kecepatan masak terekam otomatis tanpa perlu tanya-tanya staf.',
  },
  {
    step: 4,
    timeRange: '00:15 - 00:20',
    shortLabel: '04. Otak Owner',
    role: 'Dashboard Owner (/owner)',
    title: 'Owner Fokus Pengembangan & Pemasaran',
    caption: 'Tidak perlu lagi ikut ribet di jam ramai. Pantau laba bersih, stok, dan rekomendasi AI dari mana saja.',
    ownerNote: 'Operasional berjalan rapi sendiri—waktu owner kembali untuk membesarkan bisnis.',
  },
];

const faqs = [
  {
    q: 'Mengapa NexaFlow lebih efisien dibanding cara kasir biasa?',
    a: 'NexaFlow memotong langkah berulang di jam ramai. Pesanan langsung mengalir dari HP pelanggan ke kasir, dapur, hingga laporan laba rugi owner—tanpa catat manual dan tanpa rekap ulang di malam hari.',
  },
  {
    q: 'Apakah owner masih perlu ikut mengatur kasir saat jam ramai?',
    a: 'Tidak perlu. Alur kerja kasir dan dapur sudah dibuat sangat sederhana sehingga staf baru paham dalam 5 menit. Owner cukup memantau performa cabang, laba bersih, dan hasil audit AI dari HP agar bisa fokus ke pengembangan dan pemasaran.',
  },
  {
    q: 'Bisakah saya mengelola banyak cabang dari satu akun Owner?',
    a: 'Bisa. Melalui Owner Executive Suite, Anda dapat memantau seluruh cabang secara gabungan maupun memfilter per cabang untuk laporan P&L, stok menu, penggajian staf, hingga konsultasi AI Business Advisor dalam satu layar.',
  },
  {
    q: 'Perangkat dan printer apa saja yang didukung?',
    a: 'NexaFlow berjalan langsung di browser HP Android, iPad (termasuk iOS 15+), maupun Laptop/PC dengan Mode Terang & Gelap. Untuk cetak struk, mendukung RawBT (Android), BR RawPrinter (iPad), QZ Tray (Windows USB/LAN), dan cetak browser standar.',
  },
  {
    q: 'Bagaimana keamanan data dan pencegahan kecurangan kasir?',
    a: 'Semua kalkulasi harga, pajak, dan pemotongan stok divalidasi ulang di database server (RPC), dilindungi Row Level Security (RLS), serta diawasi oleh AI Audit yang menandai pembatalan pesanan mencurigakan dan transaksi menggantung.',
  },
  {
    q: 'Bagaimana cara kerja Coba Gratis 7 Hari dan aktivasi paket?',
    a: 'Anda dapat langsung mendaftar akun trial gratis 7 hari tanpa instalasi rumit untuk mencoba seluruh fitur secara nyata. Jika butuh bantuan setup menu, cetak QR meja, atau konsultasi paket cabang, tim kami siap mendampingi via WhatsApp.',
  },
];

const ctaHighlights = [
  'Setup Cepat Tanpa Instalasi Rumit',
  'Dukungan Onboarding via WhatsApp',
  'Cocok untuk HP, iPad & Laptop',
];

// ============ ICONS ============
const Icons = {
  qr: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3z"/><path d="M18 18h3v3h-3z"/><path d="M14 19h2"/><path d="M19 14v2"/></svg>,
  kds: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  qris: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><line x1="6" y1="15" x2="10" y2="15"/></svg>,
  chart: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
  tag: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  speaker: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>,
  printer: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>,
  bot: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M12 2a4 4 0 0 1 4 4v2h2a2 2 0 0 1 2 2v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-8a2 2 0 0 1 2-2h2V6a4 4 0 0 1 4-4z"/><circle cx="9" cy="13" r="1"/><circle cx="15" cy="13" r="1"/></svg>,
  check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg>,
  close: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  chevron: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="6 9 12 15 18 9"/></svg>,
  arrowRight: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  play: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><polygon points="6 4 20 12 6 20 6 4"/></svg>,
  pause: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>,
};

const SCENE_DURATION_MS = 5000;
const TOTAL_SCENES = 4;

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoTick, setVideoTick] = useState(0); // 0 to 20000 ms
  const canvasRef = useRef(null);

  // Animasi Partikel Bawaan Awal (Dipertahankan Utuh)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrameId;
    const particleCount = window.innerWidth < 768 ? 24 : 50;
    const maxDistance = 180;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.8 + 1.0,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(96, 165, 250, 0.32)';
        ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < maxDistance) {
            const opacity = 1 - distance / maxDistance;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${opacity * 0.16})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      animFrameId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  // Timer Pemutar Video Alur Kerja (Halus setiap 100ms)
  useEffect(() => {
    if (!isPlaying) return;
    const totalDuration = SCENE_DURATION_MS * TOTAL_SCENES;
    const interval = setInterval(() => {
      setVideoTick((prev) => (prev + 100 >= totalDuration ? 0 : prev + 100));
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const currentSceneIdx = Math.min(Math.floor(videoTick / SCENE_DURATION_MS), TOTAL_SCENES - 1);
  const simStage = currentSceneIdx + 1;
  const sceneElapsedMs = videoTick - currentSceneIdx * SCENE_DURATION_MS;
  const sceneProgressPct = Math.min((sceneElapsedMs / SCENE_DURATION_MS) * 100, 100);
  const totalSeconds = Math.floor(videoTick / 1000);
  const formattedTime = `00:${String(totalSeconds).padStart(2, '0')} / 00:20`;
  const activeSim = videoScenes[currentSceneIdx];

  const jumpToScene = (stageNumber) => {
    setVideoTick((stageNumber - 1) * SCENE_DURATION_MS);
  };

  // Sub-animasi per adegan (seperti keyframe video)
  const scene1Sent = simStage === 1 && sceneElapsedMs >= 2600;
  const scene2Confirmed = simStage === 2 && sceneElapsedMs >= 2100;
  const scene3Ready = simStage === 3 && sceneElapsedMs >= 2200;
  const scene4AiPop = simStage === 4 && sceneElapsedMs >= 1600;

  return (
    <div className="min-h-screen overflow-x-hidden selection:bg-[#2563EB] selection:text-white bg-[#04060B] font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@700;800;900&family=Space+Grotesk:wght@700;800&display=swap');
        body { font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
        h1, h2, h3, h4, .font-display { font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; }
        .font-brand { font-family: 'Space Grotesk', 'Plus Jakarta Sans', sans-serif; }
        .card-3d { background: #0F1420; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05); transition: all 0.3s ease; }
        .card-3d:hover { border-color: rgba(37,99,235,0.3); transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1); }
        .btn-sapphire { background: linear-gradient(135deg, #1E4E8C 0%, #2563EB 55%, #1D4ED8 100%); box-shadow: 0 12px 32px -8px rgba(37, 99, 235, 0.55), inset 0 1px 0 0 rgba(255, 255, 255, 0.25); transition: all 0.2s; }
        .btn-sapphire:hover { background: linear-gradient(135deg, #2563EB 0%, #3B82F6 55%, #1E4E8C 100%); box-shadow: 0 16px 38px -6px rgba(59, 130, 246, 0.7), inset 0 1px 0 0 rgba(255, 255, 255, 0.35); transform: translateY(-1px); }
        .text-gradient { background: linear-gradient(to right, #38BDF8, #60A5FA, #A78BFA); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .glow-effect { position: absolute; width: 800px; height: 800px; background: radial-gradient(circle, rgba(37,99,235,0.12) 0%, rgba(4,6,11,0) 70%); top: -200px; left: 50%; transform: translateX(-50%); z-index: 0; pointer-events: none; }
        .glow-effect-ai { position: absolute; width: 600px; height: 600px; background: radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(4,6,11,0) 70%); top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 0; pointer-events: none; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes sceneIn { from { opacity: 0; transform: translateY(12px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes scanBeam { 0%, 100% { top: 8%; } 50% { top: 86%; } }
        @keyframes tapPulse { 0% { transform: scale(0.8); opacity: 0.9; } 100% { transform: scale(2.1); opacity: 0; } }
        @keyframes receiptSlide { from { opacity: 0; transform: translateY(-14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes soundRing { 0% { transform: scale(0.85); opacity: 0.85; } 100% { transform: scale(1.7); opacity: 0; } }
        .hero-fade { animation: fadeUp 0.65s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .scene-enter { animation: sceneIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .scan-beam { animation: scanBeam 2s ease-in-out infinite; }
        .tap-pulse { animation: tapPulse 1.2s ease-out infinite; }
        .receipt-slide { animation: receiptSlide 0.45s ease-out both; }
        .sound-ring { animation: soundRing 1.4s ease-out infinite; }
      `}</style>

      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none"></canvas>
      <div className="glow-effect"></div>

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-[#04060B]/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 relative z-10 group min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white flex items-center justify-center p-1.5 shadow-lg group-hover:scale-105 transition-transform shrink-0">
              <LogoImg className="w-full h-full" />
            </div>
            <BrandWordmark />
          </Link>
          <div className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-300">
            <a href="#tampilan" className="hover:text-white transition-colors">Video Alur Kerja</a>
            <a href="#ai" className="hover:text-white transition-colors flex items-center gap-1.5">
              AI Copilot <span className="bg-purple-500/20 text-purple-300 text-[10px] px-2 py-0.5 rounded-full border border-purple-500/30">BARU</span>
            </a>
            <a href="#owner-dashboard" className="hover:text-white transition-colors">Dashboard Owner</a>
            <a href="#fitur" className="hover:text-white transition-colors">Fitur</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 relative z-10 shrink-0">
            <Link href="/login" className="text-xs sm:text-sm font-bold text-slate-200 hover:text-white transition-colors px-3 py-2 rounded-xl border border-slate-700/80 bg-slate-900/60 hover:bg-slate-800">Masuk</Link>
            <Link href="/register" className="btn-sapphire text-xs sm:text-sm px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-white font-bold whitespace-nowrap">Mulai Gratis</Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-32 sm:pt-40 pb-20 px-4 sm:px-6 max-w-6xl mx-auto text-center z-10">
        <div className="hero-fade inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-sky-500/30 text-sky-300 text-xs font-bold mb-8 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Sistem Operasional Kafe & Resto Generasi Baru
        </div>
        <h1 className="hero-fade text-4xl sm:text-5xl md:text-7xl font-black text-white leading-[1.08] tracking-tight mb-6 font-display">
          Hentikan Kerumitan Jam Ramai.<br />
          <span className="text-gradient">Owner Fokus Ekspansi.</span>
        </h1>
        <p className="hero-fade text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-8 font-medium leading-relaxed">
          <strong className="text-white">NexaFlow</strong> mengubah total alur kerja kafe dan resto Anda menjadi otomatis dari meja hingga laporan laba bersih. Tidak ada lagi antrean kacau, nota tercecer, atau owner yang ikut pusing di jam sibuk—waktu Anda kembali utuh untuk <strong className="text-sky-300">pengembangan cabang dan pemasaran</strong>.
        </p>

        <div className="hero-fade flex flex-wrap items-center justify-center gap-2 mb-10">
          {businessTypes.map((type) => (
            <span key={type} className="px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 text-xs font-semibold">
              {type}
            </span>
          ))}
        </div>

        <div className="hero-fade flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/register" className="btn-sapphire text-base px-8 py-4 rounded-xl text-white font-bold w-full sm:w-auto">
            Coba Gratis 7 Hari
          </Link>
          <a
            href={demoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-xl border border-slate-700 bg-slate-800/50 text-slate-200 font-bold hover:bg-slate-800 hover:text-white transition-all w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <span>Tanya Paket & Jadwalkan Demo</span>
            <Icons.arrowRight />
          </a>
        </div>

        <div className="hero-fade mt-5">
          <a href="#tampilan" className="inline-flex items-center gap-2 text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors">
            <span className="w-6 h-6 rounded-full bg-sky-500/20 border border-sky-400/40 flex items-center justify-center">
              <Icons.play />
            </span>
            <span>Tonton Simulasi Video Alur Kerja (20 Detik)</span>
          </a>
        </div>

        {/* MOCKUP DASHBOARD OWNER LENGKAP */}
        <div className="mt-14 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-[#04060B] via-transparent to-transparent z-10 pointer-events-none"></div>
          <div className="card-3d rounded-2xl p-2 border-slate-700/50 overflow-hidden max-w-5xl mx-auto">
            <div className="bg-[#0A0F1C] rounded-xl border border-slate-800 flex min-h-[360px] text-left">
              <div className="w-52 border-r border-slate-800 p-4 hidden md:flex flex-col justify-between">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-amber-400 tracking-widest uppercase mb-4">OWNER EXECUTIVE</p>
                  <div className="px-3 py-2.5 bg-blue-600/20 rounded-xl border border-blue-500/40 text-xs font-bold text-white">Command Center AI</div>
                  <div className="px-3 py-2.5 text-xs font-semibold text-slate-400">Keuangan & Stok</div>
                  <div className="px-3 py-2.5 text-xs font-semibold text-slate-400">Laporan Global P&L</div>
                  <div className="px-3 py-2.5 text-xs font-semibold text-slate-400">Pengaturan & AI Key</div>
                </div>
                <div className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-slate-400">
                  Filter: <strong className="text-white">Semua Cabang</strong>
                </div>
              </div>

              <div className="flex-1 p-5 sm:p-6 space-y-5">
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <div>
                    <p className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Kendali Penuh Tanpa Ikut Ribet</p>
                    <h3 className="text-base font-black text-white font-display">Command Center & AI Business Advisor</h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold">
                    Live Sync 3 Cabang
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-800/40 rounded-xl border border-slate-700/60 p-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Omzet Periode Ini</p>
                    <p className="text-lg font-black text-white mt-1">Rp 48.250.000</p>
                    <p className="text-[11px] text-sky-400 mt-1">1.120 transaksi selesai</p>
                  </div>
                  <div className="bg-slate-800/40 rounded-xl border border-slate-700/60 p-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Kecepatan Dapur (KDS)</p>
                    <p className="text-lg font-black text-white mt-1">6.4 Menit</p>
                    <p className="text-[11px] text-emerald-400 mt-1">Jam sibuk terkendali</p>
                  </div>
                  <div className="bg-purple-500/10 rounded-xl border border-purple-500/30 p-4">
                    <p className="text-[10px] font-bold text-purple-300 uppercase">Promo Jam Sepi</p>
                    <p className="text-lg font-black text-white mt-1">14:00 – 16:30</p>
                    <p className="text-[11px] text-amber-300 mt-1">Auto-stop tepat waktu</p>
                  </div>
                </div>

                <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-4 flex items-end gap-2 h-28">
                  <div className="flex-1 bg-blue-500/30 rounded-t h-[40%]"></div>
                  <div className="flex-1 bg-blue-500/45 rounded-t h-[58%]"></div>
                  <div className="flex-1 bg-blue-500/70 rounded-t h-[75%]"></div>
                  <div className="flex-1 bg-amber-500/70 rounded-t h-[52%]"></div>
                  <div className="flex-1 bg-blue-500 rounded-t h-[88%]"></div>
                  <div className="flex-1 bg-blue-400 rounded-t h-[95%]"></div>
                  <div className="flex-1 bg-blue-500/80 rounded-t h-[80%]"></div>
                  <div className="flex-1 bg-blue-500/40 rounded-t h-[46%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PERBANDINGAN: KENAPA ALUR KERJA BERUBAH TOTAL */}
      <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto relative z-10 border-t border-slate-800/50">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-sky-400 mb-2">Transformasi Operasional</p>
          <h2 className="text-3xl md:text-4xl font-black text-white font-display mb-4">
            Ubah Kekacauan Jam Ramai Menjadi Alur yang Tenang
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Bukan sekadar mencatat transaksi, NexaFlow memangkas semua kerumitan agar tim bekerja cepat dan owner bebas memikirkan pertumbuhan bisnis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {painComparisons.map((item, idx) => (
            <div key={idx} className="card-3d rounded-2xl p-6 flex flex-col gap-5">
              <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-4">
                <div className="flex items-center gap-2 text-rose-400 text-[11px] font-black uppercase tracking-wider mb-1.5">
                  <Icons.close /> Cara Lama
                </div>
                <h3 className="text-sm font-bold text-slate-200">{item.oldTitle}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.oldDesc}</p>
              </div>
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/25 p-4 mt-auto">
                <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-black uppercase tracking-wider mb-1.5">
                  <Icons.check /> Dengan NexaFlow
                </div>
                <h3 className="text-sm font-bold text-white">{item.newTitle}</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.newDesc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SIMULASI ALUR KERJA BERGAYA VIDEO (4 ADEGAN OTOMATIS) */}
      <section id="tampilan" className="py-20 px-4 sm:px-6 relative z-10 bg-[#070B14] border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-sky-400 mb-2">Demo Interaktif 20 Detik</p>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3 font-display">
              Lihat Bagaimana 4 Layar Bekerja Otomatis Tanpa Ribet
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Dari pelanggan scan QR hingga laporan laba masuk ke HP Owner—semua mengalir mulus tanpa campur tangan manual.
            </p>
          </div>

          {/* FRAME PEMUTAR VIDEO */}
          <div className="rounded-3xl bg-[#0D1322] border border-slate-700/80 shadow-2xl overflow-hidden">
            {/* TOP BAR PLAYER */}
            <div className="px-4 sm:px-6 py-3.5 bg-[#090D18] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[10px] font-black uppercase tracking-wider">
                  <span className={`w-2 h-2 rounded-full bg-rose-500 ${isPlaying ? 'animate-pulse' : ''}`}></span>
                  {isPlaying ? 'Memutar Demo' : 'Dijeda'}
                </span>
                <span className="text-xs font-bold text-slate-300 hidden sm:inline">
                  Adegan {activeSim.step}/4 · {activeSim.role}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-slate-400">{formattedTime}</span>
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold transition-colors"
                >
                  {isPlaying ? <Icons.pause /> : <Icons.play />}
                  <span>{isPlaying ? 'Jeda' : 'Putar'}</span>
                </button>
              </div>
            </div>

            {/* PANGGUNG VIDEO UTAMA */}
            <div className="p-5 sm:p-8 lg:p-10 min-h-[430px] flex flex-col justify-center bg-gradient-to-br from-[#0A1020] via-[#0D1528] to-[#090E1A] relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* VISUAL LAYAR YANG BERUBAH TIAP ADEGAN */}
                <div className="lg:col-span-7 flex justify-center">
                  {/* ADEGAN 1: HP PELANGGAN SCAN & PESAN */}
                  {simStage === 1 && (
                    <div key="scene-1" className="scene-enter w-full max-w-md bg-[#0F172A] border border-slate-700 rounded-2xl p-5 shadow-2xl">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                        <div>
                          <span className="text-[10px] font-black text-sky-400 uppercase tracking-wider">Meja 10 · QR Self-Order</span>
                          <h4 className="text-base font-black text-white">Nexa Kafe</h4>
                        </div>
                        <div className="relative w-11 h-11 rounded-lg bg-white p-1.5 overflow-hidden">
                          <div className="w-full h-full bg-slate-900/90 rounded-sm grid grid-cols-3 gap-0.5 p-1">
                            <span className="bg-white rounded-[1px]"></span>
                            <span className="bg-slate-900"></span>
                            <span className="bg-white rounded-[1px]"></span>
                            <span className="bg-slate-900"></span>
                            <span className="bg-white rounded-[1px]"></span>
                            <span className="bg-white rounded-[1px]"></span>
                            <span className="bg-white rounded-[1px]"></span>
                            <span className="bg-white rounded-[1px]"></span>
                            <span className="bg-slate-900"></span>
                          </div>
                          <div className="scan-beam absolute left-0 right-0 h-0.5 bg-sky-400 shadow-[0_0_8px_#38BDF8]"></div>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 flex justify-between items-center">
                          <div>
                            <p className="text-sm font-bold text-white">Iced Matcha Latte</p>
                            <p className="text-[11px] text-slate-400">Catatan: Es sedikit</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-slate-500 line-through">Rp 25.000</p>
                            <p className="text-sm font-black text-sky-400">Rp 20.000</p>
                          </div>
                        </div>
                        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 flex justify-between items-center">
                          <div>
                            <p className="text-sm font-bold text-white">Croissant Butter</p>
                            <p className="text-[11px] text-slate-400">1x Hangatkan</p>
                          </div>
                          <p className="text-sm font-black text-white">Rp 22.000</p>
                        </div>
                      </div>

                      <div className={`rounded-xl p-3.5 flex items-center justify-between transition-all duration-300 ${scene1Sent ? 'bg-emerald-500/20 border border-emerald-500/50' : 'bg-blue-600'}`}>
                        <div>
                          <p className="text-[10px] font-bold text-white/80 uppercase">Total Tagihan</p>
                          <p className="text-base font-black text-white">Rp 42.000</p>
                        </div>
                        <div className="relative">
                          {!scene1Sent && <span className="tap-pulse absolute inset-0 rounded-lg bg-white/50"></span>}
                          <span className={`relative z-10 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-black ${scene1Sent ? 'bg-emerald-500 text-white' : 'bg-white text-blue-700'}`}>
                            {scene1Sent ? (
                              <>
                                <Icons.check /> Terkirim #14
                              </>
                            ) : (
                              'Kirim Pesanan'
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ADEGAN 2: LAYAR KASIR POS KONFIRMASI & CETAK STRUK */}
                  {simStage === 2 && (
                    <div key="scene-2" className="scene-enter w-full max-w-md bg-[#0F172A] border border-slate-700 rounded-2xl p-5 shadow-2xl">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                        <div>
                          <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider">POS Kasir · Real-Time</span>
                          <h4 className="text-base font-black text-white">Antrean #14 — Meja 10</h4>
                        </div>
                        <span className="px-2.5 py-1 rounded-md bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-[10px] font-black">
                          QRIS DINAMIS
                        </span>
                      </div>

                      <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-3.5 space-y-2 mb-4">
                        <div className="flex justify-between text-xs font-bold text-slate-200">
                          <span>1x Iced Matcha Latte</span>
                          <span>Rp 20.000</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold text-slate-200">
                          <span>1x Croissant Butter</span>
                          <span>Rp 22.000</span>
                        </div>
                        <div className="border-t border-slate-700 pt-2 flex justify-between items-center">
                          <span className="text-xs text-slate-400 font-bold">Total Bayar</span>
                          <span className="text-base font-black text-sky-400">Rp 42.000</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <div className={`relative rounded-xl p-3 text-center text-xs font-black transition-all duration-300 ${scene2Confirmed ? 'bg-emerald-600 text-white' : 'bg-cyan-600 text-white'}`}>
                          {!scene2Confirmed && <span className="tap-pulse absolute inset-0 rounded-xl bg-cyan-300/40"></span>}
                          <span className="relative z-10 flex items-center justify-center gap-1.5">
                            <Icons.check /> {scene2Confirmed ? 'Lunas Terverifikasi' : 'Konfirmasi Lunas'}
                          </span>
                        </div>
                        <div className={`rounded-xl p-3 text-center text-xs font-black border transition-all ${scene2Confirmed ? 'bg-slate-800 border-emerald-500/50 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                          {scene2Confirmed ? 'Stok: 12 -> 11' : 'Stok: 12 Tersedia'}
                        </div>
                      </div>

                      {scene2Confirmed && (
                        <div className="receipt-slide mt-3 rounded-xl bg-emerald-500/15 border border-emerald-500/35 px-3.5 py-2.5 flex items-center justify-between text-xs text-emerald-200 font-bold">
                          <span className="flex items-center gap-2">
                            <Icons.printer /> Struk thermal tercetak otomatis
                          </span>
                          <span className="text-[10px] uppercase text-emerald-400">Terkirim ke Dapur</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ADEGAN 3: LAYAR DAPUR KDS & PANGGILAN SUARA */}
                  {simStage === 3 && (
                    <div key="scene-3" className="scene-enter w-full max-w-md bg-[#0F172A] border border-slate-700 rounded-2xl p-5 shadow-2xl">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                        <div>
                          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">Kitchen Display (KDS)</span>
                          <h4 className="text-base font-black text-white">Antrean Dapur Aktif</h4>
                        </div>
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-black ${scene3Ready ? 'bg-emerald-500 text-white' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'}`}>
                          {scene3Ready ? 'SIAP SAJI' : 'SEDANG DIMASAK'}
                        </span>
                      </div>

                      <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-black text-white">Antrean #14 · Meja 10</span>
                          <span className="text-xs font-bold text-emerald-400">4 mnt</span>
                        </div>
                        <p className="text-xs text-slate-200 font-semibold">1x Iced Matcha Latte (Es sedikit)</p>
                        <p className="text-xs text-slate-200 font-semibold mt-1">1x Croissant Butter (Hangatkan)</p>
                        <div className="mt-3 h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 transition-all duration-700 rounded-full" style={{ width: scene3Ready ? '100%' : '62%' }}></div>
                        </div>
                      </div>

                      {scene3Ready ? (
                        <div className="receipt-slide rounded-xl bg-blue-600/20 border border-blue-500/50 p-3.5 flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0">
                            <span className="sound-ring absolute inset-0 rounded-full border-2 border-sky-400"></span>
                            <Icons.speaker />
                          </div>
                          <div>
                            <p className="text-xs font-black text-white">Panggilan Suara ke HP Pelanggan</p>
                            <p className="text-[11px] text-sky-200 mt-0.5">&quot;Antrean 14, Meja 10, pesanan Anda siap!&quot;</p>
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-xl bg-slate-800 border border-slate-700 p-3 text-center text-xs font-bold text-slate-300">
                          Tanpa kertas bon tercecer — semua catatan tampil jelas
                        </div>
                      )}
                    </div>
                  )}

                  {/* ADEGAN 4: DASHBOARD OWNER FOKUS EKSPANSI & PEMASARAN */}
                  {simStage === 4 && (
                    <div key="scene-4" className="scene-enter w-full max-w-md bg-[#0F172A] border border-purple-500/40 rounded-2xl p-5 shadow-2xl">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                        <div>
                          <span className="text-[10px] font-black text-purple-300 uppercase tracking-wider">Owner Executive · Dari Mana Saja</span>
                          <h4 className="text-base font-black text-white">Laporan & AI Advisor</h4>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-black">
                          TERKENDALI
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Omzet Hari Ini</p>
                          <p className="text-base font-black text-sky-400 mt-1">
                            {scene4AiPop ? 'Rp 4.892.000' : 'Rp 4.850.000'}
                          </p>
                        </div>
                        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Laba Bersih</p>
                          <p className="text-base font-black text-emerald-400 mt-1">
                            {scene4AiPop ? 'Rp 3.412.000' : 'Rp 3.370.000'}
                          </p>
                        </div>
                      </div>

                      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex items-end gap-2 h-20 mb-3">
                        <div className="flex-1 bg-blue-500/40 rounded-t transition-all duration-700" style={{ height: '42%' }}></div>
                        <div className="flex-1 bg-blue-500/55 rounded-t transition-all duration-700" style={{ height: '58%' }}></div>
                        <div className="flex-1 bg-blue-500/70 rounded-t transition-all duration-700" style={{ height: '72%' }}></div>
                        <div className="flex-1 bg-sky-400 rounded-t transition-all duration-700" style={{ height: scene4AiPop ? '95%' : '68%' }}></div>
                        <div className="flex-1 bg-purple-400 rounded-t transition-all duration-700" style={{ height: scene4AiPop ? '100%' : '76%' }}></div>
                      </div>

                      {scene4AiPop && (
                        <div className="receipt-slide rounded-xl bg-purple-500/15 border border-purple-500/35 p-3 flex items-start gap-2.5">
                          <div className="text-purple-300 shrink-0 mt-0.5"><Icons.bot /></div>
                          <p className="text-[11px] text-purple-100 leading-relaxed font-semibold">
                            Jam ramai berjalan otomatis tanpa antrean macet. Anda bebas fokus pada strategi promo & buka cabang baru.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* NARASI / SUBTITLE VIDEO */}
                <div className="lg:col-span-5 space-y-4 text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-sky-300 text-xs font-bold">
                    <span>{activeSim.timeRange}</span>
                    <span>·</span>
                    <span>{activeSim.role}</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black font-display text-white leading-tight">
                    {activeSim.title}
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    {activeSim.caption}
                  </p>
                  <div className="rounded-xl bg-slate-900/90 border border-slate-700/80 p-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-emerald-400">Dampak Langsung ke Bisnis</p>
                    <p className="text-xs sm:text-sm font-bold text-white mt-1">{activeSim.ownerNote}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* TIMELINE BAR VIDEO (4 CHAPTER BISA DIKLIK) */}
            <div className="px-4 sm:px-6 py-4 bg-[#090D18] border-t border-slate-800">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {videoScenes.map((scene, idx) => {
                  const isDone = idx < currentSceneIdx;
                  const isCurrent = idx === currentSceneIdx;
                  const fillWidth = isDone ? 100 : isCurrent ? sceneProgressPct : 0;
                  return (
                    <button
                      key={scene.step}
                      type="button"
                      onClick={() => jumpToScene(scene.step)}
                      className={`text-left p-2.5 rounded-xl border transition-all ${
                        isCurrent
                          ? 'bg-slate-800/90 border-sky-500/60'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-bold mb-2">
                        <span className={isCurrent ? 'text-white' : 'text-slate-400'}>{scene.shortLabel}</span>
                        <span className="text-[10px] font-mono text-slate-500">0{scene.step}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full transition-all duration-100"
                          style={{ width: `${fillWidth}%` }}
                        ></div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION AI AGENT (SOROTAN UTAMA) */}
      <section id="ai" className="py-24 relative overflow-hidden border-t border-slate-800/50">
        <div className="glow-effect-ai"></div>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-bold text-purple-300 mb-6">
                <Icons.bot /> NexaFlow AI Copilot
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6 font-display">
                Asisten Bisnis Pintar <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Penjaga Profit Anda 24/7.</span>
              </h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                Biarkan AI yang mengawasi kebocoran biaya, pembatalan mencurigakan, dan jam sepi di tiap cabang—sementara Anda fokus menyusun strategi pemasaran dan pertumbuhan brand.
              </p>

              <div className="space-y-6 mb-10">
                {aiFeatures.map((f, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0 mt-0.5 border border-purple-500/30 text-purple-300">
                      <Icons.check />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-base">{f.title}</h4>
                      <p className="text-sm text-slate-400 mt-1">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/register" className="inline-flex items-center gap-2 text-purple-400 font-bold hover:text-purple-300 transition-colors">
                <span>Coba Fitur AI Sekarang</span>
                <Icons.arrowRight />
              </Link>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl opacity-50 rounded-full"></div>
              <div className="card-3d rounded-2xl p-6 border-purple-500/30 relative bg-[#0A0F1C]">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-300 border border-purple-500/30">
                      <Icons.bot />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">AI Business Advisor</p>
                      <p className="text-[10px] text-emerald-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-800/80 border border-slate-700/50 rounded-xl rounded-tl-none p-4 text-sm text-slate-300 w-11/12 shadow-sm">
                    <p className="font-bold text-rose-400 text-xs mb-1">Peringatan Anomali & Fraud:</p>
                    Terdeteksi pembatalan pesanan tunai jam malam di Cabang Pusat serta bottleneck dapur di pukul 19.00–20.00 WIB.
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl rounded-tr-none p-4 text-sm text-purple-100 ml-auto w-10/12 shadow-sm">
                    <p className="font-bold text-xs text-purple-300 mb-1">Rekomendasi Promo Jam Sepi:</p>
                    Aktifkan harga coret Iced Matcha Latte hingga pukul 16:30 WIB, lalu kembali normal otomatis.
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded">Eksekusi 1-Klik</span>
                      <span className="bg-slate-700 text-white text-xs font-bold px-3 py-1.5 rounded">Auto-Stop 16:30</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DASHBOARD OWNER MODULES */}
      <section id="owner-dashboard" className="py-20 px-6 max-w-7xl mx-auto z-10 relative border-t border-slate-800/50">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-widest text-sky-400 mb-2">Dashboard Owner</p>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4 font-display">Kendali Penuh Semua Cabang dari Satu Layar</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Workspace khusus owner terpisah dari kasir untuk mengelola laba rugi, gaji staf, stok, dan audit AI secara rapi.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ownerModules.map((m) => (
            <div key={m.code} className="card-3d p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-bold font-mono">{m.code}</span>
                  <span className="text-[11px] font-bold text-emerald-400">{m.badge}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{m.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FITUR UTAMA */}
      <section id="fitur" className="py-20 px-6 max-w-7xl mx-auto z-10 relative border-t border-slate-800/50">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4 font-display">Semua yang Operasional Anda Butuhkan</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Dirancang ringan dan intuitif di HP, iPad, maupun Laptop agar staf baru langsung siap bekerja dalam hitungan menit.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => {
            const IconComp = Icons[f.icon];
            return (
              <div key={i} className="card-3d p-6 rounded-2xl group">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <IconComp />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-6 relative bg-[#F8FAFC] text-slate-900 border-t border-slate-200 z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900 font-display">Pertanyaan Umum</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={i} className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
                <button type="button" onClick={() => setOpenFaq(openFaq === i ? -1 : i)} className="w-full flex items-center justify-between gap-4 p-4 text-left hover:bg-slate-50 transition-colors">
                  <span className="font-bold text-slate-900 text-sm md:text-base">{f.q}</span>
                  <span className={`w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 text-blue-600 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}>
                    <Icons.chevron />
                  </span>
                </button>
                {openFaq === i && <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">{f.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA PENUTUP */}
      <section id="konsultasi" className="py-20 px-4 sm:px-6 relative z-10 bg-[#04060B]">
        <div className="max-w-4xl mx-auto text-center card-3d p-6 sm:p-12 rounded-3xl border-blue-500/20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4 font-display">
            Saatnya Lepas dari Kerumitan Harian & Fokus Besarkan Bisnis
          </h2>
          <p className="text-slate-400 mb-6 max-w-xl mx-auto text-sm sm:text-base">
            Jadwalkan demo dan konsultasi paket cabang via WhatsApp untuk melihat langsung bagaimana NexaFlow menertibkan operasional Anda, atau mulai gratis selama 7 hari.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 mb-8">
            {ctaHighlights.map((item) => (
              <div key={item} className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-200">
                <span className="text-emerald-400 shrink-0">
                  <Icons.check />
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={demoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-sapphire inline-flex items-center justify-center gap-2 text-base px-8 py-4 rounded-xl text-white font-bold w-full sm:w-auto"
            >
              <span>Tanya Paket & Jadwalkan Demo</span>
              <Icons.arrowRight />
            </a>
            <Link
              href="/register"
              className="inline-flex items-center justify-center text-base px-8 py-4 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-100 font-bold w-full sm:w-auto transition-colors"
            >
              Daftar Trial Gratis
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800/50 py-8 text-center text-xs text-slate-500 relative z-10 bg-[#04060B]">
        <p>© {new Date().getFullYear()} NexaFlow Operational OS. All rights reserved.</p>
      </footer>
    </div>
  );
}
