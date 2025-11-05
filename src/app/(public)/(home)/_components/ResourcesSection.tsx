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
              className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-all hover:shadow-2xl"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={post.image || '/images/posts/adorar-en-espiritu.avif'}
                  alt={post.title}
                  width={600}
                  height={400}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="group-hover:text-brand-purple-600 mb-3 text-xl font-bold text-gray-900 transition-colors">
                  {post.title}
                </h3>
                <p className="mb-4 text-gray-600">
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
                <span className="text-brand-purple-600 inline-flex items-center gap-2 transition-all group-hover:gap-3">
                  Leer más
                  <span className="text-lg">→</span>
                </span>
              </div>
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
