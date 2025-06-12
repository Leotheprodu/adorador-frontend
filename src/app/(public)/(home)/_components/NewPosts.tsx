import { posts } from '@global/content/posts';
import Image from 'next/image';

export const NewPosts = () => {
  const lastsPosts = posts.slice(0, 3);
  // Extraer la descripción del primer párrafo del contenido

  return (
    <div className="flex h-full flex-col">
      <h1 className="my-12 text-3xl">Últimas Publicaciones:</h1>
      <ul className="flex flex-col gap-4">
        {lastsPosts.map((post) => (
          <li key={post.id} className="w-60 border-b pb-2">
            <Image
              src={post.image || '/images/posts/adorar-en-espiritu.avif'}
              alt={post.title}
              width={600}
              height={400}
              className="mb-2 h-48 w-full rounded-md object-cover shadow-md"
            />
            <h2 className="text-xl font-bold">{post.title}</h2>
            <p className="text-gray-600">
              {(() => {
                const paragraph = post.content.find(
                  (el) =>
                    el.type === 'paragraph' && typeof el.text === 'string',
                );
                return paragraph &&
                  paragraph.type === 'paragraph' &&
                  typeof paragraph.text === 'string'
                  ? paragraph.text.slice(0, 160) +
                      (paragraph.text.length > 160 ? '... ' : '')
                  : '';
              })()}
              <a
                href={`/${post.category}/${post.slug}`}
                className="text-blue-500 hover:underline"
              >
                Leer más
              </a>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};
