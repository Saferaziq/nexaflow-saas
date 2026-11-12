\# 🍎 Kompatibilitas iPad iOS 15.6.7 — NexaFlow



Dokumen ini mencatat \*\*masalah, solusi, dan cara rollback\*\* untuk kompatibilitas NexaFlow

di iPad dengan iOS 15.6.7 (Safari 15). Ditulis: 7 November 2026.



\---



\## 🚨 Masalah yang Ditemukan



\### Gejala

\- Halaman `nexaflowkasir.it.com/login` \*\*bisa dibuka\*\* di iPad iOS 15.6.7

\- Tapi tombol \*\*Login tidak berfungsi\*\* — tidak redirect ke dashboard

\- \*\*Konsol JavaScript crash\*\* saat load (tidak sampai eksekusi `signInWithPassword`)

\- \*\*Perangkat lain (laptop, Android, iPhone modern) normal\*\*



\### Akar Masalah

1\. \*\*Next.js 16\*\* secara resmi hanya mendukung \*\*Safari 16.4+\*\*

2\. \*\*Supabase JS `v2.118.0`\*\* menggunakan fitur JavaScript modern:

&#x20;  - `class static block` (ES2022)

&#x20;  - `RegExp lookbehind` (ES2018)

&#x20;  - `Array.prototype.at()` (ES2022)

&#x20;  - `Object.hasOwn()` (ES2022)

3\. Konfigurasi `browserslist` di `package.json` \*\*tidak men-transpile library pihak ketiga\*\* — hanya kode aplikasi sendiri

4\. Safari 15 gagal parse JavaScript → tidak bisa lanjut ke kode login



\### Fitur iOS 15 yang Tidak Didukung

| Fitur | Status | Dampak |

|-------|--------|--------|

| \*\*Wake Lock API\*\* | ❌ Tidak ada | Layar iPad mati sendiri (harus manual di Settings → Auto-Lock: Never) |

| \*\*Web Push Notifications\*\* | ❌ Tidak ada | Notifikasi saat iPad di background tidak muncul |

| \*\*WebSocket (realtime)\*\* | ⚠️ Tidak stabil | Realtime bisa delay 2-5 detik |

| \*\*Audio autoplay\*\* | ⚠️ Butuh tap manual | Harus klik tombol untuk aktifkan suara |



\---



\## ✅ Solusi yang Diterapkan (2 Lapis)



\### Lapis 1 — Konfigurasi `browserslist`

\*\*File\*\*: `package.json`

\*\*Tujuan\*\*: Beri tahu Next.js agar compile kode aplikasi ke target Safari 15



```json

"browserslist": \[

&#x20; "chrome 111",

&#x20; "edge 111",

&#x20; "firefox 111",

&#x20; "safari 15"

]

