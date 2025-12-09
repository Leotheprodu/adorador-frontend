/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { posts } from '@global/content/posts';
import ContentRenderer from './_components/ContentRenderer';
import Image from 'next/image';
import { authors } from '@global/content/authors';
import { LightBulbIcon } from '@global/icons';
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find(
    (p) => p.slug === slug && p.category === 'discipulado',
  );

  if (!post) {
    return {
      title: 'Discipulado',
      description: 'Artículos y recursos para el discipulado cristiano.',
    };
  }

  // Extraer la descripción del primer párrafo del contenido
  let description = 'Artículos y recursos para el discipulado cristiano.';
  if (Array.isArray(post.content)) {
    const firstParagraph = post.content.find(
      (el) => el.type === 'paragraph' && typeof el.text === 'string',
    );
    if (
      firstParagraph &&
      firstParagraph.type === 'paragraph' &&
      firstParagraph.text
    ) {
      // Limitar la descripción a 160 caracteres aprox.
      description = firstParagraph.text.slice(0, 160);
      if (firstParagraph.text.length > 160) description += '...';
    }
  }

  return {
    title: post.title,
    description,
    keywords: ['discipulado', 'cristianismo', 'recursos espirituales'],
    openGraph: {
      title: post.title,
      description,
      url: `/discipulado/${post.slug}`,
      siteName: 'zamr.app',
      images: [
        {
          url: post.image || '/images/posts/adorar-en-espiritu.avif',
          width: 1200,
          height: 628,
          alt: post.title,
        },
      ],
      locale: 'es_CR',
      type: 'article',
    },
  };
}
export default async function DiscipuladoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.find(
    (p) => p.slug === slug && p.category === 'discipulado',
  );
  const author = authors.find((a) => a.id === post?.authorId);

  if (!post) return notFound();

  return (
    <main className="mx-auto min-h-screen max-w-4xl bg-gradient-to-br from-brand-purple-50 via-white to-brand-pink-50 px-4 py-10 pb-20 dark:bg-gray-950 dark:bg-none">
      {/* Header Section with Gradient */}
      <div className="mb-8 text-center">
        <h1 className="mb-4 bg-gradient-to-r from-brand-purple-500 via-brand-pink-500 to-brand-blue-500 bg-clip-text text-4xl font-bold leading-tight text-transparent md:text-5xl">
          {post.title}
        </h1>
        <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-100">
          <span>📅</span>
          <p>
            {new Date(post.date).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Featured Image */}
      {post.image && (
        <div className="mb-10 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-slate-200 dark:ring-brand-purple-800">
          <Image
            src={post.image}
            alt={post.title}
            width={800}
            height={400}
            className="h-auto w-full object-cover"
          />
        </div>
      )}

      {/* Article Content */}
      <article className="rounded-2xl bg-white/80 p-6 shadow-xl ring-1 ring-slate-200 backdrop-blur-sm dark:bg-gray-950 dark:text-white dark:ring-slate-800 md:p-10">
        <ContentRenderer content={post.content} />
      </article>

      {/* Author Section */}
      {author && (
        <section className="mt-10 overflow-hidden rounded-2xl bg-slate-50/80 shadow-xl ring-1 ring-slate-200 backdrop-blur-sm dark:bg-gray-950 dark:ring-slate-800">
          <div className="p-6">
            <p className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-700 dark:text-white">
              <span>✍️</span>
              Acerca del autor
            </p>
            <div className="flex flex-col items-center gap-6 md:flex-row">
              {author.image && (
                <div className="flex-shrink-0">
                  <img
                    src={author.image}
                    alt={author.name}
                    loading="lazy"
                    className="h-24 w-24 rounded-full object-cover shadow-lg ring-4 ring-white"
                  />
                </div>
              )}
              <div className="flex-grow text-center md:text-left">
                <p className="mb-2 text-xl font-bold text-slate-800 dark:text-white">
                  {author.name}
                </p>
                {author.bio && (
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-100">
                    {author.bio}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer Info */}
      <div className="mt-10 rounded-xl bg-slate-50/80 p-6 shadow-md ring-1 ring-slate-200 backdrop-blur-sm dark:bg-gray-950 dark:ring-slate-800">
        <p className="flex items-center justify-center gap-2 text-center text-sm leading-relaxed text-slate-600 dark:text-slate-100">
          <LightBulbIcon className="h-5 w-5 text-brand-purple-500" />
          <span>
            Este artículo es parte de nuestra colección de recursos de
            discipulado. Si deseas contribuir o sugerir un tema,{' '}
            <span className="font-semibold text-brand-purple-500">
              contáctanos
            </span>
            .
          </span>
        </p>
      </div>
    </main>
  );
}
