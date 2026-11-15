'use client';
import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const LogoImg = ({ className = "w-12 h-12" }) => (
  <img src="/logo-nexaflow-3d.png" alt="NexaFlow Logo" className={`${className} object-contain`} />
);

const Icons = {
  Mail: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  Lock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Eye: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  EyeOff: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  ArrowRight: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg>,
  Store: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginRole, setLoginRole] = useState('kasir');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (authError) throw new Error(authError.message);

      const ADMIN_EMAIL = 'dinamis.id.shop@gmail.com';
      const isAdmin = user.email === ADMIN_EMAIL;
      
      const { data: managerData } = await supabase
        .from('tenants')
        .select('id')
        .eq('manager_email', user.email)
        .limit(1);

      const isOwner = managerData && managerData.length > 0;

      // Validasi Role Sesuai Pilihan Tab
      if (loginRole === 'kasir') {
        if (isAdmin || isOwner) {
          throw new Error('Akun ini terdaftar sebagai Owner/Admin. Silakan pilih tab "Login Owner".');
        }
        router.push('/dashboard');
      } else {
        if (!isAdmin && !isOwner) {
          throw new Error('Akun ini bukan Owner. Silakan pilih tab "Login Kasir".');
        }
        router.push(isAdmin ? '/admin' : '/owner');
      }

    } catch (err) {
      setErrorMsg(err.message === 'Invalid login credentials' ? 'Email atau password salah.' : err.message);
    } finally {
      setLoading(false);
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

      {/* BACKGROUND IMAGE CAFE (Sama seperti Register) */}
      <img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2500&auto=format&fit=crop" alt="Background Cafe" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-[#060911]/60 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-[1000px] rounded-[2rem] overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[650px] glass-panel">
        
        {/* SISI KIRI (DARK NAVY) */}
        <div className="hidden md:flex md:col-span-5 flex-col justify-between p-10 lg:p-12 relative bg-gradient-to-br from-[#0F294A] via-[#15376B] to-[#0A1426] border-r border-white/10">
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

          <div className="relative z-10 mt-8">
            <h2 className="text-3xl lg:text-4xl font-black leading-tight tracking-tight mb-6 text-white font-display">Pantau Kafe Anda <br /><span className="text-gradient-copper">Kapan Saja.</span></h2>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 text-white"><Icons.Check /></div>
                <span className="text-sm font-bold text-white">Sistem Kasir & Dapur Terhubung</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 text-white"><Icons.Check /></div>
                <span className="text-sm font-bold text-white">Laporan Omset Real-time</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 text-white"><Icons.Check /></div>
                <span className="text-sm font-bold text-white">Multi-Cabang dalam 1 Layar</span>
              </li>
            </ul>
          </div>

          <div className="relative z-10">
            <p className="text-xs font-bold text-blue-300/60">© {new Date().getFullYear()} NexaFlow. All rights reserved.</p>
          </div>
        </div>

        {/* SISI KANAN (PUTIH) */}
        <div className="md:col-span-7 p-8 sm:p-10 lg:p-12 flex flex-col justify-center bg-white relative overflow-y-auto">
          
          <div className="md:hidden flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl shadow-sm p-1">
              <LogoImg className="w-full h-full" />
            </div>
            <div><p className="text-lg font-black text-[#0F172A] leading-none uppercase font-display">NEXAFLOW</p></div>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight mb-2 font-display">Selamat Datang</h1>
            <p className="text-sm font-semibold text-slate-500">Silakan masuk ke akun NexaFlow Anda.</p>
          </div>

          {/* TOGGLE KASIR / OWNER */}
          <div className="flex p-1.5 bg-slate-50 border border-slate-200 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => { setLoginRole('kasir'); setErrorMsg(''); }}
              className={`flex-1 py-2.5 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-2 ${loginRole === 'kasir' ? 'bg-[#15376B] text-white shadow-md' : 'text-slate-500 hover:text-[#0F172A]'}`}
            >
              <Icons.Store /> Login Kasir
            </button>
            <button
              type="button"
              onClick={() => { setLoginRole('owner'); setErrorMsg(''); }}
              className={`flex-1 py-2.5 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-2 ${loginRole === 'owner' ? 'bg-[#EA8B42] text-white shadow-md' : 'text-slate-500 hover:text-[#0F172A]'}`}
            >
              <Icons.Shield /> Login Owner
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold px-4 py-3 rounded-xl">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[11px] font-black text-[#0F172A] mb-1.5 uppercase tracking-wider">Email Address <span className="text-rose-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400"><Icons.Mail /></div>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder={loginRole === 'kasir' ? "kasir@kafe.com" : "owner@kafe.com"}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3.5 text-sm font-bold text-[#0F172A] outline-none focus:bg-white focus:border-[#15376B] focus:ring-2 focus:ring-[#15376B]/20 transition-all placeholder:text-slate-400" 
                  required 
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black text-[#0F172A] mb-1.5 uppercase tracking-wider">Password <span className="text-rose-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400"><Icons.Lock /></div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Masukkan password Anda" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-12 py-3.5 text-sm font-bold text-[#0F172A] outline-none focus:bg-white focus:border-[#15376B] focus:ring-2 focus:ring-[#15376B]/20 transition-all placeholder:text-slate-400" 
                  required 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-[#0F172A] transition-colors">
                  {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full mt-2 btn-navy text-white font-extrabold py-4 rounded-xl text-sm hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0">
              {loading ? 'Memverifikasi...' : <><span>Masuk ke Dashboard</span> <Icons.ArrowRight /></>}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm font-bold text-slate-500">
              Belum punya akun? <Link href="/register" className="text-[#15376B] hover:text-[#0F294A] font-black transition-colors">Daftar Kafe Baru</Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}