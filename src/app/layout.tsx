import type { Metadata } from "next";
import "./(ui)/globals.css";
import { Toaster } from "react-hot-toast";
import { Providers } from "./(ui)/providers";
import { Header } from "./(ui)/header/Header";

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
      <body className={`antialiased`}>
        <Providers>
          <Toaster />
          <div className="grid grid-rows-[5rem_1fr_15rem] relative">
            <div className="h-[5rem]">
              <header className="h-[5rem] w-screen bg-blanco bg-opacity-10 backdrop-blur-2xl fixed top-0">
                <Header />
              </header>
            </div>
            <main>{children}</main>
            <div className="h-[15rem]">
              <footer className="h-full w-screen bg-negro text-blanco"></footer>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
