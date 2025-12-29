import { useState, useMemo, useEffect } from 'react';
import { SongProps } from '@bands/[bandId]/canciones/_interfaces/songsInterface';

import { syncGlobalPlaylist } from '@global/utils/playlistUtils';
import { songTypes } from '@global/config/constants';

type SongTypeFilter = 'all' | 'worship' | 'praise';

export const useSongsFilter = (
  songs: SongProps[] | undefined,
  bandId?: string,
) => {
  const [typeFilter, setTypeFilter] = useState<SongTypeFilter>('all');

  // Update playlist when songs change
  useEffect(() => {
    syncGlobalPlaylist(songs, true, bandId);
  }, [songs, bandId]);

  const filterPredicate = useMemo(() => {
    return (song: SongProps) => {
      if (typeFilter !== 'all') {
        return song.songType === typeFilter;
      }
      return true;
    };
  }, [typeFilter]);

  const sortComparator = useMemo(() => {
    return (a: SongProps, b: SongProps) => {
      return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
    };
  }, []);

  const getSearchFields = (song: SongProps) => [
    song.title,
    song.artist || '',
    song.key || '',
    songTypes[song.songType]?.es || '',
  ];

  return {
    typeFilter,
    setTypeFilter,
    filterPredicate,
    sortComparator,
    getSearchFields,
  };
};
