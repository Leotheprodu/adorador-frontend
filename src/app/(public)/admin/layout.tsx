import { CreditCardIcon } from '@global/icons/CreditCardIcon';
import Link from 'next/link';


export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] bg-slate-50 dark:bg-gray-950">
      {/* Sidebar */}
      <aside className="hidden w-64 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-black lg:block">
        <div className="sticky top-20 flex h-[calc(100vh-10rem)] flex-col p-4">
          <div className="mb-6 border-b border-slate-200 pb-4 dark:border-slate-800">
            <h2 className="bg-gradient-to-r from-brand-purple-600 to-brand-blue-600 bg-clip-text text-2xl font-bold text-transparent dark:from-brand-purple-400 dark:to-brand-blue-400">
              Panel Admin
            </h2>
          </div>
          <nav className="flex-1 space-y-1">
            <Link
              href="/admin/pagos"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              <CreditCardIcon className="h-5 w-5" />
              <span className="font-medium">Pagos</span>
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
