import { posts } from '@global/content/posts';
import Image from 'next/image';
import Link from 'next/link';
import { SecondaryButton } from '@global/components/buttons';

export const ResourcesSection = () => {
  const lastsPosts = posts.slice(0, 3);

  return (
    <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Recursos para tu{' '}
            <span className="text-gradient-simple">crecimiento espiritual</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Artículos y recursos para fortalecer tu ministerio de alabanza
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {lastsPosts.map((post) => (
            <Link
              key={post.id}
              href={`/${post.category}/${post.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-200 transition-all hover:scale-105 hover:shadow-2xl active:scale-100"
            >
              {/* Image Container with Gradient Overlay */}
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={post.image || '/images/posts/adorar-en-espiritu.avif'}
                  alt={post.title}
                  width={400}
                  height={192}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="flex flex-grow flex-col p-6">
                <h3 className="mb-3 text-xl font-bold text-slate-800 transition-colors group-hover:text-brand-purple-500">
                  {post.title}
                </h3>
                <p className="mb-4 flex-grow text-sm text-slate-600">
                  {(() => {
                    const paragraph = post.content.find(
                      (el) =>
                        el.type === 'paragraph' && typeof el.text === 'string',
                    );
                    return paragraph &&
                      paragraph.type === 'paragraph' &&
                      typeof paragraph.text === 'string'
                      ? paragraph.text.slice(0, 120) +
                          (paragraph.text.length > 120 ? '...' : '')
                      : '';
                  })()}
                </p>
                <div className="mt-auto flex items-center gap-2 text-sm text-slate-500">
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

              {/* Hover Indicator */}
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-brand-purple-500 via-brand-pink-500 to-brand-blue-500 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* View All Link */}
        <div className="mt-12 text-center">
          <SecondaryButton
            href="/discipulado"
            className="border-brand-purple-600 text-brand-purple-600 hover:bg-brand-purple-600 hover:text-white"
            endContent={<span className="text-lg">→</span>}
          >
            Ver todos los recursos
          </SecondaryButton>
        </div>
      </div>
    </section>
  );
};
