'use client';

import { Input } from "@heroui/react";
import { YoutubeIcon } from '@global/icons';
import { isValidYouTubeId } from '@global/utils/formUtils';

interface SongRequestFieldsProps {
    requestedSongTitle: string;
    requestedSongArtist: string;
    requestedYoutubeUrl: string;
    onTitleChange: (value: string) => void;
    onArtistChange: (value: string) => void;
    onYoutubeChange: (value: string) => void;
    onYoutubeClear: () => void;
}

export const SongRequestFields = ({
    requestedSongTitle,
    requestedSongArtist,
    requestedYoutubeUrl,
    onTitleChange,
    onArtistChange,
    onYoutubeChange,
    onYoutubeClear,
}: SongRequestFieldsProps) => {
    return (
        <div className="space-y-3 rounded-lg border border-amber-200 bg-white/80 p-3 backdrop-blur-sm dark:border-amber-800 dark:bg-default-100/80">
            <Input
                label="Título de la canción"
                placeholder="Ej: Aquí Estoy"
                value={requestedSongTitle}
                onValueChange={onTitleChange}
                isRequired
                size="sm"
                classNames={{
                    inputWrapper:
                        'bg-white border-amber-200 hover:border-amber-300 dark:bg-default-100 dark:border-amber-700 dark:hover:border-amber-600',
                    label: 'text-amber-700 font-medium dark:text-amber-400',
                }}
            />
            <Input
                label="Artista (opcional)"
                placeholder="Ej: Hillsong United"
                value={requestedSongArtist}
                onValueChange={onArtistChange}
                size="sm"
                classNames={{
                    inputWrapper:
                        'bg-white border-amber-200 hover:border-amber-300 dark:bg-default-100 dark:border-amber-700 dark:hover:border-amber-600',
                    label: 'text-amber-700 font-medium dark:text-amber-400',
                }}
            />
            <Input
                label="Link de YouTube (opcional)"
                placeholder="https://youtube.com/watch?v=... o dQw4w9WgXcQ"
                value={requestedYoutubeUrl}
                onValueChange={onYoutubeChange}
                isClearable
                onClear={onYoutubeClear}
                size="sm"
                description={
                    requestedYoutubeUrl && isValidYouTubeId(requestedYoutubeUrl)
                        ? '✓ ID válido'
                        : 'Pega el link completo o solo el ID del video'
                }
                classNames={{
                    inputWrapper:
                        'bg-white border-amber-200 hover:border-amber-300 dark:bg-default-100 dark:border-amber-700 dark:hover:border-amber-600',
                    label: 'text-amber-700 font-medium dark:text-amber-400',
                    description:
                        requestedYoutubeUrl && isValidYouTubeId(requestedYoutubeUrl)
                            ? 'text-green-600 font-medium dark:text-green-400'
                            : 'text-foreground-500',
                }}
                startContent={<YoutubeIcon className="h-4 w-4 text-red-500" />}
            />
        </div>
    );
};
