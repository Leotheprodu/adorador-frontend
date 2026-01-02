'use client';

import { useState } from 'react';
import { CreditCardIcon } from '@global/icons/CreditCardIcon';
import { MenuButtonIcon } from '@global/icons/MenuButtonIcon';
import { XMarkIcon } from '@global/icons/XMarkIcon';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@heroui/react';

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Pagos',
      href: '/admin/pagos',
      icon: CreditCardIcon,
    },
    // Se pueden agregar más items aquí
  ];

  const SidebarContent = () => (
    <div className="flex h-full flex-col p-4 pt-8 lg:pt-4">
      <div className="mb-8 border-b border-slate-200 pb-4 dark:border-slate-800">
        <h2 className="bg-gradient-to-r from-brand-purple-600 to-brand-blue-600 bg-clip-text text-2xl font-bold text-transparent dark:from-brand-purple-400 dark:to-brand-blue-400">
          Panel Admin
        </h2>
      </div>
      <nav className="flex-1 space-y-1.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                isActive
                  ? 'bg-brand-purple-50 font-semibold text-brand-purple-700 shadow-sm dark:bg-brand-purple-900/20 dark:text-brand-purple-400'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900/50 dark:hover:text-slate-200'
              }`}
            >
              <Icon
                className={`h-5 w-5 ${isActive ? 'text-brand-purple-600 dark:text-brand-purple-400' : ''}`}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div className="flex min-h-[calc(100vh-10rem)] bg-slate-50 dark:bg-gray-950">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white transition-transform duration-300 ease-in-out dark:bg-black lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-slate-200 shadow-xl dark:border-slate-800`}
      >
        <div className="absolute right-4 top-4">
          <Button
            isIconOnly
            variant="light"
            radius="full"
            onPress={() => setIsMobileMenuOpen(false)}
          >
            <XMarkIcon className="h-6 w-6" />
          </Button>
        </div>
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-black lg:block">
        <div className="sticky top-20 h-[calc(100vh-10rem)]">
          <SidebarContent />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur-md dark:border-slate-800 dark:bg-black/80 lg:hidden">
          <Button
            isIconOnly
            variant="light"
            radius="full"
            onPress={() => setIsMobileMenuOpen(true)}
          >
            <MenuButtonIcon className="h-6 w-6" />
          </Button>
          <span className="font-bold text-slate-900 dark:text-white">
            Admin
          </span>
        </header>

        <main className="mx-auto w-full max-w-7xl p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
