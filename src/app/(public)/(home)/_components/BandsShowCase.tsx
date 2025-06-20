'use client';

import { getBandsOfUser } from '@bands/_services/bandsService';
import { BandCard } from './BandCard';
import { SkeletonBandCard } from './SkeletonBandCard';

export const BandsShowCase = () => {
  const { data, error, isLoading } = getBandsOfUser();
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
