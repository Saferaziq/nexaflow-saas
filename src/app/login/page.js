'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Efek Tema
  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      // 1. Login ke Supabase Auth
      const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (authError) throw authError;

      // 2. Logika Redirect Berdasarkan Role
      const ADMIN_EMAIL = 'dinamis.id.shop@gmail.com';
      
      // Cek Admin
      if (user.email === ADMIN_EMAIL) {
        window.location.href = '/admin';
        return;
      }

      // Cek Owner/Manager (Apakah email ini terdaftar sebagai manager_email di tabel tenants?)
      const { data: managerData } = await supabase
        .from('tenants')
        .select('id')
        .eq('manager_email', user.email)
        .limit(1);

      if (managerData && managerData.length > 0) {
        window.location.href = '/owner';
        return;
      }

      // Jika bukan Admin & bukan Owner, berarti Kasir biasa
      window.location.href = '/dashboard';

    } catch (err) {
      setErrorMsg(err.message === 'Invalid login credentials' ? 'Email atau password salah.' : err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#04060B] flex items-center justify-center p-4 font-sans transition-colors duration-300 relative overflow-hidden">
      
      {/* Background Ornamen */}
      <div className="fixed top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-[#2563EB]/10 dark:bg-[#2563EB]/15 blur-[150px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-[#D97736]/10 dark:bg-[#D97736]/10 blur-[150px] pointer-events-none z-0"></div>

      {/* Toggle Tema */}
      <button onClick={() => setIsDarkMode(!isDarkMode)} className="absolute top-6 right-6 z-50 p-2.5 rounded-xl bg-white dark:bg-[#0F172A] text-slate-600 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800 shadow-sm">
        {isDarkMode ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        )}
      </button>

      <div className="w-full max-w-md relative z-10">
        
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto bg-white rounded-2xl flex items-center justify-center p-2 shadow-xl shadow-blue-500/10 mb-4 border border-slate-200 dark:border-slate-800">
             <img src="/logo-nexaflow-3d.png" alt="NexaFlow Logo" className="w-full h-full object-contain drop-shadow-md" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white font-display tracking-tight">Selamat Datang</h1>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-2">Masuk ke akun NexaFlow Anda</p>
        </div>

        {/* Card Form */}
        <div className="bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl">
          
          {errorMsg && (
            <div className="mb-6 p-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-xl text-center">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                placeholder="nama@email.com" 
                className="w-full bg-slate-50 dark:bg-[#04060B] border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all placeholder:text-slate-400" 
              />
            </div>
            
            <div>
              <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  placeholder="••••••••" 
                  className="w-full bg-slate-50 dark:bg-[#04060B] border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all placeholder:text-slate-400" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full bg-gradient-to-r from-[#1E4E8C] to-[#2563EB] hover:from-[#2563EB] hover:to-[#3B82F6] text-white font-black py-4 rounded-xl text-sm shadow-[0_8px_24px_-6px_rgba(37,99,235,0.5)] transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 mt-2"
            >
              {isLoading ? 'Memverifikasi...' : 'Masuk ke Dashboard'}
            </button>
          </form>
        </div>

        {/* Footer Links */}
        <div className="text-center mt-8 space-y-4">
          <p className="text-xs font-semibold text-slate-500">
            Belum punya akun? <Link href="/register" className="text-[#2563EB] dark:text-sky-400 hover:underline">Daftar Kafe Baru</Link>
          </p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} NexaFlow Systems
          </p>
        </div>

      </div>
    </div>
  );
}