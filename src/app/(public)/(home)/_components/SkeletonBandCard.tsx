import { Skeleton } from '@nextui-org/react';

export const SkeletonBandCard = () => {
  return (
    <div className="flex h-80 w-80 flex-col overflow-hidden rounded-md border border-gray-300 p-3">
      <Skeleton className="w-56 rounded-md">
        <div className="h-16"></div>
      </Skeleton>
      <Skeleton className="mt-1 w-64 rounded-md">
        <div className="h-8"></div>
      </Skeleton>
      <Skeleton className="mt-4 h-60 w-full rounded-md">
        <div className="h-60"></div>
      </Skeleton>
      <div className="flex h-28 gap-2">
        <Skeleton className="mt-4 h-10 w-1/4 rounded-md">
          <div className="h-full"></div>
        </Skeleton>
      </div>
    </div>
  );
};
