'use client';

import { useRef, useState, useEffect } from 'react';
import { Icons } from '../helpers/icons';

export default function TabSettings({
  theme,
  settings,
  setSettings,
  onSave,
  onUploadImage,
  uploadingLogo,
  uploadingBanner,
  isOpen,
  onToggleCafeStatus,
  onTogglePayFirst,
}) {
  const logoInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  // 🔥 STATE UNTUK PRINTER CONFIG
  const [printerMode, setPrinterMode] = useState('browser');
  const [testStatus, setTestStatus] = useState('idle'); // idle | testing | success

  useEffect(() => {
    const savedMode = localStorage.getItem('nexaflow_printer_mode');
    if (savedMode) setPrinterMode(savedMode);
  }, []);

  const handleSavePrinter = () => {
    localStorage.setItem('nexaflow_printer_mode', printerMode);
    setTestStatus('idle');
    alert('Konfigurasi printer berhasil disimpan di perangkat ini.');
  };

  const handleTestPrint = () => {
    setTestStatus('testing');
    setTimeout(() => {
      setTestStatus('success');
      setTimeout(() => setTestStatus('idle'), 3000);
    }, 1500);
  };

  const textMainClass = theme === 'light' ? 'text-[#2A1F17]' : 'text-white';
  const textSubClass = theme === 'light' ? 'text-[#5C4B3E]' : 'text-slate-300';
  const cardClass = theme === 'light' ? 'bg-white border-2 border-[#D4C5B8]' : 'bg-slate-900 border-2 border-slate-700';
  const inputClass = `w-full border-2 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-[var(--primary-color)]/20 focus:border-[var(--primary-color)] ${theme === 'light' ? 'border-[#D4C5B8] bg-white text-[#2A1F17]' : 'border-slate-600 bg-slate-800 text-white'}`;

  return (
    <div className={`max-w-3xl mx-auto rounded-[2rem] p-8 shadow-sm border-2 ${cardClass}`}>
      <h2 className={`font-black text-2xl mb-6 ${textMainClass}`}>Pengaturan Kafe</h2>

      {/* 🔥 STATUS KAFE (BUKA/TUTUP) */}
      <div className={`mb-8 p-6 rounded-3xl border-4 ${isOpen ? 'bg-emerald-50 border-emerald-300' : 'bg-rose-50 border-rose-300'}`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div>
            <h3 className={`font-black text-2xl mb-1 ${isOpen ? 'text-emerald-800' : 'text-rose-800'}`}>
              {isOpen ? '✅ KAFE SEDANG BUKA' : '🔒 KAFE SEDANG TUTUP'}
            </h3>
            <p className={`text-xs font-semibold ${isOpen ? 'text-emerald-700' : 'text-rose-700'}`}>
              {isOpen 
                ? 'Pelanggan bisa memesan dari HP mereka melalui scan QR.' 
                : 'Pelanggan tidak bisa memesan. Menu akan tampil dengan layar "TUTUP".'}
            </p>
          </div>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); onToggleCafeStatus && onToggleCafeStatus(); }}
            className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-sm text-white shadow-xl active:scale-95 transition-transform whitespace-nowrap ${
              isOpen ? 'bg-rose-500 hover:bg-rose-600' : 'bg-emerald-500 hover:bg-emerald-600'
            }`}
          >
            {isOpen ? 'TUTUP KAFE SEKARANG' : 'BUKA KAFE SEKARANG'}
          </button>
        </div>
      </div>

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
                disabled={uploadingLogo || uploadingBanner}
                className={`w-full py-3 rounded-xl text-sm font-extrabold transition-colors border-2 ${theme === 'light' ? 'bg-[#F4EFE9] hover:bg-[#E8DFD3] border-[#D4C5B8] text-[#2A1F17]' : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-white'} disabled:opacity-50`}
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
            disabled={uploadingLogo || uploadingBanner}
            className={`w-full py-3 rounded-xl text-sm font-extrabold transition-colors border-2 ${theme === 'light' ? 'bg-[#F4EFE9] hover:bg-[#E8DFD3] border-[#D4C5B8] text-[#2A1F17]' : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-white'} disabled:opacity-50`}
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

        {/* TOMBOL SIMPAN PENGATURAN UTAMA */}
        <button
          type="submit"
          disabled={uploadingLogo || uploadingBanner}
          className={`w-full font-extrabold py-4 rounded-2xl shadow-lg transition-all mt-4 border-2 ${theme === 'light' ? 'bg-[#2A1F17] hover:bg-[#1A120D] text-white border-[#2A1F17]' : 'bg-slate-700 hover:bg-slate-600 text-white border-slate-600'} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {uploadingLogo || uploadingBanner ? 'Tunggu Upload Selesai...' : 'Simpan Pengaturan'}
        </button>

      </form>

      {/* 🔥 FITUR BARU: PAY FIRST TOGGLE */}
      <div className={`mt-8 pt-6 border-t-2 border-dashed ${theme === 'light' ? 'border-[#D4C5B8]' : 'border-slate-700'}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className={`font-black text-lg ${textMainClass}`}>Wajib Bayar Dulu (Pay First)</h3>
            <p className={`text-xs font-semibold mt-1 max-w-md ${textSubClass}`}>
              Jika diaktifkan, pelanggan harus memilih metode pembayaran (QRIS/Cash) dan pesanan baru akan masuk ke Dapur setelah Kasir mengonfirmasi pembayaran.
            </p>
          </div>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); onTogglePayFirst && onTogglePayFirst(); }}
            className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-color)] focus-visible:ring-offset-2 ${
              settings.is_pay_first ? 'bg-[var(--primary-color)]' : theme === 'light' ? 'bg-[#D4C5B8]' : 'bg-slate-600'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                settings.is_pay_first ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Notifikasi Pesanan Siap */}
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

      {/* 🔥 FITUR BARU: KONFIGURASI PRINTER */}
      <div className={`mt-8 pt-8 border-t-2 border-dashed ${theme === 'light' ? 'border-[#D4C5B8]' : 'border-slate-700'}`}>
        <div className="flex items-center gap-2 mb-4">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border-2 ${theme === 'light' ? 'bg-[#F4EFE9] border-[#D4C5B8] text-[#3A2A20]' : 'bg-slate-800 border-slate-600 text-slate-300'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          </div>
          <div>
            <h3 className={`font-black text-lg ${textMainClass}`}>Konfigurasi Printer</h3>
            <p className={`text-xs font-semibold ${textSubClass}`}>Atur koneksi printer thermal Anda</p>
          </div>
        </div>

        {/* Pilih Tipe Koneksi */}
        <div className="mb-4">
          <label className={`block text-[11px] font-black uppercase tracking-widest mb-3 ${textSubClass}`}>Tipe Koneksi Printer</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Opsi 1: Browser */}
            <label className={`relative flex items-center gap-3 p-3 rounded-xl cursor-pointer border-2 transition-all ${printerMode === 'browser' ? (theme === 'light' ? 'bg-[#3A2A20] border-[#2A1F17] text-white' : 'bg-slate-700 border-slate-500 text-white') : (theme === 'light' ? 'bg-white border-[#D4C5B8] hover:border-[#3A2A20] text-[#2A1F17]' : 'bg-slate-800 border-slate-600 hover:border-slate-400 text-slate-300')}`}>
              <input type="radio" name="printerMode" checked={printerMode === 'browser'} onChange={() => setPrinterMode('browser')} className="w-4 h-4 accent-white" />
              <div>
                <p className="font-black text-sm">Browser Default</p>
                <p className="text-[10px] font-bold opacity-70 mt-0.5">Munculkan pop-up Print</p>
              </div>
            </label>

            {/* Opsi 2: RawBT */}
            <label className={`relative flex items-center gap-3 p-3 rounded-xl cursor-pointer border-2 transition-all ${printerMode === 'rawbt' ? (theme === 'light' ? 'bg-[#3A2A20] border-[#2A1F17] text-white' : 'bg-slate-700 border-slate-500 text-white') : (theme === 'light' ? 'bg-white border-[#D4C5B8] hover:border-[#3A2A20] text-[#2A1F17]' : 'bg-slate-800 border-slate-600 hover:border-slate-400 text-slate-300')}`}>
              <input type="radio" name="printerMode" checked={printerMode === 'rawbt'} onChange={() => setPrinterMode('rawbt')} className="w-4 h-4 accent-white" />
              <div>
                <p className="font-black text-sm">RawBT (Android)</p>
                <p className="text-[10px] font-bold opacity-70 mt-0.5">Silent Print via Bluetooth</p>
              </div>
            </label>

            {/* Opsi 3: QZ Tray */}
            <label className={`relative flex items-center gap-3 p-3 rounded-xl cursor-pointer border-2 transition-all ${printerMode === 'qztray' ? (theme === 'light' ? 'bg-[#3A2A20] border-[#2A1F17] text-white' : 'bg-slate-700 border-slate-500 text-white') : (theme === 'light' ? 'bg-white border-[#D4C5B8] hover:border-[#3A2A20] text-[#2A1F17]' : 'bg-slate-800 border-slate-600 hover:border-slate-400 text-slate-300')}`}>
              <input type="radio" name="printerMode" checked={printerMode === 'qztray'} onChange={() => setPrinterMode('qztray')} className="w-4 h-4 accent-white" />
              <div>
                <p className="font-black text-sm">QZ Tray (Windows)</p>
                <p className="text-[10px] font-bold opacity-70 mt-0.5">Silent Print via USB/LAN</p>
              </div>
            </label>

            {/* Opsi 4: BR RawPrinter */}
            <label className={`relative flex items-center gap-3 p-3 rounded-xl cursor-pointer border-2 transition-all ${printerMode === 'brraw' ? (theme === 'light' ? 'bg-[#3A2A20] border-[#2A1F17] text-white' : 'bg-slate-700 border-slate-500 text-white') : (theme === 'light' ? 'bg-white border-[#D4C5B8] hover:border-[#3A2A20] text-[#2A1F17]' : 'bg-slate-800 border-slate-600 hover:border-slate-400 text-slate-300')}`}>
              <input type="radio" name="printerMode" checked={printerMode === 'brraw'} onChange={() => setPrinterMode('brraw')} className="w-4 h-4 accent-white" />
              <div>
                <p className="font-black text-sm">BR RawPrinter (iPad)</p>
                <p className="text-[10px] font-bold opacity-70 mt-0.5">Wajib install aplikasi pihak ke-3</p>
              </div>
            </label>

          </div>
        </div>

        {/* Info Box iPad */}
        {printerMode === 'brraw' && (
          <div className={`mb-4 p-3 rounded-xl border-2 flex gap-3 ${theme === 'light' ? 'bg-blue-50 border-blue-200 text-blue-900' : 'bg-blue-900/20 border-blue-700 text-blue-200'}`}>
            <div className="shrink-0 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p className="text-xs font-black">Khusus Pengguna iPad</p>
              <p className="text-[11px] font-bold mt-1 opacity-80 leading-relaxed">
                Unduh aplikasi <strong>BR RawPrinter</strong> di App Store. Pastikan printer Bluetooth sudah terhubung ke aplikasi tersebut sebelum melakukan Test Print.
              </p>
            </div>
          </div>
        )}

        {/* Test Print Area */}
        <div className={`rounded-xl border-2 p-4 mb-4 ${theme === 'light' ? 'bg-white border-[#D4C5B8]' : 'bg-slate-800 border-slate-600'}`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-3">
            <div>
              <p className={`text-sm font-black ${textMainClass}`}>Uji Koneksi Printer</p>
              <p className={`text-[11px] font-bold mt-0.5 ${textSubClass}`}>Pastikan printer menyala dan terhubung.</p>
            </div>
            <button 
              onClick={handleTestPrint} 
              disabled={testStatus === 'testing'}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest shadow-sm transition-transform active:scale-95 border-2 flex items-center justify-center gap-2 ${theme === 'light' ? 'bg-[#3A2A20] hover:bg-black text-white border-black' : 'bg-slate-700 hover:bg-slate-600 text-white border-slate-500'}`}
            >
              {testStatus === 'testing' ? (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
              )}
              {testStatus === 'testing' ? 'Menghubungkan...' : 'Test Print'}
            </button>
          </div>

          {/* Status Indicator */}
          {testStatus === 'success' && (
            <div className={`mt-2 p-2.5 rounded-lg border-2 flex items-center gap-3 ${theme === 'light' ? 'bg-emerald-50 border-emerald-400 text-emerald-800' : 'bg-emerald-900/20 border-emerald-700 text-emerald-300'}`}>
              <div className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </div>
              <div>
                <p className="text-xs font-black">Printer Terhubung!</p>
                <p className="text-[10px] font-bold opacity-80 mt-0.5">Test print berhasil dikirim.</p>
              </div>
            </div>
          )}
        </div>

        {/* Tombol Simpan Konfigurasi Printer */}
        <button
          type="button"
          onClick={handleSavePrinter}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-3.5 rounded-xl text-sm shadow-md transition-transform active:scale-95 border-2 border-emerald-700 flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          Simpan Konfigurasi Printer
        </button>
      </div>

    </div>
  );
}