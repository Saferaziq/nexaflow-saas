'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// ⚙️ GANTI NOMOR WA ANDA DI SINI (Format 62, tanpa + dan 0 di depan)
const WA_NUMBER = '6281234567890';
const WA_MESSAGE = 'Halo NexaFlow, saya tertarik dengan sistem kasir kafe Anda. Bisa info lebih lanjut?';

// Logo Kustom Presisi (SVG)
const NexaLogo = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="2" y="15" width="8" height="20" rx="1" fill="#3A2A20"/>
    <rect x="14" y="5" width="8" height="30" rx="1" fill="#3A2A20"/>
    <rect x="26" y="22" width="8" height="13" rx="1" fill="#3A2A20"/>
    <circle cx="35" cy="11" r="2.5" fill="#3A2A20"/>
  </svg>
);

const Icons = {
  Menu: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  X: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  QrCode: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
  Chef: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/><line x1="6" y1="17" x2="18" y2="17"/></svg>,
  Chart: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>,
  Wallet: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg>,
  ChevronDown: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polyline points="6 9 12 15 18 9"/></svg>,
  ArrowRight: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  WhatsApp: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>,
  Sparkles: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>,
};

const features = [
  { Icon: Icons.QrCode, title: 'Order via QR Code', desc: 'Pelanggan scan QR di meja, pesan dari HP sendiri tanpa install aplikasi. Pesanan langsung masuk ke dashboard kasir.' },
  { Icon: Icons.Chef, title: 'Kitchen Display System', desc: 'Layar dapur khusus untuk koki. Pesanan muncul otomatis, tidak ada lagi kertas hilang atau salah baca.' },
  { Icon: Icons.Wallet, title: 'QRIS Dinamis Otomatis', desc: 'Cetak bill dengan QRIS yang nominalnya sudah terisi otomatis. Pelanggan scan sekali, langsung bayar.' },
  { Icon: Icons.Chart, title: 'Laporan & Analitik', desc: 'Omset harian, menu terlaris, jam sibuk, dan status pesanan dalam satu dashboard. Export CSV kapan saja.' },
];

const steps = [
  { num: '01', title: 'Daftar & Setup', desc: 'Buat akun kafe dalam 2 menit. Upload logo, banner, dan daftar menu Anda.' },
  { num: '02', title: 'Cetak QR Meja', desc: 'Generate dan cetak QR code untuk setiap meja. Tempel di meja, selesai.' },
  { num: '03', title: 'Mulai Jualan', desc: 'Pelanggan pesan sendiri, kasir fokus layani, koki lihat di layar dapur.' },
];

const faqs = [
  { q: 'Apakah bisa pakai QRIS kafe saya sendiri?', a: 'Ya! Anda cukup paste string QRIS statis dari bank/e-wallet Anda (DANA, BCA, Mandiri, GoPay, dll) di menu Pengaturan. Sistem otomatis akan generate QRIS dinamis dengan nominal pesanan.' },
  { q: 'Apakah butuh printer thermal khusus?', a: 'Tidak wajib. Sistem bisa print via printer biasa (A4/A5) atau printer thermal Bluetooth 58mm/80mm.' },
  { q: 'Berapa lama waktu setup?', a: 'Rata-rata 5-10 menit. Anda hanya perlu upload menu, cetak QR meja, dan siap menerima pesanan pertama di hari yang sama.' },
  { q: 'Apakah ada biaya tersembunyi?', a: 'Tidak ada. Harga sudah termasuk semua fitur. Tanpa biaya setup, tanpa biaya per transaksi, tanpa biaya tersembunyi.' },
  { q: 'Bagaimana cara pembayarannya?', a: 'Setelah trial 14 hari selesai, kami akan kirim invoice via WhatsApp. Anda bisa bayar via transfer bank atau QRIS.' },
  { q: 'Bisa cancel kapan saja?', a: 'Tentu. Tidak ada kontrak minimum, tidak ada biaya penalti. Data Anda tetap tersimpan 30 hari setelah cancel.' },
];

