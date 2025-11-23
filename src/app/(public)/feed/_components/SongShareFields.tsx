'use client';

import { Select, SelectItem } from '@nextui-org/react';

interface SongShareFieldsProps {
    sharedSongId: string;
    bandSongs: Array<{ id: number; title: string; artist: string | null }>;
    selectedSongInfo: { title: string; artist: string | null } | null;
    onSongChange: (songId: string) => void;
}

export const SongShareFields = ({
    sharedSongId,
    bandSongs,
    selectedSongInfo,
    onSongChange,
}: SongShareFieldsProps) => {
    return (
        <div className="rounded-lg border border-green-200 bg-white/80 p-3 backdrop-blur-sm dark:border-green-800 dark:bg-default-100/80">
            <Select
                label="Canción a compartir"
                placeholder="Selecciona una canción"
                selectedKeys={sharedSongId ? [sharedSongId] : []}
                onSelectionChange={(keys) => {
                    const selectedValue = Array.from(keys).join('');
                    onSongChange(selectedValue);
                }}
                isRequired
                size="sm"
                classNames={{
                    trigger:
                        'min-h-unit-10 bg-white border-green-200 hover:border-green-300 dark:bg-default-100 dark:border-green-700 dark:hover:border-green-600',
                    label: 'text-green-700 font-medium dark:text-green-400',
                }}
                renderValue={() => {
                    return selectedSongInfo ? (
                        <div className="flex flex-col py-1">
                            <span className="text-sm font-medium text-green-800 dark:text-green-300">
                                {selectedSongInfo.title}
                            </span>
                            {selectedSongInfo.artist && (
                                <span className="text-xs text-green-600 dark:text-green-400">
                                    {selectedSongInfo.artist}
                                </span>
                            )}
                        </div>
                    ) : (
                        <span className="text-foreground-500">Selecciona una canción</span>
                    );
                }}
            >
                {bandSongs.map((song) => (
                    <SelectItem key={song.id.toString()} textValue={song.title}>
                        <div className="flex flex-col">
                            <span className="font-semibold">{song.title}</span>
                            {song.artist && (
                                <span className="text-small text-foreground-500">
                                    {song.artist}
                                </span>
                            )}
                        </div>
                    </SelectItem>
                ))}
            </Select>
        </div>
    );
};
