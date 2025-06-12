/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { posts } from '@global/content/posts';
import ContentRenderer from './_components/ContentRenderer';
import Image from 'next/image';
import { authors } from '@global/content/authors';
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = posts.find(
    (p) => p.slug === params.slug && p.category === 'discipulado',
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
      siteName: 'adorador.xyz',
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
export default function DiscipuladoPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = posts.find(
    (p) => p.slug === params.slug && p.category === 'discipulado',
  );
  const author = authors.find((a) => a.id === post?.authorId);

  if (!post) return notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 pb-20">
      <h1 className="mb-2 text-3xl font-bold">{post.title}</h1>
      <p className="mb-6 text-sm text-gray-500">
        Publicado el {new Date(post.date).toLocaleDateString('es-ES')}
      </p>
      {post.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <Image
          src={post.image}
          alt={post.title}
          width={600}
          height={300}
          objectFit="cover"
          objectPosition="center"
          className="mb-6 rounded-xl shadow-md"
        />
      )}
      <ContentRenderer content={post.content} />

      {author && (
        <section className="my-6 rounded-lg bg-gray-50 p-4 shadow-sm">
          <p className="mb-3 text-base text-gray-500">Acerca del autor:</p>
          <div className="flex flex-col items-center gap-4 md:flex-row">
            {author.image && (
              <div className="flex w-1/6 items-center justify-center">
                <img
                  src={author.image}
                  alt={author.name}
                  loading="lazy"
                  className="m-0 h-20 w-20 rounded-full object-contain p-0 shadow-lg"
                />
              </div>
            )}
            <div className="w-5/6">
              <p className="font-semibold">{author.name}</p>
              {author.bio && (
                <p className="text-xs text-gray-600">{author.bio}</p>
              )}
            </div>
          </div>
        </section>
      )}
      <div className="mt-10 border-t pt-6 text-sm text-gray-500">
        <p>
          Este artículo es parte de nuestra colección de recursos de
          discipulado. Si deseas contribuir o sugerir un tema, contáctanos.
        </p>
      </div>
    </main>
  );
}
