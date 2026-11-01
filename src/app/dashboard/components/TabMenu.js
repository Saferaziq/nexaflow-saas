'use client';

import { Icons } from '../helpers/icons';

export default function TabMenu({
  theme,
  menus,
  menuSearch,
  setMenuSearch,
  menuCategoryFilter,
  setMenuCategoryFilter,
  onAddMenu,
  onEditMenu,
  onDeleteMenu,
  onToggleStatus,
  rp,
}) {
  const textMainClass = theme === 'light' ? 'text-[#2A1F17]' : 'text-white';
  const textSubClass = theme === 'light' ? 'text-[#5C4B3E]' : 'text-slate-300';
  const cardClass = theme === 'light' ? 'bg-white border-2 border-[#D4C5B8]' : 'bg-slate-900 border-2 border-slate-700';
  const inputClass = `w-full border-2 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-[var(--primary-color)]/20 focus:border-[var(--primary-color)] ${theme === 'light' ? 'border-[#D4C5B8] bg-white text-[#2A1F17]' : 'border-slate-600 bg-slate-800 text-white'}`;

  const filteredMenus = menus.filter(m => {
    const matchSearch = !menuSearch || m.name.toLowerCase().includes(menuSearch.toLowerCase()) || (m.description || '').toLowerCase().includes(menuSearch.toLowerCase());
    const matchCat = menuCategoryFilter === 'all' || m.category === menuCategoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex gap-2 flex-1">
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5C4B3E]"><Icons.Search /></div>
            <input
              type="text"
              value={menuSearch}
              onChange={e => setMenuSearch(e.target.value)}
              placeholder="Cari menu..."
              className={`${inputClass} pl-11`}
            />
          </div>
          <select value={menuCategoryFilter} onChange={e => setMenuCategoryFilter(e.target.value)} className={`${inputClass} max-w-[160px]`}>
            <option value="all">Semua</option>
            <option value="makanan">Makanan</option>
            <option value="minuman">Minuman</option>
            <option value="cemilan">Cemilan</option>
          </select>
        </div>
        <button onClick={onAddMenu} className="bg-gradient-to-r from-[var(--primary-color)] to-[var(--primary-dark)] text-white font-extrabold py-3 px-6 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-[var(--primary-color)]/30 active:scale-95 border-2 border-[var(--primary-dark)]">
          <Icons.Plus /> Tambah Menu
        </button>
      </div>

      {filteredMenus.length === 0 ? (
        <div className={`rounded-[2rem] p-20 text-center shadow-sm border-2 ${cardClass}`}>
          <div className={`w-20 h-20 mx-auto mb-4 rounded-[1.5rem] flex items-center justify-center shadow-inner border-2 ${theme === 'light' ? 'bg-[#F4EFE9] border-[#D4C5B8]' : 'bg-slate-800 border-slate-600'}`}><Icons.Utensils /></div>
          <p className={`font-black text-xl ${textMainClass}`}>Belum ada menu</p>
          <p className={`text-sm font-semibold mt-1 ${textSubClass}`}>Klik "Tambah Menu" untuk memulai</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMenus.map(menu => (
            <div key={menu.id} className={`rounded-[2rem] overflow-hidden shadow-sm border-2 flex flex-col hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ${cardClass}`}>
              <div className={`aspect-video overflow-hidden ${theme === 'light' ? 'bg-[#F4EFE9]' : 'bg-slate-800'}`}>
                {menu.image_url
                  ? <img src={menu.image_url} className="w-full h-full object-cover" alt={menu.name} />
                  : <div className="w-full h-full flex items-center justify-center text-[#5C4B3E]"><Icons.Utensils /></div>}
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className={`font-black text-sm leading-tight ${textMainClass}`}>{menu.name}</h3>
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border-2 shrink-0 ${menu.status === 'available' ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 'bg-slate-200 text-slate-600 border-slate-300'}`}>
                    {menu.status === 'available' ? 'Tersedia' : 'Habis'}
                  </span>
                </div>
                <p className={`text-[11px] font-semibold mb-2 line-clamp-2 ${textSubClass}`}>{menu.description || 'Tidak ada deskripsi'}</p>
                <p className="text-base font-black text-[var(--primary-color)] mb-3">{rp(menu.price)}</p>
                <div className="mt-auto space-y-1.5">
                  <button onClick={() => onToggleStatus(menu)} className={`w-full text-xs font-bold py-2 rounded-lg border-2 transition-all ${theme === 'light' ? 'bg-[#F4EFE9] hover:bg-[#E8DFD3] border-[#D4C5B8] text-[#2A1F17]' : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-white'}`}>
                    {menu.status === 'available' ? 'Tandai Habis' : 'Tandai Tersedia'}
                  </button>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button onClick={() => onEditMenu(menu)} className="text-xs font-bold py-2 rounded-lg bg-[var(--primary-light)] text-[var(--primary-color)] border-2 border-[var(--primary-color)]/20 hover:bg-[var(--primary-color)] hover:text-white transition-all">Edit</button>
                    <button onClick={() => onDeleteMenu(menu.id)} className="text-xs font-bold py-2 rounded-lg bg-rose-100 text-rose-600 border-2 border-rose-300 hover:bg-rose-500 hover:text-white transition-all">Hapus</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}