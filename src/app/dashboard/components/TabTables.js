'use client';

import { Icons } from '../helpers/icons';

export default function TabTables({
  theme,
  tables,
  newTableNum,
  setNewTableNum,
  onAddTable,
  onDeleteTable,
  onDownloadQR,
  baseUrl,
  tenantId,
}) {
  const isLight = theme === 'light';
  const textMainClass = isLight ? 'text-[#2A1F17]' : 'text-white';
  const textSubClass = isLight ? 'text-[#5C4B3E]' : 'text-slate-300';
  const cardClass = isLight ? 'bg-white border-2 border-[#D4C5B8]' : 'bg-slate-900 border-2 border-slate-700';
  const inputClass = `w-full border-2 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-[var(--primary-color)]/20 focus:border-[var(--primary-color)] ${isLight ? 'border-[#D4C5B8] bg-white text-[#2A1F17]' : 'border-slate-600 bg-slate-800 text-white placeholder-slate-400'}`;

  return (
    <div className="space-y-4">
      <div className={`p-4 rounded-2xl border-2 ${cardClass}`}>
        <h3 className={`font-black text-sm mb-3 ${textMainClass}`}>Tambah Meja Baru</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTableNum}
            onChange={(e) => setNewTableNum(e.target.value)}
            placeholder="Nomor meja (contoh: 01, A1)"
            className={inputClass}
          />
          <button
            onClick={() => onAddTable(newTableNum, setNewTableNum)}
            className="bg-[var(--primary-color)] text-white font-bold px-6 rounded-xl hover:bg-[var(--primary-dark)] transition-colors whitespace-nowrap"
          >
            + Tambah
          </button>
        </div>
      </div>

      {tables.length === 0 ? (
        <div className={`rounded-[2rem] p-20 text-center shadow-sm border-2 ${cardClass}`}>
          <div className={`w-20 h-20 mx-auto mb-4 rounded-[1.5rem] flex items-center justify-center shadow-inner border-2 ${isLight ? 'bg-[#F4EFE9] border-[#D4C5B8] text-[#3A2A20]' : 'bg-slate-800 border-slate-600 text-slate-200'}`}>
            <Icons.Grid />
          </div>
          <p className={`font-black text-xl ${textMainClass}`}>Belum ada meja</p>
          <p className={`text-sm font-semibold mt-1 ${textSubClass}`}>Tambahkan meja pertama Anda di atas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tables.map((table) => {
            const orderUrl = `${baseUrl}/order?tenant=${tenantId}&table=${table.table_number}`;
            const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(orderUrl)}`;

            return (
              <div key={table.id} className={`rounded-2xl p-4 flex flex-col items-center justify-center relative shadow-sm border-2 ${cardClass}`}>
                <span className={`text-2xl font-black mb-3 ${textMainClass}`}>Meja {table.table_number}</span>

                <div className={`p-2 bg-white rounded-xl border-2 mb-3 ${isLight ? 'border-[#D4C5B8]' : 'border-slate-600'}`}>
                  <img
                    src={qrImageUrl}
                    alt={`QR Meja ${table.table_number}`}
                    className="w-32 h-32 object-contain"
                  />
                </div>

                <div className="flex gap-2 w-full mt-auto">
                  <button
                    onClick={() => onDownloadQR(table)}
                    className={`flex-1 font-bold py-2 rounded-lg border-2 transition-colors flex items-center justify-center gap-1.5 text-xs ${
                      isLight
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-emerald-950/50 text-emerald-300 border-emerald-700 hover:bg-emerald-900/60'
                    }`}
                    title="Simpan QR"
                  >
                    <Icons.Download />
                    <span>Simpan</span>
                  </button>
                  <button
                    onClick={() => onDeleteTable(table.id)}
                    className={`font-bold py-2 px-3 rounded-lg border-2 transition-colors flex items-center justify-center ${
                      isLight
                        ? 'bg-rose-100 text-rose-600 border-rose-300 hover:bg-rose-500 hover:text-white'
                        : 'bg-rose-950/50 text-rose-300 border-rose-700 hover:bg-rose-600 hover:text-white'
                    }`}
                    title="Hapus Meja"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
