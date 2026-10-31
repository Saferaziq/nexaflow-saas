'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const LOGO_URL = 'https://nbthyktmfnppruovxots.supabase.co/storage/v1/object/public/public-assets/Gemini_Generated_Image_kv5nevkv5nevkv5n%20(1).jpg';
const WA_OWNER = '6281389744957';

export default function LandingPage() {
  const router = useRouter();
  const canvasRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  // Canvas Network Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = [];
    const particleCount = 60;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(58, 42, 32, ${0.15 * (1 - dist / 140)})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(58, 42, 32, 0.35)';
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });

      animationFrameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goTo = (path) => {
    setMobileMenu(false);
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-[#F4EFE9] text-[#3A2A20] relative overflow-x-hidden">
      {/* Canvas Background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
        style={{ opacity: 0.6 }}
      />

      {/* NAVBAR */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[999] transition-all duration-300 ${
          scrolled
            ? 'bg-[#F4EFE9]/95 backdrop-blur-md shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <button
              onClick={() => goTo('/')}
              className="flex items-center gap-3 relative z-[999]"
            >
              <img
                src={LOGO_URL}
                alt="NexaFlow Logo"
                className="w-20 h-20 object-contain mix-blend-multiply"
              />
              <span className="hidden sm:block text-xl font-bold tracking-tight">
                NexaFlow
              </span>
            </button>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8 relative z-[999]">
              <button
                onClick={() => goTo('#fitur')}
                className="text-sm font-medium hover:text-[#8B6F5C] transition-colors"
              >
                Fitur
              </button>
              <button
                onClick={() => goTo('#harga')}
                className="text-sm font-medium hover:text-[#8B6F5C] transition-colors"
              >
                Harga
              </button>
              <button
                onClick={() => goTo('#kontak')}
                className="text-sm font-medium hover:text-[#8B6F5C] transition-colors"
              >
                Kontak
              </button>
              <button
                onClick={() => goTo('/login')}
                className="px-5 py-2.5 text-sm font-semibold border-2 border-[#3A2A20] rounded-full hover:bg-[#3A2A20] hover:text-[#F4EFE9] transition-all"
              >
                Masuk
              </button>
              <button
                onClick={() => goTo('/register')}
                className="px-5 py-2.5 text-sm font-semibold bg-[#3A2A20] text-[#F4EFE9] rounded-full hover:bg-[#5A4232] transition-all shadow-lg"
              >
                Coba Gratis
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="md:hidden relative z-[999] p-2"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenu ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenu && (
          <div className="md:hidden bg-[#F4EFE9] border-t border-[#3A2A20]/10 relative z-[999]">
            <div className="px-4 py-4 space-y-3">
              <button
                onClick={() => goTo('#fitur')}
                className="block w-full text-left py-2 text-sm font-medium"
              >
                Fitur
              </button>
              <button
                onClick={() => goTo('#harga')}
                className="block w-full text-left py-2 text-sm font-medium"
              >
                Harga
              </button>
              <button
                onClick={() => goTo('#kontak')}
                className="block w-full text-left py-2 text-sm font-medium"
              >
                Kontak
              </button>
              <button
                onClick={() => goTo('/login')}
                className="block w-full py-2.5 text-sm font-semibold border-2 border-[#3A2A20] rounded-full"
              >
                Masuk
              </button>
              <button
                onClick={() => goTo('/register')}
                className="block w-full py-2.5 text-sm font-semibold bg-[#3A2A20] text-[#F4EFE9] rounded-full"
              >
                Coba Gratis
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-40 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-[#3A2A20]/5 border border-[#3A2A20]/10 rounded-full">
            <span className="text-xs sm:text-sm font-semibold">
              🚀 Sistem Restoran Multi-Tenant #1 di Indonesia
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-6">
            Kelola Restoran Anda
            <br />
            <span className="text-[#8B6F5C]">Lebih Cerdas & Cepat</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#3A2A20]/70 mb-10 leading-relaxed">
            NexaFlow adalah platform all-in-one untuk manajemen restoran modern.
            Kelola pesanan, dapur, meja, dan pembayaran dalam satu dashboard yang
            elegan.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => goTo('/register')}
              className="w-full sm:w-auto px-8 py-4 bg-[#3A2A20] text-[#F4EFE9] text-base font-semibold rounded-full hover:bg-[#5A4232] transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5"
            >
              Mulai Uji Coba Gratis →
            </button>
            <a
              href={`https://wa.me/${WA_OWNER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-[#3A2A20] text-[#3A2A20] text-base font-semibold rounded-full hover:bg-[#3A2A20] hover:text-[#F4EFE9] transition-all text-center"
            >
              💬 Hubungi via WhatsApp
            </a>
          </div>

          {/* Dashboard Preview */}
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-t from-[#F4EFE9] via-transparent to-transparent z-10 pointer-events-none" />
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-[#3A2A20]/10 p-2 sm:p-4">
              <div className="bg-[#3A2A20] rounded-xl overflow-hidden">
                {/* Fake browser bar */}
                <div className="flex items-center gap-2 px-4 py-3 bg-[#2A1E16]">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <div className="ml-4 flex-1 bg-[#3A2A20] rounded-md px-3 py-1 text-xs text-[#F4EFE9]/50">
                    app.nexaflow.id/dashboard
                  </div>
                </div>
                {/* Fake dashboard content */}
                <div className="p-6 sm:p-8 bg-gradient-to-br from-[#F4EFE9] to-[#E8DFD3]">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
                    {[
                      { label: 'Pesanan', value: '24' },
                      { label: 'Pendapatan', value: 'Rp 2.4jt' },
                      { label: 'Meja Aktif', value: '8' },
                      { label: 'Menu', value: '42' },
                    ].map((stat, i) => (
                      <div
                        key={i}
                        className="bg-white rounded-lg p-3 sm:p-4 shadow-sm"
                      >
                        <div className="text-xs text-[#3A2A20]/60 mb-1">
                          {stat.label}
                        </div>
                        <div className="text-base sm:text-xl font-bold text-[#3A2A20]">
                          {stat.value}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                    <div className="text-sm font-semibold text-[#3A2A20] mb-4">
                      Pesanan Terbaru
                    </div>
                    <div className="space-y-2">
                      {[
                        { table: 'Meja 03', items: 'Nasi Goreng, Es Teh', status: 'Diproses' },
                        { table: 'Meja 07', items: 'Mie Ayam, Kopi', status: 'Siap' },
                        { table: 'Meja 01', items: 'Sate Ayam, Jus', status: 'Diproses' },
                      ].map((order, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between py-2 border-b border-[#3A2A20]/5 last:border-0"
                        >
                          <div>
                            <div className="text-xs sm:text-sm font-semibold text-[#3A2A20]">
                              {order.table}
                            </div>
                            <div className="text-xs text-[#3A2A20]/60">
                              {order.items}
                            </div>
                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              order.status === 'Siap'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FITUR SECTION */}
      <section id="fitur" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Semua yang Anda Butuhkan
            </h2>
            <p className="text-base sm:text-lg text-[#3A2A20]/70 max-w-2xl mx-auto">
              Fitur lengkap untuk mengelola restoran modern dari dapur hingga kasir.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '📊',
                title: 'Dashboard Kasir',
                desc: 'Kelola pesanan realtime dengan tampilan light/dark mode yang nyaman.',
              },
              {
                icon: '👨‍🍳',
                title: 'Kitchen Display',
                desc: 'Sistem dapur dengan login PIN, wake lock, dan undo untuk efisiensi maksimal.',
              },
              {
                icon: '💳',
                title: 'QRIS & Cetak Bill',
                desc: 'Pembayaran QRIS terintegrasi dan cetak bill langsung dari dashboard.',
              },
              {
                icon: '🪑',
                title: 'Manajemen Meja',
                desc: 'Kelola meja, status pesanan, dan customer name dengan mudah.',
              },
              {
                icon: '🔔',
                title: 'Notifikasi Suara',
                desc: 'Notifikasi suara otomatis saat ada pesanan baru masuk.',
              },
              {
                icon: '🛡️',
                title: 'Multi-Tenant',
                desc: 'Satu platform, banyak restoran. Setiap tenant terisolasi dengan aman.',
              },
            ].map((fitur, i) => (
              <div
                key={i}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-[#3A2A20]/10 hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="text-4xl mb-4">{fitur.icon}</div>
                <h3 className="text-lg font-bold mb-2">{fitur.title}</h3>
                <p className="text-sm text-[#3A2A20]/70 leading-relaxed">
                  {fitur.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HARGA SECTION */}
      <section id="harga" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Harga Sederhana & Transparan
            </h2>
            <p className="text-base sm:text-lg text-[#3A2A20]/70 max-w-2xl mx-auto">
              Pilih paket yang sesuai dengan kebutuhan restoran Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: 'Starter',
                price: 'Gratis',
                period: '14 hari trial',
                features: [
                  '1 Restoran',
                  'Dashboard Kasir',
                  'Kitchen Display',
                  'Manajemen Menu',
                  'Support Email',
                ],
                highlight: false,
              },
              {
                name: 'Pro',
                price: 'Rp 299rb',
                period: '/bulan',
                features: [
                  '3 Restoran',
                  'Semua fitur Starter',
                  'QRIS & Cetak Bill',
                  'Notifikasi Suara',
                  'Laporan Penjualan',
                  'Support Prioritas',
                ],
                highlight: true,
              },
              {
                name: 'Enterprise',
                price: 'Hubungi Kami',
                period: 'custom',
                features: [
                  'Restoran Unlimited',
                  'Semua fitur Pro',
                  'White-label',
                  'API Access',
                  'Dedicated Support',
                  'Custom Integrasi',
                ],
                highlight: false,
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`relative rounded-2xl p-6 sm:p-8 ${
                  plan.highlight
                    ? 'bg-[#3A2A20] text-[#F4EFE9] shadow-2xl transform md:scale-105'
                    : 'bg-white/70 backdrop-blur-sm border border-[#3A2A20]/10'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#8B6F5C] text-[#F4EFE9] text-xs font-bold rounded-full">
                    PALING POPULER
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-3xl sm:text-4xl font-bold">{plan.price}</span>
                  <span
                    className={`text-sm ml-1 ${
                      plan.highlight ? 'text-[#F4EFE9]/60' : 'text-[#3A2A20]/60'
                    }`}
                  >
                    {plan.period}
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <span className="text-green-500 font-bold">✓</span>
                      <span
                        className={
                          plan.highlight ? 'text-[#F4EFE9]/80' : 'text-[#3A2A20]/70'
                        }
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() =>
                    plan.name === 'Enterprise'
                      ? window.open(`https://wa.me/${WA_OWNER}`, '_blank')
                      : goTo('/register')
                  }
                  className={`w-full py-3 rounded-full font-semibold transition-all ${
                    plan.highlight
                      ? 'bg-[#F4EFE9] text-[#3A2A20] hover:bg-[#E8DFD3]'
                      : 'bg-[#3A2A20] text-[#F4EFE9] hover:bg-[#5A4232]'
                  }`}
                >
                  {plan.name === 'Enterprise' ? 'Hubungi Kami' : 'Mulai Sekarang'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KONTAK / CTA SECTION */}
      <section id="kontak" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#3A2A20] rounded-3xl p-8 sm:p-12 text-center text-[#F4EFE9] shadow-2xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Siap Modernisasi Restoran Anda?
            </h2>
            <p className="text-base sm:text-lg text-[#F4EFE9]/70 mb-8 max-w-2xl mx-auto">
              Bergabunglah dengan ratusan restoran yang sudah beralih ke NexaFlow.
              Coba gratis 14 hari, tanpa kartu kredit.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => goTo('/register')}
                className="w-full sm:w-auto px-8 py-4 bg-[#F4EFE9] text-[#3A2A20] font-semibold rounded-full hover:bg-[#E8DFD3] transition-all shadow-lg"
              >
                Mulai Uji Coba Gratis →
              </button>
              <a
                href={`https://wa.me/${WA_OWNER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-[#F4EFE9] text-[#F4EFE9] font-semibold rounded-full hover:bg-[#F4EFE9] hover:text-[#3A2A20] transition-all text-center"
              >
                💬 Chat WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-[#3A2A20]/10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={LOGO_URL}
                  alt="NexaFlow Logo"
                  className="w-16 h-16 object-contain mix-blend-multiply"
                />
                <span className="text-lg font-bold">NexaFlow</span>
              </div>
              <p className="text-sm text-[#3A2A20]/70 leading-relaxed">
                Platform manajemen restoran multi-tenant modern untuk bisnis kuliner
                Indonesia.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-sm">Produk</h4>
              <ul className="space-y-2 text-sm text-[#3A2A20]/70">
                <li>
                  <button
                    onClick={() => goTo('#fitur')}
                    className="hover:text-[#3A2A20] transition-colors"
                  >
                    Fitur
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => goTo('#harga')}
                    className="hover:text-[#3A2A20] transition-colors"
                  >
                    Harga
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => goTo('/login')}
                    className="hover:text-[#3A2A20] transition-colors"
                  >
                    Masuk
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-sm">Perusahaan</h4>
              <ul className="space-y-2 text-sm text-[#3A2A20]/70">
                <li>
                  <button
                    onClick={() => goTo('#kontak')}
                    className="hover:text-[#3A2A20] transition-colors"
                  >
                    Kontak
                  </button>
                </li>
                <li>
                  <a
                    href={`mailto:dinamis.id.shop@gmail.com`}
                    className="hover:text-[#3A2A20] transition-colors"
                  >
                    Email
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-sm">Hubungi Kami</h4>
              <ul className="space-y-2 text-sm text-[#3A2A20]/70">
                <li>
                  <a
                    href={`https://wa.me/${WA_OWNER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#3A2A20] transition-colors"
                  >
                    💬 WhatsApp
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:dinamis.id.shop@gmail.com"
                    className="hover:text-[#3A2A20] transition-colors"
                  >
                    ✉️ dinamis.id.shop@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[#3A2A20]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#3A2A20]/60">
              © {new Date().getFullYear()} NexaFlow. All rights reserved.
            </p>
            <p className="text-xs text-[#3A2A20]/60">
              Made with ❤️ in Indonesia
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}