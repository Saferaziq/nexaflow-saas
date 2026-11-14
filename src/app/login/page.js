'use client';
import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const LogoImg = ({ className = "w-12 h-12" }) => (
  <img src="/logo-nexaflow-3d.png" alt="NexaFlow Logo" className={`${className} object-contain`} />
);

const Icons = {
  Mail: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  Lock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
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
      const { data: userData } = await supabase.from('users').select('role, tenant_id').eq('id', data.session.user.id).single();
      
      if (userData?.role === 'admin' || data.session.user.email === 'dinamis.id.shop@gmail.com') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 relative overflow-hidden bg-[#060911] font-sans selection:bg-[#2563EB] selection:text-white">
      
      {/* BACKGROUND IMAGE */}
      <img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2500&auto=format&fit=crop" alt="Background Cafe" className="absolute inset-0 w-full h-full object-cover opacity-60" />
      
      {/* OVERLAY GELAP */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#060911]/80 via-[#060911]/60 to-[#060911]/90 backdrop-blur-sm"></div>

      {/* KARTU LOGIN (OBSIDIAN GLASSMORPHISM) */}
      <div className="relative z-10 w-full max-w-5xl rounded-[2.5rem] overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[600px] border border-slate-800 shadow-2xl backdrop-blur-xl bg-[#0B1221]/80">
        
        {/* SISI KIRI (BRANDING) */}
        <div className="hidden md:flex flex-col justify-between p-12 lg:p-16 relative bg-[#060911]">
          <img src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1000&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30" alt="Cafe Interior" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060911] via-[#060911]/50 to-transparent"></div>

          <div className="relative z-10 flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl shadow-lg p-1.5">
              <LogoImg className="w-full h-full" />
            </div>
            <div>
              <p className="text-2xl font-black tracking-tight leading-none uppercase text-white font-display">NEXA<span className="text-sky-400">FLOW</span></p>
              <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-1">FULL-STACK RESTAURANT OS</p>
            </div>
          </div>

          <div className="relative z-10 mt-12">
            <h2 className="text-4xl lg:text-5xl font-black leading-tight tracking-tight mb-4 text-white font-display">Kelola Kafe Anda <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-amber-400">Lebih Cerdas.</span></h2>
            <p className="text-sm lg:text-base text-slate-300 font-medium mb-8 max-w-md">Bergabunglah dengan ratusan pemilik kafe yang telah beralih ke sistem kasir modern, self-order QR, dan panggilan suara otomatis.</p>
            
            <div className="bg-[#111C33]/80 backdrop-blur-md border border-slate-700/80 rounded-2xl p-5 shadow-2xl">
              <div className="flex justify-between items-center border-b border-slate-700/80 pb-3 mb-3">
                <span className="text-xs font-bold text-slate-300">Ringkasan Hari Ini</span>
                <span className="text-[10px] font-black bg-sky-500/20 text-sky-400 px-2 py-0.5 rounded border border-sky-500/30">LIVE</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Omset</p>
                  <p className="text-xl font-black text-white">Rp 4.250.000</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Pesanan</p>
                  <p className="text-xl font-black text-white">124</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-12">
            <p className="text-xs font-bold text-slate-500">© {new Date().getFullYear()} NexaFlow. All rights reserved.</p>
          </div>
        </div>

        {/* SISI KANAN (FORM) */}
        <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-[#0B1221]/90 relative">
          
          <div className="md:hidden flex flex-col items-center justify-center mb-8 text-center">
            <div className="w-16 h-16 bg-white rounded-xl shadow-lg p-2 mb-4"><LogoImg className="w-full h-full" /></div>
            <h1 className="text-2xl font-black text-white font-display">Selamat Datang!</h1>
          </div>

          <div className="hidden md:block mb-10">
            <h1 className="text-3xl font-black text-white tracking-tight mb-2 font-display">Selamat Datang Kembali</h1>
            <p className="text-sm font-semibold text-slate-400">Silakan masukkan kredensial Anda untuk mengakses dashboard.</p>
          </div>

          {errorMsg && (
            <div className="mb-6 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold px-4 py-3 rounded-xl flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span> {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-black text-slate-300 mb-2 uppercase tracking-wider">Alamat Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500"><Icons.Mail /></div>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@kafe.com" className="w-full bg-[#111C33] border border-slate-700 rounded-xl pl-11 pr-4 py-4 text-sm font-bold text-white outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder:text-slate-600" required />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-black text-slate-300 uppercase tracking-wider">Password</label>
                <Link href="/forgot-password" className="text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors">Lupa Password?</Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500"><Icons.Lock /></div>
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-[#111C33] border border-slate-700 rounded-xl pl-11 pr-12 py-4 text-sm font-bold text-white outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder:text-slate-600" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors">
                  {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full btn-sapphire text-white font-extrabold py-4 rounded-xl text-sm hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed">
              {loading ? 'Memverifikasi...' : <><span>Masuk ke Dashboard</span> <Icons.ArrowRight /></>}
            </button>
          </form>

          <div className="relative flex items-center justify-center mt-8 mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-700/80"></div></div>
            <div className="relative px-4 text-xs font-bold text-slate-500 bg-[#0B1221]">Belum punya akun?</div>
          </div>

          <Link href="/register" className="w-full bg-slate-800/80 border border-slate-700 text-white font-black py-4 rounded-xl text-sm hover:bg-slate-700 transition-all text-center flex justify-center items-center gap-2">
            Daftar Kafe Sekarang
          </Link>

        </div>
      </div>
    </div>
  );
}