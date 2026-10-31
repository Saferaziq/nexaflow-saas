'use client';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Logo NexaFlow baru
const NexaLogo = ({ className = "w-10 h-10" }) => (
  <img src="/logo.jpg" alt="NexaFlow Logo" className={`${className} object-contain rounded-xl shadow-md`} />
);

const Icons = {
  Sparkles: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>,
  ArrowRight: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();
  const canvasRef = useRef(null);

  // Animasi Canvas Network Background (Tema sama seperti Landing Page)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    const particleCount = 50;
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
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1
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
        ctx.fillStyle = 'rgba(160, 140, 120, 0.5)';
        ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          let p2 = particles[j];
          let dx = p.x - p2.x; let dy = p.y - p2.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < maxDistance) {
            let opacity = 1 - (distance / maxDistance);
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(160, 140, 120, ${opacity * 0.3})`;
            ctx.lineWidth = 1; ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animationFrameId); };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (email === 'dinamis.id.shop@gmail.com') router.push('/admin');
      else router.push('/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Gagal masuk, periksa kembali email dan password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4EFE9] text-[#3A2A20] font-sans flex items-center justify-center p-6 relative overflow-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none"></canvas>

      <div className="relative z-10 max-w-5xl w-full grid lg:grid-cols-2 gap-12 items-center bg-white/80 backdrop-blur-md border border-[#E3DCD1] rounded-[2.5rem] shadow-2xl p-8 sm:p-12">
        
        {/* Sisi Kiri: Branding & Informasi */}
        <div className="space-y-6 text-center lg:text-left">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <NexaLogo className="w-12 h-12" />
            <div>
              <p className="text-xl font-black text-[#3A2A20] tracking-tight leading-none uppercase">NEXAFLOW</p>
              <p className="text-[10px] font-bold text-[#7A6A5F] tracking-[0.2em] uppercase mt-0.5">SAAS RESTAURANT</p>
            </div>
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E3DCD1]/50 border border-[#D3C8BB] text-[#3A2A20] text-[10px] font-black tracking-widest uppercase">
            <Icons.Sparkles /> Akses Kasir & Dapur
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-[#3A2A20] tracking-tight leading-tight">Kelola Caffe <br /><span className="text-[#8C7A6B]">Lebih Mudah.</span></h1>
          <p className="text-[#7A6A5F] font-medium text-base">Masuk ke dashboard kasir untuk memantau pesanan real-time, cetak QRIS dinamis, dan kelola menu caffe Anda.</p>
        </div>

        {/* Sisi Kanan: Form Login */}
        <div className="bg-white rounded-3xl border border-[#E3DCD1] p-8 shadow-lg">
          <h2 className="text-2xl font-black text-[#3A2A20] mb-2">Masuk Kasir</h2>
          <p className="text-sm text-[#7A6A5F] font-medium mb-6">Silakan masukkan kredensial akun Anda.</p>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-bold text-center">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#3A2A20] uppercase tracking-wider mb-2">Email Address</label>
              <input 
                type="email" 
                required
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@kafe.com"
                className="w-full px-4 py-3.5 bg-[#F4EFE9]/50 border border-[#E3DCD1] rounded-xl text-[#3A2A20] placeholder-[#8C7A6B]/50 focus:outline-none focus:border-[#3A2A20] text-sm font-medium transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3A2A20] uppercase tracking-wider mb-2">Password</label>
              <input 
                type="password" 
                required
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3.5 bg-[#F4EFE9]/50 border border-[#E3DCD1] rounded-xl text-[#3A2A20] placeholder-[#8C7A6B]/50 focus:outline-none focus:border-[#3A2A20] text-sm font-medium transition"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-[#3A2A20] hover:bg-[#2A1F17] text-[#F4EFE9] font-black rounded-xl shadow-xl shadow-[#3A2A20]/20 transition duration-200 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Memproses...' : <>Masuk Dashboard <Icons.ArrowRight /></>}
            </button>
          </form>

          <div className="mt-8 text-center text-xs font-medium text-[#7A6A5F]">
            Belum punya akun caffe? <Link href="/register" className="text-[#3A2A20] font-black hover:underline">Daftar di sini</Link>
          </div>
        </div>

      </div>
    </div>
  );
}