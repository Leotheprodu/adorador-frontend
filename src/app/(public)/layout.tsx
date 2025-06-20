import { MusicPlayer } from '@bands/[bandId]/canciones/_components/musicPlayer/MusicPlayer';
import { LastFooter } from '@ui/footer/components/LastFooter';
import { Footer } from '@ui/footer/Footer';

import { Header } from '@ui/header/Header';

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen">
      <div className="h-[5rem]">
        <Header />
      </div>
      <main className="mb-10">{children}</main>

      <Footer />
      <MusicPlayer />
      <LastFooter />
    </div>
  );
}
