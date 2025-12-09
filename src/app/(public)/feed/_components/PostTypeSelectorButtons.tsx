'use client';

import { Button } from "@heroui/react";
import { MusicalNoteIcon, HandsIcon } from '@global/icons';
import { PostType } from '../_interfaces/feedInterface';

interface PostTypeSelectorButtonsProps {
    postType: PostType;
    onPostTypeChange: (type: PostType) => void;
}

export const PostTypeSelectorButtons = ({
    postType,
    onPostTypeChange,
}: PostTypeSelectorButtonsProps) => {
    return (
        <div className="flex gap-2">
            <Button
                color={postType === 'SONG_SHARE' ? 'success' : 'default'}
                variant={postType === 'SONG_SHARE' ? 'shadow' : 'bordered'}
                onPress={() => onPostTypeChange('SONG_SHARE')}
                size="sm"
                className={`flex-1 transition-all duration-200 ${postType === 'SONG_SHARE'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                        : 'border-green-200 bg-white text-green-600 hover:bg-green-50 dark:border-green-700 dark:bg-default-100 dark:text-green-400 dark:hover:bg-green-900/20'
                    }`}
                startContent={<MusicalNoteIcon className="h-4 w-4" />}
            >
                Compartir Canción
            </Button>
            <Button
                color={postType === 'SONG_REQUEST' ? 'warning' : 'default'}
                variant={postType === 'SONG_REQUEST' ? 'shadow' : 'bordered'}
                onPress={() => onPostTypeChange('SONG_REQUEST')}
                size="sm"
                className={`flex-1 transition-all duration-200 ${postType === 'SONG_REQUEST'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                        : 'border-amber-200 bg-white text-amber-600 hover:bg-amber-50 dark:border-amber-700 dark:bg-default-100 dark:text-amber-400 dark:hover:bg-amber-900/20'
                    }`}
                startContent={<HandsIcon className="h-4 w-4" />}
            >
                Solicitar Canción
            </Button>
        </div>
    );
};
