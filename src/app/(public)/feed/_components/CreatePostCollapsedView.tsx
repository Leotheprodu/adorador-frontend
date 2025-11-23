'use client';

import { Avatar, Button, Tooltip } from '@nextui-org/react';
import { MusicalNoteIcon, HandsIcon } from '@global/icons';
import { PostType } from '../_interfaces/feedInterface';

interface CreatePostCollapsedViewProps {
    userName: string;
    onExpand: () => void;
    onExpandWithType: (type: PostType) => void;
}

export const CreatePostCollapsedView = ({
    userName,
    onExpand,
    onExpandWithType,
}: CreatePostCollapsedViewProps) => {
    return (
        <div className="p-4">
            <div
                className="flex cursor-pointer items-center gap-3 rounded-xl p-3 transition-all duration-200 hover:bg-default-100 dark:hover:bg-default-200"
                onClick={onExpand}
            >
                <Avatar
                    size="md"
                    name={userName}
                    className="flex-shrink-0 ring-2 ring-brand-purple-100 dark:ring-brand-purple-300"
                    classNames={{
                        base: 'bg-gradient-to-br from-brand-purple-400 to-brand-pink-400',
                    }}
                />
                <div className="flex min-h-[44px] flex-1 items-center rounded-full border border-default-200 bg-gradient-to-r from-default-100 to-default-50 px-4 text-foreground-500 transition-all duration-200 hover:border-brand-purple-200 hover:from-default-200 hover:to-default-100 hover:shadow-sm dark:border-default-300 dark:from-default-200 dark:to-default-100 dark:hover:border-brand-purple-300 dark:hover:from-default-300 dark:hover:to-default-200">
                    <span className="font-medium">
                        ¿Qué canción quieres compartir hoy?
                    </span>
                </div>
                <div className="flex gap-1">
                    <Tooltip content="Compartir canción">
                        <Button
                            isIconOnly
                            variant="flat"
                            color="success"
                            size="sm"
                            aria-label="Compartir canción"
                            onPress={() => onExpandWithType('SONG_SHARE')}
                            className="border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 dark:border-green-700 dark:from-green-900/30 dark:to-emerald-900/30 dark:hover:from-green-800/40 dark:hover:to-emerald-800/40"
                        >
                            <MusicalNoteIcon className="h-4 w-4" />
                        </Button>
                    </Tooltip>
                    <Tooltip content="Solicitar canción">
                        <Button
                            isIconOnly
                            variant="flat"
                            color="warning"
                            size="sm"
                            aria-label="Solicitar canción"
                            onPress={() => onExpandWithType('SONG_REQUEST')}
                            className="border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 dark:border-amber-700 dark:from-amber-900/30 dark:to-orange-900/30 dark:hover:from-amber-800/40 dark:hover:to-orange-800/40"
                        >
                            <HandsIcon className="h-4 w-4" />
                        </Button>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
};
