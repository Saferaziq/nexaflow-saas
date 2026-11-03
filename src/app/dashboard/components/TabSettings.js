'use client';

import { useRef } from 'react';
import { Icons } from '../helpers/icons';

export default function TabSettings({
  theme,
  settings,
  setSettings,
  onSave,
  onUploadImage,
  uploadingLogo,
  uploadingBanner,
}) {
  const logoInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const textMainClass = theme === 'light' ? 'text-[#2A1F17]' : 'text-white';
  const textSubClass = theme === 'light' ? 'text-[#5C4B3E]' : 'text-slate-300';
  const cardClass = theme === 'light' ? 'bg-white border-2 border-[#D4C5B8]' : 'bg-slate-900 border-2 border-slate-700';
  const inputClass = `w-full border-2 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-[var(--primary-color)]/20 focus:border-[var(--primary-color)] ${theme === 'light' ? 'border-[#D4C5B8] bg-white text-[#2A1F17]' : 'border-slate-600 bg-slate-800 text-white'}`;

  return (
    <div className={`max-w-3xl mx-auto rounded-[2rem] p-8 shadow-sm border-2 ${cardClass}`}>
      <h2 className={`font-black text-2xl mb-6 ${textMainClass}`}>Pengaturan Kafe</h2>
      <form onSubmit={onSave} className="space-y-6">

        {/* Nama & WA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-xs font-bold mb-2 ${textSubClass}`}>Nama Kafe</label>
            <input
              type="text"
              value={settings.name}
              onChange={e => setSettings({ ...settings, name: e.target.value })}
              className={inputClass}
              placeholder="Nama Kafe"
            />
          </div>
          <div>
            <label className={`block text-xs font-bold mb-2 ${textSubClass}`}>No. WhatsApp</label>
            <input
              type="text"
              value={settings.wa}
              onChange={e => setSettings({ ...settings, wa: e.target.value })}
              className={inputClass}
              placeholder="08xxxxxxxxxx"
            />
          </div>
        </div>

        {/* Alamat */}
        <div>
          <label className={`block text-xs font-bold mb-2 ${textSubClass}`}>Alamat</label>
          <input
            type="text"
            value={settings.address}
            onChange={e => setSettings({ ...settings, address: e.target.value })}
            className={inputClass}
            placeholder="Jl. Contoh No. 123"
          />
        </div>

        {/* Upload Logo */}
        <div className={`border-t-2 border-dashed pt-6 ${theme === 'light' ? 'border-[#D4C5B8]' : 'border-slate-700'}`}>
          <label className={`block text-xs font-bold mb-2 ${textSubClass}`}>Logo Kafe</label>
          <div className="flex items-center gap-4">
            <div className={`w-24 h-24 rounded-2xl overflow-hidden flex items-center justify-center border-2 ${theme === 'light' ? 'bg-[#F4EFE9] border-[#D4C5B8]' : 'bg-slate-800 border-slate-600'}`}>
              {settings.logo_url
                ? <img src={settings.logo_url} alt="Logo" className="w-full h-full object-contain mix-blend-multiply" />
                : <Icons.Utensils />}
            </div>
            <div className="flex-1">
              <input
                type="file"
                ref={logoInputRef}
                onChange={e => onUploadImage(e, 'logo')}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className={`w-full py-3 rounded-xl text-sm font-extrabold transition-colors border-2 ${theme === 'light' ? 'bg-[#F4EFE9] hover:bg-[#E8DFD3] border-[#D4C5B8] text-[#2A1F17]' : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-white'}`}
              >
                {uploadingLogo ? 'Mengupload...' : 'Upload Logo'}
              </button>
            </div>
          </div>
        </div>

        {/* Upload Banner */}
        <div className={`border-t-2 border-dashed pt-6 ${theme === 'light' ? 'border-[#D4C5B8]' : 'border-slate-700'}`}>
          <label className={`block text-xs font-bold mb-2 ${textSubClass}`}>Banner Kafe</label>
          <div className={`w-full h-32 rounded-2xl overflow-hidden flex items-center justify-center border-2 mb-3 ${theme === 'light' ? 'bg-[#F4EFE9] border-[#D4C5B8]' : 'bg-slate-800 border-slate-600'}`}>
            {settings.banner_url
              ? <img src={settings.banner_url} alt="Banner" className="w-full h-full object-cover" />
              : <Icons.Chart />}
          </div>
          <input
            type="file"
            ref={bannerInputRef}
            onChange={e => onUploadImage(e, 'banner')}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => bannerInputRef.current?.click()}
            className={`w-full py-3 rounded-xl text-sm font-extrabold transition-colors border-2 ${theme === 'light' ? 'bg-[#F4EFE9] hover:bg-[#E8DFD3] border-[#D4C5B8] text-[#2A1F17]' : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-white'}`}
          >
            {uploadingBanner ? 'Mengupload...' : 'Upload Banner'}
          </button>
        </div>

        {/* PPN */}
        <div className={`border-t-2 border-dashed pt-6 ${theme === 'light' ? 'border-[#D4C5B8]' : 'border-slate-700'}`}>
          <label className={`block text-xs font-bold mb-2 ${textSubClass}`}>Persentase PPN (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            value={settings.tax_percentage}
            onChange={e => setSettings({ ...settings, tax_percentage: Number(e.target.value) })}
            className={inputClass}
            placeholder="11"
          />
          <p className={`text-[11px] font-semibold mt-2 ${textSubClass}`}>
            Sesuai ketentuan pemerintah, standar PPN adalah 11%. Isi 0 jika tidak ada pajak.
          </p>
        </div>

        {/* QRIS */}
        <div className={`border-t-2 border-dashed pt-6 ${theme === 'light' ? 'border-[#D4C5B8]' : 'border-slate-700'}`}>
          <label className={`block text-xs font-bold mb-2 ${textSubClass}`}>QRIS Bank/E-Wallet (Untuk Cetak Bill)</label>
          <textarea
            value={settings.qris_string}
            onChange={e => setSettings({ ...settings, qris_string: e.target.value })}
            className={`${inputClass} font-mono text-xs`}
            rows="3"
            placeholder="00020101021126..."
          ></textarea>
          <p className={`text-[11px] font-semibold mt-2 ${textSubClass}`}>
            Paste string QRIS statis (DANA, Mandiri, BCA, dll).
          </p>
        </div>

        <button
          type="submit"
          className={`w-full font-extrabold py-4 rounded-2xl shadow-lg transition-all mt-4 border-2 ${theme === 'light' ? 'bg-[#2A1F17] hover:bg-[#1A120D] text-white border-[#2A1F17]' : 'bg-slate-700 hover:bg-slate-600 text-white border-slate-600'}`}
        >
          Simpan Pengaturan
        </button>

      </form>

      {/* TAMBAHAN: Notifikasi Pesanan Siap */}
      <div className={`mt-8 pt-6 border-t-2 border-dashed ${theme === 'light' ? 'border-[#D4C5B8]' : 'border-slate-700'}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className={`font-black text-lg ${textMainClass}`}>Notifikasi Pesanan Siap</h3>
            <p className={`text-xs font-semibold mt-1 max-w-md ${textSubClass}`}>
              Jika diaktifkan, pelanggan akan menerima notifikasi suara berulang saat pesanan berstatus &quot;Siap&quot;. 
              Matikan jika kafe Anda menggunakan sistem pengantaran (delivery).
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSettings({ ...settings, notify_order_ready: !settings.notify_order_ready })}
            className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-color)] focus-visible:ring-offset-2 ${
              settings.notify_order_ready ? 'bg-[var(--primary-color)]' : theme === 'light' ? 'bg-[#D4C5B8]' : 'bg-slate-600'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                settings.notify_order_ready ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

    </div>
  );
}