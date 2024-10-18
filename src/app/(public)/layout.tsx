import { Header } from "./(ui)/header/Header";

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="grid grid-rows-[5rem_1fr_15rem] min-h-screen">
      <div className="h-[5rem]">
        <Header />
      </div>
      <main className="">{children}</main>
      <div className="h-[15rem]">
        <footer className="h-full bg-negro text-blanco"></footer>
      </div>
    </div>
  );
}
