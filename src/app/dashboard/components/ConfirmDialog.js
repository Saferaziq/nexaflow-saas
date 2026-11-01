'use client';

import { Icons } from '../helpers/icons';

export default function ConfirmDialog({ theme, dialog, onClose }) {
  if (!dialog || !dialog.open) return null;

  const handleConfirm = () => {
    if (typeof dialog.onConfirm === 'function') dialog.onConfirm();
    onClose();
  };

  const textMainClass = theme === 'light' ? 'text-[#2A1F17]' : 'text-white';
  const textSubClass = theme === 'light' ? 'text-[#5C4B3E]' : 'text-slate-300';

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[90] print:hidden">
      <div className={`rounded-[2rem] max-w-md w-full p-8 shadow-2xl border-2 animate-in zoom-in-95 ${theme === 'light' ? 'bg-white border-[#D4C5B8]' : 'bg-slate-900 border-slate-700'}`}>

        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 mx-auto ${dialog.danger ? 'bg-rose-100 text-rose-500' : 'bg-amber-100 text-amber-600'}`}>
          {dialog.danger ? <Icons.X /> : <Icons.Clock />}
        </div>

        <h3 className={`text-xl font-black text-center mb-2 ${textMainClass}`}>{dialog.title}</h3>
        <p className={`text-sm font-semibold text-center mb-6 ${textSubClass}`}>{dialog.message}</p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className={`flex-1 font-extrabold py-3 rounded-xl text-sm transition-colors border-2 ${theme === 'light' ? 'bg-[#F4EFE9] hover:bg-[#E8DFD3] border-[#D4C5B8] text-[#2A1F17]' : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-white'}`}
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            className={`flex-1 font-extrabold py-3 rounded-xl text-sm text-white transition-all active:scale-95 border-2 ${dialog.danger ? 'bg-rose-500 hover:bg-rose-600 border-rose-600' : 'bg-[var(--primary-color)] hover:bg-[var(--primary-dark)] border-[var(--primary-dark)]'}`}
          >
            Ya, Lanjutkan
          </button>
        </div>

      </div>
    </div>
  );
}