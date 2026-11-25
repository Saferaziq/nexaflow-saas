'use client';

import { useState, useEffect, useRef } from 'react';
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

const AI_PROVIDER_OPTIONS = [
  { value: 'gemini', label: 'Google Gemini (Google AI Studio)' },
  { value: 'deepseek', label: 'DeepSeek API (Official)' },
  { value: 'groq', label: 'Groq Cloud (Super Cepat)' },
  { value: 'openai', label: 'OpenAI (ChatGPT API)' },
  { value: 'openrouter', label: 'OpenRouter (Multi-Model)' },
];

const Icons = {
  Menu: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  Sun: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  Moon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  ChevronDown: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><polyline points="6 9 12 15 18 9"/></svg>,
  Close: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5"><polyline points="20 6 9 17 4 12"/></svg>,
  Logout: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 shrink-0"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Overview: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" className="w-4 h-4 shrink-0"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
  Finance: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" className="w-4 h-4 shrink-0"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  Box: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" className="w-4 h-4 shrink-0"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  Reports: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" className="w-4 h-4 shrink-0"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  Settings: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-4 h-4 shrink-0"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Bot: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5"><path d="M12 2a4 4 0 0 1 4 4v2h2a2 2 0 0 1 2 2v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-8a2 2 0 0 1 2-2h2V6a4 4 0 0 1 4-4z"/><circle cx="9" cy="13" r="1"/><circle cx="15" cy="13" r="1"/></svg>,
};

