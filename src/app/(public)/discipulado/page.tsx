import { posts } from '@global/content/posts';
import Link from 'next/link';
import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Discipulados',
  description: 'Artículos y recursos para el crecimiento espiritual cristiano.',
  keywords: ['discipulado', 'cristianismo', 'recursos espirituales'],
  openGraph: {
    title: 'Discipulados',
    description:
      'Artículos y recursos para el crecimiento espiritual cristiano.',
    url: '/discipulado',
    siteName: 'adorador.xyz',
    images: [
      {
        url: '/images/posts/adorar-en-espiritu.avif',
        width: 1200,
        height: 628,
        alt: 'Discipulados en adorador.xyz',
      },
    ],
    locale: 'es_CR',
    type: 'website',
  },
};

export default function DiscipuladoListPage() {
  const discipulados = posts.filter((p) => p.category === 'discipulado');

  return (
    <main className="mx-auto mb-[20rem] max-w-4xl px-4 py-10">
      <h1 className="mb-6 text-4xl font-bold">Discipulados</h1>
      <p className="mb-8 text-lg text-gray-700">
        Aquí encontrarás recursos para tu crecimiento espiritual.
      </p>
      <div className="space-y-8">
        {discipulados.map((post) => (
          <Link
            key={post.id}
            href={`/discipulado/${post.slug}`}
            className="block w-80 rounded-2xl border border-gray-200 p-6 transition hover:shadow-md"
          >
            {post.image && (
              <Image
                width={320}
                height={180}
                src={post.image}
                alt={post.title}
                className="mb-4 h-48 w-full rounded-xl object-cover"
              />
            )}
            <h2 className="text-2xl font-semibold">{post.title}</h2>
            <p className="text-sm text-gray-500">
              Publicado el {new Date(post.date).toLocaleDateString('es-ES')}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
