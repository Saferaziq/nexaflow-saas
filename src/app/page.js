'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// ============ KONFIGURASI TAUTAN KONSULTASI ============
const WA_NUMBER = '6281389744957';
const WA_MESSAGE = 'Halo NexaFlow, saya ingin menjadwalkan demo sistem kasir dan Dashboard Owner untuk kafe/resto saya.';
const demoLink = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`;

const LogoImg = ({ className = 'w-8 h-8' }) => (
  <img
    src="/logo-nexaflow-3d.png"
    alt="NexaFlow"
    className={`${className} object-contain`}
  />
);

// ============ KOMPONEN SCROLL REVEAL HALUS ============
const Reveal = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out will-change-transform ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      } ${className}`}
    >
      {children}
    </div>
  );
};

const workflowSteps = [
  {
    step: '01',
    role: 'Pelanggan Meja',
    route: '/order',
    title: 'Scan QR & Pesan Mandiri',
    desc: 'Tamu memindai QR di meja, memilih menu atau harga promo aktif, lalu mengirim pesanan tanpa mengantre di kasir.',
    badge: 'Meja 10 · Self-Order',
    statusText: 'Pesanan masuk #14 · Iced Matcha Latte (Rp 22.000)',
    ownerSync: 'Menunggu konfirmasi pembayaran di Kasir',
  },
  {
    step: '02',
    role: 'Kasir (POS)',
    route: '/dashboard',
    title: 'Verifikasi & Cetak Struk',
    desc: 'Kasir menerima notifikasi real-time, memverifikasi Tunai atau QRIS Dinamis, dan mencetak struk Bluetooth.',
    badge: 'Kasir · Terverifikasi',
    statusText: 'Pembayaran QRIS diterima · Stok menu terpotong otomatis',
    ownerSync: 'Omzet cabang bertambah +Rp 22.000',
  },
  {
    step: '03',
    role: 'Dapur (KDS)',
    route: '/kitchen',
    title: 'Proses Masak & Panggil Tamu',
    desc: 'Catatan khusus tampil di monitor dapur. Begitu selesai dimasak, HP tamu berbunyi dengan panggilan suara antrean.',
    badge: 'KDS · Selesai 4.2 Menit',
    statusText: 'Pesanan #14 siap diambil · Notifikasi suara aktif di HP tamu',
    ownerSync: 'Kecepatan KDS tercatat 4.2 menit',
  },
  {
    step: '04',
    role: 'Dashboard Owner',
    route: '/owner',
    title: 'Audit Laba, Stok & AI Advisor',
    desc: 'Owner memantau omzet lintas cabang, laba bersih P&L, gaji staf, dan rekomendasi AI 1-klik dari mana saja.',
    badge: 'Owner Executive · Live',
    statusText: 'Laporan P&L, stok tersisa, dan audit AI diperbarui otomatis',
    ownerSync: 'Promo Jam Sepi otomatis berhenti pukul 16:30 WIB',
  },
];

const ownerModules = [
  {
    code: '01',
    title: 'Command Center & AI Business Advisor',
    desc: 'Memantau omzet harian/mingguan/bulanan, mendeteksi anomali penurunan cabang, audit rasio biaya, menu kurang laku, hingga tanya jawab data langsung.',
    tags: ['Anomali Omzet', 'Promo Auto-Stop 16:30', 'Tanya AI'],
  },
  {
    code: '02',
    title: 'Keuangan, Penggajian & Kontrol Stok',
    desc: 'Memisahkan pengeluaran harian kasir dan biaya tetap bulanan, menghitung gaji pokok, kasbon, bonus, slip gaji, serta tambah stok cepat (+10/+25).',
    tags: ['Slip Gaji', 'Kasbon & Bonus', 'Stok Real-Time'],
  },
  {
    code: '03',
    title: 'Audit Fraud Kasir & Kecepatan Dapur',
    desc: 'Mencatat pembatalan tunai di jam malam, pesanan tunai menggantung lebih dari 2 jam, serta mendeteksi jam sibuk dapur (KDS bottleneck).',
    tags: ['Void Watchdog', 'KDS Bottleneck', 'Laporan CSV'],
  },
];

