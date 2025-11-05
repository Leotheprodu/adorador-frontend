'use client';

import { getBandsOfUser } from '@bands/_services/bandsService';
import { $user } from '@global/stores/users';
import { useStore } from '@nanostores/react';
import { useMemo } from 'react';
import { SkeletonBandCard } from './SkeletonBandCard';
import { BandCard } from './BandCard';

export const BandsShowCase = () => {
  const user = useStore($user);

  // Memoizar el estado de isLoggedIn para evitar re-renders innecesarios
  const isLoggedIn = useMemo(() => user.isLoggedIn, [user.isLoggedIn]);

  const { data, error, isLoading } = getBandsOfUser(isLoggedIn);

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
        <ul className="flex flex-wrap gap-3">
          {data.map((band) => (
            <li key={band.id} className="">
              <BandCard band={band} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
