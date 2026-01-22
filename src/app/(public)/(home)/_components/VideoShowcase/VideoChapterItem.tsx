'use client';

import { VideoChapterItemProps } from '../../_interfaces/videoShowcase.interfaces';

export const VideoChapterItem = ({
  id,
  label,
  timestamp,
  seconds,
  desc,
  isActive,
  onClick,
}: VideoChapterItemProps) => {
  const containerClasses = isActive
    ? 'scale-[1.02] border-indigo-100 bg-white shadow-lg dark:border-indigo-900/50 dark:bg-gray-800'
    : 'border-gray-100 bg-white/50 hover:bg-white hover:shadow-md dark:border-gray-800 dark:bg-gray-900/50 dark:hover:bg-gray-800';

  const badgeClasses = isActive
    ? 'bg-indigo-600 text-white'
    : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400';

  const titleClasses = isActive
    ? 'text-indigo-900 dark:text-indigo-100'
    : 'text-gray-900 dark:text-gray-200';

  return (
    <button
      onClick={() => onClick(seconds, id)}
      className={`w-full rounded-xl border border-transparent p-4 text-left transition-all duration-300 ${containerClasses}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${badgeClasses}`}
        >
          {timestamp}
        </div>
        <div>
          <h3 className={`text-sm font-semibold ${titleClasses}`}>{label}</h3>
          <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
            {desc}
          </p>
        </div>
      </div>
    </button>
  );
};
