'use client';

import { getChurches } from '@iglesias/_services/churchesService';
import { ChurchCard } from '@home/_components/ChurchCard';
import { SkeletonChurchCard } from '@home/_components/SkeletonChurchCard';

export const ChurchesShowCase = () => {
  const { data, error, isLoading } = getChurches();

  return (
    <div>
      {error && <div>Error: {error.message}</div>}
      {isLoading && (
        <div className="flex flex-wrap justify-center gap-3">
          <SkeletonChurchCard />
          <SkeletonChurchCard />
          <SkeletonChurchCard />
        </div>
      )}
      {data && (
        <ul className="flex flex-wrap justify-center gap-3">
          {data.map((church) => (
            <li key={church.id} className="">
              <ChurchCard church={church} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