const coreFeatures = [
  { icon: 'qr', title: 'QR Self-Order di Meja', desc: 'Tamu memesan langsung dari browser HP tanpa perlu mengunduh aplikasi.' },
  { icon: 'kds', title: 'Layar Dapur & Bottleneck', desc: 'Antrean masak tampil urut di monitor dapur lengkap dengan pantauan jam tersibuk.' },
  { icon: 'qris', title: 'QRIS Dinamis Otomatis', desc: 'Kode QR pembayaran langsung membawa nominal tagihan akhir sesuai pesanan.' },
  { icon: 'bolt', title: 'Kunci Stok Real-Time', desc: 'Status menu otomatis berubah habis saat porsi terakhir masuk ke checkout.' },
  { icon: 'speaker', title: 'Panggilan Suara di HP Tamu', desc: 'Layar HP tamu berbunyi dan menampilkan nomor antrean saat pesanan selesai.' },
  { icon: 'chart', title: 'Laporan P&L & Ekspor CSV', desc: 'Rekap omzet, kasbon, gaji staf, dan laba bersih per cabang siap diunduh.' },
  { icon: 'printer', title: 'Cetak Struk Bluetooth', desc: 'Terhubung langsung ke printer thermal 58mm/80mm dari perangkat kasir.' },
  { icon: 'shield', title: 'Validasi Harga di Server', desc: 'Total tagihan, pajak, dan pengurangan stok dihitung aman di database.' },
];

const faqs = [
  {
    q: 'Apakah staf kasir dan dapur perlu pelatihan lama?',
    a: 'Tidak. Tampilan kasir dan layar dapur dibuat ringkas khusus untuk alur transaksi harian sehingga karyawan baru bisa langsung menggunakannya.',
  },
  {
    q: 'Apa saja yang bisa dikelola langsung dari Dashboard Owner?',
    a: 'Owner dapat memfilter performa per cabang, melihat P&L, mengatur stok menu, mencatat biaya tetap dan gaji karyawan, mengekspor CSV, serta mengeksekusi aksi AI 1-klik.',
  },
  {
    q: 'Apakah fitur AI Business Advisor menghabiskan banyak kuota API?',
    a: 'Tidak. Seluruh perhitungan berat dilakukan di server NexaFlow terlebih dahulu, lalu hanya ringkasan angka kecil yang dikirim saat Anda bertanya ke AI.',
  },
  {
    q: 'Bagaimana keamanan harga menu dan API Key Owner?',
    a: 'Perhitungan checkout diproses di fungsi database server (RPC), dan akses baca publik ke tabel cabang dibatasi hanya pada kolom etalase yang diperlukan pelanggan.',
  },
];

