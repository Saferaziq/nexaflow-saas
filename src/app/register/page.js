'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cafeName, setCafeName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Mendaftarkan user ke Supabase Auth beserta data Nama Kafe
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          cafe_name: cafeName,
        },
      },
    });

    if (error) {
      setMessage('Gagal mendaftar: ' + error.message);
    } else {
      setMessage('Pendaftaran berhasil! Silakan cek email Anda atau langsung login.');
      // Arahkan ke halaman login (kita buat nanti)
      setTimeout(() => router.push('/login'), 2000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-200">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Daftar Kafe Baru</h1>
        <p className="text-sm text-slate-500 mb-6">Mulai uji coba gratis sistem kasir & QR Code.</p>

        {message && (
          <div className={`p-3 mb-4 rounded-xl text-xs font-semibold ${message.includes('Gagal') ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nama Kafe</label>
            <input
              type="text"
              required
              value={cafeName}
              onChange={(e) => setCafeName(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-orange-500"
              placeholder="Contoh: Kopi Senja"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Pemilik</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-orange-500"
              placeholder="admin@kopisenja.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-orange-500"
              placeholder="Minimal 6 karakter"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl transition-all shadow-md text-sm mt-2"
          >
            {loading ? 'Memproses...' : 'Daftar Sekarang'}
          </button>
        </form>
      </div>
    </div>
  );
}