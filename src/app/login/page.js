'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LogoCanvas from '@/components/LogoCanvas';

const Icons = {
  ArrowRight: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Lock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Mail: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push('/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Email atau password salah. Silakan periksa kembali.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#0a192f] flex font-sans selection:bg-[#00a8cc]/30 selection:text-[#00a8cc] overflow-hidden relative">
      
      {/* ANIMASI BACKGROUND 3D GLOW */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#0d3b66] rounded-full blur-[150px] animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#00a8cc]/20 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* SISI KIRI - BRANDING & 3D LOGO */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-16 relative z-10 border-r border-white/5 bg-white/[0.01] backdrop-blur-sm">
        <div>
          <div className="flex items-center gap-4 mb-16">
            <LinkCanvasWrapper />
            <span className="text-2xl font-black text-white tracking-widest">NEXAFLOW</span>
          </div>
          
          <div className="space-y-6 max-w-lg">
            <div className="inline-block px-4 py-1.5 rounded-full bg-[#00a8cc]/10 border border-[#00a8cc]/20 text-[#00a8cc] text-xs font-bold tracking-widest uppercase mb-4 backdrop-blur-md">
              ✦ Pusat Kendali Bisnis
            </div>
            <h1 className="text-4xl lg:text-6xl font-black text-white leading-tight">
              Skala Bisnis <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00a8cc] to-[#0d3b66]">Tanpa Batas.</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed font-medium">
              Kelola operasional kafe Anda dengan presisi. Pantau omzet, atur meja, dan berikan pelayanan bintang lima dengan teknologi masa kini.
            </p>
          </div>
        </div>

        <div className="text-slate-600 text-xs font-bold tracking-widest uppercase">
          &copy; {new Date().getFullYear()} NexaFlow SaaS.
        </div>
      </div>

      {/* SISI KANAN - FORM LOGIN 3D */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative z-10 perspective-1000">
        <div className="w-full max-w-md transform transition-transform duration-500 hover:rotate-y-2 hover:-translate-y-2">
          
          <div className="bg-[#0a192f]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,168,204,0.15)] relative overflow-hidden group">
            
            {/* Efek Kilau Kaca 3D */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-white tracking-tight">Selamat Datang</h2>
              <p className="text-sm font-medium text-slate-400 mt-2">Masuk untuk melanjutkan ke dashboard.</p>
            </div>

            {errorMsg && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-bold flex items-center gap-3">
                <span className="text-lg">⚠️</span> {errorMsg}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#00a8cc] uppercase tracking-widest">Email Address</label>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within/input:text-[#00a8cc] transition-colors">
                    <Icons.Mail />
                  </div>
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@kafeanda.com" 
                    className="w-full bg-[#0d3b66]/30 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-medium text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00a8cc]/50 focus:ring-4 focus:ring-[#00a8cc]/10 transition-all" 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-[#00a8cc] uppercase tracking-widest">Password</label>
                </div>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within/input:text-[#00a8cc] transition-colors">
                    <Icons.Lock />
                  </div>
                  <input 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full bg-[#0d3b66]/30 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-medium text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00a8cc]/50 focus:ring-4 focus:ring-[#00a8cc]/10 transition-all" 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#006699] to-[#00a8cc] hover:from-[#00a8cc] hover:to-[#0d3b66] text-white font-black py-4 rounded-2xl text-sm shadow-[0_0_20px_rgba(0,168,204,0.3)] hover:shadow-[0_0_30px_rgba(0,168,204,0.6)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
              >
                {loading ? 'Memverifikasi...' : <>Masuk Sekarang <Icons.ArrowRight /></>}
              </button>
            </form>

            <p className="text-center text-sm font-medium text-slate-500 mt-8">
              Belum punya akun?{' '}
              <Link href="/register" className="text-[#00a8cc] font-bold hover:text-white transition-colors">
                Daftar Kafe Anda
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrapper kecil agar logo menyesuaikan ukuran sidebar
function LinkCanvasWrapper() {
  return (
    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center p-2">
      <LogoCanvas width={200} height={112} className="w-[150%] h-[150%] object-contain -ml-5 -mt-2" />
    </div>
  );
}