const Icons = {
  qr: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3z"/><path d="M18 18h3v3h-3z"/><path d="M14 19h2"/><path d="M19 14v2"/></svg>,
  kds: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  qris: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><line x1="6" y1="15" x2="10" y2="15"/></svg>,
  chart: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
  speaker: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>,
  printer: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>,
  bolt: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  chevron: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="6 9 12 15 18 9"/></svg>,
  arrowRight: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
};

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % workflowSteps.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [autoPlay]);

  const currentFlow = workflowSteps[activeStep];
  const progressWidth = `${((activeStep + 1) / workflowSteps.length) * 100}%`;

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 font-sans antialiased selection:bg-[#2563EB] selection:text-white">
      <style>{`
        .num-tabular { font-variant-numeric: tabular-nums; letter-spacing: -0.02em; }
        @keyframes heroEnter {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hero-enter { animation: heroEnter 0.65s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .hero-enter-1 { animation-delay: 80ms; }
        .hero-enter-2 { animation-delay: 160ms; }
        .hero-enter-3 { animation-delay: 240ms; }
        .hero-enter-4 { animation-delay: 320ms; }
      `}</style>

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-[#090D16]/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center p-1 shadow-sm transition-transform duration-200 group-hover:scale-105">
              <LogoImg className="w-full h-full" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-white">NexaFlow</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a href="#alur-kerja" className="hover:text-white transition-colors">Alur Kerja</a>
            <a href="#owner-dashboard" className="hover:text-white transition-colors">Dashboard Owner</a>
            <a href="#fitur" className="hover:text-white transition-colors">Fitur</a>
            <a href="#konsultasi" className="hover:text-white transition-colors">Demo</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="text-xs font-semibold text-slate-300 hover:text-white transition-colors px-3 py-2">
              Masuk
            </Link>
            <Link href="/register" className="bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all duration-200 hover:-translate-y-0.5">
              Trial 7 Hari
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="pt-20 pb-20 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="hero-enter inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F1420] border border-slate-800 text-xs font-semibold text-slate-300 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>POS Multi-Cabang & Dashboard Owner Terintegrasi</span>
            </div>

            <h1 className="hero-enter hero-enter-1 text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.1] mb-5">
              Kasir Rapi, Dapur Cepat, Pantauan Cabang Terukur.
            </h1>

            <p className="hero-enter hero-enter-2 text-base md:text-lg text-slate-400 leading-relaxed mb-8">
              Satu sistem yang menghubungkan QR self-order meja, kasir, layar dapur, manajemen stok, laporan laba rugi, dan AI Business Advisor untuk pemilik kafe maupun restoran.
            </p>

            <div className="hero-enter hero-enter-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register" className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-blue-600/20">
                Coba Gratis 7 Hari
              </Link>
              <a
                href={demoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#0F1420] hover:bg-slate-800 border border-slate-700 text-slate-100 text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 inline-flex items-center justify-center gap-2"
              >
                <span>Jadwalkan Demo</span>
                <Icons.arrowRight />
              </a>
            </div>
          </div>

          {/* PREVIEW WORKSPACE OWNER */}
          <div className="hero-enter hero-enter-4 mt-14 max-w-5xl mx-auto rounded-2xl border border-slate-800 bg-[#0F1420] shadow-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-[#0B101B]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
                <span className="ml-2 text-xs font-semibold text-slate-400">nexaflowkasir.it.com/owner</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Owner Executive Live
              </span>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-5">
              <div className="md:col-span-3 border border-slate-800 rounded-xl p-4 bg-[#090D16] space-y-2 hidden md:block">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">Owner Workspace</p>
                <div className="px-3 py-2 rounded-lg bg-[#2563EB] text-white text-xs font-semibold">Command Center AI</div>
                <div className="px-3 py-2 rounded-lg text-slate-400 text-xs font-semibold">Keuangan & Stok</div>
                <div className="px-3 py-2 rounded-lg text-slate-400 text-xs font-semibold">Laporan P&L</div>
                <div className="px-3 py-2 rounded-lg text-slate-400 text-xs font-semibold">Pengaturan & AI Key</div>
              </div>

              <div className="md:col-span-9 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-xl border border-slate-800 bg-[#090D16] p-4">
                    <p className="text-[11px] font-semibold text-slate-400">Filter Cabang</p>
                    <p className="text-lg font-bold text-white mt-1">Multi-Outlet</p>
                    <p className="text-[11px] text-emerald-400 mt-1">Gabungan & per cabang</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-[#090D16] p-4">
                    <p className="text-[11px] font-semibold text-slate-400">Kecepatan Dapur</p>
                    <p className="text-lg font-bold text-white mt-1 num-tabular">6.4 Menit</p>
                    <p className="text-[11px] text-sky-400 mt-1">Pantauan KDS & jam sibuk</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-[#090D16] p-4">
                    <p className="text-[11px] font-semibold text-slate-400">Jadwal Promo</p>
                    <p className="text-lg font-bold text-white mt-1">14:00 – 16:30 WIB</p>
                    <p className="text-[11px] text-amber-400 mt-1">Auto-stop tepat waktu</p>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-[#090D16] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-white">Deteksi Dini AI Business Advisor</p>
                    <p className="text-xs text-slate-400 mt-0.5">Menganalisis anomali omzet, rasio biaya, menu tidak laku, serta pembatalan kasir secara otomatis.</p>
                  </div>
                  <span className="px-3 py-1.5 rounded-lg bg-[#2563EB]/15 border border-[#2563EB]/30 text-blue-400 text-xs font-bold shrink-0 self-start sm:self-center">
                    1-Klik Eksekusi
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ALUR KERJA PRESISI BERANIMASI (4 TAHAP END-TO-END) */}
      <section id="alur-kerja" className="py-20 px-6 bg-white text-slate-900 border-t border-slate-200">
        <div className="max-w-6xl mx-auto">
          <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-wider text-[#2563EB] mb-2">Alur Kerja Terintegrasi</p>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
                Dari Meja Pelanggan hingga Laporan Owner Secara Sinkron.
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setAutoPlay(!autoPlay)}
              className="self-start md:self-auto px-4 py-2 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors"
            >
              {autoPlay ? 'Jeda Animasi Alur' : 'Putar Otomatis'}
            </button>
          </Reveal>

          {/* PROGRESS BAR ANIMASI PRESISI */}
          <div className="mb-6">
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div
                style={{ width: progressWidth }}
                className="h-full bg-[#2563EB] rounded-full transition-all duration-500 ease-out"
              ></div>
            </div>
          </div>

          {/* 4 KARTU TAHAPAN PRESISI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {workflowSteps.map((item, idx) => {
              const isActive = activeStep === idx;
              const isPassed = idx < activeStep;
              return (
                <button
                  key={item.step}
                  type="button"
                  onClick={() => {
                    setAutoPlay(false);
                    setActiveStep(idx);
                  }}
                  className={`text-left rounded-xl p-5 border transition-all duration-300 ${
                    isActive
                      ? 'bg-[#090D16] text-white border-[#2563EB] shadow-xl -translate-y-1'
                      : isPassed
                      ? 'bg-blue-50/60 text-slate-900 border-blue-200 hover:border-blue-400'
                      : 'bg-slate-50 text-slate-900 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                      isActive ? 'bg-[#2563EB] text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {item.step}
                    </span>
                    <span className={`text-[11px] font-semibold ${isActive ? 'text-sky-400' : 'text-slate-500'}`}>
                      {item.role}
                    </span>
                  </div>
                  <h3 className={`text-sm font-bold mb-1.5 ${isActive ? 'text-white' : 'text-slate-900'}`}>
                    {item.title}
                  </h3>
                  <p className={`text-xs leading-relaxed ${isActive ? 'text-slate-300' : 'text-slate-600'}`}>
                    {item.desc}
                  </p>
                </button>
              );
            })}
          </div>

          {/* PANEL STATUS SINKRONISASI LANGSUNG */}
          <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">
                  {currentFlow.badge}
                </span>
              </div>
              <h4 className="text-xl font-black text-slate-900 transition-all duration-300">
                {currentFlow.statusText}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sinkronisasi ke Dashboard Owner: <strong className="text-slate-900">{currentFlow.ownerSync}</strong>
              </p>
            </div>

            <div className="lg:col-span-5 flex flex-wrap lg:justify-end gap-2">
              {workflowSteps.map((s, idx) => (
                <div
                  key={s.step}
                  className={`px-3 py-2 rounded-lg border text-xs font-semibold transition-all duration-300 ${
                    idx <= activeStep
                      ? 'bg-white border-blue-300 text-slate-900 shadow-xs'
                      : 'bg-slate-100 border-slate-200 text-slate-400'
                  }`}
                >
                  {s.role}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BAGIAN KHUSUS DASHBOARD OWNER */}
      <section id="owner-dashboard" className="py-20 px-6 bg-[#090D16] text-slate-100 border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto">
          <Reveal className="max-w-2xl mb-12">
            <p className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-2">Dashboard Owner</p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
              Kendali Penuh Lintas Cabang Tanpa Harus Berada di Lokasi.
            </h2>
            <p className="text-sm text-slate-400 mt-3 leading-relaxed">
              Seluruh modul manajemen pemilik bisnis tersedia terpisah dari layar kasir agar staf tetap fokus melayani tamu.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {ownerModules.map((mod, idx) => (
              <Reveal key={mod.code} delay={idx * 90}>
                <div className="h-full rounded-2xl border border-slate-800 bg-[#0F1420] p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-2.5 py-1 rounded bg-blue-500/15 text-blue-400 text-xs font-bold font-mono">
                        MODUL {mod.code}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">{mod.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-6">{mod.desc}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-800">
                    {mod.tags.map((tag) => (
                      <span key={tag} className="px-2.5 py-1 rounded-md bg-[#090D16] border border-slate-800 text-[11px] font-semibold text-slate-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FITUR OPERASIONAL */}
      <section id="fitur" className="py-20 px-6 bg-white text-slate-900 border-t border-slate-200">
        <div className="max-w-6xl mx-auto">
          <Reveal className="max-w-2xl mb-12">
            <p className="text-xs font-bold uppercase tracking-wider text-[#2563EB] mb-2">Fitur Operasional</p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
              Dirancang untuk Kecepatan Layanan Harian.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {coreFeatures.map((f, i) => {
              const IconComp = Icons[f.icon];
              return (
                <Reveal key={i} delay={i * 60}>
                  <div className="h-full rounded-xl border border-slate-200 bg-slate-50/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:bg-white hover:shadow-lg group">
                    <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#2563EB] mb-4 shadow-sm transition-colors duration-300 group-hover:bg-[#2563EB] group-hover:text-white group-hover:border-[#2563EB]">
                      <IconComp />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mb-2">{f.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{f.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-6 bg-[#F8FAFC] text-slate-900 border-t border-slate-200">
        <div className="max-w-3xl mx-auto">
          <Reveal className="text-center mb-10">
            <h2 className="text-3xl font-black text-slate-900">Pertanyaan Umum</h2>
          </Reveal>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="rounded-xl bg-white border border-slate-200 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                    className="w-full flex items-center justify-between gap-4 p-4 text-left hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-bold text-slate-900 text-sm">{f.q}</span>
                    <span className={`text-slate-500 shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}>
                      <Icons.chevron />
                    </span>
                  </button>
                  <div className={`grid transition-all duration-300 ease-in-out ${openFaq === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                      <div className="px-4 pb-4 text-xs md:text-sm text-slate-600 leading-relaxed border-t border-slate-200 pt-3 bg-white">
                        {f.a}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA DEMO & TRIAL */}
      <section id="konsultasi" className="py-20 px-6 bg-[#090D16] border-t border-slate-800/80">
        <Reveal>
          <div className="max-w-4xl mx-auto rounded-2xl border border-slate-800 bg-[#0F1420] p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-4xl font-black text-white mb-4 tracking-tight">
              Siap Terapkan di Kafe atau Restoran Anda?
            </h2>
            <p className="text-sm md:text-base text-slate-400 max-w-xl mx-auto mb-8 leading-relaxed">
              Jadwalkan sesi demo untuk melihat langsung alur kasir, layar dapur, dan Dashboard Owner, atau mulai dengan akun trial 7 hari.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={demoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 inline-flex items-center justify-center gap-2"
              >
                <span>Jadwalkan Demo & Setup</span>
                <Icons.arrowRight />
              </a>
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-100 text-sm font-bold transition-all duration-200 hover:-translate-y-0.5"
              >
                Daftar Trial Gratis
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <footer className="border-t border-slate-800/80 py-8 px-6 text-center text-xs text-slate-500 bg-[#090D16]">
        <p>© {new Date().getFullYear()} NexaFlow. Sistem Kasir & Manajemen Cabang F&B.</p>
      </footer>
    </div>
  );
}