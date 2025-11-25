/* eslint-disable @next/next/no-img-element */
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { DeleteMusicIcon } from '@global/icons/DeleteMusicIcon';
import { getYouTubeThumbnail } from '@global/utils/formUtils';
import { PlayerToastProps } from '../../_interfaces/musicPlayerInterfaces';

export const PlayerToast = ({ selectedBeat }: PlayerToastProps) => {
    useEffect(() => {
        if (selectedBeat) {
            toast.custom(
                (t) => (
                    <div
                        className={`${t.visible ? 'animate-enter' : 'animate-leave'
                            } group pointer-events-auto relative mt-[3rem] flex flex-col rounded-lg bg-primario p-2 shadow-lg ring-1 ring-black ring-opacity-5`}
                    >
                        <button
                            onClick={() => toast.remove('beat-toast')}
                            className="invisible absolute right-2 top-2 m-0 flex h-4 w-4 items-center justify-center rounded-full bg-white p-1 text-center duration-200 group-hover:visible"
                        >
                            <DeleteMusicIcon className="text-danger-500" />
                        </button>
                        <div className="flex flex-col justify-center">
                            <img
                                src={getYouTubeThumbnail(
                                    selectedBeat?.youtubeLink,
                                    'mqdefault',
                                )}
                                alt={`imagen de ${selectedBeat.name}`}
                                className="h-[5rem] w-full rounded-xl object-cover"
                            />
                            <div className="flex flex-col items-baseline gap-1 py-1">
                                <h3 className="font-semibold text-secundario/80">
                                    {selectedBeat.name}
                                </h3>
                            </div>
                        </div>
                    </div>
                ),
                { id: 'beat-toast', duration: 5000, position: 'top-right' },
            );
        }

        return () => {
            toast.remove('beat-toast');
        };
    }, [selectedBeat]);

    return null;
};
