'use client';

import { Chip } from "@heroui/react";
import { FeedYouTubePlayer } from './FeedYouTubePlayer';
import { SongRequestContentProps } from './_interfaces/postCardInterfaces';

export const SongRequestContent = ({
    postId,
    requestedSongTitle,
    requestedArtist,
    requestedYoutubeUrl,
}: SongRequestContentProps) => {
    return (
        <div className="mb-3">
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

            {requestedYoutubeUrl && (
                <FeedYouTubePlayer
                    youtubeUrl={requestedYoutubeUrl}
                    postId={postId}
                />
            )}
        </div>
    );
};
