import React from 'react';
import { handleTranspose } from '../_utils/handleTranspose';
import { songTypes } from '@global/config/constants';
import { $selectedSongData } from '@stores/event';
import { useStore } from '@nanostores/react';

export const EventSimpleTitle = () => {
  const selectedSongData = useStore($selectedSongData);

  return (
    <div className="h-14 w-full">
      {selectedSongData && (
        <div className="mt-4 flex flex-col px-3">
          <h1 className="text-2xl">
            <span className="capitalize">{selectedSongData.song.title}</span>
            {selectedSongData.song.key &&
              ', ' +
                handleTranspose(
                  selectedSongData.song.key,
                  selectedSongData.transpose,
                )}{' '}
            -{' '}
            <span className="capitalize">
              {songTypes[selectedSongData.song.songType].es}
            </span>
          </h1>
        </div>
      )}
    </div>
  );
};
