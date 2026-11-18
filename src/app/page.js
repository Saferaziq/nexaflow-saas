'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// ============ KONFIGURASI WHATSAPP ============
const WA_NUMBER = '6281389744957';
const WA_MESSAGE = 'Halo NexaFlow, saya tertarik dengan sistem kasir + AI Agent untuk kafe/resto saya. Bisa info lebih lanjut?';
const waLink = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`;

// ============ KOMPONEN LOGO ============
const LogoImg = ({ className = 'w-10 h-10' }) => (
  <img
    src="/logo-nexaflow-3d.png"
    alt="NexaFlow Logo"
    className={`${className} object-contain`}
  />
);

// ============ DATA FITUR & FAQ ============
const aiFeatures = [
  {
    title: 'Deteksi Anomali Omzet & Biaya',
    desc: 'Membandingkan pendapatan harian per cabang terhadap rata-rata historis serta mengaudit rasio pengeluaran.',
  },
  {
    title: 'Promo Jam Sepi Auto-Stop 16:30',
    desc: 'Aktifkan harga coret dan label unggulan dalam 1 klik, lalu harga kembali normal otomatis sesuai jadwal.',
  },
  {
    title: 'Audit Fraud & Menu Kurang Laku',
    desc: 'Menandai pembatalan tunai jam malam, order menggantung, serta menu tanpa penjualan selama 30 hari.',
  },
  {
    title: 'Tanya Jawab Data Multi-Cabang',
    desc: 'Konsultasikan performa cabang, kategori biaya terbesar, hingga rekomendasi paket bundling langsung dari dashboard.',
  },
];

const features = [
  { icon: 'qr', title: 'QR Self-Order', desc: 'Tamu memesan langsung dari meja tanpa instal aplikasi.' },
  { icon: 'kds', title: 'Kitchen Display & Bottleneck', desc: 'Pantau antrean dapur sekaligus deteksi jam sibuk terlama.' },
  { icon: 'qris', title: 'QRIS Dinamis', desc: 'Nominal tagihan otomatis tercetak pada kode QR pembayaran.' },
  { icon: 'bolt', title: 'Stok Real-Time', desc: 'Menu otomatis terkunci Sold Out saat porsi terakhir terjual.' },
  { icon: 'speaker', title: 'Panggilan Suara Meja', desc: 'Notifikasi suara dan getar di HP tamu begitu pesanan siap.' },
  { icon: 'chart', title: 'Laporan P&L & Ekspor CSV', desc: 'Rekap omzet, kasbon, gaji, dan laba bersih siap unduh.' },
  { icon: 'printer', title: 'Cetak Struk Bluetooth', desc: 'Terhubung langsung ke printer thermal dari tablet kasir.' },
  { icon: 'shield', title: 'Keamanan Server RPC', desc: 'Harga, pajak, dan hak akses divalidasi ketat di database.' },
];

const faqs = [
  {
    q: 'Apa yang membedakan NexaFlow dari aplikasi kasir biasa?',
    a: 'Tampilan kasir dan dapur dibuat bersih tanpa menu rumit sehingga staf baru langsung paham dalam hitungan menit, sementara Owner mendapat analisis AI otomatis.',
  },
  {
    q: 'Bagaimana cara kerja AI Business Advisor di dashboard Owner?',
    a: 'Sistem menghitung metrik operasional langsung di server lalu merangkum temuan penting seperti penurunan omzet, jam sibuk dapur, dan saran aksi 1-klik.',
  },
  {
    q: 'Apakah data harga dan API Key aman dari manipulasi?',
    a: 'Ya. Perhitungan checkout, pemotongan stok, dan pajak diproses oleh fungsi database server (RPC), serta kolom sensitif dibatasi ketat oleh kebijakan keamanan database.',
  },
  {
    q: 'Bagaimana proses pemasangan menu dan QR meja untuk cabang baru?',
    a: 'Tim kami membantu setup awal menu, foto, hingga QR meja. Hubungi WhatsApp kami untuk demo dan penawaran sesuai jumlah cabang Anda.',
  },
];

// ============ ICONS ============
const Icons = {
  qr: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3z"/><path d="M18 18h3v3h-3z"/><path d="M14 19h2"/><path d="M19 14v2"/></svg>,
  kds: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  qris: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><line x1="6" y1="15" x2="10" y2="15"/></svg>,
  chart: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
  speaker: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>,
  printer: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>,
  bolt: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  bot: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M12 2a4 4 0 0 1 4 4v2h2a2 2 0 0 1 2 2v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-8a2 2 0 0 1 2-2h2V6a4 4 0 0 1 4-4z"/><circle cx="9" cy="13" r="1"/><circle cx="15" cy="13" r="1"/></svg>,
  check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg>,
  chevron: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="6 9 12 15 18 9"/></svg>,
  whatsapp: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>,
};

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(0);
  const [phoneAlertOpen, setPhoneAlertOpen] = useState(false);
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

  const handleSimStage = (stage) => {
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
    }
  };

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
            <a href="#ai" className="hover:text-white transition-colors flex items-center gap-1.5">
              AI Copilot <span className="bg-purple-500/20 text-purple-300 text-[10px] px-2 py-0.5 rounded-full border border-purple-500/30">BARU</span>
            </a>
            <a href="#fitur" className="hover:text-white transition-colors">Fitur</a>
            <a href="#tampilan" className="hover:text-white transition-colors">Simulasi</a>
            <a href="#konsultasi" className="hover:text-white transition-colors">Konsultasi</a>
          </div>

          <div className="flex items-center gap-4 relative z-10">
            <Link href="/login" className="text-sm font-bold text-slate-300 hover:text-white transition-colors hidden sm:block">Masuk</Link>
            <Link href="/register" className="btn-sapphire text-sm px-5 py-2.5 rounded-xl text-white font-bold">Mulai Gratis</Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-36 pb-20 px-6 max-w-6xl mx-auto text-center z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-sky-500/30 text-sky-300 text-xs font-bold mb-8 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          POS Multi-Cabang + AI Business Advisor
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.08] tracking-tight mb-6 font-display">
          Operasional Cepat.<br />
          <span className="text-gradient">Kontrol Penuh Owner.</span>
        </h1>

        <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
          Satukan QR self-order, layar dapur, stok real-time, dan audit keuangan dalam satu sistem yang mudah dipakai staf sejak hari pertama.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/register" className="btn-sapphire text-base px-8 py-4 rounded-xl text-white font-bold w-full sm:w-auto">
            Coba Gratis 7 Hari
          </Link>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-xl border border-slate-700 bg-slate-800/50 text-slate-200 font-bold hover:bg-slate-800 hover:text-white transition-all w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <Icons.whatsapp />
            <span>Hubungi WhatsApp</span>
          </a>
        </div>

        {/* MOCKUP PREVIEW DASHBOARD OWNER */}
        <div className="mt-16 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-[#04060B] via-transparent to-transparent z-10 pointer-events-none"></div>
          <div className="card-3d rounded-2xl p-2 border-slate-700/50 overflow-hidden max-w-4xl mx-auto">
            <div className="bg-[#0A0F1C] rounded-xl border border-slate-800 flex min-h-[300px] text-left">
              <div className="w-48 border-r border-slate-800 p-4 hidden md:block space-y-3">
                <div className="text-xs font-black text-white tracking-wide mb-4">NEXAFLOW OWNER</div>
                <div className="px-3 py-2 bg-blue-500/20 rounded-lg border border-blue-500/30 text-[11px] font-bold text-blue-300">Command Center AI</div>
                <div className="px-3 py-2 text-[11px] font-semibold text-slate-400">Keuangan & Stok</div>
                <div className="px-3 py-2 text-[11px] font-semibold text-slate-400">Laporan P&L</div>
                <div className="px-3 py-2 text-[11px] font-semibold text-slate-400">Pengaturan AI</div>
              </div>
              <div className="flex-1 p-6 space-y-5">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-black text-white">Ringkasan Multi-Cabang</span>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Live Sync</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Status Operasional</p>
                    <p className="text-sm font-black text-white mt-2">Semua Cabang Aktif</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Kecepatan Dapur</p>
                    <p className="text-sm font-black text-sky-400 mt-2">Terpantau Real-Time</p>
                  </div>
                  <div className="bg-purple-500/10 rounded-xl border border-purple-500/30 p-4">
                    <p className="text-[10px] font-bold text-purple-300 uppercase">AI Copilot</p>
                    <p className="text-sm font-black text-white mt-2">3 Rekomendasi Siap</p>
                  </div>
                </div>
                <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">Promo Jam Sepi (14.00 – 16.30 WIB)</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Harga coret aktif otomatis dan berhenti tepat waktu tanpa lupa.</p>
                  </div>
                  <span className="text-[11px] font-bold text-amber-400 shrink-0 ml-3">1-Klik Aktif</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION AI COPILOT */}
      <section id="ai" className="py-24 relative overflow-hidden border-t border-slate-800/50">
        <div className="glow-effect-ai"></div>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-bold text-purple-300 mb-6">
                <Icons.bot />
                <span>NexaFlow AI Copilot</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6 font-display">
                Asisten Bisnis <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-sky-400">Berbasis Data Aktual.</span>
              </h2>
              <p className="text-slate-400 text-base md:text-lg mb-8 leading-relaxed">
                Seluruh angka dihitung di server secara ringkas sehingga pemantauan cabang berjalan cepat dan hemat kuota AI.
              </p>

              <div className="space-y-5 mb-10">
                {aiFeatures.map((f, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0 mt-0.5 border border-purple-500/30 text-purple-300">
                      <Icons.check />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-base">{f.title}</h4>
                      <p className="text-sm text-slate-400 mt-1 leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/register" className="inline-flex items-center gap-2 text-purple-400 font-bold hover:text-purple-300 transition-colors">
                <span>Aktifkan AI Copilot Sekarang</span>
                <span>→</span>
              </Link>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-sky-500/20 blur-3xl opacity-50 rounded-full"></div>
              <div className="card-3d rounded-2xl p-6 border-purple-500/30 relative bg-[#0A0F1C]">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-300 border border-purple-500/30">
                      <Icons.bot />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">AI Business Advisor</p>
                      <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Siap Menganalisis
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-800/80 border border-slate-700/50 rounded-xl rounded-tl-none p-4 text-sm text-slate-300 w-11/12 shadow-sm">
                    <p className="font-bold text-rose-400 text-xs mb-1">Audit Fraud & Bottleneck:</p>
                    Terdeteksi pembatalan tunai jam malam di Cabang Utama serta waktu tunggu dapur meningkat di pukul 19.00–20.00 WIB.
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl rounded-tr-none p-4 text-sm text-purple-100 ml-auto w-10/12 shadow-sm">
                    <p className="font-bold text-xs text-purple-300 mb-1">Rekomendasi Promo Jam Sepi:</p>
                    Aktifkan harga coret untuk menu stok berlebih hingga pukul 16:30 WIB, lalu kembali normal otomatis.
                    <div className="mt-3 flex gap-2">
                      <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded">Eksekusi 1-Klik</span>
                      <span className="bg-slate-700 text-slate-200 text-xs font-bold px-3 py-1.5 rounded">Auto-Stop 16:30</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FITUR INTI */}
      <section id="fitur" className="py-20 px-6 max-w-7xl mx-auto z-10 relative border-t border-slate-800/50">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3 font-display">Fitur Lengkap, Tetap Sederhana</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base">Dirancang agar meja, kasir, dapur, dan laporan owner selalu sinkron.</p>
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

      {/* SIMULASI 3 LAYAR */}
      <section id="tampilan" className="py-20 px-6 relative z-10 bg-white text-slate-900 border-t border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3 font-display">Simulasi Alur Pesanan</h2>
            <p className="text-slate-600 text-base">Klik tahapan di bawah untuk melihat perpindahan status dari meja hingga siap diambil.</p>
          </div>

          <div className="max-w-4xl mx-auto mb-12 bg-slate-900 text-white rounded-2xl p-3 border border-slate-800 shadow-xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 px-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-200">Pilih Tahap:</span>
              </div>
              <div className="grid grid-cols-3 gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleSimStage(1)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${simStage === 1 ? 'bg-[#2563EB] text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                >
                  1. Tamu Pesan
                </button>
                <button
                  type="button"
                  onClick={() => handleSimStage(2)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${simStage === 2 ? 'bg-[#2563EB] text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                >
                  2. Kasir & Dapur
                </button>
                <button
                  type="button"
                  onClick={() => handleSimStage(3)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${simStage === 3 ? 'bg-[#2563EB] text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                >
                  3. Siap Diambil
                </button>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-3 border border-blue-200">
                Tahap {simStage} dari 3
              </span>
              <h3 className="text-2xl font-black mb-3 font-display text-slate-900">
                {simStage === 1 && 'Pesan Mandiri Langsung dari Meja'}
                {simStage === 2 && 'Masuk Otomatis ke Layar Kasir & Dapur'}
                {simStage === 3 && 'HP Tamu Memanggil Saat Pesanan Selesai'}
              </h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                {simStage === 1 && 'Tamu scan QR meja, melihat menu unggulan atau harga coret aktif, lalu mengirim pesanan tanpa mengantre.'}
                {simStage === 2 && 'Pesanan tervalidasi di server, stok menu langsung terpotong, dan catatan khusus tampil di monitor dapur.'}
                {simStage === 3 && 'Begitu dapur menandai selesai, layar HP tamu menampilkan panggilan suara dan nomor antrean secara otomatis.'}
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => handleSimStage(simStage === 3 ? 1 : simStage + 1)}
                  className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
                >
                  {simStage === 3 ? 'Ulangi Simulasi' : 'Lanjut Tahap Berikutnya →'}
                </button>
                <button
                  type="button"
                  onClick={() => setPhoneAlertOpen(!phoneAlertOpen)}
                  className="px-4 py-2.5 bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors"
                >
                  {phoneAlertOpen ? 'Tutup Panggilan' : 'Lihat Panggilan Suara'}
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
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${demoOrderConfirmed ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {demoOrderConfirmed ? 'Diproses' : 'Pilih Menu'}
                    </span>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm mb-3">
                    <div className="flex justify-between items-start">
                      <p className="font-bold text-sm text-slate-900">Iced Matcha Latte</p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-white">Unggulan</span>
                    </div>
                    <p className="text-xs text-slate-400 line-through mt-1">Rp 28.000</p>
                    <p className="font-black text-blue-600 mt-0.5">Rp 22.000</p>
                  </div>

                  {demoOrderConfirmed && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 font-semibold">
                      Antrean #14 terkirim ke dapur. Stok menu otomatis berkurang.
                    </div>
                  )}

                  <div className="mt-auto bg-blue-600 text-white rounded-xl p-3 flex justify-between items-center shadow-lg">
                    <div>
                      <p className="text-[10px] opacity-80">Total</p>
                      <p className="font-bold">Rp 22.000</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSimStage(2)}
                      className="bg-white text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold"
                    >
                      {demoOrderConfirmed ? 'Terkirim' : 'Kirim →'}
                    </button>
                  </div>

                  {phoneAlertOpen && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-10">
                      <div className="bg-white p-4 rounded-2xl text-center border-2 border-blue-500 w-full shadow-2xl">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse">
                          <Icons.speaker />
                        </div>
                        <h4 className="font-black text-slate-900 text-sm">Pesanan Siap!</h4>
                        <p className="text-xs text-slate-600 mt-1 mb-3">Budi, Meja 10, silakan ambil pesanan di kasir.</p>
                        <button
                          type="button"
                          onClick={() => setPhoneAlertOpen(false)}
                          className="w-full bg-blue-600 text-white text-xs py-2 rounded-lg font-bold"
                        >
                          Tutup
                        </button>
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
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  className="w-full flex items-center justify-between gap-4 p-4 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-slate-900 text-sm md:text-base">{f.q}</span>
                  <span className={`w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 text-blue-600 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}>
                    <Icons.chevron />
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KONSULTASI & CTA WHATSAPP */}
      <section id="konsultasi" className="py-20 px-6 relative z-10 bg-[#04060B]">
        <div className="max-w-4xl mx-auto text-center card-3d p-10 md:p-12 rounded-3xl border-blue-500/20">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4 font-display">
            Siap Terapkan di Kafe atau Resto Anda?
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto leading-relaxed">
            Konsultasikan kebutuhan cabang, setup menu, dan QR meja bersama tim kami langsung melalui WhatsApp atau coba akun gratis selama 7 hari.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-sapphire inline-flex items-center justify-center gap-2 text-base px-8 py-4 rounded-xl text-white font-bold w-full sm:w-auto"
            >
              <Icons.whatsapp />
              <span>Chat WhatsApp Sekarang</span>
            </a>
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl border border-slate-700 bg-slate-800/60 text-slate-200 font-bold hover:bg-slate-800 hover:text-white transition-all w-full sm:w-auto"
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