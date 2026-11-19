'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// ============ KONFIGURASI TAUTAN DEMO ============
const WA_NUMBER = '6281389744957';
const WA_MESSAGE = 'Halo NexaFlow, saya ingin menjadwalkan demo serta menanyakan informasi paket sistem kasir + Dashboard Owner untuk kafe/resto saya.';
const demoLink = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`;

// ============ KOMPONEN LOGO ============
const LogoImg = ({ className = 'w-10 h-10' }) => (
  <img
    src="/logo-nexaflow-3d.png"
    alt="NexaFlow Logo"
    className={`${className} object-contain`}
  />
);

// ============ DATA FITUR & ALUR ============
const businessTypes = [
  'Kafe / Coffee Shop',
  'Restoran / Rumah Makan',
  'Bakery / Pastry',
  'Food Court / Booth',
];

const aiFeatures = [
  { title: 'Deteksi Anomali Omzet & Biaya', desc: 'Membandingkan pendapatan cabang terhadap rata-rata 30 hari serta mengaudit rasio pengeluaran dan gaji.' },
  { title: 'Promo Jam Sepi Auto-Stop 16:30', desc: 'Aktifkan harga coret dan label unggulan dalam 1 klik, lalu kembali normal otomatis sesuai jadwal.' },
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
  { icon: 'qr', title: 'Self-Order via QR', desc: 'Pelanggan pesan mandiri dari meja tanpa unduh aplikasi.' },
  { icon: 'kds', title: 'Kitchen Display', desc: 'Layar monitor dapur pengganti kertas pesanan lengkap dengan pantauan bottleneck.' },
  { icon: 'qris', title: 'QRIS Dinamis', desc: 'Cetak QRIS dengan nominal tagihan otomatis sesuai total pesanan.' },
  { icon: 'chart', title: 'Laporan P&L & CSV', desc: 'Pantau omzet, pengeluaran harian, dan laba bersih dari HP kapan saja. Ekspor CSV 1 klik.' },
  { icon: 'tag', title: 'Promo & Diskon Terjadwal', desc: 'Atur harga coret dan label unggulan dengan penghentian otomatis pukul 16:30 WIB.' },
  { icon: 'speaker', title: 'Panggilan Suara', desc: 'HP pelanggan memanggil nama dan nomor antrean saat pesanan siap.' },
  { icon: 'printer', title: 'Cetak Struk Lintas Perangkat', desc: 'Mendukung Android (RawBT), iPad (BR RawPrinter), Windows (QZ Tray), dan Browser.' },
  { icon: 'shield', title: 'Anti-Fraud & Keamanan RLS', desc: 'Harga divalidasi di database server (RPC) dan kolom sensitif terlindungi.' },
];

const simSteps = [
  {
    step: 1,
    label: '1. Pelanggan Pesan',
    role: 'QR Meja (/order)',
    title: 'Pesan dari Meja Tanpa Antre',
    desc: 'Pelanggan duduk nyaman, scan QR di meja, melihat promo aktif, dan mengirim pesanan langsung dari HP.',
    ownerNote: 'Pesanan #14 masuk ke antrean menunggu konfirmasi.',
  },
  {
    step: 2,
    label: '2. Kasir Konfirmasi',
    role: 'POS Kasir (/dashboard)',
    title: 'Pembayaran & Cetak Struk',
    desc: 'Kasir menerima pesanan real-time (Mode Terang/Gelap), memverifikasi Tunai atau QRIS Dinamis, dan stok menu langsung terpotong.',
    ownerNote: 'Omzet cabang bertambah dan stok menu otomatis diperbarui.',
  },
  {
    step: 3,
    label: '3. Dapur Siap',
    role: 'Layar KDS (/kitchen)',
    title: 'Catatan Dapur & Panggilan Suara',
    desc: 'Dapur memproses pesanan sesuai catatan khusus, lalu 1 klik memanggil HP pelanggan beserta nomor antrean.',
    ownerNote: 'Durasi penyajian KDS tercatat ke metrik kecepatan dapur.',
  },
  {
    step: 4,
    label: '4. Pantauan Owner',
    role: 'Dashboard Owner (/owner)',
    title: 'Rekap Laba & Audit AI Otomatis',
    desc: 'Seluruh transaksi langsung masuk ke grafik P&L, laporan CSV, dan analisis AI Business Advisor lintas cabang.',
    ownerNote: 'Promo jam sepi otomatis berhenti pukul 16:30 WIB.',
  },
];

const faqs = [
  { q: 'Mengapa NexaFlow lebih mudah dibanding aplikasi kasir lain?', a: 'Kami membuang semua pengaturan rumit. Layar kasir dan dapur fokus pada transaksi harian sehingga staf baru langsung paham dalam 5 menit.' },
  { q: 'Perangkat dan printer apa saja yang didukung?', a: 'NexaFlow berjalan langsung di browser HP Android, iPad (termasuk iOS 15+), maupun Laptop/PC dengan Mode Terang & Gelap. Untuk cetak struk, mendukung RawBT (Android), BR RawPrinter (iPad), QZ Tray (Windows USB/LAN), dan cetak browser standar.' },
  { q: 'Bagaimana AI Agent membantu bisnis saya?', a: 'AI bekerja 24/7 mendeteksi anomali omzet, rasio biaya, kecurangan pembatalan tunai, menu kurang laku, hingga merekomendasikan promo 1-klik.' },
  { q: 'Apakah pelanggan bisa memanipulasi harga?', a: 'Tidak. Semua kalkulasi harga, pajak, dan pemotongan stok divalidasi ulang di database server (RPC) saat checkout.' },
  { q: 'Bagaimana cara mulai menggunakan atau menanyakan paket cabang?', a: 'Anda dapat langsung mencoba akun trial gratis 7 hari atau menghubungi tim kami via WhatsApp untuk konsultasi paket dan bantuan setup menu serta QR meja.' },
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
  chevron: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="6 9 12 15 18 9"/></svg>,
  arrowRight: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
};

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(0);
  const [phoneAlertOpen, setPhoneAlertOpen] = useState(false);
  const [demoOrderConfirmed, setDemoOrderConfirmed] = useState(false);
  const [simStage, setSimStage] = useState(1);
  const [autoSim, setAutoSim] = useState(true);
  const canvasRef = useRef(null);

  // Animasi Partikel Bawaan Awal
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

  const applyStage = (stage) => {
    setSimStage(stage);
    if (stage === 1) {
      setPhoneAlertOpen(false);
      setDemoOrderConfirmed(false);
    } else if (stage === 2) {
      setPhoneAlertOpen(false);
      setDemoOrderConfirmed(true);
    } else if (stage === 3) {
      setDemoOrderConfirmed(true);
      setPhoneAlertOpen(true);
    } else if (stage === 4) {
      setDemoOrderConfirmed(true);
      setPhoneAlertOpen(false);
    }
  };

  useEffect(() => {
    if (!autoSim) return;
    const timer = setInterval(() => {
      setSimStage((prev) => {
        const next = prev >= 4 ? 1 : prev + 1;
        if (next === 1) {
          setPhoneAlertOpen(false);
          setDemoOrderConfirmed(false);
        } else if (next === 2) {
          setPhoneAlertOpen(false);
          setDemoOrderConfirmed(true);
        } else if (next === 3) {
          setDemoOrderConfirmed(true);
          setPhoneAlertOpen(true);
        } else {
          setDemoOrderConfirmed(true);
          setPhoneAlertOpen(false);
        }
        return next;
      });
    }, 4200);
    return () => clearInterval(timer);
  }, [autoSim]);

  const activeSim = simSteps[simStage - 1];

  return (
    <div className="min-h-screen overflow-x-hidden selection:bg-[#2563EB] selection:text-white bg-[#04060B] font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@700;800;900&display=swap');
        body { font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
        h1, h2, h3, h4, .font-display { font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; }
        .card-3d { background: #0F1420; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05); transition: all 0.3s ease; }
        .card-3d:hover { border-color: rgba(37,99,235,0.3); transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1); }
        .btn-sapphire { background: linear-gradient(135deg, #1E4E8C 0%, #2563EB 55%, #1D4ED8 100%); box-shadow: 0 12px 32px -8px rgba(37, 99, 235, 0.55), inset 0 1px 0 0 rgba(255, 255, 255, 0.25); transition: all 0.2s; }
        .btn-sapphire:hover { background: linear-gradient(135deg, #2563EB 0%, #3B82F6 55%, #1E4E8C 100%); box-shadow: 0 16px 38px -6px rgba(59, 130, 246, 0.7), inset 0 1px 0 0 rgba(255, 255, 255, 0.35); transform: translateY(-1px); }
        .text-gradient { background: linear-gradient(to right, #60A5FA, #A78BFA); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .glow-effect { position: absolute; width: 800px; height: 800px; background: radial-gradient(circle, rgba(37,99,235,0.12) 0%, rgba(4,6,11,0) 70%); top: -200px; left: 50%; transform: translateX(-50%); z-index: 0; pointer-events: none; }
        .glow-effect-ai { position: absolute; width: 600px; height: 600px; background: radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(4,6,11,0) 70%); top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 0; pointer-events: none; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .hero-fade { animation: fadeUp 0.65s cubic-bezier(0.16, 1, 0.3, 1) both; }
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
            <span className="text-lg sm:text-xl font-black tracking-tight text-white font-display truncate">NexaFlow<span className="text-blue-500">.</span></span>
          </Link>
          <div className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <a href="#ai" className="hover:text-white transition-colors flex items-center gap-1.5">
              AI Copilot <span className="bg-purple-500/20 text-purple-300 text-[10px] px-2 py-0.5 rounded-full border border-purple-500/30">BARU</span>
            </a>
            <a href="#owner-dashboard" className="hover:text-white transition-colors">Dashboard Owner</a>
            <a href="#fitur" className="hover:text-white transition-colors">Fitur</a>
            <a href="#tampilan" className="hover:text-white transition-colors">Simulasi</a>
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
          NexaFlow v2.0 — Kasir Multi-Cabang + AI Copilot
        </div>
        <h1 className="hero-fade text-4xl sm:text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight mb-6 font-display">
          Kasir Pintar.<br />
          <span className="text-gradient">Otak Owner.</span>
        </h1>
        <p className="hero-fade text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-8 font-medium leading-relaxed">
          Satukan QR self-order meja, kasir, layar dapur, kontrol stok, laporan P&L, dan AI Business Advisor dalam satu sistem yang berjalan mulus di HP, iPad, maupun Laptop.
        </p>

        <div className="hero-fade flex flex-wrap items-center justify-center gap-2 mb-10">
          {businessTypes.map((type) => (
            <span key={type} className="px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 text-xs font-semibold">
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
          <a href="#tampilan" className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors">
            <span>Lihat Simulasi Alur 4 Layar</span>
            <Icons.chevron />
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
                    <p className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Riset Otomatis Periode Aktif</p>
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
                    <p className="text-[11px] text-emerald-400 mt-1">Jam sibuk terpantau</p>
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
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Berbasis Data Aktual.</span>
              </h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                AI memantau operasional cabang secara otomatis dari data transaksi nyata, mulai dari deteksi anomali hingga eksekusi promo 1-klik.
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
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4 font-display">Kontrol Penuh Seluruh Cabang</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Owner memiliki workspace khusus terpisah dari kasir untuk mengelola laba rugi, gaji staf, stok, dan audit AI.</p>
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
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4 font-display">Semua yang Bisnis Anda Butuhkan</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Kelola meja, kasir, dapur, dan laporan keuangan dalam satu alur kerja yang cepat di HP, iPad, maupun Laptop.</p>
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

      {/* SIMULASI ALUR KERJA PRESISI BERANIMASI (4 TAHAP) */}
      <section id="tampilan" className="py-20 px-6 relative z-10 bg-white text-slate-900 border-t border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3 font-display">Alur Kerja 4 Layar Terintegrasi</h2>
            <p className="text-slate-600 text-base">HP untuk Pelanggan, HP/iPad/PC untuk Kasir & Dapur, serta Dashboard Owner untuk kontrol cabang.</p>
          </div>

          <div className="max-w-4xl mx-auto mb-10 bg-slate-900 text-white rounded-2xl p-3 border border-slate-800 shadow-xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 px-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EA8B42] animate-pulse"></span>
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-200">Alur Otomatis:</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full md:w-auto">
                {simSteps.map((s) => (
                  <button
                    key={s.step}
                    type="button"
                    onClick={() => {
                      setAutoSim(false);
                      applyStage(s.step);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      simStage === s.step ? 'bg-[#2563EB] text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-3 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                style={{ width: `${(simStage / 4) * 100}%` }}
                className="h-full bg-[#2563EB] rounded-full transition-all duration-500 ease-out"
              ></div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
                Tahap {activeSim.step} dari 4 · {activeSim.role}
              </span>
              <h3 className="text-2xl font-black font-display text-slate-900">{activeSim.title}</h3>
              <p className="text-slate-600 leading-relaxed">{activeSim.desc}</p>
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Sinkronisasi ke Dashboard Owner</p>
                <p className="text-xs font-bold text-slate-900 mt-1">{activeSim.ownerNote}</p>
              </div>
              <div className="flex flex-wrap gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setAutoSim(false);
                    applyStage(simStage >= 4 ? 1 : simStage + 1);
                  }}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors"
                >
                  {simStage >= 4 ? 'Ulangi Alur' : 'Tahap Berikutnya'}
                </button>
                <button
                  type="button"
                  onClick={() => setAutoSim(!autoSim)}
                  className="px-4 py-2 bg-slate-100 border border-slate-300 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors"
                >
                  {autoSim ? 'Jeda Putar Otomatis' : 'Putar Otomatis'}
                </button>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="w-full max-w-[280px] h-[500px] bg-white rounded-[2.5rem] border-[8px] border-[#070B14] shadow-2xl overflow-hidden relative">
                <div className="p-4 h-full flex flex-col bg-slate-50 relative pt-10">
                  <div className="mb-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-blue-600 uppercase">Meja 10</p>
                      <h4 className="text-base font-black text-slate-900">Nexa Kafe</h4>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${demoOrderConfirmed ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                      {demoOrderConfirmed ? 'Diproses' : 'Pilih Menu'}
                    </span>
                  </div>
                  <div className="bg-white border rounded-xl p-3 shadow-sm mb-3">
                    <p className="font-bold text-sm">Iced Matcha Latte</p>
                    <p className="text-xs text-slate-400 line-through">Rp 23.000</p>
                    <p className="font-black text-blue-600 mt-1">Rp 18.000</p>
                  </div>
                  {demoOrderConfirmed && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 font-semibold">
                      Antrean #14 terkirim. Stok menu dan omzet owner diperbarui.
                    </div>
                  )}
                  <div className="mt-auto bg-blue-600 text-white rounded-xl p-3 flex justify-between items-center shadow-lg">
                    <div><p className="text-[10px]">Total</p><p className="font-bold">Rp 18.000</p></div>
                    <button
                      type="button"
                      onClick={() => {
                        setAutoSim(false);
                        applyStage(2);
                      }}
                      className="bg-white text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold"
                    >
                      {demoOrderConfirmed ? 'Terkirim' : 'Kirim'}
                    </button>
                  </div>
                  {phoneAlertOpen && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-10">
                      <div className="bg-white p-4 rounded-2xl text-center border-2 border-blue-500 w-full shadow-2xl">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse"><Icons.speaker /></div>
                        <h4 className="font-black text-slate-900 text-sm">Pesanan Siap!</h4>
                        <p className="text-xs text-slate-600 mt-1 mb-3">Antrean #14, Meja 10, silakan ambil pesanan.</p>
                        <button type="button" onClick={() => setPhoneAlertOpen(false)} className="w-full bg-blue-600 text-white text-xs py-2 rounded-lg font-bold">Tutup</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
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
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4 font-display">Siap Membawa Bisnis Anda ke Level Berikutnya?</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto text-sm sm:text-base">
            Jadwalkan demo dan konsultasi paket cabang via WhatsApp untuk melihat langsung alur kasir, dapur, dan Dashboard Owner, atau mulai dengan akun trial 7 hari.
          </p>
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
        <p>© {new Date().getFullYear()} NexaFlow SaaS. All rights reserved.</p>
      </footer>
    </div>
  );
}
