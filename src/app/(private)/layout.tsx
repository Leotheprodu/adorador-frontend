export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-200">
      <aside className="absolute left-0 top-0 z-[100] h-full w-[18rem] -translate-x-full bg-slate-800 duration-300 ease-linear lg:static lg:translate-x-0">
        menu
      </aside>

      <section className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <header className="sticky top-0 z-[99] flex w-full items-center justify-center border-b-1 border-negro/20 bg-blanco p-3 drop-shadow-sm">
          <div className="flex flex-grow items-center justify-between p-4 shadow-sm md:px-6 2xl:px-11">
            <p>contenido del header</p>
          </div>
        </header>

        <main className="">{children}</main>
      </section>
    </div>
  );
}
