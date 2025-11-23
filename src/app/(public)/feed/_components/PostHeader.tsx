'use client';

import { Avatar, Chip } from '@nextui-org/react';

interface PostHeaderProps {
    authorName: string;
    bandName: string;
    isSongShare: boolean;
}

export const PostHeader = ({
    authorName,
    bandName,
    isSongShare,
}: PostHeaderProps) => {
    return (
        <div className="flex items-center justify-between">
            <div className="flex gap-3">
                <Avatar name={authorName} size="md" className="flex-shrink-0" />
                <div className="flex flex-col gap-1">
                    <h4 className="text-small font-semibold leading-none text-foreground-600">
                        {authorName}
                    </h4>
                    <h5 className="text-small tracking-tight text-foreground-400">
                        {bandName}
                    </h5>
                </div>
            </div>
            <Chip
                size="sm"
                variant="flat"
                color={isSongShare ? 'success' : 'warning'}
            >
                {isSongShare ? '🎵 Compartir' : '🙏 Solicitar'}
            </Chip>
        </div>
    );
};
