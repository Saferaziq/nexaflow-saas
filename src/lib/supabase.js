import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const memoryStorage = new Map();

const safeStorage = {
  getItem: (key) => {
    if (typeof window === 'undefined') return null;
    try {
      const value = window.localStorage.getItem(key);
      if (value !== null) return value;
    } catch {
      // Fallback ke sessionStorage jika localStorage dibatasi Safari iOS 15
    }
    try {
      const sessionVal = window.sessionStorage.getItem(key);
      if (sessionVal !== null) return sessionVal;
    } catch {
      // Fallback ke memori sementara
    }
    return memoryStorage.has(key) ? memoryStorage.get(key) : null;
  },
  setItem: (key, value) => {
    if (typeof window === 'undefined') return;
    memoryStorage.set(key, value);
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Abaikan jika localStorage diblokir
    }
    try {
      window.sessionStorage.setItem(key, value);
    } catch {
      // Abaikan jika sessionStorage diblokir
    }
  },
  removeItem: (key) => {
    if (typeof window === 'undefined') return;
    memoryStorage.delete(key);
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Abaikan jika localStorage diblokir
    }
    try {
      window.sessionStorage.removeItem(key);
    } catch {
      // Abaikan jika sessionStorage diblokir
    }
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: safeStorage,
    lock: async (_name, _acquireTimeout, fn) => {
      return await fn();
    },
  },
});
