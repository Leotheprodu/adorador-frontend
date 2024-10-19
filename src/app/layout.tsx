import type { Metadata } from 'next';
import '../global/config/globals.css';
import { Toaster } from 'react-hot-toast';
import { Providers } from '../global/utils/Providers';
import { appDescription, appName, domain } from '@/global/config/constants';

export const metadata: Metadata = {
  title: {
    template: `%s | ${appName}`,
    default: `${appName}`,
  },
  description: `${appDescription}`,
  keywords: ['iglesia', 'herramientas', 'cristiano'],
  openGraph: {
    title: `${appName}`,
    description: `${appDescription}`,
    url: `${domain}`,
    siteName: `${appName}`,
    images: [
      {
        url: '/yehu.jpg',
        width: 1200,
        height: 628,
        alt: 'yehu imagen',
      },
    ],
    locale: 'es_CR',
    type: 'website',
  },
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  /* twitter: {
    card: 'summary_large_image',
    title: `${appName}`,
    description: `${appDescription}`,
    siteId: '1467726470533754880',
    creator: '@nextjs',
    creatorId: '1467726470533754880',
    images: ['https://nextjs.org/og.png'],
  }, */
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <Providers>
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  );
}
