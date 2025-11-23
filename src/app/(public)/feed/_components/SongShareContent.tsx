'use client';

import { Button, Chip, Tooltip } from '@nextui-org/react';
import { DownloadIcon } from '@global/icons';
import { FeedYouTubePlayer } from './FeedYouTubePlayer';
import { SongShareContentProps } from './_interfaces/postCardInterfaces';

export const SongShareContent = ({
    postId,
    song,
    onViewSong,
    onCopySong,
}: SongShareContentProps) => {
    return (
        <div className="mb-3">
            {song.youtubeLink && (
                <div className="mb-3 w-full">
                    <FeedYouTubePlayer
                        youtubeUrl={song.youtubeLink}
                        postId={postId}
                        title={song.title}
                        artist={song.artist || undefined}
                    />
                </div>
            )}

            <Tooltip content="Click para ver letra y acordes" delay={300} closeDelay={0}>
                <div
                    className="group cursor-pointer rounded-lg border border-divider bg-content2 p-4 transition-all hover:border-primary hover:bg-content3 dark:hover:bg-content4"
                    onClick={() => onViewSong && onViewSong(postId)}
                >
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 space-y-2">
                            <div>
                                <h3 className="text-base font-semibold text-foreground">
                                    {song.title}
                                </h3>
                                {song.artist && (
                                    <p className="text-sm text-foreground-500">{song.artist}</p>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {song.key && (
                                    <Chip size="sm" variant="flat">
                                        {song.key}
                                    </Chip>
                                )}
                                {song.tempo && (
                                    <Chip size="sm" variant="flat">
                                        {song.tempo} BPM
                                    </Chip>
                                )}
                                <Chip
                                    size="sm"
                                    variant="flat"
                                    color={song.songType === 'worship' ? 'primary' : 'secondary'}
                                >
                                    {song.songType === 'worship' ? 'Adoración' : 'Alabanza'}
                                </Chip>
                            </div>
                        </div>

                        {onCopySong && (
                            <div onClick={(e) => e.stopPropagation()}>
                                <Tooltip content="Copiar canción">
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="flat"
                                        color="primary"
                                        onPress={() => onCopySong(postId)}
                                        aria-label="Copiar canción"
                                    >
                                        <DownloadIcon className="h-4 w-4" />
                                    </Button>
                                </Tooltip>
                            </div>
                        )}
                    </div>
                </div>
            </Tooltip>
        </div>
    );
};
