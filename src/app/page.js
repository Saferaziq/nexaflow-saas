'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// ============ KONFIGURASI WHATSAPP ============
const WA_NUMBER = '6281389744957';
const WA_MESSAGE = 'Halo NexaFlow, saya tertarik dengan sistem kasir + AI Business Advisor untuk kafe/resto saya. Bisa jadwalkan demo atau info lebih lanjut?';
const waLink = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`;

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

const aiCapabilities = [
  {
    code: '01',
    title: 'Deteksi Anomali Omzet & Rasio Biaya',
    desc: 'Membandingkan pendapatan per cabang terhadap rata-rata historis 30 hari serta menyorot pos biaya yang melewati batas sehat.',
  },
  {
    code: '02',
    title: 'Promo Jam Sepi dengan Auto-Stop 16:30',
    desc: 'Aktifkan harga coret dan label unggulan dalam 1 klik, lalu harga kembali normal otomatis sesuai jadwal tanpa perlu dimatikan manual.',
  },
  {
    code: '03',
    title: 'Audit Pembatalan Kasir & Menu Mati',
    desc: 'Mencatat pembatalan tunai di jam malam, order yang menggantung terlalu lama, dan menu tanpa penjualan selama 30 hari.',
  },
  {
    code: '04',
    title: 'Tanya Jawab Data Multi-Cabang',
    desc: 'Tanyakan performa cabang, pengeluaran terbesar, hingga rekomendasi paket bundling langsung dari ringkasan angka aktual.',
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
    a: 'Tidak. Tampilan kasir dan layar dapur sengaja dibuat ringkas hanya untuk alur transaksi harian sehingga karyawan baru bisa langsung menggunakannya.',
  },
  {
    q: 'Bagaimana cara mulai berlangganan atau mendaftarkan banyak cabang?',
    a: 'Anda bisa mendaftar akun trial 7 hari langsung atau menghubungi kami via WhatsApp untuk demo, bantuan input menu awal, dan penawaran sesuai jumlah outlet.',
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
  whatsapp: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>,
};

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(0);
  const [phoneAlertOpen, setPhoneAlertOpen] = useState(false);
  const [demoOrderConfirmed, setDemoOrderConfirmed] = useState(false);
  const [simStage, setSimStage] = useState(1);

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
            <a href="#fitur" className="hover:text-white transition-colors">Fitur</a>
            <a href="#tampilan" className="hover:text-white transition-colors">Alur Pesanan</a>
            <a href="#ai" className="hover:text-white transition-colors">AI Advisor</a>
            <a href="#konsultasi" className="hover:text-white transition-colors">Konsultasi</a>
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
              <span>POS Multi-Cabang & Audit Bisnis F&B</span>
            </div>

            <h1 className="hero-enter hero-enter-1 text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.1] mb-5">
              Kasir Rapi, Dapur Cepat, Pantauan Cabang Terukur.
            </h1>

            <p className="hero-enter hero-enter-2 text-base md:text-lg text-slate-400 leading-relaxed mb-8">
              Gabungkan QR self-order meja, monitor dapur, kontrol stok, laporan laba rugi, dan AI Business Advisor dalam satu workspace untuk pemilik kafe dan restoran.
            </p>

            <div className="hero-enter hero-enter-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register" className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-blue-600/20">
                Coba Gratis 7 Hari
              </Link>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#0F1420] hover:bg-slate-800 border border-slate-700 text-slate-100 text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 inline-flex items-center justify-center gap-2"
              >
                <Icons.whatsapp />
                <span>Konsultasi via WhatsApp</span>
              </a>
            </div>
          </div>

          {/* PREVIEW WORKSPACE OWNER */}
          <div className="hero-enter hero-enter-4 mt-14 max-w-5xl mx-auto rounded-2xl border border-slate-800 bg-[#0F1420] shadow-2xl overflow-hidden transition-transform duration-500 hover:border-slate-700">
            <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-[#0B101B]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
                <span className="ml-2 text-xs font-semibold text-slate-400">nexaflowkasir.it.com/owner</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Sinkronisasi Aktif
              </span>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-5">
              <div className="md:col-span-3 border border-slate-800 rounded-xl p-4 bg-[#090D16] space-y-2 hidden md:block">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">Owner Workspace</p>
                <div className="px-3 py-2 rounded-lg bg-[#2563EB] text-white text-xs font-semibold">Command Center AI</div>
                <div className="px-3 py-2 rounded-lg text-slate-400 text-xs font-semibold">Keuangan & Stok</div>
                <div className="px-3 py-2 rounded-lg text-slate-400 text-xs font-semibold">Laporan P&L</div>
                <div className="px-3 py-2 rounded-lg text-slate-400 text-xs font-semibold">Pengaturan</div>
              </div>

              <div className="md:col-span-9 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-xl border border-slate-800 bg-[#090D16] p-4 transition-colors duration-200 hover:border-slate-700">
                    <p className="text-[11px] font-semibold text-slate-400">Status Outlet</p>
                    <p className="text-lg font-bold text-white mt-1">3 Cabang Aktif</p>
                    <p className="text-[11px] text-emerald-400 mt-1">Semua kasir terhubung</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-[#090D16] p-4 transition-colors duration-200 hover:border-slate-700">
                    <p className="text-[11px] font-semibold text-slate-400">Kecepatan Dapur</p>
                    <p className="text-lg font-bold text-white mt-1 num-tabular">6.4 Menit</p>
                    <p className="text-[11px] text-sky-400 mt-1">Pantauan KDS real-time</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-[#090D16] p-4 transition-colors duration-200 hover:border-slate-700">
                    <p className="text-[11px] font-semibold text-slate-400">Jadwal Promo</p>
                    <p className="text-lg font-bold text-white mt-1">14:00 – 16:30 WIB</p>
                    <p className="text-[11px] text-amber-400 mt-1">Berhenti otomatis</p>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-[#090D16] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-white">Deteksi Dini AI Business Advisor</p>
                    <p className="text-xs text-slate-400 mt-0.5">Memantau selisih omzet, rasio biaya, menu tidak laku, dan pembatalan kasir secara otomatis.</p>
                  </div>
                  <span className="px-3 py-1.5 rounded-lg bg-[#2563EB]/15 border border-[#2563EB]/30 text-blue-400 text-xs font-bold shrink-0 self-start sm:self-center">
                    Siap Eksekusi
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FITUR INTI (LIGHT SURFACE) */}
      <section id="fitur" className="py-20 px-6 bg-white text-slate-900 border-t border-slate-200">
        <div className="max-w-6xl mx-auto">
          <Reveal className="max-w-2xl mb-12">
            <p className="text-xs font-bold uppercase tracking-wider text-[#2563EB] mb-2">Fitur Operasional</p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
              Semua Kebutuhan Meja, Kasir, dan Dapur dalam Satu Alur.
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

      {/* SIMULASI ALUR PESANAN */}
      <section id="tampilan" className="py-20 px-6 bg-[#F8FAFC] text-slate-900 border-t border-slate-200">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-xs font-bold uppercase tracking-wider text-[#2563EB] mb-2">Simulasi Interaktif</p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-3">
              Alur Pesanan dari Meja ke Dapur
            </h2>
            <p className="text-sm text-slate-600">
              Pilih tahapan di bawah untuk melihat bagaimana pesanan bergerak secara sinkron.
            </p>
          </Reveal>

          <Reveal delay={80}>
            <div className="grid grid-cols-3 gap-2 max-w-xl mx-auto mb-12 p-1.5 bg-slate-200/80 rounded-xl">
              <button
                type="button"
                onClick={() => handleSimStage(1)}
                className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all duration-200 ${simStage === 1 ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                1. Tamu Pesan
              </button>
              <button
                type="button"
                onClick={() => handleSimStage(2)}
                className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all duration-200 ${simStage === 2 ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                2. Dapur Proses
              </button>
              <button
                type="button"
                onClick={() => handleSimStage(3)}
                className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all duration-200 ${simStage === 3 ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                3. Siap Diambil
              </button>
            </div>
          </Reveal>

          <Reveal delay={140}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-5">
                <span className="inline-block px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
                  Tahap {simStage} dari 3
                </span>
                <h3 className="text-2xl font-black text-slate-900 transition-all duration-300">
                  {simStage === 1 && 'Pelanggan Memesan Langsung dari Meja'}
                  {simStage === 2 && 'Pesanan Masuk ke Kasir dan Monitor Dapur'}
                  {simStage === 3 && 'Notifikasi Suara Memanggil di HP Pelanggan'}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {simStage === 1 && 'Tamu memindai QR di meja, memilih menu yang tersedia atau sedang promo, lalu mengirim pesanan tanpa mengantre di kasir.'}
                  {simStage === 2 && 'Stok menu langsung berkurang otomatis dan catatan khusus pelanggan tampil jelas di layar dapur.'}
                  {simStage === 3 && 'Saat dapur menandai pesanan selesai, HP tamu langsung menampilkan nomor antrean beserta panggilan suara otomatis.'}
                </p>
                <div className="flex flex-wrap gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => handleSimStage(simStage === 3 ? 1 : simStage + 1)}
                    className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all duration-200 hover:-translate-y-0.5"
                  >
                    {simStage === 3 ? 'Ulangi dari Awal' : 'Lanjut Tahap Berikutnya'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhoneAlertOpen(!phoneAlertOpen)}
                    className="px-4 py-2.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
                  >
                    {phoneAlertOpen ? 'Tutup Pop-up Panggilan' : 'Pratinjau Pop-up Siap'}
                  </button>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="w-[290px] h-[500px] bg-white rounded-[2.25rem] border-[8px] border-slate-900 shadow-xl overflow-hidden relative flex flex-col">
                  <div className="p-4 pt-8 flex-1 flex flex-col bg-slate-50 relative">
                    <div className="mb-4 bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-blue-600 uppercase">Meja 10</p>
                        <h4 className="text-sm font-black text-slate-900">Nexa Kafe</h4>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-colors duration-300 ${demoOrderConfirmed ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                        {demoOrderConfirmed ? 'Diproses' : 'Pilih Menu'}
                      </span>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-3.5 mb-3 transition-shadow duration-300 hover:shadow-sm">
                      <div className="flex justify-between items-start gap-2">
                        <p className="font-bold text-sm text-slate-900">Iced Matcha Latte</p>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-white">Unggulan</span>
                      </div>
                      <p className="text-xs text-slate-400 line-through mt-1 num-tabular">Rp 28.000</p>
                      <p className="font-black text-sm text-blue-600 mt-0.5 num-tabular">Rp 22.000</p>
                    </div>

                    <div className={`transition-all duration-300 ${demoOrderConfirmed ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 font-medium">
                        Antrean #14 masuk ke monitor dapur. Stok menu otomatis diperbarui.
                      </div>
                    </div>

                    <div className="mt-auto bg-[#2563EB] text-white rounded-xl p-3.5 flex justify-between items-center">
                      <div>
                        <p className="text-[10px] opacity-80">Total Tagihan</p>
                        <p className="font-bold text-sm num-tabular">Rp 22.000</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSimStage(2)}
                        className="bg-white text-[#2563EB] px-3 py-1.5 rounded-lg text-xs font-bold transition-transform active:scale-95"
                      >
                        {demoOrderConfirmed ? 'Terkirim' : 'Pesan'}
                      </button>
                    </div>

                    <div className={`absolute inset-0 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-4 z-10 transition-all duration-300 ${phoneAlertOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                      <div className={`bg-white p-5 rounded-2xl text-center border border-slate-200 w-full shadow-xl transition-transform duration-300 ${phoneAlertOpen ? 'scale-100' : 'scale-95'}`}>
                        <div className="w-10 h-10 bg-blue-50 text-[#2563EB] rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
                          <Icons.speaker />
                        </div>
                        <h4 className="font-black text-slate-900 text-sm">Pesanan Siap</h4>
                        <p className="text-xs text-slate-600 mt-1 mb-4">Antrean #14, Meja 10, silakan ambil pesanan di kasir.</p>
                        <button
                          type="button"
                          onClick={() => setPhoneAlertOpen(false)}
                          className="w-full bg-[#2563EB] text-white text-xs py-2.5 rounded-lg font-bold"
                        >
                          Tutup
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* AI BUSINESS ADVISOR */}
      <section id="ai" className="py-20 px-6 bg-[#090D16] text-slate-100 border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <Reveal className="lg:col-span-6 space-y-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-2">AI Business Advisor</p>
                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                  Asisten Audit Keuangan & Operasional untuk Owner.
                </h2>
                <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                  Owner dapat memantau cabang tanpa membaca ratusan baris transaksi mentah. Seluruh ringkasan dihitung di server secara terstruktur.
                </p>
              </div>

              <div className="space-y-4">
                {aiCapabilities.map((item, idx) => (
                  <Reveal key={item.code} delay={idx * 70}>
                    <div className="rounded-xl border border-slate-800 bg-[#0F1420] p-4 flex items-start gap-3.5 transition-colors duration-200 hover:border-slate-700">
                      <span className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 text-xs font-bold font-mono shrink-0 mt-0.5">
                        {item.code}
                      </span>
                      <div>
                        <h3 className="text-sm font-bold text-white">{item.title}</h3>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </Reveal>

            <Reveal delay={140} className="lg:col-span-6 rounded-2xl border border-slate-800 bg-[#0F1420] p-6 space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <p className="text-sm font-bold text-white">Panel Audit & Aksi 1-Klik</p>
                  <p className="text-xs text-slate-400">Contoh ringkasan temuan otomatis di dashboard Owner</p>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-400 text-[11px] font-bold">
                  Terhubung ke Database
                </span>
              </div>

              <div className="rounded-xl border border-rose-500/30 bg-[#090D16] p-4 space-y-1.5 transition-transform duration-200 hover:-translate-y-0.5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-rose-400">Peringatan Audit Kasir</p>
                  <span className="text-[11px] font-mono text-slate-400">Cabang Pusat</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Terdeteksi pembatalan pesanan tunai pada jam malam serta 1 pesanan tunai yang belum diselesaikan lebih dari 2 jam.
                </p>
              </div>

              <div className="rounded-xl border border-amber-500/30 bg-[#090D16] p-4 space-y-1.5 transition-transform duration-200 hover:-translate-y-0.5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-amber-400">Jam Sibuk Dapur (Bottleneck)</p>
                  <span className="text-[11px] font-mono text-slate-400">19.00 – 20.00 WIB</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Rata-rata waktu penyajian naik di jam makan malam. Disarankan menambah persiapan stok sebelum pukul 18.30 WIB.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-[#090D16] p-4 space-y-3 transition-transform duration-200 hover:-translate-y-0.5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-white">Promo Jam Sepi (14.00 – 16.30 WIB)</p>
                  <span className="text-[11px] font-semibold text-emerald-400">Auto-Stop 16:30</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Aktifkan harga coret pada menu dengan stok berlebih dalam 1 klik. Harga normal kembali aktif otomatis saat jam promo berakhir.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-6 bg-white text-slate-900 border-t border-slate-200">
        <div className="max-w-3xl mx-auto">
          <Reveal className="text-center mb-10">
            <h2 className="text-3xl font-black text-slate-900">Pertanyaan Umum</h2>
          </Reveal>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="rounded-xl bg-slate-50 border border-slate-200 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                    className="w-full flex items-center justify-between gap-4 p-4 text-left hover:bg-slate-100/70 transition-colors"
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

      {/* KONSULTASI WHATSAPP */}
      <section id="konsultasi" className="py-20 px-6 bg-[#090D16] border-t border-slate-800/80">
        <Reveal>
          <div className="max-w-4xl mx-auto rounded-2xl border border-slate-800 bg-[#0F1420] p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-4xl font-black text-white mb-4 tracking-tight">
              Siap Terapkan di Kafe atau Restoran Anda?
            </h2>
            <p className="text-sm md:text-base text-slate-400 max-w-xl mx-auto mb-8 leading-relaxed">
              Diskusikan kebutuhan cabang, setup menu, dan QR meja bersama tim kami langsung melalui WhatsApp atau mulai dengan akun trial 7 hari.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 inline-flex items-center justify-center gap-2"
              >
                <Icons.whatsapp />
                <span>Hubungi via WhatsApp</span>
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