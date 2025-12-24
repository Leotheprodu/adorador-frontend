import { JsonLd } from '@global/components/SEO/JsonLd';
import { SongIdMainPage } from './_components/SongIdMainPage';
import { Server1API } from '@global/config/constants';
import { Metadata } from 'next';
import { SongSEOProps } from '../_interfaces/songsInterface';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ bandId: string; songId: string }>;
}): Promise<Metadata> {
  const { bandId, songId } = await params;

  try {
    const response = await fetch(
      `${Server1API}/bands/${bandId}/songs/${songId}/seo`,
      {
        next: { revalidate: 3600 },
      },
    );
    const song: SongSEOProps | null = await response.json();

    if (!song || !song.title) {
      throw new Error('Song not found');
    }
    const videoId = song.youtubeLink ? song.youtubeLink : null;
    const ogImage = videoId
      ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      : undefined;

    return {
      title: `${song.title} - ${song.artist || 'Canción'}`,
      description: `Letra, acordes y herramientas para la canción ${song.title} de ${song.artist || 'Zamr'}.`,
      openGraph: {
        title: `${song.title} | Zamr`,
        description: `Visualiza los acordes y estructura de ${song.title}.`,
        images: ogImage ? [{ url: ogImage }] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: `${song.title} | Zamr`,
        description: `Visualiza los acordes y estructura de ${song.title}.`,
        images: ogImage ? [ogImage] : undefined,
      },
    };
  } catch {
    return {
      title: 'Canción - Zamr',
      description: 'Detalles de la canción en Zamr.',
    };
  }
}

export default async function SongsById({
  params,
}: {
  params: Promise<{ bandId: string; songId: string }>;
}) {
  const resolvedParams = await params;

  // Fetch song for structured data
  let songData: SongSEOProps | null = null;
  try {
    const response = await fetch(
      `${Server1API}/bands/${resolvedParams.bandId}/songs/${resolvedParams.songId}/seo`,
      {
        next: { revalidate: 3600 },
      },
    );
    songData = await response.json();
  } catch {
    // Ignore error for schema
  }

  const songSchema = songData
    ? {
        '@context': 'https://schema.org',
        '@type': 'MusicComposition',
        name: songData.title,
        composer: {
          '@type': 'Person',
          name: songData.artist || 'Desconocido',
        },
        genre: 'Worship',
      }
    : null;

  return (
    <div className="flex h-full min-h-screen flex-col items-center bg-gradient-to-br from-slate-50 via-white to-brand-purple-50/20 px-4 py-8 pb-20 dark:bg-gray-950 dark:bg-none sm:px-6 sm:py-12">
      {songSchema && <JsonLd data={songSchema} />}
      <section className="w-full max-w-7xl">
        <SongIdMainPage params={resolvedParams} />
      </section>
    </div>
  );
}
