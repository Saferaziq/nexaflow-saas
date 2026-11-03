'use client';
import { Icons } from '../helpers/icons';

export default function TabTables({
  theme,
  tables,
  newTableNum,
  setNewTableNum,
  onAddTable,
  onDeleteTable,
  onPrintQR,
}) {
  const textMainClass = theme === 'light' ? 'text-[#2A1F17]' : 'text-white';
  const textSubClass = theme === 'light' ? 'text-[#5C4B3E]' : 'text-slate-300';
  const cardClass = theme === 'light' ? 'bg-white border-2 border-[#D4C5B8]' : 'bg-slate-900 border-2 border-slate-700';
  const inputClass = `w-full border-2 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-[var(--primary-color)]/20 focus:border-[var(--primary-color)] ${theme === 'light' ? 'border-[#D4C5B8] bg-white text-[#2A1F17]' : 'border-slate-600 bg-slate-800 text-white'}`;

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
          <div className={`w-20 h-20 mx-auto mb-4 rounded-[1.5rem] flex items-center justify-center shadow-inner border-2 ${theme === 'light' ? 'bg-[#F4EFE9] border-[#D4C5B8]' : 'bg-slate-800 border-slate-600'}`}><Icons.Utensils /></div>
          <p className={`font-black text-xl ${textMainClass}`}>Belum ada meja</p>
          <p className={`text-sm font-semibold mt-1 ${textSubClass}`}>Tambahkan meja pertama Anda di atas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {tables.map((table) => (
            <div key={table.id} className={`rounded-2xl p-4 flex flex-col items-center justify-center relative shadow-sm border-2 ${cardClass}`}>
              <span className={`text-3xl font-black mb-3 ${textMainClass}`}>{table.table_number}</span>
              
              <div className="flex gap-2 w-full mt-auto">
                <button onClick={() => onPrintQR(table)} className="flex-1 bg-slate-100 text-slate-700 font-bold py-2 rounded-lg border-2 border-slate-300 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1" title="Cetak QR">
                  <Icons.Printer />
                </button>
                <button onClick={() => onDeleteTable(table.id)} className="bg-rose-100 text-rose-600 font-bold py-2 px-3 rounded-lg border-2 border-rose-300 hover:bg-rose-500 hover:text-white transition-colors flex items-center justify-center" title="Hapus Meja">
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}