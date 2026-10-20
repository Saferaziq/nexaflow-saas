'use client';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white text-3xl font-black mb-6 shadow-xl">N</div>
      <h1 className="text-4xl font-black text-slate-900 mb-4">NexaFlow SaaS</h1>
      <p className="text-slate-500 max-w-md mb-8">Sistem Kasir & QR Code restoran modern. Kelola menu, terima pesanan, dan pantau omzet secara real-time.</p>
      <div className="flex gap-4">
        <Link href="/login" className="bg-slate-900 text-white font-bold py-3 px-8 rounded-xl hover:bg-slate-800">Login Penjual</Link>
        <Link href="/register" className="bg-orange-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-orange-700">Daftar Kafe</Link>
      </div>
    </div>
  );
}