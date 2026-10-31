'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// Nomor WA Anda sudah terpasang di sini
const WA_NUMBER = '6281389744957';
const WA_MESSAGE = 'Halo NexaFlow, saya tertarik dengan sistem kasir caffe Anda. Bisa info lebih lanjut?';

// Logo NexaFlow baru sesuai dengan gambar referensi NF (Digital/Pixel Blue)
const NexaLogo = ({ className = "w-8 h-8" }) => (
  <img 
    src="https://nbthyktmfnppruovxots.supabase.co/storage/v1/object/public/public-assets/logo%20nexa%20flow.jpg" 
    alt="NexaFlow Logo" 
    className={`${className} object-contain mix-blend-multiply`} 
  />
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
  Zap: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  ShieldCheck: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>,
  HeartHandshake: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>,
};

const features = [
  { Icon: Icons.QrCode, title: 'Self-Order via QR', desc: 'Pelanggan memindai QR di meja, memesan langsung dari HP mereka. Tanpa antre, tanpa perlu install aplikasi.' },
  { Icon: Icons.Chef, title: 'Kitchen Display System', desc: 'Layar khusus dapur yang menampilkan antrean pesanan secara real-time. Mencegah kertas pesanan hilang.' },
  { Icon: Icons.Wallet, title: 'QRIS Dinamis', desc: 'Cetak struk dengan QRIS yang nominalnya sudah terisi otomatis. Pelanggan tinggal scan dan bayar.' },
  { Icon: Icons.Chart, title: 'Laporan Instan', desc: 'Pantau omset harian, menu terlaris, dan performa caffe Anda. Ekspor laporan ke CSV untuk pembukuan.' },
];

const whyUs = [
  { Icon: Icons.Zap, title: 'Layanan Lebih Cepat', desc: 'Pelanggan tak perlu menunggu pelayan untuk memesan. Kasir dan koki langsung bekerja begitu pesanan masuk.' },
  { Icon: Icons.ShieldCheck, title: 'Anti Order Fiktif', desc: 'Dilengkapi fitur penolakan pesanan jika ada pelanggan iseng. Keamanan operasional caffe Anda lebih terjamin.' },
  { Icon: Icons.Chart, title: 'Pantau Dari Mana Saja', desc: 'Sebagai pemilik, Anda bisa memantau omset dan aktivitas caffe dari HP Anda meski sedang di luar kota.' },
  { Icon: Icons.HeartHandshake, title: 'Support Lokal 24/7', desc: 'Bukan robot. Tim developer kami siap membantu via WhatsApp jika Anda mengalami kendala teknis.' },
];

const steps = [
  { num: '01', title: 'Daftar & Atur Profil', desc: 'Buat akun, unggah logo, dan masukkan daftar menu caffe Anda dalam hitungan menit.' },
  { num: '02', title: 'Cetak QR Meja', desc: 'Generate kode QR untuk setiap meja dan letakkan di atas meja pelanggan.' },
  { num: '03', title: 'Operasional Otomatis', desc: 'Pesanan masuk ke kasir dan dapur secara langsung. Fokus pada pelayanan, bukan pencatatan.' },
];

const faqs = [
  { q: 'Apakah bisa menggunakan QRIS caffe saya sendiri?', a: 'Ya. Anda hanya perlu memasukkan string QRIS statis milik caffe Anda di menu Pengaturan. Sistem NexaFlow akan mengubahnya menjadi QRIS dinamis dengan nominal tagihan yang sesuai pesanan.' },
  { q: 'Apakah butuh perangkat keras (hardware) khusus?', a: 'Tidak. NexaFlow berbasis cloud (web). Anda bisa mengakses Dashboard Kasir dan Dapur melalui browser di Laptop, PC, Tablet, maupun Smartphone.' },
  { q: 'Berapa lama proses setup-nya?', a: 'Sangat cepat. Rata-rata pemilik caffe hanya butuh 10-15 menit untuk memasukkan menu, mencetak QR, dan siap menerima pesanan pertama.' },
  { q: 'Apakah ada biaya tersembunyi atau komisi?', a: 'Tidak ada. Biaya langganan bersifat flat per bulan. Kami tidak memotong komisi dari setiap transaksi penjualan Anda.' },
];

