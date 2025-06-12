'use client';

import { getChurches } from '@app/(public)/grupos/_services/churchesService';
import { ChurchCard } from '@home/_components/ChurchCard';
import { SkeletonChurchCard } from '@home/_components/SkeletonChurchCard';

export const ChurchesShowCase = () => {
  const { data, error, isLoading } = getChurches();

  return (
    <div className="h-full">
      {error && <div>Error: {error.message}</div>}
      {isLoading && (
        <div className="flex flex-wrap justify-center gap-3">
          <SkeletonChurchCard />
          <SkeletonChurchCard />
          <SkeletonChurchCard />
        </div>
      )}
      {data && (
        <ul className="flex flex-wrap gap-3">
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
