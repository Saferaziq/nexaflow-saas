'use client';
import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const LogoImg = ({ className = "w-12 h-12" }) => (
  <img src="/logo-nexaflow-3d.png" alt="NexaFlow Logo" className={`${className} object-contain`} />
);

const Icons = {
  Coffee: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
  User: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Phone: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  Mail: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  Lock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Eye: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  EyeOff: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  ArrowRight: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg>,
};

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    cafeName: '', ownerName: '', waNumber: '', businessType: '', email: '', password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (formData.password.length < 6) {
      setErrorMsg('Password minimal 6 karakter.');
      setLoading(false);
      return;
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (authError) throw new Error(authError.message);

      if (authData.user) {
        const { data: tenantData, error: tenantError } = await supabase
          .from('tenants')
          .insert([{ name: formData.cafeName, wa_number: formData.waNumber, is_active: true, is_open: true }])
          .select().single();

        if (tenantError) throw new Error('Gagal membuat data kafe: ' + tenantError.message);

        const { error: userError } = await supabase
          .from('users')
          .insert([{ id: authData.user.id, tenant_id: tenantData.id, role: 'owner', email: formData.email.trim() }]);

        if (userError) throw new Error('Gagal menghubungkan akun: ' + userError.message);

        router.push('/dashboard');
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 relative overflow-hidden bg-[#060911] font-sans selection:bg-[#2563EB] selection:text-white">
      
      {/* BACKGROUND IMAGE */}
      <img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2500&auto=format&fit=crop" alt="Background Cafe" className="absolute inset-0 w-full h-full object-cover opacity-60" />
      
      {/* OVERLAY GELAP */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#060911]/80 via-[#060911]/60 to-[#060911]/90 backdrop-blur-sm"></div>

      {/* KARTU DAFTAR */}
      <div className="relative z-10 w-full max-w-[1050px] rounded-[2.5rem] overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[680px] border border-slate-800 shadow-2xl backdrop-blur-xl bg-[#0B1221]/80">
        
        {/* SISI KIRI (BRANDING) */}
        <div className="hidden md:flex md:col-span-5 flex-col justify-between p-10 lg:p-12 relative bg-[#060911]">
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

          <div className="relative z-10 mt-8">
            <h2 className="text-3xl lg:text-4xl font-black leading-tight tracking-tight mb-6 text-white font-display">Solusi Tepat untuk <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-amber-400">Kafe & Resto</span> Anda.</h2>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center border border-sky-500/50 shrink-0 text-sky-400"><Icons.Check /></div>
                <span className="text-sm font-bold text-slate-300">Kelola Menu & Stok Otomatis</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center border border-sky-500/50 shrink-0 text-sky-400"><Icons.Check /></div>
                <span className="text-sm font-bold text-slate-300">Layar Dapur (KDS) Terhubung</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center border border-sky-500/50 shrink-0 text-sky-400"><Icons.Check /></div>
                <span className="text-sm font-bold text-slate-300">Pelanggan Pesan Sendiri via QR</span>
              </li>
            </ul>
          </div>

          <div className="relative z-10">
            <p className="text-xs font-bold text-slate-500">© {new Date().getFullYear()} NexaFlow. All rights reserved.</p>
          </div>
        </div>

        {/* SISI KANAN (FORM) */}
        <div className="md:col-span-7 p-8 sm:p-10 lg:p-12 flex flex-col justify-center bg-[#0B1221]/90 relative overflow-y-auto">
          
          <div className="md:hidden flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-white rounded-xl shadow-lg p-1"><LogoImg className="w-full h-full" /></div>
            <div><p className="text-lg font-black text-white leading-none uppercase font-display">NEXAFLOW</p></div>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2 font-display">Daftarkan Kafe / Resto</h1>
            <p className="text-sm font-semibold text-slate-400">Mulai uji coba gratis 7 hari. Tanpa kartu kredit.</p>
          </div>

          {errorMsg && (
            <div className="mb-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold px-4 py-3 rounded-xl">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-[11px] font-black text-slate-300 mb-1.5 uppercase tracking-wider">Nama Kafe / Resto <span className="text-rose-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500"><Icons.Coffee /></div>
                <input type="text" name="cafeName" value={formData.cafeName} onChange={handleChange} placeholder="Cth: Kopi Senja / Resto Rasa" className="w-full bg-[#111C33] border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-white outline-none focus:border-sky-500 transition-all placeholder:text-slate-600" required />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black text-slate-300 mb-1.5 uppercase tracking-wider">Jenis Bisnis <span className="text-rose-500">*</span></label>
              <div className="relative">
                <select name="businessType" value={formData.businessType} onChange={handleChange} className="w-full bg-[#111C33] border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-white outline-none appearance-none cursor-pointer focus:border-sky-500 transition-all" required>
                  <option value="" disabled>Pilih jenis bisnis Anda</option>
                  <option value="kafe">Kafe / Coffee Shop</option>
                  <option value="resto">Restoran / Rumah Makan</option>
                  <option value="bakery">Bakery / Pastry</option>
                  <option value="foodcourt">Food Court / Booth</option>
                </select>
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500"><Icons.Coffee /></div>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-slate-500"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-black text-slate-300 mb-1.5 uppercase tracking-wider">Nama Pemilik <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500"><Icons.User /></div>
                  <input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} placeholder="Nama Anda" className="w-full bg-[#111C33] border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-white outline-none focus:border-sky-500 transition-all placeholder:text-slate-600" required />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-300 mb-1.5 uppercase tracking-wider">No. WhatsApp <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500"><Icons.Phone /></div>
                  <input type="tel" name="waNumber" value={formData.waNumber} onChange={handleChange} placeholder="081234..." className="w-full bg-[#111C33] border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-white outline-none focus:border-sky-500 transition-all placeholder:text-slate-600" required />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black text-slate-300 mb-1.5 uppercase tracking-wider">Alamat Email <span className="text-rose-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500"><Icons.Mail /></div>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="admin@kafe.com" className="w-full bg-[#111C33] border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-white outline-none focus:border-sky-500 transition-all placeholder:text-slate-600" required />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black text-slate-300 mb-1.5 uppercase tracking-wider">Password <span className="text-rose-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500"><Icons.Lock /></div>
                <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="Minimal 6 karakter" className="w-full bg-[#111C33] border border-slate-700 rounded-xl pl-10 pr-12 py-3 text-sm font-bold text-white outline-none focus:border-sky-500 transition-all placeholder:text-slate-600" required minLength={6} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-white transition-colors">
                  {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                </button>
              </div>
            </div>

            <div className="flex items-start mt-2">
              <input type="checkbox" id="terms" className="mt-1 w-4 h-4 bg-[#111C33] border-slate-700 rounded text-sky-500 focus:ring-sky-500 focus:ring-offset-[#0B1221]" required />
              <label htmlFor="terms" className="ml-2 text-[11px] font-bold text-slate-400 leading-snug cursor-pointer">
                Saya menyetujui <a href="#" className="text-sky-400 hover:underline">Syarat & Ketentuan</a> NexaFlow.
              </label>
            </div>

            <button type="submit" disabled={loading} className="w-full mt-2 btn-sapphire text-white font-extrabold py-4 rounded-xl text-sm hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0">
              {loading ? 'Memproses Pendaftaran...' : <><span>Daftar Kafe & Mulai Uji Coba</span> <Icons.ArrowRight /></>}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm font-bold text-slate-400">
              Sudah punya akun? <Link href="/login" className="text-sky-400 hover:text-sky-300 font-black transition-colors">Masuk di sini</Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}