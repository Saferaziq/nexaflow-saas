'use client';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [cafeName, setCafeName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [mounted, setMounted] = useState(false);
  
  const canvasRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width, height;
    let particles = [];

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 1.2; 
        this.vy = (Math.random() - 0.5) * 1.2;
        this.radius = Math.random() * 2.5 + 1.5;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(93, 64, 55, 0.7)'; 
        ctx.fill();
      }
    }

    const particleCount = Math.floor(width / 12); 
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 160) {
            ctx.beginPath();
            const opacity = 1 - (distance / 160);
            ctx.strokeStyle = `rgba(93, 64, 55, ${opacity * 0.4})`;
            ctx.lineWidth = 1.2;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mounted]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Konfirmasi password tidak cocok.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password minimal 6 karakter.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { cafe_name: cafeName, role: 'owner' } }
      });
      if (error) throw error;

      setSuccessMsg('Pendaftaran berhasil! Mengarahkan ke login...');
      setTimeout(() => router.push('/login'), 3000);
    } catch (err) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#f5ebe0] flex flex-col lg:flex-row font-sans selection:bg-[#8d6e63]/30 selection:text-[#3e2723] overflow-hidden relative">
      
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      <div className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-between relative z-10 border-b lg:border-b-0 lg:border-r border-[#8d6e63]/20 text-center lg:text-left items-center lg:items-start">
        <div className="flex flex-col items-center lg:items-start flex-1 justify-center w-full max-w-lg">
          
          <div className="flex items-center gap-4 mb-10">
            <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#5d4037" />
                  <stop offset="100%" stopColor="#8d6e63" />
                </linearGradient>
              </defs>
              <path d="M20 80 V20 L50 60 V20 H70 V60 L50 80 L50 60 L35 40 V80 H20 Z" fill="url(#grad1)"/>
              <rect x="75" y="65" width="8" height="8" fill="#8d6e63" rx="2" />
              <rect x="85" y="75" width="6" height="6" fill="#8d6e63" opacity="0.6" rx="1"/>
            </svg>
            <div className="flex flex-col">
              <span className="text-3xl font-black tracking-[0.2em] text-[#3e2723] drop-shadow-sm leading-none">NEXAFLOW</span>
              <span className="text-[10px] font-bold text-[#8d6e63] tracking-widest uppercase mt-1">SaaS Restaurant</span>
            </div>
          </div>

          <div className="inline-block px-4 py-2 rounded-full bg-[#8d6e63]/10 border-2 border-[#8d6e63]/30 text-[#5d4037] text-xs font-extrabold tracking-widest uppercase mb-6">
            ✦ LANGKAH BARU BISNIS ANDA
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-black text-[#2d1a11] leading-[1.1] mb-6 tracking-tight">
            Ubah Cara Caffe<br/>
            <span className="text-[#8d6e63]">Bekerja Hari Ini.</span>
          </h1>
          
          <p className="text-lg text-[#4e342e] leading-relaxed font-semibold mb-10">
            Bergabunglah dengan ekosistem digital yang membantu Anda mengelola pesanan lebih cerdas, meningkatkan pendapatan, dan memberikan pengalaman terbaik bagi pelanggan.
          </p>
        </div>

        <div className="hidden lg:flex items-center gap-2 mt-10 text-sm font-extrabold text-[#6d4c41]">
          Powered by 
          <a href="https://wa.me/6281389744957" target="_blank" rel="noopener noreferrer" className="text-[#8d6e63] flex items-center gap-1.5 border-b-2 border-transparent hover:text-[#3e2723] hover:border-[#3e2723] transition-all pb-0.5">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            NexaFlow
          </a>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-20">
        <div className="w-full max-w-md bg-white/75 backdrop-blur-xl border-2 border-white/90 rounded-[2rem] p-8 sm:p-10 shadow-[0_25px_50px_-12px_rgba(109,76,65,0.2)] transition-transform duration-500 hover:-translate-y-2 hover:shadow-[0_35px_60px_-15px_rgba(109,76,65,0.25)]">
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-[#2d1a11] tracking-tight">Daftarkan Caffe</h2>
            <p className="text-sm font-bold text-[#4e342e] mt-2">Mulai transformasi digital bisnis Anda.</p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-100 border border-rose-300 text-rose-700 text-sm font-bold flex items-center gap-3">
              <span className="text-lg">⚠️</span> {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-[#8d6e63]/10 border border-[#8d6e63]/30 text-[#5d4037] text-sm font-bold flex items-center gap-3">
              <span className="text-lg">✅</span> {successMsg}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-[#4e342e] uppercase tracking-widest mb-2">Nama Caffe</label>
              <input 
                type="text" 
                required 
                value={cafeName}
                onChange={(e) => setCafeName(e.target.value)}
                placeholder="Contoh: Kopi Senja" 
                className="w-full bg-white border-2 border-[#d7ccc8] rounded-2xl px-5 py-3.5 text-base font-bold text-[#2d1a11] placeholder:text-[#a1887f] placeholder:font-medium focus:outline-none focus:border-[#6d4c41] focus:ring-4 focus:ring-[#6d4c41]/15 transition-all shadow-inner" 
              />
            </div>

            <div>
              <label className="block text-xs font-black text-[#4e342e] uppercase tracking-widest mb-2">Email Address</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@nexaflow.id" 
                className="w-full bg-white border-2 border-[#d7ccc8] rounded-2xl px-5 py-3.5 text-base font-bold text-[#2d1a11] placeholder:text-[#a1887f] placeholder:font-medium focus:outline-none focus:border-[#6d4c41] focus:ring-4 focus:ring-[#6d4c41]/15 transition-all shadow-inner" 
              />
            </div>

            <div>
              <label className="block text-xs font-black text-[#4e342e] uppercase tracking-widest mb-2">Password</label>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter" 
                className="w-full bg-white border-2 border-[#d7ccc8] rounded-2xl px-5 py-3.5 text-base font-bold text-[#2d1a11] placeholder:text-[#a1887f] placeholder:font-medium focus:outline-none focus:border-[#6d4c41] focus:ring-4 focus:ring-[#6d4c41]/15 transition-all shadow-inner" 
              />
            </div>

            <div>
              <label className="block text-xs font-black text-[#4e342e] uppercase tracking-widest mb-2">Konfirmasi Password</label>
              <input 
                type="password" 
                required 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi password" 
                className="w-full bg-white border-2 border-[#d7ccc8] rounded-2xl px-5 py-3.5 text-base font-bold text-[#2d1a11] placeholder:text-[#a1887f] placeholder:font-medium focus:outline-none focus:border-[#6d4c41] focus:ring-4 focus:ring-[#6d4c41]/15 transition-all shadow-inner" 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#5d4037] to-[#8d6e63] hover:from-[#8d6e63] hover:to-[#4e342e] text-white font-black py-4 rounded-2xl text-base tracking-wide shadow-[0_10px_20px_-10px_rgba(93,64,55,0.6)] hover:shadow-[0_15px_30px_-10px_rgba(93,64,55,0.8)] active:scale-[0.98] transition-all flex justify-center items-center mt-2"
            >
              {loading ? 'Memproses...' : 'MULAI SEKARANG'}
            </button>
          </form>

          <p className="text-center text-sm font-bold text-[#4e342e] mt-6">
            Sudah memiliki akun?{' '}
            <Link href="/login" className="text-[#5d4037] font-black hover:text-[#2d1a11] transition-colors">
              Masuk Dashboard
            </Link>
          </p>

          <div className="lg:hidden text-center mt-8 text-sm font-extrabold text-[#6d4c41]">
            Powered by <a href="https://wa.me/6281389744957" target="_blank" rel="noopener noreferrer" className="text-[#5d4037] border-b-2 border-[#5d4037]">NexaFlow</a>
          </div>
        </div>
      </div>
    </div>
  );
}