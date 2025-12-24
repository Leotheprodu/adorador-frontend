import type { Metadata } from 'next';
import '@global/config/globals.css';
import { Toaster } from 'react-hot-toast';
import { Providers } from '@global/utils/Providers';
import { appDescription, appName, domain } from '@global/config/constants';
import { ThemeScript } from '@global/components/ThemeScript';

export const metadata: Metadata = {
  title: {
    template: `%s | ${appName}`,
    default: `${appName} | Herramientas para Ministerios de Alabanza`,
  },
  description: `${appDescription}`,
  metadataBase: new URL(domain || 'https://www.zamr.app'),
  alternates: {
    canonical: '/',
  },
  keywords: [
    'alabanza',
    'adoración',
    'ministerio cristiano',
    'herramientas para iglesias',
    'letras y acordes',
    'gestión de eventos cristianos',
    'equipo de alabanza',
    'cancionero cristiano',
  ],
  authors: [{ name: 'Zamr Team' }],
  creator: 'Zamr',
  publisher: 'Zamr',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico', // Placeholder for apple-touch-icon if not exists
  },
  openGraph: {
    title: `${appName} | Gestiona tu Ministerio de Alabanza`,
    description: `${appDescription}`,
    url: `${domain}`,
    siteName: `${appName}`,
    images: [
      {
        url: '/images/adoradorxyz.webp',
        width: 1200,
        height: 628,
        alt: 'Zamr - Plataforma profesional para equipos de alabanza y liderazgo cristiano.',
      },
    ],
    locale: 'es_CR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${appName} | Herramientas para Ministerios`,
    description: `${appDescription}`,
    images: ['/images/adoradorxyz.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="bg-blanco dark:bg-gray-950">
        <Providers>
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  );
}
