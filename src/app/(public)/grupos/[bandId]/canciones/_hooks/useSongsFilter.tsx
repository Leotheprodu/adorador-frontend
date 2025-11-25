import { useState, useMemo, useEffect } from 'react';
import { SongProps } from '@bands/[bandId]/canciones/_interfaces/songInterface';
import { $PlayList } from '@stores/player';
import { songTypes } from '@global/config/constants';

type SongTypeFilter = 'all' | 'worship' | 'praise';

export const useSongsFilter = (songs: SongProps[] | undefined) => {
    const [typeFilter, setTypeFilter] = useState<SongTypeFilter>('all');

    // Update playlist when songs change
    useEffect(() => {
        const songsWithYoutubeLink = songs?.filter((song) => song.youtubeLink);

        if (songsWithYoutubeLink && songsWithYoutubeLink.length > 0) {
            const songsToPlaylists = songsWithYoutubeLink.map((song) => ({
                id: song.id,
                youtubeLink: song.youtubeLink,
                name: song.title,
            }));
            $PlayList.set(
                songsToPlaylists.sort((a, b) => a.name.localeCompare(b.name)),
            );
        }
    }, [songs]);

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
