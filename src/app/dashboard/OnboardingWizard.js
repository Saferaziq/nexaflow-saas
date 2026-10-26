"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function OnboardingWizard({ tenantId, onNavigate }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  const [progress, setProgress] = useState({
    logo: false,
    banner: false,
    wa: false,
    pin: false,
    menu: false,
    table: false,
  });

  const autoShownRef = useRef(false);
  const storageKey = tenantId ? `nexaflow_onboarding_dismissed_${tenantId}` : null;

  // Cek dismissed + fetch progress
  useEffect(() => {
    if (!tenantId || !storageKey) return;
    if (localStorage.getItem(storageKey) === "1") {
      setDismissed(true);
      setLoading(false);
      return;
    }
    fetchProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantId]);

  const fetchProgress = async () => {
    setLoading(true);
    try {
      const [tenantRes, menuRes, tableRes] = await Promise.all([
        supabase
          .from("tenants")
          .select("logo_url, banner_url, wa_number, kitchen_pin")
          .eq("id", tenantId)
          .single(),
        supabase
          .from("menus")
          .select("id", { count: "exact", head: true })
          .eq("tenant_id", tenantId),
        supabase
          .from("tables")
          .select("id", { count: "exact", head: true })
          .eq("tenant_id", tenantId),
      ]);

      const t = tenantRes?.data || {};
      setProgress({
        logo: Boolean(t.logo_url),
        banner: Boolean(t.banner_url),
        wa: Boolean(t.wa_number),
        pin: Boolean(t.kitchen_pin) && String(t.kitchen_pin) !== "1234",
        menu: (menuRes?.count || 0) > 0,
        table: (tableRes?.count || 0) > 0,
      });
    } catch (e) {
      console.error("Onboarding fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      key: "logo",
      icon: "🏷️",
      title: "Upload Logo Kafe",
      desc: "Logo tampil di struk & halaman pelanggan.",
      tab: "settings",
    },
    {
      key: "banner",
      icon: "🎨",
      title: "Upload Banner Kafe",
      desc: "Warna tema otomatis mengikuti banner ini.",
      tab: "settings",
    },
    {
      key: "wa",
      icon: "📱",
      title: "Isi Nomor WhatsApp",
      desc: "Untuk tombol konfirmasi & konsultasi.",
      tab: "settings",
    },
    {
      key: "pin",
      icon: "🔒",
      title: "Ganti PIN Dapur (KDS)",
      desc: "Default 1234 — ganti agar layar dapur lebih aman.",
      tab: "settings",
    },
    {
      key: "menu",
      icon: "🍽️",
      title: "Tambah Menu Pertama",
      desc: "Minimal 1 menu agar pelanggan bisa pesan.",
      tab: "menu",
    },
    {
      key: "table",
      icon: "🪑",
      title: "Daftarkan Meja",
      desc: "Buat meja & cetak QR untuk pelanggan.",
      tab: "tables",
    },
  ];

  const completedCount = Object.values(progress).filter(Boolean).length;
  const totalCount = steps.length;
  const percent = Math.round((completedCount / totalCount) * 100);

  // Auto-buka sekali saja di sesi pertama jika belum selesai
  useEffect(() => {
    if (autoShownRef.current) return;
    if (!loading && !dismissed && completedCount < totalCount) {
      autoShownRef.current = true;
      const timer = setTimeout(() => setOpen(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [loading, dismissed, completedCount, totalCount]);

  // Tutup dengan tombol Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const dismiss = () => {
    if (storageKey) localStorage.setItem(storageKey, "1");
    setDismissed(true);
    setOpen(false);
  };

  const handleNavigate = (tab) => {
    if (typeof onNavigate === "function") {
      onNavigate(tab);
      setOpen(false);
    }
  };

  if (dismissed || !tenantId) return null;

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full shadow-xl text-sm font-semibold text-white transition hover:scale-105 active:scale-95"
          style={{ backgroundColor: "var(--primary-color, #3A2A20)" }}
          aria-label="Buka panduan setup"
        >
          🚀 Panduan Setup
          <span className="text-xs bg-white/25 px-2 py-0.5 rounded-full">
            {completedCount}/{totalCount}
          </span>
        </button>
      )}

      {/* Modal Wizard */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div
              className="p-6"
              style={{ backgroundColor: "var(--primary-color, #3A2A20)" }}
            >
              <div className="flex items-start justify-between text-white">
                <div>
                  <h2 className="text-xl font-bold">Panduan Setup Kafe</h2>
                  <p className="text-sm opacity-90 mt-1">
                    Selesaikan langkah ini agar kafe siap jualan 🎉
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-white/80 hover:text-white text-2xl leading-none -mt-1"
                  aria-label="Tutup"
                >
                  ×
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-white/90 mb-1">
                  <span>Progress Setup</span>
                  <span>{percent}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/30 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-white transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 max-h-[55vh] overflow-y-auto">
              {loading ? (
                <p className="text-center text-gray-500 py-10">
                  Memeriksa status setup...
                </p>
              ) : (
                <div className="space-y-3">
                  {steps.map((step) => {
                    const done = progress[step.key];
                    return (
                      <div
                        key={step.key}
                        className={`flex items-start gap-3 p-3 rounded-2xl border transition ${
                          done
                            ? "bg-emerald-50 border-emerald-200"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div
                          className={`mt-0.5 w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-sm font-bold ${
                            done
                              ? "bg-emerald-500 text-white"
                              : "bg-white border-2 border-gray-300 text-gray-400"
                          }`}
                        >
                          {done ? "✓" : "○"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-semibold ${
                              done
                                ? "text-emerald-700 line-through"
                                : "text-gray-800"
                            }`}
                          >
                            {step.icon} {step.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {step.desc}
                          </p>
                        </div>
                        {!done && (
                          <button
                            onClick={() => handleNavigate(step.tab)}
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg text-white self-center shrink-0 transition hover:opacity-90"
                            style={{
                              backgroundColor: "var(--primary-color, #3A2A20)",
                            }}
                          >
                            Buka
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t flex items-center justify-between gap-3 bg-gray-50">
              <button
                onClick={dismiss}
                className="text-xs text-gray-500 hover:text-gray-700 underline"
              >
                Jangan tampilkan lagi
              </button>
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition hover:opacity-90"
                style={{ backgroundColor: "var(--primary-color, #3A2A20)" }}
              >
                {completedCount === totalCount ? "Selesai 🎉" : "Nanti Saja"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}