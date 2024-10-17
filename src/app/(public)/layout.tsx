import { Header } from "./(ui)/header/Header";

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
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
  );
}
