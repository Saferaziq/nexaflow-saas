'use client';
import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const LogoImg = ({ className = "w-12 h-12" }) => (
  <img src="/logo-nexaflow.png" alt="NexaFlow Logo" className={`${className} object-contain mix-blend-multiply`} />
);

const Icons = {
  Mail: () => <svg viewBox="0 0 24 24" fill="none" stroke="#8C7A6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  Lock: () => <svg viewBox="0 0 24 24" fill="none" stroke="#8C7A6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Eye: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  EyeOff: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  ArrowRight: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password,
    });

    if (error) {
      setErrorMsg(error.message === 'Invalid login credentials' ? 'Email atau password salah.' : error.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      // Cek role, jika admin arahkan ke /admin, jika bukan ke /dashboard
      const { data: userData } = await supabase.from('users').select('role, tenant_id').eq('id', data.session.user.id).single();
      
      if (userData?.role === 'admin' || data.session.user.email === 'dinamis.id.shop@gmail.com') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 relative overflow-hidden bg-gray-100 font-sans">
      
      {/* BACKGROUND IMAGE */}
      <img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2500&auto=format&fit=crop" alt="Background Cafe" className="absolute inset-0 w-full h-full object-cover" />
      
      {/* OVERLAY CERAH */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-[#F4EFE9]/50 backdrop-blur-[2px]"></div>

      {/* KARTU LOGIN (GLASSMORPHISM) */}
      <div className="relative z-10 w-full max-w-5xl rounded-[2.5rem] overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[600px] border border-white/60 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.2)] backdrop-blur-[30px] bg-white/45">
        
        {/* SISI KIRI (BRANDING) */}
        <div className="hidden md:flex flex-col justify-between p-12 lg:p-16 relative bg-[#3A2A20]/80 text-white">
          <img src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1000&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40" alt="Cafe Interior" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2A1F17] via-transparent to-black/30"></div>

          <div className="relative z-10 flex items-center gap-3">
            <div className="p-1 bg-white rounded-xl shadow-lg">
              <LogoImg className="w-10 h-10" />
            </div>
            <div>
              <p className="text-2xl font-black tracking-tight leading-none uppercase text-white">NEXAFLOW</p>
              <p className="text-[10px] font-bold text-[#D3C8BB] tracking-[0.2em] uppercase mt-1">SAAS RESTAURANT</p>
            </div>
          </div>

          <div className="relative z-10 mt-12">
            <h2 className="text-4xl lg:text-5xl font-black leading-tight tracking-tight mb-4">Kelola Kafe Anda <br /><span className="text-[#06b6d4]">Lebih Cerdas.</span></h2>
            <p className="text-sm lg:text-base text-gray-300 font-medium mb-8 max-w-md">Bergabunglah dengan ratusan pemilik kafe yang telah beralih ke sistem kasir modern, self-order QR, dan panggilan suara otomatis.</p>
            
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-2xl">
              <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-3">
                <span className="text-xs font-bold text-gray-300">Ringkasan Hari Ini</span>
                <span className="text-[10px] font-black bg-[#06b6d4] text-white px-2 py-0.5 rounded">LIVE</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Omset</p>
                  <p className="text-xl font-black text-white">Rp 4.250.000</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Pesanan</p>
                  <p className="text-xl font-black text-white">124</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-12">
            <p className="text-xs font-bold text-gray-400">© {new Date().getFullYear()} NexaFlow. All rights reserved.</p>
          </div>
        </div>

        {/* SISI KANAN (FORM) */}
        <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white/40 backdrop-blur-md relative">
          
          <div className="md:hidden flex flex-col items-center justify-center mb-8 text-center">
            <LogoImg className="w-16 h-16 mb-4" />
            <h1 className="text-2xl font-black text-[#3A2A20]">Selamat Datang!</h1>
          </div>

          <div className="hidden md:block mb-10">
            <h1 className="text-3xl font-black text-[#3A2A20] tracking-tight mb-2">Selamat Datang Kembali</h1>
            <p className="text-sm font-semibold text-[#5C4B3E]">Silakan masukkan kredensial Anda untuk mengakses dashboard.</p>
          </div>

          {errorMsg && (
            <div className="mb-6 bg-rose-50 border-2 border-rose-200 text-rose-600 text-xs font-bold px-4 py-3 rounded-xl flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span> {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-black text-[#3A2A20] mb-2 uppercase tracking-wider">Alamat Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Icons.Mail /></div>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@kafe.com" className="w-full bg-white/70 backdrop-blur-sm border-2 border-white/50 rounded-xl pl-11 pr-4 py-4 text-sm font-bold text-[#3A2A20] outline-none focus:bg-white focus:border-[#06b6d4] focus:ring-4 focus:ring-[#06b6d4]/15 transition-all placeholder:text-[#A69B91]" required />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-black text-[#3A2A20] uppercase tracking-wider">Password</label>
                <Link href="/forgot-password" className="text-xs font-bold text-[#06b6d4] hover:text-[#0891b2] transition-colors">Lupa Password?</Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Icons.Lock /></div>
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-white/70 backdrop-blur-sm border-2 border-white/50 rounded-xl pl-11 pr-12 py-4 text-sm font-bold text-[#3A2A20] outline-none focus:bg-white focus:border-[#06b6d4] focus:ring-4 focus:ring-[#06b6d4]/15 transition-all placeholder:text-[#A69B91]" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#8C7A6B] hover:text-[#3A2A20] transition-colors">
                  {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-[#3A2A20] text-[#F4EFE9] font-black py-4 rounded-xl text-sm shadow-xl shadow-[#3A2A20]/20 hover:bg-[#2A1F17] hover:shadow-[#3A2A20]/40 hover:-translate-y-0.5 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed">
              {loading ? 'Memverifikasi...' : <><span>Masuk ke Dashboard</span> <Icons.ArrowRight /></>}
            </button>
          </form>

          <div className="relative flex items-center justify-center mt-8 mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#D3C8BB]/60"></div></div>
            <div className="relative px-4 text-xs font-bold text-[#8C7A6B] bg-transparent">Belum punya akun?</div>
          </div>

          <Link href="/register" className="w-full bg-white/50 border-2 border-[#D3C8BB] text-[#3A2A20] font-black py-4 rounded-xl text-sm hover:bg-white hover:border-[#8C7A6B] transition-all text-center flex justify-center items-center gap-2">
            Daftar Kafe Sekarang
          </Link>

        </div>
      </div>
    </div>
  );
}