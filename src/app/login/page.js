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
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 relative overflow-hidden selection:bg-[#15376B] selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@700;800;900&display=swap');
        body { font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
        h1, h2, h3, h4, .font-display { font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; }
        .btn-navy { background: linear-gradient(135deg, #1E4E8C 0%, #15376B 50%, #0F294A 100%); box-shadow: 0 10px 25px -5px rgba(21, 55, 107, 0.4); }
        .btn-navy:hover { background: linear-gradient(135deg, #15376B 0%, #0F294A 100%); box-shadow: 0 15px 30px -5px rgba(21, 55, 107, 0.6); }
        .text-gradient-copper { background: linear-gradient(135deg, #FDE68A 0%, #EA8B42 50%, #9A3412 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .glass-panel { background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); }
      `}</style>

      {/* BACKGROUND IMAGE CAFE */}
      <img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2500&auto=format&fit=crop" alt="Background Cafe" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-[#060911]/60 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-5xl rounded-[2rem] overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[650px] glass-panel">
        
        {/* SISI KIRI (WARNA LOGO) */}
        <div className="hidden md:flex flex-col justify-between p-12 lg:p-14 relative bg-gradient-to-br from-[#0F294A] via-[#15376B] to-[#0A1426] border-r border-white/10">
          <div className="absolute top-[-20%] right-[-10%] w-[350px] h-[350px] rounded-full bg-[#D97736]/30 blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full bg-[#1E4E8C]/20 blur-[100px] pointer-events-none"></div>

          <div className="relative z-10 flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl shadow-lg p-1.5">
              <LogoImg className="w-full h-full" />
            </div>
            <div>
              <p className="text-2xl font-black tracking-tight leading-none uppercase text-white font-display">NEXA<span className="text-sky-300">FLOW</span></p>
              <p className="text-[10px] font-bold text-blue-200 tracking-[0.2em] uppercase mt-1">FULL-STACK RESTAURANT OS</p>
            </div>
          </div>

          <div className="relative z-10 mt-12">
            <h2 className="text-4xl lg:text-5xl font-black leading-tight tracking-tight mb-4 text-white font-display">Kelola Kafe Anda <br /><span className="text-gradient-copper">Lebih Cerdas.</span></h2>
            <p className="text-sm lg:text-base text-blue-100 font-medium mb-8 max-w-md leading-relaxed">Bergabunglah dengan ratusan pemilik kafe yang telah beralih ke sistem kasir modern, self-order QR, dan panggilan suara otomatis.</p>
            
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-2xl">
              <div className="flex justify-between items-center border-b border-white/20 pb-3 mb-3">
                <span className="text-xs font-bold text-white">Ringkasan Hari Ini</span>
                <span className="text-[10px] font-black bg-[#EA8B42] text-slate-900 px-2 py-0.5 rounded">LIVE</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-blue-200 font-bold uppercase">Omset</p>
                  <p className="text-xl font-black text-white">Rp 4.250.000</p>
                </div>
                <div>
                  <p className="text-[10px] text-blue-200 font-bold uppercase">Pesanan</p>
                  <p className="text-xl font-black text-white">124</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-12">
            <p className="text-xs font-bold text-blue-300/60">© {new Date().getFullYear()} NexaFlow. All rights reserved.</p>
          </div>
        </div>

        {/* SISI KANAN (PUTIH) */}
        <div className="p-8 sm:p-12 lg:p-14 flex flex-col justify-center bg-white relative">
          <div className="md:hidden flex flex-col items-center justify-center mb-8 text-center">
            <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm p-2 mb-4">
              <LogoImg className="w-full h-full" />
            </div>
            <h1 className="text-2xl font-black text-[#0F172A] font-display">Selamat Datang!</h1>
          </div>

          <div className="hidden md:block mb-10">
            <h1 className="text-3xl font-black text-[#0F172A] tracking-tight mb-2 font-display">Selamat Datang Kembali</h1>
            <p className="text-sm font-semibold text-slate-500">Silakan masukkan kredensial Anda untuk mengakses dashboard.</p>
          </div>

          {errorMsg && (
            <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold px-4 py-3 rounded-xl flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span> {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-black text-[#0F172A] mb-2 uppercase tracking-wider">Alamat Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><Icons.Mail /></div>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@kafe.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-4 text-sm font-bold text-[#0F172A] outline-none focus:bg-white focus:border-[#15376B] focus:ring-2 focus:ring-[#15376B]/20 transition-all placeholder:text-slate-400" required />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-black text-[#0F172A] uppercase tracking-wider">Password</label>
                <Link href="/forgot-password" className="text-xs font-bold text-[#15376B] hover:text-[#0F294A] transition-colors">Lupa Password?</Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><Icons.Lock /></div>
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-12 py-4 text-sm font-bold text-[#0F172A] outline-none focus:bg-white focus:border-[#15376B] focus:ring-2 focus:ring-[#15376B]/20 transition-all placeholder:text-slate-400" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-[#0F172A] transition-colors">
                  {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full btn-navy text-white font-extrabold py-4 rounded-xl text-sm hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed">
              {loading ? 'Memverifikasi...' : <><span>Masuk ke Dashboard</span> <Icons.ArrowRight /></>}
            </button>
          </form>

          <div className="relative flex items-center justify-center mt-8 mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            <div className="relative px-4 text-xs font-bold text-slate-400 bg-white">Belum punya akun?</div>
          </div>

          <Link href="/register" className="w-full bg-white border-2 border-slate-200 text-[#0F172A] font-black py-4 rounded-xl text-sm hover:bg-slate-50 hover:border-slate-300 transition-all text-center flex justify-center items-center gap-2">
            Daftar Kafe Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
}