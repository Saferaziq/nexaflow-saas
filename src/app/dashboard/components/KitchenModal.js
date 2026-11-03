'use client';

export default function KitchenModal({ theme, url, pin, onClose, showToast }) {
  const textMainClass = theme === 'light' ? 'text-[#2A1F17]' : 'text-white';
  const textSubClass = theme === 'light' ? 'text-[#5C4B3E]' : 'text-slate-300';
  const cardClass = theme === 'light' ? 'bg-white border-[#D4C5B8]' : 'bg-slate-900 border-slate-700';

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(url);
      if (showToast) showToast('Link berhasil disalin!', 'success');
    } catch (e) {
      if (showToast) showToast('Gagal menyalin link', 'error');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className={`w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border-2 ${cardClass}`}>
        
        <div className={`p-5 border-b-2 flex justify-between items-center ${theme === 'light' ? 'border-[#E8DFD3]' : 'border-slate-700'}`}>
          <h2 className={`font-black text-lg ${textMainClass}`}>Layar Dapur (KDS)</h2>
          <button onClick={onClose} className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-lg ${theme === 'light' ? 'bg-[#F4EFE9] text-[#5C4B3E] hover:bg-[#E8DFD3]' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>×</button>
        </div>

        <div className="p-6 flex flex-col items-center text-center">
          <p className={`text-xs font-bold mb-4 ${textSubClass}`}>
            Scan QR Code ini dengan HP/Tablet dapur Anda untuk membuka Kitchen Display System.
          </p>

          <div className={`p-3 rounded-2xl mb-4 border-2 ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-800 border-slate-600'}`}>
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`} 
              alt="QR KDS" 
              className="w-48 h-48 rounded-lg" 
            />
          </div>

          <div className={`w-full rounded-xl p-3 mb-4 border-2 ${theme === 'light' ? 'bg-[#F4EFE9] border-[#D4C5B8]' : 'bg-slate-800 border-slate-600'}`}>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${textSubClass}`}>PIN Akses</p>
            <p className={`text-3xl font-black tracking-[0.5em] ${textMainClass}`}>{pin}</p>
          </div>

          <div className="flex w-full gap-2">
            <button 
              onClick={handleCopy} 
              className={`flex-1 py-3 rounded-xl font-bold text-xs border-2 transition-colors ${theme === 'light' ? 'bg-white border-[#D4C5B8] text-[#2A1F17] hover:bg-[#F4EFE9]' : 'bg-slate-800 border-slate-600 text-white hover:bg-slate-700'}`}
            >
              Salin Link
            </button>
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex-1 py-3 rounded-xl font-bold text-xs bg-[var(--primary-color)] text-white border-2 border-[var(--primary-dark)] flex items-center justify-center hover:bg-[var(--primary-dark)] transition-colors"
            >
              Buka KDS
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}