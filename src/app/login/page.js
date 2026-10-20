'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage('Gagal Login: ' + error.message);
    } else {
      setMessage('Login berhasil! Mengarahkan ke Dashboard...');
      setTimeout(() => router.push('/dashboard'), 1000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-200">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Login Pemilik Kafe</h1>
        <p className="text-sm text-slate-500 mb-6">Masuk untuk mengelola menu dan pesanan.</p>
        {message && (
          <div className={`p-3 mb-4 rounded-xl text-xs font-semibold ${message.includes('Gagal') ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-orange-500" placeholder="admin@kafeuji.com" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-orange-500" placeholder="Password Anda" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-all shadow-md text-sm mt-2">
            {loading ? 'Memproses...' : 'Masuk Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}