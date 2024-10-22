import { Footer } from '@ui/footer/Footer';

import { Header } from '@ui/header/Header';

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="grid min-h-screen grid-rows-[5rem_1fr_15rem]">
      <div className="h-[5rem]">
        <Header />
      </div>
      <main className="mb-10">{children}</main>

      <div className="flex min-h-[15rem] min-w-full flex-col">
        <Footer />
      </div>
    </div>
  );
}
