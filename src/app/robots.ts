import type { MetadataRoute } from 'next';
import { domain } from '@global/config/constants';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/api',
          '/_next',
          '/auth/',
          '/*/eventos/*/en-vivo', // Prevent indexing of live event pages
        ],
      },
    ],
    sitemap: `${domain}/sitemap.xml`,
  };
}
