'use client';

import { useState, useEffect, useRef } from 'react';
import { Icons } from '../helpers/icons';

export default function MenuModal({ theme, mode, initialData, onClose, onSave, onUploadImage }) {
  const [formData, setFormData] = useState({
    id: null, name: '', category: 'makanan', price: '', desc: '', status: 'available', image_url: '', stock: 0
  });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        id: initialData.id || null,
        name: initialData.name || '',
        category: initialData.category || 'makanan',
        price: initialData.price || '',
        desc: initialData.description || '',
        status: initialData.status || 'available',
        image_url: initialData.image_url || '',
        stock: initialData.stock || 0
      });
    } else {
      setFormData({
        id: null, name: '', category: 'makanan', price: '', desc: '', status: 'available', image_url: '', stock: 0
      });
    }
  }, [mode, initialData]);

  const textMainClass = theme === 'light' ? 'text-[#2A1F17]' : 'text-white';
  const textSubClass = theme === 'light' ? 'text-[#5C4B3E]' : 'text-slate-300';
  const inputClass = `w-full border-2 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-[var(--primary-color)]/20 focus:border-[var(--primary-color)] ${theme === 'light' ? 'border-[#D4C5B8] bg-white text-[#2A1F17]' : 'border-slate-600 bg-slate-800 text-white'}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;
    onSave(formData, (newData) => setFormData(newData));
    onClose();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    await onUploadImage(e, 'menu', setUploading, setFormData);
    setUploading(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className={`w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border-2 ${theme === 'light' ? 'bg-white border-[#D4C5B8]' : 'bg-slate-900 border-slate-700'} max-h-[90vh] flex flex-col`}>
        
        <div className={`p-5 border-b-2 flex justify-between items-center shrink-0 ${theme === 'light' ? 'border-[#E8DFD3]' : 'border-slate-700'}`}>
          <h2 className={`font-black text-xl ${textMainClass}`}>{mode === 'edit' ? 'Edit Menu' : 'Tambah Menu Baru'}</h2>
          <button onClick={onClose} className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-lg ${theme === 'light' ? 'bg-[#F4EFE9] text-[#5C4B3E] hover:bg-[#E8DFD3]' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>×</button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          <div>
            <label className={`block text-xs font-bold mb-2 ${textSubClass}`}>Foto Menu</label>
            <div className="flex items-center gap-4">
              <div className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex items-center justify-center shrink-0 ${theme === 'light' ? 'bg-[#F4EFE9] border-[#D4C5B8]' : 'bg-slate-800 border-slate-600'}`}>
                {formData.image_url ? <img src={formData.image_url} alt="Menu" className="w-full h-full object-cover" /> : <Icons.Utensils />}
              </div>
              <div className="flex-1">
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className={`w-full py-2.5 rounded-xl text-xs font-bold transition-colors border-2 ${theme === 'light' ? 'bg-[#F4EFE9] hover:bg-[#E8DFD3] border-[#D4C5B8] text-[#2A1F17]' : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-white'}`}>
                  {uploading ? 'Mengupload...' : 'Pilih Foto'}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={`block text-xs font-bold mb-2 ${textSubClass}`}>Nama Menu <span className="text-rose-500">*</span></label>
              <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className={inputClass} placeholder="Contoh: Nasi Goreng Spesial" required />
            </div>
            <div>
              <label className={`block text-xs font-bold mb-2 ${textSubClass}`}>Harga (Rp) <span className="text-rose-500">*</span></label>
              <input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className={inputClass} placeholder="15000" required />
            </div>
            <div>
              <label className={`block text-xs font-bold mb-2 ${textSubClass}`}>Stok Tersedia</label>
              <input type="number" min="0" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} className={inputClass} placeholder="0" />
            </div>
            <div className="col-span-2">
              <label className={`block text-xs font-bold mb-2 ${textSubClass}`}>Kategori</label>
              <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className={inputClass}>
                <option value="makanan">Makanan</option>
                <option value="minuman">Minuman</option>
                <option value="cemilan">Cemilan</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className={`block text-xs font-bold mb-2 ${textSubClass}`}>Deskripsi (Opsional)</label>
              <textarea value={formData.desc} onChange={e => setFormData({ ...formData, desc: e.target.value })} className={`${inputClass} resize-none`} rows="2" placeholder="Deskripsi singkat menu..."></textarea>
            </div>
          </div>
        </div>

        <div className={`p-5 border-t-2 flex gap-3 shrink-0 ${theme === 'light' ? 'border-[#E8DFD3]' : 'border-slate-700'}`}>
          <button onClick={onClose} className={`flex-1 py-3 rounded-xl font-bold text-sm border-2 ${theme === 'light' ? 'bg-white border-[#D4C5B8] text-[#5C4B3E] hover:bg-[#F4EFE9]' : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700'}`}>Batal</button>
          <button onClick={handleSubmit} disabled={uploading || !formData.name || !formData.price} className="flex-[2] bg-[var(--primary-color)] text-white font-black py-3 rounded-xl text-sm shadow-md active:scale-95 transition-transform disabled:opacity-50">Simpan Menu</button>
        </div>
      </div>
    </div>
  );
}