'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const Icons = {
  ArrowRight: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Sparkles: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>,
};

export default function RegisterPage() {
  const [cafeName, setCafeName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  useEffect(() => {
    const canvas = document.getElementById('network-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    const particleCount = 50;
    const maxDistance = 200;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(160, 140, 120, 0.4)';
        ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          let p2 = particles[j];
          let dx = p.x - p2.x; let dy = p.y - p2.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < maxDistance) {
            let opacity = 1 - (distance / maxDistance);
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(160, 140, 120, ${opacity * 0.3})`;
            ctx.lineWidth = 1; ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animationFrameId); };
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Password dan Konfirmasi Password tidak cocok!');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password minimal 6 karakter.');
      return;
    }

    setLoading(true);

    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });

    if (authError) {
      setErrorMsg(authError.message);
      setLoading(false);
      return;
    }

    if (authData.user) {
      const { data: newTenant, error: dbError } = await supabase.from('tenants').insert([{
        name: cafeName,
        subscription_end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        is_active: true
      }]).select().single();

      if (dbError) {
        setErrorMsg('Gagal membuat profil kafe: ' + dbError.message);
        setLoading(false);
        return;
      }

      if (newTenant) {
        await supabase.from('users').insert([{
          id: authData.user.id,
          tenant_id: newTenant.id,
          email: email,
          role: 'owner'
        }]);
      }

      alert('Pendaftaran Berhasil! Silakan login dengan akun Anda.');
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4EFE9] flex items-center justify-center p-4 relative font-sans">
      <canvas id="network-canvas" className="fixed inset-0 z-0 pointer-events-none"></canvas>

      <div className="relative z-10 w-full max-w-5xl bg-white/80 backdrop-blur-xl border border-[#E3DCD1] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        <div className="w-full md:w-1/2 p-10 md:p-14 flex flex-col justify-center relative overflow-hidden bg-[#F4EFE9]">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#3A2A20_1px,transparent_1px)] bg-[size:20px_20px] opacity-10"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              {/* LOGO DIPERBESAR */}
              <img 
                src="https://nbthyktmfnppruovxots.supabase.co/storage/v1/object/public/public-assets/Gemini_Generated_Image_kv5nevkv5nevkv5n%20(1).jpg" 
                alt="NexaFlow Logo" 
                className="w-32 h-32 object-contain mix-blend-multiply" 
              />
              <div>
                <h1 className="text-3xl font-black text-[#3A2A20] tracking-tight leading-none uppercase">NEXAFLOW</h1>
                <p className="text-[11px] font-bold text-[#7A6A5F] tracking-[0.2em] uppercase mt-1">SAAS RESTAURANT</p>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E3DCD1] text-[#3A2A20] text-[10px] font-black tracking-widest uppercase mb-6 shadow-sm"><Icons.Sparkles /> Langkah Baru Bisnis Anda</div>
            <h2 className="text-4xl md:text-5xl font-black text-[#3A2A20] leading-tight mb-4">Daftarkan<br /><span className="text-[#8C7A6B]">Caffe Anda.</span></h2>
            <p className="text-sm font-medium text-[#7A6A5F] leading-relaxed max-w-sm">Mulai transformasi digital bisnis Anda. Gratis uji coba 7 hari. Tanpa kartu kredit, tanpa biaya tersembunyi.</p>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-10 md:p-14 bg-white flex flex-col justify-center relative z-20">
          <div className="max-w-sm mx-auto w-full">
            <h3 className="text-2xl font-black text-[#3A2A20] mb-2">Daftarkan Caffe</h3>
            <p className="text-xs font-medium text-[#8C7A6B] mb-8">Mulai transformasi digital bisnis Anda.</p>

            {errorMsg && (<div className="mb-6 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs font-bold text-center">{errorMsg}</div>)}

            <form onSubmit={handleRegister} className="space-y-4">
              <div><label className="block text-[10px] font-black text-[#3A2A20] uppercase tracking-widest mb-2">Nama Caffe</label><input type="text" value={cafeName} onChange={(e) => setCafeName(e.target.value)} className="w-full border border-[#E3DCD1] bg-[#F4EFE9] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3A2A20]/20 focus:border-[#3A2A20] font-medium text-[#3A2A20] transition-all" placeholder="Contoh: Kopi Senja" required /></div>
              <div><label className="block text-[10px] font-black text-[#3A2A20] uppercase tracking-widest mb-2">Email Address</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-[#E3DCD1] bg-[#F4EFE9] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3A2A20]/20 focus:border-[#3A2A20] font-medium text-[#3A2A20] transition-all" placeholder="owner@nexaflow.id" required /></div>
              <div><label className="block text-[10px] font-black text-[#3A2A20] uppercase tracking-widest mb-2">Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-[#E3DCD1] bg-[#F4EFE9] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3A2A20]/20 focus:border-[#3A2A20] font-medium text-[#3A2A20] transition-all" placeholder="Minimal 6 karakter" required /></div>
              <div><label className="block text-[10px] font-black text-[#3A2A20] uppercase tracking-widest mb-2">Konfirmasi Password</label><input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full border border-[#E3DCD1] bg-[#F4EFE9] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3A2A20]/20 focus:border-[#3A2A20] font-medium text-[#3A2A20] transition-all" placeholder="Ulangi password" required /></div>
              <button type="submit" disabled={loading} className="w-full bg-[#3A2A20] hover:bg-[#2A1F17] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-[#3A2A20]/20 transition-all active:scale-95 flex items-center justify-center gap-2 mt-4">{loading ? 'Memproses...' : 'Mulai Uji Coba Gratis'} <Icons.ArrowRight /></button>
            </form>

            <div className="mt-6 text-center relative z-[999]">
              <p className="text-xs font-medium text-[#8C7A6B]">
                Sudah punya akun? 
                <button type="button" onClick={() => router.push('/login')} className="font-bold text-[#3A2A20] hover:underline cursor-pointer ml-1 p-2">Masuk di sini</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}