'use client';

import { Icons } from '../helpers/icons';

export default function TabMenu({ 
  theme, menus, menuSearch, setMenuSearch, menuCategoryFilter, setMenuCategoryFilter,
  onOpenAddMenu, onOpenEditMenu, onDeleteMenu, onToggleStatus, onUpdateStock, rp 
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

  // Status stok: 0 = HABIS (rose), 1-5 = TIPIS (amber/kuning), >5 = NORMAL
  const getStockStatus = (stock) => {
    const s = Number(stock || 0);
    if (s === 0) return { 
      key: 'empty', label: 'Stok Habis', 
      wrap: theme === 'light' ? 'bg-rose-50 border-rose-300' : 'bg-rose-950/40 border-rose-700',
      num: 'text-rose-600',
      tag: 'bg-rose-500 text-white border-rose-600'
    };
    if (s <= 5) return { 
      key: 'low', label: 'Stok Tipis', 
      wrap: theme === 'light' ? 'bg-amber-50 border-amber-300' : 'bg-amber-950/30 border-amber-700',
      num: 'text-amber-700',
      tag: 'bg-amber-400 text-amber-900 border-amber-500'
    };
    return { 
      key: 'ok', label: 'Stok Cukup', 
      wrap: theme === 'light' ? 'bg-emerald-50 border-emerald-200' : 'bg-emerald-950/30 border-emerald-800',
      num: theme === 'light' ? 'text-emerald-700' : 'text-emerald-300',
      tag: 'bg-emerald-100 text-emerald-700 border-emerald-300'
    };
  };

  const btnAdjustClass = `w-9 h-9 rounded-lg font-black text-lg flex items-center justify-center transition-all active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed select-none ${theme === 'light' ? 'bg-white border-2 border-[#D4C5B8] text-[#2A1F17] hover:bg-[#F4EFE9]' : 'bg-slate-800 border-2 border-slate-600 text-white hover:bg-slate-700'}`;

  return (
    <div className="space-y-5">
      <div className={`rounded-[2rem] p-6 shadow-sm border-2 ${cardClass}`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className={`font-black text-xl ${textMainClass}`}>Manajemen Menu</h2>
            <p className={`text-xs font-bold mt-1 ${textSubClass}`}>Kelola menu, harga, dan stok Anda</p>
          </div>
          <button onClick={onOpenAddMenu} className="bg-[var(--primary-color)] hover:bg-[var(--primary-dark)] text-white font-extrabold px-5 py-2.5 rounded-xl text-sm shadow-md transition-all flex items-center gap-2">
            <span className="text-lg">+</span> Tambah Menu
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
          <input type="text" placeholder="Cari nama menu..." value={menuSearch} onChange={e => setMenuSearch(e.target.value)} className={inputClass} />
          <select value={menuCategoryFilter} onChange={e => setMenuCategoryFilter(e.target.value)} className={inputClass}>
            <option value="all">Semua Kategori</option>
            <option value="makanan">Makanan</option>
            <option value="minuman">Minuman</option>
            <option value="cemilan">Cemilan</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(m => {
          const stockStatus = getStockStatus(m.stock);
          return (
            <div key={m.id} className={`rounded-2xl p-4 shadow-sm border-2 flex flex-col ${cardClass}`}>
              <div className="w-full aspect-video rounded-xl overflow-hidden mb-3 relative border-2 border-slate-200">
                {m.image_url ? (
                  <img src={m.image_url} alt={m.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                    <Icons.Utensils />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                  <div className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${m.status === 'available' ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 'bg-rose-100 text-rose-700 border-rose-300'}`}>
                    {m.status === 'available' ? 'Tersedia' : 'Habis'}
                  </div>
                  {stockStatus.key !== 'ok' && (
                    <div className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${stockStatus.tag}`}>
                      {stockStatus.label}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <h3 className={`font-black text-base line-clamp-1 ${textMainClass}`}>{m.name}</h3>
                <p className={`text-xs font-bold uppercase tracking-wider mt-1 ${textSubClass}`}>{m.category}</p>
                <p className="font-black text-[var(--primary-color)] text-lg mt-2">{rp(m.price)}</p>
              </div>

              {/* ── KONTROL STOK ── */}
              <div className={`mt-3 rounded-xl border-2 p-2.5 ${stockStatus.wrap}`}>
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => onUpdateStock(m.id, m.stock, -1)}
                    disabled={Number(m.stock || 0) <= 0}
                    className={btnAdjustClass}
                    title="Kurangi stok"
                    type="button"
                  >−</button>

                  <div className="flex-1 text-center">
                    <div className={`text-[10px] font-black uppercase tracking-wider ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Stok</div>
                    <div className={`text-2xl font-black leading-tight ${stockStatus.num}`}>{m.stock || 0}</div>
                  </div>

                  <button
                    onClick={() => onUpdateStock(m.id, m.stock, +1)}
                    className={btnAdjustClass}
                    title="Tambah stok"
                    type="button"
                  >+</button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3">
                <button onClick={() => onOpenEditMenu(m)} className={`py-2 rounded-lg text-xs font-bold transition-colors border-2 ${theme === 'light' ? 'bg-[#F4EFE9] hover:bg-[#E8DFD3] border-[#D4C5B8] text-[#2A1F17]' : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-white'}`}>
                  Edit
                </button>
                <button onClick={() => onDeleteMenu(m.id)} className="py-2 rounded-lg text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 border-2 border-rose-200 transition-colors">
                  Hapus
                </button>
              </div>
              
              <button onClick={() => onToggleStatus(m)} className={`w-full mt-2 py-2 rounded-lg text-xs font-bold transition-colors border-2 ${m.status === 'available' ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'}`}>
                {m.status === 'available' ? 'Tandai Habis' : 'Tandai Tersedia'}
              </button>
            </div>
          );
        })}
      </div>
      
      {filtered.length === 0 && (
        <div className={`rounded-2xl p-10 text-center border-2 border-dashed ${theme === 'light' ? 'border-[#D4C5B8] bg-white' : 'border-slate-700 bg-slate-900'}`}>
          <p className={`font-bold ${textSubClass}`}>Tidak ada menu yang sesuai pencarian.</p>
        </div>
      )}
    </div>
  );
}