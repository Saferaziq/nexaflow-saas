'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

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
  Zap: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
};

// ⚙️ CUSTOM: Ganti nomor WA dengan nomor Anda (format 62xxx, tanpa + dan tanpa 0 di depan)
const WA_NUMBER = '081389744957';
const WA_MESSAGE = 'Halo NexaFlow, saya tertarik dengan sistem kasir kafe Anda. Bisa info lebih lanjut?';

const features = [
  {
    Icon: Icons.QrCode,
    title: 'Order via QR Code',
    desc: 'Pelanggan scan QR di meja, pesan dari HP sendiri tanpa install aplikasi. Pesanan langsung masuk ke dashboard kasir.',
    accent: 'from-cyan-500/20 to-cyan-500/5',
    iconColor: 'text-cyan-400',
    iconBg: 'bg-cyan-500/10 border-cyan-500/30',
  },
  {
    Icon: Icons.Chef,
    title: 'Kitchen Display System',
    desc: 'Layar dapur khusus untuk koki. Pesanan muncul otomatis, tidak ada lagi kertas hilang atau salah baca.',
    accent: 'from-emerald-500/20 to-emerald-500/5',
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10 border-emerald-500/30',
  },
  {
    Icon: Icons.Wallet,
    title: 'QRIS Dinamis Otomatis',
    desc: 'Cetak bill dengan QRIS yang nominalnya sudah terisi otomatis. Pelanggan scan sekali, langsung bayar.',
    accent: 'from-blue-500/20 to-blue-500/5',
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-500/10 border-blue-500/30',
  },
  {
    Icon: Icons.Chart,
    title: 'Laporan & Analitik',
    desc: 'Omset harian, menu terlaris, jam sibuk, dan status pesanan dalam satu dashboard. Export CSV kapan saja.',
    accent: 'from-purple-500/20 to-purple-500/5',
    iconColor: 'text-purple-400',
    iconBg: 'bg-purple-500/10 border-purple-500/30',
  },
];

const steps = [
  { num: '01', title: 'Daftar & Setup', desc: 'Buat akun kafe dalam 2 menit. Upload logo, banner, dan daftar menu Anda.' },
  { num: '02', title: 'Cetak QR Meja', desc: 'Generate dan cetak QR code untuk setiap meja. Tempel di meja, selesai.' },
  { num: '03', title: 'Mulai Jualan', desc: 'Pelanggan pesan sendiri, kasir fokus layani, koki lihat di layar dapur.' },
];

const faqs = [
  { q: 'Apakah bisa pakai QRIS kafe saya sendiri?', a: 'Ya! Anda cukup paste string QRIS statis dari bank/e-wallet Anda (DANA, BCA, Mandiri, GoPay, dll) di menu Pengaturan. Sistem otomatis akan generate QRIS dinamis dengan nominal pesanan.' },
  { q: 'Apakah butuh printer thermal khusus?', a: 'Tidak wajib. Sistem bisa print via printer biasa (A4/A5) atau printer thermal Bluetooth 58mm/80mm (fitur thermal akan segera hadir).' },
  { q: 'Berapa lama waktu setup?', a: 'Rata-rata 5-10 menit. Anda hanya perlu upload menu, cetak QR meja, dan siap menerima pesanan pertama di hari yang sama.' },
  { q: 'Apakah ada biaya tersembunyi?', a: 'Tidak ada. Harga Rp 149.000/bulan sudah termasuk semua fitur. Tanpa biaya setup, tanpa biaya per transaksi, tanpa biaya tersembunyi.' },
  { q: 'Bagaimana cara pembayarannya?', a: 'Setelah trial 14 hari selesai, kami akan kirim invoice via WhatsApp. Anda bisa bayar via transfer bank atau QRIS. Bisa diperpanjang manual atau otomatis.' },
  { q: 'Bisa cancel kapan saja?', a: 'Tentu. Tidak ada kontrak minimum, tidak ada biaya penalti. Data Anda tetap tersimpan 30 hari setelah cancel untuk berjaga-jaga jika ingin kembali.' },
];

