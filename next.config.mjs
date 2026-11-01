/** @type {import('next').NextConfig} */
const nextConfig = {
  // eslint config dihapus — Next.js 16 sudah tidak support key 'eslint'
  // Kalau butuh skip eslint saat build, pakai ESLINT_NO_DEV_ERRORS=true di .env atau
  // tambahkan eslint.ignoreDuringBuilds di tempat lain (tidak direkomendasikan).
};

export default nextConfig;