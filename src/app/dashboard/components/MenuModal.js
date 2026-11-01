'use client';

import { useRef } from 'react';
import { Icons } from '../helpers/icons';

export default function MenuModal({
  theme,
  open,
  currentMenu,
  setCurrentMenu,
  onClose,
  onSave,
  onUploadImage,
  uploading,
}) {
  const fileInputRef = useRef(null);
  if (!open) return null;

  const textMainClass = theme === 'light' ? 'text-[#2A1F17]' : 'text-white';
  const textSubClass = theme === 'light' ? 'text-[#5C4B3E]' : 'text-slate-300';
  const inputClass = `w-full border-2 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-[var(--primary-color)]/20 focus:border-[var(--primary-color)] ${theme === 'light' ? 'border-[#D4C5B8] bg-white text-[#2A1F17]' : 'border-slate-600 bg-slate-800 text-white'}`;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 print:hidden">
      <div className={`rounded-[2rem] max-w-3xl w-full p-8 sm:p-10 shadow-2xl max-h-[90vh] overflow-y-auto border-2 animate-in zoom-in-95 ${theme === 'light' ? 'bg-white border-[#D4C5B8]' : 'bg-slate-900 border-slate-700'}`}>

        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className={`font-black text-2xl ${textMainClass}`}>{currentMenu.id ? 'Edit Menu' : 'Tambah Menu'}</h3>
            <p className={`text-sm font-semibold mt-1 ${textSubClass}`}>Isi informasi menu baru</p>
          </div>
          <button onClick={onClose} className={`w-10 h-10 rounded-full font-bold flex items-center justify-center transition-colors border-2 ${theme === 'light' ? 'bg-[#F4EFE9] hover:bg-[#E8DFD3] border-[#D4C5B8] text-[#2A1F17]' : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-300'}`}>
            <Icons.X />
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-6">

          {/* Foto Menu */}
          <div>
            <label className={`block text-sm font-bold mb-2 ${textSubClass}`}>Foto Menu</label>
            <div className="flex items-center gap-6">
              <div className={`w-32 h-32 rounded-2xl overflow-hidden flex items-center justify-center border-2 ${theme === 'light' ? 'bg-[#F4EFE9] border-[#D4C5B8]' : 'bg-slate-800 border-slate-600'}`}>
                {currentMenu.image_url
                  ? <img src={currentMenu.image_url} className="w-full h-full object-cover" alt="Menu" />
                  : <Icons.Utensils />}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={e => onUploadImage(e, 'menu')}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full py-3 rounded-xl text-sm font-extrabold transition-colors border-2 ${theme === 'light' ? 'bg-[#F4EFE9] hover:bg-[#E8DFD3] border-[#D4C5B8] text-[#2A1F17]' : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-white'}`}
                >
                  {uploading ? 'Mengupload...' : 'Pilih Foto'}
                </button>
              </div>
            </div>
          </div>

          {/* Nama & Harga */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-bold mb-2 ${textSubClass}`}>Nama Menu</label>
              <input
                required
                type="text"
                value={currentMenu.name}
                onChange={e => setCurrentMenu({ ...currentMenu, name: e.target.value })}
                className={inputClass}
                placeholder="Contoh: Nasi Goreng Spesial"
              />
            </div>
            <div>
              <label className={`block text-sm font-bold mb-2 ${textSubClass}`}>Harga (Rp)</label>
              <input
                required
                type="number"
                value={currentMenu.price}
                onChange={e => setCurrentMenu({ ...currentMenu, price: e.target.value })}
                className={inputClass}
                placeholder="25000"
              />
            </div>
          </div>

          {/* Kategori */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-bold mb-2 ${textSubClass}`}>Kategori</label>
              <select
                value={currentMenu.category}
                onChange={e => setCurrentMenu({ ...currentMenu, category: e.target.value })}
                className={inputClass}
              >
                <option value="makanan">Makanan</option>
                <option value="minuman">Minuman</option>
                <option value="cemilan">Cemilan</option>
              </select>
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <label className={`block text-sm font-bold mb-2 ${textSubClass}`}>Deskripsi</label>
            <textarea
              value={currentMenu.desc}
              onChange={e => setCurrentMenu({ ...currentMenu, desc: e.target.value })}
              className={inputClass}
              rows="3"
              placeholder="Deskripsi singkat menu"
            ></textarea>
          </div>

          {/* Actions */}
          <div className={`flex gap-3 pt-4 border-t-2 border-dashed ${theme === 'light' ? 'border-[#D4C5B8]' : 'border-slate-700'}`}>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-[var(--primary-color)] to-[var(--primary-dark)] text-white font-extrabold py-3.5 rounded-xl text-base shadow-lg shadow-[var(--primary-color)]/30 active:scale-95 transition-all border-2 border-[var(--primary-dark)]"
            >
              Simpan Menu
            </button>
            <button
              type="button"
              onClick={onClose}
              className={`font-extrabold px-8 py-3.5 rounded-xl text-base transition-colors border-2 ${theme === 'light' ? 'bg-[#F4EFE9] hover:bg-[#E8DFD3] border-[#D4C5B8] text-[#2A1F17]' : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-white'}`}
            >
              Batal
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}