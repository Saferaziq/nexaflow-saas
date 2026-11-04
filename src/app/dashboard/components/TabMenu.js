'use client';

import { Icons } from '../helpers/icons';

export default function TabMenu({ 
  theme, menus, menuSearch, setMenuSearch, menuCategoryFilter, setMenuCategoryFilter,
  onOpenAddMenu, onOpenEditMenu, onDeleteMenu, onToggleStatus, rp 
}) {
  const textMainClass = theme === 'light' ? 'text-[#2A1F17]' : 'text-white';
  const textSubClass = theme === 'light' ? 'text-[#5C4B3E]' : 'text-slate-300';
  const cardClass = theme === 'light' ? 'bg-white border-2 border-[#D4C5B8]' : 'bg-slate-900 border-2 border-slate-700';
  const inputClass = `w-full border-2 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-[var(--primary-color)]/20 focus:border-[var(--primary-color)] ${theme === 'light' ? 'border-[#D4C5B8] bg-white text-[#2A1F17]' : 'border-slate-600 bg-slate-800 text-white'}`;

  const filtered = menus.filter(m => {
    const matchSearch = !menuSearch || m.name.toLowerCase().includes(menuSearch.toLowerCase());
    const matchCat = menuCategoryFilter === 'all' || m.category === menuCategoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-5">
      <div className={`rounded-[2rem] p-6 shadow-sm border-2 ${cardClass}`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className={`font-black text-xl ${textMainClass}`}>Manajemen Menu</h2>
            <p className={`text-xs font-bold mt-1 ${textSubClass}`}>Kelola menu makanan dan minuman Anda</p>
          </div>
          <button onClick={onOpenAddMenu} className="bg-[var(--primary-color)] hover:bg-[var(--primary-dark)] text-white font-extrabold px-5 py-2.5 rounded-xl text-sm shadow-md transition-all flex items-center gap-2">
            <span className="text-lg">+</span> Tambah Menu
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
          <input 
            type="text" 
            placeholder="Cari nama menu..." 
            value={menuSearch} 
            onChange={e => setMenuSearch(e.target.value)} 
            className={inputClass} 
          />
          <select 
            value={menuCategoryFilter} 
            onChange={e => setMenuCategoryFilter(e.target.value)} 
            className={inputClass}
          >
            <option value="all">Semua Kategori</option>
            <option value="makanan">Makanan</option>
            <option value="minuman">Minuman</option>
            <option value="cemilan">Cemilan</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(m => (
          <div key={m.id} className={`rounded-2xl p-4 shadow-sm border-2 flex flex-col ${cardClass}`}>
            <div className="w-full aspect-video rounded-xl overflow-hidden mb-3 relative border-2 border-slate-200">
              {m.image_url ? (
                <img src={m.image_url} alt={m.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                  <Icons.Utensils />
                </div>
              )}
              {/* TAMPILAN STOK & STATUS */}
              <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                <div className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${m.status === 'available' ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' : 'bg-rose-100 text-rose-700 border border-rose-300'}`}>
                  {m.status === 'available' ? 'Tersedia' : 'Habis'}
                </div>
                <div className="bg-slate-800 text-white px-2.5 py-1 rounded-full text-[10px] font-black border border-slate-600">
                  Stok: {m.stock || 0}
                </div>
              </div>
            </div>

            <div className="flex-1">
              <h3 className={`font-black text-base line-clamp-1 ${textMainClass}`}>{m.name}</h3>
              <p className={`text-xs font-bold uppercase tracking-wider mt-1 ${textSubClass}`}>{m.category}</p>
              <p className="font-black text-[var(--primary-color)] text-lg mt-2">{rp(m.price)}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <button 
                onClick={() => onOpenEditMenu(m)} 
                className={`py-2 rounded-lg text-xs font-bold transition-colors border-2 ${theme === 'light' ? 'bg-[#F4EFE9] hover:bg-[#E8DFD3] border-[#D4C5B8] text-[#2A1F17]' : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-white'}`}
              >
                Edit
              </button>
              <button 
                onClick={() => onDeleteMenu(m.id)} 
                className="py-2 rounded-lg text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 border-2 border-rose-200 transition-colors"
              >
                Hapus
              </button>
            </div>
            
            <button 
              onClick={() => onToggleStatus(m)} 
              className={`w-full mt-2 py-2 rounded-lg text-xs font-bold transition-colors border-2 ${m.status === 'available' ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'}`}
            >
              {m.status === 'available' ? 'Tandai Habis' : 'Tandai Tersedia'}
            </button>
          </div>
        ))}
      </div>
      
      {filtered.length === 0 && (
        <div className={`rounded-2xl p-10 text-center border-2 border-dashed ${theme === 'light' ? 'border-[#D4C5B8] bg-white' : 'border-slate-700 bg-slate-900'}`}>
          <p className={`font-bold ${textSubClass}`}>Tidak ada menu yang sesuai pencarian.</p>
        </div>
      )}
    </div>
  );
}