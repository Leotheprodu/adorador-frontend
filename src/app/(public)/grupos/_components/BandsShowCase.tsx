'use client';

import { getBandsOfUser } from '@bands/_services/bandsService';
import { $user } from '@global/stores/users';
import { useStore } from '@nanostores/react';
import { useMemo, useState, useEffect } from 'react';
import { SkeletonBandCard } from './SkeletonBandCard';
import { BandCard } from './BandCard';
import { BandTable } from './BandTable';
import { useAllBandSongsWebSocket } from '@global/hooks/useAllBandSongsWebSocket';

export const BandsShowCase = () => {
  const user = useStore($user);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Memoizar el estado de isLoggedIn para evitar re-renders innecesarios
  const isLoggedIn = useMemo(() => user.isLoggedIn, [user.isLoggedIn]);

  const { data, error, isLoading } = getBandsOfUser(isLoggedIn);

  // Obtener IDs de todas las bandas para escuchar sus eventos
  const bandIds = useMemo(() => {
    return data?.map((band) => band.id) ?? [];
  }, [data]);

  // Escuchar eventos de WebSocket de todas las bandas del usuario
  useAllBandSongsWebSocket({
    bandIds,
    enabled: isLoggedIn && bandIds.length > 0,
  });

  // Don't render conditional content until mounted to avoid hydration mismatch
  if (!mounted) {
    return <div className="h-full" />;
  }

  return (
    <div className="h-full">
      {error && (
        <div>
          {' '}
          <p>Aún no estas en un grupo de alabanza</p>
        </div>
      )}
      {isLoading && (
        <div className="flex flex-wrap justify-center gap-3">
          <SkeletonBandCard />
          <SkeletonBandCard />
          <SkeletonBandCard />
        </div>
      )}
      {data && (
        <div className="flex flex-col gap-6">
          <div className="hidden xl:block">
            <BandTable bands={data} />
          </div>
          <ul className="flex flex-wrap justify-center gap-3 xl:hidden">
            {data.map((band) => (
              <li key={band.id} className="">
                <BandCard band={band} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
