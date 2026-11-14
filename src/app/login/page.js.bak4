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
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg>,
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
    <div className="min-h-screen flex bg-white font-sans selection:bg-[#2563EB] selection:text-white">
      
      {/* SISI KIRI (BIRU) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#1E4E8C] via-[#2563EB] to-[#0F294A] overflow-hidden flex-col justify-between p-12 xl:p-20">
        {/* Dekorasi Latar */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#EA8B42]/20 rounded-full blur-[100px] pointer-events-none"></div>
        
        {/* Garis Grid Halus */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 bg-white rounded-2xl shadow-xl p-2">
            <LogoImg className="w-full h-full" />
          </div>
          <div>
            <p className="text-2xl font-black tracking-tight leading-none uppercase text-white font-display">NEXA<span className="text-sky-300">FLOW</span></p>
            <p className="text-[10px] font-bold text-sky-200 tracking-[0.2em] uppercase mt-1">FULL-STACK RESTAURANT OS</p>
          </div>
        </div>

        <div className="relative z-10 max-w-lg">
          <h1 className="text-4xl xl:text-5xl font-black text-white leading-[1.1] mb-6 font-display">
            Kelola Kafe Anda <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-400">Lebih Cerdas.</span>
          </h1>
          <p className="text-sky-100 text-lg leading-relaxed mb-8 font-medium">
            Bergabunglah dengan ratusan pemilik kafe yang telah beralih ke sistem kasir modern, self-order QR, dan panggilan suara otomatis.
          </p>
          
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-sm font-bold text-white">
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0"><Icons.Check /></span>
              <span>Bebas Antrean di Depan Kasir</span>
            </li>
            <li className="flex items-center gap-3 text-sm font-bold text-white">
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0"><Icons.Check /></span>
              <span>Layar Dapur (KDS) Real-Time</span>
            </li>
            <li className="flex items-center gap-3 text-sm font-bold text-white">
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0"><Icons.Check /></span>
              <span>Panggilan Suara Otomatis ke HP Pelanggan</span>
            </li>
          </ul>
        </div>

        <div className="relative z-10">
          <p className="text-xs font-bold text-sky-300/60">© {new Date().getFullYear()} NexaFlow. All rights reserved.</p>
        </div>
      </div>

      {/* SISI KANAN (PUTIH) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md">
          
          {/* Logo Mobile */}
          <div className="lg:hidden flex flex-col items-center mb-10 text-center">
            <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-3xl shadow-sm p-3 mb-4">
              <LogoImg className="w-full h-full" />
            </div>
            <h1 className="text-2xl font-black text-[#0B172A] font-display">Selamat Datang!</h1>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black text-[#0B172A] tracking-tight mb-2 font-display">Selamat Datang Kembali</h2>
            <p className="text-sm font-semibold text-slate-500">Silakan masukkan kredensial Anda untuk mengakses dashboard.</p>
          </div>

          {errorMsg && (
            <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold px-4 py-3 rounded-xl flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span> {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-black text-[#0B172A] mb-2 uppercase tracking-wider">Alamat Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><Icons.Mail /></div>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@kafe.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-4 text-sm font-bold text-[#0B172A] outline-none focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all placeholder:text-slate-400" required />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-black text-[#0B172A] uppercase tracking-wider">Password</label>
                <Link href="/forgot-password" className="text-xs font-bold text-[#2563EB] hover:text-[#1E4E8C] transition-colors">Lupa Password?</Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><Icons.Lock /></div>
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-12 py-4 text-sm font-bold text-[#0B172A] outline-none focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all placeholder:text-slate-400" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-[#0B172A] transition-colors">
                  {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full btn-sapphire text-white font-extrabold py-4 rounded-xl text-sm shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed">
              {loading ? 'Memverifikasi...' : <><span>Masuk ke Dashboard</span> <Icons.ArrowRight /></>}
            </button>
          </form>

          <div className="relative flex items-center justify-center mt-8 mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            <div className="relative px-4 text-xs font-bold text-slate-400 bg-white">Belum punya akun?</div>
          </div>

          <Link href="/register" className="w-full bg-white border-2 border-slate-200 text-[#0B172A] font-black py-4 rounded-xl text-sm hover:bg-slate-50 hover:border-slate-300 transition-all text-center flex justify-center items-center gap-2">
            Daftar Kafe Sekarang
          </Link>

        </div>
      </div>
    </div>
  );
}