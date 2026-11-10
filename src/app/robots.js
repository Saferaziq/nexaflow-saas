export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/dashboard/', '/kitchen/'], // Melarang Google merayapi halaman internal (private)
    },
    sitemap: 'https://nexaflowkasir.it.com/sitemap.xml',
  };
}