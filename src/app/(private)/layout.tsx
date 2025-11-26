import Link from 'next/link';

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex h-screen overflow-hidden bg-gradient-subtle">
      <aside className="to-brand-blue-950 absolute left-0 top-0 z-[100] h-full w-[18rem] -translate-x-full border-r border-brand-purple-200 bg-gradient-to-b from-brand-purple-950 via-brand-purple-900 shadow-2xl duration-300 ease-linear lg:static lg:translate-x-0">
        <div className="flex h-full flex-col p-4">
          <div className="mb-6 border-b border-brand-purple-700/50 pb-4">
            <h2 className="text-2xl font-bold text-gradient-primary">
              Panel Admin
            </h2>
          </div>
          <nav className="flex-1 space-y-1">
            <Link
              href="/admin/pagos"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-300 transition-colors hover:bg-brand-purple-800 hover:text-white"
            >
              <span className="text-xl">💰</span>
              <span className="font-medium">Pagos</span>
            </Link>
          </nav>
        </div>
      </aside>

      <section className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <header className="sticky top-0 z-[99] flex w-full items-center justify-center border-b border-brand-purple-100/50 bg-white/80 p-3 shadow-md backdrop-blur-md">
          <div className="flex flex-grow items-center justify-between p-4 md:px-6 2xl:px-11">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 animate-pulse rounded-full bg-gradient-primary"></div>
              <p className="font-semibold text-gradient-simple">
                Panel de Administración
              </p>
            </div>
          </div>
        </header>

        <main className="p-6">{children}</main>
      </section>
    </div>
  );
}