function NeuSelect({ value, onChange, options, placeholder = 'Pilih...', className = '' }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handleOutside);
    return () => document.removeEventListener('click', handleOutside);
  }, []);

  const selectedObj = options.find(opt => String(opt.value) === String(value));

  return (
    <div className={`relative ${className}`} ref={wrapRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="neu-inset w-full px-4 py-3.5 flex items-center justify-between gap-2 text-left text-xs sm:text-sm font-extrabold neu-text cursor-pointer"
      >
        <span className="truncate">{selectedObj ? selectedObj.label : placeholder}</span>
        <span className={`neu-sub shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}>
          <Icons.ChevronDown />
        </span>
      </button>

      {open && (
        <div className="neu-dropdown-menu absolute left-0 right-0 mt-2 p-1.5 z-50 space-y-1 max-h-60 overflow-y-auto">
          {options.map((opt) => {
            const isSelected = String(opt.value) === String(value);
            return (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`neu-dropdown-option w-full px-3.5 py-2.5 text-left text-xs flex items-center justify-between gap-2 ${
                  isSelected ? 'selected font-extrabold' : 'font-bold'
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && <Icons.Check />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function OwnerSettings() {
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const [aiProvider, setAiProvider] = useState('gemini');
  const [aiModel, setAiModel] = useState('gemini-2.5-flash');
  const [customModel, setCustomModel] = useState('');
  const [useCustomModel, setUseCustomModel] = useState(false);
  const [aiApiKey, setAiApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSavingAi, setIsSavingAi] = useState(false);
  const [isTestingAi, setIsTestingAi] = useState(false);
  const [aiTestReply, setAiTestReply] = useState('');

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('nexaflow_theme');
      if (savedTheme === 'dark') {
        setIsDarkMode(true);
      } else {
        setIsDarkMode(false);
      }
    } catch (e) {
      // noop
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const toggleTheme = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    try {
      localStorage.setItem('nexaflow_theme', next ? 'dark' : 'light');
    } catch (e) {
      // noop
    }
  };

  useEffect(() => {
    const getSessionAndConfig = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { window.location.href = '/login'; return; }
      const email = session.user.email;
      setUserEmail(email);

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
        // noop
      }

      try {
        const res = await fetch(`/api/owner/stats?manager_email=${encodeURIComponent(email)}&period=daily`);
        if (res.ok) {
          const data = await res.json();
          if (data?.savedAiConfig && (data.savedAiConfig.apiKey || data.savedAiConfig.provider)) {
            const dbCfg = data.savedAiConfig;
            setAiProvider(dbCfg.provider || 'gemini');
            const presetList = AI_PROVIDER_MODELS[dbCfg.provider || 'gemini'] || [];
            const isPreset = presetList.some((m) => m.value === dbCfg.model);
            if (isPreset) {
              setUseCustomModel(false);
              setAiModel(dbCfg.model);
            } else if (dbCfg.model) {
              setUseCustomModel(true);
              setCustomModel(dbCfg.model);
            }
            if (dbCfg.apiKey) setAiApiKey(dbCfg.apiKey);
            try {
              localStorage.setItem(
                'nexaflow_ai_config',
                JSON.stringify({
                  provider: dbCfg.provider || 'gemini',
                  model: dbCfg.model || 'gemini-2.5-flash',
                  customModel: isPreset ? '' : dbCfg.model,
                  useCustomModel: !isPreset,
                  apiKey: dbCfg.apiKey || '',
                })
              );
            } catch (e) {
              // noop
            }
          }
        }
      } catch (e) {
        // noop
      }

      setIsLoading(false);
    };
    getSessionAndConfig();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  const handleProviderChange = (nextProvider) => {
    setAiProvider(nextProvider);
    const defaultModel = AI_PROVIDER_MODELS[nextProvider]?.[0]?.value || '';
    setAiModel(defaultModel);
  };

  const handleSaveAiConfig = async (e) => {
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
    setIsSavingAi(true);
    try {
      try {
        localStorage.setItem('nexaflow_ai_config', JSON.stringify(payload));
      } catch (e) {
        // noop
      }
      const res = await fetch('/api/owner/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action_type: 'save_ai_config',
          manager_email: userEmail,
          provider: aiProvider,
          model: activeModel,
          apiKey: aiApiKey.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message || 'Konfigurasi AI berhasil disimpan ke database!', 'success');
      } else {
        showToast('Tersimpan di browser (pastikan SQL Tahap 1 sudah dijalankan di Supabase).', 'success');
      }
    } catch (err) {
      showToast('Gagal menyimpan konfigurasi AI', 'error');
    } finally {
      setIsSavingAi(false);
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
    <div className={`neu-owner-shell font-sans ${isDarkMode ? 'neu-dark' : ''}`}>
      <style>{`
        .neu-owner-shell {
          --bg-base: #E6E9EF;
          --surface: #E6E9EF;
          --surface-elevated: #EDF0F6;
          --shadow-light: #FFFFFF;
          --shadow-dark: #C2C8D4;
          --border-subtle: rgba(255, 255, 255, 0.65);
          --divider: rgba(148, 163, 184, 0.28);
          --text-primary: #1E2532;
          --text-secondary: #626E82;
          --sb-thumb: #C5CCD8;

          background-color: var(--bg-base);
          color: var(--text-primary);
          min-height: 100vh;
          min-height: -webkit-fill-available;
          transition: background-color 0.2s ease, color 0.18s ease;
        }
        .neu-owner-shell.neu-dark {
          --bg-base: #1B202C;
          --surface: #1B202C;
          --surface-elevated: #222838;
          --shadow-light: #252C3C;
          --shadow-dark: #11151D;
          --border-subtle: rgba(255, 255, 255, 0.06);
          --divider: rgba(148, 163, 184, 0.14);
          --text-primary: #F1F5F9;
          --text-secondary: #94A3B8;
          --sb-thumb: #2A3244;
        }

        .neu-owner-shell * {
          scrollbar-width: thin;
          scrollbar-color: var(--sb-thumb) var(--bg-base);
          -webkit-tap-highlight-color: transparent;
        }
        .neu-owner-shell ::-webkit-scrollbar { width: 8px; height: 8px; }
        .neu-owner-shell ::-webkit-scrollbar-track { background: var(--bg-base); }
        .neu-owner-shell ::-webkit-scrollbar-button { display: none; width: 0; height: 0; }
        .neu-owner-shell ::-webkit-scrollbar-thumb {
          background: var(--sb-thumb);
          border-radius: 9999px;
          border: 2px solid var(--bg-base);
        }
        .neu-owner-shell ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #2563EB, #10B981);
        }

        .neu-text { color: var(--text-primary); }
        .neu-sub { color: var(--text-secondary); }
        .neu-div { border-color: var(--divider); }

        .neu-card {
          background: var(--surface);
          border-radius: 26px;
          box-shadow: 9px 9px 18px var(--shadow-dark), -9px -9px 18px var(--shadow-light);
          border: 1px solid var(--border-subtle);
          transition: background-color 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, transform 0.16s ease;
        }
        .neu-card-hover:hover {
          background: var(--surface-elevated);
          border-color: rgba(37, 99, 235, 0.35);
          box-shadow: 11px 11px 22px var(--shadow-dark), -11px -11px 22px var(--shadow-light);
        }

        .neu-inset {
          background: var(--surface);
          border-radius: 16px;
          box-shadow: inset 5px 5px 10px var(--shadow-dark), inset -5px -5px 10px var(--shadow-light);
          border: 1px solid transparent;
        }
        .neu-inset:focus-within {
          border-color: rgba(37, 99, 235, 0.5);
          box-shadow: inset 5px 5px 10px var(--shadow-dark), inset -5px -5px 10px var(--shadow-light), 0 0 0 3px rgba(37, 99, 235, 0.15);
        }

        .neu-inset-pill {
          background: var(--surface);
          border-radius: 9999px;
          box-shadow: inset 4px 4px 8px var(--shadow-dark), inset -4px -4px 8px var(--shadow-light);
        }

        .neu-btn {
          background: var(--surface);
          border-radius: 15px;
          box-shadow: 5px 5px 10px var(--shadow-dark), -5px -5px 10px var(--shadow-light);
          border: 1px solid var(--border-subtle);
          transition: all 0.18s ease;
          cursor: pointer;
        }
        .neu-btn:hover {
          background: linear-gradient(135deg, #2563EB, #1D4ED8);
          color: #FFFFFF !important;
          border-color: #60A5FA;
          box-shadow: 6px 6px 14px var(--shadow-dark), 0 0 14px rgba(37, 99, 235, 0.35);
          transform: translateY(-1px);
        }
        .neu-btn:hover * { color: #FFFFFF !important; }
        .neu-btn:active {
          box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.4);
          transform: scale(0.97);
        }
        .neu-btn.active {
          background: linear-gradient(135deg, #2563EB, #10B981);
          color: #FFFFFF !important;
          border-color: rgba(255, 255, 255, 0.3);
          box-shadow: inset 3px 3px 7px rgba(0, 0, 0, 0.28), 0 4px 12px rgba(37, 99, 235, 0.28);
        }
        .neu-btn.active * { color: #FFFFFF !important; }

        .neu-btn-green:hover {
          background: linear-gradient(135deg, #16A34A, #15803D);
          border-color: #4ADE80;
          box-shadow: 6px 6px 14px var(--shadow-dark), 0 0 14px rgba(22, 163, 74, 0.38);
        }
        .neu-btn-danger:hover {
          background: linear-gradient(135deg, #E11D48, #BE123C);
          border-color: #FDA4AF;
          box-shadow: 6px 6px 14px var(--shadow-dark), 0 0 14px rgba(225, 29, 72, 0.38);
        }

        .neu-orb {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: var(--surface);
          box-shadow: 5px 5px 10px var(--shadow-dark), -5px -5px 10px var(--shadow-light);
          border: 1px solid var(--border-subtle);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.18s ease;
          cursor: pointer;
        }
        .neu-orb:hover {
          background: linear-gradient(135deg, #2563EB, #0EA5E9);
          color: #FFFFFF !important;
          border-color: #7DD3FC;
          box-shadow: 0 0 14px rgba(14, 165, 233, 0.45);
          transform: scale(1.06);
        }
        .neu-orb:active {
          box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.4);
          transform: scale(0.94);
        }

        .neu-knob {
          background: var(--surface);
          border-radius: 50%;
          box-shadow: 6px 6px 12px var(--shadow-dark), -6px -6px 12px var(--shadow-light);
          border: 1px solid var(--border-subtle);
        }

        .neu-dropdown-menu {
          background: var(--surface-elevated);
          border-radius: 20px;
          box-shadow: 10px 12px 24px var(--shadow-dark), -6px -6px 16px var(--shadow-light);
          border: 1px solid var(--border-subtle);
        }
        .neu-dropdown-option {
          border-radius: 12px;
          color: var(--text-primary);
          transition: all 0.15s ease;
          cursor: pointer;
        }
        .neu-dropdown-option:hover {
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.14), rgba(16, 185, 129, 0.12));
          color: #3B82F6;
        }
        .neu-dropdown-option.selected {
          background: linear-gradient(135deg, #2563EB, #10B981);
          color: #FFFFFF !important;
        }
        .neu-dropdown-option.selected * { color: #FFFFFF !important; }

        .ios-blur-backdrop {
          background: rgba(15, 23, 42, 0.48);
          -webkit-backdrop-filter: blur(4px);
          backdrop-filter: blur(4px);
        }
      `}</style>

      {/* BACKDROP SIDEBAR BUKA-TUTUP */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 ios-blur-backdrop z-40"
        />
      )}

      {/* SIDEBAR BUKA-TUTUP OWNER */}
      <aside
        className={`neu-card fixed top-3.5 left-3.5 bottom-3.5 z-50 w-64 p-5 flex flex-col justify-between transition-all duration-200 ${
          isSidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-[130%] opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex items-center justify-between gap-2.5 pb-4 border-b neu-div shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="neu-knob w-10 h-10 flex items-center justify-center shrink-0 p-1.5">
                <img src="/logo-nexaflow-3d.png" alt="NexaFlow Logo" className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black tracking-tight neu-text leading-none truncate">NEXAFLOW</p>
                <p className="text-[10px] font-extrabold text-emerald-500 tracking-wider uppercase mt-1">Owner Panel</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Tutup Sidebar"
              className="neu-orb w-9 h-9 neu-sub shrink-0"
            >
              <Icons.Close />
            </button>
          </div>

          <nav className="flex-1 mt-5 space-y-2.5 overflow-y-auto overflow-x-hidden pr-0.5">
            <Link
              href="/owner"
              onClick={() => setIsSidebarOpen(false)}
              className="neu-btn flex items-center gap-3 px-3.5 py-3 neu-sub text-xs font-bold whitespace-nowrap"
            >
              <Icons.Overview />
              <span>Command Center AI</span>
            </Link>

            <Link
              href="/owner/finance?tab=expenses_daily"
              onClick={() => setIsSidebarOpen(false)}
              className="neu-btn flex items-center gap-3 px-3.5 py-3 neu-sub text-xs font-bold whitespace-nowrap"
            >
              <Icons.Finance />
              <span>Keuangan & Gaji</span>
            </Link>

            <Link
              href="/owner/finance?tab=stocks"
              onClick={() => setIsSidebarOpen(false)}
              className="neu-btn flex items-center gap-3 px-3.5 py-3 neu-sub text-xs font-bold whitespace-nowrap"
            >
              <Icons.Box />
              <span>Master Menu & Stok</span>
            </Link>

            <Link
              href="/owner/reports"
              onClick={() => setIsSidebarOpen(false)}
              className="neu-btn flex items-center gap-3 px-3.5 py-3 neu-sub text-xs font-bold whitespace-nowrap"
            >
              <Icons.Reports />
              <span>Laporan Global P&L</span>
            </Link>

            <Link
              href="/owner/settings"
              onClick={() => setIsSidebarOpen(false)}
              className="neu-btn active flex items-center gap-3 px-3.5 py-3 text-xs font-extrabold whitespace-nowrap"
            >
              <Icons.Settings />
              <span>Pengaturan & AI Key</span>
            </Link>
          </nav>
        </div>

        <div className="pt-4 mt-4 border-t neu-div space-y-3 shrink-0">
          <div className="neu-inset p-3.5 overflow-hidden">
            <p className="text-xs font-black neu-text truncate">{userEmail || 'Owner'}</p>
            <p className="text-[11px] font-bold text-emerald-500 mt-0.5">Akun Executive Owner</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="neu-btn neu-btn-danger w-full flex items-center justify-center gap-2 py-2.5 px-3 text-rose-500 text-xs font-black"
          >
            <Icons.Logout />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* AREA KONTEN UTAMA */}
      <div className="max-w-4xl w-full mx-auto p-3.5 sm:p-6 space-y-6 pb-20">
        {/* HEADER */}
        <header className="neu-card px-4 sm:px-6 py-4 flex items-center justify-between gap-3 sticky top-3 z-30">
          <div className="flex items-center gap-3.5 min-w-0">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label="Buka atau Tutup Sidebar"
              className="neu-orb neu-text shrink-0"
            >
              <Icons.Menu />
            </button>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-black tracking-tight neu-text truncate">Pengaturan Akun & AI</h1>
              <p className="text-xs font-bold neu-sub mt-0.5 truncate">Kelola keamanan akun dan konfigurasi mesin AI Business Advisor</p>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Ubah Tema"
            className={`neu-orb shrink-0 ${isDarkMode ? 'text-sky-400' : 'text-amber-500'}`}
          >
            {isDarkMode ? <Icons.Sun /> : <Icons.Moon />}
          </button>
        </header>

        {/* KARTU PROFIL ANDA */}
        <div className="neu-card neu-card-hover p-6 sm:p-8">
          <h2 className="text-lg font-black neu-text mb-4">Profil Anda</h2>
          {isLoading ? (
            <p className="text-sm font-bold neu-sub">Memuat profil...</p>
          ) : (
            <div className="flex items-center gap-4">
              <div className="neu-knob w-16 h-16 flex items-center justify-center text-blue-500 font-black text-2xl shrink-0">
                {userEmail ? userEmail.charAt(0).toUpperCase() : 'O'}
              </div>
              <div className="neu-inset px-4 py-3 flex-1 min-w-0">
                <p className="text-[11px] font-extrabold uppercase tracking-wider neu-sub">Email Terdaftar</p>
                <p className="text-sm sm:text-base font-black neu-text truncate mt-0.5">{userEmail}</p>
              </div>
            </div>
          )}
        </div>

        {/* KARTU KONFIGURASI AI BUSINESS ADVISOR */}
        <div className="neu-card neu-card-hover p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-3.5">
              <div className="neu-knob w-11 h-11 flex items-center justify-center text-blue-500 shrink-0">
                <Icons.Bot />
              </div>
              <div>
                <h2 className="text-lg font-black neu-text">Konfigurasi AI Business Advisor</h2>
                <p className="text-xs font-semibold neu-sub mt-0.5">Tersimpan di database sehingga otomatis sinkron di Laptop & HP Anda</p>
              </div>
            </div>
            <span className={`neu-inset-pill px-3.5 py-1.5 text-[10px] font-black uppercase tracking-wider shrink-0 ${
              aiApiKey.trim() ? 'text-emerald-500' : 'text-amber-500'
            }`}>
              {aiApiKey.trim() ? 'API Key Aktif' : 'Mode Lokal / Belum Ada Key'}
            </span>
          </div>

          <form onSubmit={handleSaveAiConfig} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-black neu-sub mb-2 uppercase tracking-wider">Penyedia AI (Provider)</label>
                <NeuSelect
                  value={aiProvider}
                  onChange={handleProviderChange}
                  options={AI_PROVIDER_OPTIONS}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[11px] font-black neu-sub uppercase tracking-wider">Model AI yang Digunakan</label>
                  <button
                    type="button"
                    onClick={() => setUseCustomModel(!useCustomModel)}
                    className="text-[11px] font-extrabold text-blue-500 hover:underline"
                  >
                    {useCustomModel ? 'Pilih dari Daftar' : 'Ketik Model Manual'}
                  </button>
                </div>
                {useCustomModel ? (
                  <div className="neu-inset px-4 py-3.5">
                    <input
                      type="text"
                      value={customModel}
                      onChange={(e) => setCustomModel(e.target.value)}
                      placeholder="Contoh: gemini-2.5-flash / deepseek-chat"
                      className="bg-transparent w-full text-xs sm:text-sm font-bold neu-text outline-none"
                    />
                  </div>
                ) : (
                  <NeuSelect
                    value={aiModel}
                    onChange={setAiModel}
                    options={AI_PROVIDER_MODELS[aiProvider] || []}
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black neu-sub mb-2 uppercase tracking-wider">Tempel API Key AI</label>
              <div className="neu-inset px-4 py-3 flex items-center gap-2">
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
                  className="bg-transparent flex-1 text-xs sm:text-sm font-bold neu-text outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="neu-btn px-3 py-1.5 text-[11px] font-extrabold neu-text shrink-0"
                >
                  {showApiKey ? 'Sembunyikan' : 'Lihat'}
                </button>
              </div>
              <p className="text-xs font-semibold neu-sub mt-2.5 leading-relaxed">
                Hemat Token Aktif: Sistem hanya mengirim ringkasan angka berformat JSON kecil hasil hitungan PostgreSQL ke model AI, bukan ribuan baris transaksi mentah.
              </p>
            </div>

            {aiTestReply && (
              <div className="neu-inset p-4 text-xs font-semibold neu-text leading-relaxed">
                <span className="font-black text-emerald-500 block mb-1">Respon Tes AI Advisor:</span>
                {aiTestReply}
              </div>
            )}

            <div className="flex flex-wrap gap-3 pt-1">
              <button
                type="submit"
                disabled={isSavingAi}
                className="neu-btn neu-btn-green text-emerald-500 font-black py-3.5 px-6 text-xs sm:text-sm disabled:opacity-50"
              >
                {isSavingAi ? 'Menyimpan ke Database...' : 'Simpan Konfigurasi AI'}
              </button>
              <button
                type="button"
                onClick={handleTestAiConnection}
                disabled={isTestingAi}
                className="neu-btn text-blue-500 font-black py-3.5 px-5 text-xs sm:text-sm disabled:opacity-50"
              >
                {isTestingAi ? 'Mengetes Koneksi...' : 'Tes Koneksi AI'}
              </button>
            </div>
          </form>
        </div>

        {/* KARTU GANTI PASSWORD */}
        <div className="neu-card neu-card-hover p-6 sm:p-8">
          <h2 className="text-lg font-black neu-text mb-1">Ganti Password</h2>
          <p className="text-xs font-semibold neu-sub mb-6">Pastikan password baru Anda mudah diingat namun sulit ditebak.</p>

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-[11px] font-black neu-sub mb-2 uppercase tracking-wider">Password Baru</label>
              <div className="neu-inset px-4 py-3.5">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="bg-transparent w-full text-xs sm:text-sm font-bold neu-text outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isUpdating || !newPassword}
              className="neu-btn neu-btn-green text-emerald-500 font-black py-3.5 px-8 text-xs sm:text-sm disabled:opacity-50"
            >
              {isUpdating ? 'Menyimpan...' : 'Simpan Password'}
            </button>
          </form>
        </div>
      </div>

      {/* TOAST */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-[200]">
          <div className="neu-card flex items-center gap-3 px-5 py-3.5 rounded-2xl">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white ${
              toast.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'
            }`}>
              {toast.type === 'success' ? <Icons.Check /> : <Icons.Close />}
            </div>
            <p className="text-xs font-black neu-text pr-2">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}