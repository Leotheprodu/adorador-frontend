import { Button } from "@heroui/react";
import { PlayIcon } from '@global/icons';

interface YouTubeThumbnailProps {
    thumbnail: string;
    title?: string;
    artist?: string;
    onPlay: () => void;
}

export const YouTubeThumbnail = ({
    thumbnail,
    title,
    artist,
    onPlay,
}: YouTubeThumbnailProps) => {
    return (
        <div className="group relative flex aspect-video w-full cursor-pointer justify-center">
            <img
                src={thumbnail}
                alt={title || 'Video de YouTube'}
                className="object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Overlay oscuro */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Botón de play centrado */}
            <div className="absolute inset-0 flex items-center justify-center">
                <Button
                    isIconOnly
                    size="lg"
                    onClick={onPlay}
                    className="h-16 w-16 bg-brand-purple-600/90 text-white shadow-2xl backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-brand-purple-700 group-hover:h-20 group-hover:w-20"
                    aria-label="Reproducir video"
                >
                    <PlayIcon className="h-8 w-8" />
                </Button>
            </div>

            {/* Información del video */}
            {(title || artist) && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    {title && (
                        <p className="line-clamp-1 text-sm font-semibold text-white">
                            {title}
                        </p>
                    )}
                    {artist && (
                        <p className="line-clamp-1 text-xs text-white/80">{artist}</p>
                    )}
                </div>
            )}
        </div>
    );
};
