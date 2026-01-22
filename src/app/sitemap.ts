import { MetadataRoute } from 'next';
import { domain, Server1API } from '@global/config/constants';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = ['', '/precios', '/auth/login', '/auth/sign-up'].map(
    (route) => ({
      url: `${domain}${route}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: route === '' ? 1 : 0.8,
    }),
  );

  try {
    const response = await fetch(`${Server1API}/bands`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    interface Band {
      id: number;
      name: string;
    }

    const responseData = await response.json();
    const bands: Band[] = Array.isArray(responseData)
      ? responseData
      : responseData?.data || [];

    const bandRoutes = bands.map((band: Band) => ({
      url: `${domain}/grupos/${band.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    const songsPromises = bands.map(async (band) => {
      try {
        const songsResponse = await fetch(
          `${Server1API}/bands/${band.id}/songs`,
          {
            next: { revalidate: 3600 },
          },
        );
        const songsData = await songsResponse.json();
        const songs: { id: number }[] = Array.isArray(songsData)
          ? songsData
          : songsData?.data || [];

        return songs.map((song) => ({
          url: `${domain}/grupos/${band.id}/canciones/${song.id}`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }));
      } catch (error) {
        console.error(
          `Error fetching songs for band ${band.id} in sitemap:`,
          error,
        );
        return [];
      }
    });

    const songRoutes = (await Promise.all(songsPromises)).flat();

    return [...routes, ...bandRoutes, ...songRoutes];
  } catch (error) {
    console.error('Error fetching bands for sitemap:', error);
    return routes;
  }
}
