import { posts } from '@global/content/posts';
import Link from 'next/link';
import type { Metadata } from 'next';
import Image from 'next/image';
import { BookOpenIcon, CalendarIcon } from '@global/icons';

export const metadata: Metadata = {
  title: 'Discipulados',
  description: 'Artículos y recursos para el crecimiento espiritual cristiano.',
  keywords: ['discipulado', 'cristianismo', 'recursos espirituales'],
  openGraph: {
    title: 'Discipulados',
    description:
      'Artículos y recursos para el crecimiento espiritual cristiano.',
    url: '/discipulado',
    siteName: 'zamr.app',
    images: [
      {
        url: '/images/posts/adorar-en-espiritu.avif',
        width: 1200,
        height: 628,
        alt: 'Discipulados en zamr.app',
      },
    ],
    locale: 'es_CR',
    type: 'website',
  },
};

export default function DiscipuladoListPage() {
  const discipulados = posts.filter((p) => p.category === 'discipulado');

  return (
    <main className="mx-auto mb-[20rem] max-w-7xl px-4 py-10">
      {/* Header Section */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 bg-gradient-to-r from-brand-purple-500 via-brand-pink-500 to-brand-blue-500 bg-clip-text text-5xl font-bold text-transparent">
          Discipulados
        </h1>
        <p className="flex items-center justify-center gap-2 text-lg text-slate-600">
          <BookOpenIcon className="h-6 w-6 text-brand-purple-500" />
          Recursos para tu crecimiento espiritual
        </p>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {discipulados.map((post) => (
          <Link
            key={post.id}
            href={`/discipulado/${post.slug}`}
            className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-200 transition-all hover:scale-105 hover:shadow-2xl active:scale-100"
          >
            {/* Image Container with Gradient Overlay */}
            {post.image && (
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  width={400}
                  height={192}
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>
            )}

            {/* Content */}
            <div className="flex flex-grow flex-col p-6">
              <h2 className="mb-3 text-xl font-bold text-slate-800 transition-colors group-hover:text-brand-purple-500">
                {post.title}
              </h2>
              <div className="mt-auto flex items-center gap-2 text-sm text-slate-500">
                <CalendarIcon className="h-6 w-6 text-brand-purple-500" />
                <p>
                  {new Date(post.date).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {/* Hover Indicator */}
            <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-brand-purple-500 via-brand-pink-500 to-brand-blue-500 transition-all duration-300 group-hover:w-full" />
          </Link>
        ))}
      </div>
    </main>
  );
}
