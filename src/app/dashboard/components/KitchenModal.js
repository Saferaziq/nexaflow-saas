'use client';

import { Icons } from '../helpers/icons';

export default function KitchenModal({
  theme,
  kitchenModal,
  onClose,
  onCopyUrl,
}) {
  if (!kitchenModal.open) return null;

  const textMainClass = theme === 'light' ? 'text-[#2A1F17]' : 'text-white';
  const textSubClass = theme === 'light' ? 'text-[#5C4B3E]' : 'text-slate-300';

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[80] print:hidden">
      <div className={`rounded-[2rem] max-w-md w-full p-8 shadow-2xl border-2 ${theme === 'light' ? 'bg-white border-[#D4C5B8]' : 'bg-slate-900 border-slate-700'}`}>

        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className={`font-black text-xl ${textMainClass}`}>Layar Dapur (KDS)</h3>
            <p className={`text-xs font-semibold mt-1 ${textSubClass}`}>Buka URL ini di tablet / TV dapur</p>
          </div>
          <button onClick={onClose} className={`w-10 h-10 rounded-full font-bold flex items-center justify-center transition-colors border-2 ${theme === 'light' ? 'bg-[#F4EFE9] hover:bg-[#E8DFD3] border-[#D4C5B8] text-[#2A1F17]' : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-300'}`}>
            <Icons.X />
          </button>
        </div>

        <div className="space-y-4">

          {/* URL */}
          <div>
            <label className={`block text-[10px] font-bold uppercase mb-2 ${textSubClass}`}>URL</label>
            <div className="flex gap-2">
              <input
                readOnly
                value={kitchenModal.url}
                className={`flex-1 border-2 rounded-xl px-3 py-2.5 text-xs font-mono ${theme === 'light' ? 'border-[#D4C5B8] bg-[#F4EFE9] text-[#2A1F17]' : 'border-slate-600 bg-slate-800 text-slate-300'}`}
              />
              <button
                onClick={onCopyUrl}
                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap shadow-sm transition-colors border-2 ${theme === 'light' ? 'bg-[#2A1F17] hover:bg-[#1A120D] text-white border-[#2A1F17]' : 'bg-slate-700 hover:bg-slate-600 text-white border-slate-600'}`}
              >
                Salin
              </button>
            </div>
          </div>

          {/* QR Code */}
          <div className={`text-center p-4 rounded-2xl border-2 ${theme === 'light' ? 'bg-[#F4EFE9] border-[#D4C5B8]' : 'bg-slate-800 border-slate-600'}`}>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(kitchenModal.url)}`}
              className="w-40 h-40 mx-auto rounded-xl shadow-sm border border-slate-300 bg-white"
              alt="QR KDS"
            />
            <p className={`text-[10px] font-semibold mt-3 ${textSubClass}`}>Scan QR dengan tablet dapur</p>
          </div>

          {/* PIN */}
          <div className={`border-2 rounded-xl p-4 ${theme === 'light' ? 'bg-amber-100 border-amber-300' : 'bg-amber-500/10 border-amber-500/30'}`}>
            <p className={`text-sm font-bold ${theme === 'light' ? 'text-amber-900' : 'text-amber-500'}`}>PIN: {kitchenModal.pin}</p>
            <p className={`text-[11px] font-semibold mt-1 ${theme === 'light' ? 'text-amber-800' : 'text-amber-500/70'}`}>PIN ini sudah termasuk di URL. Jangan bagikan ke pelanggan.</p>
          </div>

        </div>

        <button
          onClick={onClose}
          className={`w-full mt-5 font-extrabold py-3 rounded-xl text-sm transition-colors border-2 ${theme === 'light' ? 'bg-[#F4EFE9] hover:bg-[#E8DFD3] border-[#D4C5B8] text-[#2A1F17]' : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-white'}`}
        >
          Tutup
        </button>

      </div>
    </div>
  );
}