export default function LandingPage() {
  const [year, setYear] = useState(2026);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const openWhatsApp = () => {
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`;
    window.open(url, '_blank');
  };

  const scrollTo = (id) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-[#050b14] text-slate-200 font-sans overflow-x-hidden">

      {/* ============ NAVBAR ============ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#050b14]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <span className="text-white font-black text-lg">N</span>
              </div>
              <div>
                <p className="text-base sm:text-lg font-black text-white tracking-tight leading-none">NexaFlow</p>
                <p className="text-[9px] font-bold text-cyan-400 tracking-[0.2em] uppercase mt-0.5">Restaurant OS</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <button onClick={() => scrollTo('fitur')} className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors">Fitur</button>
              <button onClick={() => scrollTo('cara-kerja')} className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors">Cara Kerja</button>
              <button onClick={() => scrollTo('harga')} className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors">Harga</button>
              <button onClick={() => scrollTo('faq')} className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors">FAQ</button>
            </nav>

            <div className="flex items-center gap-2">
              <Link href="/login" className="hidden sm:inline-flex px-4 py-2 text-sm font-bold text-slate-300 hover:text-white transition-colors rounded-xl">Masuk</Link>
              <Link href="/register" className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all hover:scale-105">
                Coba Gratis <Icons.ArrowRight />
              </Link>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-slate-300 rounded-xl hover:bg-white/5">
                {mobileOpen ? <Icons.X /> : <Icons.Menu />}
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-[#0a192f] border-t border-white/5 px-5 py-4 space-y-1">
            {[['fitur', 'Fitur'], ['cara-kerja', 'Cara Kerja'], ['harga', 'Harga'], ['faq', 'FAQ']].map(([id, label]) => (
              <button key={id} onClick={() => scrollTo(id)} className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-slate-300 hover:bg-white/5">{label}</button>
            ))}
            <div className="pt-3 border-t border-white/5 flex flex-col gap-2">
              <Link href="/login" className="px-4 py-3 rounded-xl text-sm font-bold text-slate-300 hover:bg-white/5">Masuk</Link>
              <Link href="/register" className="px-4 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 text-center">Coba Gratis 14 Hari</Link>
            </div>
          </div>
        )}
      </header>

      {/* ============ HERO ============ */}
      <section className="relative pt-28 sm:pt-36 pb-20 px-5 sm:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(0,168,204,0.15),transparent)]"></div>
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold mb-6 shadow-lg shadow-cyan-500/10">
                <Icons.Sparkles />
                Baru: Fitur QRIS Dinamis Otomatis
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight">
                Sistem Kasir{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">Modern</span>
                <br />
                untuk Kafe yang Ingin{' '}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Berkembang</span>
              </h1>

              <p className="mt-6 text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Kelola pesanan, dapur, dan laporan dari satu dashboard. Pelanggan pesan via QR, koki lihat di layar, kasir cetak bill dengan QRIS otomatis.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link href="/register" className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-base shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all hover:scale-105">
                  Coba Gratis 14 Hari <Icons.ArrowRight />
                </Link>
                <button onClick={() => scrollTo('fitur')} className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-base hover:bg-white/10 transition-all">
                  Lihat Fitur
                </button>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-5 justify-center lg:justify-start text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-1.5"><Icons.Check /><span className="text-slate-400">Tanpa kartu kredit</span></div>
                <div className="flex items-center gap-1.5"><Icons.Check /><span className="text-slate-400">Setup 5 menit</span></div>
                <div className="flex items-center gap-1.5"><Icons.Check /><span className="text-slate-400">Cancel kapan saja</span></div>
              </div>
            </div>

            {/* Mockup Dashboard */}
            <div className="relative hidden lg:block">
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-3xl blur-2xl"></div>
              <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#0a192f] shadow-2xl">
                <div className="bg-[#050b14] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/60"></div>
                  <div className="w-3 h-3 rounded-full bg-cyan-500/60"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/60"></div>
                  <div className="ml-3 flex-1 bg-white/5 rounded-lg px-3 py-1 text-[10px] text-slate-500 font-mono">nexaflow.app/dashboard</div>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Dashboard Kasir</p>
                      <p className="text-lg font-black text-white">Kafe Senja</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                      <span className="text-[10px] font-bold text-emerald-400">Online</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white/5 rounded-xl p-3 border border-white/5"><p className="text-[9px] font-bold text-slate-500 uppercase mb-1">Pesanan</p><p className="text-xl font-black text-white">24</p></div>
                    <div className="bg-cyan-500/10 rounded-xl p-3 border border-cyan-500/20"><p className="text-[9px] font-bold text-cyan-400 uppercase mb-1">Dimasak</p><p className="text-xl font-black text-cyan-400">7</p></div>
                    <div className="bg-emerald-500/10 rounded-xl p-3 border border-emerald-500/20"><p className="text-[9px] font-bold text-emerald-400 uppercase mb-1">Omset</p><p className="text-lg font-black text-emerald-400">2.4jt</p></div>
                  </div>
                  {[
                    { t: 'Meja 3', n: 'Rian', p: 'Rp 85.000', s: 'Dimasak', c: 'cyan' },
                    { t: 'Meja 7', n: 'Sinta', p: 'Rp 124.000', s: 'Siap', c: 'emerald' },
                    { t: 'Meja 1', n: 'Budi', p: 'Rp 45.000', s: 'Baru', c: 'slate' },
                  ].map((o, i) => (
                    <div key={i} className="flex items-center justify-between bg-white/[0.03] rounded-xl p-3 border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/30 to-blue-600/30 flex items-center justify-center text-xs font-black text-white">{o.t.split(' ')[1]}</div>
                        <div>
                          <p className="text-xs font-bold text-white">{o.t} · {o.n}</p>
                          <p className="text-[10px] text-slate-500">{o.p}</p>
                        </div>
                      </div>
                      <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md ${o.c === 'cyan' ? 'bg-cyan-500/10 text-cyan-400' : o.c === 'emerald' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'}`}>{o.s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="relative px-5 sm:px-8 py-12 border-y border-white/5 bg-[#0a192f]/40">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {[
            { v: '2 menit', l: 'Setup kafe', i: <Icons.Zap /> },
            { v: 'Real-time', l: 'Sync pesanan', i: <Icons.QrCode /> },
            { v: '100%', l: 'Cloud-based', i: <Icons.Chart /> },
            { v: '24/7', l: 'Support WA', i: <Icons.Chef /> },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-3">{s.i}</div>
              <p className="text-xl sm:text-2xl font-black text-white">{s.v}</p>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ FITUR ============ */}
      <section id="fitur" className="px-5 sm:px-8 py-20 sm:py-28 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-black uppercase tracking-widest mb-4">
              Fitur Unggulan
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Semua yang Kafe Anda Butuhkan,<br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">dalam Satu Platform</span>
            </h2>
            <p className="mt-4 text-slate-400 text-base sm:text-lg">Dirancang khusus untuk kafe & restoran Indonesia. Tanpa perlu training rumit.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {features.map((f, i) => (
              <div key={i} className={`group relative rounded-3xl p-7 sm:p-8 bg-gradient-to-br ${f.accent} border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1`}>
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${f.iconBg} border mb-5 group-hover:scale-110 transition-transform`}>
                  <span className={f.iconColor}><f.Icon /></span>
                </div>
                <h3 className="text-xl font-black text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CARA KERJA ============ */}
      <section id="cara-kerja" className="px-5 sm:px-8 py-20 sm:py-28 relative bg-[#0a192f]/40 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[11px] font-black uppercase tracking-widest mb-4">
              Cara Kerja
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Mulai Jualan dalam <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">3 Langkah</span>
            </h2>
            <p className="mt-4 text-slate-400 text-base sm:text-lg">Dari daftar sampai pesanan pertama dalam hitungan menit.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
            {steps.map((s, i) => (
              <div key={i} className="relative">
                <div className="relative bg-[#0a192f] border border-white/10 rounded-3xl p-7 hover:border-cyan-500/30 transition-colors">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-black text-lg shadow-lg shadow-cyan-500/30 mb-5">{s.num}</div>
                  <h3 className="text-lg font-black text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PRICING ============ */}
      <section id="harga" className="px-5 sm:px-8 py-20 sm:py-28 relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-black uppercase tracking-widest mb-4">
              Harga
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Satu Harga, <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Semua Fitur</span>
            </h2>
            <p className="mt-4 text-slate-400 text-base sm:text-lg">Tidak ada tier rumit. Tidak ada biaya tersembunyi.</p>
          </div>

          <div className="relative max-w-md mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl blur-xl opacity-30"></div>
            <div className="relative rounded-3xl bg-gradient-to-br from-[#0a192f] to-[#050b14] border border-cyan-500/30 overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl">
                ⭐ Paling Populer
              </div>
              <div className="p-8 sm:p-10">
                <p className="text-sm font-bold text-cyan-400 uppercase tracking-widest mb-3">NexaFlow Pro</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-2xl font-bold text-slate-400">Rp</span>
                  <span className="text-5xl sm:text-6xl font-black text-white tracking-tight">149rb</span>
                  <span className="text-base font-semibold text-slate-500">/bulan</span>
                </div>
                <p className="text-xs font-bold text-emerald-400 mb-6">🎁 Gratis 14 hari pertama</p>

                <div className="space-y-3 mb-8 pt-6 border-t border-white/10">
                  {[
                    'Semua fitur tanpa batasan',
                    'Unlimited menu & meja',
                    'Order via QR & Bill QRIS otomatis',
                    'Kitchen Display System (KDS)',
                    'Laporan harian, bulanan & custom',
                    'Export CSV kapan saja',
                    'Support via WhatsApp',
                  ].map((f, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="text-cyan-400 mt-0.5 shrink-0"><Icons.Check /></span>
                      <span className="text-sm font-semibold text-slate-300">{f}</span>
                    </div>
                  ))}
                </div>

                <Link href="/register" className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-base shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all hover:scale-105">
                  Mulai Gratis Sekarang <Icons.ArrowRight />
                </Link>
                <p className="text-center text-[11px] font-semibold text-slate-500 mt-4">
                  Tanpa kartu kredit · Cancel kapan saja
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section id="faq" className="px-5 sm:px-8 py-20 sm:py-28 relative bg-[#0a192f]/40 border-y border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[11px] font-black uppercase tracking-widest mb-4">
              FAQ
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Pertanyaan yang Sering Ditanyakan
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={i} className="rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden hover:border-white/20 transition-colors">
                <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
                  <span className="font-bold text-white text-sm sm:text-base">{f.q}</span>
                  <span className={`shrink-0 text-cyan-400 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}>
                    <Icons.ChevronDown />
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm text-slate-400 leading-relaxed">
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="px-5 sm:px-8 py-20 sm:py-28">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0d3b66] via-[#0a192f] to-[#050b14] border border-cyan-500/30 p-10 sm:p-16 text-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-3xl -z-10"></div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4">
              Siap Membawa Kafe Anda<br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">ke Level Berikutnya?</span>
            </h2>
            <p className="text-slate-400 text-base sm:text-lg mb-8 max-w-xl mx-auto">
              Bergabung dengan kafe-kafe modern yang sudah beralih ke NexaFlow. Gratis 14 hari, tanpa risiko.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-base shadow-xl shadow-cyan-500/30 hover:scale-105 transition-all">
                Coba Gratis Sekarang <Icons.ArrowRight />
              </Link>
              <button onClick={openWhatsApp} className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-base hover:bg-emerald-500/20 transition-all">
                <Icons.WhatsApp /> Chat via WhatsApp
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-white/5 px-5 sm:px-8 py-12 bg-[#0a192f]/40">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                  <span className="text-white font-black text-lg">N</span>
                </div>
                <div>
                  <p className="text-lg font-black text-white tracking-tight leading-none">NexaFlow</p>
                  <p className="text-[9px] font-bold text-cyan-400 tracking-[0.2em] uppercase mt-0.5">Restaurant OS</p>
                </div>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                Sistem kasir modern untuk kafe & restoran Indonesia. Pesanan lebih cepat, laporan lebih rapi, pelanggan lebih senang.
              </p>
            </div>
            <div>
              <p className="text-xs font-black text-white uppercase tracking-widest mb-4">Produk</p>
              <ul className="space-y-2.5 text-sm">
                <li><button onClick={() => scrollTo('fitur')} className="text-slate-400 hover:text-cyan-400 transition-colors">Fitur</button></li>
                <li><button onClick={() => scrollTo('harga')} className="text-slate-400 hover:text-cyan-400 transition-colors">Harga</button></li>
                <li><button onClick={() => scrollTo('faq')} className="text-slate-400 hover:text-cyan-400 transition-colors">FAQ</button></li>
                <li><Link href="/login" className="text-slate-400 hover:text-cyan-400 transition-colors">Login</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-black text-white uppercase tracking-widest mb-4">Kontak</p>
              <ul className="space-y-2.5 text-sm">
                <li><button onClick={openWhatsApp} className="text-slate-400 hover:text-cyan-400 transition-colors inline-flex items-center gap-2"><Icons.WhatsApp /> WhatsApp</button></li>
                <li><a href="mailto:hello@nexaflow.app" className="text-slate-400 hover:text-cyan-400 transition-colors">hello@nexaflow.app</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-500">© {year} NexaFlow. All rights reserved.</p>
            <p className="text-xs text-slate-500">Made with <span className="text-rose-400">♥</span> in Indonesia</p>
          </div>
        </div>
      </footer>

      {/* ============ FLOATING WHATSAPP ============ */}
      <button
        onClick={openWhatsApp}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center shadow-2xl shadow-emerald-500/40 hover:scale-110 transition-transform"
        aria-label="Chat WhatsApp"
      >
        <Icons.WhatsApp />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-[#050b14] animate-pulse"></span>
      </button>

    </div>
  );
}