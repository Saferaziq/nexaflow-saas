'use client';

import { Icons } from '../helpers/icons';

const TOAST_STYLE = {
  success: { bg: 'bg-emerald-500', icon: '✓' },
  error: { bg: 'bg-rose-500', icon: '✕' },
  warning: { bg: 'bg-amber-500', icon: '!' },
  info: { bg: 'bg-slate-800', icon: 'ℹ' },
};

export default function Toast({ toasts }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] space-y-2 print:hidden">
      {toasts.map((t) => {
        const style = TOAST_STYLE[t.type] || TOAST_STYLE.info;
        return (
          <div
            key={t.id}
            className={`${style.bg} text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-bold max-w-sm animate-in slide-in-from-bottom-2`}
          >
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-black shrink-0">
              {style.icon}
            </span>
            <span className="flex-1">{t.message}</span>
          </div>
        );
      })}
    </div>
  );
}