export default function LandingPage() {
  const [year, setYear] = useState(2026);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => { setYear(new Date().getFullYear()); }, []);

  const openWhatsApp = () => window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`, '_blank');
  const scrollTo = (id) => { setMobileOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };

  return (
    <div className="min-h-screen bg-[#F5F2EB] text-[#3A2A20] font-sans overflow-x-hidden selection:bg-[#3A2A20]/20 selection:text-[#3A2A20]">
      
      {/* ============ BACKGROUND ANIMASI CONSTELLATION (PRESISI TINGGI) ============ */}
      <style dangerouslySetInnerHTML={{__html: `
        .constellation-bg {
          position: fixed; inset: 0; z-index: 0; pointer-events: none; opacity: 0.6;
          background-image: 
            radial-gradient(circle at 15% 20%, #E3DCD1 1.5px, transparent 1.5px),
            radial-gradient(circle at 85% 15%, #E3DCD1 1.5px, transparent 1.5px),
            radial-gradient(circle at 50% 50%, #E3DCD1 2px, transparent 2px),
            radial-gradient(circle at 75% 80%, #E3DCD1 1.5px, transparent 1.5px),
            radial-gradient(circle at 20% 85%, #E3DCD1 1.5px, transparent 1.5px);
          background-size: 100% 100%;
        }
        .constellation-lines {
          position: fixed; inset: 0; z-index: 0; pointer-events: none; opacity: 0.15;
          background-image: linear-gradient(45deg, transparent 48%, #3A2A20 49%, #3A2A20 51%, transparent 52%),
                            linear-gradient(-45deg, transparent 48%, #3A2A20 49%, #3A2A20 51%, transparent 52%);
          background-size: 120px 120px;
          animation: panNetwork 40s linear infinite;
        }
        @keyframes panNetwork {
          0% { background-position: 0 0; }
          100% { background-position: 240px 240px; }
        }
        .node-pulse {
          animation: pulse 4s ease-in-out infinite alternate;
        }
        @keyframes pulse {
          0% { transform: scale(0.9); opacity: 0.5; }
          100% { transform: scale(1.1); opacity: 1; }
        }
      `}} />

      <div className="constellation-bg"></div>
      <div className="constellation-lines"></div>

      {/* ============ NAVBAR ============ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#F5F2EB]/90 backdrop-blur-md border-b border-[#E3DCD1]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-3 relative z-10 group">
              <NexaLogo className="w-8 h-8 group-hover:scale-105 transition-transform" />
              <div>
                <p className="text-xl font-black text-[#3A2A20] tracking-tight leading-none uppercase">NEXAFLOW</p>
                <p className="text-[10px] font-bold text-[#7A6A5F] tracking-[0.2em] uppercase mt-0.5">SAAS RESTAURANT</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-2 relative z-10">
              <button onClick={() => scrollTo('fitur')} className="px-4 py-2 text-sm font-bold text-[#7A6A5F] hover:text-[#3A2A20] transition-colors">Fitur</button>
              <button onClick={() => scrollTo('cara-kerja')} className="px-4 py-2 text-sm font-bold text-[#7A6A5F] hover:text-[#3A2A20] transition-colors">Cara Kerja</button>
              <button onClick={() => scrollTo('harga')} className="px-4 py-2 text-sm font-bold text-[#7A6A5F] hover:text-[#3A2A20] transition-colors">Harga</button>
              <button onClick={() => scrollTo('faq')} className="px-4 py-2 text-sm font-bold text-[#7A6A5F] hover:text-[#3A2A20] transition-colors">FAQ</button>
            </nav>

            <div className="flex items-center gap-3 relative z-10">
              <Link href="/login" className="hidden sm:inline-flex px-5 py-2.5 text-sm font-bold text-[#7A6A5F] hover:text-[#3A2A20] transition-colors">Masuk</Link>
              <Link href="/register" className="hidden sm:inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#3A2A20] text-[#F5F2EB] text-sm font-bold shadow-lg shadow-[#3A2A20]/20 hover:shadow-[#3A2A20]/40 hover:-translate-y-0.5 transition-all">
                Coba Gratis <Icons.ArrowRight />
              </Link>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-[#3A2A20] rounded-lg hover:bg-[#E3DCD1]">
                {mobileOpen ? <Icons.X /> : <Icons.Menu />}
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-[#F5F2EB] border-t border-[#E3DCD1] px-6 py-4 space-y-2 absolute w-full z-50 shadow-xl">
            {[['fitur', 'Fitur'], ['cara-kerja', 'Cara Kerja'], ['harga', 'Harga'], ['faq', 'FAQ']].map(([id, label]) => (
              <button key={id} onClick={() => scrollTo(id)} className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-[#7A6A5F] hover:bg-[#E3DCD1]/50">{label}</button>
            ))}
            <div className="pt-4 border-t border-[#E3DCD1] flex flex-col gap-2">
              <Link href="/login" className="px-4 py-3 rounded-xl text-sm font-bold text-[#7A6A5F] hover:bg-[#E3DCD1]/50">Masuk</Link>
              <Link href="/register" className="px-4 py-3 rounded-xl text-sm font-bold text-[#F5F2EB] bg-[#3A2A20] text-center shadow-md">Daftar Gratis</Link>
            </div>
          </div>
        )}
      </header>

      {/* ============ HERO SECTION ============ */}
      <section className="relative pt-32 sm:pt-40 pb-24 px-6 lg:px-8 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E3DCD1]/40 border border-[#D3C8BB] text-[#3A2A20] text-[10px] font-black tracking-[0.15em] uppercase mb-8 shadow-sm backdrop-blur-sm">
                <Icons.Sparkles />
                Langkah Baru Bisnis Anda
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-[#3A2A20] leading-[1.05] tracking-tight">
                Ubah Cara Caffe<br />
                <span className="text-[#8C7A6B]">Bekerja Hari Ini.</span>
              </h1>

              <p className="mt-6 text-lg text-[#7A6A5F] leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
                Bergabunglah dengan ekosistem digital yang membantu Anda mengelola pesanan lebih cerdas, meningkatkan pendapatan, dan memberikan pengalaman terbaik bagi pelanggan.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/register" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[#3A2A20] text-[#F5F2EB] font-black text-base shadow-xl shadow-[#3A2A20]/20 hover:shadow-[#3A2A20]/40 hover:-translate-y-0.5 transition-all">
                  Mulai Gratis 14 Hari <Icons.ArrowRight />
                </Link>
                <button onClick={() => scrollTo('fitur')} className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white border border-[#D3C8BB] text-[#3A2A20] font-bold text-base hover:bg-[#F5F2EB] shadow-sm hover:shadow-md transition-all">
                  Lihat Fitur
                </button>
              </div>
            </div>

            {/* Mockup Dashboard */}
            <div className="relative hidden lg:block">
              <div className="absolute -inset-4 bg-[#3A2A20]/5 rounded-[2rem] blur-xl"></div>
              <div className="relative rounded-3xl overflow-hidden border border-[#D3C8BB] bg-white shadow-2xl">
                <div className="bg-[#F5F2EB] px-5 py-4 flex items-center gap-2 border-b border-[#E3DCD1]">
                  <div className="w-3 h-3 rounded-full bg-[#D3C8BB]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#D3C8BB]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#D3C8BB]"></div>
                  <div className="ml-4 flex-1 bg-white border border-[#E3DCD1] rounded-lg px-4 py-1.5 text-xs text-[#8C7A6B] font-mono">nexaflow.app/dashboard</div>
                </div>
                <div className="p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-[#8C7A6B] uppercase tracking-widest mb-1">Dashboard Kasir</p>
                      <p className="text-xl font-black text-[#3A2A20]">Kopi Senja</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Online</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-[#F5F2EB] rounded-xl p-4 border border-[#E3DCD1]"><p className="text-[10px] font-bold text-[#8C7A6B] uppercase mb-1">Pesanan</p><p className="text-2xl font-black text-[#3A2A20]">24</p></div>
                    <div className="bg-[#F5F2EB] rounded-xl p-4 border border-[#E3DCD1]"><p className="text-[10px] font-bold text-[#8C7A6B] uppercase mb-1">Dimasak</p><p className="text-2xl font-black text-[#3A2A20]">7</p></div>
                    <div className="bg-[#3A2A20] rounded-xl p-4 shadow-md"><p className="text-[10px] font-bold text-[#D3C8BB] uppercase mb-1">Omset</p><p className="text-xl font-black text-white">2.4jt</p></div>
                  </div>
                  {[{ t: 'Meja 3', n: 'Rian', p: 'Rp 85.000', s: 'Dimasak' }, { t: 'Meja 7', n: 'Sinta', p: 'Rp 124.000', s: 'Siap' }].map((o, i) => (
                    <div key={i} className="flex items-center justify-between bg-white rounded-xl p-4 border border-[#E3DCD1] shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-[#F5F2EB] border border-[#E3DCD1] flex items-center justify-center text-sm font-black text-[#3A2A20]">{o.t.split(' ')[1]}</div>
                        <div>
                          <p className="text-sm font-bold text-[#3A2A20]">{o.t} · {o.n}</p>
                          <p className="text-xs text-[#8C7A6B]">{o.p}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md ${o.s === 'Dimasak' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{o.s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="relative px-6 lg:px-8 py-14 border-y border-[#E3DCD1] bg-white/60 backdrop-blur-md z-10">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[{ v: '2 menit', l: 'Setup kafe' }, { v: 'Real-time', l: 'Sync pesanan' }, { v: '100%', l: 'Cloud-based' }, { v: '24/7', l: 'Support WA' }].map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl font-black text-[#3A2A20]">{s.v}</p>
              <p className="text-xs font-bold text-[#8C7A6B] mt-1 uppercase tracking-widest">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ FITUR ============ */}
      <section id="fitur" className="px-6 lg:px-8 py-24 sm:py-32 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-[#3A2A20] tracking-tight leading-tight mb-4">
              Semua yang Kafe Anda Butuhkan,<br className="hidden sm:block" />
              <span className="text-[#8C7A6B]">dalam Satu Platform</span>
            </h2>
            <p className="text-[#7A6A5F] text-lg font-medium">Dirancang khusus untuk kafe & restoran Indonesia. Tanpa perlu training rumit.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <div key={i} className="group relative rounded-3xl p-8 bg-white border border-[#E3DCD1] shadow-sm hover:shadow-xl hover:border-[#D3C8BB] transition-all duration-300 hover:-translate-y-1">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#F5F2EB] border border-[#E3DCD1] mb-6 group-hover:scale-110 transition-transform text-[#3A2A20]">
                  <f.Icon />
                </div>
                <h3 className="text-xl font-black text-[#3A2A20] mb-3">{f.title}</h3>
                <p className="text-sm text-[#7A6A5F] leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CARA KERJA ============ */}
      <section id="cara-kerja" className="px-6 lg:px-8 py-24 sm:py-32 relative bg-white/60 border-y border-[#E3DCD1] z-10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-[#3A2A20] tracking-tight leading-tight mb-4">
              Mulai Jualan dalam <span className="text-[#8C7A6B]">3 Langkah</span>
            </h2>
            <p className="text-[#7A6A5F] text-lg font-medium">Dari daftar sampai pesanan pertama dalam hitungan menit.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 relative">
            <div className="hidden md:block absolute top-20 left-10 right-10 h-0.5 bg-gradient-to-r from-transparent via-[#D3C8BB] to-transparent"></div>
            {steps.map((s, i) => (
              <div key={i} className="relative">
                <div className="relative bg-white border border-[#E3DCD1] rounded-3xl p-8 hover:border-[#8C7A6B] shadow-sm hover:shadow-md transition-all text-center md:text-left">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#F5F2EB] border border-[#D3C8BB] text-[#3A2A20] font-black text-xl shadow-sm mb-6">{s.num}</div>
                  <h3 className="text-xl font-black text-[#3A2A20] mb-3">{s.title}</h3>
                  <p className="text-sm text-[#7A6A5F] leading-relaxed font-medium">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PRICING ============ */}
      <section id="harga" className="px-6 lg:px-8 py-24 sm:py-32 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-[#3A2A20] tracking-tight leading-tight mb-4">
              Satu Harga, <span className="text-[#8C7A6B]">Semua Fitur</span>
            </h2>
            <p className="text-[#7A6A5F] text-lg font-medium">Tidak ada tier rumit. Tidak ada biaya tersembunyi.</p>
          </div>
          <div className="relative max-w-md mx-auto">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-[#D3C8BB] to-[#8C7A6B] rounded-[2rem] blur-lg opacity-50"></div>
            <div className="relative rounded-[2rem] bg-white border border-[#3A2A20]/20 overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 bg-[#3A2A20] text-white text-[10px] font-black uppercase tracking-widest px-5 py-2 rounded-bl-2xl shadow-md">
                ⭐ Paling Populer
              </div>
              <div className="p-10 sm:p-12">
                <p className="text-sm font-bold text-[#8C7A6B] uppercase tracking-widest mb-3">NexaFlow Pro</p>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-2xl font-bold text-[#8C7A6B]">Rp</span>
                  <span className="text-6xl font-black text-[#3A2A20] tracking-tight">149rb</span>
                  <span className="text-lg font-semibold text-[#8C7A6B]">/bulan</span>
                </div>
                <p className="text-xs font-bold text-emerald-600 mb-8">🎁 Gratis 14 hari pertama</p>

                <div className="space-y-4 mb-10 pt-8 border-t border-[#E3DCD1]">
                  {['Semua fitur tanpa batasan', 'Unlimited menu & meja', 'Order via QR & Bill QRIS otomatis', 'Kitchen Display System (KDS)', 'Laporan harian, bulanan & custom', 'Export CSV kapan saja', 'Support via WhatsApp'].map((f, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-[#3A2A20] mt-0.5 shrink-0"><Icons.Check /></span>
                      <span className="text-sm font-bold text-[#7A6A5F]">{f}</span>
                    </div>
                  ))}
                </div>

                <Link href="/register" className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-[#3A2A20] text-white font-black text-base shadow-lg shadow-[#3A2A20]/20 hover:shadow-[#3A2A20]/40 hover:-translate-y-0.5 transition-all">
                  Mulai Gratis Sekarang <Icons.ArrowRight />
                </Link>
                <p className="text-center text-[11px] font-bold text-[#8C7A6B] mt-4">Tanpa kartu kredit · Cancel kapan saja</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section id="faq" className="px-6 lg:px-8 py-24 sm:py-32 relative bg-white/60 border-y border-[#E3DCD1] z-10 backdrop-blur-md">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl sm:text-5xl font-black text-[#3A2A20] tracking-tight leading-tight">
              Pertanyaan yang Sering Ditanyakan
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <div key={i} className="rounded-2xl bg-white border border-[#E3DCD1] overflow-hidden hover:border-[#D3C8BB] transition-colors shadow-sm">
                <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} className="w-full flex items-center justify-between gap-4 p-6 text-left">
                  <span className="font-bold text-[#3A2A20] text-base">{f.q}</span>
                  <span className={`shrink-0 text-[#8C7A6B] transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}><Icons.ChevronDown /></span>
                </button>
                {openFaq === i && <div className="px-6 pb-6 text-sm text-[#7A6A5F] leading-relaxed font-medium">{f.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="px-6 lg:px-8 py-24 sm:py-32 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-[2rem] overflow-hidden bg-[#3A2A20] border border-[#3A2A20] p-12 sm:p-20 text-center shadow-2xl">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
            <h2 className="text-4xl sm:text-5xl font-black text-[#F5F2EB] tracking-tight leading-tight mb-6">
              Siap Membawa Kafe Anda<br /><span className="text-[#D3C8BB]">ke Level Berikutnya?</span>
            </h2>
            <p className="text-[#D3C8BB] text-lg mb-10 max-w-xl mx-auto font-medium">
              Bergabung dengan kafe-kafe modern yang sudah beralih ke NexaFlow. Gratis 14 hari, tanpa risiko.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[#F5F2EB] text-[#3A2A20] font-black text-base shadow-xl hover:-translate-y-0.5 transition-all">
                Coba Gratis Sekarang <Icons.ArrowRight />
              </Link>
              <button onClick={openWhatsApp} className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-transparent border-2 border-[#8C7A6B] text-[#F5F2EB] font-bold text-base hover:bg-white/5 transition-all">
                <Icons.WhatsApp /> Chat via WhatsApp
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-[#E3DCD1] px-6 lg:px-8 py-14 bg-[#F5F2EB] relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-5">
                <NexaLogo className="w-8 h-8" />
                <div>
                  <p className="text-xl font-black text-[#3A2A20] tracking-tight leading-none uppercase">NEXAFLOW</p>
                  <p className="text-[10px] font-bold text-[#7A6A5F] tracking-[0.2em] uppercase mt-0.5">SAAS RESTAURANT</p>
                </div>
              </div>
              <p className="text-sm text-[#7A6A5F] leading-relaxed max-w-sm font-medium">
                Sistem kasir modern untuk kafe & restoran Indonesia. Pesanan lebih cepat, laporan lebih rapi, pelanggan lebih senang.
              </p>
            </div>
            <div>
              <p className="text-xs font-black text-[#3A2A20] uppercase tracking-widest mb-5">Produk</p>
              <ul className="space-y-3 text-sm">
                <li><button onClick={() => scrollTo('fitur')} className="text-[#7A6A5F] hover:text-[#3A2A20] font-semibold transition-colors">Fitur</button></li>
                <li><button onClick={() => scrollTo('harga')} className="text-[#7A6A5F] hover:text-[#3A2A20] font-semibold transition-colors">Harga</button></li>
                <li><button onClick={() => scrollTo('faq')} className="text-[#7A6A5F] hover:text-[#3A2A20] font-semibold transition-colors">FAQ</button></li>
                <li><Link href="/login" className="text-[#7A6A5F] hover:text-[#3A2A20] font-semibold transition-colors">Login</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-black text-[#3A2A20] uppercase tracking-widest mb-5">Kontak</p>
              <ul className="space-y-3 text-sm">
                <li><button onClick={openWhatsApp} className="text-[#7A6A5F] hover:text-[#3A2A20] font-semibold transition-colors inline-flex items-center gap-2"><Icons.WhatsApp /> WhatsApp</button></li>
                <li><a href="mailto:hello@nexaflow.app" className="text-[#7A6A5F] hover:text-[#3A2A20] font-semibold transition-colors">hello@nexaflow.app</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-[#E3DCD1] flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs font-semibold text-[#8C7A6B]">© {year} NexaFlow. All rights reserved.</p>
            <p className="text-xs font-semibold text-[#8C7A6B]">Made with <span className="text-rose-500">♥</span> in Indonesia</p>
          </div>
        </div>
      </footer>

      {/* ============ FLOATING WHATSAPP ============ */}
      <button onClick={openWhatsApp} className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#3A2A20] text-[#F5F2EB] flex items-center justify-center shadow-2xl shadow-[#3A2A20]/40 hover:scale-110 transition-transform" aria-label="Chat WhatsApp">
        <Icons.WhatsApp />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-[#F5F2EB] animate-pulse"></span>
      </button>

    </div>
  );
}