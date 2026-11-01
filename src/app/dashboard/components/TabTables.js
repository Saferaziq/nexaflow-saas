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
      <form onSubmit={onAddTable} className={`rounded-[2rem] p-6 shadow-sm border-2 ${cardClass}`}>
        <h3 className={`font-black text-lg mb-3 ${textMainClass}`}>Tambah Meja Baru</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTableNum}
            onChange={e => setNewTableNum(e.target.value)}
            placeholder="Nomor meja (contoh: 01, A1)"
            className={inputClass}
          />
          <button type="submit" className="bg-gradient-to-r from-[var(--primary-color)] to-[var(--primary-dark)] text-white font-extrabold py-3 px-6 rounded-xl text-sm flex items-center gap-2 shadow-lg active:scale-95 border-2 border-[var(--primary-dark)] whitespace-nowrap">
            <Icons.Plus /> Tambah
          </button>
        </div>
      </form>

      {tables.length === 0 ? (
        <div className={`rounded-[2rem] p-20 text-center shadow-sm border-2 ${cardClass}`}>
          <div className={`w-20 h-20 mx-auto mb-4 rounded-[1.5rem] flex items-center justify-center shadow-inner border-2 ${theme === 'light' ? 'bg-[#F4EFE9] border-[#D4C5B8]' : 'bg-slate-800 border-slate-600'}`}><Icons.Grid /></div>
          <p className={`font-black text-xl ${textMainClass}`}>Belum ada meja</p>
          <p className={`text-sm font-semibold mt-1 ${textSubClass}`}>Tambahkan meja untuk memulai</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {tables.map(table => (
            <div key={table.id} className={`rounded-2xl p-4 shadow-sm border-2 flex flex-col items-center gap-2 hover:-translate-y-1 hover:shadow-lg transition-all ${cardClass}`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black ${theme === 'light' ? 'bg-[#F4EFE9] text-[var(--primary-color)]' : 'bg-slate-800 text-[var(--primary-color)]'}`}>
                {table.table_number}
              </div>
              <div className="flex gap-1.5 w-full">
                <button onClick={() => onPrintQR(table)} title="Cetak QR" className={`flex-1 text-xs font-bold py-2 rounded-lg border-2 transition-all ${theme === 'light' ? 'bg-[#F4EFE9] hover:bg-[#E8DFD3] border-[#D4C5B8] text-[#2A1F17]' : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-white'}`}>
                  <Icons.Print />
                </button>
                <button onClick={() => onDeleteTable(table.id)} title="Hapus" className="flex-1 text-xs font-bold py-2 rounded-lg bg-rose-100 text-rose-600 border-2 border-rose-300 hover:bg-rose-500 hover:text-white transition-all">
                  <Icons.X />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}