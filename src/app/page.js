'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// ============ KONFIGURASI WHATSAPP ============
const WA_NUMBER = '6281389744957';
const WA_MESSAGE = 'Halo NexaFlow, saya tertarik dengan sistem kasir + AI Agent untuk kafe/resto saya. Bisa info lebih lanjut?';
const waLink = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`;

// ============ KOMPONEN LOGO ============
const LogoImg = ({ className = "w-10 h-10" }) => (
  <img 
    src="/logo-nexaflow-3d.png" 
    alt="NexaFlow Logo" 
    className={`${className} object-contain`} 
  />
);

// ============ DATA (Teks Diperpendek) ============
const internalSolutions = [
  { icon: 'users', metric: '0 Menit Antre', before: 'Antrean Menumpuk', title: 'Pelanggan Duduk & Pesan Mandiri', desc: 'Scan QR di meja, pesan dari HP. Kasir tak perlu lagi berteriak memanggil nama.' },
  { icon: 'kds', metric: '0 Struk Hilang', before: 'Kertas Pesanan Hilang', title: 'Catatan Tampil Jelas di Dapur', desc: 'Permintaan "Less Sugar" atau "Tanpa Pedas" langsung tampil di layar monitor KDS.' },
  { icon: 'speaker', metric: 'Panggilan Otomatis', before: 'Staf Teriak Bolak-balik', title: 'HP Pelanggan Bergetar Otomatis', desc: 'Pesanan selesai dimasak? 1 klik dari dapur langsung memanggil HP pelanggan.' },
  { icon: 'bolt', metric: 'Kunci Stok Real-Time', before: 'Pelanggan Kecewa Habis', title: 'Stok Habis Otomatis Terkunci', desc: 'Porsi terakhir terbeli? Status menu langsung berubah "Sold Out" detik itu juga.' },
  { icon: 'wallet', metric: 'Akurasi Kas 100%', before: 'Lembur Hitung Nota', title: 'Rekap Tunai & QRIS Otomatis', desc: 'Tutup toko tanpa pusing hitung uang fisik. Semua terjumlah otomatis.' },
  { icon: 'store', metric: '5 Menit Paham', before: 'Pusing Training Staf', title: 'Tanpa Menu Sampah', desc: 'Layar kasir bersih. Karyawan baru bisa langsung bekerja di hari pertama.' }
];

const aiFeatures = [
  { title: 'Deteksi Kecurangan Kasir', desc: 'AI memantau anomali pembatalan (void) pesanan tunai dan memberi peringatan.' },
  { title: 'Rekomendasi Eksekusi 1-Klik', desc: 'AI menyarankan promo untuk menu stok menipis, terapkan langsung dari dashboard.' },
  { title: 'Laporan Laba Rugi Cerdas', desc: 'Menghitung total pendapatan, biaya operasional, hingga estimasi gaji belum dibayar.' },
  { title: 'Tanya Jawab Bisnis', desc: '"Cabang mana yang paling untung bulan ini?" Tanyakan langsung ke AI Advisor.' }
];

const features = [
  { icon: 'qr', title: 'Self-Order via QR', desc: 'Pelanggan pesan mandiri dari meja tanpa unduh aplikasi.' },
  { icon: 'kds', title: 'Kitchen Display', desc: 'Layar monitor dapur pengganti kertas pesanan.' },
  { icon: 'qris', title: 'QRIS Dinamis', desc: 'Cetak QRIS dengan nominal tagihan otomatis.' },
  { icon: 'chart', title: 'Laporan Real-Time', desc: 'Pantau omzet dari HP kapan saja. Ekspor CSV 1 klik.' },
  { icon: 'tag', title: 'Promo & Diskon', desc: 'Atur harga coret dan label unggulan dengan mudah.' },
  { icon: 'speaker', title: 'Panggilan Suara', desc: 'HP pelanggan memanggil nama saat pesanan siap.' },
  { icon: 'printer', title: 'Cetak Bluetooth', desc: 'Struk thermal langsung dari iPad/Tablet kasir.' },
  { icon: 'shield', title: 'Anti-Fraud', desc: 'Harga dihitung ulang di database, aman dari manipulasi browser.' }
];

const faqs = [
  { q: 'Mengapa NexaFlow lebih mudah dibanding aplikasi kasir lain?', a: 'Kami membuang semua pengaturan rumit. Layar kasir dan dapur fokus pada transaksi harian. Staf baru langsung paham dalam 5 menit.' },
  { q: 'Bagaimana AI Agent membantu bisnis saya?', a: 'AI kami bekerja 24/7 mendeteksi kecurangan, merangkum laporan P&L secara otomatis, dan merekomendasikan promo yang menguntungkan.' },
  { q: 'Apakah pelanggan bisa memanipulasi harga?', a: 'Tidak. Semua kalkulasi harga, pajak, dan pemotongan stok divalidasi ulang di database server (RPC) saat checkout.' },
  { q: 'Berapa biaya setup awal?', a: 'Setup 100% Gratis. Tim kami yang menginput semua menu, foto, dan QR meja. Biaya langganan baru berjalan setelah sistem aktif.' }
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
  store: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>,
  bolt: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  wallet: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>,
  users: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  bot: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M12 2a4 4 0 0 1 4 4v2h2a2 2 0 0 1 2 2v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-8a2 2 0 0 1 2-2h2V6a4 4 0 0 1 4-4z"/><circle cx="9" cy="13" r="1"/><circle cx="15" cy="13" r="1"/></svg>,
  check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg>,
  x: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
};

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(0);
  const [phoneAlertOpen, setPhoneAlertOpen] = useState(true);
  const [demoOrderConfirmed, setDemoOrderConfirmed] = useState(false);
  const [simStage, setSimStage] = useState(1);
  const canvasRef = useRef(null);

  // Animasi Partikel
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
    if (stage === 1) { setPhoneAlertOpen(false); setDemoOrderConfirmed(true); }
    else if (stage === 2) { setPhoneAlertOpen(false); setDemoOrderConfirmed(false); }
    else if (stage === 3) { setPhoneAlertOpen(true); }
  };

  return (
    <div className="min-h-screen overflow-x-hidden selection:bg-[#2563EB] selection:text-white bg-[#04060B] font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@700;800;900&display=swap');
        body { font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
        h1, h2, h3, h4, .font-display { font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; }
        
        /* Desain 3D Jernih */
        .card-3d { background: #0F1420; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05); transition: all 0.3s ease; }
        .card-3d:hover { border-color: rgba(37,99,235,0.3); transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1); }
        .card-obsidian { background: linear-gradient(180deg, rgba(17, 25, 43, 0.88) 0%, rgba(10, 15, 28, 0.94) 100%); border: 1px solid rgba(148, 163, 184, 0.14); box-shadow: 0 20px 50px -15px rgba(0, 0, 0, 0.7), inset 0 1px 0 0 rgba(255, 255, 255, 0.08); }
        .card-obsidian:hover { border-color: rgba(96, 165, 250, 0.38); }
        
        .btn-sapphire { background: linear-gradient(135deg, #1E4E8C 0%, #2563EB 55%, #1D4ED8 100%); box-shadow: 0 12px 32px -8px rgba(37, 99, 235, 0.55), inset 0 1px 0 0 rgba(255, 255, 255, 0.25); transition: all 0.2s; }
        .btn-sapphire:hover { background: linear-gradient(135deg, #2563EB 0%, #3B82F6 55%, #1E4E8C 100%); box-shadow: 0 16px 38px -6px rgba(59, 130, 246, 0.7), inset 0 1px 0 0 rgba(255, 255, 255, 0.35); transform: translateY(-1px); }
        
        .text-gradient { background: linear-gradient(to right, #60A5FA, #A78BFA); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .text-gradient-gold { background: linear-gradient(to right, #FCD34D, #F59E0B); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        
        .glow-effect { position: absolute; width: 800px; height: 800px; background: radial-gradient(circle, rgba(37,99,235,0.12) 0%, rgba(4,6,11,0) 70%); top: -200px; left: 50%; transform: translateX(-50%); z-index: 0; pointer-events: none; }
        .glow-effect-ai { position: absolute; width: 600px; height: 600px; background: radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(4,6,11,0) 70%); top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 0; pointer-events: none; }
        
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        .animate-float { animation: float 6s infinite ease-in-out; }
        @keyframes pulse-subtle { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.92; } }
        .animate-pulse-subtle { animation: pulse-subtle 2.4s infinite ease-in-out; }
      `}</style>

      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none"></canvas>
      <div className="glow-effect"></div>

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-[#04060B]/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 relative z-10 group">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-1.5 shadow-lg group-hover:scale-105 transition-transform">
              <LogoImg className="w-full h-full" />
            </div>
            <span className="text-xl font-black tracking-tight text-white font-display">NexaFlow<span className="text-blue-500">.</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <a href="#fitur" className="hover:text-white transition-colors">Fitur</a>
            <a href="#ai" className="hover:text-white transition-colors flex items-center gap-1.5">
              AI Copilot <span className="bg-purple-500/20 text-purple-400 text-[10px] px-2 py-0.5 rounded-full border border-purple-500/30">NEW</span>
            </a>
            <a href="#tampilan" className="hover:text-white transition-colors">Simulasi</a>
            <a href="#harga" className="hover:text-white transition-colors">Harga</a>
          </div>
          <div className="flex items-center gap-4 relative z-10">
            <Link href="/login" className="text-sm font-bold text-slate-300 hover:text-white transition-colors hidden sm:block">Masuk</Link>
            <Link href="/register" className="btn-sapphire text-sm px-5 py-2.5 rounded-xl text-white font-bold">Mulai Gratis</Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-40 pb-20 px-6 max-w-6xl mx-auto text-center z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-sky-500/30 text-sky-300 text-xs font-bold mb-8 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          NexaFlow v2.0 — Dilengkapi AI Copilot
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight mb-6 font-display">
          Kasir Pintar.<br/>
          <span className="text-gradient">Otak Owner.</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 font-medium">
          Bukan sekadar aplikasi kasir. NexaFlow menganalisa laba, mendeteksi kecurangan kasir, dan mengelola stok secara otomatis dengan bantuan AI Agent.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/register" className="btn-sapphire text-base px-8 py-4 rounded-xl text-white font-bold w-full sm:w-auto">Coba Gratis 7 Hari</Link>
          <a href="#ai" className="px-8 py-4 rounded-xl border border-slate-700 bg-slate-800/50 text-slate-300 font-bold hover:bg-slate-800 hover:text-white transition-all w-full sm:w-auto flex items-center justify-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Lihat Demo AI
          </a>
        </div>
        
        {/* Mockup Dashboard Preview */}
        <div className="mt-16 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-[#04060B] via-transparent to-transparent z-10"></div>
          <div className="card-3d rounded-2xl p-2 border-slate-700/50 overflow-hidden max-w-4xl mx-auto">
            <div className="bg-[#0A0F1C] rounded-xl border border-slate-800 flex h-[350px]">
              <div className="w-48 border-r border-slate-800 p-4 hidden md:block space-y-4">
                <div className="h-4 w-24 bg-slate-800 rounded"></div>
                <div className="h-8 w-full bg-blue-500/20 rounded border border-blue-500/30"></div>
                <div className="h-8 w-full bg-slate-800/50 rounded"></div>
                <div className="h-8 w-full bg-slate-800/50 rounded"></div>
              </div>
              <div className="flex-1 p-6 space-y-6">
                 <div className="flex justify-between items-center">
                   <div className="h-6 w-32 bg-slate-800 rounded"></div>
                   <div className="h-8 w-24 bg-slate-800 rounded"></div>
                 </div>
                 <div className="grid grid-cols-3 gap-4">
                    <div className="h-24 bg-slate-800/50 rounded-lg border border-slate-700/50 p-4"><div className="h-3 w-16 bg-slate-700 rounded mb-3"></div><div className="h-6 w-24 bg-slate-600 rounded"></div></div>
                    <div className="h-24 bg-slate-800/50 rounded-lg border border-slate-700/50 p-4"><div className="h-3 w-16 bg-slate-700 rounded mb-3"></div><div className="h-6 w-24 bg-slate-600 rounded"></div></div>
                    <div className="h-24 bg-purple-500/10 rounded-lg border border-purple-500/30 p-4"><div class="h-3 w-16 bg-purple-500/50 rounded mb-3"></div><div className="h-6 w-24 bg-purple-500/50 rounded"></div></div>
                 </div>
                 <div className="h-32 bg-slate-800/30 rounded-lg border border-slate-800"></div>
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
            
            {/* Kiri: Teks AI */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-bold text-purple-400 mb-6">
                <Icons.bot /> NexaFlow AI Copilot
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6 font-display">
                Asisten Bisnis Pintar <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Yang Tidak Pernah Tidur.</span>
              </h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                AI kami memantau operasional kafe Anda 24/7. Mulai dari mendeteksi anomali kasir hingga memberikan saran promo yang menguntungkan.
              </p>
              
              <div className="space-y-6 mb-10">
                {aiFeatures.map((f, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0 mt-0.5 border border-purple-500/30">
                      <Icons.check className="text-purple-400 w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-base">{f.title}</h4>
                      <p className="text-sm text-slate-400 mt-1">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Link href="/register" className="inline-flex items-center gap-2 text-purple-400 font-bold hover:text-purple-300 transition-colors">
                Coba Fitur AI Sekarang <span className="text-lg">→</span>
              </Link>
            </div>

            {/* Kanan: UI Mockup AI Chat */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl opacity-50 rounded-full"></div>
              <div className="card-3d rounded-2xl p-6 border-purple-500/30 relative bg-[#0A0F1C]">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 border border-purple-500/30">
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
                    <p className="font-bold text-rose-400 text-xs mb-1">Peringatan Anomali:</p>
                    Terdapat 5 pembatalan pesanan tunai hari ini di Cabang Bandung senilai Rp 450.000. Disarankan cek CCTV kasir.
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl rounded-tr-none p-4 text-sm text-purple-100 ml-auto w-10/12 shadow-sm">
                    <p className="font-bold text-xs text-purple-400 mb-1">Rekomendasi Promo:</p>
                    Stok Croissant tersisa 30 pcs. Terapkan diskon 20% untuk menghabiskan stok sebelum jam tutup?
                    <div className="mt-3 flex gap-2">
                      <button className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-3 py-1.5 rounded transition-colors shadow-sm">Terapkan Promo</button>
                      <button className="bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold px-3 py-1.5 rounded transition-colors">Abaikan</button>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <div className="bg-[#04060B] border border-slate-800 rounded-lg p-3 text-xs text-slate-500 flex justify-between">
                    <span>Tanya sesuatu ke AI...</span>
                    <span className="text-purple-500 font-bold">Kirim</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FITUR UTAMA (Padat) */}
      <section id="fitur" className="py-20 px-6 max-w-7xl mx-auto z-10 relative border-t border-slate-800/50">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4 font-display">Semua yang Bisnis Anda Butuhkan</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Tinggalkan cara lama. Kelola kasir, staf, dan laporan keuangan dalam satu genggaman.</p>
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

      {/* SIMULASI 3 LAYAR (DARI FILE ASLI, DIPERTAHANKAN) */}
      <section id="tampilan" className="py-20 px-6 relative z-10 bg-white text-slate-900 border-t border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4 font-display">Simulasi 3 Layar</h2>
            <p className="text-slate-600 text-base">HP untuk Pelanggan, iPad & PC untuk Kasir & Dapur.</p>
          </div>

          <div className="max-w-4xl mx-auto mb-10 bg-slate-900 text-white rounded-2xl p-3 border border-slate-800 shadow-xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 px-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EA8B42] animate-pulse"></span>
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-200">Uji Alur Otomatis:</span>
              </div>
              <div className="grid grid-cols-3 gap-2 w-full sm:w-auto">
                <button onClick={() => handleSimStage(1)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${simStage === 1 ? 'bg-[#2563EB] text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>1. Pelanggan Pesan</button>
                <button onClick={() => handleSimStage(2)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${simStage === 2 ? 'bg-[#2563EB] text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>2. Kasir Konfirmasi</button>
                <button onClick={() => handleSimStage(3)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${simStage === 3 ? 'bg-[#2563EB] text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>3. Dapur Siap</button>
              </div>
            </div>
          </div>

          {/* Mockup HP */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-black mb-3 font-display">Pesan dari Meja Tanpa Antre</h3>
              <p className="text-slate-600 mb-5">Pelanggan duduk nyaman, scan QR di meja, dan pesan dari HP. Tidak ada antrean fisik di depan kasir.</p>
              <button onClick={() => setPhoneAlertOpen(!phoneAlertOpen)} className="px-4 py-2 bg-slate-100 border border-slate-300 rounded-lg text-xs font-bold hover:bg-slate-200">Tampilkan Panggilan Suara</button>
            </div>
            <div className="flex justify-center">
              <div className="w-full max-w-[280px] h-[500px] bg-white rounded-[2.5rem] border-[8px] border-[#070B14] shadow-2xl overflow-hidden relative">
                <div className="p-4 h-full flex flex-col bg-slate-50 relative pt-10">
                  <div className="mb-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-[10px] font-bold text-blue-600 uppercase">Meja 10</p>
                    <h4 className="text-base font-black text-slate-900">Nexa Kafe</h4>
                  </div>
                  <div className="bg-white border rounded-xl p-3 shadow-sm mb-3">
                    <p className="font-bold text-sm">Iced Matcha Latte</p>
                    <p className="text-xs text-slate-400 line-through">Rp 28.000</p>
                    <p className="font-black text-blue-600 mt-1">Rp 22.000</p>
                  </div>
                  <div className="mt-auto bg-blue-600 text-white rounded-xl p-3 flex justify-between items-center shadow-lg">
                    <div><p className="text-[10px]">Total</p><p className="font-bold">Rp 22.000</p></div>
                    <button onClick={() => handleSimStage(2)} className="bg-white text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold">Kirim →</button>
                  </div>
                  {phoneAlertOpen && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-10">
                      <div className="bg-white p-4 rounded-2xl text-center border-2 border-blue-500 w-full shadow-2xl">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse"><Icons.speaker /></div>
                        <h4 className="font-black text-slate-900 text-sm">Pesanan Siap!</h4>
                        <p className="text-xs text-slate-600 mt-1 mb-3">Budi, Meja 10, silakan ambil pesanan.</p>
                        <button onClick={() => setPhoneAlertOpen(false)} className="w-full bg-blue-600 text-white text-xs py-2 rounded-lg font-bold">Tutup</button>
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
                <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} className="w-full flex items-center justify-between gap-4 p-4 text-left hover:bg-slate-50 transition-colors">
                  <span className="font-bold text-slate-900 text-sm md:text-base">{f.q}</span>
                  <span className={`w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 text-blue-600 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {openFaq === i && <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">{f.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER & CTA */}
      <section className="py-20 px-6 relative z-10 bg-[#04060B]">
        <div className="max-w-4xl mx-auto text-center card-3d p-12 rounded-3xl border-blue-500/20">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4 font-display">Siap Membawa Bisnis Anda ke Level Selanjutnya?</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">Bergabung dengan ratusan pemilik kafe lainnya yang telah beralih ke NexaFlow.</p>
          <Link href="/register" className="btn-sapphire inline-block text-base px-10 py-4 rounded-xl text-white font-bold">Daftar Sekarang - Gratis</Link>
          <p className="text-xs text-slate-500 mt-4">Tanpa kartu kredit. Bisa dibatalkan kapan saja.</p>
        </div>
      </section>

      <footer className="border-t border-slate-800/50 py-8 text-center text-xs text-slate-500 relative z-10 bg-[#04060B]">
        <p>&copy; {new Date().getFullYear()} NexaFlow SaaS. All rights reserved.</p>
      </footer>

    </div>
  );
}