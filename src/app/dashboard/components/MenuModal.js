'use client';

import { useState, useEffect, useRef } from 'react';
import { Icons } from '../helpers/icons';

const PRESET_DURATIONS = [
  { label: 'Tanpa Batas', value: 'unlimited' },
  { label: '1 Jam', value: '1' },
  { label: '2 Jam', value: '2' },
  { label: '3 Jam', value: '3' },
  { label: '6 Jam', value: '6' },
  { label: '12 Jam', value: '12' },
  { label: '24 Jam', value: '24' },
];

export default function MenuModal({ theme, mode, initialData, onClose, onSave, onUploadImage }) {
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    category: 'makanan',
    price: '',
    cost_price: '',
    desc: '',
    status: 'available',
    image_url: '',
    stock: 0,
    is_featured: false,
    is_new: false,
    discount_price: '',
    promo_duration_mode: 'unlimited',
    promo_duration_hours: '3',
    existing_promo_expires_at: null,
  });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      const hasActiveExpiry =
        initialData.promo_expires_at &&
        new Date(initialData.promo_expires_at).getTime() > Date.now();

      setFormData({
        id: initialData.id || null,
        name: initialData.name || '',
        category: initialData.category || 'makanan',
        price: initialData.price || '',
        cost_price: initialData.cost_price ? String(initialData.cost_price) : '',
        desc: initialData.description || '',
        status: initialData.status || 'available',
        image_url: initialData.image_url || '',
        stock: initialData.stock || 0,
        is_featured: initialData.is_featured || false,
        is_new: initialData.is_new || false,
        discount_price: initialData.discount_price || '',
        promo_duration_mode: hasActiveExpiry ? 'keep' : 'unlimited',
        promo_duration_hours: '3',
        existing_promo_expires_at: hasActiveExpiry ? initialData.promo_expires_at : null,
      });
    } else {
      setFormData({
        id: null,
        name: '',
        category: 'makanan',
        price: '',
        cost_price: '',
        desc: '',
        status: 'available',
        image_url: '',
        stock: 0,
        is_featured: false,
        is_new: false,
        discount_price: '',
        promo_duration_mode: 'unlimited',
        promo_duration_hours: '3',
        existing_promo_expires_at: null,
      });
    }
  }, [mode, initialData]);

  const textMainClass = theme === 'light' ? 'text-[#2A1F17]' : 'text-white';
  const textSubClass = theme === 'light' ? 'text-[#5C4B3E]' : 'text-slate-300';
  const inputClass = `w-full border-2 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-[var(--primary-color)]/20 focus:border-[var(--primary-color)] ${
    theme === 'light'
      ? 'border-[#D4C5B8] bg-white text-[#2A1F17]'
      : 'border-slate-600 bg-slate-800 text-white'
  }`;

  const sellNum = parseFloat(formData.price) || 0;
  const costNum = parseFloat(formData.cost_price) || 0;
  const discountNum = parseFloat(formData.discount_price) || 0;
  const effectiveSell = discountNum > 0 && discountNum < sellNum ? discountNum : sellNum;
  const profitPerPortion = effectiveSell - costNum;
  const marginPercent = effectiveSell > 0 ? ((profitPerPortion / effectiveSell) * 100).toFixed(1) : '0.0';
  const isLossOnPromo = discountNum > 0 && costNum > 0 && discountNum < costNum;

  const hasPromoActiveInForm =
    Boolean(formData.discount_price && Number(formData.discount_price) > 0) ||
    Boolean(formData.is_featured);

  const computedPreviewExpiry = (() => {
    if (!hasPromoActiveInForm) return null;
    if (formData.promo_duration_mode === 'keep' && formData.existing_promo_expires_at) {
      return new Date(formData.existing_promo_expires_at);
    }
    if (formData.promo_duration_mode === 'preset' || formData.promo_duration_mode === 'custom') {
      const hrs = parseFloat(formData.promo_duration_hours);
      if (!Number.isNaN(hrs) && hrs > 0) {
        return new Date(Date.now() + hrs * 3600 * 1000);
      }
    }
    return null;
  })();

  const handleSelectPreset = (val) => {
    if (val === 'unlimited') {
      setFormData((prev) => ({
        ...prev,
        promo_duration_mode: 'unlimited',
        existing_promo_expires_at: null,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        promo_duration_mode: 'preset',
        promo_duration_hours: val,
      }));
    }
  };

  const handleStopPromo = () => {
    setFormData((prev) => ({
      ...prev,
      discount_price: '',
      is_featured: false,
      promo_duration_mode: 'unlimited',
      existing_promo_expires_at: null,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    let promo_expires_at = null;
    if (hasPromoActiveInForm) {
      if (formData.promo_duration_mode === 'keep' && formData.existing_promo_expires_at) {
        promo_expires_at = formData.existing_promo_expires_at;
      } else if (
        formData.promo_duration_mode === 'preset' ||
        formData.promo_duration_mode === 'custom'
      ) {
        const hrs = parseFloat(formData.promo_duration_hours);
        if (!Number.isNaN(hrs) && hrs > 0) {
          promo_expires_at = new Date(Date.now() + hrs * 3600 * 1000).toISOString();
        }
      }
    }

    onSave(
      {
        ...formData,
        promo_expires_at,
      },
      (newData) => setFormData(newData)
    );
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
      <div
        className={`w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border-2 ${
          theme === 'light' ? 'bg-white border-[#D4C5B8]' : 'bg-slate-900 border-slate-700'
        } max-h-[90vh] flex flex-col`}
      >
        <div
          className={`p-5 border-b-2 flex justify-between items-center shrink-0 ${
            theme === 'light' ? 'border-[#E8DFD3]' : 'border-slate-700'
          }`}
        >
          <h2 className={`font-black text-xl ${textMainClass}`}>
            {mode === 'edit' ? 'Edit Menu' : 'Tambah Menu Baru'}
          </h2>
          <button
            onClick={onClose}
            className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-lg ${
              theme === 'light'
                ? 'bg-[#F4EFE9] text-[#5C4B3E] hover:bg-[#E8DFD3]'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            ×
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          <div>
            <label className={`block text-xs font-bold mb-2 ${textSubClass}`}>Foto Menu</label>
            <div className="flex items-center gap-4">
              <div
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex items-center justify-center shrink-0 ${
                  theme === 'light'
                    ? 'bg-[#F4EFE9] border-[#D4C5B8]'
                    : 'bg-slate-800 border-slate-600'
                }`}
              >
                {formData.image_url ? (
                  <img src={formData.image_url} alt="Menu" className="w-full h-full object-cover" />
                ) : (
                  <Icons.Utensils />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-colors border-2 ${
                    theme === 'light'
                      ? 'bg-[#F4EFE9] hover:bg-[#E8DFD3] border-[#D4C5B8] text-[#2A1F17]'
                      : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-white'
                  }`}
                >
                  {uploading ? 'Mengupload...' : 'Pilih Foto'}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={`block text-xs font-bold mb-2 ${textSubClass}`}>
                Nama Menu <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={inputClass}
                placeholder="Contoh: Nasi Goreng Spesial"
                required
              />
            </div>

            <div>
              <label className={`block text-xs font-bold mb-2 ${textSubClass}`}>
                Harga Jual (Rp) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className={inputClass}
                placeholder="15000"
                required
              />
            </div>

            <div>
              <label className={`block text-xs font-bold mb-2 ${textSubClass}`}>
                Harga Modal / HPP (Rp)
              </label>
              <input
                type="number"
                min="0"
                value={formData.cost_price}
                onChange={(e) => setFormData({ ...formData, cost_price: e.target.value })}
                className={inputClass}
                placeholder="Opsional, misal 7000"
              />
            </div>

            {/* KALKULATOR MARGIN REAL-TIME */}
            {sellNum > 0 && costNum > 0 && (
              <div
                className={`col-span-2 p-3 rounded-xl border-2 flex items-center justify-between gap-2 ${
                  isLossOnPromo || profitPerPortion < 0
                    ? theme === 'light'
                      ? 'bg-rose-50 border-rose-300 text-rose-800'
                      : 'bg-rose-950/40 border-rose-700 text-rose-200'
                    : theme === 'light'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-emerald-950/40 border-emerald-700 text-emerald-200'
                }`}
              >
                <div>
                  <p className="text-[11px] font-black uppercase tracking-wider">
                    {isLossOnPromo
                      ? 'Peringatan: Harga Diskon Di Bawah Modal!'
                      : discountNum > 0 && discountNum < sellNum
                      ? 'Estimasi Laba Saat Promo'
                      : 'Estimasi Laba Bersih / Porsi'}
                  </p>
                  <p className="text-xs font-bold opacity-85 mt-0.5">
                    Jual Rp {effectiveSell.toLocaleString('id-ID')} − Modal Rp{' '}
                    {costNum.toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-black">
                    {profitPerPortion >= 0 ? '+' : ''}Rp{' '}
                    {profitPerPortion.toLocaleString('id-ID')}
                  </p>
                  <p className="text-[11px] font-black">Margin {marginPercent}%</p>
                </div>
              </div>
            )}

            <div>
              <label className={`block text-xs font-bold mb-2 ${textSubClass}`}>Stok Tersedia</label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className={inputClass}
                placeholder="0"
              />
            </div>

            <div>
              <label className={`block text-xs font-bold mb-2 ${textSubClass}`}>Kategori</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className={inputClass}
              >
                <option value="makanan">Makanan</option>
                <option value="minuman">Minuman</option>
                <option value="cemilan">Cemilan</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className={`block text-xs font-bold mb-2 ${textSubClass}`}>
                Deskripsi (Opsional)
              </label>
              <textarea
                value={formData.desc}
                onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                className={`${inputClass} resize-none`}
                rows="2"
                placeholder="Deskripsi singkat menu..."
              ></textarea>
            </div>
          </div>

          {/* STATUS & PROMOSI */}
          <div
            className={`col-span-2 p-4 rounded-2xl border-2 space-y-4 ${
              theme === 'light'
                ? 'bg-[#F4EFE9] border-[#D4C5B8]'
                : 'bg-slate-800 border-slate-600'
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className={`font-black text-sm uppercase tracking-wide ${textMainClass}`}>
                Status & Promosi
              </h3>
              {hasPromoActiveInForm && (
                <button
                  type="button"
                  onClick={handleStopPromo}
                  className="text-[11px] font-black text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1 rounded-lg transition-colors"
                >
                  Hentikan Promo
                </button>
              )}
            </div>

            {/* Switch Unggulan */}
            <div className="flex justify-between items-center">
              <div>
                <p className={`text-sm font-bold flex items-center gap-1.5 ${textMainClass}`}>
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[var(--primary-color)]">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  Menu Unggulan
                </p>
                <p className={`text-xs mt-0.5 ${textSubClass}`}>
                  Tampil paling atas di halaman pelanggan
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="sr-only peer"
                />
                <div
                  className={`w-11 h-6 rounded-full peer after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full ${
                    theme === 'light'
                      ? 'bg-[#D4C5B8] peer-checked:bg-[var(--primary-color)]'
                      : 'bg-slate-600 peer-checked:bg-[var(--primary-color)]'
                  }`}
                ></div>
              </label>
            </div>

            {/* Switch Baru */}
            <div className="flex justify-between items-center">
              <div>
                <p className={`text-sm font-bold flex items-center gap-1.5 ${textMainClass}`}>
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-emerald-500">
                    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                  </svg>
                  Menu Baru
                </p>
                <p className={`text-xs mt-0.5 ${textSubClass}`}>
                  Beri label &quot;BARU&quot; pada foto menu
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_new}
                  onChange={(e) => setFormData({ ...formData, is_new: e.target.checked })}
                  className="sr-only peer"
                />
                <div
                  className={`w-11 h-6 rounded-full peer after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full ${
                    theme === 'light'
                      ? 'bg-[#D4C5B8] peer-checked:bg-emerald-500'
                      : 'bg-slate-600 peer-checked:bg-emerald-500'
                  }`}
                ></div>
              </label>
            </div>

            {/* Input Harga Diskon */}
            <div className="pt-2">
              <label className={`block text-xs font-bold mb-2 ${textSubClass}`}>
                Harga Diskon (Rp){' '}
                <span className="text-slate-400 font-normal">- Opsional</span>
              </label>
              <input
                type="number"
                min="0"
                value={formData.discount_price}
                onChange={(e) => setFormData({ ...formData, discount_price: e.target.value })}
                className={`${inputClass} ${
                  formData.discount_price
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20 text-rose-600'
                    : ''
                }`}
                placeholder="Kosongkan jika tidak ada diskon"
              />
            </div>

            {/* PENGATURAN DURASI WAKTU PROMO */}
            {hasPromoActiveInForm && (
              <div
                className={`pt-3 border-t-2 space-y-3 ${
                  theme === 'light' ? 'border-[#E0D6CC]' : 'border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <label className={`text-xs font-black uppercase tracking-wide ${textMainClass}`}>
                    Durasi Waktu Promo
                  </label>
                  <span className={`text-[11px] font-bold ${textSubClass}`}>
                    Otomatis kembali normal saat habis
                  </span>
                </div>

                {formData.existing_promo_expires_at && (
                  <div
                    className={`p-3 rounded-xl border-2 flex items-center justify-between gap-2 ${
                      formData.promo_duration_mode === 'keep'
                        ? theme === 'light'
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                          : 'bg-emerald-900/30 border-emerald-500 text-emerald-200'
                        : theme === 'light'
                        ? 'bg-white border-[#D4C5B8] text-[#5C4B3E]'
                        : 'bg-slate-900 border-slate-600 text-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold">
                      <p className="font-black">Timer Promo Sedang Berjalan</p>
                      <p className="text-[11px] opacity-85">
                        Berakhir:{' '}
                        {new Date(formData.existing_promo_expires_at).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        (
                        {new Date(formData.existing_promo_expires_at).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                        })}
                        )
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, promo_duration_mode: 'keep' }))
                      }
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-black border transition-all ${
                        formData.promo_duration_mode === 'keep'
                          ? 'bg-emerald-600 text-white border-emerald-700'
                          : 'bg-transparent border-current opacity-75 hover:opacity-100'
                      }`}
                    >
                      Pertahankan
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-4 gap-2">
                  {PRESET_DURATIONS.map((preset) => {
                    const isSelected =
                      (preset.value === 'unlimited' &&
                        formData.promo_duration_mode === 'unlimited') ||
                      (preset.value !== 'unlimited' &&
                        formData.promo_duration_mode === 'preset' &&
                        formData.promo_duration_hours === preset.value);

                    return (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => handleSelectPreset(preset.value)}
                        className={`py-2 px-2 rounded-xl text-xs font-black border-2 transition-all ${
                          isSelected
                            ? 'bg-[var(--primary-color)] text-white border-[var(--primary-color)] shadow-sm'
                            : theme === 'light'
                            ? 'bg-white border-[#D4C5B8] text-[#2A1F17] hover:bg-[#FAF6F2]'
                            : 'bg-slate-900 border-slate-600 text-slate-200 hover:bg-slate-700'
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        promo_duration_mode: 'custom',
                        promo_duration_hours:
                          prev.promo_duration_mode === 'custom' ? prev.promo_duration_hours : '4',
                      }))
                    }
                    className={`py-2 px-2 rounded-xl text-xs font-black border-2 transition-all ${
                      formData.promo_duration_mode === 'custom'
                        ? 'bg-[var(--primary-color)] text-white border-[var(--primary-color)] shadow-sm'
                        : theme === 'light'
                        ? 'bg-white border-[#D4C5B8] text-[#2A1F17] hover:bg-[#FAF6F2]'
                        : 'bg-slate-900 border-slate-600 text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    Kustom
                  </button>
                </div>

                {formData.promo_duration_mode === 'custom' && (
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="0.5"
                      max="720"
                      step="0.5"
                      value={formData.promo_duration_hours}
                      onChange={(e) =>
                        setFormData({ ...formData, promo_duration_hours: e.target.value })
                      }
                      className={inputClass}
                      placeholder="Contoh: 3"
                    />
                    <span className={`text-xs font-black shrink-0 ${textMainClass}`}>Jam</span>
                  </div>
                )}

                {computedPreviewExpiry && (
                  <div
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between border ${
                      theme === 'light'
                        ? 'bg-amber-50 border-amber-300 text-amber-900'
                        : 'bg-amber-900/30 border-amber-600 text-amber-200'
                    }`}
                  >
                    <span>Hitung mundur pembeli aktif s/d:</span>
                    <span className="font-black">
                      {computedPreviewExpiry.toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
                      (
                      {computedPreviewExpiry.toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                      })}
                      )
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div
          className={`p-5 border-t-2 flex gap-3 shrink-0 ${
            theme === 'light' ? 'border-[#E8DFD3]' : 'border-slate-700'
          }`}
        >
          <button
            onClick={onClose}
            className={`flex-1 py-3 rounded-xl font-bold text-sm border-2 ${
              theme === 'light'
                ? 'bg-white border-[#D4C5B8] text-[#5C4B3E] hover:bg-[#F4EFE9]'
                : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={uploading || !formData.name || !formData.price}
            className="flex-[2] bg-[var(--primary-color)] text-white font-black py-3 rounded-xl text-sm shadow-md active:scale-95 transition-transform disabled:opacity-50"
          >
            Simpan Menu
          </button>
        </div>
      </div>
    </div>
  );
}
