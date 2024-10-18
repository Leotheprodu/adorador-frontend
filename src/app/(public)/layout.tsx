import { Footer } from "./_ui/footer/Footer";

import { Header } from "./_ui/header/Header";

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="grid grid-rows-[5rem_1fr_15rem] min-h-screen">
      <div className="h-[5rem]">
        <Header />
      </div>
      <main className="">{children}</main>

      <div className="flex flex-col min-h-[15rem] min-w-full">
        <Footer />
      </div>
    </div>
  );
}
