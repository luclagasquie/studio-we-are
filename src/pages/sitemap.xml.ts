import type { APIRoute } from 'astro';

const SITE = 'https://we-are.fr';

const staticPages = [
  { loc: '/', changefreq: 'weekly', priority: '1.0' },
  { loc: '/prestations/', changefreq: 'monthly', priority: '0.8' },
  { loc: '/projets/', changefreq: 'monthly', priority: '0.8' },
  { loc: '/a-propos/', changefreq: 'monthly', priority: '0.7' },
  { loc: '/contact/', changefreq: 'monthly', priority: '0.6' },
  { loc: '/mentions-legales/', changefreq: 'yearly', priority: '0.3' },
  { loc: '/politique-confidentialite/', changefreq: 'yearly', priority: '0.3' },
];

export const GET: APIRoute = async () => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
  .map(
    (url) => `  <url>
    <loc>${SITE}${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
