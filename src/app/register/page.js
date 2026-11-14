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
    <div className="min-h-screen flex bg-white font-sans selection:bg-[#2563EB] selection:text-white">
      
      {/* SISI KIRI (BIRU) */}
      <div className="hidden lg:flex lg:w-5/12 relative bg-gradient-to-br from-[#1E4E8C] via-[#2563EB] to-[#0F294A] overflow-hidden flex-col justify-between p-10 xl:p-12">
        {/* Dekorasi Latar */}
        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-white/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] bg-[#EA8B42]/20 rounded-full blur-[100px] pointer-events-none"></div>
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

        <div className="relative z-10 max-w-lg mt-8">
          <h1 className="text-3xl xl:text-4xl font-black text-white leading-[1.2] mb-6 font-display">
            Solusi Tepat untuk <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-400">Kafe & Resto</span> Anda.
          </h1>
          
          <ul className="space-y-5">
            <li className="flex items-center gap-4 text-sm font-bold text-white">
              <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0"><Icons.Check /></span>
              <span>Kelola Menu & Stok Otomatis</span>
            </li>
            <li className="flex items-center gap-4 text-sm font-bold text-white">
              <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0"><Icons.Check /></span>
              <span>Layar Dapur (KDS) Terhubung</span>
            </li>
            <li className="flex items-center gap-4 text-sm font-bold text-white">
              <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0"><Icons.Check /></span>
              <span>Pelanggan Pesan Sendiri via QR</span>
            </li>
          </ul>
        </div>

        <div className="relative z-10">
          <p className="text-xs font-bold text-sky-300/60">© {new Date().getFullYear()} NexaFlow. All rights reserved.</p>
        </div>
      </div>

      {/* SISI KANAN (PUTIH) */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-6 sm:p-10 xl:p-12 relative overflow-y-auto">
        <div className="w-full max-w-xl">
          
          {/* Logo Mobile */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl shadow-sm p-1.5">
              <LogoImg className="w-full h-full" />
            </div>
            <div><p className="text-xl font-black text-[#0B172A] leading-none uppercase font-display">NEXAFLOW</p></div>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-[#0B172A] tracking-tight mb-2 font-display">Daftarkan Kafe / Resto</h1>
            <p className="text-sm font-semibold text-slate-500">Mulai uji coba gratis 7 hari. Tanpa kartu kredit.</p>
          </div>

          {errorMsg && (
            <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold px-4 py-3 rounded-xl">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-[11px] font-black text-[#0B172A] mb-1.5 uppercase tracking-wider">Nama Kafe / Resto <span className="text-rose-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400"><Icons.Coffee /></div>
                <input type="text" name="cafeName" value={formData.cafeName} onChange={handleChange} placeholder="Cth: Kopi Senja / Resto Rasa" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-[#0B172A] outline-none focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all placeholder:text-slate-400" required />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black text-[#0B172A] mb-1.5 uppercase tracking-wider">Jenis Bisnis <span className="text-rose-500">*</span></label>
              <div className="relative">
                <select name="businessType" value={formData.businessType} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-[#0B172A] outline-none appearance-none cursor-pointer focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all" required>
                  <option value="" disabled>Pilih jenis bisnis Anda</option>
                  <option value="kafe">Kafe / Coffee Shop</option>
                  <option value="resto">Restoran / Rumah Makan</option>
                  <option value="bakery">Bakery / Pastry</option>
                  <option value="foodcourt">Food Court / Booth</option>
                </select>
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400"><Icons.Coffee /></div>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-slate-400"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-black text-[#0B172A] mb-1.5 uppercase tracking-wider">Nama Pemilik <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400"><Icons.User /></div>
                  <input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} placeholder="Nama Anda" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-[#0B172A] outline-none focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all placeholder:text-slate-400" required />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-black text-[#0B172A] mb-1.5 uppercase tracking-wider">No. WhatsApp <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400"><Icons.Phone /></div>
                  <input type="tel" name="waNumber" value={formData.waNumber} onChange={handleChange} placeholder="081234..." className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-[#0B172A] outline-none focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all placeholder:text-slate-400" required />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black text-[#0B172A] mb-1.5 uppercase tracking-wider">Alamat Email <span className="text-rose-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400"><Icons.Mail /></div>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="admin@kafe.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-[#0B172A] outline-none focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all placeholder:text-slate-400" required />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black text-[#0B172A] mb-1.5 uppercase tracking-wider">Password <span className="text-rose-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400"><Icons.Lock /></div>
                <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="Minimal 6 karakter" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-12 py-3 text-sm font-bold text-[#0B172A] outline-none focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all placeholder:text-slate-400" required minLength={6} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-[#0B172A] transition-colors">
                  {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                </button>
              </div>
            </div>

            <div className="flex items-start mt-2">
              <input type="checkbox" id="terms" className="mt-1 w-4 h-4 bg-slate-50 border-slate-300 rounded text-[#2563EB] focus:ring-[#2563EB] focus:ring-offset-white" required />
              <label htmlFor="terms" className="ml-2 text-[11px] font-bold text-slate-500 leading-snug cursor-pointer">
                Saya menyetujui <a href="#" className="text-[#2563EB] hover:underline">Syarat & Ketentuan</a> NexaFlow.
              </label>
            </div>

            <button type="submit" disabled={loading} className="w-full mt-2 btn-sapphire text-white font-extrabold py-4 rounded-xl text-sm shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0">
              {loading ? 'Memproses Pendaftaran...' : <><span>Daftar Kafe & Mulai Uji Coba</span> <Icons.ArrowRight /></>}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm font-bold text-slate-500">
              Sudah punya akun? <Link href="/login" className="text-[#2563EB] hover:text-[#1E4E8C] font-black transition-colors">Masuk di sini</Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}