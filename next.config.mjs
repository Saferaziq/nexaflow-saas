/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@supabase/supabase-js', 'chart.js', 'react-chartjs-2'],
};

export default nextConfig;