export default function LandingPage() {
  const [year, setYear] = useState(2026);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const canvasRef = useRef(null);

  useEffect(() => { setYear(new Date().getFullYear()); }, []);

  // Animasi Canvas Network
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    const particleCount = 70;
    const maxDistance = 200;

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
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1.5
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(160, 140, 120, 0.6)';
        ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          let p2 = particles[j];
          let dx = p.x - p2.x; let dy = p.y - p2.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < maxDistance) {
            let opacity = 1 - (distance / maxDistance);
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(160, 140, 120, ${opacity * 0.4})`;
            ctx.lineWidth = 1; ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animationFrameId); };
  }, []);

  const openWhatsApp = () => window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`, '_blank');
  const scrollTo = (id) => { setMobileOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };

  return (
    <div className="min-h-screen bg-[#F4EFE9] text-[#3A2A20] font-sans overflow-x-hidden selection:bg-[#3A2A20]/20 selection:text-[#3A2A20]">
      
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none"></canvas>

      <header className="fixed top-0 left-0 right-0 z-50 bg-[#F4EFE9]/80 backdrop-blur-md border-b border-[#E3DCD1]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-3 relative z-10 group">
              <NexaLogo className="w-12 h-12" />
              <div>
                <p className="text-xl font-black text-[#3A2A20] tracking-tight leading-none uppercase">NEXAFLOW</p>
                <p className="text-[10px] font-bold text-[#7A6A5F] tracking-[0.2em] uppercase mt-0.5">SAAS RESTAURANT</p>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-2 relative z-10">
              <button onClick={() => scrollTo('fitur')} className="px-4 py-2 text-sm font-bold text-[#7A6A5F] hover:text-[#3A2A20] transition-colors">Fitur</button>
              <button onClick={() => scrollTo('tampilan')} className="px-4 py-2 text-sm font-bold text-[#7A6A5F] hover:text-[#3A2A20] transition-colors">Pratinjau</button>
              <button onClick={() => scrollTo('harga')} className="px-4 py-2 text-sm font-bold text-[#7A6A5F] hover:text-[#3A2A20] transition-colors">Harga</button>
              <button onClick={() => scrollTo('faq')} className="px-4 py-2 text-sm font-bold text-[#7A6A5F] hover:text-[#3A2A20] transition-colors">FAQ</button>
            </nav>
            <div className="flex items-center gap-3 relative z-10">
              <Link href="/login" className="hidden sm:inline-flex px-5 py-2.5 text-sm font-bold text-[#7A6A5F] hover:text-[#3A2A20] transition-colors">Masuk</Link>
              <Link href="/login" className="hidden sm:inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#3A2A20] text-[#F4EFE9] text-sm font-bold shadow-lg shadow-[#3A2A20]/20 hover:shadow-[#3A2A20]/40 hover:-translate-y-0.5 transition-all">Coba Gratis <Icons.ArrowRight /></Link>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-[#3A2A20] rounded-lg hover:bg-[#E3DCD1]">{mobileOpen ? <Icons.X /> : <Icons.Menu />}</button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="fixed inset-x-0 top-20 bg-[#F4EFE9] border-b border-[#E3DCD1] p-6 z-40 md:hidden shadow-xl space-y-3">
          <button onClick={() => scrollTo('fitur')} className="block w-full text-left py-2 text-base font-bold text-[#7A6A5F]">Fitur</button>
          <button onClick={() => scrollTo('tampilan')} className="block w-full text-left py-2 text-base font-bold text-[#7A6A5F]">Pratinjau</button>
          <button onClick={() => scrollTo('harga')} className="block w-full text-left py-2 text-base font-bold text-[#7A6A5F]">Harga</button>
          <button onClick={() => scrollTo('faq')} className="block w-full text-left py-2 text-base font-bold text-[#7A6A5F]">FAQ</button>
          <div className="pt-4 border-t border-[#E3DCD1] flex flex-col gap-3">
            <Link href="/login" className="w-full py-3 text-center text-sm font-bold text-[#3A2A20] bg-white rounded-xl border border-[#E3DCD1]">Masuk</Link>
            <Link href="/login" className="w-full py-3 text-center text-sm font-bold text-[#F4EFE9] bg-[#3A2A20] rounded-xl shadow-md">Coba Gratis</Link>
          </div>
        </div>
      )}

      <section className="relative pt-32 sm:pt-40 pb-24 px-6 lg:px-8 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E3DCD1]/50 border border-[#D3C8BB] text-[#3A2A20] text-[10px] font-black tracking-[0.15em] uppercase mb-8 shadow-sm backdrop-blur-sm"><Icons.Sparkles />Langkah Baru Bisnis Anda</div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-[#3A2A20] leading-[1.05] tracking-tight">Ubah Cara Caffe<br /><span className="text-[#8C7A6B]">Bekerja Hari Ini.</span></h1>
              <p className="mt-6 text-lg text-[#7A6A5F] leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">Bergabunglah dengan ekosistem digital yang membantu Anda mengelola pesanan lebih cerdas, meningkatkan pendapatan, dan memberikan pengalaman terbaik bagi pelanggan.</p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/login" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[#3A2A20] text-[#F4EFE9] font-black text-base shadow-xl shadow-[#3A2A20]/20 hover:shadow-[#3A2A20]/40 hover:-translate-y-0.5 transition-all">Mulai Gratis 7 Hari <Icons.ArrowRight /></Link>
                <button onClick={() => scrollTo('tampilan')} className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-[#D3C8BB] text-[#3A2A20] font-bold text-base hover:bg-white shadow-sm hover:shadow-md transition-all">Lihat Pratinjau</button>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute -inset-4 bg-[#3A2A20]/5 rounded-[2rem] blur-xl"></div>
              <div className="relative rounded-3xl overflow-hidden border border-[#D3C8BB] bg-white shadow-2xl">
                <div className="bg-[#F4EFE9] px-5 py-4 flex items-center gap-2 border-b border-[#E3DCD1]"><div className="w-3 h-3 rounded-full bg-[#D3C8BB]"></div><div className="w-3 h-3 rounded-full bg-[#D3C8BB]"></div><div className="w-3 h-3 rounded-full bg-[#D3C8BB]"></div><div className="ml-4 flex-1 bg-white border border-[#E3DCD1] rounded-lg px-4 py-1.5 text-xs text-[#8C7A6B] font-mono">nexaflow.app/dashboard</div></div>
                <div className="p-6 space-y-5">
                  <div className="flex items-center justify-between"><div><p className="text-[10px] font-bold text-[#8C7A6B] uppercase tracking-widest mb-1">Dashboard Kasir</p><p className="text-xl font-black text-[#3A2A20]">Caffe Premium</p></div><div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div><span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Online</span></div></div>
                  <div className="grid grid-cols-3 gap-3"><div className="bg-[#F4EFE9] rounded-xl p-4 border border-[#E3DCD1]"><p className="text-[10px] font-bold text-[#8C7A6B] uppercase mb-1">Pesanan</p><p className="text-2xl font-black text-[#3A2A20]">24</p></div><div className="bg-[#F4EFE9] rounded-xl p-4 border border-[#E3DCD1]"><p className="text-[10px] font-bold text-[#8C7A6B] uppercase mb-1">Dimasak</p><p className="text-2xl font-black text-[#3A2A20]">7</p></div><div className="bg-[#3A2A20] rounded-xl p-4 shadow-md"><p className="text-[10px] font-bold text-[#D3C8BB] uppercase mb-1">Omset</p><p className="text-xl font-black text-white">2.4jt</p></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="tampilan" className="px-6 lg:px-8 py-24 relative z-10 bg-white/40 border-y border-[#E3DCD1] backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16"><h2 className="text-4xl sm:text-5xl font-black text-[#3A2A20] tracking-tight leading-tight mb-4">Desain Presisi untuk <span className="text-[#8C7A6B]">Setiap Peran</span></h2><p className="text-[#7A6A5F] text-lg font-medium">Antarmuka yang bersih, cepat, dan sangat mudah digunakan oleh siapa saja.</p></div>
          <div className="space-y-20">
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E3DCD1] text-[#3A2A20] text-[10px] font-black uppercase tracking-widest mb-5">Pelanggan</div>
                <h3 className="text-3xl font-black text-[#3A2A20] mb-4">Pengalaman Pesan Mandiri (Self-Order)</h3><p className="text-[#7A6A5F] text-lg leading-relaxed mb-6 font-medium">Pelanggan hanya perlu memindai QR Code di meja. Tampilan mobile-first memudahkan mereka memilih menu, menambahkan catatan, dan melihat total pembayaran secara transparan.</p>
                <ul className="space-y-3">{['Keranjang melayang (Sticky Cart)', 'Perhitungan PPN otomatis', 'Konfirmasi pesanan 1 klik'].map((item, i) => (<li key={i} className="flex items-center gap-3 text-sm font-bold text-[#3A2A20]"><span className="text-emerald-600"><Icons.Check/></span> {item}</li>))}</ul>
              </div>
              <div className="order-1 md:order-2 flex justify-center">
                <div className="w-[300px] h-[600px] bg-white rounded-[3rem] border-[8px] border-[#3A2A20] shadow-2xl overflow-hidden relative"><div className="absolute top-0 w-full h-7 bg-[#3A2A20] rounded-b-3xl flex justify-center items-end pb-1"><div className="w-16 h-1 bg-white/30 rounded-full"></div></div><div className="p-5 pt-10 h-full flex flex-col"><div className="flex justify-between items-center mb-6"><div><p className="text-[10px] font-bold text-[#8C7A6B] uppercase">Meja 04</p><h4 className="text-xl font-black text-[#3A2A20]">Caffe Premium</h4></div><div className="w-8 h-8 rounded-full bg-[#F4EFE9] border border-[#E3DCD1] flex items-center justify-center"><Icons.Menu/></div></div><div className="flex-1 space-y-4"><div className="flex gap-3 bg-white border border-[#E3DCD1] rounded-xl p-3 shadow-sm"><div className="w-14 h-14 rounded-lg bg-[#F4EFE9] border border-[#E3DCD1] flex-shrink-0"></div><div><p className="font-bold text-sm text-[#3A2A20]">Es Kopi Susu</p><p className="text-[10px] text-[#8C7A6B]">Kopi</p><p className="font-black text-[#3A2A20] mt-1">Rp 22.000</p></div></div><div className="flex gap-3 bg-white border border-[#E3DCD1] rounded-xl p-3 shadow-sm"><div className="w-14 h-14 rounded-lg bg-[#F4EFE9] border border-[#E3DCD1] flex-shrink-0"></div><div><p className="font-bold text-sm text-[#3A2A20]">Croissant Butter</p><p className="text-[10px] text-[#8C7A6B]">Cemilan</p><p className="font-black text-[#3A2A20] mt-1">Rp 18.000</p></div></div></div><div className="bg-[#3A2A20] rounded-2xl p-4 text-white mt-4 shadow-lg"><div className="flex justify-between items-center mb-2"><span className="text-xs font-bold text-[#D3C8BB]">2 Item</span><span className="text-sm font-black">Rp 40.000</span></div><div className="bg-white/10 text-center py-2.5 rounded-xl text-xs font-bold">Pesan Sekarang</div></div></div></div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="flex justify-center"><div className="w-full max-w-lg bg-[#1A1A1A] rounded-2xl border border-[#333] shadow-2xl overflow-hidden"><div className="bg-[#222] px-4 py-3 border-b border-[#333] flex justify-between items-center"><div className="flex items-center gap-2"><Icons.Chef className="text-white"/><span className="text-white font-bold text-sm">Kitchen Display (KDS)</span></div><span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">Live</span></div><div className="p-4 grid grid-cols-2 gap-4"><div className="bg-[#2A2A2A] rounded-xl p-4 border-l-4 border-amber-500"><div className="flex justify-between items-start mb-2"><span className="text-white font-black text-lg">Meja 04</span><span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded">DIMASAK</span></div><p className="text-xs text-gray-400 mb-3">Budi · 10:45</p><ul className="space-y-2 text-sm text-white font-medium"><li className="flex justify-between"><span>1x Es Kopi Susu</span></li><li className="flex justify-between"><span>1x Croissant</span></li></ul></div><div className="bg-[#2A2A2A] rounded-xl p-4 border-l-4 border-emerald-500 opacity-60"><div className="flex justify-between items-start mb-2"><span className="text-white font-black text-lg">Meja 09</span><span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">SIAP</span></div><p className="text-xs text-gray-400 mb-3">Sinta · 10:50</p><ul className="space-y-2 text-sm text-gray-300 font-medium line-through"><li className="flex justify-between"><span>2x Matcha Latte</span></li></ul></div></div></div></div>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E3DCD1] text-[#3A2A20] text-[10px] font-black uppercase tracking-widest mb-5">Koki / Dapur</div><h3 className="text-3xl font-black text-[#3A2A20] mb-4">Layar Dapur Real-Time (KDS)</h3><p className="text-[#7A6A5F] text-lg leading-relaxed mb-6 font-medium">Hilangkan kebisingan suara teriakan pesanan atau kertas struk yang hilang. Koki melihat daftar pesanan masuk langsung di layar TV atau Tablet.</p>
                <ul className="space-y-3">{['Tema Gelap (Dark Mode) nyaman untuk mata', 'Notifikasi suara otomatis saat order masuk', 'Tombol Undo jika salah klik'].map((item, i) => (<li key={i} className="flex items-center gap-3 text-sm font-bold text-[#3A2A20]"><span className="text-emerald-600"><Icons.Check/></span> {item}</li>))}</ul>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E3DCD1] text-[#3A2A20] text-[10px] font-black uppercase tracking-widest mb-5">Pemilik / Manajer</div>
                <h3 className="text-3xl font-black text-[#3A2A20] mb-4">Laporan Penjualan yang Akurat</h3>
                <p className="text-[#7A6A5F] text-lg leading-relaxed mb-6 font-medium">Tidak perlu lagi menghitung manual di buku. Sistem mencatat setiap transaksi, menghitung omset, dan menemukan menu terlaris Anda secara otomatis.</p>
                <ul className="space-y-3">
                  {['Filter laporan harian, bulanan, & custom', 'Grafik omset 7 hari terakhir', 'Ekspor ke CSV (Excel) sekali klik'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-bold text-[#3A2A20]"><span className="text-emerald-600"><Icons.Check/></span> {item}</li>
                  ))}
                </ul>
              </div>
              <div className="order-1 md:order-2 flex justify-center">
                <div className="w-full max-w-lg bg-white rounded-2xl border border-[#E3DCD1] shadow-2xl overflow-hidden">
                  <div className="bg-[#F4EFE9] px-4 py-3 border-b border-[#E3DCD1] flex items-center justify-between">
                    <div className="flex items-center gap-2"><Icons.Chart className="text-[#3A2A20]"/><span className="text-[#3A2A20] font-bold text-sm">Laporan Penjualan</span></div>
                    <span className="text-[10px] font-bold text-[#8C7A6B] bg-white border border-[#E3DCD1] px-2 py-1 rounded">Bulan Ini</span>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-[#F4EFE9] rounded-xl p-4 border border-[#E3DCD1]"><p className="text-[10px] font-bold text-[#8C7A6B] uppercase mb-1">Total Omset</p><p className="text-xl font-black text-[#3A2A20]">Rp 12.450.000</p></div>
                      <div className="bg-[#3A2A20] rounded-xl p-4 shadow-md"><p className="text-[10px] font-bold text-[#D3C8BB] uppercase mb-1">Total Pesanan</p><p className="text-xl font-black text-white">342</p></div>
                    </div>
                    <div className="bg-[#F4EFE9] rounded-xl p-4 border border-[#E3DCD1]">
                      <p className="text-[10px] font-bold text-[#8C7A6B] uppercase mb-3">Grafik 7 Hari Terakhir</p>
                      <div className="flex items-end gap-2 h-20">{[40, 60, 30, 80, 50, 90, 70].map((h, i) => (<div key={i} className="flex-1 bg-gradient-to-t from-[#8C7A6B] to-[#D3C8BB] rounded-t-sm" style={{ height: `${h}%` }}></div>))}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section id="fitur" className="px-6 lg:px-8 py-24 sm:py-32 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16"><h2 className="text-4xl sm:text-5xl font-black text-[#3A2A20] tracking-tight leading-tight mb-4">Semua yang Caffe Anda Butuhkan,<br className="hidden sm:block" /><span className="text-[#8C7A6B]">dalam Satu Platform</span></h2><p className="text-[#7A6A5F] text-lg font-medium">Dirancang khusus untuk operasional yang cepat dan rapi.</p></div>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <div key={i} className="group relative rounded-3xl p-8 bg-white/80 backdrop-blur-sm border border-[#E3DCD1] shadow-sm hover:shadow-xl hover:border-[#D3C8BB] transition-all duration-300 hover:-translate-y-1"><div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#F4EFE9] border border-[#E3DCD1] mb-6 group-hover:scale-110 transition-transform text-[#3A2A20]"><f.Icon /></div><h3 className="text-xl font-black text-[#3A2A20] mb-3">{f.title}</h3><p className="text-sm text-[#7A6A5F] leading-relaxed font-medium">{f.desc}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 lg:px-8 py-24 relative bg-white/40 border-y border-[#E3DCD1] z-10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-[#3A2A20] tracking-tight leading-tight mb-4">Kenapa Harus <span className="text-[#8C7A6B]">NexaFlow?</span></h2>
            <p className="text-[#7A6A5F] text-lg font-medium">Bukan sekadar aplikasi kasir, ini adalah ekosistem untuk memajukan bisnis Anda.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUs.map((item, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-[#E3DCD1] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center group">
                <div className="w-16 h-16 mx-auto bg-[#F4EFE9] border border-[#D3C8BB] rounded-2xl flex items-center justify-center text-[#3A2A20] mb-6 group-hover:scale-110 group-hover:bg-[#3A2A20] group-hover:text-[#F4EFE9] transition-all"><item.Icon /></div>
                <h3 className="text-lg font-black text-[#3A2A20] mb-3">{item.title}</h3>
                <p className="text-sm text-[#7A6A5F] font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="cara-kerja" className="px-6 lg:px-8 py-24 sm:py-32 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16"><h2 className="text-4xl sm:text-5xl font-black text-[#3A2A20] tracking-tight leading-tight mb-4">Mulai Beroperasi dalam <span className="text-[#8C7A6B]">3 Langkah</span></h2></div>
          <div className="grid md:grid-cols-3 gap-6 relative">
            <div className="hidden md:block absolute top-20 left-10 right-10 h-0.5 bg-gradient-to-r from-transparent via-[#D3C8BB] to-transparent"></div>
            {steps.map((s, i) => (
              <div key={i} className="relative"><div className="relative bg-white/80 backdrop-blur-sm border border-[#E3DCD1] rounded-3xl p-8 hover:border-[#8C7A6B] shadow-sm hover:shadow-md transition-all text-center md:text-left"><div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#F4EFE9] border border-[#D3C8BB] text-[#3A2A20] font-black text-xl shadow-sm mb-6">{s.num}</div><h3 className="text-xl font-black text-[#3A2A20] mb-3">{s.title}</h3><p className="text-sm text-[#7A6A5F] leading-relaxed font-medium">{s.desc}</p></div></div>
            ))}
          </div>
        </div>
      </section>

      <section id="harga" className="px-6 lg:px-8 py-24 sm:py-32 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-[#3A2A20] tracking-tight leading-tight mb-4">Siap Membawa Caffe Anda <span className="text-[#8C7A6B]">ke Level Berikutnya?</span></h2>
            <p className="text-[#7A6A5F] text-lg font-medium">Dapatkan penawaran spesial dan konsultasi gratis dengan tim kami.</p>
          </div>
          <div className="relative max-w-md mx-auto">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-[#D3C8BB] to-[#8C7A6B] rounded-[2rem] blur-lg opacity-50"></div>
            <div className="relative rounded-[2rem] bg-white/90 backdrop-blur-md border border-[#3A2A20]/20 overflow-hidden shadow-2xl">
              <div className="p-10 sm:p-12 text-center">
                <p className="text-sm font-bold text-[#8C7A6B] uppercase tracking-widest mb-3">NexaFlow Pro</p>
                <div className="mb-8">
                  <p className="text-2xl font-black text-[#3A2A20]">Penawaran Spesial</p>
                  <p className="text-sm font-medium text-[#7A6A5F] mt-1">Khusus untuk caffe yang mendaftar bulan ini.</p>
                </div>
                <div className="space-y-4 mb-10 text-left">
                  {['Semua fitur tanpa batasan', 'Unlimited menu & meja', 'Order via QR & Bill QRIS otomatis', 'Kitchen Display System (KDS)', 'Laporan harian, bulanan & custom', 'Export CSV kapan saja', 'Support via WhatsApp'].map((f, i) => (
                    <div key={i} className="flex items-start gap-3"><span className="text-[#3A2A20] mt-0.5 shrink-0"><Icons.Check /></span><span className="text-sm font-bold text-[#7A6A5F]">{f}</span></div>
                  ))}
                </div>
                <button onClick={openWhatsApp} className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base shadow-xl shadow-emerald-600/20 hover:shadow-emerald-600/40 transition-all">
                  <Icons.WhatsApp /> Konsultasi via WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="px-6 lg:px-8 py-24 relative bg-white/40 border-t border-[#E3DCD1] z-10 backdrop-blur-md">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16"><h2 className="text-4xl sm:text-5xl font-black text-[#3A2A20] tracking-tight leading-tight mb-4">Pertanyaan yang <span className="text-[#8C7A6B]">Sering Diajukan</span></h2></div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#E3DCD1] overflow-hidden shadow-sm">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full px-6 py-5 text-left font-bold text-[#3A2A20] flex justify-between items-center gap-4 hover:bg-[#F4EFE9]/50 transition-colors">
                  <span>{faq.q}</span>
                  <span className={`transform transition-transform ${openFaq === i ? 'rotate-180' : ''}`}><Icons.ChevronDown /></span>
                </button>
                {openFaq === i && <div className="px-6 pb-5 text-sm text-[#7A6A5F] leading-relaxed font-medium">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[#3A2A20] text-[#F4EFE9] py-16 px-6 lg:px-8 relative z-10 border-t border-[#3A2A20]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <NexaLogo className="w-10 h-10" />
            <div>
              <p className="text-xl font-black tracking-tight leading-none uppercase">NEXAFLOW</p>
              <p className="text-[10px] font-bold text-[#D3C8BB] tracking-[0.2em] uppercase mt-0.5">SAAS RESTAURANT</p>
            </div>
          </div>
          <p className="text-sm text-[#D3C8BB] font-medium text-center">© {year} NexaFlow SaaS. Hak cipta dilindungi.</p>
          <div className="flex gap-6">
            <button onClick={openWhatsApp} className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"><Icons.WhatsApp /></button>
          </div>
        </div>
      </footer>

    </div>
  );
}