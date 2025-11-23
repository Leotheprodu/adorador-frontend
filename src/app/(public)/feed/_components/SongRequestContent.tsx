'use client';

import { Chip } from '@nextui-org/react';
import { FeedYouTubePlayer } from './FeedYouTubePlayer';

interface SongRequestContentProps {
    postId: number;
    requestedSongTitle: string | null;
    requestedArtist: string | null;
    requestedYoutubeUrl: string | null;
}

export const SongRequestContent = ({
    postId,
    requestedSongTitle,
    requestedArtist,
    requestedYoutubeUrl,
}: SongRequestContentProps) => {
    return (
        <div className="mb-3">
            {/* Card de solicitud de canción */}
            <div className="mb-3 rounded-lg border border-divider bg-content2 p-3">
                <div className="mb-2">
                    <Chip size="sm" variant="flat" color="warning">
                        Solicitud
                    </Chip>
                </div>
                <p className="text-sm font-semibold text-foreground">
                    {requestedSongTitle}
                </p>
                {requestedArtist && (
                    <p className="text-sm text-foreground-500">{requestedArtist}</p>
                )}
            </div>

            {/* Reproductor de YouTube si existe */}
            {requestedYoutubeUrl && (
                <FeedYouTubePlayer
                    youtubeUrl={requestedYoutubeUrl}
                    postId={postId}
                    title={requestedSongTitle || undefined}
                    artist={requestedArtist || undefined}
                />
            )}
        </div>
    );
};
