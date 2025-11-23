'use client';

import { Button } from '@nextui-org/react';
import { ChatIcon, DownloadIcon } from '@global/icons';
import { BlessingButton } from './BlessingButton';

interface PostFooterProps {
    isBlessed: boolean;
    blessingCount: number;
    commentCount: number;
    songCopyCount?: number;
    isSongShare: boolean;
    onToggleBlessing: () => void;
    onToggleComments: () => void;
    isBlessingLoading: boolean;
}

export const PostFooter = ({
    isBlessed,
    blessingCount,
    commentCount,
    songCopyCount,
    isSongShare,
    onToggleBlessing,
    onToggleComments,
    isBlessingLoading,
}: PostFooterProps) => {
    return (
        <div className="flex items-center gap-3">
            {/* Botón de Blessing */}
            <BlessingButton
                isBlessed={isBlessed}
                count={blessingCount}
                onPress={onToggleBlessing}
                isLoading={isBlessingLoading}
            />

            {/* Botón de Comentarios */}
            <Button
                size="sm"
                variant="light"
                startContent={<ChatIcon className="h-5 w-5" />}
                onPress={onToggleComments}
            >
                {commentCount}
            </Button>

            {/* Contador de copias */}
            {isSongShare && songCopyCount && songCopyCount > 0 && (
                <div className="flex items-center gap-1 text-small text-foreground-500">
                    <DownloadIcon className="h-4 w-4" />
                    <span>{songCopyCount}</span>
                </div>
            )}
        </div>
    );
};
