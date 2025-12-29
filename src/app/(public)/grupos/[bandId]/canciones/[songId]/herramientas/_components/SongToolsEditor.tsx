'use client';

import { Spinner } from '@heroui/react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@global/icons/ArrowLeftIcon';
import { UIGuard } from '@global/utils/UIGuard';
import { SongTools } from './SongTools';
import { getSongToolsData } from '../_services/getSongService';

interface SongToolsEditorProps {
  bandId: string;
  songId: string;
}

export const SongToolsEditor = ({ bandId, songId }: SongToolsEditorProps) => {
  // Fetch data client-side
  const { data: songData, isLoading } = getSongToolsData({ bandId, songId });

  return (
    <UIGuard
      isLoggedIn={true}
      checkBandId={Number(bandId)}
      isLoading={isLoading}
    >
      <div className="flex h-screen flex-col bg-gray-950 text-white">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-white/10 bg-black/40 px-6 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <Link
              href={`/grupos/${bandId}/canciones/${songId}`}
              className="flex items-center gap-2 text-white/70 hover:text-white"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Volver</span>
            </Link>
            <div className="h-6 w-px bg-white/10" />
            <h1 className="text-lg font-bold text-white">
              Herramientas:{' '}
              {isLoading ? (
                <Spinner size="sm" color="default" />
              ) : (
                <span className="text-brand-purple-400">{songData?.title}</span>
              )}
            </h1>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          <div className="flex h-full w-full flex-col p-4 md:p-6">
            <div className="flex-1 overflow-hidden rounded-2xl bg-black/20 ring-1 ring-white/5">
              {songData && <SongTools songData={songData} bandId={bandId} />}
            </div>
          </div>
        </div>
      </div>
    </UIGuard>
  );
};
