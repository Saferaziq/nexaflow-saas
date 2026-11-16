'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const AI_PROVIDER_MODELS = {
  gemini: [
    { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash (Cepat & Hemat - Direkomendasikan)' },
    { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro (Analisis Mendalam)' },
    { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
  ],
  deepseek: [
    { value: 'deepseek-chat', label: 'DeepSeek V3 (deepseek-chat - Sangat Hemat)' },
    { value: 'deepseek-reasoner', label: 'DeepSeek R1 (deepseek-reasoner)' },
  ],
  groq: [
    { value: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B Versatile (Groq Super Cepat)' },
    { value: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B' },
  ],
  openai: [
    { value: 'gpt-4o-mini', label: 'GPT-4o Mini (Cepat & Ekonomis)' },
    { value: 'gpt-4o', label: 'GPT-4o' },
  ],
  openrouter: [
    { value: 'google/gemini-2.5-flash', label: 'OpenRouter: Gemini 2.5 Flash' },
    { value: 'deepseek/deepseek-chat', label: 'OpenRouter: DeepSeek V3' },
    { value: 'anthropic/claude-3.5-sonnet', label: 'OpenRouter: Claude 3.5 Sonnet' },
  ],
};

export default function OwnerSettings() {
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // State Konfigurasi AI Business Advisor
  const [aiProvider, setAiProvider] = useState('gemini');
  const [aiModel, setAiModel] = useState('gemini-2.5-flash');
  const [customModel, setCustomModel] = useState('');
  const [useCustomModel, setUseCustomModel] = useState(false);
  const [aiApiKey, setAiApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isTestingAi, setIsTestingAi] = useState(false);
  const [aiTestReply, setAiTestReply] = useState('');

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { window.location.href = '/login'; return; }
      setUserEmail(session.user.email);
      setIsLoading(false);
    };
    getSession();

    // Muat konfigurasi AI yang tersimpan di perangkat Owner
    try {
      const saved = localStorage.getItem('nexaflow_ai_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.provider) setAiProvider(parsed.provider);
        if (parsed.model) setAiModel(parsed.model);
        if (parsed.customModel) setCustomModel(parsed.customModel);
        if (typeof parsed.useCustomModel === 'boolean') setUseCustomModel(parsed.useCustomModel);
        if (parsed.apiKey) setAiApiKey(parsed.apiKey);
      }
    } catch (e) {
      // Abaikan jika gagal parse
    }
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  const handleProviderChange = (e) => {
    const nextProvider = e.target.value;
    setAiProvider(nextProvider);
    const defaultModel = AI_PROVIDER_MODELS[nextProvider]?.[0]?.value || '';
    setAiModel(defaultModel);
  };

  const handleSaveAiConfig = (e) => {
    e.preventDefault();
    const activeModel = useCustomModel && customModel.trim() ? customModel.trim() : aiModel;
    const payload = {
      provider: aiProvider,
      model: activeModel,
      customModel: customModel.trim(),
      useCustomModel,
      apiKey: aiApiKey.trim(),
      updatedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem('nexaflow_ai_config', JSON.stringify(payload));
      showToast(`Konfigurasi AI (${aiProvider.toUpperCase()} · ${activeModel}) berhasil disimpan!`, 'success');
    } catch (err) {
      showToast('Gagal menyimpan konfigurasi AI di browser', 'error');
    }
  };

  const handleTestAiConnection = async () => {
    const activeModel = useCustomModel && customModel.trim() ? customModel.trim() : aiModel;
    if (!aiApiKey.trim()) {
      return showToast('Tempelkan API Key terlebih dahulu sebelum mengetes koneksi.', 'error');
    }
    setIsTestingAi(true);
    setAiTestReply('');
    try {
      const res = await fetch('/api/owner/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action_type: 'ask_ai',
          manager_email: userEmail,
          question: 'Berikan 1 kalimat sapaan singkat sebagai AI Business Advisor NexaFlow dan sebutkan model Anda siap digunakan.',
          ai_config: {
            provider: aiProvider,
            model: activeModel,
            apiKey: aiApiKey.trim(),
          },
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        showToast(data.error || 'Tes koneksi AI gagal', 'error');
      } else {
        setAiTestReply(data.answer || 'Koneksi berhasil.');
        showToast('Koneksi AI berhasil diverifikasi!', 'success');
      }
    } catch (err) {
      showToast('Gagal menghubungi server untuk tes AI', 'error');
    } finally {
      setIsTestingAi(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) return showToast('Password minimal 6 karakter', 'error');

    setIsUpdating(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setIsUpdating(false);

    if (error) {
      showToast('Gagal ganti password: ' + error.message, 'error');
    } else {
      showToast('Password berhasil diubah!', 'success');
      setNewPassword('');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <div className="bg-slate-50 text-slate-800 dark:bg-[#04060B] dark:text-slate-200 min-h-screen overflow-hidden font-sans transition-colors duration-300">
      <div className="flex h-screen relative z-10">
        {/* SIDEBAR */}
        <aside className="group w-[80px] hover:w-64 transition-all duration-300 ease-in-out bg-white/70 dark:bg-[#060911]/80 backdrop-blur-2xl border-r border-slate-200 dark:border-slate-800/80 flex flex-col z-50 h-full shrink-0">
          <div className="h-20 flex items-center px-6 border-b border-slate-200 dark:border-slate-800/80 overflow-hidden shrink-0">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-lg overflow-hidden p-1">
              <img src="/logo-nexaflow-3d.png" alt="NexaFlow Logo" className="w-full h-full object-contain drop-shadow-md" />
            </div>
            <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              <div className="flex items-center gap-1">
                <span className="text-lg font-black tracking-tight font-display text-slate-900 dark:text-white">NEXAFLOW</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#EA8B42]"></span>
              </div>
              <p className="text-[9px] font-bold text-slate-500 tracking-[0.2em] uppercase">Owner Space</p>
            </div>
          </div>
          <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto overflow-x-hidden">
            <Link href="/owner" className="flex items-center gap-3 px-3 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#111C33] hover:text-slate-900 dark:hover:text-white rounded-xl font-bold transition-all whitespace-nowrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5 shrink-0"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">Overview</span>
            </Link>
            <Link href="/owner/finance" className="flex items-center gap-3 px-3 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#111C33] hover:text-slate-900 dark:hover:text-white rounded-xl font-bold transition-all whitespace-nowrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5 shrink-0"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">Keuangan</span>
            </Link>
            <Link href="/owner/reports" className="flex items-center gap-3 px-3 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#111C33] hover:text-slate-900 dark:hover:text-white rounded-xl font-bold transition-all whitespace-nowrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5 shrink-0"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">Laporan Global</span>
            </Link>
            <Link href="/owner/settings" className="flex items-center gap-3 px-3 py-3 bg-blue-50 dark:bg-[#111C33] text-[#2563EB] dark:text-sky-400 rounded-xl font-bold transition-all border border-blue-100 dark:border-sky-500/20 shadow-sm whitespace-nowrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5 shrink-0"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">Pengaturan</span>
            </Link>
          </nav>
          <div className="p-4 border-t border-slate-200 dark:border-slate-800/80">
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20 rounded-xl font-bold transition-all whitespace-nowrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 shrink-0"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">Logout</span>
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 flex flex-col h-full overflow-hidden relative">
          <header className="h-20 bg-white/60 dark:bg-[#04060B]/60 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between px-6 lg:px-10 z-40 transition-colors">
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight">Pengaturan Akun & AI</h1>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">Kelola keamanan akun dan konfigurasi mesin AI Business Advisor</p>
            </div>
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2.5 rounded-xl bg-slate-100 dark:bg-[#0F172A] text-slate-600 dark:text-amber-400 hover:bg-slate-200 transition-colors border border-slate-200 dark:border-slate-800 shadow-sm">
              {isDarkMode ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-6 lg:p-10 z-10 scroll-smooth">
            <div className="max-w-2xl mx-auto space-y-6">

              {/* Profil Card */}
              <div className="bg-white dark:bg-[#0A0F1C] border border-slate-200 dark:border-slate-800/80 rounded-3xl p-8 shadow-sm">
                <h2 className="text-lg font-black text-slate-900 dark:text-white font-display mb-4">Profil Anda</h2>
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#2563EB] to-[#EA8B42] flex items-center justify-center text-white font-black text-2xl shadow-lg">
                    {userEmail.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Email Terdaftar</p>
                    <p className="text-lg font-black text-slate-900 dark:text-white">{userEmail}</p>
                  </div>
                </div>
              </div>

              {/* Konfigurasi AI Business Advisor Card */}
              <div className="bg-white dark:bg-[#0A0F1C] border border-sky-500/30 rounded-3xl p-8 shadow-sm relative overflow-hidden">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#1E4E8C] to-[#2563EB] flex items-center justify-center text-amber-300 shadow-lg shrink-0">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-6 h-6"><path d="M12 2a4 4 0 0 1 4 4v2h2a2 2 0 0 1 2 2v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-8a2 2 0 0 1 2-2h2V6a4 4 0 0 1 4-4z"/><circle cx="9" cy="13" r="1"/><circle cx="15" cy="13" r="1"/></svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-slate-900 dark:text-white font-display">Konfigurasi AI Business Advisor</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Pilih penyedia AI, model, dan tempelkan API Key untuk fitur Tanya-Jawab & Analisis Cabang</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${aiApiKey.trim() ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'}`}>
                    {aiApiKey.trim() ? 'API Key Siap' : 'Mode Lokal / Belum Ada Key'}
                  </span>
                </div>

                <form onSubmit={handleSaveAiConfig} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Penyedia AI (Provider)</label>
                      <select
                        value={aiProvider}
                        onChange={handleProviderChange}
                        className="w-full bg-slate-50 dark:bg-[#04060B] border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB]"
                      >
                        <option value="gemini">Google Gemini (Google AI Studio)</option>
                        <option value="deepseek">DeepSeek API (Official)</option>
                        <option value="groq">Groq Cloud (Super Cepat)</option>
                        <option value="openai">OpenAI (ChatGPT API)</option>
                        <option value="openrouter">OpenRouter (Multi-Model)</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Model AI yang Digunakan</label>
                        <button
                          type="button"
                          onClick={() => setUseCustomModel(!useCustomModel)}
                          className="text-[10px] font-bold text-sky-500 hover:text-sky-400"
                        >
                          {useCustomModel ? 'Pilih dari Daftar' : 'Ketik Model Manual'}
                        </button>
                      </div>
                      {useCustomModel ? (
                        <input
                          type="text"
                          value={customModel}
                          onChange={(e) => setCustomModel(e.target.value)}
                          placeholder="Contoh: gemini-2.5-flash / deepseek-chat"
                          className="w-full bg-slate-50 dark:bg-[#04060B] border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB]"
                        />
                      ) : (
                        <select
                          value={aiModel}
                          onChange={(e) => setAiModel(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-[#04060B] border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB]"
                        >
                          {(AI_PROVIDER_MODELS[aiProvider] || []).map((m) => (
                            <option key={m.value} value={m.value}>{m.label}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Tempel API Key AI</label>
                    <div className="relative">
                      <input
                        type={showApiKey ? 'text' : 'password'}
                        value={aiApiKey}
                        onChange={(e) => setAiApiKey(e.target.value)}
                        placeholder={
                          aiProvider === 'gemini'
                            ? 'AIzaSy...'
                            : aiProvider === 'deepseek' || aiProvider === 'openai' || aiProvider === 'openrouter'
                            ? 'sk-...'
                            : 'gsk_...'
                        }
                        className="w-full bg-slate-50 dark:bg-[#04060B] border border-slate-300 dark:border-slate-700 rounded-xl pl-4 pr-24 py-3.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300"
                      >
                        {showApiKey ? 'Sembunyikan' : 'Lihat'}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                      Hemat Token Aktif: Sistem hanya mengirim ringkasan angka berformat JSON kecil hasil hitungan PostgreSQL ke model AI, bukan ribuan baris transaksi mentah.
                    </p>
                  </div>

                  {aiTestReply && (
                    <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                      <span className="font-black text-sky-500 dark:text-sky-400 block mb-1">Respon Tes AI Advisor:</span>
                      {aiTestReply}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3 pt-1">
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-[#1E4E8C] to-[#2563EB] hover:from-[#2563EB] hover:to-[#3B82F6] text-white font-black py-3.5 px-6 rounded-xl text-sm transition-all shadow-md"
                    >
                      Simpan Konfigurasi AI
                    </button>
                    <button
                      type="button"
                      onClick={handleTestAiConnection}
                      disabled={isTestingAi}
                      className="bg-slate-100 dark:bg-[#111C33] hover:bg-slate-200 dark:hover:bg-[#1E293B] text-slate-700 dark:text-sky-300 border border-slate-300 dark:border-sky-500/30 font-bold py-3.5 px-5 rounded-xl text-sm transition-all disabled:opacity-50"
                    >
                      {isTestingAi ? 'Mengetes Koneksi...' : 'Tes Koneksi AI'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Ganti Password Card */}
              <div className="bg-white dark:bg-[#0A0F1C] border border-slate-200 dark:border-slate-800/80 rounded-3xl p-8 shadow-sm">
                <h2 className="text-lg font-black text-slate-900 dark:text-white font-display mb-1">Ganti Password</h2>
                <p className="text-xs text-slate-500 mb-6">Pastikan password baru Anda mudah diingat namun sulit ditebak.</p>

                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Password Baru</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      className="w-full bg-slate-50 dark:bg-[#04060B] border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                  <button type="submit" disabled={isUpdating || !newPassword} className="bg-[#2563EB] hover:bg-blue-600 text-white font-black py-3.5 px-8 rounded-xl transition-all disabled:opacity-50">
                    {isUpdating ? 'Menyimpan...' : 'Simpan Password'}
                  </button>
                </form>
              </div>

            </div>
          </div>
        </main>
      </div>

      {/* TOAST NOTIFICATION */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-[200] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl ${toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${toast.type === 'success' ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
              {toast.type === 'success' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              )}
            </div>
            <p className="text-sm font-bold pr-4">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}