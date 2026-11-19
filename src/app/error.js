'use client';

import { useEffect } from 'react';

export default function GlobalSegmentError({ error, reset }) {
  useEffect(() => {
    console.error('NexaFlow App Error:', error);
  }, [error]);

  const errorTitle = error?.name || 'Error';
  const errorMessage = error?.message || 'Terjadi kesalahan saat memuat halaman.';
  const errorStack = typeof error?.stack === 'string' ? error.stack.slice(0, 600) : '';

  return (
    <div className="min-h-screen bg-[#F4EFE9] text-[#1A1512] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-lg bg-white border-2 border-[#E0D6CC] rounded-2xl p-6 shadow-sm space-y-4">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-rose-600">Diagnostik Error</p>
          <h2 className="text-xl font-black text-[#1A1512] mt-1">Halaman Gagal Dimuat</h2>
        </div>

        <div className="bg-[#FAF6F2] border-2 border-[#E0D6CC] rounded-xl p-4 space-y-2">
          <p className="text-xs font-black text-rose-700">{errorTitle}: {errorMessage}</p>
          {errorStack && (
            <pre className="text-[11px] font-mono text-[#5C4B3E] whitespace-pre-wrap break-words max-h-48 overflow-y-auto">
              {errorStack}
            </pre>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="flex-1 py-3 px-4 rounded-xl bg-[#2A1F17] text-white text-xs font-black"
          >
            Coba Muat Ulang
          </button>
          <a
            href="/login"
            className="py-3 px-4 rounded-xl bg-[#FAF6F2] border-2 border-[#E0D6CC] text-[#1A1512] text-xs font-black text-center"
          >
            Ke Halaman Login
          </a>
        </div>
      </div>
    </div>
  );
}