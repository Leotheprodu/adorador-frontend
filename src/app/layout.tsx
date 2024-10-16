import type { Metadata } from "next";
import localFont from "next/font/local";
import "./(ui)/globals.css";
import { Toaster } from "react-hot-toast";
import { Providers } from "./(ui)/providers";

const geistSans = localFont({
  src: "./(ui)/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./(ui)/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Adorador",
  description: "Sistema de Lyrics para Iglesias",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  );
}
