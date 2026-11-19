'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const Icons = {
  Sun: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  Moon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  Overview: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="w-4 h-4 shrink-0"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
  Finance: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="w-4 h-4 shrink-0"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  Reports: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="w-4 h-4 shrink-0"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  Settings: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="w-4 h-4 shrink-0"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9"/></svg>,
  Logout: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
};

const AI_MODELS = {
  gemini: [
    { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash (Cepat & Hemat)' },
    { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro (Analisis Mendalam)' },
  ],
  deepseek: [
    { value: 'deepseek-chat', label: 'DeepSeek V3 Chat (Ekonomis)' },
    { value: 'deepseek-reasoner', label: 'DeepSeek R1 Reasoner' },
  ],
  openai: [
    { value: 'gpt-4o-mini', label: 'GPT-4o Mini (Cepat & Hemat)' },
    { value: 'gpt-4o', label: 'GPT-4o Flagship' },
  ],
  groq: [
    { value: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B Versatile (Gratis / Super Cepat)' },
  ],
  openrouter: [
    { value: 'google/gemini-2.5-flash', label: 'OpenRouter: Gemini 2.5 Flash' },
    { value: 'deepseek/deepseek-chat', label: 'OpenRouter: DeepSeek V3' },
  ],
};

export default function OwnerSettings() {
  const [userEmail, setUserEmail] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [tenants, setTenants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPass, setIsUpdatingPass] = useState(false);

  const [aiProvider, setAiProvider] = useState('gemini');
  const [aiModel, setAiModel] = useState('gemini-2.5-flash');
  const [customModel, setCustomModel] = useState('');
  const [aiApiKey, setAiApiKey] = useState('');
  const [isSavingAi, setIsSavingAi] = useState(false);
  const [isTestingAi, setIsTestingAi] = useState(false);
  const [testAiOutput, setTestAiOutput] = useState('');

  const [editModal, setEditModal] = useState({ open: false, branch: null });
  const [editName, setEditName] = useState('');
  const [isSubmittingBranch, setIsSubmittingBranch] = useState(false);

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    const savedTheme = localStorage.getItem('nexaflow_theme');
    if (savedTheme === 'dark') setIsDarkMode(true);
    else setIsDarkMode(false);
  }, []);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('nexaflow_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('nexaflow_ai_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        const prov = parsed.provider || 'gemini';
        const mod = parsed.model || AI_MODELS[prov]?.[0]?.value || 'gemini-2.5-flash';
        setAiProvider(prov);
        const presets = (AI_MODELS[prov] || []).map((m) => m.value);
        if (presets.includes(mod)) {
          setAiModel(mod);
          setCustomModel('');
        } else {
          setAiModel('custom');
          setCustomModel(mod);
        }
        setAiApiKey(parsed.apiKey || '');
      }
    } catch (e) {
      // noop
    }
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3500);
  };

  const fetchBranches = async (email) => {
    const [tenantsRes, statsRes] = await Promise.all([
      supabase.from('tenants').select('*').eq('manager_email', email).order('created_at', { ascending: false }),
      fetch(`/api/owner/stats?manager_email=${encodeURIComponent(email)}&period=daily`),
    ]);

    if (tenantsRes.data) setTenants(tenantsRes.data);

    if (statsRes.ok) {
      try {
        const sData = await statsRes.json();
        if (sData.savedAiConfig) {
          const prov = sData.savedAiConfig.provider || 'gemini';
          const mod = sData.savedAiConfig.model || AI_MODELS[prov]?.[0]?.value || 'gemini-2.5-flash';
          const key = sData.savedAiConfig.apiKey || '';
          setAiProvider(prov);
          const presets = (AI_MODELS[prov] || []).map((m) => m.value);
          if (presets.includes(mod)) {
            setAiModel(mod);
            setCustomModel('');
          } else {
            setAiModel('custom');
            setCustomModel(mod);
          }
          if (key) {
            setAiApiKey(key);
          }
          localStorage.setItem('nexaflow_ai_config', JSON.stringify({ provider: prov, model: mod, apiKey: key }));
        }
      } catch (e) {
        // noop
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { window.location.href = '/login'; return; }
      setUserEmail(session.user.email);
      fetchBranches(session.user.email);
    };
    getSession();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const handleProviderChange = (prov) => {
    setAiProvider(prov);
    const defaultModel = AI_MODELS[prov]?.[0]?.value || '';
    setAiModel(defaultModel);
    setCustomModel('');
  };

  const getEffectiveModel = () => {
    if (aiModel === 'custom') return customModel.trim() || 'gemini-2.5-flash';
    return aiModel;
  };

  const handleSaveAiConfig = async (e) => {
    e.preventDefault();
    const effectiveModel = getEffectiveModel();
    const trimmedKey = aiApiKey.trim();
    setIsSavingAi(true);
    try {
      localStorage.setItem(
        'nexaflow_ai_config',
        JSON.stringify({
          provider: aiProvider,
          model: effectiveModel,
          apiKey: trimmedKey,
        })
      );

      const res = await fetch('/api/owner/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action_type: 'save_ai_config',
          manager_email: userEmail,
          provider: aiProvider,
          model: effectiveModel,
          apiKey: trimmedKey,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        showToast(data.error || 'Tersimpan lokal, tetapi gagal menyinkronkan ke database', 'error');
      } else {
        showToast(data.message || `Konfigurasi AI (${aiProvider.toUpperCase()} · ${effectiveModel}) tersimpan lintas perangkat!`);
      }
    } catch (err) {
      showToast('Gagal menyimpan konfigurasi AI ke server', 'error');
    } finally {
      setIsSavingAi(false);
    }
  };

  const handleTestAiConnection = async () => {
    const effectiveModel = getEffectiveModel();
    setIsTestingAi(true);
    setTestAiOutput('');
    try {
      const res = await fetch('/api/owner/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action_type: 'ask_ai',
          manager_email: userEmail,
          question: 'Jawab singkat dalam 1 kalimat: Konfirmasi bahwa koneksi AI Business Advisor NexaFlow aktif.',
          ai_config: {
            provider: aiProvider,
            model: effectiveModel,
            apiKey: aiApiKey.trim(),
          },
          context_summary: { status: 'Tes Koneksi Pengaturan Owner', jumlahCabang: tenants.length },
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        showToast(data.error || 'Tes koneksi AI gagal', 'error');
        setTestAiOutput(`Gagal: ${data.error || 'Periksa kembali API Key dan model Anda.'}`);
      } else {
        setTestAiOutput(data.answer || 'Koneksi berhasil!');
        showToast('Koneksi AI berhasil diverifikasi!');
      }
    } catch (err) {
      showToast('Gagal menghubungi server AI', 'error');
    } finally {
      setIsTestingAi(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return showToast('Password baru dan konfirmasi tidak cocok!', 'error');
    if (newPassword.length < 6) return showToast('Password minimal 6 karakter!', 'error');

    setIsUpdatingPass(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      showToast('Password berhasil diubah! Gunakan password baru saat login.');
      setNewPassword(''); setConfirmPassword('');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsUpdatingPass(false);
    }
  };

  const handleToggleBranch = async (branch) => {
    try {
      const res = await fetch('/api/owner/manage-branch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle_status',
          tenant_id: branch.id,
          manager_email: userEmail,
          payload: { is_active: branch.is_active },
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message);
        fetchBranches(userEmail);
      } else throw new Error(data.error);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleEditBranch = async (e) => {
    e.preventDefault();
    if (!editName.trim()) return;
    setIsSubmittingBranch(true);
    try {
      const res = await fetch('/api/owner/manage-branch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'rename',
          tenant_id: editModal.branch.id,
          manager_email: userEmail,
          payload: { name: editName.trim() },
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message);
        setEditModal({ open: false, branch: null });
        fetchBranches(userEmail);
      } else throw new Error(data.error);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmittingBranch(false);
    }
  };

  return (
    <div className="bg-[#F4EFE9] text-[#1A1512] dark:bg-[#0a192f] dark:text-white min-h-screen font-sans">
      <style>{`
        .owner-card { box-shadow: 0 2px 8px rgba(26, 21, 18, 0.06); }
        .dark .owner-card { box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      <div className="flex min-h-screen">
        {/* SIDEBAR SELARAS KASIR */}
        <aside className="hidden lg:flex lg:w-60 bg-[#2A1F17] text-white dark:bg-slate-900 border-r-2 border-[#1A1512] dark:border-slate-700 flex-col justify-between p-5 shrink-0 h-screen sticky top-0">
          <div className="space-y-8">
            <div className="flex items-center gap-3 px-1">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0 p-1 shadow-sm">
                <img src="/logo-nexaflow-3d.png" alt="NF" className="w-full h-full object-contain" />
              </div>
              <div>
                <p className="text-base font-black tracking-tight text-white leading-none">NEXAFLOW</p>
                <p className="text-[11px] font-extrabold text-amber-400 tracking-wider uppercase mt-1">Owner Panel</p>
              </div>
            </div>

            <nav className="space-y-1.5">
              <Link href="/owner" className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[#D3C8BB] dark:text-slate-300 hover:bg-white/10 hover:text-white text-xs font-bold transition-colors">
                <Icons.Overview />
                <span>Command Center AI</span>
              </Link>
              <Link href="/owner/finance" className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[#D3C8BB] dark:text-slate-300 hover:bg-white/10 hover:text-white text-xs font-bold transition-colors">
                <Icons.Finance />
                <span>Keuangan & Stok</span>
              </Link>
              <Link href="/owner/reports" className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[#D3C8BB] dark:text-slate-300 hover:bg-white/10 hover:text-white text-xs font-bold transition-colors">
                <Icons.Reports />
                <span>Laporan Global P&L</span>
              </Link>
              <Link href="/owner/settings" className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-black border border-blue-400/40">
                <Icons.Settings />
                <span>Pengaturan & AI Key</span>
              </Link>
            </nav>
          </div>

          <div className="pt-4 border-t border-white/15 space-y-3">
            <div className="px-1">
              <p className="text-xs font-black text-white truncate">{userEmail || 'Owner'}</p>
              <p className="text-[11px] font-bold text-[#D3C8BB] dark:text-slate-400 mt-0.5">{tenants.length} Cabang Terdaftar</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black transition-colors"
            >
              <Icons.Logout />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* AREA KONTEN UTAMA */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* NAVIGASI MOBILE */}
          <div className="lg:hidden bg-[#2A1F17] dark:bg-slate-900 border-b-2 border-[#1A1512] dark:border-slate-700 px-4 py-2.5 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5">
              <Link href="/owner" className="px-3 py-1.5 rounded-lg text-[#D3C8BB] text-xs font-bold whitespace-nowrap">Overview</Link>
              <Link href="/owner/finance" className="px-3 py-1.5 rounded-lg text-[#D3C8BB] text-xs font-bold whitespace-nowrap">Keuangan</Link>
              <Link href="/owner/reports" className="px-3 py-1.5 rounded-lg text-[#D3C8BB] text-xs font-bold whitespace-nowrap">Laporan</Link>
              <Link href="/owner/settings" className="px-3 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-black whitespace-nowrap">Pengaturan</Link>
            </div>
            <button type="button" onClick={() => setIsDarkMode(!isDarkMode)} className="p-1.5 rounded-lg bg-white/10 text-amber-300 shrink-0">
              {isDarkMode ? <Icons.Sun /> : <Icons.Moon />}
            </button>
          </div>

          <header className="bg-white dark:bg-slate-900 border-b-2 border-[#E0D6CC] dark:border-slate-700 px-5 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
            <div>
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-[#1A1512] dark:text-white">Pengaturan Akun & AI</h1>
              <p className="text-xs font-bold text-[#5C4B3E] dark:text-slate-300">Kelola konfigurasi AI Business Advisor, keamanan, dan status cabang</p>
            </div>
            <button
              type="button"
              onClick={() => setIsDarkMode(!isDarkMode)}
              title="Ubah Tema"
              className="hidden lg:inline-flex p-2 rounded-xl bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 text-[#1A1512] dark:text-amber-400"
            >
              {isDarkMode ? <Icons.Sun /> : <Icons.Moon />}
            </button>
          </header>

          <main className="p-5 sm:p-8 max-w-4xl w-full mx-auto space-y-6">
            {/* KONFIGURASI AI BUSINESS ADVISOR */}
            <section className="owner-card bg-white dark:bg-slate-900 border-2 border-[#E0D6CC] dark:border-slate-700 rounded-2xl p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b-2 border-[#F4EFE9] dark:border-slate-700">
                <div>
                  <h2 className="text-base font-black text-[#1A1512] dark:text-white">Konfigurasi AI Business Advisor</h2>
                  <p className="text-xs font-bold text-[#5C4B3E] dark:text-slate-300 mt-0.5">Tersimpan lintas perangkat di database akun Owner</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-black ${aiApiKey ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-[#1A1512]'}`}>
                  {aiApiKey ? 'API Key Aktif' : 'Mode Analisis Lokal'}
                </span>
              </div>

              <form onSubmit={handleSaveAiConfig} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-[#1A1512] dark:text-slate-200 mb-1.5">Provider AI</label>
                    <select
                      value={aiProvider}
                      onChange={(e) => handleProviderChange(e.target.value)}
                      className="w-full bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1A1512] dark:text-white outline-none"
                    >
                      <option value="gemini">Google Gemini</option>
                      <option value="deepseek">DeepSeek</option>
                      <option value="openai">OpenAI (ChatGPT)</option>
                      <option value="groq">Groq Cloud (Llama 3)</option>
                      <option value="openrouter">OpenRouter</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#1A1512] dark:text-slate-200 mb-1.5">Model AI</label>
                    <select
                      value={aiModel}
                      onChange={(e) => setAiModel(e.target.value)}
                      className="w-full bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1A1512] dark:text-white outline-none"
                    >
                      {(AI_MODELS[aiProvider] || []).map((m) => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                      ))}
                      <option value="custom">Model Kustom (Ketik Sendiri)</option>
                    </select>
                  </div>
                </div>

                {aiModel === 'custom' && (
                  <div>
                    <label className="block text-xs font-black text-[#1A1512] dark:text-slate-200 mb-1.5">Nama Model Kustom</label>
                    <input
                      type="text"
                      value={customModel}
                      onChange={(e) => setCustomModel(e.target.value)}
                      placeholder="Contoh: gemini-2.5-flash-lite atau gpt-4.1-mini"
                      required
                      className="w-full bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1A1512] dark:text-white outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-black text-[#1A1512] dark:text-slate-200 mb-1.5">API Key ({aiProvider.toUpperCase()})</label>
                  <input
                    type="password"
                    value={aiApiKey}
                    onChange={(e) => setAiApiKey(e.target.value)}
                    placeholder="Tempel API Key Anda di sini"
                    className="w-full bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1A1512] dark:text-white outline-none"
                  />
                  <p className="text-[11px] font-bold text-[#5C4B3E] dark:text-slate-400 mt-1.5">
                    Riset anomali fraud, restok, dan harga coret tetap berjalan otomatis di server. API Key dipakai saat fitur Tanya Jawab AI Advisor digunakan.
                  </p>
                </div>

                {testAiOutput && (
                  <div className="rounded-xl bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#2563EB]/40 p-3.5 text-xs font-bold text-[#1A1512] dark:text-slate-100">
                    <strong className="text-[#2563EB] dark:text-sky-300 block mb-1">Hasil Tes Koneksi AI:</strong>
                    {testAiOutput}
                  </div>
                )}

                <div className="flex flex-wrap gap-2.5 pt-1">
                  <button
                    type="submit"
                    disabled={isSavingAi}
                    className="px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-black transition-colors disabled:opacity-50"
                  >
                    {isSavingAi ? 'Menyimpan...' : 'Simpan Konfigurasi AI'}
                  </button>
                  <button
                    type="button"
                    onClick={handleTestAiConnection}
                    disabled={isTestingAi}
                    className="px-4 py-2.5 rounded-xl bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 text-xs font-black text-[#1A1512] dark:text-white hover:bg-[#EFEAE2] dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                  >
                    {isTestingAi ? 'Menguji Koneksi...' : 'Tes Koneksi AI'}
                  </button>
                </div>
              </form>
            </section>

            {/* KEAMANAN AKUN */}
            <section className="owner-card bg-white dark:bg-slate-900 border-2 border-[#E0D6CC] dark:border-slate-700 rounded-2xl p-6 space-y-5">
              <div className="pb-4 border-b-2 border-[#F4EFE9] dark:border-slate-700">
                <h2 className="text-base font-black text-[#1A1512] dark:text-white">Keamanan Akun Owner</h2>
                <p className="text-xs font-bold text-[#5C4B3E] dark:text-slate-300 mt-0.5">Perbarui kata sandi login Anda</p>
              </div>

              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-[#1A1512] dark:text-slate-200 mb-1.5">Email Terdaftar</label>
                  <input type="text" value={userEmail} disabled className="w-full bg-[#EFEAE2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#5C4B3E] dark:text-slate-400 cursor-not-allowed" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-[#1A1512] dark:text-slate-200 mb-1.5">Password Baru</label>
                    <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Minimal 6 karakter" className="w-full bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1A1512] dark:text-white outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-[#1A1512] dark:text-slate-200 mb-1.5">Konfirmasi Password Baru</label>
                    <input type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Ulangi password baru" className="w-full bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1A1512] dark:text-white outline-none" />
                  </div>
                </div>
                <button type="submit" disabled={isUpdatingPass} className="px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-black transition-colors disabled:opacity-50">
                  {isUpdatingPass ? 'Menyimpan...' : 'Perbarui Password'}
                </button>
              </form>
            </section>

            {/* MANAJEMEN CABANG */}
            <section className="owner-card bg-white dark:bg-slate-900 border-2 border-[#E0D6CC] dark:border-slate-700 rounded-2xl p-6 space-y-4">
              <div className="pb-3 border-b-2 border-[#F4EFE9] dark:border-slate-700">
                <h2 className="text-base font-black text-[#1A1512] dark:text-white">Manajemen Cabang</h2>
                <p className="text-xs font-bold text-[#5C4B3E] dark:text-slate-300 mt-0.5">Ubah nama outlet atau aktif/nonaktifkan akses kasir</p>
              </div>

              <div className="space-y-2.5">
                {isLoading ? (
                  <p className="text-xs font-bold text-[#5C4B3E] dark:text-slate-300 py-4 text-center">Memuat cabang...</p>
                ) : tenants.map(t => (
                  <div key={t.id} className="p-3.5 rounded-xl bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-black text-[#1A1512] dark:text-white">{t.name}</p>
                      <p className={`text-xs font-extrabold mt-0.5 ${t.is_active ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
                        {t.is_active ? 'Aktif' : 'Disuspend'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => { setEditName(t.name); setEditModal({ open: true, branch: t }); }}
                        className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border-2 border-[#E0D6CC] dark:border-slate-600 text-xs font-black text-[#1A1512] dark:text-white"
                      >
                        Ubah Nama
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleBranch(t)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-black text-white ${t.is_active ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                      >
                        {t.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* MODAL EDIT CABANG */}
      {editModal.open && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border-2 border-[#E0D6CC] dark:border-slate-700 w-full max-w-md rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-black text-[#1A1512] dark:text-white">Ubah Nama Cabang</h3>
            <form onSubmit={handleEditBranch} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-[#1A1512] dark:text-slate-200 mb-1">Nama Kafe Baru</label>
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required className="w-full bg-[#FAF6F2] dark:bg-slate-800 border-2 border-[#E0D6CC] dark:border-slate-600 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1A1512] dark:text-white" />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setEditModal({ open: false, branch: null })} className="flex-1 py-2.5 rounded-xl border-2 border-[#E0D6CC] dark:border-slate-600 text-xs font-black text-[#1A1512] dark:text-slate-200">Batal</button>
                <button type="submit" disabled={isSubmittingBranch} className="flex-1 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-black">{isSubmittingBranch ? 'Menyimpan...' : 'Simpan'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast.show && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 bg-white dark:bg-slate-900 border-2 border-[#E0D6CC] dark:border-slate-700 px-4 py-3 rounded-xl shadow-lg">
          <span className={`w-2.5 h-2.5 rounded-full ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
          <p className="text-xs font-black text-[#1A1512] dark:text-white">{toast.message}</p>
        </div>
      )}
    </div>
  );
}